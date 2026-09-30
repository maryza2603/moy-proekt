package ru.luminoso.flapp

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.webkit.CookieManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.Data
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.TimeUnit

/**
 * Раз в 15 минут (минимум, который разрешает Android) заходит на FL.ru
 * с куками из приложения и ищет счётчики непрочитанного.
 * Если число выросло - показывает уведомление.
 */
class NotifyWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val cookies = CookieManager.getInstance().getCookie(MainActivity.HOME)
            ?: return@withContext Result.success()

        val html = try {
            fetch(MainActivity.HOME, cookies)
        } catch (e: Exception) {
            return@withContext Result.retry()
        }

        val count = UnreadParser.count(html) ?: return@withContext Result.success()
        val prefs = applicationContext.getSharedPreferences("state", Context.MODE_PRIVATE)
        val last = prefs.getInt(KEY_LAST, 0)
        prefs.edit().putInt(KEY_LAST, count).apply()

        val silent = inputData.getBoolean(KEY_SILENT, false)
        if (!silent && count > last) notify(count)
        if (count == 0) clearNotification(applicationContext)
        Result.success()
    }

    private fun fetch(url: String, cookies: String): String {
        val conn = URL(url).openConnection() as HttpURLConnection
        conn.connectTimeout = 15000
        conn.readTimeout = 15000
        conn.setRequestProperty("Cookie", cookies)
        conn.setRequestProperty(
            "User-Agent",
            "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36"
        )
        return conn.inputStream.bufferedReader().use { it.readText() }.also { conn.disconnect() }
    }

    private fun notify(count: Int) {
        val ctx = applicationContext
        val nm = ctx.getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(
            NotificationChannel(CHANNEL, "Уведомления FL.ru", NotificationManager.IMPORTANCE_HIGH)
        )
        val intent = Intent(ctx, MainActivity::class.java)
            .putExtra(EXTRA_URL, MainActivity.HOME)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pi = PendingIntent.getActivity(
            ctx, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val n = NotificationCompat.Builder(ctx, CHANNEL)
            .setSmallIcon(R.drawable.ic_notify)
            .setContentTitle("Новое на FL.ru")
            .setContentText("Непрочитанных: $count. Нажмите, чтобы открыть")
            .setNumber(count)
            .setAutoCancel(true)
            .setContentIntent(pi)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        try {
            NotificationManagerCompat.from(ctx).notify(NOTIF_ID, n)
        } catch (_: SecurityException) {
            // Уведомления запрещены в настройках телефона
        }
    }

    companion object {
        const val EXTRA_URL = "url"
        private const val CHANNEL = "fl_events"
        private const val NOTIF_ID = 1
        private const val KEY_LAST = "last_count"
        private const val KEY_SILENT = "silent"

        fun silentInput(): Data = Data.Builder().putBoolean(KEY_SILENT, true).build()

        fun schedule(ctx: Context) {
            val req = PeriodicWorkRequestBuilder<NotifyWorker>(15, TimeUnit.MINUTES)
                .setConstraints(
                    Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()
                ).build()
            WorkManager.getInstance(ctx).enqueueUniquePeriodicWork(
                "fl_check", ExistingPeriodicWorkPolicy.KEEP, req
            )
        }

        fun clearNotification(ctx: Context) {
            NotificationManagerCompat.from(ctx).cancel(NOTIF_ID)
        }
    }
}

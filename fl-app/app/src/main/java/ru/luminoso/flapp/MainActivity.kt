package ru.luminoso.flapp

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            javaScriptCanOpenWindowsAutomatically = true
            mediaPlaybackRequiresUserGesture = false
            // Убираем пометку "wv", чтобы сайт считал приложение обычным Chrome
            userAgentString = userAgentString.replace("; wv", "")
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                val scheme = url.scheme ?: return false
                // tg:, mailto:, tel:, intent: и т.п. - отдаём системе, иначе WebView показывает ошибку
                if (scheme != "http" && scheme != "https") {
                    openExternal(url)
                    return true
                }
                val host = url.host ?: return false
                // Страницы FL.ru и входа через соцсети открываем внутри, остальное - в браузере
                if (host.endsWith("fl.ru") || host.contains("vk.com") || host.contains("yandex") ||
                    host.contains("google") || host.contains("mail.ru")
                ) return false
                openExternal(url)
                return true
            }

            override fun onPageFinished(view: WebView, url: String) {
                CookieManager.getInstance().flush()
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Прикрепление файлов к откликам и сообщениям
            override fun onShowFileChooser(
                view: WebView, callback: ValueCallback<Array<Uri>>, params: FileChooserParams
            ): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                return try {
                    startActivityForResult(params.createIntent(), REQ_FILE)
                    true
                } catch (e: Exception) {
                    fileCallback = null
                    false
                }
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })

        askNotificationPermission()
        NotifyWorker.schedule(this)

        if (savedInstanceState != null) webView.restoreState(savedInstanceState)
        else webView.loadUrl(startUrl(intent))
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        webView.loadUrl(startUrl(intent))
    }

    private fun openExternal(url: Uri) {
        try {
            val i = if (url.scheme == "intent") Intent.parseUri(url.toString(), Intent.URI_INTENT_SCHEME)
            else Intent(Intent.ACTION_VIEW, url)
            startActivity(i)
        } catch (e: Exception) {
            Toast.makeText(this, "Не получилось открыть ссылку", Toast.LENGTH_SHORT).show()
        }
    }

    private fun startUrl(intent: Intent?): String =
        intent?.getStringExtra(NotifyWorker.EXTRA_URL) ?: intent?.dataString ?: HOME

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onResume() {
        super.onResume()
        // Пока приложение открыто, сами всё видим - сбрасываем уведомление
        NotifyWorker.clearNotification(this)
    }

    override fun onPause() {
        super.onPause()
        CookieManager.getInstance().flush()
        // После выхода из приложения запоминаем текущее число непрочитанного
        WorkManager.getInstance(this).enqueue(
            OneTimeWorkRequestBuilder<NotifyWorker>()
                .setInputData(NotifyWorker.silentInput()).build()
        )
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQ_FILE) {
            fileCallback?.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data))
            fileCallback = null
        }
    }

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
        }
    }

    companion object {
        const val HOME = "https://www.fl.ru/"
        private const val REQ_FILE = 42
    }
}

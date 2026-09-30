package ru.luminoso.flapp

/**
 * Достаёт число непрочитанного из HTML-страницы FL.ru.
 * Публичного API у FL.ru нет, поэтому ищем счётчики в разметке:
 * 1) число в заголовке вкладки вида "(3) FL.ru";
 * 2) числа в элементах, у которых в классе есть count / badge / unread / notif / new.
 * Возвращает null, если пользователь не вошёл в аккаунт.
 */
object UnreadParser {

    private val titleRe = Regex("<title>\\s*\\((\\d+)\\)", RegexOption.IGNORE_CASE)
    private val badgeRe = Regex(
        "<(?:span|div|b|i|em|sup|a)[^>]*class=\"[^\"]*(?:count|badge|unread|notif|new-?msg|amount)[^\"]*\"[^>]*>\\s*\\+?(\\d{1,3})\\s*<",
        RegexOption.IGNORE_CASE
    )

    fun count(html: String): Int? {
        if (html.contains("/account/login/") && !html.contains("logout")) return null
        titleRe.find(html)?.let { return it.groupValues[1].toInt() }
        return badgeRe.findAll(html).sumOf { it.groupValues[1].toInt() }
    }
}

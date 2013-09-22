/**
 * Created by XadillaX on 13-9-21.
 *
 * node-WeChax
 * The framework for WeChat API.
 */

/**
 * Build a text message.
 * @param from
 * @param to
 * @param content
 * @returns {string}
 */
exports.textMsg = function(from, to, content) {
    var str = "<xml>";
    str += "<ToUserName><![CDATA[" + to + "]]></ToUserName>";
    str += "<FromUserName><![CDATA[" + from + "]]></FromUserName>";
    str += "<CreateTime>" + Date.now() + "</CreateTime>";
    str += "<MsgType>text</MsgType>";
    str += "<Content><![CDATA[" + content + "]]></Content>";
    str += "</xml>";

    return str;
};

/**
 * Build a music message.
 * @param from
 * @param to
 * @param title
 * @param description
 * @param url
 * @param hqurl
 * @returns {string}
 */
exports.musicMsg = function(from, to, title, description, url, hqurl) {
    var str = "<xml>";
    str += "<ToUserName><![CDATA[" + to + "]]></ToUserName>";
    str += "<FromUserName><![CDATA[" + from + "]]></FromUserName>";
    str += "<CreateTime>" + Date.now() + "</CreateTime>";
    str += "<MsgType>music</MsgType>";
    str += "<Music>";
    str += "<Title><![CDATA[" + title + "]]></Title>";
    str += "<Description><![CDATA[" + description + "]]></Description>";
    str += "<MusicUrl><![CDATA[" + url + "]]></MusicUrl>";
    str += "<HQMusicUrl><![CDATA[" + hqurl + "]]></HQMusicUrl>";
    str += "</Music>";
    str += "</xml>";

    return str
};

/**
 * Created by XadillaX on 13-9-21.
 *
 * node-WeChax
 * The framework for WeChat API.
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

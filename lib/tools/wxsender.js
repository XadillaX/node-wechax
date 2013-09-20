/**
 * Created by XadillaX on 13-9-21.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var xmlmaker = require("./wxxmlmaker");

function wxSender(helper) {
    this.helper = helper;
};

/**
 * Send a text message.
 * @param from
 * @param to
 * @param content
 */
wxSender.prototype.sendText = function(from, to, content) {
    var xml = xmlmaker.textMsg(from, to, content);
    this.sendXml(xml);
};

/**
 * Send the xml message.
 * @param xml
 */
wxSender.prototype.sendXml = function(xml) {
    this.helper.writeHead(200, this.helper.defaultHeader);
    this.helper.write(xml);
    this.helper.end();
};

exports.newSender = function(helper) {
    return new wxSender(helper);
};

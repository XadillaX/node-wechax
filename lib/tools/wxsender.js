/**
 * Created by XadillaX on 13-9-21.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var xmlmaker = require("./wxxmlmaker");
var log4js = require("log4js"),
    logger = log4js.getLogger();

function wxSender(helper) {
    this.helper = helper;
    this.origMsg = {};
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
 * Send a text message back (recommanded).
 * If you create a sender object by yourself, you shold set sender.origMsg first.
 *
 * @param content
 */
wxSender.prototype.sendTextBack = function(content) {
    var json = this.origMsg;
    var xml = xmlmaker.textMsg(json.to, json.from, content);
    this.sendXml(xml);
};

/**
 * Send a rich content message.
 * @param from
 * @param to
 * @param items : [ { title: ..., description: ..., pic: ..., url: ... }, { ... } ]
 */
wxSender.prototype.sendRichContent = function(from, to, items) {
    var xml = xmlmaker.richContentMsg(from, to, items);
    this.sendXml(xml);
};

/**
 * Send a rich content back. (Recommanded)
 * @param items : [ { title: ..., description: ..., pic: ..., url: ... }, { ... } ]
 */
wxSender.prototype.sendRichContentBack = function(items) {
    var json = this.origMsg;
    var xml = xmlmaker.richContentMsg(json.to, json.from, items);
    this.sendXml(xml);
}

/**
 * Send a music message.
 * @param from
 * @param to
 * @param title
 * @param description
 * @param url
 * @param hqurl
 */
wxSender.prototype.sendMusic = function(from, to, title, description, url, hqurl) {
    var xml = xmlmaker.musicMsg(from, to, title, description, url, hqurl);
    this.sendXml(xml);
};

/**
 * Send a music message back. (Recommanded)
 * @param title
 * @param description
 * @param url
 * @param hqurl
 */
wxSender.prototype.sendMusicBack = function(title, description, url, hqurl) {
    var json = this.origMsg;
    var xml = xmlmaker.musicMsg(json.to, json.from, title, description, url, hqurl);
    this.sendXml(xml);
};

/**
 * Send the xml message.
 * @param xml
 */
wxSender.prototype.sendXml = function(xml) {
    logger.debug("Send text: " + xml);

    this.helper.writeHead(200, this.helper.defaultHeader);
    this.helper.write(xml);
    this.helper.end();
};

/**
 * Create a new sender. Called by server.js.
 * @param helper
 * @returns {wxSender}
 */
exports.newSender = function(helper) {
    return new wxSender(helper);
};

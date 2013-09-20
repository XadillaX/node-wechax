/**
 * Created by XadillaX on 13-9-20.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var http = require("http");
var func = require("./func");
var log4js = require("log4js"),
    logger = log4js.getLogger();
var url = require("url");
var fs = require("fs");
var reqresp = require("./reqrespwrapper");
var tokenVerifier = require("./tools/tokenVerifier");
var events = require("events");
var util = require("util");
var senderGen = require("./tools/wxsender");

/**
 * The initialization function of wechat server.
 * @param token
 * @param port
 */
function wechatServer(token, port) {
    this.token = token;
    this.port = port;

    this.logger = logger;
    this.defaultHeader = require("../index").defaultHeader;
}

util.inherits(wechatServer, events.EventEmitter);

/**
 * Get the default header.
 * @param [ext]
 * @returns {*}
 */
wechatServer.prototype.getHeader = function(ext) {
    var header = func.cloneObject(this.defaultHeader);

    if(ext === undefined) return header;
    for(var key in ext) {
        header[key] = func.cloneObject(ext[key]);
    }

    return header;
};

/**
 * Show the favicon file.
 * @param resp
 * @private
 */
wechatServer.prototype._showFavicon = function(resp) {
    var path = require("path");
    var dir = path.dirname(__filename);
    var filename = dir + "/favicon.ico";

    var self = this;
    fs.readFile(filename, "binary", function(err, data) {
        var header = self.getHeader({
            "Content-Type"      : "image/x-icon"
        });
        if(err) {
            self.logger.warn("Can't open the favicon.ico.");
            resp.writeHead(404, header);
            resp.end();
            return;
        }

        resp.writeHead(200, header);
        resp.write(data, "binary");
        resp.end();
    });
};

/**
 * verify the request.
 * @param req
 * @param resp
 * @param callback
 * @private
 */
wechatServer.prototype._verifyRequest = function(req, resp, callback) {
    var pathname = url.parse(req.url).pathname.toLowerCase();

    /**
     * Auto favicon request from some browsers such as Chrome.
     */
    if("/favicon.ico" === pathname) {
        this._showFavicon(resp);
        return;
    }

    var rrw = reqresp.create(req, resp);
    var accessLogStr = "Received a request '" + req.url + "' from " + rrw.getClientIp() + " 〔" + rrw.getUserAgent() + "〕.";
    //this.logger.info(accessLogStr);

    /**
     * Verify the token.
     */
    var tv = new tokenVerifier(this.token);
    var result = tv.verify(rrw);

    if(typeof result === "string") {
        var header = this.getHeader({
            "content-type"  : "text/plain"
        });
        rrw.writeHead(200, header);
        rrw.write(result);
        rrw.end();

        accessLogStr = "[Pure verified] " + accessLogStr;
        this.logger.info(accessLogStr);
        return;
    } else if(result === false) {
        var header = this.getHeader({
            "content-type"  : "text/plain"
        });
        rrw.writeHead("502", header);
        rrw.write("Invalid token.");
        rrw.end();

        accessLogStr = "[Verify failed] " + accessLogStr;
        this.logger.error(accessLogStr);
        return;
    }

    var self = this;
    var postData = "";
    req.setEncoding("utf8");
    req.addListener("data", function(postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function() {
        rrw._setPostData(postData, function() {
            callback.bind(self)(rrw);
        });
    });
};

/**
 * Alloc which function the message will go.
 * @param helper
 * @private
 */
wechatServer.prototype._allocMsgProcessor = function(helper) {
    var msg = helper.messageJson;
    var sender = senderGen.newSender(helper);

    switch(msg.MsgType) {
        case "text" : {
            this.emit("text", sender, msg.FromUserName, msg.ToUserName, msg.CreateTime, msg.Content, msg.MsgId);
            break;
        }
    }
};

/**
 * start the server.
 * @param callback
 */
wechatServer.prototype.start = function(callback) {
    var self = this;

    /**
     * Create the http server.
     */
    http.createServer(function(req, resp) {
        self._verifyRequest(req, resp, function(helper) {
            self._allocMsgProcessor(helper);
        });
    }).listen(self.port);
    this.logger.info("WeChax server has started up successfully.");
};

module.exports = wechatServer;

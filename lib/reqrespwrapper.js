/**
 * Created by XadillaX on 13-9-20.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var func = require("./func");
var url = require("url");
var querystring = require("querystring");
var xml2js = require("xml2js");
var log4js = require("log4js"),
    logger = log4js.getLogger();

function reqresp(req, resp) {
    this.req = req;
    this.resp = resp;

    this.writeHead = resp.writeHead.bind(resp);
    this.write = resp.write.bind(resp);
    this.end = resp.end.bind(resp);

    this.reqHeaders = func.cloneObject(req["headers"], "lowercase");
    this.respHeaders = require("../index").defaultHeader;

    this.pathname = "";
    this.query = {};
    this._parseQuery();

    this.messageXml = "";
    this.messageJson = {};
}

/**
 * Get the client IP address.
 * @returns {*}
 */
reqresp.prototype.getClientIp = function() {
    var req = this.req;
    var ipAddress;
    var forwardedIpsStr = req.headers["x-forwarded-for"];
    if(forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(",");
        ipAddress = forwardedIps[0];
    }

    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

/**
 * Get the user agent.
 * @returns {*}
 */
reqresp.prototype.getUserAgent = function() {
    if(undefined === this.reqHeaders) return "";
    return this.reqHeaders["user-agent"];
};

reqresp.prototype._parseQuery = function() {
    var q = url.parse(this.req.url).query;
    var p = url.parse(this.req.url).pathname;

    this.query = querystring.parse(q);
    this.pathname = p;
};

/**
 * parse the post data (xml).
 * @param data
 * @param callback
 * @private
 */
reqresp.prototype._setPostData = function(data, callback) {
    this.messageXml = data;
    var self = this;
    xml2js.parseString(this.messageXml, function(err, json) {
        if(err) {
            logger.error("Can't parse the xml [" + err + "]: " + self.messageXml);
            return;
        }
        self.messageJson = json.xml;

        for(var key in self.messageJson) {
            self.messageJson[key] = self.messageJson[key][0];
        }

        callback();
    });
};

/**
 * Create an object.
 * @param req
 * @param resp
 * @returns {reqresp}
 */
exports.create = function(req, resp) {
    return new reqresp(req, resp);
};

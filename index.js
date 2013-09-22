/**
 * Created by XadillaX on 13-9-20.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var wechatSrv = require("./lib/server");

/**
 * Create a wechat API server.
 * @param token
 * @param port
 * @returns {wechatSrv}
 */
exports.newServer = function(token, port) {
    if(port === undefined) port = 80;
    return new wechatSrv(token, port);
};

exports.usefulFunc = require("./lib/func");
exports.nodeVersion = exports.usefulFunc.nodeVersion;
exports.frameworkVersion = exports.usefulFunc.frameworkVersion;
exports.defaultHeader = {
    "Content-Type"      : "text/xml",
    "X-Powered-By"      : exports.usefulFunc.frameworkVersion + "; " + exports.usefulFunc.nodeVersion
};

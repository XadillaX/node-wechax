/**
 * Created by XadillaX on 13-9-20.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var crypto = require("crypto");
var log4js = require("log4js"),
    logger = log4js.getLogger();

function tokenVerifier(token) {
    this.token = token;
};

/**
 * verify the token.
 * @param helper
 * @returns {*}
 */
tokenVerifier.prototype.verify = function(helper) {
    var token = this.token;

    if(helper.query.signature === undefined || helper.query.timestamp === undefined ||
        helper.query.nonce === undefined)
    {
        return false;
    }

    var timestamp = helper.query.timestamp;
    var nonce = helper.query.nonce;

    var strArr = [ token, timestamp, nonce ];
    strArr.sort();
    var newsignature = strArr[0] + strArr[1] + strArr[2];

    var sha1 = crypto.createHash('sha1');
    sha1.update(newsignature);
    newsignature = sha1.digest("hex");

    logger.debug("True signature: " + newsignature + "; client signature: " + helper.query.signature + ".");

    if(newsignature === helper.query.signature) {
        if(helper.query.echostr !== undefined) return helper.query.echostr;
        return true;
    }

    return false;
};

module.exports = tokenVerifier;

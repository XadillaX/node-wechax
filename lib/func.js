/**
 * Created by XadillaX on 13-9-20.
 *
 * node-WeChax
 * The framework for WeChat API.
 */
var util = require("util");

/**
 * The versions of node and this framework.
 * @type {string}
 */
exports.nodeVersion = "NodeJS " + process.version;
exports.frameworkVersion = "Wechax Server Framework 0.0.2";

/**
 * Judge whether an object is an array.
 * @param arr
 * @returns {boolean}
 */
exports.isArray = util.isArray;

/**
 * Clone a object, not use refer.
 * @param orig
 * @param [keyCase]
 * @returns {*}
 */
exports.cloneObject = function(orig, keyCase) {
    /**
     * directly clone
     */
    if(typeof orig !== "object") return orig;

    /**
     * null
     */
    if(null === orig) return null;

    /**
     * array
     */
    if(this.isArray(orig)) {
        var dest = [];
        for(var i = 0; i < orig.length; i++) {
            dest.push(this.cloneObject(orig[i]));
        }
        return dest;
    }

    /**
     * object
     */
    var dest = {};
    for(var key in orig) {
        var newkey = key;
        if(keyCase === "lowercase") key = key.toLowerCase();
        if(keyCase === "uppercase") key = key.toUpperCase();

        dest[newkey] = this.cloneObject(orig[key]);
    }
    return dest;
};

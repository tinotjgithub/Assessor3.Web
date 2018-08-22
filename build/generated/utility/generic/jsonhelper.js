"use strict";
/**
 * helper class with utility methods for formatting json and other js objects
 */
var JsonHelper = (function () {
    function JsonHelper() {
    }
    /**
     * convert the given object's keys into camel case
     * @param objectToConvert - The object of which the keys to be converted into camel case
     */
    JsonHelper.toCamelCase = function (objectToConvert) {
        var newObject;
        var origKey;
        var newKey;
        var value;
        if (objectToConvert instanceof Array) {
            newObject = [];
            for (origKey in objectToConvert) {
                if (origKey) {
                    value = objectToConvert[origKey];
                    if (typeof value === 'object') {
                        value = JsonHelper.toCamelCase(value);
                    }
                    newObject.push(value);
                }
            }
        }
        else {
            newObject = {};
            for (origKey in objectToConvert) {
                if (objectToConvert.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                    value = objectToConvert[origKey];
                    if (value !== null && (value.constructor === Object || value.constructor === Array)) {
                        value = JsonHelper.toCamelCase(value);
                    }
                    newObject[newKey] = value;
                }
            }
        }
        return newObject;
    };
    return JsonHelper;
}());
module.exports = JsonHelper;
//# sourceMappingURL=jsonhelper.js.map
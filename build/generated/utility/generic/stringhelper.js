"use strict";
/**
 * helper class with utilty methods for formatting strings
 */
var StringHelper = (function () {
    function StringHelper() {
    }
    /**
     * returns a string which is formated using the replacement parameters. Similar to String.format in c#
     * @param stringArg - The string to be formated and which contains place holders.
     * @param replacements - Array of strings to be replaced by each place holders
     */
    StringHelper.format = function (stringArg, replacements) {
        return stringArg.replace(/{(\d+)}/g, function (match, index) {
            return typeof replacements[index] !== 'undefined' ? replacements[index] : match;
        });
    };
    /**
     * Split string
     * @param stringArg
     * @param separator
     */
    StringHelper.split = function (stringArg, separator) {
        return stringArg.split(separator);
    };
    StringHelper.COMMA_SEPARATOR = ',';
    return StringHelper;
}());
module.exports = StringHelper;
//# sourceMappingURL=stringhelper.js.map
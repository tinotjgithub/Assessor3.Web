"use strict";
var constants = require('../../components/utility/constants');
var MarkingHelperBase = (function () {
    function MarkingHelperBase() {
    }
    /**
     * Find a match with the valid marks
     * @param {string} mark
     * @returns
     */
    MarkingHelperBase.prototype.isMatchAvailableMarks = function (mark, availableMarks) {
        var isMatchFound = false;
        var length = availableMarks.count();
        availableMarks.forEach(function (item) {
            if (parseFloat(item.displayMark.toString()) === parseFloat(mark)) {
                isMatchFound = true;
                return isMatchFound;
            }
        });
        return isMatchFound;
    };
    /**
     * Validating NR marks
     * @param {string} mark
     * @returns
     */
    MarkingHelperBase.prototype.validateNRMark = function (mark) {
        if (mark.length > constants.NOT_ATTEMPTED.length) {
            return false;
        }
        // Validating whether NR has given using special keys.
        if (mark.indexOf('#') > -1 ||
            mark.indexOf('/') > -1) {
            return !(mark.toString().match(/^[#\/]$/) === null);
        }
        var isValid = true;
        for (var i = 0; i < mark.length; i++) {
            if (mark[i].toLowerCase() !== constants.NOT_ATTEMPTED[i].toLowerCase()) {
                isValid = false;
                break;
            }
        }
        return isValid;
    };
    return MarkingHelperBase;
}());
module.exports = MarkingHelperBase;
//# sourceMappingURL=markinghelperbase.js.map
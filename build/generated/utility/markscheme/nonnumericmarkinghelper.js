"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markingHelperBase = require('./markinghelperbase');
var NonNumericMarkingHelper = (function (_super) {
    __extends(NonNumericMarkingHelper, _super);
    function NonNumericMarkingHelper() {
        _super.apply(this, arguments);
    }
    /**
     * Validating numeric marks.
     * @param {any} mark
     * @param {number} stepValue
     * @param {number[]} availableMarks
     * @returns
     */
    NonNumericMarkingHelper.prototype.validateMarks = function (mark, stepValue, availableMarks) {
        var isValid = false;
        var isValidNR = false;
        if (mark.toString() === '-' || mark.toString() === '') {
            return true;
        }
        //Check whether the entered character is in available marks
        isValid = this.isMatchAvailableMarks(parseFloat(mark.toString()).toString(), availableMarks);
        if (isValid === true) {
            return isValid;
        }
        else {
            //Check whether the NR mark is entered
            isValidNR = this.validateNRMark(mark.toLowerCase());
            return isValidNR;
        }
    };
    /**
     * Format the mark string
     * @param {string} mark
     * @param {number} stepValue?
     * @returns
     */
    NonNumericMarkingHelper.prototype.formatMark = function (mark, availableMarks, stepValue) {
        var formattedMark = { displayMark: '-', valueMark: null };
        availableMarks.forEach(function (item) {
            if (item.displayMark.toLowerCase() === mark.toLowerCase()) {
                formattedMark = {
                    displayMark: item.displayMark,
                    valueMark: item.valueMark
                };
                return formattedMark;
            }
        });
        return formattedMark;
    };
    /**
     * Find a match with the valid marks
     * @param {string} mark
     * @returns
     */
    NonNumericMarkingHelper.prototype.isMatchAvailableMarks = function (mark, availableMarks) {
        var isMatchFound = false;
        availableMarks.forEach(function (item) {
            if ((item.displayMark.toString() === mark)
                || (mark.length < item.displayMark.length
                    && mark === item.displayMark.substr(0, mark.length))) {
                isMatchFound = true;
                return isMatchFound;
            }
        });
        return isMatchFound;
    };
    return NonNumericMarkingHelper;
}(markingHelperBase));
module.exports = NonNumericMarkingHelper;
//# sourceMappingURL=nonnumericmarkinghelper.js.map
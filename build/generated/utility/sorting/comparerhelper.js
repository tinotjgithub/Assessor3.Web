"use strict";
/**
 * Helper class for sorting of an array of any objects
 */
var ComparerHelper = (function () {
    function ComparerHelper() {
    }
    /**
     * Comparer method to sort integer numbers in ascending order
     */
    ComparerHelper.integerSort = function (a, b) {
        if (+a > +b) {
            return 1;
        }
        if (+a < +b) {
            return -1;
        }
        return 0;
    };
    /**
     * Comparer method to sort integer numbers in decending order
     */
    ComparerHelper.integerSortDesc = function (a, b) {
        if (+a > +b) {
            return -1;
        }
        if (+a < +b) {
            return 1;
        }
        return 0;
    };
    /**
     * Comparer method to sort Strings in ascending order
     */
    ComparerHelper.stringSort = function (a, b) {
        if (a.toLowerCase() > b.toLowerCase()) {
            return 1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        }
        return 0;
    };
    /**
     * Comparer method to sort Strings in decending order
     */
    ComparerHelper.stringSortDesc = function (a, b) {
        if (a.toLowerCase() > b.toLowerCase()) {
            return -1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
            return 1;
        }
        return 0;
    };
    return ComparerHelper;
}());
module.exports = ComparerHelper;
//# sourceMappingURL=comparerhelper.js.map
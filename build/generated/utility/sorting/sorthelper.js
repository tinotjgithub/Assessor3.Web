"use strict";
var comparer = require('./sortbase/comparerfactory');
/**
 * Helper class for sorting of an array of any objects
 */
var SortHelper = (function () {
    function SortHelper() {
    }
    /**
     * returns a sorted list of arrays based on the comparer.
     * @param listToSort - The array/immutable list to be sorted
     * @param comparer - The name of the comparer, this should be same as the value in comparerList (keymirror list)
     */
    SortHelper.sort = function (listToSort, comparerName) {
        var comparerObject = comparer.getComparer(comparerName);
        if (comparerObject) {
            return listToSort.sort(comparerObject.compare.bind(comparerObject));
        }
        else {
            /** Throwing an exception of comparer not found */
            throw Error('Comparer not found.');
        }
    };
    /**
     * Banker's rounding similar to the C# logic of rounding
     * @param num number to round off
     * @param decimalPlaces number of decimal places
     */
    SortHelper.evenRound = function (num, decimalPlaces) {
        var d = decimalPlaces || 0;
        var m = Math.pow(10, d);
        var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
        var i = Math.floor(n);
        var f = n - i;
        var e = 1e-8; // Allow for rounding errors in f
        var r = (f > 0.5 - e && f < 0.5 + e) ?
            ((i % 2 === 0) ? i : i + 1) : Math.round(n);
        return d ? r / m : r;
    };
    return SortHelper;
}());
module.exports = SortHelper;
//# sourceMappingURL=sorthelper.js.map
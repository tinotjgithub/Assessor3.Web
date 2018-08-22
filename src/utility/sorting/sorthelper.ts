import comparer = require('./sortbase/comparerfactory');
import comparerInterface = require('./sortbase/comparerinterface');
import comparerList = require('./sortbase/comparerlist');

/**
 * Helper class for sorting of an array of any objects
 */
class SortHelper {
    /**
     * returns a sorted list of arrays based on the comparer.
     * @param listToSort - The array/immutable list to be sorted
     * @param comparer - The name of the comparer, this should be same as the value in comparerList (keymirror list)
     */
    public static sort(listToSort: Array<Object>, comparerName: comparerList) {
        let comparerObject = comparer.getComparer(comparerName) as comparerInterface;

        if (comparerObject) {
            return listToSort.sort(comparerObject.compare.bind(comparerObject));
        } else {
            /** Throwing an exception of comparer not found */
            throw Error('Comparer not found.');
        }
    }

    /**
     * Banker's rounding similar to the C# logic of rounding
     * @param num number to round off
     * @param decimalPlaces number of decimal places
     */
    public static evenRound(num, decimalPlaces: number) {
        let d: number = decimalPlaces || 0;
        let m: number = Math.pow(10, d);
        let n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
        let i = Math.floor(n);
        let f = n - i;
        let e = 1e-8; // Allow for rounding errors in f
        let r = (f > 0.5 - e && f < 0.5 + e) ?
            ((i % 2 === 0) ? i : i + 1) : Math.round(n);
        return d ? r / m : r;
    }
}

export = SortHelper;



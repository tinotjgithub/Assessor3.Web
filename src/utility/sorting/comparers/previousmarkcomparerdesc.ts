import comparerInterface = require('../sortbase/comparerinterface');
import constants = require('../../../components/utility/constants');

/**
 * This is the previous mark comparer class and method.
 */
class PreviousMarkComparerDesc implements comparerInterface {

    /** Previous mark comparer to sort the previous mark collection in descending order of display mark */
    public compare(a: PreviousMark, b: PreviousMark) {
        /**
         * This condition is for the scenario when one cluster is marked all NR and other cluster has zero.
         * Both have effective mark of zero, but the cluster with NR needs to be striked off.
         * In optionality we have to chose 0 over NR even if both having the mark value as 0.
         * Hence using -100 as the value of NR in order to swap 0 with NR during javascript sort.
         * ( if the cluster 'b' is greater than cluster 'a' , and cluster 'a' is less than 0 then priority will be for NR.)
         */
        let bTotal = isNaN(parseFloat(b.mark.displayMark)) ? ((parseFloat(a.mark.displayMark) < 0) ? 0 :
            constants.NR_ALTERNATIVE_VALUE) : parseFloat(b.mark.displayMark);
        let aTotal = isNaN(parseFloat(a.mark.displayMark)) ? ((parseFloat(b.mark.displayMark) < 0) ? 0 :
            constants.NR_ALTERNATIVE_VALUE) : parseFloat(a.mark.displayMark);

        if (bTotal > aTotal) { return 1; }
        if (bTotal < aTotal) { return -1; }
        return 0;
    }
}
export = PreviousMarkComparerDesc;
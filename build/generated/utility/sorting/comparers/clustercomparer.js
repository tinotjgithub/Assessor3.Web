"use strict";
var constants = require('../../../components/utility/constants');
/**
 * This is the clusterComparer comparer class and method  .
 */
var ClusterComparer = (function () {
    function ClusterComparer() {
    }
    /** cluster comparer for sorting clusters based on total marks */
    ClusterComparer.prototype.compare = function (a, b) {
        /**
         * This condition is for the scenario when one cluster is marked all NR and other cluster has zero.
         * Both have effective mark of zero, but the cluster with NR needs to be striked off.
         * In optionality we have to chose 0 over NR even if both having the mark value as 0.
         * Hence using -100 as the value of NR in order to swap 0 with NR during javascript sort.
         * ( if the cluster 'b' is greater than cluster 'a' , and cluster 'a' is less than 0 then priority will be for NR.)
         */
        var bTotal = isNaN(parseFloat(b.totalMarks)) ? ((parseFloat(a.totalMarks) < 0) ? 0 :
            constants.NR_ALTERNATIVE_VALUE) : parseFloat(b.totalMarks);
        var aTotal = isNaN(parseFloat(a.totalMarks)) ? ((parseFloat(b.totalMarks) < 0) ? 0 :
            constants.NR_ALTERNATIVE_VALUE) : parseFloat(a.totalMarks);
        if (bTotal > aTotal) {
            return 1;
        }
        if (bTotal < aTotal) {
            return -1;
        }
        return 0;
    };
    return ClusterComparer;
}());
module.exports = ClusterComparer;
//# sourceMappingURL=clustercomparer.js.map
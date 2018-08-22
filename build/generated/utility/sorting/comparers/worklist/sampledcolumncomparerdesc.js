"use strict";
var localeStore = require('../../../../stores/locale/localestore');
/**
 * This is Sampled column comparer class and method
 */
var SampledColumnComparerDesc = (function () {
    function SampledColumnComparerDesc() {
    }
    /** Comparer to sort the work list in descending order of Sampled column */
    SampledColumnComparerDesc.prototype.compare = function (a, b) {
        var sampleReviewCommentA = a.sampleCommentId === 0 ? '' :
            localeStore.instance.TranslateText('team-management.response.supervisor-sampling-comments.' + a.sampleCommentId);
        var sampleReviewCommentB = b.sampleCommentId === 0 ? '' :
            localeStore.instance.TranslateText('team-management.response.supervisor-sampling-comments.' + b.sampleCommentId);
        if (sampleReviewCommentA > sampleReviewCommentB) {
            return -1;
        }
        if (sampleReviewCommentA < sampleReviewCommentB) {
            return 1;
        }
        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }
        return 0;
    };
    return SampledColumnComparerDesc;
}());
module.exports = SampledColumnComparerDesc;
//# sourceMappingURL=sampledcolumncomparerdesc.js.map
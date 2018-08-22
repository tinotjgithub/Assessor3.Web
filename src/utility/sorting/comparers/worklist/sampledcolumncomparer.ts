import comparerInterface = require('../../sortbase/comparerinterface');
import localeStore = require('../../../../stores/locale/localestore');

/**
 * This is Sampled column comparer class and method
 */
class SampledColumnComparer implements comparerInterface {
    /** Comparer to sort the work list in ascending order of Sampled column */
    public compare(a: any, b: any) {

        let sampleReviewCommentA: string = a.sampleCommentId === 0 ? '' :
            localeStore.instance.TranslateText(
                'team-management.response.supervisor-sampling-comments.' + a.sampleCommentId);
        let sampleReviewCommentB: string = b.sampleCommentId === 0 ? '' :
            localeStore.instance.TranslateText(
                'team-management.response.supervisor-sampling-comments.' + b.sampleCommentId);

        if (sampleReviewCommentA > sampleReviewCommentB) {
            return 1;
        }
        if (sampleReviewCommentA < sampleReviewCommentB) {
            return -1;
        }

        if (+a.displayId > +b.displayId) {
            return 1;
        }
        if (+a.displayId < +b.displayId) {
            return -1;
        }

        return 0;
    }
}

export = SampledColumnComparer;
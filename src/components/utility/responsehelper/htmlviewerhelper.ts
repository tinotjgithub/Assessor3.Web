import enums = require('../enums');
import qigStore = require('../../../stores/qigselector/qigstore');

/**
 * helper class for html viewer
 */
class HtmlViewerHelper {

    /* return true if the component is html component */
    public static get isHtmlComponent() {
        // TODO need to fetch the marking method from awarding seesion and compinent collection
        return qigStore.instance.selectedQIGForMarkerOperation.markingMethod
            === enums.MarkingMethod.MarkFromObject;
    }
}
export = HtmlViewerHelper;
"use strict";
var enums = require('../enums');
var qigStore = require('../../../stores/qigselector/qigstore');
/**
 * helper class for html viewer
 */
var HtmlViewerHelper = (function () {
    function HtmlViewerHelper() {
    }
    Object.defineProperty(HtmlViewerHelper, "isHtmlComponent", {
        /* return true if the component is html component */
        get: function () {
            return qigStore.instance.selectedQIGForMarkerOperation.markingMethod
                === enums.MarkingMethod.MarkFromObject;
        },
        enumerable: true,
        configurable: true
    });
    return HtmlViewerHelper;
}());
module.exports = HtmlViewerHelper;
//# sourceMappingURL=htmlviewerhelper.js.map
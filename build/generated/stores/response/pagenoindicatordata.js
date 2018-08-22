"use strict";
/**
 * Class for storing the page data to update page no: indicator during scrolling.
 */
var PageNoIndicatorData = (function () {
    /**
     * Constructor for PageNoIndicatorData
     * @param {Array<number>} pageNo
     * @param {Array<number>} imageNo
     */
    function PageNoIndicatorData(pageNo, imageNo) {
        this._mostVisiblePageNo = [];
        this._imageNo = [];
        this._mostVisiblePageNo = pageNo;
        this._imageNo = imageNo;
    }
    Object.defineProperty(PageNoIndicatorData.prototype, "mostVisiblePageNo", {
        /** get mostVisiblePageNo */
        get: function () {
            return this._mostVisiblePageNo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageNoIndicatorData.prototype, "imageNo", {
        /** get imageNo */
        get: function () {
            return this._imageNo;
        },
        enumerable: true,
        configurable: true
    });
    return PageNoIndicatorData;
}());
module.exports = PageNoIndicatorData;
//# sourceMappingURL=pagenoindicatordata.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var pageNoIndicatorData = require('../../stores/response/pagenoindicatordata');
var UpdatePageNumberIndicatorAction = (function (_super) {
    __extends(UpdatePageNumberIndicatorAction, _super);
    /**
     * Constructor UpdatePageNumberIndicatorAction
     * @param pageNo
     * @param imageNo
     */
    function UpdatePageNumberIndicatorAction(pageNo, imageNo, isBookletView) {
        _super.call(this, action.Source.View, actionType.UPDATE_PAGE_NO_INDICATOR);
        this.mostVisiblePage = pageNo;
        this.imageNo = imageNo;
        this._isBookletView = isBookletView;
    }
    Object.defineProperty(UpdatePageNumberIndicatorAction.prototype, "pageNoIndicatorData", {
        get: function () {
            return new pageNoIndicatorData(this.mostVisiblePage, this.imageNo);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatePageNumberIndicatorAction.prototype, "isBookletView", {
        get: function () {
            return this._isBookletView;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatePageNumberIndicatorAction;
}(action));
module.exports = UpdatePageNumberIndicatorAction;
//# sourceMappingURL=updatepagenumberindicatoraction.js.map
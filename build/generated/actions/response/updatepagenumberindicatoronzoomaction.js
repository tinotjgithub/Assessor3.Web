"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/** Refreshing pagenoindicator UI while user changes zoom settings */
var UpdatePageNumberIndicatorOnZoomAction = (function (_super) {
    __extends(UpdatePageNumberIndicatorOnZoomAction, _super);
    /**
     * Constructor UpdatePageNumberIndicatorOnZoomAction
     */
    function UpdatePageNumberIndicatorOnZoomAction() {
        _super.call(this, action.Source.View, actionType.REFRESH_PAGE_NO_INDICATOR);
    }
    return UpdatePageNumberIndicatorOnZoomAction;
}(action));
module.exports = UpdatePageNumberIndicatorOnZoomAction;
//# sourceMappingURL=updatepagenumberindicatoronzoomaction.js.map
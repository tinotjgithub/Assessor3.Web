"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ZoomUpdatedAction = (function (_super) {
    __extends(ZoomUpdatedAction, _super);
    /**
     * Constructor ZoomUpdatedAction
     * @param zoomPercentage
     */
    function ZoomUpdatedAction(zoomPercentage) {
        _super.call(this, action.Source.View, actionType.ZOOM_UPDATED_ACTION);
        this._zoomPercentage = zoomPercentage;
    }
    Object.defineProperty(ZoomUpdatedAction.prototype, "zoomPercentage", {
        /**
         * Get the zoom percentage.
         * @returns updated zoom percentage
         */
        get: function () {
            return this._zoomPercentage;
        },
        enumerable: true,
        configurable: true
    });
    return ZoomUpdatedAction;
}(action));
module.exports = ZoomUpdatedAction;
//# sourceMappingURL=zoomupdatedaction.js.map
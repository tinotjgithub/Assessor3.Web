"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ZoomAnimationEndAction = (function (_super) {
    __extends(ZoomAnimationEndAction, _super);
    /**
     * Creates an instance of ZoomAnimationEndAction.
     * @param {boolean} doReRender
     *
     * @memberOf ZoomAnimationEndAction
     */
    function ZoomAnimationEndAction(doReRender) {
        _super.call(this, action.Source.View, actionType.ZOOM_ANIMATION_END);
        this._doReRender = doReRender;
    }
    Object.defineProperty(ZoomAnimationEndAction.prototype, "doReRender", {
        /**
         * property to check whether to re-render or not
         *
         * @readonly
         * @type {boolean}
         * @memberOf ZoomAnimationEndAction
         */
        get: function () {
            return this._doReRender;
        },
        enumerable: true,
        configurable: true
    });
    return ZoomAnimationEndAction;
}(action));
module.exports = ZoomAnimationEndAction;
//# sourceMappingURL=zoomanimationendaction.js.map
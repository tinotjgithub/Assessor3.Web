"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var ScrollPositionChangedAction = (function (_super) {
    __extends(ScrollPositionChangedAction, _super);
    /**
     * Constructor ScrollPositionChangedAction
     * @param success
     * @param currentScrollPosition
     */
    function ScrollPositionChangedAction(success, currentScrollPosition, doEmit, updateScrollPosition) {
        _super.call(this, action.Source.View, actionType.SCROLL_POSITION_CHANGED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._currentScrollPosition = currentScrollPosition;
        this._doEmit = doEmit;
        this._updateScrollPosition = updateScrollPosition;
    }
    Object.defineProperty(ScrollPositionChangedAction.prototype, "currentScrollPosition", {
        /**
         * This will returns the current scroll position.
         */
        get: function () {
            return this._currentScrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollPositionChangedAction.prototype, "doEmit", {
        /**
         * This will returns whether or not to emit the event.
         */
        get: function () {
            return this._doEmit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollPositionChangedAction.prototype, "updateScrollPosition", {
        /**
         * This will return whether or not to update the scroll position.
         */
        get: function () {
            return this._updateScrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    return ScrollPositionChangedAction;
}(dataRetrievalAction));
module.exports = ScrollPositionChangedAction;
//# sourceMappingURL=scrollpositionchangedaction.js.map
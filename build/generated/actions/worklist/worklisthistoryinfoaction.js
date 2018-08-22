"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var WorklistHistoryInfoAction = (function (_super) {
    __extends(WorklistHistoryInfoAction, _super);
    /**
     * Constructor
     * @param historyInfo
     */
    function WorklistHistoryInfoAction(historyItem, markingMode) {
        _super.call(this, action.Source.View, actionType.WORKLIST_HISTORY_INFO);
        this._historyItem = historyItem;
        this._markingMode = markingMode;
    }
    Object.defineProperty(WorklistHistoryInfoAction.prototype, "historyItem", {
        /**
         * Returns the current history item
         */
        get: function () {
            return this._historyItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistHistoryInfoAction.prototype, "markingMode", {
        /**
         * Returns the current marker mode
         */
        get: function () {
            return this._markingMode;
        },
        enumerable: true,
        configurable: true
    });
    return WorklistHistoryInfoAction;
}(action));
module.exports = WorklistHistoryInfoAction;
//# sourceMappingURL=worklisthistoryinfoaction.js.map
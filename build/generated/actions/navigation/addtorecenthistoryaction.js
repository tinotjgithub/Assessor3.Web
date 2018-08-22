"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AddToRecentHistoryAction = (function (_super) {
    __extends(AddToRecentHistoryAction, _super);
    /**
     * Constructor
     * @param _historyItem
     */
    function AddToRecentHistoryAction(_historyItem) {
        _super.call(this, action.Source.View, actionType.ADD_TO_RECENT_HISTORY);
        this._historyItem = _historyItem;
    }
    Object.defineProperty(AddToRecentHistoryAction.prototype, "historyItem", {
        /* get history data*/
        get: function () {
            return this._historyItem;
        },
        enumerable: true,
        configurable: true
    });
    return AddToRecentHistoryAction;
}(action));
module.exports = AddToRecentHistoryAction;
//# sourceMappingURL=addtorecenthistoryaction.js.map
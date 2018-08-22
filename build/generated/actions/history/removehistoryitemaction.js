"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var RemoveHistoryItemAction = (function (_super) {
    __extends(RemoveHistoryItemAction, _super);
    /**
     * Constructor
     * @param qigId
     * @param doRemoveTeamObject
     */
    function RemoveHistoryItemAction(qigId, doRemoveTeamObject) {
        _super.call(this, action.Source.View, actionType.REMOVE_HISTORY_ITEM_ACTION);
        this._qigId = qigId;
        this._doRemoveTeamObject = doRemoveTeamObject;
    }
    Object.defineProperty(RemoveHistoryItemAction.prototype, "qigId", {
        /**
         * Returns the qig id
         */
        get: function () {
            return this._qigId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveHistoryItemAction.prototype, "doRemoveTeamObject", {
        /**
         * indicates whether team object needs to be removed
         */
        get: function () {
            return this._doRemoveTeamObject;
        },
        enumerable: true,
        configurable: true
    });
    return RemoveHistoryItemAction;
}(action));
module.exports = RemoveHistoryItemAction;
//# sourceMappingURL=removehistoryitemaction.js.map
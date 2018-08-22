"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var QigSelectorAction = (function (_super) {
    __extends(QigSelectorAction, _super);
    /**
     * Constructor QigSelectorAction
     * @param qigId
     * @param dispatchEvent
     * @param isFromHistory
     */
    function QigSelectorAction(qigId, dispatchEvent, isFromHistory) {
        _super.call(this, action.Source.View, actionType.MARK);
        this._selectedQigId = qigId;
        this._dispatchEvent = dispatchEvent;
        this._isFromHistory = isFromHistory;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{selectedQIG}/g, this.getSelectedQigId.toString());
    }
    /**
     * Retruns the selected Qig ID
     */
    QigSelectorAction.prototype.getSelectedQigId = function () {
        return this._selectedQigId;
    };
    Object.defineProperty(QigSelectorAction.prototype, "dispatchEvent", {
        /**
         * Returns true if event emit required else return false
         */
        get: function () {
            return this._dispatchEvent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorAction.prototype, "isFromHistory", {
        /**
         * Returns true if it is from history
         */
        get: function () {
            return this._isFromHistory;
        },
        enumerable: true,
        configurable: true
    });
    return QigSelectorAction;
}(action));
module.exports = QigSelectorAction;
//# sourceMappingURL=qigselectoraction.js.map
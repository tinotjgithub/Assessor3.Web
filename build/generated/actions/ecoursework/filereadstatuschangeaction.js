"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var FileReadStatusChangeAction = (function (_super) {
    __extends(FileReadStatusChangeAction, _super);
    /**
     * Constructor for Change File Read Status Action.
     * @param {number} pageId
     * @param {number} markGroupId
     */
    function FileReadStatusChangeAction(pageId, markGroupId, isInProgress, isSaveCompleted) {
        _super.call(this, action.Source.View, actionType.FILE_READ_STATUS_CHANGE_ACTION);
        this._pageId = pageId;
        this._isChangeInProgress = isInProgress;
        this._isSaveCompleted = isSaveCompleted;
        this._markGroupId = markGroupId;
    }
    Object.defineProperty(FileReadStatusChangeAction.prototype, "pageId", {
        /**
         * Returns page id of selected file.
         * @returns
         */
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReadStatusChangeAction.prototype, "isChangeInProgress", {
        /**
         * Returns the file read status change is in progress or not.
         * @returns
         */
        get: function () {
            return this._isChangeInProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReadStatusChangeAction.prototype, "isSaveCompleted", {
        /**
         * Returns the file read status save is completed or not.
         * @returns
         */
        get: function () {
            return this._isSaveCompleted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReadStatusChangeAction.prototype, "markGroupId", {
        /**
         * Returns mark group id.
         * @returns
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return FileReadStatusChangeAction;
}(action));
module.exports = FileReadStatusChangeAction;
//# sourceMappingURL=filereadstatuschangeaction.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for refreshing message folder action
 */
var RefreshMessageFolderAction = (function (_super) {
    __extends(RefreshMessageFolderAction, _super);
    /**
     * constructor
     * @param success
     * @param messageFolder
     * @param useCache
     */
    function RefreshMessageFolderAction(success, messageFolder, useCache) {
        if (useCache === void 0) { useCache = false; }
        _super.call(this, action.Source.View, actionType.REFRESH_MESSAGE_FOLDER, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', enums.getEnumString(enums.MessageFolderType, messageFolder));
        this._messageFolder = messageFolder;
        this._useCache = useCache;
    }
    Object.defineProperty(RefreshMessageFolderAction.prototype, "messageFolder", {
        /**
         * Get the message folder
         */
        get: function () {
            return this._messageFolder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RefreshMessageFolderAction.prototype, "useCache", {
        /**
         * Returns whether we need to use cache or not
         */
        get: function () {
            return this._useCache;
        },
        enumerable: true,
        configurable: true
    });
    return RefreshMessageFolderAction;
}(dataRetrievalAction));
module.exports = RefreshMessageFolderAction;
//# sourceMappingURL=refreshmessagefolderaction.js.map
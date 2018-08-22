"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var userOptionStore = require('../../stores/useroption/useroptionstore');
/**
 * Class for saving user action
 * @param {boolean} sucess
 */
var UserOptionSaveAction = (function (_super) {
    __extends(UserOptionSaveAction, _super);
    /**
     * Constructor UserOptionSaveAction
     * @param {boolean} success
     * @param {boolean} isLogout
     * @param {any} json?
     */
    function UserOptionSaveAction(success, isLogout, json) {
        /** changing the action type based on the logout parameter to emit dofferent actio for saving on logout and other save */
        if (isLogout) {
            _super.call(this, action.Source.View, actionType.USER_OPTION_SAVE_ON_LOGOUT, success);
        }
        else {
            _super.call(this, action.Source.View, actionType.USER_OPTION_SAVE, success);
        }
        /* formating audit log message */
        this._savedUserOption = json;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{useroption}/g, userOptionStore.instance.getUserOptions.toString());
    }
    Object.defineProperty(UserOptionSaveAction.prototype, "getSavedUserOption", {
        /**
         * for returning user options
         * @returns
         */
        get: function () {
            return this._savedUserOption;
        },
        enumerable: true,
        configurable: true
    });
    return UserOptionSaveAction;
}(dataRetrievalAction));
module.exports = UserOptionSaveAction;
//# sourceMappingURL=useroptionsaveaction.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var LoadContainerAction = (function (_super) {
    __extends(LoadContainerAction, _super);
    /**
     * Constructor
     * @param containerPage
     * @param isFromMenu
     * @param containerPageType
     * @param isFromSwitchUser
     */
    function LoadContainerAction(containerPage, isFromMenu, containerPageType, isFromSwitchUser) {
        _super.call(this, action.Source.View, actionType.CONTAINER_CHANGE_ACTION);
        this._containerPageType = enums.PageContainersType.None;
        this._containerPage = containerPage;
        this._isFromMenu = isFromMenu;
        this._containerPageType = containerPageType;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{containerpage}/g, this._containerPage.toString());
        this._isFromSwitchUser = isFromSwitchUser;
    }
    Object.defineProperty(LoadContainerAction.prototype, "containerPage", {
        /**
         * determine the page container
         */
        get: function () {
            return this._containerPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadContainerAction.prototype, "isFromMenu", {
        /**
         * determine if action is from menu
         */
        get: function () {
            return this._isFromMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadContainerAction.prototype, "containerPageType", {
        /**
         * determine the page container type
         */
        get: function () {
            return this._containerPageType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadContainerAction.prototype, "isFromSwitchUser", {
        /**
         * determine if action is from Switch User
         */
        get: function () {
            return this._isFromSwitchUser;
        },
        enumerable: true,
        configurable: true
    });
    return LoadContainerAction;
}(action));
module.exports = LoadContainerAction;
//# sourceMappingURL=loadcontaineraction.js.map
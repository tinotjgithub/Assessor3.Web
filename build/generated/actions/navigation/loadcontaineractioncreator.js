"use strict";
var dispatcher = require('../../app/dispatcher');
var promise = require('es6-promise');
var enums = require('../../components/utility/enums');
var LoadContainerAction = require('./loadcontaineraction');
var addToRecentHistoryAction = require('./addtorecenthistoryaction');
var LoadContainerActionCreator = (function () {
    function LoadContainerActionCreator() {
    }
    /**
     * Loading the container
     * @param containerPage
     * @param isFromMenu
     * @param containerPageType
     * @param isFromSwitchUser
     */
    LoadContainerActionCreator.prototype.loadContainer = function (containerPage, isFromMenu, containerPageType, isFromSwitchUser) {
        if (isFromMenu === void 0) { isFromMenu = false; }
        if (containerPageType === void 0) { containerPageType = enums.PageContainersType.None; }
        if (isFromSwitchUser === void 0) { isFromSwitchUser = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new LoadContainerAction(containerPage, isFromMenu, containerPageType, isFromSwitchUser));
        }).catch();
    };
    /**
     * Adding recent history
     * @param _historyItem
     */
    LoadContainerActionCreator.prototype.addToRecentHistory = function (_historyItem) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addToRecentHistoryAction(_historyItem));
        }).catch();
    };
    return LoadContainerActionCreator;
}());
var loadContainerActionCreator = new LoadContainerActionCreator();
module.exports = loadContainerActionCreator;
//# sourceMappingURL=loadcontaineractioncreator.js.map
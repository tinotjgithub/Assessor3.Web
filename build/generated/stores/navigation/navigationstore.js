"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var actionType = require('../../actions/base/actiontypes');
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var enums = require('../../components/utility/enums');
var breadCrumbItemInfo = require('../../utility/breadcrumb/breadcrumbiteminfo');
var Immutable = require('immutable');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
/**
 * Navigation store
 */
var NavigationStore = (function (_super) {
    __extends(NavigationStore, _super);
    /**
     * @constructor
     */
    function NavigationStore() {
        var _this = this;
        _super.call(this);
        this._doVisibleMenu = false;
        this._containerPageType = enums.PageContainersType.None;
        this._recentHistory = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.CONTAINER_CHANGE_ACTION:
                    var _loadContainerAction = action;
                    _this._previousContainerPage = _this._containerPage;
                    _this._containerPage = _loadContainerAction.containerPage;
                    _this.pushCurrentNavigationToCollection(_this._containerPage);
                    _this._isFromMenu = _loadContainerAction.isFromMenu;
                    _this._containerPageType = _loadContainerAction.containerPageType;
                    _this._isFromSwitchUser = _loadContainerAction.isFromSwitchUser;
                    _this.emit(NavigationStore.CONTAINER_CHANGE__EVENT);
                    break;
                case actionType.MENU_VISIBILITY_ACTION:
                    var _menuVisiblityAction = action;
                    _this._doVisibleMenu = _menuVisiblityAction.doVisibleMenu;
                    _this.emit(NavigationStore.MENU_VISIBILITY_EVENT, _this._doVisibleMenu);
                    break;
                case actionType.ADD_TO_RECENT_HISTORY:
                    var _addToRecentHistoryAction = action;
                    if (_addToRecentHistoryAction) {
                        _this.addToHistory(_addToRecentHistoryAction.historyItem);
                    }
                    break;
                case actionType.REMOVE_HISTORY_ITEM_ACTION:
                    var _removeHistoryItemAction_1 = action;
                    if (_removeHistoryItemAction_1.doRemoveTeamObject) {
                        var x = _this._recentHistory.find(function (d) { return d.qigId === _removeHistoryItemAction_1.qigId; });
                        x.team = undefined;
                        x.isTeamManagementEnabled = false;
                        x.timeStamp = Date.now();
                    }
                    else {
                        _this._recentHistory = _this._recentHistory.delete(_removeHistoryItemAction_1.qigId);
                    }
                    break;
            }
        });
    }
    /**
     * Add to history
     * @param worklistHistoryInfo
     */
    NavigationStore.prototype.addToHistory = function (_historyItem) {
        if (this._recentHistory.has(_historyItem.qigId)) {
            if (_historyItem.myMarking) {
                var x = this._recentHistory.find(function (d) { return d.qigId === _historyItem.qigId; });
                x.myMarking = _historyItem.myMarking;
                x.timeStamp = Date.now();
            }
            else if (_historyItem.team) {
                var x = this._recentHistory.find(function (d) { return d.qigId === _historyItem.qigId; });
                x.team = _historyItem.team;
                x.timeStamp = Date.now();
            }
        }
        else {
            if (this._recentHistory.size >= 3) {
                var _recentHistory = this.getRecentHistory;
                this._recentHistory = this._recentHistory.delete(_recentHistory.last().qigId);
            }
            this._recentHistory = this._recentHistory.set(_historyItem.qigId, _historyItem);
        }
    };
    /**
     * Push containers to the navigation collection
     * @param _containerPage
     */
    NavigationStore.prototype.pushCurrentNavigationToCollection = function (_containerPage) {
        var _breadCrumbItem = new breadCrumbItemInfo();
        _breadCrumbItem.container = _containerPage;
        this._currentBreadCrumb = _breadCrumbItem;
    };
    Object.defineProperty(NavigationStore.prototype, "containerPage", {
        /**
         * Get container page
         */
        get: function () {
            return this._containerPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "containerPageType", {
        /**
         * Get container page type
         */
        get: function () {
            return this._containerPageType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "doVisibleMenu", {
        /**
         * Get menu visibility
         */
        get: function () {
            return this._doVisibleMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "previousPage", {
        /**
         * Get previous page
         */
        get: function () {
            return this._previousContainerPage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "breadCrumbItem", {
        /**
         * Get BreadCrumbItem
         */
        get: function () {
            if (this._currentBreadCrumb) {
                return this._currentBreadCrumb;
            }
            else {
                return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "getRecentHistory", {
        get: function () {
            return Immutable.List(sortHelper.sort(this._recentHistory.toArray(), comparerList.MenuHistoryComparer));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "isFromMenu", {
        /**
         * Get is navigated from menu
         */
        get: function () {
            return this._isFromMenu;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationStore.prototype, "isFromSwitchUser", {
        /**
         * Get is navigated from Switch User
         */
        get: function () {
            return this._isFromSwitchUser;
        },
        enumerable: true,
        configurable: true
    });
    NavigationStore.CONTAINER_CHANGE__EVENT = 'ContainserChangeEvent';
    NavigationStore.MENU_VISIBILITY_EVENT = 'MenuVisibilityEvent';
    return NavigationStore;
}(storeBase));
var instance = new NavigationStore();
module.exports = { NavigationStore: NavigationStore, instance: instance };
//# sourceMappingURL=navigationstore.js.map
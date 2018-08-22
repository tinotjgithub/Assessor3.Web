import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import dispatcher = require('../../app/dispatcher');
import storeBase = require('../base/storebase');
import loadContainerAction = require('../../actions/navigation/loadcontaineraction');
import enums = require('../../components/utility/enums');
import breadCrumbItemInfo = require('../../utility/breadcrumb/breadcrumbiteminfo');
import menuVisibilityAction = require('../../actions/menu/menuvisibilityaction');
import worklistHistoryInfo = require('../../utility/breadcrumb/worklisthistoryinfo');
import addToRecentHistoryAction = require('../../actions/navigation/addtorecenthistoryaction');
import Immutable = require('immutable');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import responseModeChangeAction = require('../../actions/worklist/responsemodechangeaction');
import historyItem = require('../../utility/breadcrumb/historyitem');
import removeHistoryItemAction = require('../../actions/history/removehistoryitemaction');

/**
 * Navigation store
 */
class NavigationStore extends storeBase {
    private _recentHistory: Immutable.Map<number, historyItem>;
    private _containerPage: enums.PageContainers;
    private _previousContainerPage: enums.PageContainers;
    public static CONTAINER_CHANGE__EVENT = 'ContainserChangeEvent';
    public static MENU_VISIBILITY_EVENT = 'MenuVisibilityEvent';
    private _currentBreadCrumb: breadCrumbItemInfo;
    private _doVisibleMenu: boolean = false;
    private _isFromMenu: boolean;
    private _containerPageType: enums.PageContainersType = enums.PageContainersType.None;
    private _isFromSwitchUser: boolean;

    /**
     * @constructor
     */
    constructor() {
        super();
        this._recentHistory = Immutable.Map<number, historyItem>();
        this.dispatchToken = dispatcher.register((action: action) => {

            switch (action.actionType) {
                case actionType.CONTAINER_CHANGE_ACTION:
                    let _loadContainerAction = (action as loadContainerAction);
                    this._previousContainerPage = this._containerPage;
                    this._containerPage = _loadContainerAction.containerPage;
                    this.pushCurrentNavigationToCollection(this._containerPage);
                    this._isFromMenu = _loadContainerAction.isFromMenu;
                    this._containerPageType = _loadContainerAction.containerPageType;
                    this._isFromSwitchUser = _loadContainerAction.isFromSwitchUser;
                    this.emit(NavigationStore.CONTAINER_CHANGE__EVENT);
                    break;
                case actionType.MENU_VISIBILITY_ACTION:
                    let _menuVisiblityAction = (action as menuVisibilityAction);
                    this._doVisibleMenu = _menuVisiblityAction.doVisibleMenu;
                    this.emit(NavigationStore.MENU_VISIBILITY_EVENT, this._doVisibleMenu);
                    break;
                case actionType.ADD_TO_RECENT_HISTORY:
                    let _addToRecentHistoryAction = (action as addToRecentHistoryAction);
                    if (_addToRecentHistoryAction) {
                        this.addToHistory(_addToRecentHistoryAction.historyItem);
                    }
                    break;
                case actionType.REMOVE_HISTORY_ITEM_ACTION:
                    let _removeHistoryItemAction = action as removeHistoryItemAction;
                    if (_removeHistoryItemAction.doRemoveTeamObject) {
                        let x = this._recentHistory.find((d: historyItem) => d.qigId === _removeHistoryItemAction.qigId);
                        x.team = undefined;
                        x.isTeamManagementEnabled = false;
                        x.timeStamp = Date.now();
                    } else {
                        this._recentHistory = this._recentHistory.delete(_removeHistoryItemAction.qigId);
                    }
                    break;
            }
        });
    }

    /**
     * Add to history
     * @param worklistHistoryInfo
     */
    private addToHistory(_historyItem: historyItem): void {
        if (this._recentHistory.has(_historyItem.qigId)) {
            let x = this._recentHistory.find((d: historyItem) => d.qigId === _historyItem.qigId);
            x.timeStamp = Date.now();
            if (_historyItem.myMarking) {
                x.myMarking = _historyItem.myMarking;
            } else if (_historyItem.team) {
                x.team = _historyItem.team;
            } else if (_historyItem.standardisationSetup) {
                x.standardisationSetup = _historyItem.standardisationSetup;
            }
        } else {
            if (this._recentHistory.size >= 3) {
                let _recentHistory = this.getRecentHistory;
                this._recentHistory = this._recentHistory.delete(_recentHistory.last().qigId);
            }
            this._recentHistory = this._recentHistory.set(_historyItem.qigId, _historyItem);
        }
    }

    /**
     * Push containers to the navigation collection
     * @param _containerPage
     */
    private pushCurrentNavigationToCollection(_containerPage: enums.PageContainers): void {
        let _breadCrumbItem: breadCrumbItemInfo = new breadCrumbItemInfo();
        _breadCrumbItem.container = _containerPage;
        this._currentBreadCrumb = _breadCrumbItem;
    }

    /**
     * Get container page
     */
    public get containerPage(): enums.PageContainers {
        return this._containerPage;
    }

    /**
     * Get container page type
     */
    public get containerPageType(): enums.PageContainersType {
        return this._containerPageType;
    }

    /**
     * Get menu visibility
     */
    public get doVisibleMenu(): boolean {
        return this._doVisibleMenu;
    }

    /**
     * Get previous page
     */
    public get previousPage(): enums.PageContainers {
        return this._previousContainerPage;
    }

    /**
     * Get BreadCrumbItem
     */
    public get breadCrumbItem(): breadCrumbItemInfo {
        if (this._currentBreadCrumb) {
            return this._currentBreadCrumb;
        } else {
            return null;
        }
    }

    public get getRecentHistory() {
        return Immutable.List<historyItem>(sortHelper.sort(this._recentHistory.toArray(), comparerList.MenuHistoryComparer));
    }

    /**
     * Get is navigated from menu
     */
    public get isFromMenu(): boolean {
        return this._isFromMenu;
    }

    /**
     * Get is navigated from Switch User
     */
    public get isFromSwitchUser(): boolean {
        return this._isFromSwitchUser;
    }
}

let instance = new NavigationStore();
export = { NavigationStore, instance };
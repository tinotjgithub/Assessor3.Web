import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class LoadContainerAction extends action {
    private _containerPage: enums.PageContainers;
    private _isFromMenu: boolean;
    private _containerPageType: enums.PageContainersType = enums.PageContainersType.None;
    private _isFromSwitchUser: boolean;

    /**
     * Constructor
     * @param containerPage
     * @param isFromMenu
     * @param containerPageType
     * @param isFromSwitchUser
     */
    constructor(containerPage: enums.PageContainers,
        isFromMenu: boolean,
        containerPageType: enums.PageContainersType,
        isFromSwitchUser: boolean) {
        super(action.Source.View, actionType.CONTAINER_CHANGE_ACTION);
        this._containerPage = containerPage;
        this._isFromMenu = isFromMenu;
        this._containerPageType = containerPageType;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{containerpage}/g, this._containerPage.toString());
        this._isFromSwitchUser = isFromSwitchUser;
    }

    /**
     * determine the page container
     */
    public get containerPage(): enums.PageContainers {
        return this._containerPage;
    }

    /**
     * determine if action is from menu
     */
    public get isFromMenu(): boolean {
        return this._isFromMenu;
    }

    /**
     * determine the page container type
     */
    public get containerPageType(): enums.PageContainersType {
        return this._containerPageType;
    }

    /**
     * determine if action is from Switch User
     */
    public get isFromSwitchUser(): boolean {
        return this._isFromSwitchUser;
    }

}

export = LoadContainerAction;
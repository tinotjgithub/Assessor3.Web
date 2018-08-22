import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UserInfoClickAction extends action {

    private _UserInfoPanelOpen: boolean;

    /**
     * Constructor UserInfoClickAction
     * @param userInfoPanelOpen
     */
    constructor(userInfoPanelOpen: boolean) {
        super(action.Source.View, actionType.USER_INFO_CLICK_ACTION);
        if (userInfoPanelOpen) {
            this.auditLog.logContent = this.auditLog.logContent.replace('{0}', userInfoPanelOpen.toString());
        }
        this._UserInfoPanelOpen = userInfoPanelOpen;
    }

    public get isUserInfoPanelOpen(): boolean {
        return this._UserInfoPanelOpen;
    }
}
export = UserInfoClickAction;
import dispatcher = require('../../app/dispatcher');
import storeBase = require('../base/storebase');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import userInfoAction = require('../../actions/userinfo/userinfoaction');
import userInfoClickAction = require('../../actions/userinfo/userinfoclickaction');
import userInfoArgument = require('../../dataservices/user/userinfoargument');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import userInfoSaveAction = require('../../actions/userinfo/userinfosaveaction');
import toggleUserInfoAction = require('../../actions/userinfo/toggleuserinfoaction');
import enums = require('../../components/utility/enums');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import resetDoLoadWorklistStatusAction = require('../../actions/marking/resetdoloadworkliststatusaction');
import loadContainerAction = require('../../actions/navigation/loadcontaineraction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');

/**
 * Class for holding user information
 * @returns
 */
class UserInfoStore extends storeBase {

    // The username
    private username: string;
    // The email address of user name
    private emailAddress: string;
    // Get formated output
    private formattedExaminerName: string;
    private userInfoPanelOpen: boolean;
    private _operationMode: enums.MarkerOperationMode = enums.MarkerOperationMode.Marking;
    private _doLoadCurrentExaminerWorklist: boolean = false;
	private _isReportsPageSelected: boolean = false;
	private _isScriptAvailabilityEmailAlert: boolean;

    /**
     *  Intializing a new instance of User Info store.
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.USERINFO:
                    let userInfo: userInfoAction = (action as userInfoAction);
                    if (userInfo.success && userInfo.UserInfo.UserName) {
                        this.username = userInfo.UserInfo.UserName;
                        this.emailAddress = userInfo.UserInfo.Email;
						this.formattedExaminerName = this.getFormattedName(userInfo.UserInfo);
						this._isScriptAvailabilityEmailAlert = userInfo.UserInfo.IsEligibleForScriptAvailableEmailAlert;
                        this.emit(UserInfoStore.USERINFO_EVENT);
                    }
                    break;
                case actionType.USERINFO_SAVE:
                    if ((action as userInfoSaveAction).getSaveSuccess) {
                        this.emailAddress = (action as userInfoSaveAction).getExaminerInfo.emailAddress;
                        this.emit(UserInfoStore.USERINFO_SAVE);
                    }
                    break;
                case actionType.TOGGLE_USER_INFO_PANEL:
                    this.emit(UserInfoStore.TOGGLE_USER_INFO_PANEL, (action as toggleUserInfoAction).saveUserOptionData);
                    break;
                case actionType.USER_INFO_CLICK_ACTION:
                    this.userInfoPanelOpen = (action as userInfoClickAction).isUserInfoPanelOpen;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this._operationMode = markerOperationMode.operationMode;
                    this._doLoadCurrentExaminerWorklist = markerOperationMode.doLoadCurrentExaminerWorklist;
                    let isFromMenu: boolean = markerOperationMode.isFromMenu;
                    this.emit(UserInfoStore.MARKER_OPERATION_MODE_CHANGED, this.currentOperationMode,
                        this.doLoadCurrentExaminerWorklist, isFromMenu);
                    break;
                case actionType.RESET_DO_LOAD_WORKLIST_STATUS_ACTION:
                    this._doLoadCurrentExaminerWorklist = (action as resetDoLoadWorklistStatusAction).doLoadCurrentExaminerWorklist;
                    break;
                case actionType.SHOW_LOGOUT_POPUP_ACTION:
                    this.emit(UserInfoStore.SHOW_LOGOUT_POPUP_EVENT);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    let _loadContainerAction = (action as loadContainerAction);
                    if (_loadContainerAction.containerPage === enums.PageContainers.Reports) {
                        this._isReportsPageSelected = true;
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;

                    if (responseDataGetAction.searchedResponseData) {
                        // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                        // So set the operation mode. Set marking in case of Supervisor Remark navigation
                        if (responseDataGetAction.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                            this._operationMode = enums.MarkerOperationMode.Marking;
                        } else if (responseDataGetAction.searchedResponseData.isTeamManagement) {
                            this._operationMode = enums.MarkerOperationMode.TeamManagement;
                        } else if (responseDataGetAction.searchedResponseData.isStandardisationSetup) {
                            this._operationMode = enums.MarkerOperationMode.StandardisationSetup;
                        }
                    }
                    break;
                case actionType.SWITCH_USER_BUTTON_CLICK:
                    this.emit(UserInfoStore.SWITCH_USER_BUTTON_CLICK);
                    break;
            }
        });
    }

    // User info name
    public static USERINFO_EVENT = 'userinfoupdated';

    public static USERINFO_SAVE = 'userinfosave';

    public static TOGGLE_USER_INFO_PANEL = 'toggleuserinformationpanel';

    public static MARKER_OPERATION_MODE_CHANGED = 'markerOperationModeChanged';

    public static SHOW_LOGOUT_POPUP_EVENT = 'ShowLogoutPopupAction';

    public static SWITCH_USER_BUTTON_CLICK = 'SwitchUserButtonClick';

    /**
     * Get the logged in user name
     * @returns Formatted user name
     */
    public get UserName(): string {
        return this.username;
    }
    /**
     * Gets the email address of the user name.
     * @returns the user name
     */
    public get EmailAddress(): string {
        return this.emailAddress;
    }

    /**
     * Get examiner name
     * @returns
     */
    public get ExaminerName(): string {
        return this.formattedExaminerName;
    }

    /*
    * gets user info panel open or closed.
    */
    public get isUserInfoPanelOpen(): boolean {
        return this.userInfoPanelOpen;
    }

    /**
     * Returns the current operation mode.
     */
    public get currentOperationMode(): enums.MarkerOperationMode {
        return this._operationMode;
    }

    /**
     *  Returns the status whether to load examiner worklist or dont
     */
    public get doLoadCurrentExaminerWorklist(): boolean {
        return this._doLoadCurrentExaminerWorklist;
    }

    /**
     *  Returns whether the user has selected the reports page or not
     */
    public get isReportsPageSelected(): boolean {
        return this._isReportsPageSelected;
	}

	/**
	 * Return whether the current examiner has eligibility to set the script availability email user option
	 */
	public get IsScriptAvailabilityEmailAlert(): boolean {
		return this._isScriptAvailabilityEmailAlert;
	}

    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    private getFormattedName(userInforArg: userInfoArgument): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', userInforArg.Initials);
        formattedString = formattedString.replace('{surname}', userInforArg.Surname);
        return formattedString;
    }
}

let instance = new UserInfoStore();
export = { UserInfoStore, instance };
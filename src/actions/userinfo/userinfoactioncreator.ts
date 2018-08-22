import dispatcher = require('../../app/dispatcher');
import userInfoAction = require('./userinfoaction');
import userInfoArgument = require('../../dataservices/user/userinfoargument');
import userDataService = require('../../dataservices/user/userdataservice');
import userInfoSaveAction = require('./userinfosaveaction');
import toggleUserInfoAction = require('./toggleuserinfoaction');
import userInfoClickAction = require('./userInfoClickAction');
import actionType = require('../base/actiontypes');
import Promise = require('es6-promise');
import actionCreatorBase = require('../base/actioncreatorbase');
import enums = require('../../components/utility/enums');
import markerOperationModeChangedAction = require('./markeroperationmodechangedaction');
import resetDoLoadWorklistStatusAction = require('../marking/resetdoloadworkliststatusaction');
import menuVisibilityAction = require('../menu/menuvisibilityaction');
import showLogoutPopupAction = require('../logout/showlogoutpopupaction');
import switchUserButtonClickAction = require('./switchuserbuttonclickaction');
/**
 * Class for poopulating user information
 */
class UserInfoActionCreator extends actionCreatorBase {

    /**
     * Populate logged in user information.
     */
	public GetLoggedUserInfo(): void {

		let that = this;
		userDataService.GetUserInformation(function (success: boolean, json: any) {

			// This will validate the call to find any network failure
			// and is mandatory to add this.
			that.validateCall(json, false, true);
			let userInfo = new userInfoArgument(json.Initials, json.Surname, json.EmailAddress, json.UserName,
				json.IsEligibleForScriptAvailableEmailAlert);
			dispatcher.dispatch(new userInfoAction(true, userInfo));
		});
	}

    /**
     * Saving email
     * @param {ExaminerEmailArgument} examinerEmailArgument
     */
    public SaveEmailAddress(examinerEmailArgument: ExaminerEmailArgument): void {

        let that = this;
        userDataService.SaveEmailAddress((examinerEmailArgument), function (success: boolean, json?: any) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                dispatcher.dispatch(new userInfoSaveAction(success, examinerEmailArgument));
            }
        });
    }

    /**
     * Toggle user information panel.
     */
    public ToggleUserInfoPanel(saveUserOptionData: boolean = true): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new toggleUserInfoAction(actionType.TOGGLE_USER_INFO_PANEL, saveUserOptionData));
        }).catch();
    }

    /**
     * user info panel clicked.
     */
    public userInfoClicked(isUserInfoOpen: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new userInfoClickAction(isUserInfoOpen));
        }).catch();
    }

    /**
     * Operation mode changing action called
     * @param operationMode
     */
    public changeOperationMode(operationMode: enums.MarkerOperationMode, doLoadCurrentExaminerWorklist: boolean = false,
        isFromMenu: boolean = false): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markerOperationModeChangedAction(operationMode, doLoadCurrentExaminerWorklist, isFromMenu));
        }).catch();
    }

    /**
     * changes the visibility of menu Wrapper
     */
    public changeMenuVisibility(doVisible: boolean = true) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new menuVisibilityAction(doVisible));
        }).catch();
    }

   /**
    * displays the logout confirmation popup
    */
    public showLogoutPopup() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showLogoutPopupAction());
        }).catch();
    }

    /**
     * Reset LoadWorklist status
     * @param doLoadCurrentExaminerWorklist
     */
    public resetDoLoadWorklistStatus(doLoadCurrentExaminerWorklist: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetDoLoadWorklistStatusAction(doLoadCurrentExaminerWorklist));
        }).catch();
    }

    /**
     * Handle the Switch User Button Click
     */
    public onSwitchUserButtonClick() {
    new Promise.Promise(function (resolve: any, reject: any) {
        resolve();
    }).then(() => {
        dispatcher.dispatch(new switchUserButtonClickAction());
    }).catch();
    }
}
let useractioncreator = new UserInfoActionCreator();
export = useractioncreator;
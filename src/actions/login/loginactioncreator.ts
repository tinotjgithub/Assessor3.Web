import dispatcher = require('../../app/dispatcher');
import loginAction = require('./loginaction');
import authenticationDataService = require('../../dataservices/authentication/authenticationdataservice');
import familiarisationDataService = require('../../dataservices/familirisation/familiarisationdataservice');
import familarisationAction = require('../familarisation/familiarisationaction');
import selectExaminerAction = require('../adminsupport/selectexamineraction');
import supportloginAction = require('../adminsupport/supportloginaction');
import Promise = require('es6-promise');
declare let config: any;
/**
 * Login action creator helper class
 */
class LoginActionCreator {

    /**
     * Call the authentication service and then generate an appropriate login action
     * @param userName
     * @param password
     * @param isFamiliarisationLogin
     */
    public login(userName: string, password: string,
        isFamiliarisationLogin: boolean,
        selectedlaunguage: string): void {
        let that = this;
        authenticationDataService.authenticate(userName, password, isFamiliarisationLogin,
            function (success: boolean,
                isAdvancedFamilarisationEnabled: boolean,
                isReportsVisible: boolean,
                isAdminRemarker: boolean,
                isMarkerPasswordManagementEnabled: boolean,
                passwordChangeKey: string,
                isAdminLogin: boolean,
                json?: any) {
                if (isMarkerPasswordManagementEnabled && passwordChangeKey && success) {
                    // when password change key exists redirects to new url.
                    that.openPasswordManagemanetUrl(passwordChangeKey, userName, selectedlaunguage, isFamiliarisationLogin);
                } else {
                    // Dispatch the login action once the authentication call completes
                    dispatcher.dispatch(new loginAction(success, userName, isAdvancedFamilarisationEnabled,
                        isReportsVisible, isAdminRemarker, isFamiliarisationLogin, isAdminLogin, json));
                }
            });
    }

    /**
     * To check whether the redirect request is authenticated or not.
     * @param isFamiliarisationLogin
     */
    public isAuthenticate(isFamiliarisationLogin: boolean): void {

        authenticationDataService.reAuthenticate(
            isFamiliarisationLogin,
            function (success: boolean,
                isAdvancedFamilarisationEnabled: boolean,
                isReportsVisible: boolean,
                isAdminRemarker: boolean,
                userName: string,
                isAdminSupportEnabled: boolean,
                json?: any) {
                // Dispatch the login action once the authentication call completes
                dispatcher.dispatch(new loginAction(success, userName, isAdvancedFamilarisationEnabled,
                    isReportsVisible, isAdminRemarker, isFamiliarisationLogin, isAdminSupportEnabled, json));
            });
    }


    /**
     * create the components in database
     */
    public setUpFamilarisationData(): void {
        familiarisationDataService.setUpFamilarisationData(function (success: boolean, isFamComponentsCreated: boolean) {
            // Dispatch the action once the action completes
            dispatcher.dispatch(new familarisationAction(success, isFamComponentsCreated));
        });
    }

    /**
     * Redirect assessor to change email and password management url
     * @param passwordChangeKey
     * @param username
     */
    private openPasswordManagemanetUrl(passwordChangeKey: string, username: string, selectedlaunguage: string,
        isFamilirisationLogin: boolean): void {
        let queryString: string = config.general.PASSWORD_RESET_URL
            + '?pckey=' + passwordChangeKey + '&'
            + 'mode=activation&'
            + 'returnurl=' + config.general.SERVICE_BASE_URL + '\index.html?isPasswordResetSuccess=true?isFamiliarisationLogin='
            + isFamilirisationLogin + '&'
            + 'username=' + username + '&'
            + 'app=a3&'
            + 'culture=' + selectedlaunguage;
        window.open(queryString, '_self');
    }

    /**
     * Redirect assessor to suppport login action
     * @param userName
     * @param userId
     */
    public supportLogin(userName: string, userId: number) {
        authenticationDataService.supportAdminAuthenticate(userName, userId,
            function (success: boolean, isAdvancedFamilarisationEnabled: boolean,
                isReportsVisible: boolean,
                isAdminRemarker: boolean,
                isMarkerPasswordManagementEnabled: boolean,
                passwordChangeKey: string,
                json?: any) {
                // Dispatch the login action once the authentication call completes
                dispatcher.dispatch(new supportloginAction(success, userName, false,
                    isReportsVisible, isAdminRemarker, false, json));

            });
    }

    /**
     * select examiner in support enviornment
     * @param examinerId
     */
    public selectExaminer(examinerId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new selectExaminerAction(examinerId));
        }).catch();
    }
}

let loginActionCreator = new LoginActionCreator();
export = loginActionCreator;
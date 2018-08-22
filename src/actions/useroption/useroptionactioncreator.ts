import dispatcher = require('../../app/dispatcher');
import userOptionGetAction = require('./useroptiongetaction');
import userOptionSaveAction = require('./useroptionsaveaction');
import userDataService = require('../../dataservices/user/userdataservice');
import userOptionData = require('../../stores/useroption/typings/useroptiondata');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import rememberQigInfo = require('../../stores/useroption/typings/rememberqig');
import setRememberQigAction = require('./setrememberqigaction');
import enums = require('../../components/utility/enums');

/**
 * UserOptionActionCreator class
 */
class UserOptionActionCreator extends base {

    /**
     *   For fetching user options
     */
    public getUserOptions(useCache: boolean = false): void {

        let that = this;

        // User options retrieve dataservice call
        userDataService.retrieveUserOptions(function (success: boolean, userOption: any) {

            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(userOption)) {
                dispatcher.dispatch(new userOptionGetAction(success, userOption));
            }
        },
            useCache);
    }

    /**
     * For saving user options
     */
    public saveUserOptions(userOptionsJson: userOptionData, isLogout: boolean = false, isOffLineMessageShow: boolean = true): void {

        let that = this;

        /* User option save dataservice call.*/
        userDataService.saveUserOptions(userOptionsJson, function (success: boolean, json?: any) {

            // This will validate the call to find any network failure
            // and is mandatory to add this. The validation is needed only when user is trying to logout.
            // The offline error popup need not be thrown when the save useroption call breaks.
            isOffLineMessageShow = isLogout;
            if (that.validateCall(json, false, isOffLineMessageShow, enums.WarningMessageAction.None, isLogout)) {
                dispatcher.dispatch(new userOptionSaveAction(success, isLogout, userOptionsJson));
            }
        });
    }

    /**
     * For updating selected qig details in store
     */
    public updateSelectedQigDetails(_rememberQigInfo: rememberQigInfo): Promise<any> {
        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setRememberQigAction(_rememberQigInfo));
        }).catch();
    }
}

let userOptionActionCreator = new UserOptionActionCreator();
/* exporting an instance of UserOptionActionCreator */
export = userOptionActionCreator;
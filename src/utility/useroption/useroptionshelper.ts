import qigStore = require('../../stores/qigselector/qigstore');
import userOptionStore = require('../../stores/useroption/useroptionstore');
import userOptionData = require('../../stores/useroption/typings/useroptiondata');
import userOptionRecord = require('../../stores/useroption/useroptionrecord');
import userOptionDataRecord = require('../../stores/useroption/useroptiondatarecord');
import Immutable = require('immutable');
import loginSession = require('../../../src/app/loginsession');
import userOptionsActionCreator = require('../../actions/useroption/useroptionactioncreator');
import userOptionKeys = require('./useroptionkeys');
import enums = require('../../components/utility/enums');
import userInfoStore = require('../../stores/userinfo/userinfostore');
declare let config: any;

/**
 * Helper class for sorting of an array of any objecys
 */
class UserOptionsHelper {
    /**
     * This list stores the user option changes locally
     */
    private static userOptionsDelta: userOptionData;
    private static userOptionsExaminerRoleDelta: Array<userOptionData>;
    private static customisedStampsInQIGs: Array<number> = new Array();

    /**
     * Saves the user options whether examiner/examinerRole , immediate/not
     * @param {string} userOptionKey user option key
     * @param {string} userOptionValue value of the user option
     * @param {boolean} immediate save immediately to DB
     * @param {number} examinerRoleId Level of the user option to save
     */
    public static save(userOptionKey: string,
                        userOptionValue: string,
                        immediate: boolean = false,
                        isExaminerRole: boolean = false,
                        isLogout: boolean = false,
                        isOffLineMessageShow: boolean = true,
		                examinerRoleId: number = 0): void {

        if (immediate) {
            // the change needs to be saved immediately to DB
			userOptionsActionCreator.saveUserOptions(
				this.createUserOptionList(userOptionKey, userOptionValue, isExaminerRole, examinerRoleId),
                isLogout, isOffLineMessageShow);
        }

        // the change will be saved only during Logout
        if (isExaminerRole) {
            // This is an examiner role level user option
            this.updateUserOptionsForExaminerRole(userOptionKey, userOptionValue, examinerRoleId);
        } else {
            // This is an examiner level user option
            this.updateUserOptionValue(userOptionKey, userOptionValue);
        }
    }

    /**
     * Returns user options based on userOptionKey. This wil check for the changed user action as well as the one in store.
     * @param {string} userOptionKey
     * @returns
     */
    public static getUserOptionByName(userOptionKey: string, examinerRoleId?: number): string {
        return this.getUserOptionByNameAndKey(userOptionKey, 'value', examinerRoleId);
    }

    /**
     * To initaiate the save action and reset the local user option collection
     */
    public static InitiateSaveUserOption(isLogout: boolean) {

        if (this.userOptionsExaminerRoleDelta &&
            this.userOptionsExaminerRoleDelta.length > 0 &&
			qigStore.instance.getSelectedQIGForTheLoggedInUser) {

			this.userOptionsExaminerRoleDelta.forEach((userOption: userOptionData) => {
				userOptionsActionCreator.saveUserOptions(userOption, isLogout);
			});
        }

        if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
            userOptionsActionCreator.saveUserOptions(this.userOptionsDelta, isLogout);
        }

        /** resetting the locally stored user option collection */
        this.resetChangedUserOptions();
    }

    /**
     * User options changes
     */
    public static get hasUserOptionsChanged(): boolean {
        if ((this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0)
            || (this.userOptionsExaminerRoleDelta && this.userOptionsExaminerRoleDelta.length > 0)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * function reset the tokens of current login session
     */
    public static resetTokensAndRedirect() {
        loginSession.IS_AUTHENTICATED = false;
        ////loginSession.SECURITY_TOKEN = null;
        ////loginSession.REFRESH_TOKEN = null;
        ////loginSession.TOKEN_TIME_STAMP = 0;
        loginSession.MARKING_SESSION_TRACKING_ID = null;
        loginSession.SESSION_IDENTIFIER = undefined;
        // This will clear the memory.
        window.location.replace(config.general.SERVICE_BASE_URL);
    }

    /**
     * Check whether the examiner has customised the stamps in the current QIG
     */
    public static hasExaminerCustomisedTheStamps() {
        return this.customisedStampsInQIGs.indexOf(qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) >= 0;
    }


    /**
     * Creates a new user option record and returns a list
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    private static createUserOptionRecord(userOptionKey: string, userOptionValue: string): userOptionRecord {
        let jsonItem = new userOptionRecord();
        jsonItem.userOptionID = UserOptionsHelper.getUserOptionID(userOptionKey);
        jsonItem.userOptionName = userOptionKey;
        jsonItem.isOverridablebyExaminer = UserOptionsHelper.getUserOptionIsOverridablebyExaminer(userOptionKey);
        jsonItem.value = userOptionValue;
        return jsonItem;
    }

    /**
     * Creates a new user option record and returns a list
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    private static createUserOptionList(
        userOptionKey: string,
        userOptionValue: string,
		isExaminerRole: boolean,
		examinerRoleId: number = 0): userOptionData {
        let jsonItem = new userOptionRecord();
        jsonItem = this.createUserOptionRecord(userOptionKey, userOptionValue);

        let userOptionList: Immutable.List<userOptionRecord> = Immutable.List<userOptionRecord>();
        userOptionList = userOptionList.push(jsonItem);

        let userOptionCreated: userOptionData = new userOptionDataRecord();
        userOptionCreated.userOptions = userOptionList;
        userOptionCreated.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;

		if (isExaminerRole) {
			if (examinerRoleId === 0) {
				userOptionCreated.examinerRoleId = qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
			} else {
				userOptionCreated.examinerRoleId = examinerRoleId;
			}
        }

        return userOptionCreated;
    }


    /**
     * Update user option values based on userOptionKey
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    private static updateUserOptionValue(userOptionKey: string, userOptionValue: string): void {
        let isNew: boolean;
        isNew = true;
        if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
            /** Updating if the option is already changed and not saved */
            this.userOptionsDelta.userOptions.map(function (item: any) {
                if (item.userOptionName === userOptionKey) {
                    item.value = userOptionValue;
                    isNew = false;
                }
            });
        }
        if (isNew) {
            /** Adding the changed option to local collection for save */
            if (!this.userOptionsDelta) {
                this.userOptionsDelta = new userOptionDataRecord();
                this.userOptionsDelta.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;
            }
            if (!this.userOptionsDelta.userOptions) {
                /** initiating a new collection if the local collection is undefined */
                this.userOptionsDelta.userOptions = Immutable.List<userOptionRecord>();
            }
            this.userOptionsDelta.userOptions = this.userOptionsDelta.userOptions.push
                (this.createUserOptionRecord(userOptionKey, userOptionValue));
        }
    }

    /**
     * This method will update the user options for examiner roleId.
     * @param examinerRoleId
     * @param userOptionKey
     * @param userOptionValue
     */
	private static updateUserOptionsForExaminerRole(userOptionKey: string, userOptionValue: string,
		examinerRoleId: number): void {

		let isNew: boolean = true;

		// if examinerRoleId is not passed, then use the logged In user’s examinerroleid against currently selected QIG
		if (examinerRoleId === 0) {
			examinerRoleId = qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
		}

        // If the User customised the Stamps, add the role Id to the collection for skipping the logic later.
        if (userOptionKey === userOptionKeys.REMEMBER_CHOSEN_STAMPS && this.customisedStampsInQIGs.indexOf(examinerRoleId) < 0) {
            this.customisedStampsInQIGs.push(examinerRoleId);
        }
        // if the useroption value is empty and we have already push the examiner role in customisedStampsInQIGs array 
        // then popuout that eaxminerrole id from collection for auto - populating the stamps in fav panel.
        if (userOptionKey === userOptionKeys.REMEMBER_CHOSEN_STAMPS &&
            this.customisedStampsInQIGs.indexOf(examinerRoleId) >= 0 && userOptionValue === ''){
            this.customisedStampsInQIGs.splice(this.customisedStampsInQIGs.indexOf(examinerRoleId), 1);
        }

        if (this.userOptionsExaminerRoleDelta) {
            let userOptionForExaminerRoleId: userOptionData = this.userOptionsExaminerRoleDelta.filter(
                (x: userOptionData) => x.examinerRoleId === examinerRoleId)[0];
            if (userOptionForExaminerRoleId && userOptionForExaminerRoleId.userOptions.count() > 0) {
                /** Updating if the user option, if it is changed */
                userOptionForExaminerRoleId.userOptions.map(function (item: any) {
                    if (item.userOptionName === userOptionKey) {
                        item.value = !userOptionValue ? '' : userOptionValue;
                        isNew = false;
                    }
                });
            }
        }

        if (isNew && userOptionValue) {

            // initialise userOptionsForExaminerRole variable if it is undefined or null
            if (!this.userOptionsExaminerRoleDelta) {
                this.userOptionsExaminerRoleDelta = new Array<userOptionData>();
            }

            // If entry is not available against examiner role Id then we will push new item to array.
            let userOptionsForExaminerRoleId: userOptionData = this.userOptionsExaminerRoleDelta.filter(
                (x: userOptionData) => x.examinerRoleId === examinerRoleId)[0];
            if (!userOptionsForExaminerRoleId) {
                userOptionsForExaminerRoleId = new userOptionDataRecord();
                userOptionsForExaminerRoleId.trackingId = loginSession.MARKING_SESSION_TRACKING_ID;
                userOptionsForExaminerRoleId.examinerRoleId = examinerRoleId;
                this.userOptionsExaminerRoleDelta.push(userOptionsForExaminerRoleId);
            }

            // push the user option item.
            let indexOfItem = this.userOptionsExaminerRoleDelta.indexOf(userOptionsForExaminerRoleId);
            let userOptions = (userOptionsForExaminerRoleId.userOptions) ? userOptionsForExaminerRoleId.userOptions.toArray() : [];
            userOptions.push(this.createUserOptionRecord(userOptionKey, userOptionValue));
            this.userOptionsExaminerRoleDelta[indexOfItem].userOptions = Immutable.List(userOptions);
        }
    }

    /**
     * to reset the changed user options collection.
     */
    private static resetChangedUserOptions() {
        this.userOptionsDelta = undefined;
    }

    /**
     * Returns user options based on userOptionKey
     * @param {string} userOptionKey
     * @returns
     */
    private static getUserOptionID(userOptionKey: string, examinerRoleId?: number): number {
        return this.getUserOptionByNameAndKey(userOptionKey, 'userOptionID', examinerRoleId);
    }

    /**
     * Returns user options based on userOptionKey
     * @param {string} userOptionKey
     * @returns
     */
    private static getUserOptionIsOverridablebyExaminer(userOptionKey: string, examinerRoleId?: number): boolean {
        return this.getUserOptionByNameAndKey(userOptionKey, 'isOverridablebyExaminer', examinerRoleId);
    }

    /**
     * Returns the value of a json key in useroptions json
     * @param userOptionKey
     * @param jsonKey - UserOptionId, UserOptionvalue etc
     */
    private static getUserOptionByNameAndKey(userOptionKey: string, jsonKey: string, examinerRoleId?: number): any {
        let userOptionValue;
        let isUserOptionChanged: boolean = false;

        if (!examinerRoleId) {
            /** if the local collection is not empty checking for the value of user option in locla collection */
            if (this.userOptionsDelta && this.userOptionsDelta.userOptions.count() > 0) {
                this.userOptionsDelta.userOptions.map(function (item: any) {
                    if (item.userOptionName === userOptionKey) {
                        userOptionValue = item[jsonKey];
                        isUserOptionChanged = true;
                    }
                });
            }
            /** if the value of user option is not there in local collection check for the same in the collection available in store */
            if (isUserOptionChanged === false) {
                let _userOptions = (userOptionStore.instance) ? userOptionStore.instance.getUserOptions : undefined;

                if (_userOptions) {
                    _userOptions.userOptions.map(function (item: any) {
                        if (item.userOptionName === userOptionKey) {
                            userOptionValue = item[jsonKey];
                        }
                    });
                }
            }
        } else {
            /** if the local collection is not empty checking for the value of user option in local collection */
            if (this.userOptionsExaminerRoleDelta) {
                let userOptionsForExaminerRoleId: userOptionData = this.userOptionsExaminerRoleDelta.filter
                    ((x: userOptionData) => x.examinerRoleId === examinerRoleId)[0];
                if (userOptionsForExaminerRoleId && userOptionsForExaminerRoleId.userOptions.count() > 0) {
                    userOptionsForExaminerRoleId.userOptions.map(function (item: any) {
                        if (item.userOptionName === userOptionKey) {
                            userOptionValue = item[jsonKey];
                            isUserOptionChanged = true;
                        }
                    });
                }
            }
            /** if the value of user option is not there in local collection check for the same in the collection available in the store */
            if (isUserOptionChanged === false) {
                let _userOptions = (userOptionStore.instance) ? userOptionStore.instance.getUserOptions : undefined;
                if (_userOptions) {
                    _userOptions.userOptions.map(function (item: any) {
                        if (item.userOptionName === userOptionKey && item.examinerRoleId === examinerRoleId) {
                            userOptionValue = item[jsonKey];
                        }
                    });
                }
            }
        }

        return userOptionValue;
    }

    /**
     *  This method will return the user options for current examiner role based on the current examinerId
     */
    private static get userOptionForCurrentExaminerRole(): userOptionData {
        return this.userOptionsExaminerRoleDelta.filter
            ((x: userOptionData) => x.examinerRoleId === qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId)[0];
    }
}

export = UserOptionsHelper;
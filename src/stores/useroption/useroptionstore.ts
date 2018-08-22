import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import userOptionGetAction = require('../../actions/useroption/useroptiongetaction');
import userOptionSaveAction = require('../../actions/useroption/useroptionsaveaction');
import userOptionData = require('./typings/useroptiondata');

class UseroptionStore extends storeBase {
    private success: boolean;
    public static USER_OPTION_GET_EVENT = 'UserOptionGet';
    public static USER_OPTION_SAVE_EVENT = 'UserOptionSaveEvent';
    public static USER_OPTION_SAVE_ON_LOGOUT_EVENT = 'UserOptionSaveOnLogoutEvent';
    private saveStatusCode: number;
    private saveErrorMessage: string;
    private saveSuccess: boolean;
    private userOptions: userOptionData;
    private _isLoaded: boolean = false;

    /**
     * Constructor for Useroptions store
     */
    constructor() {
        super();

        /** Emiting after retrieving user options */
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.USER_OPTION_GET:
                    this.success = (action as userOptionGetAction).success;
                    if (this.success) {
                        this._isLoaded = true;
                        this.userOptions = (action as userOptionGetAction).getUserOptions;
                        this.emit(UseroptionStore.USER_OPTION_GET_EVENT);
                    }
                    break;
                case actionType.USER_OPTION_SAVE:
                    this.saveSuccess = (action as userOptionSaveAction).success;
                    /** Getting saved user option */
                    let savedUserOption: userOptionData = (action as userOptionSaveAction).getSavedUserOption;
                    this.saveStatusCode = (action as userOptionSaveAction).getStatusCode;
                    this.saveErrorMessage = (action as userOptionSaveAction).getErrorMessage;
                    /** Updating local user option with saved user option */
                    savedUserOption.userOptions.forEach((userOption: any) => {
                        this.updateUserOptionValue(userOption.userOptionName, userOption.value,
                            savedUserOption.examinerRoleId ? savedUserOption.examinerRoleId : 0);
                    });

                    this.emit(UseroptionStore.USER_OPTION_SAVE_EVENT);
                    break;
                case actionType.USER_OPTION_SAVE_ON_LOGOUT:
                    this.saveSuccess = (action as userOptionSaveAction).success;
                    this.emit(UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT);
                    break;
            }
        });
    }

    /**
     * Update user option values based on userOptionKey
     * @param {string} userOptionKey
     * @param {string} userOptionValue
     * @returns
     */
    private updateUserOptionValue(userOptionKey: string, userOptionValue: string, examinerRoleId: number): void {
        if (this.userOptions && this.userOptions.userOptions.count() > 0) {
            this.userOptions.userOptions.map(function (item: any) {
                if (item.userOptionName === userOptionKey && item.examinerRoleId === examinerRoleId) {
                    item.value = userOptionValue;
                }
            });
        }
    }

   /**
    * Returns user option JSON
    * @returns
    */
    public get getUserOptions(): userOptionData {
        return this.userOptions;
    }

    /**
     * Returns save success value
     * @returns
     */
    public get getSaveSuccess(): boolean {
        return this.saveSuccess;
    }

    /**
     * Retrns save status code
     * @returns
     */
    public get getSaveStatusCode(): number {
        return this.saveStatusCode;
    }

    /**
     * Retrns save Error message
     * @returns
     */
    public get getSaveErrorMessage(): string {
        return this.saveErrorMessage;
    }

    /**
     * Returns whether store loaded
     */
    public get isLoaded(): boolean {
        return this._isLoaded;
    }
}

let instance = new UseroptionStore();
export = { UseroptionStore, instance };
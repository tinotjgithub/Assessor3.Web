import dispatcher = require('../../app/dispatcher');
import Action = require('../../actions/base/action');
import LoginAction = require('../../actions/login/loginaction');
import storeBase = require('../base/storebase');
import ActionType = require('../../actions/base/actiontypes');
import SelectExaminerAction = require('../../actions/adminsupport/selectexamineraction');
import supportLoginAction = require('../../actions/adminsupport/supportloginaction');

/**
 * Login store
 */
class LoginStore extends storeBase {

    public static LOGIN_EVENT = 'login';
    public static UPDATE_SESSION_ON_LOGOUT_EVENT = 'updateSessionOnLogout';
    public static CONCURRENT_SESSION_ACTIVE = 'concurrentsessionactive';
    public static FAMILIARISATION_DATA_CREATED_EVENT = 'familiarisationdatacreatedevent';
    public static SUPPORT_LOGIN_EVENT = 'supportloginevent';

    private _success: boolean;
    private loggedInUsername: string;
    private statusCode: number;
    private errorMessage: string;
    private _isLoginInvalid: boolean;
    private _isAdvancedFamilarisationEnabled: boolean = false;
    private _isFamiliarisationDataCreated: boolean = false;
    private _isAdminRemarker: boolean = false;
    private _isReportsVisible: boolean = false;
    private _isAdminLoginEnabled: boolean = false;

    /**
     * @constructor
     */
    constructor() {
        super();
        this._dispatchToken = dispatcher.register((action: Action) => {
            if (action.actionType === ActionType.LOGIN) {
                this._success = (action as LoginAction).success;

                if (this._success) {
                    this.loggedInUsername = (action as LoginAction).userName;
                    this._isAdvancedFamilarisationEnabled = (action as LoginAction).isAdvancedFamilarisationEnabled;
                    this._isAdminRemarker = (action as LoginAction).isFamiliarizationLogin ?
                        false : (action as LoginAction).isAdminRemarker;
                    this._isFamiliarisationDataCreated = false;
                    this._isReportsVisible = (action as LoginAction).isReportsVisible;
                    this._isAdminLoginEnabled = (action as LoginAction).isAdminLoginEnabled;
                } else {
                    this.statusCode = (action as LoginAction).getStatusCode;
                    this.errorMessage = (action as LoginAction).getErrorMessage;
                }

                this.emit(LoginStore.LOGIN_EVENT);
            } else if (action.actionType === ActionType.USER_SESSION_UPDATE_ON_LOGOUT) {
                this.emit(LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT);

            } else if (action.actionType === ActionType.NOTIFY_CONCURRENT_SESSION_ACTIVE) {
                this.emit(LoginStore.CONCURRENT_SESSION_ACTIVE);
            } else if (action.actionType === ActionType.CREATE_FAMILARISATION_DATA_ACTION) {
                this._isFamiliarisationDataCreated = true;
                this.emit(LoginStore.FAMILIARISATION_DATA_CREATED_EVENT);
            } else if (action.actionType === ActionType.SUPPORT_LOGIN) {
                let supportLoginAction = (action as supportLoginAction);
                this._success = supportLoginAction.success;
                if (this._success) {
                    this.loggedInUsername = supportLoginAction.userName;
                    this._isAdvancedFamilarisationEnabled = supportLoginAction.isAdvancedFamilarisationEnabled;
                    this._isAdminRemarker = supportLoginAction.isFamiliarizationLogin ?
                        false : supportLoginAction.isAdminRemarker;
                    this._isFamiliarisationDataCreated = false;
                    this._isReportsVisible = supportLoginAction.isReportsVisible;
                    this.emit(LoginStore.SUPPORT_LOGIN_EVENT);
                } else {
                    this.statusCode = supportLoginAction.getStatusCode;
                    this.errorMessage = supportLoginAction.getErrorMessage;
                }
            }
        });
    }

    /**
     * Get the UserName for the logged in user
     */
    public get loggedInUserName(): string {
        return this.loggedInUsername;
    }

    /**
     * Get the success value for the login action
     */
    public get success(): boolean {
        return this._success;
    }

    /**
     * Get the status code for the login action
     */
    public get getStatusCode(): number {
        return this.statusCode;
    }

    /**
     * Get the value error Message
     */
    public get getErrorMessage(): string {
        return this.errorMessage;
    }

    /**
     * Get the value indicates whether the AdvancedFamilarisationEnabled or not
     */
    public get isAdvancedFamilarisationEnabled() {
        return this._isAdvancedFamilarisationEnabled;
    }

    /**
     * Get the value indicates whether Admin Remarker or not
     */
    public get isAdminRemarker() {
        return this._isAdminRemarker;
    }

    /**
     * get the value indicates whether the Familiarisation data created or not
     */
    public get isFamiliarisationDataCreated() {
        return this._isFamiliarisationDataCreated;
    }

    /**
     * get the value indicates whether the reports visible or not
     */
    public get isReportsVisible() {
        return this._isReportsVisible;
    }

    /**
     * get the value indicates whether it is admin login or not
     */
    public get isAdminLoginEnabled() {
        return this._isAdminLoginEnabled;
    }
}

let instance = new LoginStore();

export = { LoginStore, instance };

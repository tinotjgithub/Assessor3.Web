/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import LoginHeader = require('./loginheader');
import LoginFooter = require('./loginfooter');
import LoginSlider = require('./loginslider');
import LoginUserName = require('./loginusername');
import LoginPassword = require('./loginpassword');
import pureRenderComponent = require('../base/purerendercomponent');
import loginActionCreator = require('../../actions/login/loginactioncreator');
import loginStore = require('../../stores/login/loginstore');
import localeActionCreator = require('../../actions/locale/localeactioncreator');
import localeStore = require('../../stores/locale/localestore');
import cookie = require('react-cookie');
import enums = require('../utility/enums');
import backgroundPulseHelper = require('../../utility/backgroundpulse/backgroundpulsehelper');
import userOptionActionCreator = require('../../actions/useroption/useroptionactioncreator');
import CookiePage = require('./cookiepage');
declare let config: any;
declare let languageList: any;
let classNames = require('classnames');
const COOKIE_KEY = 'language';
const COOKIE_USER_KEY = 'username';
const SHOW_COOKIE_PAGE = 'showcookiepage';
import cookieHelper = require('../../utility/cookie/cookiehelper');
import navigationHelper = require('../utility/navigation/navigationhelper');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import ConfirmationDialog = require('../utility/confirmationdialog');
import loginSession = require('../../app/loginsession');
import domhelper = require('../../utility/generic/domhelper');
import simulationModeHelper = require('../../utility/simulation/simulationmodehelper');
import stringHelper = require('../../utility/generic/stringhelper');
import auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');

/* tslint:disable:variable-name */
const LoginRedirect = () => {
    let loginPasswordReset2 = stringHelper.format(
        localeStore.instance.TranslateText('login.logging-in.password-changed-logging-in'),
        [String(String.fromCharCode(179))]);
    return (
        <div className='login-loader vertical-middle'>
            <span className='loader middle-content'>
                <span className='dot'></span>
                <span className='dot'></span>
                <span className='dot'></span>
                <div className='loading-text padding-top-30'><p>
                    {localeStore.instance.TranslateText('login.logging-in.password-changed')}
                </p>{loginPasswordReset2}</div>

            </span>
        </div>
    );
};

/**
 * All fields optional to allow partial state updates in setState
 */
interface State extends LocaleSelectionBase {
    success?: boolean;
    loggedInUsername?: string;
    message?: string;
    errors?: FormErrors;
    isLoading?: boolean;
    isCookiePageVisible?: boolean;
    isFamLogin?: boolean;
    forgotPasswordPopupVisible?: boolean;
    isFamBusyIndicatorDisplaying?: boolean;
    isCookiePageOpen?: boolean;
}

interface FormErrors {
    username: boolean;
    password: boolean;
}

/**
 * React component class for Login
 */
class LoginForm extends pureRenderComponent<any, State> {

    private static LOGIN_ERROR: string = 'login.logging-in.incorrect-password';

    private userNameKey: string = 'userName';
    private _userName: string = '';
    private _password: string = '';
    private _isFormValid: boolean = true;
    private _logoutEvent: enums.LogoutEvents;
    private forgotPasswordStyle: React.CSSProperties = {};
    private isRedirected: boolean = false;
    private isPassResetSuccess: string = '';
    private _boundHandleKeyDown: EventListenerObject = null;
    private _isFromSwitchUser: boolean = false;
    private isFamiliarisationLogin: string = '';
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    constructor(props: any, state: State) {
        super(props, state);
        this.state = {
            success: true,
            loggedInUsername: null,
            message: '',
            errors: { username: false, password: false },
            selectedLanguage: '',
            isLoading: false,
            isCookiePageVisible: false,
            forgotPasswordPopupVisible: false,
            isFamBusyIndicatorDisplaying: false,
            isCookiePageOpen: false
        };

        this.isRedirected = false;
        this.closeCookie = this.closeCookie.bind(this);
        this.setValues = this.setValues.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleFamSubmit = this.handleFamSubmit.bind(this);
        this._boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.onForgotPasswordNoClick = this.onForgotPasswordNoClick.bind(this);
        this.onForgotPasswordYesClick = this.onForgotPasswordYesClick.bind(this);
        this.handleForgotPasswordSubmit = this.handleForgotPasswordSubmit.bind(this);
        this.cookiePageVisibility = this.cookiePageVisibility.bind(this);

        if (htmlUtilities.IsCookiesEnabled) {
            this._userName = window.sessionStorage != null ? window.sessionStorage[this.userNameKey] : '';
        }

        // holds the sessionStorage to identify whether the logout
        if (window.sessionStorage) {
            this._logoutEvent = window.sessionStorage.getItem('autologout') ?
                enums.LogoutEvents.AutoLogout :
                window.sessionStorage.getItem('invaliduser') ? enums.LogoutEvents.InvalidUser :
                    enums.LogoutEvents.None;
            this._isFromSwitchUser = (window.sessionStorage.getItem('adminsupport') !== null);
        }
    }

    /**
     * Render
     */
    public render() {
        let cookiePage: any;
        this.isPassResetSuccess = domhelper.getQueryStringByIndex(window.location.toString(), 0, 1);
        this.isFamiliarisationLogin = domhelper.getQueryStringByIndex(window.location.toString(), 0, 2);
        let loader: JSX.Element = null;
        loader = this.isPassResetSuccess === 'true' ? <LoginRedirect /> : null;
        if (this._isFromSwitchUser) {
            loginActionCreator.isAuthenticate(this.isFamiliarisationLogin === 'true' ? true : false);
            return (<div></div>);
        }

        if (this.state.isCookiePageVisible) {
            cookiePage = (
                <CookiePage isCookieVisible={this.state.isCookiePageVisible}
                    closeClick={this.closeCookie}
                    selectedLanguage={this.state.selectedLanguage}
                    id='cookie_page'
                    key='cookie_page'
                    IsCookiesEnabled={htmlUtilities.IsCookiesEnabled}
                    setCookiePageVisibility={this.cookiePageVisibility} />
            );
        } else {
            cookiePage = null;
        }

        let autoLogoutMessage: any;
        if (this._logoutEvent === enums.LogoutEvents.AutoLogout) {
            autoLogoutMessage = (
                <div className='info-messages'>
                    <div className='show info-alert text-center padding-all-10'>
                        {localeStore.instance.TranslateText('login.auto-log-out.automatically-logged-out-timeout')}
                    </div>
                </div>);
        } else if (this._logoutEvent === enums.LogoutEvents.InvalidUser) {
            autoLogoutMessage = (
                <div className='info-messages'>
                    <div className='show info-alert text-center padding-all-10'>
                        {localeStore.instance.TranslateText('login.auto-log-out.automatically-logged-out-logged-in-different-browser')}
                    </div>
                </div>);
        } else {
            autoLogoutMessage = null;
        }
        let forgotPasswordConfirmationPopup = (this.state.forgotPasswordPopupVisible) ?
            (<ConfirmationDialog
                content={localeStore.instance.TranslateText('login.forgot-password-dialog.body')}
                header={localeStore.instance.TranslateText('login.forgot-password-dialog.header')}
                displayPopup={this.state.forgotPasswordPopupVisible}
                isCheckBoxVisible={false}
                noButtonText={localeStore.instance.TranslateText('login.forgot-password-dialog.no-button')}
                yesButtonText={localeStore.instance.TranslateText('login.forgot-password-dialog.yes-button')}
                onNoClick={this.onForgotPasswordNoClick}
                onYesClick={this.onForgotPasswordYesClick}
                dialogType={enums.PopupDialogType.ForgotPasswordConfirmation} />
            ) : null;

        this.forgotPasswordStyle = {
            'display': 'block'
        };
        // disabling forgotPasswordAnchor
        if (!config.general.FORGOT_PASSWORD_URL || config.general.FORGOT_PASSWORD_URL === '$$FORGOT_PASSWORD_URL$$') {
            this.forgotPasswordStyle = {
                'display': 'none'
            };
        }

        // TODO - Loading indicator should be a component in its own right
        let markingTitle = stringHelper.format(localeStore.instance.TranslateText('login.login-page.marking-button-tooltip'),
            [String(String.fromCharCode(179))]);
        let familirisationTitle = stringHelper.format(localeStore.instance.TranslateText('login.login-page.fam-button-tooltip'),
            [String(String.fromCharCode(179))]);
        return (
            <div className={classNames('login-wrapper',
                { 'loading': this.state.isFamBusyIndicatorDisplaying || (this.isPassResetSuccess === 'true') })}>
                {this.renderFamBusyIndicator()}
                {loader}
                <LoginHeader selectedLanguage={this.state.selectedLanguage} />
                <div className='content-wrapper vertical-middle' >
                    <div className='middle-content relative'>
                        <div className='wrapper'>
                            <div className='col-wrap responsive-medium'>
                                <div className='col-1-of-2'>
                                    <section className='login-area'>
                                        <div className='client-logo text-center'>
                                            <img alt={localeStore.instance.TranslateText('login.login-page.awarding-body-logo-tooltip')}
                                                src='./content/images/customer/client-logo.png' />
                                        </div>
                                        <div className='login-form-holder'>
                                            <div className='relative'>
                                                {autoLogoutMessage}
                                                <LoginUserName id='usernameBox'
                                                    key='usernameBox'
                                                    error={this.state.errors.username}
                                                    setValue={this.setValues}
                                                    selectedLanguage={this.state.selectedLanguage}
                                                    value={this._userName} tabindex={1} />
                                                <LoginPassword id='passwordBox'
                                                    key='passwordBox'
                                                    error={this.state.errors.password}
                                                    setValue={this.setValues}
                                                    value=''
                                                    tabindex={2}
                                                    selectedLanguage={this.state.selectedLanguage} />
                                                <div className='error-messages'>
                                                    <div className='bubble error-alert show simple-alert text-center'>
                                                        {(this.state.message !== '') ?
                                                            localeStore.instance.TranslateText(this.state.message) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='login-button-holder'>
                                                <h3 className='text-center'>
                                                    {localeStore.instance.TranslateText('login.login-page.login-to')}
                                                </h3>
                                                <button id='btnMarking'
                                                    className={classNames('primary rounded', { 'loading': this.state.isLoading })}
                                                    title={markingTitle}
                                                    onClick={this.handleLoginSubmit}>
                                                    <span className='loader text-middle'>
                                                        <span className='dot'></span>
                                                        <span className='dot'></span>
                                                        <span className='dot'></span>
                                                    </span>
                                                    {localeStore.instance.TranslateText('login.login-page.marking-button')}
                                                </button>
                                                <h5 className='text-center'>
                                                    {localeStore.instance.TranslateText('login.login-page.marking-or-fam')}
                                                </h5>
                                                <button className={classNames('rounded', { 'loading': this.state.isFamLogin })}
                                                    id='btn-fam' onClick={this.handleFamSubmit}
                                                    title={familirisationTitle}>
                                                    <span className='loader text-middle darker'>
                                                        <span className='dot'></span>
                                                        <span className='dot'></span>
                                                        <span className='dot'></span>
                                                    </span>
                                                    {localeStore.instance.TranslateText('login.login-page.fam-button')}
                                                </button>
                                            </div>
                                        </div>
                                        <div className='login-links-holder text-center'>
                                            <a id='forgotPasswordNavigation'
                                                onClick={this.handleForgotPasswordSubmit}
                                                style={this.forgotPasswordStyle}
                                                title={localeStore.instance.TranslateText('login.login-page.forgot-password-tooltip')}
                                            >
                                                {localeStore.instance.TranslateText('login.login-page.forgot-password')}
                                            </a>
                                        </div>
                                    </section>
                                </div>
                                <LoginSlider selectedLanguage={this.state.selectedLanguage} />
                            </div>
                        </div>
                        {forgotPasswordConfirmationPopup}
                    </div>
                </div >
                <LoginFooter selectedLanguage={this.state.selectedLanguage} />
                {cookiePage}
            </div>
        );
    }

    /**
     * Render the Familiarisation Busy Indicator
     */
    private renderFamBusyIndicator = () => {
        if (this.state.isFamBusyIndicatorDisplaying) {
            return (
                <div className='familiarisation-loader vertical-middle' >
                    <span className='loader middle-content'>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <div className='loading-text padding-top-30'>
                            {localeStore.instance.TranslateText('login.logging-in.fam-loading')}
                        </div>
                    </span>
                </div>
            );
        }
    };

    /**
     * cookie close button click
     * @param evt
     */
    private closeCookie(evt: any): void {
        this.setState({
            isCookiePageVisible: false
        });
    }

    /**
     * Checking the visibility of the cookie page
     * @param isOpen
     */
    private cookiePageVisibility(isOpen: boolean): void {
        this.setState({
            isCookiePageOpen: isOpen
        });
    }

    /**
     * Login form submission event handler
     * @param evt
     */
    private handleLoginSubmit(evt: any): void {
        // Focus to the marking button. To Avoid keyboard in devices
        if (htmlUtilities.isTabletOrMobileDevice) {
            htmlUtilities.setFocusToElement('btnMarking');
        }

        this.validateAndLogin(false, this.state.selectedLanguage);
    }

    /**
     * Login form submission event handler for Familiarisation button
     * @param evt
     */
    private handleFamSubmit(evt: any): void {
        // Focus to the marking button. To Avoid keyboard in devices
        if (htmlUtilities.isTabletOrMobileDevice) {
            htmlUtilities.setFocusToElement('btn-fam');
        }

        this.validateAndLogin(true, this.state.selectedLanguage);
    }

    /**
     * Validate the form and submit the login
     * @param isFamiliarisation
     */
    private validateAndLogin(isFamiliarisation: boolean, selectedLanguage: string) {

        this.validateLoginForm(this._userName, this._password);
        if (this._isFormValid) {
            this.setState({ isLoading: !isFamiliarisation, isFamLogin: isFamiliarisation });
            /* Initializing the analytics helper */
            new auditLoggingHelper().logHelper.initializeAnalytics();
            loginActionCreator.login(this._userName, this._password, isFamiliarisation, selectedLanguage);
        }

        //reset isFormValid variable
        this._isFormValid = true;
    }

    /**
     * Login form Forgot Password Popup Discard event handler
     * @param evt
     */
    private onForgotPasswordNoClick(evt: any): void {
        this.setState({ forgotPasswordPopupVisible: false });
    }

    /**
     * Login form Forgot Password Popup Confirm event handler
     * @param evt
     */
    private onForgotPasswordYesClick(evt: any): void {
        window.open(config.general.FORGOT_PASSWORD_URL, '_blank');
        this.setState({ forgotPasswordPopupVisible: false });
    }

    /**
     * Login form Forgot Password submit event handler
     */
    private handleForgotPasswordSubmit(evt: any): void {
        //check for disabled class for anchor element
        if (evt.target.className.indexOf('disabled') === -1) {
            // Focus to the ForgotMePassword anchor. To Avoid keyboard in devices
            htmlUtilities.setFocusToElement('forgotPasswordNavigation');
            this.setState({ forgotPasswordPopupVisible: true });
        }
    }

    /**
     * submit form on enter keypress
     * @param event
     */
    private handleKeyDown(event: any) {
        // enter key keycode
        if (event.keyCode === 13 && !this.state.isCookiePageOpen && !this.state.isLoading && !this.state.isFamLogin) {
            event.preventDefault(true);
            if (event.target.id === 'btn-fam') {
                this.handleFamSubmit(event);
            } else {
                this.handleLoginSubmit(event);
            }
        }
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Login);
        loginStore.instance.addListener(loginStore.LoginStore.LOGIN_EVENT, this.refreshState);
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        loginStore.instance.addListener(loginStore.LoginStore.FAMILIARISATION_DATA_CREATED_EVENT, this.onFamiliarisationDataCreated);
        this.selectLanguage();
        this.checkCookie();
        // add device and browser identification
        let device = htmlUtilities.getUserDevice();
        let bodyClass = htmlUtilities.isTabletOrMobileDevice ? device.browser + ' ' + device.userDevice + ' ' + 'touch-device' :
            device.browser + ' ' + device.userDevice;
        htmlUtilities.addClassToBody(bodyClass);
        this.reLogin();
    }

    /**
     * to initiate re login after password reset success.
     */
    private reLogin = (): void => {
        if (this.isPassResetSuccess === 'true' && this.isRedirected === false) {
            this.isRedirected = true;
            loginActionCreator.isAuthenticate(this.isFamiliarisationLogin === 'true' ? true : false);
        }
    };

    /**
     * checking cookie on login
     */
    private checkCookie = (): void => {
        // Reading from cookie
        let _cookie = cookieHelper.readFromCookie(SHOW_COOKIE_PAGE);

        if (_cookie === 'true') {
            this.setState({
                isCookiePageVisible: true
            });
        }

        if (_cookie === undefined) {
            let expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);
            cookieHelper.saveToCookie(SHOW_COOKIE_PAGE, true, expireDate);
            this.setState({
                isCookiePageVisible: true
            });
        }
    };

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Login);
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        loginStore.instance.removeListener(loginStore.LoginStore.LOGIN_EVENT, this.refreshState);
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        loginStore.instance.removeListener(loginStore.LoginStore.FAMILIARISATION_DATA_CREATED_EVENT, this.onFamiliarisationDataCreated);
    }

    /**
     * RefreshState will set the state of the login component
     */
    private refreshState = (): void => {
        if (!htmlUtilities.IsCookiesEnabled) {
            return;
        }

        // reseting timeout error message
        this._logoutEvent = enums.LogoutEvents.None;
        let loginError: string = loginStore.instance.success ? '' : this.getErrorMessage();
        this.setState({
            success: loginStore.instance.success,
            loggedInUsername: loginStore.instance.loggedInUserName,
            errors: loginError === LoginForm.LOGIN_ERROR ? { username: true, password: true } : { username: false, password: false },
            message: loginError,
            isLoading: false,
            isFamLogin: false
        });

        // Following successful login, navigate to the next page
        if (this.state.success && this.state.loggedInUsername != null) {

            // Safari, In private browsing mode storing in session storage is not working.
            if (htmlUtilities.isSessionStorageAvailable) {
                window.sessionStorage[this.userNameKey] = loginStore.instance.loggedInUserName;
                window.sessionStorage.removeItem('autologout');
                window.sessionStorage.removeItem('invaliduser');
            }

            if (loginSession.IS_FAMILIARISATION_LOGIN && loginStore.instance.isAdvancedFamilarisationEnabled) {
                loginActionCreator.setUpFamilarisationData();
                this.setState({
                    isFamBusyIndicatorDisplaying: true
                });
                return;
            }
            if (loginStore.instance.isAdminLoginEnabled) {
				navigationHelper.loadSupportLogin(this._isFromSwitchUser);
            } else {
                navigationHelper.navigateToQigSelector(this.isPassResetSuccess);
            }
        }
    };

    /**
     * Method to be invoked, after Familirisation data created
     */
    private onFamiliarisationDataCreated = (): void => {
        navigationHelper.navigateToQigSelector(this.isPassResetSuccess);
    }

    /**
     * languageChanged will notify the language has successfully changed
     */
    private languageChanged = (): void => {
        this.setState({
            selectedLanguage: localeStore.instance.Locale
        });
        this.writeCookie(COOKIE_KEY, localeStore.instance.Locale);
    };

    /**
     * writeCookie will write the current selected language to cookie
     */
    private writeCookie(key: string, value: any) {
        let expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1);
        let opt = {
            expires: expireDate
        };

        cookie.save(key, value, opt);
    }

    /**
     * selectLanguage will triger the locale change based on browser/cookie/default language of awarding body
     */
    private selectLanguage = (): void => {
        let language: string;

        // Reading from cookie
        language = cookie.load(COOKIE_KEY, true);
        if (language === undefined) {
            // Get browser language
            if (navigator.appVersion.indexOf('Trident/') > 0) {
                language = navigator.browserLanguage;
            } else {
                language = navigator.language;
            }
        }

        //Checking wether browser language exist in languageJson
        let langExist: boolean;
        langExist = false;
        languageList.languages.language.map(function (lang: any) {
            if (lang.code === language) {
                langExist = true;
            }
        });

        let awardingBody = languageList.languages['awarding-body'];
        if (!langExist) {
            // If the customer doesnt support the browser language select the default language
            language = languageList.languages['default-culture'];
        }

        localeActionCreator.localeChange(language, awardingBody);
    };

    /**
     * This will set values for username and password
     * @param value
     * @param loginformtype
     */
    private setValues(value: string, loginformtype: enums.LoginForm): void {
        if (loginformtype === enums.LoginForm.username) {
            this._userName = value;
        } else if (loginformtype === enums.LoginForm.password) {
            this._password = value;
        }
    }

    /**
     * This method will validate the login form
     * @param userName
     * @param password
     */
    private validateLoginForm(userName: string, password: string): void {

        let validationMessage: string = '';
        let hasUserNameError: boolean = false;
        let hasPasswordError: boolean = false;

        if ((userName === '' || userName === undefined) && password === '') {
            this._isFormValid = false;
            validationMessage = 'login.login-page.username-password-validation-message';
            hasPasswordError = true;
            hasUserNameError = true;
        } else if (userName === '' || userName === undefined) {
            this._isFormValid = false;
            validationMessage = 'login.login-page.username-validation-message';
            hasUserNameError = true;
        } else if (password === '') {
            this._isFormValid = false;
            validationMessage = 'login.login-page.password-validation-message';
            hasPasswordError = true;
        } else if (!htmlUtilities.IsCookiesEnabled) {
            this._isFormValid = false;
            validationMessage = 'login.login-page.cookies-disabled';
        }

        this.setState({ message: validationMessage, errors: { username: hasUserNameError, password: hasPasswordError } });
    }

    /**
     * To get the error message
     */
    private getErrorMessage(): string {
        let statusCode = loginStore.instance.getStatusCode;
        let errorMessage = loginStore.instance.getErrorMessage;

        // inform user about connection lost
        if (statusCode === 0 || statusCode === 404) {
            errorMessage = 'login.logging-in.connection-lost';
        } else if (statusCode !== 200 || errorMessage === 'User not Authenticated.') {
            //inform user about invalid credentials
            errorMessage = LoginForm.LOGIN_ERROR;
        }

        return errorMessage;
    }

}

export = LoginForm;
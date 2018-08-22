"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var LoginHeader = require('./loginheader');
var LoginFooter = require('./loginfooter');
var LoginSlider = require('./loginslider');
var LoginUserName = require('./loginusername');
var LoginPassword = require('./loginpassword');
var pureRenderComponent = require('../base/purerendercomponent');
var loginActionCreator = require('../../actions/login/loginactioncreator');
var loginStore = require('../../stores/login/loginstore');
var localeActionCreator = require('../../actions/locale/localeactioncreator');
var localeStore = require('../../stores/locale/localestore');
var cookie = require('react-cookie');
var enums = require('../utility/enums');
var CookiePage = require('./cookiepage');
var classNames = require('classnames');
var COOKIE_KEY = 'language';
var COOKIE_USER_KEY = 'username';
var SHOW_COOKIE_PAGE = 'showcookiepage';
var cookieHelper = require('../../utility/cookie/cookiehelper');
var navigationHelper = require('../utility/navigation/navigationhelper');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var ConfirmationDialog = require('../utility/confirmationdialog');
var loginSession = require('../../app/loginsession');
var domhelper = require('../../utility/generic/domhelper');
var stringHelper = require('../../utility/generic/stringhelper');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
/* tslint:disable:variable-name */
var LoginRedirect = function () {
    var loginPasswordReset2 = stringHelper.format(localeStore.instance.TranslateText('login.logging-in.password-changed-logging-in'), [String(String.fromCharCode(179))]);
    return (React.createElement("div", {className: 'login-loader vertical-middle'}, React.createElement("span", {className: 'loader middle-content'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("div", {className: 'loading-text padding-top-30'}, React.createElement("p", null, localeStore.instance.TranslateText('login.logging-in.password-changed')), loginPasswordReset2))));
};
/**
 * React component class for Login
 */
var LoginForm = (function (_super) {
    __extends(LoginForm, _super);
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
    function LoginForm(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.userNameKey = 'userName';
        this._userName = '';
        this._password = '';
        this._isFormValid = true;
        this.forgotPasswordStyle = {};
        this.isRedirected = false;
        this.isPassResetSuccess = '';
        this._boundHandleKeyDown = null;
        this._isFromSwitchUser = false;
        /**
         * Render the Familiarisation Busy Indicator
         */
        this.renderFamBusyIndicator = function () {
            if (_this.state.isFamBusyIndicatorDisplaying) {
                return (React.createElement("div", {className: 'familiarisation-loader vertical-middle'}, React.createElement("span", {className: 'loader middle-content'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("div", {className: 'loading-text padding-top-30'}, localeStore.instance.TranslateText('login.logging-in.fam-loading')))));
            }
        };
        /**
         * to initiate re login after password reset success.
         */
        this.reLogin = function () {
            if (_this.isPassResetSuccess === 'true' && _this.isRedirected === false) {
                _this.isRedirected = true;
                loginActionCreator.isAuthenticate();
            }
        };
        /**
         * checking cookie on login
         */
        this.checkCookie = function () {
            // Reading from cookie
            var _cookie = cookieHelper.readFromCookie(SHOW_COOKIE_PAGE);
            if (_cookie === 'true') {
                _this.setState({
                    isCookiePageVisible: true
                });
            }
            if (_cookie === undefined) {
                var expireDate = new Date();
                expireDate.setFullYear(expireDate.getFullYear() + 1);
                cookieHelper.saveToCookie(SHOW_COOKIE_PAGE, true, expireDate);
                _this.setState({
                    isCookiePageVisible: true
                });
            }
        };
        /**
         * RefreshState will set the state of the login component
         */
        this.refreshState = function () {
            if (!htmlUtilities.IsCookiesEnabled) {
                return;
            }
            // reseting timeout error message
            _this._logoutEvent = enums.LogoutEvents.None;
            var loginError = loginStore.instance.success ? '' : _this.getErrorMessage();
            _this.setState({
                success: loginStore.instance.success,
                loggedInUsername: loginStore.instance.loggedInUserName,
                errors: loginError === LoginForm.LOGIN_ERROR ? { username: true, password: true } : { username: false, password: false },
                message: loginError,
                isLoading: false,
                isFamLogin: false
            });
            // Following successful login, navigate to the next page
            if (_this.state.success && _this.state.loggedInUsername != null) {
                // Safari, In private browsing mode storing in session storage is not working.
                if (htmlUtilities.isSessionStorageAvailable) {
                    window.sessionStorage[_this.userNameKey] = loginStore.instance.loggedInUserName;
                    window.sessionStorage.removeItem('autologout');
                    window.sessionStorage.removeItem('invaliduser');
                }
                if (loginSession.IS_FAMILIARISATION_LOGIN && loginStore.instance.isAdvancedFamilarisationEnabled) {
                    loginActionCreator.setUpFamilarisationData();
                    _this.setState({
                        isFamBusyIndicatorDisplaying: true
                    });
                    return;
                }
                if (loginStore.instance.isAdminLoginEnabled) {
                    navigationHelper.loadSupportLogin(_this._isFromSwitchUser);
                }
                else {
                    navigationHelper.navigateToQigSelector(_this.isPassResetSuccess);
                }
            }
        };
        /**
         * Method to be invoked, after Familirisation data created
         */
        this.onFamiliarisationDataCreated = function () {
            navigationHelper.navigateToQigSelector(_this.isPassResetSuccess);
        };
        /**
         * languageChanged will notify the language has successfully changed
         */
        this.languageChanged = function () {
            _this.setState({
                selectedLanguage: localeStore.instance.Locale
            });
            _this.writeCookie(COOKIE_KEY, localeStore.instance.Locale);
        };
        /**
         * selectLanguage will triger the locale change based on browser/cookie/default language of awarding body
         */
        this.selectLanguage = function () {
            var language;
            // Reading from cookie
            language = cookie.load(COOKIE_KEY, true);
            if (language === undefined) {
                // Get browser language
                if (navigator.appVersion.indexOf('Trident/') > 0) {
                    language = navigator.browserLanguage;
                }
                else {
                    language = navigator.language;
                }
            }
            //Checking wether browser language exist in languageJson
            var langExist;
            langExist = false;
            languageList.languages.language.map(function (lang) {
                if (lang.code === language) {
                    langExist = true;
                }
            });
            var awardingBody = languageList.languages['awarding-body'];
            if (!langExist) {
                // If the customer doesnt support the browser language select the default language
                language = languageList.languages['default-culture'];
            }
            localeActionCreator.localeChange(language, awardingBody);
        };
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
    LoginForm.prototype.render = function () {
        var cookiePage;
        this.isPassResetSuccess = domhelper.getQueryStringByIndex(window.location.toString(), 0);
        var loader = null;
        if (this.isPassResetSuccess === 'true') {
            loader = React.createElement(LoginRedirect, null);
        }
        if (this._isFromSwitchUser) {
            loginActionCreator.isAuthenticate();
            return (React.createElement("div", null));
        }
        if (this.state.isCookiePageVisible) {
            cookiePage = (React.createElement(CookiePage, {isCookieVisible: this.state.isCookiePageVisible, closeClick: this.closeCookie, selectedLanguage: this.state.selectedLanguage, id: 'cookie_page', key: 'cookie_page', IsCookiesEnabled: htmlUtilities.IsCookiesEnabled, setCookiePageVisibility: this.cookiePageVisibility}));
        }
        else {
            cookiePage = null;
        }
        var autoLogoutMessage;
        if (this._logoutEvent === enums.LogoutEvents.AutoLogout) {
            autoLogoutMessage = (React.createElement("div", {className: 'info-messages'}, React.createElement("div", {className: 'show info-alert text-center padding-all-10'}, localeStore.instance.TranslateText('login.auto-log-out.automatically-logged-out-timeout'))));
        }
        else if (this._logoutEvent === enums.LogoutEvents.InvalidUser) {
            autoLogoutMessage = (React.createElement("div", {className: 'info-messages'}, React.createElement("div", {className: 'show info-alert text-center padding-all-10'}, localeStore.instance.TranslateText('login.auto-log-out.automatically-logged-out-logged-in-different-browser'))));
        }
        else {
            autoLogoutMessage = null;
        }
        var forgotPasswordConfirmationPopup = (this.state.forgotPasswordPopupVisible) ?
            (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('login.forgot-password-dialog.body'), header: localeStore.instance.TranslateText('login.forgot-password-dialog.header'), displayPopup: this.state.forgotPasswordPopupVisible, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('login.forgot-password-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('login.forgot-password-dialog.yes-button'), onNoClick: this.onForgotPasswordNoClick, onYesClick: this.onForgotPasswordYesClick, dialogType: enums.PopupDialogType.ForgotPasswordConfirmation})) : null;
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
        var markingTitle = stringHelper.format(localeStore.instance.TranslateText('login.login-page.marking-button-tooltip'), [String(String.fromCharCode(179))]);
        var familirisationTitle = stringHelper.format(localeStore.instance.TranslateText('login.login-page.fam-button-tooltip'), [String(String.fromCharCode(179))]);
        return (React.createElement("div", {className: classNames('login-wrapper', { 'loading': this.state.isFamBusyIndicatorDisplaying || (this.isPassResetSuccess === 'true') })}, this.renderFamBusyIndicator(), (this.isPassResetSuccess === 'true') ? loader : '', React.createElement(LoginHeader, {selectedLanguage: this.state.selectedLanguage}), React.createElement("div", {className: 'content-wrapper vertical-middle'}, React.createElement("div", {className: 'middle-content relative'}, React.createElement("div", {className: 'wrapper'}, React.createElement("div", {className: 'col-wrap responsive-medium'}, React.createElement("div", {className: 'col-1-of-2'}, React.createElement("section", {className: 'login-area'}, React.createElement("div", {className: 'client-logo text-center'}, React.createElement("img", {alt: localeStore.instance.TranslateText('login.login-page.awarding-body-logo-tooltip'), src: './content/images/customer/client-logo.png'})), React.createElement("div", {className: 'login-form-holder'}, React.createElement("div", {className: 'relative'}, autoLogoutMessage, React.createElement(LoginUserName, {id: 'usernameBox', key: 'usernameBox', error: this.state.errors.username, setValue: this.setValues, selectedLanguage: this.state.selectedLanguage, value: this._userName, tabindex: 1}), React.createElement(LoginPassword, {id: 'passwordBox', key: 'passwordBox', error: this.state.errors.password, setValue: this.setValues, value: '', tabindex: 2, selectedLanguage: this.state.selectedLanguage}), React.createElement("div", {className: 'error-messages'}, React.createElement("div", {className: 'bubble error-alert show simple-alert text-center'}, (this.state.message !== '') ?
            localeStore.instance.TranslateText(this.state.message) : ''))), React.createElement("div", {className: 'login-button-holder'}, React.createElement("h3", {className: 'text-center'}, localeStore.instance.TranslateText('login.login-page.login-to')), React.createElement("button", {id: 'btnMarking', className: classNames('primary rounded', { 'loading': this.state.isLoading }), title: markingTitle, onClick: this.handleLoginSubmit}, React.createElement("span", {className: 'loader text-middle'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'})), localeStore.instance.TranslateText('login.login-page.marking-button')), React.createElement("h5", {className: 'text-center'}, localeStore.instance.TranslateText('login.login-page.marking-or-fam')), React.createElement("button", {className: classNames('rounded', { 'loading': this.state.isFamLogin }), id: 'btn-fam', onClick: this.handleFamSubmit, title: familirisationTitle}, React.createElement("span", {className: 'loader text-middle darker'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'})), localeStore.instance.TranslateText('login.login-page.fam-button')))), React.createElement("div", {className: 'login-links-holder text-center'}, React.createElement("a", {id: 'forgotPasswordNavigation', onClick: this.handleForgotPasswordSubmit, style: this.forgotPasswordStyle, title: localeStore.instance.TranslateText('login.login-page.forgot-password-tooltip')}, localeStore.instance.TranslateText('login.login-page.forgot-password'))))), React.createElement(LoginSlider, {selectedLanguage: this.state.selectedLanguage}))), forgotPasswordConfirmationPopup)), React.createElement(LoginFooter, {selectedLanguage: this.state.selectedLanguage}), cookiePage));
    };
    /**
     * cookie close button click
     * @param evt
     */
    LoginForm.prototype.closeCookie = function (evt) {
        this.setState({
            isCookiePageVisible: false
        });
    };
    /**
     * Checking the visibility of the cookie page
     * @param isOpen
     */
    LoginForm.prototype.cookiePageVisibility = function (isOpen) {
        this.setState({
            isCookiePageOpen: isOpen
        });
    };
    /**
     * Login form submission event handler
     * @param evt
     */
    LoginForm.prototype.handleLoginSubmit = function (evt) {
        // Focus to the marking button. To Avoid keyboard in devices
        if (htmlUtilities.isTabletOrMobileDevice) {
            htmlUtilities.setFocusToElement('btnMarking');
        }
        this.validateAndLogin(false, this.state.selectedLanguage);
    };
    /**
     * Login form submission event handler for Familiarisation button
     * @param evt
     */
    LoginForm.prototype.handleFamSubmit = function (evt) {
        // Focus to the marking button. To Avoid keyboard in devices
        if (htmlUtilities.isTabletOrMobileDevice) {
            htmlUtilities.setFocusToElement('btn-fam');
        }
        this.validateAndLogin(true, this.state.selectedLanguage);
    };
    /**
     * Validate the form and submit the login
     * @param isFamiliarisation
     */
    LoginForm.prototype.validateAndLogin = function (isFamiliarisation, selectedLanguage) {
        this.validateLoginForm(this._userName, this._password);
        if (this._isFormValid) {
            this.setState({ isLoading: !isFamiliarisation, isFamLogin: isFamiliarisation });
            /* Initializing the analytics helper */
            new auditLoggingHelper().logHelper.initializeAnalytics();
            loginActionCreator.login(this._userName, this._password, isFamiliarisation, selectedLanguage);
        }
        //reset isFormValid variable
        this._isFormValid = true;
    };
    /**
     * Login form Forgot Password Popup Discard event handler
     * @param evt
     */
    LoginForm.prototype.onForgotPasswordNoClick = function (evt) {
        this.setState({ forgotPasswordPopupVisible: false });
    };
    /**
     * Login form Forgot Password Popup Confirm event handler
     * @param evt
     */
    LoginForm.prototype.onForgotPasswordYesClick = function (evt) {
        window.open(config.general.FORGOT_PASSWORD_URL, '_blank');
        this.setState({ forgotPasswordPopupVisible: false });
    };
    /**
     * Login form Forgot Password submit event handler
     */
    LoginForm.prototype.handleForgotPasswordSubmit = function (evt) {
        //check for disabled class for anchor element
        if (evt.target.className.indexOf('disabled') === -1) {
            // Focus to the ForgotMePassword anchor. To Avoid keyboard in devices
            htmlUtilities.setFocusToElement('forgotPasswordNavigation');
            this.setState({ forgotPasswordPopupVisible: true });
        }
    };
    /**
     * submit form on enter keypress
     * @param event
     */
    LoginForm.prototype.handleKeyDown = function (event) {
        // enter key keycode
        if (event.keyCode === 13 && !this.state.isCookiePageOpen && !this.state.isLoading && !this.state.isFamLogin) {
            event.preventDefault(true);
            if (event.target.id === 'btn-fam') {
                this.handleFamSubmit(event);
            }
            else {
                this.handleLoginSubmit(event);
            }
        }
    };
    /**
     * Component did mount
     */
    LoginForm.prototype.componentDidMount = function () {
        window.addEventListener('keydown', this._boundHandleKeyDown);
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Login);
        loginStore.instance.addListener(loginStore.LoginStore.LOGIN_EVENT, this.refreshState);
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        loginStore.instance.addListener(loginStore.LoginStore.FAMILIARISATION_DATA_CREATED_EVENT, this.onFamiliarisationDataCreated);
        this.selectLanguage();
        this.checkCookie();
        // add device and browser identification
        var device = htmlUtilities.getUserDevice();
        var bodyClass = htmlUtilities.isTabletOrMobileDevice ? device.browser + ' ' + device.userDevice + ' ' + 'touch-device' :
            device.browser + ' ' + device.userDevice;
        htmlUtilities.addClassToBody(bodyClass);
        this.reLogin();
    };
    /**
     * Component will unmount
     */
    LoginForm.prototype.componentWillUnmount = function () {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Login);
        window.removeEventListener('keydown', this._boundHandleKeyDown);
        loginStore.instance.removeListener(loginStore.LoginStore.LOGIN_EVENT, this.refreshState);
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
        loginStore.instance.removeListener(loginStore.LoginStore.FAMILIARISATION_DATA_CREATED_EVENT, this.onFamiliarisationDataCreated);
    };
    /**
     * writeCookie will write the current selected language to cookie
     */
    LoginForm.prototype.writeCookie = function (key, value) {
        var expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1);
        var opt = {
            expires: expireDate
        };
        cookie.save(key, value, opt);
    };
    /**
     * This will set values for username and password
     * @param value
     * @param loginformtype
     */
    LoginForm.prototype.setValues = function (value, loginformtype) {
        if (loginformtype === enums.LoginForm.username) {
            this._userName = value;
        }
        else if (loginformtype === enums.LoginForm.password) {
            this._password = value;
        }
    };
    /**
     * This method will validate the login form
     * @param userName
     * @param password
     */
    LoginForm.prototype.validateLoginForm = function (userName, password) {
        var validationMessage = '';
        var hasUserNameError = false;
        var hasPasswordError = false;
        if ((userName === '' || userName === undefined) && password === '') {
            this._isFormValid = false;
            validationMessage = 'login.login-page.username-password-validation-message';
            hasPasswordError = true;
            hasUserNameError = true;
        }
        else if (userName === '' || userName === undefined) {
            this._isFormValid = false;
            validationMessage = 'login.login-page.username-validation-message';
            hasUserNameError = true;
        }
        else if (password === '') {
            this._isFormValid = false;
            validationMessage = 'login.login-page.password-validation-message';
            hasPasswordError = true;
        }
        else if (!htmlUtilities.IsCookiesEnabled) {
            this._isFormValid = false;
            validationMessage = 'login.login-page.cookies-disabled';
        }
        this.setState({ message: validationMessage, errors: { username: hasUserNameError, password: hasPasswordError } });
    };
    /**
     * To get the error message
     */
    LoginForm.prototype.getErrorMessage = function () {
        var statusCode = loginStore.instance.getStatusCode;
        var errorMessage = loginStore.instance.getErrorMessage;
        // inform user about connection lost
        if (statusCode === 0 || statusCode === 404) {
            errorMessage = 'login.logging-in.connection-lost';
        }
        else if (statusCode !== 200 || errorMessage === 'User not Authenticated.') {
            //inform user about invalid credentials
            errorMessage = LoginForm.LOGIN_ERROR;
        }
        return errorMessage;
    };
    LoginForm.LOGIN_ERROR = 'login.logging-in.incorrect-password';
    return LoginForm;
}(pureRenderComponent));
module.exports = LoginForm;
//# sourceMappingURL=loginform.js.map
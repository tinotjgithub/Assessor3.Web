/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
import Logout = require('../../logout/logout');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
let classNames = require('classnames');
import GenericButton = require('../../utility/genericbutton');
import GenericTextBox = require('../../utility/generictextbox');
import GenericDialog = require('../../utility/genericdialog');
import busyIndicatorActionCreator = require('../../../actions/busyindicator/busyindicatoractioncreator');
import emailValidator = require('../../../utility/genericvalidators/emailvalidator');
import keyDownHelper = require('../../../utility/generic/keydownhelper');
import messageStore = require('../../../stores/message/messagestore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
import loginSession = require('../../../app/loginsession');

interface Props extends LocaleSelectionBase {
    isUserInfoLoaded: boolean;
    isUserInfoOpen: boolean;
}

interface State {
    operationMode: enums.OperationMode;
    isValidEmail: boolean;
}

/**
 * Class for displaying user information
 * @returns
 */
class UserInfo extends pureRenderComponent<Props, any> {

    private userName: string = '';
    private emailAddress: string = '';
    private examinerName: string = '';

    /**
     * Initializing a new instance of UserInfo
     */
    constructor(props: Props) {
        super(props, null);
        this.state = {
            operationMode: enums.OperationMode.normal,
            isValidEmail: true
        };

        this.onEditEmailClick = this.onEditEmailClick.bind(this);
        this.setValues = this.setValues.bind(this);
        this.OnSaveClick = this.OnSaveClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.switchUserButtonClick = this.switchUserButtonClick.bind(this);
    }

    /**
     * Render component
     */
    public render() {
        let outPut = undefined;
        if (this.userName === '') {
            outPut =
                (<LoadingIndicator id='loading' key='loading' cssClass='section-loader loading' />);
        } else {
            outPut = (
                <div>
                    <div className='user-photo-holder user-big-icon sprite-icon' />
                    <div className='user-details'>
                        <h4 className='full-name'> {this.examinerName}</h4>
                        <h5 className='bolder user-name'>
                            {localeStore.instance.TranslateText('generic.user-menu.profile-section.user-name')}: {this.userName}
                        </h5>
                    </div>
                    {this.getEmailHolder()}
                    <div>
                    {this.getSwitchUserButton()}
                    <Logout selectedLanguage={this.props.selectedLanguage} />
                    </div>
                </div>
            );
        }


        return (<div className='user-info-wrapper'>
            {outPut}
        </div>);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    }

    /**
     * Comparing the props to check the rerender
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        // If the use info panel has been opened deactivating to set the free flow
        // of the email edit and submit.
        if ((this.props.isUserInfoOpen === false || this.props.isUserInfoOpen === undefined) && nextProps.isUserInfoOpen === true) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        } else if (this.props.isUserInfoOpen === true && nextProps.isUserInfoOpen === false
            && (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible)) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.EmailAddress);
            this.setState({
                operationMode: enums.OperationMode.normal
            });
        }
    }

    /**
     * Returns the email edit div
     * @returns
     */
    private getEmailHolder(): JSX.Element {
        if (!this.props.isUserInfoOpen) {

            /** if user clicks outside the user profile, email will be restored from store and
             *  setting the email text box into normal mode
             */
            this.emailAddress = userInfoStore.instance.EmailAddress;
            this.setValues(this.emailAddress);
        }

        return (<div className={classNames('user-email-holder', {
            ' edit': (this.state.operationMode === enums.OperationMode.edit)
        })}>
            <a href='javascript:void(0)' className='email-link-holder' onClick={this.onEditEmailClick} >
                <span className='email-address'>
                    {this.emailAddress}
                </span>
                <span className='add-email-text'>
                    {localeStore.instance.TranslateText('generic.user-menu.profile-section.email-address-placeholder')}
                </span>
                <span className='edit-small-icon sprite-icon' />
                <span className='add-small-icon sprite-icon' />
            </a>
            <GenericTextBox id='emailId'
                key='emailId'
                setValue={this.setValues}
                onEnterKeyDown={this.OnSaveClick}
                value={this.emailAddress}
                tabindex={1} />
            <span className='bar' />
            <div className='email-edit-footer' aria-hidden='true'>
                {this.getEmaiValidationMessage()}
                <div className='save-button-wrapper'>
                    <button className='rounded' id='cancelEditEmail' onClick={this.onCancelClick}>
                        {localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button')}
                    </button>
                    <button className='rounded primary' id='saveEmail' onClick={this.OnSaveClick}>
                        {localeStore.instance.TranslateText('generic.user-menu.profile-section.save-email-button')}
                    </button>
                </div>
            </div>
        </div>);
    }

    /**
     * Update the user information.
     */
    private updateUserInformation = (): void => {
        this.userName = userInfoStore.instance.UserName;
        this.examinerName = userInfoStore.instance.ExaminerName;
        this.emailAddress = userInfoStore.instance.EmailAddress;
    };

    /**
     * Handles the edit click.
     * @param {any} evnt
     */
    private onEditEmailClick(evnt: any) {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        this.emailAddress = userInfoStore.instance.EmailAddress;
        this.setState({
            operationMode: enums.OperationMode.edit,
            isValidEmail: true
        });
    }

    /**
     * Handles the cancel click.
     * @param {any} evnt
     */
    private onCancelClick(evnt: any) {
        this.setNormalMode();
    }

    /**
     * Handles the save click
     * @param {any} evnt
     */
    private OnSaveClick(evnt: any) {
        let emailValidatorInstance = new emailValidator();
        let examinerEmailArgument: ExaminerEmailArgument;
        /* If email id is invalid setting the state for re-render */
        if (!emailValidatorInstance.ValidateEmail(this.emailAddress)) {
            this.setState({
                isValidEmail: false
            });
            return;
        }
        /* Setting the examinerEmailArgument */
        examinerEmailArgument = { emailAddress: this.emailAddress };
        let busyIndicatorInvoker: enums.BusyIndicatorInvoker;
        busyIndicatorInvoker = enums.BusyIndicatorInvoker.saveEmail;
        /*Show busy indicator on submitting response */
        busyIndicatorActionCreator.setBusyIndicatorInvoker(busyIndicatorInvoker);
        this.setState({
            isValidEmail: true
        });
        userInfoActionCreator.SaveEmailAddress(examinerEmailArgument);
    }

    /**
     * Set value from the Generic textbox component
     * @param {string} value
     */
    private setValues(value: string): void {
        this.emailAddress = value;

        // Deactivate MarkEntry only if UserInfo is open
        if (this.props.isUserInfoOpen) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.EmailAddress);
        }
    }

    /**
     * Returns the email validation div
     * @returns
     */
    private getEmaiValidationMessage(): JSX.Element {
        if (!this.state.isValidEmail) {
            return (<div className='error-holder'>
                <span className='error-alert bubble simple-alert show text-centre'>
                    {localeStore.instance.TranslateText('generic.user-menu.profile-section.email-validation-message')}
                </span>
            </div>);
        } else {
            return (<div></div>);
        }
    }

    /**
     * Fires after email save
     */
    private userInfoSaved = (): void => {
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
        this.setNormalMode();
    };

    /**
     * Disabling edit
     */
    private setNormalMode() {
        this.emailAddress = userInfoStore.instance.EmailAddress;
        this.setValues(this.emailAddress);
        this.setState({
            operationMode: enums.OperationMode.normal
        });
    }

    /**
     * save email on keypress
     * @param event
     */
    private handleKeyDown(event: KeyboardEvent) {
        // enter key keycode
        if ((event.keyCode === 13) && (this.state.operationMode === enums.OperationMode.edit)) {
            this.OnSaveClick(event);
        }
    }

    /**
     * Returns switch user div
     * @returns
     */
    private getSwitchUserButton(): JSX.Element {
        if (loginSession.IS_SUPPORT_ADMIN_LOGIN) {
            return (
                <GenericButton
                    id={'button-primary-rounded-switch-user-button'}
                    key={'key-button-primary-rounded-switch-user-button'}
                    className={'button primary rounded'}
                    title={localeStore.instance.TranslateText('generic.user-menu.profile-section.switch-user-button')}
                    content={localeStore.instance.TranslateText('generic.user-menu.profile-section.switch-user-button')}
                    disabled={false}
                    onClick={this.switchUserButtonClick}
                />
            );
        }
    }

     /**
      * Switch user button click event.
      */
    private switchUserButtonClick() {
        userInfoActionCreator.onSwitchUserButtonClick();
    }
}

export = UserInfo;
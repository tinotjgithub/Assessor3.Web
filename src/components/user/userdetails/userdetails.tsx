/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import UserOptionSettings = require('../useroptions/useroptions');
import localeStore = require('../../../stores/locale/localestore');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import UserInfo = require('../userinfo/userinfo');
import userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
import domManager = require('../../../utility/generic/domhelper');
import customError = require('../../base/customerror');
import userOptionsActionCreator = require('../../../actions/useroption/useroptionactioncreator');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
let classNames = require('classnames');

/**
 * State of User details
 */
interface State {
    isUserInfoOpen?: boolean;
    isEditSettingsOpen?: boolean;
    isUserInfoLoaded?: boolean;
}

/**
 * State of User details component
 */
interface Props extends LocaleSelectionBase {
    isUserOptionLoaded?: boolean;
}

/**
 * Represents the User details
 */
class UserDetails extends pureRenderComponent<Props, State> {

    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * Constructor UserDetails
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isUserInfoOpen: undefined,
            isEditSettingsOpen: undefined,
            isUserInfoLoaded: false
        };

        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.openCloseUserDetails = this.openCloseUserDetails.bind(this);
        this.onEditSettingsClick = this.onEditSettingsClick.bind(this);
    }

   /**
    * Handle click events on the window and collapse the user details
    * @param {any} source - The source element
    */
    private handleOnClick = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the user details list item. if not close the open window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) { return el.id === 'userMenuItem'; }) == null) {
            if (this.state.isUserInfoOpen !== undefined && this.state.isUserInfoOpen === true) {
                /** Saving changed user options if any of them changed */
                this.saveUserOptions();
                markingActionCreator.setMarkEntrySelected();
                this.setState({ isUserInfoOpen: false, isEditSettingsOpen: false });
            }
        }

        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        if (this.state.isUserInfoOpen !== undefined && e.type !== 'touchend') {
            userInfoActionCreator.userInfoClicked(this.state.isUserInfoOpen);
        }
    };

   /**
    * Open/Close the User details
    * @param {any} source - The source element
    */
    private openCloseUserDetails(saveUserOptions: boolean = true) {
        if (this.state.isUserInfoOpen === undefined || this.state.isUserInfoOpen === false) {
            /** if user details window is open, get the user info details to fill */
            userInfoActionCreator.GetLoggedUserInfo();
            this.setState({ isUserInfoOpen: true });
        } else {

            if (saveUserOptions) {
                /** Saving changed user options if any of them changed */
                this.saveUserOptions();
            }
            markingActionCreator.setMarkEntrySelected();

            this.setState({ isUserInfoOpen: false, isEditSettingsOpen: false });
        }

    }

    /**
     *  Open/Close edit user option window
     * @param source - The source element
     */
    private onEditSettingsClick(source: any) {
        if (this.state.isEditSettingsOpen === undefined || this.state.isEditSettingsOpen === false) {
            this.setState({ isEditSettingsOpen: true });
        } else {
            this.setState({ isEditSettingsOpen: false });
        }
    }

    /**
     * Update the user information.
     */
    private updateUserInformation = (): void => {
        /** setting the state when user info id loaded to initiate rendering of user info component */
        this.setState({ isUserInfoLoaded: true });
    };

   /**
    * User options save
    */
    private saveUserOptions(): void {
        /** Saving changed user options if any of them changed */
        userOptionsHelper.InitiateSaveUserOption(false);
    }
    /**
     * Subscribe window click event
     */
     public componentDidMount() {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        /** subscribe to user info event */
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.TOGGLE_USER_INFO_PANEL, this.openCloseUserDetails);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    }

    /**
     * Unsubscribe window click event
     */
     public componentWillUnmount() {

        // Resetting the useroption status to closed once component is being removed from view.
        userInfoActionCreator.userInfoClicked(false);

        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.updateUserInformation);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.TOGGLE_USER_INFO_PANEL, this.openCloseUserDetails);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        return (
            <li id='userMenuItem' role='menuitem' aria-haspopup='true'className={classNames('dropdown-wrap user-menu', {
                'open': this.isOpenUserInfo,
                'close': this.state.isUserInfoOpen === undefined ? this.state.isUserInfoOpen : !this.isOpenUserInfo
            }) } title= ''>
                <a href='javascript:void(0)'
                    title={localeStore.instance.TranslateText('generic.navigation-bar.user-menu-tooltip') }
                    className='menu-button allow-edge-tap'
                    onClick={() => this.openCloseUserDetails()} >
                    <span className='sprite-icon user-icon allow-edge-tap'>User Profile
                    </span>
                    <span></span>
                    <span className='sprite-icon menu-arrow-icon lite allow-edge-tap'>
                    </span>
                </a>
                <div className='menu-callout'></div>
                <div role='menu' aria-hidden='true'
                    className={classNames('menu', { 'expanded': this.state.isEditSettingsOpen }) } >
                    <div className='user-info-holder'>
                        <UserInfo isUserInfoLoaded = {this.state.isUserInfoLoaded}
                            selectedLanguage = {this.props.selectedLanguage}
                            isUserInfoOpen={this.isOpenUserInfo} />
                        <div className='edit-settings-nav-holder'>
                            <a href='javascript:void(0)'
                                onClick={this.onEditSettingsClick}
                                className='edit-settings-nav'>
                                {localeStore.instance.TranslateText('generic.user-menu.profile-section.edit-settings') }
                                <span className='sprite-icon menu-arrow-icon'></span>
                            </a>
                        </div>
                    </div>
                    <UserOptionSettings selectedLanguage={this.props.selectedLanguage}
                        isUserOptionLoaded={this.props.isUserOptionLoaded} />
                </div>
            </li>
        );
     }

    /**
     * close user info on offline mode
     */
    private onOnlineStatusChanged = (): void => {
        // in offline mode if the user info panel is open and user details are not loaded yet, then close the panel
        if (this.state.isUserInfoOpen &&
            !userInfoStore.instance.UserName &&
            !applicationStore.instance.isOnline) {
            this.openCloseUserDetails(false);
        }
    };

    /**
     * gets whether open the user info or not
     */
    private get isOpenUserInfo(): boolean {
        // in offline mode if the user info panel is open and user details are not loaded yet, then close the panel
        // if the user details are loaded, then do not close the panel even if system in offline mode
        return this.state.isUserInfoOpen &&
            ((!userInfoStore.instance.UserName && applicationStore.instance.isOnline) ||
                (userInfoStore.instance.UserName && userInfoStore.instance.UserName !== ''));
    }
}
export = UserDetails;

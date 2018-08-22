/*
  React component for ask for logout button in user options
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import useroptionStore = require('../../stores/useroption/useroptionstore');
import ToggleButton = require('../utility/togglebutton');
import userInfoStore = require('../../stores/userinfo/userinfostore');
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    isUserOptionLoaded?: boolean;
    style?: React.CSSProperties;
}
interface State {
    isAskOnLogout?: boolean;
    isAutoAdvanceOn?: boolean;
	isPauseMediaonOffpageCommentAdd: boolean;
    isEmailmeToggleOn: boolean;
    isOnScreenHintsOn: boolean;
	renderedOn: number;
}
/**
 * React component class for Ask on Logout confirmation
 */
class LogoutConfirmationDialog extends pureRenderComponent<Props, State> {

	private _isAskOnLogout: boolean;
	private _isAutoAdvanceOn: boolean;
	private _isOffpageCommentOn: boolean;
	private _isEmailmeToggleOn: boolean;
	private _emailAddress: string = '';
    private _isScriptAvailabilityEmailAlert: boolean;
    private _isOnScreenHintsOn: boolean;

    /**
     * Constructor LogoutConfirmationDialog
     * @param props
     * @param state
     */
	constructor(props: Props, state: State) {
		super(props, state);
		this.state = {
			isAskOnLogout: userOptionsHelper.getUserOptionByName(userOptionKeys.ASK_ON_LOG_OUT) === 'true' ? true : false,
			isAutoAdvanceOn: userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER) === 'true' ?
				true : false,
			isPauseMediaonOffpageCommentAdd:
			userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED) === 'true' ?
				true : false,
			isEmailmeToggleOn: userOptionsHelper.getUserOptionByName(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION)
                === 'true' ? true : false,
            isOnScreenHintsOn: userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true' ? true : false,
			renderedOn : 0
		};
		this._isAskOnLogout = true;
		this._isAutoAdvanceOn = true;
		this._isOffpageCommentOn = true;
        this._isEmailmeToggleOn = true;
        this._isOnScreenHintsOn = true;
		this.handleChange = this.handleChange.bind(this);
		this.onToggleChange = this.onToggleChange.bind(this);
		this.onOffPageCommentToggleChange = this.onOffPageCommentToggleChange.bind(this);
        this.onEmailmeToggleChange = this.onEmailmeToggleChange.bind(this);
        this.onOnScreenHintsToggleChange = this.onOnScreenHintsToggleChange.bind(this);
	}

    /**
     * Render component
     */
	public render() {
        /**
         * the value of the ask on logout option should take from local json if it is changed else take it from the store
         */
		this._isAskOnLogout = userOptionsHelper.getUserOptionByName(userOptionKeys.ASK_ON_LOG_OUT) === 'true' ? true : false;
		this._isAutoAdvanceOn = userOptionsHelper.getUserOptionByName(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER)
			=== 'true' ? true : false;
		this._isOffpageCommentOn = userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED)
			=== 'true' ? true : false;
		this._isEmailmeToggleOn = userOptionsHelper.getUserOptionByName(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION)
            === 'true' ? true : false;
        this._isOnScreenHintsOn = userOptionsHelper.getUserOptionByName(userOptionKeys.ON_SCREEN_HINTS) === 'true' ? true : false;

		let emailMeToggleOption: JSX.Element;
		let enterEmailAddressAbove: JSX.Element;

		if (this._emailAddress === null || this._emailAddress === '') {
			enterEmailAddressAbove = (
				<label className='error-alert simple-alert'>
					{localeStore.instance.TranslateText('generic.user-menu.user-options.enter-email-address-above')}
				</label>
			);
		} else {
			enterEmailAddressAbove = null;
		}

		if (this._isScriptAvailabilityEmailAlert) {
			emailMeToggleOption = (
				<div className='form-field inline script-available-settings'>
					<label id='scriptAvailability' className='label'>
						{localeStore.instance.TranslateText
							('generic.user-menu.user-options.email-me-when-scripts-are-available-for-standardisation')}
						<br />
						{enterEmailAddressAbove}
					</label>
					<ToggleButton
                        id='scriptavailability_id'
                        key='scriptavailability_key'
                        isChecked={this._isEmailmeToggleOn}
                        selectedLanguage={this.props.selectedLanguage}
                        index={0}
                        onChange={this.onEmailmeToggleChange}
                        style={this.props.style}
                        className={'form-component'}
                        title={localeStore.instance.TranslateText
                            ('generic.user-menu.user-options.email-me-when-scripts-are-available-for-standardisation')}
                        isDisabled={this._emailAddress === null || this._emailAddress === '' ? true : false}
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>
				</div>
			);
		} else {
			emailMeToggleOption = null;
		}

		return (
			<div>
				<div className='logout-settings form-field inline'>
					<label  className='label'>
						{localeStore.instance.TranslateText('generic.user-menu.user-options.logout-confirmation') }
					</label>
					<div className='form-component toggle-button' aria-pressed='true'>
						<input type='checkbox'
							id='logoutConfirm'
							checked={this._isAskOnLogout }
							data-value={this._isAskOnLogout }
							onChange={this.handleChange}/>
						<label title={localeStore.instance.TranslateText('generic.user-menu.user-options.logout-confirmation-tooltip') }
							className='toggle-label' htmlFor='logoutConfirm'>
							<div className='toggle-content'>
								<div className='on-text'>
									{localeStore.instance.TranslateText('generic.toggle-button-states.on') }
								</div>
								<div className='off-text'>
									{localeStore.instance.TranslateText('generic.toggle-button-states.off') }
								</div>
							</div>
							<div className='toggle-switch'></div>
						</label>
					</div>
				</div>
				<div className='form-field inline single-digit-mark-settings'>
					<label id='singleDigit' className='label'>
						{localeStore.instance.TranslateText
							('generic.user-menu.user-options.assign-single-digit-marks-without-pressing-enter')}
					</label>
					<ToggleButton
						id='assignSingleDigit_id'
						key='assignSingleDigit_key'
						isChecked={this._isAutoAdvanceOn}
						selectedLanguage = {this.props.selectedLanguage}
						index={0}
						onChange={this.onToggleChange}
						style={this.props.style}
						className={'form-component'}
						title={localeStore.instance.TranslateText
                            ('generic.user-menu.user-options.assign-single-digit-marks-without-pressing-enter')}
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>
				</div>
				<div className='form-field inline pause-media-offpagecomment'>
					<label id='enhanced' className='label'>
						{localeStore.instance.TranslateText
							('generic.user-menu.user-options.pause-media-when-offpage-comments-are-added')}
					</label>
					<ToggleButton
						id='enhancedoffpage_id'
						key='enhancedoffpage_key'
						isChecked={this._isOffpageCommentOn}
						selectedLanguage={this.props.selectedLanguage}
						index={0}
						onChange={this.onOffPageCommentToggleChange}
						style={this.props.style}
						className={'form-component'}
						title={localeStore.instance.TranslateText
                            ('generic.user-menu.user-options.pause-media-when-offpage-comments-are-added')}
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>
				</div>
                {emailMeToggleOption}
                <div className='on-screen-hint-settings form-field inline'>
                    <label id='onScreenHint' className='label'>
                        {localeStore.instance.TranslateText
                            ('generic.user-menu.user-options.on-screen-hints')}
                    </label>
                    <ToggleButton
                        id='onScreenHint_id'
                        key='onScreenHint_key'
                        isChecked={this._isOnScreenHintsOn}
                        selectedLanguage={this.props.selectedLanguage}
                        index={0}
                        onChange={this.onOnScreenHintsToggleChange}
                        style={this.props.style}
                        className={'form-component'}
                        title={localeStore.instance.TranslateText
                            ('generic.user-menu.user-options.on-screen-hints')}
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>
                </div>
			</div>
		);
	}

    /**
     * for handling the ask on logout option change event.
     */
	private handleChange(evt: any): void {
		this._isAskOnLogout = !this._isAskOnLogout;
		/** Adding/Updating the changed value to the local json variable changed user options */
		userOptionsHelper.save(userOptionKeys.ASK_ON_LOG_OUT, String(this._isAskOnLogout));
		this.setState({ isAskOnLogout: !this.state.isAskOnLogout });
	}

    /**
     * for handling the ask on Single Digit Mark Setting option change event.
     */
	private onToggleChange(evt: any): void {
		this._isAutoAdvanceOn = !this._isAutoAdvanceOn;
		/** Adding/Updating the changed value to the local json variable changed user options */
		userOptionsHelper.save(userOptionKeys.ASSIGN_SINGLE_DIGIT_WITHOUT_PRESSING_ENTER, String(this._isAutoAdvanceOn));
		this.setState({ isAutoAdvanceOn: !this.state.isAutoAdvanceOn });
	}

    /**
     * for handling the ask on Single Digit Mark Setting option change event.
     */
	private onOffPageCommentToggleChange(evt: any): void {
		this._isOffpageCommentOn = !this._isOffpageCommentOn;
		/** Adding/Updating the changed value to the local json variable changed user options */
		userOptionsHelper.save(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED, String(this._isOffpageCommentOn));
		this.setState({ isPauseMediaonOffpageCommentAdd: !this.state.isPauseMediaonOffpageCommentAdd });
	}

	/**
	 * for handling the ask on Script Availability Email Alert change event.
	 */
	private onEmailmeToggleChange(evt: any): void {
		this._isEmailmeToggleOn = !this._isEmailmeToggleOn;
		userOptionsHelper.save(userOptionKeys.EMAIL_ME_WHEN_SCRIPTS_ARE_AVAILABLE_FOR_STANDARDISATION, String(this._isEmailmeToggleOn));
		this.setState({ isEmailmeToggleOn: !this.state.isEmailmeToggleOn });
    }

    /**
     * 
     * Handling the on screen hint toggle change event
     */
    private onOnScreenHintsToggleChange(evt: any): void {
        this._isOnScreenHintsOn = !this._isOnScreenHintsOn;
        userOptionsHelper.save(userOptionKeys.ON_SCREEN_HINTS, String(this._isOnScreenHintsOn));
        this.setState({ isOnScreenHintsOn: !this.state.isOnScreenHintsOn });
    }

    /**
     * Subscribe the user option save event to re-render the component on change of ask on logout value.
     */
	public componentWillMount() {
		useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.refreshState);
	}

    /**
     * Unsubscribe events
     */
	public componentWillUnmount() {
		useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_SAVE_EVENT, this.refreshState);
		userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.getUserInformation);
		userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
	}

	/**
	 * Component did mount
	 */
	public componentDidMount() {
		userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_EVENT, this.getUserInformation);
		userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
    }

    /**
     * Refresh state
     */
	private refreshState = (): void => {
		/** resetting the locally stored user option collection */
		// userOptionsHelper.resetChangedUserOptions();
		this.setState({ isAskOnLogout: !this.state.isAskOnLogout });
		this.setState({ isAutoAdvanceOn: !this.state.isAutoAdvanceOn });
	};

	/**
	 * Get the user information from userinfo store
	 */
	private getUserInformation = (): void => {
		this._emailAddress = userInfoStore.instance.EmailAddress;
		this._isScriptAvailabilityEmailAlert = userInfoStore.instance.IsScriptAvailabilityEmailAlert;
		this.setState({ renderedOn: Date.now()});
	};

	/**
	 * Get the email address from userinfo store after save the email address.
	 */
	private userInfoSaved = (): void => {
		this._emailAddress = userInfoStore.instance.EmailAddress;
		this.setState({ renderedOn: Date.now() });
	};
}

export = LogoutConfirmationDialog;
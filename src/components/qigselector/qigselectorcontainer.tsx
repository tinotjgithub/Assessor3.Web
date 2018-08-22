import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import Header = require('../header');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import localeStore = require('../../stores/locale/localestore');
import busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
import classNames = require('classnames');
import GenericDialog = require('../utility/genericdialog');
import Footer = require('../footer');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import examinerViewDataHelper = require('../../utility/teammanagement/helpers/examinerviewdatahelper');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import QigSelector = require('./qigselector');
import LocksInQigPopup = require('./locksinqigpopup');
import qigStore = require('../../stores/qigselector/qigstore');
import stringHelper = require('../../utility/generic/stringhelper');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    isNavigatedAfterFromLogin?: boolean;
}
/* tslint:disable:no-empty-interfaces */

/**
 * State of a component
 */
interface State {
    isLogoutConfirmationPopupDisplaying?: boolean;
    isBusy?: boolean;
    renderedOn?: number;
}

/**
 * React component for team management
 */
class QigSelectorContainer extends pureRenderComponent<Props, State> {

    /* has data refresh started */
    private isContentRefreshStarted: boolean;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
		super(props, state);
		this.state = {
			isBusy: false,
			isLogoutConfirmationPopupDisplaying: false,
			renderedOn: Date.now()
        };
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
    }

    /**
     * Subscribe to language change event
     */
    public componentDidMount() {
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
    }

    /**
     * Unsubscribe language change event
     */
    public componentWillUnmount() {
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);

    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let busyIndicator = (
            <BusyIndicator
                id = 'busyIndicator'
                key = 'busyIndicator'
                isBusy = { this.state.isBusy }
                busyIndicatorInvoker = { busyIndicatorStore.instance.getBusyIndicatorInvoker}
                />);

        let header = (
            <Header selectedLanguage={this.props.selectedLanguage}
                isInTeamManagement = {true}
                containerPage = {enums.PageContainers.QigSelector}/>
        );

        let footer = (<Footer selectedLanguage = { this.props.selectedLanguage }
            id={'footer_team_mgmt'} key={'footer_team_mgmt'}
            footerType = { enums.FooterType.TeamManagement }
            isLogoutConfirmationPopupDisplaying = { this.state.isLogoutConfirmationPopupDisplaying }
            resetLogoutConfirmationSatus = { this.resetLogoutConfirmationSatus} />);

        return (
            <div className= {classNames('qig-page-wrapper') }>
                { header }
                { footer }
                <QigSelector
                        containerPage = {enums.PageContainers.QigSelector}
                        isNavigatedAfterFromLogin = {this.props.isNavigatedAfterFromLogin}
                        selectedLanguage={this.props.selectedLanguage}/>
            </div>

        );
    }

	/**
	 * Subscribing component updated event.
	 */
    public componentDidUpdate() {
        /*In Qig Selector lock popup offline scenario, isBusy will come as undefined so 
        changing the condition */
		if (this.state.isBusy === true) {
			this.props.setOfflineContainer(true);
		}
	}

    /**
     * Show busy indicator when submit is clicked in live open worklist
     */
    private setBusyIndicator = (): void => {
        /* if any error occurs set the variable to false and content refresh has started */
        if (busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none &&
            this.isContentRefreshStarted) {
            this.resetContentRefreshStatuses();
        }

        this.setState({
            isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker === enums.BusyIndicatorInvoker.none ? false : true
        });
	};

    /**
     * Reset content refresh statuses
     */
    private resetContentRefreshStatuses() {
        this.isContentRefreshStarted = false;
    }

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    private resetLogoutConfirmationSatus(): void {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: true });
    };
}

export = QigSelectorContainer;

import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import classNames = require('classnames');
import Header = require('../header');
import Footer = require('../footer');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import busyIndicatorStore = require('../../stores/busyindicator/busyindicatorstore');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import awardingstore = require('../../stores/awarding/awardingstore');
import userOptionsStore = require('../../stores/useroption/useroptionstore');
import useroptionKeys = require('../../utility/useroption/useroptionkeys');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import awardingHelper = require('../utility/awarding/awardinghelper');
import awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import Awarding = require('./awarding');
import AwardingComponentsPanel = require('./awardingcomponentspanel');
/**
 * Properties of Awarding Container component.
 */
interface Props extends LocaleSelectionBase, PropsBase {
}

/**
 * State of a component
 */
interface State {
    isLeftPanelCollapsed?: boolean;
    isLogoutConfirmationPopupDisplaying?: boolean;
    isBusy?: boolean;
    renderedOn?: number;
}

/**
 * React component for Awarding Container
 */
class AwardingContainer extends pureRenderComponent<Props, State> {

    /* has data refresh started */
    private isContentRefreshStarted: boolean;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            isLeftPanelCollapsed: this.isAwardingLeftPanelCollapsed
        };

        this.setBusyIndicator = this.setBusyIndicator.bind(this);
        this.onUserOptionsLoaded = this.onUserOptionsLoaded.bind(this);
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
        this.onLeftPanelCollapseOrExpand = this.onLeftPanelCollapseOrExpand.bind(this);
        this.resetLogoutConfirmationSatus = this.resetLogoutConfirmationSatus.bind(this);
    }

    /**
     * Subscribe to language change event
     */
    public componentDidMount() {
        /* Initiating action to fetch the componet and session details*/
        awardingActionCreator.getAwardingComponentAndSessionDetails();

        awardingstore.instance.addListener(awardingstore.AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED, this.reRenderOnComponentLoad);
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        userOptionsStore.instance.addListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
    }

    /**
     * Unsubscribe language change event
     */
    public componentWillUnmount() {
        awardingstore.instance.removeListener(awardingstore.AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED, this.reRenderOnComponentLoad);
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        userOptionsStore.instance.removeListener(userOptionsStore.UseroptionStore.USER_OPTION_GET_EVENT, this.onUserOptionsLoaded);
    }

    /**
     * re-render . changing the state rendered on
     */
    private reRenderOnComponentLoad = () => {
        let _selectedComponent = awardingHelper.getUserOptionData(enums.AwardingFilters.ComponentId);
        let _examProductId = awardingHelper.getUserOptionData(enums.AwardingFilters.examProductId);
        let selectedComponentId = _selectedComponent !== '' ? _selectedComponent
            : awardingstore.instance.selectedComponentId;
        let selectedexamProductId = _examProductId.toString() !== '' ? _examProductId.toString() :
            awardingstore.instance.selectedExamProductId;
        let _componentList = awardingstore.instance.componentList;
        // checking added for selecting component using exam productID and componentID
        let _selectedComponentDetails: AwardingComponentAndSession = _componentList
            .filter(x => x.componentId === selectedComponentId &&
                x.examProductId.toString() === selectedexamProductId).first();
        let _assessmentCode = _selectedComponentDetails.assessmentCode;
        let ccPromise = ccActionCreator.getMarkSchemeGroupCCs(awardingstore.instance.selectedSession.markSchemeGroupId
            , awardingstore.instance.selectedSession.questionPaperID);
        ccPromise.then(() => {
            awardingActionCreator.selectAwardingComponent(selectedexamProductId, selectedComponentId, _assessmentCode, true);
        });
    };

    /**
     * Render method
     */
    public render(): JSX.Element {

        let busyIndicator = (
            <BusyIndicator
                id='busyIndicator'
                key='busyIndicator'
                isBusy={this.state.isBusy}
                busyIndicatorInvoker={enums.BusyIndicatorInvoker.none} />);

        let header = (
            <Header
                selectedLanguage={this.props.selectedLanguage}
                renderedOn={this.state.renderedOn}
                containerPage={enums.PageContainers.Awarding} />);

        let footer = (
            <Footer
                id={'footer_awarding'}
                key={'footer_awarding_key'}
                selectedLanguage={this.props.selectedLanguage}
                footerType={enums.FooterType.Awarding}
                isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
                resetLogoutConfirmationSatus={this.resetLogoutConfirmationSatus} />);

        return (
            <div
                className={classNames('awarding-wrapper', this.state.isLeftPanelCollapsed ? 'hide-left' : '')}>
                {header}
                {footer}
                {this.renderDetails()}
                {busyIndicator}
            </div>

        );
    }

    /**
     * Render the details for the awarding
     */
    private renderDetails() {
        return (
            <div className='content-wrapper'>
                <AwardingComponentsPanel
                    id={'AwardingCollapsiblePanelID'}
                    key={'AwardingCollapsiblePanel-Key'} />
                <Awarding
                    id={'AwardingID'}
                    key={'Awarding-Key'}
                    selectedLanguage={this.props.selectedLanguage}
                    toggleLeftPanel={this.onLeftPanelCollapseOrExpand} />
            </div>
        );
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

    /**
     * Handle toggle event of recipient list.
     *
     */
    private onLeftPanelCollapseOrExpand = () => {

        userOptionsHelper.save(useroptionKeys.AWARDING_LEFT_PANEL_COLLAPSED, String(!this.state.isLeftPanelCollapsed));
        this.setState({
            isLeftPanelCollapsed: !this.state.isLeftPanelCollapsed
        });
    };

    /**
     * Gets the awarding left panel toggle state based on the useroption
     */
    private get isAwardingLeftPanelCollapsed(): boolean {

        let isAwardingLeftPanelCollapsed: boolean = false;

        if (userOptionsStore.instance.isLoaded) {
            isAwardingLeftPanelCollapsed = userOptionsHelper.getUserOptionByName(useroptionKeys.AWARDING_LEFT_PANEL_COLLAPSED) === 'true';
        }

        return isAwardingLeftPanelCollapsed;
    }

    /**
     * Sets the awarding left panel toggle state based on the useroption
     */
    private onUserOptionsLoaded = (): void => {

        this.setState({
            isLeftPanelCollapsed: this.isAwardingLeftPanelCollapsed
        });
    };

    /**
     * To rerender
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now()
        });
    }
}

export = AwardingContainer;

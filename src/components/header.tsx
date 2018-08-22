/*
  React component for Authorized page header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('./base/purerendercomponent');
import localeStore = require('../stores/locale/localestore');
import loginSession = require('../app/loginsession');
import MessageNotificationIndicator = require('./utility/notification/messagenotificationindicator');
import AwardingIndicator = require('../components/awarding/awardingindicator');
import awardingStore = require('../stores/awarding/awardingstore');
import UserDetails = require('./user/userdetails/userdetails');
import userOptionActionCreator = require('../actions/useroption/useroptionactioncreator');
import useroptionStore = require('../stores/useroption/useroptionstore');
import messageStore = require('../stores/message/messagestore');
import responseStore = require('../stores/response/responsestore');
import worklistStore = require('../stores/worklist/workliststore');
import responseActionCreator = require('../actions/response/responseactioncreator');
import ResponseNavigation = require('./response/responsenavigation');
import enums = require('./utility/enums');
import htmlUtilities = require('../utility/generic/htmlutilities');
import toolbarStore = require('../stores/toolbar/toolbarstore');
import markingStore = require('../stores/marking/markingstore');
import stampStore = require('../stores/stamp/stampstore');
import stampActionCreator = require('../actions/stamp/stampactioncreator');
import applicationStore = require('../stores/applicationoffline/applicationstore');
import qigStore = require('../stores/qigselector/qigstore');
import qigActionCreator = require('../actions/qigselector/qigselectoractioncreator');
import navigationHelper = require('./utility/navigation/navigationhelper');
import userInfoActionCreator = require('../actions/userinfo/userinfoactioncreator');
import worklistActionCreator = require('../actions/worklist/worklistactioncreator');
let classNames = require('classnames');
import BreadCrumb = require('./breadcrumb/breadcrumb');
import MenuWrapper = require('./menu/menuwrapper');
import teamManagementStore = require('../stores/teammanagement/teammanagementstore');
import urls = require('../dataservices/base/urls');
import tagActionCreator = require('../actions/tag/tagactioncreator');
import auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
import standardisationSetupStore = require('../stores/standardisationsetup/standardisationsetupstore');
import markerOperationModeFactory = require('./utility/markeroperationmode/markeroperationmodefactory');
import awardingActionCreator = require('../actions/awarding/awardingactioncreator');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    containerPage: enums.PageContainers;
    unReadMessageCount?: number;
    isInTeamManagement?: boolean;
    examinerName?: string;
    renderedOn?: number;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    isUserOptionLoaded?: boolean;
    renderedOn?: number;
    displayIcons?: boolean;
    isAcetateInGreyArea?: boolean;
    isAnnotationDrawing?: boolean;
}

/**
 * React component class for Header for Authorized pages
 */
class Header extends pureRenderComponent<Props, State> {

    // Denotes whether if a stamp is paned, is it paned beyond the allowable boundaries
    // If so, the annotation bin would need to be displayed
    private isStampPanedBeyondBoundaries: boolean = false;
    private showOfflineIndicator: boolean = false;
    private elapsedTime: number;
    private timeout: any;
    private lastTap: number = 0;
    private hasAwardingAccess: boolean = false;
    private hasPendingJudgement: boolean = false;
    private reRenderResponseNavigation: boolean = false;

    // these classes allows double tap for ipad(safari)
    private classesToPreventBlocking = [
        'toggle-left-panel',
        'tool-wrap',
        'icon-tray',
        'exp-colp-mrking-tary',
        'mark-button',
        'close-message-link',
        'maximize-message-link',
        'expand-toggle-icon',
        'menu-close',
        'setreview-btn-holder',
        'raise-new-exception',
        'minimize-message-link',
        'mark-button-container',
        'max-txt',
        'mark-button-nav',
        'mark-button-wrapper',
        'rounded',
        'exception-close-link',
        'media-panel',
        'allow-edge-tap',
        'Delete-msg'
    ];

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isUserOptionLoaded: false,
            displayIcons: true,
            renderedOn: Date.now(),
            isAcetateInGreyArea: false,
            isAnnotationDrawing: true
        };

        this.mouseover = this.mouseover.bind(this);
    }

    /**
     * Render method
     */
    public render() {

        let unreadMessageCount = this.props.unReadMessageCount ?
            this.props.unReadMessageCount : messageStore.instance.getUnreadMessageCount;

        let stamp = undefined;
        if (toolbarStore.instance.selectedStampId !== 0) {
            stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        }

        let className = classNames(
            'fixed',
            {'support-envirnoment': loginSession.IS_SUPPORT_ADMIN_LOGIN},
            { 'offline': this.showOfflineIndicator },
            { 'no-drop': this.state.isAnnotationDrawing === false || this.isStampPanedBeyondBoundaries || this.state.isAcetateInGreyArea },
            {
                'drawing': ((stamp !== undefined && stamp.stampType === enums.StampType.dynamic &&
                    (this.state.isAnnotationDrawing === false)) || this.state.isAcetateInGreyArea)
            },
            { 'deleting-annotation': this.isStampPanedBeyondBoundaries }
        );

        let toolTipforOffineMode = localeStore.instance.TranslateText('generic.navigation-bar.offline-tooltip') +
            ((this.elapsedTime < 1) ? '1' : this.elapsedTime) +
            localeStore.instance.TranslateText('generic.navigation-bar.offline-tooltip-minutes-ago');

        return (
            <header className={className} onClick={this.onClickHandler} title={(this.showOfflineIndicator) ? toolTipforOffineMode : ''} >
                <div className='wrapper clearfix' onMouseOver={this.mouseover}
                    onMouseLeave={this.mouseover}>
                    {this.renderBreadCrumb()}
                    {this.renderHeaderCenterPortion()}
                    {this.renderHeaderRightPortion(unreadMessageCount)}
                </div>
                <div className='blue-strip'></div>
            </header>
        );
    }

    /**
     * on click handler
     * @param {any} event
     */
    private onClickHandler(event: any) {
        /* Defect:49599 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying in header 
           issue in ipad */
        if (htmlUtilities.isIPadDevice && messageStore.instance.isMessagePanelVisible) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * This method will render the center portion of Header component
     * Response Header: render response navigation
     */
    private renderHeaderCenterPortion() {

        switch (this.props.containerPage) {
            case enums.PageContainers.Response:
                let currentResponse: number;
                let isNextResponseAvailable: boolean;
                let isPreviousResponseAvailable: boolean;
                let responseId: string;
                let totalResponses: number;
                if (standardisationSetupStore.instance.isSelectResponsesWorklist) {
                    currentResponse = standardisationSetupStore.instance.candidateScriptPosition;
                    isNextResponseAvailable = standardisationSetupStore.instance.isNextCandidateScriptAvailable;
                    isPreviousResponseAvailable = standardisationSetupStore.instance.isPreviousCandidateScriptAvailable;
                    responseId = standardisationSetupStore.instance.selectedResponseId.toString();
                    totalResponses = standardisationSetupStore.instance.totalCandidateScriptCount;
                } else if (markerOperationModeFactory.operationMode.isAwardingMode) {
                    currentResponse = 1;
                    isNextResponseAvailable = false;
                    isPreviousResponseAvailable = false;
                    responseId = responseStore.instance.selectedDisplayId.toString();
                    totalResponses = 1;
                } else {
                    currentResponse =
                        markerOperationModeFactory.operationMode.getResponsePosition(responseStore.instance.selectedDisplayId.toString());
                    isNextResponseAvailable =
                        (markerOperationModeFactory.operationMode.isNextResponseAvailable
                            (responseStore.instance.selectedDisplayId.toString()) &&
                            !teamManagementStore.instance.isRedirectFromException);
                    isPreviousResponseAvailable =
                        (markerOperationModeFactory.operationMode.isPreviousResponseAvailable
                            (responseStore.instance.selectedDisplayId.toString()) &&
                            !teamManagementStore.instance.isRedirectFromException);
                    responseId = (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
                        === enums.StandardisationSetup.SelectResponse
                        && standardisationSetupStore.instance.selectedTabInSelectResponse
                        === enums.StandardisationSessionTab.PreviousSession)
                        ? standardisationSetupStore.instance.getReusablaResponseSelectedDisplayId
                            (responseStore.instance.selectedDisplayId.toString()).toString()
                        : responseStore.instance.selectedDisplayId.toString();
                    totalResponses = markerOperationModeFactory.operationMode.currentResponseCount;
                }

                // If there is no display id, No need to render the component
                if (!isNaN(currentResponse) && !isNaN(responseStore.instance.selectedDisplayId) &&
                    responseStore.instance.selectedDisplayId > 0) {
                    return (<ResponseNavigation currentResponse={currentResponse}
                        isNextResponseAvailable={isNextResponseAvailable}
                        isPreviousResponseAvailable={isPreviousResponseAvailable}
                        responseId={responseId}
                        totalResponses={totalResponses}
                        centreId={standardisationSetupStore.instance.standardisationSetUpSelectedCentreNo}
                        moveCallback={navigationHelper.responseNavigation}
                        selectedLanguage={this.props.selectedLanguage}
                        reRender={this.reRenderResponseNavigation} />);
                }
                return null;
            case enums.PageContainers.TeamManagement:
            case enums.PageContainers.Message:
            case enums.PageContainers.Login:
            case enums.PageContainers.QigSelector:
            case enums.PageContainers.WorkList:
            case enums.PageContainers.MarkingCheckExaminersWorkList:
            case enums.PageContainers.StandardisationSetup:
            case enums.PageContainers.AdminSupport:
            case enums.PageContainers.Awarding:
                return (null);
        }
    }

    /**
     *  TO DO: Andromeda will correct this method as part of Response header functionality in Sprint 8
     */
    private renderHeaderRightPortion(unreadMessageCount: number) {
        let isWorklistIconClickable: boolean = false;
        let isWorklistIconVisible: boolean = true;
        this.hasAwardingAccess = awardingStore.instance.hasAwardingAccess;
        this.hasPendingJudgement = awardingStore.instance.hasPendingJudgement;

        if (this.props.containerPage === enums.PageContainers.Response ||
            this.props.containerPage === enums.PageContainers.Message ||
            this.props.isInTeamManagement) {
            isWorklistIconClickable = true;
        }
        if (this.props.containerPage === enums.PageContainers.QigSelector ||
            this.props.containerPage === enums.PageContainers.TeamManagement ||
            this.props.containerPage === enums.PageContainers.StandardisationSetup ||
            this.props.containerPage === enums.PageContainers.Awarding) {
            isWorklistIconVisible = false;
        }

        if (this.props.containerPage === enums.PageContainers.AdminSupport) {
            return null;
        }

        return (<ul className='nav shift-right' role='menubar'>
            {this.hasAwardingAccess ?
                <AwardingIndicator
                    id='awardingindicator'
                    key='awardingindicator'
                    hasAwardingJudgement={this.hasPendingJudgement}
                    selectedLanguage={this.props.selectedLanguage} />
                : null}
            {this.state.displayIcons === true ?
                <MessageNotificationIndicator
                    id='notification'
                    key='notification'
                    messageNotificationCount={unreadMessageCount}
                    selectedLanguage={this.props.selectedLanguage} />
                : null}
            {this.state.displayIcons === true ?
                <MenuWrapper
                    id='menuwrapper'
                    key='menuwrapper_key'
                    selectedLanguage={this.props.selectedLanguage}
                    handleNavigationClick={navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toMenu)} />
                : null}
            <UserDetails
                selectedLanguage={this.props.selectedLanguage}
                isUserOptionLoaded={this.state.isUserOptionLoaded} />
        </ul>);
    }

    /**
     * Redirect to the start page if not authenticated
     */
    public componentWillMount() {
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
        }
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.refreshUseOption);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.updateNotification);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStarted);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_DRAW, this.onDrawStart);
        markingStore.instance.removeListener(markingStore.MarkingStore.NAVIGATION_UPDATED_EVENT, this.onNavigationUpdated);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.offlineIndicator);
        qigStore.instance.removeListener(qigStore.QigStore.SHOW_HEADER_ICONS, this.displayHeaderIconsOnQIGLoaded);
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.removeEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.removeEventListener('touchend', this.blockDoubleTapZoom, false);
        }
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.responseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATE_IN_GREY_AREA, this.acetateInGreyArea);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.onReclassifyResponse);
    }

    /**
     * This will block the double-tap zoom in ipad
     */
    private blockDoubleTapZoom = (e: any): void => {
        let actualX = e.changedTouches[0].clientX;
        let actualY = e.changedTouches[0].clientY;
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;

        // At the edges of ipad only the single tap is triggered
        // by identifying the edges and blocking the double tap
        if ((actualX <= 30 || actualX >= (clientWidth - 30) || actualY >= (clientHeight - 30)) && this.blockDoubleTap(actualX, actualY)) {
            // unblocking the taps on some icons ,annotions and mark buttons
            // which lies at the edges of ipad
            e.preventDefault();
            return;
        }
        let currentTime = new Date().getTime();
        let tapLength = currentTime - this.lastTap;

        // disable double tap based on interval between two taps
        if (tapLength < 500 && tapLength > 0 && this.blockDoubleTap(actualX, actualY)) {
            // unblocking the taps on some icons ,annotions and mark buttons
            e.preventDefault();
        }

        this.lastTap = currentTime;
    };

    /**
     *  This method will check whether we want to block double tap or not based on the class list provided.
     */
    private blockDoubleTap = (actualX: number, actualY: number): boolean => {
        let ele = htmlUtilities.getElementFromPosition(actualX, actualY);
        let isInValid: boolean = false;
        if (ele) {
            for (let i = 0; i < this.classesToPreventBlocking.length; i++) {
                let className = this.classesToPreventBlocking[i];
                isInValid = (!(ele.classList.contains(className)) && $('.' + className).has(ele).length === 0);
                if (!isInValid) {
                    break;
                }
            }

            return isInValid;
        }
    };

    /**
     * This will block the pinch-to-zoom in ipad
     */
    private blockPinchToZoom = (e: any): void => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    };

    private refreshUseOption = (): void => {
        this.setState({
            isUserOptionLoaded: true
        });
    };

    /**
     * This will re-render the header component
     */
    private reRender = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This will show the header icons after QIGs loaded
     */
    private displayHeaderIconsOnQIGLoaded = (showIcons: boolean = true): void => {
        this.setState({
            displayIcons: showIcons
        });
    };

    /**
     * Component did mount
     */
    public componentDidMount() {
        let useCache = useroptionStore.instance.isLoaded;
        /** Getting the user options */
        userOptionActionCreator.getUserOptions(useCache);
        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.refreshUseOption);

        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT,
            this.updateNotification);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStarted);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_DRAW, this.onDrawStart);
        markingStore.instance.addListener(markingStore.MarkingStore.NAVIGATION_UPDATED_EVENT, this.onNavigationUpdated);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.offlineIndicator);
        qigStore.instance.addListener(qigStore.QigStore.SHOW_HEADER_ICONS, this.displayHeaderIconsOnQIGLoaded);
        if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari') {
            document.documentElement.addEventListener('touchstart', this.blockPinchToZoom, false);
            document.documentElement.addEventListener('touchend', this.blockDoubleTapZoom, false);
        }
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.responseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        qigStore.instance.addListener(qigStore.QigStore.ACETATE_IN_GREY_AREA, this.acetateInGreyArea);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_ACCESS_DETAILS, this.awardingAccessDetailsFetched);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.onReclassifyResponse);
    }

    /**
     * Component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {

        if (this.props !== nextProps) {
            this.setState({
                renderedOn: nextProps.renderedOn
            });
        }
    }

    /**
     * Update notification info
     */
    private updateNotification = (): void => {
        this.reRender();
    };

    /**
     * Update response navigation info
     */
    private responseChanged = (): void => {
        this.reRender();
    };

    /**
     * Invoked on the starting of stamp pan
     */
    private onStampPanStarted = (): void => {
        this.reRender();
    };

    /**
     * Invoked on the ending the stamp pan
     */
    private onStampPanEnd = (): void => {
        this.reRender();
    };

    /**
     * Invoked on the awarding access details fetched
     */
    private awardingAccessDetailsFetched = (): void => {
        this.reRender();
    }

    /**
     * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
     */
    private onStampPanToDeleteArea = (canDelete: boolean): void => {
        this.isStampPanedBeyondBoundaries = canDelete;
        if (this.isStampPanedBeyondBoundaries) {
            responseActionCreator.setMousePosition(-1, -1);
        }
        this.reRender();
    };

    /**
     * updates the offline indicator info.
     */
    private offlineIndicator = (): void => {
        if (!applicationStore.instance.isOnline) {
            this.showOfflineIndicator = true;
        } else {
            this.showOfflineIndicator = false;
        }

        /* Logging event in google analytics or application insights based on the configuration */
        new auditLoggingHelper().logHelper.
            logEventOnApplicationStatusChange(
            applicationStore.instance.isOnline ?
                'Application Online' :
                'Application Offline');

        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to be invoked once the annotation starts drawing
     */
    private onDrawStart = (isAnnotationDrawing: boolean): void => {
        // re-render only if there is a change in isAnnotationDrawing as this happens on mousemove.
        if (this.state.isAnnotationDrawing !== isAnnotationDrawing) {
            this.setState({
                isAnnotationDrawing: isAnnotationDrawing,
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Navigate to particular page container
     */
    private onNavigationUpdated = (navigateTo: enums.SaveAndNavigate): void => {
        /** navigating from a closed response doesn't require to call save marks */
        if (navigateTo !== enums.SaveAndNavigate.toMenu) {
            worklistActionCreator.responseClosed(true);
        }

		/** If we are navigating to inbox directly navigate to the message page */
        if (navigateTo === enums.SaveAndNavigate.toInboxMessagePage) {
            navigationHelper.loadMessagePage();
            return;
        }

        navigationHelper.loadContainerIfNeeded(enums.PageContainers.Response,
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
    };

    /**
     * Method to detect mouse  over
     * @param event
     */
    private mouseover(event: any) {
        if (!applicationStore.instance.isOnline) {
            //Calculates the number of minutes that have elapsed since Assessor 3 first detected as offline.
            this.elapsedTime = Math.round(((Date.now() - applicationStore.instance.elapsedTime) / 1000) / 60);
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * Navigate to QigSelector while clicking on Logo
     */
    private navigateToQigSelector() {

        let hasQigData: boolean = qigStore.instance.getOverviewData ?
            qigStore.instance.getOverviewData.qigSummary.count() > 0 : undefined;

        // if the remember qig is active then while navigating to qigselector
        // from worklist then the qigdata will be undefined, so it it is undefined
        // we need to get the qig list details to display it
        if (!hasQigData) {
            qigActionCreator.getQIGSelectorData(0);
        }

        // set the marker operation mode as Marking
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
        navigationHelper.loadQigSelector();
    }

    /**
     * This method will render the Bread Crumb component
     */
    private renderBreadCrumb() {
        return (<BreadCrumb
            id={'BreadCrumbComponent'}
            key={'key_BreadCrumbComponent'}
            containerPage={this.props.containerPage}
            selectedLanguage={this.props.selectedLanguage}
            renderedOn={this.props.renderedOn}
            examinerName={this.props.examinerName} />);
    }

    /**
     * fired when acetate is moved to grey area
     */
    private acetateInGreyArea = (isInGreyArea: boolean): void => {
        // rerender when there is any change in isInGreyArea
        this.setState({
            isAcetateInGreyArea: isInGreyArea,
            renderedOn: Date.now()
        });
    };

    /**
     * Invoked on reclassifying a respone to render header and response navigation
     */
    private onReclassifyResponse = (isTotalMarksViewSelected: boolean,
        selectedStandardisationSetupWorkList: enums.StandardisationSetup, doMarkNow: boolean = false): void => {
        if (selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse) {
            this.reRenderResponseNavigation = !this.reRenderResponseNavigation;
            this.reRender();
        }
    };
}
export = Header;
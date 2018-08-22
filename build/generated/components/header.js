"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Authorized page header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('./base/purerendercomponent');
var localeStore = require('../stores/locale/localestore');
var loginSession = require('../app/loginsession');
var MessageNotificationIndicator = require('./utility/notification/messagenotificationindicator');
var AwardingIndicator = require('../components/awarding/awardingindicator');
var awardingStore = require('../stores/awarding/awardingstore');
var UserDetails = require('./user/userdetails/userdetails');
var userOptionActionCreator = require('../actions/useroption/useroptionactioncreator');
var useroptionStore = require('../stores/useroption/useroptionstore');
var messageStore = require('../stores/message/messagestore');
var responseStore = require('../stores/response/responsestore');
var worklistStore = require('../stores/worklist/workliststore');
var responseActionCreator = require('../actions/response/responseactioncreator');
var ResponseNavigation = require('./response/responsenavigation');
var enums = require('./utility/enums');
var htmlUtilities = require('../utility/generic/htmlutilities');
var toolbarStore = require('../stores/toolbar/toolbarstore');
var markingStore = require('../stores/marking/markingstore');
var stampStore = require('../stores/stamp/stampstore');
var stampActionCreator = require('../actions/stamp/stampactioncreator');
var applicationStore = require('../stores/applicationoffline/applicationstore');
var qigStore = require('../stores/qigselector/qigstore');
var qigActionCreator = require('../actions/qigselector/qigselectoractioncreator');
var navigationHelper = require('./utility/navigation/navigationhelper');
var userInfoActionCreator = require('../actions/userinfo/userinfoactioncreator');
var worklistActionCreator = require('../actions/worklist/worklistactioncreator');
var classNames = require('classnames');
var BreadCrumb = require('./breadcrumb/breadcrumb');
var MenuWrapper = require('./menu/menuwrapper');
var teamManagementStore = require('../stores/teammanagement/teammanagementstore');
var auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
var standardisationSetupStore = require('../stores/standardisationsetup/standardisationsetupstore');
var markerOperationModeFactory = require('./utility/markeroperationmode/markeroperationmodefactory');
/**
 * React component class for Header for Authorized pages
 */
var Header = (function (_super) {
    __extends(Header, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function Header(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Denotes whether if a stamp is paned, is it paned beyond the allowable boundaries
        // If so, the annotation bin would need to be displayed
        this.isStampPanedBeyondBoundaries = false;
        this.showOfflineIndicator = false;
        this.lastTap = 0;
        this.hasAwardingAccess = false;
        this.hasPendingJudgement = false;
        // these classes allows double tap for ipad(safari)
        this.classesToPreventBlocking = [
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
         * This will block the double-tap zoom in ipad
         */
        this.blockDoubleTapZoom = function (e) {
            var actualX = e.changedTouches[0].clientX;
            var actualY = e.changedTouches[0].clientY;
            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            // At the edges of ipad only the single tap is triggered
            // by identifying the edges and blocking the double tap
            if ((actualX <= 30 || actualX >= (clientWidth - 30) || actualY >= (clientHeight - 30)) && _this.blockDoubleTap(actualX, actualY)) {
                // unblocking the taps on some icons ,annotions and mark buttons
                // which lies at the edges of ipad
                e.preventDefault();
                return;
            }
            var currentTime = new Date().getTime();
            var tapLength = currentTime - _this.lastTap;
            // disable double tap based on interval between two taps
            if (tapLength < 500 && tapLength > 0 && _this.blockDoubleTap(actualX, actualY)) {
                // unblocking the taps on some icons ,annotions and mark buttons
                e.preventDefault();
            }
            _this.lastTap = currentTime;
        };
        /**
         *  This method will check whether we want to block double tap or not based on the class list provided.
         */
        this.blockDoubleTap = function (actualX, actualY) {
            var ele = htmlUtilities.getElementFromPosition(actualX, actualY);
            var isInValid = false;
            if (ele) {
                for (var i = 0; i < _this.classesToPreventBlocking.length; i++) {
                    var className = _this.classesToPreventBlocking[i];
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
        this.blockPinchToZoom = function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };
        this.refreshUseOption = function () {
            _this.setState({
                isUserOptionLoaded: true
            });
        };
        /**
         * This will re-render the header component
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This will show the header icons after QIGs loaded
         */
        this.displayHeaderIconsOnQIGLoaded = function (showIcons) {
            if (showIcons === void 0) { showIcons = true; }
            _this.setState({
                displayIcons: showIcons
            });
        };
        /**
         * Update notification info
         */
        this.updateNotification = function () {
            _this.reRender();
        };
        /**
         * Update response navigation info
         */
        this.responseChanged = function () {
            _this.reRender();
        };
        /**
         * Invoked on the starting of stamp pan
         */
        this.onStampPanStarted = function () {
            _this.reRender();
        };
        /**
         * Invoked on the ending the stamp pan
         */
        this.onStampPanEnd = function () {
            _this.reRender();
        };
        /**
         * Invoked on the awarding access details fetched
         */
        this.awardingAccessDetailsFetched = function () {
            _this.reRender();
        };
        /**
         * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
         */
        this.onStampPanToDeleteArea = function (canDelete) {
            _this.isStampPanedBeyondBoundaries = canDelete;
            if (_this.isStampPanedBeyondBoundaries) {
                responseActionCreator.setMousePosition(-1, -1);
            }
            _this.reRender();
        };
        /**
         * updates the offline indicator info.
         */
        this.offlineIndicator = function () {
            if (!applicationStore.instance.isOnline) {
                _this.showOfflineIndicator = true;
            }
            else {
                _this.showOfflineIndicator = false;
            }
            /* Logging event in google analytics or application insights based on the configuration */
            new auditLoggingHelper().logHelper.
                logEventOnApplicationStatusChange(applicationStore.instance.isOnline ?
                'Application Online' :
                'Application Offline');
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to be invoked once the annotation starts drawing
         */
        this.onDrawStart = function (isAnnotationDrawing) {
            // re-render only if there is a change in isAnnotationDrawing as this happens on mousemove.
            if (_this.state.isAnnotationDrawing !== isAnnotationDrawing) {
                _this.setState({
                    isAnnotationDrawing: isAnnotationDrawing,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Navigate to particular page container
         */
        this.onNavigationUpdated = function (navigateTo) {
            /** navigating from a closed response doesn't require to call save marks */
            if (navigateTo !== enums.SaveAndNavigate.toMenu) {
                worklistActionCreator.responseClosed(true);
            }
            navigationHelper.loadContainerIfNeeded(enums.PageContainers.Response, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
        };
        /**
         * fired when acetate is moved to grey area
         */
        this.acetateInGreyArea = function (isInGreyArea) {
            // rerender when there is any change in isInGreyArea
            _this.setState({
                isAcetateInGreyArea: isInGreyArea,
                renderedOn: Date.now()
            });
        };
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
    Header.prototype.render = function () {
        var unreadMessageCount = this.props.unReadMessageCount ?
            this.props.unReadMessageCount : messageStore.instance.getUnreadMessageCount;
        var stamp = undefined;
        if (toolbarStore.instance.selectedStampId !== 0) {
            stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
        }
        var className = classNames('fixed', { 'offline': this.showOfflineIndicator }, { 'no-drop': this.state.isAnnotationDrawing === false || this.isStampPanedBeyondBoundaries || this.state.isAcetateInGreyArea }, {
            'drawing': ((stamp !== undefined && stamp.stampType === enums.StampType.dynamic &&
                (this.state.isAnnotationDrawing === false)) || this.state.isAcetateInGreyArea)
        }, { 'deleting-annotation': this.isStampPanedBeyondBoundaries });
        var toolTipforOffineMode = localeStore.instance.TranslateText('generic.navigation-bar.offline-tooltip') +
            ((this.elapsedTime < 1) ? '1' : this.elapsedTime) +
            localeStore.instance.TranslateText('generic.navigation-bar.offline-tooltip-minutes-ago');
        return (React.createElement("header", {className: className, onClick: this.onClickHandler, title: (this.showOfflineIndicator) ? toolTipforOffineMode : ''}, React.createElement("div", {className: 'wrapper clearfix', onMouseOver: this.mouseover, onMouseLeave: this.mouseover}, this.renderBreadCrumb(), this.renderHeaderCenterPortion(), this.renderHeaderRightPortion(unreadMessageCount)), React.createElement("div", {className: 'blue-strip'})));
    };
    /**
     * on click handler
     * @param {any} event
     */
    Header.prototype.onClickHandler = function (event) {
        /* Defect:49599 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying in header
           issue in ipad */
        if (htmlUtilities.isIPadDevice && messageStore.instance.isMessagePanelVisible) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        stampActionCreator.showOrHideComment(false);
    };
    /**
     * This method will render the center portion of Header component
     * Response Header: render response navigation
     */
    Header.prototype.renderHeaderCenterPortion = function () {
        switch (this.props.containerPage) {
            case enums.PageContainers.Response:
                var currentResponse = void 0;
                var isNextResponseAvailable = void 0;
                var isPreviousResponseAvailable = void 0;
                var responseId = void 0;
                var totalResponses = void 0;
                if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
                    currentResponse = standardisationSetupStore.instance.candidateScriptPosition;
                    isNextResponseAvailable = standardisationSetupStore.instance.isNextCandidateScriptAvailable;
                    isPreviousResponseAvailable = standardisationSetupStore.instance.isPreviousCandidateScriptAvailable;
                    responseId = standardisationSetupStore.instance.selectedResponseId.toString();
                    totalResponses = standardisationSetupStore.instance.totalCandidateScriptCount;
                }
                else {
                    currentResponse =
                        markerOperationModeFactory.operationMode.getResponsePosition(responseStore.instance.selectedDisplayId.toString());
                    isNextResponseAvailable =
                        (markerOperationModeFactory.operationMode.isNextResponseAvailable(responseStore.instance.selectedDisplayId.toString()) &&
                            !teamManagementStore.instance.isRedirectFromException);
                    isPreviousResponseAvailable =
                        (markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseStore.instance.selectedDisplayId.toString()) &&
                            !teamManagementStore.instance.isRedirectFromException);
                    responseId = responseStore.instance.selectedDisplayId.toString();
                    totalResponses = markerOperationModeFactory.operationMode.currentResponseCount;
                }
                // If there is no display id, No need to render the component
                if (!isNaN(currentResponse) && !isNaN(responseStore.instance.selectedDisplayId) &&
                    responseStore.instance.selectedDisplayId > 0) {
                    return (React.createElement(ResponseNavigation, {currentResponse: currentResponse, isNextResponseAvailable: isNextResponseAvailable, isPreviousResponseAvailable: isPreviousResponseAvailable, responseId: responseId, totalResponses: totalResponses, centreId: standardisationSetupStore.instance.standardisationSetUpSelectedCentreNo, moveCallback: navigationHelper.responseNavigation, selectedLanguage: this.props.selectedLanguage}));
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
    };
    /**
     *  TO DO: Andromeda will correct this method as part of Response header functionality in Sprint 8
     */
    Header.prototype.renderHeaderRightPortion = function (unreadMessageCount) {
        var isWorklistIconClickable = false;
        var isWorklistIconVisible = true;
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
        return (React.createElement("ul", {className: 'nav shift-right', role: 'menubar'}, this.hasAwardingAccess ?
            React.createElement(AwardingIndicator, {id: 'awardingindicator', key: 'awardingindicator', hasAwardingJudgement: this.hasPendingJudgement, selectedLanguage: this.props.selectedLanguage})
            : null, this.state.displayIcons === true ?
            React.createElement(MessageNotificationIndicator, {id: 'notification', key: 'notification', messageNotificationCount: unreadMessageCount, selectedLanguage: this.props.selectedLanguage})
            : null, this.state.displayIcons === true ?
            React.createElement(MenuWrapper, {id: 'menuwrapper', key: 'menuwrapper_key', selectedLanguage: this.props.selectedLanguage, handleNavigationClick: navigationHelper.handleNavigation.bind(this, enums.SaveAndNavigate.toMenu)})
            : null, React.createElement(UserDetails, {selectedLanguage: this.props.selectedLanguage, isUserOptionLoaded: this.state.isUserOptionLoaded})));
    };
    /**
     * Redirect to the start page if not authenticated
     */
    Header.prototype.componentWillMount = function () {
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
        }
    };
    /**
     * Unsubscribe events
     */
    Header.prototype.componentWillUnmount = function () {
        useroptionStore.instance.removeListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.refreshUseOption);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
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
    };
    /**
     * Component did mount
     */
    Header.prototype.componentDidMount = function () {
        var useCache = useroptionStore.instance.isLoaded;
        /** Getting the user options */
        userOptionActionCreator.getUserOptions(useCache);
        useroptionStore.instance.addListener(useroptionStore.UseroptionStore.USER_OPTION_GET_EVENT, this.refreshUseOption);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
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
    };
    /**
     * Component will receive props
     */
    Header.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                renderedOn: nextProps.renderedOn
            });
        }
    };
    /**
     * Method to detect mouse  over
     * @param event
     */
    Header.prototype.mouseover = function (event) {
        if (!applicationStore.instance.isOnline) {
            //Calculates the number of minutes that have elapsed since Assessor 3 first detected as offline.
            this.elapsedTime = Math.round(((Date.now() - applicationStore.instance.elapsedTime) / 1000) / 60);
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * Navigate to QigSelector while clicking on Logo
     */
    Header.prototype.navigateToQigSelector = function () {
        var hasQigData = qigStore.instance.getOverviewData ?
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
    };
    /**
     * This method will render the Bread Crumb component
     */
    Header.prototype.renderBreadCrumb = function () {
        return (React.createElement(BreadCrumb, {id: 'BreadCrumbComponent', key: 'key_BreadCrumbComponent', containerPage: this.props.containerPage, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn, examinerName: this.props.examinerName}));
    };
    return Header;
}(pureRenderComponent));
module.exports = Header;
//# sourceMappingURL=header.js.map
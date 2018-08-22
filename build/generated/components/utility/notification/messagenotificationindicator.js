"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var enums = require('../enums');
var navigationHelper = require('../../utility/navigation/navigationhelper');
var markingStore = require('../../../stores/marking/markingstore');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var popupHelper = require('../popup/popuphelper');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var responseStore = require('../../../stores/response/responsestore');
var userInfoActionCreator = require('../../../actions/userinfo/userinfoactioncreator');
var navigationStore = require('../../../stores/navigation/navigationstore');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var simulationModeHelper = require('../../../utility/simulation/simulationmodehelper');
var qigStore = require('../../../stores/qigselector/qigstore');
/**
 * Represents the message notification indicator component
 */
var MessageNotificationIndicator = (function (_super) {
    __extends(MessageNotificationIndicator, _super);
    /**
     * @constructor
     */
    function MessageNotificationIndicator(properties, state) {
        var _this = this;
        _super.call(this, properties, state);
        /**
         * Handles the click
         * @param {any} source
         * @returns
         */
        this.handleOnClick = function (source) {
            // If  application is not online and will not be able to navihge, should show message
            // to let the user know that the connection problem
            if (!applicationActionCreator.checkActionInterrupted()) {
                return;
            }
            if (navigationStore.instance.containerPage === enums.PageContainers.WorkList &&
                simulationModeHelper.shouldCheckForStandardisationSetupCompletion()) {
                simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.Message, enums.PageContainers.Message);
            }
            else {
                _this.LoadMessage();
            }
        };
        /**
         * Go to message inbox page after saving mark if there is any
         */
        this.navigateAwayFromResponse = function () {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toInboxMessagePage) {
                if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                    // set the marker operation mode as Marking
                    userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
                }
                navigationHelper.loadContainerIfNeeded(navigationStore.instance.containerPage, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox, _this.context);
            }
        };
        /**
         * On standardisation setup completion
         */
        this.onStandardisationSetupCompletion = function () {
            if (qigStore.instance.navigateToAfterStdSetupCheck === enums.PageContainers.Message &&
                !qigStore.instance.isStandardisationsetupCompletedForTheQig &&
                !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                    _this.LoadMessage();
                }
                else {
                    navigationHelper.loadMessagePage();
                }
            }
        };
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    /**
     * Render method
     */
    MessageNotificationIndicator.prototype.render = function () {
        return (React.createElement("li", {role: 'menuitem'}, React.createElement("a", {id: this.props.id, href: 'javascript:void(0)', className: 'relative', onClick: this.handleOnClick, title: localeStore.instance.TranslateText('generic.navigation-bar.inbox-tooltip')}, React.createElement("span", {className: 'relative'}, React.createElement("span", {className: 'sprite-icon notification-icon'}, localeStore.instance.TranslateText('generic.navigation-bar.inbox-tooltip')), this.getMessageCountRenderer(), React.createElement("span", {className: 'nav-text'}, localeStore.instance.TranslateText('generic.navigation-bar.inbox'))))));
    };
    /**
     * Component mounted
     */
    MessageNotificationIndicator.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        qigStore.instance.addListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
    };
    /**
     * Component unmounted
     */
    MessageNotificationIndicator.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        qigStore.instance.removeListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
    };
    /**
     * Get's the message count span div if unread message is available for the logged in examiner
     */
    MessageNotificationIndicator.prototype.getMessageCountRenderer = function () {
        if (this.props.messageNotificationCount > 0) {
            return React.createElement("span", {className: 'notification-count notification circle', id: 'id_notification_count'}, (this.props.messageNotificationCount).toLocaleString(localeStore.instance.Locale));
        }
    };
    /**
     * Go to Load message inbox page after saving mark if there is any
     */
    MessageNotificationIndicator.prototype.LoadMessage = function () {
        var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons.length > 0) {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toInboxMessagePage);
        }
        else {
            if (markingStore.instance.isMarkingInProgress ||
                responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
                /* Save the selected mark scheme mark to the mark collection on response move */
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toInboxMessagePage);
            }
            else {
                // set the marker operation mode as Marking
                userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
                navigationHelper.loadMessagePage();
            }
        }
    };
    return MessageNotificationIndicator;
}(pureRenderComponent));
module.exports = MessageNotificationIndicator;
//# sourceMappingURL=messagenotificationindicator.js.map
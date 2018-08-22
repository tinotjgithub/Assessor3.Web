"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var localeHelper = require('../../../utility/locale/localehelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var enums = require('../../utility/enums');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var messageStore = require('../../../stores/message/messagestore');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var makerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * LinkedMessageIndicator component.
 * @param {Props} props
 */
var LinkedMessageIndicator = (function (_super) {
    __extends(LinkedMessageIndicator, _super);
    /**
     * Constructor fot LinkedMessageIndicator
     * @param props
     */
    function LinkedMessageIndicator(props) {
        var _this = this;
        _super.call(this, props, null);
        /**
         * Open response message while clicking on linked message icon
         */
        this.onClick = function (event) {
            event.stopPropagation();
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                // open response
                var actualDisplayId = void 0;
                // Ideally marking mode should be read from the opened response,
                // since multiple marking modes won't come in the same worklist now this will work.
                var selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
                if (selectedMarkingMode === enums.MarkingMode.LiveMarking) {
                    actualDisplayId = _this.props.displayId.toString();
                }
                else {
                    var contents = _this.props.displayId.split(' ');
                    actualDisplayId = contents[contents.length - 1];
                }
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualDisplayId));
                if (!messageStore.instance.isMessagePanelActive) {
                    var openedResponseDetails = makerOperationModeFactory.operationMode.openedResponseDetails(actualDisplayId);
                    responseHelper.openResponse(parseFloat(actualDisplayId), enums.ResponseNavigation.specific, makerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                        enums.ResponseMode.open : worklistStore.instance.getResponseMode, makerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                        openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId, enums.ResponseViewMode.zoneView, enums.TriggerPoint.WorkListResponseMessageIcon);
                    markSchemeHelper.getMarks(parseInt(actualDisplayId), selectedMarkingMode);
                }
                else {
                    var messageNavigationArguments = {
                        responseId: parseInt(actualDisplayId),
                        canNavigate: false,
                        navigateTo: enums.MessageNavigation.toResponse,
                        navigationConfirmed: false,
                        hasMessageContainsDirtyValue: undefined,
                        triggerPoint: enums.TriggerPoint.WorkListResponseMessageIcon
                    };
                    messagingActionCreator.canMessageNavigate(messageNavigationArguments);
                }
            }
        };
    }
    /**
     * Render component
     */
    LinkedMessageIndicator.prototype.render = function () {
        var messageContent = this.getMessageContent();
        if (messageContent === undefined && !this.props.isTileView) {
            return null;
        }
        else {
            return (React.createElement("div", {className: 'col wl-message text-center', id: this.props.id + '_messgeIndicator'}, messageContent));
        }
    };
    /**
     * Get message content
     */
    LinkedMessageIndicator.prototype.getMessageContent = function () {
        var messageText = '';
        if (this.props.messageCount > 0) {
            messageText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.unread-messages-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.unread-messages-icon-tooltip');
        }
        else if (this.props.hasMessages) {
            messageText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.messages-icon-tooltip') :
                messageText = localeStore.instance.TranslateText('marking.worklist.response-data.messages-icon-tooltip');
        }
        var messageClass = 'message-icon sprite-icon';
        var messageAltText = localeStore.instance.TranslateText('generic.navigation-bar.inbox');
        var result = undefined;
        if (!this.props.hasMessages) {
            return result;
        }
        if (this.props.messageCount > 0) {
            result = (this.props.isTileView) ? React.createElement("div", {className: 'col-inner'}, React.createElement("a", {title: messageText, className: 'resp-messages'}, React.createElement("span", {className: messageClass}, " ", messageAltText, " "), React.createElement("span", {className: 'notification circle', id: this.props.id + '_messageNotification'}, localeHelper.toLocaleString(this.props.messageCount > 0 ? this.props.messageCount : '')))) :
                React.createElement("div", {className: 'wl-message'}, React.createElement("a", {title: messageText, className: 'resp-messages', onClick: this.onClick}, React.createElement("span", {className: messageClass}, " ", messageAltText, " "), React.createElement("span", {className: 'notification circle', id: this.props.id + '_messageNotification'}, localeHelper.toLocaleString(this.props.messageCount > 0 ? this.props.messageCount : ''))));
        }
        else {
            result = (this.props.isTileView) ? React.createElement("div", {className: 'col-inner'}, React.createElement("a", {title: messageText, className: 'resp-messages'}, React.createElement("span", {className: messageClass}, " ", messageAltText, " "))) :
                React.createElement("div", {className: 'wl-message'}, React.createElement("a", {title: messageText, className: 'resp-messages', onClick: this.onClick}, React.createElement("span", {className: messageClass}, " ", messageAltText, " ")));
        }
        return result;
    };
    return LinkedMessageIndicator;
}(PureRenderComponent));
module.exports = LinkedMessageIndicator;
//# sourceMappingURL=linkedmessageindicator.js.map
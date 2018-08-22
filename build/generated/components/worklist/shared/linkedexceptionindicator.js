"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var localeHelper = require('../../../utility/locale/localehelper');
var stringHelper = require('../../../utility/generic/stringhelper');
var enums = require('../../utility/enums');
var worklistStore = require('../../../stores/worklist/workliststore');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var messageStore = require('../../../stores/message/messagestore');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var exceptionHelper = require('../../utility/exception/exceptionhelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * React component.
 * @param {Props} props
 * @returns
 */
var LinkedExceptionIndicator = (function (_super) {
    __extends(LinkedExceptionIndicator, _super);
    /**
     * Constructor for linked exception indicator
     * @param props
     */
    function LinkedExceptionIndicator(props) {
        var _this = this;
        _super.call(this, props, null);
        /**
         * Open response while clicking on linked exception icon
         */
        this.onLinkedExceptionIconClick = function (event) {
            if (!applicationStore.instance.isOnline) {
                applicationActionCreator.checkActionInterrupted();
            }
            else {
                event.stopPropagation();
                var displayId = _this.props.displayId.toString();
                var exceptionicon = true;
                var selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(displayId));
                exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode, displayId, exceptionicon);
                if (!messageStore.instance.isMessagePanelActive) {
                    var openedResponseDetails = worklistStore.instance.getResponseDetails(displayId);
                    responseHelper.openResponse(parseInt(displayId), enums.ResponseNavigation.specific, worklistStore.instance.getResponseMode, openedResponseDetails.markGroupId, enums.ResponseViewMode.zoneView, enums.TriggerPoint.WorkListResponseExceptionIcon);
                    markSchemeHelper.getMarks(parseInt(displayId), selectedMarkingMode);
                }
                else {
                    var messageNavigationArguments = {
                        responseId: parseInt(displayId),
                        canNavigate: false,
                        navigateTo: enums.MessageNavigation.toResponse,
                        navigationConfirmed: false,
                        hasMessageContainsDirtyValue: undefined,
                        triggerPoint: enums.TriggerPoint.WorkListResponseExceptionIcon
                    };
                    messagingActionCreator.canMessageNavigate(messageNavigationArguments);
                }
            }
        };
    }
    /**
     * render component
     */
    LinkedExceptionIndicator.prototype.render = function () {
        return (!this.props.isTileView) ? this.getExceptionContent()
            :
                (React.createElement("div", {className: 'col wl-alert text-left', id: this.props.id + '_execeptionIndicator'}, this.getExceptionContent()));
    };
    /**
     * Retrns exception content.
     * @returns
     */
    LinkedExceptionIndicator.prototype.getExceptionContent = function () {
        var result = (React.createElement("div", null));
        var toolTipText = '';
        var exceptionClassName = '';
        var notificationClassName = '';
        var exceptionAltText = localeStore.instance.TranslateText('generic.worklist.information-text');
        // The exception alert count:
        // On viewing one's own worklist,
        // the number of exception that has been resolved by supervisor and needs action by the logged in user.
        // In team management view,
        // the number or exception that the supervisor needs to action.
        var exceptionAlertCount = this.props.isTeamManagementMode ?
            (this.props.unactionedExceptionCount ? this.props.unactionedExceptionCount : 0) :
            (this.props.resolvedExceptionsCount ? this.props.resolvedExceptionsCount : 0);
        if (!this.props.hasExceptions && !this.props.hasZoningExceptions) {
            return result;
        }
        if (this.props.hasExceptions && !this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount === 0) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        }
        else if (this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount === 0) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.blocking-exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.blocking-exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-yellow';
        }
        else if (this.props.hasExceptions && !this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount > 0) {
            toolTipText = this.props.isTeamManagementMode ?
                stringHelper.format(localeStore.instance.
                    TranslateText('team-management.examiner-worklist.response-data.resolved-exceptions-icon-tooltip'), [String(this.props.resolvedExceptionsCount)]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.worklist.response-data.resolved-exceptions-icon-tooltip'), [String(this.props.resolvedExceptionsCount)]);
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        }
        else if (this.props.hasBlockingExceptions && this.props.resolvedExceptionsCount > 0) {
            toolTipText = this.props.isTeamManagementMode ? stringHelper.format(localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.resolved-and-blocking-exceptions-icon-tooltip'), [String(this.props.resolvedExceptionsCount)]) :
                stringHelper.format(localeStore.instance.TranslateText('marking.worklist.response-data.resolved-and-blocking-exceptions-icon-tooltip'), [String(this.props.resolvedExceptionsCount)]);
            exceptionClassName = 'sprite-icon info-icon-yellow';
        }
        else if (!this.props.hasZoningExceptions) {
            toolTipText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.exceptions-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.exceptions-icon-tooltip');
            exceptionClassName = 'sprite-icon info-icon-dark-small';
        }
        ////Append the tooltip of existing exceptions with zoning exception tooltip if sibling rig contains zoning exception
        if (this.props.hasZoningExceptions) {
            if (toolTipText && !this.props.isZoningExceptionRaisedInSameScript) {
                toolTipText = toolTipText + '\n\n' + (this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.zoning-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.zoning-exceptions-icon-tooltip'));
            }
            else if (this.props.isZoningExceptionRaisedInSameScript) {
                toolTipText = this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.blocking-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.blocking-exceptions-icon-tooltip');
            }
            else {
                toolTipText = this.props.isTeamManagementMode ?
                    localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.zoning-exceptions-icon-tooltip') :
                    localeStore.instance.TranslateText('marking.worklist.response-data.zoning-exceptions-icon-tooltip');
            }
            exceptionClassName = 'sprite-icon info-icon-yellow';
        }
        /**
         * If exceptionAlertCount is greater than 0 notification will show
         */
        if (exceptionAlertCount > 0) {
            result = (!this.props.isTileView) ? React.createElement("div", {className: 'wl-alert', id: this.props.id + '_execeptionIndicatorNotification'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: this.onLinkedExceptionIconClick}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " "), React.createElement("span", {className: 'notification circle', id: this.props.id + '_execeptionIndicatorNotification'}, localeHelper.toLocaleString(exceptionAlertCount), " "))) :
                React.createElement("div", {className: 'col-inner'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: this.onLinkedExceptionIconClick}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " "), React.createElement("span", {className: 'notification circle', id: this.props.id + '_execeptionIndicatorNotification'}, localeHelper.toLocaleString(exceptionAlertCount), " ")));
        }
        else if (this.props.hasZoningExceptions && !this.props.hasExceptions) {
            result = (!this.props.isTileView) ? React.createElement("div", {className: 'wl-alert', id: this.props.id + '_execeptionIndicatorNotification'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: function (e) { e.stopPropagation(); }}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " ")))
                :
                    React.createElement("div", {className: 'col-inner'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: function (e) { e.stopPropagation(); }}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " ")));
        }
        else {
            result = (!this.props.isTileView) ? React.createElement("div", {className: 'wl-alert', id: this.props.id + '_execeptionIndicatorNotification'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: this.onLinkedExceptionIconClick}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " ")))
                :
                    React.createElement("div", {className: 'col-inner'}, React.createElement("a", {title: toolTipText, className: 'resp-alerts', onClick: this.onLinkedExceptionIconClick}, React.createElement("span", {className: exceptionClassName}, " ", exceptionAltText, " ")));
        }
        return (result);
    };
    return LinkedExceptionIndicator;
}(pureRenderComponent));
module.exports = LinkedExceptionIndicator;
//# sourceMappingURL=linkedexceptionindicator.js.map
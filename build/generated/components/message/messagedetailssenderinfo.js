"use strict";
var React = require('react');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var MessageInfo = require('./messageinfo');
var stringHelper = require('../../utility/generic/stringhelper');
/**
 * Message Details header section which contains time , sender name and associated response details
 * @param props
 */
var messageDetailsSenderInfo = function (props) {
    /**
     * Handles the Click Event of Display ID
     */
    var onDisplayIdClick = function () {
        props.onDisplayIdClick();
    };
    /**
     * This method revamps the naming for display in message
     */
    var renderMarkingModeId = function () {
        var markingMode = props.messageDetails.markingModeId;
        if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            if (props.messageDetails.isElectronicStandardisationTeamMember) {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.stm-standardisation-response-title')) + ' ');
            }
            else {
                return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ');
            }
        }
        else if (markingMode === enums.MarkingMode.Practice) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title')) + ' ');
        }
        else if (markingMode === enums.MarkingMode.Approval) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title')) + ' ');
        }
        else if (markingMode === enums.MarkingMode.ES_TeamApproval) {
            return ((localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title')) + ' ');
        }
        else {
            return '';
        }
    };
    /**
     * Render Display Id as link Only If the examiner has access to view the script
     */
    var renderDisplayIDControl = function () {
        if (props.selectedTab !== enums.MessageFolderType.None && props.selectedTab !== enums.MessageFolderType.Deleted &&
            props.messageDetails.hasPermissionToDisplayId) {
            return React.createElement("a", {onClick: onDisplayIdClick, id: props.id + '-response-id'}, renderMarkingModeId(), getDisplayId());
        }
        else {
            var displayIdNoLinkTooltip = stringHelper.format(localeStore.instance.TranslateText('assessor3.message.display-id-no-link-tooltip'), [String(String.fromCharCode(179))]);
            return React.createElement("span", {title: displayIdNoLinkTooltip, id: props.id + '-response-id-read-only'}, renderMarkingModeId(), getDisplayId());
        }
    };
    /**
     * Show the displayId label only if there are any associated response with the message
     */
    var renderDisplayIDArea = function () {
        var displayIdText = localeStore.instance.TranslateText('messaging.message-lists.message-detail.associated-response-id') + ' ';
        if (props.messageDetails.displayId != null) {
            return (React.createElement("div", {className: 'msg-response-id', id: props.id + '-response-data'}, React.createElement("span", {className: 'dim-text', id: props.id + '-response-text'}, displayIdText), renderDisplayIDControl()));
        }
    };
    /**
     * to render message recipients list
     */
    var renderMessageRecipientList = function () {
        if (props.message && props.message != null) {
            return (React.createElement(MessageInfo, {id: 'msg-to', key: 'msg-to', selectedLanguage: props.selectedLanguage, message: props.message}));
        }
    };
    return (React.createElement("div", {className: 'msg-exp-metainfo-row2'}, renderMessageRecipientList(), renderDisplayIDArea()));
    /**
     * This method will returns the displayId for system messages with prefix 6
     */
    function getDisplayId() {
        // If selected message is a system message then returns displayId with prefix 6
        if (props.message.examBodyMessageTypeId != null && props.message.examBodyMessageTypeId !== enums.SystemMessage.None) {
            return '6' + props.messageDetails.displayId;
        }
        else {
            return props.messageDetails.displayId;
        }
    }
};
module.exports = messageDetailsSenderInfo;
//# sourceMappingURL=messagedetailssenderinfo.js.map
"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var enums = require('../utility/enums');
var messageStore = require('../../stores/message/messagestore');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
/* tslint:disable:variable-name */
/**
 * Marking Check Collapsible Component to show the status of the Marking Check Worklist access for an examiner
 * The notification bar will be available in all worklist and will be available when a PE,APE or an Auto Approved STL raise a
 * marking check to any of his subordinate examiners.
 * For STL alone he will be able to raise the marking check to the PE if the PE is his direct Paernt
 * @param props
 */
var MarkingCheckIndicator = function (props) {
    // Return null if the marking check is not available or if the examiner is in team management mode
    if (props.isMarkingCheckAvailable &&
        !markerOperationModeFactory.operationMode.isTeamManagementMode &&
        !props.isMarkCheckWorklist) {
        return (React.createElement("div", {className: 'message-bar', id: 'marking_check_message_bar'}, React.createElement("span", {className: 'message-content', id: 'marking_check_messag_content'}, localeStore.instance.TranslateText('marking.worklist.perform-marking-check.perform-marking-check-body-1'), React.createElement("a", {className: 'white-link', id: 'marking_check_messag_link', href: 'javascript:void(0);', onClick: function () { showMarkingCheckReqWorklist(); }}, localeStore.instance.TranslateText('marking.worklist.perform-marking-check.perform-marking-check-link')), localeStore.instance.TranslateText('marking.worklist.perform-marking-check.perform-marking-check-body-2'))));
    }
    else {
        return null;
    }
    /**
     * This will load the mark check requested examiners worklist
     */
    function showMarkingCheckReqWorklist() {
        if (!messageStore.instance.isMessagePanelActive) {
            markingCheckActionCreator.getMarkCheckExaminers(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        }
        else {
            var messageNavigationArguments = {
                responseId: null,
                canNavigate: false,
                navigateTo: enums.MessageNavigation.toMarkingCheckWorklist,
                navigationConfirmed: false,
                hasMessageContainsDirtyValue: undefined,
                triggerPoint: enums.TriggerPoint.None
            };
            messagingActionCreator.canMessageNavigate(messageNavigationArguments);
        }
    }
};
module.exports = MarkingCheckIndicator;
//# sourceMappingURL=markingcheckindicator.js.map
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import localeStore = require('../../stores/locale/localestore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import worklistStore = require('../../stores/worklist/workliststore');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import enums = require('../utility/enums');
import messageStore = require('../../stores/message/messagestore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
/* tslint:disable:no-empty-interfaces */
/**
 * Properties of Marking Check Indicator
 */
interface MarkingCheckIndicatorProps extends PropsBase, LocaleSelectionBase {
    isMarkingCheckAvailable: boolean;
    isMarkCheckWorklist: boolean;
}

/* tslint:disable:variable-name */
/**
 * Marking Check Collapsible Component to show the status of the Marking Check Worklist access for an examiner
 * The notification bar will be available in all worklist and will be available when a PE,APE or an Auto Approved STL raise a
 * marking check to any of his subordinate examiners.
 * For STL alone he will be able to raise the marking check to the PE if the PE is his direct Paernt
 * @param props
 */
const MarkingCheckIndicator: React.StatelessComponent<MarkingCheckIndicatorProps> = (props: MarkingCheckIndicatorProps) => {
    // Return null if the marking check is not available or if the examiner is in team management mode
    if (props.isMarkingCheckAvailable &&
        !markerOperationModeFactory.operationMode.isTeamManagementMode &&
        !props.isMarkCheckWorklist) {
        return (
            <div className='message-bar' id='marking_check_message_bar'>
                <span
                    className='message-content'
                    id='marking_check_messag_content'>{localeStore.instance.TranslateText(
                        'marking.worklist.perform-marking-check.perform-marking-check-body-1')}
                    <a
                        className='white-link'
                        id='marking_check_messag_link'
                        href='javascript:void(0);'
                        onClick={() => { showMarkingCheckReqWorklist(); }}>{localeStore.instance.TranslateText(
                            'marking.worklist.perform-marking-check.perform-marking-check-link')}</a>
                    {localeStore.instance.TranslateText(
                        'marking.worklist.perform-marking-check.perform-marking-check-body-2')}
                </span>
            </div>);
    } else {
        return null;
    }

    /**
     * This will load the mark check requested examiners worklist
     */
    function showMarkingCheckReqWorklist() {
        if (!messageStore.instance.isMessagePanelActive) {
            markingCheckActionCreator.getMarkCheckExaminers(
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        } else {
            let messageNavigationArguments: MessageNavigationArguments = {
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

export = MarkingCheckIndicator;

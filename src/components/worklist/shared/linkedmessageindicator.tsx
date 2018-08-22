/* tslint:disable:no-unused-variable */
import React = require('react');
import PureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import enums = require('../../utility/enums');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import messageStore = require('../../../stores/message/messagestore');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import makerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');

/**
 * Properties of component.
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    hasMessages: boolean;
    messageCount?: number;
    isTileView: boolean;
    displayId: string;
    isTeamManagementMode: boolean;
}

/**
 * LinkedMessageIndicator component.
 * @param {Props} props
 */
class LinkedMessageIndicator extends PureRenderComponent<Props, any> {

    /**
     * Constructor fot LinkedMessageIndicator
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let messageContent = this.getMessageContent();

        if (messageContent === undefined && !this.props.isTileView) {
            return null;
        } else {
            return (<div className='col wl-message text-center' id={this.props.id + '_messgeIndicator'}>
                {messageContent }
            </div>);
        }
    }

    /**
     * Get message content
     */
    private getMessageContent(): JSX.Element {
        let messageText: string = '';
        if (this.props.messageCount > 0) {
            messageText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.unread-messages-icon-tooltip') :
                localeStore.instance.TranslateText('marking.worklist.response-data.unread-messages-icon-tooltip');
        } else if (this.props.hasMessages) {
            messageText = this.props.isTeamManagementMode ?
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.messages-icon-tooltip') :
            messageText = localeStore.instance.TranslateText('marking.worklist.response-data.messages-icon-tooltip');
        }

        let messageClass: string = 'message-icon sprite-icon';
        let messageAltText: string = localeStore.instance.TranslateText('generic.navigation-bar.inbox');
        let result = undefined;

        if (!this.props.hasMessages) {
            return result;
        }

        if (this.props.messageCount > 0) {

            result = (this.props.isTileView) ? < div className= 'col-inner' >
                <a title = {messageText} className = 'resp-messages'>
                    <span className = {messageClass}> {messageAltText} </span>
                    <span className = 'notification circle' id = {this.props.id + '_messageNotification'}>
                        {localeHelper.toLocaleString(this.props.messageCount > 0 ? this.props.messageCount : '') }
                    </span>
                </a>
            </div> :
                < div className= 'wl-message' >
                    <a title = {messageText} className = 'resp-messages' onClick = { this.onClick } >
                        <span className = {messageClass}> {messageAltText} </span>
                        <span className = 'notification circle' id = {this.props.id + '_messageNotification'}>
                            {localeHelper.toLocaleString(this.props.messageCount > 0 ? this.props.messageCount : '') }
                        </span>
                    </a>
                </div>;
        } else {

            result = (this.props.isTileView) ? <div className='col-inner'>
                <a title= {messageText} className='resp-messages'>
                    <span className={messageClass}> {messageAltText} </span>
                </a>
            </div> :
                < div className= 'wl-message' >
                    <a title= {messageText} className='resp-messages' onClick = { this.onClick } >
                        <span className={messageClass}> {messageAltText} </span>
                    </a>
                </div>;
        }

        return result;
    }

    /**
     * Open response message while clicking on linked message icon
     */
    private onClick = (event: any) => {
        event.stopPropagation();
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            // open response
            let actualDisplayId: string;
            // Ideally marking mode should be read from the opened response,
            // since multiple marking modes won't come in the same worklist now this will work.
            let selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

            if (selectedMarkingMode === enums.MarkingMode.LiveMarking) {
                actualDisplayId = this.props.displayId.toString();
            } else {
                let contents = this.props.displayId.split(' ');
                actualDisplayId = contents[contents.length - 1];
            }

            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualDisplayId));

            if (!messageStore.instance.isMessagePanelActive) {
                let openedResponseDetails = makerOperationModeFactory.operationMode.openedResponseDetails(actualDisplayId);
                responseHelper.openResponse(parseFloat(actualDisplayId),
                    enums.ResponseNavigation.specific,
                    makerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                        enums.ResponseMode.open : worklistStore.instance.getResponseMode,
                    makerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                        openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId,
                    enums.ResponseViewMode.zoneView,
                    enums.TriggerPoint.WorkListResponseMessageIcon);

                markSchemeHelper.getMarks(parseInt(actualDisplayId), selectedMarkingMode);
            } else {
                let messageNavigationArguments: MessageNavigationArguments = {
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

export = LinkedMessageIndicator;
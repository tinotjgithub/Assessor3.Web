import pureRenderComponent = require('../base/purerendercomponent');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import popupHelper = require('../utility/popup/popuphelper');
import popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import messageStore = require('../../stores/message/messagestore');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import qualityfeedbackHelper = require('../../utility/qualityfeedback/qualityfeedbackhelper');
import messageHelper = require('../utility/message/messagehelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import Immutable = require('immutable');

declare let tinymce: any;

class MessageBase extends pureRenderComponent<any, any> {

    protected isSendButtonDisabled: boolean;
    protected toFieldIds: Array<number>;
    protected toFieldValues: Array<string>;
    protected selectedQigItemId: number;
    protected selectedQig: string;
    protected questionPaperPartId: number;
    protected messageSubject: string;
    protected messageBody: string;
    protected isDropDownOpen: boolean;
    protected isQigDropDownOpen: boolean;
    protected priorityDropDownSelectedItem: enums.MessagePriority;
    protected isSelectedItemClicked: boolean = false;
    protected navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none;
    protected msgEditorId: string = 'msg-tinymce-editor';
    protected _boundHandleOnClick: EventListenerObject = null;
    protected clickedDropDown: enums.DropDownType;
    protected isMessagePopupMinimized: boolean;
    protected isSubordinateSelected: boolean = false;
    protected sendMessageActionInProgress: boolean = false;
    protected messageType: enums.MessageType = enums.MessageType.None;

    /** refs */
    public refs: {
        [key: string]: (Element);
        msgEditor: (HTMLDivElement);
    };

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);

        this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
        this.isSendButtonDisabled = true;
        this.messageSubject = '';
        this.messageBody = '';
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.isSubordinateSelected = false;
    }

    /**
     * Callback function for dropdown select
     */
    protected onSelect = (selectedItem: enums.MessagePriority, event: any): void => {
        this.priorityDropDownSelectedItem = selectedItem;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     *  Callback function for dropdown click
     */
    protected onDropDownClick = (dropDown: enums.DropDownType): void => {
        this.clickedDropDown = dropDown;
        this.isSelectedItemClicked = true;
        if (this.clickedDropDown === enums.DropDownType.Priority) {
            this.isQigDropDownOpen = undefined;
            this.isDropDownOpen = this.isDropDownOpen === undefined ? true : !this.isDropDownOpen;
        } else if (this.clickedDropDown === enums.DropDownType.QIG) {
            this.isDropDownOpen = undefined;
            this.isQigDropDownOpen = this.isQigDropDownOpen === undefined ? true : !this.isQigDropDownOpen;
        }
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Handle click events on the window and collapse priority selection dropdown
     * @param {any} source - The source element
     */
    protected handleOnClick = (): any => {
        if (!this.isSelectedItemClicked && ((this.isDropDownOpen !== undefined && this.isDropDownOpen)
            || (this.isQigDropDownOpen !== undefined && this.isQigDropDownOpen))) {
            // collapse the priority dropdown
            this.isDropDownOpen = false;
            this.isQigDropDownOpen = false;
            this.setState({ renderedOn: Date.now() });
        } else {
            this.isSelectedItemClicked = false;
        }
    };

    /**
     *  This will return the localised string for message priority dropdown
     */
    protected getPriorityDropDownItem = (dropDownItem: enums.MessagePriority): string => {
        let localisedDropDownItem: string;

        switch (dropDownItem) {
            case enums.MessagePriority.Important:
                localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.important');
                break;
            case enums.MessagePriority.Mandatory:
                localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.mandatory');
                break;
            default:
                localisedDropDownItem = localeStore.instance.TranslateText('messaging.compose-message.priority.standard');
                break;
        }
        return localisedDropDownItem;
    };

    /**
     * Method fired when the message is closed.
     */
    protected onMessageClose = () => {
        // Show discard message if content edited; or just close the panel.
        if (this.isMessagePanelEdited) {
            messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
            if (this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick
                || this.navigateTo === enums.SaveAndNavigate.toReplyMessage
                || this.navigateTo === enums.SaveAndNavigate.toForwardMessage) {
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardOnNewMessageButtonClick,
                    enums.PopUpActionType.Show,
                    enums.SaveAndNavigate.none,
                    {
                        popupContent:
                        localeStore.instance.TranslateText
                            ('messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing')
                    });
            } else if (this.navigateTo === enums.SaveAndNavigate.toNewResponseMessageCompose) {
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardOnNewMessageButtonClick,
                    enums.PopUpActionType.Show,
                    enums.SaveAndNavigate.none,
                    {
                        popupContent:
                        localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body')
                    });
            } else {
                let messageType: enums.PopUpType = this.navigateTo !== enums.SaveAndNavigate.none
                    ? enums.PopUpType.DiscardMessageNavigateAway : enums.PopUpType.DiscardMessage;
                popUpDisplayActionCreator.popUpDisplay(
                    messageType,
                    enums.PopUpActionType.Show,
                    messageStore.instance.navigateFrom,
                    {
                        popupContent:
                        (this.navigateTo === enums.SaveAndNavigate.messageWithInResponse ?
                            localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body') : undefined)
                    });
            }
        } else if (this.navigateTo !== enums.SaveAndNavigate.none && this.navigateTo !== enums.SaveAndNavigate.messageWithInResponse
            && this.navigateTo !== enums.SaveAndNavigate.newMessageButtonClick) {
            // hide the message panel and navigate away
            this.onDiscardMessageConfirmed();
        } else if (this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
            this.navigateTo = enums.SaveAndNavigate.none;
            this.isMessagePopupMinimized = false;
            this.setState({ renderedOn: Date.now() });
        } else {
            // Close the Message Panel.
            this.resetAndCloseMessagePanel();
            this.navigateTo = enums.SaveAndNavigate.none;
        }
    };

    /**
     * Navigate away from current response.
     */
    protected onNavigateAwayFromResponse = (navigateTo: enums.SaveAndNavigate) => {
        this.navigateTo = navigateTo;
        this.onMessageClose();
    };

    /**
     * Reset message panel and close
     */
    protected resetAndCloseMessagePanel = (): void => {
        this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
        this.toFieldValues = null;
        this.toFieldIds = null;
        this.messageSubject = '';
        this.messageBody = '';
        this.isDropDownOpen = undefined;
        this.isQigDropDownOpen = undefined;
        this.props.closeMessagePanel(this.navigateTo);
        this.selectedQigItemId = undefined;
        this.questionPaperPartId = undefined;
        messageHelper.handleSubjectChange(this.messageSubject);
        this.sendMessageActionInProgress = false;
        // updating message component with default values
        // this enable or Disable send button will call setState
        this.enableDisableSendButton();

        // Need to Update the UI (Subject box in the message, after closing the message : Bug 28224
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method fired when discard message is confirmed.
     */
    protected onDiscardMessageConfirmed = (actionFromCombinedPopup: boolean = false,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none) => {
        // If message panel is not edited, no need to change the UI while logout
        if (this.isMessagePanelEdited) {
            // Close the Message Panel.
            this.resetAndCloseMessagePanel();
        } else if (!this.isMessagePanelEdited && this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
            messagingActionCreator.messageAction(enums.MessageViewAction.Open);

        } else {
            this.resetAndCloseMessagePanel();
        }

        // on message close navigate away from response scenario
        if (this.navigateTo !== enums.SaveAndNavigate.none && this.navigateTo !== enums.SaveAndNavigate.messageWithInResponse
            && this.navigateTo !== enums.SaveAndNavigate.toNewResponseMessageCompose &&
            !(this.navigateTo === enums.SaveAndNavigate.toResponse && qualityfeedbackHelper.isResponseNavigationBlocked())) {

            if (this.navigateTo === enums.SaveAndNavigate.toSupervisorRemark) {
                // Response Going from readonly mode to marking. Reset the message related values from response screen.
                this.resetAndCloseMessagePanel();
            }

            // if navigate away from Resposne then close the response and move to worklist.
            popupHelper.navigateAway(this.navigateTo);
        } else if (actionFromCombinedPopup) {
            popupHelper.navigateAway(navigateTo);
        }

        this.navigateTo = enums.SaveAndNavigate.none;
    };

    /**
     * Returns a boolean indicating whether the message panel is edited.
     */
    protected get isMessagePanelEdited() {
        return messageHelper.isMessagePanelEdited(this.props.messageType, this.toFieldValues, this.toFieldIds);
    }

    /**
     * Method fired when discard message is cancelled.
     */
    protected onDiscardMessageCancelled = () => {
        // reset navigate away from response
        this.navigateTo = enums.SaveAndNavigate.none;
        messageHelper.handleSubjectChange(this.messageSubject);
    };

    /**
     * Handles changes in the message panel subject section.
     * @param e
     */
    protected handleSubjectChange = (subject: string) => {
        this.messageSubject = subject;
        this.enableDisableSendButton();
        messageHelper.handleSubjectChange(subject);
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Sets the enable/disable status of send button.
     */
    protected enableDisableSendButton() {
        let currentSendButtonStatusAfterChange: boolean = true;
        let activeEditorgetContentLength : number = 0;
        // if sending message is in progress no need to execute logic to enabling/ disabling button
        if (!this.sendMessageActionInProgress) {
            let activeEditor = tinymce.get(this.msgEditorId);
            //Defect Id:48277 First time active Editor does not contains 'Body' Then throws exception 'Body Undefined'
            if (activeEditor && activeEditor.contentDocument != null) {
                activeEditorgetContentLength = activeEditor.getContent({ format: 'text' }).trim().length;
            }
            if (this.props.messageType === enums.MessageType.InboxCompose ||
                this.props.messageType === enums.MessageType.ResponseCompose
                || this.props.messageType === enums.MessageType.WorklistCompose ||
                this.props.messageType === enums.MessageType.ResponseReply
                || this.props.messageType === enums.MessageType.ResponseForward ||
                this.props.messageType === enums.MessageType.TeamCompose) {
                currentSendButtonStatusAfterChange = !(this.messageSubject.trim().length > 0 &&
                    (this.toFieldIds && this.toFieldIds.length > 0)
                    && (this.toFieldValues && this.toFieldValues.length > 0)
                    && (activeEditorgetContentLength  > 0 ||
                        messageHelper._isPasteEnabled));
            } else if (this.props.messageType === enums.MessageType.InboxForward ||
                this.props.messageType === enums.MessageType.InboxReply) {
                currentSendButtonStatusAfterChange = !(this.messageSubject.trim().length > 0
                    && (this.toFieldIds && this.toFieldIds.length > 0)
                    && (this.toFieldValues && this.toFieldValues.length > 0)
                    && this.selectedQigItemId > 1
                    && (activeEditorgetContentLength  > 0
                        || messageHelper._isPasteEnabled));
            }
        } else {
            // disable send button when send message action is in progress if the application is online
            currentSendButtonStatusAfterChange = applicationStore.instance.isOnline;
        }

        if (this.isSendButtonDisabled !== currentSendButtonStatusAfterChange) {
            this.isSendButtonDisabled = currentSendButtonStatusAfterChange;

            // It is noticed due to render in same time, state change not happening. Add some extra time for rendering.
            this.setState({ renderedOn: Date.now()  + 10 });
        }

        // Reset setPasteEnabledAction as false after the paste action fired.
        messageHelper.setPasteEnabledAction(false);
    }

    /**
     * Enable and disable send button on tinyMCE editor change.
     */
    protected toggleSaveButtonState = () => {
        this.enableDisableSendButton();
    };

    /**
     * Method fired when the message panel is minimized.
     */
    protected onMinimize = () => {
        messagingActionCreator.messageAction(enums.MessageViewAction.Minimize);
    };

    /**
     * Method fired when the message panel is maximized.
     */
    protected onMaximize = () => {
        messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
    };

    /**
     * This method will call on message send button click
     */
    protected onMessageSend = (messageType: enums.MessageType) => {
        this.enableDisableSendButton();
        let candidateScriptId: number = undefined;
        let markGroupId: number = undefined;
        let esMarkGroupId: number = undefined;
        this.messageBody = tinymce.get(this.msgEditorId).getContent();
        switch (messageType) {
            case enums.MessageType.ResponseCompose:
            case enums.MessageType.ResponseReply:
            case enums.MessageType.ResponseForward:
                // selected Qig id for compose message in response screen
                this.selectedQigItemId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                this.questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
                let openedResponseDetails = this.props.responseId ?
                    markerOperationModeFactory.operationMode.openedResponseDetails(this.props.responseId.toString()) : null;
                let isEsResponse: boolean = (worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation
                    || worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
                    worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation
                    || markerOperationModeFactory.operationMode.isStandardisationSetupMode) ? true : false;
                if (openedResponseDetails) {
                    candidateScriptId = openedResponseDetails.candidateScriptId;
                    if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                        esMarkGroupId = openedResponseDetails.esMarkGroupId;
                    } else {
                        markGroupId = isEsResponse ? undefined : openedResponseDetails.markGroupId;
                        esMarkGroupId = isEsResponse ? openedResponseDetails.markGroupId : undefined;
                    }
                }
                break;
            // Not setting candidateScriptId, markGroupId, esMarkGroupId if composing message from response and worklist
            // since not associated with any particular response.
            case enums.MessageType.InboxCompose:
            case enums.MessageType.WorklistCompose:
                break;
            default:
                let currentMessageDetails: MessageDetails = this.props.selectedMsgDetails;

                if (currentMessageDetails !== undefined && currentMessageDetails !== null) {
                    candidateScriptId = currentMessageDetails.candidateScriptId;
                    markGroupId = currentMessageDetails.markGroupId;
                    esMarkGroupId = currentMessageDetails.esMarkGroupId;
                }
                break;
        }

        // fetching currently selected qig's examiner roleId
        let examinerRoleId: number = 0;
        let msg = messageStore.instance.messagesMarkSchemes;
        if (msg) {
            msg.forEach((message: MessagingMarkScheme) => {
                if (message.markSchemeGroupId === this.selectedQigItemId) {
                    examinerRoleId = message.examinerRoleId;
                }
            });
        }
        let toTeam: boolean = messageStore.instance.teamDetails ? messageStore.instance.teamDetails.team.toTeam : false;
        messagingActionCreator.sendExaminerMessage(this.toFieldIds,
            this.messageBody,
            this.messageSubject,
            this.questionPaperPartId,
            this.props.responseId,
            this.priorityDropDownSelectedItem,
            this.selectedQigItemId,
            candidateScriptId,
            markGroupId,
            esMarkGroupId,
            toTeam,
            examinerRoleId);
    };

    /**
     * Navigating away from message panel when the pop up is opened
     */
    protected onNavigateFromMessagePanel = (messageNavigationArguments: MessageNavigationArguments) => {
        if (messageNavigationArguments.hasMessageContainsDirtyValue === undefined) {
            // Should be possible to open the response, If the message composed from Team management
            if (this.isMessagePanelEdited) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
                // To maximise the message panel when the discard popup is shown
                this.isMessagePopupMinimized = false;
                this.setState({ renderedOn: Date.now() });
                messageNavigationArguments.hasMessageContainsDirtyValue = true;
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            } else if (!messageNavigationArguments.canNavigate) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                messageNavigationArguments.hasMessageContainsDirtyValue = false;
                if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newException) {
                    this.navigateTo = enums.SaveAndNavigate.newExceptionButtonClick;
                } else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.exceptionWithInResponse) {
                    this.navigateTo = enums.SaveAndNavigate.exceptionWithInResponse;
                } else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newExceptionFromMediaErrorDialog) {
                    this.navigateTo = enums.SaveAndNavigate.newExceptionFromMediaErrorDialog;
                }
                this.resetAndCloseMessagePanel();
                messageNavigationArguments.canNavigate = true;
                messagingActionCreator.canMessageNavigate(messageNavigationArguments);
            }
        } else if (messageNavigationArguments.hasMessageContainsDirtyValue && messageNavigationArguments.canNavigate) {
            this.isMessagePopupMinimized = false;
            if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newException) {
                this.navigateTo = enums.SaveAndNavigate.newExceptionButtonClick;
            } else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.exceptionWithInResponse) {
                this.navigateTo = enums.SaveAndNavigate.exceptionWithInResponse;
            } else if (messageNavigationArguments.navigateTo === enums.MessageNavigation.newExceptionFromMediaErrorDialog) {
                this.navigateTo = enums.SaveAndNavigate.newExceptionFromMediaErrorDialog;
            }
            this.resetAndCloseMessagePanel();
        }
    };

    /**
     * checks whether the supervisor examiner is valid to send a message or not
     */
    protected messageSendValidationCheck = (messageType: enums.MessageType) => {
        this.sendMessageActionInProgress = true;
        this.messageType = messageType;
        // While in SEP view we need to check whether the supervisor examiner is valid to send a message to subordinate examiner
        if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
            this.enableDisableSendButton();
            let dataCollection: Array<ExaminerForSEPAction> = new Array<ExaminerForSEPAction>();
            let examinerSEPAction: ExaminerForSEPAction = {
                examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                requestedByExaminerRoleId: qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId
            };
            dataCollection.push(examinerSEPAction);
            let examinerSEPActions = Immutable.List<ExaminerForSEPAction>(dataCollection);
            let doSEPApprovalManagementActionArgument: DoSEPApprovalManagementActionArgument = {
                actionIdentifier: enums.SEPAction.SendMessage,
                examiners: examinerSEPActions
            };
            teamManagementActionCreator.ExecuteApprovalManagementAction(doSEPApprovalManagementActionArgument);
        } else {
            this.onMessageSend(this.messageType);
        }
    };

    /**
     * To check whether the examiner is valid to send a message
     */
    protected examinerValidation = (actionIdentifier: number) => {

        // No need to handle, If user clicks help examiners and immidietly navigated to inbox
        if (this.props.messageType === enums.MessageType.InboxCompose) {
            return;
        }

        // If there is no failure code then the supervisor examiner is valid to send a message
        if (actionIdentifier === enums.SEPAction.SendMessage) {
                this.onMessageSend(this.messageType);
        }
    };

    /**
     * enable send button state on offline
     */
    protected onOnlineStatusChanged = () => {
        if (!applicationStore.instance.isOnline) {
            this.toggleSaveButtonState();
        }

    };
}
export = MessageBase;
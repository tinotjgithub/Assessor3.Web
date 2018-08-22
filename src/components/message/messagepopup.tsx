import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import MessagePriorityDropDown = require('./messageprioritydropdown');
import localeStore = require('../../stores/locale/localestore');
import GenericButton = require('../utility/genericbutton');
import messageStore = require('../../stores/message/messagestore');
import enums = require('../utility/enums');
import MessageBase = require('./messagebase');
import MessageEditor = require('./messageeditor');
import Subject = require('./subject');
let classNames = require('classnames');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import qigStore = require('../../stores/qigselector/qigstore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import popupHelper = require('../utility/popup/popuphelper');
import QigDropDown = require('../utility/dropdown');
import messageHelper = require('../utility/message/messagehelper');
import keyDownHelper = require('../../utility/generic/keydownhelper');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import teamArgument = require('../../dataservices/messaging/teamargument');
import TeamListPopup = require('./teamlistpopup');
import toAddressList = require('../../stores/message/typings/teamreturn');
import configurablecharacteristicshelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurablecharacteristicsnames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
declare let tinymce: any;

interface Props extends PropsBase, LocaleSelectionBase {
    messageType: enums.MessageType;
    closeMessagePanel: Function;
    onQigItemSelected: Function;
    onResetPopupCallback: Function;
    qigItemsList: Array<Item>;
    selectedQigItem: string;
    selectedQigItemId: number;
    supervisorName: string;
    supervisorId: number;
    responseId: string;
    isOpen: boolean;
    qigName: string;
    messageBody: string;
    priorityDropDownSelectedItem: enums.MessagePriority;
    questionPaperPartId: number;
    selectedMessage: Message;
    selectedMessageDetails: MessageDetails;
    isReplyOrForwardClicked: boolean;
    subject: string;
}

interface State {
    renderedOn?: number;
    qigDropDownStyle?: React.CSSProperties;
    isTinyMCELoaded?: boolean;
}

interface Item {
    id: number;
    name: string;
    parentExaminerDisplayName: string;
    parentExaminerId: number;
    examinerRoleId: number;
}

class MessagePopup extends MessageBase {

    private isShowTeamListPopup: boolean = false;

    private _selectedTeamList: Array<string>;

    private _isEntireTeamSelected: boolean = false;

    private _mandatoryMessagesFromMarkingToolCC: boolean = false;

    private _disableToButtonForStandardisationQig: boolean;

    private doTriggerMessageOpenEvent: boolean = false;

    private msgType: enums.MessageType;

    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0,
            qigDropDownStyle: {},
            isTinyMCELoaded: false
        };
        this._selectedTeamList = new Array<string>();
        this.teamListReceived = this.teamListReceived.bind(this);
        this._mandatoryMessagesFromMarkingToolCC = configurablecharacteristicshelper.getCharacteristicValue(
            configurablecharacteristicsnames.MandatoryMessagesFromMarkingTool).toLowerCase() === 'true' ? true : false;
        this.doShowMandatoryMessagePriority = this.doShowMandatoryMessagePriority.bind(this);
        this.doHideToButton = this.doHideToButton.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let addressListPopup = this.isShowTeamListPopup ? (
            <TeamListPopup isShowTeamListPopup = {this.isShowTeamListPopup}
                id ={'teamlist-popup'} key = {'teamlist-popup'} selectedLanguage = {this.props.selectedLanguage}/>
        ) : null;

        let toAddressListPopup = (
            <div>
                <button className='secondary rounded popup-nav to-address-btn'
                    aria-haspopup='true'
                    data-popup='addressListPopUp'
                    onClick={this.showToAddressList}
                    id = {'messageToButton'}
                    key = {'messageToButton_key'}
                    disabled={this.doDisableToButton()}>
                                {localeStore.instance.TranslateText('messaging.compose-message.to-button')}
                </button>
                {addressListPopup}
            </div>
        );
        let _showMandatoryMessagePriority: boolean = this.doShowMandatoryMessagePriority();
        let _doHideToButton: boolean = this.doHideToButton();
        return (<div className={ classNames('popup full-width popup-overlay  messaging',
            { 'open': this.props.isOpen }, { 'minimized': this.isMessagePopupMinimized }) }
            id='composeMessage' role='dialog' aria-labelledby='popup2Title' aria-describedby='popup2Desc'>
            <div className='popup-wrap compose-new-msg'>
                <div className='popup-content' id='popup2Desc'>
                    <div className='comp-msg-top'>
                        <div className='qig-menu-holder'>
                            { this.renderQigSection() }
                            <div className='set-priority'>
                                <MessagePriorityDropDown id={'select_priority'}
                                    dropDownType = {enums.DropDownType.Priority}
                                    className = {'dropdown-wrap align-right'}
                                    selectedItem = { this.getPriorityDropDownItem(this.priorityDropDownSelectedItem) }
                                    isOpen = {this.clickedDropDown === enums.DropDownType.Priority ? this.isDropDownOpen : undefined }
                                    items = {[{
                                        id: enums.MessagePriority.Standard,
                                        name: this.getPriorityDropDownItem(enums.MessagePriority.Standard)
                                    },
                                    {
                                        id: enums.MessagePriority.Important,
                                        name: this.getPriorityDropDownItem(enums.MessagePriority.Important)
                                    },
                                    _showMandatoryMessagePriority ? {
                                        id: enums.MessagePriority.Mandatory,
                                        name: this.getPriorityDropDownItem(enums.MessagePriority.Mandatory)
                                    } : null]}
                                    onClick = { this.onDropDownClick}
                                    onSelect = { this.onSelect }/>
                            </div>
                        </div>

                        { this.renderAssociatedResponseSection() }

                        <div className='msg-recipient-wrap'>
                            <div className='rec-address-label' id='message-popup-to-label'>
                                { _doHideToButton ?
                                    localeStore.instance.TranslateText('messaging.compose-message.to-button') + ':' :
                                    toAddressListPopup }


                            </div>
                            <div className='recipiants-list-wrap'>
                                {
                                    this._isEntireTeamSelected ?
                                        <span className='recipiant-name' id='message-recipiant-name'>
                                            {localeStore.instance.TranslateText
                                                ('messaging.compose-message.recipient-selector.entire-team') + ';'}
                                        </span> :
                                        this._selectedTeamList.map((item: string, index: number) =>
                                            <span className='recipiant-name' key={'recipiant-name' + index.toString()}>
                                                {item}
                                            </span>)
                                }
                            </div>
                        </div>
                        <div className='comp-subject-wrap'>
                            <label htmlFor='message-subject' id ={'subject-label-popup'} className='comp-subject-label'>
                                { localeStore.instance.TranslateText('messaging.compose-message.subject') + ':' }
                            </label>
                            <Subject id= {'message-subject'} key={'key-message-subject'} outerClass= {'subject-input-wrap'}
                                refName = {'subjectInput'} hasFocus = { (this.props.messageType === enums.MessageType.InboxCompose ||
                                    this.props.messageType === enums.MessageType.WorklistCompose ||
                                    this.props.messageType === enums.MessageType.TeamCompose) }
                                className={'subject-input'} onChange={this.handleSubjectChange} maxLength={120}
                                isVisible = {this.props.isOpen}
                                value = {this.messageSubject} />
                        </div>
                    </div>
                    <div className='comp-msg-bottom' ref='msgEditor'>
                        <div className='msg-editor' >
                            <MessageEditor  htmlContent={this.messageBody}
                                id = { this.msgEditorId}
                                key = {'key-' + this.msgEditorId}
                                hasFocus = { messageHelper.hasFocus(this.props.messageType) }
                                aria-label={ this.msgEditorId}
                                toggleSaveButtonState={this.toggleSaveButtonState}
                                selectedLanguage={this.props.selectedLanguage}
                                isTinyMCELoaded={this.isTinyMCELoaded}/>
                        </div>
                    </div>
                </div>
                <div className='popup-header compose-msg-header'>
                    <h3 id='popup2Title' className='shift-left comp-msg-title'>
                        { messageHelper.getMessageHeader(this.props.messageType) }
                    </h3>
                    <div className='shift-left comp-msg-butons'>
                        <GenericButton
                            id={ 'message_send_btn' }
                            key={'key_message_send_btn' }
                            className={'button primary rounded'}
                            title={localeStore.instance.TranslateText('messaging.compose-message.send-button-tooltip') }
                            content={localeStore.instance.TranslateText('messaging.compose-message.send-button') }
                            disabled={this.isSendButtonDisabled || this.isShowTeamListPopup}
                            onClick={() => { this.messageSendValidationCheck(this.props.messageType); } }/>
                    </div>
                    <div className='shift-right minimize-message'>
                        <a href='javascript:void(0)' className='minimize-message-link' id='message-minimize'
                            title={localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip') }
                            onClick={this.onMinimize}>
                            <span className='minimize-icon lite'>
                                {localeStore.instance.TranslateText('messaging.compose-message.minimise-icon-tooltip')}
                            </span>
                        </a>
                        <a href='javascript:void(0)' className='maximize-message-link' id='message-maximize'
                            title={localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip') }
                            onClick={this.onMaximize}>
                            <span className='maxmize-icon lite'>
                                {localeStore.instance.TranslateText('messaging.compose-message.maximise-icon-tooltip')}
                            </span>
                        </a>
                        <a href='javascript:void(0)' className='close-message-link'
                            title={localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip') }
                            id='message-close' onClick={this.onMessageClose}>
                            <span className='close-icon lite'>
                                {localeStore.instance.TranslateText('messaging.compose-message.close-icon-tooltip')}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onOpen);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromInbox);
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent);
        window.addEventListener('click', this._boundHandleOnClick);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_TEAM_LIST_RECEIVED, this.updatedTeamListReceived);
        messageStore.instance.addListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        teamManagementStore.instance.addListener
            (teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);

        // Set the variables from props.
        if (this.props.messageType === enums.MessageType.TeamCompose) {
            this.selectedQig = this.props.selectedQigItem;
            this.selectedQigItemId = this.props.selectedQigItemId;
            this.questionPaperPartId = this.props.questionPaperPartId;
            this.onOpen(enums.MessageType.TeamCompose);
        }
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.resetAndCloseMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATE_EVENT, this.onNavigateAwayFromInbox);
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT,
            this.onPopUpDisplayEvent);
        window.removeEventListener('click', this._boundHandleOnClick);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onNavigateFromMessagePanel);
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        if (messageStore.instance.messageViewAction !== enums.MessageViewAction.None) {
            messagingActionCreator.messageAction(enums.MessageViewAction.None);
        }
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_TEAM_LIST_RECEIVED, this.updatedTeamListReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.TEAM_LIST_RECEIVED, this.teamListReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        teamManagementStore.instance.removeListener
            (teamManagementStore.TeamManagementStore.APPROVAL_MANAGEMENT_ACTION_EXECUTED, this.examinerValidation);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    }

    /**
     * Component will receive props
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        // Defect 44392 fix - select a qig text in message area is not getting localized upon changing language 
        if (nextProps.selectedQigItemId > 0) {
            this.selectedQig = nextProps.selectedQigItem;
        } else {
            this.selectedQig = localeStore.instance.TranslateText('messaging.compose-message.select-qig-placeholder');
        }
        this.selectedQigItemId = nextProps.selectedQigItemId;
        this.questionPaperPartId = nextProps.questionPaperPartId;

        // to close teamlist popup while opening new message
        if (this.selectedQigItemId === 0) {
            this.isShowTeamListPopup = false;
        }
    }

    /**
     * Set Inbox Forward and Replay Message details
     */
    private setInboxForwardReplyMessageDetails(): void {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);

        // set messageSubject for reply and forward messages
        if ((this.props.messageType === enums.MessageType.InboxForward || this.props.messageType === enums.MessageType.InboxReply)
            && this.props.isReplyOrForwardClicked && this.props.selectedMessage) {
            // reset isMessagePopupMinimized variable
            this.isMessagePopupMinimized = false;
            this.messageSubject = messageHelper.getSubjectContent(this.props.messageType, this.props.subject );
            this.priorityDropDownSelectedItem = this.props.priorityDropDownSelectedItem;
            this.messageBody = this.props.messageBody;

            let qigId: number = this.props.selectedQigItemId;
            let examinerRoleId: number = this.props.qigItemsList.filter((x: Item) => x.id === qigId)[0].examinerRoleId;

            let args: teamArgument = {
                examinerRoleId: examinerRoleId,
                qigId: qigId
            };

            // get the teamdetails to find whether atleast one subordinate is
            // selected(for displaying mandatory priority options)
            messagingActionCreator.getTeamDetails(args);
        }
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {

        // enable or disable send button while changing QIG dropdown
        if (this.props.isOpen) {
            this.enableDisableSendButton();
        }

        if (this.doTriggerMessageOpenEvent) {
            this.doTriggerMessageOpenEvent = false;
            this.onOpen(this.msgType);
        }
    }

    /**
     * This method will render QIG section for Compose, Reply and Forward message types
     */
    private renderQigSection = () => {
        switch (this.props.messageType) {
            case enums.MessageType.InboxCompose:
                return (<div className='message-qig'>
                    <span className='dim-text msg-qig-label' id='qig-dropdown-label'>
                        {localeStore.instance.TranslateText('messaging.compose-message.question-group') + ':'}
                    </span>
                    <QigDropDown dropDownType = {enums.DropDownType.QIG}
                        id = {'select_qig'}
                        style = {this.state.qigDropDownStyle}
                        className = {'dropdown-wrap message-qig-name'}
                        selectedItem = { this.selectedQig }
                        isOpen = {this.clickedDropDown === enums.DropDownType.QIG ? this.isQigDropDownOpen : undefined }
                        items = {this.props.qigItemsList}
                        onClick = { this.onQigDropDownClick }
                        onSelect={this.onQigItemSelected}
                        title={localeStore.instance.TranslateText('messaging.compose-message.question-group-tooltip')} />
                </div>);
            case enums.MessageType.InboxForward:
            case enums.MessageType.InboxReply:
            case enums.MessageType.WorklistCompose:
            case enums.MessageType.TeamCompose:
                return (<div className='message-qig'>
                    <span className='dim-text msg-qig-label' id='question-group-text'>
                        { localeStore.instance.TranslateText('messaging.compose-message.question-group') + ':' }
                    </span>
                    <div className='message-qig-name' id='selected-qig-name'>
                        {this.selectedQig }
                    </div>
                </div>);
        }
    };

    /**
     * This method will return associtated response section for Forward and Reply message types
     */
    private renderAssociatedResponseSection = () => {
        if ((this.props.messageType === enums.MessageType.InboxForward || this.props.messageType === enums.MessageType.InboxReply)
            && (this.props.responseId != null && this.props.responseId !== '' && this.props.responseId !== undefined)) {
            return (<div className='clearfix padding-bottom-10'>
                <div className='comp-resp-id shift-left'>
                    <span className='dim-text' id='associated-response-text'>
                        { localeStore.instance.TranslateText('messaging.compose-message.associated-response') + ':' }
                    </span>
                    <div className='message-resonse-id' id='associated-response-id'>
                        {messageHelper.getMarkingModeText(this.props.selectedMsgDetails.markingModeId,
                            this.props.selectedMsgDetails.isElectronicStandardisationTeamMember) + this.props.responseId}
                    </div>
                </div>
            </div>);
        }
    };

    /**
     * This method will call on qig dropdown select
     */
    private onQigItemSelected = (selectedItem: number) => {
        // resetting to standard message priority while qig selected
        this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
        this.props.onQigItemSelected(selectedItem);
        let selectedQigItem = this.props.qigItemsList.filter((x: Item) => x.id === selectedItem);
        let qigId: number = selectedItem;
        let examinerRoleId: number = selectedQigItem[0].examinerRoleId;
        let args: teamArgument = {
            examinerRoleId: examinerRoleId,
            qigId: qigId
        };
        messagingActionCreator.getTeamDetails(args);
    };

    /**
     * On navigate away from inbox
     */
    private onNavigateAwayFromInbox = (navigateTo: enums.SaveAndNavigate) => {
        if ((navigateTo === enums.SaveAndNavigate.toReplyMessage || navigateTo === enums.SaveAndNavigate.toForwardMessage ||
            navigateTo === enums.SaveAndNavigate.newMessageButtonClick)
            && !messageHelper.isMessagePanelEdited(this.props.messageType, this.toFieldValues, this.toFieldIds)) {
            this.props.onResetPopupCallback(navigateTo);
        } else {
            this.onNavigateAwayFromResponse(navigateTo);
        }
    };

    /**
     *  This will set the required variables
     */
    private onOpen = (messageType: enums.MessageType) => {
        // if tinymce is not loaded we need to skip this method and retrigger this after editor is loaded
        if (!this.state.isTinyMCELoaded) {
            this.doTriggerMessageOpenEvent = true;
            this.msgType = messageType;
            return;
        }

        // if message type is inbox compose or worklist compose then set the default content for setting default fonts
        if (messageType === enums.MessageType.InboxCompose || messageType === enums.MessageType.WorklistCompose ||
            messageType === enums.MessageType.TeamCompose) {
            this.messageBody = messageHelper.getMessageContent(messageType);
            if (this.isMessagePopupMinimized === true) {
                this.onMaximizeMessagePanel();
            }
        }

        // if message type is work list compose then set supervisior details in to address fields.
        if (messageType === enums.MessageType.WorklistCompose || messageType === enums.MessageType.TeamCompose) {
            this._selectedTeamList = new Array<string>();
            this.toFieldIds = new Array<number>();
            this.toFieldValues = new Array<string>();
            this.toFieldIds.push(this.props.supervisorId);
            this.toFieldValues.push(this.props.supervisorName);
            this._selectedTeamList.push(this.props.supervisorName);
        }
        // Fix for defect 54276. Reply forward message details has to be set only once. 
        if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
            this.setInboxForwardReplyMessageDetails();
        }

        // Fix for defect 54276. Reply forward message details has to be set only once. 
        if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
            this.setInboxForwardReplyMessageDetails();
        }

        // Fix for defect 54276. Reply forward message details has to be set only once. 
        if (messageType === enums.MessageType.InboxReply || messageType === enums.MessageType.InboxForward) {
            this.setInboxForwardReplyMessageDetails();
        }

        this.setState({ renderedOn: Date.now() });
        // enable send button
        this.enableDisableSendButton();
    };

    /**
     * Method fired to minimize the message panel.
     */
    private onMinimizeMessagePanel = () => {
        // added as part of defect #29269
        if (htmlUtilities.isIPadDevice) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        this.isMessagePopupMinimized = true;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Method fired to maximize the message panel.
     */
    private onMaximizeMessagePanel = () => {
        this.isMessagePopupMinimized = false;
        this.setState({ renderedOn: Date.now() });
        // enable send button
        this.enableDisableSendButton();
    };

    /**
     * Method fired to close the message panel.
     */
    private onMessagePanelClose = () => {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
        this.isMessagePopupMinimized = false;
        this.messageSubject = '';

        if (this.selectedQigItemId && this.selectedQigItemId !== 0) {
            let selectedQigItem = this.props.qigItemsList.filter((x: Item) => x.id === this.selectedQigItemId);
            if (selectedQigItem && selectedQigItem.length > 0) {
                let qigId: number = this.selectedQigItemId;
                let examinerRoleId: number = selectedQigItem[0].examinerRoleId;
                messagingActionCreator.clearTeamSelection(examinerRoleId);
            }
        }
        this._selectedTeamList = new Array<string>();
        this._isEntireTeamSelected = false;

        /**
         * Defect 64542 fix: setting isShowTeamListPopup to false to prevent TeamList Popup from persisting 
         * when closing and opening a new message with only 1 QIG item
         */
        this.isShowTeamListPopup = false;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * This method is handling the letious popup events.
     */
    private onPopUpDisplayEvent = (popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType) => {
        switch (popUpType) {
            case enums.PopUpType.DiscardMessage:
            case enums.PopUpType.DiscardMessageNavigateAway:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Yes:
                        popupHelper.handlePopUpEvents(popUpType, popUpActionType, this.onDiscardMessageConfirmed);
                        break;
                    case enums.PopUpActionType.No:
                        popupHelper.handlePopUpEvents(popUpType, popUpActionType, this.onDiscardMessageCancelled);
                        break;
                }
                break;
            case enums.PopUpType.DiscardOnNewMessageButtonClick:
                switch (popUpActionType) {
                    case enums.PopUpActionType.Show:
                        this.isMessagePopupMinimized = false;
                        this.setState({ renderedOn: Date.now() });
                        break;
                    case enums.PopUpActionType.Yes:
                        popupHelper.handlePopUpEvents(popUpType, popUpActionType, this.onDiscardNewPopupConfirmed);
                        break;
                    case enums.PopUpActionType.No:
                        //Reset the navigate to variable when the user chooses to stay on the message panel
                        this.navigateTo = enums.SaveAndNavigate.none;

                }
                break;
        }
    };

    private onDiscardNewPopupConfirmed = () => {
        if (this.navigateTo === enums.SaveAndNavigate.newMessageButtonClick) {
            this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
            this.messageSubject = '';
            this.messageBody = '';
            this.isDropDownOpen = undefined;
            this.isQigDropDownOpen = undefined;
            this.toFieldValues = null;
            this.toFieldIds = null;
            this._selectedTeamList = new Array<string>();
            this._isEntireTeamSelected = false;
            tinymce.activeEditor.setContent('');
            this.enableDisableSendButton();
            this.props.onResetPopupCallback(this.navigateTo);
        } else {
            this.props.onResetPopupCallback(this.navigateTo);
        }
        this.navigateTo = enums.SaveAndNavigate.none;
    };

    /**
     *  Callback function for dropdown click
     */
    private onQigDropDownClick = (dropDown: enums.DropDownType, width: number): void => {
        if (width) {
            let style: React.CSSProperties = {};
            style.minWidth = width;
            this.setState({
                qigDropDownStyle: style
            });
        }
        this.onDropDownClick(dropDown);
    };

    /**
     * To avoid the qigs in which the selected examiner has no supervisor
     * @param {Array<Item>} qigItemsList
     * @returns
     */
    private filterQigItems(qigItemsList: Array<Item>): Array<Item> {
        return qigItemsList.filter((x: Item) => x.parentExaminerId !== 0);
    }

    /**
     * To show madatory message priority option in dropdown
     */
    private doShowMandatoryMessagePriority(): boolean {

        let isMandatoryPriorityAvailable: boolean = false;

        // Mandatory Message Priority is availability only if :
        // 1. It is a TeamCompose as TeamCompose is always to subordinates. OR
        // 2. If not WorklistCompose as WorklistCompose will be always to Supervisor. AND
        //      (i).[QIG is not selected.] OR
        //      (ii).[If QIG is selected AND there are no selected examiners.] OR
        //      (iii).[If QIG is selected AND there are selected examiners AND atleast one subordinate is selected.]
        // PS : ResponseCompose Scenarios are handled in message.tsx

        if (this.props.messageType === enums.MessageType.TeamCompose ||
            (this.props.messageType !== enums.MessageType.WorklistCompose &&
              (this.selectedQigItemId === 0 ||
              (this.selectedQigItemId > 0 && this._selectedTeamList && this._selectedTeamList.length === 0) ||
              (this.selectedQigItemId > 0 && this._selectedTeamList && this._selectedTeamList.length > 0 && this.isSubordinateSelected)))) {

            isMandatoryPriorityAvailable = true;
        }

        if (this.props.qigItemsList.length > 0 && this.selectedQigItemId > 0) {

            let selectedQig = this.props.qigItemsList.filter((x: Item) => x.id === this.selectedQigItemId);

            let currentExaminerApprovalStatus: enums.ExaminerApproval = selectedQig[0].approvalStatusId;

            if (currentExaminerApprovalStatus === enums.ExaminerApproval.NotApproved ||
                currentExaminerApprovalStatus === enums.ExaminerApproval.Suspended) {

                isMandatoryPriorityAvailable = false;

            }
        }

        return this._mandatoryMessagesFromMarkingToolCC && isMandatoryPriorityAvailable;
    }

    /**
     * show or hide 'To' button
     */
    private doHideToButton(): boolean {
        let _subordinates: Array<ExaminerInfo> = null;
        if (messageStore.instance.teamDetails &&
            messageStore.instance.teamDetails.team &&
            messageStore.instance.teamDetails.team.subordinates) {
            _subordinates = messageStore.instance.teamDetails.team.subordinates;
        }
        return ((_subordinates && _subordinates.length) === 0 ||
            this.props.messageType === enums.MessageType.InboxReply ||
            this.props.messageType === enums.MessageType.WorklistCompose ||
            this.props.messageType === enums.MessageType.TeamCompose);
    }

    private showToAddressList = (): void => {
        this.isShowTeamListPopup = true;
        this.setState({ renderedOn: Date.now() });
    };

    private hideToAddressList = (): void => {
        this.setState({ isshowToAddressList: false });
    };

    private saveToAddressList = (): void => {
        this.setState({ isshowToAddressList: false });
    };

    /**
     * Handles the action event on team list Received.
     */
    private updatedTeamListReceived = (isSaved: boolean = false) => {

        this.toFieldValues = new Array<string>();
        this.toFieldIds = new Array<number>();
        this._selectedTeamList = new Array<string>();

        this._isEntireTeamSelected = false;
        this.isSubordinateSelected = false;

        let teams = messageStore.instance.teamDetails;

        if (teams && teams.team) {
            if (teams.team.toTeam) {
                this._isEntireTeamSelected = true;
                this.isSubordinateSelected = true;
            } else {
                if (teams.team.parent && teams.team.parent.isChecked) {
                    this._selectedTeamList.push(teams.team.parent.fullName + ';');
                }
                if (teams.team.subordinates.length > 0) {
                    this.getSelectedSubordinateList(teams.team.subordinates);
                }
            }

            // the logged in user has subordinates, check the store for new TO list
            // if there are no subordinates, the the supervisor details (if any) will be populated via props
            if (messageStore.instance.teamDetails.team.subordinates &&
                messageStore.instance.teamDetails.team.subordinates.length > 0) {
                this.populateToField(teams.team);
            }

            this.isShowTeamListPopup = false;

            if (isSaved && this.priorityDropDownSelectedItem === enums.MessagePriority.Mandatory &&
                !this.isSubordinateSelected) {
                messagingActionCreator.displayMandatoryValidationPopup(true);
            }
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Populates the To Fields based on the values in the store
     */
    private populateToField = (team: ExaminerInfo) => {
        if (team) {
            // Add Parent Examiner of the current examiner if the parent is selected
            if (team.isCurrentExaminer && team.parent && team.parent.isChecked) {
                this.toFieldIds.push(team.parent.examinerId);
                this.toFieldValues.push(team.parent.fullName);
            }

            if (!team.isCurrentExaminer && team.isChecked) {

                this.toFieldIds.push(team.examinerId);
                this.toFieldValues.push(team.fullName);
            }

            for (let subTeam of team.subordinates) {
                this.populateToField(subTeam);
            }
        }
    };


    /**
     * Get selected subordinated list.
     */
    private getSelectedSubordinateList(teamList: Array<ExaminerInfo>) {
        let that = this;
        teamList.map(function (examinerInfo: ExaminerInfo) {
            if (examinerInfo.isChecked) {
                that.isSubordinateSelected = true;
                that._selectedTeamList.push(examinerInfo.fullName + ';');
            }
            if (examinerInfo.subordinates.length > 0) {
                that.getSelectedSubordinateList(examinerInfo.subordinates);
            }

        });
    }

    /**
     * Ensure Reply is done to a subordinate.
     */
    private isReplyToSubordinate(teamList: Array<ExaminerInfo>): boolean {

        // Suboridinates of the current examiner will be passed here
        // If the selectedMessage.fromExaminerId is one among them, set isSubordinate as true.

        let that = this;
        let isSubordinate = false;

        teamList.map(function (examinerInfo: ExaminerInfo) {
            if (examinerInfo.examinerId === that.props.selectedMessage.fromExaminerId) {
                isSubordinate = true;
            }
            if (examinerInfo.subordinates.length > 0) {
                that.isReplyToSubordinate(examinerInfo.subordinates);
            }
        });

        return isSubordinate;
    }

    /**
     * Handles the action event on To address list Received.
     */
    private teamListReceived = () => {

        let teams = messageStore.instance.teamDetails;
        let qigId: number = this.props.selectedQigItemId;
        this._disableToButtonForStandardisationQig = false;

        //Flag to identify whether the qig is in standardisation setup progress
        let selectedQig = this.props.qigItemsList.filter((x: Item) => x.id === this.selectedQigItemId);
        let coordinationComplete = selectedQig[0].coordinationComplete;

        if (teams && teams.team.subordinates) {

            this._isEntireTeamSelected = teams.team.toTeam;

            this.toFieldValues = new Array<string>();
            this.toFieldIds = new Array<number>();
            this._selectedTeamList = new Array<string>();
            if (this.props.messageType === enums.MessageType.InboxReply) {

                this.toFieldIds.push(this.props.selectedMessage.fromExaminerId);
                this.toFieldValues.push(this.props.selectedMessage.examinerDetails.fullName);
                this._selectedTeamList.push(this.props.selectedMessage.examinerDetails.fullName);
                this.isSubordinateSelected = this.isReplyToSubordinate(teams.team.subordinates);

            } else if (!coordinationComplete) {
                // If the message is against standardisationsetup qig or response the receiver 
                // should be stm parent else all work as existing
                if (teams.team.stmParent) {

                    this.toFieldIds.push(teams.team.stmParent.examinerId);
                    this.toFieldValues.push(teams.team.stmParent.fullName);
                    this._selectedTeamList.push(teams.team.stmParent.fullName);

                    this.isShowTeamListPopup = false;
                    this.isSubordinateSelected = false;

                    // Disabling button if the user sends message against standardisation response or Qig
                    this._disableToButtonForStandardisationQig = true;
                }
            } else if (teams.team.subordinates.length === 0) {

                if (teams.team.parent) {
                    this.setMessagePanelToTabForParent(teams.team.parent);
                }
            }
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This method will set message panel property for sending message to the parent
     */
    private setMessagePanelToTabForParent(parent : ExaminerInfo){
        this.toFieldIds.push(parent.examinerId);
        this.toFieldValues.push(parent.fullName);
        this._selectedTeamList.push(parent.fullName);
        this.isSubordinateSelected = false;
    }

    /**
     * Handles the action event on To address list Received.
     */
    private messagePriorityUpdate = () => {
        this.priorityDropDownSelectedItem = enums.MessagePriority.Standard;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * check to enable to button
     */
    private doDisableToButton(): boolean {

        if (this.selectedQigItemId === 0 ||
            !messageStore.instance.teamDetails ||
            messageStore.instance.teamDetails.team.subordinates.length === 0 || this._disableToButtonForStandardisationQig) {
            return true;
        }
        return false;
    }

    /**
     * Set the selected language state upon successfull confirmation from locale store.
     */
    private languageChanged = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Handles the action event on To address list Received.
     */
    private isTinyMCELoaded = (isLoaded: boolean): void => {
        this.setState({
            isTinyMCELoaded: isLoaded
        });
    }
}

export = MessagePopup;
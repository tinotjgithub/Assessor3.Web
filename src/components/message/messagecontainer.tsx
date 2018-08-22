/* tslint:disable:no-unused-variable */
/**
 * Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor
 */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import immutable = require('immutable');
import loadMessageArguments = require('../../dataservices/messaging/loadmessagesarguments');
import messageArgument = require('../../dataservices/messaging/messageargument');
import loginSession = require('../../app/loginsession');
let classNames = require('classnames');
import Footer = require('../footer');
import teamArgument = require('../../dataservices/messaging/teamargument');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import Promise = require('es6-promise');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import standardisationSetupCCData = require('../../stores/standardisationsetup/typings/standardisationsetupccdata');
declare let tinymce: any;
declare let config: any;

/**
 * Add new dependencies in loadDependencies() method unless your dependencies are not using in constructor
 */

/* tslint:disable:variable-name no-multiple-var-decl */
let navigationHelper, Header, notificationCount, MessageLeftPanel, MessageRightPanel, MessageTabItem, messageStore,
    ccStore, localeStore, MessagePopup, messagingActionCreator, GenericButton, stringFormatHelper,
    messageHelper, popUpDisplayActionCreator, popupHelper, markingHelper, ConfirmationDialog, responseStore, responseSearchHelper,
    responseActionCreator, messageTranslationHelper, GenericDialog, navigationStore, userInfoActionCreator, qigStore, userInfoStore,
    htmlUtilities, urls;
/* tslint:enable:variable-name no-multiple-var-decl */

/**
 * Properties of a component
 */
/* tslint:disable:no-empty-interfaces */
interface Props extends PropsBase, LocaleSelectionBase {
}
/* tslint:enable:no-empty-interfaces */

/**
 * State of a component
 */
interface State {
    modulesLoaded?: boolean;
    isLogoutConfirmationPopupDisplaying?: boolean;
    renderedOn?: number;
    isDefaultTabActive?: boolean;
    isDeleteMessagePopupVisible?: boolean;
    isOpeningResponse?: boolean;
    hasOpeningQualityFeedbackQutstandingQIGsResponse?: boolean;
    scriptLoaded?: boolean;
}

interface Item {
    id: number;
    name: string;
    parentExaminerDisplayName: string;
    parentExaminerId: number;
    questionPaperPartId: number;
    examinerRoleId: number;
    approvalStatusId: number;
    coordinationComplete: boolean;
}

/**
 * Class to Display the Left Side Section
 */
class MessageContainer extends pureRenderComponent<Props, State> {
    private isAskOnLogoutCheckboxVisible: boolean;
    private logoutConfirmation: any;
    private resetLogoutConfirmationSatus: Function;
    private selectedTab: enums.MessageFolderType;
    // this variable will hold the message panel visiblity status.
    private isMessagePopupVisible = false;
    private qigListItems: Array<Item>;
    private selectedQigName: string;
    private supervisorId: number;
    private supervisorName: string;
    private selectedMsg: Message;
    private selectedMsgDetails: MessageDetails = null;
    private selectedMsgReadStatus: enums.MessageReadStatus = 1;
    // message type
    private currentMessageType: enums.MessageType = enums.MessageType.InboxCompose;
    private responseId: string;
    private subject: string = '';
    private priorityDropdownSelectedItem: enums.MessagePriority = enums.MessagePriority.Standard;
    private selectedQigItemId: number;
    private messageBody: string;
    private selectedQuestionPaperPartId: number;
    private unreadMessageCount: number;
    // Stores all the messages and Grouped Messages.
    private messageGroupDetails: MessageGroupDetails;
    private isReplyOrForwardClicked: boolean = false;
    private searchedResponseData: SearchedResponseData;
    private searchData: SearchData = { isVisible: true, isSearching: undefined, searchText: '' };
    // contains qigId: number, isOpen: boolean
    private inboxTabExpandOrCollapseDetails: immutable.Map<number, boolean> = immutable.Map<number, boolean>();
    private sentTabExpandOrCollapseDetails: immutable.Map<number, boolean> = immutable.Map<number, boolean>();
    private deletedTabExpandOrCollapseDetails: immutable.Map<number, boolean> = immutable.Map<number, boolean>();
    private isLoadingDataFailed: boolean = false;
    private messageType: enums.MessageType = enums.MessageType.None;
    private isMessageClicked = false;

    /**
     * Constructor Messagecontainer
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // If page is refreshed, redirect to login page. // This will clear the memory.
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
            window.location.replace(config.general.SERVICE_BASE_URL);
            return;
        }

        this.logoutConfirmation = this.showLogoutConfirmation.bind(this, true);
        this.resetLogoutConfirmationSatus = this.showLogoutConfirmation.bind(this, false);
        /* binding the parent(current) context to showLogoutConfirmation which is passed as prop to child and executing inside child */
        /* setting submit confirmation yes/no functions to initialize. */
        this.state = {
            modulesLoaded: false,
            isLogoutConfirmationPopupDisplaying: false,
            isDefaultTabActive: true,
            isOpeningResponse: false,
            hasOpeningQualityFeedbackQutstandingQIGsResponse: false
        };
        this.selectedTab = enums.MessageFolderType.Inbox;
        this.onMessageClick = this.onMessageClick.bind(this);
        this.showDeleteMessagePopUp = this.showDeleteMessagePopUp.bind(this);
        this.onTabSelected = this.onTabSelected.bind(this);
        this.onQualityFeedbackWarningMessageClose = this.onQualityFeedbackWarningMessageClose.bind(this);
        this.onMessageDetailsReceivedFailed = this.onMessageDetailsReceivedFailed.bind(this);
        this.hasPermissionToViewStandardisationWorklist = this.hasPermissionToViewStandardisationWorklist.bind(this);
    }

    /**
     * Render Method to display the data.
     */

    public render(): JSX.Element {


        let footer = (<Footer id={this.props.id} key={'key_' + this.props.id} selectedLanguage={this.props.selectedLanguage}
            footerType={enums.FooterType.Message}
            isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
            resetLogoutConfirmationSatus={this.resetLogoutConfirmationSatus} />);

        let busyIndicator = (<BusyIndicator id={'modules_loading_indicator'}
            isBusy={true}
            key={'response_loading_indicator'}
            isMarkingBusy={false}
            busyIndicatorInvoker={enums.BusyIndicatorInvoker.loadingModules}
            showBackgroundScreen={false}
            doShowDialog={!this.state.modulesLoaded || !this.state.scriptLoaded} />);


        if (this.state.modulesLoaded && this.state.scriptLoaded) {

            let header = <Header selectedLanguage={this.props.selectedLanguage} containerPage={enums.PageContainers.Message}
                unReadMessageCount={this.unreadMessageCount} />;

            let nonRecoverableErrorMessage = (
                <GenericDialog
                    content={localeStore.instance.TranslateText('messaging.message-lists.quality-feedback-pending-dialog.body')}
                    header={localeStore.instance.TranslateText('home.qig-statuses.QualityFeedback')}
                    displayPopup={this.state.hasOpeningQualityFeedbackQutstandingQIGsResponse}
                    okButtonText={localeStore.instance.TranslateText('generic.error-dialog.ok-button')}
                    onOkClick={this.onQualityFeedbackWarningMessageClose}
                    id='nonRecoverableErrorMessge'
                    key='marksAndAnnotationsErrorMessge'
                    popupDialogType={enums.PopupDialogType.QualityFeedbackWarning} />);


            let deleteMessage = (<ConfirmationDialog
                content={localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.body')}
                header={localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.header')}
                displayPopup={this.state.isDeleteMessagePopupVisible}
                isCheckBoxVisible={false}
                noButtonText={localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.no-button')}
                yesButtonText={localeStore.instance.TranslateText('messaging.message-lists.delete-message-dialog.yes-button')}
                onYesClick={this.onYesButtonDeleteMessageClick}
                onNoClick={this.onNoButtonDeleteMessageClick}
                dialogType={enums.PopupDialogType.MbCReturnToWorklistConfirmation}
                isKeyBoardSupportEnabled={true}
            />);

            return (
                <div className={classNames('message-wrapper', { 'loading': this.selectedMsg && this.state.isOpeningResponse })}>
                    {this.renderLoadingIndicator()}
                    {header}
                    <div className='content-wrapper relative'>
                        <MessagePopup isOpen={this.isMessagePopupVisible} closeMessagePanel={this.onCloseMessagePopup}
                            messageType={this.currentMessageType}
                            onResetPopupCallback={this.resetMessagePopup}
                            responseId={this.responseId}
                            selectedLanguage={this.props.selectedLanguage} qigItemsList={this.qigListItems}
                            selectedQigItemId={this.selectedQigItemId}
                            selectedQigItem={this.selectedQigName} supervisorId={this.supervisorId}
                            supervisorName={this.supervisorName}
                            subject={this.subject}
                            priorityDropDownSelectedItem={this.priorityDropdownSelectedItem}
                            onQigItemSelected={this.onQigItemSelected}
                            messageBody={this.messageBody}
                            questionPaperPartId={this.selectedQuestionPaperPartId}
                            selectedMessage={this.selectedMsg}
                            selectedMsgDetails={this.selectedMsgDetails}
                            isReplyOrForwardClicked={this.isReplyOrForwardClicked}
                        />
                        <div className='tab-holder horizontal msg-tab'>
                            <div className='msg-tab-header'>
                                <div className='col-wrap'>
                                    <div className='col-9-of-12 msg-tabs-nav'>
                                        <ul className='tab-nav padding-left-10' role='tablist'>
                                            <MessageTabItem
                                                messageFolderType={enums.MessageFolderType.Inbox}
                                                isSelected={this.selectedTab === enums.MessageFolderType.Inbox}
                                                onTabSelected={this.onTabSelected}
                                                unReadMessageCount={messageStore.instance.getUnreadMessageCount} />
                                            <MessageTabItem
                                                messageFolderType={enums.MessageFolderType.Sent}
                                                isSelected={this.selectedTab === enums.MessageFolderType.Sent}
                                                onTabSelected={this.onTabSelected}
                                                unReadMessageCount={0} />
                                            <MessageTabItem
                                                messageFolderType={enums.MessageFolderType.Deleted}
                                                isSelected={this.selectedTab === enums.MessageFolderType.Deleted}
                                                onTabSelected={this.onTabSelected}
                                                unReadMessageCount={0} />
                                        </ul>
                                    </div>
                                    <div className='col-3-of-12 text-right compose-msg-btn-wrap'>
                                        <GenericButton
                                            id={'new_message_btn'}
                                            key={'key_new_message_btn'}
                                            className='button primary rounded'
                                            title={localeStore.instance.TranslateText
                                                ('messaging.message-lists.top-panel.new-message-button')}
                                            content={localeStore.instance.TranslateText
                                                ('messaging.message-lists.top-panel.new-message-button')}
                                            disabled={false}
                                            onClick={this.onNewMessageClick} />
                                    </div>
                                </div>
                            </div>
                            <MessageLeftPanel selectedLanguage={this.props.selectedLanguage}
                                selectedTab={this.selectedTab}
                                messages={this.messageGroupDetails}
                                onSearch={this.onSearch}
                                searchData={this.searchData}
                                selectedMsg={this.selectedMsg}
                                onSelectedMessageChanged={this.onMessageClick}
                                messageGroupDetails={this.messageGroupDetails}
                                onExpandOrCollapse={this.onExpandOrCollapse}
                                isMessageClicked={this.isMessageClicked}/>
                            <MessageRightPanel
                                selectedLanguage={this.props.selectedLanguage}
                                message={this.selectedMsg}
                                messageDetails={this.selectedMsgDetails}
                                selectedTab={this.selectedTab}
                                isForwardButtonHidden={this.isForwardButtonHidden(
                                    this.selectedMsg ? this.selectedMsg.markSchemeGroupId : 0)}
                                onMessageMenuActionClickCallback={this.onMessageMenuActionClick}
                                onDisplayIdClick={this.onDisplayIdClick} />
                        </div>
                    </div>
                    {deleteMessage}
                    {nonRecoverableErrorMessage}
                    {footer}
                </div>
            );
        } else {
            return (<div>
                {busyIndicator}
                {footer}
            </div>);
        }
    }

    /**
     * Render Loading Indicator
     */
    private renderLoadingIndicator() {

        if (!this.forceDisableLoading &&
            (this.messageGroupDetails === undefined ||
                this.messageGroupDetails.messages === undefined ||
                (this.messageGroupDetails.messages.count() > 0 &&
                    (this.selectedMsgDetails === null || this.state.isOpeningResponse)))) {
            let loadingTextKey = this.state.isOpeningResponse ? 'loadResponseInMessage' : 'loadingModules';
            return (
                <div className='message-loader vertical-middle loading'>
                    <span className='loader middle-content'>
                        <span className='dot'></span> <span className='dot'></span> <span className='dot'></span>
                        <div className='loading-text padding-top-30'>
                            {localeStore.instance.TranslateText('generic.busy-indicator.' + loadingTextKey)}
                        </div>
                    </span>
                </div>
            );
        }
    }

    /**
     * This method will call on new message button click
     */
    private onNewMessageClick = () => {
        // check online status before proceed
        this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxCompose);
    };

    /**
     * This method will call when composing new message while system is in online mode
     */
    private onNewMessageClicked() {
        if (!messageStore.instance.isMessagePanelActive) {
            this.resetMessagePopup(enums.SaveAndNavigate.newMessageButtonClick);
            this.isMessagePopupVisible = true;
            if (this.selectedQigItemId && this.selectedQigItemId !== 0) {
                let selectedQigItem = this.qigListItems.filter((x: Item) => x.id === this.selectedQigItemId);
                if (selectedQigItem && selectedQigItem.length > 0) {
                    let qigId: number = this.selectedQigItemId;
                    let examinerRoleId: number = selectedQigItem[0].examinerRoleId;
                    let args: teamArgument = {
                        examinerRoleId: examinerRoleId,
                        qigId: qigId
                    };
                    messagingActionCreator.getTeamDetails(args);
                }
            }
            this.setState({ renderedOn: Date.now() });
        } else {
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                markingHelper.canNavigateAwayFromCurrentResponse();
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.newMessageButtonClick);
        }
    }

    /**
     * Callback function for message panel close
     */
    private onCloseMessagePopup = () => {
        this.isMessagePopupVisible = false;
        this.isReplyOrForwardClicked = false;
        this.currentMessageType = enums.MessageType.InboxCompose;
        messagingActionCreator.messageAction(enums.MessageViewAction.Close);

        /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
        if (htmlUtilities.isIPadDevice) {
            htmlUtilities.setFocusToElement('message-subject');
            htmlUtilities.blurElement('message-subject');
        }
        // if selected tab is sent then update the message folder
        if (this.selectedTab === enums.MessageFolderType.Sent) {
            // Load the messages
            this.getMessagesForTheSelectedTab();
        }
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Invoked when the selection changed in messages.
     */
    private onMessageClick = (newlySelectedMsg: Message) => {
        this.isMessageClicked = true;
        //DefectFix:#65417 Checking the online status, otherwise a blank screen will be shown in right panel
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            // If the currently selected Item is Unread, Update the collection for updating the QIG group unread message count
            if (this.selectedMsg.status === enums.MessageReadStatus.New) {
                let messagesForGrouping: immutable.List<Message> = this.filteredMessages;
                if (this.searchData.searchText !== '') {
                    // update the read status of previous message
                    this.updateReadStatus(this.selectedMsg);
                    // update the collection with read status to reflect the changes in view, otherwise it won't update due to delay
                    // in action creator call
                    messagesForGrouping.filter((x: Message) => x.examinerMessageId === this.selectedMsg.examinerMessageId).first().status =
                        enums.MessageReadStatus.Read;
                }
                this.messageGroupDetails = messageHelper.getGroupedMessageObject(messagesForGrouping, this.expandOrCollapseDetails);
                this.updateNotification();
            }

            // we don't need to reflect the read status current message in UI untill to click on another message or navigate away.
            if (this.searchData.searchText !== '' && newlySelectedMsg.status === enums.MessageReadStatus.New) {
                // update the read status of current message
                this.updateReadStatus(newlySelectedMsg);
            }

            this.selectedMsg = newlySelectedMsg;
            this.selectedMsgDetails = null;
            messagingActionCreator.getMessageBodyDetails(this.selectedMsg.examinerMessageId, this.selectedTab);
            // Refresh the UI.
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Invoked When the message tab selected.
     */
    private onTabSelected = (messageFolderType: enums.MessageFolderType) => {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        } else {
            this.selectedTab = messageFolderType;
            // reset values for the new tab.
            this.selectedMsg = undefined;
            this.selectedMsgDetails = null;
            this.messageGroupDetails.messages = undefined;

            this.getMessagesForTheSelectedTab();
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Get the Messages for the selected tab
     */
    private getMessagesForTheSelectedTab() {
        let canRefresh: boolean = this.selectedTab === enums.MessageFolderType.Deleted ? messageStore.instance.isMessageDeleted() : false;
        canRefresh = (this.selectedTab === enums.MessageFolderType.Inbox) || (this.selectedTab === enums.MessageFolderType.Sent) ?
            messageStore.instance.isMessageDataRequireUpdation : canRefresh;
        let args: loadMessageArguments = {
            recentMessageTime: null,
            messageFolderType: this.selectedTab,
            forceLoadMessages: (canRefresh
                || messageStore.instance.isNewExaminerRoleCreated
                || messageStore.instance.isUnreadMandatoryMessagePresent),
            hiddenQigList: qigStore.instance.HiddenQIGs
        };

        messagingActionCreator.getMessages(args);
    }

    /**
     *  Get the Messages for the selected tab
     */
    private getMessagesForInboxOnDeletion() {
        let args: loadMessageArguments = {
            recentMessageTime: null,
            messageFolderType: enums.MessageFolderType.Inbox,
            forceLoadMessages: messageStore.instance.isMessageDataRequireUpdation,
            hiddenQigList: qigStore.instance.HiddenQIGs
        };

        messagingActionCreator.getMessages(args);
    }

    /**
     * Redirect to the start page if not authenticated
     */
    public componentWillMount() {
        if (!loginSession.IS_AUTHENTICATED) {
            navigationHelper.loadLoginPage();
        }
    }

	/**
	 * Comparing the props to check the updats are made by self
	 * @param nextProps
	 */
    public componentWillReceiveProps(nextProps: Props) {

        // If current online status if offline
        // and application is getting online now, then if we have already a loading indicator
        // visible before the application goes offline then remvoe the loading indicator.
        if (!this.props.isOnline && nextProps.isOnline) {
            this.isLoadingDataFailed = true;
        }
    }

    /**
     * Method to load dependencies
     */
    private dependenciesLoaded() {
        this.setState({ scriptLoaded: true });
    }


    /**
     * load the modules required for MessageContainer
     */
    public componentDidMount() {
        if (this.state == null) {
            return;
        }
        this.loadDependenciesAndEventListeners();
    }


    /**
     * load the modules required for MessageContainer
     */
    public componentDidUpdate() {

        // This will reset the failed data only in online to
        // prevent loading indicator spinning inifinte time
        if (this.props.isOnline) {
            this.isLoadingDataFailed = false;
        }
    }


    /**
     * Component will unmount
     */
    public componentWillUnmount() {

        if (this.state == null || !this.state.modulesLoaded) {
            return;
        }

        this.removeEventListeners();
        messageHelper.removeInitMouseClickEventScriptBlock();
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    private loadDependenciesAndEventListeners() {
        let ensurePromise: any = require.ensure(['../utility/navigation/navigationhelper',
            './notificationcount',
            './messageleftpanel', './messagerightpanel',
            './messagetabitem', '../../stores/message/messagestore',
            '../../stores/configurablecharacteristics/configurablecharacteristicsstore', './messagepopup',
            '../../actions/messaging/messagingactioncreator', '../utility/genericbutton', '../../utility/stringformat/stringformathelper',
            '../utility/message/messagehelper',
            '../header',
            '../../actions/popupdisplay/popupdisplayactioncreator',
            '../utility/popup/popuphelper',
            '../../utility/markscheme/markinghelper', '../utility/confirmationdialog',
            '../../utility/responsesearch/responsesearchhelper',
            '../../stores/response/responsestore',
            '../../actions/response/responseactioncreator', '../utility/message/messagetranslationhelper',
            '../utility/genericdialog', '../../stores/navigation/navigationstore', '../../actions/userinfo/userinfoactioncreator',
            '../../stores/qigselector/qigstore', '../../stores/userinfo/userinfostore', '../../utility/generic/htmlutilities',
            '../../dataservices/base/urls'],

            function () {
                navigationHelper = require('../utility/navigation/navigationhelper');
                notificationCount = require('./notificationcount');
                MessageLeftPanel = require('./messageleftpanel');
                MessageRightPanel = require('./messagerightpanel');
                MessageTabItem = require('./messagetabitem');
                messageStore = require('../../stores/message/messagestore');
                ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
                localeStore = require('../../stores/locale/localestore');
                MessagePopup = require('./messagepopup');
                messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
                GenericButton = require('../utility/genericbutton');
                stringFormatHelper = require('../../utility/stringformat/stringformathelper');
                messageHelper = require('../utility/message/messagehelper');
                Header = require('../header');
                popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
                popupHelper = require('../utility/popup/popuphelper');
                markingHelper = require('../../utility/markscheme/markinghelper');
                ConfirmationDialog = require('../utility/confirmationdialog');
                responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
                responseStore = require('../../stores/response/responsestore');
                responseActionCreator = require('../../actions/response/responseactioncreator');
                messageTranslationHelper = require('../utility/message/messagetranslationhelper');
                GenericDialog = require('../utility/genericdialog');
                navigationStore = require('../../stores/navigation/navigationstore');
                userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
                qigStore = require('../../stores/qigselector/qigstore');
                userInfoStore = require('../../stores/userinfo/userinfostore');
                htmlUtilities = require('../../utility/generic/htmlutilities');
                urls = require('../../dataservices/base/urls');

                // Message container, leaves the operation mode. Reset the operations mode.
                userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);

                // Load the messages
                this.getMessagesForTheSelectedTab();

                // fill qig items
                this.getQigItemsList();
                // reset the selected item
                this.getSelectedQigDetails();

                this.loadTinyMCE();

                messageHelper.addInitMouseClickEventScriptBlock();

                this.addEventListeners();
                this.setState({ modulesLoaded: true });

                // hook all event listeners.
            }.bind(this));

        ensurePromise.catch((e) => {
            this.props.setOfflineContainer(true, true);
        });
    }

    /**
     * Load Tyny MCE
     *
     * @private
     * @memberof MessageContainer
     */
    private loadTinyMCE() {
        let url: string = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = (this.dependenciesLoaded.bind(this));
            document.body.appendChild(script);
        } else {
            this.dependenciesLoaded();
        }
    }

    /**
     * Method to add event listeners
     */
    private addEventListeners() {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_RECEIVED, this.onMessagesReceived);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onReRender);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onReRender);
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePopup);
        messageStore.instance.addListener(messageStore.MessageStore.REFRESH_MESSAGE_TAB, this.onRefreshMessageTab);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.navigateToResponsePage);
        responseSearchHelper.addResponseSearchEvents();
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.openSearchedResponse);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT,
            this.initiateSerachResponse);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.logoutConfirmation);
        navigationStore.instance.addListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.onMenuOpen);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT, this.onResponseDataReceivedFailed);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED, this.onMessageDetailsReceivedFailed);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusUpdated);

    }

    /**
     * Method to remove event listeners
     */
    private removeEventListeners() {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_RECEIVED, this.onMessagesReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onReRender);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onReRender);
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePopup);
        messageStore.instance.removeListener(messageStore.MessageStore.REFRESH_MESSAGE_TAB, this.onRefreshMessageTab);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.updateMessageDeletedStatus);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.navigateToResponsePage);
        responseSearchHelper.removeResponseSearchEvents();
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.updateNotification);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.openSearchedResponse);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT,
            this.initiateSerachResponse);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.logoutConfirmation);
        navigationStore.instance.removeListener(navigationStore.NavigationStore.MENU_VISIBILITY_EVENT, this.onMenuOpen);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT,
            this.onResponseDataReceivedFailed);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED_FAILED,
            this.onMessageDetailsReceivedFailed);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusUpdated);

    }

    /**
     * Method to redirect to worklist page on clicking button
     */
    private renderWorkListPage() {
        navigationHelper.navigateToWorklist();
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation(logout: boolean): void {
        this.setState({ isLogoutConfirmationPopupDisplaying: logout });
    }

    /**
     * Handles the action event on Message Received.
     */
    private onMessagesReceived = (selectedMsgId: number): void => {
        this.searchData.isVisible = this.selectedTab === enums.MessageFolderType.Inbox;
        if (this.searchData.isSearching) {
            this.searchData.isSearching = this.searchData.searchText === '' ? undefined : false;
        }
        this.messageGroupDetails = messageHelper.getGroupedMessageObject(this.filteredMessages, this.expandOrCollapseDetails);
        this.updateNotification();
        this.getQigItemsList();
        if (selectedMsgId > 0) {
            if (this.messageGroupDetails && this.messageGroupDetails.messages.count() > 0) {
                this.selectedMsg = this.messageGroupDetails.messages.find((x: Message) => x.examinerMessageId === selectedMsgId);
                this.selectedQigName = messageHelper.getDisplayText(this.selectedMsg);
            }
        } else if (this.messageGroupDetails.messages.count() > 0 && this.selectedMsg === undefined) {
            // Default first message should be selected in the list. Select I f any message exists
            this.selectedMsg = this.messageGroupDetails.messages.first();
        }

        if (this.selectedMsg !== undefined) {
            // Get the message data.
            messagingActionCreator.getMessageBodyDetails(this.selectedMsg.examinerMessageId, this.selectedTab);
        }

        this.setState({
            renderedOn: Date.now()
        });

        // set the scroll position to the selected message for automatic selection
        if (selectedMsgId > 0) {
            let borderHeight: number = 30;
            let offsetTop: number = htmlUtilities.getOffsetTop('msg-item unread selected', false);
            htmlUtilities.setScrollTop('msg-list-container', offsetTop - borderHeight);
        }
    };

    /**
     * Handles the action event on Message Details Received.
     */
    private onMessageDetailsReceived = (msgId: number): void => {
        // Check the selection got changed while receives the message
        if (this.selectedMsg.examinerMessageId === msgId) {
            this.selectedMsgDetails = messageStore.instance.getMessageDetails(this.selectedMsg.examinerMessageId);
            this.hasPermissionToViewStandardisationWorklist();
            // update the default selected message if search filter is not applied.
            if (this.searchData.searchText === '') {
                this.updateReadStatus(this.selectedMsg);
            }
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Update the Read Status to database
     * @param message : message to update the read status
     */
    private updateReadStatus(message: Message) {
        // If the message is currently in un read status and also make sure it is not made as read already
        if (message &&
            (message.status === enums.MessageReadStatus.New
                && !messageStore.instance.isMessageRead(message.examinerMessageId))) {
            let examinerList: number[] = [];
            examinerList[0] = 0;
            let args: messageArgument = {
                messageId: message.examinerMessageId,
                messageDistributionIds: message.messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Read
            };

            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus(args);
        }
    }

    /**
     * This method will refresh the given message folder
     */
    private onRefreshMessageTab = (messageFolderType: enums.MessageFolderType): void => {
        // change the selected tab to given folder
        this.selectedTab = messageFolderType;
        this.selectedMsgDetails = null;
        // Load the messages
        this.getMessagesForTheSelectedTab();
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Re render the component
     */
    private onReRender = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This method will return the QIG items list
     */
    private getQigItemsList = (): Array<Item> => {
        this.qigListItems = new Array<Item>();
        let msg = messageStore.instance.messagesMarkSchemes;
        if (msg) {
            msg.forEach((message: MessagingMarkScheme) => {
                if (!qigStore.instance.isQIGHidden(message.markSchemeGroupId)) {
                    let item: Item = {
                        name: stringFormatHelper.formatAwardingBodyQIG(
                            message.markSchemeGroupName,
                            message.assessmentCode,
                            message.sessionName,
                            message.componentId,
                            message.questionPaperName,
                            message.assessmentName,
                            message.componentName,
                            stringFormatHelper.getOverviewQIGNameFormat()),
                        id: message.markSchemeGroupId,
                        parentExaminerDisplayName: this.formattedExaminerName(message.parentInitials, message.parentSurname),
                        parentExaminerId: message.parentExaminerId,
                        questionPaperPartId: message.questionPaperPartId,
                        examinerRoleId: message.examinerRoleId,
                        approvalStatusId: message.approvalStatusId,
                        coordinationComplete: message.coordinationComplete
                    };

                    this.qigListItems.push(item);
                }
            });
        }
        return this.qigListItems.sort(function (obj1: Item, obj2: Item) {
            return obj1.name.localeCompare(obj2.name);
        });
    };

    /**
     * This method will return the selected QIG details
     */
    private getSelectedQigDetails = () => {
        // If an examiner has only one qig to be selected from the list. Display that list
        if (this.qigListItems.length === 1) {
            this.getSupervisorAndQIGDetails(this.qigListItems[0].id);
        } else {
            this.selectedQigItemId = 0;
            this.selectedQigName = localeStore.instance.TranslateText('messaging.compose-message.select-qig-placeholder');
            this.supervisorName = '';
            this.supervisorId = 0;
        }
    };

    /**
     * This will returns the formatted the examiner name
     */
    private formattedExaminerName(parentInitials: string, parentSurname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', parentInitials);
        formattedString = formattedString.replace('{surname}', parentSurname);
        return formattedString;
    }

    /**
     * Callback function for QIG dropdown select action
     */
    private onQigItemSelected = (selectedItem: number) => {
        this.getSupervisorAndQIGDetails(selectedItem);
        this.setState({ renderedOn: Date.now() });
    };

    private resetMessagePopup = (navigateTo: enums.SaveAndNavigate) => {
        if (this.selectedMsg !== undefined && this.selectedMsg.status === enums.MessageReadStatus.New) {
            this.messageGroupDetails = messageHelper.getGroupedMessageObject(this.filteredMessages, this.expandOrCollapseDetails);
            this.updateNotification();
        }

        switch (navigateTo) {
            case enums.SaveAndNavigate.newMessageButtonClick:
                this.resetvariables();
                // fill qig items
                this.getQigItemsList();
                // reset the selected item
                this.getSelectedQigDetails();
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxCompose);
                break;
            case enums.SaveAndNavigate.toReplyMessage:
                this.setvariablesforReplyForward(enums.MessageAction.Reply);
                break;
            case enums.SaveAndNavigate.toForwardMessage:
                this.setvariablesforReplyForward(enums.MessageAction.Forward);
                break;
        }
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Callback function for message menu action click
     * @param messageMenuActionType
     */
    private onMessageMenuActionClick = (messageMenuActionType: enums.MessageAction) => {
        this.messageGroupDetails = messageHelper.getGroupedMessageObject(this.filteredMessages, this.expandOrCollapseDetails);
        this.updateNotification();
        if (messageMenuActionType === enums.MessageAction.Delete) {
            this.showDeleteMessagePopUp();
        }
        if (!messageStore.instance.isMessagePanelActive && messageMenuActionType !== enums.MessageAction.Delete) {
            this.isReplyOrForwardClicked = true;
            this.setvariablesforReplyForward(messageMenuActionType);
        } else {
            let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
                markingHelper.canNavigateAwayFromCurrentResponse();
            if (messageMenuActionType === enums.MessageAction.Reply) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toReplyMessage);
            } else if (messageMenuActionType === enums.MessageAction.Forward) {
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toForwardMessage);
            }
            this.isReplyOrForwardClicked = true;
        }
    };

    /**
     * This method will return the supervisor details against a qig
     */
    private getSupervisorAndQIGDetails = (qigId: number) => {
        let item: Item = this.qigListItems.filter((x: Item) => x.id === qigId)[0];
        if (item) {
            this.selectedQigItemId = item.id;
            this.selectedQigName = item.name;
            this.supervisorName = item.parentExaminerDisplayName;
            this.supervisorId = item.parentExaminerId;
            this.selectedQuestionPaperPartId = item.questionPaperPartId;
        }
    };

    /**
     * Reset private variables
     */
    private resetvariables = () => {
        this.currentMessageType = enums.MessageType.InboxCompose;
        this.responseId = undefined;
        this.subject = '';
        this.selectedQigName = '';
        this.supervisorId = 0;
        this.supervisorName = '';
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        this.selectedQigItemId = undefined;
        this.messageBody = '';
        this.isReplyOrForwardClicked = false;
    };

    /**
     * invoke when select reply/forward message action
     * @param messageMenuActionType
     */
    private setvariablesforReplyForward(messageMenuActionType: enums.MessageAction) {
        // check online status before proceed
        switch (messageMenuActionType) {
            case enums.MessageAction.Forward:
                this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxForward);
                break;
            case enums.MessageAction.Reply:
                this.checkOnlineStatusAndDoMessageAction(enums.MessageType.InboxReply);
                break;
        }
    }

    /**
     * This method will set variables for Reply and Forward
     */
    private doSetvariablesforReplyForward = (messageMenuActionType: enums.MessageAction) => {
        this.isMessagePopupVisible = true;
        this.getSupervisorAndQIGDetails(this.selectedMsg.markSchemeGroupId);
        this.responseId = this.selectedMsgDetails.displayId;
        this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(this.selectedMsg.priorityName);
        let translatedMessageContents: TranslatedMessageContent = messageTranslationHelper.getTranslatedContent(this.selectedMsg);
        let messageBody: string;
        // If selected message is a system message then set the corresponding language json file entry
        if (this.selectedMsg.examBodyMessageTypeId != null && this.selectedMsg.examBodyMessageTypeId !== enums.SystemMessage.None) {
            messageBody = translatedMessageContents.content;
        } else {
            messageBody = this.selectedMsgDetails.body;
        }

        switch (messageMenuActionType) {
            case enums.MessageAction.Reply:
                this.currentMessageType = enums.MessageType.InboxReply;
                this.supervisorId = this.selectedMsg.fromExaminerId;
                this.supervisorName = this.selectedMsg.examinerDetails.fullName;
                this.subject = messageHelper.getSubjectContent(enums.MessageType.InboxReply, translatedMessageContents.subject);
                this.messageBody = messageHelper.getMessageContent(enums.MessageType.InboxReply,
                    this.selectedMsg.examinerDetails.fullName, this.selectedMsg.displayDate, messageBody);
                this.selectedQigItemId = this.selectedMsg.markSchemeGroupId;
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxReply);
                break;
            case enums.MessageAction.Forward:
                this.currentMessageType = enums.MessageType.InboxForward;

                let selectedQigItem = this.getQigItemsList().filter((x: Item) => x.id === this.selectedQigItemId);
                let qigId: number = this.selectedQigItemId;
                let examinerRoleId: number = selectedQigItem[0].examinerRoleId;
                let args: teamArgument = {
                    examinerRoleId: examinerRoleId,
                    qigId: qigId
                };
                messagingActionCreator.getTeamDetails(args);

                this.subject = messageHelper.getSubjectContent(enums.MessageType.InboxForward, translatedMessageContents.subject);
                this.messageBody = messageHelper.getMessageContent(enums.MessageType.InboxForward,
                    this.selectedMsg.examinerDetails.fullName, this.selectedMsg.displayDate, messageBody);
                this.priorityDropdownSelectedItem = messageHelper.getPriorityDropDownSelectedItem(this.selectedMsg.priorityName);
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.InboxForward);
                break;
        }

        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Delete the selected message - updating database
     */
    private deleteMessage() {
        if (this.selectedMsg) {
            let examinerList: number[] = [];
            examinerList[0] = 0;
            let args: messageArgument = {
                messageId: this.selectedMsg.examinerMessageId,
                messageDistributionIds: this.selectedMsg.messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Closed
            };

            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus(args);
        }
    }

    /**
     * Will display delete message confirmation dialog
     */
    private showDeleteMessagePopUp = (): void => {
        this.updateNotification();
        // display dialog box
        this.setState({ isDeleteMessagePopupVisible: true });
    };

    /**
     * Delete message confirmation dialog Yes click
     */
    private onYesButtonDeleteMessageClick = (): void => {
        this.deleteMessage();
        // hiding confirmation dialog
        this.setState({ isDeleteMessagePopupVisible: false });
    };

    /**
     * Delete message confirmation dialog No click
     */
    private onNoButtonDeleteMessageClick = (): void => {
        // hiding confirmation dialog
        this.setState({ isDeleteMessagePopupVisible: false });
    };

    /**
     * Update the message deleted Status to database
     */
    private updateMessageDeletedStatus = (): void => {

        let messages = this.messageGroupDetails.messages;

        // Scenario 1. After a deleting a message, Check any other message exists just next to the current QIG, If So Select that item
        // Find All messages related to the the Selected message
        let messagesInTheSelectedQigs =
            immutable.List<Message>(messages.filter((x: Message) => x.markSchemeGroupId === this.selectedMsg.markSchemeGroupId));

        // Find the message index with in the selected QIG messages
        let selectedMessageIndexInTheQIG =
            messagesInTheSelectedQigs.findIndex((x: Message) => x.examinerMessageId === this.selectedMsg.examinerMessageId);

        // Check currently selected message is the last item in the QIG Group.
        if (selectedMessageIndexInTheQIG === messagesInTheSelectedQigs.count() - 1) {
            // Select Previous message in the same group, If it has a previous item in the message
            if (messagesInTheSelectedQigs.count() > 1) {
                this.selectedMsg = messagesInTheSelectedQigs.get(selectedMessageIndexInTheQIG - 1);
            } else {
                //  Select the next Item In the all messages, If it is Not the last messages in the Panel.
                let selectedMessageIndexInAllMessages =
                    messages.findIndex((x: Message) => x.examinerMessageId === this.selectedMsg.examinerMessageId);

                if (selectedMessageIndexInAllMessages !== messages.count() - 1) {
                    this.selectedMsg = messages.get(selectedMessageIndexInAllMessages + 1);
                } else if (messages.count() > 1) {
                    // If it is laste message in all messages and has a previous message select.
                    this.selectedMsg = messages.get(selectedMessageIndexInAllMessages - 1);
                } else {
                    // All deleted.
                    this.selectedMsg = undefined;
                }
            }
        } else {
            // Message Deleted In a QIG group and has a next message with in  the Group, Select Next Message in the Selected QIG Group.
            this.selectedMsg = messagesInTheSelectedQigs.get(selectedMessageIndexInTheQIG + 1);
        }

        this.selectedMsgDetails = null;

        // refresh the data
        this.getMessagesForInboxOnDeletion();
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * Open the response page.
     */
    private navigateToResponsePage = (): void => {
        navigationHelper.loadResponsePage();
    };

    /**
     * Show Loading Indicator.
     */
    private onDisplayIdClick = (): void => {
        let messageNavigationArguments: MessageNavigationArguments = {
            responseId: null,
            canNavigate: true,
            navigateTo: enums.MessageNavigation.toSearchedResponse,
            navigationConfirmed: false,
            hasMessageContainsDirtyValue: undefined,
            triggerPoint: enums.TriggerPoint.None
        };
        if (messageStore.instance.isMessagePanelActive) {
            messageNavigationArguments.canNavigate = false;
            messagingActionCreator.canMessageNavigate(messageNavigationArguments);
        } else {
            this.openSearchedResponse(messageNavigationArguments);
        }
    };

    /**
     * Update the message count
     */
    private updateNotification = () => {
        this.unreadMessageCount = messageStore.instance.getUnreadMessageCount;
    };

    /**
     * returns whether the forward button is hidden or not
     * @param markSchemeGroupId
     */
    private isForwardButtonHidden(markSchemeGroupId: number) {
        let item: Item = this.qigListItems.filter((x: Item) => x.id === markSchemeGroupId)[0];
        if (item === undefined) {
            return true;
        } else {
            return false;
        }
    }

    private openSearchedResponse = (messageNavigationArguments: MessageNavigationArguments) => {
        if (messageNavigationArguments.canNavigate &&
            messageNavigationArguments.navigateTo === enums.MessageNavigation.toSearchedResponse) {
            responseActionCreator.getResponseDetails(
                this.selectedMsgDetails.displayId,
                this.selectedMsgDetails.markGroupId,
                this.selectedMsgDetails.esMarkGroupId,
                this.selectedMsg.markSchemeGroupId,
                this.selectedMsg.examinerMessageId,
                this.selectedMsgDetails.candidateScriptId,
                loginSession.EXAMINER_ID,
                this.selectedMsgDetails.isElectronicStandardisationTeamMember,
                this.selectedMsgDetails.isTeamManagement,
                this.selectedMsgDetails.isStandardisationSetup,
                this.selectedMsgDetails.standardisationSetupWorklistType,
                this.selectedMsgDetails.esDisplayId);
            this.setState({ isOpeningResponse: true });
        }
    };

    /**
     * Data Received For Opening the response. Validate marker is withdrwan from the QIG
     */
    private initiateSerachResponse = (searchedResponseData: SearchedResponseData) => {
        this.searchedResponseData = searchedResponseData;
        if (searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn) {
            this.setState({ isOpeningResponse: false });
            this.getMessagesForTheSelectedTab();
            this.selectedMsg = undefined;
            this.selectedMsgDetails = null;
            return;
        } else if (searchedResponseData.hasQualityFeedbackOutstanding &&
            searchedResponseData.loggedInExaminerId === searchedResponseData.examinerId) {
            // Display Message for indicating the Quality feedback message
            this.setState({ isOpeningResponse: false, hasOpeningQualityFeedbackQutstandingQIGsResponse: true });
            return;
        }

        responseSearchHelper.initiateSerachResponse(searchedResponseData);
    };

    /**
     * Close the Quality feedback message.
     */
    private onQualityFeedbackWarningMessageClose = () => {
        this.setState({ hasOpeningQualityFeedbackQutstandingQIGsResponse: false });
    };

    /**
     * We've to clear the existing search filter if the user is navigating to menu.
     */
    private onMenuOpen = (doVisible: boolean = true) => {
        this.expandOrCollapseDetails = undefined;
        if (doVisible && this.searchData.searchText !== '') {
            this.onSearch('');
        }

        this.onMessagesReceived(0);
    }

    /**
     * Callback function function for on search
     */
    private onSearch = (searchText: string) => {
        this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
        this.selectedMsg = undefined;
        this.onMessagesReceived(0);
    }

    /**
     * Update the collection with expand or collapse details
     * @param qigId number
     * @param isOpen boolean
     */
    private onExpandOrCollapse = (qigId: number, isOpen: boolean) => {
        // Dictionary already contains the key then update the value otherwise add a new entry.
        this.expandOrCollapseDetails = this.expandOrCollapseDetails.set(qigId, isOpen);
        this.onMessagesReceived(0);
    }

    /**
     * Returns expand or collapse object based on selected tab
     */
    public get expandOrCollapseDetails(): immutable.Map<number, boolean> {
        switch (this.selectedTab) {
            case enums.MessageFolderType.Sent:
                if (!this.sentTabExpandOrCollapseDetails) {
                    this.sentTabExpandOrCollapseDetails = immutable.Map<number, boolean>();
                }
                return this.sentTabExpandOrCollapseDetails;
            case enums.MessageFolderType.Deleted:
                if (!this.deletedTabExpandOrCollapseDetails) {
                    this.deletedTabExpandOrCollapseDetails = immutable.Map<number, boolean>();
                }
                return this.deletedTabExpandOrCollapseDetails;
            default:
                if (!this.inboxTabExpandOrCollapseDetails) {
                    this.inboxTabExpandOrCollapseDetails = immutable.Map<number, boolean>();
                }
                return this.inboxTabExpandOrCollapseDetails;
        }
    }

    /**
     * set expand or collapse object based on selected tab
     */
    public set expandOrCollapseDetails(expandOrCollapseDetails: immutable.Map<number, boolean>) {
        if (expandOrCollapseDetails === undefined) {
            this.sentTabExpandOrCollapseDetails = undefined;
            this.deletedTabExpandOrCollapseDetails = undefined;
            this.inboxTabExpandOrCollapseDetails = undefined;
        }

        switch (this.selectedTab) {
            case enums.MessageFolderType.Sent:
                this.sentTabExpandOrCollapseDetails = expandOrCollapseDetails;
                break;
            case enums.MessageFolderType.Deleted:
                this.deletedTabExpandOrCollapseDetails = expandOrCollapseDetails;
                break;
            default:
                this.inboxTabExpandOrCollapseDetails = expandOrCollapseDetails;
                break;
        }
    }

    /**
     * Returns the filtered set of messages if filter is applicable
     */
    private get filteredMessages(): immutable.List<Message> {
        let filteredMessages: immutable.List<Message> = messageStore.instance.messages;
        if (this.searchData.searchText !== '' && this.searchData.isVisible) {
            filteredMessages = immutable.List<Message>(filteredMessages.filter((message: Message) =>
                messageTranslationHelper.getExaminerName(message).toLowerCase().indexOf(this.searchData.searchText.toLowerCase()) !== -1));
        }

        return filteredMessages;
    }

    /**
     * hide busy indicator on response search failed
     */
    private onResponseDataReceivedFailed = (): void => {
        this.setState({ isOpeningResponse: false });
    };

    // Handles the action event on Message Details Received failed
    private onMessageDetailsReceivedFailed = (): void => {
        this.isLoadingDataFailed = true;
        this.setState({
            renderedOn: Date.now()
        });
    };

    // Disable loading indicator when application goes offline/
    // if it failed to retrienve data.
    private get forceDisableLoading(): boolean {
        return this.isLoadingDataFailed || !this.props.isOnline;
    }

    /**
     * check online status
     * @param messageType
     */
    private checkOnlineStatusAndDoMessageAction(messageType: enums.MessageType) {
        /* Will request tinymce font when open a compose message panel first time
        (ie, when render message popup component first time). If open the compose message panel in offline mode,
        then the font request will get failed and thus the font family buttons are not visible.
        Since this request is happens only once, the font family buttons are not visible during that session.
        So we first do a ping and check the network status and if the system is in online,
        then proceed the message action (compose/reply/forward). If the system is in offline mode,
        then shows offline popup and don’t proceed the message action.*/
        if (applicationStore.instance.isOnline) {
            // ping and check online status if system is in online mode
            this.messageType = messageType;
            applicationActionCreator.validateNetWorkStatus(true);
        } else {
            // if in offline mode, then show offline popup
            applicationActionCreator.checkActionInterrupted();
        }
    }

    /**
     * Actions to be done when online status updated
     */
    private onOnlineStatusUpdated = (): void => {
        //DefectFix #65417: Removed offline check, since on offline, the offline message is showing without any user action
        if (applicationStore.instance.isOnline) {
            // if in online mode, the proceed the action
            switch (this.messageType) {
                case enums.MessageType.InboxCompose:
                    this.onNewMessageClicked();
                    break;
                case enums.MessageType.InboxForward:
                    this.doSetvariablesforReplyForward(enums.MessageAction.Forward);
                    break;
                case enums.MessageType.InboxReply:
                    this.doSetvariablesforReplyForward(enums.MessageAction.Reply);
                    break;
            }
            /*If the application goes offline when clicking a response from inbox and then comes back online
            loading response indicator will be shown and no response will be loaded, so setting loading
            indicator to false when back online*/
            if (this.state.isOpeningResponse === true) {
                this.setState({ isOpeningResponse: false });
            }
            this.messageType = enums.MessageType.None;
        }
    };

    /**
     * Gets whether Examiner have permission to view respnses in  standardisation setup classified worklist.
     * If we have no permission in classifications we have to disable linked responseID click in messaging.
     */
    private hasPermissionToViewStandardisationWorklist = (): void => {
        let hasPermissionInStdSetupWorklist: boolean = true;
        if (this.selectedMsgDetails.isStandardisationSetup
            && this.selectedMsgDetails.standardisationSetupWorklistType === enums.StandardisationSetup.ClassifiedResponse) {
            hasPermissionInStdSetupWorklist = false;
            let stdSetupPremissionsData: standardisationSetupCCData =
                qigStore.instance.getSSUPermissionsData(this.selectedMsgDetails.markSchemeGroupID);

            if (stdSetupPremissionsData.role.viewByClassification.classifications) {
                switch (this.selectedMsgDetails.markingModeId) {
                    case enums.MarkingMode.Practice:
                        hasPermissionInStdSetupWorklist = stdSetupPremissionsData.role.viewByClassification.classifications.practice;
                        break;
                    case enums.MarkingMode.Approval:
                        hasPermissionInStdSetupWorklist = stdSetupPremissionsData.role.viewByClassification.classifications.standardisation;
                        break;
                    case enums.MarkingMode.ES_TeamApproval:
                        hasPermissionInStdSetupWorklist =
                            stdSetupPremissionsData.role.viewByClassification.classifications.stmStandardisation;
                        break;
                    case enums.MarkingMode.Seeding:
                        hasPermissionInStdSetupWorklist = stdSetupPremissionsData.role.viewByClassification.classifications.seeding;
                        break;
                }
            }
        }
        this.selectedMsgDetails.hasPermissionInStdSetupWorklist = hasPermissionInStdSetupWorklist;
    }
}
export = MessageContainer;

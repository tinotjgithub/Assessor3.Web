/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../../utility/enums');
import messageStore = require('../../../../stores/message/messagestore');
let classNames = require('classnames');
import NotificationCount = require('../../../message/notificationcount');
import MesageOrExceptionHolder = require('../../responsescreen/messageandexception/mesageorexceptionholder');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
import messagingActionCreator = require('../../../../actions/messaging/messagingactioncreator');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');
import responseStore = require('../../../../stores/response/responsestore');
/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onMessageSelected: Function;
    onCreateNewMessageSelected: Function;
    onMessageReadStatusReflected: Function;
    selectedMessageId: number;
    isNewMessageButtonHidden: boolean;
}

interface State {
    renderedOn?: number;
    hasLinkedMessages?: boolean;
    isOpen?: boolean;
    messageListChangedOn?: number;
}

class MessageIcon extends pureRenderComponent<Props, State> {

    private selectedItemId: number;
    private isMessageListIconClicked: boolean = false;
    private unreadMessageCount: number = 0;
    private isMessageIconClicked: boolean = false;
    /**
     * Constructor for MessageIcon
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: props.selectedMessageId > 0 && messageStore.instance.messages.count() > 1 ? Date.now() : 0,
            isOpen: props.selectedMessageId > 0 && messageStore.instance.messages.count() > 1
                    && responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView,
            messageListChangedOn: 0,
            hasLinkedMessages: (messageStore.instance.messages === undefined ? false : messageStore.instance.messages.count() > 0)
        };
        this.calculateUnReadMessageCount(undefined, false);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickOutsideElement = this.handleClickOutsideElement.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        if (!teamManagementStore.instance.isRedirectFromException) {
            return (
                <li id ='msg-icon' className={ classNames('mrk-new-message dropdown-wrap',
                    { 'open': this.state.renderedOn > 0 && this.state.isOpen }) }>
                    {this.renderMessageIcon() }
                    <MesageOrExceptionHolder id='msg-resp-holder' key='msg-resp-holder'
                        isMessageHolder={true}
                        selectedItemId={this.props.selectedMessageId}
                        messages={ messageStore.instance.messages }
                        onNewMessageOrExceptionClick = { this.onNewMessageOrExceptionClick }
                        onMessageOrExceptionItemSelected = { this.onNewMessageOrExceptionItemClick }
                        isNewMessageButtonHidden = {this.props.isNewMessageButtonHidden}/>
                </li>
            );
        } else {
            return null;
        }
    }

    /**
     * Component will receive props
     * @param nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        // for handling initial load and intermittent event subscription failing issue due to the component mounting delay
        // Instead of subscribing RESPONSE_MESSAGE here, pass the required fields as props from response container
        if (this.props.selectedMessageId === 0 && nextProps.selectedMessageId > 0) {
            this.setState({
                renderedOn: (messageStore.instance.messages.count() > 1 || this.isMessageIconClicked) ? Date.now() : 0,
                isOpen: (messageStore.instance.messages.count() > 1 || this.isMessageIconClicked),
                hasLinkedMessages: (messageStore.instance.messages === undefined ? false : messageStore.instance.messages.count() > 0)
            });
        }
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        window.addEventListener('click', this.handleClickOutsideElement);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.refresh);
       responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
       messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
}

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.refresh);
        window.removeEventListener('click', this.handleClickOutsideElement);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        // set the scroll position to the selected message for automatic selection
        if (this.selectedItemId > 0 && !this.isMessageListIconClicked) {
            let offsetTop: number = htmlUtilities.getOffsetTop(this.selectedItemId + '-item');
            let headerHeight: number = 50;
            htmlUtilities.setScrollTop('message-contents', offsetTop - headerHeight);
        }
    }

    /**
     * Render the expand icon in message
     */
    private renderExpandIcon() {
        if (this.state.hasLinkedMessages) {
            return (<span id='msg-expand-icon' className='sprite-icon toolexpand-icon'>message-expand</span>);
        }
    }

    /**
     * Handles message icon click
     */
    private handleClick = (): void => {
        if (!this.state.hasLinkedMessages) {
            this.props.onCreateNewMessageSelected();
        } else {
            this.isMessageListIconClicked = true;
            this.calculateUnReadMessageCount();
            // If there is any unread message in the list select the first item as selected.
            if (!this.state.isOpen && this.unreadMessageCount > 0) {
                this.selectedItemId = messageStore.instance.messages.first().examinerMessageId;
                this.props.onMessageSelected(this.selectedItemId);
                this.isMessageIconClicked = true;
            } else {
                this.setState({
                renderedOn: Date.now(),
                isOpen: !this.state.isOpen
            });
        }
        }
    };

    /**
     * Handle click events outside the zoom settings
     * @param {any} e - The source element
     */
    private handleClickOutsideElement = (e: any): any => {
        if (this.state.isOpen && !this.isMessageListIconClicked) {
            this.calculateUnReadMessageCount();
            this.setState({
                renderedOn: Date.now(),
                isOpen: false
            });
        } else {
            this.isMessageListIconClicked = false;
            this.selectedItemId = 0;
        }

        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        if (this.state.isOpen !== undefined && e.type !== 'touchend') {
            messagingActionCreator.isMessageSidePanelOpen(this.state.isOpen);
        }
    };

    /**
     * Click Event Of new Message or Exception inside the list.
     */
    private onNewMessageOrExceptionClick = (isNewMsg: boolean): void => {
        if (isNewMsg) {
            this.selectedItemId = 0;
            this.calculateUnReadMessageCount();
            this.isMessageListIconClicked = true;
            this.props.onCreateNewMessageSelected();
            this.setState({
                renderedOn: Date.now(),
                isOpen: false
            });
        }
    };

    /**
     * Click Event Of  Message or Exception item in the list.
     */
    private onNewMessageOrExceptionItemClick = (isMsg: boolean, itemId: number): void => {
        this.isMessageListIconClicked = true;
        if (isMsg && this.selectedItemId !== itemId) {
            this.calculateUnReadMessageCount();
            this.selectedItemId = itemId;
            this.props.onMessageSelected(itemId);

            this.setState({
                renderedOn: Date.now()
            });
        }
    };


    /**
     * This will open the response item
     */
    protected responseChanged = (): void => {
        if (!applicationStore.instance.isOnline) {
             this.unreadMessageCount = undefined;
             this.setState({
                renderedOn: Date.now()
            });
         }

    }

    /**
     * Refresh UI
     */
    private refresh = (isMessageReadCountChanged: boolean, selectedMessageId: number) => {
        this.calculateUnReadMessageCount(isMessageReadCountChanged);
        let msgCount = messageStore.instance.messages.count();
        this.selectedItemId = selectedMessageId;
        let isOpen: boolean = this.state.isOpen && msgCount > 1;
        let renderedOn: number = 0;

        // If we want to select a particular message by default
        if (selectedMessageId > 0) {
            if (this.props.selectedMessageId === 0) {
                this.props.onMessageSelected(this.selectedItemId);
            }
            renderedOn = msgCount > 1 ? Date.now() : 0;
            isOpen = msgCount > 1;
        }

        this.setState({
            renderedOn: renderedOn,
            messageListChangedOn: Date.now(),
            hasLinkedMessages: msgCount > 0,
            isOpen: isOpen
        });
    };

    /**
     * Get the unread message count
     */
    private calculateUnReadMessageCount(isMessageReadCountChanged: boolean = undefined, canInvokeSetState: boolean = true) {

        if (messageStore.instance.messages) {
            let currentunreadMessageCount = this.unreadMessageCount;

            let newUnreadMessagesCount = messageStore.instance.messages.filter((message: Message) =>
                message.status === enums.MessageReadStatus.New &&
                !messageStore.instance.isMessageRead(message.examinerMessageId)).count();

            if (newUnreadMessagesCount !== currentunreadMessageCount || isMessageReadCountChanged) {
                this.props.onMessageReadStatusReflected();
            }

            if (canInvokeSetState || newUnreadMessagesCount !== currentunreadMessageCount) {
                this.unreadMessageCount = newUnreadMessagesCount;
                this.setState({
                    renderedOn: Date.now()
                });
            }
        }
    }

    /**
     * Renders the message icon
     * @returns
     */
    private renderMessageIcon() {
        if (this.state.hasLinkedMessages || !this.props.isNewMessageButtonHidden) {
            return (<a className='menu-button'
                onClick={this.handleClick}
                title={ localeStore.instance.TranslateText('marking.response.left-toolbar.messages-button-tooltip-' +
                    (this.state.hasLinkedMessages ? 'linked-messages' : 'new-message')) }
                id = { this.props.id }>
                <span className='svg-icon'>
                    <svg id={ (this.state.hasLinkedMessages ? 'link' : 'new') + '-msg-icon' } viewBox='0 0 32 32'
                        className={classNames({ 'new-message-icon': !this.state.hasLinkedMessages },
                            { 'marking-message-icon': this.state.hasLinkedMessages })}>
                        <title>{localeStore.instance.TranslateText('marking.response.left-toolbar.messages-button-tooltip-' +
                            (this.state.hasLinkedMessages ? 'linked-messages' : 'new-message'))}
                        </title>
                          <use xlinkHref= {classNames({ '#new-message-icon': !this.state.hasLinkedMessages },
                            { '#message-icon': this.state.hasLinkedMessages })}>
                        </use>
                    </svg>
                    <NotificationCount id='response-msg' key='response-msg' unReadMessageCount={this.unreadMessageCount} />
                </span>
                {this.renderExpandIcon() }
            </a>);
        }
    }

    /**
     * The 
     * @private
     * @memberof MessageIcon
     */
    private onMessageDetailsReceived = (): void => {
     if (!this.state.isOpen && this.unreadMessageCount > 0) {
        this.setState({
            renderedOn: Date.now(),
            isOpen: true
        });
    }
    }
}

export = MessageIcon;
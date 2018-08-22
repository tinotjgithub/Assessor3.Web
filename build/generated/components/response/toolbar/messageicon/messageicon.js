"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var enums = require('../../../utility/enums');
var messageStore = require('../../../../stores/message/messagestore');
var classNames = require('classnames');
var NotificationCount = require('../../../message/notificationcount');
var MesageOrExceptionHolder = require('../../responsescreen/messageandexception/mesageorexceptionholder');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var teamManagementStore = require('../../../../stores/teammanagement/teammanagementstore');
var messagingActionCreator = require('../../../../actions/messaging/messagingactioncreator');
var applicationStore = require('../../../../stores/applicationoffline/applicationstore');
var responseStore = require('../../../../stores/response/responsestore');
var MessageIcon = (function (_super) {
    __extends(MessageIcon, _super);
    /**
     * Constructor for MessageIcon
     * @param props
     * @param state
     */
    function MessageIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isMessageListIconClicked = false;
        this.unreadMessageCount = 0;
        this.isMessageIconClicked = false;
        /**
         * Handles message icon click
         */
        this.handleClick = function () {
            if (!_this.state.hasLinkedMessages) {
                _this.props.onCreateNewMessageSelected();
            }
            else {
                _this.isMessageListIconClicked = true;
                _this.calculateUnReadMessageCount();
                // If there is any unread message in the list select the first item as selected.
                if (!_this.state.isOpen && _this.unreadMessageCount > 0) {
                    _this.selectedItemId = messageStore.instance.messages.first().examinerMessageId;
                    _this.props.onMessageSelected(_this.selectedItemId);
                    _this.isMessageIconClicked = true;
                }
                _this.setState({
                    renderedOn: Date.now(),
                    isOpen: !_this.state.isOpen
                });
            }
        };
        /**
         * Handle click events outside the zoom settings
         * @param {any} e - The source element
         */
        this.handleClickOutsideElement = function (e) {
            if (_this.state.isOpen && !_this.isMessageListIconClicked) {
                _this.calculateUnReadMessageCount();
                _this.setState({
                    renderedOn: Date.now(),
                    isOpen: false
                });
            }
            else {
                _this.isMessageListIconClicked = false;
                _this.selectedItemId = 0;
            }
            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (_this.state.isOpen !== undefined && e.type !== 'touchend') {
                messagingActionCreator.isMessageSidePanelOpen(_this.state.isOpen);
            }
        };
        /**
         * Click Event Of new Message or Exception inside the list.
         */
        this.onNewMessageOrExceptionClick = function (isNewMsg) {
            if (isNewMsg) {
                _this.selectedItemId = 0;
                _this.calculateUnReadMessageCount();
                _this.isMessageListIconClicked = true;
                _this.props.onCreateNewMessageSelected();
                _this.setState({
                    renderedOn: Date.now(),
                    isOpen: false
                });
            }
        };
        /**
         * Click Event Of  Message or Exception item in the list.
         */
        this.onNewMessageOrExceptionItemClick = function (isMsg, itemId) {
            _this.isMessageListIconClicked = true;
            if (isMsg && _this.selectedItemId !== itemId) {
                _this.calculateUnReadMessageCount();
                _this.selectedItemId = itemId;
                _this.props.onMessageSelected(itemId);
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * This will open the response item
         */
        this.responseChanged = function () {
            if (!applicationStore.instance.isOnline) {
                _this.unreadMessageCount = undefined;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Refresh UI
         */
        this.refresh = function (isMessageReadCountChanged, selectedMessageId) {
            _this.calculateUnReadMessageCount(isMessageReadCountChanged);
            var msgCount = messageStore.instance.messages.count();
            _this.selectedItemId = selectedMessageId;
            var isOpen = _this.state.isOpen && msgCount > 1;
            var renderedOn = 0;
            // If we want to select a particular message by default
            if (selectedMessageId > 0) {
                if (_this.props.selectedMessageId === 0) {
                    _this.props.onMessageSelected(_this.selectedItemId);
                }
                renderedOn = msgCount > 1 ? Date.now() : 0;
                isOpen = msgCount > 1;
            }
            _this.setState({
                renderedOn: renderedOn,
                messageListChangedOn: Date.now(),
                hasLinkedMessages: msgCount > 0,
                isOpen: isOpen
            });
        };
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
    MessageIcon.prototype.render = function () {
        if (!teamManagementStore.instance.isRedirectFromException) {
            return (React.createElement("li", {id: 'msg-icon', className: classNames('mrk-new-message dropdown-wrap', { 'open': this.state.renderedOn > 0 && this.state.isOpen })}, this.renderMessageIcon(), React.createElement(MesageOrExceptionHolder, {id: 'msg-resp-holder', key: 'msg-resp-holder', isMessageHolder: true, selectedItemId: this.props.selectedMessageId, messages: messageStore.instance.messages, onNewMessageOrExceptionClick: this.onNewMessageOrExceptionClick, onMessageOrExceptionItemSelected: this.onNewMessageOrExceptionItemClick, isNewMessageButtonHidden: this.props.isNewMessageButtonHidden})));
        }
        else {
            return null;
        }
    };
    /**
     * Component will receive props
     * @param nextProps
     */
    MessageIcon.prototype.componentWillReceiveProps = function (nextProps) {
        // for handling initial load and intermittent event subscription failing issue due to the component mounting delay
        // Instead of subscribing RESPONSE_MESSAGE here, pass the required fields as props from response container
        if (this.props.selectedMessageId === 0 && nextProps.selectedMessageId > 0) {
            this.setState({
                renderedOn: (messageStore.instance.messages.count() > 1 || this.isMessageIconClicked) ? Date.now() : 0,
                isOpen: (messageStore.instance.messages.count() > 1 || this.isMessageIconClicked),
                hasLinkedMessages: (messageStore.instance.messages === undefined ? false : messageStore.instance.messages.count() > 0)
            });
        }
    };
    /**
     * Component did mount
     */
    MessageIcon.prototype.componentDidMount = function () {
        window.addEventListener('click', this.handleClickOutsideElement);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.refresh);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
    };
    /**
     * Component will unmount
     */
    MessageIcon.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.refresh);
        window.removeEventListener('click', this.handleClickOutsideElement);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
    };
    /**
     * Component did update
     */
    MessageIcon.prototype.componentDidUpdate = function () {
        // set the scroll position to the selected message for automatic selection
        if (this.selectedItemId > 0 && !this.isMessageListIconClicked) {
            var offsetTop = htmlUtilities.getOffsetTop(this.selectedItemId + '-item');
            var headerHeight = 50;
            htmlUtilities.setScrollTop('message-contents', offsetTop - headerHeight);
        }
    };
    /**
     * Render the expand icon in message
     */
    MessageIcon.prototype.renderExpandIcon = function () {
        if (this.state.hasLinkedMessages) {
            return (React.createElement("span", {id: 'msg-expand-icon', className: 'sprite-icon toolexpand-icon'}, "message-expand"));
        }
    };
    /**
     * Get the unread message count
     */
    MessageIcon.prototype.calculateUnReadMessageCount = function (isMessageReadCountChanged, canInvokeSetState) {
        if (isMessageReadCountChanged === void 0) { isMessageReadCountChanged = undefined; }
        if (canInvokeSetState === void 0) { canInvokeSetState = true; }
        if (messageStore.instance.messages) {
            var currentunreadMessageCount = this.unreadMessageCount;
            var newUnreadMessagesCount = messageStore.instance.messages.filter(function (message) {
                return message.status === enums.MessageReadStatus.New &&
                    !messageStore.instance.isMessageRead(message.examinerMessageId);
            }).count();
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
    };
    /**
     * Renders the message icon
     * @returns
     */
    MessageIcon.prototype.renderMessageIcon = function () {
        if (this.state.hasLinkedMessages || !this.props.isNewMessageButtonHidden) {
            return (React.createElement("a", {className: 'menu-button', onClick: this.handleClick, title: localeStore.instance.TranslateText('marking.response.left-toolbar.messages-button-tooltip-' +
                (this.state.hasLinkedMessages ? 'linked-messages' : 'new-message')), id: this.props.id}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {id: (this.state.hasLinkedMessages ? 'link' : 'new') + '-msg-icon', viewBox: '0 0 32 32', className: classNames({ 'new-message-icon': !this.state.hasLinkedMessages }, { 'marking-message-icon': this.state.hasLinkedMessages })}, React.createElement("title", null, localeStore.instance.TranslateText('marking.response.left-toolbar.messages-button-tooltip-' +
                (this.state.hasLinkedMessages ? 'linked-messages' : 'new-message'))), React.createElement("use", {xlinkHref: classNames({ '#new-message-icon': !this.state.hasLinkedMessages }, { '#message-icon': this.state.hasLinkedMessages })})), React.createElement(NotificationCount, {id: 'response-msg', key: 'response-msg', unReadMessageCount: this.unreadMessageCount})), this.renderExpandIcon()));
        }
    };
    return MessageIcon;
}(pureRenderComponent));
module.exports = MessageIcon;
//# sourceMappingURL=messageicon.js.map
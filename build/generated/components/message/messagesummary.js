"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../utility/enums');
var classNames = require('classnames');
var messageHelper = require('../utility/message/messagehelper');
var messageStore = require('../../stores/message/messagestore');
var pureRenderComponent = require('../base/purerendercomponent');
var messageTranslationHelper = require('../utility/message/messagetranslationhelper');
var localeStore = require('../../stores/locale/localestore');
/**
 * Make the string as html.
 * @param messageContent
 */
var createMarkup = function (messageContent) {
    return {
        __html: messageContent
    };
};
/**
 * This component was a stateless component, But seems that it is rerendering even it is no changes in props and state.
 * This wont happen in pureRender => Child component wont re render if it is not having any props or state change.
 */
var MessageSummary = (function (_super) {
    __extends(MessageSummary, _super);
    /**
     * @constructor
     */
    function MessageSummary(props) {
        var _this = this;
        _super.call(this, props, null);
        this.onMessageClick = function (event) {
            if (_this.props.message.examinerMessageId !== _this.props.selectedMsgId) {
                _this.props.onSelectedMessageChanged(_this.props.message);
            }
            // Fire Action, If Read status need to be updated. and update the.
            event.stopPropagation();
        };
    }
    /**
     * append examiners
     */
    MessageSummary.prototype.appendExaminer = function () {
        var examiners = '';
        if (this.props.message && this.props.message.toExaminerDetails != null) {
            this.props.message.toExaminerDetails.map(function (item) {
                examiners += item.fullName + ';';
            });
            // removing last item semicolon
            return examiners.replace(/;$/, '');
        }
        return examiners;
    };
    /**
     * Render method
     */
    MessageSummary.prototype.render = function () {
        var messagePriority;
        if (this.props.message.priorityName !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
            messagePriority = (React.createElement("span", {className: classNames('sprite-icon', {
                'exclamtion-icon-red': this.props.message.priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)
            }, {
                'star-icon-red': this.props.message.priorityName === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)
            }, 'black')}));
        }
        var isMessageRead = messageStore.instance.isMessageRead(this.props.message.examinerMessageId);
        var translatedMessageContents = messageTranslationHelper.getTranslatedContent(this.props.message);
        var toRender;
        if (this.props.message.messageFolderType === enums.MessageFolderType.Inbox) {
            toRender = (React.createElement("div", {id: 'sender-' + this.props.id, className: 'msg-sender small-text'}, messageTranslationHelper.getExaminerName(this.props.message)));
        }
        else {
            toRender = (React.createElement("div", {id: 'sender-' + this.props.id, className: 'msg-sender small-text'}, !this.props.message.toTeam ? this.appendExaminer()
                : localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team')));
        }
        return (React.createElement("li", {id: 'msg-item-' + this.props.id, onClick: this.onMessageClick, className: classNames('msg-item', { 'unread': this.props.message.status === enums.MessageReadStatus.New && !isMessageRead }, { 'selected': this.props.message.examinerMessageId === this.props.selectedMsgId })}, React.createElement("a", {href: 'javascript:void(0)', className: 'msg-item-link'}, React.createElement("div", {className: 'msg-meta', "data-id": this.props.message.examinerMessageId}, React.createElement("div", {className: 'meta-left'}, toRender, React.createElement("div", {id: 'subject-' + this.props.id, className: 'msg-title'}, translatedMessageContents.subject)), React.createElement("div", {className: 'meta-right small-text'}, React.createElement("div", {id: 'time-' + this.props.id, className: 'msg-time'}, messageHelper.getDateToDisplay(this.props.message.displayDate)), React.createElement("div", {id: 'priority-' + this.props.id, className: 'msg-meta-icons'}, React.createElement("div", {className: 'msg-importance'}, messagePriority)), React.createElement("div", {className: 'msg-flag'}))), React.createElement("div", {id: 'body-summary-' + this.props.id, className: 'msg-body small-text'}, React.createElement("p", {className: 'summary-text', id: 'msg-first-line', dangerouslySetInnerHTML: createMarkup(translatedMessageContents.firstLine)})))));
    };
    return MessageSummary;
}(pureRenderComponent));
module.exports = MessageSummary;
//# sourceMappingURL=messagesummary.js.map
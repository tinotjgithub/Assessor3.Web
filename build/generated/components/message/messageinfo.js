"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var RecipientListToggle = require('./recipientlisttoggle');
var messageTranslationHelper = require('../utility/message/messagetranslationhelper');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var classNames = require('classnames');
var constants = require('../utility/constants');
var messageStore = require('../../stores/message/messagestore');
/**
 * Message info section contain message type, recipients list and remaining recipients count.
 * @param props
 */
var MessageInfo = (function (_super) {
    __extends(MessageInfo, _super);
    /**
     * @constructor
     */
    function MessageInfo(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // holds the remaining RecipientCount
        this.remainingRecipientCount = 0;
        /**
         * Handle toggle event of recipient list.
         *
         */
        this.onRecipientListToggle = function () {
            _this.setState({
                isExpanded: !_this.state.isExpanded,
                isClassUpdated: _this.state.isClassUpdated
            });
        };
        /**
         * Calculate recipients count.
         */
        this.calculateRecipientCount = function (event) {
            if (event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd') && event.propertyName !== 'width') {
                return;
            }
            if (_this.props.message &&
                _this.props.message.messageFolderType === enums.MessageFolderType.Sent) {
                var lastAddressItem = htmlUtilities.getElementsByClassName('first-row-last')[0];
                if (lastAddressItem) {
                    if (lastAddressItem.classList.contains('first-row-last')) {
                        lastAddressItem.classList.remove('first-row-last');
                    }
                }
                // If message send for an entire team then set remaining recipient count as 0.
                if (_this.props.message.toTeam) {
                    _this.remainingRecipientCount = 0;
                    _this.setState({
                        isExpanded: false,
                        isClassUpdated: !_this.state.isClassUpdated
                    });
                }
                else {
                    var remainingRecipientCountUpdated = 0;
                    var wrapperWidthParent = (htmlUtilities.getElementsByClassName('msg-to')[0]) ?
                        htmlUtilities.getElementsByClassName('msg-to')[0].clientWidth : 0;
                    var wrapperWidthTo = (htmlUtilities.getElementsByClassName('msg-to-label dim-text')[0]) ?
                        htmlUtilities.getElementsByClassName('msg-to-label dim-text')[0].clientWidth : 0;
                    var wrapperWidthMore = (htmlUtilities.getElementsByClassName('msg-to-expand-toggler')[0]) ?
                        htmlUtilities.getElementsByClassName('msg-to-expand-toggler')[0].clientWidth : constants.RECIPIENT_MORE_LINK;
                    var totalWidth = wrapperWidthParent - (wrapperWidthTo + wrapperWidthMore);
                    _this.recipientListSpan = htmlUtilities.getElementsByClassName('msg-address');
                    var spanwidth = 0;
                    remainingRecipientCountUpdated = _this.remainingRecipientCount;
                    for (var i = 0; i < _this.recipientListSpan.length; i++) {
                        spanwidth += _this.recipientListSpan[i].clientWidth;
                        if (i === _this.recipientListSpan.length - 1) {
                            totalWidth = totalWidth + wrapperWidthMore;
                        }
                        if (spanwidth < totalWidth) {
                            _this.remainingRecipientCount = 0;
                        }
                        else {
                            if (i !== 0) {
                                _this.recipientListSpan[i - 1].className += ' first-row-last';
                            }
                            if (_this.recipientListSpan.length === 1 && spanwidth === totalWidth) {
                                _this.remainingRecipientCount = 0;
                            }
                            else {
                                _this.remainingRecipientCount = _this.recipientListSpan.length - i;
                            }
                            break;
                        }
                    }
                    if (remainingRecipientCountUpdated !== _this.remainingRecipientCount) {
                        _this.setState({
                            isExpanded: _this.state.isExpanded,
                            isClassUpdated: !_this.state.isClassUpdated
                        });
                    }
                }
            }
        };
        this.state = {
            isExpanded: false,
            isClassUpdated: false
        };
        this.examiners = new Array();
        this.onRecipientListToggle = this.onRecipientListToggle.bind(this);
        this.calculateRecipientCount = this.calculateRecipientCount.bind(this);
        this.appendExaminerWithSemiColon();
    }
    /**
     * Render method
     */
    MessageInfo.prototype.render = function () {
        var toRender;
        if (this.props.message.messageFolderType === enums.MessageFolderType.Inbox) {
            toRender = (React.createElement("div", {className: 'msg-sender'}, React.createElement("div", {className: 'dim-text msg-from-label', id: 'msg_from_label'}, localeStore.instance.TranslateText('messaging.message-lists.message-detail.' +
                enums.getEnumString(enums.MessageFolderType, this.props.message.messageFolderType).toLowerCase())), React.createElement("div", {className: 'msg-from-address', id: 'msg_from_address'}, messageTranslationHelper.getExaminerName(this.props.message))));
        }
        else {
            this.appendExaminerWithSemiColon();
            toRender = (React.createElement("div", {className: classNames('msg-to', this.state.isExpanded ? 'expanded' : '')}, React.createElement("div", {className: 'msg-to-label dim-text'}, localeStore.instance.TranslateText('messaging.message-lists.message-detail.' +
                enums.getEnumString(enums.MessageFolderType, this.props.message.messageFolderType).toLowerCase())), React.createElement("div", {className: 'msg-to-address', id: this.props.id}, !this.props.message.toTeam ?
                this.examiners.map(function (item) {
                    return React.createElement("span", {className: 'msg-address'}, item);
                }) :
                React.createElement("span", {className: 'msg-address', id: 'msg-address-entire-team'}, localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team'))), React.createElement(RecipientListToggle, {id: 'msg-to-expand-toggler', key: 'msg-to-expand-toggler', selectedLanguage: this.props.selectedLanguage, remainingRecipientCount: this.remainingRecipientCount, onRecipientListToggleClick: this.onRecipientListToggle})));
        }
        return (toRender);
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MessageInfo.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.calculateRecipientCount);
        var messagePanel = document.getElementById('messaging-panel');
        if (messagePanel) {
            messagePanel.addEventListener('transitionend', this.calculateRecipientCount);
            messagePanel.addEventListener('webkitTransitionEnd', this.calculateRecipientCount);
        }
        this.calculateRecipientCount();
        messageStore.instance.addListener(messageStore.MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT, this.calculateRecipientCount);
    };
    /**
     * This function gets invoked when the component is about to be un mounted
     */
    MessageInfo.prototype.componentWillUnMount = function () {
        window.removeEventListener('resize', this.calculateRecipientCount);
        var messagePanel = document.getElementById('messaging-panel');
        if (messagePanel) {
            messagePanel.removeEventListener('transitionend', this.calculateRecipientCount);
            messagePanel.removeEventListener('webkitTransitionEnd', this.calculateRecipientCount);
        }
        messageStore.instance.removeListener(messageStore.MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT, this.calculateRecipientCount);
    };
    /**
     * This function gets invoked when the component receives props
     */
    MessageInfo.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.message !== nextProps.message) {
            this.remainingRecipientCount = 0;
        }
    };
    /**
     * append examiners with semicolon
     */
    MessageInfo.prototype.appendExaminerWithSemiColon = function (props) {
        var _this = this;
        var index = 0;
        this.examiners = new Array();
        var _props = props ? props : this.props;
        if (_props.message && _props.message.toExaminerDetails != null) {
            _props.message.toExaminerDetails.map(function (item) {
                _this.examiners.push(item.fullName + ';');
            });
            index = this.examiners.length - 1;
            // replacing semicolon for last item
            if (index >= 0) {
                this.examiners[index] = this.examiners[index].toString().replace(';', '');
            }
        }
        else {
            this.examiners.push(_props.message.examinerDetails.fullName);
        }
    };
    return MessageInfo;
}(pureRenderComponent));
module.exports = MessageInfo;
//# sourceMappingURL=messageinfo.js.map
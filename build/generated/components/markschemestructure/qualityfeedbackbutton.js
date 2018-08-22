"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var stringHelper = require('../../utility/generic/stringhelper');
var localeStore = require('../../stores/locale/localestore');
var constants = require('../utility/constants');
var enums = require('../utility/enums');
var markingHelper = require('../../utility/markscheme/markinghelper');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var messageStore = require('../../stores/message/messagestore');
/**
 * Marking button.
 * @param {Props} props
 * @returns
 */
var QualityFeedbackButton = (function (_super) {
    __extends(QualityFeedbackButton, _super);
    /**
     * @constructor
     */
    function QualityFeedbackButton(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /* check whether Message panel id closed on discard*/
        this._isAwaitingMessagePanelClose = false;
        /**
         * This method will show confirmation dialog when mesage panel is closed on discarding
         */
        this.onMessagePanelClose = function () {
            if (_this._isAwaitingMessagePanelClose) {
                _this._isAwaitingMessagePanelClose = false;
                if (_this.props.onClick != null) {
                    _this.props.onClick();
                }
            }
        };
        /* Set initial state */
        this.state = {
            reRenderedOn: Date.now(),
            isConfirmationPopupDisplaying: false,
            showConfiramtionDialog: false
        };
        this.onClick = this.onClick.bind(this);
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    QualityFeedbackButton.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    QualityFeedbackButton.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
    };
    /**
     * Render method
     */
    QualityFeedbackButton.prototype.render = function () {
        var showConfirmationDialog = null;
        return (React.createElement("div", {className: 'feedback-btn-holder'}, React.createElement("button", {id: 'qualityFeedback', className: 'button rounded primary accept-feedback', onClick: this.onClick}, this.getResourceText('marking.response.mark-scheme-panel.accept-quality-feedback-button'))));
    };
    /**
     * gets text from resource file
     * @param resourceKey
     */
    QualityFeedbackButton.prototype.getResourceText = function (resourceKey) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey), [constants.NONBREAKING_HYPHEN_UNICODE]);
    };
    /**
     * Click event of Quality Feedback Button
     */
    QualityFeedbackButton.prototype.onClick = function () {
        var _this = this;
        var navigatePossible = true;
        var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
        responseNavigationFailureReasons.map(function (canNavigateAway) {
            if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSentMessage &&
                responseNavigationFailureReasons.length === 1) {
                navigatePossible = false;
                // we have to display discard message warning if failure condition is unsendmessage only.
                // if multiple failure reasons are there then we will handle on that messages
                messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.ResponseCompose, enums.SaveAndNavigate.toResponse, enums.SaveAndNavigate.fromQualityFeedback);
                _this._isAwaitingMessagePanelClose = true;
            }
        });
        if (navigatePossible) {
            if (this.props.onClick != null) {
                this.props.onClick();
            }
        }
    };
    return QualityFeedbackButton;
}(pureRenderComponent));
module.exports = QualityFeedbackButton;
//# sourceMappingURL=qualityfeedbackbutton.js.map
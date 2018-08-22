"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var messageStore = require('../../stores/message/messagestore');
var htmlUtilities = require('../../utility/generic/htmlutilities');
var Subject = (function (_super) {
    __extends(Subject, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function Subject(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad
         * Defect: 24608
         */
        this.closeMessage = function () {
            if (_this.props.hasFocus && htmlUtilities.isIPadDevice) {
                _this.setFocusOnSubject();
                (_this.refs[_this.props.refName]).blur();
            }
            // close message callback function called
            if (_this.props.callback) {
                _this.props.callback();
            }
        };
        /**
         * This method will call on subject onChange event
         */
        this.onChange = function (event) {
            _this.props.onChange(event.target.value);
        };
        /**
         * Set Focus to the input field if necessary
         */
        this.setFocusOnSubject = function () {
            if (_this.props.hasFocus) {
                (_this.refs[_this.props.refName]).blur();
                (_this.refs[_this.props.refName]).focus();
            }
        };
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
    }
    /**
     * Event on animation end
     * @param event
     */
    Subject.prototype.onAnimationEnd = function (event) {
        // If any child element has triggered the transion-end ignore it
        var element = event.srcElement || event.target;
        if (element.id !== 'messaging-panel') {
            return;
        }
        // setting scroll top - fix for ipad issue #49587
        if (htmlUtilities.isIPadDevice) {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        }
        this.setFocusOnSubject();
    };
    /**
     * Render method
     */
    Subject.prototype.render = function () {
        return (React.createElement("div", {className: this.props.outerClass}, React.createElement("input", {type: 'text', ref: this.props.refName, id: this.props.id, "aria-label": 'Subject', placeholder: this.props.placeHolder, className: this.props.className, maxLength: this.props.maxLength, value: this.props.value, onInput: this.onChange})));
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    Subject.prototype.componentDidMount = function () {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeMessage);
        // While creating a message from worklist and Inbox, set the focus to subject
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.setFocusOnSubject);
        this.messagingPanel = document.getElementsByClassName('messaging-panel').item(0);
        if (this.messagingPanel) {
            // While creating a message inside the response, set the focus to subject
            this.messagingPanel.addEventListener('transitionend', this.onAnimationEnd);
        }
        // While composing a message from Team management. Set focus to subject
        this.setFocusOnSubject();
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    Subject.prototype.componentWillUnmount = function () {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeMessage);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.setFocusOnSubject);
        if (this.messagingPanel) {
            this.messagingPanel.removeEventListener('transitionend', this.onAnimationEnd);
        }
    };
    return Subject;
}(pureRenderComponent));
module.exports = Subject;
//# sourceMappingURL=subject.js.map
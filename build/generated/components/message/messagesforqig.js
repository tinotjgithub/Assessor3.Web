"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var classNames = require('classnames');
var Messages = require('./messages');
var MessageQIGHeader = require('./messageqigheader');
var MessagesForQig = (function (_super) {
    __extends(MessagesForQig, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function MessagesForQig(props, state) {
        _super.call(this, props, state);
        this.onClick = this.onClick.bind(this);
    }
    /**
     * Render the Group Header and details.
     */
    MessagesForQig.prototype.render = function () {
        return (React.createElement("li", {className: classNames('msg-group msg-item', { 'open': this.props.isOpen }), id: 'grp-' + this.props.id}, React.createElement(MessageQIGHeader, {qigName: this.props.qigName, unReadMessages: this.props.unReadMessages, id: 'header-' + this.props.id, key: 'header-' + this.props.id, headerClick: this.onClick}), React.createElement("div", {id: 'grp-ul-' + this.props.id, className: 'msg-group-items'}, React.createElement(Messages, {messages: this.props.messages, selectedMsgId: this.props.selectedMsgId, id: this.props.id, key: this.props.id, selectedLanguage: this.props.selectedLanguage, unReadMessages: this.props.unReadMessages, onSelectedMessageChanged: this.props.onSelectedMessageChanged}))));
    };
    /**
     * Handles the click event for expand or collapse
     * @param evnt
     */
    MessagesForQig.prototype.onClick = function (evnt) {
        this.props.onExpandOrCollapse(this.props.qigId, !this.props.isOpen);
    };
    return MessagesForQig;
}(pureRenderComponent));
module.exports = MessagesForQig;
//# sourceMappingURL=messagesforqig.js.map
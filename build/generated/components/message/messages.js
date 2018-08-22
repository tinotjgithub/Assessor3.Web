"use strict";
var React = require('react');
var MessageSummary = require('./messagesummary');
var messages = function (props) {
    var toRender = props.messages.map(function (message) {
        var msgIndex = props.messages.indexOf(message) + 1;
        return (React.createElement(MessageSummary, {message: message, selectedMsgId: props.selectedMsgId, id: 'msg-' + msgIndex + '-' + props.id, key: 'msg-' + msgIndex + '-' + props.id, selectedLanguage: props.selectedLanguage, unReadMessages: props.unReadMessages, onSelectedMessageChanged: props.onSelectedMessageChanged}));
    });
    return (React.createElement("ul", {className: 'msg-listing'}, toRender));
};
module.exports = messages;
//# sourceMappingURL=messages.js.map
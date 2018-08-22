"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Send Message Link and its click event.
 * @param props
 */
var sendMessageLink = function (props) {
    return (React.createElement("div", {className: 'send-message-holder small-text', id: 'sendMessage'}, React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance.TranslateText('marking.worklist.left-panel.send-message'), className: 'dark-link', onClick: function () { props.onClick(); }}, React.createElement("span", {className: 'sprite-icon message-small-icon'}), React.createElement("span", {id: 'supervisor_message', className: 'padding-left-5'}, localeStore.instance.TranslateText('marking.worklist.left-panel.send-message')))));
};
module.exports = sendMessageLink;
//# sourceMappingURL=sendmessagelink.js.map
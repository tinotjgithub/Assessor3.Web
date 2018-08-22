"use strict";
var React = require('react');
var NotificationCount = require('./notificationcount');
var localeStore = require('../../stores/locale/localestore');
var messageQIGHeader = function (props) {
    return (React.createElement("a", {href: 'javascript:void(0)', className: 'msg-group-head', onClick: function () { props.headerClick(); }, title: localeStore.instance.TranslateText('messaging.message-lists.message-summaries.qig-group-tooltip')}, React.createElement("span", {className: 'sprite-icon menu-arrow-icon', id: 'icon-' + props.id}), React.createElement("span", {className: 'msg-group-head-name', id: 'qig-header-text-' + props.id}, props.qigName, React.createElement(NotificationCount, {unReadMessageCount: props.unReadMessages, id: 'qig-header-' + props.id, key: 'qig-header-' + props.id}))));
};
module.exports = messageQIGHeader;
//# sourceMappingURL=messageqigheader.js.map
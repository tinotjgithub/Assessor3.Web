"use strict";
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var NotificationCount = require('./notificationcount');
var classNames = require('classnames');
var enums = require('../utility/enums');
var messageTabItem = function (props) {
    var folderType = enums.getEnumString(enums.MessageFolderType, props.messageFolderType).toLowerCase();
    /**
     * Handles the change event of the option button.
     * @param event
     */
    var handleTabClick = function (event) {
        props.onTabSelected(props.messageFolderType);
    };
    return (React.createElement("li", {role: 'tab', "aria-selected": props.isSelected, id: folderType + '-msg-tab', className: classNames(folderType + '-msg-tab', { 'active': props.isSelected })}, React.createElement("a", {id: folderType + '-tab', href: 'javascript: void(0);', "data-tab-nav": 'msgTab1', "aria-controls": 'msgTab1', onClick: handleTabClick}, React.createElement("span", {id: folderType + '-text'}, localeStore.instance.TranslateText('messaging.message-lists.top-panel.' + folderType + '-tab')), React.createElement(NotificationCount, {unReadMessageCount: props.unReadMessageCount, id: folderType + '-tab', key: folderType + '-tab'}))));
};
module.exports = messageTabItem;
//# sourceMappingURL=messagetabitem.js.map
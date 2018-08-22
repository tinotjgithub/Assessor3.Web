"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
/**
 * RecipientListToggle contain the collpase or expan view with remaining count.
 * @param props
 */
var recipientListToggle = function (props) {
    if (props.remainingRecipientCount > 0) {
        return (React.createElement("a", {className: 'msg-to-expand-toggler', id: props.id, onClick: function () { props.onRecipientListToggleClick(); }}, React.createElement("span", {className: 'sender-count dim-text'}, "+", props.remainingRecipientCount, " ", localeStore.instance.TranslateText('messaging.message-lists.message-detail.more-recipients')), React.createElement("span", {className: 'expand-toggle-icon'}, React.createElement("span", {className: 'sprite-icon menu-arrow-icon'}), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'}))));
    }
    else {
        return null;
    }
};
module.exports = recipientListToggle;
//# sourceMappingURL=recipientlisttoggle.js.map
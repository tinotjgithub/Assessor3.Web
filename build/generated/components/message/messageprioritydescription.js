"use strict";
var React = require('react');
var enums = require('../utility/enums');
var localestore = require('../../stores/locale/localestore');
/**
 * Priority Description for details
 * @param props
 */
var messagePriorityDescription = function (props) {
    var messagePriorityName = props.messagePriorityName.toLowerCase();
    if (messagePriorityName !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard).toLocaleLowerCase()) {
        return (React.createElement("div", {className: 'msg-alert grey msg-important', id: props.id}, localestore.instance.TranslateText('messaging.message-lists.message-detail.high-' + messagePriorityName + '-banner')));
    }
    else {
        return null;
    }
};
module.exports = messagePriorityDescription;
//# sourceMappingURL=messageprioritydescription.js.map
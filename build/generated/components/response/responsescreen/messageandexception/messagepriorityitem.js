"use strict";
var React = require('react');
var enums = require('../../../utility/enums');
var classNames = require('classnames');
/**
 * Priority Indicator for Message
 * @param props
 */
var messagePriorityItem = function (props) {
    if (props.priority !== enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Standard)) {
        return (React.createElement("div", {className: 'msg-importance'}, React.createElement("span", {className: classNames('sprite-icon black', {
            'exclamtion-icon-red': props.priority === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Important)
        }, {
            'star-icon-red': props.priority === enums.getEnumString(enums.MessagePriority, enums.MessagePriority.Mandatory)
        })})));
    }
    else {
        return null;
    }
};
module.exports = messagePriorityItem;
//# sourceMappingURL=messagepriorityitem.js.map
"use strict";
var React = require('react');
var MessagePriorityItem = require('./messagepriorityitem');
/**
 * Message Priority Section holds the priority Indicator
 * @param props
 */
var messagePrioritySection = function (props) {
    return (React.createElement("div", {id: props.itemId + '-item-icon', className: 'msg-meta-icons'}, React.createElement(MessagePriorityItem, {priority: props.priority})));
};
module.exports = messagePrioritySection;
//# sourceMappingURL=messageprioritysection.js.map
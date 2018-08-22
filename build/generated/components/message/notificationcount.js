"use strict";
var React = require('react');
/**
 * This is the count displays in red round in the Inbox Tab header and against QIG Name
 * @param props
 */
var messageTab = function (props) {
    if (props.unReadMessageCount > 0) {
        return (React.createElement("span", {className: 'notification-count notification circle', id: 'unread-' + props.id}, props.unReadMessageCount));
    }
    else {
        return null;
    }
};
module.exports = messageTab;
//# sourceMappingURL=notificationcount.js.map
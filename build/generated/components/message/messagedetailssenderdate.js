"use strict";
var React = require('react');
var messageHelper = require('../utility/message/messagehelper');
/**
 * Message Details Send Date section which contains date and time of send message.
 * @param props
 */
var messageDetailsSenderDate = function (props) {
    // Get the date format
    var displayDate = messageHelper.getDateToDisplay(props.displayDate);
    return (React.createElement("div", {className: 'col-6-of-12 msg-sender-info'}, React.createElement("div", {className: 'msg-time small-text dim-text', id: props.id + '-date'}, displayDate)));
};
module.exports = messageDetailsSenderDate;
//# sourceMappingURL=messagedetailssenderdate.js.map
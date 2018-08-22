"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * changeExaminerStateButton contain the examiner state change button and its click event.
 * @param props
 */
var examinerStateChangeButton = function (props) {
    return (React.createElement("div", {className: 'status-btn-holder padding-top-10 text-center'}, React.createElement("button", {className: 'primary rounded change-sts-btn popup-nav', id: 'examinerstatechangebutton', "data-popup": 'changeStatus', "aria-haspopup": 'true', onClick: function () { props.showExaminerStateChangePopup(); }, disabled: props.isDisabled}, localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.change-status-button'))));
};
module.exports = examinerStateChangeButton;
//# sourceMappingURL=examinerstatechangebutton.js.map
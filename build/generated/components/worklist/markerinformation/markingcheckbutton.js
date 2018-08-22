"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * examinerMarkingCheckButton contain the examiner's marking check button to raise marking checks.
 * @param props
 */
var markingCheckButton = function (props) {
    return (React.createElement("div", {className: 'status-btn-holder padding-top-10 text-center', id: props.id + '_wrapper'}, React.createElement("button", {className: 'primary rounded req-marking-check', id: 'marking_check_button_id', key: props.id + '_key', onClick: function () { props.onMarkingCheckButtonClick(); }, disabled: props.disable}, localeStore.instance.TranslateText('marking.worklist.left-panel.request-marking-check-button'))));
};
module.exports = markingCheckButton;
//# sourceMappingURL=markingcheckbutton.js.map
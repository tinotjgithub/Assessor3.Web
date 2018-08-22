"use strict";
/*
  React component for Classify response header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var classifyResponse = function (props) {
    var className = 'primary rounded popup-nav wl-classfy-btn button';
    if (props.isDisabled) {
        className = className + ' disabled';
    }
    var onClickHandler = function (event) {
        if (props.onClickAction) {
            props.onClickAction(props.esMarkGroupId);
        }
    };
    var result = React.createElement("button", {id: 'classifyResponse_' + props.id, key: 'classifyResponse_key_' + props.id, disabled: props.isDisabled ? true : false, title: '', className: className, onClick: onClickHandler}, localeStore.instance.TranslateText(props.buttonTextResourceKey));
    return result;
};
module.exports = classifyResponse;
//# sourceMappingURL=classifyresponse.js.map
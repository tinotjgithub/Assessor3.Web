"use strict";
var classNames = require('classnames');
/*
    React component for generic text column in list view
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:variable-name */
var SupportExaminerTextColumn = function (props) {
    return (React.createElement("span", {id: props.id, className: classNames({ 'small-text': props.classText })}, props.textValue));
};
module.exports = SupportExaminerTextColumn;
//# sourceMappingURL=supportexaminertextcolumn.js.map
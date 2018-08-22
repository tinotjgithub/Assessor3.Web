"use strict";
var React = require('react');
var classNames = require('classnames');
/**
 * Stateless MaxButton component
 * @param props
 */
/* tslint:disable:variable-name */
var MaxButton = function (props) {
    return (React.createElement("a", {onClick: function (e) { props.onClick(e); }, href: '#', className: classNames('mark-entry', { 'hide': !props.isVisible })}, React.createElement("span", {className: 'max-txt'}, "Max"), React.createElement("span", {className: 'number-of-entry'}, props.mark.displayMark)));
};
module.exports = MaxButton;
//# sourceMappingURL=maxbutton.js.map
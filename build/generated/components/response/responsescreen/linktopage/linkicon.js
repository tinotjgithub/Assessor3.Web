"use strict";
var React = require('react');
/**
 * Stateless link icon component
 */
/* tslint:disable:variable-name */
var LinkIcon = function (props) {
    return (React.createElement("span", {className: 'question-link', id: props.id, title: props.toolTip}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 24 10', className: 'link-icon'}, React.createElement("use", {xlinkHref: '#link-icon'})))));
};
module.exports = LinkIcon;
//# sourceMappingURL=linkicon.js.map
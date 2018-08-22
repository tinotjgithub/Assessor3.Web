"use strict";
var React = require('react');
/**
 * exception action button contain exception action such as Escalate, Resolve, Close.
 * @param props
 */
var exceptionActionButton = function (props) {
    return (React.createElement("a", {className: 'exception-close-link', id: props.id, onClick: function () { props.onActionException(); }}, React.createElement("span", {className: props.className}), React.createElement("span", {className: 'exception-close-text dim-text'}, props.content)));
};
module.exports = exceptionActionButton;
//# sourceMappingURL=exceptionactionbutton.js.map
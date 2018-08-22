"use strict";
/*
    React component for marks column in marks by question view.
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:variable-name */
var MarksColumn = function (props) {
    var className = (props.usedInTotal || props.textValue === '-') ?
        'dim-text txt-val small-text' : 'small-text strike-out dim-text';
    return (React.createElement("span", {id: 'gen_' + props.id, className: className}, props.textValue));
};
module.exports = MarksColumn;
//# sourceMappingURL=markscolumn.js.map
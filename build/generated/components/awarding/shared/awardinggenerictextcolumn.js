"use strict";
/*
    React component for generic text column in list view
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:variable-name */
var AwardingGenericTextColumn = function (props) {
    return (React.createElement("span", {id: 'gen_' + props.id, className: 'dim-text txt-val small-text', title: (props.title) ? props.title : ''}, props.textValue));
};
module.exports = AwardingGenericTextColumn;
//# sourceMappingURL=awardinggenerictextcolumn.js.map
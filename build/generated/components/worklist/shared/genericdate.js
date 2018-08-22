"use strict";
/*
    React component for generic date.
*/
var React = require('react');
var localeHelper = require('../../../utility/locale/localehelper');
/**
 * Stateless component for generic date.
 * @param props
 */
var genericDate = function (props) {
    var dateValue = props.displayText ? props.displayText : localeHelper.toLocaleDateTimeString(props.dateValue);
    return (React.createElement("span", {id: props.id, className: props.className}, dateValue));
};
module.exports = genericDate;
//# sourceMappingURL=genericdate.js.map
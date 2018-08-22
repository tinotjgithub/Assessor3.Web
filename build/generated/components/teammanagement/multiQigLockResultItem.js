"use strict";
var React = require('react');
var classNames = require('classnames');
/**
 * React wrapper component for multi qig lock result item
 */
var multiQigLockResultItem = function (props) {
    return (React.createElement("div", {className: props.className + ' padding-left-10'}, React.createElement("span", {className: 'text-middle', id: props.id}, props.multiQigLockResult.qigName)));
};
module.exports = multiQigLockResultItem;
//# sourceMappingURL=multiqiglockresultitem.js.map
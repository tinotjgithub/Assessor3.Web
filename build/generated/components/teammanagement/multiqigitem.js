"use strict";
var React = require('react');
var classNames = require('classnames');
/**
 * React wrapper component for multi qig item
 */
var multiQigItem = function (props) {
    return (React.createElement("tr", {className: 'row', id: 'multiQigItem_' + props.id, onClick: function () { props.onQigSelected(props.multiQigData); }}, React.createElement("td", null, React.createElement("div", {className: 'item'}, props.multiQigData.qigName)), React.createElement("td", null, React.createElement("div", {className: 'item'}, props.multiQigData.examinerLockCount)), React.createElement("td", null, React.createElement("div", {className: 'item'}, props.multiQigData.examinerStuckCount))));
};
module.exports = multiQigItem;
//# sourceMappingURL=multiqigitem.js.map
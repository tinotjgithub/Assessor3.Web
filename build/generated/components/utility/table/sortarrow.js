"use strict";
var React = require('react');
var enums = require('../enums');
/* tslint:disable:variable-name */
var SortArrow = function (props) {
    switch (props.sortOption) {
        case enums.SortOption.Up:
            return (React.createElement("span", {className: 'sort-arrow'}, React.createElement("span", {className: 'sort-arrow-up'})));
        case enums.SortOption.Down:
            return (React.createElement("span", {className: 'sort-arrow'}, React.createElement("span", {className: 'sort-arrow-down'})));
        default:
            return (React.createElement("span", {className: 'sort-arrow'}, React.createElement("span", {className: 'sort-arrow-up'}), React.createElement("span", {className: 'sort-arrow-down'})));
    }
};
module.exports = SortArrow;
//# sourceMappingURL=sortarrow.js.map
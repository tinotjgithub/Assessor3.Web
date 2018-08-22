"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/**
 * Stateless mark component
 * @param props
 */
/* tslint:disable:variable-name */
var Mark = function (props) {
    var title = '';
    if (props.usedInTotal === false && props.isNonNumeric !== true && props.mark !== '-') {
        title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.optionality-tooltip');
    }
    return (React.createElement("span", {className: classNames('mark-version', { 'highlight': props.showMarksChangedIndicator }), title: title}, React.createElement("span", {className: 'mark'}, React.createElement("span", {className: classNames({ 'strike-out': (props.usedInTotal === false && props.isNonNumeric !== true) })}, props.mark))));
};
module.exports = Mark;
//# sourceMappingURL=mark.js.map
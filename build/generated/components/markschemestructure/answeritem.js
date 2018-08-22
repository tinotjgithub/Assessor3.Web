"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var constants = require('../utility/constants');
var MarkSchemeBase = require('./markschemebase');
var AnswerItem = (function (_super) {
    __extends(AnswerItem, _super);
    /**
     * Constructor answer item
     * @param props
     * @param state
     */
    function AnswerItem(props, state) {
        _super.call(this, props, state);
        this.title = this.props.node.name;
        this.onAnswerItemClicked = this.onAnswerItemClicked.bind(this);
    }
    /**
     * Render component
     */
    AnswerItem.prototype.render = function () {
        var usedInTotalClass = this.getClassForNotUsedInTotal(this.props.node.totalMarks);
        var classname = 'question-item';
        classname = classname + this.getClassForMarkedCluster();
        var maxMark = '';
        var totalMark = '';
        if (this.isMarkVisible() === true) {
            totalMark = this.isTotalMarkVisible() === true ? (this.props.node.totalMarks ? this.props.node.totalMarks : '0') : '';
            maxMark = (this.props.node.maximumNumericMark) ? this.props.node.maximumNumericMark.toString() : '0';
            /* if the total mark is NR for an answer item, translate the same when showing it in the UI */
            if (totalMark === constants.NOT_ATTEMPTED) {
                totalMark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
        }
        return (React.createElement("a", {href: 'javascript:void(0)', className: classname, onClick: this.onAnswerItemClicked, tabIndex: -1}, React.createElement("span", {className: 'question-text', title: this.title}, React.createElement("span", {className: usedInTotalClass}, this.props.node.name)), this.renderLinkIndicator(), this.props.node.isUnZonedItem ? this.renderUnzonedIndicator() : null, React.createElement("span", {className: 'question-mark'}, React.createElement("span", {className: 'mark-version cur' + usedInTotalClass}, React.createElement("span", {className: 'mark'}, totalMark), React.createElement("span", null, (this.isMarkVisible() === true) ? '/' : ''), React.createElement("span", {className: 'mark-total'}, maxMark)), this.renderPreviousMarks())));
    };
    /**
     * Notfiy the click and select the fist markable item
     */
    AnswerItem.prototype.onAnswerItemClicked = function () {
        this.props.navigateToMarkScheme(this.props.node);
    };
    return AnswerItem;
}(MarkSchemeBase));
module.exports = AnswerItem;
//# sourceMappingURL=answeritem.js.map
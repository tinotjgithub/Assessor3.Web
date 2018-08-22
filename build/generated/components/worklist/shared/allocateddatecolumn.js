"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var SLAOAnnotationIndicator = require('./slaoannotationindicator');
var AllPAgeAnnotationIndicator = require('./allpageannotationindicator');
var AllocatedDateComponent = require('./worklistdate');
var GracePeriodTime = require('./graceperiodtime');
var enums = require('../../utility/enums');
var classNames = require('classnames');
/**
 * React component class for the grid column allocated date
 */
var AllocatedDateColumn = (function (_super) {
    __extends(AllocatedDateColumn, _super);
    /**
     * Constructor for Allocated Date
     * @param props
     * @param state
     */
    function AllocatedDateColumn(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    AllocatedDateColumn.prototype.render = function () {
        var isMarkingCompleted = (this.props.markingProgress === 100) ? true : false;
        var allocatedDate = this.props.showAllocatedDate ? (React.createElement(AllocatedDateComponent, {id: this.props.id, key: 'alcDate_' + this.props.id, selectedLanguage: this.props.selectedLanguage, dateType: enums.WorkListDateType.allocatedDate, dateValue: this.props.dateValue, renderedOn: this.props.renderedOn})) : null;
        /**
         * component to display the time to end of grace period - visible based on condition
         */
        var gracePeriodTime = this.props.showTimeToEndofGracePeriod ?
            (React.createElement(GracePeriodTime, {id: this.props.id, key: 'graceDate_' + this.props.id, selectedLanguage: this.props.selectedLanguage, timeToEndOfGracePeriod: this.props.timeToEndOfGracePeriod, isTileView: this.props.isTileView})) : null;
        return (React.createElement("div", {className: classNames('col', { 'wl-grace-period': this.props.showTimeToEndofGracePeriod ? true : false }, { 'wl-allocated-date': this.props.showAllocatedDate ? true : false })}, React.createElement("div", {className: 'col-inner'}, React.createElement(SLAOAnnotationIndicator, {selectedLanguage: this.props.selectedLanguage, isResponseHasSLAO: this.props.isResponseHasSLAO, key: 'slao_' + this.props.id, id: this.props.id, isAllAnnotated: this.props.isAllAnnotated, isMarkingCompleted: isMarkingCompleted, isTileView: this.props.isTileView, markSchemeGroupId: this.props.markSchemeGroupId}), React.createElement(AllPAgeAnnotationIndicator, {selectedLanguage: this.props.selectedLanguage, isAllAnnotated: this.props.isAllAnnotated, key: 'apa_' + this.props.id, id: this.props.id, isMarkingCompleted: isMarkingCompleted, isTileView: this.props.isTileView, markSchemeGroupId: this.props.markSchemeGroupId}), allocatedDate, gracePeriodTime)));
    };
    return AllocatedDateColumn;
}(pureRenderComponent));
module.exports = AllocatedDateColumn;
//# sourceMappingURL=allocateddatecolumn.js.map
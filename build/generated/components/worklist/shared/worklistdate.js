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
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var GenericDate = require('./genericdate');
/**
 * React component class for submit button
 */
var WorkListDate = (function (_super) {
    __extends(WorkListDate, _super);
    /**
     * Constructor for worklistdate
     * @param props
     * @param state
     */
    function WorkListDate(props, state) {
        _super.call(this, props, state);
        this.dateText = '';
        this.dateValue = '';
        this.elementId = '';
        this.elementKey = '';
    }
    /**
     * Render component
     * @returns
     */
    WorkListDate.prototype.render = function () {
        var cName;
        this.elementId = 'dtup_' + this.props.id;
        this.elementKey = 'dtup_key_' + this.props.id;
        if (!this.props.dateValue) {
            this.dateValue = localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started');
            return (React.createElement("p", {className: 'resp-mark small-text'}, React.createElement(GenericDate, {id: 'dtup_' + this.props.id, key: 'dtup_key_' + this.props.id, className: 'dim-text txt-val', displayText: localeStore.instance.TranslateText('marking.worklist.response-data.marking-not-started')})));
        }
        else if (this.props.dateType === enums.WorkListDateType.allocatedDate) {
            this.dateText = localeStore.instance.TranslateText('marking.worklist.tile-view-labels.allocated');
            this.elementId = 'dtalloc_' + this.props.id;
            this.elementKey = 'dtalloc_key_' + this.props.id;
            return (React.createElement("div", {className: 'resp-allocated-date small-text'}, React.createElement(GenericDate, {dateValue: this.props.dateValue, id: this.elementId, key: this.elementId, className: 'dim-text txt-val small-text'})));
        }
        else if (this.props.dateType === enums.WorkListDateType.submittedDate) {
            this.dateText = localeStore.instance.TranslateText('marking.worklist.tile-view-labels.submitted');
            this.elementId = 'dtsubmit_' + this.props.id;
            this.elementKey = 'dtsubmit_key_' + this.props.id;
            return ((React.createElement("div", {className: 'resp-allocated-date small-text'}, React.createElement("span", {className: 'ex-dim-text txt-label'}, this.dateText, ": "), React.createElement(GenericDate, {dateValue: this.props.dateValue, id: this.elementId, key: this.elementId, className: 'dim-text txt-val'}))));
        }
        return null;
    };
    return WorkListDate;
}(pureRenderComponent));
module.exports = WorkListDate;
//# sourceMappingURL=worklistdate.js.map
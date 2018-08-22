"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var Immutable = require('immutable');
var QigGroup = require('./qiggroup');
var qigSelectorValidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
var AggregatedQig = require('./aggregatedqig');
/**
 * Class for the visual Group.
 */
var VisualQigGroup = (function (_super) {
    __extends(VisualQigGroup, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function VisualQigGroup(props, state) {
        _super.call(this, props, state);
        // Allocate memory for the Helper class
        this.qigSelectorValidationHelper = new qigSelectorValidationHelper();
    }
    /**
     * Render method for Component Group.
     */
    VisualQigGroup.prototype.render = function () {
        var qigs = Immutable.List(this.props.qigs);
        var firstQig = qigs.first();
        var hasAggregatedQigTargets = firstQig.isAggregateQIGTargetsON;
        // Qig groups.
        var qigGroupToRender = null;
        // get the Validation Results
        var qigValidationResults = this.qigSelectorValidationHelper.getValidationResults(qigs);
        if (hasAggregatedQigTargets) {
            // get the aggregated qig validation results.
            var aggregatedQigValidationResult_1 = this.qigSelectorValidationHelper.getAggregatedQigValidationResult(qigs);
            qigGroupToRender = React.createElement(AggregatedQig, {id: 'aggregatedQig', key: 'key_aggregatedQig', selectedLanguage: this.props.selectedLanguage, qigs: qigs, normalQigvalidationResults: qigValidationResults, aggregatedQigvalidationResult: aggregatedQigValidationResult_1, containerPage: this.props.containerPage});
        }
        else {
            qigGroupToRender = React.createElement("div", {className: 'menu-item-content qig-menu-content'}, React.createElement(QigGroup, {qigs: qigs, validationResults: qigValidationResults, selectedLanguage: this.props.selectedLanguage, containerPage: this.props.containerPage, id: 'component_' + firstQig.markSchemeGroupId, key: 'componentGroup_' + firstQig.markSchemeGroupId}));
        }
        return (React.createElement("div", {key: 'componentGroup_' + firstQig.markSchemeGroupId, className: 'header-menu-item qig-group-holder'}, React.createElement("div", {className: 'menu-item-title qig-group-title padding-bottom-10 clearfix'}, React.createElement("div", {className: 'qig-component shift-left'}, React.createElement("h6", {className: 'bolder', id: 'componentName_' + firstQig.markSchemeGroupId}, this.getComponentNameFormat(hasAggregatedQigTargets, firstQig))), React.createElement("div", {className: 'qig-session shift-right'}, React.createElement("h6", {id: 'sessionName_' + firstQig.markSchemeGroupId}, firstQig.sessionName))), qigGroupToRender));
    };
    /**
     * Component Name Format for the Group Header.
     * @param hasAggregatedQigTargets
     * @param qig
     */
    VisualQigGroup.prototype.getComponentNameFormat = function (hasAggregatedQigTargets, qig) {
        if (hasAggregatedQigTargets) {
            return qig.assessmentCode + ' - ' + qig.markSchemeGroupName;
        }
        else {
            return qig.assessmentCode + '/' + qig.componentId;
        }
    };
    return VisualQigGroup;
}(pureRenderComponent));
module.exports = VisualQigGroup;
//# sourceMappingURL=visualqiggroup.js.map
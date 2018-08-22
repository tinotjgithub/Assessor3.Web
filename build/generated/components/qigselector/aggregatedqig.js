"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var QigGroup = require('./qiggroup');
var LinearProgressIndicator = require('../utility/progressindicator/linearprogressindicator');
var RemarkIndicator = require('./remarkindicator');
var QigVersionsLink = require('./qigversionslink');
var ResponseAvailabilityIndicator = require('./responseavailabilityindicator');
var TargetProgressCountIndicator = require('./targetprogresscountindicator');
var classNames = require('classnames');
var QIG_MAX_HEIGHT = 125;
/**
 * Component for showing the aggregated Qig .
 */
var AggregatedQig = (function (_super) {
    __extends(AggregatedQig, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function AggregatedQig(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * On clicking qig versions link.
         */
        this.onQigVersionLinkClick = function () {
            _this.setState({
                isOpen: !_this.state.isOpen
            });
        };
        this.state = {
            isOpen: true
        };
        this.onQigVersionLinkClick = this.onQigVersionLinkClick.bind(this);
    }
    /**
     * Render method.
     */
    AggregatedQig.prototype.render = function () {
        var classNameToUse = classNames('menu-item-content qig-menu-content panel', this.state.isOpen ? 'open' : 'close');
        var style = {
            maxHeight: QIG_MAX_HEIGHT * this.props.normalQigvalidationResults.length + 'px'
        };
        var firstQig = this.props.qigs.get(0);
        return (React.createElement("div", {className: classNameToUse}, React.createElement("div", {className: 'qig-wrapper', id: this.props.id}, React.createElement("div", {className: 'qig-col12 qig-col vertical-middle'}, React.createElement("div", {className: 'middle-content'}, this.renderMarkingStatusContent(), React.createElement(LinearProgressIndicator, {id: this.props.id + 'ProgressIndicator', key: this.props.id + 'progressIndicator', qigValidationResult: this.props.aggregatedQigvalidationResult, isAggregatedTarget: true}), React.createElement(RemarkIndicator, {id: this.props.id + 'Remarkindicator', key: this.props.id + 'Remarkindicator', selectedLanguage: this.props.selectedLanguage, qigValidationResult: this.props.aggregatedQigvalidationResult}))), React.createElement(QigVersionsLink, {id: 'qigVersionsLink', key: 'key_qigVersionsLink', onQigVersionLinkClick: this.onQigVersionLinkClick})), React.createElement("div", {className: 'panel-content', "aria-hidden": true, style: style}, React.createElement(QigGroup, {qigs: this.props.qigs, validationResults: this.props.normalQigvalidationResults, selectedLanguage: this.props.selectedLanguage, containerPage: this.props.containerPage, id: 'component_' + firstQig.markSchemeGroupId, key: 'componentGroup_' + firstQig.markSchemeGroupId}))));
    };
    /**
     * Renders the marking status content.`
     */
    AggregatedQig.prototype.renderMarkingStatusContent = function () {
        return (React.createElement("div", {className: 'middle-content-inner'}, React.createElement("div", {className: 'progress-title middle-content-left'}, React.createElement("span", {className: 'progress-title-text'}, this.props.aggregatedQigvalidationResult.statusText), React.createElement(ResponseAvailabilityIndicator, {id: this.props.id + '_responseAvailabilityIndicatorID', key: this.props.id + '_responseAvailabilityIndicatorKey', qigValidationResult: this.props.aggregatedQigvalidationResult})), React.createElement(TargetProgressCountIndicator, {id: this.props.id + '_targetProgressCountIndicatorID', key: this.props.id + '_targetProgressCountIndicatorKey', selectedLanguage: this.props.selectedLanguage, qigValidationResult: this.props.aggregatedQigvalidationResult, isAggregatedTarget: true})));
    };
    return AggregatedQig;
}(pureRenderComponent));
module.exports = AggregatedQig;
//# sourceMappingURL=aggregatedqig.js.map
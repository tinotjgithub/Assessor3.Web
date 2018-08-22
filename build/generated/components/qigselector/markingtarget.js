"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var LinearProgressIndicator = require('../utility/progressindicator/linearprogressindicator');
var ResponseAvailabilityIndicator = require('./responseavailabilityindicator');
var TargetProgressCountIndicator = require('./targetprogresscountindicator');
var RemarkIndicator = require('./remarkindicator');
var localeStore = require('../../stores/locale/localestore');
var StandardisationSetupButton = require('../standardisationsetup/standardisationsetupbutton');
var StandardisationSetupLink = require('../standardisationsetup/standardisationsetuplink');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var navigationHelper = require('../utility/navigation/navigationhelper');
var qigStore = require('../../stores/qigselector/qigstore');
/**
 * Class for the Marking Target Section.
 */
var MarkingTarget = (function (_super) {
    __extends(MarkingTarget, _super);
    /**
     * @constructor
     */
    function MarkingTarget(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * On standardisation setup button click.
         */
        this.navigateToStandardisationSetupPageOnClick = function () {
            // set the marker operation mode as StandardisationSetup
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.StandardisationSetup);
            // Invoke the action creator to Open the QIG
            qigSelectorActionCreator.openQIG(_this.props.markSchemeGroupId);
            navigationHelper.loadStandardisationSetup();
        };
    }
    /**
     * Render method for Marking Target Section.
     */
    MarkingTarget.prototype.render = function () {
        return (React.createElement("div", {key: this.props.id + '_markingTarget', className: 'qig-col2 qig-col vertical-middle'}, React.createElement("div", {className: 'middle-content'}, this.renderMarkingStatusIndicators(), React.createElement(LinearProgressIndicator, {id: this.props.id + '_progressIndicator', key: this.props.id + '_progressIndicator', currentMarkingTarget: this.props.currentMarkingTarget, qigValidationResult: this.props.qigValidationResult, directedRemarkMarkingTargets: this.props.directedRemarkMarkingTargets, isAggregatedTarget: this.props.isAggregatedTarget}), React.createElement(RemarkIndicator, {id: this.props.id + '_remarkindicator', key: this.props.id + '_remarkindicator', selectedLanguage: this.props.selectedLanguage, qigValidationResult: this.props.qigValidationResult}), this.renderStandardisationSetupButton(), this.renderStandardisationSetupLink())));
    };
    Object.defineProperty(MarkingTarget.prototype, "getSimulationStatusTooltip", {
        /**
         * Get the tooltip status descriptionwhen mouse pointer positioned over simulation.
         */
        get: function () {
            if (this.props.qigValidationResult.isSimulationMode) {
                return localeStore.instance.TranslateText('home.qig-data.simulation-status-tooltip');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Display the open response count while in overallocation OR the target progress X / Y.
     */
    MarkingTarget.prototype.renderTargetProgressCountOrOverAllocationOpenResponseCount = function () {
        // Display the open response count if the marker is in over allocation 
        // this count is only shown with the open response indicator and
        // if the openresponsecount is > 0. 
        // openresponsecount will have value only when there is an over allocation.
        if (this.props.qigValidationResult.displayOpenResponseIndicator
            && this.props.qigValidationResult.openResponsesCount > 0) {
            return (React.createElement("div", {className: 'over-allocation-holder small-text grey-text'}, React.createElement("span", {className: 'open-text small-text', id: 'openResponseCountInOverAllocation'}, this.props.qigValidationResult.openResponsesCount +
                ' ' + localeStore.instance.TranslateText('home.qig-data.open-responses-in-over-allocation'))));
        }
        else {
            // Display target progress based on this.props.qigValidationResult.displayTarget (Work Item 1235)
            return (React.createElement(TargetProgressCountIndicator, {id: this.props.id + '_targetProgressCountIndicatorID', key: this.props.id + '_targetProgressCountIndicatorKey', selectedLanguage: this.props.selectedLanguage, currentMarkingTarget: this.props.currentMarkingTarget, qigValidationResult: this.props.qigValidationResult, directedRemarkMarkingTargets: this.props.directedRemarkMarkingTargets, isAggregatedTarget: false}));
        }
    };
    /**
     * Render marking status indicators
     */
    MarkingTarget.prototype.renderMarkingStatusIndicators = function () {
        var childClassName = 'progress-title middle-content-left ';
        if (!this.props.qigValidationResult.displayProgressBar) {
            childClassName += 'align-middle ';
        }
        // isInStatndardisationMode is set when ExaminerQIGStatus is in WaitingStandardisation.
        return this.props.isStandardisationSetupButtonVisible ? null :
            (React.createElement("div", {className: 'middle-content-inner'}, React.createElement("div", {id: this.props.id + '_currentMarkingMode', className: childClassName + this.props.qigValidationResult.statusColourClass}, React.createElement("span", {className: 'progress-title-text', title: this.getSimulationStatusTooltip}, this.props.qigValidationResult.statusText), React.createElement(ResponseAvailabilityIndicator, {id: this.props.id + '_responseAvailabilityIndicatorID', key: this.props.id + '_responseAvailabilityIndicatorKey', qigValidationResult: this.props.qigValidationResult})), this.renderTargetProgressCountOrOverAllocationOpenResponseCount()));
    };
    /**
     * Render standardisation setup button element.
     */
    MarkingTarget.prototype.renderStandardisationSetupButton = function () {
        return this.props.isStandardisationSetupButtonVisible ?
            (React.createElement(StandardisationSetupButton, {id: this.props.id + '_standardisationSetup', key: this.props.id + '_standardisationSetup', onStandardisationButtonClick: this.navigateToStandardisationSetupPageOnClick, isMarkedAsProvisional: qigStore.instance.isMarkedAsProvisional(this.props.markSchemeGroupId)})) : null;
    };
    /**
     * Render standardisation setup link element.
     */
    MarkingTarget.prototype.renderStandardisationSetupLink = function () {
        return this.props.isStandardisationSetupLinkVisible ?
            (React.createElement(StandardisationSetupLink, {id: this.props.id + '_standardisationSetupLink', key: this.props.id + '_standardisationSetupLink', onStandardisationLinkClick: this.navigateToStandardisationSetupPageOnClick, stdSetupPermission: qigStore.instance.getSSUPermissionsData(this.props.markSchemeGroupId).role.permissions})) : null;
    };
    return MarkingTarget;
}(pureRenderComponent));
module.exports = MarkingTarget;
//# sourceMappingURL=markingtarget.js.map
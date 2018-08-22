"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var QigName = require('./qigname');
var MarkingTarget = require('./markingtarget');
var Immutable = require('immutable');
var QigItemActionColumn = require('./qigitemactioncolumn');
var TargetDate = require('./targetdate');
var QigItem = (function (_super) {
    __extends(QigItem, _super);
    /**
     * @constructor
     */
    function QigItem(props, state) {
        _super.call(this, props, state);
        this._directedRemarkTargets = [];
    }
    /**
     * Render method for Qig item.
     */
    QigItem.prototype.render = function () {
        this.filterDirectedRemarks();
        return (React.createElement("div", {className: 'qig-wrapper', id: this.props.id, key: 'qigWrapper_' + this.props.id}, React.createElement("div", {className: 'qig-col1 qig-col vertical-middle'}, React.createElement("div", {className: 'middle-content'}, React.createElement(QigName, {id: this.props.id, key: this.props.id, qigname: this.qigName}), this.renderTargetDateComponent())), React.createElement(MarkingTarget, {id: this.props.id, key: 'qigsummary_' + this.props.id, selectedLanguage: this.props.selectedLanguage, currentMarkingTarget: this.props.qig.currentMarkingTarget, qigValidationResult: this.props.qigValidationResult, directedRemarkMarkingTargets: Immutable.List(this._directedRemarkTargets), markSchemeGroupId: this.props.qig.markSchemeGroupId, examinerRoleId: this.props.qig.examinerRoleId, isStandardisationSetupButtonVisible: this.isStandardisationSetupButtonVisible, isStandardisationSetupLinkVisible: this.isStandardisationSetupLinkVisible, questionPaperPartId: this.props.qig.questionPaperPartId, isAggregatedTarget: this.props.qig.groupId > 0}), React.createElement(QigItemActionColumn, {id: this.props.id, key: 'QigItemActionColumn_' + this.props.id, markSchemeGroupId: this.props.qig.markSchemeGroupId, examinerRoleId: this.props.qig.examinerRoleId, questionPaperPartId: this.props.qig.questionPaperPartId, isMarkingEnabled: this.props.qig.isMarkingEnabled, isTeamManagementEnabled: this.props.qig.isTeamManagementEnabled, containerPage: this.props.containerPage, isStandardisationSetupButtonVisible: this.isStandardisationSetupButtonVisible})));
    };
    /**
     * checks if marking targets contains any directed remarks
     */
    QigItem.prototype.filterDirectedRemarks = function () {
        var _this = this;
        this._directedRemarkTargets = [];
        if (this.props.qig.markingTargets != null) {
            this.props.qig.markingTargets.map(function (remark) {
                if (remark.isDirectedRemark === true) {
                    _this._directedRemarkTargets.push(remark);
                }
            });
        }
    };
    /**
     * Render the target Date section
     */
    QigItem.prototype.renderTargetDateComponent = function () {
        if (this.props.qig.currentMarkingTarget != null) {
            return (React.createElement(TargetDate, {id: this.props.id, key: this.props.id + '_TargetDateKey', selectedLanguage: this.props.selectedLanguage, displayTargetDate: this.props.qigValidationResult.displayTargetDate, markingCompletionDate: this.props.qig.currentMarkingTarget.markingCompletionDate}));
        }
    };
    Object.defineProperty(QigItem.prototype, "isStandardisationSetupButtonVisible", {
        /**
         * Returns whether standardisation setup button is visible or not.
         */
        get: function () {
            return (this.props.qig.isElectronicStandardisationTeamMember && this.props.qig.isStandardisationSetupAvaliable
                && (this.props.qig.centreScriptAvaliabityCount > 0 || this.props.qig.zonedScriptAvailabilityCount > 0)
                && (this.props.qigValidationResult.isInStandardisationMode || this.props.qigValidationResult.isSimulationMode));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigItem.prototype, "isStandardisationSetupLinkVisible", {
        /**
         * Returns whether standardisation setup link is visible or not.
         */
        get: function () {
            return (this.props.qig.isElectronicStandardisationTeamMember && this.props.qig.standardisationSetupComplete
                && this.props.qig.isestdEnabled && this.props.qig.isStandardisationSetupAvaliable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigItem.prototype, "qigName", {
        /**
         * Returns the qig name.
         */
        get: function () {
            if (this.props.qig.groupId > 0) {
                // That is if the qig has aggregated targets.
                return this.props.qig.componentId;
            }
            else {
                return this.props.qig.markSchemeGroupName;
            }
        },
        enumerable: true,
        configurable: true
    });
    return QigItem;
}(pureRenderComponent));
module.exports = QigItem;
//# sourceMappingURL=qigitem.js.map
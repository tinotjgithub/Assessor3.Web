"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var PureRenderComponent = require('../../base/purerendercomponent');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var MarksDifference = require('./marksdifference');
var AccuracyIndicator = require('./accuracyindicator');
var worklistStore = require('../../../stores/worklist/workliststore');
var enums = require('../../utility/enums');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var MarksDifferenceColumn = (function (_super) {
    __extends(MarksDifferenceColumn, _super);
    /**
     * Constructor for MarksDiffrenceColumn
     * @param props
     */
    function MarksDifferenceColumn(props) {
        _super.call(this, props, null);
        this.classNameAmd = 'amd small-text';
        this.classNameTmd = 'tmd small-text';
        this.titleAmd = markerOperationModeFactory.operationMode.absoluteMarkDifferenceTitle;
        this.titleTmd = markerOperationModeFactory.operationMode.totalMarkDifferenceTitle;
        this.marksDifferenceTextAmd = 'marking.worklist.tile-view-labels.amd';
        this.marksDifferenceTextTmd = 'marking.worklist.tile-view-labels.tmd';
        this.absoluteMarksDifference = 0;
        this.totalMarksDifference = 0;
    }
    /**
     * Render component
     * @returns
     */
    MarksDifferenceColumn.prototype.render = function () {
        var workListType = worklistStore.instance.currentWorklistType;
        var _isShowStandardisationDefinitiveMarks = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks, this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        this.absoluteMarksDifference = this.props.absoluteMarksDifference;
        this.totalMarksDifference = this.props.totalMarksDifference;
        var showAccuracyIndicator = true;
        var showAMDTMD = true;
        var className = 'col wl-tolerance';
        if (!this.props.isTileView) {
            showAccuracyIndicator = false;
            className = 'col wl-amdtmd';
            if (this.props.accuracyIndicator === enums.AccuracyIndicatorType.Accurate
                || this.props.accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR || this.props.accuracyIndicator === 0) {
                showAMDTMD = false;
            }
        }
        else {
            if (this.props.showAccuracyIndicator) {
                if (this.props.accuracyIndicator === enums.AccuracyIndicatorType.Accurate
                    || this.props.accuracyIndicator === enums.AccuracyIndicatorType.AccurateNR
                    || this.props.accuracyIndicator === 0) {
                    showAccuracyIndicator = true;
                    showAMDTMD = false;
                }
            }
            else {
                showAccuracyIndicator = false;
                showAMDTMD = false;
            }
        }
        // render only if AMD value is set
        var amdMarksDifference = showAMDTMD ? (React.createElement(MarksDifference, {id: this.props.id + '_amd', key: 'key_amd_' + this.props.id, className: this.classNameAmd, title: this.titleAmd, marksDifferenceText: this.marksDifferenceTextAmd, marksDifference: this.props.absoluteMarksDifference, selectedLanguage: this.props.selectedLanguage, marksDifferenceType: enums.MarksDifferenceType.AbsoluteMarksDifference, isTileView: this.props.isTileView})) : null;
        // render only if TMD value is set
        var tmdMarksDifference = showAMDTMD ? (React.createElement(MarksDifference, {id: this.props.id + '_tmd', key: 'key_tmd_' + this.props.id, className: this.classNameTmd, title: this.titleTmd, marksDifferenceText: this.marksDifferenceTextTmd, marksDifference: this.props.totalMarksDifference, selectedLanguage: this.props.selectedLanguage, marksDifferenceType: enums.MarksDifferenceType.TotalMarksDifference, isTileView: this.props.isTileView})) : null;
        var accuracy = showAccuracyIndicator ? (React.createElement(AccuracyIndicator, {id: this.props.id, key: this.props.id, accuracyIndicator: this.props.accuracyIndicator, isTileView: this.props.isTileView, selectedLanguage: this.props.selectedLanguage})) : null;
        // do not render if both flags are false.
        var markWithAccuracy = (showAccuracyIndicator || showAMDTMD) ? (React.createElement("div", {className: 'worklist-tile-footer'}, React.createElement("div", {className: className, id: this.props.id + '_marksDifference'}, React.createElement("div", {className: 'col-inner'}, accuracy, amdMarksDifference, tmdMarksDifference)))) : null;
        return (markWithAccuracy);
    };
    return MarksDifferenceColumn;
}(PureRenderComponent));
module.exports = MarksDifferenceColumn;
//# sourceMappingURL=marksdifferencecolumn.js.map
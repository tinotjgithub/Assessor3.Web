"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var classNames = require('classnames');
var constants = require('../utility/constants');
var enums = require('../utility/enums');
var marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
var responseStore = require('../../stores/response/responsestore');
var responseHelper = require('../utility/responsehelper/responsehelper');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var qigStore = require('../../stores/qigselector/qigstore');
/**
 * Total mark component.
 * @param {Props} props
 * @returns
 */
var MarkSchemeTotalMark = (function (_super) {
    __extends(MarkSchemeTotalMark, _super);
    /**
     * @constructor
     */
    function MarkSchemeTotalMark(props) {
        _super.call(this, props, null);
    }
    /**
     * Render method
     */
    MarkSchemeTotalMark.prototype.render = function () {
        if (this.props.isNonNumeric !== true) {
            var setComplexOptionalityCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ComplexOptionality, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            var totalMark = this.props.markingProgress !== 100 && setComplexOptionalityCC
                ? (React.createElement("span", {className: 'mark-version cur'}, React.createElement("span", {id: 'progressing-mark-id', className: 'progressing-mark', title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.total-marks-cbt')})))
                : (React.createElement("span", {className: 'mark-version cur'}, React.createElement("span", {className: 'marks-obtained'}, this.props.actualMark), React.createElement("span", {className: 'total-marks-slash'}, "/"), React.createElement("span", {className: 'max-marks'}, (this.props.maximumMark) ? this.props.maximumMark : 0)));
            return (React.createElement("div", {className: 'total-mark-holder'}, React.createElement("span", {className: 'total-marks-label'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.total-marks')), React.createElement("span", {className: 'total-marks'}, totalMark, this.renderPreviousMarksColumnTotals())));
        }
        else {
            return null;
        }
    };
    /**
     * Method to render previous marks column totals.
     */
    MarkSchemeTotalMark.prototype.renderPreviousMarksColumnTotals = function () {
        if (this.props.previousMarksColumnTotals != null) {
            var marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            var visiblityInfo_1 = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails, markingStore.instance.currentMarkGroupId);
            var counter_1 = 0;
            var that_1 = this;
            var previousMarkTotals = this.props.previousMarksColumnTotals.map(function (previousMark) {
                counter_1++;
                // render the mark only if the isMarkVisible is true
                if (visiblityInfo_1.get(counter_1).isMarkVisible === true && that_1.props.isNonNumeric !== true) {
                    return (React.createElement("span", {key: 'previous-marks-total-' + counter_1.toString(), className: classNames('mark-version', { 'highlight': that_1.doesTotalMarkDiffer(previousMark.mark.displayMark)
                            && !responseStore.instance.isWholeResponse })}, React.createElement("span", {className: 'marks-obtained'}, React.createElement("span", {className: classNames({ 'strike-out': (previousMark.usedInTotal === false && that_1.props.isNonNumeric === false) })}, !(responseStore.instance.isWholeResponse && responseHelper.isAtypicalResponse()) ?
                        previousMark.mark.displayMark : ''))));
                }
            });
            return previousMarkTotals;
        }
    };
    /**
     * returns whether the previous total mark differs from the current total mark
     * @param previousMark
     */
    MarkSchemeTotalMark.prototype.doesTotalMarkDiffer = function (previousMark) {
        if ((worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.live ||
            worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) &&
            this.props.markingProgress === 100) {
            var actualMark = this.props.actualMark === undefined ||
                this.props.actualMark == null ? constants.NOT_MARKED : this.props.actualMark.trim();
            var previousMarkValue = previousMark.trim();
            if (actualMark === constants.NOT_MARKED) {
                return false;
            }
            if (actualMark === constants.NOT_ATTEMPTED) {
                return actualMark !== previousMarkValue;
            }
            return parseFloat(actualMark) !== parseFloat(previousMarkValue);
        }
        return false;
    };
    return MarkSchemeTotalMark;
}(pureRenderComponent));
module.exports = MarkSchemeTotalMark;
//# sourceMappingURL=markschemetotalmark.js.map
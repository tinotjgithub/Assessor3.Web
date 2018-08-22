"use strict";
var enums = require('../enums');
var worklistStore = require('../../../stores/worklist/workliststore');
var markingStore = require('../../../stores/marking/markingstore');
var NR_MARK_STATUS = 'not attempted';
// Helper class for handling mark change reason
var MarkChangeReasonHelper = (function () {
    function MarkChangeReasonHelper() {
    }
    /**
     * get the status of current mark visibility
     * @param markSchemeId
     * @param allocatedMark
     */
    MarkChangeReasonHelper.isMarkChangeReasonVisible = function (markSchemeId, allocatedMark) {
        if (markSchemeId === void 0) { markSchemeId = undefined; }
        if (allocatedMark === void 0) { allocatedMark = undefined; }
        var isMarkChangeReasonVisible = false;
        this.isMarkDiffer = false;
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark &&
            worklistStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId, markingStore.instance.currentResponseMode)) {
            if (markingStore.instance.currentResponseMode !== enums.ResponseMode.closed) {
                MarkChangeReasonHelper.checkIfMarkDiffer(markSchemeId, allocatedMark);
                isMarkChangeReasonVisible = this.isMarkDiffer;
            }
            else if (markingStore.instance.currentResponseMode === enums.ResponseMode.closed) {
                var markChangeReason = worklistStore.instance.getMarkChangeReason(markingStore.instance.currentMarkGroupId, markingStore.instance.currentResponseMode);
                isMarkChangeReasonVisible = markChangeReason ? markChangeReason.length > 0 ? true : false : false;
            }
        }
        return isMarkChangeReasonVisible;
    };
    /**
     * Function to check if marks differ
     * @param markSchemeId
     * @param allocatedMark
     */
    MarkChangeReasonHelper.checkIfMarkDiffer = function (markSchemeId, allocatedMark) {
        if (markSchemeId === void 0) { markSchemeId = undefined; }
        if (allocatedMark === void 0) { allocatedMark = undefined; }
        var defaultMarks = MarkChangeReasonHelper.getDefaultMarks();
        var currentMarks = MarkChangeReasonHelper.getCurrentMarks();
        var i = 0;
        var _defaultMark = undefined;
        for (i = 0; i < defaultMarks.length; i++) {
            _defaultMark = defaultMarks[i];
            if (_defaultMark.markSchemeId === markSchemeId) {
                this.marksEqual(_defaultMark, allocatedMark);
            }
            else {
                var _curMarks = currentMarks.
                    filter(function (x) { return x.markSchemeId === _defaultMark.markSchemeId; })[0];
                if (_curMarks) {
                    if (_defaultMark.markStatus && _defaultMark.markStatus.toLowerCase() === NR_MARK_STATUS) {
                        if (_defaultMark.markStatus === _curMarks.markStatus &&
                            _defaultMark.numericMark === _curMarks.numericMark &&
                            _defaultMark.numericMark === 0) {
                            this.isMarkDiffer = false;
                        }
                        else {
                            this.isMarkDiffer = true;
                        }
                    }
                    else {
                        this.isMarkDiffer = _defaultMark.numericMark === _curMarks.numericMark ? false : true;
                    }
                }
            }
            if (this.isMarkDiffer) {
                return this.isMarkDiffer;
            }
        }
        return this.isMarkDiffer;
    };
    /**
     * Check current and default marks equal or not
     * @param markSchemeId
     * @param allocatedMark
     */
    MarkChangeReasonHelper.marksEqual = function (_examinerMark, currentMark) {
        if (_examinerMark.markStatus && _examinerMark.markStatus.toLowerCase() === NR_MARK_STATUS) {
            this.isMarkDiffer = currentMark === 'NR' ? false : true;
        }
        else {
            this.isMarkDiffer = _examinerMark.numericMark.toString() === currentMark ? false : true;
        }
        return this.isMarkDiffer;
    };
    /**
     * Getting default marks
     */
    MarkChangeReasonHelper.getDefaultMarks = function () {
        // Get Default Previous Marks single/whole response.
        return markingStore.instance.getDefaultPreviousMarks();
    };
    /**
     * Getting Current marks
     */
    MarkChangeReasonHelper.getCurrentMarks = function () {
        // Get Current Marks single/whole response.
        var examinerMarks = [];
        var allMarksAndAnnotations = markingStore.instance.allMarksAndAnnotationAgainstResponse(markingStore.instance.currentMarkGroupId);
        if (allMarksAndAnnotations) {
            allMarksAndAnnotations.forEach(function (x) {
                x.examinerMarksCollection.forEach(function (y) {
                    examinerMarks.push(y);
                });
            });
        }
        return examinerMarks;
    };
    return MarkChangeReasonHelper;
}());
module.exports = MarkChangeReasonHelper;
//# sourceMappingURL=markchangereasonhelper.js.map
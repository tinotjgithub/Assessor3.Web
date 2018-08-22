"use strict";
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var enums = require('../enums');
var responseStore = require('../../../stores/response/responsestore');
var markingStore = require('../../../stores/marking/markingstore');
var markerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
var NO_MARK = '-';
var NR_MARK_STATUS = 'not attempted';
var NOT_ATTEMPTED = 'NR';
/* Manage marks of mark schemes */
var MarksManagementHelper = (function () {
    function MarksManagementHelper() {
    }
    /**
     * Process mark when navigating away from mark schemes
     * @param mark
     * @param markSchemeId
     * @param markingProgress
     * @param totalMarkedMarkSchemes
     * @param totalMark
     * @param isAllNR
     * @param isMarkUpdatedWithoutNavigation
     * @param isNextResponse
     * @param usedInTotal
     * @param isAllPagesAnnotated
     * @param isUpdateUsedInTotalOnly
     * @param isUpdateMarkingProgress
     * @param callBack
     */
    MarksManagementHelper.prototype.processMark = function (mark, markSchemeId, markingProgress, totalMarkedMarkSchemes, totalMark, isAllNR, isMarkUpdatedWithoutNavigation, isNextResponse, usedInTotal, isAllPagesAnnotated, markSchemeGroupId, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, overallMarkingProgress, callBack) {
        if (isUpdateUsedInTotalOnly === void 0) { isUpdateUsedInTotalOnly = false; }
        if (isUpdateMarkingProgress === void 0) { isUpdateMarkingProgress = true; }
        var candidateScriptId = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId;
        // for whole response scenarios, get the corresponding markGroupId to save
        var markGroupId = markingStore.instance.getMarkGroupIdQIGtoRIGMap(markSchemeGroupId);
        var markDetails = {
            candidateScriptId: candidateScriptId,
            isAllNR: isAllNR,
            isDirty: true,
            mark: mark,
            markingOperation: enums.MarkingOperation.none,
            markingProgress: markingProgress,
            markSchemeId: markSchemeId,
            totalMark: totalMark,
            totalMarkedMarkSchemes: totalMarkedMarkSchemes,
            usedInTotal: usedInTotal,
            isAllPagesAnnotated: isAllPagesAnnotated,
            markGroupId: markGroupId,
            overallMarkingProgress: overallMarkingProgress
        };
        /* if the entered mark is '-', then it is a delete */
        if (mark.displayMark === NO_MARK) {
            markDetails.markingOperation = enums.MarkingOperation.deleted;
            markingActionCreator.saveMark(markDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress);
        }
        else {
            /* Get the original mark from the collection */
            var originalMark = this.getOriginalMark(markSchemeId);
            /* if there is an entry present in the original mark collection
            *  then it is going to be an update
            */
            if (originalMark) {
                /* if the original mark is already dirty, ie if its yet to be saved in the db
                 * no need to make the dirty flag to false otherwise
                 * if the entered mark and original mark are equal, make the dirty flag false
                 */
                if (originalMark.mark.displayMark === mark.displayMark && !originalMark.isDirty
                    && usedInTotal === originalMark.usedInTotal) {
                    markDetails.isDirty = false;
                }
                /* The markingOperation is set to updated even when the isDirty flag is set to false above.
                     Example Scenario:
                        1. Open a response, delete the mark associated to a particular question
                        2. The changes get updated in the markingStore
                        3. Reselect the previos question and revert back to the deleted mark
                        4. The markingStore should as well get reverted. This will happen only if the markingOperation is set as Updated.
                */
                markDetails.markingOperation = enums.MarkingOperation.updated;
                markingActionCreator.saveMark(markDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress);
                if (callBack) {
                    // Log the current saved mark details to the logger
                    callBack(isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails);
                }
            }
            else {
                markDetails.markingOperation = enums.MarkingOperation.added;
                /* if there is no entry in the original mark collection, the the entered mark is newly added */
                markingActionCreator.saveMark(markDetails, isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress);
                if (callBack) {
                    // Log the current saved mark details to the logger
                    callBack(isMarkUpdatedWithoutNavigation, isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress, markDetails);
                }
            }
        }
    };
    /**
     * This method will return the display mark for comparing.
     *
     * @private
     * @param {examinerMark} mark
     * @returns {string}
     * @memberof MarksManagementHelper
     */
    MarksManagementHelper.prototype.getOriginalMark = function (markSchemeId) {
        var displayMark = '';
        var displayMarkValue = '';
        var usedInTotal = false;
        var examinerMark = markingStore.instance.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[markingStore.instance.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].examinerMarksCollection.
            filter(function (x) { return x.markSchemeId === markSchemeId; });
        var originalMark;
        if (examinerMark && examinerMark.length > 0) {
            // always set from the mark collection if there are any marks
            usedInTotal = examinerMark[0].usedInTotal;
            /* filter out the mark if it has been deleted */
            if (examinerMark[0].markingOperation &&
                examinerMark[0].markingOperation === enums.MarkingOperation.deleted) {
                return { markId: examinerMark[0].markId,
                    markSchemeId: examinerMark[0].markId,
                    mark: { displayMark: NO_MARK, valueMark: NO_MARK },
                    isDirty: examinerMark[0].isDirty,
                    usedInTotal: usedInTotal };
            }
            /* If the mark status is not attempted set the mark as NR */
            if (examinerMark[0].markStatus && examinerMark[0].markStatus.toLowerCase() === NR_MARK_STATUS) {
                displayMark = NOT_ATTEMPTED;
            }
            else if (examinerMark[0].nonnumericMark && examinerMark[0].nonnumericMark !== '') {
                /* set the non numeric value */
                displayMark = examinerMark[0].nonnumericMark;
                displayMarkValue = examinerMark[0].numericMark.toString();
            }
            else {
                /* Get the formatted mark */
                displayMark = examinerMark[0].numericMark.toString();
                displayMarkValue = null;
            }
            originalMark = { markId: examinerMark[0].markId,
                markSchemeId: examinerMark[0].markSchemeId,
                mark: { displayMark: displayMark, valueMark: displayMarkValue },
                isDirty: examinerMark[0].isDirty,
                usedInTotal: usedInTotal };
        }
        return originalMark;
    };
    return MarksManagementHelper;
}());
module.exports = MarksManagementHelper;
//# sourceMappingURL=marksmanagementhelper.js.map
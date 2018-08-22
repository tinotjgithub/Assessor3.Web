"use strict";
// Argument for marks and annotations
var SaveMarksAndAnnotationsArgument = (function () {
    /**
     * Constructor
     * @param markGroupId
     * @param questionPaperPartId
     * @param marksAndAnnotationsToSave
     * @param isUsedInStandardisationSetup
     * @param usedStamps
     */
    function SaveMarksAndAnnotationsArgument(isUpdateMarkAnnotationDetails, markingMode, markGroupId, questionPaperPartId, marksAndAnnotationsToSave, isUsedInStandardisationSetup, usedStamps, saveMarksAndAnnotationTriggeringPoint, isWholeResponse, currentExaminerRoleId) {
        this.isUpdateMarkAnnotationDetails = isUpdateMarkAnnotationDetails;
        this.markingMode = markingMode;
        this.markGroupID = markGroupId;
        this.questionPaperPartId = questionPaperPartId;
        this.marksAndAnnotationsToSave = marksAndAnnotationsToSave;
        this.isUsedInStandardisationSetup = isUsedInStandardisationSetup;
        this.usedStamps = usedStamps;
        this.saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        this.isWholeResponse = isWholeResponse;
        this.currentExaminerRoleId = currentExaminerRoleId;
    }
    Object.defineProperty(SaveMarksAndAnnotationsArgument.prototype, "markGroupId", {
        /**
         * Returns the MarkGroupID
         */
        get: function () {
            return this.markGroupID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsArgument.prototype, "isWholeResponseMarking", {
        /**
         * Returns the whole response indicator
         */
        get: function () {
            return this.isWholeResponse;
        },
        enumerable: true,
        configurable: true
    });
    return SaveMarksAndAnnotationsArgument;
}());
module.exports = SaveMarksAndAnnotationsArgument;
//# sourceMappingURL=savemarksandannotationsargument.js.map
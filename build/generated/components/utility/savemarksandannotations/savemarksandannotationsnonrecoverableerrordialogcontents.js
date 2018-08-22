"use strict";
var marksAndAnnotationsSaveHelper = require('../../../utility/marking/marksandannotationssavehelper');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Class for generating Save Marks and annotations error dialog.
 */
var SaveMarksAndAnnotationsNonRecoverableErrorDialogContents = (function () {
    /**
     * @constructor
     */
    function SaveMarksAndAnnotationsNonRecoverableErrorDialogContents(detailedError) {
        this._detailedError = false;
        this._detailedError = detailedError;
    }
    Object.defineProperty(SaveMarksAndAnnotationsNonRecoverableErrorDialogContents.prototype, "header", {
        /**
         * returns the error dialog header.
         */
        get: function () {
            return localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.header-error-saving-marks');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsNonRecoverableErrorDialogContents.prototype, "content", {
        /**
         * returns the error dialog content based on the dialog type
         */
        get: function () {
            if (!this._detailedError) {
                return localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-error-saving-marks-single-response');
            }
            else {
                return localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-error-saving-marks-multiple-responses');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveMarksAndAnnotationsNonRecoverableErrorDialogContents.prototype, "tableContent", {
        /**
         * This will returns the non-recoverable error items (displayIds)
         */
        get: function () {
            return marksAndAnnotationsSaveHelper.markGroupItemsWithNonRecoverableErrors;
        },
        enumerable: true,
        configurable: true
    });
    return SaveMarksAndAnnotationsNonRecoverableErrorDialogContents;
}());
module.exports = SaveMarksAndAnnotationsNonRecoverableErrorDialogContents;
//# sourceMappingURL=savemarksandannotationsnonrecoverableerrordialogcontents.js.map
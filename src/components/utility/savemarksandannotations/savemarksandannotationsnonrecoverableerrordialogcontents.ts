import marksAndAnnotationsSaveHelper = require('../../../utility/marking/marksandannotationssavehelper');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../enums');

/**
 * Class for generating Save Marks and annotations error dialog.
 */
class SaveMarksAndAnnotationsNonRecoverableErrorDialogContents {

    private _detailedError: boolean = false;
    /**
     * @constructor
     */
    constructor(detailedError: boolean) {
        this._detailedError = detailedError;
    }

   /**
    * returns the error dialog header.
    */
    public get header(): string {
        return localeStore.instance.TranslateText
                ('marking.response.saving-marks-error-dialog.header-error-saving-marks');
    }

   /**
    * returns the error dialog content based on the dialog type
    */
    public get content(): string {
        let isDefinitive: boolean = standardisationSetupStore.instance.selectedStandardisationSetupWorkList
            === enums.StandardisationSetup.UnClassifiedResponse;
        if (!this._detailedError) {
            return localeStore.instance.TranslateText
                (isDefinitive ? 'marking.response.saving-marks-error-dialog.body-error-saving-def-marks-single-response' :
                    'marking.response.saving-marks-error-dialog.body-error-saving-marks-single-response');
        } else {
            return localeStore.instance.TranslateText
                (isDefinitive ? 'marking.response.saving-marks-error-dialog.body-error-saving-def-marks-multiple-responses' :
                    'marking.response.saving-marks-error-dialog.body-error-saving-marks-multiple-responses');
        }
    }

   /**
    * This will returns the non-recoverable error items (displayIds)
    */
    public get tableContent(): Array<string> {
        return marksAndAnnotationsSaveHelper.markGroupItemsWithNonRecoverableErrors;
    }
}

export = SaveMarksAndAnnotationsNonRecoverableErrorDialogContents;
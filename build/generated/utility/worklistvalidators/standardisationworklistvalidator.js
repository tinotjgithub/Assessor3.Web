"use strict";
var enums = require('../../components/utility/enums');
var Immutable = require('immutable');
var worklistStore = require('../../stores/worklist/workliststore');
var qigStore = require('../../stores/qigselector/qigstore');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
/**
 * Standardisation worklist concrete implementation of WorkListValidatorSchema
 */
var StandardisationWorklistValidator = (function () {
    function StandardisationWorklistValidator() {
    }
    /**
     * Logic to show marking progress/submit button/blocking exception warning
     * @param response
     */
    StandardisationWorklistValidator.prototype.submitButtonValidate = function (response) {
        this.responseStatuses = Immutable.List();
        this.responseStatuses.clear();
        switch (worklistStore.instance.getResponseMode) {
            case enums.ResponseMode.open:
                this.responseStatuses = this.openResponseValidation(response);
                break;
        }
        return this.responseStatuses;
    };
    /**
     * Open Standardisation worklist validation for marking progress/submit button
     * @param response
     */
    StandardisationWorklistValidator.prototype.openResponseValidation = function (response) {
        response.isSubmitEnabled = false;
        /** if the marking has started */
        if (response.markingProgress > 0) {
            /** if the marking is completed */
            if (response.markingProgress === 100) {
                // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                var markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
                /** taking the cc from cc helper */
                var isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                var isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                /** if slao annotated cc is on and all pages are not annotated OR all pages annotated cc is on
                 *  and all pages are not annotated if both CCs are on, all pages annotated cc has
                 *  the higher priority.
                 */
                if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false)
                    || (isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllPagesAnnotated);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                }
                else if (eCourseworkHelper.isECourseworkComponent && !response.allFilesViewed) {
                    /* For an ecoursework component, enable submit button only if all files are viewed in the response.
                       If not all files are viewed then the response view in the worklist will be shown in amber color along with
                       marking progress indicator.
                    */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                }
                else {
                    /** if all pages annotated cc is off show ready to submit button */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.readyToSubmit);
                    response.isSubmitEnabled = true;
                }
            }
            else {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
        }
        else {
            /** if marking not started show the same */
            this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingNotStarted);
        }
        return this.responseStatuses;
    };
    return StandardisationWorklistValidator;
}());
module.exports = StandardisationWorklistValidator;
//# sourceMappingURL=standardisationworklistvalidator.js.map
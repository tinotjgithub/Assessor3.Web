import enums = require('../../components/utility/enums');
import workListValidatorSchema = require('./worklistvalidatorschema');
import Immutable = require('immutable');
import worklistStore = require('../../stores/worklist/workliststore');
import qigStore = require('../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
/**
 * Standardisation worklist concrete implementation of WorkListValidatorSchema
 */
class StandardisationWorklistValidator implements workListValidatorSchema {
    private responseStatuses: Immutable.List<enums.ResponseStatus>;

    /**
     * Logic to show marking progress/submit button/blocking exception warning
     * @param response
     */
    public submitButtonValidate(response: ResponseBase) {

        this.responseStatuses = Immutable.List<enums.ResponseStatus>();
        this.responseStatuses.clear();
        switch (worklistStore.instance.getResponseMode) {
            case enums.ResponseMode.open:
                this.responseStatuses = this.openResponseValidation(response as StandardisationOpenResponse);
                break;
        }
        return this.responseStatuses;
    }

    /**
     * Open Standardisation worklist validation for marking progress/submit button
     * @param response
     */
    private openResponseValidation(response: StandardisationOpenResponse) {
        response.isSubmitEnabled = false;
        /** if the marking has started */
        if (response.markingProgress > 0) {
            /** if the marking is completed */
            if (response.markingProgress === 100) {

                // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                let markSchemeGroupId: number =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                /** taking the cc from cc helper */
                let isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                let isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                /** if slao annotated cc is on and all pages are not annotated OR all pages annotated cc is on
                 *  and all pages are not annotated if both CCs are on, all pages annotated cc has
                 *  the higher priority.
                 */
                if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false)
                    || (isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllPagesAnnotated);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if (eCourseworkHelper.isECourseworkComponent && !response.allFilesViewed) {
                    /* For an ecoursework component, enable submit button only if all files are viewed in the response.
                       If not all files are viewed then the response view in the worklist will be shown in amber color along with
                       marking progress indicator.
                    */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                } else {
                    /** if all pages annotated cc is off show ready to submit button */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.readyToSubmit);
                    response.isSubmitEnabled = true;
                }
            } else {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
        } else {
            /** if marking not started show the same */
            this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingNotStarted);
        }

        return this.responseStatuses;
    }
}
export = StandardisationWorklistValidator;

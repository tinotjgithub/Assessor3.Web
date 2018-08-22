import enums = require('../../components/utility/enums');
import workListValidatorSchema = require('./worklistvalidatorschema');
import Immutable = require('immutable');
import worklistStore = require('../../stores/worklist/workliststore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
import qigStore = require('../../stores/qigselector/qigstore');
import markeroperationmodefactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
/**
 * Live worklist concrete implementation of WorkListValidatorSchema
 */
class LiveWorklistValidator implements workListValidatorSchema {
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
                this.responseStatuses = this.openResponseValidation(response as LiveOpenResponse);
                break;
        }
        return this.responseStatuses;
    }

    /**
     * Open live worklist validation for marking progress/submit button
     * @param response
     */
    private openResponseValidation(response: LiveOpenResponse) {
        response.isSubmitEnabled = false;
        /** if the marking has started */
        if (response.markingProgress > 0) {
            /** if the marking is completed */
            if (response.markingProgress === 100) {

                // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                let markSchemeGroupId: number = (response.isWholeResponse &&
                    response.relatedRIGDetails) ? 0 :
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
                if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false
                    && response.hasAdditionalObjects)
                    || (isAllPagesAnnotatedCC && response.hasAllPagesAnnotated === false)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllPagesAnnotated);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    if (response.hasBlockingExceptions) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    }
                } else if (response.hasBlockingExceptions ||
                    (eCourseworkHelper.isECourseworkComponent && !response.allFilesViewed)) {
                    /** if the marking is completed and blocking exceptions are there, show both. */
                    /* For an ecoursework component, enable submit button only if all files are viewed in the response.
                       If not all files are viewed then the response view in the worklist will be shown in amber color along with
                       marking progress indicator .
                    */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    if (eCourseworkHelper.isECourseworkComponent && !response.allFilesViewed) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                    }
                } if (response.hasZoningExceptions) {
                    /** if the marking is completed and zoning exceptions are there, show both. */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasZoningException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if (response.isWholeResponse && !markeroperationmodefactory.operationMode.isSubmitDisabled(enums.WorklistType.live)
                    && ((!qigStore.instance.isWholeResponseAvailable &&
                            worklistStore.instance.currentWorklistType === enums.WorklistType.live)
                        || (!qigStore.instance.isAtypicalAvailable &&
                            worklistStore.instance.currentWorklistType === enums.WorklistType.atypical))) {
                    //// if permission is changed for whole response in any of the qigs then submit is hidden
                    ////  markeroperationmodefactory.operationMode.isSubmitDisabled - current qig submit disable logic
                    ////  isAtypicalAvailable - for checking if atypical submit available
                    ////  isWholeResponseAvailable - for checking if whole response submit available
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.wholeResponseNotAvailable);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if (this.responseStatuses.count() === 0) {
                    /** if all pages annotated cc is off and if no blocking exceptions are there, show ready to submit button */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.readyToSubmit);
                    response.isSubmitEnabled = true;
                }
            } else if (response.hasBlockingExceptions) {
                /** if the marking is in progress and blocking exceptions are there, show both. */
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            } else {
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
            }
        } else {
            /** if marking not started show the same */
            this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingNotStarted);
            if (response.hasBlockingExceptions) {
                /** if the marking is not started and blocking exceptions are there, show amber. */
                this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
            }
        }

        return this.responseStatuses;
    }
}
export = LiveWorklistValidator;

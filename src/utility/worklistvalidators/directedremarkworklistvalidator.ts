import enums = require('../../components/utility/enums');
import workListValidatorSchema = require('./worklistvalidatorschema');
import Immutable = require('immutable');
import worklistStore = require('../../stores/worklist/workliststore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
import qigStore = require('../../stores/qigselector/qigstore');

/**
 * Directed remark worklist concrete implementation of WorkListValidatorSchema
 */
class DirectedRemarkWorklistValidator implements workListValidatorSchema {
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
                this.responseStatuses = this.openResponseValidation(response as DirectedRemarkOpenResponse);
                break;
        }
        return this.responseStatuses;
    }

    /**
     * get supervisor remark decision visibility
     * @param response
     */
    private isSupervisorRemarkDecisionVisible(response: ResponseBase): boolean {
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let isSupervisorRemarkDecisionCCOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        return (isSupervisorRemarkDecisionCCOn
            && worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark
            && response.markingProgress === 100);
    }

    /**
     * Open directed remark worklist validation for marking progress/submit button
     * @param response
     */
    private openResponseValidation(response: DirectedRemarkOpenResponse) {
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
                if ((!isAllPagesAnnotatedCC && isAllSLAOAnnotatedCC && response.hasAllPagesAnnotated === false)
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
                       marking progress indicator.
                    */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                    if (eCourseworkHelper.isECourseworkComponent && !response.allFilesViewed) {
                        this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.notAllFilesViewed);
                    }
                } else if (response.hasZoningExceptions) {
                    /** if the marking is completed and zoning exceptions are there, show both. */
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.hasZoningException);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if (response.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                    && response.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                    && response.markChangeReasonVisible && !response.markChangeReason) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markChangeReasonNotExist);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else if ((response.supervisorRemarkFinalMarkSetID === 0 || response.supervisorRemarkMarkChangeReasonID === 0)
                    && this.isSupervisorRemarkDecisionVisible(response)) {
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.supervisorRemarkDecisionNotSelected);
                    this.responseStatuses = this.responseStatuses.push(enums.ResponseStatus.markingInProgress);
                } else {
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
export = DirectedRemarkWorklistValidator;

import qigStore = require('../../../stores/qigselector/qigstore');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import ccHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ccValues = require('../../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import xmlHelper = require('../../../utility/generic/xmlhelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import responseStore = require('../../../stores/response/responsestore');
import enums = require('../enums');
import rememberQig = require('../../../stores/useroption/typings/rememberqig');
import userOptionActionCreator = require('../../../actions/useroption/useroptionactioncreator');

class OperationModeBase {

    /**
     * get the value of supervisor sampling cc.
     */
    protected getSupervisorSamplingCCValue(worklistType: enums.WorklistType) {
        let ccValue = ccHelper.getCharacteristicValue(
            ccNames.RecordSupervisorSampling,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        if (ccValue && ccValue !== '') {
            let xmlHelperObj = new xmlHelper(ccValue);
            let isCCOn: boolean = false;
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (enums.WorklistType[worklistType] === xmlHelperObj.
                    getAllChildNodes()[i].firstChild.nodeValue.toLowerCase()) {
                    isCCOn = true;
                    break;
                }
            }
            return isCCOn;
        } else {
            return false;
        }
    }

    /**
     * get the value of senior examiner pool cc.
     */
    protected getSeniorExaminerPoolCCValue() {
        let ccValue = ccHelper.getCharacteristicValue(
            ccNames.SeniorExaminerPool,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        return ccValue;
    }

    /**
     * This method will return true if marker is approved/suspended.
     * Suspended handled as special case,as when a marker is in live target and then gets suspended,both future icon and
     * the progress will be shown if target is disabled
     */
    protected get isMarkerApprovedOrSuspended(): boolean {
        let approvalStatus: enums.ExaminerApproval = examinerStore.instance.getMarkerInformation.approvalStatus;
        return approvalStatus === enums.ExaminerApproval.Approved || approvalStatus === enums.ExaminerApproval.ApprovedReview ||
            approvalStatus === enums.ExaminerApproval.ConditionallyApproved || approvalStatus === enums.ExaminerApproval.Suspended;
    }

    /**
     * Method which gets the previously selected QIG from the user option
     */
    protected get previousSelectedQIGFromUserOption(): rememberQig {
        // Getting the user option for RememberPreviousQIG
        let _rememberQig: rememberQig = new rememberQig();
        let _userOptionValue: string = userOptionsHelper.getUserOptionByName(userOptionKeys.REMEMBER_PREVIOUS_QIG);
        if (_userOptionValue) {
            _rememberQig = JSON.parse(_userOptionValue);
        }
        return _rememberQig;
    }

    /**
     * get the response mode based on quality feedback
     * @returns
     */
    protected get getResponseModeBasedOnQualityFeedback(): enums.ResponseMode {
        if (this.isExaminerHasQualityFeedback && !worklistStore.instance.isMarkingCheckMode) {
            if (this.isAutomaticQualityFeedbackCCOn) {
                return enums.ResponseMode.closed;
            } else {
                return enums.ResponseMode.pending;
            }
        } else {
            return undefined;
        }
    }

    /**
     * Returns whether the Show Standardisation Definitive Marks CC is on or not.
     */
    protected get hasShowStandardisationDefinitiveMarksCC(): boolean {
        return ccHelper.getCharacteristicValue(ccNames.ShowStandardisationDefinitiveMarks,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
    }

    /**
     * Returns whether the Show TL Seed Definitive Marks CC is on or not.
     */
    protected get hasShowTLSeedDefinitiveMarksCC(): boolean {
        return ccHelper.getCharacteristicValue(ccNames.ShowTLSeedDefinitiveMarks).toLowerCase() === 'true';
    }

    /**
     * gets whether the current worklist is Standardisation.
     */
    protected get isStandardisation(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation;
    }

    /**
     * gets whether the current worklist is practice.
     */
    protected get isPractice(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.practice;
    }

    /**
     * gets whether the current worklist is directed remark.
     */
    protected get isDirectedRemark(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark;
    }

    /**
     * gets whether the current worklist is pooled remark.
     * @returns
     */
    protected get isPooledRemark(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark;
    }

    /**
     * gets whether the current worklist is Second Standardisation.
     */
    protected get isSecondStandardisation(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation;
    }

    /**
     * gets whether the current worklist is Live.
     */
    protected get isLive(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.live;
    }

    /**
     * gets whether the current response mode is closed.
     */
    protected get isClosed(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
    }

    /**
     * gets whether the current response mode is closed.
     */
    protected get isOpen(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.open;
    }

    /**
     * gets whether the response is seed.
     */
    protected get isCurrentResponseSeed(): number {
        let currentResponse = worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((responses: any) =>
            responses.markGroupId === responseStore.instance.selectedMarkGroupId).first() as LiveClosedResponse;
        if (currentResponse && currentResponse.seedTypeId) {
            return currentResponse.seedTypeId;
        } else {
            return enums.SeedType.None;
        }
    }

    /**
     * Gets a value indicating whether the currrent response is a definitive response. i.e, Used for standardisation
     * This also includes Promoted Seeds.
     */
    protected get isCurrentResponseDefinitive(): boolean {

        let currentResponse = worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((response: any) =>
            response.markGroupId === responseStore.instance.selectedMarkGroupId);

        // Only logged in PE or APE should know whether the response is Definitive.
        return currentResponse && currentResponse.first().isDefinitiveResponse === true && this.isLoggedInExaminerPEOrAPE;
    }

    /**
     * Checks whether the automatic quality feedback CC is on
     * @returns
     */
    public get isAutomaticQualityFeedbackCCOn(): boolean {
        return ccHelper.getCharacteristicValue(
            ccNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
    }


    /**
     * Checks whether the examiner has quality feedback
     */
    public get isExaminerHasQualityFeedback(): boolean {
        return (qigStore.instance.selectedQIGForMarkerOperation !== undefined
            && qigStore.instance.selectedQIGForMarkerOperation.hasQualityFeedbackOutstanding) ||
            (examinerStore.instance.getMarkerInformation !== undefined
                && examinerStore.instance.getMarkerInformation.hasQualityFeedbackOutstanding);
    }

    /**
     * Returns whether the promote to reusebucket  button is visible or not.
     */
    public get isPromoteToReuseButtonVisible(): boolean {
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        let reuseRIG = ccHelper.getCharacteristicValue(ccNames.ReuseRIG, markSchemeGroupId);
        let eCoursework = ccHelper.getCharacteristicValue(ccNames.ECoursework);
        let currentResponse: LiveClosedResponse =
            worklistStore.instance.getResponseDetailsByMarkGroupId(responseStore.instance.selectedMarkGroupId);
        let currentMarkingMode: enums.MarkingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

        return currentResponse !== null &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured || eCoursework === 'true')
            && this.isLoggedInExaminerPE && reuseRIG === 'true' && worklistStore.instance.getResponseMode === enums.ResponseMode.closed
            && (currentMarkingMode === enums.MarkingMode.LiveMarking || currentMarkingMode === enums.MarkingMode.Remarking)
            && !(currentResponse).isPirate && (currentResponse).atypicalStatus === enums.AtypicalStatus.Scannable
            && !(currentResponse).isPromotedToReuseBucket
            && !(currentResponse).isPromotedSeed
            && !responseStore.instance.isWholeResponse
            && currentResponse.seedTypeId === enums.SeedType.None
            && currentResponse.specialistType === '';
    }

    /**
     * Returns whether the supervisor remark button is visible or not.
     */
    public get shouldDisplaySupervisorRemarkButton(): boolean {
        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let isOpenForMarking: boolean = qigStore.instance.selectedQIGForMarkerOperation.isOpenForMarking;
        let isRestrictRemarkCreationCCON = ccHelper.getCharacteristicValue(
            ccNames.RestrictRemarkCreation).toLowerCase() === 'true' ? true : false;
        let currentResponse: LiveClosedResponse | PendingResponse =
            (worklistStore.instance.getCurrentWorklistResponseBaseDetails().filter((x: ResponseBase) =>
                x.markGroupId === responseStore.instance.selectedMarkGroupId).first()) as LiveClosedResponse | PendingResponse;

        let shouldDisplaySupervisorRemarkButton: boolean = (worklistStore.instance.getResponseMode !== enums.ResponseMode.open
            && (worklistStore.instance.getMarkingModeByWorkListType
                (worklistStore.instance.currentWorklistType) === enums.MarkingMode.LiveMarking ||
                worklistStore.instance.getMarkingModeByWorkListType
                    (worklistStore.instance.currentWorklistType) === enums.MarkingMode.Remarking) &&
            ccHelper.getCharacteristicValue
                (ccNames.SupervisorRemark,
                markSchemeGroupId).toLowerCase() === 'true'
            && qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerApprovalStatus ===
            enums.ExaminerApproval.Approved)
            && (currentResponse && !(currentResponse).isPromotedSeed)
            && (worklistStore.instance.getResponseMode === enums.ResponseMode.pending ?
                (ccHelper.getCharacteristicValue
                    (ccNames.SupervisorRemarkPending,
                    markSchemeGroupId).toLowerCase() === 'true' &&
                    ccHelper.getCharacteristicValue
                        (ccNames.SupervisorRemark,
                        markSchemeGroupId).toLowerCase() === 'true')
                : ccHelper.getCharacteristicValue
                    (ccNames.SupervisorRemark,
                    markSchemeGroupId).toLowerCase() === 'true')
            && (isOpenForMarking || (!isOpenForMarking && !isRestrictRemarkCreationCCON))
            && !this.isCurrentResponseDefinitive
            && !(worklistStore.instance.currentWorklistType === enums.WorklistType.live &&
                responseStore.instance.isWholeResponse);
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.atypical) {
            // If the supervisor is in 'Suspended'or Not approved'  state in any of the QIG, 
            // then the 'Raise Supervisor re- mark' button shall not displayed for atypical worklist.
            return shouldDisplaySupervisorRemarkButton && qigStore.instance.isAtypicalAvailable;
        } else {
            return shouldDisplaySupervisorRemarkButton;
        }
    }

    /**
     * get the value of Remark Seeding cc.
     */
    protected getRemarkSeedingCCValue(remarkRequestType: enums.RemarkRequestType) {
        let ccValue = ccHelper.getCharacteristicValue(
            ccNames.RemarkSeeding);
        if (ccValue && ccValue !== '') {
            let xmlHelperObj = new xmlHelper(ccValue);
            let isCCOn: boolean = false;
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (enums.RemarkRequestType[remarkRequestType] ===
                    xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.replace(/\s/g, '')) {
                    for (let i = xmlHelperObj.getAllChildNodes().length - 1; i < xmlHelperObj.getAllChildNodes().length; i--) {
                        if (xmlHelperObj.
                            getAllChildNodes()[i].firstChild.nodeValue.toLowerCase() === 'true') {
                            isCCOn = true;
                        } else {
                            isCCOn = false;
                        }
                        break;
                    }
                }
            }
            return isCCOn;
        } else {
            return false;
        }
    }

    /**
     * returns true if selected examiner is PE or APE
     */
    public get isSelectedExaminerPEOrAPE(): boolean {
        return qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
            qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;
    }

    /**
     * returns true if selected examiner is STM
     */
    public get isSelectedExaminerSTM(): boolean {
        return qigStore.instance.selectedQIGForMarkerOperation !== undefined
                && (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember
                || this.isSelectedExaminerPEOrAPE);
    }

    /**
     * returns true if logged-in examiner is PE or APE
     */
    public get isLoggedInExaminerPEOrAPE(): boolean {
        return qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer ||
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.assistantPrincipalExaminer;
    }


    /**
     * returns true if logged-in examiner is PE 
     */
    public get isLoggedInExaminerPE(): boolean {
        return qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer;
    }

    /**
     * returns true if logged-in examiner is STM
     */
    public get isLoggedInExaminerSTM(): boolean {
        return qigStore.instance.getSelectedQIGForTheLoggedInUser.isElectronicStandardisationTeamMember
            || this.isLoggedInExaminerPEOrAPE;
    }


    /**
     * Checks whether the examiner Centre Exclusivity CC is on
     * @returns
     */
    public get shouldDisplayCenterNumber(): boolean {
        return ccValues.examinerCentreExclusivity ? false : true;
    }

    /**
     * Opened Response Details
     * @param {string} actualDisplayId 
     * @returns {ResponseBase} 
     * @memberof MarkingOperationMode
     */
    public openedResponseDetails(actualDisplayId: string): ResponseBase {
        let openedResponseDetails =
                worklistStore.instance.getResponseDetails(actualDisplayId);
        return openedResponseDetails;
    }

    /**
     * Returns the response position
     * @param {string} displayId 
     * @returns {number} 
     * @memberof MarkingOperationMode
     */
    public getResponsePosition(displayId: string): number {
        return worklistStore.instance.getResponsePosition(displayId);
    }

    /**
     * Returns whether next response is available or not
     * @param {string} displayId 
     * @returns {boolean} 
     * @memberof MarkingOperationMode
     */
    public isNextResponseAvailable(displayId: string): boolean {
        return worklistStore.instance.isNextResponseAvailable(displayId);
    }

    /**
     * Returns whether next response is available or not
     * @param {string} displayId 
     * @returns {boolean} 
     * @memberof StandardisationSetupOperationMode
     */
    public isPreviousResponseAvailable(displayId: string): boolean {
        return worklistStore.instance.isPreviousResponseAvailable(displayId);
    }

    /**
     * Current response Count
     */
    public get currentResponseCount(): number {
        return worklistStore.instance.currentWorklistResponseCount;
    }

    /**
     * Returns the next response id
     * @param {string} displayId 
     * @returns {string} 
     * @memberof MarkingOperationMode
     */
    public nextResponseId(displayId: string): string {
       return worklistStore.instance.nextResponseId(displayId);
    }

    /**
     * Returns the previous response id
     * @param {string} displayId 
     * @returns {string} 
     * @memberof MarkingOperationMode
     */
    public previousResponseId(displayId: string): string {
        return worklistStore.instance.previousResponseId(displayId);
    }

    /**
     * Returns the first response, in the sorted collection.
     */
    public get getIfOfFirstResponse(): string {
        return worklistStore.instance.getIfOfFirstResponse;
    }

     /**
      * get Response Details By MarkGroupId
      * @param {number} markGroupId 
      * @returns 
      * @memberof TeamManagementOperationMode
      */
    public getResponseDetailsByMarkGroupId(markGroupId: number) {
        return worklistStore.instance.getResponseDetailsByMarkGroupId(markGroupId);
    }

    /**
     * Get the tag id
     * @param {string} displayId 
     * @memberof MarkingOperationMode
     */
    public getTagId(displayId: string) {
       return worklistStore.instance.getTagId(displayId);
    }

    /**
     * returns false, by default.
     */
    public get isProvisionalTabInStdSetup(): boolean {
        return false;
    }

    /**
     * Returns a value indicating whether the Return Response To Marker is available.
     * @returns true if Return Response To Marker can be allowed else false.
     */
    public get allowReturnResponseToMarker(): boolean {
        return false;
    }
}

export = OperationModeBase;
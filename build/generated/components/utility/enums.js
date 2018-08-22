"use strict";
/**
 * Enums
 */
var Enums;
(function (Enums) {
    /**
     * Enum for the Login Form components
     * @export LoginForm
     * @enum {number}
     */
    (function (LoginForm) {
        LoginForm[LoginForm["username"] = 0] = "username";
        LoginForm[LoginForm["password"] = 1] = "password";
    })(Enums.LoginForm || (Enums.LoginForm = {}));
    var LoginForm = Enums.LoginForm;
    /**
     * Enum for the different HTTP error codes
     *
     * @export HttpErrorCode
     * @enum {number}
     */
    (function (HttpErrorCode) {
        HttpErrorCode[HttpErrorCode["badRequest"] = 400] = "badRequest";
        HttpErrorCode[HttpErrorCode["internalServerError"] = 500] = "internalServerError";
    })(Enums.HttpErrorCode || (Enums.HttpErrorCode = {}));
    var HttpErrorCode = Enums.HttpErrorCode;
    /**
     * Enum for the different Configurable Characteristic types available in Assessor
     *
     * @export ConfigurableCharacteristics
     * @enum {number}
     */
    (function (ConfigurableCharacteristics) {
        ConfigurableCharacteristics[ConfigurableCharacteristics["none"] = 0] = "none";
        ConfigurableCharacteristics[ConfigurableCharacteristics["boolean"] = 1] = "boolean";
        ConfigurableCharacteristics[ConfigurableCharacteristics["string"] = 2] = "string";
        ConfigurableCharacteristics[ConfigurableCharacteristics["int"] = 3] = "int";
        ConfigurableCharacteristics[ConfigurableCharacteristics["decimal"] = 4] = "decimal";
        ConfigurableCharacteristics[ConfigurableCharacteristics["xml"] = 5] = "xml";
    })(Enums.ConfigurableCharacteristics || (Enums.ConfigurableCharacteristics = {}));
    var ConfigurableCharacteristics = Enums.ConfigurableCharacteristics;
    /**
     * Enum for the different marking modes available in Assessor
     *
     * @export MarkingMode
     * @enum {number}
     */
    (function (MarkingMode) {
        MarkingMode[MarkingMode["None"] = 0] = "None";
        MarkingMode[MarkingMode["PreStandardisation"] = 1] = "PreStandardisation";
        MarkingMode[MarkingMode["Practice"] = 2] = "Practice";
        MarkingMode[MarkingMode["Approval"] = 3] = "Approval";
        MarkingMode[MarkingMode["ES_TeamApproval"] = 4] = "ES_TeamApproval";
        MarkingMode[MarkingMode["Pre_ES_TeamStandardisation"] = 5] = "Pre_ES_TeamStandardisation";
        MarkingMode[MarkingMode["StandardisationReview"] = 6] = "StandardisationReview";
        MarkingMode[MarkingMode["SeedingReview"] = 10] = "SeedingReview";
        MarkingMode[MarkingMode["LiveMarking"] = 30] = "LiveMarking";
        MarkingMode[MarkingMode["Remarking"] = 40] = "Remarking";
        MarkingMode[MarkingMode["Adjudication"] = 50] = "Adjudication";
        MarkingMode[MarkingMode["Sample"] = 60] = "Sample";
        MarkingMode[MarkingMode["Seeding"] = 70] = "Seeding";
        MarkingMode[MarkingMode["MarkFromPaper"] = 80] = "MarkFromPaper";
        MarkingMode[MarkingMode["Simulation"] = 90] = "Simulation";
    })(Enums.MarkingMode || (Enums.MarkingMode = {}));
    var MarkingMode = Enums.MarkingMode;
    /**
     * Enum for the different status of the examiner possible in a QIG's life time
     *
     * @export ExaminerQIGStatus
     * @enum {number}
     */
    (function (ExaminerQIGStatus) {
        ExaminerQIGStatus[ExaminerQIGStatus["None"] = 0] = "None";
        ExaminerQIGStatus[ExaminerQIGStatus["Suspended"] = 1] = "Suspended";
        ExaminerQIGStatus[ExaminerQIGStatus["Practice"] = 2] = "Practice";
        ExaminerQIGStatus[ExaminerQIGStatus["StandardisationMarking"] = 3] = "StandardisationMarking";
        ExaminerQIGStatus[ExaminerQIGStatus["AwaitingApproval"] = 4] = "AwaitingApproval";
        ExaminerQIGStatus[ExaminerQIGStatus["SecondStandardisationMarking"] = 5] = "SecondStandardisationMarking";
        ExaminerQIGStatus[ExaminerQIGStatus["STMStandardisationMarking"] = 6] = "STMStandardisationMarking";
        ExaminerQIGStatus[ExaminerQIGStatus["LiveMarking"] = 7] = "LiveMarking";
        ExaminerQIGStatus[ExaminerQIGStatus["WaitingStandardisation"] = 8] = "WaitingStandardisation";
        ExaminerQIGStatus[ExaminerQIGStatus["LiveComplete"] = 9] = "LiveComplete";
        ExaminerQIGStatus[ExaminerQIGStatus["Simulation"] = 10] = "Simulation";
        ExaminerQIGStatus[ExaminerQIGStatus["QualityFeedback"] = 11] = "QualityFeedback";
        ExaminerQIGStatus[ExaminerQIGStatus["NoLiveTarget"] = 12] = "NoLiveTarget";
        ExaminerQIGStatus[ExaminerQIGStatus["OverAllTargetReached"] = 13] = "OverAllTargetReached";
        ExaminerQIGStatus[ExaminerQIGStatus["OverAllTargetCompleted"] = 14] = "OverAllTargetCompleted";
        ExaminerQIGStatus[ExaminerQIGStatus["Atypical"] = 15] = "Atypical";
        ExaminerQIGStatus[ExaminerQIGStatus["AdminRemark"] = 16] = "AdminRemark";
        ExaminerQIGStatus[ExaminerQIGStatus["AwaitingScripts"] = 17] = "AwaitingScripts";
    })(Enums.ExaminerQIGStatus || (Enums.ExaminerQIGStatus = {}));
    var ExaminerQIGStatus = Enums.ExaminerQIGStatus;
    /**
     * Enum for atypical Search Result Code indicating the reason for the success or failure of the search.
     *
     * @export SearchResultCode
     * @enum {number}
     */
    (function (SearchResultCode) {
        /// <summary>
        /// Value is not set.
        /// </summary>
        SearchResultCode[SearchResultCode["NotSet"] = 0] = "NotSet";
        /// <summary>
        /// Success. Can proceed to allocate the searched response.
        /// </summary>
        SearchResultCode[SearchResultCode["AllocationPossible"] = 1] = "AllocationPossible";
        /// <summary>
        /// Response is already allocated and in open worklist.
        /// </summary>
        SearchResultCode[SearchResultCode["AlreadyInOpenWorklist"] = 2] = "AlreadyInOpenWorklist";
        /// <summary>
        /// Response is already allocated and in closed worklist.
        /// </summary>
        SearchResultCode[SearchResultCode["AlreadyInClosedWorklist"] = 3] = "AlreadyInClosedWorklist";
        /// <summary>
        /// The Centre Number and Candidate Number combination is not valid.
        /// </summary>
        SearchResultCode[SearchResultCode["CentreCandidateCombinationNotFound"] = 4] = "CentreCandidateCombinationNotFound";
        /// <summary>
        /// Response is not an atypical.
        /// </summary>
        SearchResultCode[SearchResultCode["NotAtypicalResponse"] = 5] = "NotAtypicalResponse";
        /// <summary>
        /// Current marker is not eligible to mark any response that belongs to specified Centre.
        /// </summary>
        SearchResultCode[SearchResultCode["MarkerNotEligibleForCentre"] = 6] = "MarkerNotEligibleForCentre";
        /// <summary>
        /// The response was already allocated to this marker, and then the Awarding Body removed it from the worklist.
        /// </summary>
        SearchResultCode[SearchResultCode["DeallocatedByAwardingBody"] = 7] = "DeallocatedByAwardingBody";
        /// <summary>
        /// Response is already allocated to another marker.
        /// </summary>
        SearchResultCode[SearchResultCode["AllocatedToAnotherMarker"] = 8] = "AllocatedToAnotherMarker";
        /// <summary>
        /// The response was already allocated to the current marker, and then rejected by the marker.
        /// </summary>
        SearchResultCode[SearchResultCode["AlreadyRejected"] = 9] = "AlreadyRejected";
        /// <summary>
        /// Respective candidate script is not found.
        /// </summary>
        SearchResultCode[SearchResultCode["CandidateScriptNotFound"] = 10] = "CandidateScriptNotFound";
        /// <summary>
        /// The Marker is not approved.
        /// </summary>
        SearchResultCode[SearchResultCode["MarkerNotApproved"] = 11] = "MarkerNotApproved";
        /// <summary>
        /// The Marker is not suspended.
        /// </summary>
        SearchResultCode[SearchResultCode["MarkerSuspended"] = 12] = "MarkerSuspended";
        /// <summary>
        /// The Marker is withdrawn.
        /// </summary>
        SearchResultCode[SearchResultCode["MarkerWithdrawn"] = 13] = "MarkerWithdrawn";
    })(Enums.SearchResultCode || (Enums.SearchResultCode = {}));
    var SearchResultCode = Enums.SearchResultCode;
    /**
     * Enum for the different Remark Request Types
     *
     * @export RemarkRequestType
     * @enum {number}
     */
    (function (RemarkRequestType) {
        /// <summary>
        /// Unknown remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["Unknown"] = 0] = "Unknown";
        /// <summary>
        /// Abberant Marker remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["AberrantMarker"] = 1] = "AberrantMarker";
        /// <summary>
        /// Reallocate rig remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["ReallocateRIG"] = 2] = "ReallocateRIG";
        /// <summary>
        /// Grade review remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["GradeReview"] = 3] = "GradeReview";
        /// <summary>
        /// Priority Result Enquiry remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["PriorityResultEnquiry"] = 4] = "PriorityResultEnquiry";
        /// <summary>
        /// Result Enquiry remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["ResultEnquiry"] = 5] = "ResultEnquiry";
        /// <summary>
        /// Seeding Remark remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["SeedingRemark"] = 6] = "SeedingRemark";
        /// <summary>
        /// Grade review remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkCandidate"] = 7] = "RemarkCandidate";
        /// <summary>
        /// Remark RIG Examiner remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkRIGExaminer"] = 8] = "RemarkRIGExaminer";
        /// <summary>
        /// Remark Candidate Examiner remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkCandidateExaminer"] = 9] = "RemarkCandidateExaminer";
        /// <summary>
        /// Grade review remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["PartialRemark"] = 10] = "PartialRemark";
        /// <summary>
        /// Grade Review Directed remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["GradeReviewDirected"] = 11] = "GradeReviewDirected";
        /// <summary>
        /// Insufficient Sample remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["InsufficientSample"] = 12] = "InsufficientSample";
        /// <summary>
        /// Pooled Results Enquiry remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["PooledResultsEnquiry"] = 13] = "PooledResultsEnquiry";
        /// <summary>
        /// Superviso rRemark remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["SupervisorRemark"] = 14] = "SupervisorRemark";
        /// <summary>
        /// Grade Review Pooled remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["GradeReviewPooled"] = 15] = "GradeReviewPooled";
        /// <summary>
        /// Remark Candidate RIG remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkCandidateRIG"] = 16] = "RemarkCandidateRIG";
        /// <summary>
        /// Grade review remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["SampleRemark"] = 17] = "SampleRemark";
        /// <summary>
        /// At-Risk remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["AtRisk"] = 18] = "AtRisk";
        /// <summary>
        /// At-Risk Pooled remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["AtRiskPooled"] = 19] = "AtRiskPooled";
        /// <summary>
        /// Enquiry Upon Result remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["EnquiryUponResult"] = 20] = "EnquiryUponResult";
        /// <summary>
        /// Enquiry Upon Result Pooled remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["EnquiryUponResultPooled"] = 21] = "EnquiryUponResultPooled";
        /// <summary>
        /// Remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["Remark"] = 22] = "Remark";
        /// <summary>
        /// Remark pooled type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkPooled"] = 23] = "RemarkPooled";
        /// <summary>
        /// Open Review Remark type.
        /// </summary>
        RemarkRequestType[RemarkRequestType["ReviewRemark"] = 24] = "ReviewRemark";
        /// <summary>
        /// Pooled Admin remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["PooledAdminRemark"] = 25] = "PooledAdminRemark";
        /// <summary>
        /// Pooled case review remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["PooledCaseReviewRemark"] = 26] = "PooledCaseReviewRemark";
        /// <summary>
        /// Withdrawn seed remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["WithdrawnSeedRemark"] = 27] = "WithdrawnSeedRemark";
        /// <summary>
        /// Re-mark Pooled 1  remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkPooled1"] = 28] = "RemarkPooled1";
        /// <summary>
        /// Re-mark Pooled 2  remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkPooled2"] = 29] = "RemarkPooled2";
        /// <summary>
        /// Re-mark Pooled 3  remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["RemarkPooled3"] = 30] = "RemarkPooled3";
        /// <summary>
        /// Adjudication Pooled  remark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["AdjudicationPooled"] = 31] = "AdjudicationPooled";
        /// <summary>
        /// Deallocation Remark re-mark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["DeallocationRemark"] = 32] = "DeallocationRemark";
        /// <summary>
        /// Double Marking Remark re-mark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["DoubleMarking"] = 33] = "DoubleMarking";
        /// <summary>
        /// Arbitration Remark re-mark type
        /// </summary>
        RemarkRequestType[RemarkRequestType["ArbitrationRemark"] = 34] = "ArbitrationRemark";
        /// <summary>
        /// The priority remark
        /// </summary>
        RemarkRequestType[RemarkRequestType["PriorityRemark"] = 35] = "PriorityRemark";
        /// <summary>
        /// The quality remark
        /// </summary>
        RemarkRequestType[RemarkRequestType["QualityRemark"] = 36] = "QualityRemark";
    })(Enums.RemarkRequestType || (Enums.RemarkRequestType = {}));
    var RemarkRequestType = Enums.RemarkRequestType;
    /**
     * Enum for the Approval for Mark Scheme Groups.
     *
     * @export ExaminerApproval
     * @enum {number}
     */
    (function (ExaminerApproval) {
        /// <summary>
        /// Unknown Approval status.
        /// </summary>
        ExaminerApproval[ExaminerApproval["None"] = 0] = "None";
        /// <summary>
        /// Not Approved status.
        /// </summary>
        ExaminerApproval[ExaminerApproval["NotApproved"] = 1] = "NotApproved";
        /// <summary>
        /// Completed practice responses.
        /// </summary>
        ExaminerApproval[ExaminerApproval["PracticeCompleted"] = 2] = "PracticeCompleted";
        /// <summary>
        /// Completed standardisation responses
        /// </summary>
        ExaminerApproval[ExaminerApproval["StandardisationCompleted"] = 3] = "StandardisationCompleted";
        /// <summary>
        /// Examiner is approved.
        /// </summary>
        ExaminerApproval[ExaminerApproval["Approved"] = 4] = "Approved";
        /// <summary>
        /// Examiner is approved for review.
        /// </summary>
        ExaminerApproval[ExaminerApproval["ApprovedReview"] = 5] = "ApprovedReview";
        /// <summary>
        /// Examiner is unapproved and assigned for re-standardisation.
        /// </summary>
        ExaminerApproval[ExaminerApproval["UnapprovedRestandardise"] = 6] = "UnapprovedRestandardise";
        /// <summary>
        /// Examiner is rejected.
        /// </summary>
        ExaminerApproval[ExaminerApproval["UnapprovedRejected"] = 7] = "UnapprovedRejected";
        /// <summary>
        /// Examiner is withdrawn.
        /// </summary>
        ExaminerApproval[ExaminerApproval["Withdrawn"] = 8] = "Withdrawn";
        /// <summary>
        /// Examiner is suspended.
        /// </summary>
        ExaminerApproval[ExaminerApproval["Suspended"] = 9] = "Suspended";
        /// <summary>
        /// Examiner is approved
        /// </summary>
        ExaminerApproval[ExaminerApproval["ConditionallyApproved"] = 10] = "ConditionallyApproved";
        /// <summary>
        /// Examiner is awaiting approval
        /// </summary>
        ExaminerApproval[ExaminerApproval["AwaitingApproval"] = 11] = "AwaitingApproval";
        /// <summary>
        /// Examiner has completed live marking
        /// </summary>
        ExaminerApproval[ExaminerApproval["Complete"] = 12] = "Complete";
    })(Enums.ExaminerApproval || (Enums.ExaminerApproval = {}));
    var ExaminerApproval = Enums.ExaminerApproval;
    /**
     * Enum for Examiner Role.
     *
     * @export ExaminerRole
     * @enum {number}
     */
    (function (ExaminerRole) {
        ExaminerRole[ExaminerRole["none"] = 0] = "none";
        ExaminerRole[ExaminerRole["assistantExaminer"] = 1] = "assistantExaminer";
        ExaminerRole[ExaminerRole["teamLeader"] = 2] = "teamLeader";
        ExaminerRole[ExaminerRole["principalExaminer"] = 3] = "principalExaminer";
        ExaminerRole[ExaminerRole["administrator"] = 4] = "administrator";
        ExaminerRole[ExaminerRole["generalMarker"] = 5] = "generalMarker";
        ExaminerRole[ExaminerRole["viewer"] = 6] = "viewer";
        ExaminerRole[ExaminerRole["assistantPrincipalExaminer"] = 9] = "assistantPrincipalExaminer";
        ExaminerRole[ExaminerRole["assistantExaminer_MFI_SSU"] = 11] = "assistantExaminer_MFI_SSU";
        ExaminerRole[ExaminerRole["assistantExaminer_MFI"] = 12] = "assistantExaminer_MFI";
        ExaminerRole[ExaminerRole["subjectMarker_MFI_Marking_Centre"] = 13] = "subjectMarker_MFI_Marking_Centre";
        ExaminerRole[ExaminerRole["subjectMarker_MFI_Home"] = 14] = "subjectMarker_MFI_Home";
        ExaminerRole[ExaminerRole["serviceDelivery"] = 15] = "serviceDelivery";
        ExaminerRole[ExaminerRole["superAdministrator"] = 16] = "superAdministrator";
        ExaminerRole[ExaminerRole["seniorTeamLeader"] = 17] = "seniorTeamLeader";
        ExaminerRole[ExaminerRole["principalModerator_Postal"] = 18] = "principalModerator_Postal";
        ExaminerRole[ExaminerRole["autoMarker"] = 19] = "autoMarker";
        ExaminerRole[ExaminerRole["subjectMarker_MFI_H_SSU"] = 20] = "subjectMarker_MFI_H_SSU";
        ExaminerRole[ExaminerRole["autoApprovedSeniorTeamLeader"] = 21] = "autoApprovedSeniorTeamLeader";
        ExaminerRole[ExaminerRole["autoMessaging"] = 22] = "autoMessaging";
        ExaminerRole[ExaminerRole["adminRemarker"] = 23] = "adminRemarker";
        ExaminerRole[ExaminerRole["assistantExaminer_Visiting"] = 24] = "assistantExaminer_Visiting";
    })(Enums.ExaminerRole || (Enums.ExaminerRole = {}));
    var ExaminerRole = Enums.ExaminerRole;
    /**
     * Enum for the Tristate status.
     *
     * @export Tristate
     * @enum {number}
     */
    (function (Tristate) {
        Tristate[Tristate["open"] = 0] = "open";
        Tristate[Tristate["close"] = 1] = "close";
        Tristate[Tristate["notSet"] = 2] = "notSet";
    })(Enums.Tristate || (Enums.Tristate = {}));
    var Tristate = Enums.Tristate;
    /**
     * Enum for the Marking Mode of the Question Paper.
     *
     * @export MarkingMethod
     * @enum {number}
     */
    (function (MarkingMethod) {
        /// <summary>
        /// An enum constant representing the mark from script option.
        /// </summary>
        MarkingMethod[MarkingMethod["MarkFromScript"] = 1] = "MarkFromScript";
        /// <summary>
        /// An enum constant representing the structured option.
        /// </summary>
        MarkingMethod[MarkingMethod["Structured"] = 2] = "Structured";
        /// <summary>
        /// An enum constant representing the unstructured option.
        /// </summary>
        MarkingMethod[MarkingMethod["Unstructured"] = 3] = "Unstructured";
        /// <summary>
        /// An enum constant representing the mark from object option.
        /// </summary>
        MarkingMethod[MarkingMethod["MarkFromObject"] = 4] = "MarkFromObject";
    })(Enums.MarkingMethod || (Enums.MarkingMethod = {}));
    var MarkingMethod = Enums.MarkingMethod;
    /**
     * Enum for different Configurable Characteristic levels
     *
     * @export ConfigurableCharacteristicLevel
     * @enum {number}
     */
    (function (ConfigurableCharacteristicLevel) {
        /// <summary>
        /// An enum constant representing the MarkSchemeGroup level CCs
        /// </summary>
        ConfigurableCharacteristicLevel[ConfigurableCharacteristicLevel["MarkSchemeGroup"] = 0] = "MarkSchemeGroup";
        /// <summary>
        /// An enum constant representing the QuestionPaper level CCs
        /// </summary>
        ConfigurableCharacteristicLevel[ConfigurableCharacteristicLevel["QuestionPaper"] = 1] = "QuestionPaper";
        /// <summary>
        /// An enum constant representing the ExamSession level CCs
        /// </summary>
        ConfigurableCharacteristicLevel[ConfigurableCharacteristicLevel["ExamSession"] = 2] = "ExamSession";
        /// <summary>
        /// An enum constant representing the ExamBody level CCs
        /// </summary>
        ConfigurableCharacteristicLevel[ConfigurableCharacteristicLevel["ExamBody"] = 3] = "ExamBody";
    })(Enums.ConfigurableCharacteristicLevel || (Enums.ConfigurableCharacteristicLevel = {}));
    var ConfigurableCharacteristicLevel = Enums.ConfigurableCharacteristicLevel;
    /**
     * Enum for the different date fields in worklist
     *
     * @export WorkListDateType
     * @enum {number}
     */
    (function (WorkListDateType) {
        WorkListDateType[WorkListDateType["allocatedDate"] = 0] = "allocatedDate";
        WorkListDateType[WorkListDateType["lastUpdatedDate"] = 1] = "lastUpdatedDate";
        WorkListDateType[WorkListDateType["submittedDate"] = 2] = "submittedDate";
    })(Enums.WorkListDateType || (Enums.WorkListDateType = {}));
    var WorkListDateType = Enums.WorkListDateType;
    /**
     * Enum for the different group by fields available
     *
     * @export GroupByField
     * @enum {number}
     */
    (function (GroupByField) {
        GroupByField[GroupByField["session"] = 0] = "session";
        GroupByField[GroupByField["questionPaper"] = 1] = "questionPaper";
        GroupByField[GroupByField["component"] = 2] = "component";
        GroupByField[GroupByField["markingModeId"] = 3] = "markingModeId";
        GroupByField[GroupByField["stampType"] = 4] = "stampType";
        GroupByField[GroupByField["qig"] = 5] = "qig";
    })(Enums.GroupByField || (Enums.GroupByField = {}));
    var GroupByField = Enums.GroupByField;
    /**
     * Enum for the different Worklist Type
     *
     * @export WorklistType
     * @enum {number}
     */
    (function (WorklistType) {
        WorklistType[WorklistType["none"] = 0] = "none";
        WorklistType[WorklistType["live"] = 1] = "live";
        WorklistType[WorklistType["atypical"] = 2] = "atypical";
        WorklistType[WorklistType["simulation"] = 3] = "simulation";
        WorklistType[WorklistType["practice"] = 4] = "practice";
        WorklistType[WorklistType["standardisation"] = 5] = "standardisation";
        WorklistType[WorklistType["secondstandardisation"] = 6] = "secondstandardisation";
        WorklistType[WorklistType["directedRemark"] = 7] = "directedRemark";
        WorklistType[WorklistType["pooledRemark"] = 8] = "pooledRemark";
        WorklistType[WorklistType["classification"] = 9] = "classification";
    })(Enums.WorklistType || (Enums.WorklistType = {}));
    var WorklistType = Enums.WorklistType;
    /**
     * Enum for PreviousMarksColumnType
     *
     * @export PreviousMarksColumnType
     * @enum {number}
     */
    (function (PreviousMarksColumnType) {
        PreviousMarksColumnType[PreviousMarksColumnType["None"] = 0] = "None";
        PreviousMarksColumnType[PreviousMarksColumnType["DirectedRemark"] = 1] = "DirectedRemark";
        PreviousMarksColumnType[PreviousMarksColumnType["Practice"] = 2] = "Practice";
        PreviousMarksColumnType[PreviousMarksColumnType["Standardisation"] = 3] = "Standardisation";
        PreviousMarksColumnType[PreviousMarksColumnType["Secondstandardisation"] = 4] = "Secondstandardisation";
        PreviousMarksColumnType[PreviousMarksColumnType["Seed"] = 5] = "Seed";
        PreviousMarksColumnType[PreviousMarksColumnType["PooledRemark"] = 6] = "PooledRemark";
    })(Enums.PreviousMarksColumnType || (Enums.PreviousMarksColumnType = {}));
    var PreviousMarksColumnType = Enums.PreviousMarksColumnType;
    /**
     * Enum for ResponseStatus
     *
     * @export ResponseStatus
     * @enum {number}
     */
    (function (ResponseStatus) {
        ResponseStatus[ResponseStatus["none"] = 0] = "none";
        ResponseStatus[ResponseStatus["markingInProgress"] = 1] = "markingInProgress";
        ResponseStatus[ResponseStatus["markingNotStarted"] = 2] = "markingNotStarted";
        ResponseStatus[ResponseStatus["hasException"] = 3] = "hasException";
        ResponseStatus[ResponseStatus["readyToSubmit"] = 4] = "readyToSubmit";
        ResponseStatus[ResponseStatus["notAllPagesAnnotated"] = 5] = "notAllPagesAnnotated";
        ResponseStatus[ResponseStatus["markChangeReasonNotExist"] = 6] = "markChangeReasonNotExist";
        ResponseStatus[ResponseStatus["supervisorRemarkDecisionNotSelected"] = 7] = "supervisorRemarkDecisionNotSelected";
        ResponseStatus[ResponseStatus["notAllFilesViewed"] = 8] = "notAllFilesViewed";
        ResponseStatus[ResponseStatus["hasZoningException"] = 9] = "hasZoningException";
        ResponseStatus[ResponseStatus["wholeResponseNotAvailable"] = 10] = "wholeResponseNotAvailable";
        ResponseStatus[ResponseStatus["definitiveMarkingNotStarted"] = 11] = "definitiveMarkingNotStarted";
        ResponseStatus[ResponseStatus["NoViewDefinitivesPermisssion"] = 12] = "NoViewDefinitivesPermisssion";
        ResponseStatus[ResponseStatus["NoPermissionToClassify"] = 13] = "NoPermissionToClassify";
    })(Enums.ResponseStatus || (Enums.ResponseStatus = {}));
    var ResponseStatus = Enums.ResponseStatus;
    /**
     * Enum for different Grid Type
     *
     * @export GridType
     * @enum {number}
     */
    (function (GridType) {
        /// <summary>
        /// An enum constant representing detail view of grid
        /// </summary>
        GridType[GridType["detailed"] = 0] = "detailed";
        /// <summary>
        /// An enum constant representing tiled view of grid
        /// </summary>
        GridType[GridType["tiled"] = 1] = "tiled";
        /// <summary>
        /// An enum constant representing mark by question view of grid
        /// </summary>
        GridType[GridType["markByQuestion"] = 2] = "markByQuestion";
        /// <summary>
        /// An enum constant representing total mark view of grid
        /// </summary>
        GridType[GridType["totalMarks"] = 3] = "totalMarks";
    })(Enums.GridType || (Enums.GridType = {}));
    var GridType = Enums.GridType;
    /**
     * Enum for the different Response modes
     *
     * @export ResponseMode
     * @enum {number}
     */
    (function (ResponseMode) {
        /// <summary>
        /// An enum constant representing open response
        /// </summary>
        ResponseMode[ResponseMode["open"] = 0] = "open";
        /// <summary>
        /// An enum constant representing inGrace response
        /// </summary>
        ResponseMode[ResponseMode["pending"] = 1] = "pending";
        /// <summary>
        /// An enum constant representing closed response
        /// </summary>
        ResponseMode[ResponseMode["closed"] = 2] = "closed";
        /// <summary>
        /// Unknown response mode.
        /// </summary>
        ResponseMode[ResponseMode["none"] = 3] = "none";
    })(Enums.ResponseMode || (Enums.ResponseMode = {}));
    var ResponseMode = Enums.ResponseMode;
    /**
     * Enum for Response allocation error codes
     *
     * @export ResponseAllocationErrorCode
     * @enum {number}
     */
    (function (ResponseAllocationErrorCode) {
        /// <summary>
        /// Response allocated successfully.
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["none"] = 0] = "none";
        /// <summary>
        /// When standardisation is not complete for the selected QIG
        /// AND the marker is not in simulation mode for the QIG
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["standardisationNotComplete"] = 1000] = "standardisationNotComplete";
        /// <summary>
        /// When the Marker's approval status is 'Withdrawn'
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["withdrawnMarker"] = 1001] = "withdrawnMarker";
        /// <summary>
        /// When the Marker's approval status is 'Suspended'
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["suspendedMarker"] = 1002] = "suspendedMarker";
        /// <summary>
        /// When the Marker does not have a target and the session is either 'Closed'
        /// or 'Closed for non-re-markers' for this QIG
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["sessionClosed"] = 1003] = "sessionClosed";
        /// <summary>
        /// When the Marker does not have a target but the session is open for this QIG
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["noMarkingTarget"] = 1004] = "noMarkingTarget";
        /// <summary>
        /// When the number of RIG allocated to the Marker is >= marking target + over allocation limit
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["maximumAllocatedResponseLimitReached"] = 1005] = "maximumAllocatedResponseLimitReached";
        /// <summary>
        /// When the 'Live Marking For Approved Examiners Only' configurable characteristic is turned on for the selected QIG
        /// and the current target for the Marker is 'Live' and the Marker's status is not 'Approved' or 'ApprovedReview'
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["unApprovedMarker"] = 1006] = "unApprovedMarker";
        /// <summary>
        /// When the concurrent limit for the selected QIG is less than or equal to the number of RIGs the Marker currently has open
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["maximumConcurrentResponseLimitReached"] = 1007] = "maximumConcurrentResponseLimitReached";
        /// <summary>
        /// When a whole response marking was requested and no RIG is returned from Assessor
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["noWholeResponseAvailable"] = 1008] = "noWholeResponseAvailable";
        /// <summary>
        /// When no RIG is returned from Assessor
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["noResponseAvailable"] = 1009] = "noResponseAvailable";
        /// <summary>
        /// When a Mark From Paper (MFP) response  was requested and no RIG is returned from Assessor
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["noMFPResponseAvailable"] = 1010] = "noMFPResponseAvailable";
        /// <summary>
        /// When a marker has a Seed target and the Seed Allocation failed.
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["noSeedAvailable"] = 1011] = "noSeedAvailable";
        /// <summary>
        /// The maximum aggregated allocated response limit reached
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["maximumAggregatedAllocatedResponseLimitReached"] = 1012] = "maximumAggregatedAllocatedResponseLimitReached";
        /// <summary>
        /// The maximum aggregated concurrent response limit reached
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["maximumAggregatedConcurrentResponseLimitReached"] = 1013] = "maximumAggregatedConcurrentResponseLimitReached";
        /// <summary>
        /// The concurrent limit not met even after the response allocation request
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["concurrentLimitNotMet"] = 1014] = "concurrentLimitNotMet";
        /// <summary>
        /// The marking limit reached before could download the required number of responses
        /// </summary>
        ResponseAllocationErrorCode[ResponseAllocationErrorCode["markingLimitReached"] = 1015] = "markingLimitReached";
    })(Enums.ResponseAllocationErrorCode || (Enums.ResponseAllocationErrorCode = {}));
    var ResponseAllocationErrorCode = Enums.ResponseAllocationErrorCode;
    /**
     * Enum for Busy Indicator invoker
     *
     * @export BusyIndicatorInvoker
     * @enum {number}
     */
    (function (BusyIndicatorInvoker) {
        /// <summary>
        /// None.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["none"] = 0] = "none";
        /// <summary>
        /// Busy indicator for response allocation.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["responseAllocation"] = 1] = "responseAllocation";
        /// <summary>
        /// Busy indicator for response submit.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["submit"] = 2] = "submit";
        /// <summary>
        /// Busy indicator for submitting all responses.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["submitAll"] = 3] = "submitAll";
        /// <summary>
        /// Busy indicator for save email address.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["saveEmail"] = 4] = "saveEmail";
        /// <summary>
        /// Busy indicator for Loading response.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["loadingResponse"] = 5] = "loadingResponse";
        /// <summary>
        /// Busy indicator for Saving Marks and Annotations.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["savingMarksAndAnnotations"] = 6] = "savingMarksAndAnnotations";
        /// <summary>
        /// Busy indicator for loading typescript modules
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["loadingModules"] = 7] = "loadingModules";
        /// <summary>
        /// Busy indicator for response submit in marking screen.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["submitInResponseScreen"] = 8] = "submitInResponseScreen";
        ///<summary>
        /// Busy indicator for markingCHeck Complete.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["markingCheckComplete"] = 9] = "markingCheckComplete";
        ///<summary>
        /// Busy indicator for loading history details.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["loadingHistoryDetails"] = 10] = "loadingHistoryDetails";
        ///<summary>
        /// Busy indicator for help examiner data for multiqig.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["loadingQigDetailsFromMultiQig"] = 11] = "loadingQigDetailsFromMultiQig";
        ///<summary>
        /// Busy indicator for completing standardisation setup.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["completingStandardisationSetup"] = 12] = "completingStandardisationSetup";
        ///<summary>
        /// Busy indicator for validating standardisation setup.
        /// </summary>
        BusyIndicatorInvoker[BusyIndicatorInvoker["validateStandardisationSetup"] = 13] = "validateStandardisationSetup";
    })(Enums.BusyIndicatorInvoker || (Enums.BusyIndicatorInvoker = {}));
    var BusyIndicatorInvoker = Enums.BusyIndicatorInvoker;
    /**
     * Enum for BackgroundWorkers
     *
     * @export BackgroundWorkers
     * @enum {number}
     */
    (function (BackgroundWorkers) {
        /// <summary>
        /// None.
        /// </summary>
        BackgroundWorkers[BackgroundWorkers["none"] = 0] = "none";
        /// <summary>
        /// Background worker for script download
        /// </summary>
        BackgroundWorkers[BackgroundWorkers["scriptImageDownloader"] = 1] = "scriptImageDownloader";
    })(Enums.BackgroundWorkers || (Enums.BackgroundWorkers = {}));
    var BackgroundWorkers = Enums.BackgroundWorkers;
    /**
     * Submit response Error Codes
     *
     * @export SubmitResponseErrorCode
     * @enum {number}
     */
    (function (SubmitResponseErrorCode) {
        /// <summary>
        /// Response has no validation errors
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["none"] = 0] = "none";
        /// <summary>
        /// Response not opened
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["responseNotOpened"] = 1] = "responseNotOpened";
        /// <summary>
        /// Not fully marked
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["responseNotFullyMarked"] = 2] = "responseNotFullyMarked";
        /// <summary>
        /// Response has Exceptions
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["responseHasExceptions"] = 3] = "responseHasExceptions";
        /// <summary>
        /// Response already submitted
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["responseAlreadySubmitted"] = 4] = "responseAlreadySubmitted";
        /// <summary>
        /// Examiner not approved
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["examinerNotApproved"] = 5] = "examinerNotApproved";
        /// <summary>
        /// Examiner suspended
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["examinerSuspended"] = 6] = "examinerSuspended";
        /// <summary>
        /// Examiner withdrawm
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["examinerWithdrawn"] = 7] = "examinerWithdrawn";
        /// <summary>
        /// All Pages are not annotated
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["allPagesNotAnnotated"] = 8] = "allPagesNotAnnotated";
        /// <summary>
        /// The all slaos not annotated
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["allSLAOsNotAnnotated"] = 9] = "allSLAOsNotAnnotated";
        /// <summary>
        /// Response is put onhold
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["onHold"] = 10] = "onHold";
        /// <summary>
        /// The mandate markscheme not commented
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["mandateMarkschemeNotCommented"] = 11] = "mandateMarkschemeNotCommented";
        /// <summary>
        /// The rig is not found
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["rigNotFound"] = 12] = "rigNotFound";
        /// <summary>
        /// Not all files are viewed
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["notAllFilesViewed"] = 13] = "notAllFilesViewed";
        /// <summary>
        /// Sibling RIG has Zoning Exception
        /// </summary>
        SubmitResponseErrorCode[SubmitResponseErrorCode["hasZoningException"] = 14] = "hasZoningException";
    })(Enums.SubmitResponseErrorCode || (Enums.SubmitResponseErrorCode = {}));
    var SubmitResponseErrorCode = Enums.SubmitResponseErrorCode;
    /**
     * Type of Tools
     *
     * @export ToolType
     * @enum {number}
     */
    (function (ToolType) {
        /// Ruler tool
        ToolType[ToolType["ruler"] = 0] = "ruler";
        /// Protractor Tool
        ToolType[ToolType["protractor"] = 1] = "protractor";
        /// Multi Line Overlay Tool
        ToolType[ToolType["multiline"] = 2] = "multiline";
    })(Enums.ToolType || (Enums.ToolType = {}));
    var ToolType = Enums.ToolType;
    /**
     * Type of Multiline items
     *
     * @export multilineItems
     * @enum {number}
     */
    (function (MultiLineItems) {
        MultiLineItems[MultiLineItems["all"] = 0] = "all";
        MultiLineItems[MultiLineItems["point"] = 1] = "point";
        MultiLineItems[MultiLineItems["line"] = 2] = "line";
    })(Enums.MultiLineItems || (Enums.MultiLineItems = {}));
    var MultiLineItems = Enums.MultiLineItems;
    /**
     * Types of Lines
     *
     * @export LineType
     * @enum {number}
     */
    (function (LineType) {
        /// Line type is none
        LineType[LineType["none"] = 0] = "none";
        /// Line type is Line
        LineType[LineType["line"] = 1] = "line";
        /// Line type is curve
        LineType[LineType["curve"] = 2] = "curve";
    })(Enums.LineType || (Enums.LineType = {}));
    var LineType = Enums.LineType;
    /**
     * Types of Popup Dialogs.
     *
     * @export PopupDialogType
     * @enum {number}
     */
    (function (PopupDialogType) {
        /// <summary>
        /// An enum constant representing Popup Dialog Type.
        /// </summary>
        PopupDialogType[PopupDialogType["none"] = 0] = "none";
        /// <summary>
        /// An enum constant representing popup dialog for response allocation error.
        /// </summary>
        PopupDialogType[PopupDialogType["ResponseAllocationError"] = 1] = "ResponseAllocationError";
        /// <summary>
        /// An enum constant representing popup dialog for standardisation approved.
        /// </summary>
        PopupDialogType[PopupDialogType["StandardisationApproved"] = 2] = "StandardisationApproved";
        /// <summary>
        /// An enum constant representing popup dialog for EmailSave.
        /// </summary>
        PopupDialogType[PopupDialogType["EmailSave"] = 3] = "EmailSave";
        /// <summary>
        /// Validate mark entry
        /// </summary>
        PopupDialogType[PopupDialogType["MarkEntryValidation"] = 4] = "MarkEntryValidation";
        // Detailed Non recoverable error.
        PopupDialogType[PopupDialogType["NonRecoverableDetailedError"] = 5] = "NonRecoverableDetailedError";
        /// <summary>
        /// An enum constant representing popup dialog for which, ForceAnnotationOnEachPage CC is on but all pages are not annotated.
        /// </summary>
        PopupDialogType[PopupDialogType["AllPageNotAnnotated"] = 6] = "AllPageNotAnnotated";
        /// <summary>
        /// Reset Mark
        /// </summary>
        PopupDialogType[PopupDialogType["ResetMark"] = 7] = "ResetMark";
        PopupDialogType[PopupDialogType["LogoutConfirmation"] = 8] = "LogoutConfirmation";
        PopupDialogType[PopupDialogType["MbCReturnToWorklistConfirmation"] = 9] = "MbCReturnToWorklistConfirmation";
        /// <summary>
        /// Quality Feedback
        /// </summary>
        PopupDialogType[PopupDialogType["QualityFeedbackWarning"] = 10] = "QualityFeedbackWarning";
        // <summary>
        /// Accept Quality Feedback
        /// </summary>
        PopupDialogType[PopupDialogType["AcceptQualityFeedback"] = 11] = "AcceptQualityFeedback";
        // <summary>
        /// Grace Period Warning
        /// </summary>
        PopupDialogType[PopupDialogType["GracePeriodWarning"] = 12] = "GracePeriodWarning";
        // <summary>
        /// Grace Period Warning
        /// </summary>
        PopupDialogType[PopupDialogType["MarkChangeReasonError"] = 13] = "MarkChangeReasonError";
        // <summary>
        /// Application offline Warning
        /// </summary>
        PopupDialogType[PopupDialogType["OffLineWarning"] = 14] = "OffLineWarning";
        // <summary>
        /// Forgot Confirmation
        /// </summary>
        PopupDialogType[PopupDialogType["ForgotPasswordConfirmation"] = 15] = "ForgotPasswordConfirmation";
        // <summary>
        /// Remark Created
        /// </summary>
        PopupDialogType[PopupDialogType["RemarkCreated"] = 16] = "RemarkCreated";
        /// <summary>
        /// Already Reviewed Response
        /// </summary>
        PopupDialogType[PopupDialogType["ResponseAlreadyReviewed"] = 17] = "ResponseAlreadyReviewed";
        /// <summary>
        /// error when unlinking a page
        /// </summary>
        PopupDialogType[PopupDialogType["RemoveLinkError"] = 18] = "RemoveLinkError";
        /// <summary>
        /// Unlock Examiner Confirmation Popup
        /// </summary>
        PopupDialogType[PopupDialogType["UnlockExaminerConfirmation"] = 19] = "UnlockExaminerConfirmation";
        /// <summary>
        /// manage slao popup when navigate to frv
        /// </summary>
        PopupDialogType[PopupDialogType["ManageSLAO"] = 20] = "ManageSLAO";
        /// <summary>
        /// unmanage slao flag as seen popup
        /// </summary>
        PopupDialogType[PopupDialogType["UnmanagedSLAOFlagAsSeen"] = 21] = "UnmanagedSLAOFlagAsSeen";
        /// <summary>
        /// Promote to seed confirmation dialogue
        /// </summary>
        PopupDialogType[PopupDialogType["PromoteToSeedConfirmation"] = 22] = "PromoteToSeedConfirmation";
        /// <summary>
        /// Promote to seed declined dialogue
        /// </summary>
        PopupDialogType[PopupDialogType["PromoteToSeedDeclined"] = 23] = "PromoteToSeedDeclined";
        /// <summary>
        /// Reject rig confirmation
        /// </summary>
        PopupDialogType[PopupDialogType["RejectRigConfirmation"] = 24] = "RejectRigConfirmation";
        /// <summary>
        /// Prompt on clicking ComleteMarking Checkbutton
        /// </summary>
        PopupDialogType[PopupDialogType["CompleteMarkingCheck"] = 25] = "CompleteMarkingCheck";
        /// <summary>
        /// All SLAO Managed dialogue
        /// </summary>
        PopupDialogType[PopupDialogType["AllSLAOsManaged"] = 26] = "AllSLAOsManaged";
        /// <summary>
        /// Unmanaging SLAO confirmation
        /// </summary>
        PopupDialogType[PopupDialogType["ReviewOfSLAOConfirmation"] = 27] = "ReviewOfSLAOConfirmation";
        /// <summary>
        /// Promote to seed remark confirmation dialogue
        /// </summary>
        PopupDialogType[PopupDialogType["PromoteToSeedRemarkConfirmation"] = 28] = "PromoteToSeedRemarkConfirmation";
        /// <summary>
        /// Generic Message dialogue
        /// </summary>
        PopupDialogType[PopupDialogType["GenericMessage"] = 29] = "GenericMessage";
        /// <summary>
        /// Offline warning on container change and bundles not loaded
        /// </summary>
        PopupDialogType[PopupDialogType["OffLineWarningOnContainerFailure"] = 30] = "OffLineWarningOnContainerFailure";
        /// <summary>
        /// Simulation Response Submit Confirmation Dialog
        /// </summary>
        PopupDialogType[PopupDialogType["SimulationResponseSubmitConfirmation"] = 31] = "SimulationResponseSubmitConfirmation";
        /// <summary>
        /// Simulatino exited popup
        /// </summary>
        PopupDialogType[PopupDialogType["SimulationExited"] = 32] = "SimulationExited";
        /// <summary>
        /// From Exception panel.
        /// </summary>
        PopupDialogType[PopupDialogType["Exception"] = 33] = "Exception";
        /// <summary>
        /// From Message panel.
        /// </summary>
        PopupDialogType[PopupDialogType["Message"] = 34] = "Message";
        /// <summary>
        /// From submit panel
        /// </summary>
        PopupDialogType[PopupDialogType["SubmitResponseError"] = 35] = "SubmitResponseError";
        /// <summary>
        /// unknown content flag as seen popup
        /// </summary>
        PopupDialogType[PopupDialogType["UnknownContentFlagAsSeen"] = 36] = "UnknownContentFlagAsSeen";
        /// <summary>
        /// From share context menu
        /// </summary>
        PopupDialogType[PopupDialogType["ShareConfirmationPopup"] = 37] = "ShareConfirmationPopup";
        /// <summary>
        /// unknown content review confirmation
        /// </summary>
        PopupDialogType[PopupDialogType["ReviewOfUnknownContentConfirmation"] = 38] = "ReviewOfUnknownContentConfirmation";
        /// <summary>
        /// confirmation for whole response remark creation
        /// </summary>
        PopupDialogType[PopupDialogType["WholeResponseRemarkConfirmation"] = 39] = "WholeResponseRemarkConfirmation";
        /// <summary>
        /// Declassify popup type
        /// </summary>
        PopupDialogType[PopupDialogType["Declassify"] = 40] = "Declassify";
        /// <summary>
        /// Declassify popup type
        /// </summary>
        PopupDialogType[PopupDialogType["CompleteStandardisationPopup"] = 41] = "CompleteStandardisationPopup";
        /// <summary>
        /// Reclassify error popup type
        /// </summary>
        PopupDialogType[PopupDialogType["ReclassifyError"] = 42] = "ReclassifyError";
        /// <summary>
        /// Discard response error popup type
        /// </summary>
        PopupDialogType[PopupDialogType["DiscardResponse"] = 43] = "DiscardResponse";
    })(Enums.PopupDialogType || (Enums.PopupDialogType = {}));
    var PopupDialogType = Enums.PopupDialogType;
    /**
     * Enums for ResponseViewMode
     *
     * @export ResponseViewMode
     * @enum {number}
     */
    (function (ResponseViewMode) {
        // Default view
        ResponseViewMode[ResponseViewMode["none"] = 0] = "none";
        // Full Response View
        ResponseViewMode[ResponseViewMode["fullResponseView"] = 1] = "fullResponseView";
        // Zoned View
        ResponseViewMode[ResponseViewMode["zoneView"] = 2] = "zoneView";
    })(Enums.ResponseViewMode || (Enums.ResponseViewMode = {}));
    var ResponseViewMode = Enums.ResponseViewMode;
    /**
     * Enums for OperationMode
     *
     * @export OperationMode
     * @enum {number}
     */
    (function (OperationMode) {
        /* Default value */
        OperationMode[OperationMode["none"] = 0] = "none";
        /* An enum constant representing Edit operation. */
        OperationMode[OperationMode["edit"] = 1] = "edit";
        /* An enum constant representing normal operation. */
        OperationMode[OperationMode["normal"] = 2] = "normal";
    })(Enums.OperationMode || (Enums.OperationMode = {}));
    var OperationMode = Enums.OperationMode;
    /**
     * enum for representing different directions.
     *
     * @export ResponseNavigation
     * @enum {number}
     */
    (function (ResponseNavigation) {
        // enum for specific response
        ResponseNavigation[ResponseNavigation["specific"] = 0] = "specific";
        //enum for previous response
        ResponseNavigation[ResponseNavigation["previous"] = 1] = "previous";
        //enum for next response
        ResponseNavigation[ResponseNavigation["next"] = 2] = "next";
        // enum for navigation from markscheme panel
        ResponseNavigation[ResponseNavigation["markScheme"] = 3] = "markScheme";
        // enum for first response
        ResponseNavigation[ResponseNavigation["first"] = 4] = "first";
        // none of the above
        ResponseNavigation[ResponseNavigation["none"] = 5] = "none";
    })(Enums.ResponseNavigation || (Enums.ResponseNavigation = {}));
    var ResponseNavigation = Enums.ResponseNavigation;
    /**
     * Enums for TreeViewItemType
     *
     * @export TreeViewItemType
     * @enum {number}
     */
    (function (TreeViewItemType) {
        /// The whole response
        TreeViewItemType[TreeViewItemType["wholeResponse"] = 0] = "wholeResponse";
        /// The QIG
        TreeViewItemType[TreeViewItemType["QIG"] = 1] = "QIG";
        /// The cluster
        TreeViewItemType[TreeViewItemType["cluster"] = 2] = "cluster";
        ///The answer item
        TreeViewItemType[TreeViewItemType["answerItem"] = 3] = "answerItem";
        /// The mark scheme
        TreeViewItemType[TreeViewItemType["marksScheme"] = 4] = "marksScheme";
    })(Enums.TreeViewItemType || (Enums.TreeViewItemType = {}));
    var TreeViewItemType = Enums.TreeViewItemType;
    /**
     * Enums for MarkTypeVariety
     *
     * @export
     * @enum {number}
     */
    (function (MarkTypeVariety) {
        // Standard
        MarkTypeVariety[MarkTypeVariety["standard"] = 0] = "standard";
        // Additional mark
        MarkTypeVariety[MarkTypeVariety["additionalMark"] = 1] = "additionalMark";
    })(Enums.MarkTypeVariety || (Enums.MarkTypeVariety = {}));
    var MarkTypeVariety = Enums.MarkTypeVariety;
    /**
     * Different stamp types
     *
     * @export StampType
     * @enum {number}
     */
    (function (StampType) {
        // None
        StampType[StampType["none"] = 0] = "none";
        // Image
        StampType[StampType["image"] = 1] = "image";
        // Dynamic
        StampType[StampType["dynamic"] = 2] = "dynamic";
        // Text
        StampType[StampType["text"] = 3] = "text";
        // Tools
        StampType[StampType["tools"] = 4] = "tools";
        // Bookmark
        StampType[StampType["bookmark"] = 5] = "bookmark";
    })(Enums.StampType || (Enums.StampType = {}));
    var StampType = Enums.StampType;
    /**
     *  enum for priority
     *
     * @export Priority
     * @enum {number}
     */
    (function (Priority) {
        // first priority
        Priority[Priority["First"] = 1] = "First";
        // second priority
        Priority[Priority["Second"] = 2] = "Second";
        // third priority
        Priority[Priority["Third"] = 3] = "Third";
        // fourth priority
        Priority[Priority["Fourth"] = 4] = "Fourth";
        // fifth priority
        Priority[Priority["Fifth"] = 5] = "Fifth";
    })(Enums.Priority || (Enums.Priority = {}));
    var Priority = Enums.Priority;
    /**
     * Enum for MarkRuleType
     *
     * @export MarkRuleType
     * @enum {number}
     */
    (function (MarkRuleType) {
        MarkRuleType[MarkRuleType["default"] = 0] = "default";
    })(Enums.MarkRuleType || (Enums.MarkRuleType = {}));
    var MarkRuleType = Enums.MarkRuleType;
    /**
     * enum for AccuracyRuleType
     *
     * @export AccuracyRuleType
     * @enum {number}
     */
    (function (AccuracyRuleType) {
        AccuracyRuleType[AccuracyRuleType["default"] = 0] = "default";
        AccuracyRuleType[AccuracyRuleType["markschemetolerance"] = 1] = "markschemetolerance";
        AccuracyRuleType[AccuracyRuleType["specificmarktolerance"] = 2] = "specificmarktolerance";
    })(Enums.AccuracyRuleType || (Enums.AccuracyRuleType = {}));
    var AccuracyRuleType = Enums.AccuracyRuleType;
    /**
     * enum for Favorite Stamp Action
     *
     * @export FavoriteStampActionType
     * @enum {number}
     */
    (function (FavoriteStampActionType) {
        FavoriteStampActionType[FavoriteStampActionType["None"] = 0] = "None";
        FavoriteStampActionType[FavoriteStampActionType["Add"] = 1] = "Add";
        FavoriteStampActionType[FavoriteStampActionType["Remove"] = 2] = "Remove";
        FavoriteStampActionType[FavoriteStampActionType["LoadFromUserOption"] = 3] = "LoadFromUserOption";
        FavoriteStampActionType[FavoriteStampActionType["Insert"] = 4] = "Insert";
    })(Enums.FavoriteStampActionType || (Enums.FavoriteStampActionType = {}));
    var FavoriteStampActionType = Enums.FavoriteStampActionType;
    /**
     *  enums for the key event type
     *
     * @export KeyMode
     * @enum {number}
     */
    (function (KeyMode) {
        // Indicating key down
        KeyMode[KeyMode["down"] = 1] = "down";
        // Indicating keypress
        KeyMode[KeyMode["press"] = 2] = "press";
        // Indicating keyUp
        KeyMode[KeyMode["up"] = 2] = "up";
    })(Enums.KeyMode || (Enums.KeyMode = {}));
    var KeyMode = Enums.KeyMode;
    /**
     * enum for identifying the key code.
     *
     * @export KeyCode
     * @enum {number}
     */
    (function (KeyCode) {
        // backspace key
        KeyCode[KeyCode["backspace"] = 8] = "backspace";
        // handling enter key
        KeyCode[KeyCode["enter"] = 13] = "enter";
        // left key
        KeyCode[KeyCode["left"] = 37] = "left";
        // up arrow key
        KeyCode[KeyCode["up"] = 38] = "up";
        // right arrow key
        KeyCode[KeyCode["right"] = 39] = "right";
        // down arrow key
        KeyCode[KeyCode["down"] = 40] = "down";
        // delete key
        KeyCode[KeyCode["delete"] = 46] = "delete";
        // NR key short cut
        KeyCode[KeyCode["hash"] = 35] = "hash";
        // NR short cut
        KeyCode[KeyCode["forwardSlash"] = 47] = "forwardSlash";
        // Tab key
        KeyCode[KeyCode["tab"] = 9] = "tab";
    })(Enums.KeyCode || (Enums.KeyCode = {}));
    var KeyCode = Enums.KeyCode;
    /**
     * enum for specifying the full response view image view option
     *
     * @export FullResponeViewOption
     * @enum {number}
     */
    (function (FullResponeViewOption) {
        // One page view
        FullResponeViewOption[FullResponeViewOption["onePage"] = 1] = "onePage";
        // Two page view
        FullResponeViewOption[FullResponeViewOption["twoPage"] = 2] = "twoPage";
        // Four page view
        FullResponeViewOption[FullResponeViewOption["fourPage"] = 4] = "fourPage";
    })(Enums.FullResponeViewOption || (Enums.FullResponeViewOption = {}));
    var FullResponeViewOption = Enums.FullResponeViewOption;
    /**
     *  Enum for specifying the cursor type when drawing over the cursor.
     *
     * @export CursorType
     * @enum {number}
     */
    (function (CursorType) {
        // Cursor type for pan action.
        CursorType[CursorType["Pan"] = 1] = "Pan";
        // Cursor type for select action.
        CursorType[CursorType["Select"] = 2] = "Select";
    })(Enums.CursorType || (Enums.CursorType = {}));
    var CursorType = Enums.CursorType;
    /**
     * enum for row status
     *
     * @export MarkingOperation
     * @enum {number}
     */
    (function (MarkingOperation) {
        MarkingOperation[MarkingOperation["none"] = 0] = "none";
        // new row
        MarkingOperation[MarkingOperation["added"] = 1] = "added";
        // updated row
        MarkingOperation[MarkingOperation["updated"] = 2] = "updated";
        // deleted row
        MarkingOperation[MarkingOperation["deleted"] = 3] = "deleted";
    })(Enums.MarkingOperation || (Enums.MarkingOperation = {}));
    var MarkingOperation = Enums.MarkingOperation;
    /**
     * enum for context menu types.
     *
     * @export ContextMenuType
     * @enum {number}
     */
    (function (ContextMenuType) {
        // annotation
        ContextMenuType[ContextMenuType["annotation"] = 0] = "annotation";
        // bookmark
        ContextMenuType[ContextMenuType["bookMark"] = 1] = "bookMark";
        // acetate
        ContextMenuType[ContextMenuType["acetate"] = 2] = "acetate";
    })(Enums.ContextMenuType || (Enums.ContextMenuType = {}));
    var ContextMenuType = Enums.ContextMenuType;
    /**
     * Enum for SaveAndNavigate options
     *
     * @export SaveAndNavigate
     * @enum {number}
     */
    (function (SaveAndNavigate) {
        SaveAndNavigate[SaveAndNavigate["none"] = 0] = "none";
        /* Navigating to another response */
        SaveAndNavigate[SaveAndNavigate["toResponse"] = 1] = "toResponse";
        /* Navigating from response to worklist */
        SaveAndNavigate[SaveAndNavigate["toWorklist"] = 2] = "toWorklist";
        /* Navigating from response to logout */
        SaveAndNavigate[SaveAndNavigate["toLogout"] = 3] = "toLogout";
        /* Navigating from response to full response view */
        SaveAndNavigate[SaveAndNavigate["toFullResponseview"] = 4] = "toFullResponseview";
        /* Navigating back to the current response */
        SaveAndNavigate[SaveAndNavigate["toCurrentResponse"] = 5] = "toCurrentResponse";
        /* Navigate to worklist using browser back button */
        SaveAndNavigate[SaveAndNavigate["toWorklistUsingBackButton"] = 6] = "toWorklistUsingBackButton";
        /* Navigate to last response */
        SaveAndNavigate[SaveAndNavigate["lastResponse"] = 7] = "lastResponse";
        /* Navigate to inbox message page */
        SaveAndNavigate[SaveAndNavigate["toInboxMessagePage"] = 8] = "toInboxMessagePage";
        /* Navigating when submitting the response from markscheme */
        SaveAndNavigate[SaveAndNavigate["submit"] = 9] = "submit";
        /* Display Message in the currentResponse */
        SaveAndNavigate[SaveAndNavigate["messageWithInResponse"] = 10] = "messageWithInResponse";
        /* Display when new message button is clicked */
        SaveAndNavigate[SaveAndNavigate["newMessageButtonClick"] = 11] = "newMessageButtonClick";
        /* Display when reply button is clicked */
        SaveAndNavigate[SaveAndNavigate["toReplyMessage"] = 12] = "toReplyMessage";
        /* Display when forward button is clicked */
        SaveAndNavigate[SaveAndNavigate["toForwardMessage"] = 13] = "toForwardMessage";
        /*Clicking acceptFeedback button*/
        SaveAndNavigate[SaveAndNavigate["fromQualityFeedback"] = 14] = "fromQualityFeedback";
        /* Display when new exception button is clicked */
        SaveAndNavigate[SaveAndNavigate["newExceptionButtonClick"] = 15] = "newExceptionButtonClick";
        /* Display Exception in the currentResponse */
        SaveAndNavigate[SaveAndNavigate["exceptionWithInResponse"] = 16] = "exceptionWithInResponse";
        /* Display response message screen when new message button clicked */
        SaveAndNavigate[SaveAndNavigate["toNewResponseMessageCompose"] = 17] = "toNewResponseMessageCompose";
        /* Display qig selector screen when logo is clicked */
        SaveAndNavigate[SaveAndNavigate["toQigSelector"] = 18] = "toQigSelector";
        /* Display menu screen when menu icon is clicked */
        SaveAndNavigate[SaveAndNavigate["toMenu"] = 19] = "toMenu";
        /* Display team details when team link is clicked*/
        SaveAndNavigate[SaveAndNavigate["toTeam"] = 20] = "toTeam";
        /* navigate to next response when setAsReviewed button is clicked*/
        SaveAndNavigate[SaveAndNavigate["toSetAsReviewed"] = 21] = "toSetAsReviewed";
        /* navigate to next response when mark Now button is clicked*/
        SaveAndNavigate[SaveAndNavigate["toSupervisorRemark"] = 22] = "toSupervisorRemark";
        /* navigate to next response when promote to seed button is clicked*/
        SaveAndNavigate[SaveAndNavigate["toPromoteToSeed"] = 23] = "toPromoteToSeed";
        /* navigates to marking check worklist */
        SaveAndNavigate[SaveAndNavigate["toMarkingCheckWorklist"] = 24] = "toMarkingCheckWorklist";
        /* Displays when raise an exception from error dialog is clicked */
        SaveAndNavigate[SaveAndNavigate["newExceptionFromMediaErrorDialog"] = 25] = "newExceptionFromMediaErrorDialog";
        /* Navigating to select responses tab in standardisation setup */
        SaveAndNavigate[SaveAndNavigate["toSelectResponses"] = 26] = "toSelectResponses";
        /* Navigating to provisional tab in standardisation setup */
        SaveAndNavigate[SaveAndNavigate["toProvisional"] = 27] = "toProvisional";
        /* Navigating to un-classified tab in standardisation setup */
        SaveAndNavigate[SaveAndNavigate["toUnclassified"] = 28] = "toUnclassified";
        /* Navigating to classified tab in standardisation setup */
        SaveAndNavigate[SaveAndNavigate["toClassified"] = 29] = "toClassified";
    })(Enums.SaveAndNavigate || (Enums.SaveAndNavigate = {}));
    var SaveAndNavigate = Enums.SaveAndNavigate;
    /**
     * enum for marks and annotations error code.
     *
     * @export SaveMarksAndAnnotationErrorCode
     * @enum {number}
     */
    (function (SaveMarksAndAnnotationErrorCode) {
        // Marks and annotations saved successfully.
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["None"] = 0] = "None";
        // Marks and annotations cannot be saved as response is closed.
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["ClosedResponse"] = 1] = "ClosedResponse";
        // Marks and annotations cannot be saved as the specified marks and annotations are out of date.
        // version changes.
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["MarksAndAnnotationsOutOfDate"] = 2] = "MarksAndAnnotationsOutOfDate";
        // Marks and annotations cannot be retrieved as response is Withdrawn.
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["WithdrawnResponse"] = 3] = "WithdrawnResponse";
        // All Pages are not annotated
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["AllPagesNotAnnotated"] = 4] = "AllPagesNotAnnotated";
        // Mismatch in Marks And Annotations
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["MarksAndAnnotationsMismatch"] = 5] = "MarksAndAnnotationsMismatch";
        // The stamps modified during the log in time
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["StampsModified"] = 6] = "StampsModified";
        // The mandate markscheme not commented
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["MandateMarkschemeNotCommented"] = 7] = "MandateMarkschemeNotCommented";
        // The non recoverable error
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["NonRecoverableError"] = 8] = "NonRecoverableError";
        // The un allocated response
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["UnallocatedResponse"] = 9] = "UnallocatedResponse";
        // If response is promoted as seed for STM members
        SaveMarksAndAnnotationErrorCode[SaveMarksAndAnnotationErrorCode["ResponseRemoved"] = 10] = "ResponseRemoved";
    })(Enums.SaveMarksAndAnnotationErrorCode || (Enums.SaveMarksAndAnnotationErrorCode = {}));
    var SaveMarksAndAnnotationErrorCode = Enums.SaveMarksAndAnnotationErrorCode;
    /**
     * Enum for the type of action initiated to add annotation.
     *
     * @export AddAnnotationAction
     * @enum {number}
     */
    (function (AddAnnotationAction) {
        // Add annotation by stamping.
        AddAnnotationAction[AddAnnotationAction["Stamping"] = 1] = "Stamping";
        // Add annotation by pan action.
        AddAnnotationAction[AddAnnotationAction["Pan"] = 2] = "Pan";
    })(Enums.AddAnnotationAction || (Enums.AddAnnotationAction = {}));
    var AddAnnotationAction = Enums.AddAnnotationAction;
    /**
     * Enum for specifying the pan source; source from where pan action was initiated.
     *
     * @export PanSource
     * @enum {number}
     */
    (function (PanSource) {
        // Pan source is stamp panel.
        PanSource[PanSource["StampPanel"] = 1] = "StampPanel";
        // Pan source is annotation overlay.
        PanSource[PanSource["AnnotationOverlay"] = 2] = "AnnotationOverlay";
    })(Enums.PanSource || (Enums.PanSource = {}));
    var PanSource = Enums.PanSource;
    /**
     *  enum for the Triggering points of Save Marks and Annotations Queue
     *
     * @export SaveMarksAndAnnotationsProcessingTriggerPoint
     * @enum {number}
     */
    (function (SaveMarksAndAnnotationsProcessingTriggerPoint) {
        // None
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["None"] = 0] = "None";
        // Saving of marks and annotations is triggered by closing of the response
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["CloseResponse"] = 1] = "CloseResponse";
        // Saving of marks and annotations is triggered by logout from the application
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["Logout"] = 2] = "Logout";
        // Saving of marks and annotations is triggered by the background worker itself which polls the queue at constant intervals
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["BackgroundWorker"] = 4] = "BackgroundWorker";
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["Inbox"] = 5] = "Inbox";
        SaveMarksAndAnnotationsProcessingTriggerPoint[SaveMarksAndAnnotationsProcessingTriggerPoint["Submit"] = 6] = "Submit";
    })(Enums.SaveMarksAndAnnotationsProcessingTriggerPoint || (Enums.SaveMarksAndAnnotationsProcessingTriggerPoint = {}));
    var SaveMarksAndAnnotationsProcessingTriggerPoint = Enums.SaveMarksAndAnnotationsProcessingTriggerPoint;
    /**
     * enum for the MarksAndAnnotationsQueueOperation
     *
     * @export MarksAndAnnotationsQueueOperation
     * @enum {number}
     */
    (function (MarksAndAnnotationsQueueOperation) {
        // None
        MarksAndAnnotationsQueueOperation[MarksAndAnnotationsQueueOperation["None"] = 0] = "None";
        // Removing from the queue
        MarksAndAnnotationsQueueOperation[MarksAndAnnotationsQueueOperation["Remove"] = 1] = "Remove";
        // Re-queueing to the queue
        MarksAndAnnotationsQueueOperation[MarksAndAnnotationsQueueOperation["Requeue"] = 2] = "Requeue";
        // increment retry count and enqueue
        MarksAndAnnotationsQueueOperation[MarksAndAnnotationsQueueOperation["Retry"] = 3] = "Retry";
    })(Enums.MarksAndAnnotationsQueueOperation || (Enums.MarksAndAnnotationsQueueOperation = {}));
    var MarksAndAnnotationsQueueOperation = Enums.MarksAndAnnotationsQueueOperation;
    /**
     * enum for the different DataServiceRequestErrorType
     *
     * @export DataServiceRequestErrorType
     * @enum {number}
     */
    (function (DataServiceRequestErrorType) {
        // None
        DataServiceRequestErrorType[DataServiceRequestErrorType["None"] = 0] = "None";
        // The request failed due to a generic error
        DataServiceRequestErrorType[DataServiceRequestErrorType["GenericError"] = 1] = "GenericError";
        // The request couldn't be processed because of ongoing priority requests
        DataServiceRequestErrorType[DataServiceRequestErrorType["Skipped"] = 2] = "Skipped";
        // The request didn't succeed because authorisation failed (say, Cookie got expired)
        DataServiceRequestErrorType[DataServiceRequestErrorType["Unauthorized"] = 3] = "Unauthorized";
        // The request is not completed due to network issue.
        DataServiceRequestErrorType[DataServiceRequestErrorType["NetworkError"] = 4] = "NetworkError";
    })(Enums.DataServiceRequestErrorType || (Enums.DataServiceRequestErrorType = {}));
    var DataServiceRequestErrorType = Enums.DataServiceRequestErrorType;
    /**
     * enum for Stamp Banner Type
     *
     * @export
     * @enum {number}
     */
    (function (BannerType) {
        BannerType[BannerType["None"] = 0] = "None";
        BannerType[BannerType["CustomizeToolBarBanner"] = 1] = "CustomizeToolBarBanner";
        BannerType[BannerType["ShrinkExpandedBanner"] = 2] = "ShrinkExpandedBanner";
        BannerType[BannerType["QualityFeedbackBanner"] = 3] = "QualityFeedbackBanner";
        BannerType[BannerType["HelperMessageWithClose"] = 4] = "HelperMessageWithClose";
        BannerType[BannerType["CompleteStdSetupBanner"] = 5] = "CompleteStdSetupBanner";
    })(Enums.BannerType || (Enums.BannerType = {}));
    var BannerType = Enums.BannerType;
    /**
     * This will returns the enum string.
     *
     * @export getEnumString
     * @param {*} aEnum
     * @param {*} aKey
     * @returns {string}
     */
    function getEnumString(aEnum, aKey) {
        return aEnum[aKey];
    }
    Enums.getEnumString = getEnumString;
    /**
     * enum for identifying the Dynamic Annotations.
     *
     * @export DynamicAnnotation
     * @enum {number}
     */
    (function (DynamicAnnotation) {
        // Not applicable
        DynamicAnnotation[DynamicAnnotation["None"] = 0] = "None";
        // Highlighter component
        DynamicAnnotation[DynamicAnnotation["Highlighter"] = 151] = "Highlighter";
        // Horizontal Line Component
        DynamicAnnotation[DynamicAnnotation["HorizontalLine"] = 1361] = "HorizontalLine";
        // Ellipse Component
        DynamicAnnotation[DynamicAnnotation["Ellipse"] = 1351] = "Ellipse";
        // OnpageComment
        DynamicAnnotation[DynamicAnnotation["OnPageComment"] = 171] = "OnPageComment";
        //Horizontal Wavy Line Component
        DynamicAnnotation[DynamicAnnotation["HWavyLine"] = 1371] = "HWavyLine";
        //Vertical Wavy Line Component
        DynamicAnnotation[DynamicAnnotation["VWavyLine"] = 1381] = "VWavyLine";
        // OffPage Comments
        DynamicAnnotation[DynamicAnnotation["OffPageComment"] = 181] = "OffPageComment";
    })(Enums.DynamicAnnotation || (Enums.DynamicAnnotation = {}));
    var DynamicAnnotation = Enums.DynamicAnnotation;
    /**
     * enum for identifying the edge while resizing.
     *
     * @export AnnotationBorderType
     * @enum {number}
     */
    (function (AnnotationBorderType) {
        AnnotationBorderType[AnnotationBorderType["RightEdge"] = 0] = "RightEdge";
        AnnotationBorderType[AnnotationBorderType["BottomEdge"] = 1] = "BottomEdge";
        AnnotationBorderType[AnnotationBorderType["LeftEdge"] = 2] = "LeftEdge";
        AnnotationBorderType[AnnotationBorderType["TopEdge"] = 3] = "TopEdge";
        AnnotationBorderType[AnnotationBorderType["TopLeft"] = 4] = "TopLeft";
        AnnotationBorderType[AnnotationBorderType["BottomLeft"] = 5] = "BottomLeft";
        AnnotationBorderType[AnnotationBorderType["TopRight"] = 6] = "TopRight";
        AnnotationBorderType[AnnotationBorderType["BottomRight"] = 7] = "BottomRight";
        AnnotationBorderType[AnnotationBorderType["Default"] = 8] = "Default";
    })(Enums.AnnotationBorderType || (Enums.AnnotationBorderType = {}));
    var AnnotationBorderType = Enums.AnnotationBorderType;
    /**
     * enum for identifying the user action in context menu.
     *
     * @export MenuAction
     * @enum {number}
     */
    (function (MenuAction) {
        MenuAction[MenuAction["RemoveAnnotation"] = 0] = "RemoveAnnotation";
        MenuAction[MenuAction["ChangeAnnotationColor"] = 1] = "ChangeAnnotationColor";
        MenuAction[MenuAction["RemoveOverlay"] = 2] = "RemoveOverlay";
        MenuAction[MenuAction["RemoveMultilinePoint"] = 3] = "RemoveMultilinePoint";
        MenuAction[MenuAction["RemoveMultilineLine"] = 4] = "RemoveMultilineLine";
        MenuAction[MenuAction["AddMultilinePoint"] = 5] = "AddMultilinePoint";
        MenuAction[MenuAction["AddMultilineLine"] = 6] = "AddMultilineLine";
        MenuAction[MenuAction["StraightLine"] = 7] = "StraightLine";
        MenuAction[MenuAction["CurvedLine"] = 8] = "CurvedLine";
        MenuAction[MenuAction["HiddenLine"] = 9] = "HiddenLine";
        MenuAction[MenuAction["AddOverlay"] = 10] = "AddOverlay";
        MenuAction[MenuAction["ChangeColorOverlay"] = 11] = "ChangeColorOverlay";
        MenuAction[MenuAction["LineStyleOverlay"] = 12] = "LineStyleOverlay";
        MenuAction[MenuAction["MultilineRed"] = 13] = "MultilineRed";
        MenuAction[MenuAction["MultilineBlue"] = 14] = "MultilineBlue";
        MenuAction[MenuAction["MultilineGreen"] = 15] = "MultilineGreen";
        MenuAction[MenuAction["MultilineYellow"] = 16] = "MultilineYellow";
        MenuAction[MenuAction["MultilineBlack"] = 17] = "MultilineBlack";
        MenuAction[MenuAction["MultilinePink"] = 18] = "MultilinePink";
    })(Enums.MenuAction || (Enums.MenuAction = {}));
    var MenuAction = Enums.MenuAction;
    /**
     *  enum for identifying CC Settings for color change.
     *
     * @export ConfigurableCharacteristicsColorStatus
     * @enum {number}
     */
    (function (ConfigurableCharacteristicsColorStatus) {
        ConfigurableCharacteristicsColorStatus[ConfigurableCharacteristicsColorStatus["On"] = 0] = "On";
        ConfigurableCharacteristicsColorStatus[ConfigurableCharacteristicsColorStatus["Off"] = 1] = "Off";
    })(Enums.ConfigurableCharacteristicsColorStatus || (Enums.ConfigurableCharacteristicsColorStatus = {}));
    var ConfigurableCharacteristicsColorStatus = Enums.ConfigurableCharacteristicsColorStatus;
    /**
     * enum for identifying CC Settings for highlighter color change.
     *
     * @export ConfigurableCharacteristicsHighlighterColorStatus
     * @enum {number}
     */
    (function (ConfigurableCharacteristicsHighlighterColorStatus) {
        ConfigurableCharacteristicsHighlighterColorStatus[ConfigurableCharacteristicsHighlighterColorStatus["No"] = 0] = "No";
        ConfigurableCharacteristicsHighlighterColorStatus[ConfigurableCharacteristicsHighlighterColorStatus["Yes"] = 1] = "Yes";
    })(Enums.ConfigurableCharacteristicsHighlighterColorStatus || (Enums.ConfigurableCharacteristicsHighlighterColorStatus = {}));
    var ConfigurableCharacteristicsHighlighterColorStatus = Enums.ConfigurableCharacteristicsHighlighterColorStatus;
    /**
     * enum for identifying the user selection of response view zoom settings.
     *
     * @export ResponseViewSettings
     * @enum {number}
     */
    (function (ResponseViewSettings) {
        ResponseViewSettings[ResponseViewSettings["RotateAntiClockwise"] = 0] = "RotateAntiClockwise";
        ResponseViewSettings[ResponseViewSettings["RotateClockwise"] = 1] = "RotateClockwise";
        ResponseViewSettings[ResponseViewSettings["FitToWidth"] = 2] = "FitToWidth";
        ResponseViewSettings[ResponseViewSettings["FitToHeight"] = 3] = "FitToHeight";
        ResponseViewSettings[ResponseViewSettings["SetFracsDataForRotation"] = 4] = "SetFracsDataForRotation";
        ResponseViewSettings[ResponseViewSettings["CustomZoom"] = 5] = "CustomZoom";
    })(Enums.ResponseViewSettings || (Enums.ResponseViewSettings = {}));
    var ResponseViewSettings = Enums.ResponseViewSettings;
    /**
     * enum for identifying the rotate angle.
     *
     * @export RotateAngle
     * @enum {number}
     */
    (function (RotateAngle) {
        RotateAngle[RotateAngle["Rotate_0"] = 0] = "Rotate_0";
        RotateAngle[RotateAngle["Rotate_90"] = 90] = "Rotate_90";
        RotateAngle[RotateAngle["Rotate_180"] = 180] = "Rotate_180";
        RotateAngle[RotateAngle["Rotate_270"] = 270] = "Rotate_270";
        RotateAngle[RotateAngle["Rotate_360"] = 360] = "Rotate_360";
    })(Enums.RotateAngle || (Enums.RotateAngle = {}));
    var RotateAngle = Enums.RotateAngle;
    /**
     * enum for identifying the accuracy indicator type.
     *
     * @export AccuracyIndicatorType
     * @enum {number}
     */
    (function (AccuracyIndicatorType) {
        AccuracyIndicatorType[AccuracyIndicatorType["Unknown"] = 0] = "Unknown";
        AccuracyIndicatorType[AccuracyIndicatorType["Accurate"] = 1] = "Accurate";
        AccuracyIndicatorType[AccuracyIndicatorType["WithinTolerance"] = 11] = "WithinTolerance";
        AccuracyIndicatorType[AccuracyIndicatorType["OutsideTolerance"] = 21] = "OutsideTolerance";
        AccuracyIndicatorType[AccuracyIndicatorType["AccurateNR"] = 31] = "AccurateNR";
        AccuracyIndicatorType[AccuracyIndicatorType["WithinToleranceNR"] = 41] = "WithinToleranceNR";
        AccuracyIndicatorType[AccuracyIndicatorType["OutsideToleranceNR"] = 51] = "OutsideToleranceNR";
    })(Enums.AccuracyIndicatorType || (Enums.AccuracyIndicatorType = {}));
    var AccuracyIndicatorType = Enums.AccuracyIndicatorType;
    /**
     * enums for identifying the flow of markschemepanel when the user select the markscheme.
     *
     * @export MarkSchemeNavigationDirection
     * @enum {number}
     */
    (function (MarkSchemeNavigationDirection) {
        MarkSchemeNavigationDirection[MarkSchemeNavigationDirection["Forward"] = 0] = "Forward";
        MarkSchemeNavigationDirection[MarkSchemeNavigationDirection["Backward"] = 1] = "Backward";
    })(Enums.MarkSchemeNavigationDirection || (Enums.MarkSchemeNavigationDirection = {}));
    var MarkSchemeNavigationDirection = Enums.MarkSchemeNavigationDirection;
    /**
     * enums for identifying type of mark difference
     *
     * @export MarksDifferenceType
     * @enum {number}
     */
    (function (MarksDifferenceType) {
        MarksDifferenceType[MarksDifferenceType["None"] = 0] = "None";
        MarksDifferenceType[MarksDifferenceType["AbsoluteMarksDifference"] = 1] = "AbsoluteMarksDifference";
        MarksDifferenceType[MarksDifferenceType["TotalMarksDifference"] = 2] = "TotalMarksDifference";
    })(Enums.MarksDifferenceType || (Enums.MarksDifferenceType = {}));
    var MarksDifferenceType = Enums.MarksDifferenceType;
    /**
     * enums for Seed type
     *
     * @export SeedType
     * @enum {number}
     */
    (function (SeedType) {
        SeedType[SeedType["None"] = 0] = "None";
        SeedType[SeedType["Gold"] = 15] = "Gold";
        SeedType[SeedType["EUR"] = 31] = "EUR";
    })(Enums.SeedType || (Enums.SeedType = {}));
    var SeedType = Enums.SeedType;
    /**
     * enums for quality feedback status
     *
     * @export QualityFeedbackStatus
     * @enum {number}
     */
    (function (QualityFeedbackStatus) {
        QualityFeedbackStatus[QualityFeedbackStatus["None"] = 0] = "None";
        QualityFeedbackStatus[QualityFeedbackStatus["FeedbackOutstanding"] = 1] = "FeedbackOutstanding";
        QualityFeedbackStatus[QualityFeedbackStatus["FeedbackAccepted"] = 2] = "FeedbackAccepted";
    })(Enums.QualityFeedbackStatus || (Enums.QualityFeedbackStatus = {}));
    var QualityFeedbackStatus = Enums.QualityFeedbackStatus;
    /**
     * enums for identifying type of add action.
     *
     * @export AddAction
     * @enum {number}
     */
    (function (AddAction) {
        AddAction[AddAction["DrawStart"] = 0] = "DrawStart";
        AddAction[AddAction["DrawMove"] = 1] = "DrawMove";
        AddAction[AddAction["DrawEnd"] = 2] = "DrawEnd";
    })(Enums.AddAction || (Enums.AddAction = {}));
    var AddAction = Enums.AddAction;
    /**
     * Enum for Seed Submission Status
     *
     * @export SeedSubmissionStatus
     * @enum {number}
     */
    (function (SeedSubmissionStatus) {
        /// <summary>
        /// The not applicable
        /// </summary>
        SeedSubmissionStatus[SeedSubmissionStatus["NotApplicable"] = 0] = "NotApplicable";
        /// <summary>
        /// The seeds submitted within tolerance or accurately
        /// </summary>
        SeedSubmissionStatus[SeedSubmissionStatus["SeedsSubmittedWithinToleranceOrAccurately"] = 1] = "SeedsSubmittedWithinToleranceOrAccurately";
        /// <summary>
        /// The seeds submitted out of tolerance
        /// </summary>
        SeedSubmissionStatus[SeedSubmissionStatus["SeedsSubmittedOutOfTolerance"] = 2] = "SeedsSubmittedOutOfTolerance";
    })(Enums.SeedSubmissionStatus || (Enums.SeedSubmissionStatus = {}));
    var SeedSubmissionStatus = Enums.SeedSubmissionStatus;
    /**
     * possible errors that come when user tries to navigate away from response
     *
     * @export ResponseNavigateFailureReason
     * @enum {number}
     */
    (function (ResponseNavigateFailureReason) {
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["None"] = 0] = "None";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["MarksMissingInGracePeriodResponse"] = 1] = "MarksMissingInGracePeriodResponse";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AllPagesNotAnnotated"] = 2] = "AllPagesNotAnnotated";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AllPagesNotAnnotatedInGrace"] = 3] = "AllPagesNotAnnotatedInGrace";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["UnSentMessage"] = 4] = "UnSentMessage";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["MarkChangeReasonNeeded"] = 5] = "MarkChangeReasonNeeded";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["UnSavedException"] = 6] = "UnSavedException";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["LastResponseLastQuestion"] = 7] = "LastResponseLastQuestion";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AllSlaosNotAnnotated"] = 8] = "AllSlaosNotAnnotated";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AllSlaosNotAnnotatedInGrace"] = 9] = "AllSlaosNotAnnotatedInGrace";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AllMarkedAsNR"] = 10] = "AllMarkedAsNR";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["SuperVisorRemarkDecisionNeeded"] = 11] = "SuperVisorRemarkDecisionNeeded";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AtleastOneNRWithoutOptionality"] = 12] = "AtleastOneNRWithoutOptionality";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AtleastOneNRWithOptionalityUsedInTotal"] = 13] = "AtleastOneNRWithOptionalityUsedInTotal";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["AtleastOneNRWithOptionalityNotUsedInTotal"] = 14] = "AtleastOneNRWithOptionalityNotUsedInTotal";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["StandardisationSetupCompletedWhileInSimulation"] = 15] = "StandardisationSetupCompletedWhileInSimulation";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["UnSavedEnhancedOffPageComment"] = 16] = "UnSavedEnhancedOffPageComment";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["NotAllFilesViewed"] = 17] = "NotAllFilesViewed";
        ResponseNavigateFailureReason[ResponseNavigateFailureReason["FileDownloadedOutside"] = 18] = "FileDownloadedOutside";
    })(Enums.ResponseNavigateFailureReason || (Enums.ResponseNavigateFailureReason = {}));
    var ResponseNavigateFailureReason = Enums.ResponseNavigateFailureReason;
    /**
     * enum for message priority
     *
     * @export MessagePriority
     * @enum {number}
     */
    (function (MessagePriority) {
        MessagePriority[MessagePriority["Standard"] = 1] = "Standard";
        MessagePriority[MessagePriority["Important"] = 2] = "Important";
        MessagePriority[MessagePriority["Mandatory"] = 3] = "Mandatory";
    })(Enums.MessagePriority || (Enums.MessagePriority = {}));
    var MessagePriority = Enums.MessagePriority;
    /**
     * Enum for the Read status of Message
     *
     * @export MessageReadStatus
     * @enum {number}
     */
    (function (MessageReadStatus) {
        MessageReadStatus[MessageReadStatus["New"] = 1] = "New";
        MessageReadStatus[MessageReadStatus["Read"] = 2] = "Read";
        MessageReadStatus[MessageReadStatus["Closed"] = 3] = "Closed";
    })(Enums.MessageReadStatus || (Enums.MessageReadStatus = {}));
    var MessageReadStatus = Enums.MessageReadStatus;
    /**
     * enum for message open and close actions
     *
     * @export MessageViewAction
     * @enum {number}
     */
    (function (MessageViewAction) {
        MessageViewAction[MessageViewAction["None"] = 0] = "None";
        MessageViewAction[MessageViewAction["Open"] = 1] = "Open";
        MessageViewAction[MessageViewAction["Close"] = 2] = "Close";
        MessageViewAction[MessageViewAction["Minimize"] = 3] = "Minimize";
        MessageViewAction[MessageViewAction["Maximize"] = 4] = "Maximize";
        MessageViewAction[MessageViewAction["NavigateAway"] = 5] = "NavigateAway";
        MessageViewAction[MessageViewAction["View"] = 6] = "View";
        MessageViewAction[MessageViewAction["Delete"] = 7] = "Delete";
    })(Enums.MessageViewAction || (Enums.MessageViewAction = {}));
    var MessageViewAction = Enums.MessageViewAction;
    /**
     * enum for various popup types
     *
     * @export PopUpType
     * @enum {number}
     */
    (function (PopUpType) {
        PopUpType[PopUpType["None"] = 0] = "None";
        PopUpType[PopUpType["DiscardMessage"] = 1] = "DiscardMessage";
        PopUpType[PopUpType["DiscardMessageNavigateAway"] = 2] = "DiscardMessageNavigateAway";
        PopUpType[PopUpType["DiscardOnNewMessageButtonClick"] = 3] = "DiscardOnNewMessageButtonClick";
        PopUpType[PopUpType["MandatoryMessage"] = 4] = "MandatoryMessage";
        PopUpType[PopUpType["DiscardException"] = 5] = "DiscardException";
        PopUpType[PopUpType["DiscardExceptionNavigateAway"] = 6] = "DiscardExceptionNavigateAway";
        PopUpType[PopUpType["DiscardOnNewExceptionButtonClick"] = 7] = "DiscardOnNewExceptionButtonClick";
        PopUpType[PopUpType["DeleteMessage"] = 8] = "DeleteMessage";
        PopUpType[PopUpType["DiscardExceptionOnViewExceptionButtonClick"] = 9] = "DiscardExceptionOnViewExceptionButtonClick";
        PopUpType[PopUpType["DiscardMessageOnViewExceptionButtonClick"] = 10] = "DiscardMessageOnViewExceptionButtonClick";
        PopUpType[PopUpType["DiscardExceptionOnNewMessage"] = 11] = "DiscardExceptionOnNewMessage";
        PopUpType[PopUpType["DiscardExceptionOnViewMessage"] = 12] = "DiscardExceptionOnViewMessage";
        PopUpType[PopUpType["DiscardMessageOnNewException"] = 13] = "DiscardMessageOnNewException";
        PopUpType[PopUpType["CloseException"] = 14] = "CloseException";
        PopUpType[PopUpType["RemarkCreationSuccess"] = 15] = "RemarkCreationSuccess";
        PopUpType[PopUpType["NoMarkingCheckRequestPossible"] = 16] = "NoMarkingCheckRequestPossible";
        PopUpType[PopUpType["MultiQigHelpExaminerNavigation"] = 17] = "MultiQigHelpExaminerNavigation";
        PopUpType[PopUpType["ZoningExceptionWarning"] = 18] = "ZoningExceptionWarning";
        PopUpType[PopUpType["SelectToMarkAsProvisional"] = 19] = "SelectToMarkAsProvisional";
        PopUpType[PopUpType["AtypicalSearch"] = 20] = "AtypicalSearch";
        PopUpType[PopUpType["Declassify"] = 21] = "Declassify";
        PopUpType[PopUpType["CompleteStandardisationSetup"] = 22] = "CompleteStandardisationSetup";
        PopUpType[PopUpType["CompleteStandardisationValidate"] = 23] = "CompleteStandardisationValidate";
        PopUpType[PopUpType["MarkAsDefinitive"] = 24] = "MarkAsDefinitive";
        PopUpType[PopUpType["Reclassify"] = 25] = "Reclassify";
        PopUpType[PopUpType["ReclassifyMultiOption"] = 26] = "ReclassifyMultiOption";
        PopUpType[PopUpType["ShareResponse"] = 27] = "ShareResponse";
    })(Enums.PopUpType || (Enums.PopUpType = {}));
    var PopUpType = Enums.PopUpType;
    /**
     * enums for the popup size in CSS
     */
    (function (PopupSize) {
        PopupSize[PopupSize["None"] = 0] = "None";
        PopupSize[PopupSize["Small"] = 1] = "Small";
        PopupSize[PopupSize["Medium"] = 2] = "Medium";
        PopupSize[PopupSize["Large"] = 3] = "Large";
    })(Enums.PopupSize || (Enums.PopupSize = {}));
    var PopupSize = Enums.PopupSize;
    /**
     * enum for button types
     *
     * @export ButtonType
     * @enum {number}
     */
    (function (ButtonType) {
        ButtonType[ButtonType["None"] = 0] = "None";
        ButtonType[ButtonType["Sampling"] = 1] = "Sampling";
        ButtonType[ButtonType["SetAsReviewed"] = 2] = "SetAsReviewed";
    })(Enums.ButtonType || (Enums.ButtonType = {}));
    var ButtonType = Enums.ButtonType;
    /**
     * enum for popup action types
     *
     * @export PopUpActionType
     * @enum {number}
     */
    (function (PopUpActionType) {
        PopUpActionType[PopUpActionType["Show"] = 0] = "Show";
        PopUpActionType[PopUpActionType["Yes"] = 1] = "Yes";
        PopUpActionType[PopUpActionType["No"] = 2] = "No";
        PopUpActionType[PopUpActionType["Close"] = 3] = "Close";
        PopUpActionType[PopUpActionType["Ok"] = 4] = "Ok";
    })(Enums.PopUpActionType || (Enums.PopUpActionType = {}));
    var PopUpActionType = Enums.PopUpActionType;
    /**
     * Defines zoom types
     *
     * @export ZoomType
     * @enum {number}
     */
    (function (ZoomType) {
        ZoomType[ZoomType["None"] = 0] = "None";
        ZoomType[ZoomType["PinchStart"] = 1] = "PinchStart";
        ZoomType[ZoomType["Pinch"] = 2] = "Pinch";
        ZoomType[ZoomType["PinchEnd"] = 3] = "PinchEnd";
        ZoomType[ZoomType["CustomZoomIn"] = 4] = "CustomZoomIn";
        ZoomType[ZoomType["CustomZoomOut"] = 5] = "CustomZoomOut";
        ZoomType[ZoomType["PinchOut"] = 6] = "PinchOut";
        ZoomType[ZoomType["PinchIn"] = 7] = "PinchIn";
        ZoomType[ZoomType["UserInput"] = 8] = "UserInput";
    })(Enums.ZoomType || (Enums.ZoomType = {}));
    var ZoomType = Enums.ZoomType;
    /**
     * Defines zoom preferences
     *
     * @export ZoomPreference
     * @enum {number}
     */
    (function (ZoomPreference) {
        ZoomPreference[ZoomPreference["FitWidth"] = 0] = "FitWidth";
        ZoomPreference[ZoomPreference["FitHeight"] = 1] = "FitHeight";
        ZoomPreference[ZoomPreference["Percentage"] = 2] = "Percentage";
        ZoomPreference[ZoomPreference["MarkschemePercentage"] = 3] = "MarkschemePercentage";
        ZoomPreference[ZoomPreference["FilePercentage"] = 4] = "FilePercentage";
        ZoomPreference[ZoomPreference["None"] = 5] = "None";
    })(Enums.ZoomPreference || (Enums.ZoomPreference = {}));
    var ZoomPreference = Enums.ZoomPreference;
    /**
     *  enum for drawing annotation direction.
     *
     * @export DrawDirection
     * @enum {number}
     */
    (function (DrawDirection) {
        DrawDirection[DrawDirection["Left"] = 0] = "Left";
        DrawDirection[DrawDirection["Right"] = 1] = "Right";
        DrawDirection[DrawDirection["Top"] = 2] = "Top";
        DrawDirection[DrawDirection["Bottom"] = 3] = "Bottom";
    })(Enums.DrawDirection || (Enums.DrawDirection = {}));
    var DrawDirection = Enums.DrawDirection;
    /**
     * enum for message folder types
     *
     * @export MessageFolderType
     * @enum {number}
     */
    (function (MessageFolderType) {
        MessageFolderType[MessageFolderType["Inbox"] = 0] = "Inbox";
        MessageFolderType[MessageFolderType["Sent"] = 1] = "Sent";
        MessageFolderType[MessageFolderType["Deleted"] = 2] = "Deleted";
        MessageFolderType[MessageFolderType["None"] = 3] = "None";
    })(Enums.MessageFolderType || (Enums.MessageFolderType = {}));
    var MessageFolderType = Enums.MessageFolderType;
    /**
     * different dropdown types in compose message panel
     *
     * @export DropDownType
     * @enum {number}
     */
    (function (DropDownType) {
        DropDownType[DropDownType["Priority"] = 0] = "Priority";
        DropDownType[DropDownType["QIG"] = 1] = "QIG";
        DropDownType[DropDownType["EnhancedOffPageCommentQuestionItem"] = 2] = "EnhancedOffPageCommentQuestionItem";
        DropDownType[DropDownType["EnhancedOffPageCommentFile"] = 3] = "EnhancedOffPageCommentFile";
    })(Enums.DropDownType || (Enums.DropDownType = {}));
    var DropDownType = Enums.DropDownType;
    /**
     * enum for different message types
     *
     * @export MessageType
     * @enum {number}
     */
    (function (MessageType) {
        MessageType[MessageType["None"] = 0] = "None";
        MessageType[MessageType["ResponseCompose"] = 1] = "ResponseCompose";
        MessageType[MessageType["ResponseDetails"] = 2] = "ResponseDetails";
        MessageType[MessageType["InboxCompose"] = 3] = "InboxCompose";
        MessageType[MessageType["WorklistCompose"] = 4] = "WorklistCompose";
        MessageType[MessageType["InboxForward"] = 5] = "InboxForward";
        MessageType[MessageType["InboxReply"] = 6] = "InboxReply";
        MessageType[MessageType["ResponseDelete"] = 7] = "ResponseDelete";
        MessageType[MessageType["ResponseReply"] = 8] = "ResponseReply";
        MessageType[MessageType["ResponseForward"] = 9] = "ResponseForward";
        MessageType[MessageType["TeamCompose"] = 10] = "TeamCompose";
    })(Enums.MessageType || (Enums.MessageType = {}));
    var MessageType = Enums.MessageType;
    /**
     * enum for message actions
     *
     * @export MessageAction
     * @enum {number}
     */
    (function (MessageAction) {
        MessageAction[MessageAction["Reply"] = 1] = "Reply";
        MessageAction[MessageAction["Forward"] = 2] = "Forward";
        MessageAction[MessageAction["Delete"] = 3] = "Delete";
    })(Enums.MessageAction || (Enums.MessageAction = {}));
    var MessageAction = Enums.MessageAction;
    /**
     *  enum for different exception status
     *
     * @export ExceptionStatus
     * @enum {number}
     */
    (function (ExceptionStatus) {
        ExceptionStatus[ExceptionStatus["None"] = 0] = "None";
        ExceptionStatus[ExceptionStatus["Open"] = 1] = "Open";
        ExceptionStatus[ExceptionStatus["Delayed"] = 2] = "Delayed";
        ExceptionStatus[ExceptionStatus["Resolved"] = 3] = "Resolved";
        ExceptionStatus[ExceptionStatus["Closed"] = 4] = "Closed";
        ExceptionStatus[ExceptionStatus["Rejected"] = 5] = "Rejected";
    })(Enums.ExceptionStatus || (Enums.ExceptionStatus = {}));
    var ExceptionStatus = Enums.ExceptionStatus;
    /**
     *  enum for different exception type.
     *
     * @export ExceptionType
     * @enum {number}
     */
    (function (ExceptionType) {
        ExceptionType[ExceptionType["ImageRescanRequest"] = 2] = "ImageRescanRequest";
        ExceptionType[ExceptionType["IncorrectQuestionPaper"] = 6] = "IncorrectQuestionPaper";
        ExceptionType[ExceptionType["ConcatenatedScriptException"] = 10] = "ConcatenatedScriptException";
        ExceptionType[ExceptionType["ImageCannotBeAccessedOrRead"] = 14] = "ImageCannotBeAccessedOrRead";
        ExceptionType[ExceptionType["IncorrectComponentOrPaper"] = 12] = "IncorrectComponentOrPaper";
        ExceptionType[ExceptionType["NonScriptObject"] = 13] = "NonScriptObject";
        ExceptionType[ExceptionType["ZoningErrorMissingContent"] = 18] = "ZoningErrorMissingContent";
        ExceptionType[ExceptionType["ZoningErrorOtherContent"] = 19] = "ZoningErrorOtherContent";
        ExceptionType[ExceptionType["IncorrectImage"] = 26] = "IncorrectImage";
    })(Enums.ExceptionType || (Enums.ExceptionType = {}));
    var ExceptionType = Enums.ExceptionType;
    /**
     * enum for different panel width type
     *
     * @export markSchemePanelType
     * @enum {number}
     */
    (function (markSchemePanelType) {
        markSchemePanelType[markSchemePanelType["defaultPanel"] = 0] = "defaultPanel";
        markSchemePanelType[markSchemePanelType["resizedPanel"] = 1] = "resizedPanel";
        markSchemePanelType[markSchemePanelType["minimumWidthPanel"] = 2] = "minimumWidthPanel";
        markSchemePanelType[markSchemePanelType["resizingClassName"] = 3] = "resizingClassName";
        markSchemePanelType[markSchemePanelType["updateDefaultPanel"] = 4] = "updateDefaultPanel";
    })(Enums.markSchemePanelType || (Enums.markSchemePanelType = {}));
    var markSchemePanelType = Enums.markSchemePanelType;
    /**
     * Enum for different footer types
     *
     * @export FooterType
     * @enum {number}
     */
    (function (FooterType) {
        // enum for login footer
        FooterType[FooterType["Login"] = 0] = "Login";
        // enum for worklist footer
        FooterType[FooterType["Worklist"] = 1] = "Worklist";
        // enum for response footer
        FooterType[FooterType["Response"] = 2] = "Response";
        //enum for inbox footer
        FooterType[FooterType["Message"] = 3] = "Message";
        //enum for team management footer
        FooterType[FooterType["TeamManagement"] = 4] = "TeamManagement";
        // enum for reports footer
        FooterType[FooterType["Reports"] = 5] = "Reports";
        //enum for standardisation setup
        FooterType[FooterType["StandardisationSetup"] = 6] = "StandardisationSetup";
        //enum for awarding
        FooterType[FooterType["Awarding"] = 7] = "Awarding";
    })(Enums.FooterType || (Enums.FooterType = {}));
    var FooterType = Enums.FooterType;
    /**
     *  enum for the Triggering points
     *
     * @export TriggerPoint
     * @enum {number}
     */
    (function (TriggerPoint) {
        // None
        TriggerPoint[TriggerPoint["None"] = 0] = "None";
        // worklist
        TriggerPoint[TriggerPoint["Worklist"] = 1] = "Worklist";
        // Qig selector
        TriggerPoint[TriggerPoint["QigSelector"] = 2] = "QigSelector";
        // response
        TriggerPoint[TriggerPoint["Response"] = 3] = "Response";
        // logout
        TriggerPoint[TriggerPoint["Logout"] = 4] = "Logout";
        // worklist response message icon click
        TriggerPoint[TriggerPoint["WorkListResponseMessageIcon"] = 5] = "WorkListResponseMessageIcon";
        // firing directly from message store
        TriggerPoint[TriggerPoint["MessageStore"] = 6] = "MessageStore";
        // triggering point is background pulse
        TriggerPoint[TriggerPoint["BackgroundPulse"] = 7] = "BackgroundPulse";
        // worklist response Exception icon click
        TriggerPoint[TriggerPoint["WorkListResponseExceptionIcon"] = 8] = "WorkListResponseExceptionIcon";
        // DisplayId click in message
        TriggerPoint[TriggerPoint["AssociatedDisplayIDFromMessage"] = 9] = "AssociatedDisplayIDFromMessage";
        // Supervisor Remark Created
        TriggerPoint[TriggerPoint["SupervisorRemark"] = 10] = "SupervisorRemark";
    })(Enums.TriggerPoint || (Enums.TriggerPoint = {}));
    var TriggerPoint = Enums.TriggerPoint;
    /**
     * MessageNavigation
     *
     * @export MessageNavigation
     * @enum {number}
     */
    (function (MessageNavigation) {
        MessageNavigation[MessageNavigation["none"] = 0] = "none";
        MessageNavigation[MessageNavigation["toResponse"] = 1] = "toResponse";
        MessageNavigation[MessageNavigation["toQigSelector"] = 2] = "toQigSelector";
        MessageNavigation[MessageNavigation["toSearchedResponse"] = 3] = "toSearchedResponse";
        MessageNavigation[MessageNavigation["newException"] = 4] = "newException";
        MessageNavigation[MessageNavigation["exceptionWithInResponse"] = 5] = "exceptionWithInResponse";
        // Change the status of the Examiner
        MessageNavigation[MessageNavigation["ChangeStatus"] = 9] = "ChangeStatus";
        /* navigates to marking check worklist */
        MessageNavigation[MessageNavigation["toMarkingCheckWorklist"] = 24] = "toMarkingCheckWorklist";
        /* Displays when raise an exception from error dialog is clicked */
        MessageNavigation[MessageNavigation["newExceptionFromMediaErrorDialog"] = 25] = "newExceptionFromMediaErrorDialog";
    })(Enums.MessageNavigation || (Enums.MessageNavigation = {}));
    var MessageNavigation = Enums.MessageNavigation;
    /**
     * enum for message open and close actions
     *
     * @export ExceptionViewAction
     * @enum {number}
     */
    (function (ExceptionViewAction) {
        ExceptionViewAction[ExceptionViewAction["None"] = 0] = "None";
        ExceptionViewAction[ExceptionViewAction["Open"] = 1] = "Open";
        ExceptionViewAction[ExceptionViewAction["Close"] = 2] = "Close";
        ExceptionViewAction[ExceptionViewAction["Minimize"] = 3] = "Minimize";
        ExceptionViewAction[ExceptionViewAction["Maximize"] = 4] = "Maximize";
        ExceptionViewAction[ExceptionViewAction["NavigateAway"] = 5] = "NavigateAway";
        ExceptionViewAction[ExceptionViewAction["View"] = 6] = "View";
    })(Enums.ExceptionViewAction || (Enums.ExceptionViewAction = {}));
    var ExceptionViewAction = Enums.ExceptionViewAction;
    /**
     * enum for escalation point
     *
     * @export EscalationPoint
     * @enum {number}
     */
    (function (EscalationPoint) {
        EscalationPoint[EscalationPoint["None"] = 1] = "None";
        EscalationPoint[EscalationPoint["Parent"] = 2] = "Parent";
        EscalationPoint[EscalationPoint["AdminAdAccount"] = 3] = "AdminAdAccount";
        EscalationPoint[EscalationPoint["SdAdAccount"] = 4] = "SdAdAccount";
        EscalationPoint[EscalationPoint["ScanAdAccount"] = 5] = "ScanAdAccount";
        EscalationPoint[EscalationPoint["PrincipalExaminer"] = 6] = "PrincipalExaminer";
        EscalationPoint[EscalationPoint["CandidateConcerns"] = 7] = "CandidateConcerns";
        EscalationPoint[EscalationPoint["ZoningSupervisor"] = 8] = "ZoningSupervisor";
    })(Enums.EscalationPoint || (Enums.EscalationPoint = {}));
    var EscalationPoint = Enums.EscalationPoint;
    /**
     * Enum for status type
     *
     * @export StatusType
     * @enum {number}
     */
    (function (StatusType) {
        StatusType[StatusType["None"] = 0] = "None";
        StatusType[StatusType["New"] = 1] = "New";
        StatusType[StatusType["Read"] = 2] = "Read";
        StatusType[StatusType["Closed"] = 3] = "Closed";
    })(Enums.StatusType || (Enums.StatusType = {}));
    var StatusType = Enums.StatusType;
    /**
     * Enum for mark entry deactivator
     *
     * @export MarkEntryDeactivator
     * @enum {number}
     */
    (function (MarkEntryDeactivator) {
        MarkEntryDeactivator[MarkEntryDeactivator["None"] = 0] = "None";
        MarkEntryDeactivator[MarkEntryDeactivator["Login"] = 1] = "Login";
        MarkEntryDeactivator[MarkEntryDeactivator["Comment"] = 2] = "Comment";
        MarkEntryDeactivator[MarkEntryDeactivator["MarksChangeReason"] = 4] = "MarksChangeReason";
        MarkEntryDeactivator[MarkEntryDeactivator["Messaging"] = 8] = "Messaging";
        MarkEntryDeactivator[MarkEntryDeactivator["Exception"] = 16] = "Exception";
        MarkEntryDeactivator[MarkEntryDeactivator["ApplicationPopup"] = 32] = "ApplicationPopup";
        MarkEntryDeactivator[MarkEntryDeactivator["EmailAddress"] = 64] = "EmailAddress";
        MarkEntryDeactivator[MarkEntryDeactivator["TriggerSave"] = 128] = "TriggerSave";
        MarkEntryDeactivator[MarkEntryDeactivator["Annotation"] = 256] = "Annotation";
        MarkEntryDeactivator[MarkEntryDeactivator["CombinedWarningMessagePopup"] = 512] = "CombinedWarningMessagePopup";
        MarkEntryDeactivator[MarkEntryDeactivator["Menu"] = 1024] = "Menu";
        MarkEntryDeactivator[MarkEntryDeactivator["RejectRigConfirmationPopUp"] = 2048] = "RejectRigConfirmationPopUp";
        MarkEntryDeactivator[MarkEntryDeactivator["EnhancedOffPageComments"] = 4096] = "EnhancedOffPageComments";
        MarkEntryDeactivator[MarkEntryDeactivator["OffPageComments"] = 8192] = "OffPageComments";
        MarkEntryDeactivator[MarkEntryDeactivator["Bookmark"] = 16384] = "Bookmark";
        MarkEntryDeactivator[MarkEntryDeactivator["MarkingOverlay"] = 32768] = "MarkingOverlay";
        MarkEntryDeactivator[MarkEntryDeactivator["Note"] = 65536] = "Note";
    })(Enums.MarkEntryDeactivator || (Enums.MarkEntryDeactivator = {}));
    var MarkEntryDeactivator = Enums.MarkEntryDeactivator;
    /**
     * enum for Exam body message types
     *
     * @export SystemMessage
     * @enum {number}
     */
    (function (SystemMessage) {
        SystemMessage[SystemMessage["None"] = 0] = "None";
        SystemMessage[SystemMessage["AutoApprovedMarker"] = 1] = "AutoApprovedMarker";
        SystemMessage[SystemMessage["AutoApprovedReviewer"] = 2] = "AutoApprovedReviewer";
        SystemMessage[SystemMessage["AutoApprovedSystem"] = 3] = "AutoApprovedSystem";
        SystemMessage[SystemMessage["ConditionallyApprovedMarker"] = 4] = "ConditionallyApprovedMarker";
        SystemMessage[SystemMessage["ConditionallyApprovedReviewer"] = 5] = "ConditionallyApprovedReviewer";
        SystemMessage[SystemMessage["ConditionallyApprovedSystem"] = 6] = "ConditionallyApprovedSystem";
        SystemMessage[SystemMessage["AutoSuspendMarker"] = 7] = "AutoSuspendMarker";
        SystemMessage[SystemMessage["AutoSuspendReviewer"] = 8] = "AutoSuspendReviewer";
        SystemMessage[SystemMessage["RefreshQuestionPaperStructure"] = 9] = "RefreshQuestionPaperStructure";
        SystemMessage[SystemMessage["CheckMyMarks"] = 10] = "CheckMyMarks";
        SystemMessage[SystemMessage["MarksChecked"] = 11] = "MarksChecked";
        SystemMessage[SystemMessage["RemarkRequestedCompleted"] = 12] = "RemarkRequestedCompleted";
        SystemMessage[SystemMessage["RefreshMarkingTargets"] = 13] = "RefreshMarkingTargets";
        SystemMessage[SystemMessage["GracePeriodUpdate"] = 14] = "GracePeriodUpdate";
        SystemMessage[SystemMessage["AutomaticSamplingCompleted"] = 15] = "AutomaticSamplingCompleted";
        SystemMessage[SystemMessage["ZoningExceptionRaised"] = 16] = "ZoningExceptionRaised";
        SystemMessage[SystemMessage["ZoningExceptionResolved"] = 17] = "ZoningExceptionResolved";
        SystemMessage[SystemMessage["IndirectSubordinateStatusUpdate"] = 18] = "IndirectSubordinateStatusUpdate";
        SystemMessage[SystemMessage["AutomatedMarkerMessage"] = 19] = "AutomatedMarkerMessage";
        SystemMessage[SystemMessage["LockedExaminerWithDrawn"] = 20] = "LockedExaminerWithDrawn";
        SystemMessage[SystemMessage["RIGRemoved"] = 21] = "RIGRemoved";
        SystemMessage[SystemMessage["MarkingInstructionUpdated"] = 22] = "MarkingInstructionUpdated";
        SystemMessage[SystemMessage["DeAllocationRemarkResponseRemoved"] = 23] = "DeAllocationRemarkResponseRemoved";
        SystemMessage[SystemMessage["CandidateFeedUpdated"] = 24] = "CandidateFeedUpdated";
        SystemMessage[SystemMessage["MarkingInstructionUploaded"] = 25] = "MarkingInstructionUploaded";
        SystemMessage[SystemMessage["RemarkDeleted"] = 26] = "RemarkDeleted";
        SystemMessage[SystemMessage["TakeResponse"] = 27] = "TakeResponse";
    })(Enums.SystemMessage || (Enums.SystemMessage = {}));
    var SystemMessage = Enums.SystemMessage;
    /**
     * exception actionType
     *
     * @export ExceptionActionType
     * @enum {number}
     */
    (function (ExceptionActionType) {
        ExceptionActionType[ExceptionActionType["Escalate"] = 0] = "Escalate";
        ExceptionActionType[ExceptionActionType["Resolve"] = 1] = "Resolve";
        ExceptionActionType[ExceptionActionType["Close"] = 2] = "Close";
    })(Enums.ExceptionActionType || (Enums.ExceptionActionType = {}));
    var ExceptionActionType = Enums.ExceptionActionType;
    /**
     * SortDirection
     *
     * @export SortDirection
     * @enum {number}
     */
    (function (SortDirection) {
        SortDirection[SortDirection["Ascending"] = 0] = "Ascending";
        SortDirection[SortDirection["Descending"] = 1] = "Descending";
    })(Enums.SortDirection || (Enums.SortDirection = {}));
    var SortDirection = Enums.SortDirection;
    /**
     * Enum for TeamManagement
     *
     * @export TeamManagement
     * @enum {number}
     */
    (function (TeamManagement) {
        TeamManagement[TeamManagement["None"] = 0] = "None";
        TeamManagement[TeamManagement["MyTeam"] = 1] = "MyTeam";
        TeamManagement[TeamManagement["HelpExaminers"] = 2] = "HelpExaminers";
        TeamManagement[TeamManagement["Exceptions"] = 3] = "Exceptions";
    })(Enums.TeamManagement || (Enums.TeamManagement = {}));
    var TeamManagement = Enums.TeamManagement;
    /**
     * Enum for Awarding View Type
     *
     * @export AwardingViewType
     * @enum {number}
     */
    (function (AwardingViewType) {
        AwardingViewType[AwardingViewType["Grade"] = 1] = "Grade";
        AwardingViewType[AwardingViewType["Totalmark"] = 2] = "Totalmark";
    })(Enums.AwardingViewType || (Enums.AwardingViewType = {}));
    var AwardingViewType = Enums.AwardingViewType;
    /**
     * Enum for Standardisation
     *
     * @export StandardisationSetup
     * @enum {number}
     */
    (function (StandardisationSetup) {
        StandardisationSetup[StandardisationSetup["None"] = 0] = "None";
        StandardisationSetup[StandardisationSetup["SelectResponse"] = 1] = "SelectResponse";
        StandardisationSetup[StandardisationSetup["ProvisionalResponse"] = 2] = "ProvisionalResponse";
        StandardisationSetup[StandardisationSetup["UnClassifiedResponse"] = 3] = "UnClassifiedResponse";
        StandardisationSetup[StandardisationSetup["ClassifiedResponse"] = 4] = "ClassifiedResponse";
    })(Enums.StandardisationSetup || (Enums.StandardisationSetup = {}));
    var StandardisationSetup = Enums.StandardisationSetup;
    /**
     *  Enum page containers
     *
     * @export PageContainers
     * @enum {number}
     */
    (function (PageContainers) {
        PageContainers[PageContainers["None"] = 0] = "None";
        PageContainers[PageContainers["Login"] = 1] = "Login";
        PageContainers[PageContainers["QigSelector"] = 2] = "QigSelector";
        PageContainers[PageContainers["WorkList"] = 3] = "WorkList";
        PageContainers[PageContainers["Response"] = 4] = "Response";
        PageContainers[PageContainers["Message"] = 5] = "Message";
        PageContainers[PageContainers["TeamManagement"] = 6] = "TeamManagement";
        PageContainers[PageContainers["MarkingCheckExaminersWorkList"] = 7] = "MarkingCheckExaminersWorkList";
        PageContainers[PageContainers["Reports"] = 8] = "Reports";
        PageContainers[PageContainers["ECourseWork"] = 9] = "ECourseWork";
        PageContainers[PageContainers["StandardisationSetup"] = 10] = "StandardisationSetup";
        PageContainers[PageContainers["AdminSupport"] = 11] = "AdminSupport";
        PageContainers[PageContainers["Awarding"] = 12] = "Awarding";
    })(Enums.PageContainers || (Enums.PageContainers = {}));
    var PageContainers = Enums.PageContainers;
    /**
     * Enums for PageContainers Type
     */
    (function (PageContainersType) {
        PageContainersType[PageContainersType["None"] = 0] = "None";
        PageContainersType[PageContainersType["ECourseWork"] = 1] = "ECourseWork";
        PageContainersType[PageContainersType["HtmlView"] = 2] = "HtmlView";
    })(Enums.PageContainersType || (Enums.PageContainersType = {}));
    var PageContainersType = Enums.PageContainersType;
    /**
     * Enums for LogoutEvents
     *
     * @export LogoutEvents
     * @enum {number}
     */
    (function (LogoutEvents) {
        LogoutEvents[LogoutEvents["None"] = 0] = "None";
        LogoutEvents[LogoutEvents["InvalidUser"] = 1] = "InvalidUser";
        LogoutEvents[LogoutEvents["AutoLogout"] = 2] = "AutoLogout";
    })(Enums.LogoutEvents || (Enums.LogoutEvents = {}));
    var LogoutEvents = Enums.LogoutEvents;
    /**
     * Enum for marker operation mode
     *
     * @export MarkerOperationMode
     * @enum {number}
     */
    (function (MarkerOperationMode) {
        MarkerOperationMode[MarkerOperationMode["Marking"] = 0] = "Marking";
        MarkerOperationMode[MarkerOperationMode["TeamManagement"] = 1] = "TeamManagement";
        MarkerOperationMode[MarkerOperationMode["StandardisationSetup"] = 2] = "StandardisationSetup";
        MarkerOperationMode[MarkerOperationMode["Awarding"] = 3] = "Awarding";
    })(Enums.MarkerOperationMode || (Enums.MarkerOperationMode = {}));
    var MarkerOperationMode = Enums.MarkerOperationMode;
    /**
     *  Enum for examiner status approval come
     *
     * @export ApprovalOutcome
     * @enum {number}
     */
    (function (ApprovalOutcome) {
        ApprovalOutcome[ApprovalOutcome["Success"] = 0] = "Success";
        ApprovalOutcome[ApprovalOutcome["ReApprovalLimitExceeed"] = 1] = "ReApprovalLimitExceeed";
        ApprovalOutcome[ApprovalOutcome["StatusUpdatedByOtherSupervisor"] = 2] = "StatusUpdatedByOtherSupervisor";
        ApprovalOutcome[ApprovalOutcome["UserNotAuthorized"] = 3] = "UserNotAuthorized";
        ApprovalOutcome[ApprovalOutcome["SupervisorHierarchyChanged"] = 4] = "SupervisorHierarchyChanged";
        ApprovalOutcome[ApprovalOutcome["OpenReviewRemarsksAvailable"] = 5] = "OpenReviewRemarsksAvailable";
    })(Enums.ApprovalOutcome || (Enums.ApprovalOutcome = {}));
    var ApprovalOutcome = Enums.ApprovalOutcome;
    /**
     * Enum for examiner status change options via Team Management
     *
     * @export ChangeStatusOptions
     * @enum {number}
     */
    (function (ChangeStatusOptions) {
        ChangeStatusOptions[ChangeStatusOptions["None"] = 0] = "None";
        ChangeStatusOptions[ChangeStatusOptions["NotApproved"] = 1] = "NotApproved";
        ChangeStatusOptions[ChangeStatusOptions["Approved"] = 2] = "Approved";
        ChangeStatusOptions[ChangeStatusOptions["SendForSecondStandardisation"] = 3] = "SendForSecondStandardisation";
        ChangeStatusOptions[ChangeStatusOptions["AprovedPendingReview"] = 4] = "AprovedPendingReview";
        ChangeStatusOptions[ChangeStatusOptions["Suspended"] = 9] = "Suspended";
        ChangeStatusOptions[ChangeStatusOptions["Re_approve"] = 12] = "Re_approve";
    })(Enums.ChangeStatusOptions || (Enums.ChangeStatusOptions = {}));
    var ChangeStatusOptions = Enums.ChangeStatusOptions;
    /**
     * Enum for SetAsReviewResult
     *
     * @export SetAsReviewResult
     * @enum {number}
     */
    (function (SetAsReviewResult) {
        /// <summary>
        /// No result
        /// </summary>
        SetAsReviewResult[SetAsReviewResult["None"] = 0] = "None";
        /// <summary>
        /// Review Operation Successful
        /// </summary>
        SetAsReviewResult[SetAsReviewResult["Success"] = 1] = "Success";
        /// <summary>
        /// Response Already Reviewed by another marker
        /// </summary>
        SetAsReviewResult[SetAsReviewResult["AlreadyReviewedBySomeone"] = 2] = "AlreadyReviewedBySomeone";
        /// <summary>
        /// User not authorised to review the response
        /// </summary>
        SetAsReviewResult[SetAsReviewResult["NotAuthorised"] = 3] = "NotAuthorised";
    })(Enums.SetAsReviewResult || (Enums.SetAsReviewResult = {}));
    var SetAsReviewResult = Enums.SetAsReviewResult;
    /**
     * enum for Sample review comment
     *
     * @export SampleReviewComment
     * @enum {number}
     */
    (function (SampleReviewComment) {
        /// <summary>
        /// Sample Not Available
        /// </summary>
        SampleReviewComment[SampleReviewComment["None"] = 0] = "None";
        /// <summary>
        /// Sampled OK
        /// </summary>
        SampleReviewComment[SampleReviewComment["Sampled_OK"] = 1] = "Sampled_OK";
        /// <summary>
        /// Sampled Feedback Given
        /// </summary>
        SampleReviewComment[SampleReviewComment["Sampled_Feedback_Given"] = 2] = "Sampled_Feedback_Given";
        /// <summary>
        /// Sampled Action Required
        /// </summary>
        SampleReviewComment[SampleReviewComment["Sampled_Action_Reqd"] = 3] = "Sampled_Action_Reqd";
    })(Enums.SampleReviewComment || (Enums.SampleReviewComment = {}));
    var SampleReviewComment = Enums.SampleReviewComment;
    /**
     * Enum for the SEP Workflow status
     *
     * @export SEPWorkFlowStatus
     * @enum {number}
     */
    (function (SEPWorkFlowStatus) {
        SEPWorkFlowStatus[SEPWorkFlowStatus["None"] = 0] = "None";
        SEPWorkFlowStatus[SEPWorkFlowStatus["NotApprovedFirstStd"] = 1] = "NotApprovedFirstStd";
        SEPWorkFlowStatus[SEPWorkFlowStatus["NotApprovedAllStd"] = 2] = "NotApprovedAllStd";
        SEPWorkFlowStatus[SEPWorkFlowStatus["SuspendedFirst"] = 3] = "SuspendedFirst";
        SEPWorkFlowStatus[SEPWorkFlowStatus["SuspendedNotFirst"] = 4] = "SuspendedNotFirst";
        SEPWorkFlowStatus[SEPWorkFlowStatus["SecondStdSample"] = 5] = "SecondStdSample";
        SEPWorkFlowStatus[SEPWorkFlowStatus["Reapproved"] = 6] = "Reapproved";
        SEPWorkFlowStatus[SEPWorkFlowStatus["AODActioned"] = 7] = "AODActioned";
        SEPWorkFlowStatus[SEPWorkFlowStatus["LockedNotApprovedFirstStd"] = 8] = "LockedNotApprovedFirstStd";
        SEPWorkFlowStatus[SEPWorkFlowStatus["LockedNotApprovedAllStd"] = 9] = "LockedNotApprovedAllStd";
        SEPWorkFlowStatus[SEPWorkFlowStatus["LockedSuspendedFirst"] = 10] = "LockedSuspendedFirst";
        SEPWorkFlowStatus[SEPWorkFlowStatus["LockedSuspendedNotFirst"] = 11] = "LockedSuspendedNotFirst";
        SEPWorkFlowStatus[SEPWorkFlowStatus["Approved"] = 12] = "Approved";
    })(Enums.SEPWorkFlowStatus || (Enums.SEPWorkFlowStatus = {}));
    var SEPWorkFlowStatus = Enums.SEPWorkFlowStatus;
    /**
     * Enum for the SEP Action
     *
     * @export SEPAction
     * @enum {number}
     */
    (function (SEPAction) {
        SEPAction[SEPAction["None"] = 0] = "None";
        SEPAction[SEPAction["Lock"] = 10] = "Lock";
        SEPAction[SEPAction["Unlock"] = 11] = "Unlock";
        SEPAction[SEPAction["Re_approve"] = 12] = "Re_approve";
        SEPAction[SEPAction["ProvideSecondStandardisation"] = 13] = "ProvideSecondStandardisation";
        SEPAction[SEPAction["Approve"] = 15] = "Approve";
        SEPAction[SEPAction["ViewResponse"] = 20] = "ViewResponse";
        SEPAction[SEPAction["SendMessage"] = 2] = "SendMessage";
    })(Enums.SEPAction || (Enums.SEPAction = {}));
    var SEPAction = Enums.SEPAction;
    /**
     * An enumeration of the different action request failure codes
     *
     * @export SEPActionFailureCode
     * @enum {number}
     */
    (function (SEPActionFailureCode) {
        /// <summary>
        /// The not set
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotSet"] = 0] = "NotSet";
        /// <summary>
        /// Represents no failure
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["None"] = 1] = "None";
        /// <summary>
        /// The not approved
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotApproved"] = 2] = "NotApproved";
        /// <summary>
        /// The invalid priority
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["InvalidPriority"] = 3] = "InvalidPriority";
        /// <summary>
        /// The not a senior examiner
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotASeniorExaminer"] = 4] = "NotASeniorExaminer";
        /// <summary>
        /// The lock is required
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["LockIsRequired"] = 5] = "LockIsRequired";
        /// <summary>
        /// The already locked
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["AlreadyLocked"] = 6] = "AlreadyLocked";
        /// <summary>
        /// The lock limit met
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["LockLimitMet"] = 7] = "LockLimitMet";
        /// <summary>
        /// The not valid action
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotValidAction"] = 8] = "NotValidAction";
        /// <summary>
        /// The not in senior examiner pool
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotInSeniorExaminerPool"] = 9] = "NotInSeniorExaminerPool";
        /// <summary>
        /// The not in lock status
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["NotInLockStatus"] = 10] = "NotInLockStatus";
        /// <summary>
        /// Subordinate examiner is withdrawn from the QIG
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["SubordinateExaminerWithdrawn"] = 11] = "SubordinateExaminerWithdrawn";
        /// <summary>
        /// Supervisor examiner is withdrawn from the QIG
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["Withdrawn"] = 12] = "Withdrawn";
        /// <summary>
        /// Supervisor examiner is withdrawn from the QIG
        /// </summary>
        SEPActionFailureCode[SEPActionFailureCode["Suspended"] = 13] = "Suspended";
    })(Enums.SEPActionFailureCode || (Enums.SEPActionFailureCode = {}));
    var SEPActionFailureCode = Enums.SEPActionFailureCode;
    /**
     * enum for TeamSubLink
     *
     * @export TeamSubLink
     * @enum {number}
     */
    (function (TeamSubLink) {
        /// <summary>
        /// Not Approved Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["NotApproved"] = 0] = "NotApproved";
        /// <summary>
        /// Awaiting approval Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["AwaitingApproval"] = 1] = "AwaitingApproval";
        /// <summary>
        /// Locked in my team Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["MyTeamLocked"] = 2] = "MyTeamLocked";
        /// <summary>
        /// Locked Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["HelpExaminersLocked"] = 3] = "HelpExaminersLocked";
        /// <summary>
        /// Stuck Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["Stuck"] = 4] = "Stuck";
        /// <summary>
        /// Exception Sublink
        /// </summary>
        TeamSubLink[TeamSubLink["Exceptions"] = 5] = "Exceptions";
    })(Enums.TeamSubLink || (Enums.TeamSubLink = {}));
    var TeamSubLink = Enums.TeamSubLink;
    /**
     * Status of marking check of an examiner
     *
     * @export MarkingCheckStatus
     * @enum {number}
     */
    (function (MarkingCheckStatus) {
        /// <summary>
        /// Unknown status
        /// </summary>
        MarkingCheckStatus[MarkingCheckStatus["None"] = 0] = "None";
        /// <summary>
        /// Examiner's Marking Check request is checked
        /// </summary>
        MarkingCheckStatus[MarkingCheckStatus["Checked"] = 1] = "Checked";
        /// <summary>
        /// Examiner has requested for a marking check
        /// </summary>
        MarkingCheckStatus[MarkingCheckStatus["CheckRequested"] = 2] = "CheckRequested";
        /// <summary>
        /// Examiner Marking Check request is unchecked
        /// </summary>
        MarkingCheckStatus[MarkingCheckStatus["Unchecked"] = 3] = "Unchecked";
    })(Enums.MarkingCheckStatus || (Enums.MarkingCheckStatus = {}));
    var MarkingCheckStatus = Enums.MarkingCheckStatus;
    /**
     * Filter options dispalys in the closed live worklist for subordinate worklist
     *
     * @export WorklistSeedFilter
     * @enum {number}
     */
    (function (WorklistSeedFilter) {
        /// <summary>
        /// All response should be displayed
        /// </summary>
        WorklistSeedFilter[WorklistSeedFilter["All"] = 1] = "All";
        /// <summary>
        /// Seed will be displayed
        /// </summary>
        WorklistSeedFilter[WorklistSeedFilter["SeedsOnly"] = 2] = "SeedsOnly";
        /// <summary>
        /// Only Unreviewed seeds should be displayed
        /// </summary>
        WorklistSeedFilter[WorklistSeedFilter["UnreviewedSeedsOnly"] = 3] = "UnreviewedSeedsOnly";
    })(Enums.WorklistSeedFilter || (Enums.WorklistSeedFilter = {}));
    var WorklistSeedFilter = Enums.WorklistSeedFilter;
    /**
     * Enumeration for errorcode.
     *
     * @export PromoteToSeedErrorCode
     * @enum {number}
     */
    (function (PromoteToSeedErrorCode) {
        /// <summary>
        /// No error has occured.
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["None"] = 0] = "None";
        /// <summary>
        /// A unique key violation has occured.
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["UniqueKeyViolation"] = 1] = "UniqueKeyViolation";
        /// <summary>
        /// Response has remarks
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["ResponseHasRemarks"] = 2] = "ResponseHasRemarks";
        /// <summary>
        /// No Seed targets are specified
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["NoSeedTargets"] = 3] = "NoSeedTargets";
        /// <summary>
        /// Already promoted to seed
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["AlreadyPromoted"] = 4] = "AlreadyPromoted";
        /// <summary>
        /// Response is not 100% marked
        /// </summary>
        PromoteToSeedErrorCode[PromoteToSeedErrorCode["NotFullyMarked"] = 5] = "NotFullyMarked";
    })(Enums.PromoteToSeedErrorCode || (Enums.PromoteToSeedErrorCode = {}));
    var PromoteToSeedErrorCode = Enums.PromoteToSeedErrorCode;
    /**
     * RejectRigErrorCode
     *
     * @export RejectRigErrorCode
     * @enum {number}
     */
    (function (RejectRigErrorCode) {
        /// <summary>
        /// No error has occured.
        /// </summary>
        RejectRigErrorCode[RejectRigErrorCode["None"] = 0] = "None";
        /// <summary>
        /// Response has exceptions.
        /// </summary>
        RejectRigErrorCode[RejectRigErrorCode["HasExceptions"] = 1] = "HasExceptions";
    })(Enums.RejectRigErrorCode || (Enums.RejectRigErrorCode = {}));
    var RejectRigErrorCode = Enums.RejectRigErrorCode;
    /**
     * Enumeration for General failureCode.
     *
     * @export FailureCode
     * @enum {number}
     */
    (function (FailureCode) {
        /// <summary>
        /// Failure code Is Not Set
        /// </summary>
        FailureCode[FailureCode["NotSet"] = 0] = "NotSet";
        /// <summary>
        /// Failure code Is Not Set
        /// </summary>
        FailureCode[FailureCode["None"] = 1] = "None";
        /// <summary>
        /// Examiner Not Approved
        /// </summary>
        FailureCode[FailureCode["NotApproved"] = 2] = "NotApproved";
        /// <summary>
        /// Examiner in invalid priority
        /// </summary>
        FailureCode[FailureCode["InvalidPriority"] = 3] = "InvalidPriority";
        /// <summary>
        /// Examiner not a senior examiner
        /// </summary>
        FailureCode[FailureCode["NotASeniorExaminer"] = 4] = "NotASeniorExaminer";
        /// <summary>
        /// Examiner lock required
        /// </summary>
        FailureCode[FailureCode["LockIsRequired"] = 5] = "LockIsRequired";
        /// <summary>
        /// subordinate examiner is already locked
        /// </summary>
        FailureCode[FailureCode["AlreadyLocked"] = 6] = "AlreadyLocked";
        /// <summary>
        /// Examiner has met lock limit
        /// </summary>
        FailureCode[FailureCode["LockLimitMet"] = 7] = "LockLimitMet";
        /// <summary>
        /// SEP action is not valid
        /// </summary>
        FailureCode[FailureCode["NotValidAction"] = 8] = "NotValidAction";
        /// <summary>
        /// Supervisor examiner is not in SEP
        /// </summary>
        FailureCode[FailureCode["NotInSeniorExaminerPool"] = 9] = "NotInSeniorExaminerPool";
        /// <summary>
        /// Subordinate Examiner is not in lock status
        /// </summary>
        FailureCode[FailureCode["NotInLockStatus"] = 10] = "NotInLockStatus";
        /// <summary>
        /// Subordinate examiner is withdrawn from the QIG
        /// </summary>
        FailureCode[FailureCode["SubordinateExaminerWithdrawn"] = 11] = "SubordinateExaminerWithdrawn";
        /// <summary>
        /// If the logged in examiner is withdrawn from the qig
        /// </summary>
        FailureCode[FailureCode["Withdrawn"] = 12] = "Withdrawn";
        /// <summary>
        /// If the logged in examiner is suspended from the qig
        /// </summary>
        FailureCode[FailureCode["Suspended"] = 13] = "Suspended";
        /// <summary>
        /// The hierarchy of the currentexaminer/suborrdinate
        /// changed so that the action is no more valid
        /// </summary>
        FailureCode[FailureCode["HierarchyChanged"] = 14] = "HierarchyChanged";
        /// <summary>
        /// Supervisor hierarchy changed and is not a parent of current subordinate
        /// </summary>
        FailureCode[FailureCode["NotDirectParent"] = 15] = "NotDirectParent";
        /// <summary>
        /// Supervisor hierarchy changed and is not a PE or APE
        /// </summary>
        FailureCode[FailureCode["NotPEOrAPE"] = 16] = "NotPEOrAPE";
        /// <summary>
        /// Not in direct parent
        /// </summary>
        FailureCode[FailureCode["NotInDirectParent"] = 17] = "NotInDirectParent";
        /// <summary>
        /// Supervisor hierarchy changed and he is not a TL
        /// </summary>
        FailureCode[FailureCode["NotTeamLead"] = 18] = "NotTeamLead";
        /// <summary>
        /// Examiner status already changed
        /// </summary>
        FailureCode[FailureCode["ExaminerStatusAlreadyChanged"] = 19] = "ExaminerStatusAlreadyChanged";
    })(Enums.FailureCode || (Enums.FailureCode = {}));
    var FailureCode = Enums.FailureCode;
    /**
     * Enumeration for Atypical response status
     * @export AtypicalStatus
     * @enum {number}
     */
    (function (AtypicalStatus) {
        /// <summary>
        /// The scannable
        /// </summary>
        AtypicalStatus[AtypicalStatus["Scannable"] = 0] = "Scannable";
        /// <summary>
        /// The atypical scannable
        /// </summary>
        AtypicalStatus[AtypicalStatus["AtypicalScannable"] = 1] = "AtypicalScannable";
        /// <summary>
        /// The atypical unscannable
        /// </summary>
        AtypicalStatus[AtypicalStatus["AtypicalUnscannable"] = 2] = "AtypicalUnscannable";
    })(Enums.AtypicalStatus || (Enums.AtypicalStatus = {}));
    var AtypicalStatus = Enums.AtypicalStatus;
    /**
     * enum to identify the remember qig area
     * @export QigArea
     * @enum {number}
     */
    (function (QigArea) {
        // QigSelector
        QigArea[QigArea["QigSelector"] = 0] = "QigSelector";
        // marking
        QigArea[QigArea["Marking"] = 1] = "Marking";
        // TeamManagement
        QigArea[QigArea["TeamManagement"] = 2] = "TeamManagement";
        // Inbox
        QigArea[QigArea["Inbox"] = 3] = "Inbox";
        // StandardisationSetup
        QigArea[QigArea["StandardisationSetup"] = 4] = "StandardisationSetup";
    })(Enums.QigArea || (Enums.QigArea = {}));
    var QigArea = Enums.QigArea;
    /**
     * Enumeration for Warning Message Action.
     * @export WarningMessageAction
     * @enum {number}
     */
    (function (WarningMessageAction) {
        /// <summary>
        /// None
        /// </summary>
        WarningMessageAction[WarningMessageAction["None"] = -1] = "None";
        /// <summary>
        /// View Response
        /// </summary>
        WarningMessageAction[WarningMessageAction["ViewResponse"] = 0] = "ViewResponse";
        /// <summary>
        /// Send Message
        /// </summary>
        WarningMessageAction[WarningMessageAction["SendMessage"] = 1] = "SendMessage";
        /// <summary>
        /// Set as reviewed
        /// </summary>
        WarningMessageAction[WarningMessageAction["SetAsReviewed"] = 2] = "SetAsReviewed";
        /// <summary>
        /// Check my marks
        /// </summary>
        WarningMessageAction[WarningMessageAction["CheckMyMarks"] = 3] = "CheckMyMarks";
        /// <summary>
        /// Mark checked
        /// </summary>
        WarningMessageAction[WarningMessageAction["MarksChecked"] = 4] = "MarksChecked";
        /// <summary>
        /// Promote to seed
        /// </summary>
        WarningMessageAction[WarningMessageAction["PromoteToSeed"] = 5] = "PromoteToSeed";
        /// <summary>
        /// Supervisor sampling
        /// </summary>
        WarningMessageAction[WarningMessageAction["SupervisorSampling"] = 6] = "SupervisorSampling";
        /// <summary>
        /// Change examiner status
        /// </summary>
        WarningMessageAction[WarningMessageAction["ChangeExaminerStatus"] = 7] = "ChangeExaminerStatus";
        /// <summary>
        /// Checking rxaminer viewing response
        /// </summary>
        WarningMessageAction[WarningMessageAction["CheckingExaminerViewingResponse"] = 8] = "CheckingExaminerViewingResponse";
        /// <summary>
        /// Supervisor remark check
        /// </summary>
        WarningMessageAction[WarningMessageAction["SuperVisorRemarkCheck"] = 9] = "SuperVisorRemarkCheck";
        /// <summary>
        /// Senior Examiner Pool Actions
        /// </summary>
        WarningMessageAction[WarningMessageAction["SEPAction"] = 10] = "SEPAction";
        /// <summary>
        /// My team tab actions
        /// </summary>
        WarningMessageAction[WarningMessageAction["MyTeamAction"] = 11] = "MyTeamAction";
        /// <summary>
        /// Exception Actions
        /// </summary>
        WarningMessageAction[WarningMessageAction["ExceptionAction"] = 12] = "ExceptionAction";
        /// <summary>
        /// TeamWorklist
        /// </summary>
        WarningMessageAction[WarningMessageAction["TeamWorklist"] = 13] = "TeamWorklist";
        /// <summary>
        /// Promote to Reuse bucket
        /// </summary>
        WarningMessageAction[WarningMessageAction["PromoteToReuseBucket"] = 14] = "PromoteToReuseBucket";
    })(Enums.WarningMessageAction || (Enums.WarningMessageAction = {}));
    var WarningMessageAction = Enums.WarningMessageAction;
    /**
     * enum to identify ResponseWarningPriority
     */
    (function (ResponseWarningPriority) {
        // All question item Marked As NR.
        ResponseWarningPriority[ResponseWarningPriority["AllMarkedAsNR"] = 1] = "AllMarkedAsNR";
        // response without optionality where one or more question items marked as NR
        ResponseWarningPriority[ResponseWarningPriority["AtleastOneNRWithoutOptionality"] = 2] = "AtleastOneNRWithoutOptionality";
        // response with optionality where one or more question items marked as NR included in total
        ResponseWarningPriority[ResponseWarningPriority["AtleastOneNRWithOptionalityUsedInTotal"] = 3] = "AtleastOneNRWithOptionalityUsedInTotal";
        // response with optionality where one or more question items marked as NR not included in total
        ResponseWarningPriority[ResponseWarningPriority["AtleastOneNRWithOptionalityNotUsedInTotal"] = 4] = "AtleastOneNRWithOptionalityNotUsedInTotal";
        // Not all additional pages annotated.
        ResponseWarningPriority[ResponseWarningPriority["NotAllSLAOsAnnotated"] = 5] = "NotAllSLAOsAnnotated";
        // AllPagesNotAnotated
        ResponseWarningPriority[ResponseWarningPriority["AllPagesNotAnnotated"] = 6] = "AllPagesNotAnnotated";
        // Not all files viewed
        ResponseWarningPriority[ResponseWarningPriority["NotAllFilesViewed"] = 7] = "NotAllFilesViewed";
        // Supervisor re-mark decision
        ResponseWarningPriority[ResponseWarningPriority["SuperVisorRemarkDecisionNeeded"] = 8] = "SuperVisorRemarkDecisionNeeded";
        // Mark change reason needed
        ResponseWarningPriority[ResponseWarningPriority["MarkChangeReasonNeeded"] = 9] = "MarkChangeReasonNeeded";
        // unsent message
        ResponseWarningPriority[ResponseWarningPriority["UnSentMessage"] = 10] = "UnSentMessage";
        // unsent exception
        ResponseWarningPriority[ResponseWarningPriority["UnSavedException"] = 11] = "UnSavedException";
        // Unsaved enhanced off-page comment exception
        ResponseWarningPriority[ResponseWarningPriority["UnSavedEnhancedOffPageComment"] = 12] = "UnSavedEnhancedOffPageComment";
        // Files downloaded outside assessor3
        ResponseWarningPriority[ResponseWarningPriority["FileDownloadedOutside"] = 13] = "FileDownloadedOutside";
    })(Enums.ResponseWarningPriority || (Enums.ResponseWarningPriority = {}));
    var ResponseWarningPriority = Enums.ResponseWarningPriority;
    /**
     * enum to identify WarningType
     */
    (function (WarningType) {
        WarningType[WarningType["SubmitResponse"] = 0] = "SubmitResponse";
        WarningType[WarningType["LeaveResponse"] = 1] = "LeaveResponse";
        WarningType[WarningType["PreventLeaveInGraceResponse"] = 2] = "PreventLeaveInGraceResponse";
    })(Enums.WarningType || (Enums.WarningType = {}));
    var WarningType = Enums.WarningType;
    /**
     * enum to identify es mark group status
     */
    (function (ESMarkGroupStatus) {
        /// <summary>
        /// The none
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["None"] = 0] = "None";
        /// <summary>
        /// The created
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["Created"] = 10] = "Created";
        /// <summary>
        /// The in progress
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["InProgress"] = 20] = "InProgress";
        /// <summary>
        /// The marking commenced
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["MarkingCommenced"] = 25] = "MarkingCommenced";
        /// <summary>
        /// The completed marking
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["CompletedMarking"] = 30] = "CompletedMarking";
        /// <summary>
        /// The submittedto standard meeting
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["SubmittedtoStdMeeting"] = 40] = "SubmittedtoStdMeeting";
        /// <summary>
        /// The submittedfor approval
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["SubmittedforApproval"] = 50] = "SubmittedforApproval";
        /// <summary>
        /// The review failed
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["ReviewFailed"] = 60] = "ReviewFailed";
        /// <summary>
        /// The approved
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["Approved"] = 70] = "Approved";
        /// <summary>
        /// The automatic checked
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["AutoChecked"] = 75] = "AutoChecked";
        /// <summary>
        /// The submitted live
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["SubmittedLive"] = 80] = "SubmittedLive";
        /// <summary>
        /// The ignored
        /// </summary>
        ESMarkGroupStatus[ESMarkGroupStatus["Ignored"] = 90] = "Ignored";
    })(Enums.ESMarkGroupStatus || (Enums.ESMarkGroupStatus = {}));
    var ESMarkGroupStatus = Enums.ESMarkGroupStatus;
    /**
     * enum to identify examiner validation area
     */
    (function (ExaminerValidationArea) {
        /// <summary>
        /// None
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["None"] = 0] = "None";
        /// <summary>
        /// My Team
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["MyTeam"] = 1] = "MyTeam";
        /// <summary>
        /// Help Examiner
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["HelpExaminer"] = 2] = "HelpExaminer";
        /// <summary>
        /// Mark Check Worklist
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["MarkCheckWorklist"] = 3] = "MarkCheckWorklist";
        /// <summary>
        /// Exception Action.
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["ExceptionAction"] = 4] = "ExceptionAction";
        /// <summary>
        /// TeamWorklist.
        /// </summary>
        ExaminerValidationArea[ExaminerValidationArea["TeamWorklist"] = 5] = "TeamWorklist";
    })(Enums.ExaminerValidationArea || (Enums.ExaminerValidationArea = {}));
    var ExaminerValidationArea = Enums.ExaminerValidationArea;
    /**
     * enum for supervisor remark decision type
     */
    (function (SupervisorRemarkDecisionType) {
        SupervisorRemarkDecisionType[SupervisorRemarkDecisionType["none"] = 0] = "none";
        SupervisorRemarkDecisionType[SupervisorRemarkDecisionType["nonjudgementalerror"] = 1] = "nonjudgementalerror";
        SupervisorRemarkDecisionType[SupervisorRemarkDecisionType["originalmarks"] = 2] = "originalmarks";
        SupervisorRemarkDecisionType[SupervisorRemarkDecisionType["judgementaloutsidetolerance"] = 3] = "judgementaloutsidetolerance";
    })(Enums.SupervisorRemarkDecisionType || (Enums.SupervisorRemarkDecisionType = {}));
    var SupervisorRemarkDecisionType = Enums.SupervisorRemarkDecisionType;
    /**
     * Enum for sort option
     */
    (function (SortOption) {
        SortOption[SortOption["Both"] = 0] = "Both";
        SortOption[SortOption["Up"] = 1] = "Up";
        SortOption[SortOption["Down"] = 2] = "Down";
    })(Enums.SortOption || (Enums.SortOption = {}));
    var SortOption = Enums.SortOption;
    /**
     * Enum for page type
     */
    (function (PageType) {
        PageType[PageType["Page"] = 0] = "Page";
        PageType[PageType["Link"] = 1] = "Link";
    })(Enums.PageType || (Enums.PageType = {}));
    var PageType = Enums.PageType;
    /**
     * Enum for media type
     */
    (function (MediaType) {
        MediaType[MediaType["None"] = 0] = "None";
        MediaType[MediaType["Audio"] = 1] = "Audio";
        MediaType[MediaType["Video"] = 2] = "Video";
        MediaType[MediaType["Image"] = 3] = "Image";
        MediaType[MediaType["Excel"] = 4] = "Excel";
        MediaType[MediaType["Html"] = 5] = "Html";
    })(Enums.MediaType || (Enums.MediaType = {}));
    var MediaType = Enums.MediaType;
    /**
     * Enum for FileList Panel View
     */
    (function (FileListPanelView) {
        FileListPanelView[FileListPanelView["List"] = 0] = "List";
        FileListPanelView[FileListPanelView["Thumbnail"] = 1] = "Thumbnail";
    })(Enums.FileListPanelView || (Enums.FileListPanelView = {}));
    var FileListPanelView = Enums.FileListPanelView;
    /**
     * Enum for cloud type
     */
    (function (CloudType) {
        CloudType[CloudType["None"] = 0] = "None";
        CloudType[CloudType["IbCloud"] = 1] = "IbCloud";
        CloudType[CloudType["AzureCloud"] = 2] = "AzureCloud";
    })(Enums.CloudType || (Enums.CloudType = {}));
    var CloudType = Enums.CloudType;
    /**
     * Enum for Response Type Label
     */
    (function (ResponseType) {
        ResponseType[ResponseType["None"] = 0] = "None";
        ResponseType[ResponseType["Seed"] = 1] = "Seed";
        ResponseType[ResponseType["PromotedSeed"] = 2] = "PromotedSeed";
        ResponseType[ResponseType["Definitive"] = 3] = "Definitive";
        ResponseType[ResponseType["WholeResponse"] = 4] = "WholeResponse";
    })(Enums.ResponseType || (Enums.ResponseType = {}));
    var ResponseType = Enums.ResponseType;
    /**
     * Enum for tag type
     */
    (function (TagType) {
        TagType[TagType["Empty"] = 0] = "Empty";
        TagType[TagType["Orange"] = 1] = "Orange";
        TagType[TagType["Blue"] = 2] = "Blue";
        TagType[TagType["Green"] = 3] = "Green";
        TagType[TagType["Violet"] = 4] = "Violet";
        TagType[TagType["Purple"] = 5] = "Purple";
        TagType[TagType["Red"] = 6] = "Red";
        TagType[TagType["Yellow"] = 7] = "Yellow";
        TagType[TagType["Pink"] = 8] = "Pink";
        TagType[TagType["LightGreen"] = 9] = "LightGreen";
    })(Enums.TagType || (Enums.TagType = {}));
    var TagType = Enums.TagType;
    /**
     * Enum for Enhanced Off Page Comment.
     * @export
     * @enum {number}
     */
    (function (EnhancedOffPageCommentView) {
        EnhancedOffPageCommentView[EnhancedOffPageCommentView["none"] = 0] = "none";
        EnhancedOffPageCommentView[EnhancedOffPageCommentView["detail"] = 1] = "detail";
        EnhancedOffPageCommentView[EnhancedOffPageCommentView["grid"] = 2] = "grid";
    })(Enums.EnhancedOffPageCommentView || (Enums.EnhancedOffPageCommentView = {}));
    var EnhancedOffPageCommentView = Enums.EnhancedOffPageCommentView;
    /**
     * Enum for Enhanced Off Page Comment Button actions.
     * @export
     * @enum {number}
     */
    (function (EnhancedOffPageCommentAction) {
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["none"] = 0] = "none";
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["Save"] = 1] = "Save";
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["Delete"] = 2] = "Delete";
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["Close"] = 3] = "Close";
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["Visibility"] = 4] = "Visibility";
        EnhancedOffPageCommentAction[EnhancedOffPageCommentAction["MarkSchemeNavigation"] = 5] = "MarkSchemeNavigation";
    })(Enums.EnhancedOffPageCommentAction || (Enums.EnhancedOffPageCommentAction = {}));
    var EnhancedOffPageCommentAction = Enums.EnhancedOffPageCommentAction;
    /**
     * Enum for Panel Resizer types.
     * @export
     * @enum {number}
     */
    (function (ResizePanelType) {
        ResizePanelType[ResizePanelType["None"] = 0] = "None";
        ResizePanelType[ResizePanelType["MarkSchemePanel"] = 1] = "MarkSchemePanel";
        ResizePanelType[ResizePanelType["EnhancedOffPageComment"] = 2] = "EnhancedOffPageComment";
        ResizePanelType[ResizePanelType["OffPageComment"] = 3] = "OffPageComment";
    })(Enums.ResizePanelType || (Enums.ResizePanelType = {}));
    var ResizePanelType = Enums.ResizePanelType;
    /**
     * Enem for panelActionType to update resizer
     */
    (function (PanelActionType) {
        PanelActionType[PanelActionType["ResizedPanel"] = 0] = "ResizedPanel";
        PanelActionType[PanelActionType["ResizingClassName"] = 1] = "ResizingClassName";
        PanelActionType[PanelActionType["Visiblity"] = 2] = "Visiblity";
    })(Enums.PanelActionType || (Enums.PanelActionType = {}));
    var PanelActionType = Enums.PanelActionType;
    /**
     * Enum for pan action type.
     *
     * @export
     * @enum {number}
     */
    (function (PanActionType) {
        PanActionType[PanActionType["None"] = 0] = "None";
        PanActionType[PanActionType["Start"] = 1] = "Start";
        PanActionType[PanActionType["Move"] = 2] = "Move";
        PanActionType[PanActionType["End"] = 3] = "End";
    })(Enums.PanActionType || (Enums.PanActionType = {}));
    var PanActionType = Enums.PanActionType;
    /**
     * Enum for Book mark type.
     *
     * @export
     * @enum {number}
     */
    (function (BookMarkFetchType) {
        BookMarkFetchType[BookMarkFetchType["None"] = 0] = "None";
        BookMarkFetchType[BookMarkFetchType["Live"] = 1] = "Live";
        BookMarkFetchType[BookMarkFetchType["Standardisation"] = 2] = "Standardisation";
    })(Enums.BookMarkFetchType || (Enums.BookMarkFetchType = {}));
    var BookMarkFetchType = Enums.BookMarkFetchType;
    /**
     * Enum for file type of media player
     */
    (function (MediaSourceType) {
        MediaSourceType[MediaSourceType["OriginalFile"] = 0] = "OriginalFile";
        MediaSourceType[MediaSourceType["TranscodedFile"] = 1] = "TranscodedFile";
    })(Enums.MediaSourceType || (Enums.MediaSourceType = {}));
    var MediaSourceType = Enums.MediaSourceType;
    /**
     * Enum for Set as reviewed comments
     */
    (function (SetAsReviewedComment) {
        SetAsReviewedComment[SetAsReviewedComment["None"] = 0] = "None";
        SetAsReviewedComment[SetAsReviewedComment["AllCorrect"] = 1] = "AllCorrect";
        SetAsReviewedComment[SetAsReviewedComment["Good"] = 2] = "Good";
        SetAsReviewedComment[SetAsReviewedComment["AcceptableNoFeedback"] = 3] = "AcceptableNoFeedback";
        SetAsReviewedComment[SetAsReviewedComment["AcceptableGiveFeedback"] = 4] = "AcceptableGiveFeedback";
        SetAsReviewedComment[SetAsReviewedComment["CausingConcernGiveFeedback"] = 5] = "CausingConcernGiveFeedback";
        SetAsReviewedComment[SetAsReviewedComment["UnAcceptableConsultPE"] = 6] = "UnAcceptableConsultPE";
    })(Enums.SetAsReviewedComment || (Enums.SetAsReviewedComment = {}));
    var SetAsReviewedComment = Enums.SetAsReviewedComment;
    /**
     * Enum for overlay colors
     */
    (function (OverlayColor) {
        OverlayColor[OverlayColor["yellow"] = -256] = "yellow";
        OverlayColor[OverlayColor["pink"] = -16181] = "pink";
        OverlayColor[OverlayColor["red"] = -65536] = "red";
        OverlayColor[OverlayColor["green"] = -16744448] = "green";
        OverlayColor[OverlayColor["blue"] = -16776961] = "blue";
        OverlayColor[OverlayColor["black"] = -16777216] = "black";
    })(Enums.OverlayColor || (Enums.OverlayColor = {}));
    var OverlayColor = Enums.OverlayColor;
    /**
     * Enum for fracs data set action source.
     */
    (function (FracsDataSetActionSource) {
        FracsDataSetActionSource[FracsDataSetActionSource["None"] = 0] = "None";
        FracsDataSetActionSource[FracsDataSetActionSource["Acetate"] = 1] = "Acetate";
    })(Enums.FracsDataSetActionSource || (Enums.FracsDataSetActionSource = {}));
    var FracsDataSetActionSource = Enums.FracsDataSetActionSource;
    /**
     * Enum acetate action.
     */
    (function (AcetateAction) {
        AcetateAction[AcetateAction["none"] = 0] = "none";
        AcetateAction[AcetateAction["move"] = 1] = "move";
        AcetateAction[AcetateAction["resize"] = 2] = "resize";
    })(Enums.AcetateAction || (Enums.AcetateAction = {}));
    var AcetateAction = Enums.AcetateAction;
    /**
     * Enum for returning error code while creating an exception/opening respone.
     */
    (function (ReturnErrorCode) {
        ReturnErrorCode[ReturnErrorCode["None"] = 0] = "None";
        ReturnErrorCode[ReturnErrorCode["WithdrawnResponse"] = 1] = "WithdrawnResponse";
        ReturnErrorCode[ReturnErrorCode["QigSessionClosed"] = 2] = "QigSessionClosed";
        ReturnErrorCode[ReturnErrorCode["DeallocatedResponse"] = 3] = "DeallocatedResponse";
    })(Enums.ReturnErrorCode || (Enums.ReturnErrorCode = {}));
    var ReturnErrorCode = Enums.ReturnErrorCode;
    /**
     * Enum for returning error code while creating an exception/opening respone.
     */
    (function (STDWorklistViewType) {
        STDWorklistViewType[STDWorklistViewType["ViewTotalMarks"] = 0] = "ViewTotalMarks";
        STDWorklistViewType[STDWorklistViewType["ViewMarksByQuestion"] = 1] = "ViewMarksByQuestion";
    })(Enums.STDWorklistViewType || (Enums.STDWorklistViewType = {}));
    var STDWorklistViewType = Enums.STDWorklistViewType;
    /**
     * Enum for standardisation select response session tab
     */
    (function (StandardisationSessionTab) {
        StandardisationSessionTab[StandardisationSessionTab["CurrentSession"] = 1] = "CurrentSession";
        StandardisationSessionTab[StandardisationSessionTab["PreviousSession"] = 2] = "PreviousSession";
    })(Enums.StandardisationSessionTab || (Enums.StandardisationSessionTab = {}));
    var StandardisationSessionTab = Enums.StandardisationSessionTab;
    /**
     * Enum for Create Standardisation rig error
     */
    (function (CreateRigError) {
        CreateRigError[CreateRigError["None"] = 0] = "None";
        CreateRigError[CreateRigError["RigAllocated"] = 1] = "RigAllocated";
        CreateRigError[CreateRigError["ScriptNotFound"] = 2] = "ScriptNotFound";
    })(Enums.CreateRigError || (Enums.CreateRigError = {}));
    var CreateRigError = Enums.CreateRigError;
    /**
     * Complete Standardisation Error
     */
    (function (CompleteStandardisationErrorCode) {
        CompleteStandardisationErrorCode[CompleteStandardisationErrorCode["None"] = 0] = "None";
        CompleteStandardisationErrorCode[CompleteStandardisationErrorCode["StandardisationNotComplete"] = 1000] = "StandardisationNotComplete";
    })(Enums.CompleteStandardisationErrorCode || (Enums.CompleteStandardisationErrorCode = {}));
    var CompleteStandardisationErrorCode = Enums.CompleteStandardisationErrorCode;
    /**
     * Enum for Awarding Filters Selection
     */
    (function (AwardingFilters) {
        AwardingFilters[AwardingFilters["ComponentId"] = 'componentId'] = "ComponentId";
        AwardingFilters[AwardingFilters["ExamSessionId"] = 'sessionId'] = "ExamSessionId";
        AwardingFilters[AwardingFilters["Grade"] = 'grade'] = "Grade";
        AwardingFilters[AwardingFilters["TotalMark"] = 'totalMark'] = "TotalMark";
        AwardingFilters[AwardingFilters["GroupByGrade"] = 'groupByGrade'] = "GroupByGrade";
        AwardingFilters[AwardingFilters["examProductId"] = 'examProductId'] = "examProductId";
    })(Enums.AwardingFilters || (Enums.AwardingFilters = {}));
    var AwardingFilters = Enums.AwardingFilters;
    /**
     * Level of marking instructions cc value
     */
    (function (MarkingInstructionCC) {
        MarkingInstructionCC[MarkingInstructionCC["QuestionPaper"] = 1] = "QuestionPaper";
        MarkingInstructionCC[MarkingInstructionCC["QIG"] = 2] = "QIG";
    })(Enums.MarkingInstructionCC || (Enums.MarkingInstructionCC = {}));
    var MarkingInstructionCC = Enums.MarkingInstructionCC;
})(Enums || (Enums = {}));
module.exports = Enums;
//# sourceMappingURL=enums.js.map
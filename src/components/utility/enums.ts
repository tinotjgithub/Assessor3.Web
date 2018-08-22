/**
 * Enums
 */
module Enums {

    /**
     * Enum for the Login Form components
     * @export LoginForm
     * @enum {number}
     */
    export enum LoginForm {
        username,
        password
    }

    /**
     * Enum for the different HTTP error codes
     *
     * @export HttpErrorCode
     * @enum {number}
     */
    export enum HttpErrorCode {
        badRequest = 400,
        internalServerError = 500
    }

    /**
     * Enum for the different Configurable Characteristic types available in Assessor
     *
     * @export ConfigurableCharacteristics
     * @enum {number}
     */
    export enum ConfigurableCharacteristics {
        none = 0,
        boolean = 1,
        string = 2,
        int = 3,
        decimal = 4,
        xml = 5
    }

    /**
     * Enum for the different marking modes available in Assessor
     *
     * @export MarkingMode
     * @enum {number}
     */
    export enum MarkingMode {
        None = 0,
        PreStandardisation = 1,
        Practice = 2,
        Approval = 3,
        ES_TeamApproval = 4,
        Pre_ES_TeamStandardisation = 5,
        StandardisationReview = 6,
        SeedingReview = 10,
        LiveMarking = 30,
        Remarking = 40,
        Adjudication = 50,
        Sample = 60,
        Seeding = 70,
        MarkFromPaper = 80,
        Simulation = 90
    }

    /**
     * Enum for the different status of the examiner possible in a QIG's life time
     *
     * @export ExaminerQIGStatus
     * @enum {number}
     */
    export enum ExaminerQIGStatus {
        None = 0,
        Suspended = 1,
        Practice = 2,
        StandardisationMarking = 3,
        AwaitingApproval = 4,
        SecondStandardisationMarking = 5,
        STMStandardisationMarking = 6,
        LiveMarking = 7,
        WaitingStandardisation = 8,
        LiveComplete = 9,
        Simulation = 10,
        QualityFeedback = 11,
        NoLiveTarget = 12,
        OverAllTargetReached = 13,
        OverAllTargetCompleted = 14,
        Atypical = 15,
        AdminRemark = 16,
        AwaitingScripts = 17
    }

    /**
     * Enum for atypical Search Result Code indicating the reason for the success or failure of the search.
     *
     * @export SearchResultCode
     * @enum {number}
     */
    export enum SearchResultCode {
        /// <summary>
        /// Value is not set.
        /// </summary>
        NotSet = 0,

        /// <summary>
        /// Success. Can proceed to allocate the searched response.
        /// </summary>
        AllocationPossible = 1,

        /// <summary>
        /// Response is already allocated and in open worklist.
        /// </summary>
        AlreadyInOpenWorklist = 2,

        /// <summary>
        /// Response is already allocated and in closed worklist.
        /// </summary>
        AlreadyInClosedWorklist = 3,

        /// <summary>
        /// The Centre Number and Candidate Number combination is not valid.
        /// </summary>
        CentreCandidateCombinationNotFound = 4,

        /// <summary>
        /// Response is not an atypical.
        /// </summary>
        NotAtypicalResponse = 5,

        /// <summary>
        /// Current marker is not eligible to mark any response that belongs to specified Centre.
        /// </summary>
        MarkerNotEligibleForCentre = 6,

        /// <summary>
        /// The response was already allocated to this marker, and then the Awarding Body removed it from the worklist.
        /// </summary>
        DeallocatedByAwardingBody = 7,

        /// <summary>
        /// Response is already allocated to another marker.
        /// </summary>
        AllocatedToAnotherMarker = 8,

        /// <summary>
        /// The response was already allocated to the current marker, and then rejected by the marker.
        /// </summary>
        AlreadyRejected = 9,

        /// <summary>
        /// Respective candidate script is not found.
        /// </summary>
        CandidateScriptNotFound = 10,

        /// <summary>
        /// The Marker is not approved.
        /// </summary>
        MarkerNotApproved = 11,

        /// <summary>
        /// The Marker is not suspended.
        /// </summary>
        MarkerSuspended = 12,

        /// <summary>
        /// The Marker is withdrawn.
        /// </summary>
        MarkerWithdrawn = 13
    }

    /**
     * Enum for the different Remark Request Types
     *
     * @export RemarkRequestType
     * @enum {number}
     */
    export enum RemarkRequestType {
        /// <summary>
        /// Unknown remark type.
        /// </summary>
        Unknown = 0,

        /// <summary>
        /// Abberant Marker remark type.
        /// </summary>
        AberrantMarker = 1,

        /// <summary>
        /// Reallocate rig remark type.
        /// </summary>
        ReallocateRIG = 2,

        /// <summary>
        /// Grade review remark type.
        /// </summary>
        GradeReview = 3,

        /// <summary>
        /// Priority Result Enquiry remark type.
        /// </summary>
        PriorityResultEnquiry = 4,

        /// <summary>
        /// Result Enquiry remark type.
        /// </summary>
        ResultEnquiry = 5,

        /// <summary>
        /// Seeding Remark remark type.
        /// </summary>
        SeedingRemark = 6,

        /// <summary>
        /// Grade review remark type.
        /// </summary>
        RemarkCandidate = 7,

        /// <summary>
        /// Remark RIG Examiner remark type.
        /// </summary>
        RemarkRIGExaminer = 8,

        /// <summary>
        /// Remark Candidate Examiner remark type.
        /// </summary>
        RemarkCandidateExaminer = 9,

        /// <summary>
        /// Grade review remark type.
        /// </summary>
        PartialRemark = 10,

        /// <summary>
        /// Grade Review Directed remark type.
        /// </summary>
        GradeReviewDirected = 11,

        /// <summary>
        /// Insufficient Sample remark type.
        /// </summary>
        InsufficientSample = 12,

        /// <summary>
        /// Pooled Results Enquiry remark type.
        /// </summary>
        PooledResultsEnquiry = 13,

        /// <summary>
        /// Superviso rRemark remark type.
        /// </summary>
        SupervisorRemark = 14,

        /// <summary>
        /// Grade Review Pooled remark type.
        /// </summary>
        GradeReviewPooled = 15,

        /// <summary>
        /// Remark Candidate RIG remark type.
        /// </summary>
        RemarkCandidateRIG = 16,

        /// <summary>
        /// Grade review remark type.
        /// </summary>
        SampleRemark = 17,

        /// <summary>
        /// At-Risk remark type.
        /// </summary>
        AtRisk = 18,

        /// <summary>
        /// At-Risk Pooled remark type.
        /// </summary>
        AtRiskPooled = 19,

        /// <summary>
        /// Enquiry Upon Result remark type.
        /// </summary>
        EnquiryUponResult = 20,

        /// <summary>
        /// Enquiry Upon Result Pooled remark type.
        /// </summary>
        EnquiryUponResultPooled = 21,

        /// <summary>
        /// Remark type.
        /// </summary>
        Remark = 22,

        /// <summary>
        /// Remark pooled type.
        /// </summary>
        RemarkPooled = 23,

        /// <summary>
        /// Open Review Remark type.
        /// </summary>
        ReviewRemark = 24,

        /// <summary>
        /// Pooled Admin remark type
        /// </summary>
        PooledAdminRemark = 25,

        /// <summary>
        /// Pooled case review remark type
        /// </summary>
        PooledCaseReviewRemark = 26,

        /// <summary>
        /// Withdrawn seed remark type
        /// </summary>
        WithdrawnSeedRemark = 27,

        /// <summary>
        /// Re-mark Pooled 1  remark type
        /// </summary>
        RemarkPooled1 = 28,

        /// <summary>
        /// Re-mark Pooled 2  remark type
        /// </summary>
        RemarkPooled2 = 29,

        /// <summary>
        /// Re-mark Pooled 3  remark type
        /// </summary>
        RemarkPooled3 = 30,

        /// <summary>
        /// Adjudication Pooled  remark type
        /// </summary>
        AdjudicationPooled = 31,

        /// <summary>
        /// Deallocation Remark re-mark type
        /// </summary>
        DeallocationRemark = 32,

        /// <summary>
        /// Double Marking Remark re-mark type
        /// </summary>
        DoubleMarking = 33,

        /// <summary>
        /// Arbitration Remark re-mark type
        /// </summary>
        ArbitrationRemark = 34,

        /// <summary>
        /// The priority remark
        /// </summary>
        PriorityRemark = 35,

        /// <summary>
        /// The quality remark
        /// </summary>
        QualityRemark = 36
    }

    /**
     * Enum for the Approval for Mark Scheme Groups.
     *
     * @export ExaminerApproval
     * @enum {number}
     */
    export enum ExaminerApproval {
        /// <summary>
        /// Unknown Approval status.
        /// </summary>
        None = 0,

        /// <summary>
        /// Not Approved status.
        /// </summary>
        NotApproved = 1,

        /// <summary>
        /// Completed practice responses.
        /// </summary>
        PracticeCompleted = 2,

        /// <summary>
        /// Completed standardisation responses
        /// </summary>
        StandardisationCompleted = 3,

        /// <summary>
        /// Examiner is approved.
        /// </summary>
        Approved = 4,

        /// <summary>
        /// Examiner is approved for review.
        /// </summary>
        ApprovedReview = 5,

        /// <summary>
        /// Examiner is unapproved and assigned for re-standardisation.
        /// </summary>
        UnapprovedRestandardise = 6,

        /// <summary>
        /// Examiner is rejected.
        /// </summary>
        UnapprovedRejected = 7,

        /// <summary>
        /// Examiner is withdrawn.
        /// </summary>
        Withdrawn = 8,

        /// <summary>
        /// Examiner is suspended.
        /// </summary>
        Suspended = 9,

        /// <summary>
        /// Examiner is approved
        /// </summary>
        ConditionallyApproved = 10,

        /// <summary>
        /// Examiner is awaiting approval
        /// </summary>
        AwaitingApproval = 11,

        /// <summary>
        /// Examiner has completed live marking
        /// </summary>
        Complete = 12
    }

    /**
     * Enum for Examiner Role.
     *
     * @export ExaminerRole
     * @enum {number}
     */
    export enum ExaminerRole {
        none = 0,
        assistantExaminer = 1,
        teamLeader = 2,
        principalExaminer = 3,
        administrator = 4,
        generalMarker = 5,
        viewer = 6,
        assistantPrincipalExaminer = 9,
        assistantExaminer_MFI_SSU = 11,
        assistantExaminer_MFI = 12,
        subjectMarker_MFI_Marking_Centre = 13,
        subjectMarker_MFI_Home = 14,
        serviceDelivery = 15,
        superAdministrator = 16,
        seniorTeamLeader = 17,
        principalModerator_Postal = 18,
        autoMarker = 19,
        subjectMarker_MFI_H_SSU = 20,
        autoApprovedSeniorTeamLeader = 21,
        autoMessaging = 22,
        adminRemarker = 23,
        assistantExaminer_Visiting = 24,
    }

    /**
     * Enum for the Tristate status.
     *
     * @export Tristate
     * @enum {number}
     */
    export enum Tristate {
        open,
        close,
        notSet
    }

    /**
     * Enum for the Marking Mode of the Question Paper.
     *
     * @export MarkingMethod
     * @enum {number}
     */
    export enum MarkingMethod {
        /// <summary>
        /// An enum constant representing the mark from script option.
        /// </summary>
        MarkFromScript = 1,

        /// <summary>
        /// An enum constant representing the structured option.
        /// </summary>
        Structured = 2,

        /// <summary>
        /// An enum constant representing the unstructured option.
        /// </summary>
        Unstructured = 3,

        /// <summary>
        /// An enum constant representing the mark from object option.
        /// </summary>
        MarkFromObject = 4
    }

    /**
     * Enum for different Configurable Characteristic levels
     *
     * @export ConfigurableCharacteristicLevel
     * @enum {number}
     */
    export enum ConfigurableCharacteristicLevel {

        /// <summary>
        /// An enum constant representing the MarkSchemeGroup level CCs
        /// </summary>
        MarkSchemeGroup,

        /// <summary>
        /// An enum constant representing the QuestionPaper level CCs
        /// </summary>
        QuestionPaper,

        /// <summary>
        /// An enum constant representing the ExamSession level CCs
        /// </summary>
        ExamSession,

        /// <summary>
        /// An enum constant representing the ExamBody level CCs
        /// </summary>
        ExamBody
    }

    /**
     * Enum for the different date fields in worklist
     *
     * @export WorkListDateType
     * @enum {number}
     */
    export enum WorkListDateType {
        allocatedDate,
        lastUpdatedDate,
        submittedDate
    }

    /**
     * Enum for the different group by fields available
     *
     * @export GroupByField
     * @enum {number}
     */
    export enum GroupByField {
        session,
        questionPaper,
        component,
        markingModeId,
        stampType,
        qig
    }

    /**
     * Enum for the different Worklist Type
     *
     * @export WorklistType
     * @enum {number}
     */
    export enum WorklistType {
        none,
        live,
        atypical,
        simulation,
        practice,
        standardisation,
        secondstandardisation,
        directedRemark,
        pooledRemark,
        classification,
        PreStandardisation
    }

    /**
     * Enum for PreviousMarksColumnType
     *
     * @export PreviousMarksColumnType
     * @enum {number}
     */
    export enum PreviousMarksColumnType {
        None,
        DirectedRemark,
        Practice,
        Standardisation,
        Secondstandardisation,
        Seed,
        PooledRemark
    }


    /**
     * Enum for ResponseStatus
     *
     * @export ResponseStatus
     * @enum {number}
     */
    export enum ResponseStatus {
        none,
        markingInProgress,
        markingNotStarted,
        hasException,
        readyToSubmit,
        notAllPagesAnnotated,
        markChangeReasonNotExist,
        supervisorRemarkDecisionNotSelected,
        notAllFilesViewed,
        hasZoningException,
        wholeResponseNotAvailable,
        definitiveMarkingNotStarted,
        NoViewDefinitivesPermisssion,
        NoPermissionToClassify
    }

    /**
     * Enum for different Grid Type
     *
     * @export GridType
     * @enum {number}
     */
    export enum GridType {

        /// <summary>
        /// An enum constant representing detail view of grid
        /// </summary>
        detailed,

        /// <summary>
        /// An enum constant representing tiled view of grid
        /// </summary>
        tiled,

        /// <summary>
        /// An enum constant representing mark by question view of grid
        /// </summary>
        markByQuestion,

        /// <summary>
        /// An enum constant representing total mark view of grid
        /// </summary>
        totalMarks
    }

    /**
     * Enum for the different Response modes
     *
     * @export ResponseMode
     * @enum {number}
     */
    export enum ResponseMode {
        /// <summary>
        /// An enum constant representing open response
        /// </summary>
        open = 0,

        /// <summary>
        /// An enum constant representing inGrace response
        /// </summary>
        pending = 1,

        /// <summary>
        /// An enum constant representing closed response
        /// </summary>
        closed = 2,

        /// <summary>
        /// Unknown response mode.
        /// </summary>
        none = 3,
    }

    /**
     * Enum for Response allocation error codes
     *
     * @export ResponseAllocationErrorCode
     * @enum {number}
     */
    export enum ResponseAllocationErrorCode {

        /// <summary>
        /// Response allocated successfully.
        /// </summary>
        none = 0,

        /// <summary>
        /// When standardisation is not complete for the selected QIG
        /// AND the marker is not in simulation mode for the QIG
        /// </summary>
        standardisationNotComplete = 1000,

        /// <summary>
        /// When the Marker's approval status is 'Withdrawn'
        /// </summary>
        withdrawnMarker = 1001,

        /// <summary>
        /// When the Marker's approval status is 'Suspended'
        /// </summary>
        suspendedMarker = 1002,

        /// <summary>
        /// When the Marker does not have a target and the session is either 'Closed'
        /// or 'Closed for non-re-markers' for this QIG
        /// </summary>
        sessionClosed = 1003,

        /// <summary>
        /// When the Marker does not have a target but the session is open for this QIG
        /// </summary>
        noMarkingTarget = 1004,

        /// <summary>
        /// When the number of RIG allocated to the Marker is >= marking target + over allocation limit
        /// </summary>
        maximumAllocatedResponseLimitReached = 1005,

        /// <summary>
        /// When the 'Live Marking For Approved Examiners Only' configurable characteristic is turned on for the selected QIG
        /// and the current target for the Marker is 'Live' and the Marker's status is not 'Approved' or 'ApprovedReview'
        /// </summary>
        unApprovedMarker = 1006,

        /// <summary>
        /// When the concurrent limit for the selected QIG is less than or equal to the number of RIGs the Marker currently has open
        /// </summary>
        maximumConcurrentResponseLimitReached = 1007,

        /// <summary>
        /// When a whole response marking was requested and no RIG is returned from Assessor
        /// </summary>
        noWholeResponseAvailable = 1008,

        /// <summary>
        /// When no RIG is returned from Assessor
        /// </summary>
        noResponseAvailable = 1009,

        /// <summary>
        /// When a Mark From Paper (MFP) response  was requested and no RIG is returned from Assessor
        /// </summary>
        noMFPResponseAvailable = 1010,

        /// <summary>
        /// When a marker has a Seed target and the Seed Allocation failed.
        /// </summary>
        noSeedAvailable = 1011,

        /// <summary>
        /// The maximum aggregated allocated response limit reached
        /// </summary>
        maximumAggregatedAllocatedResponseLimitReached = 1012,

        /// <summary>
        /// The maximum aggregated concurrent response limit reached
        /// </summary>
        maximumAggregatedConcurrentResponseLimitReached = 1013,

        /// <summary>
        /// The concurrent limit not met even after the response allocation request
        /// </summary>
        concurrentLimitNotMet = 1014,

        /// <summary>
        /// The marking limit reached before could download the required number of responses
        /// </summary>
        markingLimitReached = 1015
    }

    /**
     * Enum for Busy Indicator invoker
     *
     * @export BusyIndicatorInvoker
     * @enum {number}
     */
    export enum BusyIndicatorInvoker {

        /// <summary>
        /// None.
        /// </summary>
        none = 0,

        /// <summary>
        /// Busy indicator for response allocation.
        /// </summary>
        responseAllocation = 1,

        /// <summary>
        /// Busy indicator for response submit.
        /// </summary>
        submit = 2,

        /// <summary>
        /// Busy indicator for submitting all responses.
        /// </summary>
        submitAll = 3,

        /// <summary>
        /// Busy indicator for save email address.
        /// </summary>
        saveEmail = 4,

        /// <summary>
        /// Busy indicator for Loading response.
        /// </summary>
        loadingResponse = 5,

        /// <summary>
        /// Busy indicator for Saving Marks and Annotations.
        /// </summary>
        savingMarksAndAnnotations = 6,

        /// <summary>
        /// Busy indicator for loading typescript modules
        /// </summary>
        loadingModules = 7,

        /// <summary>
        /// Busy indicator for response submit in marking screen.
        /// </summary>
        submitInResponseScreen = 8,

        ///<summary>
        /// Busy indicator for markingCHeck Complete.
        /// </summary>
        markingCheckComplete = 9,

        ///<summary>
        /// Busy indicator for loading history details.
        /// </summary>
        loadingHistoryDetails = 10,

        ///<summary>
        /// Busy indicator for help examiner data for multiqig.
        /// </summary>
        loadingQigDetailsFromMultiQig = 11,

        ///<summary>
        /// Busy indicator for completing standardisation setup.
        /// </summary>
        completingStandardisationSetup = 12,

        ///<summary>
        /// Busy indicator for validating standardisation setup.
        /// </summary>
        validateStandardisationSetup = 13,

        ///<summary>
        /// Busy indicator for reclassifyResponse.
        /// </summary>
        reclassifyResponse = 14,

        ///<summary>
        /// Busy indicator for reuse response action.
        /// </summary>
        reuseResponse = 15,

        ///<summary>
        /// Busy indicator for returnResponse.
        /// </summary>
        returnResponse = 16,

        ///<summary>
        /// Busy indicator for classify response action from unclassified worklist.
        /// </summary>
        classifyResponse = 17
    }

    /**
     * Enum for BackgroundWorkers
     *
     * @export BackgroundWorkers
     * @enum {number}
     */
    export enum BackgroundWorkers {

        /// <summary>
        /// None.
        /// </summary>
        none = 0,

        /// <summary>
        /// Background worker for script download
        /// </summary>
        scriptImageDownloader = 1
    }

    /**
     * Submit response Error Codes
     *
     * @export SubmitResponseErrorCode
     * @enum {number}
     */
    export enum SubmitResponseErrorCode {
        /// <summary>
        /// Response has no validation errors
        /// </summary>
        none = 0,

        /// <summary>
        /// Response not opened
        /// </summary>
        responseNotOpened,

        /// <summary>
        /// Not fully marked
        /// </summary>
        responseNotFullyMarked,

        /// <summary>
        /// Response has Exceptions
        /// </summary>
        responseHasExceptions,

        /// <summary>
        /// Response already submitted
        /// </summary>
        responseAlreadySubmitted,

        /// <summary>
        /// Examiner not approved
        /// </summary>
        examinerNotApproved,

        /// <summary>
        /// Examiner suspended
        /// </summary>
        examinerSuspended,

        /// <summary>
        /// Examiner withdrawm
        /// </summary>
        examinerWithdrawn,

        /// <summary>
        /// All Pages are not annotated
        /// </summary>
        allPagesNotAnnotated,

        /// <summary>
        /// The all slaos not annotated
        /// </summary>
        allSLAOsNotAnnotated,

        /// <summary>
        /// Response is put onhold
        /// </summary>
        onHold,

        /// <summary>
        /// The mandate markscheme not commented
        /// </summary>
        mandateMarkschemeNotCommented,

        /// <summary>
        /// The rig is not found
        /// </summary>
        rigNotFound,

        /// <summary>
        /// Not all files are viewed
        /// </summary>
        notAllFilesViewed,

        /// <summary>
        /// Sibling RIG has Zoning Exception
        /// </summary>
        hasZoningException
    }

    /**
     * Type of Tools
     *
     * @export ToolType
     * @enum {number}
     */
    export enum ToolType {
        /// Ruler tool
        ruler,

        /// Protractor Tool
        protractor,

        /// Multi Line Overlay Tool
        multiline
    }

    /**
     * Type of Multiline items
     *
     * @export multilineItems
     * @enum {number}
     */
    export enum MultiLineItems {
        all,
        point,
        line
    }
    /**
     * Types of Lines
     *
     * @export LineType
     * @enum {number}
     */
    export enum LineType {
        /// Line type is none
        none,

        /// Line type is Line
        line,

        /// Line type is curve
        curve
    }

    /**
     * Types of Popup Dialogs.
     *
     * @export PopupDialogType
     * @enum {number}
     */
    export enum PopupDialogType {

        /// <summary>
        /// An enum constant representing Popup Dialog Type.
        /// </summary>
        none,

        /// <summary>
        /// An enum constant representing popup dialog for response allocation error.
        /// </summary>
        ResponseAllocationError,

        /// <summary>
        /// An enum constant representing popup dialog for standardisation approved.
        /// </summary>
        StandardisationApproved,

        /// <summary>
        /// An enum constant representing popup dialog for EmailSave.
        /// </summary>
        EmailSave,

        /// <summary>
        /// Validate mark entry
        /// </summary>
        MarkEntryValidation,

        // Detailed Non recoverable error.
        NonRecoverableDetailedError,

        /// <summary>
        /// An enum constant representing popup dialog for which, ForceAnnotationOnEachPage CC is on but all pages are not annotated.
        /// </summary>
        AllPageNotAnnotated,

        /// <summary>
        /// Reset Mark
        /// </summary>
        ResetMark,

        LogoutConfirmation,

        MbCReturnToWorklistConfirmation,

        /// <summary>
        /// Quality Feedback
        /// </summary>
        QualityFeedbackWarning,

        // <summary>
        /// Accept Quality Feedback
        /// </summary>
        AcceptQualityFeedback,

        // <summary>
        /// Grace Period Warning
        /// </summary>
        GracePeriodWarning,

        // <summary>
        /// Grace Period Warning
        /// </summary>
        MarkChangeReasonError,
        // <summary>
        /// Application offline Warning
        /// </summary>
        OffLineWarning,
        // <summary>
        /// Forgot Confirmation
        /// </summary>
        ForgotPasswordConfirmation,
        // <summary>
        /// Remark Created
        /// </summary>
        RemarkCreated,

        /// <summary>
        /// Already Reviewed Response
        /// </summary>
        ResponseAlreadyReviewed,

        /// <summary>
        /// error when unlinking a page
        /// </summary>
        RemoveLinkError,

        /// <summary>
        /// Unlock Examiner Confirmation Popup
        /// </summary>
        UnlockExaminerConfirmation,

        /// <summary>
        /// manage slao popup when navigate to frv
        /// </summary>
        ManageSLAO,

        /// <summary>
        /// unmanage slao flag as seen popup
        /// </summary>
        UnmanagedSLAOFlagAsSeen,

        /// <summary>
        /// Promote to seed confirmation dialogue
        /// </summary>
        PromoteToSeedConfirmation,

        /// <summary>
        /// Promote to seed declined dialogue
        /// </summary>
        PromoteToSeedDeclined,

        /// <summary>
        /// Reject rig confirmation
        /// </summary>
        RejectRigConfirmation,

        /// <summary>
        /// Prompt on clicking ComleteMarking Checkbutton
        /// </summary>
        CompleteMarkingCheck,

        /// <summary>
        /// All SLAO Managed dialogue
        /// </summary>
        AllSLAOsManaged,

        /// <summary>
        /// Unmanaging SLAO confirmation
        /// </summary>
        ReviewOfSLAOConfirmation,

        /// <summary>
        /// Promote to seed remark confirmation dialogue
        /// </summary>
        PromoteToSeedRemarkConfirmation,

        /// <summary>
        /// Generic Message dialogue
        /// </summary>
        GenericMessage,

        /// <summary>
        /// Offline warning on container change and bundles not loaded
        /// </summary>
        OffLineWarningOnContainerFailure,


        /// <summary>
        /// Simulation Response Submit Confirmation Dialog
        /// </summary>
        SimulationResponseSubmitConfirmation,

        /// <summary>
        /// Simulatino exited popup
        /// </summary>
        SimulationExited,

        /// <summary>
        /// From Exception panel.
        /// </summary>
        Exception,

        /// <summary>
        /// From Message panel.
        /// </summary>
        Message,

        /// <summary>
        /// From submit panel
        /// </summary>
        SubmitResponseError,

        /// <summary>
        /// unknown content flag as seen popup
        /// </summary>
        UnknownContentFlagAsSeen,

        /// <summary>
        /// From share context menu
        /// </summary>
        ShareConfirmationPopup,

        /// <summary>
        /// unknown content review confirmation
        /// </summary>
        ReviewOfUnknownContentConfirmation,

        /// <summary>
        /// confirmation for whole response remark creation
        /// </summary>
        WholeResponseRemarkConfirmation,

        /// <summary>
        /// Declassify popup type
        /// </summary>
        Declassify,

        /// <summary>
        /// Declassify popup type
        /// </summary>
        CompleteStandardisationPopup,

        /// <summary>
        /// Reclassify error popup type
        /// </summary>
        ReclassifyError,

        /// <summary>
        /// Discard response error popup type
        /// </summary>
        DiscardResponse,

        /// <summary>
        /// Concurrent es marking mode save fail error popup type
        /// </summary>
        ConcurrentSaveFail,

        /// <summary>
        /// Return response to marker popup type
        /// </summary>
        ReturnResponseToMarker
    }

    /**
     * Enums for ResponseViewMode
     *
     * @export ResponseViewMode
     * @enum {number}
     */
    export enum ResponseViewMode {
        // Default view
        none,

        // Full Response View
        fullResponseView,

        // Zoned View
        zoneView
    }

    /**
     * Enums for OperationMode
     *
     * @export OperationMode
     * @enum {number}
     */
    export enum OperationMode {
        /* Default value */
        none = 0,
        /* An enum constant representing Edit operation. */
        edit = 1,
        /* An enum constant representing normal operation. */
        normal = 2
    }

    /**
     * enum for representing different directions.
     *
     * @export ResponseNavigation
     * @enum {number}
     */
    export enum ResponseNavigation {
        // enum for specific response
        specific,

        //enum for previous response
        previous,

        //enum for next response
        next,

        // enum for navigation from markscheme panel
        markScheme,

        // enum for first response
        first,

        // none of the above
        none,

        // enum for last response
        last
    }

    /**
     * Enums for TreeViewItemType
     *
     * @export TreeViewItemType
     * @enum {number}
     */
    export enum TreeViewItemType {

        /// The Question Paper
        questionPaper,

        /// The whole response
        wholeResponse,

        /// The QIG
        QIG,

        /// The cluster
        cluster,

        ///The answer item
        answerItem,

        /// The mark scheme
        marksScheme
    }

    /**
     * Enums for MarkTypeVariety
     *
     * @export
     * @enum {number}
     */
    export enum MarkTypeVariety {
        // Standard
        standard,

        // Additional mark
        additionalMark
    }

    /**
     * Different stamp types
     *
     * @export StampType
     * @enum {number}
     */
    export enum StampType {
        // None
        none = 0,

        // Image
        image = 1,

        // Dynamic
        dynamic = 2,

        // Text
        text = 3,

        // Tools
        tools = 4,

        // Bookmark
        bookmark = 5
    }

    /**
     *  enum for priority
     *
     * @export Priority
     * @enum {number}
     */
    export enum Priority {

        // first priority
        First = 1,

        // second priority
        Second = 2,

        // third priority
        Third = 3,

        // fourth priority
        Fourth = 4,

        // fifth priority
        Fifth = 5
    }

    /**
     * Enum for MarkRuleType
     *
     * @export MarkRuleType
     * @enum {number}
     */
    export enum MarkRuleType {
        default
    }

    /**
     * enum for AccuracyRuleType
     *
     * @export AccuracyRuleType
     * @enum {number}
     */
    export enum AccuracyRuleType {
        default,
        markschemetolerance,
        specificmarktolerance
    }

    /**
     * enum for Favorite Stamp Action
     *
     * @export FavoriteStampActionType
     * @enum {number}
     */
    export enum FavoriteStampActionType {
        None = 0,
        Add = 1,
        Remove = 2,
        LoadFromUserOption = 3,
        Insert = 4
    }

    /**
     *  enums for the key event type
     *
     * @export KeyMode
     * @enum {number}
     */
    export enum KeyMode {

        // Indicating key down
        down = 1,
        // Indicating keypress
        press = 2,
        // Indicating keyUp
        up = 2
    }

    /**
     * enum for identifying the key code.
     *
     * @export KeyCode
     * @enum {number}
     */
    export enum KeyCode {
        // backspace key
        backspace = 8,
        // handling enter key
        enter = 13,
        // left key
        left = 37,
        // up arrow key
        up = 38,
        // right arrow key
        right = 39,
        // down arrow key
        down = 40,
        // delete key
        delete = 46,
        // NR key short cut
        hash = 35,
        // NR short cut
        forwardSlash = 47,
        // Tab key
        tab = 9
    }

    /**
     * enum for specifying the full response view image view option
     *
     * @export FullResponeViewOption
     * @enum {number}
     */
    export enum FullResponeViewOption {
        // One page view
        onePage = 1,
        // Two page view
        twoPage = 2,
        // Four page view
        fourPage = 4
    }

    /**
     *  Enum for specifying the cursor type when drawing over the cursor.
     *
     * @export CursorType
     * @enum {number}
     */
    export enum CursorType {
        // Cursor type for pan action.
        Pan = 1,
        // Cursor type for select action.
        Select = 2
    }

    /**
     * enum for row status
     *
     * @export MarkingOperation
     * @enum {number}
     */
    export enum MarkingOperation {
        none = 0,
        // new row
        added = 1,
        // updated row
        updated = 2,
        // deleted row
        deleted = 3
    }

    /**
     * enum for context menu types.
     *
     * @export ContextMenuType
     * @enum {number}
     */
    export enum ContextMenuType {
        // annotation
        annotation = 0,
        // bookmark
        bookMark = 1,
        // acetate
        acetate = 2
    }

    /**
     * Enum for SaveAndNavigate options
     *
     * @export SaveAndNavigate
     * @enum {number}
     */
    export enum SaveAndNavigate {
        none = 0,
        /* Navigating to another response */
        toResponse = 1,
        /* Navigating from response to worklist */
        toWorklist = 2,
        /* Navigating from response to logout */
        toLogout = 3,
        /* Navigating from response to full response view */
        toFullResponseview = 4,
        /* Navigating back to the current response */
        toCurrentResponse = 5,
        /* Navigate to worklist using browser back button */
        toWorklistUsingBackButton = 6,
        /* Navigate to last response */
        lastResponse = 7,
        /* Navigate to inbox message page */
        toInboxMessagePage = 8,
        /* Navigating when submitting the response from markscheme */
        submit = 9,
        /* Display Message in the currentResponse */
        messageWithInResponse = 10,
        /* Display when new message button is clicked */
        newMessageButtonClick = 11,
        /* Display when reply button is clicked */
        toReplyMessage = 12,
        /* Display when forward button is clicked */
        toForwardMessage = 13,

        /*Clicking acceptFeedback button*/
        fromQualityFeedback = 14,
        /* Display when new exception button is clicked */
        newExceptionButtonClick = 15,
        /* Display Exception in the currentResponse */
        exceptionWithInResponse = 16,
        /* Display response message screen when new message button clicked */
        toNewResponseMessageCompose = 17,
        /* Display qig selector screen when logo is clicked */
        toQigSelector = 18,
        /* Display menu screen when menu icon is clicked */
        toMenu = 19,
        /* Display team details when team link is clicked*/
        toTeam = 20,
        /* navigate to next response when setAsReviewed button is clicked*/
        toSetAsReviewed = 21,
        /* navigate to next response when mark Now button is clicked*/
        toSupervisorRemark = 22,
        /* navigate to next response when promote to seed button is clicked*/
        toPromoteToSeed = 23,
        /* navigates to marking check worklist */
        toMarkingCheckWorklist = 24,
        /* Displays when raise an exception from error dialog is clicked */
        newExceptionFromMediaErrorDialog = 25,
        /* Navigating to select responses tab in standardisation setup */
        toSelectResponses = 26,
        /* Navigating to provisional tab in standardisation setup */
        toProvisional = 27,
        /* Navigating to un-classified tab in standardisation setup */
        toUnclassified = 28,
        /* Navigating to classified tab in standardisation setup */
        toClassified = 29,
        /* Navigating to awarding tab */
        toAwarding = 30,
        /** Share and classify */
        shareAndClassify =  31
    }

    /**
     * enum for marks and annotations error code.
     *
     * @export SaveMarksAndAnnotationErrorCode
     * @enum {number}
     */
    export enum SaveMarksAndAnnotationErrorCode {

        // Marks and annotations saved successfully.
        None = 0,

        // Marks and annotations cannot be saved as response is closed.
        ClosedResponse = 1,

        // Marks and annotations cannot be saved as the specified marks and annotations are out of date.
        // version changes.
        MarksAndAnnotationsOutOfDate = 2,

        // Marks and annotations cannot be retrieved as response is Withdrawn.
        WithdrawnResponse = 3,

        // All Pages are not annotated
        AllPagesNotAnnotated = 4,

        // Mismatch in Marks And Annotations
        MarksAndAnnotationsMismatch = 5,

        // The stamps modified during the log in time
        StampsModified = 6,

        // The mandate markscheme not commented
        MandateMarkschemeNotCommented = 7,

        // The non recoverable error
        NonRecoverableError = 8,

        // The un allocated response
        UnallocatedResponse = 9,

        // If response is promoted as seed for STM members
        ResponseRemoved = 10,

        // Mismatch in Marks
        TotalMarkMismatch = 11
    }

    /**
     * Enum for the type of action initiated to add annotation.
     *
     * @export AddAnnotationAction
     * @enum {number}
     */
    export enum AddAnnotationAction {
        // Add annotation by stamping.
        Stamping = 1,
        // Add annotation by pan action.
        Pan = 2
    }

    /**
     * Enum for specifying the pan source; source from where pan action was initiated.
     *
     * @export PanSource
     * @enum {number}
     */
    export enum PanSource {
        // Pan source is stamp panel.
        StampPanel = 1,
        // Pan source is annotation overlay.
        AnnotationOverlay = 2
    }

    /**
     *  enum for the Triggering points of Save Marks and Annotations Queue
     *
     * @export SaveMarksAndAnnotationsProcessingTriggerPoint
     * @enum {number}
     */
    export enum SaveMarksAndAnnotationsProcessingTriggerPoint {

        // None
        None = 0,

        // Saving of marks and annotations is triggered by closing of the response
        CloseResponse = 1,

        // Saving of marks and annotations is triggered by logout from the application
        Logout = 2,

        // Saving of marks and annotations is triggered by the background worker itself which polls the queue at constant intervals
        BackgroundWorker = 4,

        Inbox = 5,

        Submit = 6,

        // Saving of marks and annotations is triggered on classify button click from response screen
        Classify = 7,

        ShareAndClassify = 8

    }

    /**
     * enum for the MarksAndAnnotationsQueueOperation
     *
     * @export MarksAndAnnotationsQueueOperation
     * @enum {number}
     */
    export enum MarksAndAnnotationsQueueOperation {

        // None
        None = 0,

        // Removing from the queue
        Remove = 1,

        // Re-queueing to the queue
        Requeue = 2,

        // increment retry count and enqueue
        Retry = 3,
    }

    /**
     * enum for the different DataServiceRequestErrorType
     *
     * @export DataServiceRequestErrorType
     * @enum {number}
     */
    export enum DataServiceRequestErrorType {

        // None
        None = 0,

        // The request failed due to a generic error
        GenericError = 1,

        // The request couldn't be processed because of ongoing priority requests
        Skipped = 2,

        // The request didn't succeed because authorisation failed (say, Cookie got expired)
        Unauthorized = 3,

        // The request is not completed due to network issue.
        NetworkError = 4
    }

    /**
     * enum for Stamp Banner Type
     *
     * @export
     * @enum {number}
     */
    export enum BannerType {
        None = 0,
        CustomizeToolBarBanner = 1,
        ShrinkExpandedBanner = 2,
        QualityFeedbackBanner = 3,
        HelperMessageWithClose = 4,
        CompleteStdSetupBanner = 5
    }

    /**
     * This will returns the enum string.
     *
     * @export getEnumString
     * @param {*} aEnum
     * @param {*} aKey
     * @returns {string}
     */
    export function getEnumString(aEnum: any, aKey: any): string {
        return aEnum[aKey];
    }

    /**
     * enum for identifying the Dynamic Annotations.
     *
     * @export DynamicAnnotation
     * @enum {number}
     */
    export enum DynamicAnnotation {

        // Not applicable
        None = 0,

        // Highlighter component
        Highlighter = 151,

        // Horizontal Line Component
        HorizontalLine = 1361,

        // Ellipse Component
        Ellipse = 1351,

        // OnpageComment
        OnPageComment = 171,

        //Horizontal Wavy Line Component
        HWavyLine = 1371,

        //Vertical Wavy Line Component
        VWavyLine = 1381,

        // OffPage Comments
        OffPageComment = 181
    }

    /**
     * enum for identifying the edge while resizing.
     *
     * @export AnnotationBorderType
     * @enum {number}
     */
    export enum AnnotationBorderType {
        RightEdge = 0,
        BottomEdge = 1,
        LeftEdge = 2,
        TopEdge = 3,
        TopLeft = 4,
        BottomLeft = 5,
        TopRight = 6,
        BottomRight = 7,
        Default = 8
    }

    /**
     * enum for identifying the user action in context menu.
     *
     * @export MenuAction
     * @enum {number}
     */
    export enum MenuAction {
        RemoveAnnotation = 0,
        ChangeAnnotationColor = 1,
        RemoveOverlay = 2,
        RemoveMultilinePoint = 3,
        RemoveMultilineLine = 4,
        AddMultilinePoint = 5,
        AddMultilineLine = 6,
        StraightLine = 7,
        CurvedLine = 8,
        HiddenLine = 9,
        AddOverlay = 10,
        ChangeColorOverlay = 11,
        LineStyleOverlay = 12,
        MultilineRed = 13,
        MultilineBlue = 14,
        MultilineGreen = 15,
        MultilineYellow = 16,
        MultilineBlack = 17,
        MultilinePink = 18
    }

    /**
     *  enum for identifying CC Settings for color change.
     *
     * @export ConfigurableCharacteristicsColorStatus
     * @enum {number}
     */
    export enum ConfigurableCharacteristicsColorStatus {
        On = 0,
        Off = 1
    }

    /**
     * enum for identifying CC Settings for highlighter color change.
     *
     * @export ConfigurableCharacteristicsHighlighterColorStatus
     * @enum {number}
     */
    export enum ConfigurableCharacteristicsHighlighterColorStatus {
        No = 0,
        Yes = 1
    }

    /**
     * enum for identifying the user selection of response view zoom settings.
     *
     * @export ResponseViewSettings
     * @enum {number}
     */
    export enum ResponseViewSettings {
        RotateAntiClockwise = 0,
        RotateClockwise = 1,
        FitToWidth = 2,
        FitToHeight = 3,
        SetFracsDataForRotation = 4,
        CustomZoom = 5
    }

    /**
     * enum for identifying the rotate angle.
     *
     * @export RotateAngle
     * @enum {number}
     */
    export enum RotateAngle {
        Rotate_0 = 0,
        Rotate_90 = 90,
        Rotate_180 = 180,
        Rotate_270 = 270,
        Rotate_360 = 360
    }

    /**
     * enum for identifying the accuracy indicator type.
     *
     * @export AccuracyIndicatorType
     * @enum {number}
     */
    export enum AccuracyIndicatorType {
        Unknown = 0,
        Accurate = 1,
        WithinTolerance = 11,
        OutsideTolerance = 21,
        AccurateNR = 31,
        WithinToleranceNR = 41,
        OutsideToleranceNR = 51
    }

    /**
     * enums for identifying the flow of markschemepanel when the user select the markscheme.
     *
     * @export MarkSchemeNavigationDirection
     * @enum {number}
     */
    export enum MarkSchemeNavigationDirection {
        Forward = 0,
        Backward = 1
    }

    /**
     * enums for identifying type of mark difference
     *
     * @export MarksDifferenceType
     * @enum {number}
     */
    export enum MarksDifferenceType {
        None = 0,
        AbsoluteMarksDifference = 1,
        TotalMarksDifference = 2
    }

    /**
     * enums for Seed type
     *
     * @export SeedType
     * @enum {number}
     */
    export enum SeedType {
        None = 0,
        Gold = 15,
        EUR = 31
    }

    /**
     * enums for quality feedback status
     *
     * @export QualityFeedbackStatus
     * @enum {number}
     */
    export enum QualityFeedbackStatus {
        None = 0,
        FeedbackOutstanding = 1,
        FeedbackAccepted = 2
    }

    /**
     * enums for identifying type of add action.
     *
     * @export AddAction
     * @enum {number}
     */
    export enum AddAction {
        DrawStart = 0,
        DrawMove = 1,
        DrawEnd = 2
    }

    /**
     * Enum for Seed Submission Status
     *
     * @export SeedSubmissionStatus
     * @enum {number}
     */
    export enum SeedSubmissionStatus {
        /// <summary>
        /// The not applicable
        /// </summary>
        NotApplicable = 0,

        /// <summary>
        /// The seeds submitted within tolerance or accurately
        /// </summary>
        SeedsSubmittedWithinToleranceOrAccurately = 1,

        /// <summary>
        /// The seeds submitted out of tolerance
        /// </summary>
        SeedsSubmittedOutOfTolerance = 2
    }

    /**
     * possible errors that come when user tries to navigate away from response
     *
     * @export ResponseNavigateFailureReason
     * @enum {number}
     */
    export enum ResponseNavigateFailureReason {
        None = 0,
        MarksMissingInGracePeriodResponse = 1,
        AllPagesNotAnnotated = 2,
        AllPagesNotAnnotatedInGrace = 3,
        UnSentMessage = 4,
        MarkChangeReasonNeeded = 5,
        UnSavedException = 6,
        LastResponseLastQuestion = 7,
        AllSlaosNotAnnotated = 8,
        AllSlaosNotAnnotatedInGrace = 9,
        AllMarkedAsNR = 10,
        SuperVisorRemarkDecisionNeeded = 11,
        AtleastOneNRWithoutOptionality = 12,
        AtleastOneNRWithOptionalityUsedInTotal = 13,
        AtleastOneNRWithOptionalityNotUsedInTotal = 14,
        StandardisationSetupCompletedWhileInSimulation = 15,
        UnSavedEnhancedOffPageComment = 16,
        NotAllFilesViewed = 17,
        FileDownloadedOutside = 18
    }

    /**
     * enum for message priority
     *
     * @export MessagePriority
     * @enum {number}
     */
    export enum MessagePriority {
        Standard = 1,
        Important = 2,
        Mandatory = 3
    }

    /**
     * Enum for the Read status of Message
     *
     * @export MessageReadStatus
     * @enum {number}
     */
    export enum MessageReadStatus {
        New = 1,
        Read = 2,
        Closed = 3
    }

    /**
     * enum for message open and close actions
     *
     * @export MessageViewAction
     * @enum {number}
     */
    export enum MessageViewAction {
        None = 0,
        Open = 1,
        Close = 2,
        Minimize = 3,
        Maximize = 4,
        NavigateAway = 5,
        View = 6,
        Delete = 7
    }

    /**
     * enum for various popup types
     *
     * @export PopUpType
     * @enum {number}
     */
    export enum PopUpType {
        None = 0,
        DiscardMessage = 1,
        DiscardMessageNavigateAway = 2,
        DiscardOnNewMessageButtonClick = 3,
        MandatoryMessage = 4,
        DiscardException = 5,
        DiscardExceptionNavigateAway = 6,
        DiscardOnNewExceptionButtonClick = 7,
        DeleteMessage = 8,
        DiscardExceptionOnViewExceptionButtonClick = 9,
        DiscardMessageOnViewExceptionButtonClick = 10,
        DiscardExceptionOnNewMessage = 11,
        DiscardExceptionOnViewMessage = 12,
        DiscardMessageOnNewException = 13,
        CloseException = 14,
        RemarkCreationSuccess = 15,
        NoMarkingCheckRequestPossible = 16,
        MultiQigHelpExaminerNavigation = 17,
        ZoningExceptionWarning = 18,
        SelectToMarkAsProvisional = 19,
        AtypicalSearch = 20,
        Declassify = 21,
        CompleteStandardisationSetup = 22,
        CompleteStandardisationValidate = 23,
        MarkAsDefinitive = 24,
        Reclassify = 25,
        ReclassifyMultiOption = 26,
        ShareResponse = 27,
        ReclassifyError = 28,
        ConcurrentSaveFail = 29,
        ReuseRigAction = 30,
        DiscardResponseFail = 31
    }

    /**
     * enums for the popup size in CSS
     */
    export enum PopupSize {
        None = 0,
        Small = 1,
        Medium = 2,
        Large = 3
    }

    /**
     * enum for button types
     *
     * @export ButtonType
     * @enum {number}
     */
    export enum ButtonType {
        None = 0,
        Sampling = 1,
        SetAsReviewed = 2
    }

    /**
     * enum for popup action types
     *
     * @export PopUpActionType
     * @enum {number}
     */
    export enum PopUpActionType {
        Show = 0,
        Yes = 1,
        No = 2,
        Close = 3,
        Ok = 4
    }

    /**
     * Defines zoom types
     *
     * @export ZoomType
     * @enum {number}
     */
    export enum ZoomType {
        None = 0,
        PinchStart = 1,
        Pinch = 2,
        PinchEnd = 3,
        CustomZoomIn = 4,
        CustomZoomOut = 5,
        PinchOut = 6,
        PinchIn = 7,
        UserInput = 8
    }

    /**
     * Defines zoom preferences
     *
     * @export ZoomPreference
     * @enum {number}
     */
    export enum ZoomPreference {
        FitWidth = 0,
        FitHeight = 1,
        Percentage = 2,
        MarkschemePercentage = 3,
        FilePercentage = 4,
        None = 5
    }

    /**
     *  enum for drawing annotation direction.
     *
     * @export DrawDirection
     * @enum {number}
     */
    export enum DrawDirection {
        Left = 0,
        Right = 1,
        Top = 2,
        Bottom = 3
    }

    /**
     * enum for message folder types
     *
     * @export MessageFolderType
     * @enum {number}
     */
    export enum MessageFolderType {
        Inbox = 0,
        Sent = 1,
        Deleted = 2,
        None = 3
    }

    /**
     * different dropdown types in compose message panel
     *
     * @export DropDownType
     * @enum {number}
     */
    export enum DropDownType {
        Priority = 0,
        QIG = 1,
        EnhancedOffPageCommentQuestionItem = 2,
        EnhancedOffPageCommentFile = 3
    }

    /**
     * enum for different message types
     *
     * @export MessageType
     * @enum {number}
     */
    export enum MessageType {
        None = 0,
        ResponseCompose = 1,
        ResponseDetails = 2,
        InboxCompose = 3,
        WorklistCompose = 4,
        InboxForward = 5,
        InboxReply = 6,
        ResponseDelete = 7,
        ResponseReply = 8,
        ResponseForward = 9,
        TeamCompose = 10
    }

    /**
     * enum for message actions
     *
     * @export MessageAction
     * @enum {number}
     */
    export enum MessageAction {
        Reply = 1,
        Forward = 2,
        Delete = 3
    }

    /**
     *  enum for different exception status
     *
     * @export ExceptionStatus
     * @enum {number}
     */
    export enum ExceptionStatus {
        None = 0,
        Open = 1,
        Delayed = 2,
        Resolved = 3,
        Closed = 4,
        Rejected = 5
    }

    /**
     *  enum for different exception type.
     *
     * @export ExceptionType
     * @enum {number}
     */
    export enum ExceptionType {
        ImageRescanRequest = 2,
        IncorrectQuestionPaper = 6,
        ConcatenatedScriptException = 10,
        ImageCannotBeAccessedOrRead = 14,
        IncorrectComponentOrPaper = 12,
        NonScriptObject = 13,
        ZoningErrorMissingContent = 18,
        ZoningErrorOtherContent = 19,
        IncorrectImage = 26
    }

    /**
     * enum for different panel width type
     *
     * @export markSchemePanelType
     * @enum {number}
     */
    export enum markSchemePanelType {
        defaultPanel = 0,
        resizedPanel = 1,
        minimumWidthPanel = 2,
        resizingClassName = 3,
        updateDefaultPanel = 4
    }

    /**
     * Enum for different footer types
     *
     * @export FooterType
     * @enum {number}
     */
    export enum FooterType {
        // enum for login footer
        Login = 0,
        // enum for worklist footer
        Worklist = 1,
        // enum for response footer
        Response = 2,
        //enum for inbox footer
        Message = 3,
        //enum for team management footer
        TeamManagement = 4,
        // enum for reports footer
        Reports = 5,
        //enum for standardisation setup
        StandardisationSetup = 6,
        //enum for awarding
        Awarding = 7
    }

    /**
     *  enum for the Triggering points
     *
     * @export TriggerPoint
     * @enum {number}
     */
    export enum TriggerPoint {
        // None
        None = 0,
        // worklist
        Worklist = 1,
        // Qig selector
        QigSelector = 2,
        // response
        Response = 3,
        // logout
        Logout = 4,
        // worklist response message icon click
        WorkListResponseMessageIcon = 5,
        // firing directly from message store
        MessageStore = 6,
        // triggering point is background pulse
        BackgroundPulse = 7,
        // worklist response Exception icon click
        WorkListResponseExceptionIcon = 8,
        // DisplayId click in message
        AssociatedDisplayIDFromMessage = 9,
        // Supervisor Remark Created
        SupervisorRemark = 10,
        // Awarding
        Awarding = 11,
        // DisplayId search
        DisplayIdSearch = 12
    }

    /**
     * MessageNavigation
     *
     * @export MessageNavigation
     * @enum {number}
     */
    export enum MessageNavigation {
        none = 0,
        toResponse = 1,
        toQigSelector = 2,
        toSearchedResponse = 3,
        newException = 4,
        exceptionWithInResponse = 5,
        // Change the status of the Examiner
        ChangeStatus = 9,
        /* navigates to marking check worklist */
        toMarkingCheckWorklist = 24,
        /* Displays when raise an exception from error dialog is clicked */
        newExceptionFromMediaErrorDialog = 25
    }

    /**
     * enum for message open and close actions
     *
     * @export ExceptionViewAction
     * @enum {number}
     */
    export enum ExceptionViewAction {
        None = 0,
        Open = 1,
        Close = 2,
        Minimize = 3,
        Maximize = 4,
        NavigateAway = 5,
        View = 6
    }

    /**
     * enum for escalation point
     *
     * @export EscalationPoint
     * @enum {number}
     */
    export enum EscalationPoint {
        None = 1,
        Parent = 2,
        AdminAdAccount = 3,
        SdAdAccount = 4,
        ScanAdAccount = 5,
        PrincipalExaminer = 6,
        CandidateConcerns = 7,
        ZoningSupervisor = 8
    }

    /**
     * Enum for status type
     *
     * @export StatusType
     * @enum {number}
     */
    export enum StatusType {
        None = 0,
        New = 1,
        Read = 2,
        Closed = 3
    }

    /**
     * Enum for mark entry deactivator
     *
     * @export MarkEntryDeactivator
     * @enum {number}
     */
    export enum MarkEntryDeactivator {
        None = 0,
        Login = 1,
        Comment = 2,
        MarksChangeReason = 4,
        Messaging = 8,
        Exception = 16,
        ApplicationPopup = 32,
        EmailAddress = 64,
        TriggerSave = 128,
        Annotation = 256,
        CombinedWarningMessagePopup = 512,
        Menu = 1024,
        RejectRigConfirmationPopUp = 2048,
        EnhancedOffPageComments = 4096,
        OffPageComments = 8192,
        Bookmark = 16384,
        MarkingOverlay = 32768,
        Note = 65536
    }

    /**
     * enum for Exam body message types
     *
     * @export SystemMessage
     * @enum {number}
     */
    export enum SystemMessage {
        None = 0,
        AutoApprovedMarker = 1,
        AutoApprovedReviewer = 2,
        AutoApprovedSystem = 3,
        ConditionallyApprovedMarker = 4,
        ConditionallyApprovedReviewer = 5,
        ConditionallyApprovedSystem = 6,
        AutoSuspendMarker = 7,
        AutoSuspendReviewer = 8,
        RefreshQuestionPaperStructure = 9,
        CheckMyMarks = 10,
        MarksChecked = 11,
        RemarkRequestedCompleted = 12,
        RefreshMarkingTargets = 13,
        GracePeriodUpdate = 14,
        AutomaticSamplingCompleted = 15,
        ZoningExceptionRaised = 16,
        ZoningExceptionResolved = 17,
        IndirectSubordinateStatusUpdate = 18,
        AutomatedMarkerMessage = 19,
        LockedExaminerWithDrawn = 20,
        RIGRemoved = 21,
        MarkingInstructionUpdated = 22,
        DeAllocationRemarkResponseRemoved = 23,
        CandidateFeedUpdated = 24,
        MarkingInstructionUploaded = 25,
        RemarkDeleted = 26,
        TakeResponse = 27
    }

    /**
     * exception actionType
     *
     * @export ExceptionActionType
     * @enum {number}
     */
    export enum ExceptionActionType {
        Escalate = 0,
        Resolve = 1,
        Close = 2
    }

    /**
     * SortDirection
     *
     * @export SortDirection
     * @enum {number}
     */
    export enum SortDirection {
        Ascending = 0,
        Descending = 1
    }

    /**
     * Enum for TeamManagement
     *
     * @export TeamManagement
     * @enum {number}
     */
    export enum TeamManagement {
        None = 0,
        MyTeam = 1,
        HelpExaminers = 2,
        Exceptions = 3
    }

    /**
     * Enum for Awarding View Type
     *
     * @export AwardingViewType
     * @enum {number}
     */
    export enum AwardingViewType {
        Grade = 1,
        Totalmark = 2
    }

    /**
     * Enum for Standardisation
     *
     * @export StandardisationSetup
     * @enum {number}
     */
    export enum StandardisationSetup {
        None = 0,
        SelectResponse = 1,
        ProvisionalResponse = 2,
        UnClassifiedResponse = 3,
        ClassifiedResponse = 4
    }

    /**
     *  Enum page containers
     *
     * @export PageContainers
     * @enum {number}
     */
    export enum PageContainers {
        None = 0,
        Login = 1,
        QigSelector = 2,
        WorkList = 3,
        Response = 4,
        Message = 5,
        TeamManagement = 6,
        MarkingCheckExaminersWorkList = 7,
        Reports = 8,
        ECourseWork = 9,
        StandardisationSetup = 10,
        AdminSupport = 11,
        Awarding = 12
    }

    /**
     * Enums for PageContainers Type
     */
    export enum PageContainersType {
        None = 0,
        ECourseWork = 1,
        HtmlView = 2
    }

    /**
     * Enums for LogoutEvents
     *
     * @export LogoutEvents
     * @enum {number}
     */
    export enum LogoutEvents {
        None = 0,
        InvalidUser = 1,
        AutoLogout = 2
    }

    /**
     * Enum for marker operation mode
     *
     * @export MarkerOperationMode
     * @enum {number}
     */
    export enum MarkerOperationMode {
        Marking = 0,
        TeamManagement = 1,
        StandardisationSetup = 2,
        Awarding = 3
    }

    /**
     *  Enum for examiner status approval come
     *
     * @export ApprovalOutcome
     * @enum {number}
     */
    export enum ApprovalOutcome {
        Success = 0,
        ReApprovalLimitExceeed = 1,
        StatusUpdatedByOtherSupervisor = 2,
        UserNotAuthorized = 3,
        SupervisorHierarchyChanged = 4,
        OpenReviewRemarsksAvailable = 5
    }

    /**
     * Enum for examiner status change options via Team Management
     *
     * @export ChangeStatusOptions
     * @enum {number}
     */
    export enum ChangeStatusOptions {
        None = 0,
        NotApproved = 1,
        Approved = 2,
        SendForSecondStandardisation = 3,
        AprovedPendingReview = 4,
        Suspended = 9,
        Re_approve = 12
    }

    /**
     * Enum for SetAsReviewResult
     *
     * @export SetAsReviewResult
     * @enum {number}
     */
    export enum SetAsReviewResult {
        /// <summary>
        /// No result
        /// </summary>
        None = 0,

        /// <summary>
        /// Review Operation Successful
        /// </summary>
        Success = 1,

        /// <summary>
        /// Response Already Reviewed by another marker
        /// </summary>
        AlreadyReviewedBySomeone = 2,

        /// <summary>
        /// User not authorised to review the response
        /// </summary>
        NotAuthorised = 3
    }

    /**
     * enum for Sample review comment
     *
     * @export SampleReviewComment
     * @enum {number}
     */
    export enum SampleReviewComment {
        /// <summary>
        /// Sample Not Available
        /// </summary>
        None = 0,

        /// <summary>
        /// Sampled OK
        /// </summary>
        Sampled_OK = 1,

        /// <summary>
        /// Sampled Feedback Given
        /// </summary>
        Sampled_Feedback_Given = 2,

        /// <summary>
        /// Sampled Action Required
        /// </summary>
        Sampled_Action_Reqd = 3
    }

    /**
     * Enum for the SEP Workflow status
     *
     * @export SEPWorkFlowStatus
     * @enum {number}
     */
    export enum SEPWorkFlowStatus {
        None = 0,
        NotApprovedFirstStd = 1,
        NotApprovedAllStd = 2,
        SuspendedFirst = 3,
        SuspendedNotFirst = 4,
        SecondStdSample = 5,
        Reapproved = 6,
        AODActioned = 7,
        LockedNotApprovedFirstStd = 8,
        LockedNotApprovedAllStd = 9,
        LockedSuspendedFirst = 10,
        LockedSuspendedNotFirst = 11,
        Approved = 12
    }

    /**
     * Enum for the SEP Action
     *
     * @export SEPAction
     * @enum {number}
     */
    export enum SEPAction {
        None = 0,
        Lock = 10,
        Unlock = 11,
        Re_approve = 12,
        ProvideSecondStandardisation = 13,
        Approve = 15,
        ViewResponse = 20,
        SendMessage = 2
    }

    /**
     * An enumeration of the different action request failure codes
     *
     * @export SEPActionFailureCode
     * @enum {number}
     */
    export enum SEPActionFailureCode {
        /// <summary>
        /// The not set
        /// </summary>
        NotSet,

        /// <summary>
        /// Represents no failure
        /// </summary>
        None,

        /// <summary>
        /// The not approved
        /// </summary>
        NotApproved,

        /// <summary>
        /// The invalid priority
        /// </summary>
        InvalidPriority,

        /// <summary>
        /// The not a senior examiner
        /// </summary>
        NotASeniorExaminer,

        /// <summary>
        /// The lock is required
        /// </summary>
        LockIsRequired,

        /// <summary>
        /// The already locked
        /// </summary>
        AlreadyLocked,

        /// <summary>
        /// The lock limit met
        /// </summary>
        LockLimitMet,

        /// <summary>
        /// The not valid action
        /// </summary>
        NotValidAction,

        /// <summary>
        /// The not in senior examiner pool
        /// </summary>
        NotInSeniorExaminerPool,

        /// <summary>
        /// The not in lock status
        /// </summary>
        NotInLockStatus,

        /// <summary>
        /// Subordinate examiner is withdrawn from the QIG
        /// </summary>
        SubordinateExaminerWithdrawn,

        /// <summary>
        /// Supervisor examiner is withdrawn from the QIG
        /// </summary>
        Withdrawn,

        /// <summary>
        /// Supervisor examiner is withdrawn from the QIG
        /// </summary>
        Suspended
    }

    /**
     * enum for TeamSubLink
     *
     * @export TeamSubLink
     * @enum {number}
     */
    export enum TeamSubLink {
        /// <summary>
        /// Not Approved Sublink
        /// </summary>
        NotApproved = 0,

        /// <summary>
        /// Awaiting approval Sublink
        /// </summary>
        AwaitingApproval = 1,

        /// <summary>
        /// Locked in my team Sublink
        /// </summary>
        MyTeamLocked = 2,

        /// <summary>
        /// Locked Sublink
        /// </summary>
        HelpExaminersLocked = 3,

        /// <summary>
        /// Stuck Sublink
        /// </summary>
        Stuck = 4,

        /// <summary>
        /// Exception Sublink
        /// </summary>
        Exceptions = 5
    }

    /**
     * Status of marking check of an examiner
     *
     * @export MarkingCheckStatus
     * @enum {number}
     */
    export enum MarkingCheckStatus {
        /// <summary>
        /// Unknown status
        /// </summary>
        None = 0,

        /// <summary>
        /// Examiner's Marking Check request is checked
        /// </summary>
        Checked = 1,

        /// <summary>
        /// Examiner has requested for a marking check
        /// </summary>
        CheckRequested = 2,

        /// <summary>
        /// Examiner Marking Check request is unchecked
        /// </summary>
        Unchecked = 3
    }

    /**
     * Filter options dispalys in the closed live worklist for subordinate worklist
     *
     * @export WorklistSeedFilter
     * @enum {number}
     */
    export enum WorklistSeedFilter {
        /// <summary>
        /// All response should be displayed
        /// </summary>
        All = 1,

        /// <summary>
        /// Seed will be displayed
        /// </summary>
        SeedsOnly = 2,

        /// <summary>
        /// Only Unreviewed seeds should be displayed
        /// </summary>
        UnreviewedSeedsOnly = 3
    }

    /**
     * Enumeration for errorcode.
     *
     * @export PromoteToSeedErrorCode
     * @enum {number}
     */
    export enum PromoteToSeedErrorCode {
        /// <summary>
        /// No error has occured.
        /// </summary>
        None = 0,

        /// <summary>
        /// A unique key violation has occured.
        /// </summary>
        UniqueKeyViolation = 1,

        /// <summary>
        /// Response has remarks
        /// </summary>
        ResponseHasRemarks = 2,

        /// <summary>
        /// No Seed targets are specified
        /// </summary>
        NoSeedTargets = 3,

        /// <summary>
        /// Already promoted to seed
        /// </summary>
        AlreadyPromoted = 4,

        /// <summary>
        /// Response is not 100% marked
        /// </summary>
        NotFullyMarked = 5
    }

    /**
     * RejectRigErrorCode
     *
     * @export RejectRigErrorCode
     * @enum {number}
     */
    export enum RejectRigErrorCode {
        /// <summary>
        /// No error has occured.
        /// </summary>
        None = 0,

        /// <summary>
        /// Response has exceptions.
        /// </summary>
        HasExceptions = 1
    }

    /**
     * Enumeration for General failureCode.
     *
     * @export FailureCode
     * @enum {number}
     */
    export enum FailureCode {

        /// <summary>
        /// Failure code Is Not Set
        /// </summary>
        NotSet = 0,

        /// <summary>
        /// Failure code Is Not Set
        /// </summary>
        None = 1,

        /// <summary>
        /// Examiner Not Approved
        /// </summary>
        NotApproved = 2,

        /// <summary>
        /// Examiner in invalid priority
        /// </summary>
        InvalidPriority = 3,

        /// <summary>
        /// Examiner not a senior examiner
        /// </summary>
        NotASeniorExaminer = 4,

        /// <summary>
        /// Examiner lock required
        /// </summary>
        LockIsRequired = 5,

        /// <summary>
        /// subordinate examiner is already locked
        /// </summary>
        AlreadyLocked = 6,

        /// <summary>
        /// Examiner has met lock limit
        /// </summary>
        LockLimitMet = 7,

        /// <summary>
        /// SEP action is not valid
        /// </summary>
        NotValidAction = 8,

        /// <summary>
        /// Supervisor examiner is not in SEP
        /// </summary>
        NotInSeniorExaminerPool = 9,

        /// <summary>
        /// Subordinate Examiner is not in lock status
        /// </summary>
        NotInLockStatus = 10,

        /// <summary>
        /// Subordinate examiner is withdrawn from the QIG
        /// </summary>
        SubordinateExaminerWithdrawn = 11,

        /// <summary>
        /// If the logged in examiner is withdrawn from the qig
        /// </summary>
        Withdrawn = 12,

        /// <summary>
        /// If the logged in examiner is suspended from the qig
        /// </summary>
        Suspended = 13,

        /// <summary>
        /// The hierarchy of the currentexaminer/suborrdinate
        /// changed so that the action is no more valid
        /// </summary>
        HierarchyChanged = 14,

        /// <summary>
        /// Supervisor hierarchy changed and is not a parent of current subordinate
        /// </summary>
        NotDirectParent = 15,

        /// <summary>
        /// Supervisor hierarchy changed and is not a PE or APE
        /// </summary>
        NotPEOrAPE = 16,

        /// <summary>
        /// Not in direct parent
        /// </summary>
        NotInDirectParent = 17,

        /// <summary>
        /// Supervisor hierarchy changed and he is not a TL
        /// </summary>
        NotTeamLead = 18,

        /// <summary>
        /// Examiner status already changed
        /// </summary>
        ExaminerStatusAlreadyChanged = 19,

        /// <summary>
        /// The current response has already been discarded
        /// </summary>
        AlreadyDiscarded = 20
    }

    /**
     * Enumeration for Atypical response status
     * @export AtypicalStatus
     * @enum {number}
     */
    export enum AtypicalStatus {
        /// <summary>
        /// The scannable
        /// </summary>
        Scannable = 0,

        /// <summary>
        /// The atypical scannable
        /// </summary>
        AtypicalScannable = 1,

        /// <summary>
        /// The atypical unscannable
        /// </summary>
        AtypicalUnscannable = 2
    }


    /**
     * enum to identify the remember qig area
     * @export QigArea
     * @enum {number}
     */
    export enum QigArea {
        // QigSelector
        QigSelector = 0,

        // marking
        Marking = 1,

        // TeamManagement
        TeamManagement = 2,

        // Inbox
        Inbox = 3,

        // StandardisationSetup
        StandardisationSetup = 4
    }


    /**
     * Enumeration for Warning Message Action.
     * @export WarningMessageAction
     * @enum {number}
     */
    export enum WarningMessageAction {
        /// <summary>
        /// None
        /// </summary>
        None = -1,

        /// <summary>
        /// View Response
        /// </summary>
        ViewResponse = 0,

        /// <summary>
        /// Send Message
        /// </summary>
        SendMessage = 1,

        /// <summary>
        /// Set as reviewed
        /// </summary>
        SetAsReviewed = 2,

        /// <summary>
        /// Check my marks
        /// </summary>
        CheckMyMarks = 3,

        /// <summary>
        /// Mark checked
        /// </summary>
        MarksChecked = 4,

        /// <summary>
        /// Promote to seed
        /// </summary>
        PromoteToSeed = 5,

        /// <summary>
        /// Supervisor sampling
        /// </summary>
        SupervisorSampling = 6,

        /// <summary>
        /// Change examiner status
        /// </summary>
        ChangeExaminerStatus = 7,

        /// <summary>
        /// Checking rxaminer viewing response
        /// </summary>
        CheckingExaminerViewingResponse = 8,

        /// <summary>
        /// Supervisor remark check
        /// </summary>
        SuperVisorRemarkCheck = 9,

        /// <summary>
        /// Senior Examiner Pool Actions
        /// </summary>
        SEPAction = 10,

        /// <summary>
        /// My team tab actions
        /// </summary>
        MyTeamAction = 11,

        /// <summary>
        /// Exception Actions
        /// </summary>
        ExceptionAction = 12,

        /// <summary>
        /// TeamWorklist
        /// </summary>
        TeamWorklist = 13,

        /// <summary>
        /// Promote to Reuse bucket
        /// </summary>
        PromoteToReuseBucket = 14
    }

    /**
     * enum to identify ResponseWarningPriority
     */
    export enum ResponseWarningPriority {
        // All question item Marked As NR.
        AllMarkedAsNR = 1,

        // response without optionality where one or more question items marked as NR
        AtleastOneNRWithoutOptionality = 2,

        // response with optionality where one or more question items marked as NR included in total
        AtleastOneNRWithOptionalityUsedInTotal = 3,

        // response with optionality where one or more question items marked as NR not included in total
        AtleastOneNRWithOptionalityNotUsedInTotal = 4,

        // Not all additional pages annotated.
        NotAllSLAOsAnnotated = 5,

        // AllPagesNotAnotated
        AllPagesNotAnnotated = 6,

        // Not all files viewed
        NotAllFilesViewed = 7,

        // Supervisor re-mark decision
        SuperVisorRemarkDecisionNeeded = 8,

        // Mark change reason needed
        MarkChangeReasonNeeded = 9,

        // unsent message
        UnSentMessage = 10,

        // unsent exception
        UnSavedException = 11,

        // Unsaved enhanced off-page comment exception
        UnSavedEnhancedOffPageComment = 12,

        // Files downloaded outside assessor3
        FileDownloadedOutside = 13
    }

    /**
     * enum to identify WarningType
     */
    export enum WarningType {
        SubmitResponse = 0,
        LeaveResponse = 1,
        PreventLeaveInGraceResponse = 2
    }

    /**
     * enum to identify es mark group status
     */
    export enum ESMarkGroupStatus {
        /// <summary>
        /// The none
        /// </summary>
        None = 0,

        /// <summary>
        /// The created
        /// </summary>
        Created = 10,

        /// <summary>
        /// The in progress
        /// </summary>
        InProgress = 20,

        /// <summary>
        /// The marking commenced
        /// </summary>
        MarkingCommenced = 25,

        /// <summary>
        /// The completed marking
        /// </summary>
        CompletedMarking = 30,

        /// <summary>
        /// The submittedto standard meeting
        /// </summary>
        SubmittedtoStdMeeting = 40,

        /// <summary>
        /// The submittedfor approval
        /// </summary>
        SubmittedforApproval = 50,

        /// <summary>
        /// The review failed
        /// </summary>
        ReviewFailed = 60,

        /// <summary>
        /// The approved
        /// </summary>
        Approved = 70,

        /// <summary>
        /// The automatic checked
        /// </summary>
        AutoChecked = 75,

        /// <summary>
        /// The submitted live
        /// </summary>
        SubmittedLive = 80,

        /// <summary>
        /// The ignored
        /// </summary>
        Ignored = 90,
    }

    /**
     * enum to identify examiner validation area
     */
    export enum ExaminerValidationArea {

        /// <summary>
        /// None
        /// </summary>
        None = 0,

        /// <summary>
        /// My Team
        /// </summary>
        MyTeam = 1,

        /// <summary>
        /// Help Examiner
        /// </summary>
        HelpExaminer = 2,

        /// <summary>
        /// Mark Check Worklist
        /// </summary>
        MarkCheckWorklist = 3,

        /// <summary>
        /// Exception Action.
        /// </summary>
        ExceptionAction = 4,

        /// <summary>
        /// TeamWorklist.
        /// </summary>
        TeamWorklist = 5
    }

    /**
     * enum for supervisor remark decision type
     */
    export enum SupervisorRemarkDecisionType {
        none,
        nonjudgementalerror,
        originalmarks,
        judgementaloutsidetolerance
    }

    /**
     * Enum for sort option
     */
    export enum SortOption {
        Both = 0,
        Up = 1,
        Down = 2
    }

    /**
     * Enum for page type
     */
    export enum PageType {
        Page,
        Link
    }

    /**
     * Enum for media type
     */
    export enum MediaType {
        None,
        Audio,
        Video,
        Image,
        Excel,
        Html
    }

    /**
     * Enum for FileList Panel View
     */
    export enum FileListPanelView {
        List,
        Thumbnail
    }
    /**
     * Enum for cloud type
     */
    export enum CloudType {
        None,
        IbCloud,
        AzureCloud
    }

    /**
     * Enum for Response Type Label
     */
    export enum ResponseType {
        None,
        Seed,
        PromotedSeed,
        Definitive,
        WholeResponse
    }

    /**
     * Enum for tag type
     */
    export enum TagType {
        Empty = 0,
        Orange = 1,
        Blue = 2,
        Green = 3,
        Violet = 4,
        Purple = 5,
        Red = 6,
        Yellow = 7,
        Pink = 8,
        LightGreen = 9
    }

    /**
     * Enum for Enhanced Off Page Comment.
     * @export
     * @enum {number}
     */
    export enum EnhancedOffPageCommentView {
        none = 0,
        detail = 1,
        grid = 2
    }

    /**
     * Enum for Enhanced Off Page Comment Button actions.
     * @export
     * @enum {number}
     */
    export enum EnhancedOffPageCommentAction {
        none = 0,
        Save = 1,
        Delete = 2,
        Close = 3,
        Visibility = 4,
        MarkSchemeNavigation = 5
    }

    /**
     * Enum for Panel Resizer types.
     * @export
     * @enum {number}
     */
    export enum ResizePanelType {
        None = 0,
        MarkSchemePanel = 1,
        EnhancedOffPageComment = 2,
        OffPageComment = 3
    }

    /**
     * Enem for panelActionType to update resizer
     */
    export enum PanelActionType {
        ResizedPanel = 0,
        ResizingClassName = 1,
        Visiblity = 2
    }

    /**
     * Enum for pan action type.
     *
     * @export
     * @enum {number}
     */
    export enum PanActionType {
        None = 0,
        Start = 1,
        Move = 2,
        End = 3
    }

    /**
     * Enum for Book mark type.
     *
     * @export
     * @enum {number}
     */
    export enum BookMarkFetchType {
        None = 0,
        Live = 1,
        Standardisation = 2
    }

    /**
     * Enum for file type of media player
     */
    export enum MediaSourceType {
        OriginalFile = 0,
        TranscodedFile = 1
    }
    /**
     * Enum for Set as reviewed comments
     */
    export enum SetAsReviewedComment {
        None = 0,
        AllCorrect = 1,
        Good = 2,
        AcceptableNoFeedback = 3,
        AcceptableGiveFeedback = 4,
        CausingConcernGiveFeedback = 5,
        UnAcceptableConsultPE = 6
    }

    /**
     * Enum for overlay colors
     */
    export enum OverlayColor {
        yellow = -256,
        pink = -16181,
        red = -65536,
        green = -16744448,
        blue = -16776961,
        black = -16777216
    }

    /**
     * Enum for fracs data set action source.
     */
    export enum FracsDataSetActionSource {
        None = 0,
        Acetate = 1
    }

    /**
     * Enum acetate action.
     */
    export enum AcetateAction {
        none = 0,
        move = 1,
        resize = 2
    }

    /**
     * Enum for returning error code while creating an exception/opening respone.
     */
    export enum ReturnErrorCode {
        None = 0,
        WithdrawnResponse = 1,
        QigSessionClosed = 2,
        DeallocatedResponse = 3,
        MarkingModeChanged = 4
    }

	/**
	 * Enum for returning error code while creating an exception/opening respone.
	 */
    export enum STDWorklistViewType {
        ViewTotalMarks = 0,
        ViewMarksByQuestion = 1
    }

    /**
     * Enum for standardisation select response session tab
     */
    export enum StandardisationSessionTab {
        CurrentSession = 1,
        PreviousSession = 2
    }

	/**
	 * Enum for Create Standardisation rig error
	 */
    export enum CreateRigError {
        None = 0,
        RigAllocated = 1,
        ScriptNotFound = 2
    }

    /**
     * Complete Standardisation Error
     */
    export enum CompleteStandardisationErrorCode {
        None = 0,
        StandardisationNotComplete = 1000
    }

	/**
	 * Enum for Awarding Filters Selection
	 */
    export enum AwardingFilters {
        ComponentId = 'componentId',
        ExamSessionId = 'sessionId',
        Grade = 'grade',
        TotalMark = 'totalMark',
        GroupByGrade = 'groupByGrade',
        examProductId = 'examProductId'
    }

    /**
     * Level of marking instructions cc value
     */
    export enum MarkingInstructionCC {
        QuestionPaper = 1,
        QIG = 2
    }

    /**
     * Update es marking mode Error Codes
     */
    export enum UpdateESMarkingModeErrorCode {
        None = 0,
		ConcurrencyIssue = 1,
		ConcurrencyIssueDueToStandardisationComplete = 2
    }

    /**
     * Return error status for Save note
     */
    export enum SaveNoteError {
        None = 0,
        TimeStampChanged = 1,
        MarkingModeChanged = 2

	}

	/**
	 * Return the judgement status id.
	 */
	export enum JudgementStatus {
		Status_Disagree = 0, //DoesnotMeetStandard
		Status_Unsure = 1, // Unsure
		Status_Agree = 2 //MeetsStandard
    }

    /**
     * The Result of the set as review operation
     */
    export enum ReturnToMarkerResult {
        None = 0,
        Success = 1,
        SupervisorHierarchyChanged = 2,
        MarkerApprovalStatusChanged = 3,
        SupervisorApprovalStatusChanged = 4
    }

    /**
     * Returns ProvisionalMarkingType.
     */
    export enum ProvisionalMarkingType {
        None = 0,
        AllocateToAll = 1,
        AllocatedToMe = 2
    }

    /**
     * Share and classify response Error Codes
     */
    export enum ShareAndClassifyResponseError {
        /// <summary>
        /// Response has no validation errors
        /// </summary>
        None = 0,

        /// <summary>
        /// Not fully marked
        /// </summary>
        NotFullyMarked,

        /// <summary>
        /// Response has Exceptions
        /// </summary>
        HasExceptions,

        /// <summary>
        /// Response already submitted
        /// </summary>
        AlreadySubmitted,

        /// <summary>
        /// Examiner not approved
        /// </summary>
        NotApproved,

        /// <summary>
        /// Examiner suspended
        /// </summary>
        Suspended,

        /// <summary>
        /// Examiner withdrawm
        /// </summary>
        Withdrawn,

        /// <summary>
        /// All Pages are not annotated
        /// </summary>
        AllPagesNotAnnotated,

        /// <summary>
        /// The all slaos not annotated
        /// </summary>
        ALLSLAOsNotAnnotated,

        /// <summary>
        /// Response is put onhold
        /// </summary>
        OnHold,

        /// <summary>
        /// The mandate markscheme not commented
        /// </summary>
        MandateMarkschemeNotCommented,

        /// <summary>
        /// The rig is not found
        /// </summary>
        RigNotFound,

        /// <summary>
        /// Not all files are viewed
        /// </summary>
        NotAllFilesViewed,

        /// <summary>
        /// Sibling response has zoning exception raised
        /// </summary>
        HasZoningException
    }

    /**
     * Returns the discard provisional response error codes
     */
    export enum DiscardProvisionalResponseErrorCode {
        None = 0,               // Discard operation completed successfully
        AlreadyDiscarded = 1    // The current std response has already been discarded
    }

    /**
     * enum to identify the menu history navigation area
     * @export HistoryNavigationArea
     * @enum {number}
     */
    export enum HistoryNavigationArea {
        // None
        None = 0,

        // marking
        Marking = 1,

        // TeamManagement
        TeamManagement = 2,

        // StandardisationSetup
        StandardisationSetup = 3
    }
}

export = Enums;
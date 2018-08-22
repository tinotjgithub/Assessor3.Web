module URLs {
    export const AUTHENTICATE_URL = 'Assessor3.Gateway.Authentication/V1/Login';
    export const SUPPORTAUTHENTICATE_URL = 'Assessor3.Gateway.Authentication/V1/AdminSupportLogin';
    export const RE_AUTHENTICATE_URL = 'Assessor3.Gateway.Authentication/V1/IsAuthenticated';
    export const EXAM_BODY_CC_URL = 'Assessor3.Gateway.ConfigurableCharacteristics/V1/GetExamBodyCC';
    export const MARKINGLIST_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/GetMarkingList';
    export const ADMIN_REMARKERS_MARKINGLIST_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/GetAdminRemarkMarkingList';
    export const CREATE_ADMINREMARKER_ROLE = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/AdmineRemarkRole';
    export const USER_INFO_URL = 'Assessor3.Gateway.Marker/Marker/V1/Info';
    export const LOGGING_URL = 'Assessor3.Gateway.Logging/V1/Log/SaveUserAuditInfo';
    export const NOTIFICATION_URL = 'Assessor3.Gateway.BackgroundPulse/V1/HandleBackgroundPulse';
    export const USER_OPTIONS_GET_URL = 'Assessor3.Gateway.Marker/Marker/V1/UserOptions';
    export const USER_OPTIONS_SAVE_URL = 'Assessor3.Gateway.Marker/Marker/V1/SaveUserOptions';
    export const MARK_SCHEME_GROUP_CC_URL = 'Assessor3.Gateway.ConfigurableCharacteristics/V1/GetMarkSchemeGroupCC';
    export const WORKLIST_GET_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/worklist';
    export const MARKER_INFO_URL = 'Assessor3.Gateway.Marker/Marker/V1/MarkerWithParentInfo';
    export const IMAGE_ZONE_GET_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/ImageZones';
    export const MARKER_PROGRESS_GET_URL = 'Assessor3.Gateway.Marker/Marker/V1/MarkerProgress';
    export const UPDATE_USER_SESSION_ON_LOGOUT = 'Assessor3.Gateway.Authentication/V1/Logout';
    export const RESPONSE_ALLOCATION_GET_URL = 'Assessor3.Gateway.Response/Response/V1/Allocate';
    export const MARK_SCHEME_STRUCTURE_GET_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/Markscheme';
    export const MARKING_INSTRUCTIONS_DETAILS_GET_URL = 'Assessor3.Gateway.Marker/Marker/V1/MarkingInstructionsDetails';
    export const SUBMIT_RESPONSE = 'Assessor3.Gateway.Response/Response/V1/Submit';
    export const SHARE_AND_CLASSIFY_RESPONSE = 'Assessor3.Gateway.Response/Response/V1/ShareAndClassifyResponses';
    export const SCRIPT_IMAGE_DATA_URL = 'Assessor3.Gateway.Script/Script/V1/ScriptImage';
    export const SEARCH_ATYPICAL_RESPONSE = 'Assessor3.Gateway.Response/Response/V1/SearchAtypicalResponse';
    export const CANDIDATE_RESPONSE_METADATA_BY_MBQ_URL = 'Assessor3.Gateway.Script/Script/V1/CandidateResponseByMarkByQuestion';
    export const CANDIDATE_RESPONSE_METADATA_BY_MBC_URL = 'Assessor3.Gateway.Script/Script/V1/CandidateResponses';
    export const STAMPS_GET_URL = 'Assessor3.Gateway.Stamp/Stamp/V1/StampsByMarkSchemeGroupId';
    export const AUTO_APPROVAL_MESSAGE_STATUS_UPDATE_URL = 'Assessor3.Gateway.Messaging/V1/Messaging/AutoApprovalMessageStateUpdate';
    export const USER_EMAIL_SAVE_URL = 'Assessor3.Gateway.Marker/Marker/V1/Email';
    export const RETRIEVE_MARKS_AND_ANNOTATIONS_URL = 'Assessor3.Gateway.Marking/Marking/V1/LoadMarksAndAnnotations';
    export const SAVE_MARKS_AND_ANNOTATIONS_URL = 'Assessor3.Gateway.Marking/Marking/V1/SaveMarksAndAnnotations';
    export const SEND_MESSAGE_URL = 'Assessor3.Gateway.Messaging/V1/Messaging/SendMessage';
    export const TINYMCE_URL = 'build/generated/tinymce/tinymce.min.js';
    export const GET_MARKER_MESSAGE = 'Assessor3.Gateway.Messaging/V1/Messaging/GetMarkerMessage';
    export const ACCEPT_QUALITY_FEEDBACK_URL = 'Assessor3.Gateway.Response/Response/V1/AcceptQualityFeedback';
    export const MESSAGE_READ_STATUS_UPDATE_URL = 'Assessor3.Gateway.Messaging/V1/Messaging/UpdateMessage';
    export const MESSAGE_BODY_DETAILS_GET_URL = 'Assessor3.Gateway.Messaging/V1/Messaging/GetMessageDetails';
    export const GET_EXCEPTIONS_FOR_RESPONSE = 'Assessor3.Gateway.Exception/Exceptions/V1/Exceptions';
    export const GET_EXCEPTION_TYPES = 'Assessor3.Gateway.Exception/Exceptions/V1/ExceptionTypes';
    export const GET_UNACTIONED_EXCEPTIONS = 'Assessor3.Gateway.Exception/Exceptions/V1/UnActionedExceptions';
    export const GET_UNREAD_MANDATORY_MESSAGE_STATUS = 'Assessor3.Gateway.Messaging/V1/Messaging/IsUnreadMandatoryMessagePresent';
    export const RESPONSE_DATA_GET_URL = 'Assessor3.Gateway.Response/Response/V1/ResponseWorklistData';
    export const PING_URL = 'Assessor3.Gateway.Authentication/V1/Ping';
    export const CREATE_EXCEPTION = 'Assessor3.Gateway.Exception/Exceptions/V1/CreateException';
    export const UPDATE_EXCEPTION_STATUS = 'Assessor3.Gateway.Exception/Exceptions/V1/UpdateExceptionStatus';
    export const GET_MY_TEAM_URL = 'Assessor3.Gateway.Team/Team/V1/MyTeam';
    export const MESSAGE_TEAMS_GET_URL = 'Assessor3.Gateway.Messaging/V1/Messaging/Teams';
    export const MARKING_INSTRUCTION_GET_URL = 'Assessor3.Gateway.Marker/Marker/V1/MarkingInstruction';
    export const CHANGE_EXAMINER_STATUS_URL = 'Assessor3.Gateway.Team/Team/V1/ChangeExaminerStatus';
    export const PROVIDE_EXAMINER_SECOND_STANDARDISATION_URL = 'Assessor3.Gateway.Team/Team/V1/ProvideExaminerSecondStandardisation';
    export const SUPERISOR_REMARK_CREATE_URL = 'Assessor3.Gateway.Response/Response/V1/requestremark';
    export const REVIEW_RESPONSE_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/ReviewResponse';
    export const GET_HELP_EXAMINERS_URL = 'Assessor3.Gateway.Team/Team/V1/ExaminersForSEPApprovalManagement';
    export const TEAMMANAGEMENT_EXAMINER_VALIDATION_URL = 'Assessor3.Gateway.Team/Team/V1/ValidateTeamManagementExaminer';
    export const EXECUTE_APPROVAL_MANAGEMENT_URL = 'Assessor3.Gateway.Team/Team/V1/DoSEPApprovalManagementAction';
    export const GETTEAM_OVERVIEW_URL = 'Assessor3.Gateway.Team/Team/V1/TeamOverview';
    export const SUPERVISOR_REMARK_DATA_GET_URL = 'Assessor3.Gateway.Response/Response/V1/SupervisorRemarkValidation';
    export const GET_MARKING_CHECK_RECIPIENTS_DETAILS_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/MarkingCheckRecipientsDetails';
    export const GET_MARKING_CHECK_DETAILS_URL = 'Assessor3.Gateway.Marker/Marker/V1/MarkingCheckDetails';
    export const CREATE_FAMILARISATION_DATA = 'Assessor3.Gateway.Familiarisation/Familiarisation/V1/Create';
    export const MARKING_CHECK_ACCESS_STATUS_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/IsMarkingCheckAvailable';
    export const PROMOTE_TO_SEED_URL = 'Assessor3.Gateway.Response/Response/V1/promotetoseed';
    export const GET_MARK_CHECK_EXAMINERS_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/MarkCheckRequestedExaminers';
    export const REJECT_RIG_URL = 'Assessor3.Gateway.Response/Response/V1/RejectResponse';
    export const PROMOTE_TO_SEED_VALIDATION_URL = 'Assessor3.Gateway.Response/Response/V1/promotetoseedcheckremark';
    export const SAVE_SUPERVISOR_SAMPLING_COMMENT_URL = 'Assessor3.Gateway.Team/Team/V1/SaveSupervisorSamplingComment';
    export const GET_LOCKS_IN_QIGS_URL = 'Assessor3.Gateway.Team/Team/V1/LocksInQig';
    export const GET_ECOURSE_WORK_FILES_META_DATA = 'Assessor3.Gateway.DigitalContent/ECourseWork/V1/ECourseworkFiles';
    export const GET_ECOURSE_WORK_BASE_URL = 'Assessor3.Gateway.DigitalContent/ECourseWork/V1/';
    export const GET_TAG_DATA = 'Assessor3.Gateway.Tag/Tag/V1/LoadUserTags';
    export const UPDATE_TAG_DATA = 'Assessor3.Gateway.Tag/Tag/V1/UpdateResponseTag';
    export const GET_ECOURSE_WORK_EMBEDDED_CONTENT_URL = 'Assessor3.Gateway.DigitalContent/ECourseWork/V1/EmbeddedContent';
    export const GET_ECOURSE_WORK_CLOUD_CONTENT_URL = 'Assessor3.Gateway.DigitalContent/ECourseWork/V1/CloudContent';
    export const GET_SIMULATION_MODE_EXITED_QIGS_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/CheckSimulationModeExited';
    export const SET_SIMULATION_TARGET_TO_COMPLETE_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/SetSimulationTargetToComplete';
    export const CHECK_STANDARDISATION_SETUP_COMPLETED_URL = 'Assessor3.Gateway.QIGAccess/QIGAccess/V1/CheckStandardisationSetupCompleted';
    export const PROMOTE_TO_REUSE_BUCKET_URL = 'Assessor3.Gateway.Response/Response/V1/promotetoreusebucket';
    export const CHANGE_ECOURSE_WORK_FILE_READ_STATUS_URL = 'Assessor3.Gateway.DigitalContent/ECourseWork/V1/FileReadStatus';
    export const LOAD_ACETATES_URL = 'Assessor3.Gateway.Marking/Marking/V1/Acetates';
    export const GET_MULTI_QIG_LOCK_EXAMINERS_URL = 'Assessor3.Gateway.Team/Team/V1/ExaminersForSEPMultiQIGApprovalManagement';
    export const SAVE_ACETATES_URL = 'Assessor3.Gateway.Marking/Marking/V1/SaveAcetates';
    export const GET_CANDIDATE_SCRIPT_IMAGE_ZONES = 'Assessor3.Gateway.Script/Script/V1/CandidateScriptImageZones';
    export const VALIDATE_RESPONSE_URL = 'Assessor3.Gateway.Marking/Marking/V1/ValidateResponse';
    export const GET_STANDARDISATION_TARGET_DETAILS =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/StandardisationTargetDetails';
    export const GET_SCRIPTLIST_OF_SELECT_CENTRE =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ScriptList';
    export const GET_STANDARDISATION_CENTRE_LIST =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/CentreList';
    export const VALIDATE_CENTRESCRIPT_RESPONSE_URL = 'Assessor3.Gateway.Marking/Marking/V1/ValidateCentreScriptResponse';
    export const GET_CLASSIFIED_WORKLIST_DETAILS =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ClassifiedWorklistDetails';
    export const GET_PROVISIONAL_WORKLIST_DETAILS =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ProvisionalMarkingDetails';
    export const GET_UNCLASSIFIED_WORKLIST_DETAILS =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/UnClassifiedWorklistDetails';
    export const GET_REUSE_RIG_DETAILS =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ReuseRigDetails';
    export const STANDARDISATION_CREATE_RIG =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/CreateStandardisationRIG';
	export const GET_SUPPORT_EXAMINER_LIST_URL = 'Assessor3.Gateway.Authentication/V1/SupportExaminerList';
    export const GET_AWARDING_ACCESS_DETAILS = 'Assessor3.Gateway.Awarding/Awarding/V1/AwardingAccessDetails';
    export const GET_AWARDING_COMPONENT_SESSION_DETAILS = 'Assessor3.Gateway.Awarding/Awarding/V1/AwardingComponentAndSessionDetailsGet';
    export const GET_AWARDING_CANDIDATE_DETAILS = 'Assessor3.Gateway.Awarding/Awarding/V1/AwardingCandidateDetails';
    export const GET_AWARDING_JUDGEMENT_STATUS = 'Assessor3.Gateway.Awarding/Awarding/V1/AwardingJudgementStatus';
    export const AWARDING_JUDGEMENT_SAVE = 'Assessor3.Gateway.Awarding/Awarding/V1/AwardingJudgementStatusSave';
    export const COMPLETE_STANDARDISATION_SETUP =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/CompleteStandardisation';
    export const UPDATE_ES_MARK_GROUP_MARKING_MODE =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/UpdateESMarkGroupMarkingMode';
    export const UPDATE_REUSE_HIDE_RESPONSE_STATUS = 'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/HideReUseRIG';
    export const SAVE_NOTES =
        'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/Notes';
    export const DISCARD_STANDARDISATION_RESPONSE = 'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/DiscardResponse';
    export const SEARCH_RESPONSE_DETAIL = 'Assessor3.Gateway.Worklist/Search/V1/search';
	export const CLASSIFY_PROVISIONAL_RIG = 'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ClassifyProvisionalRIG';
    export const GET_PROVISIONAL_QIG_DETAILS = 'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ProvisionalQIGDetails';
    export const VALIDATE_PROVISIONAL_RESPONSE_URL = 'Assessor3.Gateway.Marking/Marking/V1/ValidateProvisionalResponse';
    export const REUSE_RIG_ACTION = 'Assessor3.Gateway.StandardisationSetup/StandardisationSetup/V1/ReuseRIGAction';
    export const RETURN_RESPONSE_URL = 'Assessor3.Gateway.Worklist/Worklist/V1/ReturnResponse';
}

export = URLs;
import markingProgressDetails = require('../../../dataservices/response/markingprogressdetails');
import examinerMark = require('./examinermark');
import annotation = require('./annotation');
import supervisorRemarkDecision = require('../../../dataservices/response/supervisorremarkdecision');
import enhancedOffPageComment = require('./enhancedoffpagecomment');

interface MarksAndAnnotationsToSave {
    markGroupId: number;
    annotations: Immutable.List<annotation>;
    marks: Immutable.List<examinerMark>;
    markingProgress: markingProgressDetails;
    totalTolerance: number;
    accuracyTolerance: number;
    markSchemeGroupId: number;
    isSeedingResponse: boolean;
    hasPracticeAccuracyCCSet: boolean;
    hasSpecificMarkToleranceCCSet: boolean;
    hasComplexOptionality: boolean;
    examinerRoleId: number;
    seedingAMDTolerance: number;
    checkForMarkAnnotationMismatch: boolean;
    markingStartTime: Date;
    markingEndTime: Date;
    isAllPagesAnnotated: boolean;
    isAllNR: boolean;
    isInGracePeriod: boolean;
    isAllPagesAnnotatedCCEnabled: boolean;
    isSLAOForcedAnnotationCCEnabled: boolean;
    isEBookMarking: boolean;
    isMarkChanged: boolean;
    isAllfilesViewed: boolean;
    isMandateCommentEnabled: boolean;
    areAllMarkSchemeCommented: boolean;
    doClearSupervisorRemarksMarksChangeReason: boolean;
    isUpdateMarkAnnotationDetails: boolean;
    markChangeReason: string;
    isMarkChangeReasonUpdated: boolean;
    supervisorRemarkDecision: supervisorRemarkDecision;
    enhancedOffPageComments: Immutable.List<enhancedOffPageComment>;
    isAllFilesViewedStatusUpdated: boolean;
    checkForTotalMarkMismatch: boolean;
}

export = MarksAndAnnotationsToSave;
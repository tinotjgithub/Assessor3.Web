import marksAndAnnotationsToSave = require('./marksandannotationstosave');
import markingProgressDetails = require('../../../dataservices/response/markingprogressdetails');
import examinerMark = require('./examinermark');
import annotation = require('./annotation');
import supervisorRemarkDecision = require('../../../dataservices/response/supervisorremarkdecision');
import enhancedOffPageComment = require('./enhancedoffpagecomment');
import bookMarks = require('./bookmark');

class MarksAndAnnotationsToSaveData implements marksAndAnnotationsToSave {
    public markGroupId: number;
    public annotations: Immutable.List<annotation>;
    public marks: Immutable.List<examinerMark>;
    public markingProgress: markingProgressDetails;
    public totalTolerance: number;
    public accuracyTolerance: number;
    public markSchemeGroupId: number;
    public isSeedingResponse: boolean;
    public hasPracticeAccuracyCCSet: boolean;
    public hasSpecificMarkToleranceCCSet: boolean;
    public hasComplexOptionality: boolean;
    public examinerRoleId: number;
    public seedingAMDTolerance: number;
    public checkForMarkAnnotationMismatch: boolean;
    public markingStartTime: Date;
    public markingEndTime: Date;
    public isAllPagesAnnotated: boolean;
    public isAllNR: boolean;
    public isInGracePeriod: boolean;
    public isAllPagesAnnotatedCCEnabled: boolean;
    public isSLAOForcedAnnotationCCEnabled: boolean;
    public isEBookMarking: boolean;
    public isMarkChanged: boolean;
    public isAllfilesViewed: boolean;
    public isMandateCommentEnabled: boolean;
    public areAllMarkSchemeCommented: boolean;
    public doClearSupervisorRemarksMarksChangeReason: boolean;
    public isUpdateMarkAnnotationDetails: boolean;
    public markChangeReason: string;
    public isMarkChangeReasonUpdated: boolean;
    public supervisorRemarkDecision: supervisorRemarkDecision;
    public totalToleranceRemark: number;
    public enhancedOffPageComments: Immutable.List<enhancedOffPageComment>;
    public isAllFilesViewedStatusUpdated: boolean;
    public bookMarks: Immutable.List<bookMarks>;
    public checkForTotalMarkMismatch: boolean;
}

export = MarksAndAnnotationsToSaveData;
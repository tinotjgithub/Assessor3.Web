let keyMirror = require('keymirror');

/**
 * Constants for CC names
 */
let configurableCharacteristicsNames = keyMirror({
    ForceAnnotationOnEachPage: 'ForceAnnotationOnEachPage',
    SLAOForcedAnnotations: 'SLAOForcedAnnotations',
    ComplexOptionality: 'ComplexOptionality',
    PracticeAccuracy: 'PracticeAccuracy',
    SpecificMarkTolerance: 'SpecificMarkTolerance',
    eBookmarking: 'eBookmarking',
    ShowStandardisationDefinitiveMarks: 'ShowStandardisationDefinitiveMarks',
    AutomaticQualityFeedback: 'AutomaticQualityFeedback',
    CompleteButton: 'CompleteButton',
    CheckMinMarksOnComplete: 'CheckMinMarksOnComplete',
    UpdatePendingResponsesWhenSuspended: 'UpdatePendingResponsesWhenSuspended',
    RemarkSeeding: 'RemarkSeeding',
    BlindPracticeMarking: 'BlindPracticeMarking',
    SeniorExaminerPool: 'SeniorExaminerPool',
    CandidatePrioritisation: 'CandidatePrioritisation',
    MarkbyAnnotation: 'MarkbyAnnotation',
    SupervisorRemark: 'SupervisorRemark',
    RecordSupervisorSampling: 'RecordSupervisorSampling',
    MandatoryMessagesFromMarkingTool: 'MandatoryMessagesFromMarkingTool',
    RequestMarkingCheck: 'RequestMarkingCheck',
    ShowTLSeedDefinitiveMarks: 'ShowTLSeedDefinitiveMarks',
    ExaminerCentreExclusivity: 'ExaminerCentreExclusivity',
    SupervisorRemarkPending: 'SupervisorRemarkPending',
    QualityRemark: 'QualityRemark',
    SupervisorRemarkDecision: 'SupervisorRemarkDecision',
    DisplayNRMarkAndRubricInfringementWarnings: 'DisplayNRMarkAndRubricInfringementWarnings',
    ECoursework: 'ECoursework',
    AllowDownloadOfAllFiles: 'AllowDownloadOfAllFiles',
    ReuseRIG: 'ReuseRIG',
    Bookmark: 'Bookmark',
    SupervisorReviewComments: 'SupervisorReviewComments',
    SEPQuestionPaperManagement: 'SEPQuestionPaperManagement',
    AutoZoning: 'AutoZoning',
    DisplayAutozonedResponsesWarning: 'DisplayAutozonedResponsesWarning',
    StandardisationSetupPermissions: 'StandardisationSetupPermissions',
    eResponse: 'eResponse',
    SpecialistResponseMarking: 'SpecialistResponseMarking',
	RetainProvisionalMarks: 'RetainProvisionalMarks',
    WholeResponseProvisionalMarking: 'WholeResponseProvisionalMarking',
    SuppressPagesInAwarding: 'SuppressPagesInAwarding',
    AwardingJudgements: 'AwardingJudgements',
    CommonProvisionalStandardisation: 'CommonProvisionalStandardisation',
    ReturnToMarker: 'ReturnToMarker',
    RestrictRemarkCreation: 'RestrictRemarkCreation'
});

export = configurableCharacteristicsNames;
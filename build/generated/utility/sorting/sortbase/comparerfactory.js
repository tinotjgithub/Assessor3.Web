"use strict";
var comparerList = require('../sortbase/comparerlist');
var auditLogComparer = require('../comparers/auditlogcomparer');
var markingTargetComparer = require('../comparers/markingtargetcomparer');
var pageNumberComparer = require('../comparers/pagenumbercomparer');
var markSchemeViewSequenceComparer = require('../comparers/markschemeviewsequencecomparer');
var stampTypeComparer = require('../comparers/stamptypecomparer');
var remarkRequestTypeComparer = require('../comparers/remarkrequesttypecomparer');
var clusterComparer = require('../comparers/clustercomparer');
var markingTargetCompletedDateComparer = require('../comparers/markingtargetcompleteddatecomparer');
var responseIdComparer = require('../comparers/worklist/responseidcomparer');
var allocatedDateComparer = require('../comparers/worklist/allocateddatecomparer');
var timeToEndGracePeriodComparer = require('../comparers/worklist/timetoendgraceperiodcomparer');
var submittedDateComparer = require('../comparers/worklist/submitteddatecomparer');
var responseIdComparerDesc = require('../comparers/worklist/responseidcomparerdesc');
var allocatedDateComparerDesc = require('../comparers/worklist/allocateddatecomparerdesc');
var timeToEndGracePeriodComparerDesc = require('../comparers/worklist/timetoendgraceperiodcomparerdesc');
var submittedDateComparerDesc = require('../comparers/worklist/submitteddatecomparerdesc');
var accuracyComparer = require('../comparers/worklist/accuracycomparer');
var accuracyComparerDesc = require('../comparers/worklist/accuracycomparerdesc');
var candidateComparer = require('../comparers/worklist/candidatecomparer');
var candidateComparerDesc = require('../comparers/worklist/candidatecomparerdesc');
var centreComparer = require('../comparers/worklist/centrecomparer');
var centreComparerDesc = require('../comparers/worklist/centrecomparerdesc');
var updatedDateComparer = require('../comparers/worklist/updateddatecomparer');
var updatedDateComparerDesc = require('../comparers/worklist/updateddatecomparerdesc');
var lastUpdatedDateComparer = require('../comparers/worklist/lastupdateddatecomparer');
var lastUpdatedDateComparerDesc = require('../comparers/worklist/lastupdateddatecomparerdesc');
var markComparer = require('../comparers/worklist/markcomparer');
var markComparerDesc = require('../comparers/worklist/markcomparerdesc');
var progressComparer = require('../comparers/worklist/progresscomparer');
var progressComparerDesc = require('../comparers/worklist/progresscomparerdesc');
var absoluteMarkDifferenceComparer = require('../comparers/worklist/absolutemarkdifferencecomparer');
var absoluteMarkDifferenceComparerDesc = require('../comparers/worklist/absolutemarkdifferencecomparerdesc');
var totalMarkDifferenceComparer = require('../comparers/worklist/totalmarkdifferencecomparer');
var totalMarkDifferenceComparerDesc = require('../comparers/worklist/totalmarkdifferencecomparerdesc');
var originalMarkerComparer = require('../comparers/worklist/originalmarkercomparer');
var originalMarkerComparerDesc = require('../comparers/worklist/originalmarkercomparerdesc');
var examinerDataComparer = require('../comparers/teammanagement/examinerdatacomparer');
var helpExaminerComparer = require('../comparers/teammanagement/helpexaminercomparer');
var menuHistoryComparer = require('../comparers/menu/menuhistorycomparer');
var markCheckExaminersComparer = require('../comparers/markcheckexaminers/markcheckexaminerscomparer');
var sampleReviewCommentComparer = require('../comparers/samplereviewcomment/samplereviewcommentcomparer');
var targetProgressComparer = require('./../comparers/teammanagement/targetprogresscomparer');
var targetProgressComparerDesc = require('./../comparers/teammanagement/targetprogresscomparerdesc');
var reviewedByComparer = require('../comparers/worklist/reviewedbycomparer');
var reviewedByComparerDesc = require('../comparers/worklist/reviewedbycomparerdesc');
var sampledColumnComparer = require('../comparers/worklist/sampledcolumncomparer');
var sampledColumnComparerDesc = require('../comparers/worklist/sampledcolumncomparerdesc');
var finalMarkSelectedComparer = require('../comparers/worklist/finalmarkselectedcomparer');
var finalMarkSelectedComparerDesc = require('../comparers/worklist/finalmarkselectedcomparerdesc');
var originalMarkComparer = require('../comparers/worklist/originalmarkcomparer');
var originalMarkComparerDesc = require('../comparers/worklist/originalmarkcomparerdesc');
var originalMarkAccuracyComparer = require('../comparers/worklist/originalmarkaccuracycomparer');
var originalMarkAccuracyComparerDesc = require('../comparers/worklist/originalmarkaccuracycomparerdesc');
var tagComparer = require('../comparers/worklist/tagcomparer');
var tagComparerDesc = require('../comparers/worklist/tagcomparerdesc');
var itemComparer = require('../comparers/enhancedoffpagecomment/itemcomparer');
var itemComparerDesc = require('../comparers/enhancedoffpagecomment/itemcomparerdesc');
var fileComparer = require('../comparers/enhancedoffpagecomment/filecomparer');
var fileComparerDesc = require('../comparers/enhancedoffpagecomment/filecomparerdesc');
var commentComparer = require('../comparers/enhancedoffpagecomment/commentcomparer');
var commentComparerDesc = require('../comparers/enhancedoffpagecomment/commentcomparerdesc');
var markSchemeComparer = require('../comparers/enhancedoffpagecomment/markschemecomparer');
var totalQigActiveComparer = require('../comparers/teammanagement/totalqigactivecomparer');
var totalQigActiveComparerDesc = require('../comparers/teammanagement/totalqigactivecomparerdesc');
var totalQigRequiringComparer = require('../comparers/teammanagement/totalqigrequiringcomparer');
var totalQigRequiringComparerDesc = require('../comparers/teammanagement/totalqigrequiringcomparerdesc');
var supervisorReviewCommentComparer = require('../comparers/worklist/supervisorreviewcommentcomparer');
var supervisorReviewCommentComparerDesc = require('../comparers/worklist/supervisorreviewcommentcomparerdesc');
var bookmarkComparer = require('../comparers/bookmarkcomparer');
var multiQigListComparer = require('../comparers/teammanagement/multiqiglistcomparer');
var multiLockListComparer = require('../comparers/teammanagement/multilocklistcomparer');
var previousmarkcomparerdesc = require('../comparers/previousmarkcomparerdesc');
var stdScriptComparer = require('../comparers/standardisationsetup/stdscriptcomparer');
var stdScriptComparerDesc = require('../comparers/standardisationsetup/stdscriptcomparerdesc');
var stdScriptAvailableComparer = require('../comparers/standardisationsetup/stdscriptavailablecomparer');
var stdScriptAvailableComparerDesc = require('../comparers/standardisationsetup/stdscriptavailablecomparerdesc');
var stdFirstScannedComparer = require('../comparers/standardisationsetup/stdfirstscannedcomparer');
var stdFirstScannedComparerDesc = require('../comparers/standardisationsetup/stdfirstscannedcomparerdesc');
var stdScriptIdComparer = require('../comparers/standardisationsetup/stdscriptidcomparer');
var stdScriptIdComparerDesc = require('../comparers/standardisationsetup/stdscriptidcomparerdesc');
var stdStatusComparer = require('../comparers/standardisationsetup/stdstatuscomparer');
var stdStatusComparerDesc = require('../comparers/standardisationsetup/stdstatuscomparerdesc');
var stdLastMarkerComparer = require('../comparers/standardisationsetup/stdlastmarkercomparer');
var stdLastMarkerComparerDesc = require('../comparers/standardisationsetup/stdlastmarkercomparerdesc');
var adminSupportNameComparer = require('../comparers/adminsupport/AdminSupportNameComparer');
var adminSupportNameComparerDesc = require('../comparers/adminsupport/AdminSupportNameComparerdesc');
var adminSupportUsernameComparer = require('../comparers/adminsupport/AdminSupportUsernameComparer');
var adminSupportUsernameComparerDesc = require('../comparers/adminsupport/AdminSupportUsernameComparerDesc');
var adminSupportExaminerCodeComparer = require('../comparers/adminsupport/AdminSupportExaminerCodeComparer');
var adminSupportExaminerCodeComparerDesc = require('../comparers/adminsupport/AdminSupportExaminerCodeComparerdesc');
var specialistTypeComparer = require('../comparers/worklist/specialisttypecomparer');
var specialistTypeComparerDesc = require('../comparers/worklist/specialisttypecomparerdesc');
var stdOrginalSessionComparer = require('../comparers/standardisationsetup/stdorginalsessioncomparer');
var stdOrginalSessionComparerDesc = require('../comparers/standardisationsetup/stdorginalsessioncomparerDesc');
var stdOrginalClassificationComparer = require('../comparers/standardisationsetup/stdorginalclassificationcomparer');
var stdOrginalClassificationComparerDesc = require('../comparers/standardisationsetup/stdorginalclassificationcomparerDesc');
var orginalMarksUpdatedComparer = require('../comparers/standardisationsetup/orginalMarksUpdatedcomparer');
var orginalMarksUpdatedComparerDesc = require('../comparers/standardisationsetup/orginalmarksupdatedcomparerDesc');
var updatePendingComparer = require('../comparers/standardisationsetup/updatependingcomparer');
var updatePendingComparerDesc = require('../comparers/standardisationsetup/updatependingcomparerDesc');
var totalTimesReusedComparer = require('../comparers/standardisationsetup/totaltimesreusedcomparer');
var totalTimesReusedComparerDesc = require('../comparers/standardisationsetup/totaltimesreusedcomparerDesc');
var totalTimesReusedSessionComparer = require('../comparers/standardisationsetup/totaltimesreusedsessioncomparer');
var totalTimesReusedSessionComparerDesc = require('../comparers/standardisationsetup/totaltimesreusedsessioncomparerDesc');
var lastUsedComparer = require('../comparers/standardisationsetup/lastusedcomparer');
var lastUsedComparerDesc = require('../comparers/standardisationsetup/lastusedcomparerDesc');
var marksComparer = require('../comparers/standardisationsetup/markscomparer');
var marksComparerDesc = require('../comparers/standardisationsetup/markscomparerdesc');
var stdCandidateComparer = require('../comparers/standardisationsetup/stdcandidatecomparer');
var stdCandidateComparerDesc = require('../comparers/standardisationsetup/stdcandidatecomparerdesc');
var stdCentreComparer = require('../comparers/standardisationsetup/stdcentrecomparer');
var stdCentreComparerDesc = require('../comparers/standardisationsetup/stdcentrecomparerdesc');
var stdIsReusedInQigComparer = require('../comparers/standardisationsetup/stdisreusedinqiqcomparer');
var stdIsReusedInQigComparerDesc = require('../comparers/standardisationsetup/stdisreusedinqiqcomparerDesc');
var unclassifiedProgressComparer = require('../comparers/standardisationsetup/unclassifiedprogresscomparer');
var unclassifiedProgressComparerDesc = require('../comparers/standardisationsetup/unclassifiedprogresscomparerdesc');
var stdNoteComparer = require('../comparers/standardisationsetup/stdnotecomparer');
var stdNoteComparerDesc = require('../comparers/standardisationsetup/stdnotecomparerdesc');
var ComparerFactory = (function () {
    /**
     * constructor
     */
    function ComparerFactory() {
        /**
         * private variable for comparers
         */
        this._comparers = {};
        /** instance of comparers to be registered in this factory */
        var _clustercomparercomparer = new clusterComparer();
        var _auditlogcomparer = new auditLogComparer(); // (Sample comparer) -instance of Audit log comparer.
        var _markingTargetComparer = new markingTargetComparer(); // Marking target comparer instance
        var _pageNumberComparer = new pageNumberComparer(); // Page Number Comparer instance
        var _markSchemeViewSequenceComparer = new markSchemeViewSequenceComparer(); // Mark scheme view sequence Comparer instance
        var _stampTypeComparer = new stampTypeComparer(); // Stamp Type comparer instance
        var _remarkRequestTypeComparer = new remarkRequestTypeComparer(); // Remark request type comparer instance
        var _markingTargetCompletedDateComparer = new markingTargetCompletedDateComparer();
        var _responseIdComparer = new responseIdComparer(); // Response ID comparer
        var _allocatedDateComparer = new allocatedDateComparer(); // Allocated Date comparer
        var _timeToEndGracePeriodComparer = new timeToEndGracePeriodComparer(); // Time to end grace period comparer
        var _submittedDateComparer = new submittedDateComparer(); // Submitted Date comparer
        var _responseIdComparerDesc = new responseIdComparerDesc(); // Response ID comparer desc
        var _allocatedDateComparerDesc = new allocatedDateComparerDesc(); // Allocated Date comparer desc
        var _timeToEndGracePeriodComparerDesc = new timeToEndGracePeriodComparerDesc(); // Time to end grace period comparer desc
        var _submittedDateComparerDesc = new submittedDateComparerDesc(); // Submitted Date comparer desc
        var _accuracyComparer = new accuracyComparer(); // Accuracy indicator comparer
        var _accuracyComparerDesc = new accuracyComparerDesc(); // Accuracy indicator comparer desc
        var _candidateComparer = new candidateComparer(); // Candidate number comparer
        var _candidateComparerDesc = new candidateComparerDesc(); // Candidate number comparer desc
        var _centreComparer = new centreComparer(); // Centre number comparer
        var _centreComparerDesc = new centreComparerDesc(); // Centre number comparer desc
        var _updateddatecomparer = new updatedDateComparer(); // Updated date comparer
        var _updateddatecomparerDesc = new updatedDateComparerDesc(); // Updated date comparer desc
        var _lastupdateddatecomparer = new lastUpdatedDateComparer(); // Last updated date comparer
        var _lastupdateddatecomparerdesc = new lastUpdatedDateComparerDesc(); // Last updated date comparer desc
        var _markComparer = new markComparer(); // Mark comparer
        var _markComparerDesc = new markComparerDesc(); // Mark comparer desc
        var _progressComparer = new progressComparer(); // Progress comparer
        var _progressComparerDesc = new progressComparerDesc(); // Progress comparer desc
        var _absoluteDifferenceComparer = new absoluteMarkDifferenceComparer(); // Absolute mark difference comparer
        var _absoluteDifferenceComparerDesc = new absoluteMarkDifferenceComparerDesc(); // Absolute mark difference comparer desc
        var _totalDifferenceComparer = new totalMarkDifferenceComparer(); // Total mark difference comparer
        var _totalDifferenceComparerDesc = new totalMarkDifferenceComparerDesc(); // Total mark difference comparer desc
        var _originalMarkerComparer = new originalMarkerComparer(); // Original Marker comaprer
        var _originalMarkerComparerDesc = new originalMarkerComparerDesc(); // Original Marker comaprer desc
        var _examinerDataComparer = new examinerDataComparer(); // examiner data comparer for team management
        var _helpExaminerComparer = new helpExaminerComparer(); // help examiner data comparer for team management
        var _targetProgressComparer = new targetProgressComparer(); // Target progress comparer for MyTeam view.
        var _targetProgressComparerDesc = new targetProgressComparerDesc(); // Target progress comparer desc for MyTeam view.
        var _menuHistoryComparer = new menuHistoryComparer(); // menu history comparer
        var _markCheckExaminersComparer = new markCheckExaminersComparer(); // mark check examiners comparer
        var _sampleReviewCommentComparer = new sampleReviewCommentComparer(); // sample review comment comparer
        var _reviewedByComparer = new reviewedByComparer(); // reviewed by comparer
        var _reviewedByComparerDesc = new reviewedByComparerDesc(); // reviewed by comparer desc
        var _sampledColumnComparer = new sampledColumnComparer(); // sampled column comparer
        var _sampledColumnComparerDesc = new sampledColumnComparerDesc(); // sampled column comparer desc
        var _originalMarkComparerAsc = new originalMarkComparer();
        var _originalMarkComparerDesc = new originalMarkComparerDesc();
        var _originalMarkAccuracyComparerAsc = new originalMarkAccuracyComparer();
        var _originalMarkComparerAccuracyDesc = new originalMarkAccuracyComparerDesc();
        var _finalMarkSelectedComparer = new finalMarkSelectedComparer(); // final mark selected column comparer
        var _finalMarkSelectedComparerDesc = new finalMarkSelectedComparerDesc(); // final mark selected column comparer desc
        var _tagComparer = new tagComparer();
        var _tagComparerDesc = new tagComparerDesc();
        var _itemComparer = new itemComparer(); // enhanced off-page comment item level sorting
        var _itemComparerDesc = new itemComparerDesc();
        var _fileComparer = new fileComparer(); // enhanced off-page comment file level sorting
        var _fileComparerDesc = new fileComparerDesc();
        var _commentComparer = new commentComparer(); // enhanced off-page comment comment level sorting
        var _commentComparerDesc = new commentComparerDesc();
        var _markSchemeComparer = new markSchemeComparer(); // enhanced off page comment question item dropdown sorting
        var _totalQigActiveComparer = new totalQigActiveComparer();
        var _totalQigActiveComparerDesc = new totalQigActiveComparerDesc();
        var _totalQigRequiringComparer = new totalQigRequiringComparer();
        var _totalQigRequiringComparerDesc = new totalQigRequiringComparerDesc();
        var _supervisorReviewCommentComparer = new supervisorReviewCommentComparer(); // review comment comparer
        var _supervisorReviewCommentComparerDesc = new supervisorReviewCommentComparerDesc(); //review comment comparer desc
        var _bookmarkComparer = new bookmarkComparer(); // Bookmark comparer- comment asc(primary), createdDate desc(secondary)
        var _multiQigListComparer = new multiQigListComparer();
        var _multiLockListComparer = new multiLockListComparer();
        var _previousmarkcomparerdesc = new previousmarkcomparerdesc();
        var _stdScriptComparer = new stdScriptComparer();
        var _stdScriptComparerDesc = new stdScriptComparerDesc();
        var _stdScriptAvailableComparer = new stdScriptAvailableComparer();
        var _stdScriptAvailableComparerDesc = new stdScriptAvailableComparerDesc();
        var _stdFirstScannedComparer = new stdFirstScannedComparer();
        var _stdFirstScannedComparerDesc = new stdFirstScannedComparerDesc();
        var _stdScriptIdComparer = new stdScriptIdComparer(); // Script ID comparer
        var _stdScriptIdComparerDesc = new stdScriptIdComparerDesc(); // Script ID comparer Desc
        var _stdStatusComparer = new stdStatusComparer(); // Available Status comparer
        var _stdStatusComparerDesc = new stdStatusComparerDesc(); // Available Status comparer Desc
        var _stdLastMarkerComparer = new stdLastMarkerComparer(); // Available Last Marker Comparer.
        var _stdLastMarkerComparerDesc = new stdLastMarkerComparerDesc(); // Available Last Marker Comparer.
        var _adminSupportNameComparer = new adminSupportNameComparer();
        var _adminSupportNameComparerDesc = new adminSupportNameComparerDesc();
        var _adminSupportUsernameComparer = new adminSupportUsernameComparer();
        var _adminSupportUsernameComparerDesc = new adminSupportUsernameComparerDesc();
        var _adminSupportExaminerCodeComparer = new adminSupportExaminerCodeComparer();
        var _adminSupportExaminerCodeComparerDesc = new adminSupportExaminerCodeComparerDesc();
        var _specialistTypeComparer = new specialistTypeComparer();
        var _specialistTypeComparerDesc = new specialistTypeComparerDesc();
        var _stdOrginalSessionComparer = new stdOrginalSessionComparer();
        var _stdOrginalSessionComparerDesc = new stdOrginalSessionComparerDesc();
        var _stdOrginalClassificationComparer = new stdOrginalClassificationComparer();
        var _stdOrginalClassificationComparerDesc = new stdOrginalClassificationComparerDesc();
        var _OrginalMarksUpdatedComparer = new orginalMarksUpdatedComparer();
        var _OrginalMarksUpdatedComparerDesc = new orginalMarksUpdatedComparerDesc();
        var _updatePendingComparer = new updatePendingComparer();
        var _updatePendingComparerDesc = new updatePendingComparerDesc();
        var _totalTimesReusedComparer = new totalTimesReusedComparer();
        var _totalTimesReusedComparerDesc = new totalTimesReusedComparerDesc();
        var _totalTimesReusedSessionComparer = new totalTimesReusedSessionComparer();
        var _totalTimesReusedSessionComparerDesc = new totalTimesReusedSessionComparerDesc();
        var _lastUsedComparer = new lastUsedComparer();
        var _lastUsedComparerDesc = new lastUsedComparerDesc();
        var _marksComparer = new marksComparer();
        var _marksComparerDesc = new marksComparerDesc();
        var _stdCandidateComparer = new stdCandidateComparer();
        var _stdCandidateComparerDesc = new stdCandidateComparerDesc();
        var _stdCentreComparer = new stdCentreComparer();
        var _stdCentreComparerDesc = new stdCentreComparerDesc();
        var _stdIsReUsedInQigComparer = new stdIsReusedInQigComparer();
        var _stdIsReUsedInQigComparerDesc = new stdIsReusedInQigComparerDesc();
        var _unclassifiedProgressComparer = new unclassifiedProgressComparer();
        var _unclassifiedProgressComparerDesc = new unclassifiedProgressComparerDesc();
        var _stdNoteComparer = new stdNoteComparer();
        var _stdNoteComparerDesc = new stdNoteComparerDesc();
        this._comparers = (_a = {},
            _a[comparerList.ClusterComparer] = _clustercomparercomparer,
            _a[comparerList.AuditLogComparer] = _auditlogcomparer,
            _a[comparerList.MarkingTargetComparer] = _markingTargetComparer,
            _a[comparerList.PageNumberComparer] = _pageNumberComparer,
            _a[comparerList.markSchemeViewSequenceComparer] = _markSchemeViewSequenceComparer,
            _a[comparerList.stampTypeComparer] = _stampTypeComparer,
            _a[comparerList.remarkRequestTypeComparer] = _remarkRequestTypeComparer,
            _a[comparerList.markingTargetCompletedDateComparer] = _markingTargetCompletedDateComparer,
            _a[comparerList.responseIdComparer] = _responseIdComparer,
            _a[comparerList.allocatedDateComparer] = _allocatedDateComparer,
            _a[comparerList.timeToEndGracePeriodComparer] = _timeToEndGracePeriodComparer,
            _a[comparerList.submittedDateComparer] = _submittedDateComparer,
            _a[comparerList.responseIdComparerDesc] = _responseIdComparerDesc,
            _a[comparerList.allocatedDateComparerDesc] = _allocatedDateComparerDesc,
            _a[comparerList.timeToEndGracePeriodComparerDesc] = _timeToEndGracePeriodComparerDesc,
            _a[comparerList.submittedDateComparerDesc] = _submittedDateComparerDesc,
            _a[comparerList.accuracyComparer] = _accuracyComparer,
            _a[comparerList.accuracyComparerDesc] = _accuracyComparerDesc,
            _a[comparerList.candidateComparer] = _candidateComparer,
            _a[comparerList.candidateComparerDesc] = _candidateComparerDesc,
            _a[comparerList.centreComparer] = _centreComparer,
            _a[comparerList.centreComparerDesc] = _centreComparerDesc,
            _a[comparerList.updatedDateComparer] = _updateddatecomparer,
            _a[comparerList.updatedDateComparerDesc] = _updateddatecomparerDesc,
            _a[comparerList.lastUpdatedDateComparer] = _lastupdateddatecomparer,
            _a[comparerList.lastUpdatedDateComparerDesc] = _lastupdateddatecomparerdesc,
            _a[comparerList.markComparer] = _markComparer,
            _a[comparerList.markComparerDesc] = _markComparerDesc,
            _a[comparerList.progressComparer] = _progressComparer,
            _a[comparerList.progressComparerDesc] = _progressComparerDesc,
            _a[comparerList.absoluteDifferenceComparer] = _absoluteDifferenceComparer,
            _a[comparerList.absoluteDifferenceComparerDesc] = _absoluteDifferenceComparerDesc,
            _a[comparerList.totalDifferenceComparer] = _totalDifferenceComparer,
            _a[comparerList.totalDifferenceComparerDesc] = _totalDifferenceComparerDesc,
            _a[comparerList.originalMarkerComparer] = _originalMarkerComparer,
            _a[comparerList.originalMarkerComparerDesc] = _originalMarkerComparerDesc,
            _a[comparerList.examinerDataComparer] = _examinerDataComparer,
            _a[comparerList.helpExaminerComparer] = _helpExaminerComparer,
            _a[comparerList.MenuHistoryComparer] = _menuHistoryComparer,
            _a[comparerList.MarkCheckExaminersComparer] = _markCheckExaminersComparer,
            _a[comparerList.SampleReviewCommentComparer] = _sampleReviewCommentComparer,
            _a[comparerList.TargetProgressComparer] = _targetProgressComparer,
            _a[comparerList.reviewedByComparer] = _reviewedByComparer,
            _a[comparerList.reviewedByComparerDesc] = _reviewedByComparerDesc,
            _a[comparerList.sampledColumnComparer] = _sampledColumnComparer,
            _a[comparerList.sampledColumnComparerDesc] = _sampledColumnComparerDesc,
            _a[comparerList.TargetProgressComparerDesc] = _targetProgressComparerDesc,
            _a[comparerList.OriginalMarkComparer] = _originalMarkComparerAsc,
            _a[comparerList.OriginalMarkComparerDesc] = _originalMarkComparerDesc,
            _a[comparerList.OriginalMarkAccuracyComparer] = _originalMarkAccuracyComparerAsc,
            _a[comparerList.OriginalMarkAccuracyComparerDesc] = _originalMarkComparerAccuracyDesc,
            _a[comparerList.finalMarkSelectedComparer] = _finalMarkSelectedComparer,
            _a[comparerList.finalMarkSelectedComparerDesc] = _finalMarkSelectedComparerDesc,
            _a[comparerList.tagComparer] = _tagComparer,
            _a[comparerList.tagComparerDesc] = _tagComparerDesc,
            _a[comparerList.finalMarkSelectedComparerDesc] = _finalMarkSelectedComparerDesc,
            _a[comparerList.ItemComparer] = _itemComparer,
            _a[comparerList.ItemComparerDesc] = _itemComparerDesc,
            _a[comparerList.FileComparer] = _fileComparer,
            _a[comparerList.FileComparerDesc] = _fileComparerDesc,
            _a[comparerList.CommentComparer] = _commentComparer,
            _a[comparerList.CommentComparerDesc] = _commentComparerDesc,
            _a[comparerList.MarkSchemeComparer] = _markSchemeComparer,
            _a[comparerList.SupervisorReviewCommentComparer] = _supervisorReviewCommentComparer,
            _a[comparerList.SupervisorReviewCommentComparerDesc] = _supervisorReviewCommentComparerDesc,
            _a[comparerList.TotalQigActiveComparer] = _totalQigActiveComparer,
            _a[comparerList.TotalQigActiveComparerDesc] = _totalQigActiveComparerDesc,
            _a[comparerList.TotalQigRequiringComparer] = _totalQigRequiringComparer,
            _a[comparerList.TotalQigRequiringComparerDesc] = _totalQigRequiringComparerDesc,
            _a[comparerList.BookmarkComparer] = _bookmarkComparer,
            _a[comparerList.MultiQigListComparer] = _multiQigListComparer,
            _a[comparerList.stdScriptComparer] = _stdScriptComparer,
            _a[comparerList.stdScriptComparerDesc] = _stdScriptComparerDesc,
            _a[comparerList.stdScriptAvailableComparer] = _stdScriptAvailableComparer,
            _a[comparerList.stdScriptAvailableComparerDesc] = _stdScriptAvailableComparerDesc,
            _a[comparerList.stdFirstScannedComparer] = _stdFirstScannedComparer,
            _a[comparerList.stdFirstScannedComparerDesc] = _stdFirstScannedComparerDesc,
            _a[comparerList.stdScriptIdComparer] = _stdScriptIdComparer,
            _a[comparerList.stdScriptIdComparerDesc] = _stdScriptIdComparerDesc,
            _a[comparerList.stdStatusComparer] = _stdStatusComparer,
            _a[comparerList.stdStatusComparerDesc] = _stdStatusComparerDesc,
            _a[comparerList.MultiLockListComparer] = _multiLockListComparer,
            _a[comparerList.PreviousMarkComparerDesc] = _previousmarkcomparerdesc,
            _a[comparerList.stdLastMarkerComparer] = _stdLastMarkerComparer,
            _a[comparerList.stdLastMarkerComparerDesc] = _stdLastMarkerComparerDesc,
            _a[comparerList.adminSupportNameComparer] = _adminSupportNameComparer,
            _a[comparerList.adminSupportNameComparerDesc] = _adminSupportNameComparerDesc,
            _a[comparerList.adminSupportUsernameComparer] = _adminSupportUsernameComparer,
            _a[comparerList.adminSupportUsernameComparerDesc] = _adminSupportUsernameComparerDesc,
            _a[comparerList.adminSupportExaminerCodeComparer] = _adminSupportExaminerCodeComparer,
            _a[comparerList.adminSupportExaminerCodeComparerDesc] = _adminSupportExaminerCodeComparerDesc,
            _a[comparerList.specialistTypeComparer] = _specialistTypeComparer,
            _a[comparerList.specialistTypeComparerDesc] = _specialistTypeComparerDesc,
            _a[comparerList.stdOrginalSessionComparer] = _stdOrginalSessionComparer,
            _a[comparerList.stdOrginalSessionComparerDesc] = _stdOrginalSessionComparerDesc,
            _a[comparerList.stdOrginalClassificationComparer] = _stdOrginalClassificationComparer,
            _a[comparerList.stdOrginalClassificationComparerDesc] = _stdOrginalClassificationComparerDesc,
            _a[comparerList.orginalMarksUpdatedComparer] = _OrginalMarksUpdatedComparer,
            _a[comparerList.orginalMarksUpdatedComparerDesc] = _OrginalMarksUpdatedComparerDesc,
            _a[comparerList.updatePendingComparer] = _updatePendingComparer,
            _a[comparerList.updatePendingComparerDesc] = _updatePendingComparerDesc,
            _a[comparerList.totalTimesReusedComparer] = _totalTimesReusedComparer,
            _a[comparerList.totalTimesReusedComparerDesc] = _totalTimesReusedComparerDesc,
            _a[comparerList.totalTimesReusedSessionComparer] = _totalTimesReusedSessionComparer,
            _a[comparerList.totalTimesReusedSessionComparerDesc] = _totalTimesReusedSessionComparerDesc,
            _a[comparerList.lastUsedComparer] = _lastUsedComparer,
            _a[comparerList.lastUsedComparerDesc] = _lastUsedComparerDesc,
            _a[comparerList.marksComparer] = _marksComparer,
            _a[comparerList.marksComparerDesc] = _marksComparerDesc,
            _a[comparerList.stdCandidateComparer] = _stdCandidateComparer,
            _a[comparerList.stdCandidateComparerDesc] = _stdCandidateComparerDesc,
            _a[comparerList.stdCentreComparer] = _stdCentreComparer,
            _a[comparerList.stdCentreComparerDesc] = _stdCentreComparerDesc,
            _a[comparerList.stdIsReusedInQigComparer] = _stdIsReUsedInQigComparer,
            _a[comparerList.stdIsReusedInQigComparerDesc] = _stdIsReUsedInQigComparerDesc,
            _a[comparerList.unclassifiedprogressComparer] = _unclassifiedProgressComparer,
            _a[comparerList.unclassifiedprogressComparerDesc] = _unclassifiedProgressComparerDesc,
            _a[comparerList.stdNoteComparer] = _stdNoteComparer,
            _a[comparerList.stdNoteComparerDesc] = _stdNoteComparerDesc,
            _a
        );
        var _a;
    }
    /**
     * returns the comparer object.
     * @param comparerName - Name of the comparer - should be a member of the ComparerList enum.
     */
    ComparerFactory.prototype.getComparer = function (comparerName) {
        /** returns the comparer object corresponding to  the name */
        return this._comparers[comparerName];
    };
    return ComparerFactory;
}());
var comparerFactory = new ComparerFactory();
module.exports = comparerFactory;
//# sourceMappingURL=comparerfactory.js.map
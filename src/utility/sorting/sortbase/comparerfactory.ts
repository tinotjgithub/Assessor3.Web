import comparerList = require('../sortbase/comparerlist');
import auditLogComparer = require('../comparers/auditlogcomparer');
import comparerInterface = require('../sortbase/comparerinterface');
import markingTargetComparer = require('../comparers/markingtargetcomparer');
import pageNumberComparer = require('../comparers/pagenumbercomparer');
import markSchemeViewSequenceComparer = require('../comparers/markschemeviewsequencecomparer');
import stampTypeComparer = require('../comparers/stamptypecomparer');
import remarkRequestTypeComparer = require('../comparers/remarkrequesttypecomparer');
import clusterComparer = require('../comparers/clustercomparer');
import markingTargetCompletedDateComparer = require('../comparers/markingtargetcompleteddatecomparer');
import responseIdComparer = require('../comparers/worklist/responseidcomparer');
import allocatedDateComparer = require('../comparers/worklist/allocateddatecomparer');
import timeToEndGracePeriodComparer = require('../comparers/worklist/timetoendgraceperiodcomparer');
import submittedDateComparer = require('../comparers/worklist/submitteddatecomparer');
import responseIdComparerDesc = require('../comparers/worklist/responseidcomparerdesc');
import allocatedDateComparerDesc = require('../comparers/worklist/allocateddatecomparerdesc');
import timeToEndGracePeriodComparerDesc = require('../comparers/worklist/timetoendgraceperiodcomparerdesc');
import submittedDateComparerDesc = require('../comparers/worklist/submitteddatecomparerdesc');
import accuracyComparer = require('../comparers/worklist/accuracycomparer');
import accuracyComparerDesc = require('../comparers/worklist/accuracycomparerdesc');
import candidateComparer = require('../comparers/worklist/candidatecomparer');
import candidateComparerDesc = require('../comparers/worklist/candidatecomparerdesc');
import centreComparer = require('../comparers/worklist/centrecomparer');
import centreComparerDesc = require('../comparers/worklist/centrecomparerdesc');
import updatedDateComparer = require('../comparers/worklist/updateddatecomparer');
import updatedDateComparerDesc = require('../comparers/worklist/updateddatecomparerdesc');
import lastUpdatedDateComparer = require('../comparers/worklist/lastupdateddatecomparer');
import lastUpdatedDateComparerDesc = require('../comparers/worklist/lastupdateddatecomparerdesc');
import markComparer = require('../comparers/worklist/markcomparer');
import markComparerDesc = require('../comparers/worklist/markcomparerdesc');
import progressComparer = require('../comparers/worklist/progresscomparer');
import progressComparerDesc = require('../comparers/worklist/progresscomparerdesc');
import absoluteMarkDifferenceComparer = require('../comparers/worklist/absolutemarkdifferencecomparer');
import absoluteMarkDifferenceComparerDesc = require('../comparers/worklist/absolutemarkdifferencecomparerdesc');
import totalMarkDifferenceComparer = require('../comparers/worklist/totalmarkdifferencecomparer');
import totalMarkDifferenceComparerDesc = require('../comparers/worklist/totalmarkdifferencecomparerdesc');
import originalMarkerComparer = require('../comparers/worklist/originalmarkercomparer');
import originalMarkerComparerDesc = require('../comparers/worklist/originalmarkercomparerdesc');
import examinerDataComparer = require('../comparers/teammanagement/examinerdatacomparer');
import helpExaminerComparer = require('../comparers/teammanagement/helpexaminercomparer');
import menuHistoryComparer = require('../comparers/menu/menuhistorycomparer');
import markCheckExaminersComparer = require('../comparers/markcheckexaminers/markcheckexaminerscomparer');
import sampleReviewCommentComparer = require('../comparers/samplereviewcomment/samplereviewcommentcomparer');
import targetProgressComparer = require('./../comparers/teammanagement/targetprogresscomparer');
import targetProgressComparerDesc = require('./../comparers/teammanagement/targetprogresscomparerdesc');

import reviewedByComparer = require('../comparers/worklist/reviewedbycomparer');
import reviewedByComparerDesc = require('../comparers/worklist/reviewedbycomparerdesc');
import sampledColumnComparer = require('../comparers/worklist/sampledcolumncomparer');
import sampledColumnComparerDesc = require('../comparers/worklist/sampledcolumncomparerdesc');
import finalMarkSelectedComparer = require('../comparers/worklist/finalmarkselectedcomparer');
import finalMarkSelectedComparerDesc = require('../comparers/worklist/finalmarkselectedcomparerdesc');

import originalMarkComparer = require('../comparers/worklist/originalmarkcomparer');
import originalMarkComparerDesc = require('../comparers/worklist/originalmarkcomparerdesc');
import originalMarkAccuracyComparer = require('../comparers/worklist/originalmarkaccuracycomparer');
import originalMarkAccuracyComparerDesc = require('../comparers/worklist/originalmarkaccuracycomparerdesc');

import tagComparer = require('../comparers/worklist/tagcomparer');
import tagComparerDesc = require('../comparers/worklist/tagcomparerdesc');

import itemComparer = require('../comparers/enhancedoffpagecomment/itemcomparer');
import itemComparerDesc = require('../comparers/enhancedoffpagecomment/itemcomparerdesc');
import fileComparer = require('../comparers/enhancedoffpagecomment/filecomparer');
import fileComparerDesc = require('../comparers/enhancedoffpagecomment/filecomparerdesc');
import commentComparer = require('../comparers/enhancedoffpagecomment/commentcomparer');
import commentComparerDesc = require('../comparers/enhancedoffpagecomment/commentcomparerdesc');
import markSchemeComparer = require('../comparers/enhancedoffpagecomment/markschemecomparer');
import totalQigActiveComparer = require('../comparers/teammanagement/totalqigactivecomparer');
import totalQigActiveComparerDesc = require('../comparers/teammanagement/totalqigactivecomparerdesc');
import totalQigRequiringComparer = require('../comparers/teammanagement/totalqigrequiringcomparer');
import totalQigRequiringComparerDesc = require('../comparers/teammanagement/totalqigrequiringcomparerdesc');
import supervisorReviewCommentComparer = require('../comparers/worklist/supervisorreviewcommentcomparer');
import supervisorReviewCommentComparerDesc = require('../comparers/worklist/supervisorreviewcommentcomparerdesc');
import bookmarkComparer = require('../comparers/bookmarkcomparer');
import multiQigListComparer = require('../comparers/teammanagement/multiqiglistcomparer');
import multiLockListComparer = require('../comparers/teammanagement/multilocklistcomparer');
import previousmarkcomparerdesc = require('../comparers/previousmarkcomparerdesc');
import stdScriptComparer = require('../comparers/standardisationsetup/stdscriptcomparer');
import stdScriptComparerDesc = require('../comparers/standardisationsetup/stdscriptcomparerdesc');
import stdScriptAvailableComparer = require('../comparers/standardisationsetup/stdscriptavailablecomparer');
import stdScriptAvailableComparerDesc = require('../comparers/standardisationsetup/stdscriptavailablecomparerdesc');
import stdFirstScannedComparer = require('../comparers/standardisationsetup/stdfirstscannedcomparer');
import stdFirstScannedComparerDesc = require('../comparers/standardisationsetup/stdfirstscannedcomparerdesc');
import stdScriptIdComparer = require('../comparers/standardisationsetup/stdscriptidcomparer');
import stdScriptIdComparerDesc = require('../comparers/standardisationsetup/stdscriptidcomparerdesc');
import stdStatusComparer = require('../comparers/standardisationsetup/stdstatuscomparer');
import stdStatusComparerDesc = require('../comparers/standardisationsetup/stdstatuscomparerdesc');
import stdLastMarkerComparer = require('../comparers/standardisationsetup/stdlastmarkercomparer');
import stdLastMarkerComparerDesc = require('../comparers/standardisationsetup/stdlastmarkercomparerdesc');
import adminSupportNameComparer = require('../comparers/adminsupport/AdminSupportNameComparer');
import adminSupportNameComparerDesc = require('../comparers/adminsupport/AdminSupportNameComparerdesc');
import adminSupportUsernameComparer = require('../comparers/adminsupport/AdminSupportUsernameComparer');
import adminSupportUsernameComparerDesc = require('../comparers/adminsupport/AdminSupportUsernameComparerDesc');
import adminSupportExaminerCodeComparer = require('../comparers/adminsupport/AdminSupportExaminerCodeComparer');
import adminSupportExaminerCodeComparerDesc = require('../comparers/adminsupport/AdminSupportExaminerCodeComparerdesc');
import specialistTypeComparer = require('../comparers/worklist/specialisttypecomparer');
import specialistTypeComparerDesc = require('../comparers/worklist/specialisttypecomparerdesc');
import stdOrginalSessionComparer = require('../comparers/standardisationsetup/stdorginalsessioncomparer');
import stdOrginalSessionComparerDesc = require('../comparers/standardisationsetup/stdorginalsessioncomparerDesc');
import stdOrginalClassificationComparer = require('../comparers/standardisationsetup/stdorginalclassificationcomparer');
import stdOrginalClassificationComparerDesc = require('../comparers/standardisationsetup/stdorginalclassificationcomparerDesc');
import orginalMarksUpdatedComparer = require('../comparers/standardisationsetup/orginalMarksUpdatedcomparer');
import orginalMarksUpdatedComparerDesc = require('../comparers/standardisationsetup/orginalmarksupdatedcomparerDesc');
import updatePendingComparer = require('../comparers/standardisationsetup/updatependingcomparer');
import updatePendingComparerDesc = require('../comparers/standardisationsetup/updatependingcomparerDesc');
import totalTimesReusedComparer = require('../comparers/standardisationsetup/totaltimesreusedcomparer');
import totalTimesReusedComparerDesc = require('../comparers/standardisationsetup/totaltimesreusedcomparerDesc');
import totalTimesReusedSessionComparer = require('../comparers/standardisationsetup/totaltimesreusedsessioncomparer');
import totalTimesReusedSessionComparerDesc = require('../comparers/standardisationsetup/totaltimesreusedsessioncomparerDesc');
import lastUsedComparer = require('../comparers/standardisationsetup/lastusedcomparer');
import lastUsedComparerDesc = require('../comparers/standardisationsetup/lastusedcomparerDesc');
import marksComparer = require('../comparers/standardisationsetup/markscomparer');
import marksComparerDesc = require('../comparers/standardisationsetup/markscomparerdesc');
import stdCandidateComparer = require('../comparers/standardisationsetup/stdcandidatecomparer');
import stdCandidateComparerDesc = require('../comparers/standardisationsetup/stdcandidatecomparerdesc');
import stdCentreComparer = require('../comparers/standardisationsetup/stdcentrecomparer');
import stdCentreComparerDesc = require('../comparers/standardisationsetup/stdcentrecomparerdesc');
import stdIsReusedInQigComparer = require('../comparers/standardisationsetup/stdisreusedinqiqcomparer');
import stdIsReusedInQigComparerDesc = require('../comparers/standardisationsetup/stdisreusedinqiqcomparerDesc');
import unclassifiedProgressComparer = require('../comparers/standardisationsetup/unclassifiedprogresscomparer');
import unclassifiedProgressComparerDesc = require('../comparers/standardisationsetup/unclassifiedprogresscomparerdesc');
import stdNoteComparer = require('../comparers/standardisationsetup/stdnotecomparer');
import stdNoteComparerDesc = require('../comparers/standardisationsetup/stdnotecomparerdesc');
import classifiedResponseComparer = require('../comparers/standardisationsetup/classifiedresponsecomparer');

class ComparerFactory {

    /**
     * private variable for comparers
     */
    private _comparers = {};

    /**
     * constructor
     */
    constructor() {
        /** instance of comparers to be registered in this factory */
        let _clustercomparercomparer = new clusterComparer();
        let _auditlogcomparer = new auditLogComparer(); // (Sample comparer) -instance of Audit log comparer.
        let _markingTargetComparer = new markingTargetComparer(); // Marking target comparer instance
        let _pageNumberComparer = new pageNumberComparer(); // Page Number Comparer instance
        let _markSchemeViewSequenceComparer = new markSchemeViewSequenceComparer(); // Mark scheme view sequence Comparer instance
        let _stampTypeComparer = new stampTypeComparer(); // Stamp Type comparer instance
        let _remarkRequestTypeComparer = new remarkRequestTypeComparer(); // Remark request type comparer instance
        let _markingTargetCompletedDateComparer = new markingTargetCompletedDateComparer();
        let _responseIdComparer = new responseIdComparer(); // Response ID comparer
        let _allocatedDateComparer = new allocatedDateComparer(); // Allocated Date comparer
        let _timeToEndGracePeriodComparer = new timeToEndGracePeriodComparer(); // Time to end grace period comparer
        let _submittedDateComparer = new submittedDateComparer(); // Submitted Date comparer
        let _responseIdComparerDesc = new responseIdComparerDesc(); // Response ID comparer desc
        let _allocatedDateComparerDesc = new allocatedDateComparerDesc(); // Allocated Date comparer desc
        let _timeToEndGracePeriodComparerDesc = new timeToEndGracePeriodComparerDesc(); // Time to end grace period comparer desc
        let _submittedDateComparerDesc = new submittedDateComparerDesc(); // Submitted Date comparer desc

        let _accuracyComparer = new accuracyComparer(); // Accuracy indicator comparer
        let _accuracyComparerDesc = new accuracyComparerDesc(); // Accuracy indicator comparer desc
        let _candidateComparer = new candidateComparer(); // Candidate number comparer
        let _candidateComparerDesc = new candidateComparerDesc(); // Candidate number comparer desc
        let _centreComparer = new centreComparer(); // Centre number comparer
        let _centreComparerDesc = new centreComparerDesc(); // Centre number comparer desc
        let _updateddatecomparer = new updatedDateComparer(); // Updated date comparer
        let _updateddatecomparerDesc = new updatedDateComparerDesc(); // Updated date comparer desc
        let _lastupdateddatecomparer = new lastUpdatedDateComparer(); // Last updated date comparer
        let _lastupdateddatecomparerdesc = new lastUpdatedDateComparerDesc(); // Last updated date comparer desc
        let _markComparer = new markComparer(); // Mark comparer
        let _markComparerDesc = new markComparerDesc(); // Mark comparer desc
        let _progressComparer = new progressComparer(); // Progress comparer
        let _progressComparerDesc = new progressComparerDesc(); // Progress comparer desc
        let _absoluteDifferenceComparer = new absoluteMarkDifferenceComparer(); // Absolute mark difference comparer
        let _absoluteDifferenceComparerDesc = new absoluteMarkDifferenceComparerDesc(); // Absolute mark difference comparer desc
        let _totalDifferenceComparer = new totalMarkDifferenceComparer(); // Total mark difference comparer
        let _totalDifferenceComparerDesc = new totalMarkDifferenceComparerDesc(); // Total mark difference comparer desc
        let _originalMarkerComparer = new originalMarkerComparer(); // Original Marker comaprer
        let _originalMarkerComparerDesc = new originalMarkerComparerDesc(); // Original Marker comaprer desc
        let _examinerDataComparer = new examinerDataComparer(); // examiner data comparer for team management
        let _helpExaminerComparer = new helpExaminerComparer(); // help examiner data comparer for team management
        let _targetProgressComparer = new targetProgressComparer(); // Target progress comparer for MyTeam view.
        let _targetProgressComparerDesc = new targetProgressComparerDesc(); // Target progress comparer desc for MyTeam view.
        let _menuHistoryComparer = new menuHistoryComparer(); // menu history comparer
        let _markCheckExaminersComparer = new markCheckExaminersComparer(); // mark check examiners comparer
        let _sampleReviewCommentComparer = new sampleReviewCommentComparer(); // sample review comment comparer
        let _reviewedByComparer = new reviewedByComparer(); // reviewed by comparer
        let _reviewedByComparerDesc = new reviewedByComparerDesc(); // reviewed by comparer desc
        let _sampledColumnComparer = new sampledColumnComparer(); // sampled column comparer
        let _sampledColumnComparerDesc = new sampledColumnComparerDesc(); // sampled column comparer desc
        let _originalMarkComparerAsc = new originalMarkComparer();
        let _originalMarkComparerDesc = new originalMarkComparerDesc();
        let _originalMarkAccuracyComparerAsc = new originalMarkAccuracyComparer();
        let _originalMarkComparerAccuracyDesc = new originalMarkAccuracyComparerDesc();
        let _finalMarkSelectedComparer = new finalMarkSelectedComparer(); // final mark selected column comparer
        let _finalMarkSelectedComparerDesc = new finalMarkSelectedComparerDesc(); // final mark selected column comparer desc
        let _tagComparer = new tagComparer();
        let _tagComparerDesc = new tagComparerDesc();
        let _itemComparer = new itemComparer(); // enhanced off-page comment item level sorting
        let _itemComparerDesc = new itemComparerDesc();
        let _fileComparer = new fileComparer(); // enhanced off-page comment file level sorting
        let _fileComparerDesc = new fileComparerDesc();
        let _commentComparer = new commentComparer(); // enhanced off-page comment comment level sorting
        let _commentComparerDesc = new commentComparerDesc();
        let _markSchemeComparer = new markSchemeComparer(); // enhanced off page comment question item dropdown sorting
        let _totalQigActiveComparer = new totalQigActiveComparer();
        let _totalQigActiveComparerDesc = new totalQigActiveComparerDesc();
        let _totalQigRequiringComparer = new totalQigRequiringComparer();
        let _totalQigRequiringComparerDesc = new totalQigRequiringComparerDesc();
        let _supervisorReviewCommentComparer = new supervisorReviewCommentComparer(); // review comment comparer
        let _supervisorReviewCommentComparerDesc = new supervisorReviewCommentComparerDesc(); //review comment comparer desc
        let _bookmarkComparer = new bookmarkComparer(); // Bookmark comparer- comment asc(primary), createdDate desc(secondary)
        let _multiQigListComparer = new multiQigListComparer();
        let _multiLockListComparer = new multiLockListComparer();
        let _previousmarkcomparerdesc = new previousmarkcomparerdesc();
        let _stdScriptComparer = new stdScriptComparer();
        let _stdScriptComparerDesc = new stdScriptComparerDesc();
        let _stdScriptAvailableComparer = new stdScriptAvailableComparer();
        let _stdScriptAvailableComparerDesc = new stdScriptAvailableComparerDesc();
        let _stdFirstScannedComparer = new stdFirstScannedComparer();
        let _stdFirstScannedComparerDesc = new stdFirstScannedComparerDesc();
        let _stdScriptIdComparer = new stdScriptIdComparer(); // Script ID comparer
        let _stdScriptIdComparerDesc = new stdScriptIdComparerDesc(); // Script ID comparer Desc
        let _stdStatusComparer = new stdStatusComparer(); // Available Status comparer
        let _stdStatusComparerDesc = new stdStatusComparerDesc(); // Available Status comparer Desc
        let _stdLastMarkerComparer = new stdLastMarkerComparer(); // Available Last Marker Comparer.
        let _stdLastMarkerComparerDesc = new stdLastMarkerComparerDesc(); // Available Last Marker Comparer.
        let _adminSupportNameComparer = new adminSupportNameComparer();
        let _adminSupportNameComparerDesc = new adminSupportNameComparerDesc();
        let _adminSupportUsernameComparer = new adminSupportUsernameComparer();
        let _adminSupportUsernameComparerDesc = new adminSupportUsernameComparerDesc();
        let _adminSupportExaminerCodeComparer = new adminSupportExaminerCodeComparer();
        let _adminSupportExaminerCodeComparerDesc = new adminSupportExaminerCodeComparerDesc();
        let _specialistTypeComparer = new specialistTypeComparer();
        let _specialistTypeComparerDesc = new specialistTypeComparerDesc();
        let _stdOrginalSessionComparer = new stdOrginalSessionComparer();
        let _stdOrginalSessionComparerDesc = new stdOrginalSessionComparerDesc();
        let _stdOrginalClassificationComparer = new stdOrginalClassificationComparer();
        let _stdOrginalClassificationComparerDesc = new stdOrginalClassificationComparerDesc();
        let _OrginalMarksUpdatedComparer = new orginalMarksUpdatedComparer();
        let _OrginalMarksUpdatedComparerDesc = new orginalMarksUpdatedComparerDesc();
        let _updatePendingComparer = new updatePendingComparer();
        let _updatePendingComparerDesc = new updatePendingComparerDesc();
        let _totalTimesReusedComparer = new totalTimesReusedComparer();
        let _totalTimesReusedComparerDesc = new totalTimesReusedComparerDesc();
        let _totalTimesReusedSessionComparer = new totalTimesReusedSessionComparer();
        let _totalTimesReusedSessionComparerDesc = new totalTimesReusedSessionComparerDesc();
        let _lastUsedComparer = new lastUsedComparer();
        let _lastUsedComparerDesc = new lastUsedComparerDesc();
        let _marksComparer = new marksComparer();
        let _marksComparerDesc = new marksComparerDesc();
        let _stdCandidateComparer = new stdCandidateComparer();
        let _stdCandidateComparerDesc = new stdCandidateComparerDesc();
        let _stdCentreComparer = new stdCentreComparer();
        let _stdCentreComparerDesc = new stdCentreComparerDesc();
        let _stdIsReUsedInQigComparer = new stdIsReusedInQigComparer();
        let _stdIsReUsedInQigComparerDesc = new stdIsReusedInQigComparerDesc();
        let _unclassifiedProgressComparer = new unclassifiedProgressComparer();
        let _unclassifiedProgressComparerDesc = new unclassifiedProgressComparerDesc();
        let _stdNoteComparer = new stdNoteComparer();
        let _stdNoteComparerDesc = new stdNoteComparerDesc();
        let _classifiedResponseComparer = new classifiedResponseComparer();

        this._comparers = {
            [comparerList.ClusterComparer]: _clustercomparercomparer,
            [comparerList.AuditLogComparer]: _auditlogcomparer,
            [comparerList.MarkingTargetComparer]: _markingTargetComparer,
            [comparerList.PageNumberComparer]: _pageNumberComparer,
            [comparerList.markSchemeViewSequenceComparer]: _markSchemeViewSequenceComparer,
            [comparerList.stampTypeComparer]: _stampTypeComparer,
            [comparerList.remarkRequestTypeComparer]: _remarkRequestTypeComparer,
            [comparerList.markingTargetCompletedDateComparer]: _markingTargetCompletedDateComparer,
            [comparerList.responseIdComparer]: _responseIdComparer,
            [comparerList.allocatedDateComparer]: _allocatedDateComparer,
            [comparerList.timeToEndGracePeriodComparer]: _timeToEndGracePeriodComparer,
            [comparerList.submittedDateComparer]: _submittedDateComparer,
            [comparerList.responseIdComparerDesc]: _responseIdComparerDesc,
            [comparerList.allocatedDateComparerDesc]: _allocatedDateComparerDesc,
            [comparerList.timeToEndGracePeriodComparerDesc]: _timeToEndGracePeriodComparerDesc,
            [comparerList.submittedDateComparerDesc]: _submittedDateComparerDesc,

            [comparerList.accuracyComparer]: _accuracyComparer,
            [comparerList.accuracyComparerDesc]: _accuracyComparerDesc,
            [comparerList.candidateComparer]: _candidateComparer,
            [comparerList.candidateComparerDesc]: _candidateComparerDesc,
            [comparerList.centreComparer]: _centreComparer,
            [comparerList.centreComparerDesc]: _centreComparerDesc,
            [comparerList.updatedDateComparer]: _updateddatecomparer,
            [comparerList.updatedDateComparerDesc]: _updateddatecomparerDesc,
            [comparerList.lastUpdatedDateComparer]: _lastupdateddatecomparer,
            [comparerList.lastUpdatedDateComparerDesc]: _lastupdateddatecomparerdesc,
            [comparerList.markComparer]: _markComparer,
            [comparerList.markComparerDesc]: _markComparerDesc,
            [comparerList.progressComparer]: _progressComparer,
            [comparerList.progressComparerDesc]: _progressComparerDesc,
            [comparerList.absoluteDifferenceComparer]: _absoluteDifferenceComparer,
            [comparerList.absoluteDifferenceComparerDesc]: _absoluteDifferenceComparerDesc,
            [comparerList.totalDifferenceComparer]: _totalDifferenceComparer,
            [comparerList.totalDifferenceComparerDesc]: _totalDifferenceComparerDesc,
            [comparerList.originalMarkerComparer]: _originalMarkerComparer,
            [comparerList.originalMarkerComparerDesc]: _originalMarkerComparerDesc,
            [comparerList.examinerDataComparer]: _examinerDataComparer,
            [comparerList.helpExaminerComparer]: _helpExaminerComparer,
            [comparerList.MenuHistoryComparer]: _menuHistoryComparer,
            [comparerList.MarkCheckExaminersComparer]: _markCheckExaminersComparer,
            [comparerList.SampleReviewCommentComparer]: _sampleReviewCommentComparer,
            [comparerList.TargetProgressComparer]: _targetProgressComparer,
            [comparerList.reviewedByComparer]: _reviewedByComparer,
            [comparerList.reviewedByComparerDesc]: _reviewedByComparerDesc,
            [comparerList.sampledColumnComparer]: _sampledColumnComparer,
            [comparerList.sampledColumnComparerDesc]: _sampledColumnComparerDesc,
            [comparerList.TargetProgressComparerDesc]: _targetProgressComparerDesc,
            [comparerList.OriginalMarkComparer]: _originalMarkComparerAsc,
            [comparerList.OriginalMarkComparerDesc]: _originalMarkComparerDesc,
            [comparerList.OriginalMarkAccuracyComparer]: _originalMarkAccuracyComparerAsc,
            [comparerList.OriginalMarkAccuracyComparerDesc]: _originalMarkComparerAccuracyDesc,
            [comparerList.finalMarkSelectedComparer]: _finalMarkSelectedComparer,
            [comparerList.finalMarkSelectedComparerDesc]: _finalMarkSelectedComparerDesc,
            [comparerList.tagComparer]: _tagComparer,
            [comparerList.tagComparerDesc]: _tagComparerDesc,
            [comparerList.finalMarkSelectedComparerDesc]: _finalMarkSelectedComparerDesc,
            [comparerList.ItemComparer]: _itemComparer,
            [comparerList.ItemComparerDesc]: _itemComparerDesc,
            [comparerList.FileComparer]: _fileComparer,
            [comparerList.FileComparerDesc]: _fileComparerDesc,
            [comparerList.CommentComparer]: _commentComparer,
            [comparerList.CommentComparerDesc]: _commentComparerDesc,
            [comparerList.MarkSchemeComparer]: _markSchemeComparer,
            [comparerList.SupervisorReviewCommentComparer]: _supervisorReviewCommentComparer,
            [comparerList.SupervisorReviewCommentComparerDesc]: _supervisorReviewCommentComparerDesc,
            [comparerList.TotalQigActiveComparer]: _totalQigActiveComparer,
            [comparerList.TotalQigActiveComparerDesc]: _totalQigActiveComparerDesc,
            [comparerList.TotalQigRequiringComparer]: _totalQigRequiringComparer,
            [comparerList.TotalQigRequiringComparerDesc]: _totalQigRequiringComparerDesc,
            [comparerList.BookmarkComparer]: _bookmarkComparer,
            [comparerList.MultiQigListComparer]: _multiQigListComparer,
            [comparerList.stdScriptComparer]: _stdScriptComparer,
            [comparerList.stdScriptComparerDesc]: _stdScriptComparerDesc,
            [comparerList.stdScriptAvailableComparer]: _stdScriptAvailableComparer,
            [comparerList.stdScriptAvailableComparerDesc]: _stdScriptAvailableComparerDesc,
            [comparerList.stdFirstScannedComparer]: _stdFirstScannedComparer,
            [comparerList.stdFirstScannedComparerDesc]: _stdFirstScannedComparerDesc,
            [comparerList.stdScriptIdComparer]: _stdScriptIdComparer,
            [comparerList.stdScriptIdComparerDesc]: _stdScriptIdComparerDesc,
            [comparerList.stdStatusComparer]: _stdStatusComparer,
            [comparerList.stdStatusComparerDesc]: _stdStatusComparerDesc,
            [comparerList.MultiLockListComparer]: _multiLockListComparer,
            [comparerList.PreviousMarkComparerDesc]: _previousmarkcomparerdesc,
            [comparerList.stdLastMarkerComparer]: _stdLastMarkerComparer,
            [comparerList.stdLastMarkerComparerDesc]: _stdLastMarkerComparerDesc,
            [comparerList.adminSupportNameComparer]: _adminSupportNameComparer,
            [comparerList.adminSupportNameComparerDesc]: _adminSupportNameComparerDesc,
            [comparerList.adminSupportUsernameComparer]: _adminSupportUsernameComparer,
            [comparerList.adminSupportUsernameComparerDesc]: _adminSupportUsernameComparerDesc,
            [comparerList.adminSupportExaminerCodeComparer]: _adminSupportExaminerCodeComparer,
            [comparerList.adminSupportExaminerCodeComparerDesc]: _adminSupportExaminerCodeComparerDesc,
            [comparerList.specialistTypeComparer]: _specialistTypeComparer,
            [comparerList.specialistTypeComparerDesc]: _specialistTypeComparerDesc,
            [comparerList.stdOrginalSessionComparer]: _stdOrginalSessionComparer,
            [comparerList.stdOrginalSessionComparerDesc]: _stdOrginalSessionComparerDesc,
            [comparerList.stdOrginalClassificationComparer]: _stdOrginalClassificationComparer,
            [comparerList.stdOrginalClassificationComparerDesc]: _stdOrginalClassificationComparerDesc,
            [comparerList.orginalMarksUpdatedComparer]: _OrginalMarksUpdatedComparer,
            [comparerList.orginalMarksUpdatedComparerDesc]: _OrginalMarksUpdatedComparerDesc,
            [comparerList.updatePendingComparer]: _updatePendingComparer,
            [comparerList.updatePendingComparerDesc]: _updatePendingComparerDesc,
            [comparerList.totalTimesReusedComparer]: _totalTimesReusedComparer,
            [comparerList.totalTimesReusedComparerDesc]: _totalTimesReusedComparerDesc,
            [comparerList.totalTimesReusedSessionComparer]: _totalTimesReusedSessionComparer,
            [comparerList.totalTimesReusedSessionComparerDesc]: _totalTimesReusedSessionComparerDesc,
            [comparerList.lastUsedComparer]: _lastUsedComparer,
            [comparerList.lastUsedComparerDesc]: _lastUsedComparerDesc,
            [comparerList.marksComparer]: _marksComparer,
            [comparerList.marksComparerDesc]: _marksComparerDesc,
            [comparerList.stdCandidateComparer]: _stdCandidateComparer,
            [comparerList.stdCandidateComparerDesc]: _stdCandidateComparerDesc,
            [comparerList.stdCentreComparer]: _stdCentreComparer,
            [comparerList.stdCentreComparerDesc]: _stdCentreComparerDesc,
            [comparerList.stdIsReusedInQigComparer]: _stdIsReUsedInQigComparer,
            [comparerList.stdIsReusedInQigComparerDesc]: _stdIsReUsedInQigComparerDesc,
            [comparerList.unclassifiedprogressComparer]: _unclassifiedProgressComparer,
            [comparerList.unclassifiedprogressComparerDesc]: _unclassifiedProgressComparerDesc,
            [comparerList.stdNoteComparer]: _stdNoteComparer,
            [comparerList.stdNoteComparerDesc]: _stdNoteComparerDesc,
            [comparerList.classifiedResponseComparer]: _classifiedResponseComparer
        };
    }

    /**
     * returns the comparer object.
     * @param comparerName - Name of the comparer - should be a member of the ComparerList enum.
     */
    public getComparer(comparerName: comparerList): comparerInterface {
        /** returns the comparer object corresponding to  the name */
        return this._comparers[comparerName];
    }
}

let comparerFactory = new ComparerFactory();
export = comparerFactory;

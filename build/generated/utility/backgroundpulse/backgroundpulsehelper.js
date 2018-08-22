"use strict";
var __ = require('timeengine');
var immutable = require('immutable');
var backgroundPulseActionCreator = require('../../actions/backgroundpulse/backgroundpulseactioncreator');
var backgroundPulseArgument = require('../../dataservices/backgroundpulse/backgroundpulseargument');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var worklistStore = require('../../stores/worklist/workliststore');
var qigStore = require('../../stores/qigselector/qigstore');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var loginSession = require('../../app/loginsession');
var markingStore = require('../../stores/marking/markingstore');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var marksAndAnnotationsSaveHelper = require('../marking/marksandannotationssavehelper');
var enums = require('../../components/utility/enums');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
var eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
var userOptionsHelper = require('../useroption/useroptionshelper');
var useroptionKeys = require('../useroption/useroptionkeys');
var bookmarkHelper = require('../../stores/marking/bookmarkhelper');
var imageZoneStore = require('../../stores/imagezones/imagezonestore');
/**
 * Background pulse helper
 */
var BackgroundPulseHelper = (function () {
    function BackgroundPulseHelper() {
    }
    /**
     * Set's the background pulse interval for a functionality
     */
    BackgroundPulseHelper.setInterval = function (interval, callBack, args) {
        __.intervalSeq(immutable.Range(), interval).__(function () { return callBack(args); });
    };
    /**
     * Handle's notification
     */
    BackgroundPulseHelper.handleBackgroundPulse = function () {
        backgroundPulseActionCreator.handleBackgroundPulse(BackgroundPulseHelper.getBackgroundPulseArgument());
    };
    /**
     * Handle Candidatescript Meta Data Load
     */
    BackgroundPulseHelper.handleCandidateScriptMetaDataLoad = function () {
        var isMarkByQuestionModeSet = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';
        var eBookMarkingCCValue = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true');
        // Firing the action creator to fetch the candidate script metadata
        scriptActionCreator.fetchCandidateScriptMetadata(worklistStore.instance.getCandidateScriptInfoCollection, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, !isMarkByQuestionModeSet, false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
        true, eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false, eBookMarkingCCValue, enums.StandardisationSetup.None, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
    };
    /**
     * Handle Candidatescript Image Zone Load
     */
    BackgroundPulseHelper.handleEbookMarkingImageZoneLoad = function () {
        // get the response and image zone colllection from store
        var imageZoneCollection = imageZoneStore.instance.candidateScriptImageZoneList;
        var responseBaseCollection = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        // For each response check whetehr image zone exist. if not call API method to load.
        if (responseBaseCollection !== undefined && responseBaseCollection.count() > 0) {
            responseBaseCollection.map(function (x) {
                if (imageZoneCollection === undefined || imageZoneCollection.count() === 0 ||
                    !imageZoneCollection[x.candidateScriptId]) {
                    scriptActionCreator.getCandidateScriptImageZones(x.candidateScriptId, enums.Priority.Second);
                }
            });
        }
    };
    /**
     * This method will loop through all responses and retrieve marks and annotations on a second priority thread.
     */
    BackgroundPulseHelper.handleCandidateMarksAndAnnotationsDataLoad = function () {
        var currentMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        var responseBaseCollection = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        var bookmarkFetchType = bookmarkHelper.getBookMarkTypeForQIG(currentMarkingMode);
        if (responseBaseCollection !== undefined &&
            responseBaseCollection.count() > 0 && qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            responseBaseCollection.map(function (x) {
                // check whether the mark and annotation are loaded for this mark groupId or request is already sent or not.
                if (!markingStore.instance.isMarksLoaded(x.markGroupId, false)) {
                    var isPEOrAPE = qigStore.instance.selectedQIGForMarkerOperation.role ===
                        enums.ExaminerRole.principalExaminer ||
                        qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;
                    var isBlindPracticeMarkingOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true' ? true : false;
                    var markGroupIds_1 = [x.markGroupId];
                    // If a whole response, retrieve all the related markGroupIds
                    if (x.isWholeResponse && x.relatedRIGDetails != null) {
                        x.relatedRIGDetails.map(function (y) {
                            markGroupIds_1.push(y.markGroupId);
                        });
                    }
                    responseActionCreator.retrieveMarksAndAnnotations(markGroupIds_1, x.markGroupId, currentMarkingMode, x.candidateScriptId, isPEOrAPE, worklistStore.instance.getRemarkRequestType, isBlindPracticeMarkingOn, operationModeHelper.subExaminerId, loginSession.EXAMINER_ID, enums.Priority.Second, bookmarkFetchType, x.isWholeResponse);
                }
            });
        }
    };
    /**
     * This will call process marks and annotations queue periodically.
     */
    BackgroundPulseHelper.processMarksAndAnnotationsQueue = function () {
        // Default saveMarksAndAnnotationTriggerPoint is BackgroundWorker
        var saveMarksAndAnnotationTriggerPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker;
        // queue will process if and only if count is greater than zero and browser is connected to internet.
        if (marksAndAnnotationsSaveHelper.count > 0 && applicationStore.instance.isOnline) {
            // If any network error occurred while saving the marks and annotations,
            // then will requeue the process and set the previosSaveMarksAndAnnotationTriggeringPointOnError
            // from store to keep that saveMarksAndAnnotationTriggerPoint
            //  for correct navigation after successful save, use that trigger point while processing the queue.
            if (markingStore.instance.getPreviousSaveMarksAndAnnotationTriggeringPointOnError
                !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None) {
                saveMarksAndAnnotationTriggerPoint = markingStore.instance.getPreviousSaveMarksAndAnnotationTriggeringPointOnError;
            }
            marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(saveMarksAndAnnotationTriggerPoint, undefined, enums.Priority.Second);
        }
    };
    /**
     * This method will create the notification argument with required values.
     */
    BackgroundPulseHelper.getBackgroundPulseArgument = function () {
        var args = new backgroundPulseArgument();
        args.MarkingSessionTrackingId = parseInt(loginSession.MARKING_SESSION_TRACKING_ID);
        args.SupervisorExaminerId = examinerStore.instance.parentExaminerId;
        args.ExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId : 0;
        return args;
    };
    /**
     * handles data load for the e-course work file metadata
     */
    BackgroundPulseHelper.handleECourseWorkFileMetaDataLoad = function () {
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(null, true);
        }
    };
    // queued count of candidates e-course work files to download
    BackgroundPulseHelper.candidateECourseWorkFileQueuedCount = 0;
    return BackgroundPulseHelper;
}());
module.exports = BackgroundPulseHelper;
//# sourceMappingURL=backgroundpulsehelper.js.map
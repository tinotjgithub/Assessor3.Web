let __ = require('timeengine');
import immutable = require('immutable');
import backgroundPulseActionCreator = require('../../actions/backgroundpulse/backgroundpulseactioncreator');
import backgroundPulseArgument = require('../../dataservices/backgroundpulse/backgroundpulseargument');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import worklistStore = require('../../stores/worklist/workliststore');
import qigStore = require('../../stores/qigselector/qigstore');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import loginSession = require('../../app/loginsession');
import markingStore = require('../../stores/marking/markingstore');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import marksAndAnnotationsSaveHelper = require('../marking/marksandannotationssavehelper');
import enums = require('../../components/utility/enums');
import targetHelper = require('../target/targethelper');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
import eCourseworkArgument = require('../../dataservices/script/typings/ecourseworkarguments');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
import userOptionsHelper = require('../useroption/useroptionshelper');
import useroptionKeys = require('../useroption/useroptionkeys');
import bookmarkHelper = require('../../stores/marking/bookmarkhelper');
import imageZoneStore = require('../../stores/imagezones/imagezonestore');
import candidateEbookMarkImageZoneCollection = require('../../stores/script/typings/candidateebookmarkimagezonecollection');

declare let config: any;

/**
 * Background pulse helper
 */
class BackgroundPulseHelper {

    // queued count of candidates e-course work files to download
    private static candidateECourseWorkFileQueuedCount = 0;

    /**
     * Set's the background pulse interval for a functionality
     */
    public static setInterval(interval: number, callBack: Function, args: any) {
        __.intervalSeq(immutable.Range(), interval).__(() => callBack(args));
    }

    /**
     * Handle's notification
     */
    public static handleBackgroundPulse() {
        backgroundPulseActionCreator.handleBackgroundPulse(BackgroundPulseHelper.getBackgroundPulseArgument());
    }

    /**
     * Handle Candidatescript Meta Data Load
     */
    public static handleCandidateScriptMetaDataLoad() {

        let isMarkByQuestionModeSet: boolean = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';

        let eBookMarkingCCValue = (configurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true');
        // Firing the action creator to fetch the candidate script metadata
        scriptActionCreator.fetchCandidateScriptMetadata(
            worklistStore.instance.getCandidateScriptInfoCollection,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            !isMarkByQuestionModeSet,
            false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            true,
            eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
            eBookMarkingCCValue,
            enums.StandardisationSetup.None,
            false,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
        );
    }

    /**
     * Handle Candidatescript Image Zone Load
     */
    public static handleEbookMarkingImageZoneLoad() {
        // get the response and image zone colllection from store
        let imageZoneCollection: immutable.Map<number, immutable.List<ImageZone>> = imageZoneStore.instance.candidateScriptImageZoneList;
        let responseBaseCollection: Immutable.List<ResponseBase> = worklistStore.instance.getCurrentWorklistResponseBaseDetails();

        // For each response check whetehr image zone exist. if not call API method to load.
        if (responseBaseCollection !== undefined && responseBaseCollection.count() > 0) {
            responseBaseCollection.map((x: ResponseBase) => {
                if (imageZoneCollection === undefined || imageZoneCollection.count() === 0 ||
                    !imageZoneCollection[x.candidateScriptId]) {
                    scriptActionCreator.getCandidateScriptImageZones(x.candidateScriptId, enums.Priority.Second,
                        qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
                }
            });
        }
    }

    /**
     * This method will loop through all responses and retrieve marks and annotations on a second priority thread.
     */
    public static handleCandidateMarksAndAnnotationsDataLoad() {
        let currentMarkingMode: enums.MarkingMode =
            worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        let responseBaseCollection: Immutable.List<ResponseBase> = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        let bookmarkFetchType: enums.BookMarkFetchType = bookmarkHelper.getBookMarkTypeForQIG(currentMarkingMode);
        if (responseBaseCollection !== undefined &&
            responseBaseCollection.count() > 0 && qigStore.instance.selectedQIGForMarkerOperation !== undefined) {
            responseBaseCollection.map((x: ResponseBase) => {
                // check whether the mark and annotation are loaded for this mark groupId or request is already sent or not.
                if (!markingStore.instance.isMarksLoaded(x.markGroupId, false)) {
                    let isPEOrAPE: boolean = qigStore.instance.selectedQIGForMarkerOperation.role ===
                        enums.ExaminerRole.principalExaminer ||
                        qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;
                    let isBlindPracticeMarkingOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
                        configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true' ? true : false;
                    let markGroupIds: number[] = [x.markGroupId];

                    // If a whole response, retrieve all the related markGroupIds
                    if (x.isWholeResponse && x.relatedRIGDetails != null) {
                        x.relatedRIGDetails.map((y: RelatedRIGDetails) => {
                            markGroupIds.push(y.markGroupId);
                        });
                    }

                    let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
                        configurableCharacteristicsNames.ComplexOptionality,
                        markingStore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;

                    responseActionCreator.retrieveMarksAndAnnotations(markGroupIds,
                        x.markGroupId,
                        currentMarkingMode,
                        x.candidateScriptId,
                        isPEOrAPE, worklistStore.instance.getRemarkRequestType,
                        isBlindPracticeMarkingOn,
                        operationModeHelper.subExaminerId,
                        loginSession.EXAMINER_ID,
                        enums.Priority.Second,
                        bookmarkFetchType,
                        x.isWholeResponse,
                        hasComplexOptionality);
                }
            });
        }
    }

    /**
     * This will call process marks and annotations queue periodically.
     */
    public static processMarksAndAnnotationsQueue() {
        // Default saveMarksAndAnnotationTriggerPoint is BackgroundWorker
        let saveMarksAndAnnotationTriggerPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint
            = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker;
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
            marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(
                saveMarksAndAnnotationTriggerPoint, undefined, enums.Priority.Second);
        }
    }

    /**
     * This method will create the notification argument with required values.
     */
    public static getBackgroundPulseArgument(): backgroundPulseArgument {
        let args: backgroundPulseArgument = new backgroundPulseArgument();
        args.MarkingSessionTrackingId = parseInt(loginSession.MARKING_SESSION_TRACKING_ID);
        args.SupervisorExaminerId = examinerStore.instance.parentExaminerId;
        args.ExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId : 0;
        return args;
    }

    /**
     * handles data load for the e-course work file metadata
     */
    public static handleECourseWorkFileMetaDataLoad() {
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(null, true);
        }
    }
}

export = BackgroundPulseHelper;
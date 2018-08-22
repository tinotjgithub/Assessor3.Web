import applicationStore = require('../../stores/applicationoffline/applicationstore');
import markingProgressDetails = require('../../dataservices/response/markingprogressdetails');
import marksAndAnnotationsSaveItemData = require('../../dataservices/response/marksandannotationssaveitemdata');
import stampData = require('../../stores/stamp/typings/stampdata');
import examinerAnnotation = require('../../stores/response/typings/annotation');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import examinerMark = require('../../stores/response/typings/examinermark');
import saveMarksAndAnnotationsArgument = require('../../dataservices/response/savemarksandannotationsargument');
import enums = require('../../components/utility/enums');
import targetHelper = require('../target/targethelper');
import stampItem = require('../../dataservices/response/stampitem');
import marksAndAnnotationsToSaveData = require('../../stores/response/typings/marksandannotationstosavedata');
import configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../configurablecharacteristic/configurablecharacteristicsnames');
import stampStore = require('../../stores/stamp/stampstore');
import qigStore = require('../../stores/qigselector/qigstore');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
import Immutable = require('immutable');
import examinerMarksAndAnnotation = require('../../stores/response/typings/examinermarksandannotation');
import supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
import loggingHelper = require('../../components/utility/marking/markingauditlogginghelper');
import loggerConstants = require('../../components/utility/loggerhelperconstants');
import enhancedOffPageComment = require('../../stores/response/typings/enhancedoffpagecomment');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
import bookMarks = require('../../stores/response/typings/bookmark');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
declare let config: any;

/**
 * Helper class for Marks and Annotations save queuing and processing.
 */
class MarksAndAnnotationsSaveHelper {

    // private variable for marks save queue
    private static saveMarksAndAnnotationsQueue: Array<MarksAndAnnotationsSaveItem> = new Array<MarksAndAnnotationsSaveItem>();

    private static front: number = -1;

    public static isSaveInProgress: boolean = false;
    /**
     * This will push an mark and annotations save item for processing.
     * @param markGroupId
     */
    private static push(markGroupId: number) {
        let markQueueItem: MarksAndAnnotationsSaveItem = new marksAndAnnotationsSaveItemData();
        markQueueItem.markGroupId = markGroupId;
        markQueueItem.isProcessing = false;
        markQueueItem.retryCount = 0;

        //markQueueItem.markingStartTime = markingStore.instance.markingStartTime;
        let endDate = new Date();
        markQueueItem.markingEndTime = new Date(
            endDate.getUTCFullYear(),
            endDate.getUTCMonth(),
            endDate.getUTCDate(),
            endDate.getUTCHours(),
            endDate.getUTCMinutes(),
            endDate.getUTCSeconds(),
            endDate.getUTCMilliseconds()
        );
        markQueueItem.markingStartTime = markingStore.instance.markingStartTime;

        let filteredItems = this.saveMarksAndAnnotationsQueue.filter((x: MarksAndAnnotationsSaveItem) =>
            x.isProcessing === false && x.markGroupId === markGroupId);
        if (filteredItems.length === 0) {
            this.saveMarksAndAnnotationsQueue.splice(0, 0, markQueueItem);
            this.front++;
        }
    }

    /**
     * This method will enqueue the item again.
     * @param markGroupId
     */
    private static retry(markGroupId: number) {
        let index: number = this.findIndex(markGroupId);
        let retryAttempts: number = this.saveMarksAndAnnotationsQueue[index].retryCount;
        MarksAndAnnotationsSaveHelper.remove(markGroupId);
        if (retryAttempts < config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_SAVE_RETRY_ATTEMPT_COUNT) {
            let markQueueItem: MarksAndAnnotationsSaveItem = new marksAndAnnotationsSaveItemData();
            markQueueItem.markGroupId = markGroupId;
            markQueueItem.isProcessing = false;
            markQueueItem.retryCount = retryAttempts + 1;
            this.front++;
            this.saveMarksAndAnnotationsQueue.splice(this.front, 0, markQueueItem);

        } else {
            this.setAsNonRecoverableItem(markGroupId);
        }
    }

    /**
     * setting as a non-recoverable item.
     * @param markGroupId
     */
    private static setAsNonRecoverableItem(markGroupId: number) {
        responseActionCreator.setNonRecoverableError(markGroupId);
    }

    /**
     * Find the index of a markGroupItem in save queue.
     * @param markGroupId
     */
    private static findIndex(markGroupId: number) {
        let index: number;
        for (let i = 0; i < this.saveMarksAndAnnotationsQueue.length; i++) {
            // index used to remove, Get only processed index.
            if (this.saveMarksAndAnnotationsQueue[i].markGroupId === markGroupId &&
                this.saveMarksAndAnnotationsQueue[i].isProcessing) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * This will remove the item from processing list.
     */
    private static remove(markGroupId: number) {
        let index: number = this.findIndex(markGroupId);
        if (index >= 0) {
            this.saveMarksAndAnnotationsQueue.splice(index, 1);
            // Decrement Queue length after removing the item
            this.front--;
        }
    }

    /**
     * This will requeue the mark group back to the queue as the next priority item
     */
    private static requeue(markGroupId: number) {
        let index: number = this.findIndex(markGroupId);
        let retryAttempts: number = this.saveMarksAndAnnotationsQueue[index].retryCount;
        // Removing the mark group from the current position in the queue
        MarksAndAnnotationsSaveHelper.remove(markGroupId);

        // Inserting back to the front position
        let markQueueItem: MarksAndAnnotationsSaveItem = new marksAndAnnotationsSaveItemData();
        markQueueItem.markGroupId = markGroupId;
        markQueueItem.isProcessing = false;
        markQueueItem.retryCount = retryAttempts;
        this.front++;
        this.saveMarksAndAnnotationsQueue.splice(this.front, 0, markQueueItem);
    }

    /**
     * Update the processing status and returns the first item of the array.
     */
    private static peek(): MarksAndAnnotationsSaveItem {
        if (!this.isEmpty) {
            let item: MarksAndAnnotationsSaveItem = this.getMarkGroupItem();

            // If got an item to be processed, Set the processing flag.
            if (item) {
                item.isProcessing = true;
            }
            return item;
        }
    }

    /**
     * For a response(MarkGroup) there can be 2 entries in the Queue, 1 is in the Processing mode and one is to be processed
     * If there is a mark group is in processing mode, it should not be fetched for processing again
     * Get the next mark group from the Queue for processing.
     */
    private static getMarkGroupItem(): MarksAndAnnotationsSaveItem {
        //Check the mark group has another processing entry in the Queue.
        for (var index = 0; index < this.saveMarksAndAnnotationsQueue.length; index++) {
            let markGroupItem = this.saveMarksAndAnnotationsQueue[index];

            //If another entry for the mark group exists as processing skip and check for the next.
            if (this.saveMarksAndAnnotationsQueue.filter(
                x => x.markGroupId === markGroupItem.markGroupId && x.isProcessing === true).length > 0) {
                continue;
            }

            return markGroupItem;
        }
    }

    /**
     * This will returns the size of the unprocessed items;
     */
    public static get count(): number {
        return !this.isEmpty ? this.front + 1 : 0;
    }

    /**
     * Check whether the processing list empty or not
     */
    public static get isEmpty(): boolean {
        return (this.front <= -1) ? true : false;
    }

    /**
     * This will clear the queue.
     */
    public static clear() {
        this.saveMarksAndAnnotationsQueue = [];
    }

    /**
     * This will reset the save in progress flag
     */
    public static resetSaveInProgress() {
        this.isSaveInProgress = false;
    }

    /**
     * This will enable the save in progress flag
     */
    public static enableSaveInProgress() {
        this.isSaveInProgress = true;
    }

    /**
     * Check whether the marks and annotations save queue is completely processed or not
     */
    public static get isQueueProcessedCompletely(): boolean {
        return this.saveMarksAndAnnotationsQueue.length === 0 && this.front <= -1;
    }

    /**
     * Updates the marks and annotations save queue.
     */
    public static updateMarksAndAnnotationsQueue(isBackGroundSave: boolean = false) {
        let currentWorklistResponseBaseDetails: Immutable.List<ResponseBase>;
        let isStandardisationSetupMode: boolean =
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
        if (isStandardisationSetupMode) {
            currentWorklistResponseBaseDetails =
                Immutable.List<StandardisationResponseDetails>(standardisationSetupStore.instance.getCurrentWorklistResponseBaseDetails());
        } else {
            currentWorklistResponseBaseDetails =
                Immutable.List<ResponseBase>(worklistStore.instance.getCurrentWorklistResponseBaseDetails());
        }

        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map((x: ResponseBase) => {
                // build a collection to map the RIGs for a whole response
                let parentMarkGroupId: number = isStandardisationSetupMode ? x.esMarkGroupId : x.markGroupId;
                let markGroupIds: number[] = [parentMarkGroupId];
                // If a whole response, retrieve all the related markGroupIds
                if (x.isWholeResponse && x.relatedRIGDetails != null) {
                    x.relatedRIGDetails.map((y: RelatedRIGDetails) => {
                        markGroupIds.push(y.markGroupId);
                    });
                }
                markGroupIds.map((markGroupId: number) => {
                    if (markingStore.instance.getMarksAndAnnotationsSaveQueueStatus(parentMarkGroupId)) {
                        // check whether the mark and annotation are changed for saving.
                        let dirtyMarks: examinerMark[] = markingStore.instance.getDirtyExaminerMarks(parentMarkGroupId, markGroupId);
                        let dirtyAnnotations: examinerAnnotation[] = markingStore.instance.
                            getDirtyExaminerAnnotations(parentMarkGroupId, markGroupId);
                        let dirtyEnhancedOffPageComments: enhancedOffPageComment[] =
                            markingStore.instance.getDirtyEnhancedOffPageComments(parentMarkGroupId, markGroupId);
                        let dirtyBookMarks: bookMarks[] = markingStore.instance.getDirtyBookMarks(parentMarkGroupId, markGroupId);
                        let isMarkChangeReasonUpdated = markingStore.instance.getIsMarkChangeReasonUpdated(markGroupId);
                        let isSRDReasonUpdated = markingStore.instance.getIsSRDReasonUpdated(markGroupId);
                        if ((dirtyMarks && dirtyMarks.length > 0) ||
                            (dirtyAnnotations && dirtyAnnotations.length > 0) ||
                            (dirtyEnhancedOffPageComments && dirtyEnhancedOffPageComments.length > 0) ||
                            (dirtyBookMarks && dirtyBookMarks.length > 0) ||
                            isMarkChangeReasonUpdated ||
                            isSRDReasonUpdated ||
                            markingStore.instance.isAllFilesViewedStatusUpdated) {
                            // avoiding multiple entries in queue is handled inside push
                            // the key is the parent mark group id
                            this.push(parentMarkGroupId);

                            // Update the marks and annotations save queue status to Not Awaiting Queueing
                            markingStore.instance.updateMarksAndAnnotationsSaveQueueingStatus(parentMarkGroupId, false, isBackGroundSave);
                        }
                    }
                });
            });
        }
    }

    /**
     * This method will returns an array of displayIds with non-recoverable errors.
     */
    public static get markGroupItemsWithNonRecoverableErrors(): Array<string> {
        let isStandardisationSetupMode: boolean =
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
        let currentWorklistResponseBaseDetails: Immutable.List<any> =
            isStandardisationSetupMode ? standardisationSetupStore.instance.getCurrentWorklistResponseBaseDetails() :
            worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        // this array will hold the non-recoverable displayIds for displaying in popup.
        let nonRecoverableDisplayIds: Array<string> = new Array<string>();

        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map((x: any) => {
                // check whether the mark and annotation are changed for saving.
                let hasNonRecoverableError: boolean =
                    markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(
                        isStandardisationSetupMode ? x.esMarkGroupId : x.markGroupId);
                if (hasNonRecoverableError) {
                    nonRecoverableDisplayIds.push(x.displayId);
                }
            });
        }

        return nonRecoverableDisplayIds;
    }

    /**
     * This method will clear the marks and annotations  with non from the store for reloading.
     */
    public static clearMarksAndAnnotationsForNonRecoverableErrors() {
        let isStandardisationSetupMode: boolean =
            userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
        let currentWorklistResponseBaseDetails: Immutable.List<any> =
            isStandardisationSetupMode ? standardisationSetupStore.instance.getCurrentWorklistResponseBaseDetails() :
            worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map((x: any) => {
                // check whether the mark and annotation are changed for saving.
                let hasNonRecoverableError: boolean =
                    markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(
                    isStandardisationSetupMode ? x.esMarkGroupId : x.markGroupId);
                if (hasNonRecoverableError) {
                    responseActionCreator.clearMarksAndAnnotations(
                    isStandardisationSetupMode ? x.esMarkGroupId : x.markGroupId);
                }
            });
        }
    }

    /**
     * This method will clear the marks and annotations from the store for reloading.
     * This method will call for grace period expired and response removed mark save error codes
     */
    public static clearMarksAndAnnotationsForMarkSaveErrors() {
        let currentWorklistResponseBaseDetails: Immutable.List<ResponseBase> =
            worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map((x: ResponseBase) => {
                // check whether the mark and annotation are changed for saving.
                let hasMarkSaveError: boolean =
                    markingStore.instance.checkMarkGroupItemHasSaveMarkErrors(x.markGroupId);
                if (hasMarkSaveError) {
                    responseActionCreator.clearMarksAndAnnotations(x.markGroupId);
                }
            });
        }
    }

    /**
     * Method which triggers the processing of save marks and annotations queue
     * @param saveMarksAndAnnotationsProcessingTriggerPoint
     * @param callback
     */
    public static triggerMarksAndAnnotationsQueueProcessing(
        saveMarksAndAnnotationsProcessingTriggerPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        callback: Function,
        priority: enums.Priority = enums.Priority.First
    ) {

        // This will push the changed markGroupId to save marks and annotations queue.
        MarksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();

        // Processing marks and annotations queue
        if (MarksAndAnnotationsSaveHelper.count > 0) {
            if (saveMarksAndAnnotationsProcessingTriggerPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
                // set the flag has true when save starts
                MarksAndAnnotationsSaveHelper.enableSaveInProgress();
            }
            MarksAndAnnotationsSaveHelper.processMarksAndAnnotationsQueue(priority,
                saveMarksAndAnnotationsProcessingTriggerPoint);
        } else if (callback) {
            callback();
        }
    }

    /**
     * This method will save items from marksAndAnnotations queue.
     */
    private static processMarksAndAnnotationsQueue(priority: enums.Priority,
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint) {
        if (!this.isEmpty) {

            responseActionCreator.triggerSavingMarksAndAnnotations(saveMarksAndAnnotationTriggeringPoint);

            // Normally in Assessor 3, during the saving of marks and annotations only the dirty ones are passed
            // on to the gateway which is updated to the database.
            // We have a flag (IGNORE_DIRTY_FLAG_AND_SAVE_ALL_MARKS_AND_ANNOTATIONS) now in the config.js to control 
            // this mechanism. This flag is by default false and only the dirty annotations and marks shall be send to the gateway 
            // to be saved to the database.
            // If the flag is true, irrespective of the isDirty flag all the current marks and annotations shall be send to the
            // gateway to be saved to the database.
            let doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations: boolean =
                config.marksandannotationsconfig.IGNORE_DIRTY_FLAG_AND_SAVE_ALL_MARKS_AND_ANNOTATIONS;
            let saveLogInfo: string = '';

            let marksAndAnnotationsToSave: Immutable.Map<number, marksAndAnnotationsToSaveData>;
            let usedStamps: Immutable.Map<number, Immutable.List<stampItem>>;
            // get the current marking mode.
            let isStandardisationMode: boolean =
                userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
            let markingMode: enums.MarkingMode = isStandardisationMode ? enums.MarkingMode.Pre_ES_TeamStandardisation :
                targetHelper.getSelectedQigMarkingMode();
            // get the question paper partId.
            let questionPaperPartId: number = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            let currentExaminerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            let hasComplexOptionality: boolean = false;

            do {
                // if browser is not connected to internet then break the process queue without processing further.
                if (!applicationStore.instance.isOnline) {
                    break;
                }

                let markItem: MarksAndAnnotationsSaveItem = this.peek();

                // If all Queue items are currently processing mode, skip the save.
                if (!markItem) {
                    return;
                }

                // build a collection to map the RIGs for a whole response
                let markGroupIds: number[] = [markItem.markGroupId];
                let responseBaseDetails: ResponseBase = isStandardisationMode ?
                    standardisationSetupStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId) :
                    worklistStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId);
                let atypicalStatus: enums.AtypicalStatus = responseBaseDetails.atypicalStatus;
                // If a whole response, retrieve all the related markGroupIds
                if (responseBaseDetails.isWholeResponse && responseBaseDetails.relatedRIGDetails != null) {
                    responseBaseDetails.relatedRIGDetails.map((y: RelatedRIGDetails) => {
                        markGroupIds.push(y.markGroupId);
                    });
                }

                // initialising marksAndAnnotationsToSave and usedStamps variable.
                marksAndAnnotationsToSave = Immutable.Map<number, marksAndAnnotationsToSaveData>();
                usedStamps = Immutable.Map<number, Immutable.List<stampItem>>();
                // check all related markGroupIds(in case of whole response)
                // and get all individual RIG dirty marks and annotations for saving to the Database
                markGroupIds.map((markGroupId: number) => {
                    // load required data from marking store and call save marks one by one.
                    let dirtyMarks: examinerMark[] = markingStore.instance.getDirtyExaminerMarks(markItem.markGroupId, markGroupId,
                        doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations);
                    let dirtyAnnotations: examinerAnnotation[] = markingStore.instance.getDirtyExaminerAnnotations
                        (markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations);
                    let dirtyEnhancedOffPageComments: enhancedOffPageComment[] = markingStore.instance.getDirtyEnhancedOffPageComments
                        (markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations);
                    let dirtyBookMarks: bookMarks[] = markingStore.instance.getDirtyBookMarks(markItem.markGroupId, markGroupId,
                        doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations);
                    let isMarkChangeReasonUpdated = markingStore.instance.getIsMarkChangeReasonUpdated(markItem.markGroupId);
                    let isSRDReasonUpdated = markingStore.instance.getIsSRDReasonUpdated(markItem.markGroupId);
                    /** if any changes exist in any mark group, then add it for saving to DB */
                    if ((dirtyMarks && dirtyMarks.length > 0) ||
                        (dirtyAnnotations && dirtyAnnotations.length > 0) ||
                        (dirtyEnhancedOffPageComments && dirtyEnhancedOffPageComments.length > 0) ||
                        (dirtyBookMarks && dirtyBookMarks.length > 0) ||
                        isMarkChangeReasonUpdated ||
                        isSRDReasonUpdated ||
                        markingStore.instance.isAllFilesViewedStatusUpdated ||
                        responseBaseDetails.isWholeResponse) {

                        // Updating each mark object whether it is picked for save operation
                        for (let i = 0; i < dirtyMarks.length; i++) {
                            dirtyMarks[i].isPickedForSaveOperation = true;
                        }

                        // Updating each annotation object whether it is picked for save operation
                        for (let i = 0; i < dirtyAnnotations.length; i++) {
                            dirtyAnnotations[i].isPickedForSaveOperation = true;
                        }

                        for (let i = 0; i < dirtyEnhancedOffPageComments.length; i++) {
                            dirtyEnhancedOffPageComments[i].isPickedForSaveOperation = true;
                        }

                        for (let i = 0; i < dirtyBookMarks.length; i++) {
                            dirtyBookMarks[i].isPickedForSaveOperation = true;
                        }

                        let examinerMarksAndAnnotation: examinerMarksAndAnnotation =
                            markingStore.instance.currentExaminerMarksAgainstResponse(markItem.markGroupId, markGroupId);

                        // multiQIG - take the corresponding markschemeGroupId
                        let markSchemeGroupId: number = markingStore.instance.getMarkSchemeGroupIdQIGtoRIGMap(markItem.markGroupId,
                            markGroupId);

                        let stamps: Array<stampItem> = new Array<stampItem>();

                        // fill all used stamps
                        dirtyAnnotations.map((x: examinerAnnotation) => {
                            let stamp: stampData = stampStore.instance.getStamp(x.stamp, markSchemeGroupId);
                            // if stamp is already in the collection then we don't need to add that.
                            if (stamps.filter((x: stampItem) => x.stampID === stamp.stampId).length === 0) {
                                let item = new stampItem();
                                item.stampID = stamp.stampId;
                                item.isDynamic = stamp.stampType === enums.StampType.dynamic;
                                item.numericValue = stamp.numericValue;
                                stamps.push(item);
                            }
                        });

                        let stampsList: Immutable.List<stampItem> = Immutable.List<stampItem>(stamps);
                        usedStamps = usedStamps.set(markSchemeGroupId, stampsList);

                        // Build the save data which is sent to the Database
                        let marksAndAnnotations: marksAndAnnotationsToSaveData = new marksAndAnnotationsToSaveData();
                        marksAndAnnotations.markGroupId = markGroupId;
                        marksAndAnnotations.annotations = Immutable.List<examinerAnnotation>(dirtyAnnotations);
                        marksAndAnnotations.marks = Immutable.List<examinerMark>(dirtyMarks);
                        marksAndAnnotations.markSchemeGroupId = markSchemeGroupId;
                        marksAndAnnotations.examinerRoleId = markingStore.instance.getExaminerRoleQIGtoRIGMap(markItem.markGroupId,
                            markGroupId);
                        marksAndAnnotations.enhancedOffPageComments = Immutable.List<enhancedOffPageComment>(dirtyEnhancedOffPageComments);
                        marksAndAnnotations.bookMarks = Immutable.List<bookMarks>(dirtyBookMarks);

                        marksAndAnnotations.accuracyTolerance = examinerMarksAndAnnotation.accuracyTolerance;
                        marksAndAnnotations.totalTolerance = examinerMarksAndAnnotation.totalTolerance;
                        marksAndAnnotations.seedingAMDTolerance = examinerMarksAndAnnotation.seedingAMDTolerance;
                        marksAndAnnotations.totalToleranceRemark = examinerMarksAndAnnotation.totalToleranceRemark;
                        marksAndAnnotations.areAllMarkSchemeCommented = false; //no need to set now
                        marksAndAnnotations.doClearSupervisorRemarksMarksChangeReason = false; // no need to set now

                        // Validation to prevent saving of marks and annotations that mismatch when marking using 'mark by annotation'
                        marksAndAnnotations.checkForMarkAnnotationMismatch = configurableCharacteristicsHelper.isMarkByAnnotation
                            (responseBaseDetails.atypicalStatus, markSchemeGroupId) ? true : false;
                        marksAndAnnotations.checkForTotalMarkMismatch = (userInfoStore.instance.currentOperationMode
                            === enums.MarkerOperationMode.StandardisationSetup) ? false : true;

                        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                        let msgId: number = (responseBaseDetails.isWholeResponse && responseBaseDetails.relatedRIGDetails) ?
                            0 : markSchemeGroupId;

                        // CCs
                        marksAndAnnotations.hasComplexOptionality = hasComplexOptionality =
                            configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.ComplexOptionality, markSchemeGroupId).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.hasPracticeAccuracyCCSet = configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.PracticeAccuracy).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.hasSpecificMarkToleranceCCSet = configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.SpecificMarkTolerance).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isSLAOForcedAnnotationCCEnabled = configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.SLAOForcedAnnotations, msgId).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isAllPagesAnnotatedCCEnabled = configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.ForceAnnotationOnEachPage, msgId).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isEBookMarking = configurableCharacteristicsHelper.getCharacteristicValue(
                            configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;

                        marksAndAnnotations.isMandateCommentEnabled = false; // no need to set now
                        marksAndAnnotations.isAllfilesViewed = false; // no need to set now

                        marksAndAnnotations.isInGracePeriod = worklistStore.instance.isResponseInGracePeriod(markGroupId);
                        marksAndAnnotations.isMarkChanged = dirtyMarks && dirtyMarks.length > 0 ? true : false;
                        marksAndAnnotations.isSeedingResponse = false; // no need to consider now

                        // marking time duration.
                        marksAndAnnotations.markingStartTime = markItem.markingStartTime;
                        marksAndAnnotations.markingEndTime = markItem.markingEndTime;

                        // marking progress details
                        let markingProgress: markingProgressDetails = markingStore.instance.getMarkingProgressDetails(markGroupId);
                        if (markingProgress) {
                            markingProgress.version = markingStore.instance.getExaminerMarkAndAnnotationsDataVersion
                                (markItem.markGroupId, markGroupId);
                            marksAndAnnotations.isAllNR = markingProgress.isAllNR;
                            marksAndAnnotations.isAllPagesAnnotated = markingProgress.isAllPagesAnnotated;
                            marksAndAnnotations.markingProgress = markingProgress;
                        } else {
                            // If markingProgress object is NULL/undefined, then this save could have been triggered 
                            // without opening the response
                            // The response details gets stored in the marking store only once the response is opened
                            // The save could be triggered without opening the response (requirement around ColouredAnnotation whereby if
                            // the colour of the annotations existing on the response differ from the colour according to Assessor 3 rules,
                            // then colour of the annotations are updated on the background and the mark group is made dirty.
                            // On the next background save trigger, this mark group will be picked up to save
                            // the changed annotation colour back to the database)
                            let response = isStandardisationMode ?
                                standardisationSetupStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId) :
                                worklistStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId);
                            markingProgress = new markingProgressDetails();
                            markingProgress.version = examinerMarksAndAnnotation.version;
                            markingProgress.markCount = examinerMarksAndAnnotation.examinerMarksCollection.length;
                            markingProgress.totalMarks = examinerMarksAndAnnotation.totalMarks;
                            markingProgress.markingProgress = examinerMarksAndAnnotation.markingProgress;
                            markingProgress.isAllPagesAnnotated = response.hasAllPagesAnnotated;
                            marksAndAnnotations.isAllPagesAnnotated = response.hasAllPagesAnnotated;
                            marksAndAnnotations.markingProgress = markingProgress;
                            //// TO DO
                            //// marksAndAnnotations.isAllNR = markingProgress.isAllNR;
                        }

                        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
                            if (worklistStore.instance.isMarkChangeReasonVisible(
                                markItem.markGroupId,
                                markingStore.instance.currentResponseMode)) {
                                marksAndAnnotations.markChangeReason = markingStore.instance.getMarkChangeReason(markItem.markGroupId);
                                marksAndAnnotations.isMarkChangeReasonUpdated =
                                    markingStore.instance.getIsMarkChangeReasonUpdated(markItem.markGroupId);
                            }

                            let _supervisorRemarkDecision = new supervisorRemarkDecision();
                            _supervisorRemarkDecision = markingStore.instance.getSupervisorRemarkDecision(markItem.markGroupId);

                            marksAndAnnotations.supervisorRemarkDecision = _supervisorRemarkDecision;
                        }

                        // fix for navigation from FRV , setting correct markGroupId 
                        marksAndAnnotations.isAllFilesViewedStatusUpdated = eCourseWorkFileStore.instance.checkIfAllFilesViewed(
                            markItem.markGroupId);


                        marksAndAnnotationsToSave = marksAndAnnotationsToSave.set(markSchemeGroupId, marksAndAnnotations);

                        saveLogInfo += 'markSchemeGroupId-' + markSchemeGroupId +
                            ' annotationsCount-' + marksAndAnnotations.annotations.count() +
                            ' marksCount-' + marksAndAnnotations.marks.count() + '\n';
                    }
                });

                // we need to set this as false for avoiding unwanted return calls in logout scenario.
                let isUpdateMarkAnnotationDetails: boolean = true;
                let isCoordinationCompleted: boolean = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
                // Invoking action creator to call the data service method for saving marks and annotations
                let argument = new saveMarksAndAnnotationsArgument(isUpdateMarkAnnotationDetails,
                    markingMode.toString(),
                    markItem.markGroupId, questionPaperPartId,
                    marksAndAnnotationsToSave, isStandardisationMode, usedStamps, saveMarksAndAnnotationTriggeringPoint,
                    responseBaseDetails.isWholeResponse, currentExaminerRoleId,
                    hasComplexOptionality, isCoordinationCompleted, markingStore.instance.isDefinitiveMarking);

                // Save call to the Database with the changes in marks and annotations collection
                responseActionCreator.saveMarksAndAnnotations(argument, priority, saveMarksAndAnnotationTriggeringPoint);

                // Logging save marks and annoatation.
                new loggingHelper().logSaveMarksAndAnnoatation(loggerConstants.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION,
                    loggerConstants.MARKENTRY_TYPE_SAVE_MARK_ANNOTATION_DB,
                    true,
                    applicationStore.instance.isOnline,
                    priority,
                    saveMarksAndAnnotationTriggeringPoint,
                    saveLogInfo);
            }
            while (this.count > 0);
        }
    }

    /**
     * This method will update marksAndAnnotations queue after saving the marks and annotations.
     */
    public static onSaveMarksAndAnnotations(markGroupId: number,
        queueOperation: enums.MarksAndAnnotationsQueueOperation): void {

        switch (queueOperation) {
            case enums.MarksAndAnnotationsQueueOperation.Remove:
                MarksAndAnnotationsSaveHelper.remove(markGroupId);
                break;
            case enums.MarksAndAnnotationsQueueOperation.Requeue:
                MarksAndAnnotationsSaveHelper.requeue(markGroupId);
                break;
            case enums.MarksAndAnnotationsQueueOperation.Retry:
                MarksAndAnnotationsSaveHelper.retry(markGroupId);
                break;
        }
    }
}

export = MarksAndAnnotationsSaveHelper;


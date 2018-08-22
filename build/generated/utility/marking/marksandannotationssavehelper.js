"use strict";
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var markingProgressDetails = require('../../dataservices/response/markingprogressdetails');
var marksAndAnnotationsSaveItemData = require('../../dataservices/response/marksandannotationssaveitemdata');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var saveMarksAndAnnotationsArgument = require('../../dataservices/response/savemarksandannotationsargument');
var enums = require('../../components/utility/enums');
var targetHelper = require('../target/targethelper');
var stampItem = require('../../dataservices/response/stampitem');
var marksAndAnnotationsToSaveData = require('../../stores/response/typings/marksandannotationstosavedata');
var configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../configurablecharacteristic/configurablecharacteristicsnames');
var stampStore = require('../../stores/stamp/stampstore');
var qigStore = require('../../stores/qigselector/qigstore');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var Immutable = require('immutable');
var supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
var loggingHelper = require('../../components/utility/marking/markingauditlogginghelper');
var loggerConstants = require('../../components/utility/loggerhelperconstants');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
/**
 * Helper class for Marks and Annotations save queuing and processing.
 */
var MarksAndAnnotationsSaveHelper = (function () {
    function MarksAndAnnotationsSaveHelper() {
    }
    /**
     * This will push an mark and annotations save item for processing.
     * @param markGroupId
     */
    MarksAndAnnotationsSaveHelper.push = function (markGroupId) {
        var markQueueItem = new marksAndAnnotationsSaveItemData();
        markQueueItem.markGroupId = markGroupId;
        markQueueItem.isProcessing = false;
        markQueueItem.retryCount = 0;
        //markQueueItem.markingStartTime = markingStore.instance.markingStartTime;
        var endDate = new Date();
        markQueueItem.markingEndTime = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds(), endDate.getUTCMilliseconds());
        markQueueItem.markingStartTime = markingStore.instance.markingStartTime;
        var filteredItems = this.saveMarksAndAnnotationsQueue.filter(function (x) {
            return x.isProcessing === false && x.markGroupId === markGroupId;
        });
        if (filteredItems.length === 0) {
            this.saveMarksAndAnnotationsQueue.splice(0, 0, markQueueItem);
            this.front++;
        }
    };
    /**
     * This method will enqueue the item again.
     * @param markGroupId
     */
    MarksAndAnnotationsSaveHelper.retry = function (markGroupId) {
        var index = this.findIndex(markGroupId);
        var retryAttempts = this.saveMarksAndAnnotationsQueue[index].retryCount;
        MarksAndAnnotationsSaveHelper.remove(markGroupId);
        if (retryAttempts < config.marksandannotationsconfig.MARKS_AND_ANNOTATIONS_SAVE_RETRY_ATTEMPT_COUNT) {
            var markQueueItem = new marksAndAnnotationsSaveItemData();
            markQueueItem.markGroupId = markGroupId;
            markQueueItem.isProcessing = false;
            markQueueItem.retryCount = retryAttempts + 1;
            this.front++;
            this.saveMarksAndAnnotationsQueue.splice(this.front, 0, markQueueItem);
        }
        else {
            this.setAsNonRecoverableItem(markGroupId);
        }
    };
    /**
     * setting as a non-recoverable item.
     * @param markGroupId
     */
    MarksAndAnnotationsSaveHelper.setAsNonRecoverableItem = function (markGroupId) {
        responseActionCreator.setNonRecoverableError(markGroupId);
    };
    /**
     * Find the index of a markGroupItem in save queue.
     * @param markGroupId
     */
    MarksAndAnnotationsSaveHelper.findIndex = function (markGroupId) {
        var index;
        for (var i = 0; i < this.saveMarksAndAnnotationsQueue.length; i++) {
            // index used to remove, Get only processed index.
            if (this.saveMarksAndAnnotationsQueue[i].markGroupId === markGroupId &&
                this.saveMarksAndAnnotationsQueue[i].isProcessing) {
                index = i;
                break;
            }
        }
        return index;
    };
    /**
     * This will remove the item from processing list.
     */
    MarksAndAnnotationsSaveHelper.remove = function (markGroupId) {
        var index = this.findIndex(markGroupId);
        if (index >= 0) {
            this.saveMarksAndAnnotationsQueue.splice(index, 1);
            // Decrement Queue length after removing the item
            this.front--;
        }
    };
    /**
     * This will requeue the mark group back to the queue as the next priority item
     */
    MarksAndAnnotationsSaveHelper.requeue = function (markGroupId) {
        var index = this.findIndex(markGroupId);
        var retryAttempts = this.saveMarksAndAnnotationsQueue[index].retryCount;
        // Removing the mark group from the current position in the queue
        MarksAndAnnotationsSaveHelper.remove(markGroupId);
        // Inserting back to the front position
        var markQueueItem = new marksAndAnnotationsSaveItemData();
        markQueueItem.markGroupId = markGroupId;
        markQueueItem.isProcessing = false;
        markQueueItem.retryCount = retryAttempts;
        this.front++;
        this.saveMarksAndAnnotationsQueue.splice(this.front, 0, markQueueItem);
    };
    /**
     * Update the processing status and returns the first item of the array.
     */
    MarksAndAnnotationsSaveHelper.peek = function () {
        if (!this.isEmpty) {
            var item = this.getMarkGroupItem();
            // If got an item to be processed, Set the processing flag.
            if (item) {
                item.isProcessing = true;
            }
            return item;
        }
    };
    /**
     * For a response(MarkGroup) there can be 2 entries in the Queue, 1 is in the Processing mode and one is to be processed
     * If there is a mark group is in processing mode, it should not be fetched for processing again
     * Get the next mark group from the Queue for processing.
     */
    MarksAndAnnotationsSaveHelper.getMarkGroupItem = function () {
        //Check the mark group has another processing entry in the Queue.
        var _loop_1 = function() {
            var markGroupItem = this_1.saveMarksAndAnnotationsQueue[index];
            //If another entry for the mark group exists as processing skip and check for the next.
            if (this_1.saveMarksAndAnnotationsQueue.filter(function (x) { return x.markGroupId === markGroupItem.markGroupId && x.isProcessing === true; }).length > 0) {
                return "continue";
            }
            return { value: markGroupItem };
        };
        var this_1 = this;
        for (var index = 0; index < this.saveMarksAndAnnotationsQueue.length; index++) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object") return state_1.value;
            if (state_1 === "continue") continue;
        }
    };
    Object.defineProperty(MarksAndAnnotationsSaveHelper, "count", {
        /**
         * This will returns the size of the unprocessed items;
         */
        get: function () {
            return !this.isEmpty ? this.front + 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarksAndAnnotationsSaveHelper, "isEmpty", {
        /**
         * Check whether the processing list empty or not
         */
        get: function () {
            return (this.front <= -1) ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This will clear the queue.
     */
    MarksAndAnnotationsSaveHelper.clear = function () {
        this.saveMarksAndAnnotationsQueue = [];
    };
    /**
     * This will reset the save in progress flag
     */
    MarksAndAnnotationsSaveHelper.resetSaveInProgress = function () {
        this.isSaveInProgress = false;
    };
    /**
     * This will enable the save in progress flag
     */
    MarksAndAnnotationsSaveHelper.enableSaveInProgress = function () {
        this.isSaveInProgress = true;
    };
    Object.defineProperty(MarksAndAnnotationsSaveHelper, "isQueueProcessedCompletely", {
        /**
         * Check whether the marks and annotations save queue is completely processed or not
         */
        get: function () {
            return this.saveMarksAndAnnotationsQueue.length === 0 && this.front <= -1;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the marks and annotations save queue.
     */
    MarksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue = function (isBackGroundSave) {
        var _this = this;
        if (isBackGroundSave === void 0) { isBackGroundSave = false; }
        var currentWorklistResponseBaseDetails;
        var isStandardisationSetupMode = userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
        if (isStandardisationSetupMode) {
            currentWorklistResponseBaseDetails =
                Immutable.List(standardisationSetupStore.instance.getCurrentWorklistResponseBaseDetails());
        }
        else {
            currentWorklistResponseBaseDetails =
                Immutable.List(worklistStore.instance.getCurrentWorklistResponseBaseDetails());
        }
        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map(function (x) {
                // build a collection to map the RIGs for a whole response
                var parentMarkGroupId = isStandardisationSetupMode ? x.esMarkGroupId : x.markGroupId;
                var markGroupIds = [parentMarkGroupId];
                // If a whole response, retrieve all the related markGroupIds
                if (x.isWholeResponse && x.relatedRIGDetails != null) {
                    x.relatedRIGDetails.map(function (y) {
                        markGroupIds.push(y.markGroupId);
                    });
                }
                markGroupIds.map(function (markGroupId) {
                    if (markingStore.instance.getMarksAndAnnotationsSaveQueueStatus(parentMarkGroupId)) {
                        // check whether the mark and annotation are changed for saving.
                        var dirtyMarks = markingStore.instance.getDirtyExaminerMarks(parentMarkGroupId, markGroupId);
                        var dirtyAnnotations = markingStore.instance.
                            getDirtyExaminerAnnotations(parentMarkGroupId, markGroupId);
                        var dirtyEnhancedOffPageComments = markingStore.instance.getDirtyEnhancedOffPageComments(parentMarkGroupId, markGroupId);
                        var dirtyBookMarks = markingStore.instance.getDirtyBookMarks(parentMarkGroupId, markGroupId);
                        var isMarkChangeReasonUpdated = markingStore.instance.getIsMarkChangeReasonUpdated(markGroupId);
                        var isSRDReasonUpdated = markingStore.instance.getIsSRDReasonUpdated(markGroupId);
                        if ((dirtyMarks && dirtyMarks.length > 0) ||
                            (dirtyAnnotations && dirtyAnnotations.length > 0) ||
                            (dirtyEnhancedOffPageComments && dirtyEnhancedOffPageComments.length > 0) ||
                            (dirtyBookMarks && dirtyBookMarks.length > 0) ||
                            isMarkChangeReasonUpdated ||
                            isSRDReasonUpdated ||
                            markingStore.instance.isAllFilesViewedStatusUpdated) {
                            // avoiding multiple entries in queue is handled inside push
                            // the key is the parent mark group id
                            _this.push(parentMarkGroupId);
                            // Update the marks and annotations save queue status to Not Awaiting Queueing
                            markingStore.instance.updateMarksAndAnnotationsSaveQueueingStatus(parentMarkGroupId, false, isBackGroundSave);
                        }
                    }
                });
            });
        }
    };
    Object.defineProperty(MarksAndAnnotationsSaveHelper, "markGroupItemsWithNonRecoverableErrors", {
        /**
         * This method will returns an array of displayIds with non-recoverable errors.
         */
        get: function () {
            var currentWorklistResponseBaseDetails = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
            // this array will hold the non-recoverable displayIds for displaying in popup.
            var nonRecoverableDisplayIds = new Array();
            if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
                currentWorklistResponseBaseDetails.map(function (x) {
                    // check whether the mark and annotation are changed for saving.
                    var hasNonRecoverableError = markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(x.markGroupId);
                    if (hasNonRecoverableError) {
                        nonRecoverableDisplayIds.push(x.displayId);
                    }
                });
            }
            return nonRecoverableDisplayIds;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will clear the marks and annotations  with non from the store for reloading.
     */
    MarksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForNonRecoverableErrors = function () {
        var currentWorklistResponseBaseDetails = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map(function (x) {
                // check whether the mark and annotation are changed for saving.
                var hasNonRecoverableError = markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(x.markGroupId);
                if (hasNonRecoverableError) {
                    responseActionCreator.clearMarksAndAnnotations(x.markGroupId);
                }
            });
        }
    };
    /**
     * This method will clear the marks and annotations from the store for reloading.
     * This method will call for grace period expired and response removed mark save error codes
     */
    MarksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForMarkSaveErrors = function () {
        var currentWorklistResponseBaseDetails = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
        if (currentWorklistResponseBaseDetails && currentWorklistResponseBaseDetails.count() > 0) {
            currentWorklistResponseBaseDetails.map(function (x) {
                // check whether the mark and annotation are changed for saving.
                var hasMarkSaveError = markingStore.instance.checkMarkGroupItemHasSaveMarkErrors(x.markGroupId);
                if (hasMarkSaveError) {
                    responseActionCreator.clearMarksAndAnnotations(x.markGroupId);
                }
            });
        }
    };
    /**
     * Method which triggers the processing of save marks and annotations queue
     * @param saveMarksAndAnnotationsProcessingTriggerPoint
     * @param callback
     */
    MarksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing = function (saveMarksAndAnnotationsProcessingTriggerPoint, callback, priority) {
        if (priority === void 0) { priority = enums.Priority.First; }
        // This will push the changed markGroupId to save marks and annotations queue.
        MarksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();
        // Processing marks and annotations queue
        if (MarksAndAnnotationsSaveHelper.count > 0) {
            if (saveMarksAndAnnotationsProcessingTriggerPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
                // set the flag has true when save starts
                MarksAndAnnotationsSaveHelper.enableSaveInProgress();
            }
            MarksAndAnnotationsSaveHelper.processMarksAndAnnotationsQueue(priority, saveMarksAndAnnotationsProcessingTriggerPoint);
        }
        else if (callback) {
            callback();
        }
    };
    /**
     * This method will save items from marksAndAnnotations queue.
     */
    MarksAndAnnotationsSaveHelper.processMarksAndAnnotationsQueue = function (priority, saveMarksAndAnnotationTriggeringPoint) {
        if (!this.isEmpty) {
            responseActionCreator.triggerSavingMarksAndAnnotations(saveMarksAndAnnotationTriggeringPoint);
            // Normally in Assessor 3, during the saving of marks and annotations only the dirty ones are passed
            // on to the gateway which is updated to the database.
            // We have a flag (IGNORE_DIRTY_FLAG_AND_SAVE_ALL_MARKS_AND_ANNOTATIONS) now in the config.js to control 
            // this mechanism. This flag is by default false and only the dirty annotations and marks shall be send to the gateway 
            // to be saved to the database.
            // If the flag is true, irrespective of the isDirty flag all the current marks and annotations shall be send to the
            // gateway to be saved to the database.
            var doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations_1 = config.marksandannotationsconfig.IGNORE_DIRTY_FLAG_AND_SAVE_ALL_MARKS_AND_ANNOTATIONS;
            var saveLogInfo_1 = '';
            var marksAndAnnotationsToSave_1 = Immutable.Map();
            var usedStamps_1 = Immutable.Map();
            // get the current marking mode.
            var isStandardisationMode_1 = userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup;
            var markingMode = isStandardisationMode_1 ? enums.MarkingMode.Pre_ES_TeamStandardisation :
                targetHelper.getSelectedQigMarkingMode();
            // get the question paper partId.
            var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            var currentExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            var _loop_2 = function() {
                // if browser is not connected to internet then break the process queue without processing further.
                if (!applicationStore.instance.isOnline) {
                    return "break";
                }
                var markItem = this_2.peek();
                // If all Queue items are currently processing mode, skip the save.
                if (!markItem) {
                    return { value: void 0 };
                }
                // build a collection to map the RIGs for a whole response
                var markGroupIds = [markItem.markGroupId];
                var responseBaseDetails = isStandardisationMode_1 ?
                    standardisationSetupStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId) :
                    worklistStore.instance.getResponseDetailsByMarkGroupId(markItem.markGroupId);
                var atypicalStatus = responseBaseDetails.atypicalStatus;
                // If a whole response, retrieve all the related markGroupIds
                if (responseBaseDetails.isWholeResponse && responseBaseDetails.relatedRIGDetails != null) {
                    responseBaseDetails.relatedRIGDetails.map(function (y) {
                        markGroupIds.push(y.markGroupId);
                    });
                }
                // check all related markGroupIds(in case of whole response)
                // and get all individual RIG dirty marks and annotations for saving to the Database
                markGroupIds.map(function (markGroupId) {
                    // load required data from marking store and call save marks one by one.
                    var dirtyMarks = markingStore.instance.getDirtyExaminerMarks(markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations_1);
                    var dirtyAnnotations = markingStore.instance.getDirtyExaminerAnnotations(markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations_1);
                    var dirtyEnhancedOffPageComments = markingStore.instance.getDirtyEnhancedOffPageComments(markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations_1);
                    var dirtyBookMarks = markingStore.instance.getDirtyBookMarks(markItem.markGroupId, markGroupId, doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations_1);
                    var isMarkChangeReasonUpdated = markingStore.instance.getIsMarkChangeReasonUpdated(markItem.markGroupId);
                    var isSRDReasonUpdated = markingStore.instance.getIsSRDReasonUpdated(markItem.markGroupId);
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
                        for (var i = 0; i < dirtyMarks.length; i++) {
                            dirtyMarks[i].isPickedForSaveOperation = true;
                        }
                        // Updating each annotation object whether it is picked for save operation
                        for (var i = 0; i < dirtyAnnotations.length; i++) {
                            dirtyAnnotations[i].isPickedForSaveOperation = true;
                        }
                        for (var i = 0; i < dirtyEnhancedOffPageComments.length; i++) {
                            dirtyEnhancedOffPageComments[i].isPickedForSaveOperation = true;
                        }
                        for (var i = 0; i < dirtyBookMarks.length; i++) {
                            dirtyBookMarks[i].isPickedForSaveOperation = true;
                        }
                        var examinerMarksAndAnnotation = markingStore.instance.currentExaminerMarksAgainstResponse(markItem.markGroupId, markGroupId);
                        // multiQIG - take the corresponding markschemeGroupId
                        var markSchemeGroupId_1 = markingStore.instance.getMarkSchemeGroupIdQIGtoRIGMap(markItem.markGroupId, markGroupId);
                        var stamps_1 = new Array();
                        // fill all used stamps
                        dirtyAnnotations.map(function (x) {
                            var stamp = stampStore.instance.getStamp(x.stamp, markSchemeGroupId_1);
                            // if stamp is already in the collection then we don't need to add that.
                            if (stamps_1.filter(function (x) { return x.stampID === stamp.stampId; }).length === 0) {
                                var item = new stampItem();
                                item.stampID = stamp.stampId;
                                item.isDynamic = stamp.stampType === enums.StampType.dynamic;
                                item.numericValue = stamp.numericValue;
                                stamps_1.push(item);
                            }
                        });
                        var stampsList = Immutable.List(stamps_1);
                        usedStamps_1 = usedStamps_1.set(markSchemeGroupId_1, stampsList);
                        // Build the save data which is sent to the Database
                        var marksAndAnnotations = new marksAndAnnotationsToSaveData();
                        marksAndAnnotations.markGroupId = markGroupId;
                        marksAndAnnotations.annotations = Immutable.List(dirtyAnnotations);
                        marksAndAnnotations.marks = Immutable.List(dirtyMarks);
                        marksAndAnnotations.markSchemeGroupId = markSchemeGroupId_1;
                        marksAndAnnotations.examinerRoleId = markingStore.instance.getExaminerRoleQIGtoRIGMap(markItem.markGroupId, markGroupId);
                        marksAndAnnotations.enhancedOffPageComments = Immutable.List(dirtyEnhancedOffPageComments);
                        marksAndAnnotations.bookMarks = Immutable.List(dirtyBookMarks);
                        marksAndAnnotations.accuracyTolerance = examinerMarksAndAnnotation.accuracyTolerance;
                        marksAndAnnotations.totalTolerance = examinerMarksAndAnnotation.totalTolerance;
                        marksAndAnnotations.seedingAMDTolerance = examinerMarksAndAnnotation.seedingAMDTolerance;
                        marksAndAnnotations.totalToleranceRemark = examinerMarksAndAnnotation.totalToleranceRemark;
                        marksAndAnnotations.areAllMarkSchemeCommented = false; //no need to set now
                        marksAndAnnotations.doClearSupervisorRemarksMarksChangeReason = false; // no need to set now
                        // Validation to prevent saving of marks and annotations that mismatch when marking using 'mark by annotation'
                        marksAndAnnotations.checkForMarkAnnotationMismatch = configurableCharacteristicsHelper.isMarkByAnnotation(responseBaseDetails.atypicalStatus, markSchemeGroupId_1) ? true : false;
                        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
                        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
                        var msgId = (responseBaseDetails.isWholeResponse && responseBaseDetails.relatedRIGDetails) ?
                            0 : markSchemeGroupId_1;
                        // CCs
                        marksAndAnnotations.hasComplexOptionalityCCSet = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ComplexOptionality, markSchemeGroupId_1).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.hasPracticeAccuracyCCSet = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.PracticeAccuracy).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.hasSpecificMarkToleranceCCSet = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SpecificMarkTolerance).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isSLAOForcedAnnotationCCEnabled = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, msgId).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isAllPagesAnnotatedCCEnabled = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, msgId).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isEBookMarking = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;
                        marksAndAnnotations.isMandateCommentEnabled = false; // no need to set now
                        marksAndAnnotations.isAllfilesViewed = false; // no need to set now
                        marksAndAnnotations.isInGracePeriod = worklistStore.instance.isResponseInGracePeriod(markGroupId);
                        marksAndAnnotations.isMarkChanged = dirtyMarks && dirtyMarks.length > 0 ? true : false;
                        marksAndAnnotations.isSeedingResponse = false; // no need to consider now
                        // marking time duration.
                        marksAndAnnotations.markingStartTime = markItem.markingStartTime;
                        marksAndAnnotations.markingEndTime = markItem.markingEndTime;
                        // marking progress details
                        var markingProgress = markingStore.instance.getMarkingProgressDetails(markGroupId);
                        if (markingProgress) {
                            markingProgress.version = markingStore.instance.getExaminerMarkAndAnnotationsDataVersion(markItem.markGroupId, markGroupId);
                            marksAndAnnotations.isAllNR = markingProgress.isAllNR;
                            marksAndAnnotations.isAllPagesAnnotated = markingProgress.isAllPagesAnnotated;
                            marksAndAnnotations.markingProgress = markingProgress;
                        }
                        else {
                            // If markingProgress object is NULL/undefined, then this save could have been triggered 
                            // without opening the response
                            // The response details gets stored in the marking store only once the response is opened
                            // The save could be triggered without opening the response (requirement around ColouredAnnotation whereby if
                            // the colour of the annotations existing on the response differ from the colour according to Assessor 3 rules,
                            // then colour of the annotations are updated on the background and the mark group is made dirty.
                            // On the next background save trigger, this mark group will be picked up to save
                            // the changed annotation colour back to the database)
                            var response = isStandardisationMode_1 ?
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
                        }
                        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
                            if (worklistStore.instance.isMarkChangeReasonVisible(markItem.markGroupId, markingStore.instance.currentResponseMode)) {
                                marksAndAnnotations.markChangeReason = markingStore.instance.getMarkChangeReason(markItem.markGroupId);
                                marksAndAnnotations.isMarkChangeReasonUpdated =
                                    markingStore.instance.getIsMarkChangeReasonUpdated(markItem.markGroupId);
                            }
                            var _supervisorRemarkDecision = new supervisorRemarkDecision();
                            _supervisorRemarkDecision = markingStore.instance.getSupervisorRemarkDecision(markItem.markGroupId);
                            marksAndAnnotations.supervisorRemarkDecision = _supervisorRemarkDecision;
                        }
                        // fix for navigation from FRV , setting correct markGroupId 
                        marksAndAnnotations.isAllFilesViewedStatusUpdated = eCourseWorkFileStore.instance.checkIfAllFilesViewed(markItem.markGroupId);
                        marksAndAnnotationsToSave_1 = marksAndAnnotationsToSave_1.set(markSchemeGroupId_1, marksAndAnnotations);
                        saveLogInfo_1 += 'markSchemeGroupId-' + markSchemeGroupId_1 +
                            ' annotationsCount-' + marksAndAnnotations.annotations.count() +
                            ' marksCount-' + marksAndAnnotations.marks.count() + '\n';
                    }
                });
                // we need to set this as false for avoiding unwanted return calls in logout scenario.
                var isUpdateMarkAnnotationDetails = true;
                // Invoking action creator to call the data service method for saving marks and annotations
                var argument = new saveMarksAndAnnotationsArgument(isUpdateMarkAnnotationDetails, markingMode.toString(), markItem.markGroupId, questionPaperPartId, marksAndAnnotationsToSave_1, false, usedStamps_1, saveMarksAndAnnotationTriggeringPoint, responseBaseDetails.isWholeResponse, currentExaminerRoleId);
                // Save call to the Database with the changes in marks and annotations collection
                responseActionCreator.saveMarksAndAnnotations(argument, priority, saveMarksAndAnnotationTriggeringPoint);
                // Logging save marks and annoatation.
                new loggingHelper().logSaveMarksAndAnnoatation(loggerConstants.MARKENTRY_REASON_SAVE_MARK_AND_ANNOTATION, loggerConstants.MARKENTRY_TYPE_SAVE_MARK_ANNOTATION_DB, true, applicationStore.instance.isOnline, priority, saveMarksAndAnnotationTriggeringPoint, saveLogInfo_1);
            };
            var this_2 = this;
            do {
                var state_2 = _loop_2();
                if (typeof state_2 === "object") return state_2.value;
                if (state_2 === "break") break;
            } while (this.count > 0);
        }
    };
    /**
     * This method will update marksAndAnnotations queue after saving the marks and annotations.
     */
    MarksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations = function (markGroupId, queueOperation) {
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
    };
    // private variable for marks save queue
    MarksAndAnnotationsSaveHelper.saveMarksAndAnnotationsQueue = new Array();
    MarksAndAnnotationsSaveHelper.front = -1;
    MarksAndAnnotationsSaveHelper.isSaveInProgress = false;
    return MarksAndAnnotationsSaveHelper;
}());
module.exports = MarksAndAnnotationsSaveHelper;
//# sourceMappingURL=marksandannotationssavehelper.js.map
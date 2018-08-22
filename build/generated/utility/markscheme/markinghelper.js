"use strict";
var messageStore = require('../../stores/message/messagestore');
var enums = require('../../components/utility/enums');
var annotationHelper = require('../../components/utility/annotation/annotationhelper');
var enhancedoffpagecommenthelper = require('../../components/utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
var markingStore = require('../../stores/marking/markingstore');
var worklistStore = require('../../stores/worklist/workliststore');
var responseStore = require('../../stores/response/responsestore');
var scriptStore = require('../../stores/script/scriptstore');
var sortHelper = require('../sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var Immutable = require('immutable');
var exceptionStore = require('../../stores/exception/exceptionstore');
var treeViewDataHelper = require('../treeviewhelpers/treeviewdatahelper');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var constants = require('../../components/utility/constants');
var pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
var warningNR = require('../../components/response/typings/warningnr');
var xmlHelper = require('../generic/xmlhelper');
var warningNRCC = require('../../components/response/typings/warningnrcc');
var enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
var acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var MarkingHelper = (function () {
    /**
     * Constructor
     * @param validationHelper
     */
    function MarkingHelper(validationHelper) {
        // The nr mark text
        this.NR = 'NR';
        this.helper = validationHelper;
        MarkingHelper.markSchemesWithSameImageClusterId = Immutable.List();
    }
    Object.defineProperty(MarkingHelper.prototype, "validationHelper", {
        // Get the current validation helper.
        get: function () {
            return this.helper;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the text value from the input keycode
     * @param {number} keyCode
     * @returns
     */
    MarkingHelper.prototype.getTextValue = function (keyCode, text) {
        var result = '';
        switch (keyCode) {
            case enums.KeyCode.hash:
                result = this.NR;
                break;
            case enums.KeyCode.forwardSlash:
                result = this.NR;
                break;
            default:
                result = text + String.fromCharCode(keyCode);
                break;
        }
        return result;
    };
    /**
     * Processing the special keys like backspace and delete keys
     * @param {number} keyCode
     * @param {string} text
     * @returns the text value of processed. If the allowed key range the result will be according to that.
     */
    MarkingHelper.prototype.processSpecialKeys = function (keyCode, text) {
        var result = text;
        var handledEvent = false;
        if (keyCode === enums.KeyCode.backspace) {
            // As the back button functionality should work as normal
            // text box behaviour always set handled false to buble up the
            // event to let the textbox do the job.
            handledEvent = false;
        }
        else if (keyCode === enums.KeyCode.delete) {
            result = '';
            handledEvent = true;
        }
        // returning the modified mark event handled result.
        return [result, handledEvent];
    };
    /**
     * Format the marks
     * @param {string} mark
     * @returns
     */
    MarkingHelper.prototype.formatMark = function (mark, availableMarks, stepValue) {
        var updatedMark = {
            displayMark: '-', valueMark: null
        };
        // If mark is null assign '-'
        if (mark === '' || mark === '-') {
            return {
                displayMark: '-',
                valueMark: null
            };
        }
        if (mark.toLowerCase() === this.NR.toLowerCase()) {
            return {
                displayMark: this.NR,
                valueMark: null
            };
        }
        updatedMark = this.helper.formatMark(mark, availableMarks, stepValue);
        return updatedMark;
    };
    /**
     * Retrieving current mark text. If NR shortcuts has been used,
     * converting those to NR otherwise no change will be applied.
     * @param {string} mark
     * @returns
     */
    MarkingHelper.prototype.getMark = function (mark) {
        var updatedMark = mark;
        // If mark is null assign '-'
        if (mark === '#' || mark === '/') {
            return this.NR;
        }
        return updatedMark;
    };
    /**
     * to validate the marks before saving (locally)
     * @param {string} mark
     * @returns true/false
     */
    MarkingHelper.prototype.isValidMark = function (mark) {
        // to avoid saving the n only
        if (mark.toLocaleLowerCase() === 'n') {
            return false;
        }
        return true;
    };
    /**
     * To check whether the functional keys (F1-F12) and tab key pressed or not.
     * @param keyCode
     */
    MarkingHelper.prototype.isFunctionalKeys = function (keyCode) {
        // F1=112 and F12=123
        if (keyCode >= 112 && keyCode <= 123 || keyCode === 9) {
            return true;
        }
        return false;
    };
    /**
     * Checking whether to show reset confirmation.
     * @param {string} mark
     * @returns
     */
    MarkingHelper.prototype.checkIfResetConfirmation = function (mark) {
        if (((mark === '-'))
            && (annotationHelper.hasUserAddedAnnotationExistsForTheCurrentMarkScheme())) {
            return true;
        }
        return false;
    };
    /**
     * Checking whether to show reset confirmation while clicking
     * delete or BackSpace key.
     * @param {string} mark
     * @returns
     */
    MarkingHelper.prototype.checkIfResetConfirmationDeleting = function (mark) {
        if (mark.trim() === '') {
            return true;
        }
        return false;
    };
    /**
     * Checking whether the reset is enabled.
     * @param {string} mark
     * @returns
     */
    MarkingHelper.prototype.isResetEnabled = function (mark) {
        if (((mark && mark.trim() !== '') && (mark !== '-'))
            || (annotationHelper.hasUserAddedAnnotationExistsForTheCurrentMarkScheme() ||
                enhancedoffpagecommenthelper.hasEnhancedOffPageComments())) {
            return true;
        }
        return false;
    };
    /**
     * Returns true if all pages are annotated
     * @returns All pages annotated or not
     */
    MarkingHelper.isAllPageAnnotated = function () {
        var isAllPageAnnotated = false;
        MarkingHelper._hasUnAnnotatedSlao = false;
        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
        var markSchemeGroupId = 0;
        if (!responseStore.instance.isWholeResponse) {
            markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
        }
        var isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';
        var isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';
        var responseData = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var isStructured = responseStore.instance.markingMethod === enums.MarkingMethod.Structured;
        var isUnStructured = responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured;
        if (responseData && responseData.candidateScriptId) {
            var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(responseData.candidateScriptId);
            var annotationDetails_1;
            scriptDetails = Immutable.List(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
            if (scriptDetails) {
                scriptDetails.forEach(function (scriptImage) {
                    if (scriptImage && !scriptImage.isSuppressed) {
                        if (isAllPagesAnnotatedCC && isUnStructured) {
                            annotationDetails_1 = annotationHelper.getCurrentAnnotationsByPageNo(0, 0, 0, scriptImage.pageNumber);
                            isAllPageAnnotated = annotationDetails_1.count() > 0 ? true : false;
                            if (!isAllPageAnnotated) {
                                return isAllPageAnnotated;
                            }
                        }
                        else if (isAllSLAOAnnotatedCC
                            && scriptImage.isAdditionalObject
                            && isStructured) {
                            annotationDetails_1 = annotationHelper.getCurrentAnnotationsByPageNo(0, 0, 0, scriptImage.pageNumber);
                            isAllPageAnnotated = annotationDetails_1.count() > 0 ? true : false;
                            if (!isAllPageAnnotated) {
                                MarkingHelper._hasUnAnnotatedSlao = true;
                                return isAllPageAnnotated;
                            }
                        }
                        else if (isAllSLAOAnnotatedCC && !scriptImage.isAdditionalObject) {
                            isAllPageAnnotated = true;
                        }
                    }
                });
            }
        }
        return isAllPageAnnotated;
    };
    /** Check the  response view mode is full responseview or not.
     *  if it is, then take the latest current marking progress from treeviewhelper for showing the ResponseNavigateFailureReason.
     *  @returns currentmarkingProgess.
     */
    MarkingHelper.getCurrentMarkingProgress = function () {
        var currentMarkingProgress;
        if (responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
            this.treeViewHelper = new treeViewDataHelper();
            var treeItem = this.treeViewHelper.treeViewItem();
            currentMarkingProgress = treeItem.markingProgress;
        }
        else {
            currentMarkingProgress = markingStore.instance.currentResponseMarkingProgress;
        }
        return currentMarkingProgress;
    };
    /** Check whether the user can navigate away from the marking screen.
     *   Currently only a unmarked response in grace period prevents this.
     */
    MarkingHelper.canNavigateAwayFromCurrentResponse = function (currentMarkingProgress) {
        if (currentMarkingProgress === undefined) {
            currentMarkingProgress = this.getCurrentMarkingProgress();
        }
        /* Save the modified acetate collection on navigate to inbx, wrklst, home from open/ pending / closed worklist.
           Before saving acetate list, resetting shared overlay changes done by team member other than PE.
           That is shared overlay changes done by team member other than PE should not the saved in the database.
           After resetting the changes, invoke acetate save operation to save modified acetate list in the database.*/
        MarkingHelper.resetSharedAcetatesList();
        var responseNavigationFailureReasons = new Array();
        if (responseStore.instance.selectedMarkGroupId && !worklistStore.instance.isMarkingCheckMode) {
            var allPagesNotAnnotated = false;
            if ((markingStore.instance.currentResponseMode === enums.ResponseMode.pending &&
                currentMarkingProgress < 100)) {
                responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
            }
            // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
            // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
            var markSchemeGroupId = 0;
            if (!responseStore.instance.isWholeResponse) {
                markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
            }
            var forceAnnotationOnEachPageCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';
            var slaoForcedAnnotationCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';
            markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
            var supervisorRemarkCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true';
            var isStructuredResponse = responseStore.instance.markingMethod === enums.MarkingMethod.Structured;
            if ((forceAnnotationOnEachPageCCOn || slaoForcedAnnotationCCOn)
                && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                if (markingStore.instance.currentResponseMode === enums.ResponseMode.open
                    && currentMarkingProgress === 100
                    && !this.isAllPageAnnotated()) {
                    var failureReason = isStructuredResponse && slaoForcedAnnotationCCOn ?
                        enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated :
                        enums.ResponseNavigateFailureReason.AllPagesNotAnnotated;
                    responseNavigationFailureReasons.push(failureReason);
                    allPagesNotAnnotated = true;
                }
                if (markingStore.instance.currentResponseMode === enums.ResponseMode.pending &&
                    currentMarkingProgress === 100 && !this.isAllPageAnnotated()) {
                    var failureReason = isStructuredResponse ? enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace :
                        enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace;
                    responseNavigationFailureReasons.push(failureReason);
                    allPagesNotAnnotated = true;
                }
            }
            if (markingStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId)) {
                if (worklistStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId, markingStore.instance.currentResponseMode)) {
                    if (markerOperationModeFactory.operationMode.isMarkChangeReasonNeeded(currentMarkingProgress)) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded);
                    }
                }
            }
            if ((markingStore.instance.currentResponseMode === enums.ResponseMode.open
                || markingStore.instance.currentResponseMode === enums.ResponseMode.pending)
                && !markerOperationModeFactory.operationMode.isTeamManagementMode
                && currentMarkingProgress === 100) {
                var warningNR_1 = this.getNRPopupWarningsDetails();
                if (warningNR_1.allMarkedAsNR) {
                    responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AllMarkedAsNR);
                }
                else {
                    if (warningNR_1.atleastOneNRWithoutOptionality) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality);
                    }
                    if (warningNR_1.atleastOneNRWithOptionalityUsedInTotal) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal);
                    }
                    if (warningNR_1.atleastOneNRWithOptionalityNotUsedInTotal) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal);
                    }
                }
                var responsedetails = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
                if (eCourseworkHelper.isECourseworkComponent && responsedetails) {
                    if (!eCourseWorkFileStore.instance.checkIfAllFilesViewed(responsedetails.markGroupId)) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.NotAllFilesViewed);
                    }
                }
                // check whether the supervisor remark decision is selected for that particular response,
                // if supervisorremardecision CC is on.
                if (worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark &&
                    supervisorRemarkCCOn &&
                    markingStore.instance.convertSupervisorRemarkDecisionType()
                        === enums.SupervisorRemarkDecisionType.none) {
                    responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.SuperVisorRemarkDecisionNeeded);
                }
            }
        }
        if (messageStore.instance.isMessagePanelActive) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.UnSentMessage);
        }
        if ((exceptionStore.instance.isExceptionPanelActive || exceptionStore.instance.isExceptionPanelVisible)
            && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.UnSavedException);
        }
        // if enhanced off-page comment edited then push navigation failure reason.
        if (enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.UnSavedEnhancedOffPageComment);
        }
        if (eCourseWorkFileStore.instance.isFileDownloadedOutside) {
            responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.FileDownloadedOutside);
        }
        return responseNavigationFailureReasons;
    };
    /**
     * get the value of DisplayNRMarkAndRubricInfringementWarnings cc.
     */
    MarkingHelper.getDisplayNRMarkAndRubricInfringementWarningsCC = function (markSchemeGroupId) {
        var warningNRCCFlagsValues = new warningNRCC();
        // get the value corresponding to the given cc.
        var ccValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.DisplayNRMarkAndRubricInfringementWarnings, markSchemeGroupId);
        if (ccValue && ccValue !== '') {
            // Avoid warnings in console incase of cc is empty
            var xmlHelperObj = new xmlHelper(ccValue);
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (xmlHelperObj.getAllChildNodes()[i].firstChild !== null) {
                    if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagInsufficientQuestionsMarked') {
                        warningNRCCFlagsValues.flagInsufficientQuestionsMarked =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    }
                    else if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagExcessQuestionsMarked') {
                        warningNRCCFlagsValues.flagExcessQuestionsMarked =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    }
                    else if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagNonOptionalQuestionsMarkedNR') {
                        warningNRCCFlagsValues.flagNonOptionalQuestionsMarkedNR =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    }
                }
            }
        }
        return warningNRCCFlagsValues;
    };
    /**
     * get the NR warning deatils from the store.
     */
    MarkingHelper.getNRPopupWarningsDetails = function () {
        // store will be undefined when a open a response ,
        // then take the information from treeviewhelper, and check warning details related NR.
        if (markingStore.instance.warningNR === undefined) {
            this.treeViewHelper = new treeViewDataHelper();
            var node = this.treeViewHelper.treeViewItem();
            return this.getWarningNRDetails(node);
        }
        else {
            return markingStore.instance.warningNR;
        }
    };
    /**
     * return  list of warnings based on the question item which is marked as NR and i's related cc values  and optionality.
     */
    MarkingHelper.getWarningNRDetails = function (nodes) {
        var hasOptionality = false;
        var nrWarnings = new warningNR();
        var nodeDetails = nodes.treeViewItemList;
        // get the  each  flag values when DisplayNRMarkAndRubricInfringementWarnings CC is turned ON.
        var warningNRCCFlagsValues = this.getDisplayNRMarkAndRubricInfringementWarningsCC(nodes.markSchemeGroupId);
        // finding optionalality is exist for the current question item.
        if (nodes.hasSimpleOptionality === true) {
            hasOptionality = true;
        }
        // if the response is fully marked as NR ,then no need to check other warning condition of NR.
        if (nodes.isAllNR === true && nodes.markingProgress === 100) {
            nrWarnings.allMarkedAsNR = true;
        }
        else {
            // If the response is marked with one or more question item ,
            //  then traverse the reeview iten for finding the NR warning condition based on cc and optionality.
            nrWarnings = this.treeTraversalForNRWarnings(nodes, hasOptionality, nrWarnings, warningNRCCFlagsValues);
        }
        return nrWarnings;
    };
    /**
     * return  list of warnings based on the question item which is marked as NR and i's related cc values  and optionality.
     */
    MarkingHelper.treeTraversalForNRWarnings = function (nodes, hasOptionality, nrWarnings, warningNRCCFlagsValues) {
        var _this = this;
        var nodeDetails = nodes.treeViewItemList;
        var hasSimpleOptionality = hasOptionality;
        var nrWarningsDetails = nrWarnings;
        var warningNRCCValues = warningNRCCFlagsValues;
        // Iterating the treeview for getting the NR warning mesaages realted some conditions
        nodeDetails.forEach(function (node) {
            // if the response has no optionlality then check the below condition.
            if (!hasSimpleOptionality) {
                // marked response without optionality where one or more question items are marked as NR
                if (node.itemType === enums.TreeViewItemType.marksScheme &&
                    node.allocatedMarks.displayMark === constants.NOT_ATTEMPTED
                    && warningNRCCValues.flagNonOptionalQuestionsMarkedNR === 'true') {
                    nrWarningsDetails.atleastOneNRWithoutOptionality = true;
                }
            }
            else {
                // response with optionality where one or more question items are marked as NR and are "used in total" 
                // and FlagInsufficientQuestionsMarked check in the DisplayNRMarkAndRubricInfringementWarnings CC is turned ON
                if (node.itemType === enums.TreeViewItemType.marksScheme
                    && node.allocatedMarks.displayMark !== constants.NOT_ATTEMPTED && node.usedInTotal === false
                    && warningNRCCValues.flagExcessQuestionsMarked === 'true') {
                    nrWarningsDetails.atleastOneNRWithOptionalityNotUsedInTotal = true;
                }
                // response with optionality where one or more question items are not marked as NR and are not "used in total"
                // and FlagExcessQuestionsMarked check in the DisplayNRMarkAndRubricInfringementWarnings CC is turned ON
                if (node.itemType === enums.TreeViewItemType.marksScheme
                    && node.allocatedMarks.displayMark === constants.NOT_ATTEMPTED
                    && node.usedInTotal === true && warningNRCCValues.flagInsufficientQuestionsMarked === 'true') {
                    nrWarningsDetails.atleastOneNRWithOptionalityUsedInTotal = true;
                }
            }
            // do the traversal of next child node for checking the nr warning conditions.
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                _this.treeTraversalForNRWarnings(node, hasSimpleOptionality, nrWarningsDetails, warningNRCCValues);
            }
        });
        return nrWarningsDetails;
    };
    /**
     * return whether the image cluster id of current question item is same as previous or not
     */
    MarkingHelper.isImageClusterChanged = function () {
        return markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemInfo.imageClusterId !== markingStore.instance.previousQuestionItemImageClusterId
            : false;
    };
    /**
     * return true if  same linked pages exist for the current and previous question item.
     */
    MarkingHelper.hasDifferentLinkedPages = function () {
        //keep current and previous markscheme id for identifying uniquely.
        var currentMarkSchemeId = markingStore.instance.currentMarkSchemeId;
        var previousMarkSchemeId = markingStore.instance.previousMarkSchemeId;
        // keep linkannotation details of current and previous question item.
        var linkedAnnotationAgainstCurrentMarkscheme;
        var linkedAnnotationAgainstPreviousMarkscheme;
        //keep the all pagenumber deatils of current and previous markscheme where link annotation applied.
        var pageNumerOfcurrentQuestionItem;
        var pageNumerOfPreviousQuestionItem;
        var doCheckPreviousMarkerAnnotation = pageLinkHelper.doShowPreviousMarkerLinkedPages;
        linkedAnnotationAgainstCurrentMarkscheme = pageLinkHelper.getLinkedAnnotationAgainstQuestionItem(currentMarkSchemeId, doCheckPreviousMarkerAnnotation);
        linkedAnnotationAgainstPreviousMarkscheme = pageLinkHelper.getLinkedAnnotationAgainstQuestionItem(previousMarkSchemeId, doCheckPreviousMarkerAnnotation);
        this.treeViewHelper = new treeViewDataHelper();
        var nodeDetails = this.treeViewHelper.treeViewItem();
        if (linkedAnnotationAgainstCurrentMarkscheme !== null && linkedAnnotationAgainstPreviousMarkscheme != null) {
            // if link annoation is not applied anymore (current and previous question item) ,then return false.
            if (linkedAnnotationAgainstCurrentMarkscheme.length === 0 && linkedAnnotationAgainstPreviousMarkscheme.length === 0) {
                return false;
            }
            else if (linkedAnnotationAgainstCurrentMarkscheme.length === 0 || linkedAnnotationAgainstPreviousMarkscheme.length === 0) {
                this.nodetoReturnFromCurrentMarkschemeId = this.getMarkschemeParentNodeDetails(nodeDetails, currentMarkSchemeId, true);
                // check the current markscheme is the type of multiple markscheme then consider the image cluster id.
                if (this.nodetoReturnFromCurrentMarkschemeId.itemType === enums.TreeViewItemType.answerItem) {
                    this.nodetoReturnFromPreviousMarkschemeId =
                        this.getMarkschemeParentNodeDetails(nodeDetails, previousMarkSchemeId, true);
                }
                if (this.nodetoReturnFromCurrentMarkschemeId === this.nodetoReturnFromPreviousMarkschemeId) {
                    return this.isImageClusterChanged();
                }
                else {
                    return true;
                }
            }
            else {
                // holding the collection of page number for the current and multiple markscheme.
                pageNumerOfcurrentQuestionItem = new Array();
                pageNumerOfPreviousQuestionItem = new Array();
                linkedAnnotationAgainstCurrentMarkscheme.forEach(function (annotation) {
                    pageNumerOfcurrentQuestionItem.push(annotation.pageNo);
                });
                linkedAnnotationAgainstPreviousMarkscheme.forEach(function (annotation) {
                    pageNumerOfPreviousQuestionItem.push(annotation.pageNo);
                });
                return pageNumerOfcurrentQuestionItem.toString() !== pageNumerOfPreviousQuestionItem.toString();
            }
        }
        return false;
    };
    /**
     * return parent node details of the current and previous markscheme for identifying the item type.
     * @param nodes
     * @param markSchemeId
     * @param clear
     * @returns
     */
    MarkingHelper.getMarkschemeParentNodeDetails = function (nodes, markSchemeId, clear) {
        var _this = this;
        if (clear === void 0) { clear = false; }
        if (clear) {
            this.nodetoReturn = null;
        }
        var nodeDetails = nodes.treeViewItemList;
        nodeDetails.some(function (node) {
            if (node.uniqueId === markSchemeId && node.itemType === enums.TreeViewItemType.marksScheme) {
                _this.nodetoReturn = nodes;
                return true;
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0
                && (_this.nodetoReturn === undefined || _this.nodetoReturn === null)) {
                _this.getMarkschemeParentNodeDetails(node, markSchemeId);
            }
        });
        return this.nodetoReturn;
    };
    /**
     * return markschemes with same image cluster id
     * @param nodes
     * @param imageClusterId
     * @param clear
     */
    MarkingHelper.getMarkSchemesWithSameImageClusterId = function (nodes, imageClusterId, clear) {
        if (clear === void 0) { clear = false; }
        if (clear) {
            MarkingHelper.markSchemesWithSameImageClusterId = Immutable.List();
        }
        var nodeDetails = nodes.treeViewItemList;
        nodeDetails.map(function (node) {
            if (node.imageClusterId === imageClusterId && node.itemType === enums.TreeViewItemType.marksScheme) {
                MarkingHelper.markSchemesWithSameImageClusterId = MarkingHelper.markSchemesWithSameImageClusterId
                    .set(MarkingHelper.markSchemesWithSameImageClusterId.count() + 1, node);
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                MarkingHelper.getMarkSchemesWithSameImageClusterId(node, imageClusterId);
            }
        });
        return MarkingHelper.markSchemesWithSameImageClusterId.filter(function (item) { return item !== undefined; });
    };
    Object.defineProperty(MarkingHelper, "hasUnAnnotatedSlao", {
        /*
         * Gets whether response has un annotated additional objects
         */
        get: function () {
            return this._hasUnAnnotatedSlao;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets all aditional objects of current response
     */
    MarkingHelper.getAdditionalObjects = function () {
        var responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var additionalScriptImages = [];
        if (responseData && responseData.candidateScriptId) {
            // get the additional script images which are not supressed
            var scriptDetails = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript(responseData.candidateScriptId)).forEach(function (scriptImage) {
                if (scriptImage && scriptImage.isAdditionalObject && !scriptImage.isSuppressed) {
                    additionalScriptImages.push(scriptImage);
                }
            });
        }
        return additionalScriptImages;
    };
    /**
     * To check the response data should be saved automatically
     */
    MarkingHelper.isAutoSaveMarksAndAnnotation = function () {
        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
        var markSchemeGroupId = 0;
        if (!responseStore.instance.isWholeResponse) {
            markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
        }
        var forceAnnotationOnEachPageCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';
        var isAllSLAOAnnotatedCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';
        markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        var isSupervisorDecisionCCOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true';
        var isClosedResponse = worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
        var isPendingResponse = worklistStore.instance.getResponseMode === enums.ResponseMode.pending;
        var isSupervisorRemark = worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark;
        var markingProgress = markingStore.instance.currentResponseMarkingProgress;
        return !(isClosedResponse
            || (isPendingResponse &&
                (markingProgress !== 100
                    || (!this.isAllPageAnnotated()
                        && (forceAnnotationOnEachPageCCOn || isAllSLAOAnnotatedCCOn))
                    || (isSupervisorDecisionCCOn && isSupervisorRemark
                        && markingStore.instance.convertSupervisorRemarkDecisionType() === enums.SupervisorRemarkDecisionType.none))));
    };
    /**
     * Method to reset the shared acetate list.
     */
    MarkingHelper.resetSharedAcetatesList = function () {
        if (qigStore) {
            if (qigStore.instance.getSaveProgressAcetataeList().size === 0) {
                acetatesActionCreator.resetSharedAcetate();
            }
        }
    };
    /**
     * Returns whether the question tag id of current question item is same as previous or not.
     * This is used to check whether the image zones are same for the question items.
     */
    MarkingHelper.hasQuestionTagIdChanged = function () {
        return markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemQuestionTagId !== markingStore.instance.previousQuestionItemQuestionTagId
            : false;
    };
    /**
     * return markschemes with same question tag id.
     * @param nodes
     * @param questionTagId
     * @param clear
     */
    MarkingHelper.getMarkSchemesWithSameQuestionTagId = function (nodes, questionTagId, clear) {
        if (clear === void 0) { clear = false; }
        if (clear) {
            MarkingHelper.markSchemesWithSameQuestionTagId = Immutable.List();
        }
        var nodeDetails = nodes.treeViewItemList;
        nodeDetails.map(function (node) {
            if (node.questionTagId === questionTagId && node.itemType === enums.TreeViewItemType.marksScheme) {
                MarkingHelper.markSchemesWithSameQuestionTagId = MarkingHelper.markSchemesWithSameQuestionTagId
                    .set(MarkingHelper.markSchemesWithSameQuestionTagId.count() + 1, node);
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                MarkingHelper.getMarkSchemesWithSameQuestionTagId(node, questionTagId);
            }
        });
        return MarkingHelper.markSchemesWithSameQuestionTagId.filter(function (item) { return item !== undefined; });
    };
    MarkingHelper._hasUnAnnotatedSlao = false;
    /**
     * Link Manually Annotated SLAOs
     */
    MarkingHelper.addLinksToAnnotatedSLAOs = function (displayId, isPreviousMarks, defaultAnnotation, previousMarkIndex) {
        if (isPreviousMarks === void 0) { isPreviousMarks = true; }
        var additionalScriptImages = MarkingHelper.getAdditionalObjects();
        if (isPreviousMarks) {
            pageLinkHelper.addLinksToAnnotatedSLAO(defaultAnnotation, additionalScriptImages, isPreviousMarks, previousMarkIndex);
        }
        else {
            var currentAnnotations = annotationHelper.getCurrentMarkGroupAnnotation();
            pageLinkHelper.addLinksToAnnotatedSLAO(currentAnnotations, additionalScriptImages, isPreviousMarks);
        }
    };
    return MarkingHelper;
}());
module.exports = MarkingHelper;
//# sourceMappingURL=markinghelper.js.map
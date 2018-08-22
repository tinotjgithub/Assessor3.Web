import messageStore = require('../../stores/message/messagestore');
import enums = require('../../components/utility/enums');
import annotationHelper = require('../../components/utility/annotation/annotationhelper');
import enhancedoffpagecommenthelper = require('../../components/utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import markingStore = require('../../stores/marking/markingstore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import scriptStore = require('../../stores/script/scriptstore');
import examinerAnnotation = require('../../stores/response/typings/annotation');
import sortHelper = require('../sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import Immutable = require('immutable');
import exceptionStore = require('../../stores/exception/exceptionstore');
import treeViewDataHelper = require('../treeviewhelpers/treeviewdatahelper');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import constants = require('../../components/utility/constants');
import annotation = require('../../stores/response/typings/annotation');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
import warningNR = require('../../components/response/typings/warningnr');
import xmlHelper = require('../generic/xmlhelper');
import warningNRCC = require('../../components/response/typings/warningnrcc');
import examinerMarksAndAnnotation = require('../../stores/response/typings/examinermarksandannotation');
import enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
import acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');

class MarkingHelper {

    // Holds instance of validaton helper
    private helper: MarkingValidationHelper;

    private static treeViewHelper: treeViewDataHelper;

    // The nr mark text
    private NR = 'NR';
    private static nodetoReturn: treeViewItem;
    private static nodetoReturnFromCurrentMarkschemeId: treeViewItem;
    private static nodetoReturnFromPreviousMarkschemeId: treeViewItem;
    private static _hasUnAnnotatedSlao: boolean = false;
    private static markSchemesWithSameImageClusterId: Immutable.List<treeViewItem>;
    private static markSchemesWithSameQuestionTagId: Immutable.List<treeViewItem>;

    /**
     * Constructor
     * @param validationHelper
     */
    constructor(validationHelper: MarkingValidationHelper) {
        this.helper = validationHelper;
        MarkingHelper.markSchemesWithSameImageClusterId = Immutable.List<treeViewItem>();
    }

    // Get the current validation helper.
    public get validationHelper(): MarkingValidationHelper {
        return this.helper;
    }

    /**
     * Get the text value from the input keycode
     * @param {number} keyCode
     * @returns
     */
    public getTextValue(keyCode: number, text: string): string {

        let result: string = '';
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
    }

    /**
     * Processing the special keys like backspace and delete keys
     * @param {number} keyCode
     * @param {string} text
     * @returns the text value of processed. If the allowed key range the result will be according to that.
     */
    public processSpecialKeys(keyCode: number, text: string): Array<any> {

        let result: string = text;
        let handledEvent: boolean = false;

        if (keyCode === enums.KeyCode.backspace) {

            // As the back button functionality should work as normal
            // text box behaviour always set handled false to buble up the
            // event to let the textbox do the job.
            handledEvent = false;

        } else if (keyCode === enums.KeyCode.delete) {
            result = '';
            handledEvent = true;
        }

        // returning the modified mark event handled result.
        return [result, handledEvent];
    }

    /**
     * Format the marks
     * @param {string} mark
     * @returns
     */
    public formatMark(mark: string, availableMarks: Immutable.List<AllocatedMark>, stepValue?: number): AllocatedMark {

        let updatedMark: AllocatedMark = {
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
    }

    /**
     * Retrieving current mark text. If NR shortcuts has been used,
     * converting those to NR otherwise no change will be applied.
     * @param {string} mark
     * @returns
     */
    public getMark(mark: string): string {

        let updatedMark: string = mark;

        // If mark is null assign '-'
        if (mark === '#' || mark === '/') {
            return this.NR;
        }

        return updatedMark;
    }

    /**
     * to validate the marks before saving (locally)
     * @param {string} mark
     * @returns true/false
     */
    public isValidMark(mark: string): boolean {

        // to avoid saving the n only
        if (mark.toLocaleLowerCase() === 'n') {
            return false;
        }

        return true;
    }

    /**
     * To check whether the functional keys (F1-F12) and tab key pressed or not.
     * @param keyCode
     */
    public isFunctionalKeys(keyCode: number): boolean {
        // F1=112 and F12=123
        if (keyCode >= 112 && keyCode <= 123 || keyCode === 9) {
            return true;
        }
        return false;
    }

    /**
     * Checking whether to show reset confirmation.
     * @param {string} mark
     * @returns
     */
    public checkIfResetConfirmation(mark: string): boolean {
        if (((mark === '-'))
            && (annotationHelper.hasUserAddedAnnotationExistsForTheCurrentMarkScheme())) {

            return true;
        }
        return false;
    }

    /**
     * Checking whether to show reset confirmation while clicking
     * delete or BackSpace key.
     * @param {string} mark
     * @returns
     */
    public checkIfResetConfirmationDeleting(mark: string): boolean {
        if (mark.trim() === '') {
            return true;
        }
        return false;
    }

    /**
     * Checking whether the reset is enabled.
     * @param {string} mark
     * @returns
     */
    public isResetEnabled(mark: string): boolean {
        if (((mark && mark.trim() !== '') && (mark !== '-'))
            || (annotationHelper.hasUserAddedAnnotationExistsForTheCurrentMarkScheme() ||
                enhancedoffpagecommenthelper.hasEnhancedOffPageComments())) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if all pages are annotated
     * @returns All pages annotated or not
     */
    public static isAllPageAnnotated(): boolean {
        let isAllPageAnnotated: boolean = false;
        MarkingHelper._hasUnAnnotatedSlao = false;

        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
        let markSchemeGroupId: number = 0;
        if (!responseStore.instance.isWholeResponse) {
            markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
        }
        let isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';

        let isAllSLAOAnnotatedCC: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';
        let responseData = markerOperationModeFactory.operationMode.openedResponseDetails
            (responseStore.instance.selectedDisplayId.toString());
        let isStructured: boolean = responseStore.instance.markingMethod === enums.MarkingMethod.Structured;
        let isUnStructured: boolean = responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured;
        if (responseData && responseData.candidateScriptId) {
            let scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(responseData.candidateScriptId);
            let annotationDetails: any;

            scriptDetails = Immutable.List<ScriptImage>(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
            if (scriptDetails) {
                scriptDetails.forEach((scriptImage: ScriptImage) => {
                    if (scriptImage && !scriptImage.isSuppressed) {
                        if (isAllPagesAnnotatedCC && isUnStructured) {
                            annotationDetails = annotationHelper.getCurrentAnnotationsByPageNo(0, 0, 0, scriptImage.pageNumber);
                            isAllPageAnnotated = annotationDetails.count() > 0 ? true : false;
                            if (!isAllPageAnnotated) {
                                return isAllPageAnnotated;
                            }
                        } else if (isAllSLAOAnnotatedCC
                            && scriptImage.isAdditionalObject
                            && isStructured) {
                            annotationDetails = annotationHelper.getCurrentAnnotationsByPageNo(0, 0, 0, scriptImage.pageNumber);
                            isAllPageAnnotated = annotationDetails.count() > 0 ? true : false;
                            if (!isAllPageAnnotated) {
                                MarkingHelper._hasUnAnnotatedSlao = true;
                                return isAllPageAnnotated;
                            }
                        } else if (isAllSLAOAnnotatedCC && !scriptImage.isAdditionalObject) {
                            isAllPageAnnotated = true;
                        }
                    }
                });
            }
        }
        return isAllPageAnnotated;
    }

    /** Check the  response view mode is full responseview or not.
     *  if it is, then take the latest current marking progress from treeviewhelper for showing the ResponseNavigateFailureReason.
     *  @returns currentmarkingProgess.
     */
    public static getCurrentMarkingProgress(): number {
        let currentMarkingProgress: number;
        if (responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
            this.treeViewHelper = new treeViewDataHelper();
            let treeItem = this.treeViewHelper.treeViewItem();
            currentMarkingProgress = treeItem.markingProgress;
        } else {
            currentMarkingProgress = markingStore.instance.currentResponseMarkingProgress;
        }
        return currentMarkingProgress;
    }

    /** Check whether the user can navigate away from the marking screen.
     *   Currently only a unmarked response in grace period prevents this.
     */
    public static canNavigateAwayFromCurrentResponse(currentMarkingProgress?: number): Array<enums.ResponseNavigateFailureReason> {
        if (currentMarkingProgress === undefined) {
            currentMarkingProgress = this.getCurrentMarkingProgress();
        }

        /* Save the modified acetate collection on navigate to inbx, wrklst, home from open/ pending / closed worklist.
           Before saving acetate list, resetting shared overlay changes done by team member other than PE.
           That is shared overlay changes done by team member other than PE should not the saved in the database.
           After resetting the changes, invoke acetate save operation to save modified acetate list in the database.*/
        MarkingHelper.resetSharedAcetatesList();
        let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> = new Array<enums.ResponseNavigateFailureReason>();
        if (responseStore.instance.selectedMarkGroupId && !worklistStore.instance.isMarkingCheckMode) {
            let allPagesNotAnnotated: boolean = false;
            if ((markingStore.instance.currentResponseMode === enums.ResponseMode.pending &&
                currentMarkingProgress < 100)) {
                responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse);
            }

            // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
            // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
            let markSchemeGroupId: number = 0;
            if (!responseStore.instance.isWholeResponse) {
                markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
            }

            let forceAnnotationOnEachPageCCOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue
                (configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';
            let slaoForcedAnnotationCCOn = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';

            markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

            let supervisorRemarkCCOn = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true';
            let isStructuredResponse = responseStore.instance.markingMethod === enums.MarkingMethod.Structured;

            if ((forceAnnotationOnEachPageCCOn || slaoForcedAnnotationCCOn)
                && ((!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                    !markerOperationModeFactory.operationMode.isStandardisationSetupMode)
                    || (markerOperationModeFactory.operationMode.isStandardisationSetupMode
                    && markerOperationModeFactory.operationMode.isResponseEditable))) {
                if (markingStore.instance.currentResponseMode === enums.ResponseMode.open
                    && currentMarkingProgress === 100
                    && !this.isAllPageAnnotated()
                ) {
                    let failureReason: enums.ResponseNavigateFailureReason =
                        isStructuredResponse && slaoForcedAnnotationCCOn ?
                            enums.ResponseNavigateFailureReason.AllSlaosNotAnnotated :
                            enums.ResponseNavigateFailureReason.AllPagesNotAnnotated;
                    responseNavigationFailureReasons.push(failureReason);
                    allPagesNotAnnotated = true;
                }
                if (markingStore.instance.currentResponseMode === enums.ResponseMode.pending &&
                    currentMarkingProgress === 100 && !this.isAllPageAnnotated()) {
                    let failureReason: enums.ResponseNavigateFailureReason =
                        isStructuredResponse ? enums.ResponseNavigateFailureReason.AllSlaosNotAnnotatedInGrace :
                            enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace;
                    responseNavigationFailureReasons.push(failureReason);
                    allPagesNotAnnotated = true;
                }
            }
            if (markingStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId)) {
                if (worklistStore.instance.isMarkChangeReasonVisible(
                    markingStore.instance.currentMarkGroupId,
                    markingStore.instance.currentResponseMode)) {

                    if (markerOperationModeFactory.operationMode.isMarkChangeReasonNeeded(currentMarkingProgress)) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded);
                    }
                }
            }
            if ((markingStore.instance.currentResponseMode === enums.ResponseMode.open
                || markingStore.instance.currentResponseMode === enums.ResponseMode.pending)
                && ((!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                    !markerOperationModeFactory.operationMode.isStandardisationSetupMode)
                    || (markerOperationModeFactory.operationMode.isStandardisationSetupMode
                    && markerOperationModeFactory.operationMode.isResponseEditable))
                && currentMarkingProgress === 100) {
                let warningNR = this.getNRPopupWarningsDetails();
                if (warningNR.allMarkedAsNR) {
                    responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AllMarkedAsNR);
                } else {
                    if (warningNR.atleastOneNRWithoutOptionality) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AtleastOneNRWithoutOptionality);
                    }
                    if (warningNR.atleastOneNRWithOptionalityUsedInTotal) {
                        responseNavigationFailureReasons.push(enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityUsedInTotal);
                    }
                    if (warningNR.atleastOneNRWithOptionalityNotUsedInTotal) {
                        responseNavigationFailureReasons.push
                            (enums.ResponseNavigateFailureReason.AtleastOneNRWithOptionalityNotUsedInTotal);
                    }
                }

                let responsedetails: ResponseBase = markerOperationModeFactory.operationMode.openedResponseDetails(
                    responseStore.instance.selectedDisplayId.toString());
                if (eCourseworkHelper.isECourseworkComponent && responsedetails) {
                    let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ? responsedetails.esMarkGroupId :
                        responsedetails.markGroupId;
                    if (!eCourseWorkFileStore.instance.checkIfAllFilesViewed(markGroupId)) {
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
    }

    /**
     * get the value of DisplayNRMarkAndRubricInfringementWarnings cc.
     */
    private static getDisplayNRMarkAndRubricInfringementWarningsCC(markSchemeGroupId: number) {
        let warningNRCCFlagsValues: warningNRCC = new warningNRCC();
        // get the value corresponding to the given cc.
        let ccValue = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.DisplayNRMarkAndRubricInfringementWarnings, markSchemeGroupId);
        if (ccValue && ccValue !== '') {
            // Avoid warnings in console incase of cc is empty
            let xmlHelperObj = new xmlHelper(ccValue);
            for (var i = 0; i < xmlHelperObj.getAllChildNodes().length; i++) {
                if (xmlHelperObj.getAllChildNodes()[i].firstChild !== null) {
                    if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagInsufficientQuestionsMarked') {
                        warningNRCCFlagsValues.flagInsufficientQuestionsMarked =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    } else if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagExcessQuestionsMarked') {
                        warningNRCCFlagsValues.flagExcessQuestionsMarked =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    } else if (xmlHelperObj.getAllChildNodes()[i].firstChild.parentNode.nodeName === 'FlagNonOptionalQuestionsMarkedNR') {
                        warningNRCCFlagsValues.flagNonOptionalQuestionsMarkedNR =
                            xmlHelperObj.getAllChildNodes()[i].firstChild.nodeValue.toLowerCase();
                    }
                }
            }
        }
        return warningNRCCFlagsValues;
    }

    /**
     * get the NR warning deatils from the store.
     */
    private static getNRPopupWarningsDetails() {
        // store will be undefined when a open a response ,
        // then take the information from treeviewhelper, and check warning details related NR.
        if (markingStore.instance.warningNR === undefined) {
            this.treeViewHelper = new treeViewDataHelper();
            let node = this.treeViewHelper.treeViewItem();
            return this.getWarningNRDetails(node);
            // otherwise take from store when any mark changes happend.
        } else {
            return markingStore.instance.warningNR;
        }

    }

    /**
     * return  list of warnings based on the question item which is marked as NR and i's related cc values  and optionality.
     */
    public static getWarningNRDetails(nodes: treeViewItem) {
        let hasOptionality: boolean = false;
        let nrWarnings: warningNR = new warningNR();
        let nodeDetails = nodes.treeViewItemList;
        // get the  each  flag values when DisplayNRMarkAndRubricInfringementWarnings CC is turned ON.
        let warningNRCCFlagsValues = this.getDisplayNRMarkAndRubricInfringementWarningsCC(nodes.markSchemeGroupId);
        // finding optionalality is exist for the current question item.
        if (nodes.hasSimpleOptionality === true) {
            hasOptionality = true;
        }
        // if the response is fully marked as NR ,then no need to check other warning condition of NR.
        if (nodes.isAllNR === true && nodes.markingProgress === 100) {
            nrWarnings.allMarkedAsNR = true;
        } else {
            // If the response is marked with one or more question item ,
            //  then traverse the reeview iten for finding the NR warning condition based on cc and optionality.
            nrWarnings = this.treeTraversalForNRWarnings(nodes, hasOptionality, nrWarnings, warningNRCCFlagsValues);

        }
        return nrWarnings;
    }

    /**
     * return  list of warnings based on the question item which is marked as NR and i's related cc values  and optionality.
     */
    private static treeTraversalForNRWarnings(nodes: treeViewItem, hasOptionality: boolean,
        nrWarnings: warningNR, warningNRCCFlagsValues: warningNRCC) {
        let nodeDetails = nodes.treeViewItemList;
        let hasSimpleOptionality = hasOptionality;
        let nrWarningsDetails: warningNR = nrWarnings;
        let warningNRCCValues: warningNRCC = warningNRCCFlagsValues;

        // Iterating the treeview for getting the NR warning mesaages realted some conditions
        nodeDetails.forEach((node: treeViewItem) => {
            // if the response has no optionlality then check the below condition.
            if (!hasSimpleOptionality) {
                // marked response without optionality where one or more question items are marked as NR
                if (node.itemType === enums.TreeViewItemType.marksScheme &&
                    node.allocatedMarks.displayMark === constants.NOT_ATTEMPTED
                    && warningNRCCValues.flagNonOptionalQuestionsMarkedNR === 'true') {
                    nrWarningsDetails.atleastOneNRWithoutOptionality = true;
                }
                // if the response has optionality ,then do below conditions.
            } else {
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
                this.treeTraversalForNRWarnings(node, hasSimpleOptionality, nrWarningsDetails, warningNRCCValues);
            }
        });
        return nrWarningsDetails;
    }

    /**
     * return whether the image cluster id of current question item is same as previous or not
     */
    public static isImageClusterChanged(): boolean {
        return markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemInfo.imageClusterId !== markingStore.instance.previousQuestionItemImageClusterId
            : false;
    }

    /**
     * return true if  same linked pages exist for the current and previous question item.
     */
    public static hasDifferentLinkedPages(): boolean {

        //keep current and previous markscheme id for identifying uniquely.
        let currentMarkSchemeId = markingStore.instance.currentMarkSchemeId;
        let previousMarkSchemeId = markingStore.instance.previousMarkSchemeId;

        // keep linkannotation details of current and previous question item.
        let linkedAnnotationAgainstCurrentMarkscheme: Array<annotation>;
        let linkedAnnotationAgainstPreviousMarkscheme: Array<annotation>;

        //keep the all pagenumber deatils of current and previous markscheme where link annotation applied.
        let pageNumerOfcurrentQuestionItem: Array<Number>;
        let pageNumerOfPreviousQuestionItem: Array<Number>;

        let doCheckPreviousMarkerAnnotation = pageLinkHelper.doShowPreviousMarkerLinkedPages;
        linkedAnnotationAgainstCurrentMarkscheme = pageLinkHelper.getLinkedAnnotationAgainstQuestionItem(
            currentMarkSchemeId, doCheckPreviousMarkerAnnotation);
        linkedAnnotationAgainstPreviousMarkscheme = pageLinkHelper.getLinkedAnnotationAgainstQuestionItem(
            previousMarkSchemeId, doCheckPreviousMarkerAnnotation);
        this.treeViewHelper = new treeViewDataHelper();
        let nodeDetails = this.treeViewHelper.treeViewItem();

        if (linkedAnnotationAgainstCurrentMarkscheme !== null && linkedAnnotationAgainstPreviousMarkscheme != null) {
            // if link annoation is not applied anymore (current and previous question item) ,then return false.
            if (linkedAnnotationAgainstCurrentMarkscheme.length === 0 && linkedAnnotationAgainstPreviousMarkscheme.length === 0) {
                return false;
            } else if (linkedAnnotationAgainstCurrentMarkscheme.length === 0 || linkedAnnotationAgainstPreviousMarkscheme.length === 0) {
                this.nodetoReturnFromCurrentMarkschemeId = this.getMarkschemeParentNodeDetails(nodeDetails, currentMarkSchemeId, true);

                // check the current markscheme is the type of multiple markscheme then consider the image cluster id.
                if (this.nodetoReturnFromCurrentMarkschemeId.itemType === enums.TreeViewItemType.answerItem) {
                    this.nodetoReturnFromPreviousMarkschemeId =
                        this.getMarkschemeParentNodeDetails(nodeDetails, previousMarkSchemeId, true);
                }
                if (this.nodetoReturnFromCurrentMarkschemeId === this.nodetoReturnFromPreviousMarkschemeId) {
                    return this.isImageClusterChanged();
                } else {
                    return true;
                }
            } else {

                // holding the collection of page number for the current and multiple markscheme.
                pageNumerOfcurrentQuestionItem = new Array<number>();
                pageNumerOfPreviousQuestionItem = new Array<number>();
                linkedAnnotationAgainstCurrentMarkscheme.forEach((annotation: annotation) => {
                    pageNumerOfcurrentQuestionItem.push(annotation.pageNo);
                });

                linkedAnnotationAgainstPreviousMarkscheme.forEach((annotation: annotation) => {
                    pageNumerOfPreviousQuestionItem.push(annotation.pageNo);
                });

                return pageNumerOfcurrentQuestionItem.toString() !== pageNumerOfPreviousQuestionItem.toString();

            }
        }
        return false;
    }

    /**
     * return parent node details of the current and previous markscheme for identifying the item type.
     * @param nodes
     * @param markSchemeId
     * @param clear
     * @returns
     */
    public static getMarkschemeParentNodeDetails(nodes: treeViewItem, markSchemeId: number, clear: boolean = false) {
        if (clear) {
            this.nodetoReturn = null;
        }
        let nodeDetails = nodes.treeViewItemList;
        nodeDetails.some((node: treeViewItem) => {
            if (node.uniqueId === markSchemeId && node.itemType === enums.TreeViewItemType.marksScheme) {
                this.nodetoReturn = nodes;
                return true;
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0
                && (this.nodetoReturn === undefined || this.nodetoReturn === null)) {
                this.getMarkschemeParentNodeDetails(node, markSchemeId);
            }
        });

        return this.nodetoReturn;
    }

    /**
     * return markschemes with same image cluster id
     * @param nodes
     * @param imageClusterId
     * @param clear
     */
    public static getMarkSchemesWithSameImageClusterId(nodes: treeViewItem, imageClusterId: number, clear: boolean = false) {
        if (clear) {
            MarkingHelper.markSchemesWithSameImageClusterId = Immutable.List<treeViewItem>();
        }
        let nodeDetails = nodes.treeViewItemList;
        nodeDetails.map((node: treeViewItem) => {
            if (node.imageClusterId === imageClusterId && node.itemType === enums.TreeViewItemType.marksScheme) {
                MarkingHelper.markSchemesWithSameImageClusterId = MarkingHelper.markSchemesWithSameImageClusterId
                    .set(MarkingHelper.markSchemesWithSameImageClusterId.count() + 1, node);
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                MarkingHelper.getMarkSchemesWithSameImageClusterId(node, imageClusterId);
            }
        });

        return MarkingHelper.markSchemesWithSameImageClusterId.filter(item => item !== undefined);
    }


    /*
     * Gets whether response has un annotated additional objects
     */
    public static get hasUnAnnotatedSlao(): boolean {
        return this._hasUnAnnotatedSlao;
    }

    /**
     * Gets all aditional objects of current response
     */
    public static getAdditionalObjects() {
        let responseData = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
        let additionalScriptImages: ScriptImage[] = [];
        if (responseData && responseData.candidateScriptId) {

            // get the additional script images which are not supressed
            let scriptDetails = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript
                (responseData.candidateScriptId)).forEach((scriptImage: ScriptImage) => {
                    if (scriptImage && scriptImage.isAdditionalObject && !scriptImage.isSuppressed) {
                        additionalScriptImages.push(scriptImage);
                    }
                });
        }

        return additionalScriptImages;
    }

    /**
     * Link Manually Annotated SLAOs
     */
    public static addLinksToAnnotatedSLAOs = function (displayId: string,
        isPreviousMarks: boolean = true, defaultAnnotation?: annotation[], previousMarkIndex?: number) {
        let additionalScriptImages = MarkingHelper.getAdditionalObjects();
        if (isPreviousMarks) {

            pageLinkHelper.addLinksToAnnotatedSLAO(defaultAnnotation, additionalScriptImages, isPreviousMarks, previousMarkIndex);
        } else {
            let currentAnnotations: annotation[] = annotationHelper.getCurrentMarkGroupAnnotation();

            pageLinkHelper.addLinksToAnnotatedSLAO(currentAnnotations, additionalScriptImages, isPreviousMarks);
        }
    };


    /**
     * To check the response data should be saved automatically
     */
    public static isAutoSaveMarksAndAnnotation(): boolean {

        // Avoid ForceAnnotationOnEachPage CC while opening single response in multiQig
        // Apply ForceAnnotationOnEachPage CC for all QIGs in the whole response when it turned on for at least one QIG
        let markSchemeGroupId: number = 0;
        if (!responseStore.instance.isWholeResponse) {
            markSchemeGroupId = qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;
        }

        let forceAnnotationOnEachPageCCOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue
            (configurableCharacteristicsNames.ForceAnnotationOnEachPage, markSchemeGroupId).toLowerCase() === 'true';
        let isAllSLAOAnnotatedCCOn = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SLAOForcedAnnotations, markSchemeGroupId).toLowerCase() === 'true';

        markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

        let isSupervisorDecisionCCOn = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true';

        let isClosedResponse: boolean = worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
        let isPendingResponse: boolean = worklistStore.instance.getResponseMode === enums.ResponseMode.pending;
        let isSupervisorRemark: boolean = worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark;
        let markingProgress: number = markingStore.instance.currentResponseMarkingProgress;

        return !(isClosedResponse
            || (isPendingResponse &&
                (markingProgress !== 100
                    || (!this.isAllPageAnnotated()
                        && (forceAnnotationOnEachPageCCOn || isAllSLAOAnnotatedCCOn))
                    || (isSupervisorDecisionCCOn && isSupervisorRemark
                        && markingStore.instance.convertSupervisorRemarkDecisionType() === enums.SupervisorRemarkDecisionType.none))
            )
        );
    }

    /**
     * Method to reset the shared acetate list.
     */
    public static resetSharedAcetatesList() {
        if (qigStore) {
            if (qigStore.instance.getSaveProgressAcetataeList().size === 0) {
                acetatesActionCreator.resetSharedAcetate();
            }
        }
    }

    /**
     * Returns whether the question tag id of current question item is same as previous or not.
     * This is used to check whether the image zones are same for the question items.
     */
    public static hasQuestionTagIdChanged(): boolean {
        return markingStore.instance.currentQuestionItemInfo ?
            markingStore.instance.currentQuestionItemQuestionTagId !== markingStore.instance.previousQuestionItemQuestionTagId
            : false;
    }

    /**
     * return markschemes with same question tag id.
     * @param nodes
     * @param questionTagId
     * @param clear
     */
    public static getMarkSchemesWithSameQuestionTagId(nodes: treeViewItem, questionTagId: number, clear: boolean = false) {
        if (clear) {
            MarkingHelper.markSchemesWithSameQuestionTagId = Immutable.List<treeViewItem>();
        }
        let nodeDetails = nodes.treeViewItemList;
        nodeDetails.map((node: treeViewItem) => {
            if (node.questionTagId === questionTagId && node.itemType === enums.TreeViewItemType.marksScheme) {
                MarkingHelper.markSchemesWithSameQuestionTagId = MarkingHelper.markSchemesWithSameQuestionTagId
                    .set(MarkingHelper.markSchemesWithSameQuestionTagId.count() + 1, node);
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0) {
                MarkingHelper.getMarkSchemesWithSameQuestionTagId(node, questionTagId);
            }
        });

        return MarkingHelper.markSchemesWithSameQuestionTagId.filter(item => item !== undefined);
    }
}
export = MarkingHelper;
import dispatcher = require('../../app/dispatcher');
import resetMarkInfoLoadstatusAction = require('./resetmarkinfoloadstatusaction');
import Promise = require('es6-promise');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import updateCurrentQuestionItemAction = require('./updatecurrentquestionitemaction');
import currentQuestionItemInfo = require('./currentquestioniteminfo');
import saveMarkAction = require('./savemarkaction');
import saveAndNavigateAction = require('./saveandnavigateaction');
import enums = require('../../components/utility/enums');
import markUpdatedAction = require('./updatemarkaction');
import updateMarkingProgressAction = require('./updatemarkingprogressaction');
import removeAnnotationAction = require('./removeannotationaction');
import drawAnnotationAction = require('./drawannotationaction');
import annotation = require('../../stores/response/typings/annotation');
import markChangeDetails = require('./markchangedetails');
import addAnnotationAction = require('./addannotationaction');
import panEndAction = require('./panendaction');
import updateAnnotationPositionAction = require('./updateannotationpositionaction');
import updateAnnotationColorAction = require('./updateannotationcoloraction');
import navigateAfterMarkConfirmationAction = require('./navigateaftermarkconfirmationaction');
import markEditedAction = require('./markeditedaction');
import resetMarksAnnotationAction = require('./resetmarksandannotationaction');
import setmarkentryselection = require('./setmarkentryselectionaction');
import notifyMarkChangedAction = require('./notifymarkchangedaction');
import contextMenuAction = require('./contextmenuaction');
import showGracePeriodMessageAction = require('./showgraceperiodmessageaction');
import showAllPageNotAnnotatedMessageAction = require('./showallpagenotannotatedmessageaction');
import updateMarkAsNRForUnmarkedItemAction = require('./updatemarkasnrforunmarkeditemaction');
import updateMarksAndAnnotationsVisibilityAction = require('./updatemarksandannotationvisibilityaction');
import marksAndAnnotationsVisibilityInfo = require('../../components/utility/annotation/marksandannotationsvisibilityinfo');
import updateSeenAnnotationAction = require('./updateseenannotationaction');
import markChangeReasonUpdateAction = require('./markchangereasonupdateaction');
import showMarkChangeReasonNeededMessageAction = require('./showmarkchangereasonneededmessageaction');
import setMarkChangeReasonVisibilityAction = require('./setmarkchangereasonvisibilityaction');
import openMarkChangeReasonAction = require('./openmarkchangereasonaction');
import processSaveAndNavigationAction = require('./processsaveandnavigationaction');
import updatePanelWidthAction = require('./updatepanelwidthaction');
import dynamicAnnotationMoveAction = require('./dynamicAnnotationMoveAction');
import markSchemeScrollAction = require('./markschemescrollaction');
import markThisPageNumberAction = require('./setmarkthispagenumberaction');
import nonNumericInfoAction = require('./nonnumericinfoaction');
import setSelectedQuestionItemAction = require('./setselectedquestionitemaction');
import updateNavigationAction = require('./updatenavigationaction');
import isLastNodeSelectedAction = require('./islastnodeselectedaction');
import showReturnToWorklistConfirmationAction = require('./showreturntoworklistconfirmationaction');
import markbyannotationvalidmarkaction = require('./markbyannotationvalidmarkaction');
import addMarkByAnnotationAction = require('./addmarkbyannotationaction');
import setCurrentNavigationAction = require('./setcurrentnavigationaction');
import removeMarksByAnnotationAction = require('./removemarksbyannotationaction');
import setMarkingInProgressAction = require('./setmarkinginprogressaction');
import combinedWarningMessage = require('../../components/response/typings/combinedwarningmessage');
import showResponseNavigationFailureReasonsAction = require('./showresponsenavigationfailurereasonsaction');
import supervisorRemarkDecisionChangeAction = require('./supervisorremarkdecisionchangeaction');
import openSupervisorRemarkDecisionAction = require('./opensupervisorremarkdecisionaction');
import warningNR = require('../../components/response/typings/warningnr');
import previousMarksAndAnnotationsCopiedAction = require('./previousmarksandannotationscopiedaction');
import showSimulationResponseSubmitConfirmationPopupAction = require('./showsimulationresponsesubmitconfirmationpopupaction');
import enhancedOffPageComment = require('../../stores/response/typings/enhancedoffpagecomment');
import removeMarkEntrySelectionAction = require('./removemarkentryselectionaction');
import updatePanelHeightAction = require('./updatepanelheightaction');
import updateOffPageCommentHeightAction = require('../offpagecomments/updateoffpagecommentheightaction');
import updateEnhancedOffpageCommentDataAction = require('./enhancedoffpagecommentdataupdateaction');
import updateAnnotationSelectionAction = require('./updateannotationselectionaction');
import panCancelAction = require('./pancancelaction');
import contextMenuData = require('../../components/utility/contextmenu/contextmenudata');
import updateMarkingDetailsAction = require('./updatemarkingdetailsaction');
import stayInResponseAction = require('./stayinresponseaction');
import copyMarksForDefinitiveAction = require('./copymarksfordefinitiveaction');
import showMarkConfirmationPopupOnEnterAction = require('./showmarkconfirmationpopuponenteraction');
import updateDefinitiveMarksForDifferentMarkerAction = require('./updatedefinitivemarksfordifferentmarkeraction');
import deleteProvisionalMarksAction = require('./deleteprovisionalmarksaction');

class MarkingActionCreator {
    /**
     * Reset Mark Info Load Status
     * @param isMarkSchemeReset
     */
    public resetMarkInfoLoadStatus(isMarkSchemeReset: boolean): Promise<any> {

        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetMarkInfoLoadstatusAction(isMarkSchemeReset));
        }).catch();

    }
    /**
     * Update store on question item selection change
     * @param selectedNodeInfo
     * @param isQuestionItemChanged [to handle reset]
     */
    public changeSelectedQuestionItem(selectedNodeInfo: currentQuestionItemInfo,
        isAwardingMode: boolean,
        isQuestionItemChanged: boolean = true,
        forceRender: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateCurrentQuestionItemAction(true,
                selectedNodeInfo,
                isQuestionItemChanged,
                forceRender,
                isAwardingMode));
        }).catch();
    }

    /**
     * Save mark to the marksandannotation collection
     * @param markDetails
     * @param isMarkUpdatedWithoutNavigation - flag is to indicate mark updated but no navigation required,
     * need to rerender mark button.
     * @param isNextResponse - flag is to indicate next response should be opened after save
     * @param isUpdateUsedInTotalOnly - flag is to indicate whether it is a usedintotal update only.
     */
    public saveMark(markDetails: markChangeDetails, isMarkUpdatedWithoutNavigation: boolean,
        isNextResponse: boolean, isUpdateUsedInTotalOnly: boolean = false, isUpdateMarkingProgress: boolean = true) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new saveMarkAction(markDetails, isMarkUpdatedWithoutNavigation,
                isNextResponse, isUpdateUsedInTotalOnly, isUpdateMarkingProgress));
        }).catch();

    }

    /**
     * Trigger save when navigating away from a response
     * @param navigatingTo Navigating from response to different view
     */
    public saveAndNavigate(navigatingTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none,
        navigationFrom?: enums.ResponseNavigation,
        doRequirePopup?: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new saveAndNavigateAction(navigatingTo, navigationFrom, doRequirePopup));
        }).catch();
    }

    /**
     * update navigateTo property in marking store
     * @param navigatingTo
     * @param doEmit
     */
    public updateNavigation(navigatingTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none, doEmit: boolean = true) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateNavigationAction(navigatingTo, doEmit));
        }).catch();
    }

    /**
     * update store with new mark for the current item
     * @param {number} mark
     */
    public markUpdated(allocatedMark: AllocatedMark) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markUpdatedAction(allocatedMark, true));
        }).catch();
    }

    /**
     * update store initial marking progress
     * @param {number} markingProgress
     */
    public updateInitialMarkingProgress(markingProgress: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMarkingProgressAction(markingProgress, true));
        }).catch();
    }

    /**
     * Remove currently selected/bulk annotation reset from the marking screen
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    public removeAnnotation(removeAnnotationList: Array<string>,
        isMarkByAnnotation: boolean = false,
        isPanAvoidImageContainerRender: boolean = false,
        contextMenuType: enums.ContextMenuType = enums.ContextMenuType.annotation,
        isLinkAnnotation: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeAnnotationAction(removeAnnotationList, isPanAvoidImageContainerRender,
                contextMenuType, isLinkAnnotation, isMarkByAnnotation));
        }).catch();
    }

    /**
     * Update annotation drawing mode
     * @param drawStart
     */
    public onAnnotationDraw(drawStart: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new drawAnnotationAction(drawStart));
        }).catch();
    }

    /**
     * Add newly added annotation to the collection
     */
    public addNewlyAddedAnnotation(addedAnnotation: annotation, action?: enums.AddAnnotationAction,
        annotationOverlayId?: string, previousMarkIndex?: number, isStitched: boolean = false, avoidEventEmition: boolean = false,
        pageLinkedByPreviousMarker: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addAnnotationAction(addedAnnotation, action, annotationOverlayId, previousMarkIndex,
                isStitched, avoidEventEmition, pageLinkedByPreviousMarker));
        }).catch();
    }

    /**
     * Action creator to reset marks and annotation
     * @param {boolean} resetMarks
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    public resetMarksAndAnnotation(resetMarks: boolean, resetAnnotation: boolean, previousMark?: AllocatedMark): void {

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetMarksAnnotationAction(resetMarks, resetAnnotation, previousMark));
        }).catch();
    }

    /**
     * This action will be triggered when drag/touch is ended by the user
     * @param xPos
     * @param yPos
     * @param elementId
     * @param panSource
     * @param isAnnotationOverlapped
     * @param isAnnotationPlacedInGreyArea
     */
    public panEndAction(stampId: number,
        xPos: number,
        yPos: number,
        elementId: string,
        panSource: enums.PanSource,
        isAnnotationOverlapped: boolean,
        isAnnotationPlacedInGreyArea: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new panEndAction(stampId,
                xPos,
                yPos,
                elementId,
                panSource,
                isAnnotationOverlapped,
                isAnnotationPlacedInGreyArea)
            );
        }).catch();
    }

    /**
     * Update annotation action method
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param currentAnnotationClientToken
     * @param markingOperation
     * @param width
     * @param height
     * @param comment
     * @param isPositionUpdated
     * @param isDrawEndOfStampFromStampPanel
     * @param stampId
     */
    public updateAnnotation(leftEdge: number,
        topEdge: number,
        imageClusterId: number,
        outputPageNo: number,
        pageNo: number,
        currentAnnotationClientToken: string,
        width: number,
        height: number,
        comment: string = '',
        isPositionUpdated: boolean = true,
        isDrawEndOfStampFromStampPanel: boolean = false,
        avoidEventEmit: boolean = false,
        stampId?: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateAnnotationPositionAction(leftEdge,
                topEdge,
                imageClusterId,
                outputPageNo,
                pageNo,
                currentAnnotationClientToken, width, height, comment, isPositionUpdated,
                isDrawEndOfStampFromStampPanel, avoidEventEmit, stampId));
        }).catch();
    }

    /**
     * Update annotation color action method
     * @param currentAnnotation
     */
    public updateAnnotationColor(currentAnnotation: annotation) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateAnnotationColorAction(currentAnnotation));
        }).catch();
    }

    /**
     * trigger navigation after confirmation hide
     */
    public navigationAfterMarkConfirmation(navigateFrom?: enums.ResponseNavigation, navigateTo?: enums.SaveAndNavigate) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new navigateAfterMarkConfirmationAction(navigateFrom, navigateTo));
        }).catch();
    }

    /**
     * update the mark has been edited.
     */
    public markEdited(isMarkEdited: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markEditedAction(isMarkEdited));
        }).catch();
    }

    /**
     * Set the mark entry selected forcefully if it doesnt have the focus.
     */
    public setMarkEntrySelected(commentSelected: boolean = false, bookmarkSelected: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setmarkentryselection(commentSelected, bookmarkSelected));
        }).catch();
    }

    /**
     * Remove mark entry selection.
     */
    public removeMarkEntrySelection() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeMarkEntrySelectionAction());
        }).catch();
    }

    /**
     * Publish an event to let know that resetting has been finished.
     */
    public notifyMarkUpdated(markingProgress: number, warningNR: warningNR) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new notifyMarkChangedAction(markingProgress, warningNR));
        }).catch();
    }

    /**
     * Context menu action (show/hide)
     * @param isVisible
     * @param xPos
     * @param yPos
     * @param contextMenuData
     */
    public showOrHideRemoveContextMenu(isVisible: boolean,
        xPos?: number, yPos?: number, contextMenuData?: contextMenuData): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new contextMenuAction(isVisible, xPos, yPos, contextMenuData));
        }).catch();
    }

    /**
     * Update panel width
     * @param widthInPercent
     * @param className
     */
    public updatePanelWidth(widthInPercent: string, className: string, panelType: enums.ResizePanelType,
        panActionType: enums.PanActionType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.resizedPanel, widthInPercent,
                className, panelType, panActionType));
        }).catch();
    }

    /**
     * Set default panel width
     * @param width
     * @param previousMarkListWidth
     */
    public setDefaultPanelWidth(width?: string, previousMarkListWidth?: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.defaultPanel, width, '',
                enums.ResizePanelType.None, enums.PanActionType.None, previousMarkListWidth));
        }).catch();
    }

    /**
     * Update default panel width after marklist column is updated
     * @param width
     * @param isPreviousMarkListColumnVisible
     */
    public updateDefaultPanelWidth(width?: string, isPreviousMarkListColumnVisible: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.updateDefaultPanel, width,
                '', enums.ResizePanelType.None, enums.PanActionType.None, 0, isPreviousMarkListColumnVisible));
        }).catch();
    }

    /**
     * Set minimum panel width
     * @param width
     */
    public setMinimumPanelWidth(width: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.minimumWidthPanel, width));
        }).catch();
    }

    /**
     * Update Panel resizing class name
     * @param className
     */
    public updatePanelResizingClassName(className: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelWidthAction(enums.markSchemePanelType.resizingClassName, '', className));
        }).catch();
    }

    /**
     * Publish an event to let know that response in grace period is not fully marked/all pages not annotated.
     * @param failureReason
     */
    public showGracePeriodNotFullyMarkedMessage
        (failureReason: enums.ResponseNavigateFailureReason = enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showGracePeriodMessageAction(failureReason));
        }).catch();
    }

    /**
     * Publish an event to let know that all page not annotated popup has to be displayed.
     * @param navigatingTo
     */
    public showAllPageNotAnnotatedMessage(navigatingTo: enums.SaveAndNavigate) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showAllPageNotAnnotatedMessageAction(navigatingTo));
        }).catch();
    }

    /**
     * Updating marks and annotations visibility.
     * @param {number} index
     * @param {MarksAndAnnotationsVisibilityInfo} _marksAndAnnotationVisibilityDetails
     */
    public updateMarksAndAnnotationVisibility(index: number,
        _marksAndAnnotationVisibilityDetails: marksAndAnnotationsVisibilityInfo,
        isEnchancedOffpageCommentVisible: boolean,
        selectedCommentIndex?: number
    ) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMarksAndAnnotationsVisibilityAction(index,
                _marksAndAnnotationVisibilityDetails, isEnchancedOffpageCommentVisible, selectedCommentIndex));
        }).catch();
    }

    /**
     * Updating 'Flag as seen' annotation- to consider whether all pages are annotated.
     * @param isAllPagesAnnotated
     * @param treeViewItem
     */
    public updateSeenAnnotation(isAllPagesAnnotated: boolean, treeViewItem: any) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateSeenAnnotationAction(isAllPagesAnnotated, treeViewItem));
        }).catch();

    }

    /**
     * Publish an event to enter the mark as NR for umarked question item on clicking yes on completed dialog.
     */
    public updateMarkAsNRForUnmarkedItem() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMarkAsNRForUnmarkedItemAction());
        }).catch();
    }

    /**
     * Updating markChangeReason.
     * @param {markChangeReason} markChangeReason
     */
    public markChangeReasonUpdated(markChangeReason: string): Promise<any> {

        return new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markChangeReasonUpdateAction(markChangeReason));
        }).catch();

    }

    /**
     * Publish an event for showing mark change reason needed warning dialog.
     * @param {enums.ResponseNavigateFailureReason} failureReason
     * @param {enums.SaveAndNavigate} navigateTo
     */
    public showMarkeChangeReasonNeededMessage
        (failureReason: enums.ResponseNavigateFailureReason, navigateTo: enums.SaveAndNavigate) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showMarkChangeReasonNeededMessageAction(failureReason, navigateTo));
        }).catch();
    }

    /**
     * Setting mark change reason visibility in store.
     * @param {boolean} _isMarkChangeReasonVisible
     */
    public setMarkChangeReasonVisibility(_isMarkChangeReasonVisible: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setMarkChangeReasonVisibilityAction(_isMarkChangeReasonVisible));
        }).catch();
    }

    /**
     * Publish an event for showing mark change reason popup for entering value.
     */
    public openMarkChangeReasonPopUp() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new openMarkChangeReasonAction());
        }).catch();
    }

    /**
     * Publish an event for showing supervisor decision popup.
     */
    public openSupervisorRemarkDecisionPopUp() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new openSupervisorRemarkDecisionAction());
        }).catch();
    }

    /**
     * Start save and navigation after showing the save indicator
     */
    public processSaveAndNavigation() {

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new processSaveAndNavigationAction());
        });
    }

    /**
     * Publish an event while dynamic elements moving.
     */
    public dynamicAnnotationMoveAction(movingElementProperties: any) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new dynamicAnnotationMoveAction(movingElementProperties));
        }).catch();
    }

    /**
     * Publish an event to reset scroll
     */
    public markSchemeScrollReset() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markSchemeScrollAction());
        });
    }

    /**
     * Set mark this page number
     * @param {number} markThisPageNumber
     */
    public setMarkThisPageNumber(markThisPageNumber: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markThisPageNumberAction(markThisPageNumber));
        });
    }

    /**
     * Set non numeric marking info
     * @param {number} markThisPageNumber
     */
    public setNonNumericInfo(): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new nonNumericInfoAction());
        });
    }

    /**
     * set the selected question item index
     * @param index
     */
    public setSelectedQuestionItemIndex(index: number, uniqueId: number): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setSelectedQuestionItemAction(index, uniqueId));
        });
    }

    /**
     * set the selected question item index
     * @param index
     */
    public isLastNodeSelected(status: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new isLastNodeSelectedAction(status));
        });
    }

    /**
     * show the return to worklist confirmation action
     * @param index
     */
    public showReturnToWorklistConfirmation(): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showReturnToWorklistConfirmationAction());
        });
    }

    /**
     * returns the mark by annotation is valid
     */
    public validatedAndContinue(newAnnotation: annotation, action: enums.AddAnnotationAction, annotationOverlayID: string): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markbyannotationvalidmarkaction(newAnnotation, action, annotationOverlayID));
        });
    }

    /**
     * add mark by annotation action
     * @param annotation
     * @param action
     * @param id
     */
    public addMarkByAnnotationAction(annotation: annotation, action: enums.AddAnnotationAction, id: any): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addMarkByAnnotationAction(annotation, action, id));
        });
    }

    /**
     * Set the current navigation type of the response.
     * @param {enums} isNavigationThroughMarkScheme
     */
    public setNavigationThroughMarkscheme(isNavigationThroughMarkScheme: enums.ResponseNavigation) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setCurrentNavigationAction(true, isNavigationThroughMarkScheme));
        }).catch();
    }

    /**
     * remove marks by annotation action.
     * @param removedAnnotation
     */
    public removeMarksByAnnotation(removedAnnotation: annotation) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new removeMarksByAnnotationAction(removedAnnotation));
        }).catch();
    }

    /**
     * Method to set marking is in progress.
     * @param isMarkingProgress
     */
    public setMarkingInProgress(isMarkingProgress: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setMarkingInProgressAction(isMarkingProgress));
        }).catch();
    }

    /**
     * Publish an event to let know that all page not annotated popup has to be displayed.
     * @param navigatingTo
     */
    public showResponseNavigationFailureReasons(navigatingTo: enums.SaveAndNavigate, warningMessages: combinedWarningMessage,
        navigatingFrom?: enums.ResponseNavigation) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showResponseNavigationFailureReasonsAction(navigatingTo, warningMessages, navigatingFrom));
        }).catch();
    }

    /**
     * Publish an event to let know that supervisor remark decison has been changed.
     * @param navigatingTo
     */
    public supervisorRemarkDecisionChange(accuracyIndicator: enums.AccuracyIndicatorType,
        remarkDecision: enums.SupervisorRemarkDecisionType) {

        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new supervisorRemarkDecisionChangeAction(accuracyIndicator, remarkDecision));
        }).catch();
    }
    /**
     * update the mark has been edited.
     */
    public copiedPreviousMarksAndAnnotations() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new previousMarksAndAnnotationsCopiedAction());
        }).catch();
    }

    /**
     * show confirmation popup for simulation response/s on submit
     * @param markGroupId
     * @param fromMarkScheme
     */
    public showSimulationResponseSubmitConfirmationPopup(markGroupId: number = 0, fromMarkScheme: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showSimulationResponseSubmitConfirmationPopupAction(markGroupId, fromMarkScheme));
        }).catch();
    }

    /**
     * update panel height
     * @param {string} heightInPercent
     * @param {string} className
     * @memberof MarkingActionCreator
     */
    public updatePanelHeight(heightInPercent: string, className: string, offsetOverlapped: boolean,
        panActionType: enums.PanActionType, panelType: enums.ResizePanelType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelHeightAction(enums.PanelActionType.ResizedPanel,
                panActionType,
                heightInPercent,
                className,
                panelType,
                offsetOverlapped));
        }).catch();
    }

    /**
     * on panel visiblity change
     *
     * @memberof MarkingActionCreator
     */
    public reRenderImageOnVisiblityChange() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updatePanelHeightAction(enums.PanelActionType.Visiblity));
        }).catch();
    }

    /**
     * update offpage comment panel height
     * @param {number} heightInPercent
     * @memberof MarkingActionCreator
     */
    public updateOffPageCommentPanelHeight(heightInPercent: number, panActionType: enums.PanActionType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateOffPageCommentHeightAction(enums.PanelActionType.ResizedPanel,
                panActionType, heightInPercent));
        }).catch();
    }

    /**
     * Action for Enhanced offpage comment data update.
     * @param index
     */
    public updateEnhancedOffpageCommentData(index: number, markGroupId: number, style: React.CSSProperties, remarkHeaderText: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateEnhancedOffpageCommentDataAction(index, markGroupId, style, remarkHeaderText));
        }).catch();
    }

    /**
     * This method will unselect selected dynamic annotation
     *
     * @param {boolean} isSelected
     * @memberof MarkingActionCreator
     */
    public updateAnnotationSelection(isSelected: boolean) {
        new Promise.Promise((resolve: any, reject: any) => {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateAnnotationSelectionAction(isSelected));
        }).catch();
    }

    /**
     * This method will call pancancel action
     */
    public panCancelAction() {
        new Promise.Promise((resolve: any, reject: any) => {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new panCancelAction());
        }).catch();
    }

    /**
     * update Marking Details
     * @param {number} markDetails
     * @param {number} isAllPagesAnnotated
     * @param {number} markGroupId
     * @memberof MarkingActionCreator
     */
    public updateMarkingDetails(markDetails: MarkDetails, isAllPagesAnnotated: boolean, markGroupId?: number) {
        new Promise.Promise((resolve: any, reject: any) => {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMarkingDetailsAction(markDetails, isAllPagesAnnotated, markGroupId));
        }).catch();
    }

    /**
     * Action to disable mbq popup.
     */
    public stayInResponse() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stayInResponseAction());
        }).catch();
	}

	/**
	 * Action to copy marks for definitve
	 * @param copyMarks
	 * @param isDefinitive
	 */
	public copyMarksForDefinitive(copyMarks: boolean, isDefinitive: boolean, avoidEventEmit: boolean = false) {
		new Promise.Promise(function (resolve: any, reject: any) {
			resolve();
		}).then(() => {
			dispatcher.dispatch(new copyMarksForDefinitiveAction(copyMarks, isDefinitive, avoidEventEmit));
		}).catch();
    }

    /**
     * Action to show mark confirmation popup
     * on navigating between mark schemes using enter key press.
     * eventhough there is no change in marks.
     */
    public showMarkConfirmationPopupOnEnter(event: KeyboardEvent) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showMarkConfirmationPopupOnEnterAction(event));
        }).catch();
    }

	/**
	 * Action to update definitive marks for different markers
	 * @param examinerRoleId
	 * @param deleteProvisional
	 */
	public updateDefinitiveMarksForDifferentMarker(examinerRoleId: number, deleteProvisional: boolean = false) {
		new Promise.Promise(function (resolve: any, reject: any) {
			resolve();
		}).then(() => {
			dispatcher.dispatch(new updateDefinitiveMarksForDifferentMarkerAction(examinerRoleId, deleteProvisional));
		}).catch();
	}

	/**
	 * Action to delete Provisional Marks from collection when the same marker choose to clear marks
	 */
	public deleteProvisionalMarksWhenSameMarker() {
		new Promise.Promise(function (resolve: any, reject: any) {
			resolve();
		}).then(() => {
			dispatcher.dispatch(new deleteProvisionalMarksAction());
		}).catch();
	}
}

let markingActionCreator = new MarkingActionCreator();
export = markingActionCreator;
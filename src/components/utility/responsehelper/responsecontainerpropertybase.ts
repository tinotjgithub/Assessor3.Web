import React = require('react');
import enums = require('../enums');
import treeViewDataHelper = require('../../../utility/treeviewhelpers/treeviewdatahelper');
import scriptHelper = require('../../../utility/script/scripthelper');
import saveMarksAndAnnotationsNonRecoverableErrorDialogContents =
require('../savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
import combinedWarningMessage = require('../../response/typings/combinedwarningmessage');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import annotation = require('../../../stores/response/typings/annotation');
import Immutable = require('immutable');

class ResponseContainerPropertyBase {
    /* response data variable*/
    private _responseData: ResponseBase;

    public get responseData(): ResponseBase {
        return this._responseData;
    }

    public set responseData(responseData:  ResponseBase) {
        this._responseData = responseData;
    }

    private _treeViewHelper: treeViewDataHelper;

    public get treeViewHelper(): treeViewDataHelper {
        return this._treeViewHelper;
    }

    public set treeViewHelper(treeViewHelper: treeViewDataHelper) {
        this._treeViewHelper = treeViewHelper;
    }

    private _scriptHelper: scriptHelper;

    public get scriptHelper(): scriptHelper {
        return this._scriptHelper;
    }

    public set scriptHelper(scriptHelper: scriptHelper) {
        this._scriptHelper = scriptHelper;
    }

    private _imageZonesCollection: Immutable.List<ImageZone>[] = null;

    public get imageZonesCollection(): Immutable.List<ImageZone>[] {
        return this._imageZonesCollection;
    }

    public set imageZonesCollection(imageZonesCollection: Immutable.List<ImageZone>[]) {
        this._imageZonesCollection = imageZonesCollection;
    }

    private _imagesToRender: string[][];

    public get imagesToRender(): string[][] {
        return this._imagesToRender;
    }

    public set imagesToRender(imagesToRender: string[][]) {
        this._imagesToRender = imagesToRender;
    }

    private _fileMetadataList: Immutable.List<FileMetadata>;

    public get fileMetadataList(): Immutable.List<FileMetadata> {
        return this._fileMetadataList;
    }

    public set fileMetadataList(fileMetadataList: Immutable.List<FileMetadata>) {
        this._fileMetadataList = fileMetadataList;
    }

    /* confirmation dialogue content */
    private _confirmationDialogueContent: string;

    public get confirmationDialogueContent(): string {
        return this._confirmationDialogueContent;
    }

    public set confirmationDialogueContent(confirmationDialogueContent: string) {
        this._confirmationDialogueContent = confirmationDialogueContent;
    }

    /* confirmation dialogue header */
    private _confirmationDialogueHeader: string;

    public get confirmationDialogueHeader(): string {
        return this._confirmationDialogueHeader;
    }

    public set confirmationDialogueHeader(confirmationDialogueHeader: string) {
        this._confirmationDialogueHeader = confirmationDialogueHeader;
    }

    private _totalImageCount: number;

    public get totalImageCount(): number {
        return this._totalImageCount;
    }

    public set totalImageCount(totalImageCount: number) {
        this._totalImageCount = totalImageCount;
    }

    private _renderedImageCount: number;

    public get renderedImageCount(): number {
        return this._renderedImageCount;
    }

    public set renderedImageCount(renderedImageCount: number) {
        this._renderedImageCount = renderedImageCount;
    }

    private _renderedImageViewerCount: number;

    public get renderedImageViewerCount(): number {
        return this._renderedImageViewerCount;
    }

    public set renderedImageViewerCount(renderedImageViewerCount: number) {
        this._renderedImageViewerCount = renderedImageViewerCount;
    }

    private _setFracsloadedImageCount: number;
    public get setFracsloadedImageCount(): number {
        return this._setFracsloadedImageCount;
    }
    public set setFracsloadedImageCount(setFracsloadedImageCount: number) {
        this._setFracsloadedImageCount = setFracsloadedImageCount;
    }

    /* Height of the response container */
    private _responseContainerHeight: number;
    public get responseContainerHeight(): number {
        return this._responseContainerHeight;
    }
    public set responseContainerHeight(responseContainerHeight: number) {
        this._responseContainerHeight = responseContainerHeight;
    }

    /* re-render mark scheme */
    private _markSchemeRenderedOn: number;
    public get markSchemeRenderedOn(): number {
        return this._markSchemeRenderedOn;
    }
    public set markSchemeRenderedOn(markSchemeRenderedOn: number) {
        this._markSchemeRenderedOn = markSchemeRenderedOn;
    }

    // Hold minimum numeric mark
    private _minimumNumericMark: number;
    public get minimumNumericMark(): number {
        return this._minimumNumericMark;
    }
    public set minimumNumericMark(minimumNumericMark: number) {
        this._minimumNumericMark = minimumNumericMark;
    }

    // Hold maximum numeric mark
    private _maximumNumericMark: number;
    public get maximumNumericMark(): number {
        return this._maximumNumericMark;
    }
    public set maximumNumericMark(maximumNumericMark: number) {
        this._maximumNumericMark = maximumNumericMark;
    }

    // Indicate whether Non Numeric
    private _isNonNumeric: boolean = false;
    public get isNonNumeric(): boolean {
        return this._isNonNumeric;
    }
    public set isNonNumeric(isNonNumeric: boolean) {
        this._isNonNumeric = isNonNumeric;
    }

    // Re-render mark button container
    private _markButtonRenderedOn: number;
    public get markButtonRenderedOn(): number {
        return this._markButtonRenderedOn;
    }
    public set markButtonRenderedOn(markButtonRenderedOn: number) {
        this._markButtonRenderedOn = markButtonRenderedOn;
    }

    // Busy Indicator invoker for response screen
    private _busyIndicatorInvoker: enums.BusyIndicatorInvoker;
    public get busyIndicatorInvoker(): enums.BusyIndicatorInvoker {
        return this._busyIndicatorInvoker;
    }
    public set busyIndicatorInvoker(busyIndicatorInvoker: enums.BusyIndicatorInvoker) {
        this._busyIndicatorInvoker = busyIndicatorInvoker;
    }

    // Indicates whether to show background screen beneath the busy indicator
    private _showBackgroundScreenOnBusy: boolean;
    public get showBackgroundScreenOnBusy(): boolean {
        return this._showBackgroundScreenOnBusy;
    }
    public set showBackgroundScreenOnBusy(showBackgroundScreenOnBusy: boolean) {
        this._showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    }

    private _fullResponseOptionValue: enums.FullResponeViewOption;
    public get fullResponseOptionValue(): enums.FullResponeViewOption {
        return this._fullResponseOptionValue;
    }
    public set fullResponseOptionValue(fullResponseOptionValue: enums.FullResponeViewOption) {
        this._fullResponseOptionValue = fullResponseOptionValue;
    }

    private _navigateTo: enums.SaveAndNavigate;
    public get navigateTo(): enums.SaveAndNavigate {
        return this._navigateTo;
    }
    public set navigateTo(navigateTo: enums.SaveAndNavigate) {
        this._navigateTo = navigateTo;
    }

    // This variable became true after displaying non-recoverable error popup
    // We've introduced this variable for hiding non-recoverable error popup while navigating between mark schemes.
    private _hasNonRecoverableErrorPopupShown: boolean;
    public get hasNonRecoverableErrorPopupShown(): boolean {
        return this._hasNonRecoverableErrorPopupShown;
    }
    public set hasNonRecoverableErrorPopupShown(hasNonRecoverableErrorPopupShown: boolean) {
        this._hasNonRecoverableErrorPopupShown = hasNonRecoverableErrorPopupShown;
    }

    // variable for save marks and annotations dialog
    private _saveMarksAndAnnotationsErrorDialogContents: saveMarksAndAnnotationsNonRecoverableErrorDialogContents;
    public get saveMarksAndAnnotationsErrorDialogContents(): saveMarksAndAnnotationsNonRecoverableErrorDialogContents {
        return this._saveMarksAndAnnotationsErrorDialogContents;
    }
    public set saveMarksAndAnnotationsErrorDialogContents
    (saveMarksAndAnnotationsErrorDialogContents: saveMarksAndAnnotationsNonRecoverableErrorDialogContents) {
        this._saveMarksAndAnnotationsErrorDialogContents = saveMarksAndAnnotationsErrorDialogContents;
    }

    // Indicate whether the reset mark and annotation is triggered from
    // Key board/ mouse /touch.
    // False from keyboard else True
    private _isResetActionByClick: boolean;
    public get isResetActionByClick(): boolean {
        return this._isResetActionByClick;
    }
    public set isResetActionByClick(isResetActionByClick: boolean) {
        this._isResetActionByClick = isResetActionByClick;
    }

    // holds the previous mark
    private _previousMark: AllocatedMark;
    public get previousMark(): AllocatedMark {
        return this._previousMark;
    }
    public set previousMark(previousMark: AllocatedMark) {
        this._previousMark = previousMark;
    }

    /** Setting the default view response view option as four page */
    // this variable will hold the scroll position of mark this page functionality.
    private _markThisPageScrollPosition: number;
    public get markThisPageScrollPosition(): number {
        return this._markThisPageScrollPosition;
    }
    public set markThisPageScrollPosition(markThisPageScrollPosition: number) {
        this._markThisPageScrollPosition = markThisPageScrollPosition;
    }

    // this variable will hold the message panel visibility status.
    private _isMessagePanelVisible: boolean;
    public get isMessagePanelVisible(): boolean {
        return this._isMessagePanelVisible;
    }
    public set isMessagePanelVisible(isMessagePanelVisible: boolean) {
        this._isMessagePanelVisible = isMessagePanelVisible;
    }

    // Holds a value indicating response size has been changed, e.g.: message box appears
    private _hasResponseLayoutChanged: boolean;
    public get hasResponseLayoutChanged(): boolean {
        return this._hasResponseLayoutChanged;
    }
    public set hasResponseLayoutChanged(hasResponseLayoutChanged: boolean) {
        this._hasResponseLayoutChanged = hasResponseLayoutChanged;
    }

    // To hold the last mark scheme id
    private _lastMarkSchemeId: number;
    public get lastMarkSchemeId(): number {
        return this._lastMarkSchemeId;
    }
    public set lastMarkSchemeId(lastMarkSchemeId: number) {
        this._lastMarkSchemeId = lastMarkSchemeId;
    }

    // To hold the status on the Only Show UnAnnotated Pages Option
    private _isOnlyShowUnAnnotatedPagesOptionSelected: boolean;
    public get isOnlyShowUnAnnotatedPagesOptionSelected(): boolean {
        return this._isOnlyShowUnAnnotatedPagesOptionSelected;
    }
    public set isOnlyShowUnAnnotatedPagesOptionSelected(isOnlyShowUnAnnotatedPagesOptionSelected: boolean) {
        this._isOnlyShowUnAnnotatedPagesOptionSelected = isOnlyShowUnAnnotatedPagesOptionSelected;
    }

    // To hold the status on the Show All Pages Of Script Option
    private _isShowAllPagesOfScriptOptionSelected: boolean;
    public get isShowAllPagesOfScriptOptionSelected(): boolean {
        return this._isShowAllPagesOfScriptOptionSelected;
    }
    public set isShowAllPagesOfScriptOptionSelected(isShowAllPagesOfScriptOptionSelected: boolean) {
        this._isShowAllPagesOfScriptOptionSelected = isShowAllPagesOfScriptOptionSelected;
    }

    // To hold the status of 'Only Show UnAnnotated Additional Pages' Option
    private _isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected: boolean;
    public get isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected(): boolean {
        return this._isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected;
    }
    public set isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected(isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected: boolean) {
        this._isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected;
    }

    private _isOnPageCommentStamped: boolean;
    public get isOnPageCommentStamped(): boolean {
        return this._isOnPageCommentStamped;
    }
    public set isOnPageCommentStamped(isOnPageCommentStamped: boolean) {
        this._isOnPageCommentStamped = isOnPageCommentStamped;
    }

    // holds autoSaveTimerInterval time for Auto Save marks and Annotation
    // default value : 5 minutes
    private _autoSaveTimerInterval: number;
    public get autoSaveTimerInterval(): number {
        return this._autoSaveTimerInterval;
    }
    public set autoSaveTimerInterval(autoSaveTimerInterval: number) {
        this._autoSaveTimerInterval = autoSaveTimerInterval;
    }

    private _isResponseEditable: boolean;
    public get isResponseEditable(): boolean {
        return this._isResponseEditable;
    }
    public set isResponseEditable(isResponseEditable: boolean) {
        this._isResponseEditable = isResponseEditable;
    }

    private _messageIdToSelect: number;
    public get messageIdToSelect(): number {
        return this._messageIdToSelect;
    }
    public set messageIdToSelect(messageIdToSelect: number) {
        this._messageIdToSelect = messageIdToSelect;
    }

    // A variable indicating whether we need to forcefully navigate to a scrollTop
    // to view a particular page
    private _scrollToTopOf: number;
    public get scrollToTopOf(): number {
        return this._scrollToTopOf;
    }
    public set scrollToTopOf(scrollToTopOf: number) {
        this._scrollToTopOf = scrollToTopOf;
    }

    // To Store the Total Unread Message Count against the examiner
    private _unReadMessageCount: number;
    public get unReadMessageCount(): number {
        return this._unReadMessageCount;
    }
    public set unReadMessageCount(unReadMessageCount: number) {
        this._unReadMessageCount = unReadMessageCount;
    }

    // this variable will hold the exception panel minimized.
    private _isExceptionPanelMinimized: boolean;
    public get isExceptionPanelMinimized(): boolean {
        return this._isExceptionPanelMinimized;
    }
    public set isExceptionPanelMinimized(isExceptionPanelMinimized: boolean) {
        this._isExceptionPanelMinimized = isExceptionPanelMinimized;
    }

    private _isNewException: boolean;
    public get isNewException(): boolean {
        return this._isNewException;
    }
    public set isNewException(isNewException: boolean) {
        this._isNewException = isNewException;
    }

    private _exceptionDetails: ExceptionDetails;
    public get exceptionDetails(): ExceptionDetails {
        return this._exceptionDetails;
    }
    public set exceptionDetails(exceptionDetails: ExceptionDetails) {
        this._exceptionDetails = exceptionDetails;
    }

    // this variable will hold the exception panel maximized.
    private _isExceptionPanelEdited: boolean;
    public get isExceptionPanelEdited(): boolean {
        return this._isExceptionPanelEdited;
    }
    public set isExceptionPanelEdited(isExceptionPanelEdited: boolean) {
        this._isExceptionPanelEdited = isExceptionPanelEdited;
    }

    // this variable will hold the exception id
    private _exceptionId: number;
    public get exceptionId(): number {
        return this._exceptionId;
    }
    public set exceptionId(exceptionId: number) {
        this._exceptionId = exceptionId;
    }

    // this variable will hold the exception id
    private _messageId: number;
    public get messageId(): number {
        return this._messageId;
    }
    public set messageId(messageId: number) {
        this._messageId = messageId;
    }

    // this variable will hold the create exception button clicked.
    private _isDeleteMessageYesClicked: boolean;
    public get isDeleteMessageYesClicked(): boolean {
        return this._isDeleteMessageYesClicked;
    }
    public set isDeleteMessageYesClicked(isDeleteMessageYesClicked: boolean) {
        this._isDeleteMessageYesClicked = isDeleteMessageYesClicked;
    }

    private _isConfirmReviewUnknownContentOKClicked: boolean;
    public get isConfirmReviewUnknownContentOKClicked(): boolean {
        return this._isConfirmReviewUnknownContentOKClicked;
    }
    public set isConfirmReviewUnknownContentOKClicked(isConfirmReviewUnknownContentOKClicked: boolean) {
        this._isConfirmReviewUnknownContentOKClicked = isConfirmReviewUnknownContentOKClicked;
    }

    // Indicating a value whether we need to set the scrollTopTo suppress area.
    private _scrollToSuppressArea: boolean;
    public get scrollToSuppressArea(): boolean {
        return this._scrollToSuppressArea;
    }
    public set scrollToSuppressArea(scrollToSuppressArea: boolean) {
        this._scrollToSuppressArea = scrollToSuppressArea;
    }

    // Indicating number of images to without suppressed
    private _totalImagesWithOutSuppression: number;
    public get totalImagesWithOutSuppression(): number {
        return this._totalImagesWithOutSuppression;
    }
    public set totalImagesWithOutSuppression(totalImagesWithOutSuppression: number) {
        this._totalImagesWithOutSuppression = totalImagesWithOutSuppression;
    }

    //Check whether previous marks and annotations are copied or not.
    private _isPreviousMarksAndAnnotationCopied: boolean;
    public get isPreviousMarksAndAnnotationCopied(): boolean {
        return this._isPreviousMarksAndAnnotationCopied;
    }
    public set isPreviousMarksAndAnnotationCopied(isPreviousMarksAndAnnotationCopied: boolean) {
        this._isPreviousMarksAndAnnotationCopied = isPreviousMarksAndAnnotationCopied;
    }

    private _isPreviousMarksAndAnnotationCopying: boolean;
    public get isPreviousMarksAndAnnotationCopying(): boolean {
        return this._isPreviousMarksAndAnnotationCopying;
    }
    public set isPreviousMarksAndAnnotationCopying(isPreviousMarksAndAnnotationCopying: boolean) {
        this._isPreviousMarksAndAnnotationCopying = isPreviousMarksAndAnnotationCopying;
    }

    //Status for FRview navigation trigger in combined warning stay response click
    private _isStayInResponseFRViewModeTriggered: boolean;
    public get isStayInResponseFRViewModeTriggered(): boolean {
        return this._isStayInResponseFRViewModeTriggered;
    }
    public set isStayInResponseFRViewModeTriggered(isStayInResponseFRViewModeTriggered: boolean) {
        this._isStayInResponseFRViewModeTriggered = isStayInResponseFRViewModeTriggered;
    }

    private _markDetails: MarkDetails;
    public get markDetails(): MarkDetails {
        return this._markDetails;
    }
    public set markDetails(markDetails: MarkDetails) {
        this._markDetails = markDetails;
    }

    //******** Message variables************//

    // Selected Message Associated to current response
    private _selectedMsg: Message;
    public get selectedMsg(): Message {
        return this._selectedMsg;
    }
    public set selectedMsg(selectedMsg: Message) {
        this._selectedMsg = selectedMsg;
    }

    // Selected Messages Details.
    private _selectedMsgDetails: MessageDetails;
    public get selectedMsgDetails(): MessageDetails {
        return this._selectedMsgDetails;
    }
    public set selectedMsgDetails(selectedMsgDetails: MessageDetails) {
        this._selectedMsgDetails = selectedMsgDetails;
    }

    // messageType for the panel.
    private _messageType: enums.MessageType;
    public get messageType(): enums.MessageType {
        return this._messageType;
    }
    public set messageType(messageType: enums.MessageType) {
        this._messageType = messageType;
    }

    // variable to hold responseId
    private _responseId: string;
    public get responseId(): string {
        return this._responseId;
    }
    public set responseId(responseId: string) {
        this._responseId = responseId;
    }

    // variable to hold examiner id for sending message
    private _examinerIdForSendMessage: number;
    public get examinerIdForSendMessage(): number {
        return this._examinerIdForSendMessage;
    }
    public set examinerIdForSendMessage(examinerIdForSendMessage: number) {
        this._examinerIdForSendMessage = examinerIdForSendMessage;
    }

    // variable to hold examiner name for sending Message
    private _examinerNameForSendMessage: string;
    public get examinerNameForSendMessage(): string {
        return this._examinerNameForSendMessage;
    }
    public set examinerNameForSendMessage(examinerNameForSendMessage: string) {
        this._examinerNameForSendMessage = examinerNameForSendMessage;
    }

    // variable to hold the CSS style
    private _cssMessageStyle: React.CSSProperties;
    public get cssMessageStyle(): React.CSSProperties {
        return this._cssMessageStyle;
    }
    public set cssMessageStyle(cssMessageStyle: React.CSSProperties) {
        this._cssMessageStyle = cssMessageStyle;
    }

    // Variable to hold the position of the minimized message panel- pixels to the right
    private _resizedWidth: string;
    public get resizedWidth(): string {
        return this._resizedWidth;
    }
    public set resizedWidth(resizedWidth: string) {
        this._resizedWidth = resizedWidth;
    }

    // Variable to hold the scrollbar width
    private _scrollBarWidth: string;
    public get scrollBarWidth(): string {
        return this._scrollBarWidth;
    }
    public set scrollBarWidth(scrollBarWidth: string) {
        this._scrollBarWidth = scrollBarWidth;
    }

    //******** Message Variables end *******//

    // Indicating whether the current response have triggered auto save.
    private _autoSaveTriggered: boolean;
    public get autoSaveTriggered(): boolean {
        return this._autoSaveTriggered;
    }
    public set autoSaveTriggered(autoSaveTriggered: boolean) {
        this._autoSaveTriggered = autoSaveTriggered;
    }

    private _markButtonWidth: number;
    public get markButtonWidth(): number {
        return this._markButtonWidth;
    }
    public set markButtonWidth(markButtonWidth: number) {
        this._markButtonWidth = markButtonWidth;
    }

    private _markSchemeWidth: number;
    public get markSchemeWidth(): number {
        return this._markSchemeWidth;
    }
    public set markSchemeWidth(markSchemeWidth: number) {
        this._markSchemeWidth = markSchemeWidth;
    }

    private _doNavigateResponse: boolean;
    public get doNavigateResponse(): boolean {
        return this._doNavigateResponse;
    }
    public set doNavigateResponse(doNavigateResponse: boolean) {
        this._doNavigateResponse = doNavigateResponse;
    }


    private _isResetMarkPopupShown: boolean;
    public get isResetMarkPopupShown(): boolean {
        return this._isResetMarkPopupShown;
    }
    public set isResetMarkPopupShown(isResetMarkPopupShown: boolean) {
        this._isResetMarkPopupShown = isResetMarkPopupShown;
    }

    private _markHelper: markSchemeHelper;
    public get markHelper(): markSchemeHelper {
        return this._markHelper;
    }
    public set markHelper(markHelper: markSchemeHelper) {
        this._markHelper = markHelper;
    }

    private _isOnLeaveResponseClick: boolean;
    public get isOnLeaveResponseClick(): boolean {
        return this._isOnLeaveResponseClick;
    }
    public set isOnLeaveResponseClick(isOnLeaveResponseClick: boolean) {
        this._isOnLeaveResponseClick = isOnLeaveResponseClick;
    }

    //Check whether mark by annotation CC is enabled or not.
    private _isMarkbyAnnotation: boolean;
    public get isMarkbyAnnotation(): boolean {
        return this._isMarkbyAnnotation;
    }
    public set isMarkbyAnnotation(isMarkbyAnnotation: boolean) {
        this._isMarkbyAnnotation = isMarkbyAnnotation;
    }

    /* private variable to manage event listeners for messaging panel*/
    private _messagingPanel: Element;
    public get messagingPanel(): Element {
        return this._messagingPanel;
    }
    public set messagingPanel(messagingPanel: Element) {
        this._messagingPanel = messagingPanel;
    }

    private _messagePanelTransitionListenerActive: boolean;
    public get messagePanelTransitionListenerActive(): boolean {
        return this._messagePanelTransitionListenerActive;
    }
    public set messagePanelTransitionListenerActive(messagePanelTransitionListenerActive: boolean) {
        this._messagePanelTransitionListenerActive = messagePanelTransitionListenerActive;
    }

    private _doShowResposeLoadingDialog: boolean;
    public get doShowResposeLoadingDialog(): boolean {
        return this._doShowResposeLoadingDialog;
    }
    public set doShowResposeLoadingDialog(doShowResposeLoadingDialog: boolean) {
        this._doShowResposeLoadingDialog = doShowResposeLoadingDialog;
    }

    private _currentQuestionItemBIndex: number;
    public get currentQuestionItemBIndex(): number {
        return this._currentQuestionItemBIndex;
    }
    public set currentQuestionItemBIndex(currentQuestionItemBIndex: number) {
        this._currentQuestionItemBIndex = currentQuestionItemBIndex;
    }

    private _isMarkChangeReasonShown: boolean;
    public get isMarkChangeReasonShown(): boolean {
        return this._isMarkChangeReasonShown;
    }
    public set isMarkChangeReasonShown(isMarkChangeReasonShown: boolean) {
        this._isMarkChangeReasonShown = isMarkChangeReasonShown;
    }

    private _isRemarkCreatedPopUpVisible: boolean;
    public get isRemarkCreatedPopUpVisible(): boolean {
        return this._isRemarkCreatedPopUpVisible;
    }
    public set isRemarkCreatedPopUpVisible(isRemarkCreatedPopUpVisible: boolean) {
        this._isRemarkCreatedPopUpVisible = isRemarkCreatedPopUpVisible;
    }

    private _isWholeResponseRemarkMarkNow: boolean;
    public get IsWholeResponseRemarkMarkNow(): boolean {
        return this._isWholeResponseRemarkMarkNow;
    }
    public set IsWholeResponseRemarkMarkNow(isWholeResponseRemarkMarkNow: boolean) {
        this._isWholeResponseRemarkMarkNow = isWholeResponseRemarkMarkNow;
    }

    private _currentPageNumber: number;
    public get currentPageNumber(): number {
        return this._currentPageNumber;
    }
    public set currentPageNumber(currentPageNumber: number) {
        this._currentPageNumber = currentPageNumber;
    }

    private _reviewPopupTitle: string;
    public get reviewPopupTitle(): string {
        return this._reviewPopupTitle;
    }
    public set reviewPopupTitle(reviewPopupTitle: string) {
        this._reviewPopupTitle = reviewPopupTitle;
    }

    private _reviewPopupContent: string;
    public get reviewPopupContent(): string {
        return this._reviewPopupContent;
    }
    public set reviewPopupContent(reviewPopupContent: string) {
        this._reviewPopupContent = reviewPopupContent;
    }

    private _reviewPopupDialogType: enums.PopupDialogType;
    public get reviewPopupDialogType(): enums.PopupDialogType {
        return this._reviewPopupDialogType;
    }
    public set reviewPopupDialogType(reviewPopupDialogType: enums.PopupDialogType) {
        this._reviewPopupDialogType = reviewPopupDialogType;
    }

    private _linkAnnotations: Immutable.Map<number, annotation>;
    public get linkAnnotations(): Immutable.Map<number, annotation> {
        return this._linkAnnotations;
    }
    public set linkAnnotations(linkAnnotations: Immutable.Map<number, annotation>) {
        this._linkAnnotations = linkAnnotations;
    }

    private _linkAnnotationsToRemove: number[];
    public get linkAnnotationsToRemove(): number[] {
        return this._linkAnnotationsToRemove;
    }
    public set linkAnnotationsToRemove(linkAnnotationsToRemove: number[]) {
        this._linkAnnotationsToRemove = linkAnnotationsToRemove;
    }

    private _itemsWhichCantUnlink: string[];
    public get itemsWhichCantUnlink(): string[] {
        return this._itemsWhichCantUnlink;
    }
    public set itemsWhichCantUnlink(itemsWhichCantUnlink: string[]) {
        this._itemsWhichCantUnlink = itemsWhichCantUnlink;
    }

    private _exceptionData: Immutable.List<ExceptionDetails>;
    public get exceptionData(): Immutable.List<ExceptionDetails> {
        return this._exceptionData;
    }
    public set exceptionData(exceptionData: Immutable.List<ExceptionDetails>) {
        this._exceptionData = exceptionData;
    }

    private _slaoFlagAsSeenClickedPageNumber: number;
    public get slaoFlagAsSeenClickedPageNumber(): number {
        return this._slaoFlagAsSeenClickedPageNumber;
    }
    public set slaoFlagAsSeenClickedPageNumber(slaoFlagAsSeenClickedPageNumber: number) {
        this._slaoFlagAsSeenClickedPageNumber = slaoFlagAsSeenClickedPageNumber;
    }

    private _unKnownContentFlagAsSeenClickedPageNumber: number;
    public get unKnownContentFlagAsSeenClickedPageNumber(): number {
        return this._unKnownContentFlagAsSeenClickedPageNumber;
    }
    public set unKnownContentFlagAsSeenClickedPageNumber(unKnownContentFlagAsSeenClickedPageNumber: number) {
        this._unKnownContentFlagAsSeenClickedPageNumber = unKnownContentFlagAsSeenClickedPageNumber;
    }

    private _isUnManagedSLAOPopupRendered: boolean;
    public get isUnManagedSLAOPopupRendered(): boolean {
        return this._isUnManagedSLAOPopupRendered;
    }
    public set isUnManagedSLAOPopupRendered(isUnManagedSLAOPopupRendered: boolean) {
        this._isUnManagedSLAOPopupRendered = isUnManagedSLAOPopupRendered;
    }

    private _isUnManagedImageZonePopupRendered: boolean;
    public get isUnManagedImageZonePopupRendered(): boolean {
        return this._isUnManagedImageZonePopupRendered;
    }
    public set isUnManagedImageZonePopupRendered(isUnManagedImageZonePopupRendered: boolean) {
        this._isUnManagedImageZonePopupRendered = isUnManagedImageZonePopupRendered;
    }

    private _isPromoteToSeedConfirmationDialogVisible: boolean;
    public get isPromoteToSeedConfirmationDialogVisible(): boolean {
        return this._isPromoteToSeedConfirmationDialogVisible;
    }
    public set isPromoteToSeedConfirmationDialogVisible(isPromoteToSeedConfirmationDialogVisible: boolean) {
        this._isPromoteToSeedConfirmationDialogVisible = isPromoteToSeedConfirmationDialogVisible;
    }

    private _ispromoteToReuseConfirmationDialogVisible: boolean;
    public get ispromoteToReuseConfirmationDialogVisible(): boolean {
        return this._ispromoteToReuseConfirmationDialogVisible;
    }
    public set ispromoteToReuseConfirmationDialogVisible(ispromoteToReuseConfirmationDialogVisible: boolean) {
        this._ispromoteToReuseConfirmationDialogVisible = ispromoteToReuseConfirmationDialogVisible;
    }

    private _isPrevMarkListColumnVisible: boolean;
    public get isPrevMarkListColumnVisible(): boolean {
        return this._isPrevMarkListColumnVisible;
    }
    public set isPrevMarkListColumnVisible(isPrevMarkListColumnVisible: boolean) {
        this._isPrevMarkListColumnVisible = isPrevMarkListColumnVisible;
    }

    private _isPrevMarkListUnChecked: boolean;
    public get isPrevMarkListUnChecked(): boolean {
        return this._isPrevMarkListUnChecked;
    }
    public set isPrevMarkListUnChecked(isPrevMarkListUnChecked: boolean) {
        this._isPrevMarkListUnChecked = isPrevMarkListUnChecked;
    }

    private _isUnknownContentManagedConfirmationPopupButtonClicked: boolean;
    public get isUnknownContentManagedConfirmationPopupButtonClicked(): boolean {
        return this._isUnknownContentManagedConfirmationPopupButtonClicked;
    }
    public set isUnknownContentManagedConfirmationPopupButtonClicked(isUnknownContentManagedConfirmationPopupButtonClicked: boolean) {
        this._isUnknownContentManagedConfirmationPopupButtonClicked = isUnknownContentManagedConfirmationPopupButtonClicked;
    }

    private _isAllSLAOManagedConfirmationPopupButtonClicked: boolean;
    public get isAllSLAOManagedConfirmationPopupButtonClicked(): boolean {
        return this._isAllSLAOManagedConfirmationPopupButtonClicked;
    }
    public set isAllSLAOManagedConfirmationPopupButtonClicked(isAllSLAOManagedConfirmationPopupButtonClicked: boolean) {
        this._isAllSLAOManagedConfirmationPopupButtonClicked = isAllSLAOManagedConfirmationPopupButtonClicked;
    }

    private _isAllSLAOManagedConfirmationPopupRendered: boolean;
    public get isAllSLAOManagedConfirmationPopupRendered(): boolean {
        return this._isAllSLAOManagedConfirmationPopupRendered;
    }
    public set isAllSLAOManagedConfirmationPopupRendered(isAllSLAOManagedConfirmationPopupRendered: boolean) {
        this._isAllSLAOManagedConfirmationPopupRendered = isAllSLAOManagedConfirmationPopupRendered;
    }

    private _isUnknownContentManagedConfirmationPopupRendered: boolean;
    public get isUnknownContentManagedConfirmationPopupRendered(): boolean {
        return this._isUnknownContentManagedConfirmationPopupRendered;
    }
    public set isUnknownContentManagedConfirmationPopupRendered(isUnknownContentManagedConfirmationPopupRendered: boolean) {
        this._isUnknownContentManagedConfirmationPopupRendered = isUnknownContentManagedConfirmationPopupRendered;
    }

    private _crmFeedConfirmationPopupVisible: boolean;
    public get crmFeedConfirmationPopupVisible(): boolean {
        return this._crmFeedConfirmationPopupVisible;
    }
    public set crmFeedConfirmationPopupVisible(crmFeedConfirmationPopupVisible: boolean) {
        this._crmFeedConfirmationPopupVisible = crmFeedConfirmationPopupVisible;
    }

    private _creatExceptionReturnWithdrwnResponseErrorPopupVisible: boolean;
    public get creatExceptionReturnWithdrwnResponseErrorPopupVisible(): boolean {
        return this._creatExceptionReturnWithdrwnResponseErrorPopupVisible;
    }
    public set creatExceptionReturnWithdrwnResponseErrorPopupVisible(creatExceptionReturnWithdrwnResponseErrorPopupVisible: boolean) {
        this._creatExceptionReturnWithdrwnResponseErrorPopupVisible = creatExceptionReturnWithdrwnResponseErrorPopupVisible;
    }

    private _withdrwnResponseErrorPopupVisible: boolean;
    public get withdrwnResponseErrorPopupVisible(): boolean {
        return this._withdrwnResponseErrorPopupVisible;
    }
    public set withdrwnResponseErrorPopupVisible(withdrwnResponseErrorPopupVisible: boolean) {
        this._withdrwnResponseErrorPopupVisible = withdrwnResponseErrorPopupVisible;
    }

    private _withdrawScriptInStmErrorPopUpVisible: boolean;
    public get withdrawScriptInStmErrorPopUpVisible(): boolean {
        return this._withdrawScriptInStmErrorPopUpVisible;
    }
    public set withdrawScriptInStmErrorPopUpVisible(isVisible: boolean) {
        this._withdrawScriptInStmErrorPopUpVisible = isVisible;
    }

    private _isPromoteToSeedErrorDialogVisible: boolean;
    public get isPromoteToSeedErrorDialogVisible(): boolean {
        return this._isPromoteToSeedErrorDialogVisible;
    }
    public set isPromoteToSeedErrorDialogVisible(isPromoteToSeedErrorDialogVisible: boolean) {
        this._isPromoteToSeedErrorDialogVisible = isPromoteToSeedErrorDialogVisible;
    }

    private _promoteToSeedErrorPopupData: PopUpData;
    public get promoteToSeedErrorPopupData(): PopUpData {
        return this._promoteToSeedErrorPopupData;
    }
    public set promoteToSeedErrorPopupData(promoteToSeedErrorPopupData: PopUpData) {
        this._promoteToSeedErrorPopupData = promoteToSeedErrorPopupData;
    }

    private _isPromoteToSeedRemarkConfirmationDialogVisible: boolean;
    public get isPromoteToSeedRemarkConfirmationDialogVisible(): boolean {
        return this._isPromoteToSeedRemarkConfirmationDialogVisible;
    }
    public set isPromoteToSeedRemarkConfirmationDialogVisible(isPromoteToSeedRemarkConfirmationDialogVisible: boolean) {
        this._isPromoteToSeedRemarkConfirmationDialogVisible = isPromoteToSeedRemarkConfirmationDialogVisible;
    }

    private _promoteToSeedDialogType: enums.PopupDialogType;
    public get promoteToSeedDialogType(): enums.PopupDialogType {
        return this._promoteToSeedDialogType;
    }
    public set promoteToSeedDialogType(promoteToSeedDialogType: enums.PopupDialogType) {
        this._promoteToSeedDialogType = promoteToSeedDialogType;
    }

    private _isSLAOManaged: boolean;
    public get isSLAOManaged(): boolean {
        return this._isSLAOManaged;
    }
    public set isSLAOManaged(isSLAOManaged: boolean) {
        this._isSLAOManaged = isSLAOManaged;
    }

    private _isUnknownContentManaged: boolean;
    public get isUnknownContentManaged(): boolean {
        return this._isUnknownContentManaged;
    }
    public set isUnknownContentManaged(isUnknownContentManaged: boolean) {
        this._isUnknownContentManaged = isUnknownContentManaged;
    }

    private _hasOnPageComments: boolean;
    public get hasOnPageComments(): boolean {
        return this._hasOnPageComments;
    }
    public set hasOnPageComments(hasOnPageComments: boolean) {
        this._hasOnPageComments = hasOnPageComments;
    }

    private _currentImageZones: Immutable.List<ImageZone>;
    public get currentImageZones(): Immutable.List<ImageZone> {
        return this._currentImageZones;
    }
    public set currentImageZones(currentImageZones: Immutable.List<ImageZone>) {
        this._currentImageZones = currentImageZones;
    }

    private _doApplyLinkingScenarios: boolean;
    public get doApplyLinkingScenarios(): boolean {
        return this._doApplyLinkingScenarios;
    }
    public set doApplyLinkingScenarios(doApplyLinkingScenarios: boolean) {
        this._doApplyLinkingScenarios = doApplyLinkingScenarios;
    }

    private _combinedWarningMessages: combinedWarningMessage = new combinedWarningMessage();
    public get combinedWarningMessages(): combinedWarningMessage {
        return this._combinedWarningMessages;
    }
    public set combinedWarningMessages(combinedWarningMessages: combinedWarningMessage) {
        this._combinedWarningMessages = combinedWarningMessages;
    }

    private _linkedPagesByPreviousMarkers: number[];
    public get linkedPagesByPreviousMarkers(): number[] {
        return this._linkedPagesByPreviousMarkers;
    }
    public set linkedPagesByPreviousMarkers(linkedPagesByPreviousMarkers: number[]) {
        this._linkedPagesByPreviousMarkers = linkedPagesByPreviousMarkers;
    }

    private _multipleMarkSchemes: treeViewItem;
    public get multipleMarkSchemes(): treeViewItem {
        return this._multipleMarkSchemes;
    }
    public set multipleMarkSchemes(multipleMarkSchemes: treeViewItem) {
        this._multipleMarkSchemes = multipleMarkSchemes;
    }

    private _isToolBarPanelVisible: boolean;
    public get isToolBarPanelVisible(): boolean {
        return this._isToolBarPanelVisible;
    }
    public set isToolBarPanelVisible(isToolBarPanelVisible: boolean) {
        this._isToolBarPanelVisible = isToolBarPanelVisible;
    }

    private _storageAdapterHelper: storageAdapterHelper;
    public get storageAdapterHelper(): storageAdapterHelper {
        return this._storageAdapterHelper;
    }
    public set storageAdapterHelper(storageAdapterHelper: storageAdapterHelper) {
        this._storageAdapterHelper = storageAdapterHelper;
    }

    private _isLoadingResponseScreen: boolean;
    public get isLoadingResponseScreen(): boolean {
        return this._isLoadingResponseScreen;
    }
    public set isLoadingResponseScreen(isLoadingResponseScreen: boolean) {
        this._isLoadingResponseScreen = isLoadingResponseScreen;
    }

    private _isMessagePanelMinimized: boolean;
    public get isMessagePanelMinimized(): boolean {
        return this._isMessagePanelMinimized;
    }
    public set isMessagePanelMinimized(isMessagePanelMinimized: boolean) {
        this._isMessagePanelMinimized = isMessagePanelMinimized;
    }

    // Flag indicating that the image container needs to be loaded.
    // In cases where there are non convertible files in the file list,
    // this flag needs to be set explicitly in order to load the response.
    private _loadImagecontainer: boolean;
    public get loadImagecontainer(): boolean {
        return this._loadImagecontainer;
    }
    public set loadImagecontainer(loadImagecontainer: boolean) {
        this._loadImagecontainer = loadImagecontainer;
    }

    private _enhancedOffPageClientTokensToBeUpdated: Array<string>;
    public get enhancedOffPageClientTokensToBeUpdated(): Array<string> {
        return this._enhancedOffPageClientTokensToBeUpdated;
    }
    public set enhancedOffPageClientTokensToBeUpdated(enhancedOffPageClientTokensToBeUpdated: Array<string>) {
        this._enhancedOffPageClientTokensToBeUpdated = enhancedOffPageClientTokensToBeUpdated;
    }

    private _enhancedOffPageCommentMarkingOperation: enums.MarkingOperation;
    public get enhancedOffPageCommentMarkingOperation(): enums.MarkingOperation {
        return this._enhancedOffPageCommentMarkingOperation;
    }
    public set enhancedOffPageCommentMarkingOperation(enhancedOffPageCommentMarkingOperation: enums.MarkingOperation) {
        this._enhancedOffPageCommentMarkingOperation = enhancedOffPageCommentMarkingOperation;
    }

    private _isEnhancedOffPageCommentVisible: boolean;
    public get isEnhancedOffPageCommentVisible(): boolean {
        return this._isEnhancedOffPageCommentVisible;
    }
    public set isEnhancedOffPageCommentVisible(isEnhancedOffPageCommentVisible: boolean) {
        this._isEnhancedOffPageCommentVisible = isEnhancedOffPageCommentVisible;
    }

    private _enhancedOffPageButtonAction: enums.EnhancedOffPageCommentAction;
    public get enhancedOffPageButtonAction(): enums.EnhancedOffPageCommentAction {
        return this._enhancedOffPageButtonAction;
    }
    public set enhancedOffPageButtonAction(enhancedOffPageButtonAction: enums.EnhancedOffPageCommentAction) {
        this._enhancedOffPageButtonAction = enhancedOffPageButtonAction;
    }

    private _enhancedOffPageCommentDetails: EnhancedOffPageCommentDetailViewDetails;
    public get enhancedOffPageCommentDetails(): EnhancedOffPageCommentDetailViewDetails {
        return this._enhancedOffPageCommentDetails;
    }
    public set enhancedOffPageCommentDetails(enhancedOffPageCommentDetails: EnhancedOffPageCommentDetailViewDetails) {
        this._enhancedOffPageCommentDetails = enhancedOffPageCommentDetails;
    }

    private _enhancedOffPageCommentMarkSchemeToNavigate: treeViewItem;
    public get enhancedOffPageCommentMarkSchemeToNavigate(): treeViewItem {
        return this._enhancedOffPageCommentMarkSchemeToNavigate;
    }

    public set enhancedOffPageCommentMarkSchemeToNavigate(node: treeViewItem){
        this._enhancedOffPageCommentMarkSchemeToNavigate = node;
    }

    private _isFromMediaErrorDialog: boolean;
    public get isFromMediaErrorDialog(): boolean {
        return this._isFromMediaErrorDialog;
    }
    public set isFromMediaErrorDialog(isFromMediaErrorDialog: boolean) {
        this._isFromMediaErrorDialog = isFromMediaErrorDialog;
    }

    private _markSheetContainer: HTMLInputElement;

    public get markSheetContainer(): HTMLInputElement {
        return this._markSheetContainer;
    }
    public set markSheetContainer(markSheetContainer: HTMLInputElement) {
        this._markSheetContainer = markSheetContainer;
    }

    private _isNotSupportedFileElement: boolean;

    public get isNotSupportedFileElement(): boolean {
        return this._isNotSupportedFileElement;
    }

    public set isNotSupportedFileElement(isNotSupportedFileElement: boolean) {
        this._isNotSupportedFileElement = isNotSupportedFileElement;
    }

    private _isInFullResponseView: boolean;

    public get isInFullResponseView(): boolean {
        return this._isInFullResponseView;
    }

    public set isInFullResponseView(isInFullResponseView: boolean) {
        this._isInFullResponseView = isInFullResponseView;
    }

    private _errorViewmoreContent: string;

    public get errorViewmoreContent(): string {
        return this._errorViewmoreContent;
    }

    public set errorViewmoreContent(errorViewmoreContent: string) {
        this._errorViewmoreContent = errorViewmoreContent;
    }

    private _switchEnhancedOffPageCommentsDiscardPopupShow: boolean;

    public get switchEnhancedOffPageCommentsDiscardPopupShow(): boolean {
        return this._switchEnhancedOffPageCommentsDiscardPopupShow;
    }

    public set switchEnhancedOffPageCommentsDiscardPopupShow(switchEnhancedOffPageCommentsDiscardPopupShow: boolean) {
        this._switchEnhancedOffPageCommentsDiscardPopupShow = switchEnhancedOffPageCommentsDiscardPopupShow;
    }

    /**
     * is create new message option selected or not
     */
    private _isCreateNewMessageSelected: boolean;

    /*
     * gets create new message option selected or not
     */
    public get isCreateNewMessageSelected(): boolean {
        return this._isCreateNewMessageSelected;
    }

    /*
     * sets create new message option selected or not
     */
    public set isCreateNewMessageSelected(createNewMessageSelected: boolean) {
        this._isCreateNewMessageSelected = createNewMessageSelected;
    }

    public get isUnzonedItem(): boolean {
        return this._currentImageZones &&
            (this._currentImageZones.some((x: ImageZone) => x.docStorePageQuestionTagTypeId === 2));
    }

    constructor() {
        this.setDefaultValues();
    }

    /**
     * Setting the default values
     */
    private setDefaultValues() {
        this._combinedWarningMessages = new combinedWarningMessage();
        this._storageAdapterHelper = new storageAdapterHelper();
        this._saveMarksAndAnnotationsErrorDialogContents = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(false);
        this._fileMetadataList = Immutable.List<FileMetadata>();
        this._imagesToRender = [];
        this._totalImageCount = 0;
        this._renderedImageCount = 0;
        this._renderedImageViewerCount = 0;
        this._setFracsloadedImageCount = 0;
        this._responseContainerHeight = 0;
        this._minimumNumericMark = 0;
        this._maximumNumericMark = 0;
        this._busyIndicatorInvoker = enums.BusyIndicatorInvoker.none;
        this._showBackgroundScreenOnBusy = false;
        this._fullResponseOptionValue = enums.FullResponeViewOption.fourPage;
        this._navigateTo = enums.SaveAndNavigate.none;
        this._hasNonRecoverableErrorPopupShown = false;
        this._isResetActionByClick = false;
        this._markThisPageScrollPosition = undefined;
        this._isMessagePanelVisible = false;
        this._hasResponseLayoutChanged = false;
        this._isShowAllPagesOfScriptOptionSelected = false;
        this._isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = false;
        this._isOnPageCommentStamped = false;
        this._autoSaveTimerInterval = 300000;
        this._isResponseEditable = false;
        this._messageIdToSelect = 0;
        this._scrollToTopOf = undefined;
        this._unReadMessageCount = undefined;
        this._isExceptionPanelMinimized = false;
        this._isNewException = true;
        this._isExceptionPanelEdited = false;
        this._isDeleteMessageYesClicked = false;
        this._scrollToSuppressArea = false;
        this._totalImagesWithOutSuppression = 0;
        this._isPreviousMarksAndAnnotationCopied = false;
        this._isPreviousMarksAndAnnotationCopying = false;
        this._isStayInResponseFRViewModeTriggered = false;
        this._markDetails = undefined;
        this._autoSaveTriggered = false;
        this._doNavigateResponse = false;
        this._isResetMarkPopupShown = false;
        this._isOnLeaveResponseClick = false;
        this._messagePanelTransitionListenerActive = false;
        this._doShowResposeLoadingDialog = true;
        this._currentQuestionItemBIndex = -1;
        this._isMarkChangeReasonShown = false;
        this._isRemarkCreatedPopUpVisible = false;
        this._currentPageNumber = 0;
        this._isUnManagedSLAOPopupRendered = false;
        this._isPromoteToSeedConfirmationDialogVisible = false;
        this._ispromoteToReuseConfirmationDialogVisible = false;
        this._isPrevMarkListColumnVisible = false;
        this._isPrevMarkListUnChecked = false;
        this._isAllSLAOManagedConfirmationPopupButtonClicked = false;
        this._isAllSLAOManagedConfirmationPopupRendered = false;
        this._crmFeedConfirmationPopupVisible = false;
        this._isPromoteToSeedErrorDialogVisible = false;
        this._isPromoteToSeedRemarkConfirmationDialogVisible = false;
        this._isSLAOManaged = false;
        this._isUnknownContentManaged = false;
        this._hasOnPageComments = false;
        this._doApplyLinkingScenarios = false;
        this._linkedPagesByPreviousMarkers = [];
        this._isToolBarPanelVisible = true;
        this._isLoadingResponseScreen = true;
        this._isMessagePanelMinimized = false;
        this._loadImagecontainer = false;
        this._isEnhancedOffPageCommentVisible = true;
        this._enhancedOffPageCommentMarkSchemeToNavigate = undefined;
        this._isFromMediaErrorDialog = false;
        this._imageZonesCollection = null;
        this._isCreateNewMessageSelected = false;
        this._creatExceptionReturnWithdrwnResponseErrorPopupVisible = false;
        this._withdrawScriptInStmErrorPopUpVisible = false;
    }
}

export = ResponseContainerPropertyBase;
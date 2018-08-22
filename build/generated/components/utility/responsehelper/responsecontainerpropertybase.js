"use strict";
var enums = require('../enums');
var saveMarksAndAnnotationsNonRecoverableErrorDialogContents = require('../savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
var storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
var combinedWarningMessage = require('../../response/typings/combinedwarningmessage');
var Immutable = require('immutable');
var ResponseContainerPropertyBase = (function () {
    function ResponseContainerPropertyBase() {
        this._imageZonesCollection = null;
        // Indicate whether Non Numeric
        this._isNonNumeric = false;
        this._combinedWarningMessages = new combinedWarningMessage();
        this.setDefaultValues();
    }
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "responseData", {
        get: function () {
            return this._responseData;
        },
        set: function (responseData) {
            this._responseData = responseData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "treeViewHelper", {
        get: function () {
            return this._treeViewHelper;
        },
        set: function (treeViewHelper) {
            this._treeViewHelper = treeViewHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "scriptHelper", {
        get: function () {
            return this._scriptHelper;
        },
        set: function (scriptHelper) {
            this._scriptHelper = scriptHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "imageZonesCollection", {
        get: function () {
            return this._imageZonesCollection;
        },
        set: function (imageZonesCollection) {
            this._imageZonesCollection = imageZonesCollection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "imagesToRender", {
        get: function () {
            return this._imagesToRender;
        },
        set: function (imagesToRender) {
            this._imagesToRender = imagesToRender;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "fileMetadataList", {
        get: function () {
            return this._fileMetadataList;
        },
        set: function (fileMetadataList) {
            this._fileMetadataList = fileMetadataList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "confirmationDialogueContent", {
        get: function () {
            return this._confirmationDialogueContent;
        },
        set: function (confirmationDialogueContent) {
            this._confirmationDialogueContent = confirmationDialogueContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "confirmationDialogueHeader", {
        get: function () {
            return this._confirmationDialogueHeader;
        },
        set: function (confirmationDialogueHeader) {
            this._confirmationDialogueHeader = confirmationDialogueHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "totalImageCount", {
        get: function () {
            return this._totalImageCount;
        },
        set: function (totalImageCount) {
            this._totalImageCount = totalImageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "renderedImageCount", {
        get: function () {
            return this._renderedImageCount;
        },
        set: function (renderedImageCount) {
            this._renderedImageCount = renderedImageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "renderedImageViewerCount", {
        get: function () {
            return this._renderedImageViewerCount;
        },
        set: function (renderedImageViewerCount) {
            this._renderedImageViewerCount = renderedImageViewerCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "setFracsloadedImageCount", {
        get: function () {
            return this._setFracsloadedImageCount;
        },
        set: function (setFracsloadedImageCount) {
            this._setFracsloadedImageCount = setFracsloadedImageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "responseContainerHeight", {
        get: function () {
            return this._responseContainerHeight;
        },
        set: function (responseContainerHeight) {
            this._responseContainerHeight = responseContainerHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markSchemeRenderedOn", {
        get: function () {
            return this._markSchemeRenderedOn;
        },
        set: function (markSchemeRenderedOn) {
            this._markSchemeRenderedOn = markSchemeRenderedOn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "minimumNumericMark", {
        get: function () {
            return this._minimumNumericMark;
        },
        set: function (minimumNumericMark) {
            this._minimumNumericMark = minimumNumericMark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "maximumNumericMark", {
        get: function () {
            return this._maximumNumericMark;
        },
        set: function (maximumNumericMark) {
            this._maximumNumericMark = maximumNumericMark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isNonNumeric", {
        get: function () {
            return this._isNonNumeric;
        },
        set: function (isNonNumeric) {
            this._isNonNumeric = isNonNumeric;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markButtonRenderedOn", {
        get: function () {
            return this._markButtonRenderedOn;
        },
        set: function (markButtonRenderedOn) {
            this._markButtonRenderedOn = markButtonRenderedOn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "busyIndicatorInvoker", {
        get: function () {
            return this._busyIndicatorInvoker;
        },
        set: function (busyIndicatorInvoker) {
            this._busyIndicatorInvoker = busyIndicatorInvoker;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "showBackgroundScreenOnBusy", {
        get: function () {
            return this._showBackgroundScreenOnBusy;
        },
        set: function (showBackgroundScreenOnBusy) {
            this._showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "fullResponseOptionValue", {
        get: function () {
            return this._fullResponseOptionValue;
        },
        set: function (fullResponseOptionValue) {
            this._fullResponseOptionValue = fullResponseOptionValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "navigateTo", {
        get: function () {
            return this._navigateTo;
        },
        set: function (navigateTo) {
            this._navigateTo = navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "hasNonRecoverableErrorPopupShown", {
        get: function () {
            return this._hasNonRecoverableErrorPopupShown;
        },
        set: function (hasNonRecoverableErrorPopupShown) {
            this._hasNonRecoverableErrorPopupShown = hasNonRecoverableErrorPopupShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "saveMarksAndAnnotationsErrorDialogContents", {
        get: function () {
            return this._saveMarksAndAnnotationsErrorDialogContents;
        },
        set: function (saveMarksAndAnnotationsErrorDialogContents) {
            this._saveMarksAndAnnotationsErrorDialogContents = saveMarksAndAnnotationsErrorDialogContents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isResetActionByClick", {
        get: function () {
            return this._isResetActionByClick;
        },
        set: function (isResetActionByClick) {
            this._isResetActionByClick = isResetActionByClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "previousMark", {
        get: function () {
            return this._previousMark;
        },
        set: function (previousMark) {
            this._previousMark = previousMark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markThisPageScrollPosition", {
        get: function () {
            return this._markThisPageScrollPosition;
        },
        set: function (markThisPageScrollPosition) {
            this._markThisPageScrollPosition = markThisPageScrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isMessagePanelVisible", {
        get: function () {
            return this._isMessagePanelVisible;
        },
        set: function (isMessagePanelVisible) {
            this._isMessagePanelVisible = isMessagePanelVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "hasResponseLayoutChanged", {
        get: function () {
            return this._hasResponseLayoutChanged;
        },
        set: function (hasResponseLayoutChanged) {
            this._hasResponseLayoutChanged = hasResponseLayoutChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "lastMarkSchemeId", {
        get: function () {
            return this._lastMarkSchemeId;
        },
        set: function (lastMarkSchemeId) {
            this._lastMarkSchemeId = lastMarkSchemeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isOnlyShowUnAnnotatedPagesOptionSelected", {
        get: function () {
            return this._isOnlyShowUnAnnotatedPagesOptionSelected;
        },
        set: function (isOnlyShowUnAnnotatedPagesOptionSelected) {
            this._isOnlyShowUnAnnotatedPagesOptionSelected = isOnlyShowUnAnnotatedPagesOptionSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isShowAllPagesOfScriptOptionSelected", {
        get: function () {
            return this._isShowAllPagesOfScriptOptionSelected;
        },
        set: function (isShowAllPagesOfScriptOptionSelected) {
            this._isShowAllPagesOfScriptOptionSelected = isShowAllPagesOfScriptOptionSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected", {
        get: function () {
            return this._isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected;
        },
        set: function (isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected) {
            this._isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isOnPageCommentStamped", {
        get: function () {
            return this._isOnPageCommentStamped;
        },
        set: function (isOnPageCommentStamped) {
            this._isOnPageCommentStamped = isOnPageCommentStamped;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "autoSaveTimerInterval", {
        get: function () {
            return this._autoSaveTimerInterval;
        },
        set: function (autoSaveTimerInterval) {
            this._autoSaveTimerInterval = autoSaveTimerInterval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isResponseEditable", {
        get: function () {
            return this._isResponseEditable;
        },
        set: function (isResponseEditable) {
            this._isResponseEditable = isResponseEditable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "messageIdToSelect", {
        get: function () {
            return this._messageIdToSelect;
        },
        set: function (messageIdToSelect) {
            this._messageIdToSelect = messageIdToSelect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "scrollToTopOf", {
        get: function () {
            return this._scrollToTopOf;
        },
        set: function (scrollToTopOf) {
            this._scrollToTopOf = scrollToTopOf;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "unReadMessageCount", {
        get: function () {
            return this._unReadMessageCount;
        },
        set: function (unReadMessageCount) {
            this._unReadMessageCount = unReadMessageCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isExceptionPanelMinimized", {
        get: function () {
            return this._isExceptionPanelMinimized;
        },
        set: function (isExceptionPanelMinimized) {
            this._isExceptionPanelMinimized = isExceptionPanelMinimized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isNewException", {
        get: function () {
            return this._isNewException;
        },
        set: function (isNewException) {
            this._isNewException = isNewException;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "exceptionDetails", {
        get: function () {
            return this._exceptionDetails;
        },
        set: function (exceptionDetails) {
            this._exceptionDetails = exceptionDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isExceptionPanelEdited", {
        get: function () {
            return this._isExceptionPanelEdited;
        },
        set: function (isExceptionPanelEdited) {
            this._isExceptionPanelEdited = isExceptionPanelEdited;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "exceptionId", {
        get: function () {
            return this._exceptionId;
        },
        set: function (exceptionId) {
            this._exceptionId = exceptionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "messageId", {
        get: function () {
            return this._messageId;
        },
        set: function (messageId) {
            this._messageId = messageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isDeleteMessageYesClicked", {
        get: function () {
            return this._isDeleteMessageYesClicked;
        },
        set: function (isDeleteMessageYesClicked) {
            this._isDeleteMessageYesClicked = isDeleteMessageYesClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isConfirmReviewUnknownContentOKClicked", {
        get: function () {
            return this._isConfirmReviewUnknownContentOKClicked;
        },
        set: function (isConfirmReviewUnknownContentOKClicked) {
            this._isConfirmReviewUnknownContentOKClicked = isConfirmReviewUnknownContentOKClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "scrollToSuppressArea", {
        get: function () {
            return this._scrollToSuppressArea;
        },
        set: function (scrollToSuppressArea) {
            this._scrollToSuppressArea = scrollToSuppressArea;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "totalImagesWithOutSuppression", {
        get: function () {
            return this._totalImagesWithOutSuppression;
        },
        set: function (totalImagesWithOutSuppression) {
            this._totalImagesWithOutSuppression = totalImagesWithOutSuppression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPreviousMarksAndAnnotationCopied", {
        get: function () {
            return this._isPreviousMarksAndAnnotationCopied;
        },
        set: function (isPreviousMarksAndAnnotationCopied) {
            this._isPreviousMarksAndAnnotationCopied = isPreviousMarksAndAnnotationCopied;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPreviousMarksAndAnnotationCopying", {
        get: function () {
            return this._isPreviousMarksAndAnnotationCopying;
        },
        set: function (isPreviousMarksAndAnnotationCopying) {
            this._isPreviousMarksAndAnnotationCopying = isPreviousMarksAndAnnotationCopying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isStayInResponseFRViewModeTriggered", {
        get: function () {
            return this._isStayInResponseFRViewModeTriggered;
        },
        set: function (isStayInResponseFRViewModeTriggered) {
            this._isStayInResponseFRViewModeTriggered = isStayInResponseFRViewModeTriggered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markDetails", {
        get: function () {
            return this._markDetails;
        },
        set: function (markDetails) {
            this._markDetails = markDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "selectedMsg", {
        get: function () {
            return this._selectedMsg;
        },
        set: function (selectedMsg) {
            this._selectedMsg = selectedMsg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "selectedMsgDetails", {
        get: function () {
            return this._selectedMsgDetails;
        },
        set: function (selectedMsgDetails) {
            this._selectedMsgDetails = selectedMsgDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "messageType", {
        get: function () {
            return this._messageType;
        },
        set: function (messageType) {
            this._messageType = messageType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "responseId", {
        get: function () {
            return this._responseId;
        },
        set: function (responseId) {
            this._responseId = responseId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "examinerIdForSendMessage", {
        get: function () {
            return this._examinerIdForSendMessage;
        },
        set: function (examinerIdForSendMessage) {
            this._examinerIdForSendMessage = examinerIdForSendMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "examinerNameForSendMessage", {
        get: function () {
            return this._examinerNameForSendMessage;
        },
        set: function (examinerNameForSendMessage) {
            this._examinerNameForSendMessage = examinerNameForSendMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "cssMessageStyle", {
        get: function () {
            return this._cssMessageStyle;
        },
        set: function (cssMessageStyle) {
            this._cssMessageStyle = cssMessageStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "resizedWidth", {
        get: function () {
            return this._resizedWidth;
        },
        set: function (resizedWidth) {
            this._resizedWidth = resizedWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "scrollBarWidth", {
        get: function () {
            return this._scrollBarWidth;
        },
        set: function (scrollBarWidth) {
            this._scrollBarWidth = scrollBarWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "autoSaveTriggered", {
        get: function () {
            return this._autoSaveTriggered;
        },
        set: function (autoSaveTriggered) {
            this._autoSaveTriggered = autoSaveTriggered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markButtonWidth", {
        get: function () {
            return this._markButtonWidth;
        },
        set: function (markButtonWidth) {
            this._markButtonWidth = markButtonWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markSchemeWidth", {
        get: function () {
            return this._markSchemeWidth;
        },
        set: function (markSchemeWidth) {
            this._markSchemeWidth = markSchemeWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "doNavigateResponse", {
        get: function () {
            return this._doNavigateResponse;
        },
        set: function (doNavigateResponse) {
            this._doNavigateResponse = doNavigateResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isResetMarkPopupShown", {
        get: function () {
            return this._isResetMarkPopupShown;
        },
        set: function (isResetMarkPopupShown) {
            this._isResetMarkPopupShown = isResetMarkPopupShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markHelper", {
        get: function () {
            return this._markHelper;
        },
        set: function (markHelper) {
            this._markHelper = markHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isOnLeaveResponseClick", {
        get: function () {
            return this._isOnLeaveResponseClick;
        },
        set: function (isOnLeaveResponseClick) {
            this._isOnLeaveResponseClick = isOnLeaveResponseClick;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isMarkbyAnnotation", {
        get: function () {
            return this._isMarkbyAnnotation;
        },
        set: function (isMarkbyAnnotation) {
            this._isMarkbyAnnotation = isMarkbyAnnotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "messagingPanel", {
        get: function () {
            return this._messagingPanel;
        },
        set: function (messagingPanel) {
            this._messagingPanel = messagingPanel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "messagePanelTransitionListenerActive", {
        get: function () {
            return this._messagePanelTransitionListenerActive;
        },
        set: function (messagePanelTransitionListenerActive) {
            this._messagePanelTransitionListenerActive = messagePanelTransitionListenerActive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "doShowResposeLoadingDialog", {
        get: function () {
            return this._doShowResposeLoadingDialog;
        },
        set: function (doShowResposeLoadingDialog) {
            this._doShowResposeLoadingDialog = doShowResposeLoadingDialog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "currentQuestionItemBIndex", {
        get: function () {
            return this._currentQuestionItemBIndex;
        },
        set: function (currentQuestionItemBIndex) {
            this._currentQuestionItemBIndex = currentQuestionItemBIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isMarkChangeReasonShown", {
        get: function () {
            return this._isMarkChangeReasonShown;
        },
        set: function (isMarkChangeReasonShown) {
            this._isMarkChangeReasonShown = isMarkChangeReasonShown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isRemarkCreatedPopUpVisible", {
        get: function () {
            return this._isRemarkCreatedPopUpVisible;
        },
        set: function (isRemarkCreatedPopUpVisible) {
            this._isRemarkCreatedPopUpVisible = isRemarkCreatedPopUpVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "IsWholeResponseRemarkMarkNow", {
        get: function () {
            return this._isWholeResponseRemarkMarkNow;
        },
        set: function (isWholeResponseRemarkMarkNow) {
            this._isWholeResponseRemarkMarkNow = isWholeResponseRemarkMarkNow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "currentPageNumber", {
        get: function () {
            return this._currentPageNumber;
        },
        set: function (currentPageNumber) {
            this._currentPageNumber = currentPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "reviewPopupTitle", {
        get: function () {
            return this._reviewPopupTitle;
        },
        set: function (reviewPopupTitle) {
            this._reviewPopupTitle = reviewPopupTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "reviewPopupContent", {
        get: function () {
            return this._reviewPopupContent;
        },
        set: function (reviewPopupContent) {
            this._reviewPopupContent = reviewPopupContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "reviewPopupDialogType", {
        get: function () {
            return this._reviewPopupDialogType;
        },
        set: function (reviewPopupDialogType) {
            this._reviewPopupDialogType = reviewPopupDialogType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "linkAnnotations", {
        get: function () {
            return this._linkAnnotations;
        },
        set: function (linkAnnotations) {
            this._linkAnnotations = linkAnnotations;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "linkAnnotationsToRemove", {
        get: function () {
            return this._linkAnnotationsToRemove;
        },
        set: function (linkAnnotationsToRemove) {
            this._linkAnnotationsToRemove = linkAnnotationsToRemove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "itemsWhichCantUnlink", {
        get: function () {
            return this._itemsWhichCantUnlink;
        },
        set: function (itemsWhichCantUnlink) {
            this._itemsWhichCantUnlink = itemsWhichCantUnlink;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "exceptionData", {
        get: function () {
            return this._exceptionData;
        },
        set: function (exceptionData) {
            this._exceptionData = exceptionData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "slaoFlagAsSeenClickedPageNumber", {
        get: function () {
            return this._slaoFlagAsSeenClickedPageNumber;
        },
        set: function (slaoFlagAsSeenClickedPageNumber) {
            this._slaoFlagAsSeenClickedPageNumber = slaoFlagAsSeenClickedPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "unKnownContentFlagAsSeenClickedPageNumber", {
        get: function () {
            return this._unKnownContentFlagAsSeenClickedPageNumber;
        },
        set: function (unKnownContentFlagAsSeenClickedPageNumber) {
            this._unKnownContentFlagAsSeenClickedPageNumber = unKnownContentFlagAsSeenClickedPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnManagedSLAOPopupRendered", {
        get: function () {
            return this._isUnManagedSLAOPopupRendered;
        },
        set: function (isUnManagedSLAOPopupRendered) {
            this._isUnManagedSLAOPopupRendered = isUnManagedSLAOPopupRendered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnManagedImageZonePopupRendered", {
        get: function () {
            return this._isUnManagedImageZonePopupRendered;
        },
        set: function (isUnManagedImageZonePopupRendered) {
            this._isUnManagedImageZonePopupRendered = isUnManagedImageZonePopupRendered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPromoteToSeedConfirmationDialogVisible", {
        get: function () {
            return this._isPromoteToSeedConfirmationDialogVisible;
        },
        set: function (isPromoteToSeedConfirmationDialogVisible) {
            this._isPromoteToSeedConfirmationDialogVisible = isPromoteToSeedConfirmationDialogVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "ispromoteToReuseConfirmationDialogVisible", {
        get: function () {
            return this._ispromoteToReuseConfirmationDialogVisible;
        },
        set: function (ispromoteToReuseConfirmationDialogVisible) {
            this._ispromoteToReuseConfirmationDialogVisible = ispromoteToReuseConfirmationDialogVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPrevMarkListColumnVisible", {
        get: function () {
            return this._isPrevMarkListColumnVisible;
        },
        set: function (isPrevMarkListColumnVisible) {
            this._isPrevMarkListColumnVisible = isPrevMarkListColumnVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPrevMarkListUnChecked", {
        get: function () {
            return this._isPrevMarkListUnChecked;
        },
        set: function (isPrevMarkListUnChecked) {
            this._isPrevMarkListUnChecked = isPrevMarkListUnChecked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnknownContentManagedConfirmationPopupButtonClicked", {
        get: function () {
            return this._isUnknownContentManagedConfirmationPopupButtonClicked;
        },
        set: function (isUnknownContentManagedConfirmationPopupButtonClicked) {
            this._isUnknownContentManagedConfirmationPopupButtonClicked = isUnknownContentManagedConfirmationPopupButtonClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isAllSLAOManagedConfirmationPopupButtonClicked", {
        get: function () {
            return this._isAllSLAOManagedConfirmationPopupButtonClicked;
        },
        set: function (isAllSLAOManagedConfirmationPopupButtonClicked) {
            this._isAllSLAOManagedConfirmationPopupButtonClicked = isAllSLAOManagedConfirmationPopupButtonClicked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isAllSLAOManagedConfirmationPopupRendered", {
        get: function () {
            return this._isAllSLAOManagedConfirmationPopupRendered;
        },
        set: function (isAllSLAOManagedConfirmationPopupRendered) {
            this._isAllSLAOManagedConfirmationPopupRendered = isAllSLAOManagedConfirmationPopupRendered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnknownContentManagedConfirmationPopupRendered", {
        get: function () {
            return this._isUnknownContentManagedConfirmationPopupRendered;
        },
        set: function (isUnknownContentManagedConfirmationPopupRendered) {
            this._isUnknownContentManagedConfirmationPopupRendered = isUnknownContentManagedConfirmationPopupRendered;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "crmFeedConfirmationPopupVisible", {
        get: function () {
            return this._crmFeedConfirmationPopupVisible;
        },
        set: function (crmFeedConfirmationPopupVisible) {
            this._crmFeedConfirmationPopupVisible = crmFeedConfirmationPopupVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "creatExceptionReturnWithdrwnResponseErrorPopupVisible", {
        get: function () {
            return this._creatExceptionReturnWithdrwnResponseErrorPopupVisible;
        },
        set: function (creatExceptionReturnWithdrwnResponseErrorPopupVisible) {
            this._creatExceptionReturnWithdrwnResponseErrorPopupVisible = creatExceptionReturnWithdrwnResponseErrorPopupVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "withdrwnResponseErrorPopupVisible", {
        get: function () {
            return this._withdrwnResponseErrorPopupVisible;
        },
        set: function (withdrwnResponseErrorPopupVisible) {
            this._withdrwnResponseErrorPopupVisible = withdrwnResponseErrorPopupVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "withdrawScriptInStmErrorPopUpVisible", {
        get: function () {
            return this._withdrawScriptInStmErrorPopUpVisible;
        },
        set: function (isVisible) {
            this._withdrawScriptInStmErrorPopUpVisible = isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPromoteToSeedErrorDialogVisible", {
        get: function () {
            return this._isPromoteToSeedErrorDialogVisible;
        },
        set: function (isPromoteToSeedErrorDialogVisible) {
            this._isPromoteToSeedErrorDialogVisible = isPromoteToSeedErrorDialogVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "promoteToSeedErrorPopupData", {
        get: function () {
            return this._promoteToSeedErrorPopupData;
        },
        set: function (promoteToSeedErrorPopupData) {
            this._promoteToSeedErrorPopupData = promoteToSeedErrorPopupData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isPromoteToSeedRemarkConfirmationDialogVisible", {
        get: function () {
            return this._isPromoteToSeedRemarkConfirmationDialogVisible;
        },
        set: function (isPromoteToSeedRemarkConfirmationDialogVisible) {
            this._isPromoteToSeedRemarkConfirmationDialogVisible = isPromoteToSeedRemarkConfirmationDialogVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "promoteToSeedDialogType", {
        get: function () {
            return this._promoteToSeedDialogType;
        },
        set: function (promoteToSeedDialogType) {
            this._promoteToSeedDialogType = promoteToSeedDialogType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isSLAOManaged", {
        get: function () {
            return this._isSLAOManaged;
        },
        set: function (isSLAOManaged) {
            this._isSLAOManaged = isSLAOManaged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnknownContentManaged", {
        get: function () {
            return this._isUnknownContentManaged;
        },
        set: function (isUnknownContentManaged) {
            this._isUnknownContentManaged = isUnknownContentManaged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "hasOnPageComments", {
        get: function () {
            return this._hasOnPageComments;
        },
        set: function (hasOnPageComments) {
            this._hasOnPageComments = hasOnPageComments;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "currentImageZones", {
        get: function () {
            return this._currentImageZones;
        },
        set: function (currentImageZones) {
            this._currentImageZones = currentImageZones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "doApplyLinkingScenarios", {
        get: function () {
            return this._doApplyLinkingScenarios;
        },
        set: function (doApplyLinkingScenarios) {
            this._doApplyLinkingScenarios = doApplyLinkingScenarios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "combinedWarningMessages", {
        get: function () {
            return this._combinedWarningMessages;
        },
        set: function (combinedWarningMessages) {
            this._combinedWarningMessages = combinedWarningMessages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "linkedPagesByPreviousMarkers", {
        get: function () {
            return this._linkedPagesByPreviousMarkers;
        },
        set: function (linkedPagesByPreviousMarkers) {
            this._linkedPagesByPreviousMarkers = linkedPagesByPreviousMarkers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "multipleMarkSchemes", {
        get: function () {
            return this._multipleMarkSchemes;
        },
        set: function (multipleMarkSchemes) {
            this._multipleMarkSchemes = multipleMarkSchemes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isToolBarPanelVisible", {
        get: function () {
            return this._isToolBarPanelVisible;
        },
        set: function (isToolBarPanelVisible) {
            this._isToolBarPanelVisible = isToolBarPanelVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "storageAdapterHelper", {
        get: function () {
            return this._storageAdapterHelper;
        },
        set: function (storageAdapterHelper) {
            this._storageAdapterHelper = storageAdapterHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isLoadingResponseScreen", {
        get: function () {
            return this._isLoadingResponseScreen;
        },
        set: function (isLoadingResponseScreen) {
            this._isLoadingResponseScreen = isLoadingResponseScreen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isMessagePanelMinimized", {
        get: function () {
            return this._isMessagePanelMinimized;
        },
        set: function (isMessagePanelMinimized) {
            this._isMessagePanelMinimized = isMessagePanelMinimized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "loadImagecontainer", {
        get: function () {
            return this._loadImagecontainer;
        },
        set: function (loadImagecontainer) {
            this._loadImagecontainer = loadImagecontainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "enhancedOffPageClientTokensToBeUpdated", {
        get: function () {
            return this._enhancedOffPageClientTokensToBeUpdated;
        },
        set: function (enhancedOffPageClientTokensToBeUpdated) {
            this._enhancedOffPageClientTokensToBeUpdated = enhancedOffPageClientTokensToBeUpdated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "enhancedOffPageCommentMarkingOperation", {
        get: function () {
            return this._enhancedOffPageCommentMarkingOperation;
        },
        set: function (enhancedOffPageCommentMarkingOperation) {
            this._enhancedOffPageCommentMarkingOperation = enhancedOffPageCommentMarkingOperation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isEnhancedOffPageCommentVisible", {
        get: function () {
            return this._isEnhancedOffPageCommentVisible;
        },
        set: function (isEnhancedOffPageCommentVisible) {
            this._isEnhancedOffPageCommentVisible = isEnhancedOffPageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "enhancedOffPageButtonAction", {
        get: function () {
            return this._enhancedOffPageButtonAction;
        },
        set: function (enhancedOffPageButtonAction) {
            this._enhancedOffPageButtonAction = enhancedOffPageButtonAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "enhancedOffPageCommentDetails", {
        get: function () {
            return this._enhancedOffPageCommentDetails;
        },
        set: function (enhancedOffPageCommentDetails) {
            this._enhancedOffPageCommentDetails = enhancedOffPageCommentDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "enhancedOffPageCommentMarkSchemeToNavigate", {
        get: function () {
            return this._enhancedOffPageCommentMarkSchemeToNavigate;
        },
        set: function (node) {
            this._enhancedOffPageCommentMarkSchemeToNavigate = node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isFromMediaErrorDialog", {
        get: function () {
            return this._isFromMediaErrorDialog;
        },
        set: function (isFromMediaErrorDialog) {
            this._isFromMediaErrorDialog = isFromMediaErrorDialog;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "markSheetContainer", {
        get: function () {
            return this._markSheetContainer;
        },
        set: function (markSheetContainer) {
            this._markSheetContainer = markSheetContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isNotSupportedFileElement", {
        get: function () {
            return this._isNotSupportedFileElement;
        },
        set: function (isNotSupportedFileElement) {
            this._isNotSupportedFileElement = isNotSupportedFileElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isInFullResponseView", {
        get: function () {
            return this._isInFullResponseView;
        },
        set: function (isInFullResponseView) {
            this._isInFullResponseView = isInFullResponseView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "errorViewmoreContent", {
        get: function () {
            return this._errorViewmoreContent;
        },
        set: function (errorViewmoreContent) {
            this._errorViewmoreContent = errorViewmoreContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "switchEnhancedOffPageCommentsDiscardPopupShow", {
        get: function () {
            return this._switchEnhancedOffPageCommentsDiscardPopupShow;
        },
        set: function (switchEnhancedOffPageCommentsDiscardPopupShow) {
            this._switchEnhancedOffPageCommentsDiscardPopupShow = switchEnhancedOffPageCommentsDiscardPopupShow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isCreateNewMessageSelected", {
        /*
         * gets create new message option selected or not
         */
        get: function () {
            return this._isCreateNewMessageSelected;
        },
        /*
         * sets create new message option selected or not
         */
        set: function (createNewMessageSelected) {
            this._isCreateNewMessageSelected = createNewMessageSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerPropertyBase.prototype, "isUnzonedItem", {
        get: function () {
            return this._currentImageZones &&
                (this._currentImageZones.some(function (x) { return x.docStorePageQuestionTagTypeId === 2; }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setting the default values
     */
    ResponseContainerPropertyBase.prototype.setDefaultValues = function () {
        this._combinedWarningMessages = new combinedWarningMessage();
        this._storageAdapterHelper = new storageAdapterHelper();
        this._saveMarksAndAnnotationsErrorDialogContents = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(false);
        this._fileMetadataList = Immutable.List();
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
    };
    return ResponseContainerPropertyBase;
}());
module.exports = ResponseContainerPropertyBase;
//# sourceMappingURL=responsecontainerpropertybase.js.map
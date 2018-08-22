"use strict";
var React = require('react');
var enums = require('../enums');
var Immutable = require('immutable');
var GenericDialog = require('../genericdialog');
var BusyIndicator = require('../busyindicator/busyindicator');
var localeStore = require('../../../stores/locale/localestore');
var Footer = require('../../footer');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var qigStore = require('../../../stores/qigselector/qigstore');
var stringHelper = require('../../../utility/generic/stringhelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var MarkSchemePanel = require('../../markschemestructure/markschemepanel');
var MarkButtonsContainer = require('../../markschemestructure/markbuttonscontainer');
var responseHelper = require('./responsehelper');
var pageLinkHelper = require('../../response/responsescreen/linktopage/pagelinkhelper');
var ToolbarPanel = require('../../response/toolbar/toolbarpanel');
var worklistStore = require('../../../stores/worklist/workliststore');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var messageStore = require('../../../stores/message/messagestore');
var markingStore = require('../../../stores/marking/markingstore');
var enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
var MarkingViewButton = require('../../response/markingviewbutton');
var EnhancedOffpageCommentsContainer = require('../../response/annotations/enhancedoffpagecomments/enhancedoffpagecommentscontainer');
var Header = require('../../header');
var OffPageCommentsContainer = require('../../response/annotations/offpagecomments/offpagecommentcontainer');
var scriptStore = require('../../../stores/script/scriptstore');
var responseStore = require('../../../stores/response/responsestore');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
var copyPreviousMarksAndAnnotationsHelper = require('../../utility/annotation/copypreviousmarksandannotationshelper');
var markingHelper = require('../../../utility/markscheme/markinghelper');
var loggingHelper = require('../../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../loggerhelperconstants');
var messageHelper = require('../message/messagehelper');
var scriptHelper = require('../../../utility/script/scripthelper');
var eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
var messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
var popupHelper = require('../popup/popuphelper');
var navigationLoggingHelper = require('../../utility/navigation/examinernavigationaudithelper');
var StampCursor = require('../../response/responsescreen/cursor/stampcursor');
var enhancedOffPageCommentActionCreator = require('../../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
var responseErrorDialogHelper = require('../popup/responseerrordialoghelper');
var exceptionActionCreator = require('../../../actions/exception/exceptionactioncreator');
var popUpDisplayActionCreator = require('../../../actions/popupdisplay/popupdisplayactioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var keyDownHelper = require('../../../utility/generic/keydownhelper');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
var zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var imagezoneStore = require('../../../stores/imagezones/imagezonestore');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var responseScreenAuditHelper = require('./responsescreenauditlogginghelper');
var stampStore = require('../../../stores/stamp/stampstore');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var constants = require('../constants');
var classNames = require('classnames');
var htmlviewerhelper = require('./htmlviewerhelper');
/**
 * helper  class for response container
 */
var ResponseContainerHelperBase = (function () {
    /**
     * Constructor
     * @param _responseContainerPropertyBase
     * @param renderedOn
     * @param selectedLanguage
     * @param _responseViewMode
     */
    function ResponseContainerHelperBase(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode) {
        var _this = this;
        /*
         * Get the scroll bar width
         */
        this.getscrollbarWidth = function () {
            var clientWidth;
            var additionalToolBarWidth = 0;
            if (_this.responseContainerProperty.markSheetContainer) {
                var offsetWidth = _this.responseContainerProperty.markSheetContainer.offsetWidth;
                if (htmlUtilities.getElementsByClassName('marksheet-container') &&
                    (htmlUtilities.getElementsByClassName('marksheet-container')[0])) {
                    clientWidth = htmlUtilities.getElementsByClassName('marksheet-container')[0].clientWidth;
                    if (_this.responseViewMode !== enums.ResponseViewMode.fullResponseView) {
                        // toolPanelWidth includes both file panel and Annotation panel
                        var toolPanelWidth = htmlUtilities.getElementsByClassName('tool-panel')[0] ?
                            htmlUtilities.getElementsByClassName('tool-panel')[0].clientWidth : 0;
                        additionalToolBarWidth =
                            htmlUtilities.getElementsByClassName('marksheet-container')[0].getBoundingClientRect().left
                                - toolPanelWidth;
                    }
                }
                var scrollBarWidth = offsetWidth - (clientWidth + additionalToolBarWidth);
                return scrollBarWidth;
            }
        };
        /*
         * Mark scheme panel width
         */
        this.getMarkSchemePanelWidth = function (width) {
            if (width) {
                _this.responseContainerProperty.markSchemeWidth = width;
                return width;
            }
        };
        /*
         * Mark buttons container width
         */
        this.getMarkButtonsContainerWidth = function (width) {
            if (width) {
                _this.responseContainerProperty.markButtonWidth = width;
                return width;
            }
        };
        /**
         * Response Message section
         */
        this.setMessagePanelvariables = function () {
            _this.responseContainerProperty.messageType = enums.MessageType.ResponseCompose;
            _this.responseContainerProperty.responseId = responseStore.instance.selectedDisplayId.toString();
            if (worklistStore.instance.isMarkingCheckMode) {
                // Selected examiner name and id should be set for sending message in Marking Check mode.
                var selectedMarkingCheckExaminer = worklistStore.instance.selectedMarkingCheckExaminer;
                _this.responseContainerProperty.examinerIdForSendMessage = selectedMarkingCheckExaminer.fromExaminerID;
                _this.responseContainerProperty.examinerNameForSendMessage = stringFormatHelper.getFormattedExaminerName(selectedMarkingCheckExaminer.toExaminer.initials, selectedMarkingCheckExaminer.toExaminer.surname);
            }
            else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                if (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup) {
                    _this.responseContainerProperty.examinerIdForSendMessage = standardisationSetupStore.instance.getProvisionalExaminerId(markingStore.instance.selectedDisplayId);
                    _this.responseContainerProperty.examinerNameForSendMessage = stringFormatHelper.getFormattedExaminerName(standardisationSetupStore.instance.getProvisionalMarkerInitials(markingStore.instance.selectedDisplayId), standardisationSetupStore.instance.getProvisionalMarkerSurName(markingStore.instance.selectedDisplayId));
                }
                else {
                    _this.responseContainerProperty.examinerIdForSendMessage = examinerStore.instance.getMarkerInformation.esReviewerExaminerId;
                    _this.responseContainerProperty.examinerNameForSendMessage = examinerStore.instance.formattedEsReviewerName;
                }
            }
            else {
                _this.responseContainerProperty.examinerIdForSendMessage = examinerStore.instance.getMarkerInformation.supervisorExaminerId;
                _this.responseContainerProperty.examinerNameForSendMessage = examinerStore.instance.formattedSupervisorName;
            }
        };
        /*
         * set the css style of message
         */
        this.setCssStyle = function () {
            if (_this.responseViewMode === enums.ResponseViewMode.fullResponseView) {
                _this.responseContainerProperty.cssMessageStyle = { right: _this.responseContainerProperty.scrollBarWidth };
            }
            else {
                _this.responseContainerProperty.cssMessageStyle = { right: _this.responseContainerProperty.resizedWidth };
            }
        };
        /**
         * get file list component.
         */
        this.fileList = function (markGroupId, selectedLanguage) {
            return null;
        };
        /**
         * methode which executes on off page comment action buttons click
         */
        this.onEnhancedOffPageActionButtonsClicked = function (buttonAction, enhancedOffPageCommentPopUpReRender, clientToken, isCommentVisible, markSchemeToNavigate) {
            _this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated = new Array();
            _this.responseContainerProperty.enhancedOffPageCommentMarkingOperation = enums.MarkingOperation.none;
            _this.responseContainerProperty.enhancedOffPageButtonAction = buttonAction;
            _this.responseContainerProperty.isEnhancedOffPageCommentVisible = isCommentVisible;
            _this.responseContainerProperty.enhancedOffPageCommentMarkSchemeToNavigate = markSchemeToNavigate;
            switch (buttonAction) {
                case enums.EnhancedOffPageCommentAction.Close:
                case enums.EnhancedOffPageCommentAction.Visibility:
                case enums.EnhancedOffPageCommentAction.MarkSchemeNavigation:
                    _this.enhanceOffPageCommentVisibilityAction(enhancedOffPageCommentPopUpReRender);
                    break;
                case enums.EnhancedOffPageCommentAction.Delete:
                    _this.enhanceOffPageCommentDeleteButtonAction(clientToken, enhancedOffPageCommentPopUpReRender);
                    break;
                case enums.EnhancedOffPageCommentAction.Save:
                    _this.enhanceOffPageCommentSaveButtonAction(clientToken, enhancedOffPageCommentPopUpReRender);
                    break;
            }
        };
        /**
         * on click of combined warning message popup primary button
         */
        this.onCombinedWarningPopupPrimaryButtonClick = function (onLeaveResponseClick, reRenderCallback) {
            if (_this.responseContainerProperty.combinedWarningMessages.secondaryButton.trim().length === 0) {
                _this.onCombinedWarningPopupSecondaryButtonClick(reRenderCallback);
            }
            else {
                var actioningWarningMessage = responseErrorDialogHelper.onCombinedWarningPopupAction(true);
                reRenderCallback();
                switch (actioningWarningMessage) {
                    case enums.ResponseWarningPriority.AllPagesNotAnnotated:
                    case enums.ResponseWarningPriority.MarkChangeReasonNeeded:
                    case enums.ResponseWarningPriority.AllMarkedAsNR:
                    case enums.ResponseWarningPriority.NotAllSLAOsAnnotated:
                    case enums.ResponseWarningPriority.SuperVisorRemarkDecisionNeeded:
                    case enums.ResponseWarningPriority.AtleastOneNRWithoutOptionality:
                    case enums.ResponseWarningPriority.AtleastOneNRWithOptionalityUsedInTotal:
                    case enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal:
                    case enums.ResponseWarningPriority.NotAllFilesViewed:
                    case enums.ResponseWarningPriority.FileDownloadedOutside:
                        onLeaveResponseClick();
                        break;
                    case enums.ResponseWarningPriority.UnSentMessage:
                        _this.handlePopUpAction(enums.PopUpType.DiscardMessageNavigateAway, enums.PopUpActionType.Yes);
                        // close the panel
                        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                        break;
                    case enums.ResponseWarningPriority.UnSavedException:
                        _this.handlePopUpAction(enums.PopUpType.DiscardExceptionNavigateAway, enums.PopUpActionType.Yes);
                        // close the panel
                        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
                        break;
                    case enums.ResponseWarningPriority.UnSavedEnhancedOffPageComment:
                        // if we are navigating to menu then we need to close enhanced offpage comment edit view
                        if (_this.responseContainerProperty.navigateTo === enums.SaveAndNavigate.toMenu) {
                            enhancedOffPageCommentActionCreator.onEnhancedOffPageCommentButtonAction(enums.EnhancedOffPageCommentAction.Close);
                        }
                        onLeaveResponseClick();
                        break;
                }
            }
        };
        /**
         * on click of combined warning message popup secondary button
         */
        this.onCombinedWarningPopupSecondaryButtonClick = function (reRenderCallback) {
            var actioningWarningMessage = responseErrorDialogHelper.onCombinedWarningPopupAction();
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.CombinedWarningMessagePopup);
            reRenderCallback();
            markingActionCreator.setMarkEntrySelected(false);
            switch (actioningWarningMessage) {
                case enums.ResponseWarningPriority.AllPagesNotAnnotated:
                case enums.ResponseWarningPriority.MarkChangeReasonNeeded:
                case enums.ResponseWarningPriority.AllMarkedAsNR:
                case enums.ResponseWarningPriority.NotAllSLAOsAnnotated:
                case enums.ResponseWarningPriority.AtleastOneNRWithoutOptionality:
                case enums.ResponseWarningPriority.AtleastOneNRWithOptionalityUsedInTotal:
                case enums.ResponseWarningPriority.AtleastOneNRWithOptionalityNotUsedInTotal:
                case enums.ResponseWarningPriority.SuperVisorRemarkDecisionNeeded:
                case enums.ResponseWarningPriority.NotAllFilesViewed:
                case enums.ResponseWarningPriority.FileDownloadedOutside:
                    _this.onStayInResponseClick();
                    break;
                case enums.ResponseWarningPriority.UnSentMessage:
                    // maximize the panel
                    messagingActionCreator.messageAction(enums.MessageViewAction.Maximize);
                    _this.handlePopUpAction(enums.PopUpType.DiscardMessageNavigateAway, enums.PopUpActionType.No);
                    break;
                case enums.ResponseWarningPriority.UnSavedException:
                    // maximize the panel
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
                    _this.handlePopUpAction(enums.PopUpType.DiscardExceptionNavigateAway, enums.PopUpActionType.No);
                    break;
            }
        };
        /**
         * handle different popup actions
         */
        this.handlePopUpAction = function (popUpType, popUpActionType) {
            switch (popUpActionType) {
                case enums.PopUpActionType.Yes:
                    _this.responseContainerProperty.isExceptionPanelEdited = false;
                    // Perform popup no action
                    popUpDisplayActionCreator.popUpDisplay(popUpType, popUpActionType, messageStore.instance.navigateFrom, {}, true, _this.responseContainerProperty.navigateTo);
                    break;
                case enums.PopUpActionType.No:
                    // Perform popup no action
                    popUpDisplayActionCreator.popUpDisplay(popUpType, popUpActionType, messageStore.instance.navigateFrom, {});
                    break;
            }
        };
        /**
         * Not all page annotated message stay in response click
         */
        this.onStayInResponseClick = function () {
            var actioningWarningMessage = responseErrorDialogHelper.onCombinedWarningPopupAction();
            if (actioningWarningMessage === enums.ResponseWarningPriority.AllPagesNotAnnotated) {
                // Chose the option as true before navigation.
                _this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected = true;
                // moving to full response view.
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            }
            else if (actioningWarningMessage === enums.ResponseWarningPriority.NotAllSLAOsAnnotated) {
                _this.responseContainerProperty.isStayInResponseFRViewModeTriggered = true;
                /* For structured responses if the marker is navigated to FRV,
                 the "Only show unannotated additional pages" filter should be automatically be turned ON */
                _this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = true;
                // moving to full response view.
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            }
            else if (actioningWarningMessage === enums.ResponseWarningPriority.MarkChangeReasonNeeded) {
                markingActionCreator.openMarkChangeReasonPopUp();
            }
            else if (actioningWarningMessage === enums.ResponseWarningPriority.SuperVisorRemarkDecisionNeeded
                && _this.responseViewMode !== enums.ResponseViewMode.fullResponseView) {
                markingActionCreator.openSupervisorRemarkDecisionPopUp();
            }
            else if (actioningWarningMessage === enums.ResponseWarningPriority.AllMarkedAsNR) {
                // For resetting variables in markingstore.
                markingActionCreator.stayInResponse();
            }
            _this.responseContainerProperty.isOnLeaveResponseClick = false;
            _this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
        };
        this.addLinkAnnotation = function (node, childNodes, isChildrenSkipped, annotation) {
            // remove node or its child nodes from the remove annotation collection before adding items
            if (isChildrenSkipped && childNodes) {
                childNodes.map(function (item) {
                    _this.removeItemFromLinkAnnotationLocalCollection(item);
                });
            }
            _this.removeItemFromLinkAnnotationLocalCollection(node);
            var linkAnnotation = _this.responseContainerProperty.linkAnnotations.get(node.uniqueId);
            if (linkAnnotation) {
                // already in the collection. so set the annotation as dirty
                linkAnnotation.isDirty = true;
                linkAnnotation.uniqueId = htmlUtilities.guid;
                linkAnnotation.markingOperation = enums.MarkingOperation.added;
                _this.responseContainerProperty.linkAnnotations = _this.responseContainerProperty.linkAnnotations.set(node.uniqueId, linkAnnotation);
            }
            else {
                _this.responseContainerProperty.linkAnnotations = _this.responseContainerProperty.linkAnnotations.set(node.uniqueId, annotation);
            }
        };
        /**
         * show combined popup message
         */
        this.showCombinedPopupMessage = function (navigateTo, reRenderCallback) {
            _this.responseContainerProperty.combinedWarningMessages = _this.combinedPopupMessages;
            var showPopUp = false;
            if (_this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.length > 0) {
                showPopUp = true;
            }
            // show popup if there are failure response to show
            if (showPopUp) {
                markingActionCreator.removeMarkEntrySelection();
                keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.CombinedWarningMessagePopup);
                reRenderCallback();
                _this.responseContainerProperty.navigateTo = navigateTo;
                if (_this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons[0].priority ===
                    enums.ResponseWarningPriority.MarkChangeReasonNeeded) {
                    _this.responseContainerProperty.isMarkChangeReasonShown = true;
                }
            }
            else {
                popupHelper.navigateAway(navigateTo);
            }
        };
        /**
         * This will display promote to seed confirmation popup.
         */
        this.showPromoteToSeedConfirmationPopup = function () {
            var promoteToSeedArguments = {
                markGroupId: responseStore.instance.selectedMarkGroupId,
                examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                authorisedExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
                markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                responseMode: worklistStore.instance.getResponseMode,
                ignoreRemarks: false,
                isSTMSeed: false,
                examinerId: operationModeHelper.subExaminerId
            };
            responseActionCreator.getRemarkDetailsForPromoteToSeed(promoteToSeedArguments);
        };
        /**
         * Create Supervisor Remark
         */
        this.createSupervisorRemark = function (isWholeResponseRemark, isMarkNow) {
            var remarkMarkGroupIds = new Array();
            var currentMarkGroupId = responseStore.instance.selectedMarkGroupId;
            remarkMarkGroupIds.push(currentMarkGroupId);
            if (isWholeResponseRemark) {
                remarkMarkGroupIds = remarkMarkGroupIds.concat(worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId));
            }
            // For supervisor remark, the examiner id will be set in Gateway with Logged in Examiner Id
            var requestRemarkArguments = {
                markGroupIds: remarkMarkGroupIds,
                remarkTypeId: enums.RemarkRequestType.SupervisorRemark,
                examinerRoleId: operationModeHelper.authorisedExaminerRoleId,
                examinerId: 0,
                worklistType: worklistStore.instance.currentWorklistType,
                responseMode: worklistStore.instance.getResponseMode,
                remarkRequestType: worklistStore.instance.getRemarkRequestType,
                isWholeResponseRemarkRequest: isWholeResponseRemark
            };
            responseActionCreator.createSupervisorRemark(requestRemarkArguments, isMarkNow);
            // Log response supervisor remark creation audit log.
            new responseScreenAuditHelper().logSupervisorRemarkCreationAction(loggerConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION, loggerConstants.RESPONSESCREEN_TYPE_CREATE_SUPERVISOR_REMARK, isMarkNow, requestRemarkArguments);
        };
        /**
         * Scrolls page in to view -FR mode.
         * @param pageNumber
         */
        this.scrollToPageInFRView = function (pageNumber) {
            var top = htmlUtilities.getOffsetTop('img_' + pageNumber, true);
            $('.marksheet-container').scrollTop(top);
        };
        /**
         * Determines visiblity of marking overlay.
         */
        this.doShowMarkingOverlay = function () {
            if (!markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
                var isDigitalFileSelected = _this.isDigitalFileSelected() || htmlviewerhelper.isHtmlComponent;
                /*If no anotations other than off page comments are associated with in a Qig then,
                we need not show the customize toolbar selection option in the response screen.
                So calculate the count of stamps against the Qig and verify that the stamp count > 0 for showing marking overlay  */
                var stampsAgainstCurrentQig = stampStore.instance.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, responseStore.instance.isWholeResponse);
                return stampStore.instance.isFavouriteToolbarEmpty
                    && stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner
                    && !isDigitalFileSelected
                    && _this.responseContainerProperty.isResponseEditable
                    && !(_this.responseContainerProperty.isUnzonedItem &&
                        pageLinkHelper.getAllLinkedItemsAgainstMarkSchemeID(markingStore.instance.currentMarkSchemeId).length === 0)
                    && !_this.responseContainerProperty.isNotSupportedFileElement
                    && !exceptionStore.instance.isExceptionPanelVisible
                    && !messageStore.instance.isMessagePanelVisible
                    && stampsAgainstCurrentQig.count() > 0;
            }
        };
        this.responseContainerProperty = _responseContainerPropertyBase;
        this.renderedOn = renderedOn;
        this.selectedLanguage = selectedLanguage;
        this.responseViewMode = _responseViewMode;
        this.getMarkButtonsContainerWidth = this.getMarkButtonsContainerWidth.bind(this);
    }
    /**
     * this is to set the protected variables used by the helpers
     */
    ResponseContainerHelperBase.prototype.setHelperVariables = function (_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode) {
        this.responseContainerProperty = _responseContainerPropertyBase;
        this.renderedOn = renderedOn;
        this.selectedLanguage = selectedLanguage;
        this.responseViewMode = _responseViewMode;
    };
    /**
     * returns the mark entry validation component
     * @param ismarkEntryPopupVisible
     * @param onValidationMarkUpSucessMessage
     */
    ResponseContainerHelperBase.prototype.markentryValidation = function (ismarkEntryPopupVisible, onValidationMarkUpSucessMessage) {
        var _content = (this.responseContainerProperty.isMarkbyAnnotation ?
            stringHelper.format(localeStore.instance.TranslateText('marking.response.mba-max-mark-exceeded-dialog.body'), [this.responseContainerProperty.maximumNumericMark.toString()]) :
            stringHelper.format(localeStore.instance.TranslateText(this.responseContainerProperty.isNonNumeric ? 'marking.response.invalid-mark-dialog.body-non-numeric' :
                'marking.response.invalid-mark-dialog.body-numeric'), [this.responseContainerProperty.minimumNumericMark.toString(),
                this.responseContainerProperty.maximumNumericMark.toString()]));
        var _header = localeStore.instance.TranslateText(this.responseContainerProperty.isMarkbyAnnotation ?
            'marking.response.mba-max-mark-exceeded-dialog.header' : 'marking.response.invalid-mark-dialog.header');
        var componentProps = {
            content: _content,
            header: _header,
            displayPopup: ismarkEntryPopupVisible,
            okButtonText: localeStore.instance.TranslateText('marking.response.invalid-mark-dialog.ok-button'),
            onOkClick: onValidationMarkUpSucessMessage,
            id: 'markValidationMessage',
            key: 'markWarningMessage',
            popupDialogType: enums.PopupDialogType.MarkEntryValidation
        };
        return React.createElement(GenericDialog, componentProps);
    };
    /**
     * Busy indicator
     * @param responseMode
     * @param isBusy
     * @param autoKillLoadingIndicator
     */
    ResponseContainerHelperBase.prototype.busyIndicator = function (responseMode, isBusy, busyIndicatorInvoker, autoKillLoadingIndicator, selfDistructAt) {
        var componentProps = {
            id: 'response_' + busyIndicatorInvoker.toString(),
            isBusy: isBusy,
            key: 'response_' + busyIndicatorInvoker.toString(),
            isMarkingBusy: true,
            busyIndicatorInvoker: busyIndicatorInvoker,
            showBackgroundScreen: this.responseContainerProperty.showBackgroundScreenOnBusy,
            responseMode: responseMode,
            doShowDialog: this.responseContainerProperty.doShowResposeLoadingDialog,
            selfDistructAt: selfDistructAt,
            initiateSelfDistruction: autoKillLoadingIndicator
        };
        return React.createElement(BusyIndicator, componentProps);
    };
    /**
     * Footer
     * @param isConfirmationPopupDisplaying
     * @param resetLogoutConfirmationSatus
     */
    ResponseContainerHelperBase.prototype.footer = function (isConfirmationPopupDisplaying, resetLogoutConfirmationSatus) {
        var componentProps = {
            id: 'footer',
            key: 'footer',
            footerType: enums.FooterType.Response,
            selectedLanguage: this.selectedLanguage,
            isLogoutConfirmationPopupDisplaying: isConfirmationPopupDisplaying,
            resetLogoutConfirmationSatus: resetLogoutConfirmationSatus
        };
        return React.createElement(Footer, componentProps);
    };
    /**
     * mark scheme Panel
     * @param onEnhancedOffPageDeleteButtonClicked
     * @param onValidateMarkEntry
     * @param onResetMarkConfirm
     * @param showMbQConfirmation
     * @param checkIfAllPagesAreAnnotated
     * @param showCompleteButtonDialog
     * @param onMarkSchemeStructureLoaded
     * @param showAcceptQualityConfirmationDialog
     * @param invokeReviewBusyIndicator
     * @param ismarkEntryPopupVisible
     * @param imagesLoaded
     * @param isPlayerLoaded
     */
    ResponseContainerHelperBase.prototype.markschemePanel = function (onEnhancedOffPageDeleteButtonClicked, onValidateMarkEntry, onResetMarkConfirm, showMbQConfirmation, checkIfAllPagesAreAnnotated, showCompleteButtonDialog, onMarkSchemeStructureLoaded, showAcceptQualityConfirmationDialog, invokeReviewBusyIndicator, ismarkEntryPopupVisible, imagesLoaded, isPlayerLoaded, isPreviousMarksAndAnnotationCopied) {
        var componentProps = {
            id: 'markscheme',
            key: 'markscheme',
            selectedLanguage: this.selectedLanguage,
            loadMarkSchemePanel: this.responseContainerProperty.markSchemeRenderedOn,
            onValidateMarkEntry: onValidateMarkEntry,
            onResetConfirm: onResetMarkConfirm,
            showMbCConfirmationDialog: showMbQConfirmation,
            allPagesNotAnnotatedDialog: checkIfAllPagesAreAnnotated,
            showCompleteButtonDialog: showCompleteButtonDialog,
            onMarkSchemeStructureLoaded: onMarkSchemeStructureLoaded,
            isResponseEditable: this.responseContainerProperty.isResponseEditable,
            showAcceptQualityConfirmationDialog: showAcceptQualityConfirmationDialog,
            getMarkSchemePanelWidth: this.getMarkSchemePanelWidth,
            ismarkEntryPopupVisible: ismarkEntryPopupVisible,
            doEnableMouseWheelEvent: (imagesLoaded || isPlayerLoaded),
            invokeReviewBusyIndicator: invokeReviewBusyIndicator,
            onEnhancedOffPageCommentVisibilityChanged: onEnhancedOffPageDeleteButtonClicked,
            hideAnnotationToggleButton: this.responseContainerProperty.isNotSupportedFileElement || this.isDigitalFileSelected()
                || htmlviewerhelper.isHtmlComponent,
            isPreviousMarksAndAnnotationCopied: isPreviousMarksAndAnnotationCopied
        };
        return React.createElement(MarkSchemePanel, componentProps);
    };
    /**
     * returns the marks cheme panel width
     */
    ResponseContainerHelperBase.prototype.getMarkSchemeWidth = function () {
        var width = 0;
        if (document.getElementsByClassName('marking-question-panel') &&
            document.getElementsByClassName('marking-question-panel')[0]) {
            width = document.getElementsByClassName('marking-question-panel')[0].clientWidth;
        }
        return width;
    };
    /**
     * returns the mark button container element
     */
    ResponseContainerHelperBase.prototype.markButtonsContainer = function () {
        if (this.responseContainerProperty.isResponseEditable && !this.responseContainerProperty.isMarkbyAnnotation) {
            var componentProps = {
                selectedLanguage: this.selectedLanguage,
                parentHeight: this.responseContainerProperty.responseContainerHeight,
                renderedOn: this.responseContainerProperty.markButtonRenderedOn,
                getMarkButtonsContainerWidth: this.getMarkButtonsContainerWidth,
                isUnzoned: (this.responseContainerProperty.isUnzonedItem &&
                    pageLinkHelper.getAllLinkedItemsAgainstMarkSchemeID(markingStore.instance.currentMarkSchemeId).length === 0)
            };
            return React.createElement(MarkButtonsContainer, componentProps);
        }
        return null;
    };
    /**
     * Set scroll position
     * @returns
     */
    ResponseContainerHelperBase.prototype.getScrollPosition = function () {
        var height = this.responseContainerProperty.scrollToTopOf;
        if (this.responseContainerProperty.scrollToSuppressArea) {
            var suppressedLimit = this.responseContainerProperty.scriptHelper.getFirstVisibleImageSuppressOffset();
            if ($('.marksheet-holder ').length > 0) {
                height = ($('.marksheet-holder ')[0].clientHeight * (suppressedLimit / 100)) + 10;
            }
            this.responseContainerProperty.scrollToSuppressArea = false;
        }
        return height;
    };
    /**
     * call back of lintopage popup ok button click
     * @param doShowPopup
     */
    ResponseContainerHelperBase.prototype.doShowLinkToPageOkClickPopup = function (doShowPopup) {
        var _this = this;
        this.responseContainerProperty.linkAnnotationsToRemove.map(function (item) {
            var isAnnotationAddedAgainstItem = pageLinkHelper.isAnnotationAddedAgainstPage(_this.responseContainerProperty.currentPageNumber, item);
            if (isAnnotationAddedAgainstItem) {
                _this.responseContainerProperty.itemsWhichCantUnlink.push(markingStore.instance.toolTip(item));
                if (!doShowPopup) {
                    doShowPopup = true;
                }
            }
        });
        return doShowPopup;
    };
    /**
     * updateMarkingOperationOfAnnotation
     */
    ResponseContainerHelperBase.prototype.updateMarkingOperationOfAnnotation = function () {
        var _this = this;
        // set the marking operation to 3 for the annotations set for delete
        this.responseContainerProperty.linkAnnotationsToRemove.map(function (item) {
            var annotation = _this.responseContainerProperty.linkAnnotations.get(item);
            if (annotation) {
                annotation.markingOperation = enums.MarkingOperation.deleted;
                _this.responseContainerProperty.linkAnnotations = _this.responseContainerProperty.linkAnnotations.set(item, annotation);
            }
        });
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "isHideStampIcon", {
        /**
         * property which returns is to hide stamp icon
         */
        get: function () {
            return (!this.responseContainerProperty.isResponseEditable ||
                !this.responseContainerProperty.isToolBarPanelVisible || this.responseContainerProperty.isNotSupportedFileElement ||
                this.isDigitalFileSelected() || htmlviewerhelper.isHtmlComponent);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * toolbarPanel element
     * @param renderedOnECourseWorkFiles
     * @param onMarkingModeButtonClick
     * @param onMessageSelected
     * @param onCreateNewMessageSelected
     * @param onMessageReadStatusRequireUpdation
     * @param onExceptionSelected
     * @param onCreateNewExceptionClicked
     * @param onRemarkNowButtonClicked
     * @param onPromoteToSeedButtonClicked
     * @param onRemarkLaterButtonClicked
     * @param onPromoteToReuseButtonClicked
     * @param showRejectRigConfirmationPopUp
     * @param setHasMultipleToolbarColumns
     */
    ResponseContainerHelperBase.prototype.toolbarPanel = function (renderedOnECourseWorkFiles, onMarkingModeButtonClick, onMessageSelected, onCreateNewMessageSelected, onMessageReadStatusRequireUpdation, onExceptionSelected, onCreateNewExceptionClicked, onRemarkNowButtonClicked, onPromoteToSeedButtonClicked, onRemarkLaterButtonClicked, onPromoteToReuseButtonClicked, showRejectRigConfirmationPopUp, setHasMultipleToolbarColumns, doDisableMarkingOverlay, onDiscardStandardisationResponseIconClicked) {
        var isNewMessageButtonHidden = false;
        var isDiscardResponseButtonVisible = false;
        // when the examiner has no supervisor and when not in marking check
        if ((!worklistStore.instance.isMarkingCheckMode && examinerStore.instance.parentExaminerId === 0) &&
            !markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
            !markerOperationModeFactory.operationMode.isClassifiedTabInStdSetup) {
            isNewMessageButtonHidden = true;
        }
        else if ((markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup ||
            markerOperationModeFactory.operationMode.isClassifiedTabInStdSetup) &&
            (qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer) &&
            ((examinerStore.instance.getMarkerInformation.examinerId ===
                standardisationSetupStore.instance.getProvisionalExaminerId(markingStore.instance.selectedDisplayId)) ||
                (examinerStore.instance.getMarkerInformation.examinerRoleId ===
                    standardisationSetupStore.instance.getDefinitiveExaminerRoleId(markingStore.instance.selectedDisplayId)))) {
            //if logged in user is PE/APE in StandardisationSetupMode and opens his own provisional response then 
            //hide create new message button
            isNewMessageButtonHidden = true;
        }
        else if ((markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup ||
            markerOperationModeFactory.operationMode.isClassifiedTabInStdSetup) &&
            !(qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer)) {
            //if logged in user is not PE/APE in StandardisationSetupMode hide create new message button
            isNewMessageButtonHidden = true;
        }
        var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            this.responseContainerProperty.responseData.esMarkGroupId :
            this.responseContainerProperty.responseData.markGroupId;
        var isStandardisationSetUpComplete = qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete;
        var isClassifiedResponseWorklist = standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse
            || (enums.StandardisationSetup.UnClassifiedResponse ===
                standardisationSetupStore.instance.selectedStandardisationSetupWorkList &&
                standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives)
            || (isClassifiedResponseWorklist && !isStandardisationSetUpComplete && this.hasEditDefinitivesPermission)) {
            isDiscardResponseButtonVisible = true;
        }
        var componentProps = {
            selectedLanguage: this.selectedLanguage,
            id: 'toolbarpanel',
            key: 'toolbarpanel',
            onFullResponseClick: onMarkingModeButtonClick,
            // Make Response editable only if it does not contain any open message/exception window.
            hideStampPanelIcon: this.isHideStampIcon,
            onMessageSelected: onMessageSelected,
            selectedMessageId: (this.responseContainerProperty.selectedMsg ?
                this.responseContainerProperty.selectedMsg.examinerMessageId : 0),
            onCreateNewMessageSelected: onCreateNewMessageSelected,
            onMessageReadStatusReflected: onMessageReadStatusRequireUpdation,
            onExceptionSelected: onExceptionSelected,
            onCreateNewExceptionClicked: onCreateNewExceptionClicked,
            isNewMessageButtonHidden: isNewMessageButtonHidden,
            onRemarkNowButtonClicked: onRemarkNowButtonClicked,
            onRemarkLaterButtonClicked: onRemarkLaterButtonClicked,
            onPromoteToSeedButtonClicked: onPromoteToSeedButtonClicked,
            onPromoteToReuseButtonClicked: onPromoteToReuseButtonClicked,
            selectedResponseViewMode: this.responseViewMode,
            onRejectRigClick: showRejectRigConfirmationPopUp,
            fileList: this.fileList(!markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
                ? markGroupId :
                standardisationSetupStore.instance.selectedResponseId, this.selectedLanguage),
            renderedOn: renderedOnECourseWorkFiles,
            isDigitalFileSelected: this.responseContainerProperty.isNotSupportedFileElement
                || this.isDigitalFileSelected() || htmlviewerhelper.isHtmlComponent,
            hasMultipleColumns: setHasMultipleToolbarColumns,
            isECourseWorkResponse: this.isECourseworkComponent(),
            isUnzoned: (this.responseContainerProperty.isUnzonedItem &&
                pageLinkHelper.getLinkedAnnotationAgainstQuestionItem(markingStore.instance.currentMarkSchemeId, pageLinkHelper.doShowPreviousMarkerLinkedPages).length === 0),
            doDisableMarkingOverlay: doDisableMarkingOverlay,
            isOverlayAnnotationsVisible: responseHelper.isOverlayAnnotationsVisible && !htmlviewerhelper.isHtmlComponent,
            isMessagePanelVisible: messageStore.instance.isMessagePanelVisible,
            isDiscardResponseButtonVisible: isDiscardResponseButtonVisible,
            onDiscardStandardisationResponseIconClicked: onDiscardStandardisationResponseIconClicked
        };
        if (!responseHelper.hasUnManagedSLAOInMarkingMode && !this.hasUnManagedImageZone()) {
            return React.createElement(ToolbarPanel, componentProps);
        }
        else {
            return null;
        }
    };
    /**
     * markingViewButton element
     * @param onMarkingViewButtonClick
     * @param onChangeViewClick
     * @param markingMethod
     * @param onShowAnnotatedPagesOptionChanged
     * @param onShowAllPagesOfScriptOptionChanged
     * @param onExceptionSelected
     * @param onCreateNewExceptionClicked
     * @param showRejectRigConfirmationPopUp
     * @param onShowUnAnnotatedAdditionalPagesOptionChanged
     */
    ResponseContainerHelperBase.prototype.markingViewButton = function (onMarkingViewButtonClick, onChangeViewClick, markingMethod, onShowAnnotatedPagesOptionChanged, onShowAllPagesOfScriptOptionChanged, onExceptionSelected, onCreateNewExceptionClicked, showRejectRigConfirmationPopUp, onShowUnAnnotatedAdditionalPagesOptionChanged, isDisplayAnnotationsInFullResponseView, hasUnknownContent) {
        if (this.responseViewMode === enums.ResponseViewMode.fullResponseView) {
            var componentProps = {
                selectedLanguage: this.selectedLanguage,
                id: 'markingViewButton',
                key: 'markingViewButton',
                onMarkingViewButtonClick: onMarkingViewButtonClick,
                onChangeViewClick: onChangeViewClick,
                fullResponseOption: this.responseContainerProperty.fullResponseOptionValue,
                componentType: markingMethod,
                showAnnotatedPagesOptionSelected: this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected,
                showAnnotatedPagesOptionChanged: onShowAnnotatedPagesOptionChanged,
                showAllPagesOfScriptOptionSelected: this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected,
                showAllPagesOfScriptOptionChanged: onShowAllPagesOfScriptOptionChanged,
                hasUnManagedSLAO: (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) ?
                    !this.responseContainerProperty.isSLAOManaged : false,
                onExceptionSelected: onExceptionSelected,
                onCreateNewExceptionClicked: onCreateNewExceptionClicked,
                onRejectRigClick: showRejectRigConfirmationPopUp,
                displayAnnotations: isDisplayAnnotationsInFullResponseView,
                isECourseWorkResponse: this.isECourseworkComponent(),
                showUnAnnotatedAdditionalPagesOptionSelected: this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected,
                showUnAnnotatedAdditionalPagesOptionChanged: onShowUnAnnotatedAdditionalPagesOptionChanged,
                hasUnManagedImageZone: (responseHelper.isEbookMarking ?
                    (hasUnknownContent && !this.responseContainerProperty.isUnknownContentManaged &&
                        !this.hasUnManagedImageZoneInRemark()) : false)
            };
            return React.createElement(MarkingViewButton, componentProps);
        }
        return null;
    };
    /**
     * enhancedOffPageComments component
     * @param isEnhancedOffPageCommentsPanelVisible
     * @param onEnhancedOffPageActionButtonsClicked
     * @param updateEnhancedOffPageCommentDetails
     * @param renderedOnECourseWorkFiles
     * @param hasMultipleToolbarColumns
     * @param renderedOnEnhancedOffpageComments
     */
    ResponseContainerHelperBase.prototype.enhancedOffPageComments = function (isEnhancedOffPageCommentsPanelVisible, onEnhancedOffPageActionButtonsClicked, updateEnhancedOffPageCommentDetails, renderedOnECourseWorkFiles, hasMultipleToolbarColumns, renderedOnEnhancedOffpageComments) {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            var componentProps = {
                id: 'enhanced-off-pge-comments',
                key: 'enhanced-off-pge-comments',
                isVisible: isEnhancedOffPageCommentsPanelVisible,
                selectedLanguage: this.selectedLanguage,
                onEnhanceOffPageCommentButtonClicked: onEnhancedOffPageActionButtonsClicked,
                updateEnhancedOffPageCommentDetails: updateEnhancedOffPageCommentDetails,
                enhancedOffPageCommentDetails: this.responseContainerProperty.enhancedOffPageCommentDetails,
                renderedOn: renderedOnECourseWorkFiles,
                hasMultipleToolbarColumn: hasMultipleToolbarColumns,
                renderedOnDataUpdate: renderedOnEnhancedOffpageComments,
                isStampPanelVisible: !(!this.responseContainerProperty.isResponseEditable ||
                    !this.responseContainerProperty.isToolBarPanelVisible ||
                    this.responseContainerProperty.isNotSupportedFileElement ||
                    this.isDigitalFileSelected() || htmlviewerhelper.isHtmlComponent)
            };
            return React.createElement(EnhancedOffpageCommentsContainer, componentProps);
        }
        return null;
    };
    /**
     * Hide annotation and zoom panel for Audio and Video.
     */
    ResponseContainerHelperBase.prototype.isDigitalFileSelected = function () {
        return false;
    };
    /**
     * offPageComments element
     * @param isExceptionPanelVisible
     */
    ResponseContainerHelperBase.prototype.offPageComments = function (isExceptionPanelVisible) {
        var isOffPageCommentConfigured = markerOperationModeFactory.operationMode.isOffPageCommentConfigured;
        var isOffPageCommentVisible = markerOperationModeFactory.operationMode.isOffPageCommentVisibleForSelectedQig;
        // Rendering offpage comment for whole response even though it is not configured. Visibilty is set to false if not configured.
        // This is to handle the situtaion when off page comment is configured for some qigs and 
        // not configured for others in an whole response.
        if ((isOffPageCommentConfigured || responseStore.instance.isWholeResponse)
            && (this.responseViewMode !== enums.ResponseViewMode.fullResponseView)
            && !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            var componentProps = {
                id: 'off-page-comments',
                key: 'off-page-comments',
                isVisible: isOffPageCommentConfigured && isOffPageCommentVisible
                    && (!this.responseContainerProperty.isMessagePanelVisible ||
                        this.responseContainerProperty.isMessagePanelMinimized) &&
                    (!isExceptionPanelVisible || this.responseContainerProperty.isExceptionPanelMinimized),
                selectedLanguage: this.selectedLanguage
            };
            return React.createElement(OffPageCommentsContainer, componentProps);
        }
        return null;
    };
    /**
     * returns the header element
     */
    ResponseContainerHelperBase.prototype.header = function () {
        var componentProps = {
            id: 'header',
            key: 'header',
            selectedLanguage: this.selectedLanguage,
            containerPage: enums.PageContainers.Response,
            unReadMessageCount: this.responseContainerProperty.unReadMessageCount
        };
        return React.createElement(Header, componentProps);
    };
    /**
     * returns whether all pages are annotated or not
     */
    ResponseContainerHelperBase.prototype.hasAllAdditionalPagesAnnotated = function () {
        var hasAllAdditionalPagesAnnotated = true;
        this.responseContainerProperty.fileMetadataList.map(function (fileMetadata) {
            if (scriptStore.instance.getAdditionalObjectFlagValue(fileMetadata.pageNumber) &&
                !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(fileMetadata.pageNumber, false)) {
                hasAllAdditionalPagesAnnotated = false;
            }
        });
        return hasAllAdditionalPagesAnnotated;
    };
    /**
     * class name
     * @param hasElementsToRenderInFRV
     */
    ResponseContainerHelperBase.prototype.getClassName = function (hasElementsToRenderInFRV) {
        var className = classNames('marksheets-inner', { 'thumb-view': this.responseContainerProperty.isInFullResponseView }, { 'unstructured': !this.responseContainerProperty.imageZonesCollection }, { 'structured': this.responseContainerProperty.imageZonesCollection }, {
            'all-annotated': (this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected && !hasElementsToRenderInFRV) ||
                (this.hasAllAdditionalPagesAnnotated() &&
                    this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected)
        }, { 'filtered-view e-coursework': this.isECourseworkComponent() }, {
            'filtered-view': responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured &&
                !responseHelper.isEbookMarking ?
                false :
                this.canDisplayFilteredViewInFRV
        });
        return className;
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "canDisplayFilteredViewInFRV", {
        /**
         * Check whether the filtered-view class can be applied in FRV
         */
        get: function () {
            return ((!this.responseContainerProperty.isSLAOManaged &&
                !this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected) ||
                this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected ||
                (!this.responseContainerProperty.isUnknownContentManaged &&
                    !this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copying previous marks and annotations
     */
    ResponseContainerHelperBase.prototype.copyPrevMarksAndAnnotations = function () {
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.open ||
            markingStore.instance.currentResponseMode === enums.ResponseMode.pending) {
            if (markingStore.instance.currentMarkGroupId &&
                (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark ||
                    worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark)
                && markingStore.instance.examinerMarksAgainstCurrentResponse
                && !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                if (markingStore.instance.examinerMarksAgainstCurrentResponse.examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations) {
                    // If the previous marks and annotations are not copied or not in copying mode,
                    //then copy previous marks and annotations once.
                    if (copyPreviousMarksAndAnnotationsHelper.allowCopyPreviousMarks() &&
                        !this.responseContainerProperty.isPreviousMarksAndAnnotationCopied &&
                        !this.responseContainerProperty.isPreviousMarksAndAnnotationCopying) {
                        this.responseContainerProperty.isPreviousMarksAndAnnotationCopying = true;
                        var that = this;
                        copyPreviousMarksAndAnnotationsHelper.copyPreviousMarksAndAnnotations(function (annotation) {
                            that.logAnnoataionModificationAction(loggerConstants.MARKENTRY_TYPE_ANNOTATION_ADD_COPYMARK, annotation);
                        });
                        // Rerender markschemepanel when marks and annotations copying completed.
                        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
                    }
                    // Updating the total mark and progress in store when we copy the previous marks and annotation.
                    if (this.responseContainerProperty.markDetails === undefined) {
                        var treeViewItem = this.responseContainerProperty.treeViewHelper.treeViewItem();
                        this.responseContainerProperty.markDetails = this.responseContainerProperty.treeViewHelper.totalMarkAndProgress;
                        if (this.responseContainerProperty.markDetails) {
                            var isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
                            markingActionCreator.updateMarkingDetails(this.responseContainerProperty.markDetails, isAllPagesAnnotated);
                        }
                    }
                }
            }
        }
    };
    /**
     * Log annoatation modification actions
     * @param actionType
     * @param annotation
     */
    ResponseContainerHelperBase.prototype.logAnnoataionModificationAction = function (actionType, annotation) {
        // Log the mark copied details
        new loggingHelper().logAnnotationModifiedAction(loggerConstants.MARKENTRY_REASON_ANNOTATION_CHANGED, actionType, annotation, markingStore.instance.currentMarkGroupId, markingStore.instance.currentMarkSchemeId);
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "combinedPopupMessages", {
        /**
         * get the combined popup message
         */
        get: function () {
            var _this = this;
            this.responseContainerProperty.combinedWarningMessages = markingStore.instance.combinedWarningMessage;
            // remove UnSavedException failure reason if the panel is not edited
            if (!this.responseContainerProperty.isExceptionPanelEdited) {
                this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.map(function (message) {
                    if (message.priority === enums.ResponseWarningPriority.UnSavedException) {
                        var index = _this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.indexOf(message);
                        _this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.splice(index, 1);
                    }
                });
                // close the panel.
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
            }
            // remove UnSentMessage failure reason if the panel is not edited
            if (!messageStore.instance.isMessagePanelActive ||
                !messageHelper.isMessagePanelEdited(this.responseContainerProperty.messageType, null, null)) {
                this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.map(function (message) {
                    if (message.priority === enums.ResponseWarningPriority.UnSentMessage) {
                        var index = _this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.indexOf(message);
                        _this.responseContainerProperty.combinedWarningMessages.responseNavigateFailureReasons.splice(index, 1);
                    }
                });
            }
            return this.responseContainerProperty.combinedWarningMessages;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get linked pages for previous marker
     */
    ResponseContainerHelperBase.prototype.getPreviousMarkerLinkedPages = function () {
        var linkedAnnotations = [];
        var linkedPages = [];
        if (markingStore && pageLinkHelper.doShowPreviousMarkerLinkedPages && markingStore.instance.currentMarkSchemeId) {
            var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
            if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0) {
                var allMarksAndAnnotations_1 = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                    .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
                var tree = this.responseContainerProperty.treeViewHelper.treeViewItem();
                var multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(tree, markingStore.instance.currentMarkSchemeId, true);
                if (allMarksAndAnnotations_1 && multipleMarkSchemes) {
                    multipleMarkSchemes.treeViewItemList.map(function (treeViewItem) {
                        allMarksAndAnnotations_1.map(function (item, index) {
                            // index 0 is for current marking.
                            if (index > 0) {
                                linkedAnnotations = linkedAnnotations.concat(pageLinkHelper.getLinkedAnnotationsFromPreviousMarks(index, treeViewItem.uniqueId));
                            }
                        });
                    });
                }
            }
        }
        linkedAnnotations = linkedAnnotations.filter(function (item) { return item !== undefined; });
        linkedAnnotations.map(function (annotation) {
            if (linkedPages.indexOf(annotation.pageNo) === -1) {
                linkedPages.push(annotation.pageNo);
            }
        });
        return linkedPages;
    };
    /**
     * reset and set the variables beforw openinga response
     */
    ResponseContainerHelperBase.prototype.resetVariablesForOpenResponse = function (loadImagesCallback) {
        // Initiate the helper class
        // Get the image zones for the first mark scheme and get the image cluster id
        this.responseContainerProperty.scriptHelper = new scriptHelper();
        // reset value while opening response. its Value will be determined by the types of files in the response
        this.responseContainerProperty.loadImagecontainer = false;
        this.responseContainerProperty.isUnManagedSLAOPopupRendered = false;
        this.responseContainerProperty.isUnManagedImageZonePopupRendered = false;
        this.responseContainerProperty.iseCourseWorkAutoFileSelected = false;
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = false;
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered = false;
        this.responseContainerProperty.isSLAOManaged = false;
        this.responseContainerProperty.isUnknownContentManaged = false;
        this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked = false;
        // Get the currently selected response details
        this.responseContainerProperty.responseData = this.responseContainerProperty.scriptHelper.getResponseData;
        // this is using for displaying non-recoverable error popup
        this.responseContainerProperty.hasNonRecoverableErrorPopupShown = false;
        /* Load images only if the response is not an ecoursework component.
           For ecoursework, the load images will be handled in the ecoursework container. */
        if (!this.isECourseworkComponent() && !htmlviewerhelper.isHtmlComponent) {
            loadImagesCallback();
        }
        // Scroll to suppress area to mask those when new response is loaded.
        this.responseContainerProperty.scrollToSuppressArea = true;
        this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected = false;
        // reset the variable as false when we open a new response through navigation.
        this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = false;
        this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = false;
    };
    /**
     * Open response
     */
    ResponseContainerHelperBase.prototype.openResponse = function (loadImagesCallback) {
        this.resetVariablesForOpenResponse(loadImagesCallback);
        // Log opened response details to keep as audit.
        new navigationLoggingHelper().logResponseOpenAudit(loggerConstants.NAVIGATION_REASON_RESPONSE_CHANGES, loggerConstants.NAVIGATION_TYPE_REPONSE_OPEN, this.responseContainerProperty.responseData.displayId, enums.ResponseMode[responseStore.instance.selectedResponseMode].toString());
        // reset the book mark previous scroll data while opening a response
        responseActionCreator.setBookmarkPreviousScrollData(undefined);
    };
    /**
     * Get the zones collection for the first Item.
     */
    ResponseContainerHelperBase.prototype.getZoneCollectionForFirstItem = function () {
        if (responseHelper.isAtypicalResponse()) {
            this.responseContainerProperty.imageZonesCollection = null;
        }
        else {
            this.responseContainerProperty.imageZonesCollection =
                this.responseContainerProperty.scriptHelper.getImageZonesCollectionForRender();
        }
    };
    /**
     *  process image zone collection and set properties
     */
    ResponseContainerHelperBase.prototype.processImageZoneCollection = function () {
        var tree = this.responseContainerProperty.treeViewHelper.treeViewItem();
        this.responseContainerProperty.multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(tree, markingStore.instance.currentMarkSchemeId, true);
        // process the image zones collection for different linking scenarios
        this.responseContainerProperty.imageZonesCollection =
            this.responseContainerProperty.scriptHelper.processImageZonesCollectionForLinkingScenarios(this.responseContainerProperty.imageZonesCollection, this.responseContainerProperty.linkedPagesByPreviousMarkers, this.responseContainerProperty.multipleMarkSchemes);
        this.responseContainerProperty.doApplyLinkingScenarios = this.responseContainerProperty.scriptHelper.doApplyLinkingScenarios;
    };
    /**
     * the the images to render property
     */
    ResponseContainerHelperBase.prototype.setImagesToRender = function () {
        // If imageZonesCollection is null, Component is unstructured
        if (this.responseContainerProperty.imageZonesCollection != null) {
            this.responseContainerProperty.imagesToRender = this.responseContainerProperty.scriptHelper.fetchScriptImages(this.responseContainerProperty.imageZonesCollection);
            // get the linked images to render
            this.responseContainerProperty.imagesToRender = this.responseContainerProperty.imagesToRender.concat(this.responseContainerProperty.scriptHelper.fetchLinkedScriptImages(this.responseContainerProperty.imagesToRender, this.responseContainerProperty.linkedPagesByPreviousMarkers));
        }
        else {
            this.responseContainerProperty.imagesToRender = this.fetchUnstructuredScriptImages();
        }
    };
    /**
     * Fetch images for ecourse work script images.
     */
    ResponseContainerHelperBase.prototype.fetchUnstructuredScriptImages = function () {
        return null;
    };
    /**
     * reset the required variables on response changed
     */
    ResponseContainerHelperBase.prototype.resetVariablesOnResponseChanged = function () {
        // Message panel Should be hide while navigating responses
        this.responseContainerProperty.isMessagePanelVisible = false;
        // Change exception panel class after navigate different responses.
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        // the variable is set to false as we dont need to show the loading dialog in between response navigation
        this.responseContainerProperty.doShowResposeLoadingDialog = false;
        // reset the flag when we nivigate the response
        this.responseContainerProperty.currentQuestionItemBIndex = -1;
    };
    /**
     * Return true if the component is e-course work
     */
    ResponseContainerHelperBase.prototype.isECourseworkComponent = function () {
        return eCourseworkHelper.isECourseworkComponent;
    };
    /**
     * get the response wrapper class name
     */
    ResponseContainerHelperBase.prototype.getWrapperClassName = function (isExceptionPanelVisible, isCommentsSideViewEnabled, enableSideViewComment) {
        var responseModeWrapperClassName = '';
        this.isExceptionPanelVisible = isExceptionPanelVisible;
        if ((this.responseContainerProperty.isResponseEditable) &&
            (this.responseViewMode !== enums.ResponseViewMode.fullResponseView) &&
            !this.responseContainerProperty.isMarkbyAnnotation) {
            responseModeWrapperClassName = 'content-wrapper';
        }
        else if ((this.responseContainerProperty.isResponseEditable) && (this.responseContainerProperty.isMarkbyAnnotation)) {
            responseModeWrapperClassName = 'content-wrapper mark-by-annotation';
        }
        else {
            responseModeWrapperClassName = 'content-wrapper closed-response';
        }
        // add messaging class if message panel is visible.
        responseModeWrapperClassName = this.responseContainerProperty.isMessagePanelVisible || (isExceptionPanelVisible &&
            !this.responseContainerProperty.isExceptionPanelMinimized) ?
            responseModeWrapperClassName + ' messaging'
            : responseModeWrapperClassName;
        responseModeWrapperClassName = (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize
            || this.responseContainerProperty.isExceptionPanelMinimized) ?
            responseModeWrapperClassName + ' minimized'
            : responseModeWrapperClassName;
        responseModeWrapperClassName = ((messageStore.instance.messageViewAction === enums.MessageViewAction.Maximize
            || (!this.responseContainerProperty.isExceptionPanelMinimized
                && isExceptionPanelVisible))
            && (this.responseViewMode === enums.ResponseViewMode.fullResponseView)) ?
            'content-wrapper messaging' : responseModeWrapperClassName;
        /* adding class for side view comments */
        responseModeWrapperClassName = isCommentsSideViewEnabled === true && enableSideViewComment
            && !onPageCommentHelper.disableSideViewInDevices ?
            responseModeWrapperClassName + ' commenting side-page' : responseModeWrapperClassName + ' on-page';
        // adding class for Remarking and quality responses
        responseModeWrapperClassName =
            !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
                && markingStore.instance.hasPreviousMarks
                && (enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex > 0)
                && markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible ?
                responseModeWrapperClassName + ' re-marking' : responseModeWrapperClassName;
        // adding class for current marking enhanced offpage comments.
        responseModeWrapperClassName =
            !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
                && markingStore.instance.hasPreviousMarks
                && enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex === 0
                && markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible ?
                responseModeWrapperClassName + ' current-mark' : responseModeWrapperClassName;
        // adding class for cbt response.
        responseModeWrapperClassName =
            htmlviewerhelper.isHtmlComponent ?
                responseModeWrapperClassName + ' cbt-response-container' : responseModeWrapperClassName;
        return responseModeWrapperClassName;
    };
    /**
     * The stamp cursor components based on its type
     * @param cursorType
     */
    ResponseContainerHelperBase.prototype.stampCursor = function (cursorType, id) {
        var componentProps = {
            id: id,
            key: id,
            cursorType: cursorType,
            renderedOn: this.renderedOn
        };
        return React.createElement(StampCursor, componentProps);
    };
    /**
     * this will trigger the actions corresponding to enums.EnhancedOffPageCommentButtonAction.Save option
     */
    ResponseContainerHelperBase.prototype.enhanceOffPageCommentSaveButtonAction = function (clientToken, reRenderCallBack) {
        if (clientToken === '') {
            enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated, enums.MarkingOperation.added, this.responseContainerProperty.enhancedOffPageCommentDetails.comment, this.responseContainerProperty.enhancedOffPageCommentDetails.itemId, this.responseContainerProperty.enhancedOffPageCommentDetails.fileId);
        }
        else {
            this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated.push(clientToken);
            if (this.responseContainerProperty.enhancedOffPageCommentDetails.comment === '') {
                this.responseContainerProperty.enhancedOffPageCommentMarkingOperation = enums.MarkingOperation.deleted;
                this.responseContainerProperty.confirmationDialogueContent =
                    localeStore.instance.TranslateText('marking.response.delete-enhanced-off-page-comment-confirmation-dialog.body');
                this.responseContainerProperty.confirmationDialogueHeader =
                    localeStore.instance.TranslateText('marking.response.delete-enhanced-off-page-comment-confirmation-dialog.header');
                reRenderCallBack();
            }
            else {
                enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated, enums.MarkingOperation.updated, this.responseContainerProperty.enhancedOffPageCommentDetails.comment, this.responseContainerProperty.enhancedOffPageCommentDetails.itemId, this.responseContainerProperty.enhancedOffPageCommentDetails.fileId);
            }
        }
    };
    /**
     * this will trigger the actions corresponding to enums.EnhancedOffPageCommentButtonAction.Visibility option
     * @param reRenderCallBack
     */
    ResponseContainerHelperBase.prototype.enhanceOffPageCommentVisibilityAction = function (reRenderCallBack) {
        this.responseContainerProperty.confirmationDialogueContent =
            this.responseContainerProperty.enhancedOffPageCommentDetails.isAddButtonClicked ?
                localeStore.instance.TranslateText('marking.response.discard-new-enhanced-off-page-comment-confirmation-dialog.body') :
                localeStore.instance.TranslateText('marking.response.discard-enhanced-off-page-comment-confirmation-dialog.body');
        this.responseContainerProperty.confirmationDialogueHeader =
            this.responseContainerProperty.enhancedOffPageCommentDetails.isAddButtonClicked ?
                localeStore.instance.TranslateText('marking.response.discard-new-enhanced-off-page-comment-confirmation-dialog.header') :
                localeStore.instance.TranslateText('marking.response.discard-enhanced-off-page-comment-confirmation-dialog.header');
        reRenderCallBack();
    };
    /**
     * this will trigger the actions corresponding to enums.EnhancedOffPageCommentButtonAction.Save option
     */
    ResponseContainerHelperBase.prototype.enhanceOffPageCommentDeleteButtonAction = function (clientToken, reRenderCallBack) {
        this.responseContainerProperty.enhancedOffPageCommentMarkingOperation = enums.MarkingOperation.deleted;
        this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated.push(clientToken);
        this.responseContainerProperty.confirmationDialogueContent =
            localeStore.instance.TranslateText('marking.response.delete-enhanced-off-page-comment-confirmation-dialog.body');
        this.responseContainerProperty.confirmationDialogueHeader =
            localeStore.instance.TranslateText('marking.response.delete-enhanced-off-page-comment-confirmation-dialog.header');
        reRenderCallBack();
    };
    /**
     * this will set variables for Reply and Forward
     * @param messageMenuActionType
     */
    ResponseContainerHelperBase.prototype.setVariablesForReplyForward = function (messageMenuActionType) {
        this.responseContainerProperty.responseId = this.responseContainerProperty.selectedMsgDetails.displayId;
        if (messageMenuActionType === enums.MessageAction.Reply) {
            this.responseContainerProperty.examinerIdForSendMessage =
                this.responseContainerProperty.selectedMsg.fromExaminerId;
            this.responseContainerProperty.examinerNameForSendMessage =
                this.responseContainerProperty.selectedMsg.examinerDetails.fullName;
        }
        else if (messageMenuActionType === enums.MessageAction.Forward) {
            this.responseContainerProperty.examinerIdForSendMessage = examinerStore.instance.getMarkerInformation.supervisorExaminerId;
            this.responseContainerProperty.examinerNameForSendMessage = examinerStore.instance.formattedSupervisorName;
        }
        switch (messageMenuActionType) {
            case enums.MessageAction.Reply:
                this.responseContainerProperty.messageType = enums.MessageType.ResponseReply;
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.ResponseReply);
                break;
            case enums.MessageAction.Forward:
                this.responseContainerProperty.messageType = enums.MessageType.ResponseForward;
                messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.ResponseForward);
                break;
        }
    };
    /**
     * remove link annotation from the collection
     * @param node
     */
    ResponseContainerHelperBase.prototype.removeItemFromLinkAnnotationLocalCollection = function (node) {
        var annotationToRemoveIndex = this.responseContainerProperty.linkAnnotationsToRemove.indexOf(node.uniqueId);
        if (annotationToRemoveIndex > -1) {
            this.responseContainerProperty.linkAnnotationsToRemove.splice(annotationToRemoveIndex, 1);
        }
    };
    /**
     * set SLAO manage/unmanaged mode
     */
    ResponseContainerHelperBase.prototype.setSLAOManagedMode = function (isBusy) {
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
            || responseStore.instance.markingMethod === enums.MarkingMethod.MarkFromObject) {
            this.responseContainerProperty.isSLAOManaged = true;
        }
        else {
            this.responseContainerProperty.isSLAOManaged = !this.responseContainerProperty.isSLAOManaged ?
                !(responseHelper.hasUnManagedSLAOInMarkingMode && !isBusy ||
                    (this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered &&
                        !this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked)) :
                this.responseContainerProperty.isSLAOManaged;
        }
    };
    /**
     * set unknown content manage/unmanaged mode
     */
    ResponseContainerHelperBase.prototype.setUnknownContentManagedMode = function (isBusy) {
        if (!responseHelper.isEbookMarking) {
            this.responseContainerProperty.isUnknownContentManaged = true;
        }
        else {
            // setting the isUnknownContentManaged variable
            this.responseContainerProperty.isUnknownContentManaged = !this.responseContainerProperty.isUnknownContentManaged ?
                !(responseHelper.hasUnManagedImageZone() && !isBusy ||
                    (this.responseContainerProperty.isUnknownContentManagedConfirmationPopupRendered &&
                        !this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked)) :
                this.responseContainerProperty.isUnknownContentManaged;
        }
    };
    /**
     * onConfirmReviewOfSLAOPopupOkButtonClick
     */
    ResponseContainerHelperBase.prototype.onConfirmReviewOfSLAOPopupOkButtonClick = function () {
        var _this = this;
        // Flag the page as seen
        responseActionCreator.doStampFlagAsSeenAnnotation(this.responseContainerProperty.currentPageNumber);
        // add or remove the annotation based on the marking operation
        this.responseContainerProperty.linkAnnotations.map(function (annotation, markSchemeId) {
            if (annotation.isDirty && annotation.markingOperation !== enums.MarkingOperation.deleted &&
                !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)) {
                pageLinkHelper.addLinkAnnotation(annotation, undefined, false, _this.logAnnoataionModificationAction);
            }
            else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                pageLinkHelper.removeLinkAnnotation(annotation, _this.logAnnoataionModificationAction);
            }
        });
        // clear the lists after all the operations
        this.responseContainerProperty.linkAnnotations = Immutable.Map();
        this.responseContainerProperty.linkAnnotationsToRemove = [];
        htmlUtilities.removeClassFromBody(' popup-open');
    };
    /**
     * onConfirmReviewOfUnknownContentPopupOkButtonClick
     */
    ResponseContainerHelperBase.prototype.onConfirmReviewOfUnknownContentPopupOkButtonClick = function () {
        var _this = this;
        // Flag the page as seen
        responseActionCreator.doStampFlagAsSeenAnnotation(this.responseContainerProperty.currentPageNumber);
        // add or remove the annotation based on the marking operation
        this.responseContainerProperty.linkAnnotations.map(function (annotation, markSchemeId) {
            if (annotation.isDirty && annotation.markingOperation !== enums.MarkingOperation.deleted &&
                !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)) {
                pageLinkHelper.addLinkAnnotation(annotation, undefined, false, _this.logAnnoataionModificationAction);
            }
            else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                pageLinkHelper.removeLinkAnnotation(annotation, _this.logAnnoataionModificationAction);
            }
        });
        // clear the lists after all the operations
        this.responseContainerProperty.linkAnnotations = Immutable.Map();
        this.responseContainerProperty.linkAnnotationsToRemove = [];
        // To enable the scroll bar in FRV after popup Ok button click
        htmlUtilities.removeClassFromBody(' popup-open');
    };
    /**
     * callback for create new exception
     * @param isFromMediaErrorDialog
     * @param errorViewmoreContent
     * @param getMessagePanelRightPosition
     * @param reRenderCallBack
     * @param addTransitionEventListeners
     */
    ResponseContainerHelperBase.prototype.onCreateNewExceptionClicked = function (isFromMediaErrorDialog, errorViewmoreContent, isExceptionPanelVisible, getMessagePanelRightPosition, reRenderCallBack, addTransitionEventListeners) {
        if (isFromMediaErrorDialog === void 0) { isFromMediaErrorDialog = false; }
        if (errorViewmoreContent === void 0) { errorViewmoreContent = ''; }
        if (isExceptionPanelVisible === void 0) { isExceptionPanelVisible = false; }
        this.responseContainerProperty.isFromMediaErrorDialog = isFromMediaErrorDialog;
        var prevExceptionComment = this.responseContainerProperty.errorViewmoreContent;
        this.responseContainerProperty.errorViewmoreContent = errorViewmoreContent;
        getMessagePanelRightPosition();
        // Set isExceptionPanelEdited as true when Exception panel is already opened via quick link against response.
        if (isFromMediaErrorDialog && prevExceptionComment !== '' && isExceptionPanelVisible) {
            this.responseContainerProperty.isExceptionPanelEdited = true;
        }
        if (messageStore.instance.isMessagePanelActive) {
            if (this.responseContainerProperty.isFromMediaErrorDialog) {
                this.triggerMessageNavigationAction(enums.MessageNavigation.newExceptionFromMediaErrorDialog);
            }
            else {
                this.responseContainerProperty.isNewException = true;
                this.triggerMessageNavigationAction(enums.MessageNavigation.newException);
            }
        }
        else if (this.responseContainerProperty.isExceptionPanelEdited) {
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
            popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardOnNewExceptionButtonClick, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                popupContent: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-open-another')
            });
        }
        else {
            this.responseContainerProperty.isNewException = true;
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            this.responseContainerProperty.isMessagePanelVisible = false;
            if (this.responseContainerProperty.isFromMediaErrorDialog) {
                this.responseContainerProperty.isExceptionPanelEdited = true;
            }
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            reRenderCallBack();
        }
        this.responseContainerProperty.isExceptionPanelMinimized = false;
        addTransitionEventListeners();
    };
    /**
     *  Trigger the Message Navigation Action
     */
    ResponseContainerHelperBase.prototype.triggerMessageNavigationAction = function (navigateTo) {
        var messageNavigationArguments = {
            responseId: null,
            canNavigate: false,
            navigateTo: navigateTo,
            navigationConfirmed: false,
            hasMessageContainsDirtyValue: undefined,
            triggerPoint: enums.TriggerPoint.None
        };
        messagingActionCreator.canMessageNavigate(messageNavigationArguments);
    };
    /**
     * handle promote to seed errors.
     * @param {enums.PromoteToSeedErrorCode} errorCode
     */
    ResponseContainerHelperBase.prototype.setPromoteToSeedErrorVariables = function (errorCode) {
        switch (errorCode) {
            case enums.PromoteToSeedErrorCode.NotFullyMarked:
                this.responseContainerProperty.promoteToSeedErrorPopupData = {
                    id: 'promote-to-seed-declined-message',
                    key: 'promote-to-seed-declined-message-key',
                    header: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header'),
                    popupContent: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-not-fully-marked')
                };
                this.responseContainerProperty.isPromoteToSeedErrorDialogVisible = true;
                break;
            case enums.PromoteToSeedErrorCode.NoSeedTargets:
                this.responseContainerProperty.promoteToSeedErrorPopupData = {
                    id: 'promote-to-seed-no-seed-targets-error-message',
                    key: 'promote-to-seed-no-seed-targets-error-message',
                    header: localeStore.instance.TranslateText('team-management.response.promote-to-seed-no-seeding-dialog.header'),
                    popupContent: localeStore.instance.TranslateText('team-management.response.promote-to-seed-no-seeding-dialog.body')
                };
                this.responseContainerProperty.isPromoteToSeedErrorDialogVisible = true;
                break;
            case enums.PromoteToSeedErrorCode.ResponseHasRemarks:
                this.responseContainerProperty.promoteToSeedErrorPopupData = {
                    id: 'promote-to-seed-response-has-remarks-error-message',
                    key: 'promote-to-seed-no-seed-targets-error-message',
                    header: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.header'),
                    popupContent: localeStore.instance.TranslateText('team-management.response.promote-to-seed-dialog.body-remarks-exist-confirmation')
                };
                this.responseContainerProperty.isPromoteToSeedErrorDialogVisible = true;
                break;
        }
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "doAddLinkToSLAO", {
        /**
         * returns true if the response having slao in marking mode
         */
        get: function () {
            return responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
                markingStore.instance.currentResponseMode !== enums.ResponseMode.closed &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                responseHelper.hasAdditionalObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseContainerHelperBase.prototype, "isPreviousMarksAndAnnotationCopiedInSLAOMode", {
        /**
         * get is previous marks and annotations are copied in slao management mode
         */
        get: function () {
            return (this.responseContainerProperty.isPreviousMarksAndAnnotationCopied &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !responseHelper.isAtypicalResponse() &&
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
                responseHelper.hasAdditionalObject);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * the necessary variable initialization of property base before render
     */
    ResponseContainerHelperBase.prototype.preRenderInitialisations = function (isBusy, selectedViewMode, isUnManagedSLAOPopupVisible, isUnManagedImageZonePopupVisible) {
        this.responseContainerProperty.isLoadingResponseScreen = false;
        this.responseContainerProperty.isInFullResponseView = (selectedViewMode === enums.ResponseViewMode.fullResponseView);
        // Indicating response container is ready to display actual contents.
        this.responseContainerProperty.isLoadingResponseScreen = false;
        this.responseContainerProperty.isResponseEditable = markerOperationModeFactory.operationMode.isResponseEditable;
        this.responseContainerProperty.scrollBarWidth = isNaN(this.getscrollbarWidth()) ? 0 + 'px' :
            this.getscrollbarWidth() + 'px';
        this.responseContainerProperty.markButtonWidth = this.responseContainerProperty.markButtonWidth ?
            this.responseContainerProperty.markButtonWidth : 0;
        /* This logic will store the markscheme width. This is because when we navigate from FRV to Marking,
           this.getMarkSchemeWidth() will return 0 as there is no markschemewidth in FRV.
           Also this is not a proper fix and the best approach fix would be,
           to save the markschemewidth value in store and use it when we navigate from FRV to Marking.
           However considering the impacts we are agreeing to this temp fix.
           Related details could be found in #47496 VSTS.*/
        if (this.responseContainerProperty.markSchemeWidth === 0 || this.responseContainerProperty.markSchemeWidth === undefined) {
            this.responseContainerProperty.markSchemeWidth = this.getMarkSchemeWidth();
        }
        if (isBusy === false) {
            this.setSLAOManagedMode(isBusy);
            this.setUnknownContentManagedMode(isBusy);
        }
        if (selectedViewMode === enums.ResponseViewMode.fullResponseView) {
            this.responseContainerProperty.cssMessageStyle = { right: this.responseContainerProperty.scrollBarWidth };
        }
        else {
            var widthOfPrevMarkListColumn = 0;
            if (this.responseContainerProperty.isPrevMarkListColumnVisible) {
                widthOfPrevMarkListColumn = markingStore.instance.getPreviousMarkListWidth();
                /* Re-setting the flag(Fix for gap issue while mark scheme resize with multiple previous marks).
                  PreviousmarkListWidth only required while the Previous mark selection. */
                this.responseContainerProperty.isPrevMarkListColumnVisible = false;
            }
            //Decrease the PreviousMarkListWidth while the previous mark unselected
            if (this.responseContainerProperty.isPrevMarkListUnChecked) {
                widthOfPrevMarkListColumn = (markingStore.instance.getPreviousMarkListWidth() * -1);
                this.responseContainerProperty.isPrevMarkListUnChecked = false;
            }
            var scrollWidth = isNaN(this.getscrollbarWidth()) ? 0 :
                this.getscrollbarWidth();
            this.responseContainerProperty.resizedWidth =
                (messageStore.instance.isMessagePanelVisible || exceptionStore.instance.isExceptionPanelVisible ? 0 :
                    (scrollWidth + this.responseContainerProperty.markButtonWidth +
                        ((this.getMarkSchemeWidth() === 0) ?
                            this.responseContainerProperty.markSchemeWidth : this.getMarkSchemeWidth())
                        + widthOfPrevMarkListColumn)) + 'px';
            this.responseContainerProperty.cssMessageStyle = { right: this.responseContainerProperty.resizedWidth };
        }
        // single render of SLAO popup message
        if (isUnManagedSLAOPopupVisible) {
            this.responseContainerProperty.isUnManagedSLAOPopupRendered = true;
        }
        /* To restrict the render of unmanged image zone popup */
        if (isUnManagedImageZonePopupVisible) {
            this.responseContainerProperty.isUnManagedImageZonePopupRendered = true;
        }
        this.responseContainerProperty.isInFullResponseView = selectedViewMode === enums.ResponseViewMode.fullResponseView;
    };
    /**
     * navigationOnMbqConfirmationYesButtonClick
     */
    ResponseContainerHelperBase.prototype.navigationOnMbqConfirmationYesButtonClick = function () {
        var responseNavigationFailureReasons = new Array();
        responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
        // If there is any navigation failure reason available then we will show respective popups.
        if (responseNavigationFailureReasons.length > 0) {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toWorklist, enums.ResponseNavigation.markScheme);
        }
        else {
            // else navigate the to worklist
            markingActionCreator.navigationAfterMarkConfirmation(enums.ResponseNavigation.markScheme, enums.SaveAndNavigate.toWorklist);
        }
        this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.toWorklist;
    };
    /**
     * return the images URL arrays
     * @param doUpdateAngleOfResponse
     */
    ResponseContainerHelperBase.prototype.setImagesToLoad = function (doUpdateAngleOfResponse) {
        this.getZoneCollectionForFirstItem();
        // get pages linked by previous markers
        this.responseContainerProperty.linkedPagesByPreviousMarkers = this.getPreviousMarkerLinkedPages().sort();
        if (markingStore) {
            var currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
            if (currentQuestionItemInfo) {
                this.processImageZoneCollection();
            }
        }
        this.responseContainerProperty.currentImageZones = this.responseContainerProperty.scriptHelper.currentImageZoneCollection;
        if (doUpdateAngleOfResponse) {
            // reset the rotation angle to zero
            responseActionCreator.updateDisplayAngleOfResponse(true);
        }
        this.setImagesToRender();
        // get All Image urls to the array
        var allimageURLs = [];
        // get the items from 2 dimensional array to single array for processing.
        this.responseContainerProperty.imagesToRender.forEach(function (urls) {
            urls.forEach(function (url) { allimageURLs.push(url); });
        });
        return allimageURLs;
    };
    /**
     * fracsDataLoaded
     * @param selectedViewMode
     */
    ResponseContainerHelperBase.prototype.fracsDataLoaded = function (selectedViewMode) {
        if (selectedViewMode === enums.ResponseViewMode.zoneView) {
            // one callback function is using for setting Mark this page scroll position
            this.responseContainerProperty.setFracsloadedImageCount++;
            if (this.responseContainerProperty.setFracsloadedImageCount ===
                this.returnImageToRenderLength(this.responseContainerProperty.imagesToRender)) {
                // Set the scroll when user clicks mark this page or restore the previous scroll
                var markThisPageNumber = responseStore.instance.markThisPageNumber;
                if (markThisPageNumber > 0 || responseStore.instance.currentScrollPosition > 0) {
                    var imageElementId = 'img_' + markThisPageNumber;
                    this.responseContainerProperty.markThisPageScrollPosition =
                        responseStore.instance.selectedImageOffsetTop(imageElementId);
                    // if markThisPageNumber variable contain a value greater than zero then we have to take this.markThisPageScrollPosition
                    // (mark this page click callback function setting that value)
                    var scrollTop = markThisPageNumber > 0 ?
                        this.responseContainerProperty.markThisPageScrollPosition : this.getCurrentScrollPosition;
                    // This will reset the current scroll position.
                    responseActionCreator.resetScrollData();
                    // reset markThisPageScrollPosition variable.
                    this.responseContainerProperty.markThisPageScrollPosition = 0;
                    $('.marksheet-container').scrollTop(scrollTop);
                    var updateScrollPositionInStore = false;
                    // If a page was selected from the full response view for viewing,
                    // set the curent scroll positon as that of the page. Otherwise for normal switching,
                    // do not update scroll position in store.
                    if (markThisPageNumber > 0) {
                        updateScrollPositionInStore = true;
                    }
                    responseActionCreator.setCurrentScrollPosition(scrollTop, true, updateScrollPositionInStore);
                    markingActionCreator.setMarkThisPageNumber(0);
                }
                this.responseContainerProperty.setFracsloadedImageCount = 0;
            }
        }
    };
    /**
     * Validate and returns length
     * @param imagesToRender
     */
    ResponseContainerHelperBase.prototype.returnImageToRenderLength = function (imagesToRender) {
        return imagesToRender.length > 0 ? imagesToRender[0].length : 0;
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "getCurrentScrollPosition", {
        /**
         * get the current scroll position
         */
        get: function () {
            return responseStore.instance.currentScrollPosition !== 0 ? responseStore.instance.currentScrollPosition
                : document.body.scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles the action event after structured fracs data loaded.
     */
    ResponseContainerHelperBase.prototype.structuredFracsDataLoaded = function () {
        if (markingStore.instance.currentlyLinkedZonePageNumber > 0) {
            var imageElementId = 'img_' + markingStore.instance.currentlyLinkedZonePageNumber;
            this.responseContainerProperty.markThisPageScrollPosition = responseStore.instance.selectedImageOffsetTop(imageElementId);
            $('.marksheet-container').scrollTop(this.responseContainerProperty.markThisPageScrollPosition);
        }
        else if (responseStore.instance.imageZonesAgainstPageNumber &&
            (responseStore.instance.markThisPageNumber > 0 || responseStore.instance.currentScrollPosition > 0)) {
            var imageElementId = 'img_' + responseStore.instance.markThisPageNumber;
            this.responseContainerProperty.markThisPageScrollPosition = responseStore.instance.selectedImageOffsetTop(imageElementId);
            $('.marksheet-container').scrollTop(this.responseContainerProperty.markThisPageScrollPosition);
            markingActionCreator.setMarkThisPageNumber(0);
        }
        else if (responseStore.instance.currentScrollPosition > 0) {
            $('.marksheet-container').scrollTop(responseStore.instance.currentScrollPosition);
            markingActionCreator.setMarkThisPageNumber(0);
        }
    };
    /**
     * Callback function for setting the active page for zoom
     * @param responseViewSettings - enum - zoom settings
     * @param markingMethod - enum - default value is structured.
     */
    ResponseContainerHelperBase.prototype.setZoomOptionCommon = function (responseViewSettings, isValid, isCommentsSideViewEnabled, markingMethod) {
        if (markingMethod === void 0) { markingMethod = enums.MarkingMethod.Structured; }
        if (htmlUtilities.isTabletOrMobileDevice &&
            (responseViewSettings !== enums.ResponseViewSettings.RotateAntiClockwise &&
                responseViewSettings !== enums.ResponseViewSettings.RotateClockwise)) {
            // resetting the width setted during pinch-to-zoom
            $('.marksheet-view-holder').css({
                'width': ''
            });
        }
        this.responseContainerProperty.renderedImageViewerCount++;
        // for setting the rendered image count for various marking methods and execute
        //zoom action after rendering all pages in response
        if (((this.responseContainerProperty.imagesToRender && (markingMethod === enums.MarkingMethod.Structured ||
            this.isEbookMarking())) &&
            (this.responseContainerProperty.renderedImageViewerCount === this.getImagesToRenderLength)) ||
            ((this.responseContainerProperty.imagesToRender && markingMethod === enums.MarkingMethod.Unstructured &&
                !this.isEbookMarking()) &&
                ((isValid) ||
                    (this.responseContainerProperty.renderedImageViewerCount === this.returnImageToRenderLength(this.responseContainerProperty.imagesToRender) +
                        this.responseContainerProperty.scriptHelper.getSuppressedPagesCount())))) {
            // This will find the active image container id
            responseActionCreator.findVisibleImageId();
            zoomPanelActionCreator.HandleZoomPanelActions(responseViewSettings);
            this.responseContainerProperty.renderedImageViewerCount = 0;
            // reset the scroll left
            if (isCommentsSideViewEnabled &&
                (responseViewSettings === enums.ResponseViewSettings.FitToHeight ||
                    responseViewSettings === enums.ResponseViewSettings.FitToWidth)) {
                htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollLeft = 0;
            }
        }
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "getImagesToRenderLength", {
        /**
         * return the total number of images to be rendered
         */
        get: function () {
            if (this.isEbookMarking()) {
                var length_1 = 0;
                this.responseContainerProperty.imagesToRender.map(function (item) {
                    if (item) {
                        length_1 = length_1 + item.length;
                    }
                });
                return length_1;
            }
            else {
                return this.responseContainerProperty.imagesToRender.length;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will set scroll position in various scenarios
     * 1 - Mark This page option in both structured and unstructured responses.
     * 2 - While returning from full response view
     */
    ResponseContainerHelperBase.prototype.setScrollPosition = function () {
        // Scroll position of the first page may come as 35 as origin.
        // so we dont need to substitute as the default that is the origin scroll.
        this.responseContainerProperty.markThisPageScrollPosition =
            (this.responseContainerProperty.markThisPageScrollPosition !== undefined &&
                this.responseContainerProperty.markThisPageScrollPosition >= 35) ?
                (this.responseContainerProperty.markThisPageScrollPosition - 35) :
                this.responseContainerProperty.markThisPageScrollPosition;
        // if markThisPageScrollPosition variable contain a value greater than zero then we have to take that
        // (mark this page click callback function setting that value)
        var scrollTop = this.responseContainerProperty.markThisPageScrollPosition !== undefined ?
            this.responseContainerProperty.markThisPageScrollPosition :
            ((responseStore.instance.currentScrollPosition !== 0) ? responseStore.instance.currentScrollPosition
                : document.body.scrollTop);
        // This will reset the current scroll position.
        responseActionCreator.resetScrollData();
        // reset markThisPageScrollPosition variable.
        this.responseContainerProperty.markThisPageScrollPosition = undefined;
        this.responseContainerProperty.scrollToTopOf = scrollTop;
        $('.marksheet-container').scrollTop(scrollTop);
    };
    /**
     * returns the ExaminerMarks against the given display id
     * @param displayId
     */
    ResponseContainerHelperBase.prototype.getExaminerMarksAgainstResponse = function (displayId) {
        var examinerMarksAgainstResponse = markingStore.instance.getExaminerMarksAgainstResponse;
        if (examinerMarksAgainstResponse && examinerMarksAgainstResponse.length > 0) {
            var allMarksAndAnnotations = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId].allMarksAndAnnotations;
            var numberOfPreviousResponses = allMarksAndAnnotations.length - 1;
            for (var index = 1; index <= numberOfPreviousResponses; index++) {
                var previousAnnotation = pageLinkHelper.getAnnotationsFromPreviousMarks(index);
                if (previousAnnotation && previousAnnotation.length > 0) {
                    markingHelper.addLinksToAnnotatedSLAOs(displayId, true, previousAnnotation, index);
                }
            }
        }
        return examinerMarksAgainstResponse;
    };
    /**
     * callback after images loaded
     * @param isConfirmReviewOfMangedSLAOPopupShowing
     * @param offsetTop
     * @param hasImagesToRender
     */
    ResponseContainerHelperBase.prototype.imageLoaded = function (isConfirmReviewOfMangedSLAOPopupShowing, offsetTop, hasImagesToRender) {
        var _this = this;
        this.responseContainerProperty.renderedImageCount++;
        if (this.responseContainerProperty.renderedImageCount === this.responseContainerProperty.totalImageCount &&
            hasImagesToRender !== false) {
            // Set the scroll position to the element.
            if (this.responseViewMode === enums.ResponseViewMode.zoneView) {
                // If user navigating from full response view using mark this page option then we have to find scroll position of
                // selected image zone this will works for structured responses only.
                if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured && !responseHelper.isAtypicalResponse()) {
                    if (responseStore.instance.imageZonesAgainstPageNumber) {
                        // this check passes for mark this page click only
                        if (responseStore.instance.imageZonesAgainstPageNumber.count() > 0) {
                            // when the page has associated zones , with or without linked pages
                            this.responseContainerProperty.imageZonesCollection.map(function (imageZones) {
                                imageZones.map(function (imageZone, index) {
                                    responseStore.instance.imageZonesAgainstPageNumber.map(function (x) {
                                        if (x.imageClusterId === imageZone.imageClusterId && x.uniqueId === imageZone.uniqueId) {
                                            if (!pageLinkHelper.isPageLinked(x.pageNo)) {
                                                var offsetBase = htmlUtilities.getOffsetTop('outputPageNo_' + imageZone.outputPageNo);
                                                var offsetTop_1 = imageZones.count() > 1 ? offsetBase +
                                                    htmlUtilities.getOffsetTop('marksheetImgHolder_' + index + '_' + imageZone.outputPageNo)
                                                    : offsetBase;
                                                // adjusting the scroll top position with top margin
                                                _this.responseContainerProperty.markThisPageScrollPosition = offsetTop_1 + 35;
                                                // resetting image zones stored for mark this page functionality
                                                responseActionCreator.imageZonesAgainstPageNumber(undefined, undefined);
                                            }
                                        }
                                    });
                                });
                            });
                        }
                        // set scroll position for structured responses
                        this.setScrollPosition();
                    }
                }
            }
            else if (this.responseViewMode === enums.ResponseViewMode.fullResponseView) {
                if (isConfirmReviewOfMangedSLAOPopupShowing === true
                    || (responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                        && markingHelper.hasUnAnnotatedSlao
                        && this.responseContainerProperty.isStayInResponseFRViewModeTriggered)) {
                    this.responseContainerProperty.isStayInResponseFRViewModeTriggered = false;
                    var firstSLAOPageNumber = responseHelper.firstSLAOPageNumber;
                    this.scrollToPageInFRView(firstSLAOPageNumber);
                }
                else if (offsetTop !== undefined) {
                    $('.marksheet-container').scrollTop(offsetTop);
                }
            }
        }
        // we need to activate either when all the images are loaded also when there are no images to load
        if (this.responseContainerProperty.renderedImageCount === this.responseContainerProperty.totalImageCount ||
            hasImagesToRender === false) {
            //For Structured components we need to activate keydown only after image loading
            if (!messageStore.instance.isMessagePanelVisible && !exceptionStore.instance.isExceptionPanelVisible
                && responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
            }
        }
    };
    /**
     * returns whether the current imagezone collection has unmanged image zones.
     */
    ResponseContainerHelperBase.prototype.hasUnManagedImageZone = function () {
        var eBookMarkingCCValue = (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true');
        var hasUnmangedZone = responseHelper.hasUnManagedImageZone();
        return (hasUnmangedZone && eBookMarkingCCValue
            && !markerOperationModeFactory.operationMode.isTeamManagementMode
            && !worklistStore.instance.isMarkingCheckMode);
    };
    /**
     * returns whether the current imagezone collection has unmanged image zones in remark.
     */
    ResponseContainerHelperBase.prototype.hasUnManagedImageZoneInRemark = function () {
        var imageZones = imagezoneStore.instance.currentCandidateScriptImageZone;
        // To get the unknown content zones in ebookmarking component.
        var unManagedZones = (imageZones ?
            imageZones.filter(function (x) { return x.docStorePageQuestionTagTypeId === constants.UNKNOWN_CONTENT_TYPE_ID; })
            : undefined);
        var hasUnmanaged = false;
        // unManagedZones will be undefined in ecoursework.
        if (unManagedZones && unManagedZones.count() > 0) {
            hasUnmanaged = true;
        }
        // The unknown content in remark exist only if
        // 1.unmanaged zones in remark
        // 2.Ebookmarking component
        // 3.directed or pooled remark
        // 4.startWithEmptyMarkGroup is false
        // 5.not team management mode
        // 6.not markingcheck mode
        return (hasUnmanaged &&
            this.isEbookMarking() && !responseHelper.hasUnManagedImageZone() &&
            (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark ||
                worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark) &&
            !copyPreviousMarksAndAnnotationsHelper.canStartMarkingWithEmptyMarkGroup() &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !worklistStore.instance.isMarkingCheckMode);
    };
    /**
     * return whether the current QIG is ebookmarking or not
     */
    ResponseContainerHelperBase.prototype.isEbookMarking = function () {
        return (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true');
    };
    Object.defineProperty(ResponseContainerHelperBase.prototype, "hasEditDefinitivesPermission", {
        /**
         * Get the edit definitive permission for the markers role in std setup permission CC
         * @returns
         */
        get: function () {
            if (standardisationSetupStore.instance.stdSetupPermissionCCData) {
                return standardisationSetupStore.instance.stdSetupPermissionCCData.
                    role.permissions.editDefinitives;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ResponseContainerHelperBase;
}());
module.exports = ResponseContainerHelperBase;
//# sourceMappingURL=responsecontainerhelperbase.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('./base/purerendercomponent');
var localeStore = require('../stores/locale/localestore');
var ConfirmationDialog = require('./utility/confirmationdialog');
var userOptionsHelper = require('../utility/useroption/useroptionshelper');
var logoutArgument = require('../dataservices/authentication/logoutargument');
var logoutActionCreator = require('../actions/logout/logoutactioncreator');
var loginSession = require('../app/loginsession');
var loginStore = require('../stores/login/loginstore');
var useroptionKeys = require('../utility/useroption/useroptionkeys');
var userOptionStore = require('../stores/useroption/useroptionstore');
var markerOperationModeFactory = require('./utility/markeroperationmode/markeroperationmodefactory');
var enums = require('./utility/enums');
var marksAndAnnotationsSaveHelper = require('../utility/marking/marksandannotationssavehelper');
var markingStore = require('../stores/marking/markingstore');
var markingActionCreator = require('../actions/marking/markingactioncreator');
var worklistStore = require('../stores/worklist/workliststore');
var BusyIndicator = require('./utility/busyindicator/busyindicator');
var navigationHelper = require('./utility/navigation/navigationhelper');
var navigationStore = require('../stores/navigation/navigationstore');
var applicationActionCreator = require('../actions/applicationoffline/applicationactioncreator');
var GenericDialog = require('./utility/genericdialog');
var saveMarksAndAnnotationsNonRecoverableErrorDialogContents = require('./utility/savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
var htmlUtilities = require('../utility/generic/htmlutilities');
var worklistActionCreator = require('../actions/worklist/worklistactioncreator');
var qigStore = require('../stores/qigselector/qigstore');
var keyDownHelper = require('../utility/generic/keydownhelper');
var qigActionCreator = require('../actions/qigselector/qigselectoractioncreator');
var messageStore = require('../stores/message/messagestore');
var exceptionStore = require('../stores/exception/exceptionstore');
var popUpDisplayActionCreator = require('../actions/popupdisplay/popupdisplayactioncreator');
var examinerStore = require('../stores/markerinformation/examinerstore');
var responseActionCreator = require('../actions/response/responseactioncreator');
var qualityFeedbackHelper = require('../utility/qualityfeedback/qualityfeedbackhelper');
var colouredAnnotationsHelper = require('../utility/stamppanel/colouredannotationshelper');
var submitStore = require('../stores/submit/submitstore');
var worklistComponentHelper = require('./worklist/worklistcomponenthelper');
var submitHelper = require('./utility/submit/submithelper');
var targetHelper = require('../utility/target/targethelper');
var busyIndicatorActionCreator = require('../actions/busyindicator/busyindicatoractioncreator');
var busyIndicatorStore = require('../stores/busyindicator/busyindicatorstore');
var messagingActionCreator = require('../actions/messaging/messagingactioncreator');
var messageHelper = require('./utility/message/messagehelper');
var configurablecharacteristicshelper = require('../utility/configurablecharacteristic/configurablecharacteristicshelper');
var stdSetupPermissionHelper = require('../utility/standardisationsetup/standardisationsetuppermissionhelper');
/* tslint:disable:variable-name */
var IdleTimer = require('react-idle-timer').default;
var applicationStore = require('../stores/applicationoffline/applicationstore');
var submitActionCreator = require('../actions/submit/submitactioncreator');
var responseStore = require('../stores/response/responsestore');
var storageAdapterHelper = require('../dataservices/storageadapters/storageadapterhelper');
var teamManagementStore = require('../stores/teammanagement/teammanagementstore');
var userInfoActionCreator = require('../actions/userinfo/userinfoactioncreator');
var loadContainerActionCreator = require('../actions/navigation/loadcontaineractioncreator');
var operationModeHelper = require('./utility/userdetails/userinfo/operationmodehelper');
var worklistHistoryInfo = require('../utility/breadcrumb/worklisthistoryinfo');
var teamManagementHistoryInfo = require('../utility/breadcrumb/teammanagementhistoryinfo');
var historyItem = require('../utility/breadcrumb/historyitem');
var teamManagementActionCreator = require('../actions/teammanagement/teammanagementactioncreator');
var markingCheckActionCreator = require('../actions/markingcheck/markingcheckactioncreator');
var rememberQig = require('../stores/useroption/typings/rememberqig');
var userOptionKeys = require('../utility/useroption/useroptionkeys');
var WarningMessagePopup = require('./teammanagement/warningmessagepopup');
var LocksInQigPopup = require('./qigselector/locksinqigpopup');
var ccActionCreator = require('../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var Promise = require('es6-promise');
var stringHelper = require('../utility/generic/stringhelper');
var Immutable = require('immutable');
var simulationModeHelper = require('../utility/simulation/simulationmodehelper');
var stringFormatHelper = require('../utility/stringformat/stringformathelper');
var ccStore = require('../stores/configurablecharacteristics/configurablecharacteristicsstore');
var ecourseworkHelper = require('./utility/ecoursework/ecourseworkhelper');
var ecourseworkFileStore = require('../stores/response/digital/ecourseworkfilestore');
var acetatesActionCreator = require('../actions/acetates/acetatesactioncreator');
var configurableCharacteristicHelper = require('../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicNames = require('../utility/configurablecharacteristic/configurablecharacteristicsnames');
var targetSummaryStore = require('../stores/worklist/targetsummarystore');
var imageZoneStore = require('../stores/imagezones/imagezonestore');
var auditLoggingHelper = require('./utility/auditlogger/auditlogginghelper');
var standardisationSetupStore = require('../stores/standardisationsetup/standardisationsetupstore');
var MultiOptionConfirmationDialog = require('./utility/multioptionconfirmationdialog');
var standardisationActionCreator = require('../actions/standardisationsetup/standardisationactioncreator');
var userinfostore = require('../stores/userinfo/userinfostore');
var genericRadioButtonItems = require('./utility/genericradiobuttonitems');
var GenericPopupWithRadioButton = require('./utility/genericpopupwithradiobuttons');
var Footer = (function (_super) {
    __extends(Footer, _super);
    /**
     * Constructor
     * @param {Props} props
     * @param {State} state
     */
    function Footer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Indicates if logout has been triggered
        this._onLogoutTriggered = false;
        this._failureReason = enums
            .ResponseNavigateFailureReason.None;
        this.expiredMarkGroupId = 0;
        this.currentSaveMarksAndAnnotationTriggeringPoint = undefined;
        // variable for save marks and annotations dialog contents
        this.saveMarksAndAnnotationsErrorDialogContents = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(false);
        // variable to save examiner Approval status
        this.examinerApprovalStatus = enums
            .SaveMarksAndAnnotationErrorCode.None;
        //variable to know where the reponse is navigated to
        this.navigateReponse = enums.SaveAndNavigate.none;
        // Holds the Pop data for displaying the contents of popup
        this.popUpData = {};
        // Indicates if logout has been triggered through Idle TimeOut
        this._isAutoLogOut = false;
        // Holds the idle time out value in milli seconds -- default:10 mins
        this._idleTimeOut = 600000;
        //  This will hold the mandatory message checking trigger points
        this.mandatoryMessageTriggeringPoint = enums.TriggerPoint.None;
        this.isConcurrentSessionActive = false;
        this.storageAdapterHelper = new storageAdapterHelper();
        this.messageDetails = { messageHeader: '', messageString: '' };
        this.triggerPointAfterClose = 0;
        this.offlineErrorMessage = null;
        this.submitMessageErrorPopupContent = undefined;
        this.copyMarksAsDefinitiveSelected = true;
        this.reclassifyResponseDetails = undefined;
        /**
         * Method to be invoked when a ExamBody CC is loaded.
         */
        this.onExamBodyCCLoaded = function () {
            // show locks and simulation exited popup if it is not already shown and exambodycc is loaded
            _this.setState({
                reRenderLocksInQigPopUp: _this.state.reRenderLocksInQigPopUp && ccStore.instance.isExamBodyCCLoaded,
                renderedOn: Date.now(),
                showSimulationExitedPopup: _this.state.showSimulationExitedPopup && ccStore.instance.isExamBodyCCLoaded
            });
        };
        /**
         * Updates the Marker information panel.
         */
        this.updateMarkerInformationPanel = function () {
            // Check the Marker got with drawn from the QIG, If So show the message
            if (examinerStore.instance.getMarkerInformation.approvalStatus ===
                enums.ExaminerApproval.Withdrawn) {
                if (qigStore.instance.getOverviewData) {
                    var currentQig = qigStore.instance.getOverviewData.qigSummary
                        .filter(function (qig) {
                        return qig.examinerRoleId ===
                            examinerStore.instance.getMarkerInformation.examinerRoleId;
                    })
                        .first();
                    // removing entry from recent history
                    teamManagementActionCreator.removeHistoryItem(currentQig ? currentQig.markSchemeGroupId : 0);
                }
                _this.setState({ isWithdrawnResponseError: true, isBusy: false });
            }
        };
        /**
         * Updates qig selector if the examiner session is closed for the qig.
         */
        this.updateQigForSessionClose = function () {
            // Check the Marker got with drawn from the QIG, If So show the message
            _this.setState({ isQigsessionClosedError: true, isBusy: false });
        };
        /**
         * On response submission started
         */
        this.onSubmitResponseStarted = function () {
            /**
             * for submit all the markgroup id will always be zero
             */
            if (submitStore.instance.getMarkGroupId > 0) {
                _this.submitConfirmationDialogueContent = localeStore.instance.TranslateText('marking.worklist.submit-response-dialog.body');
                _this.submitConfirmationDialogueHeader = localeStore.instance.TranslateText('marking.worklist.submit-response-dialog.header');
            }
            else {
                _this.submitConfirmationDialogueContent = localeStore.instance.TranslateText('marking.worklist.submit-all-responses-dialog.body');
                _this.submitConfirmationDialogueHeader = localeStore.instance.TranslateText('marking.worklist.submit-all-responses-dialog.header');
            }
            _this.setConfirmationDialogueState(true);
        };
        /**
         * Show busy indicator when submit is clicked in live open worklist
         */
        this.setBusyIndicator = function () {
            _this.setState({
                isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker ===
                    enums.BusyIndicatorInvoker.none
                    ? false
                    : true
            });
        };
        /**
         * hiding busy indicator
         */
        this.resetBusyIndicator = function () {
            _this.setState({
                isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker !==
                    enums.BusyIndicatorInvoker.none
                    ? false
                    : true
            });
        };
        /**
         * hiding busy indicator on ok click of validation of std setup
         */
        this.resetBusyIndicatorStdSetupNotComplete = function () {
            if (standardisationSetupStore.instance.iscompleteStandardisationSuccess === false) {
                _this.setState({
                    isBusy: busyIndicatorStore.instance.getBusyIndicatorInvoker ===
                        enums.BusyIndicatorInvoker.none
                });
            }
        };
        /**
         * Marks retrieval event.
         */
        this.marksRetrieved = function (markGroupId) {
            if ((markingStore.instance.currentResponseMode === enums.ResponseMode.open ||
                markingStore.instance.currentResponseMode === enums.ResponseMode.pending) &&
                !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                var isColourUpdated = colouredAnnotationsHelper.updateAnnotationColourIfNeeded(markGroupId);
                if (isColourUpdated) {
                    // Updating the queue to let know the background process to save the dirty marks and annotations
                    marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();
                }
            }
        };
        /**
         * Handles the action event while message priority updation.
         */
        this.messagePriorityUpdate = function () {
            _this.setState({ doShowMandatoryMessageValidationPopup: false });
        };
        /**
         * Updates user session data by changing the logged_out status to 1.
         * logged_out status 1 means user logged out properly by clicking on the
         * log out button.
         */
        this.updateUserSession = function () {
            /**
             * Trigger save mark for the currently selected item when logging out
             */
            if (markingStore.instance.isMarkingInProgress) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toLogout);
            }
            else {
                /**
                 * navigating from a response which is in view mode doesn't require to call save marks
                 */
                var logoutData = new logoutArgument();
                logoutData.MarkingSessionTrackingId = parseInt(loginSession.MARKING_SESSION_TRACKING_ID);
                logoutActionCreator.updateUserSession(logoutData);
            }
        };
        /**
         * setting login invalid state.
         */
        this.onConcurrentSessionActive = function () {
            _this.isConcurrentSessionActive = true;
            _this.clearSession();
        };
        /**
         * Clears the session after user option saved and logged_out status updated.
         */
        this.clearSession = function () {
            window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
            /* tslint:disable:no-string-literal */
            if (_this.isConcurrentSessionActive) {
                window.sessionStorage['invaliduser'] = 'true';
            }
            else if (_this._isAutoLogOut) {
                window.sessionStorage['autologout'] = 'true';
            }
            /* tslint:enable:no-string-literal */
            userOptionsHelper.resetTokensAndRedirect();
            navigationHelper.loadLoginPage();
        };
        /**
         *  clear marks and annotations queue entry and update isDirty fields
         */
        this.onSaveMarksAndAnnotations = function (markGroupId, saveMarksAndAnnotationTriggeringPoint, queueOperation, isnetworkerror) {
            var saveErrorCode = markingStore.instance.getSaveMarksAndAnnotationErrorCode(markGroupId);
            // selectedQIGForMarkerOperation become undefined when the marker is withdrawn from the selected qig.
            // so added undefined check as part of bug 57226.
            if (qigStore.instance.selectedQIGForMarkerOperation &&
                qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget.markingMode ===
                    enums.MarkingMode.Simulation &&
                qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                _this.triggerPointAfterClose = saveMarksAndAnnotationTriggeringPoint;
                if (_this.triggerPointAfterClose ===
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit) {
                    _this.triggerPointAfterClose =
                        enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse;
                }
                saveMarksAndAnnotationTriggeringPoint =
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker;
                saveErrorCode = enums.SaveMarksAndAnnotationErrorCode.None;
                marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, enums.MarksAndAnnotationsQueueOperation.Remove);
                _this.setState({
                    showSimulationExitedPopup: true
                });
            }
            if (saveMarksAndAnnotationTriggeringPoint !==
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None) {
                // reset the saveinprogress flag when savingmarks has been completed
                marksAndAnnotationsSaveHelper.resetSaveInProgress();
                /**
                 * set the current marks and annotations save triggering point.
                 */
                _this.currentSaveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
                if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.ResponseRemoved) {
                    worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember);
                    _this.expiredMarkGroupId = markGroupId;
                    marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
                    _this.setState({
                        isDisplayingResponseRemovedError: markingStore.instance.currentResponseMode === enums.ResponseMode.pending,
                        doShowSavingMarksAndAnnotationsIndicator: false
                    });
                }
                else if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.ClosedResponse) {
                    worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember);
                    _this.expiredMarkGroupId = markGroupId;
                    marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
                    _this.setState({
                        isDisplayingGraceResponseExpiredError: markingStore.instance.currentResponseMode === enums.ResponseMode.pending,
                        doShowSavingMarksAndAnnotationsIndicator: false
                    });
                }
                else if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse) {
                    /**
                     * Calling the helper method to update the marks and annotations queue
                     */
                    marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
                    _this.onWithdrawnResponse(enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse, markingStore.instance.navigateTo);
                }
                else if (saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.UnallocatedResponse ||
                    saveErrorCode === enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsOutOfDate) {
                    /**
                     * Calling the helper method to update the marks and annotations queue
                     */
                    marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
                    if (saveMarksAndAnnotationTriggeringPoint ===
                        enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit) {
                        /**
                         * When there are errors in saving marks and annotations we have to hide the busy indicator
                         */
                        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                        _this.setState({
                            doShowSavingMarksAndAnnotationsIndicator: false,
                            nonRecoverableSaveMarksAndAnnotationsErrorMessage: true
                        });
                    }
                    else {
                        // hide the saving marks and annotations busy indicator
                        if (_this.state.doShowSavingMarksAndAnnotationsIndicator) {
                            _this.setState({
                                doShowSavingMarksAndAnnotationsIndicator: false
                            });
                        }
                        navigationHelper.loadContainerIfNeeded(enums.PageContainers.WorkList, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
                        _this.initiateContentRefresh();
                    }
                }
                else {
                    // Calling the helper method to update the marks and annotations queue
                    marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
                    // If the queue is processed completely, have to hide the save marks and annotations busy indicator
                    if (marksAndAnnotationsSaveHelper.isQueueProcessedCompletely) {
                        if (marksAndAnnotationsSaveHelper.markGroupItemsWithNonRecoverableErrors
                            .length > 0) {
                            //When there are errors in saving marks and annotations we have to hide the busy indicator
                            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.none);
                            // set appropriate error dialog contents
                            _this.saveMarksAndAnnotationsErrorDialogContents = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(true);
                            if (_this.state.doShowSavingMarksAndAnnotationsIndicator) {
                                //logic for displaying error popup.
                                _this.setState({
                                    isNonRecoverableErrorPopupVisible: true
                                });
                            }
                        }
                        else {
                            _this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(saveMarksAndAnnotationTriggeringPoint, markGroupId);
                        }
                        // Last Invoked Trigger point is stored in marking Store. Reset the variable after 'ALL Completed Save'
                        if (marksAndAnnotationsSaveHelper.count === 0) {
                            responseActionCreator.triggerSavingMarksAndAnnotations(enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None);
                        }
                        // hide the saving marks and annotations busy indicator
                        if (_this.state.doShowSavingMarksAndAnnotationsIndicator) {
                            _this.setState({
                                doShowSavingMarksAndAnnotationsIndicator: false
                            });
                        }
                    }
                }
            }
            _this.setState({
                isOnline: !isnetworkerror
            });
        };
        /**
         * show the error message when a marker is withdrawn from background
         */
        this.onWithdrawnResponse = function (saveMarksAndAnnotationErrorCode, navigatingTo) {
            _this.examinerApprovalStatus = saveMarksAndAnnotationErrorCode;
            _this.navigateReponse = navigatingTo;
            var currentQig = qigStore.instance.getOverviewData.qigSummary
                .filter(function (qig) {
                return qig.examinerRoleId ===
                    examinerStore.instance.getMarkerInformation.examinerRoleId;
            })
                .first();
            // removes entry from recent history
            teamManagementActionCreator.removeHistoryItem(currentQig ? currentQig.markSchemeGroupId : 0);
            _this.setState({
                doShowSavingMarksAndAnnotationsIndicator: false,
                isWithdrawnResponseError: true,
                isBusy: false
            });
        };
        /**
         *  This will remove the item from marksAndAnnotations save processing queue.
         */
        this.onSetHasNonRecoverableError = function (markGroupId) {
            // Calling the helper method to update the marks and annotations queue
            var queueOperation = enums.MarksAndAnnotationsQueueOperation.Remove;
            marksAndAnnotationsSaveHelper.onSaveMarksAndAnnotations(markGroupId, queueOperation);
        };
        /**
         * Method to show the busy indicator on triggering saving of marks and annotations
         */
        this.onSaveMarksAndAnnotationsTriggered = function (saveMarksAndAnnotationTriggeringPoint) {
            if (saveMarksAndAnnotationTriggeringPoint !==
                enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None &&
                saveMarksAndAnnotationTriggeringPoint !==
                    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
                _this.setState({
                    doShowSavingMarksAndAnnotationsIndicator: true
                });
            }
        };
        /**
         * Go to logout after saving mark if there is any
         */
        this.navigateAwayFromResponse = function () {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toLogout) {
                var logoutData = new logoutArgument();
                logoutData.MarkingSessionTrackingId = parseInt(loginSession.MARKING_SESSION_TRACKING_ID);
                logoutActionCreator.updateUserSession(logoutData);
            }
            else {
                // reset mark entry deactivators on navigating away from response.
                keyDownHelper.instance.resetMarkEntryDeactivators();
                // we are deactivating the keydown helper while message panel or exception panel is open. We are disabling that
                // during the corresponding panel is close. If user is navigate away from response screen without closing the message panel
                // then we've to activate the keydown helper
                if (messageStore.instance.isMessagePanelVisible) {
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
                }
                else if (exceptionStore.instance.isExceptionPanelVisible) {
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                }
                else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toMenu) {
                    markingActionCreator.removeMarkEntrySelection();
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Menu);
                }
            }
        };
        /**
         * Method to show the busy indicator on triggering saving of marks and annotations
         */
        this.refreshState = function () {
            switch (navigationStore.instance.containerPage) {
                case enums.PageContainers.Login:
                    _this.clearSession();
                    break;
            }
        };
        /*
         * On Accept Quality Feedback Action completedF
         */
        this.onAcceptQualityFeedbackActionCompleted = function () {
            var responseModeBasedOnQualityFeedback = qualityFeedbackHelper.getResponseModeBasedOnQualityFeedback();
            if (responseModeBasedOnQualityFeedback !== enums.ResponseMode.closed) {
                var responseMode = responseModeBasedOnQualityFeedback !== undefined
                    ? responseModeBasedOnQualityFeedback
                    : enums.ResponseMode.open;
                if (qigStore.instance.selectedQIGForMarkerOperation) {
                    worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, worklistStore.instance.currentWorklistType, responseMode, worklistStore.instance.getRemarkRequestType, worklistStore.instance.isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation
                        .isElectronicStandardisationTeamMember);
                }
            }
        };
        /**
         * Show response in grace not fully marked message.
         */
        this.showResponseInGraceNotFullyMarkedMessage = function (failureReason) {
            _this._failureReason = failureReason;
            _this.setState({ isDisplayingGraceResponseLessthan100PercentageError: true });
        };
        /**
         * Show mandatory message popup
         */
        this.showMandatoryMessagePopup = function (isUnreadMandatoryMessagePresent, triggerPoint) {
            if (isUnreadMandatoryMessagePresent) {
                _this.mandatoryMessageTriggeringPoint = triggerPoint;
                _this.onPopUpDisplayEvent(enums.PopUpType.MandatoryMessage, enums.PopUpActionType.Show, null);
            }
        };
        /**
         * Display the corresponding popups
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType, popUpData) {
            _this.popUpData = popUpData;
            if (popUpActionType === enums.PopUpActionType.Show) {
                _this.setState({ popUpType: popUpType });
            }
        };
        /**
         * handle different popup actions
         */
        this.handlePopUpAction = function (popUpType, popUpActionType) {
            switch (popUpActionType) {
                case enums.PopUpActionType.Show:
                    break;
                case enums.PopUpActionType.Yes:
                    // when navigated from message panel the navigate action is called
                    if (_this.messageNavigationArguments) {
                        _this.messageNavigationArguments.canNavigate = true;
                        messagingActionCreator.canMessageNavigate(_this.messageNavigationArguments);
                        _this.messageNavigationArguments = undefined;
                        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                        _this.setState({ popUpType: undefined });
                    }
                    else {
                        popUpDisplayActionCreator.popUpDisplay(popUpType, popUpActionType, messageStore.instance.navigateFrom, {});
                        _this.setState({ popUpType: undefined });
                    }
                    break;
                case enums.PopUpActionType.No:
                    _this.messageNavigationArguments = undefined;
                    popUpDisplayActionCreator.popUpDisplay(popUpType, popUpActionType, messageStore.instance.navigateFrom, {});
                    _this.setState({ popUpType: undefined });
                    break;
                case enums.PopUpActionType.Ok:
                    if (popUpType === enums.PopUpType.MandatoryMessage &&
                        _this.props.footerType !== enums.FooterType.Message) {
                        //Response displayed in Atypical worklist even after changing the response to 'On hold' in AI Image Management
                        //so do refresh worklist content when mandatory message popup appears
                        //This will affect all response types except live.
                        _this.storageAdapterHelper.clearStorageArea('worklist');
                        // redirecting to inbox screen, if user currently not in the message screen
                        navigationHelper.loadMessagePage();
                    }
                    else if (popUpType === enums.PopUpType.MandatoryMessage &&
                        _this.props.footerType === enums.FooterType.Message &&
                        _this.mandatoryMessageTriggeringPoint !== enums.TriggerPoint.MessageStore) {
                        // we don't need to refresh inbox tab if we found mandatory messages are available during message loading action
                        // refresh the inbox tab with selected mandatory message
                        messagingActionCreator.refreshMessageFolder(enums.MessageFolderType.Inbox);
                    }
                    _this.mandatoryMessageTriggeringPoint = enums.TriggerPoint.None;
                    _this.setState({ popUpType: undefined });
                    break;
            }
        };
        /**
         * On response submission completed
         */
        this.onSubmitResponseCompleted = function (fromMarkScheme, submittedMarkGroupIds, selectedDisplayId) {
            _this.submitMessageErrorPopupContent = worklistComponentHelper.showMessageOnSubmitResponse(submitStore.instance.getSubmittedResponsesCount());
            /* Logging event in google analytics or application insights based on the configuration */
            new auditLoggingHelper().logHelper.logEventOnSubmitResponse(submitStore.instance.getSubmittedResponsesCount(), submittedMarkGroupIds);
            var messageKey = '';
            var messageHeaderKey = undefined;
            // If No validation Error, Check the whether to display the Quality Feedback Message
            if (worklistComponentHelper.shouldShowQualityFeedbackMessage()) {
                messageKey = localeStore.instance.TranslateText('marking.worklist.quality-feedback-dialog.body');
                messageHeaderKey = localeStore.instance.TranslateText('marking.worklist.quality-feedback-dialog.header');
            }
            else if (submitStore.instance.getCurrentWorklistType === enums.WorklistType.standardisation ||
                submitStore.instance.getCurrentWorklistType === enums.WorklistType.secondstandardisation) {
                if (submitStore.instance.getSubmitResponseReturn.examinerApprovalStatus ===
                    enums.ExaminerApproval.Approved) {
                    messageKey = localeStore.instance.TranslateText(worklistComponentHelper.getAutoApprovalSecondaryContent(submittedMarkGroupIds.length));
                    messageHeaderKey = localeStore.instance.TranslateText('marking.worklist.auto-approved-dialog.header');
                }
            }
            if (messageKey !== '') {
                _this.messageDetails = {
                    messageHeader: messageHeaderKey,
                    messageString: messageKey,
                    submittedMarkGroupIds: submittedMarkGroupIds,
                    displayId: selectedDisplayId,
                    isFromMarkScheme: fromMarkScheme
                };
                _this.setState({
                    doShowSavingMarksAndAnnotationsIndicator: false,
                    isBusy: false,
                    doShowPopup: true
                });
            }
            else if (_this.submitMessageErrorPopupContent !== undefined) {
                _this.setState({
                    isSubmitErrorPopDisplaying: true,
                    isBusy: false,
                    doShowSavingMarksAndAnnotationsIndicator: false
                });
            }
            else {
                _this.navigateAfterSubmit(submittedMarkGroupIds, selectedDisplayId, fromMarkScheme);
            }
        };
        /**
         * Navigate after the submit
         */
        this.navigateAfterSubmit = function (submittedMarkGroupIds, displayId, fromMarkScheme) {
            // Inform response navigation module.
            responseActionCreator.navigateAfterSubmit(submittedMarkGroupIds, displayId, fromMarkScheme);
            // Navigate to corresponding worklist even if not in QualityFeedbackOutstanding,
            // to ensure that the navigation happens correctly at the time of submition.
            qualityFeedbackHelper.forceNavigationToWorklist(submitStore.instance.getSubmitResponseReturn.hasQualityFeedbackOutstanding);
            // Refresh the worklist
            _this.initiateContentRefresh();
            // Clear the marks and annotations if needed for Reloading the DefinitiveMarks
            submitHelper.clearMarksAndAnnotations(submittedMarkGroupIds);
        };
        /**
         * This will display the unread mandatory message popup while user in message screen using background pulse
         */
        this.onUpdateNotification = function (unreadMessageCount, isMessageReadCountChanged, unreadMandatoryMessageCount) {
            // display unread mandatory messages are available popup while user in message screen and not composing a message
            if (unreadMandatoryMessageCount > 0 &&
                _this.props.footerType === enums.FooterType.Message &&
                !messageStore.instance.isMessagePanelVisible) {
                _this.mandatoryMessageTriggeringPoint = enums.TriggerPoint.BackgroundPulse;
                _this.onPopUpDisplayEvent(enums.PopUpType.MandatoryMessage, enums.PopUpActionType.Show, null);
            }
        };
        /**
         * Show pop up if the message panel is edited on navigation
         */
        this.onMessagePanelEdited = function (messageNavigationArgument) {
            if (messageNavigationArgument.hasMessageContainsDirtyValue &&
                !messageNavigationArgument.navigationConfirmed) {
                _this.messageNavigationArguments = messageNavigationArgument;
                _this.messageNavigationArguments.navigationConfirmed = true;
                if (messageNavigationArgument.navigateTo === enums.MessageNavigation.newException ||
                    messageNavigationArgument.navigateTo ===
                        enums.MessageNavigation.exceptionWithInResponse) {
                    _this.popUpData.popupContent = localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-open-another');
                }
                else if (messageNavigationArgument.navigateTo === enums.MessageNavigation.ChangeStatus) {
                    _this.popUpData.popupContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing');
                }
                else {
                    _this.popUpData.popupContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-navigated-away');
                }
                _this.setState({ popUpType: enums.PopUpType.DiscardMessageNavigateAway });
            }
        };
        /**
         * Show mandatory message validation popup
         */
        this.mandatoryMessageValidationPopupVisibility = function () {
            _this.setState({ doShowMandatoryMessageValidationPopup: true });
        };
        /**
         * Check the QIG got withdrwan
         */
        this.onResponseDataReceived = function (searchedResponseData) {
            if (searchedResponseData.approvalStatusId === enums.ExaminerApproval.Withdrawn) {
                teamManagementActionCreator.removeHistoryItem(searchedResponseData.markSchemeGroupId);
                _this.setState({ isWithdrawnResponseError: true, isBusy: false });
            }
        };
        /**
         * show error popup on response search failed
         */
        this.onResponseDataReceivedFailed = function (serviceFailed) {
            // If this service failed then we dont know whether the response is available or not
            if (!serviceFailed) {
                return;
            }
            _this.setState({ isResponseSearchFailed: true, isBusy: false });
        };
        this.handleErrorNavigationTeamManagement = function (failureCode, markSchemeGroupId) {
            if (markSchemeGroupId === void 0) { markSchemeGroupId = 0; }
            switch (failureCode) {
                case enums.FailureCode.SubordinateExaminerWithdrawn:
                case enums.FailureCode.HierarchyChanged:
                    navigationHelper.loadTeamManagement();
                    userInfoActionCreator.changeMenuVisibility(false);
                    break;
                case enums.FailureCode.Withdrawn:
                    _this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
                    navigationHelper.loadQigSelector();
                    userInfoActionCreator.changeMenuVisibility(false);
                    teamManagementActionCreator.removeHistoryItem(markSchemeGroupId);
                    break;
            }
        };
        /**
         * Adding current items to history based upon the user's action
         */
        this.addToRecentHistory = function () {
            if (!worklistStore.instance.isMarkingCheckMode) {
                _this.addSelectedQigDetailsToUserOption();
            }
            // If the container page is response we dont want to add that to the history
            if (!qigStore.instance.selectedQIGForMarkerOperation ||
                worklistStore.instance.isMarkingCheckMode ||
                navigationStore.instance.containerPage === enums.PageContainers.Response ||
                markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                return;
            }
            var _historyItem = new historyItem();
            // QIG Name based on string format CC
            _historyItem.qigName = stringFormatHelper.formatAwardingBodyQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName, qigStore.instance.selectedQIGForMarkerOperation.assessmentCode, qigStore.instance.selectedQIGForMarkerOperation.sessionName, qigStore.instance.selectedQIGForMarkerOperation.componentId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperName, qigStore.instance.selectedQIGForMarkerOperation.assessmentName, qigStore.instance.selectedQIGForMarkerOperation.componentName, stringFormatHelper.getOverviewQIGNameFormat());
            // adding to history item based on Marker Operation Mode
            if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                var _teamManagementHistoryInfo = new teamManagementHistoryInfo();
                _teamManagementHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
                _teamManagementHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
                _historyItem.qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                _historyItem.timeStamp = Date.now();
                _teamManagementHistoryInfo.remarkRequestType =
                    worklistStore.instance.getRemarkRequestType;
                _teamManagementHistoryInfo.subordinateExaminerRoleID =
                    navigationStore.instance.containerPage !== enums.PageContainers.TeamManagement
                        ? teamManagementStore.instance.examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerRoleId
                            : 0
                        : 0;
                _teamManagementHistoryInfo.subordinateExaminerID =
                    navigationStore.instance.containerPage !== enums.PageContainers.TeamManagement
                        ? teamManagementStore.instance.examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerId
                            : 0
                        : 0;
                _teamManagementHistoryInfo.supervisorExaminerRoleID = teamManagementStore.instance
                    .selectedExaminerRoleId
                    ? teamManagementStore.instance.selectedExaminerRoleId
                    : operationModeHelper.examinerRoleId;
                _teamManagementHistoryInfo.selectedTab = teamManagementStore.instance
                    .selectedTeamManagementTab
                    ? teamManagementStore.instance.selectedTeamManagementTab
                    : enums.TeamManagement.MyTeam;
                _teamManagementHistoryInfo.currentContainer = navigationStore.instance.containerPage;
                _historyItem.team = _teamManagementHistoryInfo;
            }
            else {
                var _worklistHistoryInfo = new worklistHistoryInfo();
                _worklistHistoryInfo.worklistType = worklistStore.instance.currentWorklistType;
                _worklistHistoryInfo.responseMode = worklistStore.instance.getResponseMode;
                _historyItem.qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
                _historyItem.timeStamp = Date.now();
                _worklistHistoryInfo.remarkRequestType = worklistStore.instance.getRemarkRequestType;
                _historyItem.myMarking = _worklistHistoryInfo;
            }
            var _isMarkingEnabled = qigStore.instance.selectedQIGForMarkerOperation &&
                qigStore.instance.selectedQIGForMarkerOperation.isMarkingEnabled;
            _historyItem.markingMethodId =
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod;
            _historyItem.isElectronicStandardisationTeamMember =
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
            // used for showing/hiding marking link in menu's histroy list under menu tab
            _historyItem.isMarkingEnabled =
                _isMarkingEnabled &&
                    qigStore.instance.selectedQIGForMarkerOperation.examinerQigStatus !==
                        enums.ExaminerQIGStatus.WaitingStandardisation &&
                    qigStore.instance.selectedQIGForMarkerOperation.currentMarkingTarget != null;
            // used for showing/hiding teammanagement link in menu's histroy list under menu tab
            _historyItem.isTeamManagementEnabled =
                qigStore.instance.selectedQIGForMarkerOperation &&
                    qigStore.instance.selectedQIGForMarkerOperation.isTeamManagementEnabled;
            _historyItem.questionPaperPartId =
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            _historyItem.examinerRoleId = operationModeHelper.examinerRoleId;
            loadContainerActionCreator.addToRecentHistory(_historyItem);
        };
        /**
         * Show No Marking Check Available Popup
         */
        this.showNoMarkingCheckAvailableMessage = function (popUpType, popUpActionType, popUpData) {
            if (popUpActionType === enums.PopUpActionType.Show &&
                popUpType === enums.PopUpType.NoMarkingCheckRequestPossible) {
                _this.setState({
                    popUpType: popUpType,
                    doShowNoMarkingCheckAvailableMessage: true
                });
            }
        };
        /**
         * Navigate to team management
         */
        this.onTeamManagementOpen = function (isFromHistory) {
            if (isFromHistory === void 0) { isFromHistory = false; }
            navigationHelper.loadTeamManagement(isFromHistory);
        };
        /**
         * Marking Check Complete Button Clicked
         */
        this.markCheckCompleteButtonEvent = function () {
            _this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: true });
        };
        /**
         *  Marking Check Completed Event
         */
        this.markCheckCompletedEvent = function () {
            markingCheckActionCreator.getMarkCheckExaminers(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        };
        /**
         * Scroll view when focus comes to text box in android like in ipad
         * Firefox is exclueded, scrollIntoViewIfNeeded is not supporting by browser #49184.
         */
        this.scrollIntoViewOnEditingTextForAndroid = function () {
            var activeElement = document.activeElement;
            if (htmlUtilities.isAndroidDevice &&
                !htmlUtilities.isAndroidFirefox &&
                (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                var that = _this;
                setTimeout(function () {
                    var el = $(activeElement)[0];
                    el.scrollIntoViewIfNeeded(true);
                }, 0);
            }
        };
        /**
         * Show locks in qig popup
         */
        this.onShowLocksInQigsPopup = function (_locksInQigDetailsList) {
            if (qigStore.instance.doShowLocksInQigPopUp &&
                _locksInQigDetailsList.locksInQigDetailsList &&
                _locksInQigDetailsList.locksInQigDetailsList.count()) {
                _this.setState({
                    reRenderLocksInQigPopUp: true
                });
            }
        };
        /**
         * This method will render the pop up with no of locks and qig name
         */
        this.renderLocksInQigPopUp = function () {
            // If Exam body CC's not loaded yet, then do not show the locks popup
            var locksPopup = ccStore.instance.isExamBodyCCLoaded ? (React.createElement(LocksInQigPopup, {showLocksInQigPopUp: _this.state.reRenderLocksInQigPopUp, fromLogout: qigStore.instance.isShowLocksFromLogout, onCancelClickOfLocksInQigPopup: _this.onCancelClickOfLocksInQigPopup, onLogoutClickOfLocksInQigPopup: _this.onLogoutClickOfLocksInQigPopup, id: 'LocksInQigPopup', key: 'LocksInQigPopup_key'})) : null;
            return locksPopup;
        };
        /**
         * Locks in qig list recieved event
         */
        this.onQigSelectedFromLockedList = function (qigId) {
            if (loginStore.instance.isAdminRemarker) {
                // Invoking the action creator to retrieve the Admin remarkers QIG details.
                qigActionCreator.getAdminRemarkerQIGSelectorData(true);
            }
            else {
                // Invoking the action creator to retrieve the QIG list for the QIG Selector
                qigActionCreator.getQIGSelectorData(qigId, true, false, false, true);
            }
        };
        /**
         * Cancel click on locks in qig popup
         * @private
         *
         * @memberof Footer
         */
        this.onCancelClickOfLocksInQigPopup = function () {
            _this.setState({
                reRenderLocksInQigPopUp: false
            });
        };
        this.onLogoutClickOfLocksInQigPopup = function () {
            _this.onYesClickOfLogoutConfirmation(false);
            _this.setState({
                reRenderLocksInQigPopUp: false
            });
        };
        this.navigateToQigFromLockedList = function (isDataFromSearch, isDataFromHistory, isFromLocksInPopUp) {
            if (isDataFromSearch === void 0) { isDataFromSearch = false; }
            if (isDataFromHistory === void 0) { isDataFromHistory = false; }
            if (isFromLocksInPopUp === void 0) { isFromLocksInPopUp = false; }
            if (isFromLocksInPopUp) {
                var changeOperationModePromise = userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);
                var markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
                var openQIGPromise = void 0;
                if (qigStore.instance.getOverviewData) {
                    openQIGPromise = qigActionCreator.openQIG(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false);
                }
                else {
                    openQIGPromise = qigActionCreator.getQIGSelectorData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                }
                var that = _this;
                Promise.Promise
                    .all([changeOperationModePromise, markSchemeGroupCCPromise, openQIGPromise])
                    .then(function (result) {
                    teamManagementActionCreator.openTeamManagement(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, false, true);
                });
            }
            _this.setState({
                reRenderLocksInQigPopUp: false
            });
        };
        this.doLogoutPopup = function (isFromLogout, _locksInQigDetailsList) {
            if (isFromLogout) {
                if (_locksInQigDetailsList.locksInQigDetailsList &&
                    _locksInQigDetailsList.locksInQigDetailsList.count() > 0) {
                    qigActionCreator.showLocksInQigPopup(true, true);
                }
                else {
                    userInfoActionCreator.showLogoutPopup();
                }
            }
        };
        /**
         * show confirmation popup on submiting simulation response
         */
        this.onshowSimulationResponseSubmitConfirmationPopup = function () {
            /**
             * for submit all the markgroup id will always be zero
             */
            if (submitStore.instance.getMarkGroupId > 0) {
                _this.simulationResponseSubmitConfirmationDialogueContent = localeStore.instance.TranslateText('marking.worklist.submit-response-dialog.body-simulation');
                _this.simulationResponseSubmitConfirmationDialogueHeader = localeStore.instance.TranslateText('marking.worklist.submit-response-dialog.header');
            }
            else {
                _this.simulationResponseSubmitConfirmationDialogueContent = localeStore.instance.TranslateText('marking.worklist.submit-all-responses-dialog.body-simulation');
                _this.simulationResponseSubmitConfirmationDialogueHeader = localeStore.instance.TranslateText('marking.worklist.submit-all-responses-dialog.header');
            }
            _this.setState({ showSimulationResponseSubmitConfirmationPopup: true });
        };
        /**
         * call when share toggle button is turned off
         */
        this.shareConfirmationPopup = function (clientToken, showSharePopup) {
            _this.shareConfirmationClientToken = clientToken;
            markingActionCreator.showOrHideRemoveContextMenu(false);
            _this.setState({
                isShared: showSharePopup,
                doShowShareConfirmationPopup: true
            });
        };
        /**
         * Render simulation exited qigs in popup
         */
        this.renderSimulationExitedQigsPopup = function () {
            var secondaryContent = null;
            var footerContent = null;
            if (_this.state.showAllSimulationExitedQigs) {
                secondaryContent = localeStore.instance.TranslateText('marking.worklist.exited-simulation-dialog.subheader-multiple-qigs');
                footerContent = localeStore.instance.TranslateText('marking.worklist.exited-simulation-dialog.body-multiple-qigs');
            }
            else {
                secondaryContent = localeStore.instance.TranslateText('marking.worklist.exited-simulation-dialog.subheader-single-qig');
                footerContent = localeStore.instance.TranslateText('marking.worklist.exited-simulation-dialog.body-single-qig');
            }
            // If Exam body CC's not loaded yet, then do not show the simulation exited qigs popup
            var simulationExitedQigsPopup = ccStore.instance.isExamBodyCCLoaded ? (React.createElement(GenericDialog, {content: null, multiLineContent: _this.getSimulationModeExitedQigs(), header: localeStore.instance.TranslateText('marking.worklist.exited-simulation-dialog.header'), secondaryContent: secondaryContent, displayPopup: _this.state.showSimulationExitedPopup, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: _this.onOKClickOfSimulationExitedQigsPopup.bind(_this), id: 'moveSimulation', key: 'moveSimulationMessage', popupDialogType: enums.PopupDialogType.SimulationExited, footerContent: footerContent})) : null;
            return simulationExitedQigsPopup;
        };
        /**
         * On Ok button click of simulation exited qigs popup
         */
        this.onOKClickOfSimulationExitedQigsPopup = function () {
            var currentContainer = navigationStore.instance.containerPage;
            // When the popup is displayed in the qigselector
            if (_this.state.showAllSimulationExitedQigs &&
                currentContainer === enums.PageContainers.QigSelector) {
                simulationModeHelper.clearCacheBeforBeforeSimulationTargetCompletion();
                simulationModeHelper.handleSimulationTargetCompletion(true);
            }
            else {
                // When only the current qig is shown in the popup
                if (!_this.state.showAllSimulationExitedQigs) {
                    simulationModeHelper.clearCacheBeforBeforeSimulationTargetCompletion();
                    simulationModeHelper.handleSimulationTargetCompletion(false);
                }
            }
            _this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(_this.triggerPointAfterClose);
            _this.triggerPointAfterClose = 0;
        };
        /**
         * When standardisation setup is completed in background
         */
        this.onStandardisationSetupCompletionInBackground = function () {
            if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                _this.setState({
                    showSimulationExitedPopup: true,
                    showAllSimulationExitedQigs: false
                });
            }
        };
        /**
         * On simulation target completion
         */
        this.onSimulationTargetCompletion = function () {
            var navigateTo = qigStore.instance.navigateToAfterStdSetupCheck;
            _this.setState({
                showSimulationExitedPopup: false
            });
            if (!_this.state.showAllSimulationExitedQigs) {
                if (navigateTo === enums.PageContainers.Message) {
                    navigationHelper.loadMessagePage();
                }
                else if (navigateTo === enums.PageContainers.WorkList) {
                    navigationHelper.loadWorklist();
                }
                else if (navigateTo === enums.PageContainers.TeamManagement) {
                    navigationHelper.loadTeamManagement();
                }
            }
        };
        /**
         * On getting the simulation exited qigs and locks in qigs data
         */
        this.onSimulationExitedQigsAndLocksInQigsRecieved = function (isFromLogout) {
            if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
                // If there are simulation exited qigs then show the popup
                _this.setState({
                    showSimulationExitedPopup: true,
                    showAllSimulationExitedQigs: true
                });
            }
            else if (simulationModeHelper.isLockInQigsDataAvailable) {
                // Show locks if there is no simulation
                qigActionCreator.showLocksInQigPopup(true, isFromLogout);
            }
        };
        /**
         * On standardisation setup completion
         */
        this.onStandardisationSetupCompletion = function () {
            if (qigStore.instance.isStandardisationsetupCompletedForTheQig &&
                qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                _this.setState({
                    showSimulationExitedPopup: true,
                    showAllSimulationExitedQigs: false
                });
            }
            else if (qigStore.instance.navigateToAfterStdSetupCheck === enums.PageContainers.Login) {
                // Checking whether there are any locked examiners currently, if the standardisation setup was not completed
                // and the user was trying to logout.
                qigActionCreator.getLocksInQigs(true);
            }
        };
        /**
         * On getting the simulation exited qigs data
         */
        this.onSimulationExitedQigsRecieved = function () {
            if (simulationModeHelper.isSimulationExitedQigDataAvailable) {
                _this.setState({
                    showSimulationExitedPopup: true,
                    showAllSimulationExitedQigs: true
                });
            }
        };
        /**
         * Method to be invoked when browser is online.
         */
        this.updateOnlineStatus = function () {
            // sends ping to validate network is offline
            applicationActionCreator.validateNetWorkStatus(true);
        };
        /**
         * On ok click of submit response error popup
         */
        this.onSubmitResponseErrorPopupOkClick = function () {
            _this.setState({ isSubmitErrorPopDisplaying: false });
            _this.initiateContentRefresh();
            if (ecourseworkHelper.isECourseworkComponent) {
                ecourseworkHelper.clearEcourseworkFileData();
            }
            else {
                navigationHelper.loadWorklist();
            }
        };
        /**
         * On OK click of Autozoned message popup
         */
        this.onAutozonedWarningMessageOkClick = function () {
            //change the state to false to close the popup
            _this.setState({ isAutozonedMessagePopupDisplaying: false });
        };
        /**
         * On Ecoursework File data cleared
         */
        this.onEcourseworkFileDataCleared = function () {
            ecourseworkHelper.fetchECourseWorkCandidateScriptMetadata(null, true);
            navigationHelper.loadWorklist();
        };
        /**
         * on click select to mark popup in Std setup centre script
         */
        this.onSelectStdSetupResponseToMark = function (popupType) {
            _this.setState({ popUpType: popupType });
        };
        /**
         * on cancel click of the select response to mark as provisional popup
         */
        this.onCancelClickOfSelectResponseToMarkasProvisional = function () {
            _this.setState({ popUpType: enums.PopUpType.None });
        };
        /**
         * cancel click on mark as definitive popup.
         */
        this.onCancelClickOnMarkAsDefinitivePopUp = function () {
            _this.setState({ popUpType: enums.PopUpType.None });
            _this.copyMarksAsDefinitiveSelected = true;
        };
        /**
         * submit click on mark as definitive popup.
         */
        this.submitClickOnMarkAsDefinitivePopUp = function () {
            _this.setState({ popUpType: enums.PopUpType.None });
            standardisationActionCreator.copyMarksAndAnnotationsAsDefinitive(_this.copyMarksAsDefinitiveSelected);
        };
        /**
         * on mark later clicked for select responses popup to move as provisional
         */
        this.selectProvisionalMarkLaterClick = function () {
            var markSchemeGroupIds = Array();
            markSchemeGroupIds.push(standardisationSetupStore.instance.markSchemeGroupId);
            standardisationActionCreator.createStandardisationRig(standardisationSetupStore.instance.examinerRoleId, standardisationSetupStore.instance.selectedResponseId, markSchemeGroupIds, enums.MarkingMode.PreStandardisation, false);
        };
        /**
         * on mark now clicked for select responses popup to move as provisional
         */
        this.selectProvisionalMarkNowClick = function () {
            var markSchemeGroupIds = Array();
            markSchemeGroupIds.push(standardisationSetupStore.instance.markSchemeGroupId);
            standardisationActionCreator.createStandardisationRig(standardisationSetupStore.instance.examinerRoleId, standardisationSetupStore.instance.selectedResponseId, markSchemeGroupIds, enums.MarkingMode.PreStandardisation, true);
        };
        /**
         * navigate to standardisation setup screen on mark later
         */
        this.onStandardisationRigCreated = function (errorInRigCreation, doMarkNow) {
            _this.setState({ popUpType: enums.PopUpType.None });
            if (!errorInRigCreation) {
                navigationHelper.loadStandardisationSetup();
                // promise to get standardisation target details
                var getStandardisationTargetDetails = standardisationActionCreator.getStandardisationTargetDetails(standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
                getStandardisationTargetDetails.then(function (item) {
                    // load select Responses details on coming from response
                    var standardisationworlist = standardisationActionCreator.standardisationSetupWorkListSelection(doMarkNow ? enums.StandardisationSetup.ProvisionalResponse : enums.StandardisationSetup.SelectResponse, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
                });
            }
        };
        /**
         * on cancel click of reclassify multi option popup
         */
        this.onCancelClickOfReclassifyMultiOptionPopUp = function () {
            _this.reclassifyResponseDetails = undefined;
            _this.populateRecassifyMultiOptionPopUpData();
            _this.setState({ popUpType: enums.PopUpType.None });
        };
        /**
         * reclassify response to selected marking mode in popup
         */
        this.onReclassifyResponse = function () {
            // Fetch markSchemeGroupId 
            var markSchemeGroupId = standardisationSetupStore.instance.markSchemeGroupId;
            // Fetch the new marking mode id selected for reclassification
            var reclassifyMarkingModeId = _this.items.filter(function (i) { return i.isChecked === true; })[0].id;
            // Construct the model for reclassifyResponseAction
            var reclassifyResponseDetails = {
                candidateScriptId: _this.reclassifyResponseDetails.candidateScriptId,
                esCandidateScriptMarkSchemeGroupId: _this.reclassifyResponseDetails.esCandidateScriptMarkSchemeGroupId,
                markSchemeGroupId: markSchemeGroupId,
                markingModeId: reclassifyMarkingModeId,
                previousMarkingModeId: _this.reclassifyResponseDetails.markingModeId,
                rigOrder: null,
                isRigOrderUpdateRequired: true,
                displayId: _this.reclassifyResponseDetails.displayId,
                totalMarkValue: _this.reclassifyResponseDetails.totalMarkValue,
                oldRigOrder: _this.reclassifyResponseDetails.rigOrder,
                assignNextRigOrder: reclassifyMarkingModeId !== enums.MarkingMode.Seeding ? true : false
            };
            // No need to call reclassify action if there is no change in marking mode 
            if (reclassifyResponseDetails.previousMarkingModeId !== reclassifyResponseDetails.markingModeId) {
                standardisationActionCreator.reclassifyResponse(reclassifyResponseDetails, false);
            }
            // reset state 
            _this.reclassifyResponseDetails = undefined;
            _this.populateRecassifyMultiOptionPopUpData();
            _this.setState({ popUpType: enums.PopUpType.None });
        };
        /**
         * Set the state of popup type to ReclassifyMultiOption
         */
        this.reclassifyMultiOptionPopupOpen = function (esMarkGroupId) {
            _this.reclassifyResponseDetails =
                standardisationSetupStore.instance.getResponseDetailsByEsMarkGroupIdBasedOnPermission(esMarkGroupId);
            _this.populateRecassifyMultiOptionPopUpData(_this.reclassifyResponseDetails.markingModeId);
            _this.setState({ popUpType: enums.PopUpType.ReclassifyMultiOption });
        };
        /**
         * On clicking items in radio button popup
         * @param item
         */
        this.onCheckedChange = function (itemToBeUpdated) {
            // set the isChecked property of the checked item to true
            _this.items.map(function (i) {
                i.isChecked = i.id === itemToBeUpdated.id ? true : false;
            });
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            doShowSavingMarksAndAnnotationsIndicator: false,
            isNonRecoverableErrorPopupVisible: false,
            isDisplayingGraceResponseLessthan100PercentageError: false,
            isDisplayingGraceResponseExpiredError: false,
            isDisplayingResponseRemovedError: false,
            isOnline: applicationStore.instance.isOnline,
            isBusy: false,
            isApplicationOffline: false,
            nonRecoverableSaveMarksAndAnnotationsErrorMessage: false,
            isMarkingCheckCompleteConfirmationPopupDisplaying: false,
            doShowPopup: false,
            showSimulationResponseSubmitConfirmationPopup: false,
            showSimulationExitedPopup: false,
            showAllSimulationExitedQigs: false,
            renderedOn: 0,
            isShared: false,
            doShowShareConfirmationPopup: false,
            isQigsessionClosedError: false,
            popUpType: enums.PopUpType.None
        };
        this.onYesClickOfLogoutConfirmation = this.onYesClickOfLogoutConfirmation.bind(this);
        this.onYesClickOfLogoutConfirmationAutoLogout = this.onYesClickOfLogoutConfirmation.bind(this, true);
        this.onNoClickOfLogoutConfirmation = this.onNoClickOfLogoutConfirmation.bind(this);
        this.onOkClickOfNonRecoverableErrorMessage = this.onOkClickOfNonRecoverableErrorMessage.bind(this);
        this.userActionInterrupted = this.userActionInterrupted.bind(this);
        this.onOkClickMandatoryMessageValidationPopup = this.onOkClickMandatoryMessageValidationPopup.bind(this);
        this.onPopupOkClick = this.onPopupOkClick.bind(this);
        this.ShowSupervisorSamplingCommentValidationPopup = this.ShowSupervisorSamplingCommentValidationPopup.bind(this);
        this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage =
            this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage.bind(this);
        /* setting submit confirmation yes/no functions to initialize. */
        this.onYesClickOfSubmitButton = this.onYesClickOfSubmitButton.bind(this);
        this.onNoClickOfSubmitButton = this.onNoClickOfSubmitButton.bind(this);
        this.onYesClickOfShareConfirmationPopup = this.onYesClickOfShareConfirmationPopup.bind(this);
        this.onNoClickOfShareConfirmationPopup = this.onNoClickOfShareConfirmationPopup.bind(this);
        this.OnOkClickOfMarkingCheckCompleteConfirmation = this.OnOkClickOfMarkingCheckCompleteConfirmation.bind(this);
        this.OnCancelClickOfMarkingCheckCompleteConfirmation = this.OnCancelClickOfMarkingCheckCompleteConfirmation.bind(this);
        this._boundOnlineStatusEvent = this.updateOnlineStatus.bind(this);
        this.isAutozonedMessagePopupVisible = this.isAutozonedMessagePopupVisible.bind(this);
        this.onSelectStdSetupResponseToMark = this.onSelectStdSetupResponseToMark.bind(this);
        this.onCompleteStandardisationSetup = this.onCompleteStandardisationSetup.bind(this);
        this.onOkClickofStandardisationSetupValidate = this.onOkClickofStandardisationSetupValidate.bind(this);
        this.resetBusyIndicatorStdSetupNotComplete = this.resetBusyIndicatorStdSetupNotComplete.bind(this);
        this.OnCancelClickOfCompleteStandardisationConfirmation = this.OnCancelClickOfCompleteStandardisationConfirmation.bind(this);
        this.OnOkClickOfCompleteStandardisationConfirmation = this.OnOkClickOfCompleteStandardisationConfirmation.bind(this);
        this.onResponseDataRecievedAfterRefresh = this.onResponseDataRecievedAfterRefresh.bind(this);
        if (config.general.IDLE_TIMEOUT) {
            this._idleTimeOut = config.general.IDLE_TIMEOUT;
        }
    }
    /**
     * Render component
     * @returns
     */
    Footer.prototype.render = function () {
        var isAskOnLogOutEnabled;
        var confirmationDialog;
        var busyIndicator;
        var submitConfirmationDialog = (React.createElement(ConfirmationDialog, {content: this.submitConfirmationDialogueContent, header: this.submitConfirmationDialogueHeader, displayPopup: this.state.isSubmitConfirmationPopupDisplaying, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'), onYesClick: this.onYesClickOfSubmitButton, onNoClick: this.onNoClickOfSubmitButton, isKeyBoardSupportEnabled: true, dialogType: enums.PopupDialogType.LogoutConfirmation}));
        var shareConfirmationPopup = this.state.isShared ? (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('marking.response.share-confirmation-popup.content'), header: null, displayPopup: this.state.doShowShareConfirmationPopup, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('marking.response.share-confirmation-popup.no-button'), yesButtonText: localeStore.instance.TranslateText('marking.response.share-confirmation-popup.yes-button'), onYesClick: this.onYesClickOfShareConfirmationPopup.bind(this), onNoClick: this.onNoClickOfShareConfirmationPopup.bind(this), dialogType: enums.PopupDialogType.ShareConfirmationPopup, isKeyBoardSupportEnabled: true})) : null;
        var mandatoryMessageValidationPopup = (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('messaging.compose-message.mandatory-message-warning-dialog.body'), header: localeStore.instance.TranslateText('messaging.compose-message.mandatory-message-warning-dialog.header'), displayPopup: this.state.doShowMandatoryMessageValidationPopup, okButtonText: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button'), onOkClick: this.onOkClickMandatoryMessageValidationPopup.bind(this), id: 'mandatoryMessageValidationPopup', key: 'mandatoryMessageValidationPopup', popupDialogType: enums.PopupDialogType.none}));
        var supervisorSamplingCommentValidationPopup = (React.createElement(GenericDialog, {content: this.messageDetails.messageString, header: this.messageDetails.messageHeader, displayPopup: this.state.doShowPopup, okButtonText: localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.ok-button'), onOkClick: this.onPopupOkClick.bind(this), id: 'supervisorSamplingCommentValidationPopup', key: 'supervisorSamplingCommentValidationPopup', popupDialogType: enums.PopupDialogType.GenericMessage}));
        var simulationResponseSubmitConfirmationPopup = (React.createElement(ConfirmationDialog, {content: this.simulationResponseSubmitConfirmationDialogueContent, header: this.simulationResponseSubmitConfirmationDialogueHeader, displayPopup: this.state.showSimulationResponseSubmitConfirmationPopup, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'), onYesClick: this.onYesClickOfSimulationResponseSubmitButton.bind(this), onNoClick: this.onNoClickOfSimulationResponseSubmitButton.bind(this), dialogType: enums.PopupDialogType.SimulationResponseSubmitConfirmation}));
        /** Getting Ask On LogOut value from user option */
        isAskOnLogOutEnabled =
            userOptionsHelper.getUserOptionByName(useroptionKeys.ASK_ON_LOG_OUT) === 'true'
                ? true
                : false;
        /** this.props.isConfirmationPopupDisplaying check included here, in the initial load its value
         *    will be false
         */
        if (!isAskOnLogOutEnabled &&
            this.props.isLogoutConfirmationPopupDisplaying &&
            !this.state.doShowSavingMarksAndAnnotationsIndicator &&
            !this._onLogoutTriggered) {
            this.onYesClickOfLogoutConfirmation();
        }
        else if (this.props.isLogoutConfirmationPopupDisplaying &&
            !this.state.doShowSavingMarksAndAnnotationsIndicator &&
            !this._onLogoutTriggered) {
            confirmationDialog = (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('generic.logout-dialog.body'), header: localeStore.instance.TranslateText('generic.logout-dialog.header'), displayPopup: this.props.isLogoutConfirmationPopupDisplaying, isCheckBoxVisible: true, noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'), onYesClick: this.onYesClickOfLogoutConfirmation, onNoClick: this.onNoClickOfLogoutConfirmation, dialogType: enums.PopupDialogType.LogoutConfirmation}));
        }
        if (this.state.isBusy) {
            switch (busyIndicatorStore.instance.getBusyIndicatorInvoker) {
                case enums.BusyIndicatorInvoker.submitInResponseScreen:
                    busyIndicator = (React.createElement(BusyIndicator, {id: 'response_' +
                        enums.BusyIndicatorInvoker.submitInResponseScreen.toString(), isBusy: this.state.isBusy, key: 'response_' +
                        enums.BusyIndicatorInvoker.submitInResponseScreen.toString(), isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.submitInResponseScreen, showBackgroundScreen: false, isOffline: !this.state.isOnline}));
                    break;
                case enums.BusyIndicatorInvoker.loadingHistoryDetails:
                    busyIndicator = (React.createElement(BusyIndicator, {id: 'history_' +
                        enums.BusyIndicatorInvoker.loadingHistoryDetails.toString(), isBusy: this.state.isBusy, key: 'history_' +
                        enums.BusyIndicatorInvoker.loadingHistoryDetails.toString(), isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.loadingHistoryDetails, showBackgroundScreen: false, isOffline: !this.state.isOnline}));
                    break;
                case enums.BusyIndicatorInvoker.validateStandardisationSetup:
                    busyIndicator = (React.createElement(BusyIndicator, {id: 'std_' +
                        enums.BusyIndicatorInvoker.validateStandardisationSetup.toString(), isBusy: this.state.isBusy, key: 'std_' +
                        enums.BusyIndicatorInvoker.validateStandardisationSetup.toString(), isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.validateStandardisationSetup, showBackgroundScreen: false, isOffline: !this.state.isOnline}));
                    break;
            }
        }
        if (this.state.isCompleteStandardisation && this.state.isBusy === true) {
            busyIndicator = (React.createElement(BusyIndicator, {id: 'std_' +
                enums.BusyIndicatorInvoker.completingStandardisationSetup.toString(), isBusy: this.state.isBusy, key: 'std_' +
                enums.BusyIndicatorInvoker.completingStandardisationSetup.toString(), isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.completingStandardisationSetup, showBackgroundScreen: false, isOffline: !this.state.isOnline}));
        }
        if (this.state.doShowSavingMarksAndAnnotationsIndicator) {
            busyIndicator = (React.createElement(BusyIndicator, {id: 'response_' +
                enums.BusyIndicatorInvoker.savingMarksAndAnnotations.toString(), isBusy: this.state.doShowSavingMarksAndAnnotationsIndicator, key: 'response_' +
                enums.BusyIndicatorInvoker.savingMarksAndAnnotations.toString(), isMarkingBusy: false, busyIndicatorInvoker: enums.BusyIndicatorInvoker.savingMarksAndAnnotations, showBackgroundScreen: false, isOffline: !this.state.isOnline}));
        }
        var nonRecoverableErrorMessage = (React.createElement(GenericDialog, {content: this.saveMarksAndAnnotationsErrorDialogContents.content, header: this.saveMarksAndAnnotationsErrorDialogContents.header, multiLineContent: this.saveMarksAndAnnotationsErrorDialogContents.tableContent, displayPopup: this.state.isNonRecoverableErrorPopupVisible, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfNonRecoverableErrorMessage, id: 'nonRecoverableErrorMessge', key: 'marksAndAnnotationsErrorMessge', popupDialogType: enums.PopupDialogType.NonRecoverableDetailedError}));
        var nonRecoverableSaveMarksAndAnnotationsErrorMessage = (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('marking.worklist.response-submission-error-dialog.body-single-response-not-submitted'), header: localeStore.instance.TranslateText('marking.worklist.response-submission-error-dialog.header'), displayPopup: this.state.nonRecoverableSaveMarksAndAnnotationsErrorMessage, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfNonRecoverableErrorMessage, id: 'nonRecoverableSaveMarksAndAnnotationErrorMessge', key: 'saveMarksAndAnnotationsErrorMessge', popupDialogType: enums.PopupDialogType.AllPageNotAnnotated}));
        var gracePeriodResponseUnmarkedDialog = this.state
            .isDisplayingGraceResponseLessthan100PercentageError ? this._failureReason ===
            enums.ResponseNavigateFailureReason.MarksMissingInGracePeriodResponse ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-cannot-leave-response-partially-marked-in-grace'), header: localeStore.instance.TranslateText('marking.response.leaving-response-warning-dialog.header'), displayPopup: this.state.isDisplayingGraceResponseLessthan100PercentageError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseInGraceMessage.bind(this), id: 'responseInGraceMessage', key: 'responseInGraceMessageMessge', popupDialogType: enums.PopupDialogType.GracePeriodWarning})) : (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-must-annotate-all-pages-in-grace'), header: localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.header-must-annotate-all-pages-in-grace'), displayPopup: this.state.isDisplayingGraceResponseLessthan100PercentageError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseInGraceMessage.bind(this), id: 'responseInGraceMessage', key: 'responseInGraceMessageMessge', popupDialogType: enums.PopupDialogType.none})) : null;
        var gracePeriodExpiredErrorDialog = this.state.isDisplayingGraceResponseExpiredError ? (React.createElement(GenericDialog, {content: this.getGracePeriodExpiredMessageBody(), header: localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.header-grace-period-expired'), displayPopup: this.state.isDisplayingGraceResponseExpiredError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage, id: 'responseInGraceMessage', key: 'responseInGraceMessageMessge', popupDialogType: enums.PopupDialogType.none})) : null;
        var responseRemovedErrorDialog = this.state.isDisplayingResponseRemovedError ? (React.createElement(GenericDialog, {content: this.getResponseRemovedErrorDialogMessageBody(), header: localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.header-response-removed-from-worklist'), displayPopup: this.state.isDisplayingResponseRemovedError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage, id: 'response-removed-error-message', key: 'key-response-removed-error-message', popupDialogType: enums.PopupDialogType.none})) : null;
        var confirmationDialogContent;
        if (this.state.popUpType === enums.PopUpType.DiscardMessage) {
            confirmationDialogContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-discard');
        }
        else if (this.state.popUpType === enums.PopUpType.DiscardMessageNavigateAway) {
            if (this.popUpData.popupContent) {
                confirmationDialogContent = this.popUpData.popupContent;
            }
            else {
                confirmationDialogContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-navigated-away');
            }
        }
        else {
            confirmationDialogContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.body-start-new-message-while-composing');
        }
        var discardMessageDialog = this.state.popUpType === enums.PopUpType.DiscardMessage ||
            this.state.popUpType === enums.PopUpType.DiscardMessageNavigateAway ||
            this.state.popUpType === enums.PopUpType.DiscardOnNewMessageButtonClick ? (React.createElement(ConfirmationDialog, {content: this.popUpData.popupContent ? (this.popUpData.popupContent) : (confirmationDialogContent), header: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.header'), displayPopup: true, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.yes-button'), onYesClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.Yes), onNoClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.No), dialogType: enums.PopupDialogType.Message, isKeyBoardSupportEnabled: true})) : null;
        var confirmationHeaderContent;
        switch (this.state.popUpType) {
            case enums.PopUpType.DiscardMessageOnNewException:
            case enums.PopUpType.DiscardMessageOnViewExceptionButtonClick:
                confirmationHeaderContent = localeStore.instance.TranslateText('messaging.compose-message.discard-message-dialog.header');
                break;
            case enums.PopUpType.DiscardExceptionNavigateAway:
                confirmationHeaderContent = localeStore.instance.TranslateText('marking.response.discard-exception-dialog.header');
                confirmationDialogContent = localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-navigate-away');
                break;
            case enums.PopUpType.CloseException:
                confirmationHeaderContent = localeStore.instance.TranslateText('marking.response.close-exception-dialog.header');
                break;
            default:
                confirmationHeaderContent = localeStore.instance.TranslateText('marking.response.discard-exception-dialog.header');
                confirmationDialogContent = localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-raise-new');
                break;
        }
        var discardExceptionDialog = this.state.popUpType === enums.PopUpType.DiscardException ||
            this.state.popUpType === enums.PopUpType.DiscardExceptionNavigateAway ||
            this.state.popUpType === enums.PopUpType.DiscardOnNewExceptionButtonClick ||
            this.state.popUpType === enums.PopUpType.DiscardMessageOnViewExceptionButtonClick ||
            this.state.popUpType === enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick ||
            this.state.popUpType === enums.PopUpType.DiscardExceptionOnViewMessage ||
            this.state.popUpType === enums.PopUpType.DiscardMessageOnNewException ||
            this.state.popUpType === enums.PopUpType.DiscardExceptionOnNewMessage ||
            this.state.popUpType === enums.PopUpType.CloseException ? (React.createElement(ConfirmationDialog, {content: this.popUpData.popupContent ? (this.popUpData.popupContent) : (confirmationDialogContent), header: confirmationHeaderContent, displayPopup: true, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.yes-button'), onYesClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.Yes), onNoClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.No), dialogType: enums.PopupDialogType.Exception, isKeyBoardSupportEnabled: true})) : null;
        var mandatoryMessageDialog = this.state.popUpType === enums.PopUpType.MandatoryMessage ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('messaging.mandatory-message-dialog.body'), header: localeStore.instance.TranslateText('messaging.mandatory-message-dialog.header'), displayPopup: true, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.Ok), id: 'id_mandatory_message_dialog', key: 'key_mandatory_message_dialog', popupDialogType: enums.PopupDialogType.none})) : null;
        var withdrawErrorDialog = this.state.isWithdrawnResponseError ? (React.createElement(GenericDialog, {content: this.getWithdrawnResponseErrorMessage(), header: localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-header-withdrawnMarker'), displayPopup: this.state.isWithdrawnResponseError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfWithDrawErrorMessage.bind(this), id: 'withdrawResponseMessage', key: 'withdrawResponseMessageMessage', popupDialogType: enums.PopupDialogType.none})) : null;
        var sessionClosedErrorDilaog = this.state.isQigsessionClosedError ? (React.createElement(GenericDialog, {content: this.getSessionClosedErrorMessage(), header: localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.header-session-closed'), displayPopup: this.state.isQigsessionClosedError, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfWithDrawErrorMessage.bind(this), id: 'sessionClosedResponseMessage', key: 'sessionClosedResponseMessageMessage', popupDialogType: enums.PopupDialogType.none})) : null;
        var responseSearchFailedErrorDialog = this.state.isResponseSearchFailed ? (React.createElement(GenericDialog, {content: this.getResponseSearchFailedErrorMessage(), header: localeStore.instance.TranslateText('generic.error-dialog.header'), displayPopup: this.state.isResponseSearchFailed, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onOkClickOfResponseSearchFailedErrorMessage.bind(this), id: 'removedResponseMessage', key: 'removedResponseMessageMessage', popupDialogType: enums.PopupDialogType.none})) : null;
        var applicationOffLineErrorMessage = this.state.isApplicationOffline ? (React.createElement(GenericDialog, {content: this.offlineErrorMessage, header: localeStore.instance.TranslateText('generic.offline-dialog.header'), displayPopup: this.state.isApplicationOffline, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onApplicationErrorMessagePopUpClicked.bind(this), id: 'offlineErrorMessge', key: 'offlineErrorMessge', popupDialogType: enums.PopupDialogType.OffLineWarning})) : null;
        var idleTimer = this.state.isOnline ? (React.createElement(IdleTimer, {idleAction: this.onYesClickOfLogoutConfirmationAutoLogout, timeout: this._idleTimeOut})) : null;
        var noMarkingCheckAvailableMessage = this.state.popUpType === enums.PopUpType.NoMarkingCheckRequestPossible ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.body-no-examiners-available'), header: localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.header-no-examiners-available'), displayPopup: this.state.doShowNoMarkingCheckAvailableMessage, okButtonText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button'), onOkClick: this.handlePopUpAction.bind(this, this.state.popUpType, enums.PopUpActionType.Ok), id: 'id_no_marking_check_message', key: 'key_no_marking_check_message', popupDialogType: enums.PopupDialogType.none})) : null;
        var markingCheckCompleteConfirmationPopup = this.state
            .isMarkingCheckCompleteConfirmationPopupDisplaying ? (React.createElement(ConfirmationDialog, {content: localeStore.instance
            .TranslateText('marking.worklist.perform-marking-check-confirmation-dialog.body')
            .replace('{0}', worklistStore.instance.selectedMarkingCheckExaminer.toExaminer.fullName), header: localeStore.instance.TranslateText('marking.worklist.perform-marking-check-confirmation-dialog.header'), displayPopup: true, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button'), yesButtonText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button'), onYesClick: this.OnOkClickOfMarkingCheckCompleteConfirmation, onNoClick: this.OnCancelClickOfMarkingCheckCompleteConfirmation, dialogType: enums.PopupDialogType.CompleteMarkingCheck, isKeyBoardSupportEnabled: true})) : null;
        var warningMessagePopup = (React.createElement(WarningMessagePopup, {id: 'id_warning_message_popup', key: 'key_warning_message_popup', buttonText: localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button')}));
        var submitErrorPopup = this.state.isSubmitErrorPopDisplaying ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText(this.submitMessageErrorPopupContent.messageContent), header: localeStore.instance.TranslateText(this.submitMessageErrorPopupContent.messageHeader), displayPopup: this.state.isSubmitErrorPopDisplaying, okButtonText: localeStore.instance.TranslateText('generic.error-dialog.ok-button'), onOkClick: this.onSubmitResponseErrorPopupOkClick, id: 'submitErrorMessge', key: 'submitErrorMessge', popupDialogType: enums.PopupDialogType.SubmitResponseError})) : null;
        //Pop up for displaying warning message on opening a QIG in an autozoned question paper
        var autozonedWarningMessage = this.state.isAutozonedMessagePopupDisplaying ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('marking.worklist.autozoned-warning-dialog.body'), header: localeStore.instance.TranslateText('marking.worklist.autozoned-warning-dialog.header'), displayPopup: this.state.isAutozonedMessagePopupDisplaying, okButtonText: localeStore.instance.TranslateText('marking.worklist.autozoned-warning-dialog.ok-button'), onOkClick: this.onAutozonedWarningMessageOkClick, id: 'id_autozonedWarningMessage', key: 'key_autozonedWarningMessage', popupDialogType: enums.PopupDialogType.none})) : null;
        // popup when clicked on the select responses in Std setup - select to mark button
        var selecttoMarkProvisionalDialog = this.state.popUpType === enums.PopUpType.SelectToMarkAsProvisional ? (React.createElement(MultiOptionConfirmationDialog, {content: this.getSelectToMarkProvisionalPopupContent, header: localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-header'), displayPopup: true, onCancelClick: this.onCancelClickOfSelectResponseToMarkasProvisional, onYesClick: this.selectProvisionalMarkNowClick, onNoClick: this.selectProvisionalMarkLaterClick, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.SelectToMarkAsProvisional, buttonCancelText: localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-button1'), buttonNoText: localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-button2'), buttonYesText: localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-button3'), displayNoButton: true})) : null;
        var completeStandardisationPopup = this.props.isCompleteStandardisation && !this.state.isCompleteStandardisation ? (React.createElement(ConfirmationDialog, {content: localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-standardisation-popup-body'), header: localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-standardisation-popup-header'), displayPopup: true, isCheckBoxVisible: false, noButtonText: localeStore.instance.TranslateText('generic.logout-dialog.no-button'), yesButtonText: localeStore.instance.TranslateText('generic.logout-dialog.yes-button'), onYesClick: this.OnOkClickOfCompleteStandardisationConfirmation, onNoClick: this.OnCancelClickOfCompleteStandardisationConfirmation, dialogType: enums.PopupDialogType.none, isKeyBoardSupportEnabled: true})) : null;
        var completeStandardisationSetupPopup = this.state.popUpType === enums.PopUpType.CompleteStandardisationValidate ? (React.createElement(GenericDialog, {content: localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-standardisation-validate-body'), header: localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-standardisation-validate-header'), displayPopup: this.state.popUpType === enums.PopUpType.CompleteStandardisationValidate ? true : false, okButtonText: localeStore.instance.TranslateText('marking.worklist.autozoned-warning-dialog.ok-button'), onOkClick: this.onOkClickofStandardisationSetupValidate, id: 'id_standardisationsetupvalidate', key: 'key_autozonedWarningMessage', popupDialogType: enums.PopupDialogType.none})) : null;
        var markAsDefinitiveDialog = this.state.popUpType === enums.PopUpType.MarkAsDefinitive ? (React.createElement(MultiOptionConfirmationDialog, {content: this.getMarkAsDefinitivePopupContent, header: localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-header'), displayPopup: true, onCancelClick: this.onCancelClickOnMarkAsDefinitivePopUp, onYesClick: this.submitClickOnMarkAsDefinitivePopUp, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.MarkAsDefinitive, buttonCancelText: localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-button1'), buttonYesText: localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-submit-button'), displayNoButton: false})) : null;
        // popup when clicked on reclassfying a response
        var reclassifyResponseMultiOptionDialog = this.state.popUpType === enums.PopUpType.ReclassifyMultiOption ? (React.createElement(MultiOptionConfirmationDialog, {content: this.getReclassificationMultiOptionPopupContent, header: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.header'), displayPopup: true, onCancelClick: this.onCancelClickOfReclassifyMultiOptionPopUp, onYesClick: this.onReclassifyResponse, isKeyBoardSupportEnabled: true, selectedLanguage: this.props.selectedLanguage, popupSize: enums.PopupSize.Medium, popupType: enums.PopUpType.ReclassifyMultiOption, buttonCancelText: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.cancel-button'), buttonYesText: localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.ok-button'), displayNoButton: false, key: 'key_reclassifyResponseMultiOptionDialog'})) : null;
        return (React.createElement("div", null, selecttoMarkProvisionalDialog, markAsDefinitiveDialog, completeStandardisationPopup, completeStandardisationSetupPopup, autozonedWarningMessage, submitConfirmationDialog, mandatoryMessageValidationPopup, confirmationDialog, busyIndicator, nonRecoverableErrorMessage, gracePeriodResponseUnmarkedDialog, responseRemovedErrorDialog, gracePeriodExpiredErrorDialog, discardMessageDialog, discardExceptionDialog, withdrawErrorDialog, mandatoryMessageDialog, idleTimer, nonRecoverableSaveMarksAndAnnotationsErrorMessage, noMarkingCheckAvailableMessage, markingCheckCompleteConfirmationPopup, supervisorSamplingCommentValidationPopup, warningMessagePopup, this.renderSimulationExitedQigsPopup(), this.renderLocksInQigPopUp(), applicationOffLineErrorMessage, responseSearchFailedErrorDialog, simulationResponseSubmitConfirmationPopup, submitErrorPopup, shareConfirmationPopup, sessionClosedErrorDilaog, reclassifyResponseMultiOptionDialog));
    };
    /**
     * componentDidMount
     */
    Footer.prototype.componentDidMount = function () {
        userOptionStore.instance.addListener(userOptionStore.UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT, this.updateUserSession);
        loginStore.instance.addListener(loginStore.LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT, this.clearSession);
        loginStore.instance.addListener(loginStore.LoginStore.CONCURRENT_SESSION_ACTIVE, this.onConcurrentSessionActive);
        markingStore.instance.addListener(markingStore.MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT, this.onSaveMarksAndAnnotations);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT, this.onSaveMarksAndAnnotationsTriggered);
        markingStore.instance.addListener(markingStore.MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT, this.onSetHasNonRecoverableError);
        window.addEventListener('online', this._boundOnlineStatusEvent);
        window.addEventListener('offline', this._boundOnlineStatusEvent);
        window.addEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        window.addEventListener('resize', this.scrollIntoViewOnEditingTextForAndroid);
        submitStore.instance.addListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessagePanelEdited);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE, this.showResponseInGraceNotFullyMarkedMessage);
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        qigStore.instance.addListener(qigStore.QigStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.onAcceptQualityFeedbackActionCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        busyIndicatorStore.instance.addListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        messageStore.instance.addListener(messageStore.MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED, this.showMandatoryMessagePopup);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onUpdateNotification);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT, this.userActionInterrupted);
        submitStore.instance.addListener(submitStore.SubmitStore.SUBMIT_RESPONSE_STARTED, this.onSubmitResponseStarted);
        examinerStore.instance.addListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        examinerStore.instance.addListener(examinerStore.ExaminerStore.QIG_SESSION_CLOSED_EVENT, this.updateQigForSessionClose);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT, this.onResponseDataReceived);
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        messageStore.instance.addListener(messageStore.MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT, this.mandatoryMessageValidationPopupVisibility);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.addToRecentHistory);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.resetBusyIndicator);
        worklistStore.instance.addListener(worklistStore.WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE, this.showNoMarkingCheckAvailableMessage);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, this.onTeamManagementOpen);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.ADD_TO_HISTORY_EVENT, this.addToRecentHistory);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT, this.markCheckCompleteButtonEvent);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_COMPLETED_EVENT, this.markCheckCompletedEvent);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT, this.ShowSupervisorSamplingCommentValidationPopup);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED, this.addToRecentHistory);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT, this.handleErrorNavigationTeamManagement);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.resetBusyIndicator);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.resetBusyIndicator);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.resetBusyIndicator);
        qigStore.instance.addListener(qigStore.QigStore.SHOW_LOCKS_IN_QIG_POPUP, this.onShowLocksInQigsPopup);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_FROM_LOCKED_LIST, this.onQigSelectedFromLockedList);
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.navigateToQigFromLockedList);
        qigStore.instance.addListener(qigStore.QigStore.LOCKS_IN_QIG_DATA_RETRIEVED, this.doLogoutPopup);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT, this.onResponseDataReceivedFailed);
        submitStore.instance.addListener(submitStore.SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT, this.onshowSimulationResponseSubmitConfirmationPopup);
        worklistStore.instance.addListener(worklistStore.WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND, this.onStandardisationSetupCompletionInBackground);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED, this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
        qigStore.instance.addListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
        qigStore.instance.addListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
        ecourseworkFileStore.instance.addListener(ecourseworkFileStore.ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT, this.onEcourseworkFileDataCleared);
        qigStore.instance.addListener(qigStore.QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED, this.resetAcetateSaveInProgressStatus);
        qigStore.instance.addListener(qigStore.QigStore.SHARE_CONFIRMATION_EVENT, this.shareConfirmationPopup);
        qigStore.instance.addListener(qigStore.QigStore.RESET_SHARED_ACETATES_COMPLETED, this.resetAcetateSaveInProgressStatus);
        qigStore.instance.addListener(qigStore.QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED, this.onResetAcetatesSaveInProgressReceived);
        targetSummaryStore.instance.addListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.isAutozonedMessagePopupVisible);
        imageZoneStore.instance.addListener(imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT, this.onSelectStdSetupResponseToMark);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .STANDARDISATION_RIG_CREATED_EVENT, this.onStandardisationRigCreated);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .COMPLETE_STANDARDISATION_SETUP_EVENT, this.onCompleteStandardisationSetup);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .GET_STANDARDISATION_TARGET_DETAILS_EVENT, this.resetBusyIndicatorStdSetupNotComplete);
        userinfostore.instance.addListener(userinfostore.UserInfoStore.SWITCH_USER_BUTTON_CLICK, this.switchUserButtonClick);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, this.onResponseDataRecievedAfterRefresh);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.onResponseDataRecievedAfterRefresh);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore
            .MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.reclassifyMultiOptionPopupOpen);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.addToRecentHistory);
    };
    /**
     * componentWillUnmount
     */
    Footer.prototype.componentWillUnmount = function () {
        userOptionStore.instance.removeListener(userOptionStore.UseroptionStore.USER_OPTION_SAVE_ON_LOGOUT_EVENT, this.updateUserSession);
        loginStore.instance.removeListener(loginStore.LoginStore.UPDATE_SESSION_ON_LOGOUT_EVENT, this.clearSession);
        loginStore.instance.removeListener(loginStore.LoginStore.CONCURRENT_SESSION_ACTIVE, this.onConcurrentSessionActive);
        markingStore.instance.removeListener(markingStore.MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT, this.onSaveMarksAndAnnotations);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.navigateAwayFromResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT, this.onSaveMarksAndAnnotationsTriggered);
        markingStore.instance.removeListener(markingStore.MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT, this.onSetHasNonRecoverableError);
        window.removeEventListener('online', this._boundOnlineStatusEvent);
        window.removeEventListener('offline', this._boundOnlineStatusEvent);
        window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        window.removeEventListener('resize', this.scrollIntoViewOnEditingTextForAndroid);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE, this.showResponseInGraceNotFullyMarkedMessage);
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        qigStore.instance.removeListener(qigStore.QigStore.ACCEPT_QUALITY_ACTION_COMPLETED, this.onAcceptQualityFeedbackActionCompleted);
        submitStore.instance.removeListener(submitStore.SubmitStore.SUBMIT_RESPONSE_COMPLETED, this.onSubmitResponseCompleted);
        busyIndicatorStore.instance.removeListener(busyIndicatorStore.BusyIndicatorStore.BUSY_INDICATOR, this.setBusyIndicator);
        messageStore.instance.removeListener(messageStore.MessageStore.UNREAD_MANDATORY_MESSAGE_STATUS_UPDATED, this.showMandatoryMessagePopup);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onUpdateNotification);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_NAVIGATION_EVENT, this.onMessagePanelEdited);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ACTION_INTERRUPTED_EVENT, this.userActionInterrupted);
        submitStore.instance.removeListener(submitStore.SubmitStore.SUBMIT_RESPONSE_STARTED, this.onSubmitResponseStarted);
        examinerStore.instance.removeListener(examinerStore.ExaminerStore.MARKER_INFO_UPDATED_EVENT, this.updateMarkerInformationPanel);
        examinerStore.instance.removeListener(examinerStore.ExaminerStore.QIG_SESSION_CLOSED_EVENT, this.updateQigForSessionClose);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_EVENT, this.onResponseDataReceived);
        navigationStore.instance.removeListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.refreshState);
        //timerHelper.clearInterval();
        messageStore.instance.removeListener(messageStore.MessageStore.MANDATORY_MESSAGE_VALIDATION_POPUP_EVENT, this.mandatoryMessageValidationPopupVisibility);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_MESSAGE_PRIORITY_EVENT, this.messagePriorityUpdate);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.addToRecentHistory);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.resetBusyIndicator);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.NO_MARKING_CHECK_AVAILABLE_MESSAGE, this.showNoMarkingCheckAvailableMessage);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.OPEN_TEAM_MANAGEMENT_EVENT, this.onTeamManagementOpen);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.isAutozonedMessagePopupVisible);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.ADD_TO_HISTORY_EVENT, this.addToRecentHistory);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_COMPLETE_BUTTON_EVENT, this.markCheckCompleteButtonEvent);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_COMPLETED_EVENT, this.markCheckCompletedEvent);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT, this.ShowSupervisorSamplingCommentValidationPopup);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.EXAMINER_DRILL_DOWN_DATA_UPDATED, this.addToRecentHistory);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.FAILURE_WHILE_FETCHING_TEAM_DATA_EVENT, this.handleErrorNavigationTeamManagement);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_DATA_LOADED_EVENT, this.resetBusyIndicator);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.TEAM_EXCEPTIONS_DATA_LOADED_EVENT, this.resetBusyIndicator);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.HELP_EXAMINERS_DATA_RECEIVED, this.resetBusyIndicator);
        qigStore.instance.removeListener(qigStore.QigStore.SHOW_LOCKS_IN_QIG_POPUP, this.onShowLocksInQigsPopup);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_FROM_LOCKED_LIST, this.onQigSelectedFromLockedList);
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.navigateToQigFromLockedList);
        qigStore.instance.removeListener(qigStore.QigStore.LOCKS_IN_QIG_DATA_RETRIEVED, this.doLogoutPopup);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_DATA_RECEIVED_FAILED_EVENT, this.onResponseDataReceivedFailed);
        submitStore.instance.removeListener(submitStore.SubmitStore.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_EVENT, this.onshowSimulationResponseSubmitConfirmationPopup);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.STANDARDISATION_SETUP_COMPLETED_IN_BACKGROUND, this.onStandardisationSetupCompletionInBackground);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_AND_LOCKS_IN_QIGS_RETRIEVED, this.onSimulationExitedQigsAndLocksInQigsRecieved);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_TARGET_COMPLETED, this.onSimulationTargetCompletion);
        qigStore.instance.removeListener(qigStore.QigStore.STANDARDISATION_SETUP_COMPLETED_EVENT, this.onStandardisationSetupCompletion);
        qigStore.instance.removeListener(qigStore.QigStore.SIMULATION_EXITED_QIGS_RETRIEVED, this.onSimulationExitedQigsRecieved);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.onExamBodyCCLoaded);
        ecourseworkFileStore.instance.removeListener(ecourseworkFileStore.ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT, this.onEcourseworkFileDataCleared);
        qigStore.instance.removeListener(qigStore.QigStore.SAVE_ACETATES_DATA_ACTION_COMPLETED, this.resetAcetateSaveInProgressStatus);
        qigStore.instance.removeListener(qigStore.QigStore.SHARE_CONFIRMATION_EVENT, this.shareConfirmationPopup);
        qigStore.instance.removeListener(qigStore.QigStore.RESET_SHARED_ACETATES_COMPLETED, this.resetAcetateSaveInProgressStatus);
        qigStore.instance.removeListener(qigStore.QigStore.RESET_ACETATE_SAVE_IN_PROGRESS_STATUS_COMPLETED, this.onResetAcetatesSaveInProgressReceived);
        targetSummaryStore.instance.removeListener(targetSummaryStore.TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED, this.isAutozonedMessagePopupVisible);
        imageZoneStore.instance.removeListener(imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT, this.isAutozonedMessagePopupVisible);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT, this.onSelectStdSetupResponseToMark);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .STANDARDISATION_RIG_CREATED_EVENT, this.onStandardisationRigCreated);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .COMPLETE_STANDARDISATION_SETUP_EVENT, this.onCompleteStandardisationSetup);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .GET_STANDARDISATION_TARGET_DETAILS_EVENT, this.resetBusyIndicatorStdSetupNotComplete);
        userinfostore.instance.removeListener(userinfostore.UserInfoStore.SWITCH_USER_BUTTON_CLICK, this.switchUserButtonClick);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, this.onResponseDataRecievedAfterRefresh);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this.onResponseDataRecievedAfterRefresh);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore
            .MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.reclassifyMultiOptionPopupOpen);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, this.addToRecentHistory);
    };
    /**
     * Set the confirmation dialogue state
     * @param stateValue The state value
     */
    Footer.prototype.setConfirmationDialogueState = function (stateValue) {
        this.setState({
            isSubmitConfirmationPopupDisplaying: stateValue
        });
    };
    /**
     * On yes click of submit response confirmation pop up
     */
    Footer.prototype.onYesClickOfSubmitButton = function () {
        this.setConfirmationDialogueState(false);
        this.submitResponse();
    };
    /**
     * submit response/s
     */
    Footer.prototype.submitResponse = function () {
        var busyIndicatorInvoker;
        var submitResponseArgument;
        /**
         * if markgroupid is greater than zero, then its single response submit
         */
        busyIndicatorInvoker =
            submitStore.instance.getMarkGroupId > 0
                ? enums.BusyIndicatorInvoker.submit
                : enums.BusyIndicatorInvoker.submitAll;
        /**
         * Show busy indicator on submitting response
         */
        busyIndicatorActionCreator.setBusyIndicatorInvoker(busyIndicatorInvoker);
        /**
         * Submitting  responses initiated
         * Select the mark group list based on the current response mode
         */
        var markGroupIdList = worklistComponentHelper.getMarkgroupIdCollectionForSubmit(targetHelper.getSelectedQigMarkingMode());
        var qiglist = qigStore.instance.relatedQigList;
        var examinerRoleIdList = new Array();
        qiglist
            ? qiglist.map(function (x) {
                examinerRoleIdList.push(x.examinerRoleId);
            })
            : (examinerRoleIdList = null);
        var markSchemeGroupIds = new Array();
        qiglist
            ? qiglist.map(function (x) {
                markSchemeGroupIds.push(x.markSchemeGroupId);
            })
            : (markSchemeGroupIds = null);
        /**
         * mapping  values on submit argument
         */
        submitResponseArgument = {
            markGroupIds: markGroupIdList,
            markingMode: targetHelper.getSelectedQigMarkingMode(),
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            examinerApproval: examinerStore.instance.getMarkerInformation.approvalStatus,
            isAdminRemarker: loginStore.instance.isAdminRemarker
        };
        var worklistType = worklistStore.instance.currentWorklistType;
        var remarkRequestType = worklistComponentHelper.getRemarkRequestType(worklistType);
        /**
         * calling to send data to server
         */
        var displayId = submitStore.instance.isSubmitFromMarkScheme
            ? responseStore.instance.selectedDisplayId.toString()
            : undefined;
        submitActionCreator.submitResponse(submitResponseArgument, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, worklistType, remarkRequestType, submitStore.instance.isSubmitFromMarkScheme, displayId, examinerRoleIdList, markSchemeGroupIds);
    };
    /**
     * On no click of submit response confirmation pop up
     */
    Footer.prototype.onNoClickOfSubmitButton = function () {
        this.setConfirmationDialogueState(false);
    };
    /**
     * this function is called on "yes" click of logout confirmation popup. This will trigger logout.
     */
    Footer.prototype.onYesClickOfLogoutConfirmation = function (isAutoLogOut) {
        if (isAutoLogOut === void 0) { isAutoLogOut = false; }
        /**
         * Setting to true as the logout has been triggered
         */
        this._onLogoutTriggered = true;
        /**
         * Setting the value to identify whether it is from idle timeout
         */
        this._isAutoLogOut = isAutoLogOut;
        switch (navigationStore.instance.containerPage) {
            case enums.PageContainers.QigSelector:
            case enums.PageContainers.Message:
            case enums.PageContainers.Reports:
                var _rememberQig = new rememberQig();
                _rememberQig.qigId = 0;
                _rememberQig.area = enums.QigArea.QigSelector;
                userOptionsHelper.save(userOptionKeys.REMEMBER_PREVIOUS_QIG, JSON.stringify(_rememberQig));
                break;
        }
        /**
         * Saving changed user options if any of them changed
         */
        if (userOptionsHelper.hasUserOptionsChanged) {
            userOptionsHelper.InitiateSaveUserOption(true);
        }
        else {
            this.updateUserSession();
        }
    };
    /**
     * to update message priority
     */
    Footer.prototype.onOkClickMandatoryMessageValidationPopup = function () {
        messagingActionCreator.updateMessagePriority();
    };
    /**
     * hides the popup
     */
    Footer.prototype.onPopupOkClick = function () {
        this.setState({ doShowPopup: false });
        // If the object has the mark group Id, Call navigate method for completing actions.
        if (this.messageDetails.submittedMarkGroupIds &&
            this.messageDetails.submittedMarkGroupIds.length > 0) {
            this.navigateAfterSubmit(this.messageDetails.submittedMarkGroupIds, this.messageDetails.displayId, this.messageDetails.isFromMarkScheme);
            this.messageDetails.submittedMarkGroupIds = [];
        }
    };
    /**
     * shows the popup
     */
    Footer.prototype.ShowSupervisorSamplingCommentValidationPopup = function (supervisorSamplingCommentReturn) {
        if (supervisorSamplingCommentReturn.isSampled) {
            this.messageDetails = {
                messageHeader: localeStore.instance.TranslateText('team-management.response.sampling-error-dialog-already-sampled.body'),
                messageString: localeStore.instance.TranslateText('team-management.response.sampling-error-dialog-already-sampled.header')
            };
            this.setState({ doShowPopup: true });
        }
    };
    /**
     * this function is called on 'No' click of logout confirmation popup.This will call a method in the container.
     */
    Footer.prototype.onNoClickOfLogoutConfirmation = function () {
        this.props.resetLogoutConfirmationSatus();
    };
    /**
     * Non-Recoverable marks and annotation save error message ok click
     */
    Footer.prototype.onOkClickOfNonRecoverableErrorMessage = function () {
        // close the non-recoverable error popup on submit if it is already open.
        if (this.state.nonRecoverableSaveMarksAndAnnotationsErrorMessage) {
            this.setState({
                nonRecoverableSaveMarksAndAnnotationsErrorMessage: false
            });
        }
        // close the non-recoverable error popup.
        if (this.state.isNonRecoverableErrorPopupVisible) {
            this.setState({
                isNonRecoverableErrorPopupVisible: false
            });
        }
        // This will clear the marks and annotations with non-recoverable error from store collection.
        // This will reload by background call or while opening the response.
        marksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForNonRecoverableErrors();
        // Calling the processBasedOnSaveMarksAndAnnotationTriggeringPoint on Submit will make the DB call.
        // refresh and navigate to worklist if there is an error.
        if (this.currentSaveMarksAndAnnotationTriggeringPoint ===
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit) {
            navigationHelper.loadContainerIfNeeded(enums.PageContainers.WorkList, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
            this.initiateContentRefresh();
        }
        else {
            this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(this.currentSaveMarksAndAnnotationTriggeringPoint);
        }
    };
    /**
     * This method will handle the navigation based on the triggering point.
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param markGroupId
     */
    Footer.prototype.processBasedOnSaveMarksAndAnnotationTriggeringPoint = function (saveMarksAndAnnotationTriggeringPoint, markGroupId) {
        switch (saveMarksAndAnnotationTriggeringPoint) {
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse:
                navigationHelper.loadContainerIfNeeded(navigationStore.instance.containerPage, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse, this.context);
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox:
                navigationHelper.loadContainerIfNeeded(navigationStore.instance.containerPage, enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox, this.context);
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout:
                /* Trigger save mark for the currently selected item when logging out */
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toLogout);
                break;
            case enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Submit:
                submitHelper.saveAndSubmitResponse(markGroupId ? markGroupId : submitStore.instance.getMarkGroupId);
                break;
        }
    };
    /**
     * Method to get Grace Period Expired Message Body
     * @returns
     */
    Footer.prototype.getGracePeriodExpiredMessageBody = function () {
        var errorBody = localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-grace-period-expired-changes-not-saved');
        return errorBody.replace('{0}', worklistStore.instance.displayIdOfMarkGroup(this.expiredMarkGroupId));
    };
    /**
     * Method to get Response removed error dialog Message Body
     * @returns
     */
    Footer.prototype.getResponseRemovedErrorDialogMessageBody = function () {
        var errorBody = localeStore.instance.TranslateText('marking.response.saving-marks-error-dialog.body-response-removed-from-worklist');
        return errorBody.replace('{0}', worklistStore.instance.displayIdOfMarkGroup(this.expiredMarkGroupId));
    };
    /**
     * Just hide the response in grace message on ok click.
     */
    Footer.prototype.onOkClickOfResponseInGraceMessage = function () {
        this.setState({
            isDisplayingGraceResponseLessthan100PercentageError: false
        });
        if (this._failureReason === enums.ResponseNavigateFailureReason.AllPagesNotAnnotatedInGrace) {
            // Closing the user information panel, if the popup is triggered due to logout button action.
            // moving to full response view.
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            this._failureReason = enums.ResponseNavigateFailureReason.None;
        }
    };
    /**
     * Just hide the response in grace message on ok click.
     */
    Footer.prototype.onOkClickOfResponseInGraceExpiredMessageOrResponseRemovedMessage = function () {
        if (this.currentSaveMarksAndAnnotationTriggeringPoint ===
            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout) {
            this.updateUserSession();
        }
        else {
            // This will clear the marks and annotations with mark save errors
            // This will reload by background call or while opening the response.
            marksAndAnnotationsSaveHelper.clearMarksAndAnnotationsForMarkSaveErrors();
            navigationHelper.loadWorklist();
        }
    };
    /**
     * Get the error message that has to be shown while a marker is withdrawn in the background
     */
    Footer.prototype.getWithdrawnResponseErrorMessage = function () {
        var errorBody = localeStore.instance.TranslateText('marking.worklist.response-allocation-error-dialog.response-allocation-error-withdrawnMarker');
        return errorBody;
    };
    /**
     * Get the error message that has to be shown while a marker is withdrawn in the background
     */
    Footer.prototype.getSessionClosedErrorMessage = function () {
        var errorBody = localeStore.instance.TranslateText('marking.worklist.request-marking-check-error-dialog.body-session-closed');
        return errorBody;
    };
    /**
     * On cliking Ok button of the response trigger close response
     */
    Footer.prototype.onOkClickOfWithDrawErrorMessage = function () {
        if (this.props.footerType === enums.FooterType.Response) {
            if (this.navigateReponse === enums.SaveAndNavigate.toInboxMessagePage) {
                this.processBasedOnSaveMarksAndAnnotationTriggeringPoint(enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Inbox);
                navigationHelper.loadMessagePage();
            }
            else {
                var updateNavigationPromise = markingActionCreator.updateNavigation(enums.SaveAndNavigate.toQigSelector, false);
                var that_1 = this;
                Promise.Promise.all([updateNavigationPromise]).then(function (result) {
                    that_1.processBasedOnSaveMarksAndAnnotationTriggeringPoint(enums.SaveMarksAndAnnotationsProcessingTriggerPoint.CloseResponse);
                    if (that_1.navigateReponse === enums.SaveAndNavigate.toLogout) {
                        that_1.navigateAwayFromResponse();
                    }
                });
            }
        }
        else {
            this.setState({ isWithdrawnResponseError: false, isBusy: false });
            this.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            if (qigStore.instance.getOverviewData) {
                var currentQig = qigStore.instance.getOverviewData.qigSummary
                    .filter(function (qig) {
                    return qig.examinerRoleId ===
                        examinerStore.instance.getMarkerInformation.examinerRoleId;
                })
                    .first();
                teamManagementActionCreator.removeHistoryItem(currentQig ? currentQig.markSchemeGroupId : 0);
            }
            qigActionCreator.getQIGSelectorData(0);
            loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        }
    };
    /**
     * Start the content refresh
     */
    Footer.prototype.initiateContentRefresh = function () {
        // Clear worklist cache and do content refresh
        var markingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            this.storageAdapterHelper.clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, markingMode, worklistStore.instance.getRemarkRequestType, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, worklistStore.instance.currentWorklistType);
            // Load the marking progress
            worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation
                .isElectronicStandardisationTeamMember);
        }
    };
    /**
     * setting the timeout of application online check
     * @param {type} interval
     */
    Footer.prototype.triggerApplicationOnlinePoll = function (forceStartPoll) {
        if (forceStartPoll === void 0) { forceStartPoll = false; }
        // If the application status has been changed update the call
        if (forceStartPoll || this.state.isOnline !== applicationStore.instance.isOnline) {
            if (userOptionsHelper.hasUserOptionsChanged) {
                userOptionsHelper.InitiateSaveUserOption(false);
            }
        }
    };
    /**
     * Closing application error poup message
     */
    Footer.prototype.onApplicationErrorMessagePopUpClicked = function () {
        this.setState({
            isApplicationOffline: false
        });
    };
    /**
     * User action has been interrupted
     */
    Footer.prototype.userActionInterrupted = function (_isFromLogout) {
        if (_isFromLogout) {
            this.offlineErrorMessage = localeStore.instance.TranslateText('generic.offline-dialog.body-user-options-changed');
            this.props.resetLogoutConfirmationSatus();
            this._onLogoutTriggered = false;
        }
        else {
            this.offlineErrorMessage = stringHelper.format(localeStore.instance.TranslateText('generic.offline-dialog.body'), [String(String.fromCharCode(179))]);
        }
        /*Hiding the busy indicator if the application is offline and the busy indicator was showing at the time of being offline*/
        if (this.state.isBusy && !applicationStore.instance.isOnline) {
            this.setState({
                isApplicationOffline: !applicationStore.instance.isOnline,
                isBusy: false
            });
        }
        else {
            this.setState({ isApplicationOffline: !applicationStore.instance.isOnline });
        }
    };
    /**
     * Adding current qig details to user option.
     */
    Footer.prototype.addSelectedQigDetailsToUserOption = function () {
        var _rememberQig = new rememberQig();
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            _rememberQig.qigId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            _rememberQig.worklistType = worklistStore.instance.currentWorklistType;
            _rememberQig.remarkRequestType = worklistStore.instance.getRemarkRequestType;
            _rememberQig.questionPaperPartId =
                qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            if (markerOperationModeFactory.operationMode.isTeamManagementMode) {
                _rememberQig.area = enums.QigArea.TeamManagement;
                if (teamManagementStore.instance.selectedTeamManagementTab ===
                    enums.TeamManagement.MyTeam) {
                    if (navigationStore.instance.containerPage === enums.PageContainers.WorkList) {
                        _rememberQig.subordinateExaminerRoleID = teamManagementStore.instance
                            .examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerRoleId
                            : 0;
                        _rememberQig.subordinateExaminerID = teamManagementStore.instance
                            .examinerDrillDownData
                            ? teamManagementStore.instance.examinerDrillDownData.examinerId
                            : 0;
                    }
                    else {
                        _rememberQig.subordinateExaminerRoleID = 0;
                        _rememberQig.subordinateExaminerID = 0;
                    }
                }
                _rememberQig.examinerRoleId = teamManagementStore.instance.selectedExaminerRoleId
                    ? teamManagementStore.instance.selectedExaminerRoleId
                    : operationModeHelper.examinerRoleId;
                _rememberQig.tab = enums.TeamManagement.MyTeam;
            }
            else if (markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                _rememberQig.area = enums.QigArea.StandardisationSetup;
                _rememberQig.standardisationSetupWorklistType = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
            }
            else {
                _rememberQig.area = enums.QigArea.Marking;
            }
            userOptionsHelper.save(userOptionKeys.REMEMBER_PREVIOUS_QIG, JSON.stringify(_rememberQig));
        }
    };
    /**
     * Action when the cancel button for Marking Check is clicked
     * Cancel the popup
     */
    Footer.prototype.OnCancelClickOfMarkingCheckCompleteConfirmation = function () {
        this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: false });
    };
    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    Footer.prototype.OnOkClickOfMarkingCheckCompleteConfirmation = function () {
        /* on marking check confirmation is clicked Send two messages
           First Message to the marker so that it will appear in the inbox
           the  second message with sysytem message priority so that the
           marking check will be considered as complete*/
        this.setState({ isMarkingCheckCompleteConfirmationPopupDisplaying: false });
        var systemMessagePriority = 255;
        var markingCheckToList = [
            worklistStore.instance.selectedMarkingCheckExaminer.fromExaminerID
        ];
        var questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        messagingActionCreator.sendExaminerMessage(markingCheckToList, '', '', questionPaperId, null, enums.MessagePriority.Important, markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.MarksChecked);
        messagingActionCreator.sendExaminerMessage(markingCheckToList, '', '', questionPaperId, null, systemMessagePriority, markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.MarksChecked);
    };
    /**
     * On cliking Ok button of the response search failed popup
     */
    Footer.prototype.onOkClickOfResponseSearchFailedErrorMessage = function () {
        this.setState({ isResponseSearchFailed: false });
        this.storageAdapterHelper.clearStorageArea('messaging');
        messagingActionCreator.refreshMessageFolder(enums.MessageFolderType.Inbox);
    };
    /**
     * Get the error message that has to be shown on response search failed while a response is deallocated in the background
     */
    Footer.prototype.getResponseSearchFailedErrorMessage = function () {
        var searchResponseData = messageStore.instance.searchResponseData;
        var questionGroup = messageHelper.getDisplayText(messageStore.instance.getMessageData(searchResponseData.messageId));
        var errorBodyParameter = [searchResponseData.displayId, questionGroup];
        var errorBody = stringHelper.format(localeStore.instance.TranslateText('generic.error-dialog.body-response-removed'), errorBodyParameter);
        return errorBody;
    };
    /**
     * on clicking yes button of simulation response submit confirmation popup
     */
    Footer.prototype.onYesClickOfSimulationResponseSubmitButton = function () {
        this.setState({ showSimulationResponseSubmitConfirmationPopup: false });
        if (submitStore.instance.isSubmitFromMarkScheme) {
            simulationModeHelper.checkStandardisationSetupCompletion(enums.PageContainers.None, enums.PageContainers.None);
            busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.submitInResponseScreen);
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
        }
        else {
            // If simulation response submission happens from worklist, then submission
            // needs to be blocked if standardisation setup is completed
            var that_2 = this;
            if (!qigStore.instance.getSelectedQIGForTheLoggedInUser.standardisationSetupComplete) {
                var promise = qigActionCreator.checkStandardisationSetupCompleted(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId, enums.PageContainers.WorkList, enums.PageContainers.WorkList);
                Promise.Promise.all([promise]).then(function (data) {
                    if (data[0] === true) {
                        this.setState({
                            showSimulationExitedPopup: true,
                            showAllSimulationExitedQigs: false
                        });
                    }
                    else {
                        that_2.submitResponse();
                    }
                });
            }
            else {
                that_2.submitResponse();
            }
        }
    };
    /**
     * on clicking no button of simulation response submit confirmation popup
     */
    Footer.prototype.onNoClickOfSimulationResponseSubmitButton = function () {
        this.setState({ showSimulationResponseSubmitConfirmationPopup: false });
    };
    /**
     * on clicking yes button of share confirmation popup
     */
    Footer.prototype.onYesClickOfShareConfirmationPopup = function () {
        this.setState({ doShowShareConfirmationPopup: false });
        acetatesActionCreator.shareAcetate(this.shareConfirmationClientToken);
        this.shareConfirmationClientToken = undefined;
    };
    /**
     * on clicking no button of share confirmation popup
     */
    Footer.prototype.onNoClickOfShareConfirmationPopup = function () {
        this.setState({ doShowShareConfirmationPopup: false });
        this.shareConfirmationClientToken = undefined;
    };
    /**
     * Gets the name of simulation mode exited qigs
     */
    Footer.prototype.getSimulationModeExitedQigs = function () {
        var qigNames = new Array();
        if (this.state.showSimulationExitedPopup) {
            // If all qigs need to be shown then. When navigating to qigselector.
            if (this.state.showAllSimulationExitedQigs) {
                var simulationModeExitedQigList = Immutable.List();
                simulationModeExitedQigList =
                    qigStore.instance.getSimulationModeExitedQigList === undefined
                        ? undefined
                        : qigStore.instance.getSimulationModeExitedQigList.qigList;
                if (simulationModeExitedQigList) {
                    simulationModeExitedQigList.map(function (_simulationModeExitedQig) {
                        var qigNameToDisplay = stringFormatHelper.formatAwardingBodyQIG(_simulationModeExitedQig.markSchemeGroupName, _simulationModeExitedQig.assessmentCode, _simulationModeExitedQig.sessionName, _simulationModeExitedQig.componentId, _simulationModeExitedQig.questionPaperName, '', // TO DO: have to retrive ComponentName and AssessmentName on simulationQIg details.
                        '', stringFormatHelper.getOverviewQIGNameFormat());
                        qigNames.push(qigNameToDisplay);
                    });
                }
            }
            else {
                // Otherwise show only the currrent qig. When navigating from worklist/response to area other than
                // qigselector
                var qigData = qigStore.instance.getSelectedQIGForTheLoggedInUser;
                var qigNameToDisplay = stringFormatHelper.formatAwardingBodyQIG(qigData.markSchemeGroupName, qigData.assessmentCode, qigData.sessionName, qigData.componentId, qigData.questionPaperName, '', // TO DO: have to retrive ComponentName and AssessmentName on simulationQIg details.
                '', stringFormatHelper.getOverviewQIGNameFormat());
                qigNames.push(qigNameToDisplay);
            }
        }
        return qigNames;
    };
    /**
     * Method to reset the acetate save inprogress status.
     */
    Footer.prototype.resetAcetateSaveInProgressStatus = function () {
        // checking whether any addded/modified acetates are found in the acetatelist from store.
        var modifiedAcetatesList = qigStore.instance.getModifiedAcetatesList();
        if (modifiedAcetatesList && modifiedAcetatesList.size > 0) {
            // Invoke action creator to set saveInProgress status to true before calling acetate save process.
            acetatesActionCreator.resetAcetateSaveInProgressStatus(modifiedAcetatesList);
        }
    };
    /**
     * Reset acetates saveInProgress status received callback event.
     */
    Footer.prototype.onResetAcetatesSaveInProgressReceived = function (modifiedAcetatesList) {
        var saveacetatesarguments = {
            Tools: modifiedAcetatesList
        };
        // db call for saving the acetate list in database.
        acetatesActionCreator.saveAcetates(saveacetatesarguments);
    };
    /**
     * Complete Standardisation received callback event.
     */
    Footer.prototype.onCompleteStandardisationSetup = function () {
        if (!standardisationSetupStore.instance.iscompleteStandardisationSuccess) {
            this.setState({ popUpType: enums.PopUpType.CompleteStandardisationValidate, isBusy: false });
        }
    };
    /**
     * Checks whether the autozoned message should be displayed.
     */
    Footer.prototype.isAutozonedMessagePopupVisible = function () {
        if (this.props.footerType !== enums.FooterType.Message) {
            //Checking the CC values
            var isAutozoned = configurableCharacteristicHelper
                .getExamSessionCCValue(configurableCharacteristicNames.AutoZoning, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true' &&
                configurableCharacteristicHelper
                    .getExamSessionCCValue(configurableCharacteristicNames.DisplayAutozonedResponsesWarning, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                    .toLowerCase() === 'true';
            //getting the saved userOption value
            var userOptionAutozonedValue = userOptionsHelper.getUserOptionByName(userOptionKeys.AUTOZONED_WARNING_MESSAGE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';
            //set state to display Autozoned message popup
            if (isAutozoned && userOptionAutozonedValue !== true) {
                this.setState({
                    isAutozonedMessagePopupDisplaying: true
                });
                //saving useroption for autozoned message popup
                userOptionsHelper.save(userOptionKeys.AUTOZONED_WARNING_MESSAGE, JSON.stringify(true), true, true, false, true, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            }
        }
    };
    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    Footer.prototype.OnOkClickOfCompleteStandardisationConfirmation = function () {
        this.setState({ isBusy: true, isCompleteStandardisation: true });
        standardisationActionCreator.completeStandardisationSetup(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
    };
    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    Footer.prototype.OnCancelClickOfCompleteStandardisationConfirmation = function () {
        this.props.OnClickingCancelofStdSetupPopup(true);
    };
    /**
     * Action when the ok button for Marking Check confirmation is clicked
     */
    Footer.prototype.onOkClickofStandardisationSetupValidate = function () {
        this.setState({
            popUpType: enums.PopUpType.None
        });
        busyIndicatorActionCreator.setBusyIndicatorInvoker(enums.BusyIndicatorInvoker.validateStandardisationSetup);
        standardisationActionCreator.getStandardisationTargetDetails(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
    };
    Object.defineProperty(Footer.prototype, "getSelectToMarkProvisionalPopupContent", {
        /**
         * pop up content on clicking select response to mark button
         */
        get: function () {
            var content = [];
            var scriptData = standardisationSetupStore.instance.fetchSelectedScriptDetails(standardisationSetupStore.instance.selectedResponseId);
            var showMultiQigPopup = this.isMultiQigMarkingAvailable(scriptData.isAllocatedForLiveMarking);
            var centreCandidateDetails = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-content-line2'), [
                String(scriptData.candidateScriptId),
                scriptData.centreNumber,
                scriptData.centreCandidateNumber.toUpperCase()
            ]);
            if (showMultiQigPopup) {
                content.push(React.createElement("p", {key: 'select-to-mark-popup-content-line2', className: 'dim-text padding-bottom-10'}, centreCandidateDetails));
                content.push(React.createElement("p", {key: 'select-to-mark-popup-content-line2'}, stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-multiqig-popup-content-line'), [String(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName)
                ])));
                content.push(React.createElement("div", {className: 'popup-inline-radio-group padding-top-10 padding-bottom-10'}, React.createElement("ul", {className: 'option-items pading-top-10'}, React.createElement("li", null, React.createElement("input", {type: 'radio', value: '0', id: 'currentqig', name: 'changeStatus', checked: true}), React.createElement("label", {htmlFor: 'currentqig'}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName, " only"))), React.createElement("li", null, React.createElement("input", {type: 'radio', value: '1', id: 'allqig', name: 'changeStatus', checked: false}), React.createElement("label", {htmlFor: 'allqig'}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, "All QIGs"))))));
            }
            else {
                content.push(React.createElement("p", {key: 'select-to-mark-popup-content-line1'}, localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-content-line1')));
                content.push(React.createElement("p", {key: 'select-to-mark-popup-content-line2', className: 'dim-text padding-top-10'}, centreCandidateDetails));
            }
            content.push(React.createElement("p", {className: 'padding-top-10', key: 'select-to-mark-popup-content-line3'}, localeStore.instance.TranslateText('standardisation-setup.select-response.select-to-mark-popup-content-line3')));
            return content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Footer.prototype, "getMarkAsDefinitivePopupContent", {
        /**
         * get mark as definitive popup content
         */
        get: function () {
            var content = [];
            var responseData = standardisationSetupStore.instance.fetchStandardisationResponseData(standardisationSetupStore.instance.selectedResponseId);
            var markAsDefinitiveResponse = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line2'), [
                String(responseData.displayId),
                String(responseData.totalMarkValue)
            ]);
            content.push(React.createElement("p", {key: 'mark-as-definitive-popup-content-line1'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line1')));
            content.push(React.createElement("p", {key: 'select-to-mark-popup-content-line2', className: 'dim-text padding-top-20'}, markAsDefinitiveResponse));
            content.push(React.createElement("p", {className: 'padding-top-20', key: 'select-to-mark-popup-content-line3'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-content-line3')));
            var radioButtonText = (React.createElement("div", {className: 'option-holder padding-top-10'}, React.createElement("ul", {className: 'options'}, React.createElement("li", {className: 'padding-top-10', onClick: this.onMarkAsDefinitiveContentClick.bind(this, true)}, React.createElement("input", {type: 'radio', value: 'selected', id: 'copyasDefinitive', defaultChecked: true, name: 'markasdefinitive'}), React.createElement("label", {htmlFor: 'copyasDefinitive'}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text', id: 'markAsDefinitivePopupRadioButton1'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-1')))), React.createElement("p", {className: 'padding-top-10 option-content'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-1-desc')), React.createElement("li", {className: 'padding-top-20', onClick: this.onMarkAsDefinitiveContentClick.bind(this, false)}, React.createElement("input", {type: 'radio', value: '', id: 'clearAllMark', name: 'markasdefinitive'}), React.createElement("label", {htmlFor: 'clearAllMark'}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text', id: 'markAsDefinitivePopupRadioButton2'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-2')))), React.createElement("p", {className: 'padding-top-10 padding-bottom-5 option-content'}, localeStore.instance.TranslateText('standardisation-setup.mark-as-definitive.mark-as-definitive-popup-radio-2-desc')))));
            content.push(radioButtonText);
            return content;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the copyMarksAsDefinitiveSelected flag, on Mark as definitve popup option click.
     * @param isCopyMarksAndAnnotation
     */
    Footer.prototype.onMarkAsDefinitiveContentClick = function (isCopyMarksAndAnnotation) {
        this.copyMarksAsDefinitiveSelected = isCopyMarksAndAnnotation;
    };
    /**
     * conditions where the multiqig popup to be shown while select to mark button is clicked
     */
    Footer.prototype.isMultiQigMarkingAvailable = function (isRelatedRigMarked) {
        // The multiqig response pop will only show when the following conditions are true
        // 1. WholeResponseProvisionalMarking should be ON.
        // 2. MultiQIGProvisionalPermisson in the StandardisationSetupPermissions CC is ON
        // 3. No provisionals in any QIG have been created.
        // 4. The Examiner have role in all QIGS.
        var wholeResponseProvisionalMarking = configurablecharacteristicshelper.getExamSessionCCValue(configurableCharacteristicNames.WholeResponseProvisionalMarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true' ? true : false;
        var isMultiQIGProvisionalsPermissionInAllQIGs = this.isMultiQIGProvisionalsPermissionInAllQIG();
        if (wholeResponseProvisionalMarking && isMultiQIGProvisionalsPermissionInAllQIGs
            && !isRelatedRigMarked && qigStore.instance.selectedQIGForMarkerOperation.hasPermissionInRelatedQIGs) {
            return true;
        }
        return false;
    };
    /**
     * switch user button click
     */
    Footer.prototype.switchUserButtonClick = function () {
        window.removeEventListener('beforeunload', navigationHelper.onBeforeWindowUnload);
        /* tslint:disable:no-string-literal */
        window.sessionStorage['adminsupport'] = 'true';
        /* tslint:enable:no-string-literal */
        window.open('?', '_self');
    };
    /**
     * Complete Standardisation received callback event.
     */
    Footer.prototype.onResponseDataRecievedAfterRefresh = function () {
        /*
          Setting busy indicator to false on Standardisation Setup refresh on
          completing standardisation setup
        */
        this.setState({ isBusy: false });
    };
    /**
     * Checking whether the MultiQigProvisional permission is available for all QIGs
     */
    Footer.prototype.isMultiQIGProvisionalsPermissionInAllQIG = function () {
        var multiQigProvisionalsPermissionInAllQig = true;
        var relatedQigList = qigStore.instance.relatedQigList;
        if (relatedQigList && relatedQigList !== undefined) {
            relatedQigList.map(function (value, key) {
                multiQigProvisionalsPermissionInAllQig = (stdSetupPermissionHelper.
                    getSTDSetupPermissionByExaminerRole(value.role, value.markSchemeGroupId).role.permissions.multiQIGProvisionals) && multiQigProvisionalsPermissionInAllQig;
            });
        }
        return multiQigProvisionalsPermissionInAllQig;
    };
    /**
     * Populate recassify multioption popUp data
     */
    Footer.prototype.populateRecassifyMultiOptionPopUpData = function (selectedMarkingModeId) {
        if (selectedMarkingModeId === void 0) { selectedMarkingModeId = 0; }
        this.items = new Array();
        var markSchemeGroupId = standardisationSetupStore.instance.markSchemeGroupId;
        var ssuStmClassificationRestriction = stdSetupPermissionHelper.getSsuClassificationRestrictionByMarkSchemeGroupId(markSchemeGroupId);
        var restictedText = localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.restricted');
        this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Practice, 1, selectedMarkingModeId, ssuStmClassificationRestriction.isPracticeRestrictedForAnyStm, restictedText));
        this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.ES_TeamApproval, 2, selectedMarkingModeId, ssuStmClassificationRestriction.isStmStandardisationeRestrictedForAnyStm, restictedText));
        this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Approval, 3, selectedMarkingModeId, ssuStmClassificationRestriction.isStandardisationRestrictedForAnyStm, restictedText));
        this.items.push(this.createGenericRadioButtonItem(enums.MarkingMode.Seeding, 4, selectedMarkingModeId, ssuStmClassificationRestriction.isSeedingRestrictedForAnyStm, restictedText));
    };
    /**
     * Create Generic Radio Button Item
     * @param markingModeId
     * @param sequenceNo
     * @param selectedMarkingModeId
     * @param isMarkingModeRestrictedForAnyStm
     */
    Footer.prototype.createGenericRadioButtonItem = function (markingModeId, sequenceNo, selectedMarkingModeId, isMarkingModeRestrictedForAnyStm, restictedText) {
        var obj = new genericRadioButtonItems();
        obj.sequenceNo = sequenceNo;
        obj.id = markingModeId;
        obj.isChecked = obj.id === selectedMarkingModeId ? true : false;
        obj.name = localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.' + enums.MarkingMode[markingModeId]);
        obj.errorText = (isMarkingModeRestrictedForAnyStm ? '- ' + restictedText : '');
        return obj;
    };
    Object.defineProperty(Footer.prototype, "getReclassificationMultiOptionPopupContent", {
        /**
         * get reclassification Multi Option Popup Content
         */
        get: function () {
            var content = [];
            content.push(React.createElement("span", null, React.createElement("p", {className: 'dim-text'}, React.createElement("span", null, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.response-id'), React.createElement("span", {className: 'responseID'}, ' ' + this.reclassifyResponseDetails.displayId + ' ')), ",", React.createElement("span", null, ' ' + localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.total-mark'), React.createElement("span", {className: 'total-mark'}, ' ' + this.reclassifyResponseDetails.totalMarkValue))), React.createElement("p", {className: 'padding-top-10'}, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.body')), React.createElement("p", {className: 'padding-top-10'}, localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.reclassify-multioption-popup.body-complete-setup-message')), React.createElement("div", {className: 'classify-options-holder padding-top-10 clearfix'}, React.createElement(GenericPopupWithRadioButton, {className: 'option-items', id: 'popup-reclassify-multioption', items: this.items, selectedLanguage: this.props.selectedLanguage, onCheckedChange: this.onCheckedChange, renderedOn: this.state.renderedOn, liClassName: 'padding-top-10', key: 'popup-reclassify-multioption'}))));
            return content;
        },
        enumerable: true,
        configurable: true
    });
    return Footer;
}(pureRenderComponent));
module.exports = Footer;
//# sourceMappingURL=footer.js.map
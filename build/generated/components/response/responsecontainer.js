"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Add new dependencies in loadDependenciesAndAddEventListeners() method unless your dependencies are not using in constructor */
var React = require('react');
var Reactdom = require('react-dom');
var pureRenderComponent = require('../base/purerendercomponent');
var responseHelper = require('../utility/responsehelper/responsehelper');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var scriptStore = require('../../stores/script/scriptstore');
var Immutable = require('immutable');
var enums = require('../utility/enums');
var loginSession = require('../../app/loginsession');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var qigStore = require('../../stores/qigselector/qigstore');
var timerHelper = require('../../utility/generic/timerhelper');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var zoomPanelActionCreator = require('../../actions/zoompanel/zoompanelactioncreator');
var navigationHelper = require('../utility/navigation/navigationhelper');
var saveMarksAndAnnotationsNonRecoverableErrorDialogContents = require('../utility/savemarksandannotations/savemarksandannotationsnonrecoverableerrordialogcontents');
var marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
var worklistStore = require('../../stores/worklist/workliststore');
var exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
var popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
var applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
var classNames = require('classnames');
var constants = require('../utility/constants');
var $ = require('jquery');
var acceptQualityFeedbackActionCreator = require('../../actions/response/acceptqualityfeedbackactioncreator');
var annotationHelper = require('../utility/annotation/annotationhelper');
var treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
var onPageCommentHelper = require('../utility/annotation/onpagecommenthelper');
var pageLinkHelper = require('./responsescreen/linktopage/pagelinkhelper');
var responseStore = require('../../stores/response/responsestore');
var markinghelper = require('../../utility/markscheme/markinghelper');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
var warningMessageNavigationHelper = require('../../utility/teammanagement/helpers/warningmessagenavigationhelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
var applicationStore = require('../../stores/applicationoffline/applicationstore');
var responseContainerPopupHelper = require('../utility/responsehelper/responsecontainerpopuphelper');
var domManager = require('../../utility/generic/domhelper');
var exceptionsStore = require('../../stores/exception/exceptionstore');
var imageZoneStore = require('../../stores/imagezones/imagezonestore');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var toolbarActionCreator = require('../../actions/toolbar/toolbaractioncreator');
var copyPreviousMarksAndAnnotationsHelper = require('../utility/annotation/copypreviousmarksandannotationshelper');
var auditLoggingHelper = require('../utility/auditlogger/auditlogginghelper');
var htmlviewerhelper = require('../utility/responsehelper/htmlviewerhelper');
var standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
/* Add new dependencies in loadDependenciesAndAddEventListeners() method unless your dependencies are not using in constructor */
/* tslint:disable:variable-name */
var localeStore;
var worklistActionCreator;
var userInfoStore;
var markingStore;
var markSchemeStructureStore;
var Message;
var htmlUtilities;
var messageStore;
var keyDownHelper;
var messagingActionCreator;
var markingHelper;
var popupHelper;
var Exception;
var exceptionStore;
var stampStore;
var responseSearchHelper;
var messageHelper;
var exceptionHelper;
var operationModeHelper;
var userInfoActionCreator;
var qigSelectorActionCreator;
var stringFormatHelper;
var loggingHelper;
var responseScreenAuditHelper;
var urls;
var enhancedOffPageCommentStore;
var standardisationSetupStore;
var standardisationActionCreator;
/* tslint:disable:variable-name */
var SaveIndicator = function (props) { return (React.createElement("div", {id: 'saveIndicator', className: props.style}, localeStore.instance.TranslateText('marking.response.save-indicator.saving-marks'))); };
/* tslint:enable:variable-name */
/**
 * React component class for Response
 */
var ResponseContainer = (function (_super) {
    __extends(ResponseContainer, _super);
    /* Please DO NOT add any private variables here - Add corresponding property in the response container property base
        or its child and use the same instead of private variable**/
    /**
     * Constructor for the Response component
     * @param props
     * @param state
     */
    function ResponseContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.autoSaveTimeInterval = 0;
        this.isNetworkError = true;
        this.isUnknownContentMangedFromFRV = false;
        this.isStdsetupAdditionalpageSeen = false;
        this.doUnMount = false;
        /**
         * This method will validate whether or not the Exception Panel is edited
         */
        this.validateException = function (isValid) {
            _this.responseContainerProperty.isExceptionPanelEdited = !isValid;
        };
        /**
         * This method will display messaging panel
         */
        this.onMessageButtonClick = function () {
            // Hide annotation toolbar on opening the message panel.
            _this.responseContainerProperty.isToolBarPanelVisible = false;
            // activating the keydown helper in case exception deactivated previously.
            keyDownHelper.instance.resetMarkEntryDeactivators();
            // deactivating the keydown helper on message section open.
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            _this.responseContainerProperty.isMessagePanelVisible = true;
            _this.responseContainerProperty.isMessagePanelMinimized = false;
            _this.responseContainerProperty.isExceptionPanelEdited = false;
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            _this.setState({
                renderedOn: Date.now(),
                isExceptionPanelVisible: false
            });
        };
        /**
         * Will display mbc confirmation dialog
         */
        this.showMbQConfirmation = function () {
            if (markerOperationModeFactory.operationMode.showMbQConfirmation) {
                _this.setState({
                    isMbQConfirmationDialogDispalying: true,
                    renderedOn: Date.now()
                });
                _this.responseContainerProperty.doNavigateResponse =
                    _this.responseContainerProperty.markHelper.isLastResponseLastQuestion &&
                        responseHelper.isMbQSelected;
            }
        };
        /**
         * Will display Delete Comment confirmation dialog
         */
        this.showDeleteCommentPopUp = function () {
            // display dialog box
            _this.setState({ isDeleteCommentPopupVisible: true });
        };
        /**
         * Delete comment confirmation dialog Yes click
         */
        this.onYesButtonDeleteCommentClick = function () {
            // this will hide the comment box
            stampActionCreator.showOrHideComment(false);
            // deleting comment
            stampActionCreator.deleteComment(true);
            // hiding confirmation dialog
            _this.setState({ isDeleteCommentPopupVisible: false });
        };
        /**
         * Delete comment confirmation dialog No click
         */
        this.onNoButtonDeleteCommentClick = function () {
            // this will display the comment box and set focus on it
            stampActionCreator.showOrHideComment(true);
            // hiding confirmation dialog
            _this.setState({ isDeleteCommentPopupVisible: false });
        };
        /**
         * Mbc confirmation dialog Yes click
         */
        this.onYesButtonClick = function () {
            _this.setState({ isMbQConfirmationDialogDispalying: false });
            _this.responseContainerHelper.navigationOnMbqConfirmationYesButtonClick();
        };
        /**
         * Mbc confirmation dialog No click
         */
        this.onNoButtonClick = function () {
            _this.setState({ isMbQConfirmationDialogDispalying: false });
            /** to set the selection back to mark entry text box */
            markingActionCreator.setMarkEntrySelected();
        };
        /**
         * switch on/off mark validation popup
         * @param {number} minMark
         * @param {number} maxMark
         */
        this.onValidateMarkEntry = function (minMark, maxMark, isNonNumeric) {
            if (isNonNumeric === void 0) { isNonNumeric = false; }
            _this.responseContainerProperty.minimumNumericMark = minMark;
            _this.responseContainerProperty.maximumNumericMark = maxMark;
            _this.responseContainerProperty.isNonNumeric = isNonNumeric;
            _this.setState({ ismarkEntryPopupVisible: true });
        };
        /**
         * set on all images loaded completely
         */
        this.onAllImagesLoaded = function () {
            _this.setState({ isImagesLoaded: true });
        };
        /**
         * Load image
         * @param doUpdateAngleOfResponse
         */
        this.loadScriptImages = function (doUpdateAngleOfResponse) {
            if (doUpdateAngleOfResponse === void 0) { doUpdateAngleOfResponse = true; }
            var allimageURLs = _this.responseContainerHelper.setImagesToLoad(doUpdateAngleOfResponse);
            // Get the images for rendering.
            _this.loadImages(allimageURLs);
        };
        /**
         * Event on animation end
         * @param event
         */
        this.onAnimationEnd = function (event) {
            // If any child element has triggered the transion-end ignore it
            var element = event.srcElement || event.target;
            if (element.id !== 'messaging-panel') {
                return;
            }
            if (_this.state.isCommentsSideViewEnabled === true) {
                stampActionCreator.renderSideViewComments();
            }
        };
        /**
         * invoked on Mark as definitive button click on unclassified response.
         */
        this.reRender = function (copymarksasdef) {
            if (copymarksasdef) {
                copyPreviousMarksAndAnnotationsHelper.copyMarksAndAnnotationForUnClassified(markingStore.instance.currentMarkGroupId);
                _this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = true;
                _this.responseContainerProperty.isPreviousMarksAndAnnotationCopying = false;
            }
            var selectedViewMode = responseHelper.hasAdditionalObject ?
                enums.ResponseViewMode.fullResponseView : enums.ResponseViewMode.zoneView;
            _this.responseContainerProperty.isSLAOManaged = false;
            _this.responseContainerProperty.markSchemeRenderedOn = Date.now();
            _this.setState({
                renderedOn: Date.now(),
                selectedViewMode: selectedViewMode,
                isUnManagedSLAOPopupVisible: _this.isUnManagedSLAOPopUpVisible(selectedViewMode)
            });
        };
        /**
         * invoked when the response is closed
         */
        this.responseClosed = function () {
            _this.responseContainerProperty.doShowResposeLoadingDialog = true;
            // reset current question item bindex when response is closed
            _this.responseContainerProperty.currentQuestionItemBIndex = -1;
        };
        /**
         * invoked when the message is discarded while click mark now in supervisor remark tab
         */
        this.onSupervisorRemarkSubmitOrPromoteToSeed = function () {
            if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toSupervisorRemark) {
                _this.confirmSupervisorRemarkCreation(true);
            }
            else if (markingStore.instance.navigateTo === enums.SaveAndNavigate.toPromoteToSeed) {
                if (markingStore.instance.currentResponseMarkingProgress === 100) {
                    _this.responseContainerHelper.showPromoteToSeedConfirmationPopup();
                }
                else {
                    // if current responses marking progress is not 100% then display the promote to seed declined message.
                    _this.handlePromoteToSeedErrors(enums.PromoteToSeedErrorCode.NotFullyMarked);
                }
            }
        };
        /**
         * This method is used to fetch exception data
         */
        this.getExceptionData = function () {
            _this.responseContainerProperty.exceptionData = exceptionStore.instance.getExceptionData;
        };
        /**
         * invoked in window resize
         */
        this.onWindowResize = function () {
            _this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(_this).clientHeight;
            _this.getMessagePanelRightPosition();
        };
        /**
         * This method will update the meta tag for Android, for handling fit height issue
         * while virtual keyboard is open
         */
        this.onChangeDeviceOrientation = function () {
            /* Set the response container height */
            _this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(_this).clientHeight;
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
            htmlUtilities.updateMetaTagForAndroid(true);
            _this.getMessagePanelRightPosition();
        };
        /**
         * This method will close OnPageComment while mouse wheel click
         */
        this.onMouseDown = function (e) {
            // closing the comment while mouse wheel click
            if (e.which === 2) {
                var isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;
                if (isCommentBoxOpen) {
                    stampActionCreator.showOrHideComment(false);
                }
                var isBookmarkBoxOpen = markingStore.instance.selectedBookmarkClientToken !== undefined;
                if (isBookmarkBoxOpen) {
                    // Close Bookmark Name Entry Box
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                }
            }
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Annotation);
        };
        /*
         * mouseup event for response container
         */
        this.onMouseUp = function (e) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
        };
        /**
         * Navigate away from current response.
         */
        this.onNavigateAwayFromResponse = function (navigateTo) {
            if (!_this.responseContainerProperty.doNavigateResponse) {
                _this.responseContainerProperty.navigateTo = navigateTo;
            }
            if (_this.responseContainerProperty.isExceptionPanelEdited) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize, undefined, undefined, undefined, enums.ResponseNavigation.markScheme);
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardExceptionNavigateAway, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-navigate-away')
                });
            }
            else {
                _this.responseContainerProperty.isMessagePanelVisible = false;
                messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                if (navigateTo !== enums.SaveAndNavigate.toLogout) {
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
                }
                if (_this.responseContainerProperty.navigateTo !== undefined &&
                    _this.responseContainerProperty.navigateTo !== enums.SaveAndNavigate.none) {
                    popupHelper.navigateAway(_this.responseContainerProperty.navigateTo);
                    _this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
                }
                if (navigateTo !== enums.SaveAndNavigate.toLogout) {
                    _this.setState({
                        isExceptionPanelVisible: false
                    });
                }
            }
        };
        /**
         * selected question changed
         */
        this.questionChanged = function (bIndex) {
            // following condition is checked to prevent the responsecontainer getting refreshed every time, while
            // we resizing the panel. we don't need to fire this event if the currentQuestionItemBindex is same a bIndex
            // as we will only need to fire this event once when the selected question item change.
            if (markingStore.instance.getResizedPanelClassName() ||
                _this.responseContainerProperty.currentQuestionItemBIndex === bIndex) {
                // resetting flag on navigate to same qestion from FRV, to avoid reloading on next question item change fo reBookMarking
                _this.isUnknownContentMangedFromFRV = false;
                return;
            }
            if (responseHelper.hasUnManagedSLAOInMarkingMode || _this.responseContainerHelper.hasUnManagedImageZone() === true ||
                (responseHelper.hasAdditionalPageInStdSetUpSelectResponses && !_this.isStdsetupAdditionalpageSeen)) {
                _this.changeResponseViewMode();
                return;
            }
            _this.responseContainerProperty.currentQuestionItemBIndex = bIndex;
            _this.responseContainerProperty.responseContainerHeight = Reactdom.findDOMNode(_this).clientHeight;
            // to re-render the mark buttons on next question
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking) {
                if (markingStore.instance.currentlyLinkedZonePageNumber > 0) {
                    markingStore.instance.resetLinkedZonePageNumber();
                }
            }
            if ((((markingStore.instance.currentQuestionItemImageClusterId > 0 &&
                markingHelper.isImageClusterChanged()) ||
                /*For an ebook marking response with unmanaged contents, after managing from FRV and navigate to response screen.
              In this scenarion we cannot able to navigate again from FRV.
              So below condition added to load script images to fix the issue.  */
                (responseHelper.isEbookMarking &&
                    _this.responseContainerProperty.isUnknownContentManaged &&
                    _this.isUnknownContentMangedFromFRV)) &&
                !responseHelper.isAtypicalResponse()) ||
                markingHelper.hasDifferentLinkedPages() ||
                (!_this.responseContainerHelper.isECourseworkComponent() &&
                    (responseHelper.isEbookMarking && markingHelper.hasQuestionTagIdChanged()))) {
                _this.responseContainerProperty.scriptHelper.setMarkSchemeID(markingStore.instance.currentQuestionItemInfo.uniqueId);
                _this.responseContainerProperty.scriptHelper.setImageClusterID(markingStore.instance.currentQuestionItemImageClusterId);
                _this.loadScriptImages();
                // Setting the busy indicator properties
                _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                _this.setState({
                    imagesLoaded: false,
                    isBusy: true,
                    renderedOn: Date.now(),
                    selectedViewMode: _this.responseContainerHelper.hasUnManagedImageZone() ||
                        _this.canChangeToFRVonRemarkUnknownContent()
                        ? enums.ResponseViewMode.fullResponseView
                        : enums.ResponseViewMode.zoneView
                });
                // Reset the flag.
                _this.isUnknownContentMangedFromFRV = false;
            }
            else {
                // we need to activate the markentry deactivator as this is deactivated from the markscheme navigation
                // and only activating after the image is loaded.
                keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.TriggerSave);
                /* setting state in order to render available marks for the selected item
                *  even though there are no images to display
                */
                if (markingStore.instance.previousAnswerItemId !== markingStore.instance.currentQuestionItemInfo.answerItemId) {
                    _this.doUnMount = true;
                }
                _this.setState({
                    renderedOn: Date.now(),
                    selectedViewMode: _this.responseContainerHelper.hasUnManagedImageZone()
                        ? enums.ResponseViewMode.fullResponseView
                        : enums.ResponseViewMode.zoneView
                });
                // ToDo we need to revert this fix and check
                // is this issue exisist or not when the react new version comes
                // fix for the annotation rendering issue in favarate panel for the IE11 for the whole response
                var that_1 = _this;
                if (htmlUtilities.isIPadDevice && htmlUtilities.getUserDevice().browser === 'Safari' && _this.doUnMount) {
                    setTimeout(function () {
                        that_1.doUnMount = false;
                        that_1.setState({
                            renderedOn: Date.now()
                        });
                    }, 100);
                }
            }
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                onPageCommentHelper.resetSideViewCollections();
            }
            // hide the busy indicator while navigating inside the markscheme
            _this.responseContainerProperty.doShowResposeLoadingDialog = false;
            // This will reset the current scroll position and currently visible image
            responseActionCreator.resetScrollData();
        };
        /**
         * This will open the response item
         */
        this.responseChanged = function () {
            _this.setBackgroundSaveTimeInterval();
            _this.isStdsetupAdditionalpageSeen = false;
            _this.responseContainerProperty.renderedImageViewerCount = 0;
            _this.responseContainerProperty.markSchemeRenderedOn = Date.now();
            // Rerender the mark buttons on next response loaded
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            // This will reset the current scroll position and currently visible image
            responseActionCreator.resetScrollData();
            // Setting the busy indicator properties
            _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
            _this.responseContainerHelper.openResponse(_this.loadScriptImages);
            // Display Warning Popup when navigating to Response having an open zoning exception
            _this.displayZoningExceptionWarningPopup();
            _this.loadMessageFortheResponse();
            // Marks need to be reloaded on response change
            _this.checkIfMarkSchemeAndMarksAreLoaded();
            _this.responseContainerProperty.selectedMsg = undefined;
            _this.setState({
                imagesLoaded: false,
                isBusy: true,
                renderedOn: Date.now(),
                isExceptionPanelVisible: false,
                isPromoteToSeedButtonClicked: false
            });
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            _this.responseContainerHelper.resetVariablesOnResponseChanged();
            // hasUnManagedSLAOInMarkingMode was getting  incorrect behavior since the examinerMarksAgainstResponse undefined.
            // so changing ResponseViewMode  only when markscheme loaded && hasUnManagedSLAOInMarkingMode became true.
            if ((responseHelper.hasUnManagedSLAOInMarkingMode ||
                _this.responseContainerHelper.hasUnManagedImageZone() === true ||
                _this.canChangeToFRVonRemarkUnknownContent()) &&
                markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
                _this.changeResponseViewMode();
            }
        };
        /**
         * Callback function for mark this page click.
         */
        this.onMarkThisPageCallback = function (scrollPosition) {
            if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                // Updating the latest exception list
                exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
            }
            _this.responseContainerProperty.markThisPageScrollPosition = scrollPosition;
            _this.changeResponseViewMode();
            //Resetting for mark this page click
            _this.responseContainerProperty.scrollToSuppressArea = false;
            // reset the book mark previous scroll data while navigating to a page by 'Mark This Page' click
            responseActionCreator.setBookmarkPreviousScrollData(undefined);
        };
        /**
         * Handles the action event after fracs data loaded
         */
        this.onFracsDataLoaded = function () {
            _this.responseContainerHelper.fracsDataLoaded(_this.state.selectedViewMode);
        };
        /**
         * Handles the action event after structured fracs data loaded.
         */
        this.structuredFracsDataLoaded = function (fracsSource) {
            if (fracsSource !== enums.FracsDataSetActionSource.Acetate) {
                _this.responseContainerHelper.structuredFracsDataLoaded();
            }
        };
        /**
         * this will shows the confirmation popup on logout based on the ask on logout value.
         */
        this.showLogoutConfirmation = function () {
            _this.setState({ isConfirmationPopupDisplaying: true, renderedOn: Date.now() });
        };
        /**
         * Marks retrieval event.
         */
        this.marksRetrieved = function () {
            _this.checkIfMarkSchemeAndMarksAreLoaded();
        };
        /**
         * Confirmation poup for withdrawnResponse.
         */
        this.withdrawnResponse = function (isStandardisationSetup) {
            if (isStandardisationSetup) {
                _this.responseContainerProperty.withdrawScriptInStmErrorPopUpVisible = true;
            }
            else {
                _this.responseContainerProperty.withdrwnResponseErrorPopupVisible = true;
            }
        };
        /**
         * Confirmation poup for session closed Response.
         */
        this.sessionClosedForMarker = function () {
            _this.setState({
                sessionClosedErrorPopupVisible: true
            });
        };
        /**
         * Markscheme load event.
         */
        this.markSchemeLoaded = function () {
            _this.checkIfMarkSchemeAndMarksAreLoaded();
        };
        /**
         * Fires after email save
         */
        this.userInfoSaved = function () {
            _this.setState({
                isSaveEmailMessageDisplaying: true
            });
        };
        /**
         * Email save success message ok click
         */
        this.onOkClickOfEmailSucessMessage = function () {
            _this.setState({
                isSaveEmailMessageDisplaying: false
            });
        };
        /**
         * Complete button dialog, yes click.
         */
        this.onYesClickOnCompleteDialog = function () {
            _this.setState({
                isCompleteButtonDialogVisible: false
            });
            /** to enter NR for unmarked mark schemes */
            markingActionCreator.updateMarkAsNRForUnmarkedItem();
        };
        /**
         * Complete button dialog, No click.
         */
        this.onNoClickOnCompleteDialog = function () {
            _this.setState({
                isCompleteButtonDialogVisible: false
            });
            /** to set the selection back to mark entry text box */
            markingActionCreator.setMarkEntrySelected();
        };
        /**
         * Not all page annotated message leave response click
         */
        this.onLeaveResponseClick = function () {
            if (enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited) {
                enhancedOffPageCommentActionCreator.updateEnhancedOffPageComment(false);
            }
            if (_this.responseContainerProperty.navigateTo === enums.SaveAndNavigate.toLogout) {
                _this.showLogoutConfirmation();
            }
            else {
                markingActionCreator.saveAndNavigate(_this.responseContainerProperty.navigateTo);
            }
            _this.responseContainerProperty.isExceptionPanelEdited = false;
            _this.responseContainerProperty.isOnLeaveResponseClick = true;
            _this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
        };
        /**
         * Not all page annotated message stay in response click
         */
        this.onStayInResponseClick = function () {
            _this.responseContainerHelper.onStayInResponseClick();
        };
        /**
         * Method invoked on validation markup success message
         */
        this.onValidationMarkUpSucessMessage = function () {
            _this.setState({
                ismarkEntryPopupVisible: false
            });
            /** to set the selection back to mark entry text box */
            markingActionCreator.setMarkEntrySelected();
        };
        /**
         *  Go to the corresponding element if all images rendered.
         *  This will works for structured responses only. Scroll setting logic for unstructured is implemented in onFracsDataLoaded() method
         * @param {number} pageNumber
         * @param {number} offsetTop?
         */
        this.imageLoaded = function (pageNumber, offsetTop, hasImagesToRender) {
            _this.responseContainerHelper.imageLoaded(_this.state.isConfirmReviewOfMangedSLAOPopupShowing, offsetTop, hasImagesToRender);
        };
        /**
         * Full response view stay in response button click.
         */
        this.onFullresponseViewStayInResponseClick = function () {
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
                responseStore.instance.selectedResponseViewMode ===
                    enums.ResponseViewMode.fullResponseView &&
                markingHelper.hasUnAnnotatedSlao &&
                _this.responseContainerProperty.isStayInResponseFRViewModeTriggered) {
                _this.responseContainerProperty.isStayInResponseFRViewModeTriggered = false;
                var slaoFirstPageNumber = responseHelper.firstSLAOPageNumber;
                _this.responseContainerHelper.scrollToPageInFRView(slaoFirstPageNumber);
            }
        };
        /**
         * Check to move to FRV if unknown content in Remark.
         */
        this.canChangeToFRVonRemarkUnknownContent = function () {
            return (_this.responseContainerHelper.hasUnManagedImageZoneInRemark() &&
                !_this.responseContainerHelper.hasUnManagedImageZone() &&
                !_this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked &&
                _this.responseContainerProperty.isPreviousMarksAndAnnotationCopied);
        };
        /**
         * click no button of accept quality feedback confirmation popup
         */
        this.onAcceptQualityNoButtonClick = function () {
            _this.setState({ isAcceptQualityConfirmationPopupDisplaying: false });
        };
        /**
         * click yes button of accept quality feedback confirmation popup
         */
        this.onAcceptQualityYesButtonClick = function () {
            _this.setState({ isAcceptQualityConfirmationPopupDisplaying: false });
            var openedResponseDetails = worklistStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            acceptQualityFeedbackActionCreator.acceptQualityFeedback(openedResponseDetails.markGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, enums.SaveAndNavigate.toWorklist, worklistStore.instance.currentWorklistType);
        };
        /**
         * show accept quality feedback confirmation popup
         */
        this.showAcceptQualityConfirmationDialog = function () {
            _this.setState({ isAcceptQualityConfirmationPopupDisplaying: true });
        };
        /**
         * Checking whether Not all page annotated popup should be visible.
         */
        this.checkIfAllPagesAreAnnotated = function (navigateTo) {
            _this.setState({ isAllPageNotAnnotatedVisible: true });
            if (!_this.responseContainerProperty.doNavigateResponse) {
                _this.responseContainerProperty.navigateTo = navigateTo;
            }
        };
        /**
         * Checking whether complete popup should be visible.
         */
        this.showCompleteButtonDialog = function () {
            _this.setState({ isCompleteButtonDialogVisible: true });
        };
        /**
         * Reseting the confirmation dialog's state to make it invisible.
         */
        this.resetLogoutConfirmationSatus = function () {
            _this.setState({ isConfirmationPopupDisplaying: false, renderedOn: Date.now() });
        };
        /**
         * Get the last mark scheme id after loading the mark scheme structure.
         */
        this.onMarkSchemeStructureLoaded = function (lastMarkSchemeId) {
            _this.responseContainerProperty.lastMarkSchemeId = lastMarkSchemeId;
        };
        /**
         * On changing the response view, Saving the user option and re-rendering
         * the marking view button.
         * @param {enums.fullResponeViewOption} fullResponseOption
         */
        this.onChangeResponseViewClick = function (fullResponseOption) {
            /** Updating the useroption */
            userOptionsHelper.save(userOptionKeys.FULL_RESPONSE_VIEW_OPTION, fullResponseOption.toString(), true);
            /** Setting state for re-rendering the FullResponseImageViewer component */
            _this.setState({ fullResponseViewOption: fullResponseOption });
            // call full response view option changed action.
            responseActionCreator.fullResponseViewOptionChanged(fullResponseOption);
            /** Rerendering Wavy Annotations to persist thickness and pattern */
            responseActionCreator.updateWavyAnnotationsViewModeChanged();
        };
        /**
         * Invokes when the user changed the status of the button.
         */
        this.onShowAnnotatedPagesOptionChanged = function (isShowAnnotatedPagesOption) {
            _this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected = isShowAnnotatedPagesOption;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Invokes when the user changed the status of 'Only show unannotated additional pages' button.
         */
        this.onShowUnAnnotatedAdditionalPagesOptionChanged = function (isShowUnAnnotatedAdditionalPagesOption) {
            _this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected = isShowUnAnnotatedAdditionalPagesOption;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Invokes when the user changed the status of the button.
         */
        this.onShowAllPagesOfScriptOptionChanged = function (isShowAnnotatedPagesOption) {
            _this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected = isShowAnnotatedPagesOption;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Callback function for full response view option changed
         * @param fullResponseViewOption - response view option
         * @param offsetTop - offsetTop value
         */
        this.onFullResponseViewOptionChangedCallback = function (fullResponseViewOption, offsetTop) {
            // Scroll to the element
            $('.marksheet-container').scrollTop(offsetTop);
        };
        /**
         * On mouse move handler
         * @param event
         */
        this.onMouseMove = function (event) {
            var elementClassName = event.target.className;
            // check for 'annotation' string in the element's class name, this is
            // to skip the annotation overlay and other annotation elements
            if (elementClassName &&
                typeof elementClassName === 'string' &&
                (elementClassName.indexOf('annotation') === -1 &&
                    elementClassName.indexOf('svg-icon') === -1 &&
                    elementClassName.indexOf('txt-icon') === -1)) {
                responseActionCreator.setMousePosition(-1, -1);
            }
        };
        /**
         * On mouse click event handler
         * @param event
         */
        this.onClickHandler = function (event) {
            // This is to prevent event handling issue in firefox.
            // when new annotation is stamping we are not sending the event to
            // prevent the comment from removing. once it stamped revoke the value so
            // that in another click will hide the comment box.
            var isClickOutsideScript = false;
            var outsideClickClasses = [
                'marksheet-content-holder',
                'marksheet-holder',
                'marksheet-zoom-holder',
                'comments-bg'
            ];
            // if clicked outside the script, close the open comment
            if (event.target.classList !== undefined) {
                isClickOutsideScript = outsideClickClasses.indexOf(event.target.classList[0]) !== -1;
            }
            if ((!_this.responseContainerProperty.isOnPageCommentStamped &&
                !onPageCommentHelper.commentMoveInSideView &&
                (stampStore.instance.SelectedSideViewCommentToken !== undefined ||
                    stampStore.instance.SelectedOnPageCommentClientToken !== undefined)) ||
                isClickOutsideScript) {
                stampActionCreator.showOrHideComment(false);
            }
            else {
                _this.responseContainerProperty.isOnPageCommentStamped = false;
                onPageCommentHelper.commentMoveInSideView = false;
            }
            if (markingStore.instance.selectedBookmarkClientToken &&
                event.target !== undefined &&
                domManager.searchParentNode(event.target, function (el) {
                    return el.id === 'bookmark-entry';
                }) == null) {
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
            }
            var element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
            if (!element) {
                return;
            }
            var clientToken = element.getAttribute('data-token');
            // this check is to call preventDefault if the click is over the remove annotation context menu
            if (!clientToken &&
                element &&
                ((typeof element.className === 'string' &&
                    element.className.indexOf('remove-annotation') === -1) ||
                    // handle click on collapsed file list panel, where the element class name is svg type
                    typeof element.className === 'object')) {
                markingActionCreator.showOrHideRemoveContextMenu(false);
            }
        };
        /**
         * Non-Recoverable marks and annotation save error message ok click
         */
        this.onOkClickOfNonRecoverableErrorMessage = function () {
            // close the non-recoverable error popup.
            _this.setState({
                isNonRecoverableErrorPopupVisible: false
            });
        };
        /**
         * switch on/off mark validation popup
         * @param {number} minMark
         * @param {number} maxMark
         */
        this.onResetMarkConfirm = function (isResetButtonClick, previousMark) {
            _this.responseContainerProperty.isResetActionByClick = isResetButtonClick;
            _this.responseContainerProperty.previousMark = previousMark;
            if (htmlviewerhelper.isHtmlComponent && !isResetButtonClick) {
                _this.onResetMarkYesButtonClick();
            }
            else {
                isResetButtonClick
                    ? htmlviewerhelper.isHtmlComponent ?
                        _this.setConfirmationDialogContent(localeStore.instance.TranslateText('marking.response.reset-mark-dialog.body-when-reset-button-clicked-cbt'))
                        : _this.setConfirmationDialogContent(localeStore.instance.TranslateText('marking.response.reset-mark-dialog.body-when-reset-button-clicked'))
                    : _this.setConfirmationDialogContent(localeStore.instance.TranslateText('marking.response.reset-mark-dialog.body-when-mark-deleted'));
                _this.setState({ isResetMarkPopupVisible: true });
                _this.responseContainerProperty.isResetMarkPopupShown = true;
                _this.responseContainerProperty.isMarkChangeReasonShown = false;
            }
        };
        /**
         * Reset mark Yes click
         */
        this.onResetMarkYesButtonClick = function () {
            // If reset triggered delete both mark and annotation.
            markingActionCreator.resetMarksAndAnnotation(true, true);
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.responseContainerProperty.isResetMarkPopupShown = false;
            _this.setState({
                isResetMarkPopupVisible: false
            });
            /** to set the selection back to mark entry text box */
            markingActionCreator.setMarkEntrySelected();
        };
        /**
         * Reset mark No click
         */
        this.onResetMarkNoButtonClick = function () {
            // If reset action by click then we dont need to update anything.
            if (_this.responseContainerProperty.isResetActionByClick === false) {
                // If reset triggered delete both mark and annotation.
                markingActionCreator.resetMarksAndAnnotation(true, false);
            }
            else if (_this.responseContainerProperty.previousMark &&
                _this.responseContainerProperty.previousMark.displayMark !== '') {
                // this is to re-assign the value to the markscheme text box
                markingActionCreator.resetMarksAndAnnotation(false, false, _this.responseContainerProperty.previousMark);
            }
            // Hide the popup
            _this.setState({
                isResetMarkPopupVisible: false
            });
            _this.responseContainerProperty.isResetMarkPopupShown = false;
            /** to set the selection back to mark entry text box */
            markingActionCreator.setMarkEntrySelected();
        };
        /**
         * on resetting mark and annotation completed
         * this will trigger even a single keyboard entry on markascheme panel.
         */
        this.notifyMarkUpdated = function () {
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method fired to minimize the exception panel.
         */
        this.onMinimizeExceptionPanel = function () {
            // Show annotation toolbar on minimizing the exception panel.
            _this.responseContainerProperty.isToolBarPanelVisible = true;
            _this.responseContainerHelper.setCssStyle();
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            _this.responseContainerProperty.isExceptionPanelMinimized = true;
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Method fired to maximize the exception panel.
         */
        this.onMaximizeExceptionPanel = function () {
            // Hide annotation toolbar on maximizing the exception panel.
            _this.responseContainerProperty.isToolBarPanelVisible = false;
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Method fired to close the message panel.
         */
        this.onCloseMessagePanel = function (navigateTo) {
            if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
            // If Message is sent, get force reload the list for new data
            if (_this.responseContainerProperty.isMessagePanelVisible &&
                messageStore.instance.isMessageDataRequireUpdation) {
                _this.loadMessageFortheResponse();
            }
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            // Defect fix: #48317
            if (_this.responseContainerProperty.messageType !== enums.MessageType.ResponseDetails) {
                _this.responseContainerProperty.messageType = enums.MessageType.ResponseCompose;
            }
            switch (navigateTo) {
                case enums.SaveAndNavigate.messageWithInResponse:
                    _this.openMessage(_this.responseContainerProperty.messageIdToSelect);
                    break;
                case enums.SaveAndNavigate.toNewResponseMessageCompose:
                    // close the existing message panel that will clear the message editor contents.
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    // compose new message window
                    _this.createNewMessage();
                    break;
                case enums.SaveAndNavigate.newExceptionButtonClick:
                case enums.SaveAndNavigate.exceptionWithInResponse:
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    markingHelper.canNavigateAwayFromCurrentResponse();
                    _this.responseContainerProperty.isExceptionPanelEdited = false;
                    _this.responseContainerProperty.isMessagePanelVisible = false;
                    if (navigateTo === enums.SaveAndNavigate.newExceptionButtonClick) {
                        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                        _this.onCreateNewExceptionClicked();
                    }
                    else {
                        _this.onExceptionSelected(_this.responseContainerProperty.exceptionId);
                    }
                    break;
                case enums.SaveAndNavigate.newExceptionFromMediaErrorDialog:
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    markingHelper.canNavigateAwayFromCurrentResponse();
                    _this.responseContainerProperty.isExceptionPanelEdited = false;
                    _this.responseContainerProperty.isMessagePanelVisible = false;
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                    _this.onCreateNewExceptionClicked(_this.responseContainerProperty.isFromMediaErrorDialog, _this.responseContainerProperty.errorViewmoreContent);
                    break;
                default:
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    break;
            }
            _this.setState({
                renderedOn: Date.now(),
                isExceptionPanelVisible: navigateTo === enums.SaveAndNavigate.newExceptionButtonClick
                    ? true
                    : _this.state.isExceptionPanelVisible
            });
        };
        /**
         * Method fired to minimize the message panel.
         */
        this.onMinimizeMessagePanel = function () {
            // Show annotation toolbar on minimizing the message panel.
            _this.responseContainerProperty.isToolBarPanelVisible = true;
            _this.responseContainerProperty.isMessagePanelMinimized = true;
            _this.responseContainerHelper.setCssStyle();
            /* Defect:24608 - seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad */
            if (htmlUtilities.isIPadDevice) {
                htmlUtilities.setFocusToElement('message-subject');
                htmlUtilities.blurElement('message-subject');
            }
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Messaging);
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Method fired to maximize the message panel.
         */
        this.onMaximizeMessagePanel = function () {
            // Hide annotation toolbar on minimizing the message panel.
            _this.responseContainerProperty.isToolBarPanelVisible = false;
            _this.responseContainerProperty.isMessagePanelMinimized = false;
            _this.responseContainerProperty.hasResponseLayoutChanged = true;
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Remove the fit height setting before zooming
         */
        this.onCustomZoomUpdated = function (zoomType, switchTo) {
            switch (switchTo) {
                case enums.ResponseViewSettings.CustomZoom:
                    zoomPanelActionCreator.HandleZoomPanelActions(enums.ResponseViewSettings.CustomZoom, zoomType);
                    break;
                case enums.ResponseViewSettings.FitToWidth:
                    zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.FitToWidth);
                    break;
                case enums.ResponseViewSettings.FitToHeight:
                    zoomPanelActionCreator.SetFracsDataForZoom(enums.ResponseViewSettings.FitToHeight);
                    break;
            }
        };
        /**
         * this is called when an annotation is added for setting on page comment related flag
         * @param {number} stampId StamptypeID
         */
        this.onAnnotationAdded = function (stampId, addAnnotationAction, annotationOverlayId, annotation, isStitched, isPageLinkedByPreviousMarker) {
            // Check if all pages are annotated - included since clicking 'Flag as Seen' button
            // from full response view was not reflecting in worklist home screen
            var isAllPagesAnnotated = markingHelper.isAllPageAnnotated();
            if (isAllPagesAnnotated) {
                var treeViewItem = _this.responseContainerProperty.treeViewHelper.treeViewItem();
                markingActionCreator.updateSeenAnnotation(isAllPagesAnnotated, treeViewItem);
            }
            // Perform only for onpage comment to open comment box
            // for firefox.
            if (stampId === enums.DynamicAnnotation.OnPageComment) {
                _this.responseContainerProperty.isOnPageCommentStamped = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            else if (stampId === constants.LINK_ANNOTATION &&
                _this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
                !isPageLinkedByPreviousMarker) {
                _this.loadScriptImages(false);
                // Setting the busy indicator properties
                _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                _this.setState({
                    imagesLoaded: false,
                    isBusy: true,
                    renderedOn: Date.now(),
                    selectedViewMode: enums.ResponseViewMode.zoneView
                });
            }
        };
        /**
         * Get the selected message for the response.
         * @param msgId
         */
        this.onMessageSelected = function (msgId) {
            // Defect 69750 Fix - reset the selected message details on clicking the linked message,
            // and this will updated with correct message details from onMessageDetailsReceived
            _this.responseContainerProperty.selectedMsgDetails = undefined;
            _this.getMessagePanelRightPosition();
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            // deactivating the keydown helper on message section open.
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
            _this.responseContainerProperty.messageIdToSelect = msgId;
            _this.responseContainerProperty.messageId = msgId;
            if (_this.responseContainerProperty.isMessagePanelVisible &&
                (_this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
                    _this.responseContainerProperty.messageType === enums.MessageType.ResponseForward ||
                    _this.responseContainerProperty.messageType === enums.MessageType.ResponseReply)) {
                var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.messageWithInResponse);
            }
            else if (_this.responseContainerProperty.isExceptionPanelEdited) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardExceptionOnViewMessage, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body')
                });
            }
            else {
                _this.openMessage(_this.responseContainerProperty.messageIdToSelect);
            }
            _this.addTransitionEventListeners();
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Handles the action event on Message Details Received.
         */
        this.onMessageDetailsReceived = function (msgId) {
            // Check the selection got changed while receives the message
            if (_this.responseContainerProperty.selectedMsg.examinerMessageId === msgId) {
                _this.responseContainerProperty.selectedMsgDetails = messageStore.instance.getMessageDetails(msgId);
                _this.responseContainerProperty.exceptionDetails = undefined;
                _this.responseContainerProperty.isMessagePanelVisible = true;
                if (_this.responseContainerProperty.selectedMsg.status === enums.MessageReadStatus.New) {
                    _this.updateReadStatus();
                }
                _this.responseContainerProperty.isNewException = false;
                _this.setState({
                    isExceptionPanelVisible: false,
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Click Handler of Create new message
         */
        this.onCreateNewMessageSelected = function () {
            _this.getMessagePanelRightPosition();
            if (_this.responseContainerProperty.isFromMediaErrorDialog &&
                _this.state.isExceptionPanelVisible) {
                _this.responseContainerProperty.isExceptionPanelEdited = true;
            }
            _this.responseContainerProperty.messageIdToSelect = 0;
            if (_this.responseContainerProperty.isMessagePanelVisible &&
                (_this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
                    _this.responseContainerProperty.messageType === enums.MessageType.ResponseForward ||
                    _this.responseContainerProperty.messageType === enums.MessageType.ResponseReply)) {
                _this.responseContainerProperty.isExceptionPanelEdited = false;
                var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
                popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, messageHelper.getNavigateAwayType(_this.responseContainerProperty.messageType));
            }
            else if (_this.responseContainerProperty.isExceptionPanelEdited) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardExceptionOnNewMessage, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.discard-message-or-exception-dialog.body')
                });
            }
            else {
                // check online status before proceed
                _this.checkOnlineStatusComposeMessage();
            }
            _this.addTransitionEventListeners();
        };
        /**
         * Invoked once the message read status changed in UI
         * OR there is a total count mismatch in the Total Unread count for all components
         */
        this.onMessageReadStatusRequireUpdation = function (totalUnreadMessageCount, isMessageReadCountChanged) {
            _this.responseContainerProperty.unReadMessageCount =
                totalUnreadMessageCount > 0
                    ? totalUnreadMessageCount
                    : messageStore.instance.getUnreadMessageCount;
            if (isMessageReadCountChanged) {
                _this.loadMessageFortheResponse();
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Invoked when the zoom has been  completed and if we need to navigate to any
         * page setting stored scrollTop.
         */
        this.onResponseZoomUpdated = function () {
            // to get actual number of images which has been currently loaded
            var noOfImagesLoaded = $('.marksheet-view-holder img').length;
            // setting scroll position only when all the images gets loaded
            if (noOfImagesLoaded === _this.responseContainerProperty.totalImagesWithOutSuppression) {
                if (_this.state.selectedViewMode === enums.ResponseViewMode.zoneView) {
                    setTimeout(function () {
                        _this.onMarkThisPageLoaded();
                    }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                }
                if (_this.responseContainerProperty.scrollToTopOf !== undefined ||
                    _this.responseContainerProperty.scrollToSuppressArea) {
                    var that_2 = _this;
                    setTimeout(function () {
                        // When the user tries to navigate from the response before specified time, the image container is undefined
                        if ($('.marksheet-container').get(0) !== undefined) {
                            $('.marksheet-container').scrollTop(that_2.responseContainerHelper.getScrollPosition());
                            that_2.responseContainerProperty.scrollToTopOf = undefined;
                        }
                    }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                }
            }
        };
        /**
         * Get the selected exception for the response.
         * @param exceptionId
         */
        this.onExceptionSelected = function (exceptionId) {
            _this.getMessagePanelRightPosition();
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            _this.responseContainerProperty.exceptionId = exceptionId;
            if (messageStore.instance.isMessagePanelActive) {
                _this.responseContainerHelper.triggerMessageNavigationAction(enums.MessageNavigation.exceptionWithInResponse);
            }
            else if (_this.responseContainerProperty.isExceptionPanelEdited) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-open-another')
                });
            }
            else {
                if (exceptionId !== undefined) {
                    _this.responseContainerProperty.isMessagePanelVisible = false;
                    _this.responseContainerProperty.isNewException = false;
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                    messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                    exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.View);
                    if (!_this.responseContainerProperty.isNewException) {
                        if (teamManagementStore &&
                            teamManagementStore.instance.isRedirectFromException &&
                            teamManagementStore.instance.selectedException) {
                            _this.responseContainerProperty.exceptionDetails = exceptionStore.instance.getExceptionItem(teamManagementStore.instance.selectedException.exceptionId);
                        }
                        else {
                            _this.responseContainerProperty.exceptionDetails = exceptionStore.instance.getExceptionItem(exceptionId);
                        }
                    }
                    _this.setState({
                        isExceptionPanelVisible: true,
                        renderedOn: Date.now()
                    });
                }
            }
            _this.addTransitionEventListeners();
        };
        /**
         * Click Handler of Create new exception
         */
        this.onCreateNewExceptionClicked = function (isFromMediaErrorDialog, errorViewmoreContent) {
            if (isFromMediaErrorDialog === void 0) { isFromMediaErrorDialog = false; }
            if (errorViewmoreContent === void 0) { errorViewmoreContent = ''; }
            _this.responseContainerHelper.onCreateNewExceptionClicked(isFromMediaErrorDialog, errorViewmoreContent, _this.state.isExceptionPanelVisible, _this.getMessagePanelRightPosition, function () {
                _this.setState({ isExceptionPanelVisible: true, renderedOn: Date.now() });
            }, _this.addTransitionEventListeners);
        };
        /**
         * Method fired to close the exception panel.
         */
        this.onCloseExceptionPanel = function (isSubmitAndClose, createExceptionReturnErrorCode) {
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            if (_this.responseContainerProperty.isFromMediaErrorDialog &&
                _this.state.isExceptionPanelVisible) {
                _this.responseContainerProperty.isExceptionPanelEdited = true;
            }
            if (isSubmitAndClose) {
                _this.responseContainerProperty.isExceptionPanelEdited = false;
            }
            if (_this.responseContainerProperty.isExceptionPanelEdited) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
                popUpDisplayActionCreator.popUpDisplay(enums.PopUpType.DiscardException, enums.PopUpActionType.Show, enums.SaveAndNavigate.none, {
                    popupContent: localeStore.instance.TranslateText('marking.response.discard-exception-dialog.body-raise-new')
                });
            }
            else {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
            }
            // if the reponse is withdrawn ,then show a poup that indicating response has withdrwan.
            if (createExceptionReturnErrorCode === enums.ReturnErrorCode.WithdrawnResponse) {
                _this.responseContainerProperty.creatExceptionReturnWithdrwnResponseErrorPopupVisible = true;
            }
            // if the reponse is deallocated ,then show a poup
            if (createExceptionReturnErrorCode === enums.ReturnErrorCode.DeallocatedResponse) {
                _this.setState({ isMessageSendErrorPopupVisible: true });
            }
        };
        /**
         *  This will call on exception close
         */
        this.onExceptionPanelClose = function () {
            // Show annotation toolbar on closing the exception panel.
            _this.responseContainerProperty.isToolBarPanelVisible = true;
            _this.responseContainerProperty.isExceptionPanelMinimized = false;
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.setState({
                isExceptionPanelVisible: false,
                renderedOn: Date.now()
            });
            _this.responseContainerProperty.isExceptionPanelEdited = false;
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
        };
        /**
         * This method is handling the various popup events.
         */
        this.onPopUpDisplayEvent = function (popUpType, popUpActionType) {
            switch (popUpType) {
                case enums.PopUpType.DiscardOnNewExceptionButtonClick:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            _this.responseContainerProperty.isMessagePanelVisible = false;
                            _this.responseContainerProperty.isExceptionPanelEdited = false;
                            _this.responseContainerProperty.isNewException = true;
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                            break;
                        case enums.PopUpActionType.No:
                            break;
                    }
                    break;
                case enums.PopUpType.DiscardException:
                case enums.PopUpType.DiscardExceptionNavigateAway:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
                            _this.responseContainerProperty.isMessagePanelVisible = false;
                            _this.responseContainerProperty.isExceptionPanelEdited = false;
                            if (_this.responseContainerProperty.navigateTo !== undefined &&
                                _this.responseContainerProperty.navigateTo !== enums.SaveAndNavigate.none) {
                                popupHelper.navigateAway(_this.responseContainerProperty.navigateTo);
                                _this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
                            }
                            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
                            _this.setState({
                                renderedOn: Date.now(),
                                isExceptionPanelVisible: false
                            });
                            break;
                        case enums.PopUpActionType.No:
                            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
                            _this.responseContainerProperty.navigateTo = enums.SaveAndNavigate.none;
                            break;
                    }
                    break;
                case enums.PopUpType.DiscardExceptionOnViewExceptionButtonClick:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Open);
                            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
                            _this.responseContainerProperty.isExceptionPanelEdited = false;
                            _this.responseContainerProperty.isMessagePanelVisible = false;
                            _this.setState({
                                isExceptionPanelVisible: true
                            });
                            _this.onExceptionSelected(_this.responseContainerProperty.exceptionId);
                            break;
                        case enums.PopUpActionType.No:
                            break;
                    }
                    break;
                case enums.PopUpType.DiscardExceptionOnNewMessage:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            _this.createNewMessage();
                            break;
                        case enums.PopUpActionType.No:
                            break;
                    }
                    break;
                case enums.PopUpType.DiscardExceptionOnViewMessage:
                    switch (popUpActionType) {
                        case enums.PopUpActionType.Yes:
                            _this.openMessage(_this.responseContainerProperty.messageId);
                            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
                            _this.responseContainerProperty.isExceptionPanelEdited = false;
                            _this.responseContainerProperty.isMessagePanelVisible = true;
                            _this.setState({
                                isExceptionPanelVisible: false
                            });
                            break;
                        case enums.PopUpActionType.No:
                            break;
                    }
                    break;
            }
        };
        /**
         * Messages Loaded. Display the Message Panel details if required
         */
        this.onMessagesReceived = function (isMessageReadCountChanged, selectedMessageId) {
            if (selectedMessageId > 0) {
                var msgs = messageStore.instance.messages;
                _this.responseContainerProperty.selectedMsg = msgs.find(function (x) { return x.examinerMessageId === selectedMessageId; });
                _this.onMessageSelected(selectedMessageId);
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * show saving indicator whil background save has triggered while marking same response for long time
         */
        this.onSaveMarksAndAnnotationsTriggered = function () {
            // This will show the save indicator only for background save.
            // this will prevent showing multiple save indicator while save and navigate
            // to next/previous response.
            if (_this.responseContainerProperty.autoSaveTriggered) {
                _this.showAndHideSavingIndicator(false);
                _this.responseContainerProperty.autoSaveTriggered = false;
            }
        };
        /**
         * Saving started on navigating responses.
         */
        this.onSaveAndNavigateInitiated = function (processSave) {
            _this.showAndHideSavingIndicator(processSave === false ? false : true);
        };
        /**
         * Will display delete message confirmation dialog
         */
        this.showDeleteMessagePopUp = function () {
            _this.setState({ isDeleteMessagePopupVisible: true });
        };
        /**
         * Delete message confirmation dialog Yes click
         */
        this.onYesButtonDeleteMessageClick = function () {
            _this.deleteMessage();
            _this.responseContainerProperty.isDeleteMessageYesClicked = true;
            // hiding confirmation dialog
            _this.setState({ isDeleteMessagePopupVisible: false });
        };
        /**
         * Delete message confirmation dialog No click
         */
        this.onNoButtonDeleteMessageClick = function () {
            // hiding confirmation dialog
            _this.setState({ isDeleteMessagePopupVisible: false });
        };
        /**
         * Load response on message deletion.
         */
        this.onMessageDeleted = function () {
            _this.loadMessageFortheResponse();
            _this.onCloseMessagePanel();
        };
        /**
         * Close message panel
         */
        this.onMessagePanelClose = function () {
            _this.responseContainerProperty.selectedMsg = undefined;
            _this.responseContainerProperty.isMessagePanelVisible = false;
            _this.responseContainerProperty.isMessagePanelMinimized = false;
            // Show annotation toolbar on closing the message panel.
            _this.responseContainerProperty.isToolBarPanelVisible = true;
            _this.responseContainerProperty.markButtonRenderedOn = Date.now();
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Update Previous Mark Selection
         */
        this.onUpdatepreviousMarkSelection = function () {
            _this.responseContainerProperty.isPrevMarkListUnChecked = !markingStore.instance
                .previousMarkListColumnVisible;
        };
        /**
         * Called once panel is resized to left/right
         */
        this.onPanelResize = function () {
            _this.getMessagePanelRightPosition();
            _this.responseContainerProperty.cssMessageStyle = {
                right: _this.responseContainerProperty.resizedWidth
            };
            _this.setState({ renderedOn: Date.now() });
        };
        /*
         * Get the message panel position- including the clientwidth, left border, right border and scrollbar width
         */
        this.getMessagePanelRightPosition = function () {
            _this.responseContainerProperty.markSchemeWidth = _this.responseContainerHelper.getMarkSchemeWidth();
            var scrollBarWidth = _this.responseContainerHelper.getscrollbarWidth();
            if (scrollBarWidth) {
                _this.responseContainerProperty.scrollBarWidth = scrollBarWidth + 'px';
            }
            else {
                _this.responseContainerProperty.scrollBarWidth = '0px';
            }
            _this.responseContainerProperty.resizedWidth =
                _this.responseContainerProperty.markButtonWidth +
                    _this.responseContainerProperty.markSchemeWidth +
                    _this.responseContainerProperty.scrollBarWidth;
        };
        /* Response Message section ends */
        /* on page comments - side view */
        this.toggleCommentsSideView = function (enableSideView, disableOnDevices) {
            if (disableOnDevices === void 0) { disableOnDevices = false; }
            _this.responseContainerProperty.isOnPageCommentStamped = false;
            if (!disableOnDevices) {
                userOptionsHelper.save(userOptionKeys.COMMENTS_SIDE_VIEW, String(enableSideView), true);
            }
            _this.setState({
                isCommentsSideViewEnabled: enableSideView,
                renderedOn: Date.now()
            });
            // Log the comment side view state changes
            new loggingHelper().logCommentSideViewStateChanges(loggerConstants.MARKENTRY_REASON_COMMENT_SIDE_VIEW_CHANGED, loggerConstants.MARKENTRY_TYPE_COMMENT_SIDE_VIEW_CHANGED, enableSideView, markingStore.instance.currentMarkGroupId);
        };
        /**
         * Called when comment is removed from view (deleted or visibility changed)
         */
        this.handleMarksAndAnnotationsVisibility = function (isMarksColumnVisibilitySwitched) {
            if (isMarksColumnVisibilitySwitched === void 0) { isMarksColumnVisibilitySwitched = false; }
            if (isMarksColumnVisibilitySwitched) {
                _this.responseContainerProperty.isPrevMarkListColumnVisible =
                    markingStore.instance.previousMarkListColumnVisible;
            }
            else {
                _this.responseContainerProperty.isPrevMarkListColumnVisible = false;
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * called when an annotation is removed
         */
        this.removeAnnotation = function () {
            //don't check for side view here as changes need to reflect in on page mode as well
            onPageCommentHelper.resetSideViewCollections();
            if (_this.state.isCommentsSideViewEnabled) {
                stampActionCreator.renderSideViewComments();
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method called when remark now button is clicked
         */
        this.onRemarkNowButtonClicked = function () {
            var navigatePossible = true;
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.UnSentMessage) !== -1) {
                // we have to display discard message warning if failure condition is unsendmessage only.
                // if multiple failure reasons are there then we will handle on that messages
                messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.ResponseCompose, enums.SaveAndNavigate.toSupervisorRemark, enums.SaveAndNavigate.toSupervisorRemark);
            }
            else {
                _this.confirmSupervisorRemarkCreation(true);
            }
        };
        /**
         * On discard response popup ok click
         */
        this.onDiscardStandardisationResponseIconClicked = function () {
            _this.setState({
                isDiscardStandardisationPopupVisible: true
            });
        };
        /**
         * Method called when remark later button is clicked
         */
        this.onRemarkLaterButtonClicked = function () {
            _this.confirmSupervisorRemarkCreation(false);
        };
        /**
         * Get Confirmation for supervisor remark for whole responses
         */
        this.confirmSupervisorRemarkCreation = function (isMarkNow) {
            var isWholeResponseRemark = responseStore.instance.isWholeResponse;
            _this.responseContainerProperty.IsWholeResponseRemarkMarkNow = isMarkNow;
            if (isWholeResponseRemark) {
                _this.setState({
                    isWholeResponseRemarkConfirmationPopupVisible: true
                });
            }
            else {
                _this.responseContainerHelper.createSupervisorRemark(isWholeResponseRemark, isMarkNow);
            }
        };
        /**
         * Method called when whole response remark confirmation yes button is clicked
         */
        this.onWholeResponseRemarkConfirmationYesClick = function () {
            _this.setState({
                isWholeResponseRemarkConfirmationPopupVisible: false
            });
            _this.responseContainerHelper.createSupervisorRemark(responseStore.instance.isWholeResponse, _this.responseContainerProperty.IsWholeResponseRemarkMarkNow);
        };
        /**
         * Method called when whole response remark confirmation no button is clicked
         */
        this.onWholeResponseRemarkConfirmationNoClick = function () {
            _this.setState({
                isWholeResponseRemarkConfirmationPopupVisible: false
            });
        };
        /**
         * On discard response popup ok click
         */
        this.onDiscardStandardardisationResponsePopupOkClick = function () {
            var responseData = undefined;
            if (responseStore.instance.selectedDisplayId) {
                responseData = standardisationSetupStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            }
            var provRigIds = new Array();
            provRigIds.push(responseData.esMarkGroupId);
            var candScriptids = new Array();
            candScriptids.push(responseData.candidateScriptId);
            standardisationsetupActionCreator.discardStandardisationResponse(provRigIds, false, standardisationSetupStore.instance.examinerRoleId, standardisationSetupStore.instance.markSchemeGroupId, candScriptids, false, responseStore.instance.selectedDisplayId);
            _this.setState({ isDiscardStandardisationPopupVisible: false });
        };
        /**
         * On discard response popup cancel click
         */
        this.onDiscardStandardisationResponsePopupNoClicked = function () {
            _this.setState({ isDiscardStandardisationPopupVisible: false });
        };
        /**
         * This Method will call when the remark later button is clicked
         */
        this.onPromoteToSeedButtonClicked = function () {
            var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
            if (responseNavigationFailureReasons.indexOf(enums.ResponseNavigateFailureReason.UnSentMessage) !== -1) {
                // we have to display discard message warning if failure condition is unsendmessage only.
                // if multiple failure reasons are there then we will handle on that messages
                messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.ResponseCompose, enums.SaveAndNavigate.toPromoteToSeed, enums.SaveAndNavigate.toPromoteToSeed);
            }
            else {
                if (markingStore.instance.currentResponseMarkingProgress === 100) {
                    _this.responseContainerHelper.showPromoteToSeedConfirmationPopup();
                }
                else {
                    // if current responses marking progress is not 100% then display the promote to seed declined message.
                    _this.handlePromoteToSeedErrors(enums.PromoteToSeedErrorCode.NotFullyMarked);
                }
            }
        };
        /**
         * show Confirmation Dialog for promote to reuse button.
         */
        this.onPromoteToReuseButtonClicked = function () {
            // handling offline scenarios
            if (!applicationActionCreator.checkActionInterrupted()) {
                return;
            }
            if (markerOperationModeFactory.operationMode.isCRMConfirmationPopupVisible) {
                _this.responseContainerProperty.crmFeedConfirmationPopupVisible = true;
            }
            else {
                _this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = true;
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This will promote selected response to reuse bucket.
         */
        this.onYesClickPromoteToReuseBucketConfirmationPopup = function () {
            var promoteToReuseBucketArguments = {
                markGroupId: responseStore.instance.selectedMarkGroupId
            };
            responseActionCreator.promoteToReuseBucket(promoteToReuseBucketArguments);
        };
        /**
         * This will close the promote to reusebucket declined message.
         */
        this.onNoClickPromoteToReuseBucketConfirmationPopup = function () {
            _this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Re-rendering the to hide the pop up when promote to reusebutton button is clicked .
         */
        this.onPromoteToReuseCompleted = function () {
            _this.responseContainerProperty.ispromoteToReuseConfirmationDialogVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /*
        * Confirm review of managed slao popup OK button click
        */
        this.onConfirmCRMFeedPopupOkButtonClick = function () {
            _this.responseContainerProperty.crmFeedConfirmationPopupVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /*
        * Confirm standardisation additionpage popup OK button click
        */
        this.onStandardisationAdditionalPagePopupOkButtonClick = function () {
            _this.isStdsetupAdditionalpageSeen = true;
            _this.setState({
                isStandardisationAdditionalPagePopUpVisible: false
            });
        };
        /*
         * Confirm Withdrwn response popup ok button Click
         */
        this.onConfirmationWithdrwnResponsePopupClick = function () {
            _this.responseContainerProperty.creatExceptionReturnWithdrwnResponseErrorPopupVisible = false;
            // if response is withrawn then navigate to worklist.
            navigationHelper.loadWorklist();
        };
        /*
         * Ok click action, of script unavailable popup.
         */
        this.okClickOnUnavailablePopUp = function () {
            _this.setState({
                isScriptUnavailablePopUpVisible: false
            });
            navigationHelper.loadStandardisationSetup();
            // promise to get standardisation target details
            var getStandardisationTargetDetails = standardisationActionCreator.getStandardisationTargetDetails(standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            getStandardisationTargetDetails.then(function (item) {
                // load select Responses details on coming from response
                standardisationActionCreator.standardisationSetupTabSelection(enums.StandardisationSetup.SelectResponse, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId);
            });
        };
        /*
        * Confirm Withdrwn response popup ok button Click
        */
        this.onConfirmationWithdrwnScriptInStmPopupClick = function () {
            _this.responseContainerProperty.withdrawScriptInStmErrorPopUpVisible = false;
            // if response is withrawn then navigate to worklist.
            navigationHelper.loadStandardisationSetup();
            var centreId = standardisationSetupStore.instance.selectedCentreId;
            if (centreId) {
                var centrePartId = standardisationSetupStore.instance.standardisationSetupSelectedCentrePartId(centreId);
                standardisationActionCreator.standardisationSetupTabSelection(enums.StandardisationSetup.SelectResponse, standardisationSetupStore.instance.markSchemeGroupId, standardisationSetupStore.instance.examinerRoleId, true);
                standardisationActionCreator.getScriptsOfSelectedCentre(standardisationSetupStore.instance.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, centrePartId, false, standardisationSetupStore.instance.examinerRoleId, centreId);
            }
        };
        /**
         * This will close the promote to seed error message.
         */
        this.onOkClickPromoteToSeedErrorPopup = function () {
            _this.responseContainerProperty.isPromoteToSeedErrorDialogVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This will close the promote to seed declined message.
         */
        this.onOkClickPromoteToSeedConfirmationPopup = function () {
            if (!_this.state.isPromoteToSeedButtonClicked) {
                var promoteToSeedArguments = {
                    markGroupId: responseStore.instance.selectedMarkGroupId,
                    examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    authorisedExaminerRoleId: operationModeHelper.authorisedExaminerRoleId,
                    markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    responseMode: worklistStore.instance.getResponseMode,
                    ignoreRemarks: true,
                    isSTMSeed: false,
                    examinerId: 0
                };
                _this.setState({ isPromoteToSeedButtonClicked: true });
                responseActionCreator.promoteToSeed(promoteToSeedArguments);
            }
        };
        /**
         * This will close the promote to seed declined message.
         */
        this.onNoClickPromoteToSeedConfirmationPopup = function () {
            _this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         *  On promote response to seed return
         */
        this.onPromoteToSeed = function (errorCode) {
            _this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;
            // Log response promoted as seed
            new responseScreenAuditHelper().logResponsePromotToSeedAction(loggerConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION, loggerConstants.RESPONSESCREEN_TYPE_PROMOTE_TO_SEED, responseStore.instance.selectedDisplayId);
            if (errorCode === enums.PromoteToSeedErrorCode.None) {
                // Clear My Team List Cache to reflect the Target progress Count
                _this.responseContainerProperty.storageAdapterHelper.clearTeamDataCache(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
                // we want to display the promoted seed response in closed worklist if ExaminerCenterExclusivity CC is on
                if (markerOperationModeFactory.operationMode.isRemoveResponseFromWorklistDetails) {
                    var selectedDisplayId = responseStore.instance.selectedDisplayId.toString();
                    // move to next response on promote to seed successful callback
                    if (worklistStore.instance.isNextResponseAvailable(selectedDisplayId)) {
                        var responseMode = worklistStore.instance.getResponseMode;
                        var currentWorklistType = worklistStore.instance.currentWorklistType;
                        // Remove the current worklist item from collection to update Response navigation count on header.
                        worklistActionCreator.removeResponseFromWorklist(currentWorklistType, responseMode, selectedDisplayId);
                        navigationHelper.responseNavigation(enums.ResponseNavigation.next);
                    }
                    else {
                        // if next response is not available then load worklist.
                        navigationHelper.loadWorklist();
                    }
                }
                else {
                    _this.setState({
                        renderedOn: Date.now(),
                        isPromoteToSeedButtonClicked: false
                    });
                }
            }
            else {
                // hide the popup
                _this.setState({
                    renderedOn: Date.now(),
                    isPromoteToSeedButtonClicked: false
                });
                _this.handlePromoteToSeedErrors(errorCode);
            }
        };
        /**
         * handle promote to seed errors.
         * @param {enums.PromoteToSeedErrorCode} errorCode
         */
        this.handlePromoteToSeedErrors = function (errorCode) {
            _this.responseContainerHelper.setPromoteToSeedErrorVariables(errorCode);
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Method to show pop up the create success popup
         * @param {number} markGroupId
         * @param {boolean} isMarkNowButtonClicked
         */
        this.showRemarkCreationSuccessPopup = function (markGroupIds, isMarkNowButtonClicked) {
            if (!isMarkNowButtonClicked) {
                _this.responseContainerProperty.isRemarkCreatedPopUpVisible = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            else {
                _this.openSuperVisorRemarkResponseFromSubordinatesWorklist(markGroupIds);
            }
        };
        /**
         * Method clicked when ok popup success
         */
        this.onOkClickRemarkCreationSuccessPopup = function () {
            _this.responseContainerProperty.isRemarkCreatedPopUpVisible = false;
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * open Super Visor Remark Response From Subordinate's Worklist
         * @markGroupId - Mark Group Id
         */
        this.openSuperVisorRemarkResponseFromSubordinatesWorklist = function (markGroupIds) {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            var questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            var authorisedExaminerRoleId = operationModeHelper.authorisedExaminerRoleId;
            var markingMethodId = qigStore.instance.selectedQIGForMarkerOperation.markingMethod;
            var isElectronicStandardisationTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
            var loggedInExaminerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            var selectedExaminerId = operationModeHelper.subExaminerId;
            // Supervisor Remark is going to open, CHange the mode
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);
            // Get the QIG selector data
            qigSelectorActionCreator.getQIGSelectorData(markSchemeGroupId, true, true);
            // Construct the entity for Opening the response
            var searchedResponseData = {
                approvalStatusId: enums.ExaminerApproval.Approved,
                displayId: null,
                markSchemeGroupId: markSchemeGroupId,
                examinerRoleId: authorisedExaminerRoleId,
                markingModeId: enums.MarkingMode.Remarking,
                responseMode: enums.ResponseMode.open,
                markGroupId: markGroupIds[0],
                esMarkGroupId: null,
                questionPaperId: questionPaperId,
                markingMethodId: markingMethodId,
                remarkRequestType: enums.RemarkRequestType.SupervisorRemark,
                messageId: 0,
                hasQualityFeedbackOutstanding: false,
                isDirectedRemark: true,
                isAtypical: false,
                loggedInExaminerId: loginSession.EXAMINER_ID,
                loggedInExaminerRoleId: loggedInExaminerRoleId,
                examinerId: selectedExaminerId,
                isElectronicStandardisationTeamMember: isElectronicStandardisationTeamMember,
                navigateToHelpExaminer: false,
                triggerPoint: enums.TriggerPoint.SupervisorRemark,
                isTeamManagement: false,
                wholeresponseMarkGroupIds: Immutable.fromJS(markGroupIds)
            };
            // Set the Response details in store
            responseActionCreator.setResponseDetails(searchedResponseData);
            // Load the data for QIG/worklist/Script etc
            responseSearchHelper.initiateSerachResponse(searchedResponseData);
        };
        /**
         * Show a popup informing the user that the response review has failed
         */
        this.setResponseAsReviewedFailureReceived = function (failureCode, warningMessageAction) {
            if (failureCode !== enums.FailureCode.None &&
                warningMessageAction === enums.WarningMessageAction.SetAsReviewed) {
                _this.setState({ isBusy: false });
            }
        };
        /**
         * callback function for on all slaos managed
         */
        this.onAllSLAOManaged = function () {
            var treeItem = _this.responseContainerProperty.treeViewHelper.treeViewItem();
            if (!_this.responseContainerProperty.isPreviousMarksAndAnnotationCopying) {
                _this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered = true;
                _this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = false;
                _this.setState({ isAllSLAOManagedConfirmationPopupVisible: true });
            }
            _this.responseContainerProperty.markHelper.updateAnnotationToolTips(_this.responseContainerProperty.treeViewHelper.toolTipInfo);
        };
        /**
         * callback function for on all slaos managed
         */
        this.onAllUnknownContentManaged = function () {
            var treeItem = _this.responseContainerProperty.treeViewHelper.treeViewItem();
            if (!_this.responseContainerProperty.isPreviousMarksAndAnnotationCopying) {
                _this.responseContainerProperty.isUnknownContentManagedConfirmationPopupRendered = true;
                _this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = false;
                _this.setState({ isAllUnknownContentManagedConfirmationPopupVisible: true });
            }
            _this.responseContainerProperty.markHelper.updateAnnotationToolTips(_this.responseContainerProperty.treeViewHelper.toolTipInfo);
        };
        /**
         * Callback function for on link button click.
         */
        this.onLinkToPageButtonClick = function (event, pageNumber) {
            var screenWidth = screen.width;
            var element = htmlUtilities.getElementFromPosition(event.clientX, event.clientY);
            var popupContent = document.getElementById('popupcontent');
            if (popupContent) {
                // reset the scroll position when popup is opened
                popupContent.style.overflow = 'hidden';
                popupContent.scrollTop = 0;
                popupContent.style.overflow = 'auto';
            }
            _this.responseContainerProperty.currentPageNumber = pageNumber;
            // get all the linked annotations and set to the global collection.
            var linkedAnnotations = pageLinkHelper.getAllLinkedItemsAgainstPage(_this.responseContainerProperty.currentPageNumber);
            if (linkedAnnotations) {
                linkedAnnotations.map(function (annotation) {
                    var linkAnnotation = JSON.parse(JSON.stringify(annotation));
                    _this.responseContainerProperty.linkAnnotations = _this.responseContainerProperty.linkAnnotations.set(linkAnnotation.markSchemeId, linkAnnotation);
                });
            }
            htmlUtilities.addClassToBody('popup-open');
            _this.setState({
                isLinkToPagePopupShowing: true,
                linkToPageButtonLeft: element.getBoundingClientRect().left
            });
        };
        /* cancel button click for link to question popup */
        this.onLinkToPageCancelClick = function () {
            // clear the list when cancel button is clicked
            _this.responseContainerProperty.linkAnnotations = Immutable.Map();
            _this.responseContainerProperty.linkAnnotationsToRemove = [];
            htmlUtilities.removeClassFromBody(' popup-open');
            _this.setState({
                isLinkToPagePopupShowing: false
            });
        };
        /* ok button click for link to question popup */
        this.onLinkToPageOkClick = function () {
            // check if we need to show the popup before any unlink operation
            var doShowPopup = false;
            var numberOfLinks = pageLinkHelper.numberOfLinks(_this.responseContainerProperty.currentPageNumber);
            _this.responseContainerProperty.itemsWhichCantUnlink = [];
            doShowPopup = _this.responseContainerHelper.doShowLinkToPageOkClickPopup(doShowPopup);
            if (doShowPopup) {
                _this.setState({
                    isLinkToPageErrorShowing: true
                });
                return;
            }
            _this.responseContainerHelper.updateMarkingOperationOfAnnotation();
            _this.responseContainerProperty.linkAnnotations.map(function (annotation, markSchemeId) {
                if (annotation.isDirty &&
                    annotation.markingOperation !== enums.MarkingOperation.deleted &&
                    !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)) {
                    numberOfLinks++;
                }
                else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                    numberOfLinks--;
                }
            });
            /* if trying to unmanaging a SLAO by removing the last, then show a confirmation popup */
            if (_this.canShowConfirmReviewOfSLAOPopup(numberOfLinks)) {
                _this.setState({
                    isConfirmReviewOfSLAOPopupShowing: true
                });
                return;
            }
            /* if trying to unmanaging a unknown content in Ebookmarking by removing the last link, then show a confirmation popup */
            if (_this.canShowConfirmReviewOfUnknownContentPopup(numberOfLinks)
                && responseHelper.isUnkNownContentPage(_this.responseContainerProperty.currentPageNumber)) {
                _this.setState({
                    isConfirmReviewOfUnknownContentPopupShowing: true
                });
                return;
            }
            // add or remove the annotation based on the marking operation
            _this.addOrRemoveLinkAnnotation();
            // clear the lists after all the operations
            _this.responseContainerProperty.linkAnnotations = Immutable.Map();
            _this.responseContainerProperty.linkAnnotationsToRemove = [];
            htmlUtilities.removeClassFromBody(' popup-open');
            _this.setState({
                isLinkToPagePopupShowing: false
            });
        };
        /**
         * add link annotation to the collection
         * @param markSchemeId
         * @param annotation
         */
        this.addLinkAnnotation = function (node, childNodes, isChildrenSkipped, annotation) {
            _this.responseContainerHelper.addLinkAnnotation(node, childNodes, isChildrenSkipped, annotation);
        };
        /* remove link annotation from the collection */
        this.removeLinkAnnotation = function (node, childNodes, isChildrenSkipped) {
            if (isChildrenSkipped && childNodes) {
                // find the children of the node and add those to the remove link annotation collection
                childNodes.map(function (item) {
                    _this.addItemToLinkAnnotationLocalCollection(item);
                });
            }
            _this.addItemToLinkAnnotationLocalCollection(node);
        };
        /**
         * on click of link to page error dialog
         */
        this.onLinkToPageErrorDialogOkClick = function () {
            _this.setState({
                isLinkToPageErrorShowing: false
            });
        };
        /**
         * Callback function for message menu action click
         * @param messageMenuActionType
         */
        this.onMessageMenuActionClick = function (messageMenuActionType) {
            if (!messageStore.instance.isMessagePanelActive ||
                _this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails) {
                _this.setvariablesforReplyForward(messageMenuActionType);
            }
            else {
                var responseNavigationFailureReasons = markingHelper.canNavigateAwayFromCurrentResponse();
                if (messageMenuActionType === enums.MessageAction.Reply) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toReplyMessage);
                }
                else if (messageMenuActionType === enums.MessageAction.Forward) {
                    popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toForwardMessage);
                }
            }
            if (messageMenuActionType === enums.MessageAction.Delete) {
                messagingActionCreator.messageAction(enums.MessageViewAction.Delete, enums.MessageType.ResponseDelete);
            }
        };
        /**
         * This method will set variables for Reply and Forward
         */
        this.setvariablesforReplyForward = function (messageMenuActionType) {
            if (messageMenuActionType !== enums.MessageAction.Delete) {
                _this.responseContainerHelper.setVariablesForReplyForward(messageMenuActionType);
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /**
         * Invokes the busy indicator of response review operation
         */
        this.invokeReviewBusyIndicator = function () {
            _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingModules, false);
            _this.setState({ isBusy: applicationStore.instance.isOnline });
        };
        /**
         * shows the confirmation popup on logout based on the ask on logout value.
         * @param pageNumber
         */
        this.showUnManagedSLAOFlagAsSeenPopUP = function (pageNumber) {
            _this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: true });
            _this.responseContainerProperty.slaoFlagAsSeenClickedPageNumber = pageNumber;
        };
        /**
         * on clicking ok button of unmanaged slao popup
         */
        this.unManagedSLAOFlagAsSeenPopUpOKButtonClick = function () {
            _this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: false });
            responseActionCreator.doStampFlagAsSeenAnnotation(_this.responseContainerProperty.slaoFlagAsSeenClickedPageNumber);
        };
        /**
         * on clicking cancel button of unmanaged slao popup
         */
        this.unManagedSLAOFlagAsSeenPopUpCancelButtonClick = function () {
            _this.setState({ showUnmanagedSLAOFlagAsSeenPopUp: false });
        };
        /**
         * shows the flag as seen popup in unknown content management
         * @param pageNumber
         */
        this.showUnKnownContentFlagAsSeenPopUP = function (pageNumber) {
            _this.setState({ showUnKnownContentFlagAsSeenPopUp: true });
            _this.responseContainerProperty.unKnownContentFlagAsSeenClickedPageNumber = pageNumber;
        };
        /**
         * on clicking ok button of unknown content flag as seen popup
         */
        this.unKnownContentFlagAsSeenPopUpOKButtonClick = function () {
            _this.setState({ showUnKnownContentFlagAsSeenPopUp: false });
            responseActionCreator.doStampFlagAsSeenAnnotation(_this.responseContainerProperty.unKnownContentFlagAsSeenClickedPageNumber);
        };
        /**
         * on clicking cancel button of unknown content flag as seen popup
         */
        this.unKnownContentFlagAsSeenPopUpCancelButtonClick = function () {
            _this.setState({ showUnKnownContentFlagAsSeenPopUp: false });
        };
        /**
         *
         */
        this.showRejectRigConfirmationPopUp = function () {
            markingActionCreator.removeMarkEntrySelection();
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
            _this.setState({ isRejectRigPopUpVisible: true });
        };
        /**
         * reject response ok button click
         */
        this.onRejectRigOkButtonClick = function () {
            _this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, true);
            _this.responseClosed();
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
            markingActionCreator.setMarkEntrySelected(false);
            _this.setState({
                isRejectRigPopUpVisible: false,
                isBusy: true
            });
            responseActionCreator.doRejectResponse(responseStore.instance.selectedDisplayId);
            // Log response rejected action.
            new responseScreenAuditHelper().logResponseRejectAction(loggerConstants.RESPONSESCREEN_REASON_RESPONSE_SCREEN_ACTION, loggerConstants.RESPONSESCREEN_TYPE_REJECT_RIG, responseStore.instance.selectedDisplayId);
        };
        /**
         * Reject response cancel button click
         */
        this.onRejectRigCancelButtonClick = function () {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.RejectRigConfirmationPopUp);
            markingActionCreator.setMarkEntrySelected(false);
            _this.setState({ isRejectRigPopUpVisible: false });
        };
        /**
         *
         */
        this.handleNavigationOnRejectResponse = function (isNextResponseAvailable) {
            if (isNextResponseAvailable) {
                // remove rejected response from worklist collection.
                responseActionCreator.updateResponseCollection(responseStore.instance.selectedMarkGroupId, worklistStore.instance.currentWorklistType);
                navigationHelper.responseNavigation(enums.ResponseNavigation.next);
            }
            else {
                // if next response is not available then load worklist.
                navigationHelper.loadWorklist();
            }
        };
        /**
         * Display the popup
         */
        this.onPromoteToSeedCheckRemark = function () {
            _this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = true;
            if (responseStore.instance.promoteseedremarkrequestreturn.promoteToSeedError ===
                enums.PromoteToSeedErrorCode.ResponseHasRemarks) {
                _this.responseContainerProperty.promoteToSeedDialogType =
                    enums.PopupDialogType.PromoteToSeedRemarkConfirmation;
            }
            else if (responseStore.instance.promoteseedremarkrequestreturn.promoteToSeedError ===
                enums.PromoteToSeedErrorCode.None) {
                _this.responseContainerProperty.promoteToSeedDialogType =
                    enums.PopupDialogType.PromoteToSeedConfirmation;
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         *  This will call on update exception status received
         */
        this.onUpdateExceptionStatusReceived = function (doNavigateToTeamManagement, updateExceptionStatusErrorCode) {
            if (doNavigateToTeamManagement === void 0) { doNavigateToTeamManagement = false; }
            // if the reponse is deallocated ,then show a poup that indicating response has withdrwan.
            if (updateExceptionStatusErrorCode === enums.ReturnErrorCode.DeallocatedResponse ||
                updateExceptionStatusErrorCode === enums.ReturnErrorCode.WithdrawnResponse) {
                _this.responseContainerProperty.withdrwnResponseErrorPopupVisible = true;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
            else {
                if (doNavigateToTeamManagement) {
                    teamManagementActionCreator.getTeamManagementOverviewCounts(teamManagementStore.instance.selectedExaminerRoleId, teamManagementStore.instance.selectedMarkSchemeGroupId);
                    teamManagementActionCreator.getUnactionedExceptions(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                    navigationHelper.loadTeamManagement();
                }
                else {
                    exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
                    _this.onCloseExceptionPanel(true);
                }
            }
        };
        /*
         * Confirm review of slao popup OK button click
         */
        this.onConfirmReviewOfSLAOPopupOkButtonClick = function () {
            _this.responseContainerHelper.onConfirmReviewOfSLAOPopupOkButtonClick();
            _this.setState({
                isConfirmReviewOfSLAOPopupShowing: false,
                isLinkToPagePopupShowing: false
            });
        };
        /*
         * Confirm review of unknown content popup OK button click
         */
        this.onConfirmReviewOfUnknownContentPopupOkButtonClick = function () {
            _this.responseContainerHelper.onConfirmReviewOfUnknownContentPopupOkButtonClick();
            _this.setState({
                isConfirmReviewOfUnknownContentPopupShowing: false,
                isLinkToPagePopupShowing: false
            });
        };
        /*
        * Confirm review of managed slao popup OK button click
        */
        this.onConfirmReviewOfMangedSLAOPopupOkButtonClick = function () {
            _this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = false;
            _this.setState({
                isConfirmReviewOfMangedSLAOPopupShowing: false
            });
        };
        /*
         * Confirm review of slao popup Cancel button click
         */
        this.onConfirmReviewOfSLAOPopupCancelButtonClick = function () {
            _this.setState({
                isConfirmReviewOfSLAOPopupShowing: false
            });
        };
        /*
         * Confirm review of slao popup Cancel button click
         */
        this.onConfirmReviewOfUnknownContentPopupCancelButtonClick = function () {
            _this.setState({
                isConfirmReviewOfUnknownContentPopupShowing: false
            });
        };
        /**
         * Checking whether Not all page annotated popup should be visible.
         */
        this.showCombinedPopupMessage = function (navigateTo) {
            _this.responseContainerHelper.showCombinedPopupMessage(navigateTo, _this.showCombinedMessagePopup);
        };
        /**
         * set state to hide combined message popup
         */
        this.showCombinedMessagePopup = function () {
            _this.setState({ isCombinedWarningMessagePopupVisible: true });
        };
        /**
         * set state to show combined message popup
         */
        this.hideCombinedMessagePopup = function () {
            _this.setState({ isCombinedWarningMessagePopupVisible: false });
        };
        /**
         * reset Warning flags on reject rig.
         */
        this.resetWarningFlagsOnResponseReject = function () {
            _this.responseContainerProperty.isExceptionPanelEdited = false;
        };
        /**
         * on click of combined warning message popup primary button
         */
        this.onCombinedWarningPopupPrimaryButtonClick = function () {
            _this.responseContainerHelper.onCombinedWarningPopupPrimaryButtonClick(_this.onLeaveResponseClick, _this.hideCombinedMessagePopup);
        };
        /**
         * on click of combined warning message popup primary button
         */
        this.onCombinedWarningPopupSecondaryButtonClick = function () {
            _this.responseContainerHelper.onCombinedWarningPopupSecondaryButtonClick(_this.hideCombinedMessagePopup);
        };
        /**
         * Show a popup informing the user that the response review has failed
         */
        this.setResponseAsReviewed = function (reviewResponseDetails) {
            _this.setState({ isBusy: false });
            switch (reviewResponseDetails.reviewResponseResult) {
                case enums.SetAsReviewResult.AlreadyReviewedBySomeone:
                    _this.responseContainerProperty.reviewPopupTitle = localeStore.instance.TranslateText('team-management.response.already-reviewed-dialog.header');
                    _this.responseContainerProperty.reviewPopupContent = localeStore.instance.TranslateText('team-management.response.already-reviewed-dialog.body');
                    _this.responseContainerProperty.reviewPopupDialogType =
                        enums.PopupDialogType.ResponseAlreadyReviewed;
                    _this.setState({ isResponseReviewFailedPopupVisible: true });
                    break;
            }
        };
        /**
         * set variables on previous marks and annotations are copied
         */
        this.onPreviousMarksAnnotationCopied = function () {
            _this.responseContainerProperty.isPreviousMarksAndAnnotationCopied = true;
            _this.responseContainerProperty.isPreviousMarksAndAnnotationCopying = false;
            _this.setState({
                isBusy: false,
                isUnManagedSLAOPopupVisible: _this.isUnManagedSLAOPopUpVisible(_this.state.selectedViewMode),
                isUnManagedImageZonePopUpVisible: _this.isUnManagedImageZonePopUpVisible(_this.state.selectedViewMode),
                isConfirmReviewOfMangedSLAOPopupShowing: _this.responseContainerHelper.isPreviousMarksAndAnnotationCopiedInSLAOMode &&
                    !responseHelper.hasUnManagedSLAOInMarkingMode,
                isUnManagedImageZoneInRemarkPopUpVisible: _this.canChangeToFRVonRemarkUnknownContent(),
                selectedViewMode: _this.canChangeToFRVonRemarkUnknownContent()
                    ? enums.ResponseViewMode.fullResponseView
                    : _this.state.selectedViewMode
            });
            // moving to full response view.
            if (_this.canChangeToFRVonRemarkUnknownContent()) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            }
        };
        /**
         * This method this called on message panel close.
         */
        this.closeResponseMessageDetails = function () {
            // Defect fix: #48317 we will call onMessagePanelClose() if messageType is ResponseDetails other wise onMessagePanelClose()
            // will call as a callback function from Subject
            if (_this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails) {
                // Show annotation toolbar on closing the message panel.
                _this.responseContainerProperty.isToolBarPanelVisible = true;
                _this.onMessagePanelClose();
            }
        };
        /**
         * resets all ui dropdown panel values
         */
        this.resetUIDropdownStatus = function () {
            messagingActionCreator.isMessageSidePanelOpen(false);
            exceptionActionCreator.isExceptionSidePanelOpen(false);
            zoomPanelActionCreator.zoomOptionClicked(false);
            userInfoActionCreator.userInfoClicked(false);
            markSchemeStructureActionCreator.markSchemeHeaderDropDown(false);
        };
        /**
         * Self destruct loading indicator
         */
        this.autoKillLoadingIndicator = function () {
            _this.responseContainerProperty.isLoadingResponseScreen = false;
            _this.setState({ isBusy: false });
        };
        /**
         * on enhanced off page comment delete button Clicked
         * @protected
         */
        this.onEnhancedOffPageActionButtonsClicked = function (buttonAction, clientToken, isCommentVisible, markSchemeToNavigate) {
            _this.responseContainerHelper.onEnhancedOffPageActionButtonsClicked(buttonAction, _this.enhancedOffPageCommentPopUpReRender, clientToken, isCommentVisible, markSchemeToNavigate);
        };
        /**
         * to ren render the enhancedOffPageCommentPopUp
         */
        this.enhancedOffPageCommentPopUpReRender = function () {
            _this.setState({ isEnhancedOffPageCommentPopUpVisible: true });
        };
        /**
         * On Confirmation No Button clicked for enhanced off page comment action
         */
        this.onCommentConfirmationNoButtonClicked = function () {
            if (_this.responseContainerProperty.enhancedOffPageCommentDetails.isDetailViewEnabled) {
                htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
            }
            _this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = false;
            _this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
            _this.setState({ isEnhancedOffPageCommentPopUpVisible: false });
        };
        /**
         * On Confirmation Yes Button clicked for enhanced off page comment action
         */
        this.onCommentConfirmationYesButtonClicked = function () {
            // If button action is visibility change we need to fire the visibility action
            if (_this.responseContainerProperty.enhancedOffPageButtonAction ===
                enums.EnhancedOffPageCommentAction.Visibility) {
                _this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
                enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(_this.responseContainerProperty.isEnhancedOffPageCommentVisible);
            }
            else if (_this.responseContainerProperty.enhancedOffPageButtonAction ===
                enums.EnhancedOffPageCommentAction.MarkSchemeNavigation) {
                _this.responseContainerProperty.enhancedOffPageButtonAction = undefined;
                enhancedOffPageCommentActionCreator.updateEnhancedOffPageCommentsVisibility(_this.responseContainerProperty.isEnhancedOffPageCommentVisible, _this.responseContainerProperty.enhancedOffPageCommentMarkSchemeToNavigate);
            }
            else if (_this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow) {
                _this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = false;
                enhancedOffPageCommentActionCreator.switchEnhancedOffPageComments();
            }
            enhancedOffPageCommentActionCreator.saveEnhancedOffpageComments(_this.responseContainerProperty.enhancedOffPageClientTokensToBeUpdated, _this.responseContainerProperty.enhancedOffPageCommentMarkingOperation);
            _this.setState({ isEnhancedOffPageCommentPopUpVisible: false });
        };
        /**
         * This call back method will update the enhanced off page comment details
         * @protected
         * @memberof ImageContainer
         */
        this.updateEnhancedOffPageCommentDetails = function (enhancedOffPageCommentDetailView) {
            _this.responseContainerProperty.enhancedOffPageCommentDetails = enhancedOffPageCommentDetailView;
        };
        /**
         * This method will call on Enhanced off-page comments visibility is changed.
         * @protected
         * @memberof ImageContainer
         */
        this.handleEnhancedOffPageCommentsVisibility = function (isVisible) {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Set favorite toolbar column count status.
         */
        this.setHasMultipleToolbarColumns = function (hasMultipleColumns) {
            _this.setState({ hasMultipleToolbarColumns: hasMultipleColumns });
        };
        /**
         * set hasElementsToRenderInFRV
         * @param hasElementsToRender
         */
        this.hasElementsToRenderInFRViewMode = function (hasElement) {
            _this.setState({ hasElementsToRenderInFRV: hasElement });
        };
        /**
         * Clear the enhanced off page comment data response is changed
         */
        this.clearCommentDetailsOnResponseChanged = function () {
            _this.responseContainerProperty.enhancedOffPageCommentDetails = undefined;
        };
        /**
         * reRender for appending current marks classname for enhanced offpage comments.
         */
        this.renderedOnEnhancedOffpageComments = function () {
            _this.setState({ renderedOnEnhancedOffpageComments: Date.now() });
        };
        /**
         * This will show discard popup while switching between comments from MarkSchemePanel header dropdown
         * @protected
         * @memberof MarkSchemePanel
         */
        this.showEnhancedOffPageCommentDiscardPopup = function () {
            _this.responseContainerProperty.confirmationDialogueContent = localeStore.instance.TranslateText('marking.response.discard-enhanced-off-page-comment-other-set-confirmation-dialog.body');
            _this.responseContainerProperty.confirmationDialogueHeader = localeStore.instance.TranslateText('marking.response.discard-enhanced-off-page-comment-other-set-confirmation-dialog.header');
            _this.responseContainerProperty.switchEnhancedOffPageCommentsDiscardPopupShow = true;
            _this.setState({ isEnhancedOffPageCommentPopUpVisible: true });
        };
        /**
         * Actions to be done when online status changed
         */
        this.onOnlineStatusChanged = function () {
            var isBusy = _this.state.isBusy;
            if (!applicationStore.instance.isOnline) {
                // close promote to seed confirmation popup if it is showing.
                if (_this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible) {
                    _this.responseContainerProperty.isPromoteToSeedConfirmationDialogVisible = false;
                }
                // if online status updated while clicking on create new message, then show offline popup and isCreateNewMessageSelected
                if (_this.responseContainerProperty.isCreateNewMessageSelected) {
                    _this.responseContainerProperty.isCreateNewMessageSelected = false;
                    applicationActionCreator.checkActionInterrupted();
                }
                if (_this.state.isBusy) {
                    /*In offline scenario the loading indicator comes with the offline popup on set as reviewed button click
                    Hiding the loading indicator to handle this. */
                    isBusy = false;
                }
                /*In offline scenario when response is opened by clicking on the linked message icon annotation panel will be
                blank and message will not be loaded, so loading the close event of message panel to show annotation panel */
                if (_this.responseContainerProperty.messageType === enums.MessageType.ResponseDetails &&
                    _this.responseContainerProperty.selectedMsgDetails === undefined &&
                    !_this.responseContainerProperty.isMessagePanelVisible) {
                    _this.onMessagePanelClose();
                }
                _this.setState({
                    isBusy: isBusy,
                    renderedOn: Date.now()
                });
            }
            else {
                // Updating the latest Message list when comes to online Defect #58997
                if (messageStore.instance.messages === null ||
                    messageStore.instance.messages === undefined) {
                    _this.loadMessageFortheResponse();
                }
                // Updating the latest exception list when comes to online Defect #58997
                if ((exceptionsStore.instance.getExceptionData === null ||
                    exceptionStore.instance.getExceptionData === undefined) &&
                    !markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
                    exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
                }
                if (_this.responseContainerProperty.isCreateNewMessageSelected) {
                    // if online status updated while clicking on create new message and the system is in online mode,
                    // then proceed to create new message and reset isCreateNewMessageSelected
                    _this.createNewMessage();
                    _this.responseContainerProperty.isCreateNewMessageSelected = false;
                }
                if (!_this.state.imagesLoaded) {
                    // in offline scenario if the images are not loaded and modules are loaded, then never load the image container.
                    // So load images if it is not loaded already
                    _this.loadScriptImages();
                }
            }
        };
        /**
         * Set background save time interval for responses
         */
        this.setBackgroundSaveTimeInterval = function () {
            //set background call for saving marks and annotations to queue.
            if (worklistStore.instance.getResponseMode !== enums.ResponseMode.closed ||
                !markerOperationModeFactory.operationMode.isTeamManagementMode) {
                // if the value mentioned in config file then consider that value
                // else take the default value
                if (config.marksandannotationsconfig.AUTOSAVE_MARKS_AND_ANNOTATIONS_IN_RESPONSE_INTERVAL) {
                    _this.responseContainerProperty.autoSaveTimerInterval =
                        config.marksandannotationsconfig.AUTOSAVE_MARKS_AND_ANNOTATIONS_IN_RESPONSE_INTERVAL;
                }
                _this.autoSaveTimeInterval = timerHelper.setInterval(_this.responseContainerProperty.autoSaveTimerInterval, function () {
                    if (markinghelper.isAutoSaveMarksAndAnnotation()) {
                        marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue(true);
                        _this.responseContainerProperty.autoSaveTriggered = true;
                    }
                }, _this.autoSaveTimeInterval);
            }
        };
        /**
         * Display Warning Popup if Response has an open zoning exception
         * (Zoning Error Missing Content, Zoning Error Other Content) raised
         */
        this.displayZoningExceptionWarningPopup = function () {
            if (markerOperationModeFactory.operationMode.hasZoningExceptionWarningPopup) {
                _this.setState({ isZoningExceptionWarningPopupVisible: true });
            }
            _this.setState({ doShowExceptionWarningPopUp: false });
        };
        /**
         * Close Zoning Exception Warning Popup after clicking OK button
         */
        this.closeZoningExceptionWarningPopup = function () {
            _this.setState({
                isZoningExceptionWarningPopupVisible: false,
                isUnManagedImageZonePopUpVisible: _this.isUnManagedImageZonePopUpVisible(_this.state.selectedViewMode)
            });
        };
        /*
         * Confirm of Withdrwn response popup ok button Click
         */
        this.onWithdrwnResponseErrorPopup = function () {
            _this.responseContainerProperty.withdrwnResponseErrorPopupVisible = false;
            // If the exception is actioned from Exception through temamanagement
            // then load the teammanagement for refresh
            if (teamManagementStore.instance.isRedirectFromException) {
                navigationHelper.loadTeamManagement();
            }
            else if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
                /* Clear cache of current worklist  */
                _this.responseContainerProperty.storageAdapterHelper.clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType), worklistStore.instance.getRemarkRequestType, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, worklistStore.instance.currentWorklistType);
                // if we deallocate a response which is in the directed remark worklist
                // then target summary store will get update accordingly
                // but the worklist type will  be remain same as directed remark even if it has no response in the remark worklist
                // so directly assigning the worklist type to live irrespevtive of the directed remark response count.
                worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, enums.WorklistType.live, enums.ResponseMode.open, enums.RemarkRequestType.Unknown, false, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false);
                // if response is withrawn then navigate to worklist.
                navigationHelper.loadWorklist();
            }
            else {
                // if response is withrawn then navigate to worklist.
                navigationHelper.loadWorklist();
            }
        };
        /*
        * Confirm of session closed response popup ok button Click
        */
        this.onSessionClosedErrorPopup = function () {
            _this.setState({
                sessionClosedErrorPopupVisible: false
            });
            // clear cache qigselector data after session close popup button click.
            _this.responseContainerProperty.storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
            // if response is session closed then navigate to qig selector.
            navigationHelper.loadQigSelector();
        };
        /**
         * Reload image zone collection when navigate from message inbox, overview.
         */
        this.onEbookMarkingZonesLoaded = function () {
            _this.responseContainerProperty.scriptHelper.resetImageZoneCollection();
            _this.loadScriptImages();
        };
        /**
         * Rerenders on marking overlay visiblity change.
         */
        this.doDisableMarkingOverlay = function () {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarkingOverlay);
            toolbarActionCreator.setMarkingOverlayVisiblity(false);
            _this.setState({ isMarkingOverlayVisible: Date.now() });
        };
        /**
         * Marking overlay.
         */
        this.markingOverlay = function () {
            var overlayElement = null;
            if (_this.responseContainerHelper.doShowMarkingOverlay() &&
                _this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView) {
                overlayElement = (React.createElement("div", {id: 'preventMarkingOverlay', className: 'prevent-marking-overlay show', onTouchMove: _this.onTouchMove}, ' '));
                toolbarActionCreator.setMarkingOverlayVisiblity(true);
            }
            return overlayElement;
        };
        /**
         * On viewing Exception in view mode.
         */
        this.onExceptionInViewMode = function () {
            if (stampStore.instance.isFavouriteToolbarEmpty &&
                stampStore.instance.currentStampBannerType === enums.BannerType.CustomizeToolBarBanner) {
                _this.setState({ isMarkingOverlayVisible: Date.now() });
            }
        };
        /**
         * Popup element for handled erros on sending message
         */
        this.showMessageSendErrorPopup = function () {
            _this.setState({ isMessageSendErrorPopupVisible: true });
        };
        /**
         * Close the generic send error message popups.
         */
        this.onMessageSendingErroPopupClose = function () {
            _this.setState({ isMessageSendErrorPopupVisible: false });
            // Navigate to worklist after closing the error popup.
            navigationHelper.loadWorklist();
        };
        /**
         * Popup element for script unavailable popup.
         */
        this.showScriptUnavailablePopUp = function (errorInRigCreation) {
            if (errorInRigCreation) {
                _this.setState({ isScriptUnavailablePopUpVisible: true });
            }
        };
    }
    /**
     * setting  the initail state and other variables
     */
    ResponseContainer.prototype.initialize = function () {
        /** Getting the user option, if saved in the DB */
        if (!isNaN(parseInt(userOptionsHelper.getUserOptionByName(userOptionKeys.FULL_RESPONSE_VIEW_OPTION)))) {
            this.responseContainerProperty.fullResponseOptionValue = parseInt(userOptionsHelper.getUserOptionByName(userOptionKeys.FULL_RESPONSE_VIEW_OPTION));
        }
        // Set the default states
        this.state = {
            modulesLoaded: false,
            imagesLoaded: false,
            isSaveEmailMessageDisplaying: false,
            isBusy: applicationStore.instance.isOnline,
            isConfirmationPopupDisplaying: false,
            ismarkEntryPopupVisible: false,
            isNonRecoverableErrorPopupVisible: false,
            fullResponseViewOption: this.responseContainerProperty.fullResponseOptionValue,
            isResetMarkPopupVisible: false,
            isAllPageNotAnnotatedVisible: false,
            isCompleteButtonDialogVisible: false,
            isMbQConfirmationDialogDispalying: false,
            refreshImageContainer: 0,
            isSaveIndicatorVisible: false,
            isDisplayingMarkChangeReasonNeededError: false,
            isExceptionPanelVisible: false,
            isCommentsSideViewEnabled: userOptionsHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true'
                ? true
                : false,
            renderedOn: Date.now(),
            isLinkToPagePopupShowing: null,
            linkToPageButtonLeft: 0,
            isLinkToPageErrorShowing: false,
            isImagesLoaded: false,
            isUnManagedSLAOPopupVisible: false,
            isUnManagedImageZonePopUpVisible: false,
            showUnmanagedSLAOFlagAsSeenPopUp: false,
            isAllSLAOManagedConfirmationPopupVisible: false,
            isAllUnknownContentManagedConfirmationPopupVisible: false,
            isRejectRigPopUpVisible: false,
            isConfirmReviewOfSLAOPopupShowing: false,
            isCombinedWarningMessagePopupVisible: false,
            isConfirmReviewOfMangedSLAOPopupShowing: false,
            renderedOnECourseWorkFiles: Date.now(),
            scriptLoaded: false,
            isEnhancedOffPageCommentPopUpVisible: false,
            crmFeedConfirmationPopupVisible: false,
            hasMultipleToolbarColumns: false,
            hasElementsToRenderInFRV: false,
            isZoningExceptionWarningPopupVisible: false,
            renderedOnEnhancedOffpageComments: Date.now(),
            doShowExceptionWarningPopUp: true,
            isMarkingOverlayVisible: Date.now(),
            isConfirmReviewOfUnknownContentPopupShowing: false,
            isUnManagedImageZoneInRemarkPopUpVisible: false,
            isWholeResponseRemarkConfirmationPopupVisible: false,
            isPromoteToSeedButtonClicked: false,
            isStandardisationAdditionalPagePopUpVisible: false,
            isScriptUnavailablePopUpVisible: false,
            isDiscardStandardisationPopupVisible: false
        };
        this.popupHelper = new responseContainerPopupHelper(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
        this.onResetMarkYesButtonClick = this.onResetMarkYesButtonClick.bind(this);
        this.onResetMarkNoButtonClick = this.onResetMarkNoButtonClick.bind(this);
        this.responseClosed = this.responseClosed.bind(this);
        // Re-render the mark buttons
        this.responseContainerProperty.markButtonRenderedOn = Date.now();
        this.responseContainerProperty.linkAnnotations = Immutable.Map();
        this.responseContainerProperty.linkAnnotationsToRemove = [];
        this.responseContainerProperty.itemsWhichCantUnlink = [];
        this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked = false;
        // additional object will exist only in structured component
        this.responseContainerProperty.isSLAOManaged =
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured ? false : true;
        // Unknown content exist only in ebookmarking
        this.responseContainerProperty.isUnknownContentManaged = responseHelper.isEbookMarking
            ? false
            : true;
        this.getMessagePanelRightPosition = this.getMessagePanelRightPosition.bind(this);
        this.addTransitionEventListeners = this.addTransitionEventListeners.bind(this);
        this.onCommentConfirmationYesButtonClicked = this.onCommentConfirmationYesButtonClicked.bind(this);
        this.onCommentConfirmationNoButtonClicked = this.onCommentConfirmationNoButtonClicked.bind(this);
        this.onOkClickOfManageSLAOMessage = this.onOkClickOfManageSLAOMessage.bind(this);
        this.onOkClickOfManageUnknownContentMessage = this.onOkClickOfManageUnknownContentMessage.bind(this);
        this.handlePromoteToSeedErrors = this.handlePromoteToSeedErrors.bind(this);
        this.imageLoaded = this.imageLoaded.bind(this);
        this.hasElementsToRenderInFRViewMode = this.hasElementsToRenderInFRViewMode.bind(this);
        this.questionChanged = this.questionChanged.bind(this);
        this.onYesClickAllSLAOsManagedConfirmationPopup = this.onYesClickAllSLAOsManagedConfirmationPopup.bind(this);
        this.onNoClickAllSLAOsManagedConfirmationPopup = this.onNoClickAllSLAOsManagedConfirmationPopup.bind(this);
        this.onCreateNewExceptionClicked = this.onCreateNewExceptionClicked.bind(this);
        this.onLinkToPageOkClick = this.onLinkToPageOkClick.bind(this);
        this.onLinkToPageCancelClick = this.onLinkToPageCancelClick.bind(this);
        this.onLinkToPageButtonClick = this.onLinkToPageButtonClick.bind(this);
        this.addLinkAnnotation = this.addLinkAnnotation.bind(this);
        this.removeLinkAnnotation = this.removeLinkAnnotation.bind(this);
        this.onMarkThisPageCallback = this.onMarkThisPageCallback.bind(this);
        this.onOkClickOfNonRecoverableErrorMessage = this.onOkClickOfNonRecoverableErrorMessage.bind(this);
        this.onOkClickOfEmailSucessMessage = this.onOkClickOfEmailSucessMessage.bind(this);
        this.onOkClickRemarkCreationSuccessPopup = this.onOkClickRemarkCreationSuccessPopup.bind(this);
        this.onYesButtonClick = this.onYesButtonClick.bind(this);
        this.onNoButtonClick = this.onNoButtonClick.bind(this);
        this.onOkClickOfResponseReviewFailedMessage = this.onOkClickOfResponseReviewFailedMessage.bind(this);
        this.onOnlineStatusChanged = this.onOnlineStatusChanged.bind(this);
        this.onYesClickAllUnknownContentManagedConfirmationPopup = this.onYesClickAllUnknownContentManagedConfirmationPopup.bind(this);
        this.onNoClickAllUnknownContentManagedConfirmationPopup = this.onNoClickAllUnknownContentManagedConfirmationPopup.bind(this);
        this.onOkClickOfManageUnknownContentMessageInRemark = this.onOkClickOfManageUnknownContentMessageInRemark.bind(this);
        this.onMessageSendingErroPopupClose = this.onMessageSendingErroPopupClose.bind(this);
    };
    /**
     * to set the initial values after authorization
     */
    ResponseContainer.prototype.setInitialValuesAfterAuthorize = function () {
        this.responseContainerProperty.treeViewHelper = new treeViewDataHelper();
        this.responseContainerProperty.markHelper = new markSchemeHelper();
        // This will reset the current scroll position and currently visible image
        responseActionCreator.resetScrollData();
        // Setting the busy indicator properties
        this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
        // If bundle already downloaded, // Copy the favorites stamps.
        if (responseSearchHelper !== undefined) {
            responseSearchHelper.loadFavoriteStampForSelectedQig();
        }
        this.responseContainerProperty.promoteToSeedErrorPopupData = {
            id: '',
            key: '',
            header: '',
            popupContent: ''
        };
    };
    /**
     * the mark schem, tool bar panel and the markbutton componets
     */
    ResponseContainer.prototype.getMarkschemeAndToolbarComponents = function () {
        var markSchemePanel;
        var markButtonContainer;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            markSchemePanel = this.responseContainerHelper.markschemePanel(this.onEnhancedOffPageActionButtonsClicked, this.onValidateMarkEntry, this.onResetMarkConfirm, this.showMbQConfirmation, this.checkIfAllPagesAreAnnotated, this.showCompleteButtonDialog, this.onMarkSchemeStructureLoaded, this.showAcceptQualityConfirmationDialog, this.invokeReviewBusyIndicator, this.state.ismarkEntryPopupVisible, this.state.imagesLoaded, this.state.isPlayerLoaded, this.responseContainerProperty.isPreviousMarksAndAnnotationCopied);
            // Check isMarkbyAnnotation CC is enabled or not.
            this.responseContainerProperty.isMarkbyAnnotation = responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus);
            markButtonContainer = this.responseContainerHelper.markButtonsContainer();
        }
        return [markSchemePanel, markButtonContainer];
    };
    /**
     * the other common elements for render both digital and non digital containers
     */
    ResponseContainer.prototype.commonElements = function () {
        var elements = [];
        elements.push(this.getMessagePanel());
        elements.push(this.popupHelper.emailSaveMessage(this.state.isSaveEmailMessageDisplaying, this.onOkClickOfEmailSucessMessage));
        elements.push(this.responseContainerHelper.markentryValidation(this.state.ismarkEntryPopupVisible, this.onValidationMarkUpSucessMessage));
        elements.push(this.popupHelper.remarkSuccessMessage(this.onOkClickRemarkCreationSuccessPopup));
        elements.push(this.popupHelper.resetMarkMessage(this.onResetMarkYesButtonClick, this.onResetMarkNoButtonClick));
        elements.push(this.popupHelper.mbCConfirmationDialog(this.state.isMbQConfirmationDialogDispalying, this.onYesButtonClick, this.onNoButtonClick));
        elements.push(this.popupHelper.combinedWarningPopupMessage(this.state.isCombinedWarningMessagePopupVisible, this.onCombinedWarningPopupPrimaryButtonClick, this.onCombinedWarningPopupSecondaryButtonClick));
        elements.push(this.popupHelper.deleteCommentMessage(this.state.isDeleteCommentPopupVisible, this.onYesButtonDeleteCommentClick, this.onNoButtonDeleteCommentClick));
        elements.push(this.popupHelper.completeButtonDialog(this.state.isCompleteButtonDialogVisible, this.onYesClickOnCompleteDialog, this.onNoClickOnCompleteDialog));
        elements.push(this.popupHelper.nonRecoverableErrorMessage(this.onOkClickOfNonRecoverableErrorMessage, this.state.isNonRecoverableErrorPopupVisible));
        elements.push(this.popupHelper.getMarkChangeReasonWarning(this.state.isDisplayingMarkChangeReasonNeededError, markingStore.instance.currentResponseMode, this.onStayInResponseClick, this.onLeaveResponseClick));
        elements.push(this.popupHelper.acceptQualityConfirmation(this.state.isAcceptQualityConfirmationPopupDisplaying, this.onAcceptQualityYesButtonClick, this.onAcceptQualityNoButtonClick));
        elements.push(this.popupHelper.promoteToSeedConfirmationMessage(this.onOkClickPromoteToSeedConfirmationPopup, this.onNoClickPromoteToSeedConfirmationPopup));
        elements.push(this.popupHelper.promoteToReuseBucketConfirmationMessage(this.onYesClickPromoteToReuseBucketConfirmationPopup, this.onNoClickPromoteToReuseBucketConfirmationPopup));
        elements.push(this.popupHelper.promoteToSeedErrorMessage(this.onOkClickPromoteToSeedErrorPopup));
        elements.push(this.popupHelper.manageSLAOMessage(this.onOkClickOfManageSLAOMessage, this.state.isUnManagedSLAOPopupVisible));
        elements.push(this.popupHelper.unKnownContentDialog(this.onOkClickOfManageUnknownContentMessage, this.state.isUnManagedImageZonePopUpVisible));
        elements.push(this.popupHelper.responseRevieweFailedMessage(this.state.isResponseReviewFailedPopupVisible, this.onOkClickOfResponseReviewFailedMessage));
        elements.push(this.popupHelper.flagAsSeenPopUp(this.unManagedSLAOFlagAsSeenPopUpOKButtonClick, this.unManagedSLAOFlagAsSeenPopUpCancelButtonClick, this.state.showUnmanagedSLAOFlagAsSeenPopUp));
        elements.push(this.popupHelper.allSLAOsManagedMessage(this.onYesClickAllSLAOsManagedConfirmationPopup, this.onNoClickAllSLAOsManagedConfirmationPopup, this.state.isAllSLAOManagedConfirmationPopupVisible));
        elements.push(this.popupHelper.allUnmanagedContentManagedMessage(this.onYesClickAllUnknownContentManagedConfirmationPopup, this.onNoClickAllUnknownContentManagedConfirmationPopup, this.state.isAllUnknownContentManagedConfirmationPopupVisible));
        elements.push(this.popupHelper.reviewOfMangedSLAOMessage(this.state.isConfirmReviewOfMangedSLAOPopupShowing, this.onConfirmReviewOfMangedSLAOPopupOkButtonClick));
        elements.push(this.popupHelper.rejectRigPopUp(this.onRejectRigOkButtonClick, this.onRejectRigCancelButtonClick, this.state.isRejectRigPopUpVisible));
        elements.push(this.popupHelper.deleteEnhancedOffPageCommentMessage(this.state.isEnhancedOffPageCommentPopUpVisible, this.onCommentConfirmationYesButtonClicked, this.onCommentConfirmationNoButtonClicked));
        elements.push(this.popupHelper.crmFeedConfirmationMessage(this.onConfirmCRMFeedPopupOkButtonClick));
        elements.push(this.popupHelper.creatExceptionReturnWithdrwnResponseErrorPopup(this.onConfirmationWithdrwnResponsePopupClick));
        elements.push(this.popupHelper.withdrwnResponseErrorPopup(this.onWithdrwnResponseErrorPopup));
        elements.push(this.popupHelper.sessionClosedErrorPopup(this.state.sessionClosedErrorPopupVisible, this.onSessionClosedErrorPopup));
        elements.push(this.popupHelper.flagAsSeenForEBookmarkingPopUp(this.unKnownContentFlagAsSeenPopUpOKButtonClick, this.unKnownContentFlagAsSeenPopUpCancelButtonClick, this.state.showUnKnownContentFlagAsSeenPopUp));
        elements.push(this.popupHelper.zoningExceptionWarning(this.state.isZoningExceptionWarningPopupVisible, this.closeZoningExceptionWarningPopup));
        elements.push(this.popupHelper.unKnownContentPopupInRemark(this.onOkClickOfManageUnknownContentMessageInRemark, this.state.isUnManagedImageZoneInRemarkPopUpVisible));
        elements.push(this.popupHelper.messageSendErrorPopup(this.state.isMessageSendErrorPopupVisible, this.onMessageSendingErroPopupClose));
        elements.push(this.popupHelper.withdrawScriptInStmErrorPopup(this.onConfirmationWithdrwnScriptInStmPopupClick));
        elements.push(this.popupHelper.standardisationAdditionalPageMessage(this.onStandardisationAdditionalPagePopupOkButtonClick, this.state.isStandardisationAdditionalPagePopUpVisible));
        elements.push(this.popupHelper.scriptUnavaliablePopUp(this.okClickOnUnavailablePopUp, this.state.isScriptUnavailablePopUpVisible, responseStore.instance.selectedDisplayId.toString()));
        return elements;
    };
    /**
     * the popup components for both digital and non digital.
     */
    ResponseContainer.prototype.getPopupComponents = function () {
        var elements = [];
        elements.push(this.popupHelper.linkToPagePopup(pageLinkHelper.doShowLinkToQuestion, this.onLinkToPageCancelClick, this.onLinkToPageOkClick, this.state.isLinkToPagePopupShowing, this.state.linkToPageButtonLeft, this.addLinkAnnotation, this.removeLinkAnnotation));
        elements.push(this.popupHelper.linkToPageErrorDialog(pageLinkHelper.doShowLinkToQuestion, this.onLinkToPageErrorDialogOkClick, this.state.isLinkToPageErrorShowing));
        elements.push(this.popupHelper.isConfirmReviewOfSLAOPopup(this.onConfirmReviewOfSLAOPopupOkButtonClick, this.onConfirmReviewOfSLAOPopupCancelButtonClick, this.state.isConfirmReviewOfSLAOPopupShowing));
        elements.push(this.popupHelper.isConfirmReviewOfUnknownContentPopup(this.onConfirmReviewOfUnknownContentPopupOkButtonClick, this.onConfirmReviewOfUnknownContentPopupCancelButtonClick, this.state.isConfirmReviewOfUnknownContentPopupShowing));
        elements.push(this.popupHelper.wholeResponseRemarkConfirmationPopup(this.onWholeResponseRemarkConfirmationYesClick, this.onWholeResponseRemarkConfirmationNoClick, this.state.isWholeResponseRemarkConfirmationPopupVisible));
        var message = '';
        if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse) {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.unclassified-body';
        }
        else if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList
            === enums.StandardisationSetup.ClassifiedResponse) {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.classified-body';
        }
        else {
            message = 'standardisation-setup.standardisation-setup-worklist.discard-response-popup.provisional-body';
        }
        var discardResponsePopUpContent = [];
        discardResponsePopUpContent.push(React.createElement("p", {className: 'popup-content'}, React.createElement("span", null, localeStore.instance.TranslateText(message), localeStore.instance.
            TranslateText('standardisation-setup.standardisation-setup-worklist.discard-response-popup.confirmation-text'))));
        elements.push(this.popupHelper.discardStandardisationResponsePopup(this.onDiscardStandardardisationResponsePopupOkClick, this.onDiscardStandardisationResponsePopupNoClicked, this.state.isDiscardStandardisationPopupVisible, discardResponsePopUpContent));
        return elements;
    };
    /**
     * Footer and MessageException components
     */
    ResponseContainer.prototype.getMessageExceptionComponents = function () {
        var elements = [];
        elements.push(this.popupHelper.deleteMessage(this.state.isDeleteMessagePopupVisible, this.onYesButtonDeleteMessageClick, this.onNoButtonDeleteMessageClick));
        elements.push(this.popupHelper.actionExceptionPopup());
        return elements;
    };
    /**
     * Save indicator component
     */
    ResponseContainer.prototype.saveIndicator = function () {
        var saveIndicatorStyle = classNames('saving-response', {
            show: this.state.isSaveIndicatorVisible
        });
        return React.createElement(SaveIndicator, {style: saveIndicatorStyle});
    };
    /**
     * Message on click handler function
     */
    ResponseContainer.prototype.messageOnClickHandler = function (event) {
        stampActionCreator.showOrHideComment(false);
    };
    /**
     * load the modules required for Response
     */
    ResponseContainer.prototype.addCommonEventListners = function () {
        if (this.state == null) {
            return;
        }
        this.loadDependenciesAndAddEventListeners();
        if (!this.state.modulesLoaded) {
            this.props.setOfflineContainer(true);
        }
    };
    /**
     * adds transition change event listeners
     */
    ResponseContainer.prototype.addTransitionEventListeners = function () {
        this.responseContainerProperty.messagingPanel = document
            .getElementsByClassName('messaging-panel')
            .item(0);
        if (this.responseContainerProperty.messagingPanel &&
            this.responseContainerProperty.messagePanelTransitionListenerActive === false) {
            this.responseContainerProperty.messagingPanel.addEventListener('transitionend', this.onAnimationEnd);
            this.responseContainerProperty.messagePanelTransitionListenerActive = true;
        }
    };
    /**
     * Hook all event listeners here, It will be called after loading depencies
     * We required this type of implementation for the initial routing page like worklist, responsecontainer etc.
     */
    ResponseContainer.prototype.addEventListeners = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        this.checkIfMarkSchemeAndMarksAreLoaded();
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.questionChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.NOTIFY_MARK_UPDATED, this.notifyMarkUpdated);
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessageButtonClick);
        markingStore.instance.addListener(markingStore.MarkingStore.DELETE_COMMENT_POPUP, this.showDeleteCommentPopUp);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onResponseZoomUpdated);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        messageStore.instance.addListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onMessageReadStatusRequireUpdation);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.onMinimizeExceptionPanel);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW, this.onMaximizeExceptionPanel);
        messageStore.instance.addListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.onMessagesReceived);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_CLICK_EVENT, this.showDeleteMessagePopUp);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.onMessageDeleted);
        markingStore.instance.addListener(markingStore.MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT, this.onSaveAndNavigateInitiated);
        markingStore.instance.addListener(markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS, this.onSaveMarksAndAnnotationsTriggered);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('orientationchange', this.onChangeDeviceOrientation);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        markingStore.instance.addListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        responseStore.instance.addListener(responseStore.ResponseStore.FRACS_DATA_LOADED, this.onFracsDataLoaded);
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        stampStore.instance.addListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.toggleCommentsSideView);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.removeAnnotation);
        worklistStore.instance.addListener(worklistStore.WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION, this.showMbQConfirmation);
        worklistStore.instance.addListener(worklistStore.WorkListStore.RESPONSE_CLOSED, this.responseClosed);
        responseStore.instance.addListener(responseStore.ResponseStore.SUPERVISOR_REMARK_SUCCESS, this.showRemarkCreationSuccessPopup);
        responseSearchHelper.addResponseSearchEvents();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.setResponseAsReviewedFailureReceived);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.getExceptionData);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onSupervisorRemarkSubmitOrPromoteToSeed);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeed);
        responseStore.instance.addListener(responseStore.ResponseStore.REJECT_RIG_COMPLETED_EVENT, this.handleNavigationOnRejectResponse);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT, this.onPromoteToSeedCheckRemark);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, this.onUpdateExceptionStatusReceived);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT, this.showCombinedPopupMessage);
        responseStore.instance.addListener(responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT, this.resetWarningFlagsOnResponseReject);
        warningMessageStore.instance.addListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, warningMessageNavigationHelper.handleWarningMessageNavigation);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onFullresponseViewStayInResponseClick);
        worklistStore.instance.addListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.setResponseAsReviewed);
        markingStore.instance.addListener(markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED, this.onPreviousMarksAnnotationCopied);
        responseStore.instance.addListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeResponseMessageDetails);
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT, this.clearCommentDetailsOnResponseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT, this.onPromoteToReuseCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_PANEL_WIDTH, this.onUpdatepreviousMarkSelection);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA, this.renderedOnEnhancedOffpageComments);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.renderedOnEnhancedOffpageComments);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH, this.showEnhancedOffPageCommentDiscardPopup);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        imageZoneStore.instance.addListener(imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT, this.onEbookMarkingZonesLoaded);
        markingStore.instance.addListener(markingStore.MarkingStore.WITHDRAWN_RESPONSE_EVENT, this.withdrawnResponse);
        markingStore.instance.addListener(markingStore.MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT, this.sessionClosedForMarker);
        stampStore.instance.addListener(stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT, this.renderedOnEnhancedOffpageComments);
        exceptionsStore.instance.addListener(exceptionStore.ExceptionStore.VIEW_EXCEPTION_WINDOW, this.onExceptionInViewMode);
        messageStore.instance.addListener(messageStore.MessageStore.SEND_MESSAGE_ERROR_EVENT, this.showMessageSendErrorPopup);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT, this.showScriptUnavailablePopUp);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, this.reRender);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT, this.onDiscardActionCompleted);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    ResponseContainer.prototype.removeCommonEventListners = function () {
        if (this.state == null || !this.state.modulesLoaded) {
            return;
        }
        if (this.props.isOnline) {
            // response is getting closed, inform modules.
            worklistActionCreator.responseClosed(true);
            teamManagementActionCreator.resetSelectedException(true);
        }
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.USERINFO_SAVE, this.userInfoSaved);
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksRetrieved);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.questionChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.NOTIFY_MARK_UPDATED, this.notifyMarkUpdated);
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_SUCCESS_EVENT, this.onCloseMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessageButtonClick);
        markingStore.instance.removeListener(markingStore.MarkingStore.DELETE_COMMENT_POPUP, this.showDeleteCommentPopUp);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.onMinimizeMessagePanel);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MAXIMIZE_EVENT, this.onMaximizeMessagePanel);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onResponseZoomUpdated);
        // clear Interval while moving out from response container
        timerHelper.clearInterval(this.autoSaveTimeInterval);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DETAILS_RECEIVED, this.onMessageDetailsReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.UPDATE_NOTIFICATION_TRIGGERED_EVENT, this.onMessageReadStatusRequireUpdation);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.onMinimizeExceptionPanel);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MAXIMIZE_EXCEPTION_WINDOW, this.onMaximizeExceptionPanel);
        messageStore.instance.removeListener(messageStore.MessageStore.RESPONSE_MESSAGE, this.onMessagesReceived);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_CLICK_EVENT, this.showDeleteMessagePopUp);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_DELETE_EVENT, this.onMessageDeleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS, this.onSaveMarksAndAnnotationsTriggered);
        markingStore.instance.removeListener(markingStore.MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT, this.onSaveAndNavigateInitiated);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_NAVIGATE_EVENT, this.onNavigateAwayFromResponse);
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('orientationchange', this.onChangeDeviceOrientation);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);
        responseStore.instance.removeListener(responseStore.ResponseStore.FRACS_DATA_LOADED, this.onFracsDataLoaded);
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, responseSearchHelper.loadFavoriteStampForSelectedQig);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.toggleCommentsSideView);
        markingStore.instance.removeListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.removeAnnotation);
        this.responseContainerProperty.imagesToRender = null;
        worklistStore.instance.removeListener(worklistStore.WorkListStore.SHOW_RETURN_TO_WORKLIST_CONFIRMATION, this.showMbQConfirmation);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.RESPONSE_CLOSED, this.responseClosed);
        if (this.responseContainerProperty.messagingPanel) {
            this.responseContainerProperty.messagingPanel.removeEventListener('transitionend', this.onAnimationEnd);
        }
        responseStore.instance.removeListener(responseStore.ResponseStore.SUPERVISOR_REMARK_SUCCESS, this.showRemarkCreationSuccessPopup);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseSearchHelper.removeResponseSearchEvents();
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.setResponseAsReviewedFailureReceived);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.GET_EXCEPTIONS, this.getExceptionData);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onSupervisorRemarkSubmitOrPromoteToSeed);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, this.handleMarksAndAnnotationsVisibility);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_SEED_EVENT, this.onPromoteToSeed);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_COMPLETED_EVENT, this.handleNavigationOnRejectResponse);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION_WINDOW, this.onExceptionPanelClose);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT, this.onPromoteToSeedCheckRemark);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.UPDATE_EXCEPTION_STATUS_RECEIVED, this.onUpdateExceptionStatusReceived);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT, this.showCombinedPopupMessage);
        responseStore.instance.removeListener(responseStore.ResponseStore.REJECT_RIG_CONFIRMED_EVENT, this.resetWarningFlagsOnResponseReject);
        warningMessageStore.instance.removeListener(warningMessageStore.WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT, warningMessageNavigationHelper.handleWarningMessageNavigation);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onFullresponseViewStayInResponseClick);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.setResponseAsReviewed);
        markingStore.instance.removeListener(markingStore.MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED, this.onPreviousMarksAnnotationCopied);
        responseStore.instance.removeListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeResponseMessageDetails);
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.MY_TEAM_MANAGEMENT_EXAMINER_VALIDATED_EVENT, this.examinerValidated);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT, this.clearCommentDetailsOnResponseChanged);
        // resetting ui dropdown panel values.
        this.resetUIDropdownStatus();
        // activate keydown helper incase if the mouseup event was not triggered
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Annotation);
        responseStore.instance.removeListener(responseStore.ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT, this.onPromoteToReuseCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_PANEL_WIDTH, this.onUpdatepreviousMarkSelection);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA, this.renderedOnEnhancedOffpageComments);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.renderedOnEnhancedOffpageComments);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore
            .SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH, this.showEnhancedOffPageCommentDiscardPopup);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onOnlineStatusChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.WITHDRAWN_RESPONSE_EVENT, this.withdrawnResponse);
        markingStore.instance.removeListener(markingStore.MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT, this.sessionClosedForMarker);
        imageZoneStore.instance.removeListener(imageZoneStore.ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT, this.onEbookMarkingZonesLoaded);
        stampStore.instance.removeListener(stampStore.StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT, this.renderedOnEnhancedOffpageComments);
        exceptionsStore.instance.removeListener(exceptionStore.ExceptionStore.VIEW_EXCEPTION_WINDOW, this.onExceptionInViewMode);
        messageStore.instance.removeListener(messageStore.MessageStore.SEND_MESSAGE_ERROR_EVENT, this.showMessageSendErrorPopup);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT, this.showScriptUnavailablePopUp);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, this.reRender);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT, this.onDiscardActionCompleted);
        // This will reset the meta tag for android.
        htmlUtilities.updateMetaTagForAndroid(false);
    };
    /**
     * Method which sets the busy indicator properties
     * @param busyIndicatorInvoker
     * @param showBackgroundScreenOnBusy
     */
    ResponseContainer.prototype.setBusyIndicatorProperties = function (busyIndicatorInvoker, showBackgroundScreenOnBusy) {
        this.responseContainerProperty.busyIndicatorInvoker = busyIndicatorInvoker;
        this.responseContainerProperty.showBackgroundScreenOnBusy = showBackgroundScreenOnBusy;
    };
    /**
     * Load the images.
     * If the script url is directly access the server. It will give Authorisation errror [Since the header does not contains security data]
     * So in order to avoid this issue, access the image using the Security (ie, data access class). Hence url will be cached.
     * After the all success calls, render the images.
     * @param imagesToRender
     */
    ResponseContainer.prototype.loadImages = function (allimageURLS) {
        var _this = this;
        // assigning imageurls length to the protected variable which is
        // used for setting scroll position on paritally supressed page
        if (this.responseContainerHelper.doExcludeSuppressedPage) {
            // for e-coursework component we are not including the suppressed page so we
            // can directly assign the variable 'this.imagesToRender' which holds non-suppressed images
            this.responseContainerProperty.totalImagesWithOutSuppression = this.responseContainerHelper.returnImageToRenderLength(this.responseContainerProperty.imagesToRender);
        }
        else {
            this.responseContainerProperty.totalImagesWithOutSuppression
                = this.responseContainerProperty.scriptHelper.getPagesCountExcludingSuppressed();
        }
        // Call All images for the data.
        var imagePromises = scriptActionCreator.getImages(allimageURLS);
        var that = this;
        // If all calls are done, render the method.
        Promise.all(imagePromises)
            .then(function () {
            _this.setState({
                modulesLoaded: _this.state.modulesLoaded,
                imagesLoaded: true
            });
            // #40995 : set the mark entry box as selected after all the images has been loaded.
            // only allow the text change of the markentry box after images are loaded completely.
            // # 58935 this needs to be implemented for unstructured component also.
            markingActionCreator.setMarkEntrySelected(false);
            _this.checkIfMarkSchemeAndMarksAreLoaded();
        })
            .catch(function () {
            // navigationHelper.navigateBack();
        });
    };
    /**
     *  This will load the dependencies dynamically during component mount.
     */
    ResponseContainer.prototype.loadDependenciesAndAddEventListeners = function () {
        var _this = this;
        this.isNetworkError = true;
        var ensurePromise = require.ensure([
            '../../stores/locale/localestore',
            '../../actions/worklist/worklistactioncreator',
            '../../stores/userinfo/userinfostore',
            '../../stores/marking/markingstore',
            '../../stores/markschemestructure/markschemestructurestore',
            '../message/message',
            '../../utility/generic/htmlutilities',
            '../../stores/message/messagestore',
            '../../utility/generic/keydownhelper',
            '../../actions/messaging/messagingactioncreator',
            '../../utility/markscheme/markinghelper',
            '../utility/popup/popuphelper',
            '../exception/exception',
            '../../stores/exception/exceptionstore',
            '../../stores/stamp/stampstore',
            '../../utility/responsesearch/responsesearchhelper',
            '../utility/message/messagehelper',
            '../utility/exception/exceptionhelper',
            '../utility/userdetails/userinfo/operationmodehelper',
            '../../actions/userinfo/userinfoactioncreator',
            '../../actions/qigselector/qigselectoractioncreator',
            '../../utility/stringformat/stringformathelper',
            '../utility/marking/markingauditlogginghelper',
            '../utility/responsehelper/responsescreenauditlogginghelper',
            '../../dataservices/base/urls',
            '../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore',
            '../../stores/standardisationsetup/standardisationsetupstore',
            '../../actions/standardisationsetup/standardisationactioncreator'
        ], function () {
            localeStore = require('../../stores/locale/localestore');
            worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
            userInfoStore = require('../../stores/userinfo/userinfostore');
            markingStore = require('../../stores/marking/markingstore');
            markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
            Message = require('../message/message');
            Exception = require('../exception/exception');
            htmlUtilities = require('../../utility/generic/htmlutilities');
            messageStore = require('../../stores/message/messagestore');
            keyDownHelper = require('../../utility/generic/keydownhelper');
            messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
            markingHelper = require('../../utility/markscheme/markinghelper');
            exceptionHelper = require('../utility/exception/exceptionhelper');
            popupHelper = require('../utility/popup/popuphelper');
            exceptionStore = require('../../stores/exception/exceptionstore');
            stampStore = require('../../stores/stamp/stampstore');
            responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
            messageHelper = require('../utility/message/messagehelper');
            operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
            userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
            qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
            stringFormatHelper = require('../../utility/stringformat/stringformathelper');
            loggingHelper = require('../utility/marking/markingauditlogginghelper');
            responseScreenAuditHelper = require('../utility/responsehelper/responsescreenauditlogginghelper');
            urls = require('../../dataservices/base/urls');
            enhancedOffPageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
            standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
            standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
            // modules has been loaded so setting the variable as false;
            this.isNetworkError = false;
            this.loadMessageFortheResponse();
            // Copy the favourites stamps.
            responseSearchHelper.loadFavoriteStampForSelectedQig();
            // hook all event listeners.
            this.addEventListeners();
            //to identify mobile device and identification class to body
            if (htmlUtilities.isTabletOrMobileDevice) {
                htmlUtilities.addClassToBody('touch-device');
            }
            if (htmlUtilities.isAndroidDevice) {
                // find the window size for android
                htmlUtilities.findWindowSize();
                // This will update the meta tag for android
                // we have added this for handling fit height issue in android devices while on-screen keyboard is active
                htmlUtilities.updateMetaTagForAndroid(true);
            }
            // Check whether to show Annotation toolbar panel if Message//Exception window open inside Response View.
            // This will happen only after loading the message store.
            this.responseContainerProperty.isToolBarPanelVisible = !(messageStore.instance.responseOpenTriggerPoint ===
                enums.TriggerPoint.WorkListResponseMessageIcon ||
                messageStore.instance.responseOpenTriggerPoint ===
                    enums.TriggerPoint.AssociatedDisplayIDFromMessage ||
                messageStore.instance.responseOpenTriggerPoint ===
                    enums.TriggerPoint.WorkListResponseExceptionIcon);
            this.loadTinyMCE();
            // Start re-rendering. We have loaded everything.
            this.setState({
                modulesLoaded: true,
                imagesLoaded: htmlviewerhelper.isHtmlComponent ? true : this.state.imagesLoaded
            });
        }.bind(this));
        ensurePromise.catch(function (e) {
            // assuming that if modulesLoaded state is true, then the error wont be a network failure.
            // so we need to throw custom error message
            if (_this.isNetworkError) {
                _this.props.setOfflineContainer(true, true);
            }
            else {
                _this.setState({
                    isBusy: false
                });
                window.onerror(e, '', null, null, new Error(e));
            }
        });
    };
    /**
     * getLinkedAnnotationCount
     */
    ResponseContainer.prototype.getLinkedAnnotationCount = function () {
        var linkedAnnotationsCount = 0;
        if (this.responseContainerProperty.imageZonesCollection &&
            (responseStore.instance.markingMethod === enums.MarkingMethod.Structured ||
                responseHelper.isEbookMarking) &&
            !responseHelper.isAtypicalResponse()) {
            linkedAnnotationsCount = pageLinkHelper.getLinkedPagesCountExcludingPagesUsedInImageZones(markingStore.instance.currentMarkSchemeId);
        }
        return linkedAnnotationsCount;
    };
    /**
     * setting fracs data for image loaded
     */
    ResponseContainer.prototype.onMarkThisPageLoaded = function () {
        responseActionCreator.setFracsDataForImageLoaded();
    };
    /**
     * Method to handle the response view mode change.
     * If Current Mode is Zone View and all images are not loaded, Load All the images and render the component.
     * If Current Mode is Zone View and all images are loaded. render to full response view
     * If current mode is full response view, render to zone view since default mode is zone view.
     */
    ResponseContainer.prototype.changeResponseViewMode = function () {
        var hasUnManagedSLAO = responseHelper.hasUnManagedSLAOInMarkingMode;
        var hasUnmanagedImageZone = this.responseContainerHelper.hasUnManagedImageZone();
        var hasAdditionalPageStdSetupSelectResponse = responseHelper.hasAdditionalPageInStdSetUpSelectResponses;
        if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView || hasUnManagedSLAO ||
            (hasAdditionalPageStdSetupSelectResponse && !this.isStdsetupAdditionalpageSeen) || hasUnmanagedImageZone) {
            if (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize
                || this.responseContainerProperty.isExceptionPanelMinimized === true) {
                this.responseContainerProperty.cssMessageStyle = { right: this.responseContainerProperty.scrollBarWidth };
            }
            if (this.responseContainerProperty.fileMetadataList === undefined ||
                this.responseContainerProperty.fileMetadataList == null) {
                // Setting the busy indicator properties
                this.setBusyIndicatorProperties(enums.BusyIndicatorInvoker.loadingResponse, false);
                responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.fullResponseView, false);
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]);
                //  Switch the state to show 'Loading..' text
                this.setState({
                    imagesLoaded: false,
                    isBusy: true,
                    selectedViewMode: enums.ResponseViewMode.fullResponseView
                });
                // Get all image urls.
                this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
                var imgUrls_1 = [];
                this.responseContainerProperty.fileMetadataList.forEach(function (metadata) {
                    imgUrls_1.push(metadata.url);
                });
                // Call the API for images and render to UI.
                this.loadImages(imgUrls_1);
            }
            else {
                responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.fullResponseView, false);
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]);
                // Images are already loaded. Just switch the state,
                // fix for 68601: Additional page pop up will not show initially if the image loading takes time.
                // show the Additional page pop up if needed after loading images
                this.setState({
                    selectedViewMode: enums.ResponseViewMode.fullResponseView,
                    isStandardisationAdditionalPagePopUpVisible: this.isStdSetUpSelectResponsesAdditionalPagePopUpVisible(enums.ResponseViewMode.fullResponseView)
                });
            }
            if (hasUnManagedSLAO || hasUnmanagedImageZone || hasAdditionalPageStdSetupSelectResponse) {
                // moving to full response view.
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toFullResponseview);
            }
        }
        else if (!hasUnmanagedImageZone &&
            this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView) {
            this.changeResponseModeIntoFRV();
        }
    };
    /**
     * get executed on response mode changed into FRV
     */
    ResponseContainer.prototype.changeResponseModeIntoFRV = function () {
        this.responseContainerProperty.hasResponseLayoutChanged = true;
        this.responseContainerProperty.cssMessageStyle = {
            right: this.responseContainerProperty.resizedWidth
        };
        // Switch view to Zone state
        this.responseContainerProperty.renderedImageViewerCount = 0;
        if (this.responseContainerProperty.isMessagePanelVisible) {
            // deactivating the keydown helper.
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        }
        responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.zoneView, false);
        new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[enums.ResponseViewMode.zoneView]);
        this.loadScriptImages(false);
        //Set if navigate from FRV with unknown content managed.
        this.isUnknownContentMangedFromFRV = (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView);
        this.setState({ selectedViewMode: enums.ResponseViewMode.zoneView });
    };
    /**
     * returns visibility of unmanaged slao popup
     */
    ResponseContainer.prototype.isUnManagedSLAOPopUpVisible = function (currentViewMode) {
        return !this.responseContainerProperty.isUnManagedSLAOPopupRendered &&
            currentViewMode === enums.ResponseViewMode.fullResponseView &&
            responseHelper.hasUnManagedSLAOInMarkingMode &&
            !this.responseContainerProperty.isPreviousMarksAndAnnotationCopying
            ? true
            : this.state.isUnManagedSLAOPopupVisible;
    };
    /**
     * returns visibility of additional page popup
     */
    ResponseContainer.prototype.isStdSetUpSelectResponsesAdditionalPagePopUpVisible = function (currentViewMode) {
        return currentViewMode === enums.ResponseViewMode.fullResponseView
            && responseHelper.hasAdditionalPageInStdSetUpSelectResponses && !this.isStdsetupAdditionalpageSeen;
    };
    /**
     * returns visibility of unmanaged slao popup
     */
    ResponseContainer.prototype.isUnManagedImageZonePopUpVisible = function (currentViewMode) {
        return !this.responseContainerProperty.isUnManagedImageZonePopupRendered &&
            currentViewMode === enums.ResponseViewMode.fullResponseView &&
            (worklistStore.instance.getResponseMode === enums.ResponseMode.open ||
                worklistStore.instance.getResponseMode === enums.ResponseMode.pending) &&
            this.responseContainerHelper.hasUnManagedImageZone() &&
            !this.responseContainerProperty.isPreviousMarksAndAnnotationCopying
            ? true
            : this.state.isUnManagedImageZonePopUpVisible;
    };
    /**
     * Checking whether markschemes and marks are loaded
     */
    ResponseContainer.prototype.checkIfMarkSchemeAndMarksAreLoaded = function () {
        // Checking whether mark, Mark scheme and images are loaded to remove busy indicator
        // since mark and markscheme loading not needed in frv navigation 
        //restricting state updation in frv mode as part of defect #70901
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded()
            && this.state.imagesLoaded && this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView) {
            // Copying previous marks and annotation when isStartWithEmptyMarkGroup is set as zero .
            if (!this.responseContainerHelper.hasUnManagedImageZone()) {
                this.responseContainerHelper.copyPrevMarksAndAnnotations();
            }
            if (this.responseContainerHelper.doAddLinkToSLAO) {
                var displayId = responseStore.instance.selectedDisplayId.toString();
                var examinerMarksAgainstResponse = this.responseContainerHelper.getExaminerMarksAgainstResponse(displayId);
                markinghelper.addLinksToAnnotatedSLAOs(displayId, false);
            }
            var currentViewMode = responseHelper.hasUnManagedSLAOInMarkingMode ||
                this.responseContainerHelper.hasUnManagedImageZone() === true
                ? enums.ResponseViewMode.fullResponseView
                : this.state.selectedViewMode;
            if (currentViewMode !== responseStore.instance.selectedResponseViewMode) {
                responseActionCreator.changeResponseViewMode(currentViewMode, false);
                new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[currentViewMode]);
            }
            var showConfirmReviewOfMangedSLAOPopup = currentViewMode !== enums.ResponseViewMode.zoneView &&
                this.responseContainerHelper.isPreviousMarksAndAnnotationCopiedInSLAOMode &&
                !responseHelper.hasUnManagedSLAOInMarkingMode
                ? true
                : false;
            this.setState({
                isBusy: this.responseContainerProperty.isPreviousMarksAndAnnotationCopying,
                isUnManagedSLAOPopupVisible: this.isUnManagedSLAOPopUpVisible(currentViewMode),
                isStandardisationAdditionalPagePopUpVisible: this.isStdSetUpSelectResponsesAdditionalPagePopUpVisible(currentViewMode),
                isUnManagedImageZonePopUpVisible: this.isUnManagedImageZonePopUpVisible(currentViewMode)
                    && !markerOperationModeFactory.operationMode.hasZoningExceptionWarningPopup,
                selectedViewMode: currentViewMode,
                isConfirmReviewOfMangedSLAOPopupShowing: showConfirmReviewOfMangedSLAOPopup
            });
            if (!this.state.isBusy &&
                markingStore &&
                markingStore.instance.currentMarkGroupItemHasNonRecoverableErrors &&
                !this.responseContainerProperty.hasNonRecoverableErrorPopupShown) {
                this.responseContainerProperty.hasNonRecoverableErrorPopupShown = true;
                this.responseContainerProperty.saveMarksAndAnnotationsErrorDialogContents
                    = new saveMarksAndAnnotationsNonRecoverableErrorDialogContents(false);
                this.setState({
                    isNonRecoverableErrorPopupVisible: true
                });
            }
        }
        else if (!markSchemeHelper.isMarksAndMarkSchemesAreLoaded() &&
            !markingStore.instance.isMarksAndMarkSchemesLoadedFailed) {
            markSchemeHelper.loadMarksAndAnnotation();
        }
        if (!htmlviewerhelper.isHtmlComponent) {
            var candidateScriptId = void 0;
            candidateScriptId = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
                ? responseStore.instance.selectedDisplayId // Returns candaidateScriptId for StandardisationSetUp tab
                : Number(markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString()).candidateScriptId);
            if (candidateScriptId &&
                imageZoneStore.instance.candidateScriptImageZoneList.get(candidateScriptId) ===
                    undefined) {
                scriptActionCreator.getCandidateScriptImageZones(candidateScriptId, enums.Priority.First);
            }
        }
    };
    /**
     * Reseting to login page
     * @param context
     */
    ResponseContainer.prototype.resetToLoginPage = function (context) {
        // This will clear the memory.
        navigationHelper.loadLoginPage();
        window.location.replace(config.general.SERVICE_BASE_URL);
    };
    /**
     * Check whether the login session authenticated.
     * @param context
     */
    ResponseContainer.prototype.isLoginSessionAuthenticated = function () {
        if (!loginSession.IS_AUTHENTICATED) {
            this.resetToLoginPage(this.context);
            return false;
        }
        return true;
    };
    /**
     * Set confirmation dialogue props
     * @param content Confirmation dialogue content
     */
    ResponseContainer.prototype.setConfirmationDialogContent = function (content) {
        this.responseContainerProperty.confirmationDialogueHeader = htmlviewerhelper.isHtmlComponent
            ? localeStore.instance.TranslateText('marking.response.reset-mark-dialog.header-cbt')
            : localeStore.instance.TranslateText('marking.response.reset-mark-dialog.header');
        this.responseContainerProperty.confirmationDialogueContent = content;
    };
    /**
     * Load Messages Related To the Response
     */
    ResponseContainer.prototype.loadMessageFortheResponse = function () {
        if (!markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            var isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
            var responseBase = this.responseContainerProperty.responseData;
            messagingActionCreator.getMessages({
                recentMessageTime: null,
                messageFolderType: 0,
                qigId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                forceLoadMessages: messageStore.instance.isMessageDataRequireUpdation,
                candidateResponseId: responseBase.candidateScriptId,
                markGroupId: isStandardisationSetupMode ? responseBase.esMarkGroupId : responseBase.markGroupId,
                isStandardisationResponse: isStandardisationSetupMode ? true :
                    worklistStore.instance.currentWorklistType === enums.WorklistType.practice ||
                        worklistStore.instance.currentWorklistType ===
                            enums.WorklistType.standardisation ||
                        worklistStore.instance.currentWorklistType ===
                            enums.WorklistType.secondstandardisation,
                isTeamManagementView: markerOperationModeFactory.operationMode.isTeamManagementMode,
                isWholeResponse: responseBase.isWholeResponse,
                currentWorklistType: worklistStore.instance.currentWorklistType
            });
        }
    };
    /**
     * Open and Render the Message
     * @param msgId
     */
    ResponseContainer.prototype.openMessage = function (msgId) {
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        if (msgId !== 0) {
            messagingActionCreator.getMessageBodyDetails(msgId, enums.MessageFolderType.None);
            this.responseContainerProperty.selectedMsg = messageStore.instance.getMessageData(msgId);
            // if the exception panel is visible then need to set as close
            // for arranging the panel visiblity in correct position when we minimizing
            if (exceptionStore.instance.isExceptionPanelVisible) {
                exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
            }
            messagingActionCreator.calculateRecipientCount();
        }
        else {
            messagingActionCreator.messageAction(enums.MessageViewAction.Open);
        }
        this.responseContainerProperty.messageType = enums.MessageType.ResponseDetails;
        this.responseContainerProperty.isExceptionPanelEdited = false;
        this.setState({
            renderedOn: Date.now()
        });
    };
    /**
     *  create new message code moved to a common method
     */
    ResponseContainer.prototype.createNewMessage = function () {
        this.responseContainerProperty.isMessagePanelVisible = true;
        this.setState({
            isExceptionPanelVisible: false
        });
        // deactivating the keydown helper on message section open.
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Messaging);
        messagingActionCreator.messageAction(enums.MessageViewAction.Open, enums.MessageType.ResponseCompose);
        this.responseContainerHelper.setMessagePanelvariables();
        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Close);
        this.responseContainerProperty.isExceptionPanelMinimized = false;
    };
    /**
     * Update the Read Status to database
     */
    ResponseContainer.prototype.updateReadStatus = function () {
        // If the message is currently in un read status and also make sure it is not made as read already
        if (this.responseContainerProperty.selectedMsg &&
            (this.responseContainerProperty.selectedMsg.status === enums.MessageReadStatus.New &&
                !messageStore.instance.isMessageRead(this.responseContainerProperty.selectedMsg.examinerMessageId))) {
            // action for updating read status for the newly selected response.
            messagingActionCreator.updateMessageStatus({
                messageId: this.responseContainerProperty.selectedMsg.examinerMessageId,
                messageDistributionIds: this.responseContainerProperty.selectedMsg
                    .messageDistributionIds,
                examinerMessageStatusId: enums.MessageReadStatus.Read
            });
        }
    };
    /**
     * Show or hide the save indicator.
     * @param {type} processSave
     */
    ResponseContainer.prototype.showAndHideSavingIndicator = function (processSave) {
        if (processSave === void 0) { processSave = false; }
        if (markingStore.instance.isResponseDirty(markingStore.instance.currentMarkGroupId, markingStore.instance.selectedQIGMarkGroupId)) {
            this.setState({ isSaveIndicatorVisible: true });
            var that_3 = this;
            // we have increased timeout to 2100 coz to let the fadeout show before
            // seting display to none
            setTimeout(function () {
                // Make sure QIG is still accessible. If it got withdrawn during save, Rendering will make problem
                // Added nonrecoverable error check due to blank screen display in background  while naviagtion.
                // if it has any non recoverable errors ,then no need to render response container again.
                // render of response container will cause the unmount of footer.
                var hasNonRecoverableErrors = markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(markingStore.instance.currentMarkGroupId);
                if (qigStore.instance.selectedQIGForMarkerOperation && !hasNonRecoverableErrors) {
                    that_3.setState({ isSaveIndicatorVisible: false });
                }
            }, 2100);
        }
        if (processSave) {
            markingActionCreator.processSaveAndNavigation();
        }
    };
    /**
     * Delete message.
     */
    ResponseContainer.prototype.deleteMessage = function () {
        var examinerList = [];
        examinerList[0] = 0;
        var args = {
            messageId: this.responseContainerProperty.selectedMsg.examinerMessageId,
            messageDistributionIds: this.responseContainerProperty.selectedMsg
                .messageDistributionIds,
            examinerMessageStatusId: enums.MessageReadStatus.Closed
        };
        // action for updating read status for the newly selected response.
        messagingActionCreator.updateMessageStatus(args);
    };
    /**
     * On Discard Action completed
     */
    ResponseContainer.prototype.onDiscardActionCompleted = function (isNextResponseAvailable) {
        if (isNextResponseAvailable) {
            var responseData = undefined;
            if (responseStore.instance.selectedDisplayId) {
                responseData = standardisationSetupStore.instance.getResponseDetails(responseStore.instance.selectedDisplayId.toString());
            }
            // remove discard response from standardisation response worklist collection.
            standardisationActionCreator.updateStandardisationResponseCollection(responseData.esMarkGroupId, standardisationSetupStore.instance.selectedStandardisationSetupWorkList);
            navigationHelper.responseNavigation(enums.ResponseNavigation.next);
        }
        else {
            // if next response is not available then load worklist.
            navigationHelper.loadStandardisationSetup();
        }
    };
    /**
     * on clicking ok button of manage slao popup
     */
    ResponseContainer.prototype.onOkClickOfManageSLAOMessage = function () {
        this.setState({ isUnManagedSLAOPopupVisible: false });
    };
    /**
     * on clicking ok button of manage slao popup
     */
    ResponseContainer.prototype.onOkClickOfManageUnknownContentMessage = function () {
        this.setState({ isUnManagedImageZonePopUpVisible: false });
    };
    /**
     * on clicking ok button of manage unknown content popup in remark
     */
    ResponseContainer.prototype.onOkClickOfManageUnknownContentMessageInRemark = function () {
        this.responseContainerProperty.isConfirmReviewUnknownContentOKClicked = true;
        this.setState({ isUnManagedImageZoneInRemarkPopUpVisible: false });
        responseActionCreator.setPageScrollInFRV();
    };
    /**
     * on clicking yes button of all slao managed confirmation popup
     */
    ResponseContainer.prototype.onYesClickAllSLAOsManagedConfirmationPopup = function () {
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = true;
        var that = this;
        // Reset the current stamp banner type before navigate to response.
        var resetBannerTypePromise = stampActionCreator.resetStampBannerType();
        Promise.all([resetBannerTypePromise]).then(function () {
            that.setState({ isAllSLAOManagedConfirmationPopupVisible: false });
            that.changeResponseViewMode();
        });
    };
    /**
     * on clicking no button of all slao managed confirmation popup
     */
    ResponseContainer.prototype.onNoClickAllSLAOsManagedConfirmationPopup = function () {
        this.responseContainerProperty.isAllSLAOManagedConfirmationPopupButtonClicked = true;
        this.setState({ isAllSLAOManagedConfirmationPopupVisible: false });
        stampActionCreator.resetStampBannerType();
    };
    /**
     * on clicking yes button of all unknown content managed confirmation popup
     */
    ResponseContainer.prototype.onYesClickAllUnknownContentManagedConfirmationPopup = function () {
        this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = true;
        var that = this;
        // Reset the current stamp banner type before navigate to response.
        var resetBannerTypePromise = stampActionCreator.resetStampBannerType();
        Promise.all([resetBannerTypePromise]).then(function () {
            that.setState({ isAllUnknownContentManagedConfirmationPopupVisible: false });
            that.changeResponseViewMode();
        });
    };
    /**
     * on clicking no button of all unknown content managed confirmation popup
     */
    ResponseContainer.prototype.onNoClickAllUnknownContentManagedConfirmationPopup = function () {
        this.responseContainerProperty.isUnknownContentManagedConfirmationPopupButtonClicked = true;
        this.setState({ isAllUnknownContentManagedConfirmationPopupVisible: false });
        stampActionCreator.resetStampBannerType();
    };
    /**
     * Add or remove link annotation
     */
    ResponseContainer.prototype.addOrRemoveLinkAnnotation = function () {
        var _this = this;
        this.responseContainerProperty.linkAnnotations.map(function (annotation, markSchemeId) {
            if (annotation.isDirty &&
                annotation.markingOperation !== enums.MarkingOperation.deleted &&
                !pageLinkHelper.isLinkAnnotationAlreadyAdded(annotation.clientToken)) {
                pageLinkHelper.addLinkAnnotation(annotation, undefined, false, _this.responseContainerHelper.logAnnoataionModificationAction);
            }
            else if (annotation.markingOperation === enums.MarkingOperation.deleted) {
                pageLinkHelper.removeLinkAnnotation(annotation, _this.responseContainerHelper.logAnnoataionModificationAction);
            }
        });
    };
    /**
     * Check whether review of unknown content popup displayable
     * @param numberOfLinks
     */
    ResponseContainer.prototype.canShowConfirmReviewOfUnknownContentPopup = function (numberOfLinks) {
        return (numberOfLinks === 0 &&
            (!responseHelper.hasUnManagedImageZone() ||
                (this.responseContainerProperty.isUnknownContentManagedConfirmationPopupRendered &&
                    this.responseContainerProperty
                        .isUnknownContentManagedConfirmationPopupButtonClicked)) &&
            !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(this.responseContainerProperty.currentPageNumber, true) &&
            responseHelper.isEbookMarking);
    };
    /**
     * Check whether review of SLAO popup displayable
     * @param numberOfLinks
     */
    ResponseContainer.prototype.canShowConfirmReviewOfSLAOPopup = function (numberOfLinks) {
        return (numberOfLinks === 0 &&
            (!responseHelper.hasUnManagedSLAOInMarkingMode ||
                (this.responseContainerProperty.isAllSLAOManagedConfirmationPopupRendered &&
                    this.responseContainerProperty
                        .isAllSLAOManagedConfirmationPopupButtonClicked)) &&
            scriptStore.instance.getAdditionalObjectFlagValue(this.responseContainerProperty.currentPageNumber) &&
            !annotationHelper.HasPageContainsCurrentMarkGroupAnnotation(this.responseContainerProperty.currentPageNumber, true));
    };
    /**
     * add item to the remove link annotation collection
     * @param node
     */
    ResponseContainer.prototype.addItemToLinkAnnotationLocalCollection = function (node) {
        if (this.responseContainerProperty.linkAnnotationsToRemove.indexOf(node.uniqueId) === -1) {
            this.responseContainerProperty.linkAnnotationsToRemove.push(node.uniqueId);
        }
    };
    /**
     * get the message panel
     */
    ResponseContainer.prototype.getMessagePanel = function () {
        // show the message panel on complete image load and having message details to render
        // or on compose new message
        // or on new exception
        // or on having exception details to render
        if ((this.state.isImagesLoaded && this.responseContainerProperty.selectedMsgDetails) ||
            this.responseContainerProperty.messageType === enums.MessageType.ResponseCompose ||
            (this.responseContainerProperty.exceptionDetails ||
                this.responseContainerProperty.isNewException) ||
            (responseHelper.hasUnmanagedSLAO ||
                this.responseContainerHelper.hasUnManagedImageZone())) {
            return (React.createElement("div", {id: 'messaging-panel', key: 'messaging-panel', style: this.responseContainerProperty.cssMessageStyle, className: classNames('messaging-panel', { 'show-exception': this.state.isExceptionPanelVisible }, { 'show-message': this.responseContainerProperty.isMessagePanelVisible }), onClick: this.messageOnClickHandler}, React.createElement(Message, {messageType: this.responseContainerProperty.messageType, closeMessagePanel: this.onCloseMessagePanel, selectedLanguage: this.props.selectedLanguage, responseId: responseStore.instance.selectedDisplayId, supervisorId: this.responseContainerProperty.examinerIdForSendMessage, supervisorName: this.responseContainerProperty.examinerNameForSendMessage, selectedMessage: this.responseContainerProperty.selectedMsg, selectedMsgDetails: this.responseContainerProperty.selectedMsgDetails, onMessageMenuActionClickCallback: this.onMessageMenuActionClick, onMessageClose: this.onMessagePanelClose, isMessagePanelVisible: this.responseContainerProperty.isMessagePanelVisible}), React.createElement(Exception, {closeExceptionPanel: this.onCloseExceptionPanel, isNewException: this.responseContainerProperty.isNewException, exceptionDetails: this.responseContainerProperty.exceptionDetails, isExceptionPanelEdited: this.responseContainerProperty.isExceptionPanelEdited, validateException: this.validateException, selectedLanguage: this.props.selectedLanguage, exceptionData: this.responseContainerProperty.exceptionData, isExceptionPanelVisible: this.state.isExceptionPanelVisible, hasUnManagedSLAO: responseStore.instance.markingMethod ===
                enums.MarkingMethod.Unstructured || responseStore.instance.markingMethod ===
                enums.MarkingMethod.MarkFromObject ? (false) : (!this.responseContainerProperty.isSLAOManaged), currentQuestionItemInfo: markingStore.instance.currentQuestionItemInfo, isFromMediaErrorDialog: this.responseContainerProperty.isFromMediaErrorDialog, exceptionBody: this.responseContainerProperty.errorViewmoreContent, hasUnmanagedImageZone: this.responseContainerHelper.hasUnManagedImageZone()})));
        }
    };
    /**
     * on clicking OK button for response reviewed failed message popup
     */
    ResponseContainer.prototype.onOkClickOfResponseReviewFailedMessage = function () {
        this.responseContainerProperty.markSchemeRenderedOn = Date.now();
        this.setState({ isResponseReviewFailedPopupVisible: false });
    };
    /**
     * Load Tyny MCE
     * @protected
     * @memberof MessageContainer
     */
    ResponseContainer.prototype.loadTinyMCE = function () {
        var url = htmlUtilities.getFullUrl(urls.TINYMCE_URL);
        // If tinyMCE script is not loaded then load that
        if (!htmlUtilities.isScriptLoaded(url)) {
            var script = document.createElement('script');
            script.src = url;
            //script.async = true;
            script.onload = this.dependenciesLoaded.bind(this);
            document.body.appendChild(script);
        }
        else {
            this.dependenciesLoaded();
        }
    };
    /**
     * Method to load dependencies
     */
    ResponseContainer.prototype.dependenciesLoaded = function () {
        this.setState({ scriptLoaded: true });
    };
    /**
     * We will load worklist after the validation - Defect fix #49590
     */
    ResponseContainer.prototype.examinerValidated = function (failureCode, examinerDrillDownData, examinerValidationArea) {
        if (failureCode === void 0) { failureCode = enums.FailureCode.None; }
        if (failureCode === enums.FailureCode.None &&
            (examinerValidationArea === enums.ExaminerValidationArea.TeamWorklist ||
                examinerValidationArea === enums.ExaminerValidationArea.HelpExaminer)) {
            navigationHelper.loadWorklist();
        }
    };
    /**
     * check online status
     */
    ResponseContainer.prototype.checkOnlineStatusComposeMessage = function () {
        /* Will request tinymce font when open a compose message panel first time
        (ie, when render message right panel component first time). If open the panel in offline mode,
        then the font request will get failed and thus the font family buttons are not visible.
        Since this request is happens only once, the font family buttons are not visible during that session.
        So we first do a ping and check the network status and if the system is in online,
        then proceed the message compose action. If the system is in offline mode,
        then shows offline popup and don’t proceed the message action.*/
        if (applicationStore.instance.isOnline) {
            /*Each time Create New Message is clicked a ping is sent to validate the network status ,
            to avoid this calling createnewmessage based on a variable in message store*/
            if (messageStore.instance.isMessagePanelOpened) {
                this.createNewMessage();
            }
            else {
                this.responseContainerProperty.isCreateNewMessageSelected = true;
                applicationActionCreator.validateNetWorkStatus(true);
            }
        }
        else {
            applicationActionCreator.checkActionInterrupted();
        }
    };
    /**
     * On moving in touch.
     */
    ResponseContainer.prototype.onTouchMove = function (event) {
        /**
         * To prevent the scrolling in ipad.
         */
        event.preventDefault();
    };
    return ResponseContainer;
}(pureRenderComponent));
module.exports = ResponseContainer;
//# sourceMappingURL=responsecontainer.js.map
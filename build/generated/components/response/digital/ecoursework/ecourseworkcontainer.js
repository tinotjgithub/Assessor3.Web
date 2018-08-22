"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ResponseContainer = require('../../responsecontainer');
var eCourseworkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var eCourseworkActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var enums = require('../../../utility/enums');
var eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var markSchemeHelper = require('../../../../utility/markscheme/markschemehelper');
var worklistStore = require('../../../../stores/worklist/workliststore');
var responseStore = require('../../../../stores/response/responsestore');
var enahncedOffpageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var qigStore = require('../../../../stores/qigselector/qigstore');
var eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var eCourseworkContainerHelper = require('../../../utility/responsehelper/ecourseworkcontainerhelper');
var FullResponseImageViewer = require('../../responsescreen/fullresponseimageviewer');
var ImageContainer = require('../../responsescreen/imagecontainer');
var IconsDefinitionPalette = require('../../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
var AnnotationBin = require('../../responsescreen/annotationbin');
var eCourseworkContainerProperty = require('../../../utility/responsehelper/ecourseworkcontainerproperty');
var exceptionHelper = require('../../../utility/exception/exceptionhelper');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var responseActionCreator = require('../../../../actions/response/responseactioncreator');
var responseHelper = require('../../../utility/responsehelper/responsehelper');
var LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
var markingStore = require('../../../../stores/marking/markingstore');
var busyIndicatorHelper = require('../../../utility/busyindicator/busyindicatorhelper');
var applicationStore = require('../../../../stores/applicationoffline/applicationstore');
var keyDownHelper = require('../../../../utility/generic/keydownhelper');
var classNames = require('classnames');
var auditLoggingHelper = require('../../../utility/auditlogger/auditlogginghelper');
/**
 * React component class for e-course work container
 */
var ECourseWorkContainer = (function (_super) {
    __extends(ECourseWorkContainer, _super);
    /**
     * constructor for e-course work container
     * @param props
     * @param state
     */
    function ECourseWorkContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isExternalFileLoaded = false;
        this.selectedECourseworkPageID = 0;
        /**
         * Method for handling OffLinescenario Defect#5871
         */
        this.onExternalImageLoaded = function (isExternalFilesLoaded) {
            _this.isExternalFileLoaded = isExternalFilesLoaded;
        };
        /**
         * This will switch response view mode and find the active image.
         */
        this.responseViewModeChanged = function (isImageFile) {
            // finding the particular non imagefiles position and setting scroll position in FRV
            if (!isImageFile) {
                _this.setState({
                    selectedViewMode: enums.ResponseViewMode.fullResponseView
                });
                responseActionCreator.findVisibleImageId(true);
            }
        };
        /**
         * This method to update all files viewed status.
         */
        this.updateAllFilesViewed = function () {
            eCourseworkActionCreator.updateAllFilesViewedStatus();
        };
        /**
         * ECoursework metadata retrived.
         */
        this.eCourseWorkMetadataRetrived = function () {
            _this.selectFirstECourseWorkFile();
            _this.setState({ renderedOnECourseWorkFiles: Date.now() });
        };
        /**
         * This method to load course work file.
         */
        this.loadECourseworkFile = function (doAutoIndex, mediaType) {
            _this.selectedECourseworkPageID = 0;
            // Get coursework file which contain page type as page.
            var eCourseworkImageFiles = eCourseworkHelper.getSelectedECourseworkImageFile();
            var _imagesLoaded = true;
            if (eCourseworkImageFiles && mediaType !== enums.MediaType.Audio) {
                _this.loadScriptImages();
                _imagesLoaded = false;
            }
            _this.setState({
                imagesLoaded: _imagesLoaded,
                renderedOn: Date.now()
            });
        };
        /**
         * Method to handle the file read status change in progress received event.
         */
        this.fileReadStatusChangeInProgressEventReceived = function (pageId) {
            /*For multiple file selection such as image and audio or pdf and audio requires
              docstore page id to get the current ecourse work file*/
            var eCourseworkFiles = eCourseworkHelper.getCurrentEcourseworkFile(pageId);
            if (eCourseworkFiles && eCourseworkFiles.readStatus && eCourseworkFiles.readProgressStatus) {
                var isESMarkGroup = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
                var markingMode = worklistStore.instance.
                    getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
                /*If markingmode is Practice / Standardisation / ESTeamApproval then
                 set isESMarkGroup status as true.*/
                if (worklistStore && (markingMode === enums.MarkingMode.Practice ||
                    markingMode === enums.MarkingMode.Approval ||
                    markingMode === enums.MarkingMode.ES_TeamApproval ||
                    markingMode === enums.MarkingMode.Simulation)) {
                    isESMarkGroup = true;
                }
                var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                    _this.responseContainerProperty.responseData.esMarkGroupId : _this.responseContainerProperty.responseData.markGroupId;
                var fileReadStatusargument = {
                    docstorePageId: eCourseworkFiles.docPageID,
                    markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                    markGroupId: markGroupId,
                    isStdResponse: isESMarkGroup,
                    candidateScriptId: _this.responseContainerProperty.responseData.candidateScriptId
                };
                // Invoke action creator to change the file read status of selected file.(db call)
                eCourseworkResponseActionCreator.saveFileReadStatus(fileReadStatusargument);
            }
        };
        /**
         * This method to change view mode and update page number in store for creating fracs data.
         */
        this.changeViewModeWithPageNo = function () {
            var pageNo = _this.responseContainerHelper.selectedFilePageNumber;
            var isImageFile = eCourseworkHelper.getSelectedECourseworkImageFile() !== undefined;
            responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.fullResponseView, true, isImageFile, pageNo);
            new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]);
        };
        /**
         * Response view mode changed call back function
         */
        this.onViewModeChangedCallback = function () {
            // one callback function is using for setting current scroll position marksheet-container scroll position
            // in imagecontainer
            _this.responseContainerProperty.renderedImageViewerCount++;
            var linkedAnnotationsCount = _this.getLinkedAnnotationCount();
            var imagesToRenderLength = 0;
            if (_this.responseContainerProperty.imagesToRender.length > 0) {
                imagesToRenderLength = _this.responseContainerHelper.returnImageToRenderLength(_this.responseContainerProperty.imagesToRender);
            }
            // Adding the extra 1 below is for switchViewCallback props from ImageContainer (findCurrentScrollPosition())
            if (((_this.responseContainerProperty.imageZonesCollection &&
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured
                && !responseHelper.isAtypicalResponse())
                && (_this.responseContainerProperty.renderedImageViewerCount
                    === _this.responseContainerProperty.imageZonesCollection.length + 1 + linkedAnnotationsCount)) ||
                ((_this.responseContainerProperty.imagesToRender && (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
                    responseHelper.isAtypicalResponse())) &&
                    ((_this.responseContainerProperty.renderedImageViewerCount === imagesToRenderLength + 1) ||
                        (_this.responseContainerProperty.renderedImageViewerCount === imagesToRenderLength + 1 +
                            _this.responseContainerProperty.scriptHelper.getSuppressedPagesCount())))) {
                // This will find the active image container id for scrolling to that page in full response view.
                responseActionCreator.findVisibleImageId();
                _this.changeResponseViewMode();
            }
        };
        /**
         * Callback function for setting the active page for zoom
         * @param responseViewSettings - enum - zoom settings
         * @param markingMethod - enum - default value is structured.
         */
        this.setZoomOptions = function (responseViewSettings, markingMethod) {
            if (markingMethod === void 0) { markingMethod = enums.MarkingMethod.Structured; }
            // for e-coursework component we are not considering suppressed image count,
            // so for setting isValid variable consider the renderedImageViewerCount value, it is updated in the "setZoomOptionCommon" method
            var isValid = (_this.responseContainerHelper.isSelectedFileNonConvertable ||
                _this.responseContainerProperty.renderedImageViewerCount + 1 ===
                    _this.responseContainerHelper.returnImageToRenderLength(_this.responseContainerProperty.imagesToRender));
            _this.responseContainerHelper.setZoomOptionCommon(responseViewSettings, isValid, _this.state.isCommentsSideViewEnabled, markingMethod);
        };
        /**
         * Actions to be done when online status changed
         */
        this.onlineStatusChanged = function () {
            if (applicationStore.instance.isOnline) {
                /*After opening a response if application goes offline and then comes back online
                then fetchECourseWorkCandidateScriptMetadata will not get called so the file list panel will be blank,
                so executing the call again to load the ecoursework files if online*/
                if (eCourseworkHelper.isECourseworkComponent
                    && eCourseworkFileStore.instance.getCourseWorkFiles.length === 0) {
                    if (worklistStore.instance.currentWorklistType !== enums.WorklistType.live) {
                        var actualdisplayid = void 0;
                        var contents = responseStore.instance.selectedDisplayId.toString().split(' ');
                        actualdisplayid = contents[contents.length - 1];
                        eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualdisplayid));
                    }
                    else {
                        eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseStore.instance.selectedDisplayId);
                    }
                }
                if (!(_this.isExternalFileLoaded) && _this.isSelectedFileExternalImage) {
                    _this.setState({
                        imagesLoaded: false,
                        renderedOn: Date.now()
                    });
                }
            }
        };
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new eCourseworkContainerProperty();
            this.initialize();
            this.setInitialValuesAfterAuthorize();
            /* instantiating the helper with ecoursework helper*/
            this.responseContainerHelper = new eCourseworkContainerHelper(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
            this.responseContainerHelper.openResponse(this.loadScriptImages);
            this.onMarkingModeButtonClick = this.onMarkingModeButtonClick.bind(this);
            this.onViewModeChangedCallback = this.onViewModeChangedCallback.bind(this);
            this.onlineStatusChanged = this.onlineStatusChanged.bind(this);
            this.setZoomOptions = this.setZoomOptions.bind(this);
        }
    }
    /**
     * render method of e-course work component
     */
    ECourseWorkContainer.prototype.render = function () {
        var _this = this;
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        this.popupHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        var ecourseworkContainerElement;
        var header = this.responseContainerHelper.header();
        var footer = this.responseContainerHelper.footer(this.state.isConfirmationPopupDisplaying, this.resetLogoutConfirmationSatus);
        if (this.state != null && this.state.modulesLoaded && this.state.scriptLoaded && responseStore.instance.selectedDisplayId > 0
            && markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            this.selectFirstECourseWorkFile();
            this.responseContainerHelper.preRenderInitialisations(this.state.isBusy, this.state.selectedViewMode, this.state.isUnManagedSLAOPopupVisible, this.state.isUnManagedImageZonePopUpVisible);
            var pageViewClass = '';
            if (this.responseContainerProperty.isInFullResponseView) {
                pageViewClass = ' page-view-'.concat(this.state.fullResponseViewOption.toString());
                this.responseContainerProperty.fullResponseOptionValue = this.state.fullResponseViewOption;
            }
            var notSupportedElement = this.responseContainerHelper.notSupportedElement();
            var _a = this.getMarkschemeAndToolbarComponents(), markSchemePanel = _a[0], markButtonsContainer = _a[1];
            var enhancedOffpageComment = !this.responseContainerProperty.isInFullResponseView ?
                this.responseContainerHelper.enhancedOffPageComments((enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible &&
                    !enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsHidden), this.onEnhancedOffPageActionButtonsClicked, this.updateEnhancedOffPageCommentDetails, this.state.renderedOnECourseWorkFiles, this.state.hasMultipleToolbarColumns, this.state.renderedOnEnhancedOffpageComments) : null;
            ecourseworkContainerElement = (React.createElement("div", {className: 'marking-wrapper', onClick: this.onClickHandler, onDoubleClick: this.onClickHandler, onContextMenu: this.onClickHandler}, React.createElement(IconsDefinitionPalette, null), header, React.createElement(AnnotationBin, null), this.getMessageExceptionComponents(), footer, React.createElement("div", {className: this.responseContainerHelper.getResponseModeWrapperClassName(this.state.isExceptionPanelVisible, this.state.isCommentsSideViewEnabled, this.responseContainerProperty.isInFullResponseView)}, this.responseContainerHelper.markingViewButton(this.onMarkingModeButtonClick, this.onChangeResponseViewClick, responseStore.instance.markingMethod, this.onShowAnnotatedPagesOptionChanged, this.onShowAllPagesOfScriptOptionChanged, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.showRejectRigConfirmationPopUp, this.onShowUnAnnotatedAdditionalPagesOptionChanged, false, false), this.markingOverlay(), this.getToolBarPanel(), (eCourseworkHelper.getSelectedECourseworkImageFile()) ?
                this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, this.responseContainerProperty.busyIndicatorInvoker, this.autoKillLoadingIndicator, config.general.RESET_BUSY_INDICATOR_TIMEOUT) : null, this.responseContainerHelper.stampCursor(enums.CursorType.Select, 'stampCursor'), this.responseContainerHelper.stampCursor(enums.CursorType.Pan, 'stampPanCursor'), React.createElement("div", {className: 'marksheets', onMouseMove: this.onMouseMove, ref: function (ele) { _this.responseContainerProperty.markSheetContainer = ele; }}, this.saveIndicator(), React.createElement("div", {id: 'markSheetContainerInner', className: this.responseContainerHelper.getClassName(this.state.hasElementsToRenderInFRV) + pageViewClass}, enhancedOffpageComment, React.createElement("div", {className: 'relative'}, this.responseContainerHelper.fileNameIndicatorComponent(this.state.renderedOn)), this.responseContainerHelper.renderMediaPlayer(this.onCreateNewExceptionClicked), notSupportedElement, this.renderImageRegion(true), this.responseContainerHelper.offPageComments(this.state.isExceptionPanelVisible), this.popupHelper.markConfirmation())), markSchemePanel, markButtonsContainer, this.commonElements()), this.getPopupComponents()));
        }
        else {
            ecourseworkContainerElement = (React.createElement("div", null, header, this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, enums.BusyIndicatorInvoker.loadingModules, this.autoKillLoadingIndicator, 30000), footer));
        }
        return ecourseworkContainerElement;
    };
    /**
     * renders the image region
     */
    ECourseWorkContainer.prototype.renderImageRegion = function (isNonConvertableFile) {
        if (this.responseContainerProperty.isInFullResponseView) {
            return this.renderImageSection();
        }
        else {
            return eCourseworkHelper.getSelectedECourseworkImageFile() ? this.renderImageSection() : null;
        }
    };
    /**
     * Render the Image Section Based on the Response View Mode
     */
    ECourseWorkContainer.prototype.renderImageSection = function () {
        var _this = this;
        this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
        this.responseContainerProperty.loadImagecontainer = this.responseContainerHelper.isSelectedFileNonConvertable;
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded() &&
            (this.state.imagesLoaded || this.responseContainerProperty.loadImagecontainer)) {
            this.responseContainerProperty.renderedImageCount = 0;
            if (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView) {
                this.responseContainerProperty.loadImagecontainer = false;
                // Get the total url count, exclude the suppressed url.
                this.responseContainerProperty.totalImageCount = this.responseContainerProperty.fileMetadataList.filter((function (x) { return x.isSuppressed === false; })).count();
                return (React.createElement(FullResponseImageViewer, {id: 'fullResponseResponse', key: 'fullResponseResponse', fileMetadataList: this.responseContainerProperty.fileMetadataList, onImageLoaded: this.imageLoaded, fullResponseOption: this.state.fullResponseViewOption, onFullResponseViewOptionChanged: this.onFullResponseViewOptionChangedCallback, componentType: responseStore.instance.markingMethod, lastMarkSchemeId: this.responseContainerProperty.lastMarkSchemeId, isShowAnnotatedPagesOptionSelected: this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected, isShowAllPagesOfScriptOptionSelected: this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected, isShowUnAnnotatedAdditionalPagesOptionSelected: this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected, switchViewCallback: this.onMarkThisPageCallback, selectedLanguage: this.props.selectedLanguage, onLinkToButtonClick: this.onLinkToPageButtonClick, isLinkToPagePopupShowing: this.state.isLinkToPagePopupShowing, hasUnmanagedSLAO: responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ?
                    false : !this.responseContainerProperty.isSLAOManaged, unManagedSLAOFlagAsSeenClick: this.showUnManagedSLAOFlagAsSeenPopUP, allSLAOManaged: responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
                    this.onAllSLAOManaged : null, linkedPagesByPreviousMarkers: this.responseContainerProperty.linkedPagesByPreviousMarkers, isECourseworkComponent: true, displayAnnotations: false, hasElementsToRenderInFRViewMode: this.hasElementsToRenderInFRViewMode, isDrawStart: false, panEndData: [], setScrollTopAfterAllImagesLoaded: false, isEbookmarking: false, hasUnmanagedImageZones: false, unKnownContentFlagAsSeenClick: this.showUnKnownContentFlagAsSeenPopUP, hasUnmanagedImageZoneInRemark: false}));
            }
            else {
                var selectedFileMetadataList = void 0;
                if (this.responseContainerProperty.imageZonesCollection) {
                    this.responseContainerProperty.totalImageCount = 0;
                    this.responseContainerProperty.imageZonesCollection.forEach(function (imageZones) {
                        return imageZones.forEach(function () { return _this.responseContainerProperty.totalImageCount++; });
                    });
                }
                /* For ECourse response, the file metadata collection contain all file list.
                   So filter the above collection with selected course work file.
                   The above mentioned filter condition doesn't required for non digital component*/
                selectedFileMetadataList = this.responseContainerHelper.selectedFileMetadataList;
                // Get the selected doc PageID for the selected file, If component is ECoursework
                var getSelectedECourseworkImages = eCourseworkHelper.getSelectedECourseworkImages();
                if (getSelectedECourseworkImages) {
                    this.selectedECourseworkPageID = eCourseworkHelper.getSelectedECourseworkImages().docPageID;
                }
                // we only need to render image container if the ecourse work selected file is image and the image is loaded
                if (this.selectedECourseworkPageID > 0 && !this.state.imagesLoaded) {
                    return null;
                }
                return (React.createElement(ImageContainer, {id: 'image_container', selectedLanguage: this.props.selectedLanguage, switchViewCallback: this.onViewModeChangedCallback, key: 'image_container_key', responseDetails: this.responseContainerProperty.responseData, imageZonesCollection: this.responseContainerProperty.imageZonesCollection, imagesToRender: this.responseContainerProperty.imagesToRender, onImageLoaded: this.imageLoaded, fileMetadataList: selectedFileMetadataList, setZoomOptions: this.setZoomOptions, refreshImageContainer: this.state.refreshImageContainer, isResponseEditable: this.responseContainerProperty.isResponseEditable, enableCommentsSideView: this.state.isCommentsSideViewEnabled, enableCommentBox: this.responseContainerHelper.enableSideViewComment(this.state.isExceptionPanelVisible), allImagesLoaded: this.onAllImagesLoaded, hasOnPageComments: this.responseContainerProperty.hasOnPageComments, currentImageZones: this.responseContainerProperty.currentImageZones, doApplyLinkingScenarios: this.responseContainerProperty.doApplyLinkingScenarios, markThisScrollPosition: this.responseContainerProperty.markThisPageScrollPosition, pagesLinkedByPreviousMarkers: this.responseContainerProperty.linkedPagesByPreviousMarkers, multipleMarkSchemes: this.responseContainerProperty.multipleMarkSchemes, isECourseworkComponent: true, doExcludeSuppressedPage: true, selectedECourseworkPageID: this.selectedECourseworkPageID, fileNameIndicatorEnabled: this.doShowFileNameIdicatorForImageContainer, externalImageLoaded: this.onExternalImageLoaded, isEBookMarking: false}));
            }
        }
        else {
            var cssClass = 'section-loader loading';
            cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
            return (React.createElement("div", {id: 'imagecontainer', className: 'marksheets-inner-images'}, this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, this.responseContainerProperty.busyIndicatorInvoker), React.createElement(LoadingIndicator, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: cssClass})));
        }
    };
    Object.defineProperty(ECourseWorkContainer.prototype, "doShowFileNameIdicatorForImageContainer", {
        /**
         * Returns a value indicating whether file name indicator needs to be shown for the image container
         */
        get: function () {
            var lastSelectedFile = eCourseworkFileStore.instance.lastSelectedECourseworkFile;
            return (lastSelectedFile &&
                (lastSelectedFile.pageType === enums.PageType.Page || lastSelectedFile.linkData.mediaType === enums.MediaType.Image));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method for handling the first file selection of the ecoursework
     */
    ECourseWorkContainer.prototype.selectFirstECourseWorkFile = function () {
        var eCourseworkFiles = eCourseworkFileStore.instance.getCourseWorkFiles();
        var isStdSelectedResponseTab = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup;
        var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            this.responseContainerProperty.responseData.esMarkGroupId :
            this.responseContainerProperty.responseData.markGroupId;
        if (!this.responseContainerProperty.iseCourseWorkAutoFileSelected && (eCourseworkFiles !== undefined &&
            eCourseworkFiles != null && this.responseContainerProperty.responseData &&
            eCourseworkFiles.get(isStdSelectedResponseTab ?
                this.responseContainerProperty.responseData.candidateScriptId :
                markGroupId) !== undefined &&
            eCourseworkFiles.get(isStdSelectedResponseTab ?
                this.responseContainerProperty.responseData.candidateScriptId :
                markGroupId) != null)) {
            // set the iseCourseWorkAutoFileSelected to true only if the ecoursefiles for
            // the candidate is already present. Reset this value to false on response open
            this.responseContainerProperty.iseCourseWorkAutoFileSelected = true;
            eCourseworkActionCreator.eCourseworkFileSelect(eCourseworkFileStore.instance.getCourseWorkFiles().
                get(isStdSelectedResponseTab ?
                this.responseContainerProperty.responseData.candidateScriptId :
                markGroupId)[0]);
        }
    };
    /**
     * The component didmount for eCourseworkResponse
     */
    ECourseWorkContainer.prototype.componentDidMount = function () {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT, this.eCourseWorkMetadataRetrived);
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.loadECourseworkFile);
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT, this.fileReadStatusChangeInProgressEventReceived);
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED, this.updateAllFilesViewed);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
        this.setBackgroundSaveTimeInterval();
        // Blocks keyboard entry when marking overlay is visible.
        if (this.responseContainerHelper.doShowMarkingOverlay()) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarkingOverlay);
        }
    };
    /**
     * This function gets invoked when the component is about to be updated
     */
    ECourseWorkContainer.prototype.componentDidUpdate = function () {
        // Rerender the page to resize the image when the response container size changes.
        // eg: Appearing message box pane;
        /* we need to set isbusy false if no image section there as we are not showing busy indicator for audio or video */
        var selectedCourseworkImageFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        var isBusy = (selectedCourseworkImageFile) || selectedCourseworkImageFile === undefined ? true : false;
        if (this.responseContainerProperty.hasResponseLayoutChanged) {
            this.getMessagePanelRightPosition();
            this.responseContainerProperty.hasResponseLayoutChanged = false;
            this.setState({
                refreshImageContainer: Date.now(), isPlayerLoaded: this.responseContainerProperty.isPlayerLoaded,
                isBusy: isBusy
            });
        }
        else {
            this.setState({
                isPlayerLoaded: this.responseContainerProperty.isPlayerLoaded,
                isBusy: isBusy
            });
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    ECourseWorkContainer.prototype.componentWillUnmount = function () {
        this.removeCommonEventListners();
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT, this.eCourseWorkMetadataRetrived);
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, this.loadECourseworkFile);
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT, this.fileReadStatusChangeInProgressEventReceived);
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED, this.updateAllFilesViewed);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    };
    /**
     * Method to handle the Click Event of Full Response view or zone view button
     */
    ECourseWorkContainer.prototype.onMarkingModeButtonClick = function () {
        if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // Updating the latest exception list
            exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
        }
        if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
            ((this.responseContainerProperty.imageZonesCollection && this.responseContainerProperty.imageZonesCollection.length > 0)
                || (this.responseContainerProperty.imagesToRender && this.responseContainerProperty.imagesToRender.length > 0)) ||
            (this.responseContainerProperty.loadImagecontainer)) {
            this.responseContainerProperty.loadImagecontainer = false;
            this.changeViewModeWithPageNo();
        }
        else if (this.state.selectedViewMode) {
            if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView
                && (!this.responseContainerProperty.imagesToRender ||
                    this.responseContainerProperty.imagesToRender.length === 0)) {
                this.changeViewModeWithPageNo();
            }
            else {
                // Filtering this using the selected View mode because, when the modules are loading and setState is not finished
                // with their rendering component(Intial render), this call will result an endless loop in IE due to TinyMCE getting
                // delayed to initialize and toolBar panel is not unmounted :(
                // Ohh then we will wait and do it only if the value is set :)
                this.changeResponseViewMode();
            }
        }
    };
    /**
     * tool bar panel
     */
    ECourseWorkContainer.prototype.getToolBarPanel = function () {
        var toolBarPanel;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if ((this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView) &&
            (markSchemeHelper.isMarksAndMarkSchemesAreLoaded())) {
            toolBarPanel = (this.responseContainerHelper.toolbarPanel(this.state.renderedOnECourseWorkFiles, this.onMarkingModeButtonClick, this.onMessageSelected, this.onCreateNewMessageSelected, this.onMessageReadStatusRequireUpdation, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.onRemarkNowButtonClicked, this.onPromoteToSeedButtonClicked, this.onRemarkLaterButtonClicked, this.onPromoteToReuseButtonClicked, this.showRejectRigConfirmationPopUp, this.setHasMultipleToolbarColumns, this.doDisableMarkingOverlay, this.onDiscardStandardisationResponseIconClicked));
        }
        return toolBarPanel;
    };
    Object.defineProperty(ECourseWorkContainer.prototype, "isSelectedFileExternalImage", {
        /**
         * return true if the first file is convertable or not
         */
        get: function () {
            var _this = this;
            var fileMetadataList = this.responseContainerHelper.getFileMetadata();
            if (fileMetadataList) {
                var images = fileMetadataList.filter(function (item) { return item.pageId === _this.selectedECourseworkPageID && item.isImage; });
                return images.length > 0;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    return ECourseWorkContainer;
}(ResponseContainer));
module.exports = ECourseWorkContainer;
//# sourceMappingURL=ecourseworkcontainer.js.map
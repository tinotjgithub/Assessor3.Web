"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:variable-name */
var ResponseContainer = require('../responsecontainer');
var nonDigitalContainerHelper = require('../../utility/responsehelper/nondigitalcontainerhelper');
var responseStore = require('../../../stores/response/responsestore');
var enahncedOffpageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var FullResponseImageViewer = require('../responsescreen/fullresponseimageviewer');
var ImageContainer = require('../responsescreen/imagecontainer');
var worklistStore = require('../../../stores/worklist/workliststore');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var exceptionHelper = require('../../utility/exception/exceptionhelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var AnnotationBin = require('../responsescreen/annotationbin');
var IconsDefinitionPalette = require('../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
var nonDigitalContainerProperty = require('../../utility/responsehelper/nondigitalcontainerproperty');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var keyDownHelper = require('../../../utility/generic/keydownhelper');
var classNames = require('classnames');
var enums = require('../../utility/enums');
var auditLoggingHelper = require('../../utility/auditlogger/auditlogginghelper');
/**
 * React component class for NonDigitalContainer
 */
var NonDigitalContainer = (function (_super) {
    __extends(NonDigitalContainer, _super);
    /**
     * Constructor for the NonDigitalContainer component
     * @param props
     * @param state
     */
    function NonDigitalContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Response view mode changed call back function
         */
        this.onViewModeChangedCallback = function () {
            // one callback function is using for setting current scroll position marksheet-container scroll position
            // in imagecontainer
            _this.responseContainerProperty.renderedImageViewerCount++;
            var linkedAnnotationsCount = _this.getLinkedAnnotationCount();
            var imagesToRenderLength = 0;
            /* Shifted the entire condition checking to function to improve readability.
            */
            if (_this.responseContainerProperty.imagesToRender.length > 0) {
                imagesToRenderLength = _this.responseContainerHelper.returnImageToRenderLength(_this.responseContainerProperty.imagesToRender);
            }
            if (_this.renderedimageviewcount(linkedAnnotationsCount, imagesToRenderLength)) {
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
            _this.responseContainerHelper.setZoomOptionCommon(responseViewSettings, false, _this.state.isCommentsSideViewEnabled, markingMethod);
        };
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new nonDigitalContainerProperty();
            this.initialize();
            this.setInitialValuesAfterAuthorize();
            /* instantiating the helper with */
            this.responseContainerHelper = new nonDigitalContainerHelper(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
            this.responseContainerHelper.openResponse(this.loadScriptImages);
            this.onMarkingModeButtonClick = this.onMarkingModeButtonClick.bind(this);
            this.onViewModeChangedCallback = this.onViewModeChangedCallback.bind(this);
            this.setZoomOptions = this.setZoomOptions.bind(this);
        }
    }
    /**
     * Render method of the component
     */
    NonDigitalContainer.prototype.render = function () {
        var _this = this;
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        this.popupHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn, this.props.selectedLanguage, this.state.selectedViewMode);
        var nonDigitalContainerElement;
        var header = this.responseContainerHelper.header();
        var footer = this.responseContainerHelper.footer(this.state.isConfirmationPopupDisplaying, this.resetLogoutConfirmationSatus);
        if (this.state != null &&
            this.state.modulesLoaded &&
            this.state.scriptLoaded &&
            responseStore.instance.selectedDisplayId > 0 &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            this.responseContainerHelper.preRenderInitialisations(this.state.isBusy, this.state.selectedViewMode, this.state.isUnManagedSLAOPopupVisible, this.state.isUnManagedImageZonePopUpVisible);
            var responseModeWrapperClassName = this.responseContainerHelper.getResponseModeWrapperClassName(this.state.isExceptionPanelVisible, this.state.isCommentsSideViewEnabled);
            var markSheetClass = classNames('marksheets');
            var pageViewClass = '';
            if (this.responseContainerProperty.isInFullResponseView) {
                pageViewClass = ' page-view-'.concat(this.state.fullResponseViewOption.toString());
                this.responseContainerProperty.fullResponseOptionValue = this.state.fullResponseViewOption;
            }
            var _a = this.getMarkschemeAndToolbarComponents(), markSchemePanel = _a[0], markButtonsContainer = _a[1];
            var enhancedOffpageComment = !this.responseContainerProperty.isInFullResponseView
                ? this.responseContainerHelper.enhancedOffPageComments(enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible &&
                    !enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsHidden, this.onEnhancedOffPageActionButtonsClicked, this.updateEnhancedOffPageCommentDetails, this.state.renderedOnECourseWorkFiles, this.state.hasMultipleToolbarColumns, this.state.renderedOnEnhancedOffpageComments)
                : null;
            nonDigitalContainerElement = (React.createElement("div", {className: 'marking-wrapper', onClick: this.onClickHandler, onDoubleClick: this.onClickHandler, onContextMenu: this.onClickHandler}, React.createElement(IconsDefinitionPalette, null), header, React.createElement(AnnotationBin, null), this.getMessageExceptionComponents(), footer, React.createElement("div", {className: responseModeWrapperClassName}, this.responseContainerHelper.markingViewButton(this.onMarkingModeButtonClick, this.onChangeResponseViewClick, responseStore.instance.markingMethod, this.onShowAnnotatedPagesOptionChanged, this.onShowAllPagesOfScriptOptionChanged, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.showRejectRigConfirmationPopUp, this.onShowUnAnnotatedAdditionalPagesOptionChanged, true, this.responseContainerHelper.hasUnManagedImageZone()), this.markingOverlay(), this.getToolBarPanel(), this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, this.responseContainerProperty.busyIndicatorInvoker, this.autoKillLoadingIndicator, config.general.RESET_BUSY_INDICATOR_TIMEOUT), this.responseContainerHelper.stampCursor(enums.CursorType.Select, 'stampCursor'), this.responseContainerHelper.stampCursor(enums.CursorType.Pan, 'stampPanCursor'), React.createElement("div", {className: markSheetClass, onMouseMove: this.onMouseMove, ref: function (ele) {
                _this.responseContainerProperty.markSheetContainer = ele;
            }}, this.saveIndicator(), React.createElement("div", {id: 'markSheetContainerInner', className: this.responseContainerHelper.getClassName(this.state.hasElementsToRenderInFRV) + pageViewClass}, enhancedOffpageComment, this.renderImageRegion(false), this.responseContainerHelper.offPageComments(this.state.isExceptionPanelVisible), this.popupHelper.markConfirmation())), markSchemePanel, markButtonsContainer, this.commonElements()), this.getPopupComponents()));
        }
        else {
            nonDigitalContainerElement = (React.createElement("div", null, header, this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, enums.BusyIndicatorInvoker.loadingModules, this.autoKillLoadingIndicator, 30000), footer));
        }
        return nonDigitalContainerElement;
    };
    /**
     * renders the image region
     */
    NonDigitalContainer.prototype.renderImageRegion = function (isNonConvertableFile) {
        return this.renderImageSection();
    };
    /**
     * Render the Image Section Based on the Response View Mode
     */
    NonDigitalContainer.prototype.renderImageSection = function () {
        this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded() && this.state.imagesLoaded) {
            this.responseContainerProperty.renderedImageCount = 0;
            if (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView) {
                // Get the total url count, exclude the suppressed url.
                this.responseContainerProperty.totalImageCount = this.responseContainerProperty.fileMetadataList
                    .filter(function (x) { return x.isSuppressed === false; })
                    .count();
                return (React.createElement(FullResponseImageViewer, {id: 'fullResponseResponse', key: 'fullResponseResponse', fileMetadataList: this.responseContainerProperty.fileMetadataList, onImageLoaded: this.imageLoaded, fullResponseOption: this.state.fullResponseViewOption, onFullResponseViewOptionChanged: this.onFullResponseViewOptionChangedCallback, componentType: responseStore.instance.markingMethod, lastMarkSchemeId: this.responseContainerProperty.lastMarkSchemeId, isShowAnnotatedPagesOptionSelected: this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected, isShowAllPagesOfScriptOptionSelected: this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected, isShowUnAnnotatedAdditionalPagesOptionSelected: this.responseContainerProperty
                    .isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected, switchViewCallback: this.onMarkThisPageCallback, selectedLanguage: this.props.selectedLanguage, onLinkToButtonClick: this.onLinkToPageButtonClick, isLinkToPagePopupShowing: this.state.isLinkToPagePopupShowing, hasUnmanagedSLAO: responseStore.instance.markingMethod ===
                    enums.MarkingMethod.Unstructured ? (false) : (!this.responseContainerProperty.isSLAOManaged), unManagedSLAOFlagAsSeenClick: this.showUnManagedSLAOFlagAsSeenPopUP, allSLAOManaged: responseStore.instance.markingMethod ===
                    enums.MarkingMethod.Structured ? (this.onAllSLAOManaged) : null, linkedPagesByPreviousMarkers: this.responseContainerProperty.linkedPagesByPreviousMarkers, isECourseworkComponent: false, displayAnnotations: true, hasElementsToRenderInFRViewMode: this.hasElementsToRenderInFRViewMode, isDrawStart: false, panEndData: [], setScrollTopAfterAllImagesLoaded: true, isEbookmarking: responseHelper.isEbookMarking, hasUnmanagedImageZones: responseHelper.isEbookMarking ? (!this.responseContainerProperty.isUnknownContentManaged) : (false), allUnknownContentManaged: this.onAllUnknownContentManaged, unKnownContentFlagAsSeenClick: this.showUnKnownContentFlagAsSeenPopUP, hasUnmanagedImageZoneInRemark: this.responseContainerHelper.hasUnManagedImageZoneInRemark(), isStandardisationsetupmode: markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup}));
            }
            else {
                return (React.createElement(ImageContainer, {id: 'image_container', selectedLanguage: this.props.selectedLanguage, switchViewCallback: this.onViewModeChangedCallback, key: 'image_container_key', responseDetails: this.responseContainerProperty.responseData, imageZonesCollection: this.responseContainerProperty.imageZonesCollection, imagesToRender: this.responseContainerProperty.imagesToRender, onImageLoaded: this.imageLoaded, fileMetadataList: this.responseContainerProperty.fileMetadataList, setZoomOptions: this.setZoomOptions, refreshImageContainer: this.state.refreshImageContainer, isResponseEditable: this.responseContainerProperty.isResponseEditable, enableCommentsSideView: this.state.isCommentsSideViewEnabled, enableCommentBox: this.responseContainerHelper.enableSideViewComment(this.state.isExceptionPanelVisible), allImagesLoaded: this.onAllImagesLoaded, hasOnPageComments: this.responseContainerProperty.hasOnPageComments, currentImageZones: this.responseContainerProperty.currentImageZones, doApplyLinkingScenarios: this.responseContainerProperty.doApplyLinkingScenarios, markThisScrollPosition: this.responseContainerProperty.markThisPageScrollPosition, pagesLinkedByPreviousMarkers: this.responseContainerProperty.linkedPagesByPreviousMarkers, multipleMarkSchemes: this.responseContainerProperty.multipleMarkSchemes, isECourseworkComponent: false, doExcludeSuppressedPage: this.responseContainerHelper.doExcludeSuppressedPage, selectedECourseworkPageID: 0, fileNameIndicatorEnabled: false, isEBookMarking: responseHelper.isEbookMarking}));
            }
        }
        else {
            return (React.createElement("div", {id: 'imagecontainer', className: 'marksheets-inner-images'}, this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy, this.responseContainerProperty.busyIndicatorInvoker)));
        }
    };
    /**
     * The component didmount for eCourseworkResponse
     */
    NonDigitalContainer.prototype.componentDidMount = function () {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
        this.setBackgroundSaveTimeInterval();
        // Blocks keyboard entry when marking overlay is visible.
        if (this.responseContainerHelper.doShowMarkingOverlay()) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarkingOverlay);
        }
    };
    /**
     * This function gets invoked when the component is about to be updated
     */
    NonDigitalContainer.prototype.componentDidUpdate = function () {
        // Rerender the page to resize the image when the response container size changes.
        // eg: Appearing message box pane;
        if (this.responseContainerProperty.hasResponseLayoutChanged) {
            this.getMessagePanelRightPosition();
            this.responseContainerProperty.hasResponseLayoutChanged = false;
            this.setState({ refreshImageContainer: Date.now(), renderedOn: Date.now() });
        }
        if (!this.state.isBusy && this.state.doShowExceptionWarningPopUp) {
            this.displayZoningExceptionWarningPopup();
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    NonDigitalContainer.prototype.componentWillUnmount = function () {
        this.removeCommonEventListners();
    };
    /**
     * Method to handle the Click Event of Full Response view or zone view button
     */
    NonDigitalContainer.prototype.onMarkingModeButtonClick = function () {
        if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // Updating the latest exception list
            exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode);
        }
        if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
            ((this.responseContainerProperty.imageZonesCollection &&
                this.responseContainerProperty.imageZonesCollection.length > 0) ||
                (this.responseContainerProperty.imagesToRender &&
                    this.responseContainerProperty.imagesToRender.length > 0))) {
            responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.fullResponseView, true);
            new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]);
        }
        else if (this.state.selectedViewMode) {
            // Filtering this using the selected View mode because, when the modules are loading and setState is not finished
            // with their rendering component(Intial render), this call will result an endless loop in IE due to TinyMCE getting
            // delayed to initialize and toolBar panel is not unmounted :(
            // Ohh then we will wait and do it only if the value is set :)
            this.changeResponseViewMode();
        }
    };
    /**
     * tool bar panel
     */
    NonDigitalContainer.prototype.getToolBarPanel = function () {
        var toolBarPanel;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            toolBarPanel = this.responseContainerHelper.toolbarPanel(this.state.renderedOnECourseWorkFiles, this.onMarkingModeButtonClick, this.onMessageSelected, this.onCreateNewMessageSelected, this.onMessageReadStatusRequireUpdation, this.onExceptionSelected, this.onCreateNewExceptionClicked, this.onRemarkNowButtonClicked, this.onPromoteToSeedButtonClicked, this.onRemarkLaterButtonClicked, this.onPromoteToReuseButtonClicked, this.showRejectRigConfirmationPopUp, this.setHasMultipleToolbarColumns, this.doDisableMarkingOverlay, this.onDiscardStandardisationResponseIconClicked);
        }
        return toolBarPanel;
    };
    /**
     * function for setting the rendered image view count
     * @param linkedAnnotationsCount - enum - zoom settings
     * @param imagesToRenderLength- number - default value is structured.
     */
    NonDigitalContainer.prototype.renderedimageviewcount = function (linkedAnnotationsCount, imagesToRenderLength) {
        var totalImageToRender = 0;
        if (responseHelper.isEbookMarking) {
            //Calculate image to render count which include linked page for an ebook marking response.
            this.responseContainerProperty.imagesToRender.forEach(function (urls) {
                totalImageToRender = totalImageToRender + urls.length;
            });
            /* When we select a question with unknown content, so no images to be rendered in the response screen and
               the imagetoRender count is zero.
               In such a situtation we have to calculate the totalImageToRender count based on the image zone collections.
               Otherwise we won't be able to navigate FRV after selecting unknown content.'
            */
            if (this.responseContainerProperty.imagesToRender &&
                this.responseContainerProperty.imagesToRender.length === 0 &&
                this.responseContainerProperty.imageZonesCollection &&
                this.responseContainerProperty.imageZonesCollection.length > 0) {
                totalImageToRender = this.responseContainerProperty.imageZonesCollection.length;
            }
        }
        if (this.responseContainerProperty.imageZonesCollection &&
            !responseHelper.isAtypicalResponse()) {
            /*
             If below condition is true then it will navigate to full response view from ebook marking response.
             For ebook marking response rendered image count calculation based on the total image render count.
            */
            if (responseHelper.isEbookMarking &&
                this.responseContainerProperty.renderedImageViewerCount === totalImageToRender) {
                return true;
            }
            /*
             If below condition is true then it will navigate to full response view from structured response.
             For structured response, rendered image count calculation based on the image zone collection and
             linked annotation count.
             Adding the extra 1 below is for switchViewCallback props from ImageContainer (findCurrentScrollPosition())
            */
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
                this.responseContainerProperty.renderedImageViewerCount ===
                    this.responseContainerProperty.imageZonesCollection.length +
                        1 +
                        linkedAnnotationsCount) {
                return true;
            }
        }
        /*
          If below condition is true then it will navigate to full response view from unstructured response or atypical response.
          Below condition not applicable for ebook marking response.
          For unstructured or atypical response, rendered image count calculation based on the images to render count
          and suppressed image count.
          Adding the extra 1 below is for switchViewCallback props from ImageContainer (findCurrentScrollPosition())
        */
        if (this.responseContainerProperty.imagesToRender &&
            ((responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured &&
                !responseHelper.isEbookMarking) ||
                responseHelper.isAtypicalResponse()) &&
            this.responseContainerProperty.renderedImageViewerCount ===
                imagesToRenderLength +
                    1 +
                    this.responseContainerProperty.scriptHelper.getSuppressedPagesCount()) {
            return true;
        }
        return false;
    };
    return NonDigitalContainer;
}(ResponseContainer));
module.exports = NonDigitalContainer;
//# sourceMappingURL=nondigitalcontainer.js.map
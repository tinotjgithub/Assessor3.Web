/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
/* tslint:enable:variable-name */
import ResponseContainer = require('../responsecontainer');
import nonDigitalContainerHelper = require('../../utility/responsehelper/nondigitalcontainerhelper');
import loginSession = require('../../../app/loginsession');
import responseStore = require('../../../stores/response/responsestore');
import scriptStore = require('../../../stores/script/scriptstore');
import localeStore = require('../../../stores/locale/localestore');
import enahncedOffpageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import FullResponseImageViewer = require('../responsescreen/fullresponseimageviewer');
import ImageContainer = require('../responsescreen/imagecontainer');
import worklistStore = require('../../../stores/worklist/workliststore');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import exceptionHelper = require('../../utility/exception/exceptionhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import AnnotationBin = require('../responsescreen/annotationbin');
import IconsDefinitionPalette = require('../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
import nonDigitalContainerProperty = require('../../utility/responsehelper/nondigitalcontainerproperty');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import keyDownHelper = require('../../../utility/generic/keydownhelper');
let classNames = require('classnames');
import enums = require('../../utility/enums');
declare let config: any;
import auditLoggingHelper = require('../../utility/auditlogger/auditlogginghelper');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');

/**
 * React component class for NonDigitalContainer
 */
class NonDigitalContainer extends ResponseContainer {
    /**
     * Constructor for the NonDigitalContainer component
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new nonDigitalContainerProperty();
            this.initialize();
            this.setInitialValuesAfterAuthorize();

            /* instantiating the helper with */
            this.responseContainerHelper = new nonDigitalContainerHelper(
                this.responseContainerProperty,
                this.state.renderedOn,
                this.props.selectedLanguage,
                this.state.selectedViewMode
            );
            this.responseContainerHelper.openResponse(this.loadScriptImages);
            this.onMarkingModeButtonClick = this.onMarkingModeButtonClick.bind(this);
            this.onViewModeChangedCallback = this.onViewModeChangedCallback.bind(this);
            this.setZoomOptions = this.setZoomOptions.bind(this);
        }
    }

    /**
     * Render method of the component
     */
    public render(): JSX.Element {
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(
            this.responseContainerProperty,
            this.state.renderedOn,
            this.props.selectedLanguage,
            this.state.selectedViewMode
        );
        this.popupHelper.setHelperVariables(
            this.responseContainerProperty,
            this.state.renderedOn,
            this.props.selectedLanguage,
            this.state.selectedViewMode
        );

        let nonDigitalContainerElement: JSX.Element;
        let header: JSX.Element = this.responseContainerHelper.header();
        let footer: JSX.Element = this.responseContainerHelper.footer(
            this.state.isConfirmationPopupDisplaying,
            this.resetLogoutConfirmationSatus
        );

        if (this.state != null &&
            this.state.modulesLoaded &&
            this.state.scriptLoaded &&
            responseStore.instance.selectedDisplayId > 0 &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {

            this.responseContainerHelper.preRenderInitialisations(
                this.state.isBusy,
                this.state.selectedViewMode,
                this.state.isUnManagedSLAOPopupVisible,
                this.state.isUnManagedImageZonePopUpVisible
            );
            let responseModeWrapperClassName: string = this.responseContainerHelper.getResponseModeWrapperClassName(
                this.state.isExceptionPanelVisible,
                this.state.isCommentsSideViewEnabled
            );
            let markSheetClass = classNames('marksheets');
            let pageViewClass: string = '';
            if (this.responseContainerProperty.isInFullResponseView) {
                pageViewClass = ' page-view-'.concat(this.state.fullResponseViewOption.toString());
                this.responseContainerProperty.fullResponseOptionValue = this.state.fullResponseViewOption;
            }

            let [
                markSchemePanel,
                markButtonsContainer
            ] = this.getMarkschemeAndToolbarComponents();
            let enhancedOffpageComment = !this.responseContainerProperty.isInFullResponseView
                ? this.responseContainerHelper.enhancedOffPageComments(
                    enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible &&
                    !enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsHidden,
                    this.onEnhancedOffPageActionButtonsClicked,
                    this.updateEnhancedOffPageCommentDetails,
                    this.state.renderedOnECourseWorkFiles,
                    this.state.hasMultipleToolbarColumns,
                    this.state.renderedOnEnhancedOffpageComments
                )
                : null;
            nonDigitalContainerElement = (
                <div
                    className='marking-wrapper'
                    onClick={this.onClickHandler}
                    onDoubleClick={this.onClickHandler}
                    onContextMenu={this.onClickHandler}>
                    <IconsDefinitionPalette />
                    {header}
                    <AnnotationBin />
                    {this.getMessageExceptionComponents()}
                    {footer}
                    <div className={responseModeWrapperClassName}>
                        {this.responseContainerHelper.markingViewButton(
                            this.onMarkingModeButtonClick,
                            this.onChangeResponseViewClick,
                            responseStore.instance.markingMethod,
                            this.onShowAnnotatedPagesOptionChanged,
                            this.onShowAllPagesOfScriptOptionChanged,
                            this.onExceptionSelected,
                            this.onCreateNewExceptionClicked,
                            this.showRejectRigConfirmationPopUp,
                            this.onShowUnAnnotatedAdditionalPagesOptionChanged,
                            true,
                            this.responseContainerHelper.hasUnManagedImageZone()
                        )}
                        {this.markingOverlay()}
                        {this.getToolBarPanel()}
                        {this.responseContainerHelper.busyIndicator(
                            worklistStore.instance.getResponseMode,
                            this.state.isBusy,
                            this.responseContainerProperty.busyIndicatorInvoker,
                            this.autoKillLoadingIndicator,
                            config.general.RESET_BUSY_INDICATOR_TIMEOUT
                        )}
                        {this.responseContainerHelper.stampCursor(
                            enums.CursorType.Select,
                            'stampCursor'
                        )}
                        {this.responseContainerHelper.stampCursor(
                            enums.CursorType.Pan,
                            'stampPanCursor'
                        )}
                        <div
                            className={markSheetClass}
                            onMouseMove={this.onMouseMove}
                            ref={(ele) => {
                                this.responseContainerProperty.markSheetContainer = ele;
                            }}>
                            {this.saveIndicator()}
                            <div
                                id='markSheetContainerInner'
                                className={
                                    this.responseContainerHelper.getClassName(
                                        this.state.hasElementsToRenderInFRV
                                    ) + pageViewClass
                                }>
                                {enhancedOffpageComment}
                                {this.renderImageRegion(false)}
                                {this.responseContainerHelper.offPageComments(
                                    this.state.isExceptionPanelVisible
                                )}
                                {this.popupHelper.markConfirmation()}
                            </div>
                        </div>
                        {markSchemePanel}
                        {markButtonsContainer}
                        {this.commonElements()}
                    </div>
                    {this.getPopupComponents()}
                </div>
            );
        } else {
            nonDigitalContainerElement = (
                <div>
                    {header}
                    {this.responseContainerHelper.busyIndicator(
                        worklistStore.instance.getResponseMode,
                        this.state.isBusy,
                        enums.BusyIndicatorInvoker.loadingModules,
                        this.autoKillLoadingIndicator,
                        30000
                    )}
                    {footer}
                </div>
            );
        }

        return nonDigitalContainerElement;
    }

    /**
     * renders the image region
     */
    private renderImageRegion(isNonConvertableFile: boolean): JSX.Element {
        return this.renderImageSection();
    }

    /**
     * Render the Image Section Based on the Response View Mode
     */
    private renderImageSection() {
        this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded() && this.state.imagesLoaded) {
            this.responseContainerProperty.renderedImageCount = 0;
            if (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView) {
                // Get the total url count, exclude the suppressed url.
                this.responseContainerProperty.totalImageCount = this.responseContainerProperty.fileMetadataList
                    .filter((x: FileMetadata) => x.isSuppressed === false)
                    .count();
                return (
                    <FullResponseImageViewer
                        id={'fullResponseResponse'}
                        key={'fullResponseResponse'}
                        fileMetadataList={this.responseContainerProperty.fileMetadataList}
                        onImageLoaded={this.imageLoaded}
                        fullResponseOption={this.state.fullResponseViewOption}
                        onFullResponseViewOptionChanged={
                            this.onFullResponseViewOptionChangedCallback
                        }
                        componentType={responseStore.instance.markingMethod}
                        lastMarkSchemeId={this.responseContainerProperty.lastMarkSchemeId}
                        isShowAnnotatedPagesOptionSelected={
                            this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected
                        }
                        isShowAllPagesOfScriptOptionSelected={
                            this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected
                        }
                        isShowUnAnnotatedAdditionalPagesOptionSelected={
                            this.responseContainerProperty
                                .isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected
                        }
                        switchViewCallback={this.onMarkThisPageCallback}
                        selectedLanguage={this.props.selectedLanguage}
                        onLinkToButtonClick={this.onLinkToPageButtonClick}
                        isLinkToPagePopupShowing={this.state.isLinkToPagePopupShowing}
                        hasUnmanagedSLAO={
                            responseStore.instance.markingMethod ===
                                enums.MarkingMethod.Unstructured ? (
                                    false
                                ) : (
                                    !this.responseContainerProperty.isSLAOManaged
                                )
                        }
                        unManagedSLAOFlagAsSeenClick={this.showUnManagedSLAOFlagAsSeenPopUP}
                        allSLAOManaged={
                            responseStore.instance.markingMethod ===
                                enums.MarkingMethod.Structured ? (
                                    this.onAllSLAOManaged
                                ) : null
                        }
                        linkedPagesByPreviousMarkers={
                            this.responseContainerProperty.linkedPagesByPreviousMarkers
                        }
                        isECourseworkComponent={false}
                        displayAnnotations={true}
                        hasElementsToRenderInFRViewMode={this.hasElementsToRenderInFRViewMode}
                        isDrawStart={false}
                        panEndData={[]}
                        setScrollTopAfterAllImagesLoaded={true}
                        isEbookmarking={responseHelper.isEbookMarking}
                        hasUnmanagedImageZones={
                            responseHelper.isEbookMarking ? (
                                !this.responseContainerProperty.isUnknownContentManaged
                            ) : (
                                    false
                                )
                        }
                        allUnknownContentManaged={this.onAllUnknownContentManaged}
                        unKnownContentFlagAsSeenClick={this.showUnKnownContentFlagAsSeenPopUP}
                        hasUnmanagedImageZoneInRemark={this.responseContainerHelper.hasUnManagedImageZoneInRemark()}
                        isStandardisationsetupmode={
                            standardisationSetupStore.instance.isSelectResponsesWorklist
                        }
                    />
                );
            } else {
                return (
                    <ImageContainer
                        id={'image_container'}
                        selectedLanguage={this.props.selectedLanguage}
                        switchViewCallback={this.onViewModeChangedCallback}
                        key={'image_container_key'}
                        responseDetails={this.responseContainerProperty.responseData}
                        imageZonesCollection={this.responseContainerProperty.imageZonesCollection}
                        imagesToRender={this.responseContainerProperty.imagesToRender}
                        onImageLoaded={this.imageLoaded}
                        fileMetadataList={this.responseContainerProperty.fileMetadataList}
                        setZoomOptions={this.setZoomOptions}
                        refreshImageContainer={this.state.refreshImageContainer}
                        isResponseEditable={this.responseContainerProperty.isResponseEditable}
                        enableCommentsSideView={this.state.isCommentsSideViewEnabled}
                        enableCommentBox={this.responseContainerHelper.enableSideViewComment(
                            this.state.isExceptionPanelVisible
                        )}
                        allImagesLoaded={this.onAllImagesLoaded}
                        hasOnPageComments={this.responseContainerProperty.hasOnPageComments}
                        currentImageZones={this.responseContainerProperty.currentImageZones}
                        doApplyLinkingScenarios={
                            this.responseContainerProperty.doApplyLinkingScenarios
                        }
                        markThisScrollPosition={
                            this.responseContainerProperty.markThisPageScrollPosition
                        }
                        pagesLinkedByPreviousMarkers={
                            this.responseContainerProperty.linkedPagesByPreviousMarkers
                        }
                        multipleMarkSchemes={this.responseContainerProperty.multipleMarkSchemes}
                        isECourseworkComponent={false}
                        doExcludeSuppressedPage={
                            this.responseContainerHelper.doExcludeSuppressedPage
                        }
                        selectedECourseworkPageID={0}
                        fileNameIndicatorEnabled={false}
                        isEBookMarking={responseHelper.isEbookMarking}
                    />
                );
            }
        } else {
            return (
                <div id='imagecontainer' className={'marksheets-inner-images'}>
                    {this.responseContainerHelper.busyIndicator(
                        worklistStore.instance.getResponseMode,
                        this.state.isBusy,
                        this.responseContainerProperty.busyIndicatorInvoker
                    )}
                </div>
            );
        }
    }

    /**
     * The component didmount for eCourseworkResponse
     */
    public componentDidMount() {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
        this.setBackgroundSaveTimeInterval();

        // Blocks keyboard entry when marking overlay is visible.
        if (this.responseContainerHelper.doShowMarkingOverlay()) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarkingOverlay);
        }
    }

    /**
     * This function gets invoked when the component is about to be updated
     */
    public componentDidUpdate() {
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
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        this.removeCommonEventListners();
    }

    /**
     * Method to handle the Click Event of Full Response view or zone view button
     */
    protected onMarkingModeButtonClick() {
        if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // Updating the latest exception list
            exceptionHelper.getNewExceptions(
                markerOperationModeFactory.operationMode.isTeamManagementMode,
                markerOperationModeFactory.operationMode.isAwardingMode
            );
        }
        if (
            this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
            ((this.responseContainerProperty.imageZonesCollection &&
                this.responseContainerProperty.imageZonesCollection.length > 0) ||
                (this.responseContainerProperty.imagesToRender &&
                    this.responseContainerProperty.imagesToRender.length > 0))
        ) {
            responseActionCreator.changeResponseViewMode(
                enums.ResponseViewMode.fullResponseView,
                true
            );
            new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
                enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]
            );
        } else if (this.state.selectedViewMode) {
            // Filtering this using the selected View mode because, when the modules are loading and setState is not finished
            // with their rendering component(Intial render), this call will result an endless loop in IE due to TinyMCE getting
            // delayed to initialize and toolBar panel is not unmounted :(
            // Ohh then we will wait and do it only if the value is set :)
            this.changeResponseViewMode();
        }
    }

    /**
     * Response view mode changed call back function
     */
    protected onViewModeChangedCallback = () => {
        // one callback function is using for setting current scroll position marksheet-container scroll position
        // in imagecontainer
        this.responseContainerProperty.renderedImageViewerCount++;

        let linkedAnnotationsCount: number = this.getLinkedAnnotationCount();
        let imagesToRenderLength: number = 0;
        /* Shifted the entire condition checking to function to improve readability.
        */
        if (this.responseContainerProperty.imagesToRender.length > 0) {
            imagesToRenderLength = this.responseContainerHelper.returnImageToRenderLength(
                this.responseContainerProperty.imagesToRender
            );
        }
        if (this.renderedimageviewcount(linkedAnnotationsCount, imagesToRenderLength)) {
            responseActionCreator.findVisibleImageId();
            this.changeResponseViewMode();
        }
    };

    /**
     * tool bar panel
     */
    private getToolBarPanel(): JSX.Element {
        let toolBarPanel: JSX.Element;
        // Checking whether marks and markschemes are loaded for showing markscheme.
        if (
            this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView &&
            markSchemeHelper.isMarksAndMarkSchemesAreLoaded()
        ) {
            toolBarPanel = this.responseContainerHelper.toolbarPanel(
                this.state.renderedOnECourseWorkFiles,
                this.onMarkingModeButtonClick,
                this.onMessageSelected,
                this.onCreateNewMessageSelected,
                this.onMessageReadStatusRequireUpdation,
                this.onExceptionSelected,
                this.onCreateNewExceptionClicked,
                this.onRemarkNowButtonClicked,
                this.onPromoteToSeedButtonClicked,
                this.onRemarkLaterButtonClicked,
                this.onPromoteToReuseButtonClicked,
                this.showRejectRigConfirmationPopUp,
                this.setHasMultipleToolbarColumns,
                this.doDisableMarkingOverlay,
                this.onDiscardStandardisationResponseIconClicked
            );
        }
        return toolBarPanel;
    }

    /**
     * Callback function for setting the active page for zoom
     * @param responseViewSettings - enum - zoom settings
     * @param markingMethod - enum - default value is structured.
     */
    protected setZoomOptions = (
        responseViewSettings: enums.ResponseViewSettings,
        markingMethod: enums.MarkingMethod = enums.MarkingMethod.Structured
    ) => {
        this.responseContainerHelper.setZoomOptionCommon(
            responseViewSettings,
            false,
            this.state.isCommentsSideViewEnabled,
            markingMethod
        );
    };

    /**
     * function for setting the rendered image view count
     * @param linkedAnnotationsCount - enum - zoom settings
     * @param imagesToRenderLength- number - default value is structured.
     */
    private renderedimageviewcount(
        linkedAnnotationsCount: number,
        imagesToRenderLength: number
    ): boolean {
        let totalImageToRender: number = 0;
        if (responseHelper.isEbookMarking) {
            //Calculate image to render count which include linked page for an ebook marking response.
            this.responseContainerProperty.imagesToRender.forEach((urls: string[]) => {
                totalImageToRender = totalImageToRender + urls.length;
            });

            /* When we select a question with unknown content, so no images to be rendered in the response screen and
               the imagetoRender count is zero.
               In such a situtation we have to calculate the totalImageToRender count based on the image zone collections.
               Otherwise we won't be able to navigate FRV after selecting unknown content.'
            */
            if (
                this.responseContainerProperty.imagesToRender &&
                this.responseContainerProperty.imagesToRender.length === 0 &&
                this.responseContainerProperty.imageZonesCollection &&
                this.responseContainerProperty.imageZonesCollection.length > 0
            ) {
                totalImageToRender = this.responseContainerProperty.imageZonesCollection.length;
            }
        }

        if (
            this.responseContainerProperty.imageZonesCollection &&
            !responseHelper.isAtypicalResponse()
        ) {
            /*
             If below condition is true then it will navigate to full response view from ebook marking response.
             For ebook marking response rendered image count calculation based on the total image render count.
            */
            if (
                responseHelper.isEbookMarking &&
                this.responseContainerProperty.renderedImageViewerCount === totalImageToRender
            ) {
                return true;
            }

            /*
             If below condition is true then it will navigate to full response view from structured response.
             For structured response, rendered image count calculation based on the image zone collection and
             linked annotation count.
             Adding the extra 1 below is for switchViewCallback props from ImageContainer (findCurrentScrollPosition())
            */
            if (
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured &&
                this.responseContainerProperty.renderedImageViewerCount ===
                this.responseContainerProperty.imageZonesCollection.length +
                1 +
                linkedAnnotationsCount
            ) {
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
        if (
            this.responseContainerProperty.imagesToRender &&
            ((responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured &&
                !responseHelper.isEbookMarking) ||
                responseHelper.isAtypicalResponse()) &&
            this.responseContainerProperty.renderedImageViewerCount ===
            imagesToRenderLength +
            1 +
            this.responseContainerProperty.scriptHelper.getSuppressedPagesCount()
        ) {
            return true;
        }

        return false;
    }
}

export = NonDigitalContainer;

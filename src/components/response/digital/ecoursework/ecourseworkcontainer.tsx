import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import loginSession = require('../../../../app/loginsession');
import ResponseContainer = require('../../responsecontainer');
import eCourseworkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import ccHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import eCourseworkActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import enums = require('../../../utility/enums');
import eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import markSchemeHelper = require('../../../../utility/markscheme/markschemehelper');
import worklistStore = require('../../../../stores/worklist/workliststore');
import responseStore = require('../../../../stores/response/responsestore');
import enahncedOffpageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import eCourseworkContainerHelper = require('../../../utility/responsehelper/ecourseworkcontainerhelper');
import FullResponseImageViewer = require('../../responsescreen/fullresponseimageviewer');
import ImageContainer = require('../../responsescreen/imagecontainer');
import IconsDefinitionPalette = require('../../toolbar/stamppanel/stampdefinition/iconsdefinitionpalette');
import AnnotationBin = require('../../responsescreen/annotationbin');
import eCourseworkContainerProperty = require('../../../utility/responsehelper/ecourseworkcontainerproperty');
import exceptionHelper = require('../../../utility/exception/exceptionhelper');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import responseHelper = require('../../../utility/responsehelper/responsehelper');
import eCourseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
import markingStore = require('../../../../stores/marking/markingstore');
import busyIndicatorHelper = require('../../../utility/busyindicator/busyindicatorhelper');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import awardingStore = require('../../../../stores/awarding/awardingstore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
let classNames = require('classnames');
declare let config: any;
import auditLoggingHelper = require('../../../utility/auditlogger/auditlogginghelper');

/**
 * props of e-course work container
 */
interface Props extends PropsBase, LocaleSelectionBase {
}

/**
 * React component class for e-course work container
 */
class ECourseWorkContainer extends ResponseContainer {

    private isExternalFileLoaded: boolean = false;

    private selectedECourseworkPageID: number = 0;

    /**
     * constructor for e-course work container
     * @param props
     * @param state
     */

    constructor(props: Props, state: any) {
        super(props, state);
        // If authentication failed then the page is refreshed, redirect to login page.
        if (this.isLoginSessionAuthenticated()) {
            /* instantiating the property base which holds all the protected variables of response container*/
            this.responseContainerProperty = new eCourseworkContainerProperty();
            this.initialize();
            this.setInitialValuesAfterAuthorize();

            /* instantiating the helper with ecoursework helper*/
            this.responseContainerHelper = new eCourseworkContainerHelper(this.responseContainerProperty, this.state.renderedOn,
                this.props.selectedLanguage, this.state.selectedViewMode);
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
    public render(): JSX.Element {
        /* instantiating the helper with */
        this.responseContainerHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn,
            this.props.selectedLanguage, this.state.selectedViewMode);
        this.popupHelper.setHelperVariables(this.responseContainerProperty, this.state.renderedOn,
            this.props.selectedLanguage, this.state.selectedViewMode);
        let ecourseworkContainerElement: JSX.Element;
        let header: JSX.Element = this.responseContainerHelper.header();
        let footer: JSX.Element =
            this.responseContainerHelper.footer(this.state.isConfirmationPopupDisplaying,
                this.resetLogoutConfirmationSatus);

        if (this.state != null && this.state.modulesLoaded && this.state.scriptLoaded && responseStore.instance.selectedDisplayId > 0
            && markSchemeHelper.isMarksAndMarkSchemesAreLoaded()) {
            this.selectFirstECourseWorkFile();
            this.responseContainerHelper.preRenderInitialisations(this.state.isBusy,
                this.state.selectedViewMode, this.state.isUnManagedSLAOPopupVisible, this.state.isUnManagedImageZonePopUpVisible);
            let pageViewClass: string = '';
            if (this.responseContainerProperty.isInFullResponseView) {
                pageViewClass = ' page-view-'.concat(this.state.fullResponseViewOption.toString());
                this.responseContainerProperty.fullResponseOptionValue = this.state.fullResponseViewOption;
            }

            let notSupportedElement = this.responseContainerHelper.notSupportedElement();
            let [markSchemePanel, markButtonsContainer] = this.getMarkschemeAndToolbarComponents();

            let enhancedOffpageComment = !this.responseContainerProperty.isInFullResponseView ?
                this.responseContainerHelper.enhancedOffPageComments
                    ((enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsPanelVisible &&
                        !enahncedOffpageCommentStore.instance.isEnhancedOffPageCommentsHidden),
                    this.onEnhancedOffPageActionButtonsClicked, this.updateEnhancedOffPageCommentDetails,
                    this.state.renderedOnECourseWorkFiles, this.state.hasMultipleToolbarColumns,
                    this.state.renderedOnEnhancedOffpageComments) : null;
            ecourseworkContainerElement = (
                <div className='marking-wrapper'
                    onClick={this.onClickHandler}
                    onDoubleClick={this.onClickHandler}
                    onContextMenu={this.onClickHandler}>
                    <IconsDefinitionPalette />
                    {header}
                    <AnnotationBin />
                    {this.getMessageExceptionComponents()}
                    {footer}
                    <div className={this.responseContainerHelper.getResponseModeWrapperClassName
                        (this.state.isExceptionPanelVisible, this.state.isCommentsSideViewEnabled,
                        this.responseContainerProperty.isInFullResponseView)}>
                        {this.responseContainerHelper.markingViewButton(this.onMarkingModeButtonClick,
                            this.onChangeResponseViewClick, responseStore.instance.markingMethod, this.onShowAnnotatedPagesOptionChanged,
                            this.onShowAllPagesOfScriptOptionChanged, this.onExceptionSelected, this.onCreateNewExceptionClicked,
                            this.showRejectRigConfirmationPopUp, this.onShowUnAnnotatedAdditionalPagesOptionChanged, false, false)}
                        {this.markingOverlay()}
                        {this.getToolBarPanel()}
                        {(eCourseworkHelper.getSelectedECourseworkImageFile()) ?
                            this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode,
                                this.state.isBusy, this.responseContainerProperty.busyIndicatorInvoker, this.autoKillLoadingIndicator,
                                config.general.RESET_BUSY_INDICATOR_TIMEOUT) : null}
                        {this.responseContainerHelper.stampCursor(enums.CursorType.Select, 'stampCursor')}
                        {this.responseContainerHelper.stampCursor(enums.CursorType.Pan, 'stampPanCursor')}
                        <div className={'marksheets'} onMouseMove={this.onMouseMove}
                            ref={(ele) => { this.responseContainerProperty.markSheetContainer = ele; }}>
                            {this.saveIndicator()}
                            <div id='markSheetContainerInner'
                                className={this.responseContainerHelper.getClassName(this.state.hasElementsToRenderInFRV) + pageViewClass}>
                                {enhancedOffpageComment}
                                <div className='relative'>
                                    {this.responseContainerHelper.fileNameIndicatorComponent(this.state.renderedOn)}
                                </div>
                                {this.responseContainerHelper.renderMediaPlayer(this.onCreateNewExceptionClicked)}
                                {notSupportedElement}
                                {this.renderImageRegion(true)}
                                {this.responseContainerHelper.offPageComments(this.state.isExceptionPanelVisible)}
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
            ecourseworkContainerElement = (<div>
                {header}
                {this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy,
                    enums.BusyIndicatorInvoker.loadingModules, this.autoKillLoadingIndicator, 30000)}
                {footer}
            </div>);
        }

        return ecourseworkContainerElement;
    }

    /**
     * renders the image region
     */
    private renderImageRegion(isNonConvertableFile: boolean): JSX.Element {

        if (this.responseContainerProperty.isInFullResponseView) {
            return this.renderImageSection();
        } else {
            return eCourseworkHelper.getSelectedECourseworkImageFile() ? this.renderImageSection() : null;
        }
    }

    /**
     * Render the Image Section Based on the Response View Mode
     */
    private renderImageSection() {
        this.responseContainerProperty.fileMetadataList = this.responseContainerHelper.getFileMetadata();
        this.responseContainerProperty.loadImagecontainer = this.responseContainerHelper.isSelectedFileNonConvertable;
        if (markSchemeHelper.isMarksAndMarkSchemesAreLoaded() &&
            (this.state.imagesLoaded || this.responseContainerProperty.loadImagecontainer)) {
            this.responseContainerProperty.renderedImageCount = 0;
            if (this.state.selectedViewMode === enums.ResponseViewMode.fullResponseView) {
                this.responseContainerProperty.loadImagecontainer = false;
                // Get the total url count, exclude the suppressed url.
                this.responseContainerProperty.totalImageCount = this.responseContainerProperty.fileMetadataList.filter((
                    (x: FileMetadata) => x.isSuppressed === false)).count();
                return (
                    <FullResponseImageViewer id={'fullResponseResponse'}
                        key={'fullResponseResponse'}
                        fileMetadataList={this.responseContainerProperty.fileMetadataList}
                        onImageLoaded={this.imageLoaded}
                        fullResponseOption={this.state.fullResponseViewOption}
                        onFullResponseViewOptionChanged={this.onFullResponseViewOptionChangedCallback}
                        componentType={responseStore.instance.markingMethod}
                        lastMarkSchemeId={this.responseContainerProperty.lastMarkSchemeId}
                        isShowAnnotatedPagesOptionSelected={this.responseContainerProperty.isOnlyShowUnAnnotatedPagesOptionSelected}
                        isShowAllPagesOfScriptOptionSelected={this.responseContainerProperty.isShowAllPagesOfScriptOptionSelected}
                        isShowUnAnnotatedAdditionalPagesOptionSelected=
                        {this.responseContainerProperty.isOnlyShowUnUnAnnotatedAdditionalPagesOptionSelected}
                        switchViewCallback={this.onMarkThisPageCallback}
                        selectedLanguage={this.props.selectedLanguage}
                        onLinkToButtonClick={this.onLinkToPageButtonClick}
                        isLinkToPagePopupShowing={this.state.isLinkToPagePopupShowing}
                        hasUnmanagedSLAO={responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ?
                            false : !this.responseContainerProperty.isSLAOManaged}
                        unManagedSLAOFlagAsSeenClick={this.showUnManagedSLAOFlagAsSeenPopUP}
                        allSLAOManaged={responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
                            this.onAllSLAOManaged : null}
                        linkedPagesByPreviousMarkers={this.responseContainerProperty.linkedPagesByPreviousMarkers}
                        isECourseworkComponent={true}
                        displayAnnotations={false}
                        hasElementsToRenderInFRViewMode={this.hasElementsToRenderInFRViewMode}
                        isDrawStart={false}
                        panEndData={[]}
                        setScrollTopAfterAllImagesLoaded={false}
                        isEbookmarking={false}
                        hasUnmanagedImageZones={false}
                        unKnownContentFlagAsSeenClick={this.showUnKnownContentFlagAsSeenPopUP}
                        hasUnmanagedImageZoneInRemark={false} />
                );
            } else {
                let selectedFileMetadataList: Immutable.List<FileMetadata>;
                if (this.responseContainerProperty.imageZonesCollection) {
                    this.responseContainerProperty.totalImageCount = 0;
                    this.responseContainerProperty.imageZonesCollection.forEach((imageZones: Immutable.List<ImageZone>) =>
                        imageZones.forEach(() => this.responseContainerProperty.totalImageCount++));
                }

                /* For ECourse response, the file metadata collection contain all file list.
                   So filter the above collection with selected course work file.
                   The above mentioned filter condition doesn't required for non digital component*/
                selectedFileMetadataList = this.responseContainerHelper.selectedFileMetadataList;

                // Get the selected doc PageID for the selected file, If component is ECoursework
                let getSelectedECourseworkImages = eCourseworkHelper.getSelectedECourseworkImages();
                if (getSelectedECourseworkImages) {
                    this.selectedECourseworkPageID = eCourseworkHelper.getSelectedECourseworkImages().docPageID;
                }

                // we only need to render image container if the ecourse work selected file is image and the image is loaded
                if (this.selectedECourseworkPageID > 0 && !this.state.imagesLoaded) {
                    return null;
                }

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
                        fileMetadataList={selectedFileMetadataList}
                        setZoomOptions={this.setZoomOptions}
                        refreshImageContainer={this.state.refreshImageContainer}
                        isResponseEditable={this.responseContainerProperty.isResponseEditable}
                        enableCommentsSideView={this.state.isCommentsSideViewEnabled}
                        enableCommentBox={this.responseContainerHelper.enableSideViewComment(this.state.isExceptionPanelVisible)}
                        allImagesLoaded={this.onAllImagesLoaded}
                        hasOnPageComments={this.responseContainerProperty.hasOnPageComments}
                        currentImageZones={this.responseContainerProperty.currentImageZones}
                        doApplyLinkingScenarios={this.responseContainerProperty.doApplyLinkingScenarios}
                        markThisScrollPosition={this.responseContainerProperty.markThisPageScrollPosition}
                        pagesLinkedByPreviousMarkers={this.responseContainerProperty.linkedPagesByPreviousMarkers}
                        multipleMarkSchemes={this.responseContainerProperty.multipleMarkSchemes}
                        isECourseworkComponent={true}
                        doExcludeSuppressedPage={true}
                        selectedECourseworkPageID={this.selectedECourseworkPageID}
                        fileNameIndicatorEnabled={this.doShowFileNameIdicatorForImageContainer}
                        externalImageLoaded={this.onExternalImageLoaded}
                        isEBookMarking={false} />
                );
            }
        } else {
            let cssClass: string = 'section-loader loading';
            cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
            return (
                <div id='imagecontainer' className={'marksheets-inner-images'}>
                    {this.responseContainerHelper.busyIndicator(worklistStore.instance.getResponseMode, this.state.isBusy,
                        this.responseContainerProperty.busyIndicatorInvoker)}
                    <LoadingIndicator id={enums.BusyIndicatorInvoker.none.toString()}
                        key={enums.BusyIndicatorInvoker.none.toString()} cssClass={cssClass} />
                </div>
            );
        }
    }

    /**
     * Returns a value indicating whether file name indicator needs to be shown for the image container
     */
    private get doShowFileNameIdicatorForImageContainer(): boolean {

        let lastSelectedFile: eCourseWorkFile = eCourseworkFileStore.instance.lastSelectedECourseworkFile;
        return (lastSelectedFile &&
            (lastSelectedFile.pageType === enums.PageType.Page || lastSelectedFile.linkData.mediaType === enums.MediaType.Image));
    }

    /**
     * Method for handling OffLinescenario Defect#5871
     */
    private onExternalImageLoaded = (isExternalFilesLoaded: boolean): void => {
        this.isExternalFileLoaded = isExternalFilesLoaded;
    }

    /**
     * Method for handling the first file selection of the ecoursework
     */
    private selectFirstECourseWorkFile() {
        let eCourseworkFiles = eCourseworkFileStore.instance.getCourseWorkFiles();
        let isStdSelectedResponseTab = standardisationSetupStore.instance.isSelectResponsesWorklist;
        let responseItemGroup: ResponseItemGroup = awardingStore.instance.selectedCandidateData
            ? awardingStore.instance.selectedCandidateData.responseItemGroups[0] : undefined;
        let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            this.responseContainerProperty.responseData.esMarkGroupId : markerOperationModeFactory.operationMode.isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].markGroupId :
                this.responseContainerProperty.responseData.markGroupId;
        if (!this.responseContainerProperty.iseCourseWorkAutoFileSelected && (eCourseworkFiles !== undefined &&
            eCourseworkFiles != null && (this.responseContainerProperty.responseData || responseItemGroup) &&
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
    }

    /**
     * The component didmount for eCourseworkResponse
     */
    public componentDidMount() {
        if (this.state == null) {
            return;
        }
        this.addCommonEventListners();
        eCourseworkFileStore.instance.addListener(
            eCourseworkFileStore.ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT,
            this.eCourseWorkMetadataRetrived);
        eCourseworkFileStore.instance.addListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.loadECourseworkFile);
        eCourseworkFileStore.instance.addListener(
            eCourseworkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT,
            this.fileReadStatusChangeInProgressEventReceived);
        eCourseworkFileStore.instance.addListener(
            eCourseworkFileStore.ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED,
            this.updateAllFilesViewed);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        applicationStore.instance.addListener
            (applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
        this.setBackgroundSaveTimeInterval();
        // Blocks keyboard entry when marking overlay is visible.
        if (this.responseContainerHelper.doShowMarkingOverlay()) {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarkingOverlay);
        }
    }

    /**
     * This will switch response view mode and find the active image.
     */
    protected responseViewModeChanged = (isImageFile: boolean): void => {

        // finding the particular non imagefiles position and setting scroll position in FRV
        if (!isImageFile) {
            this.setState({
                selectedViewMode: enums.ResponseViewMode.fullResponseView
            });
            responseActionCreator.findVisibleImageId(true);
        }
    };

    /**
     * This function gets invoked when the component is about to be updated
     */
    public componentDidUpdate() {
        // Rerender the page to resize the image when the response container size changes.
        // eg: Appearing message box pane;
        /* we need to set isbusy false if no image section there as we are not showing busy indicator for audio or video */
        let selectedCourseworkImageFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        let isBusy = (selectedCourseworkImageFile) || selectedCourseworkImageFile === undefined ? true : false;
        if (this.responseContainerProperty.hasResponseLayoutChanged) {
            this.getMessagePanelRightPosition();
            this.responseContainerProperty.hasResponseLayoutChanged = false;
            this.setState({
                refreshImageContainer: Date.now(), isPlayerLoaded: this.responseContainerProperty.isPlayerLoaded,
                isBusy: isBusy
            });
        } else {
            this.setState({
                isPlayerLoaded: this.responseContainerProperty.isPlayerLoaded,
                isBusy: isBusy
            });
        }

    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        this.removeCommonEventListners();
        eCourseworkFileStore.instance.removeListener(
            eCourseworkFileStore.ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT,
            this.eCourseWorkMetadataRetrived);
        eCourseworkFileStore.instance.removeListener(eCourseworkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.loadECourseworkFile);
        eCourseworkFileStore.instance.removeListener(
            eCourseworkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT,
            this.fileReadStatusChangeInProgressEventReceived);
        eCourseworkFileStore.instance.removeListener(
            eCourseworkFileStore.ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED,
            this.updateAllFilesViewed);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    }

    /**
     * This method to update all files viewed status.
     */
    private updateAllFilesViewed = () => {
        eCourseworkActionCreator.updateAllFilesViewedStatus();
    }

    /**
     * ECoursework metadata retrived.
     */
    private eCourseWorkMetadataRetrived = (): void => {
        this.selectFirstECourseWorkFile();
        this.setState({ renderedOnECourseWorkFiles: Date.now() });
    }

    /**
     * This method to load course work file.
     */
    private loadECourseworkFile = (doAutoIndex: boolean, mediaType: enums.MediaType) => {
        this.selectedECourseworkPageID = 0;
        // Get coursework file which contain page type as page.
        let eCourseworkImageFiles = eCourseworkHelper.getSelectedECourseworkImageFile();
        let _imagesLoaded: boolean = true;
        if (eCourseworkImageFiles && mediaType !== enums.MediaType.Audio) {
            this.loadScriptImages();
            _imagesLoaded = false;
        }
        this.setState({
            imagesLoaded: _imagesLoaded,
            renderedOn: Date.now()
        });
    }

    /**
     * Method to handle the file read status change in progress received event.
     */
    private fileReadStatusChangeInProgressEventReceived = (pageId: number): void => {
        /*For multiple file selection such as image and audio or pdf and audio requires
          docstore page id to get the current ecourse work file*/
        let eCourseworkFiles = eCourseworkHelper.getCurrentEcourseworkFile(pageId);
        if (eCourseworkFiles && eCourseworkFiles.readStatus && eCourseworkFiles.readProgressStatus) {
            let isESMarkGroup: boolean = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
            let markingMode = worklistStore.instance.
                getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
            /*If markingmode is Practice / Standardisation / ESTeamApproval then
             set isESMarkGroup status as true.*/
            if (worklistStore && (markingMode === enums.MarkingMode.Practice ||
                markingMode === enums.MarkingMode.Approval ||
                markingMode === enums.MarkingMode.ES_TeamApproval ||
                markingMode === enums.MarkingMode.Simulation)) {
                isESMarkGroup = true;
            }
            let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                this.responseContainerProperty.responseData.esMarkGroupId : this.responseContainerProperty.responseData.markGroupId;
            let fileReadStatusargument: ECourseworkFileReadStatusArguments = {
                docstorePageId: eCourseworkFiles.docPageID,
                markSchemeGroupId: qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId,
                markGroupId: markGroupId,
                isStdResponse: isESMarkGroup,
                candidateScriptId: this.responseContainerProperty.responseData.candidateScriptId
            };
            // Invoke action creator to change the file read status of selected file.(db call)
            eCourseworkResponseActionCreator.saveFileReadStatus(fileReadStatusargument);
        }
    }

    /**
     * Method to handle the Click Event of Full Response view or zone view button
     */
    protected onMarkingModeButtonClick() {
        if (!markerOperationModeFactory.operationMode.isStandardisationSetupMode) {
            // Updating the latest exception list
            exceptionHelper.getNewExceptions(markerOperationModeFactory.operationMode.isTeamManagementMode,
                markerOperationModeFactory.operationMode.isAwardingMode);
        }
        if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView &&
            ((this.responseContainerProperty.imageZonesCollection && this.responseContainerProperty.imageZonesCollection.length > 0)
                || (this.responseContainerProperty.imagesToRender && this.responseContainerProperty.imagesToRender.length > 0)) ||
            (this.responseContainerProperty.loadImagecontainer)) {
            this.responseContainerProperty.loadImagecontainer = false;
            this.changeViewModeWithPageNo();

        } else if (this.state.selectedViewMode) {

            if (this.state.selectedViewMode === enums.ResponseViewMode.zoneView
                && (!this.responseContainerProperty.imagesToRender ||
                    this.responseContainerProperty.imagesToRender.length === 0)) {
                this.changeViewModeWithPageNo();
            } else {
                // Filtering this using the selected View mode because, when the modules are loading and setState is not finished
                // with their rendering component(Intial render), this call will result an endless loop in IE due to TinyMCE getting
                // delayed to initialize and toolBar panel is not unmounted :(
                // Ohh then we will wait and do it only if the value is set :)
                this.changeResponseViewMode();
            }
        }
    }

    /**
     * This method to change view mode and update page number in store for creating fracs data.
     */
    private changeViewModeWithPageNo = () => {
        let pageNo: number = this.responseContainerHelper.selectedFilePageNumber;
        let isImageFile: boolean = eCourseworkHelper.getSelectedECourseworkImageFile() !== undefined;
        responseActionCreator.changeResponseViewMode(enums.ResponseViewMode.fullResponseView, true,
            isImageFile, pageNo);
        new auditLoggingHelper().logHelper.logEventOnResponseViewModeChange(
            enums.ResponseViewMode[enums.ResponseViewMode.fullResponseView]);
    };

    /**
     * Response view mode changed call back function
     */
    protected onViewModeChangedCallback = () => {
        // one callback function is using for setting current scroll position marksheet-container scroll position
        // in imagecontainer
        this.responseContainerProperty.renderedImageViewerCount++;

        let linkedAnnotationsCount: number = this.getLinkedAnnotationCount();
        let imagesToRenderLength: number = 0;
        if (this.responseContainerProperty.imagesToRender.length > 0) {
            imagesToRenderLength = this.responseContainerHelper.returnImageToRenderLength
                (this.responseContainerProperty.imagesToRender);
        }

        // Adding the extra 1 below is for switchViewCallback props from ImageContainer (findCurrentScrollPosition())
        if (((this.responseContainerProperty.imageZonesCollection &&
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured
            && !responseHelper.isAtypicalResponse())
            && (this.responseContainerProperty.renderedImageViewerCount
                === this.responseContainerProperty.imageZonesCollection.length + 1 + linkedAnnotationsCount)) ||
            ((this.responseContainerProperty.imagesToRender && (responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
                markerOperationModeFactory.operationMode.isAwardingMode ||
                responseHelper.isAtypicalResponse())) &&
                ((this.responseContainerProperty.renderedImageViewerCount === imagesToRenderLength + 1) ||
                    (this.responseContainerProperty.renderedImageViewerCount === imagesToRenderLength + 1 +
                        this.responseContainerProperty.scriptHelper.getSuppressedPagesCount())))) {
            // This will find the active image container id for scrolling to that page in full response view.
            responseActionCreator.findVisibleImageId();
            this.changeResponseViewMode();
        }
    }

    /**
     * tool bar panel
     */
    private getToolBarPanel(): JSX.Element {

        let toolBarPanel: JSX.Element;

        // Checking whether marks and markschemes are loaded for showing markscheme.
        if ((this.state.selectedViewMode !== enums.ResponseViewMode.fullResponseView) &&
            (markSchemeHelper.isMarksAndMarkSchemesAreLoaded())) {

            toolBarPanel = (this.responseContainerHelper.toolbarPanel
                (this.state.renderedOnECourseWorkFiles, this.onMarkingModeButtonClick, this.onMessageSelected,
                this.onCreateNewMessageSelected, this.onMessageReadStatusRequireUpdation,
                this.onExceptionSelected, this.onCreateNewExceptionClicked, this.onRemarkNowButtonClicked,
                this.onPromoteToSeedButtonClicked, this.onRemarkLaterButtonClicked,
                this.onPromoteToReuseButtonClicked, this.showRejectRigConfirmationPopUp,
                this.setHasMultipleToolbarColumns, this.doDisableMarkingOverlay, this.onDiscardStandardisationResponseIconClicked));
        }
        return toolBarPanel;
    }

    /**
     * Callback function for setting the active page for zoom
     * @param responseViewSettings - enum - zoom settings
     * @param markingMethod - enum - default value is structured.
     */
    protected setZoomOptions = (responseViewSettings: enums.ResponseViewSettings,
        markingMethod: enums.MarkingMethod = enums.MarkingMethod.Structured) => {

        // for e-coursework component we are not considering suppressed image count,
        // so for setting isValid variable consider the renderedImageViewerCount value, it is updated in the "setZoomOptionCommon" method
        let isValid: boolean = (this.responseContainerHelper.isSelectedFileNonConvertable ||
            this.responseContainerProperty.renderedImageViewerCount + 1 ===
            this.responseContainerHelper.returnImageToRenderLength(this.responseContainerProperty.imagesToRender));
        this.responseContainerHelper.setZoomOptionCommon(responseViewSettings, isValid, this.state.isCommentsSideViewEnabled,
            markingMethod);
    };

    /**
     * Actions to be done when online status changed
     */
    private onlineStatusChanged = () => {
        if (applicationStore.instance.isOnline) {
            /*After opening a response if application goes offline and then comes back online
            then fetchECourseWorkCandidateScriptMetadata will not get called so the file list panel will be blank,
            so executing the call again to load the ecoursework files if online*/
            if (eCourseworkHelper.isECourseworkComponent
                && eCourseworkFileStore.instance.getCourseWorkFiles.length === 0) {
                if (worklistStore.instance.currentWorklistType !== enums.WorklistType.live) {
                    let actualdisplayid: string;
                    let contents = responseStore.instance.selectedDisplayId.toString().split(' ');
                    actualdisplayid = contents[contents.length - 1];
                    eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(actualdisplayid));
                } else {
                    eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(responseStore.instance.selectedDisplayId);
                }
            }

            if (!(this.isExternalFileLoaded) && this.isSelectedFileExternalImage) {
                this.setState({
                    imagesLoaded: false,
                    renderedOn: Date.now()
                });
            }
        }

    };

    /**
     * return true if the first file is convertable or not
     */
    private get isSelectedFileExternalImage(): boolean {
        let fileMetadataList: Array<FileMetadata> = this.responseContainerHelper.getFileMetadata();
        if (fileMetadataList) {
            let images = fileMetadataList.filter(item => item.pageId === this.selectedECourseworkPageID && item.isImage);
            return images.length > 0;
        }

        return false;
    }
}

export = ECourseWorkContainer;
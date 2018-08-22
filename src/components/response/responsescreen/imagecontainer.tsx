/* tslint:disable:no-unused-variable */
import React = require('react');
import annotation = require('../../../stores/response/typings/annotation');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import Immutable = require('immutable');
import SingleImageViewer = require('./singleimageviewer');
import StitchedImageViewer = require('./stitchedimageviewer');
import responseStore = require('../../../stores/response/responsestore');
import stampStore = require('../../../stores/stamp/stampstore');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
let classNames = require('classnames');
import UnStructuredResponseImageViewer = require('./unstructuredresponseimageviewer');
import enums = require('../../utility/enums');
import deviceHelper = require('../../../utility/touch/devicehelper');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import ContextMenu = require('../../utility/contextmenu/contextmenu');
import contextMenuHelper = require('../../utility/contextmenu/contextmenuhelper');
import userOptionHelper = require('../../../utility/useroption/useroptionshelper');
import qigStore = require('../../../stores/qigselector/qigstore');
import markingStore = require('../../../stores/marking/markingstore');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import PageNumberIndicator = require('./pagenumberindicator');
import moduleKeyHandler = require('../../../utility/generic/modulekeyhandler');
import modulekeys = require('../../../utility/generic/modulekeys');
import keyDownHelper = require('../../../utility/generic/keydownhelper');
import keycodes = require('../../../utility/keyboardacess/keycodes');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import panEventArgs = require('./typings/paneventargs');
import CommentContainer = require('../annotations/comments/commentcontainer');
import Zoomable = require('../../utility/zoom/Zoomable');
import ZoomableUnstructuredImage = require('./zoomableunstructuredimage');
import ZoomableStructuredImage = require('./zoomablestructuredimage');
import stringHelper = require('../../../utility/generic/stringhelper');
import zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
import Promise = require('es6-promise');
import $ = require('jquery');
import localeStore = require('../../../stores/locale/localestore');
import fitResponseAction = require('../../../actions/zoompanel/fitresponseaction');
import constants = require('../../utility/constants');
import LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
import busyIndicatorHelper = require('../../utility/busyindicator/busyindicatorhelper');
import messageStore = require('../../../stores/message/messagestore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import timerHelper = require('../../../utility/generic/timerhelper');
import onPageCommentHelper = require('../../utility/annotation/onpagecommenthelper');
import zoomHelper = require('./zoomhelper/zoomhelper');
import pageLinkHelper = require('./linktopage/pagelinkhelper');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import FileNameIndicator = require('./filenameindicator');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import worklistStore = require('../../../stores/worklist/workliststore');
import enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import BookmarkStampBox = require('../annotations/bookmarkstampbox');
import markingactioncreator = require('../../../actions/marking/markingactioncreator');
import toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
import fracsHelper = require('../../../utility/generic/fracshelper');
import awardingHelper = require('../../utility/awarding/awardinghelper');
import awardingStore = require('../../../stores/awarding/awardingstore');

interface Props extends PropsBase, LocaleSelectionBase {
    imageZonesCollection: Immutable.List<ImageZone>[];
    responseDetails: ResponseBase;
    imagesToRender: string[][];
    onImageLoaded: Function;
    switchViewCallback: Function;
    fileMetadataList: Immutable.List<FileMetadata>;
    setZoomOptions: Function;
    refreshImageContainer: number;
    isResponseEditable: boolean;
    enableCommentsSideView: boolean;
    enableCommentBox: boolean;
    allImagesLoaded: Function;
    hasOnPageComments: boolean;
    currentImageZones: Immutable.List<ImageZone>;
    doApplyLinkingScenarios: boolean;
    markThisScrollPosition: number;
    pagesLinkedByPreviousMarkers: number[];
    multipleMarkSchemes: any;
    isECourseworkComponent: boolean;
    doExcludeSuppressedPage: boolean;
    fileNameIndicatorEnabled: boolean;
    selectedECourseworkPageID: number;
    externalImageLoaded?: Function;

    isEBookMarking: boolean;
}

interface State {
    renderedOn?: number;
    isMouseHover?: boolean;
    zoomPreference?: enums.ZoomPreference;
    zoomabeleWidth?: number;
    refreshZoom?: number;
    commentContainerRight?: number;
    refreshCommentSideView?: number;
    isExternalImageFileLoaded?: boolean;
    renderedOnBookmark?: number;
    resetZoomClass?: number;
    containerDimensionChangedOn?: number;
}

/**
 * Properties for Hide Comments Side View component
 * @param {Props} props
 */
interface HideCommentsPanelProps extends PropsBase {
    sideViewToggleCallback: Function;
    panelStyle: React.CSSProperties;
}

/* tslint:disable:variable-name */
const HideCommentsPanel = (props: HideCommentsPanelProps) => (
    <div className='relative'>
        <div id='hideCommentsSideView' className='hide-comment-holder'
            title={localeStore.instance.TranslateText('marking.response.comments-side-view.hide-comments-tooltip')}
            style={props.panelStyle}>
            <a href='javascript:void(0);' onClick={() => { props.sideViewToggleCallback(); }}
                className='hide-comment-link'>{localeStore.instance.TranslateText('marking.response.comments-side-view.hide-comments')}
            </a>
        </div>
    </div>
);

const COMMENT_CONTAINER_PADDING = 5;
const BOOKMARK_TEXTBOX_POINITING_ARROW_SIZE = 56;

/**
 * React component class for Image Zone container.
 */
class ImageContainer extends pureRenderComponent<Props, State> {

    private isOnPageCommentStamped: boolean = false;
    private images: string[];
    private cursorDivStyle: React.CSSProperties = { 'top': 0, 'left': 0 };
    private isUnStructured: boolean = false;
    private static PADDING_VALUE_BETWEEN_IMAGES: number = 10;
    private scrollHeightRatio: number;
    private orientationChange: boolean = false;
    private _changeDeviceOrientation: EventListenerObject = null;
    private isDrawStart: boolean = false;
    private isMarksAndAnnotationsLoaded: boolean = false;

    // cache of scroll top positions of all the images rendered.
    private scrollTopCache: Immutable.Map<number, number>;

    // The no: of images rendered.
    private renderedImageCount: number = 0;
    private clientImageWidth: number;
    private naturalImageWidth: number;
    private naturalImageHeight: number;
    private minimumNaturalImageWidth: number;
    private minimumNaturalImageHeight: number;

    // Hold a value indicating the previous scroll top when
    // zoom begins
    private scrollPosition: number = 0;

    // Holds a value indicating previous marksheet view holder width
    // when zoom begins
    private previousContainerWidth: number = 0;

    // Holds a value indicating previous marksheet view holder scroll left
    // when zoom begins
    private previousScrollLeft: number = 0;

    //to store the rotaed images
    private rotatedImages: string[] = [];

    // holds a value to rerender the zoomable component to update to the latest width
    // eg: message panel appears
    private refreshZoomComponent: number;

    // Holds a variable indicating the zoomable container width
    private zoomedContainerWidth: number;

    // setting the rotated image width while zooming.
    private rotatedImageWidth: number;
    private pinchZoomFactor: number;

    private currentZoomPercentage: number;

    // flag for enabling scroll
    private doEnableScroll: boolean = true;

    // Holds a value indicating the previous zoom width
    // which is updating when pinch to zoom is happening
    private previousZoomWidth: number = 0;

    // Holding a value indicating the zoom origin
    private zoomX: number = 0;
    private zoomY: number = 0;

    // Indicating whether response is ready for pinch zoom.
    private isPinchReady: boolean = false;

    // Holds a value indicating updated zoom type to zoom
    private updatedZoomType: Array<number> = [];

    // Holds the last pinch scale factor
    private pinchScaleFactor: number = 0;

    private isZoomingInitiated: boolean = false;
    private marginTop: number = 0;
    private marginLeft: number = 0;
    private zoomType: enums.ZoomType;
    private hookPointTopPercentage: any;
    private hookPointLeftPercentage: any;
    private animating: boolean = false;
    private commentContainerRight: number = 0;

    private fracsLoadedImageCount: number = 0;
    // Holds marksheet-container values
    private markSheetWrapper: MarkSheetWrapper = undefined;
    private structuredImageZone: Array<StructuredImageZone> = new Array<StructuredImageZone>();

    // Holds the biggest aspected ratio to check whether the horizontal scroll bar comes while fit-height.
    private biggestRatio: number = 0;
    // detect horizontal or vertical scroll
    private markSheetScrollLeft: number = 0;
    private markSheetScrollTop: number = 0;

    private isUserOptionZoom: boolean = false;
    private imageDimensions: any[];
    private doApplyLinkingScenarios: boolean;

    private isFirstCommentOnSideView: boolean = false;
    private previousScrollHeightRatio: number = 0;

    // Value indicating to freeze the comment sideview on view.
    // This will draw a dummy sideview over the existing one.
    private freezeCommentSideView: boolean = false;

    // Hold the initial click value on zoom till animationend called.
    private previousImageWidth: number = 0;
    private allowRenderSideViewComments: boolean = false;

    //Holds bookmark initial text
    private bookmarkText: string = '';

    //holds book mark client token
    private bookmarkClientToken: string = '';

    private bookmarkRotatedAngle: enums.RotateAngle;

    //holds book mark Top position
    private bookmarkTop: number = 0;

    //holds book mark Left position
    private bookmarkLeft: number = 0;

    //holds book mark Text box visibility
    private isBookmarkTextBoxOpen: boolean = false;

    //Hold the Bookmark text box position
    private bookmarkTextboxPosition: string = 'left';

    //Hold the enhancedOffPage comment hegith for calculating the zoomy value
    private enhancedOffPageCommentHeight: number;

    private isBookletView: boolean = false;

    // This will hold mark sheet container height before changing that.
    private previousMarkSheetContainerHeight: number;
    private previousMarkSheetContainerWidth: number;
    private currentImageIdToScroll: string;
    private isSideViewPanelToggled: boolean = false;
    private isFileViewPanelToggled: boolean = true;
    private scrollRatioAgainstCurrentVisibleImage: number;

    // This will check whether manual scrolling is happening.
    private isManuallyScrolling: boolean = true;
    private imageContainerHeight: number = 0;
    private imageContainerWidth: number = 0;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0,
            isMouseHover: false,
            zoomPreference: enums.ZoomPreference.None,
            zoomabeleWidth: 0,
            refreshZoom: 0,
            refreshCommentSideView: 0,
            isExternalImageFileLoaded: false,
            renderedOnBookmark: 0,
            resetZoomClass: 0,
            containerDimensionChangedOn: 0
        };

        this.scrollTopCache = Immutable.Map<number, number>();
        this.imageLoaded = this.imageLoaded.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onWheelHandler = this.onWheelHandler.bind(this);
        this._changeDeviceOrientation = this.changeDeviceOrientation.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.reRender = this.reRender.bind(this);
        this.onAnnotationDrawStart = this.onAnnotationDrawStart.bind(this);
        this.onZoomOptionChanged = this.onZoomOptionChanged.bind(this);
        this.setResponseScroll = this.setResponseScroll.bind(this);
        this.storeCurrentResponseScroll = this.storeCurrentResponseScroll.bind(this);
        this.onCustomZoomUpdated = this.onCustomZoomUpdated.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onImageContainerClicked = this.onImageContainerClicked.bind(this);
        this.onAnnotationAdded = this.onAnnotationAdded.bind(this);
        this.onResponsePinchToZoomStarted = this.onResponsePinchToZoomStarted.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.toggleCommentsSideView = this.toggleCommentsSideView.bind(this);
        this.setScrollForZoom = this.setScrollForZoom.bind(this);

        this.naturalImageWidth = 0;
        this.clientImageWidth = 0;
        this.naturalImageHeight = 0;
        this.refreshZoomComponent = Date.now();
        this.zoomedContainerWidth = 0;
        this.rotatedImageWidth = 0;
        this.enhancedOffPageCommentHeight = Number(userOptionHelper.getUserOptionByName(
            userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));

        this.onPinchZoom = this.onPinchZoom.bind(this);
        this.onPinchEnd = this.onPinchEnd.bind(this);
        this.onPinchStart = this.onPinchStart.bind(this);
        this.getZoomableComponentWidth = this.getZoomableComponentWidth.bind(this);
        this.onResponseImageRotationCompleted = this.onResponseImageRotationCompleted.bind(this);
        this.minimumNaturalImageWidth = 0;
        this.minimumNaturalImageHeight = 0;
        this.currentZoomPercentage = undefined;
        this.structuredFracsDataLoaded = this.structuredFracsDataLoaded.bind(this);
        this.handleMarksAndAnnotationsVisibility = this.handleMarksAndAnnotationsVisibility.bind(this);
        this.onToggleCommentsSideView = this.onToggleCommentsSideView.bind(this);
        this.imageDimensions = [];
        this.doApplyLinkingScenarios = this.props.doApplyLinkingScenarios;
        this.resetCommentRightAttribute = this.resetCommentRightAttribute.bind(this);
        this.onPanelHeightChange = this.onPanelHeightChange.bind(this);
        this.onOffPageCommentPanelResize = this.onOffPageCommentPanelResize.bind(this);
        this.bookmarkSelected = this.bookmarkSelected.bind(this);
        this.goBackButtonClicked = this.goBackButtonClicked.bind(this);
        this.setFocusToBookmarkTextBox = this.setFocusToBookmarkTextBox.bind(this);
        this.showOrHideBookmarkTextBox = this.showOrHideBookmarkTextBox.bind(this);
        this.onZoomUpdated = this.onZoomUpdated.bind(this);
        this.onScrollPositionChanged = this.onScrollPositionChanged.bind(this);
    }

    /** refs */
    public refs: {
        [key: string]: (Element);
        markSheet: (HTMLInputElement);
        imageContainer: Element;
    };

    /**
     * Render component
     */
    public render(): JSX.Element {
        // In Structured components if images are not available against zones then we need to display the on-screen marking confirmation
        // For structured components zones might be there which has no images in them so returing markconfirmation.
        if (!this.props.isECourseworkComponent && !this.props.isEBookMarking &&
            (this.props.imagesToRender == null || this.props.imagesToRender.length === 0)) {
            this.props.onImageLoaded(0, 0, false);
            return (null);
        }
        let _className: string = '';
        let index = 0;
        let toRender = null;
        let renderImages = null;
        let loadingIndicator = null;

        let commentContainerOnPage: JSX.Element;
        let commentContainerSideView: JSX.Element;
        let bookmarkStampBox: JSX.Element;
        let marksheetContainerLeft: number;

        if (this.isSideViewEnabledAndVisible) {
            let markSheetElement = htmlUtilities.getElementsByClassName('marksheet-container');
            if (markSheetElement[0]) {
                marksheetContainerLeft = markSheetElement[0].scrollLeft;
                if (marksheetContainerLeft > 0) { marksheetContainerLeft = -1 * marksheetContainerLeft; }
            }
        }

        // Structured Response
        if (this.props.imageZonesCollection) {
            // calculate the biggest ratio to check whether response has a horizontal scroll bar
            this.calculateBiggestRatio();
        }

        if (this.hasAllScriptImagesLoaded) {
            commentContainerOnPage = this.isSideViewEnabledAndVisible ? null :
                <CommentContainer id='comment'
                    key='comment'
                    selectedLanguage={this.props.selectedLanguage}
                    naturalImageWidth={this.minimumNaturalImageWidth}
                    naturalImageHeight={this.minimumNaturalImageHeight}
                    enableCommentsSideView={this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices}
                    renderedOn={0}
                    enableCommentBox={this.props.enableCommentBox}
                    selectedZoomPreference={this.state.zoomPreference}
                    isEBookMarking={this.props.isEBookMarking}
                />;

            commentContainerSideView = this.isSideViewEnabledAndVisible ?
                <CommentContainer id='commentSideViewContainer'
                    key='commentSideViewContainer'
                    selectedLanguage={this.props.selectedLanguage}
                    naturalImageWidth={this.minimumNaturalImageWidth}
                    naturalImageHeight={this.minimumNaturalImageHeight}
                    enableCommentsSideView={this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices}
                    renderedOn={this.state.refreshCommentSideView}
                    commentContainerRight={marksheetContainerLeft}
                    enableCommentBox={this.props.enableCommentBox}
                    selectedZoomPreference={this.state.zoomPreference}
                    isEBookMarking={this.props.isEBookMarking}
                /> : null;
        } else if (!this.hasAllScriptImagesLoaded) {
            let cssClass: string = 'section-loader loading';
            cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
            loadingIndicator = (<LoadingIndicator id={enums.BusyIndicatorInvoker.none.toString()}
                key={enums.BusyIndicatorInvoker.none.toString()} cssClass={cssClass} />);
        }

        // Structured Response
        if (this.props.imageZonesCollection) {
            if (this.props.imageZonesCollection.length > 0) {
                let that = this;
                if (this.props.isEBookMarking) {
                    renderImages = this.renderEbookmarkingSingleImage(this.props.imageZonesCollection, index);
                    let hasZonedImages = this.props.imageZonesCollection[0].some(x => x.height > 0);
                    /* render the linked pages , the scecond collection contains the linked images and first holds the zoned images.
                    Checking >1 for taking from the second collection */

                    // below variable used to assign continuous outputpage no to linked page.
                    let rendereImagesCount = renderImages.length;
                    this.props.imagesToRender.map((images: string[], collectionIndex: number) => {
                        if (collectionIndex >= 1 || !hasZonedImages) {
                            this.doApplyLinkingScenarios = true;
                            renderImages = renderImages.concat(this.renderLinkedImages(images, rendereImagesCount));
                            rendereImagesCount++;
                        }
                    });
                    /* If none of normal or linked images there the unzoned indicator should be visibile . Handling the same here*/
                    if (this.props.imagesToRender.length === 0 && renderImages.length === 0) {
                        return (that.renderSingleImage(this.props.imageZonesCollection[0].first(), 1, 1));
                    }
                } else {
                    // calculate the biggest ratio to check whether response has a horizontal scroll bar
                    renderImages = this.props.imageZonesCollection.map((imageZones: Immutable.List<ImageZone>) => {
                        if (imageZones.count() === 1) {
                            let imageCount: number = index++;
                            return (that.renderSingleImage(imageZones.first(), imageCount, imageCount));
                        } else {
                            return (that.renderStichedImages(imageZones, index++));
                        }
                    });

                    // render the linked pages
                    this.props.imagesToRender.map((images: string[], collectionIndex: number) => {
                        if (collectionIndex >= index) {
                            this.doApplyLinkingScenarios = true;
                            renderImages = renderImages.concat(this.renderLinkedImages(images, collectionIndex));
                        }
                    });
                }

                toRender = (
                    <div className={classNames('marksheet-container active',
                        { 'not-loaded': !this.hasAllScriptImagesLoaded },
                        this.getZoomLevelClass())}
                        ref={'markSheet'}>
                        <Zoomable onPinchZoom={this.onPinchZoom}
                            onPinchEnd={this.onPinchEnd}
                            onPinchStart={this.onPinchStart}
                            forceUpdate={this.refreshZoomComponent}
                            onContainerWidthUpdated={this.getZoomableComponentWidth}
                            onTransitionEnd={this.onAnimationEnd}
                            zoomPreference={this.state.zoomPreference}
                            onZoomingInitiated={this.storeCurrentResponseScroll}>
                            <ZoomableStructuredImage
                                userZoomValue={responseStore.instance.userZoomValue}
                                naturalImageWidth={this.naturalImageWidth}
                                clientImageWidth={this.clientImageWidth}
                                renderedOn={this.state.refreshZoom}
                                setResponseScroll={this.setResponseScroll}
                                naturalImageHeight={this.naturalImageHeight}
                                responseOrientationChanged={this.onResponseImageRotationCompleted}
                                pinchZoomFactor={this.pinchZoomFactor}
                                structuredImageZone={this.structuredImageZone}
                                sideViewEnabledAndVisible={this.isSideViewEnabledAndVisible}
                                currentQuestion={markingStore.instance.currentQuestionItemInfo ?
                                    markingStore.instance.currentQuestionItemInfo.uniqueId : 0}>
                                {renderImages}
                            </ZoomableStructuredImage>
                        </Zoomable>
                        {commentContainerSideView}
                    </div>
                );
            }
            this.isUnStructured = false;

        } else { // Unstructured Response

            bookmarkStampBox = <BookmarkStampBox id={'bookmark-stamp-box'}
                key={'bookmark-stamp-box'}
                top={this.bookmarkTop}
                left={this.bookmarkLeft}
                bookmarkText={this.bookmarkText}
                bookmarkPosition={this.bookmarkTextboxPosition}
                clientToken={this.bookmarkClientToken}
                renderedOn={this.state.renderedOnBookmark}
                isVisible={this.isBookmarkTextBoxOpen} />;

            let pageNoWithoutSuppressed = 0;

            renderImages = this.fileMetadataList.map((fileMetadata: FileMetadata) => {
                let currentIndex: number = index++;
                let pageNo = this.props.doExcludeSuppressedPage ? fileMetadata.pageNumber : currentIndex + 1;

                return (
                    <UnStructuredResponseImageViewer
                        id={'image_unstructured_' + currentIndex}
                        key={'key_image_Unstructured_' + currentIndex}
                        selectedLanguage={this.props.selectedLanguage}
                        switchViewCallback={this.props.switchViewCallback}
                        imageUrl={fileMetadata.url}
                        onImageLoaded={this.imageLoaded}
                        getMarkSheetContainerProperties={this.getMarkSheetContainerProperties}
                        zoomPreference={this.state.zoomPreference}
                        setZoomOptions={this.props.setZoomOptions}
                        isDrawStart={this.isDrawStart}
                        renderedOn={this.state.renderedOn}
                        onRotation={this.onRotation}
                        imageOrder={pageNo}
                        isResponseEditable={this.props.isResponseEditable}
                        enableImageContainerScroll={this.enableImageContainerScroll}
                        enableCommentBox={this.props.enableCommentBox}
                        naturalImageWidth={this.naturalImageWidth}
                        naturalImageHeight={this.naturalImageHeight}
                        hasRotatedImages={responseStore.instance.hasRotatedImagesWithOddAngle}
                        enableCommentsSideView={this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices}
                        onScrollForZoom={this.setScrollForZoom}
                        isECourseworkComponent={this.props.isECourseworkComponent}
                        pageNo={fileMetadata.pageNumber}
                        getImageNaturalDimension={this.getImageNaturalDimension}
                        refreshCommnetContainer={this.refreshCommentContainer}
                        pageNoWithoutSuppressed={(fileMetadata.isSuppressed) ? pageNoWithoutSuppressed : ++pageNoWithoutSuppressed}
                        setScrollPositionCallback={this.findCurrentScrollPosition}
                        marksheetContainerHeight={this.imageContainerHeight}
                        marksheetContainerWidth={this.imageContainerWidth} />
                );
            });

            toRender = (
                <div className={classNames('marksheet-container active',
                    { 'not-loaded': !this.hasAllScriptImagesLoaded },
                    this.getZoomLevelClass())}
                    ref={'markSheet'}>
                    {bookmarkStampBox}
                    <Zoomable onPinchZoom={this.onPinchZoom}
                        onPinchEnd={this.onPinchEnd}
                        onPinchStart={this.onPinchStart}
                        forceUpdate={this.refreshZoomComponent}
                        onContainerWidthUpdated={this.getZoomableComponentWidth}
                        onTransitionEnd={this.onAnimationEnd}
                        zoomPreference={this.state.zoomPreference}
                        onZoomingInitiated={this.storeCurrentResponseScroll}>
                        <ZoomableUnstructuredImage
                            selectedECourseworkPageID={this.props.selectedECourseworkPageID}
                            userZoomValue={this.getUserZoomValue()}
                            naturalImageWidth={this.naturalImageWidth}
                            clientImageWidth={this.clientImageWidth}
                            renderedOn={this.state.refreshZoom}
                            setResponseScroll={this.setResponseScroll}
                            naturalImageHeight={this.naturalImageHeight}
                            responseOrientationChanged={this.onResponseImageRotationCompleted}
                            sideViewEnabledAndVisible={this.isSideViewEnabledAndVisible}
                            pinchZoomFactor={this.pinchZoomFactor}>
                            {renderImages}
                        </ZoomableUnstructuredImage>
                    </Zoomable>
                    {commentContainerSideView}
                </div>
            );

            this.isUnStructured = true;
        }

        // for nonconvertable files, this.props.imagesToRender is undefined and there is only one page to show,
        // so numberOfPages is always 1
        let numberOfPages: number = this.isExternalImageFile ? 1 : this.props.imagesToRender.length > 0 ?
            this.props.imagesToRender[0].length : 0;

        let pageNumberIndicatorComponent: JSX.Element = this.isUnStructured ? <PageNumberIndicator
            noOfImages={numberOfPages} /> : null;

        let fileNameIndicatorComponent: JSX.Element = this.props.fileNameIndicatorEnabled ? <FileNameIndicator
            key='filename-Indicator-key' renderedOn={this.state.renderedOn} /> : null;

        let markSheetContainer: any = htmlUtilities.getElementsByClassName('marksheet-container')[0];
        let scrollWidth: number = markSheetContainer ? (markSheetContainer.offsetWidth - markSheetContainer.clientWidth) : 0;

        // Freeze the comment sideview.
        let panelCssStyle: React.CSSProperties = this.freezeCommentSideView ?
            { height: '100vh', right: scrollWidth } : { right: scrollWidth };


        let hideCommentsSideViewComponent: JSX.Element = this.isSideViewEnabledAndVisible ?
            <HideCommentsPanel key='hideCommentsSideView'
                id='hideCommentsSideView'
                sideViewToggleCallback={this.toggleCommentsSideView}
                panelStyle={panelCssStyle} /> : null;

        return (
            <div id='imagecontainer'
                ref={'imageContainer'}
                onScroll={this.onScrollHandler}
                onWheel={this.onWheelHandler}
                onMouseDown={this.onMouseDownHandler}
                className={'marksheets-inner-images'}
                onClick={this.onImageContainerClicked} >
                <ContextMenu
                    id='context-menu'
                    key='context-menu' />
                {commentContainerOnPage}
                {this.getResponseZoomStyle()}
                {fileNameIndicatorComponent}
                {pageNumberIndicatorComponent}
                {hideCommentsSideViewComponent}
                {toRender}
                {loadingIndicator}
            </div>
        );
    }

    /*sets the pan enable status for the annotation overlay*/
    public enableImageContainerScroll = (value: boolean): void => {
        this.doEnableScroll = value;
    };

    /* touch move event for image container*/
    private onTouchMoveHandler = (event: any) => {
        if (!this.doEnableScroll && htmlUtilities.isTabletOrMobileDevice) {
            event.preventDefault();
        }
    };

    /**
     * returns wether the selected coursework file has a rotated image or not
     */
    private get isRotatedImage(): boolean {
        let isRotatedImage = false;
        let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            this.props.fileMetadataList.forEach((fileMetadata: FileMetadata) => {
                if (!fileMetadata.isSuppressed) {
                    let pageNumber = fileMetadata.pageNumber;
                    let displayAngle = 0;
                    displayAngleCollection.forEach((angle: number, key: string) => {
                        /*changing the condition angle >0 because while rotating anti clockwise the angle will come as negative so it
                        will not return the rotated image as true.
                        This is for ecoursework component and it is unstructured, Appending 0 as output page number*/
                        if ((key === 'img_' + pageNumber + '_0') && angle !== 0) {
                            isRotatedImage = true;
                        }
                    });
                }
            });
        }
        return isRotatedImage;
    }

    /**
     * Get the Response Zoom Style
     */
    private getResponseZoomStyle(): JSX.Element {
        let maxWidth = (this.state.zoomabeleWidth * 2) + ($(window).width() - $('.marksheet-zoom-holder').width());
        let minWidth = maxWidth + 1;
        let zoomableWidth: number = 0;
        if (this.isSideViewEnabledAndVisible) {
            zoomableWidth = this.state.zoomabeleWidth;
        } else {
            zoomableWidth = this.state.zoomabeleWidth * 2;
        }

        if (!htmlUtilities.isTabletOrMobileDevice && this.state.zoomabeleWidth > 0) {
            if (this.state.zoomPreference === enums.ZoomPreference.Percentage && this.hasAllScriptImagesLoaded) {
                //No need of booklte view if any rotaed images there or the  comment side view is enabled
                /* for ecoursework component check wether the selected file has any rotatd images*/
                if (((this.props.isECourseworkComponent && !this.isRotatedImage) ||
                    !responseStore.instance.hasRotatedImages) && !this.isExternalImageFile) {
                    if (this.isUnStructured) {
                        return (
                            <style>{'.marksheet-holder{font-size:' + ((this.state.zoomabeleWidth / 2) / 10) + 'px; width:'
                                + this.state.zoomabeleWidth + 'px; margin-left:0;\
                            }\
                              @media screen and (max-width: ' + maxWidth + 'px){\
	                             .marksheet-view-holder {\
                                            width:' + this.state.zoomabeleWidth + 'px;\
                                  }\
                            }\
                            @media screen and (min-width:' + minWidth + 'px) {\
	                            .marksheet-view-holder { width:' + Math.ceil(zoomableWidth) + 'px; }\
	                            .content-wrapper:not(.side-page) .marksheet-holder.suppressed{display:block; }\
                                .content-wrapper:not(.side-page) .marksheets .page-number-marksheet,\
	                            .content-wrapper:not(.side-page) .marksheet-holder:first-child { \
                                                        margin-left: ' + this.state.zoomabeleWidth + 'px; \
                                            }\
                                .content-wrapper:not(.side-page) .rotate-button-holder A {\
                                opacity:0.4;\
                                    pointer-events:none; \
                                   }\
                                .content-wrapper:not(.side-page) .marksheet-zoom-holder .marksheet-holder.suppressed:first-child' +
                                ' + .marksheet-holder .marksheet-holder-inner{\
                            margin-top: 3%; \
                            }\
                              }\
                        '}
                            </style>
                        );
                    } else {
                        //////Setting the width for marksheet-view-holder & marksheet-holder inline.
                        //////Individual width for marksheet- holder for structured images.
                        return null;
                    }
                } else {
                    if (this.isUnStructured) {
                        return (
                            <style> {'.marksheet-holder {font-size:' + ((this.state.zoomabeleWidth / 2) / 10) + 'px; width:' +
                                this.state.zoomabeleWidth + 'px;\
                            }\
                            .marksheet-holder.rotate-270,\
                            .marksheet-holder.rotate-90 {\
                                  width:' + this.rotatedImageWidth + 'px;\
                            }\
                              @media screen and (max-width:' + maxWidth + 'px) {\
	                               .marksheet-view-holder{\
                                          width:' + this.rotatedImageWidth + 'px;\
                                    }\
                            }\
                              @media screen and (min-width:' + minWidth + 'px) {\
	                                .marksheet-view-holder {\
                                            width:' + this.rotatedImageWidth + 'px;\
                                  }\
                               }\
                        '}
                            </style>
                        );
                    } else {
                        return null;
                    }
                }
            }

        } else {
            return null;
        }
    }

    /**
     * Setting marksheetContainer/ViewHolder values when in fit height to keep the scroll position
     */
    private setScrollForZoom() {
        if (this.state.zoomPreference === enums.ZoomPreference.FitHeight) {
            let marksheetWrapper: MarkSheetWrapper;
            marksheetWrapper = {
                marksheetContainerScrollTop: $('.marksheet-container').scrollTop(),
                marksheetContainerScrollLeft: $('.marksheet-container').scrollLeft(),
                marksheetContainerScrollHeight: $('.marksheet-container')[0].scrollHeight,
                marksheetContainerScrollWidth: $('.marksheet-container')[0].scrollWidth,
                MarksheetContainerClientHeight: $('.marksheet-container')[0].clientHeight,
                MarksheetContainerClientWidth: $('.marksheet-container')[0].clientWidth,
                MarksheetContainerLeft: $('.marksheet-container')[0].getBoundingClientRect().left,
                MarksheetContainerTop: $('.marksheet-container')[0].getBoundingClientRect().top,
                marksheetViewHolderWidth: $('.marksheet-view-holder').width(),
                marksheetViewHolderHeight: $('.marksheet-view-holder').height(),
                MarksheetViewHolderClientHeight: $('.marksheet-view-holder')[0].clientHeight,
                MarksheetViewHolderClientWidth: $('.marksheet-view-holder')[0].clientWidth,
                MarksheetViewHolderLeft: $('.marksheet-view-holder')[0].getBoundingClientRect().left,
                MarksheetViewHolderTop: $('.marksheet-view-holder')[0].getBoundingClientRect().top
            };
            this.markSheetWrapper = marksheetWrapper;
        } else {
            this.markSheetWrapper = undefined;
        }
    }

    /**
     * setting the response scroll
     */
    private setResponseScroll(responseZoomedWidth: number,
        updateScroll: boolean,
        zoomType: enums.ZoomType,
        rotatedImageWidth: number) {

        // updating the top scrol position only on zooming.
        // other rendering will not modify the scroll. eg: dragging annotation.
        if (updateScroll) {
            this.updatedZoomType.push(zoomType);
        }
        this.rotatedImageWidth = rotatedImageWidth;

        // re-render to update the zoom style according to the width.
        // this will happen on each change of zoom (including fitwidth,height)
        this.setState({
            zoomabeleWidth: responseZoomedWidth,
            refreshCommentSideView: Date.now()
        });
    }

    /**
     * Store the current response scroll
     */
    private storeCurrentResponseScroll(zoomType: enums.ZoomType) {
        this.zoomType = zoomType;
        let elem = ReactDom.findDOMNode(this.refs.markSheet);
        this.scrollPosition = (elem.scrollTop / $('.marksheet-view-holder').height()) * 100;
        this.previousContainerWidth = $('.marksheet-view-holder').width();
        this.previousScrollLeft = elem.scrollLeft;
        this.animationStart();
    }

	/**
	 * calls on zoom updation
	 */
    private onCustomZoomUpdated() {
        // #57487 store the current scroll positions before zoom starts
        // when increase/ decrease height and width of the image on zoom
        // Moved setScrollForZoom from storeCurrentResponseScroll to onCustomZoomUpdated since
        // marksheetContainer/ViewHolder values vary in IE.
        this.setScrollForZoom();
    }

    /**
     * To get currently saved use preference(FW/FH)
     */
    private getCurrentUserOption(reRender: boolean = false, selectedECourseworkPageID: number = 0) {

        let zoomPreference: enums.ZoomPreference = enums.ZoomPreference.FitWidth;
        let zoomUserOption: string;
        zoomUserOption = userOptionHelper.getUserOptionByName(
            userOptionKeys.ZOOM_PREFERENCE,
            responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
                markerOperationModeFactory.operationMode.isAwardingMode ?
                    awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId :
                    markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

        let userOption: any = {};
        // If user has opened structured response, we have to get the zoom value of the current markscheme
        // or the default as FITWidth.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {

            if (responseHelper.isAtypicalResponse()) {
                userOption = zoomHelper.getAtypicalZoomOption(zoomUserOption);
            } else {

                // Get the saved zoom percentage value
                userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption,
                    markingStore.instance.currentQuestionItemImageClusterId ? markingStore.instance.currentQuestionItemImageClusterId : 0);
            }
        } else if (selectedECourseworkPageID > 0) {
            userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, selectedECourseworkPageID);
        } else {
            userOption = zoomHelper.getZoomUserOption(zoomUserOption);
        }
        zoomPreference = userOption.zoomPreference;
        this.isUserOptionZoom = true;

        if (reRender) {
            this.setState({ zoomPreference: zoomPreference });
        }

        return zoomPreference;
    }

    /**
     * This function gets invoked when the component will receive props
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        // if the response container width has been changed due to new element added to the
        // container, eg: messagebox
        if (this.props.refreshImageContainer !== nxtProps.refreshImageContainer) {
            this.refreshZoomComponent = Date.now();
        }
        if (this.props.hasOnPageComments === false && nxtProps.hasOnPageComments && nxtProps.enableCommentsSideView) {
            this.isFirstCommentOnSideView = true;
            this.previousScrollHeightRatio = this.scrollHeightRatio;
        } else {
            this.isFirstCommentOnSideView = false;
            // find scroll height ratio for initial rendering
            // needs to test comments side view scroll setting logic
            if (this.previousMarkSheetContainerHeight === undefined || this.previousMarkSheetContainerWidth === undefined) {
                this.findScrollHeightRatio();
                let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
                if (marksheetContainer) {
                    this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                    this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                }
            }
        }
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillMount() {
        let zoomPreference: enums.ZoomPreference = this.getCurrentUserOption(true, this.props.selectedECourseworkPageID);
        onPageCommentHelper.isFitWidth = zoomPreference === enums.ZoomPreference.FitWidth;
        // clear the on page comments side view collections
        onPageCommentHelper.resetSideViewCollections();
        this.allowRenderSideViewComments = true;
    }

    /**
     * This function is invoked after component is rendered
     */
    public componentDidUpdate() {
        // render Side view comments after all annotations rendered eg: switch side view, show/hide annotations
        // avoid render during zoom -> handled in animation end callbacks
        if (this.isSideViewEnabledAndVisible && this.allowRenderSideViewComments) {
            stampActionCreator.renderSideViewComments(null, null, null, false, false);
            this.allowRenderSideViewComments = false;
        }

        // This condition handles the scenario when user puts first comment and to maintain the scroll from going up
        // and restores the previous scroll top to height ratio - issue noted in IE11
        if (this.previousScrollHeightRatio > 0 && this.isFirstCommentOnSideView) {
            this.refs.markSheet.scrollTop = (this.previousScrollHeightRatio * this.refs.markSheet.scrollHeight) / 100;
        }

        /* TODO: change jquery based implementation of onPinch End into refs (callbacks)
            This is to fix the fit width issue #57024. THe issue occures due to the width set by JQuery is not getting changed on
            re-render by react . We can fix this by changing the jquery logic into ref ( callbacks). */
        if (htmlUtilities.isTabletOrMobileDevice && this.state.zoomPreference === enums.ZoomPreference.FitWidth) {
            if (this.zoomType === enums.ZoomType.PinchIn || this.zoomType === enums.ZoomType.PinchOut) {
                $('.marksheet-holder').css({
                    'width': '100%'
                });
            }
        }

        let containerHeight = this.getImageContainerHeight();
        let containerWidth = this.getImageContainerWidth();
        if (this.imageContainerHeight !== containerHeight || this.imageContainerWidth !== containerWidth) {
            this.imageContainerHeight = containerHeight;
            this.imageContainerWidth = containerWidth;
            this.setState({
                containerDimensionChangedOn: Date.now()
            });
        }

        this.setScrollOnContainerSizeChanges();
    }

    /**
     * This function gets invoked when the component is mounted
     */
    public componentDidMount() {
        let that = this;
        // Let UI animation finish
        setTimeout(() => {
            if (that.refs && that.refs.markSheet) {
                // Must re-render to reflect the container height and width to set the zoom level, if the
                // user has selected either fitHeight.Width and re-opening the response..
                that.setState({ refreshZoom: Date.now() });
            }
        }, 0);

        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.switchResponseView);
        let pageKeyDownHandler: moduleKeyHandler =
            new moduleKeyHandler(modulekeys.PAGE_KEY_DOWN,
                enums.Priority.Fourth,
                true,
                this.handleKeyDown,
                enums.KeyMode.down);

        // Hooking the Key Down Event
        keyDownHelper.instance.mountKeyDownHandler(pageKeyDownHandler);
        window.addEventListener('orientationchange', this._changeDeviceOrientation);
        /* We've moved annotation overlay events to ImageContainer to avoid possible eventEmitter memory leak detected node.js warning */
        /* Annotation overlay events */
        markingStore.instance.addListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksAndAnnotationsRetrieved);
        markingStore.instance.addListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        /* Annotation overlay events ends */
        /** Refresh Page indicator while updateing zoom settings */
        responseStore.instance.addListener(responseStore.ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT, this.handlePageNumberIndicator);
        this.handlePageNumberIndicator();
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);

        // Appending the touchmove event handler to the Image Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        if (this.refs && this.refs.imageContainer) {
            this.appendEventHandler(this.refs.imageContainer,
                'touchmove',
                this.onTouchMoveHandler,
                htmlUtilities.isAndroidChrome());
        }
        responseStore.instance.addListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        markingStore.instance.addListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility);
        stampStore.instance.addListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT,
            this.onToggleCommentsSideView);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.resetCommentRightAttribute);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.resetCommentRightAttribute);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.resetCommentRightAttribute);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.resetCommentRightAttribute);
        eCourseWorkFileStore.instance.addListener(
            eCourseWorkFileStore.ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT,
            this.updateZoomAfterChangingFileListpanelView);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.onloadECourseworkFile);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelHeightChange);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE, this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.enhancedOffPageCommentVisibilityChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT,
            this.onOffPageCommentPanelResize);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_SELECTED_EVENT, this.bookmarkSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.GO_BACK_BUTTON_CLICK_EVENT, this.goBackButtonClicked);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.setFocusToBookmarkTextBox);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT,
            this.showOrHideBookmarkTextBox);
        markingStore.instance.addListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanelUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.SCROLL_POSITION_CHANGED_EVENT, this.onScrollPositionChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
    }

    /**
     * This function gets invoked when the component is about to be ummounted
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.switchResponseView);
        keyDownHelper.instance.unmountKeyHandler(modulekeys.PAGE_KEY_DOWN);
        window.removeEventListener('orientationchange', this._changeDeviceOrientation);
        /* We've moved annotation overlay events to ImageContainer to avoid possible eventEmitter memory leak detected node.js warning */
        /* Annotation overlay events ends */
        markingStore.instance.removeListener(markingStore.MarkingStore.RETRIEVE_MARKS_EVENT, this.marksAndAnnotationsRetrieved);
        markingStore.instance.removeListener(markingStore.MarkingStore.REMOVE_ANNOTATION, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        /* Annotation overlay events ends */
        responseStore.instance.removeListener(responseStore.ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT, this.handlePageNumberIndicator);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);
        responseStore.instance.removeListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_LOADED, this.structuredFracsDataLoaded);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT,
            this.onToggleCommentsSideView);
        // Removing the touchmove event handler to the Image Container element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        if (this.refs && this.refs.imageContainer) {
            this.removeEventHandler(this.refs.imageContainer,
                'touchmove',
                this.onTouchMoveHandler,
                htmlUtilities.isAndroidChrome());
        }

        markingStore.instance.removeListener(markingStore.MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED,
            this.handleMarksAndAnnotationsVisibility);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.resetCommentRightAttribute);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_MINIMIZE_EVENT, this.resetCommentRightAttribute);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.MINIMIZE_EXCEPTION_WINDOW, this.resetCommentRightAttribute);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.CLOSE_EXCEPTION, this.resetCommentRightAttribute);
        /* Fix for defect : 44260 - Functional_MarkEntry_Marks entered against one question gets copied to
                                    immediate next question item on key press.
        As per current implementation, long key-press event is handled in keydown helper and
        this event works based on enums.MarkEntryDeactivator, in case of structured response
        this enum value is resetted only after when the images gets loaded, so when long key press event triggers
        at the in-between time (ie) before image loading, this enum value wont gets reset, At that time
        logic(long key press event blocking) in keydown helper will wont work  */
        // Fix for defect 53607: We dont need to reset the mark entry deactivators when another ecoursework file is selected.
        // The image container will be unmounted when another file is selected
        if (!this.props.isECourseworkComponent) {
            keyDownHelper.instance.resetMarkEntryDeactivators();
        }
        eCourseWorkFileStore.instance.removeListener(
            eCourseWorkFileStore.ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT,
            this.updateZoomAfterChangingFileListpanelView);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.onPanelHeightChange);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE, this.reRender);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, this.enhancedOffPageCommentVisibilityChanged);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.onloadECourseworkFile);
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT,
            this.onOffPageCommentPanelResize);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_SELECTED_EVENT, this.bookmarkSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.GO_BACK_BUTTON_CLICK_EVENT, this.goBackButtonClicked);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.setFocusToBookmarkTextBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT,
            this.showOrHideBookmarkTextBox);
        markingStore.instance.removeListener(markingStore.MarkingStore.PANEL_WIDTH, this.onPanelResize);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanelUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.SCROLL_POSITION_CHANGED_EVENT, this.onScrollPositionChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, this.onCustomZoomUpdated);
    }

    /**
     * to reset the enhanced off page comment container height when visibility changed
     */
    private enhancedOffPageCommentVisibilityChanged = (isEnhancedOffPageCommentsPanelVisible: boolean) => {

        if (!isEnhancedOffPageCommentsPanelVisible) {
            this.enhancedOffPageCommentHeight = 0;
        } else {
            this.enhancedOffPageCommentHeight = Number(userOptionHelper.getUserOptionByName(
                userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));
        }
    }

    /**
     * reset values while response navigation
     */
    private responseChanged = () => {
        // Reset the rendered image count while navigate to next or previous response.
        this.renderedImageCount = 0;
        this.currentImageIdToScroll = undefined;
        // reset the book mark previous scroll data while navigate to next or previous response.
        responseActionCreator.setBookmarkPreviousScrollData(undefined);
    }

    /**
     * Called once panel is resized to left/right
     */
    private updateZoomAfterChangingFileListpanelView = (): void => {
        this.setState({
            renderedOn: Date.now(),
            refreshZoom: Date.now()
        });
    };

    /**
     * Render the component after receives the data
     */
    private marksAndAnnotationsRetrieved() {
        // If data already fetched for the response, skip
        if (this.isMarksAndAnnotationsLoaded) {
            return;
        } else {
            // Check data is exists or not
            this.isMarksAndAnnotationsLoaded = markingStore.instance.isMarksLoaded(markingStore.instance.selectedQIGMarkGroupId);
        }

        // If data loaded for the current response, Render the UI
        if (this.isMarksAndAnnotationsLoaded) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * Method to be invoked once the annotation starts drawing
     */
    private onAnnotationDrawStart = (isDrawStart: boolean): void => {
        this.isDrawStart = isDrawStart;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     *  This will re-render the component.
     * @param removedAnnotation
     * @param isPanAvoidImageContainerRender
     */
    private reRender = (removedAnnotation?: any, isPanAvoidImageContainerRender: boolean = false) => {
        // following condition is checked to prevent the imagecontainer getting refreshed everytime, while
        // we resizing the panel
        if (markingStore.instance.getResizedPanelClassName() || enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
            return;
        }
        if (!isPanAvoidImageContainerRender) {
            this.setState({
                renderedOn: Date.now()
            });
        }

        // need to refactor this section as we are using same method 'reRender' for enhanced offpage activities and remove annotation
        if (removedAnnotation === undefined) {
            // we need to recalculate zoom value if zoom preference is set to fitToHeight
            // and height / visibility of enhanced off page comment is changed
            if (this.state.zoomPreference === enums.ZoomPreference.FitHeight) {
                zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, enums.ResponseViewSettings.FitToHeight);
            }
        }
    };

    /**
     *  function for applying zoom settings while changing the device orientation
     */
    public changeDeviceOrientation = (): void => {
        this.orientationChange = true;
        let element = ReactDom.findDOMNode(this.refs.markSheet) as HTMLElement;
        // element will be null when no content has been assigned to the question item.
        if (element && (this.props.imageZonesCollection ? this.props.imageZonesCollection.length > 0 ? true : false : false)
            || (this.props.imagesToRender ? this.props.imagesToRender.length > 0 ? true : false : false)) {
            let scrollHeightRatio = this.scrollHeightRatio === 0 ? this.getScrollHeightRatio(element) : this.scrollHeightRatio;
            let scrollTop = (element.scrollHeight * scrollHeightRatio) / 100;
            element.scrollTop = scrollTop;
        }
    };

    /**
     *  function for finding scroll height ratio.
     */
    private findScrollHeightRatio() {
        let element = ReactDom.findDOMNode(this.refs.markSheet);
        if (element) {
            this.scrollHeightRatio = this.getScrollHeightRatio(element);
            // We will find the current imageId with with marksheet container top, We will find scroll ratio of that particular
            //  image and will set scrollTop based on current scroll ratio.
            if (this.currentImageIdToScroll) {
                this.scrollRatioAgainstCurrentVisibleImage =
                    ((element.getBoundingClientRect().top + 5 -
                        htmlUtilities.getElementById(this.currentImageIdToScroll)
                            .getBoundingClientRect().top) / element.scrollHeight) * 100;
            }
        }
    }

    /**
     * This method will swith response view. Without this function, the full response view button will not work in structured response.
     */
    private switchResponseView = () => {
        this.props.switchViewCallback();
    };

    /**
     * This method will find the current scroll position of MarkSheetContainer Div.
     */
    private findCurrentScrollPosition = () => {
        //Reset the linked zone page number after scroll postion change.
        if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured || responseHelper.isEbookMarking) {
            if (markingStore.instance.currentlyLinkedZonePageNumber > 0) {
                markingStore.instance.resetLinkedZonePageNumber();
            }
        }
        let elem = ReactDom.findDOMNode(this.refs.markSheet);
        // save the current scroll position in store
        // elem will be undefined for unzoned pages in EBM. Hence storing the top a s 0 for those cases.
        responseActionCreator.setCurrentScrollPosition(((elem) ? elem.scrollTop : 0), true);
    };

    /**
     * Get the Image container properties.
     */
    private getMarkSheetContainerProperties = () => {
        let element = ReactDom.findDOMNode(this.refs.markSheet);
        return {
            'element': element
        };
    };

    /**
     * Get the biggest ratio of structures response
     */
    private calculateBiggestRatio() {
        let element: StructuredImageZone;
        let biggestRatio: number = 0;
        let displayAngle = 0;

        for (let i = 0; element = this.structuredImageZone[i]; i++) {
            let rotatedImage = this.rotatedImages.filter(((x: string) => x === element.pageNo));
            displayAngle = 0;
            let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map((angle: number, key: string) => {
                    if (key === element.pageNo) {
                        displayAngle = angle;
                    }
                });
            }
            displayAngle = annotationHelper.getAngleforRotation(displayAngle);

            if (element.pageNo === rotatedImage[0] && (displayAngle === 90 || displayAngle === 270)) {

                if (biggestRatio < (element.zoneHeight / element.zoneWidth)) {
                    biggestRatio = element.zoneHeight / element.zoneWidth;
                }
            } else {
                if (biggestRatio < (element.zoneWidth / element.zoneHeight)) {
                    biggestRatio = element.zoneWidth / element.zoneHeight;
                }
            }
        }

        this.biggestRatio = biggestRatio;
    }

    /**
     * Method to render ebookmarking single image
     * @param imageZones
     * @param index
     */
    private renderEbookmarkingSingleImage(imageZones: Immutable.List<ImageZone>[], index: number) {
        let imageCount: number = 0;
        let that = this;
        let renderImages = null;

        // Loop through images either single/Stitched
        renderImages = imageZones[0].filter(x => x.height > 0).map((item: ImageZone) => {
            return (that.renderSingleImage(item, index++, imageCount++));
        });

        return renderImages.toArray();
    }

    /**
     * Method to render single image
     * @param imageZone
     * @param index
     */
    private renderSingleImage(imageZone: ImageZone, index: number, imageCount: number) {
        let isALinkedPage = (imageZone.pageNo) > 0 ? pageLinkHelper.isZoneLinked(imageZone, this.props.multipleMarkSchemes) ||
            this.props.pagesLinkedByPreviousMarkers.indexOf(imageZone.pageNo) > -1 : false;
        return (
            <SingleImageViewer
                id={'image_' + index}
                key={'key_image_' + index}
                selectedLanguage={this.props.selectedLanguage}
                switchViewCallback={this.props.switchViewCallback}
                imageZone={imageZone}
                image={(this.props.imagesToRender && this.props.imagesToRender.length > 0) ? this.props.isEBookMarking ?
                    this.props.imagesToRender[0][imageCount] : this.props.imagesToRender[index][0] : null}
                onImageLoaded={this.imageLoaded}
                getMarkSheetContainerProperties={this.getMarkSheetContainerProperties}
                outputPageNo={index + 1}
                zoomPreference={this.state.zoomPreference}
                setZoomOptions={this.props.setZoomOptions}
                isDrawStart={this.isDrawStart}
                renderedOn={this.state.renderedOn}
                onRotation={this.onRotation}
                isResponseEditable={this.props.isResponseEditable}
                enableImageContainerScroll={this.enableImageContainerScroll}
                markSheetViewHolderWidth={this.state.zoomabeleWidth}
                enableCommentBox={this.props.enableCommentBox}
                isALinkedPage={isALinkedPage}
                biggestRatio={this.biggestRatio}
                enableCommentsSideView={this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices}
                getImageNaturalDimension={this.getImageNaturalDimension}
                currentImageZones={this.props.currentImageZones}
                doApplyLinkingScenarios={this.doApplyLinkingScenarios}
                pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                onScrollForZoom={this.setScrollForZoom}
                refreshCommnetContainer={this.refreshCommentContainer}
                isEBookMarking={this.props.isEBookMarking}
                setScrollPositionCallback={this.findCurrentScrollPosition}
                marksheetContainerHeight={this.imageContainerHeight}
                marksheetContainerWidth={this.imageContainerWidth} />);
    }

    /**
     * render the linked images
     * @param index
     * @param images
     */
    private renderLinkedImages(images: string[], index: number) {
        return (<SingleImageViewer
            id={'linked_image_' + index}
            key={'key_linked_image_' + index}
            selectedLanguage={this.props.selectedLanguage}
            switchViewCallback={this.props.switchViewCallback}
            imageZone={undefined}
            image={images[0]}
            onImageLoaded={this.imageLoaded}
            getMarkSheetContainerProperties={this.getMarkSheetContainerProperties}
            outputPageNo={index + 1}
            zoomPreference={this.state.zoomPreference}
            setZoomOptions={this.props.setZoomOptions}
            isDrawStart={this.isDrawStart}
            renderedOn={this.state.renderedOn}
            onRotation={this.onRotation}
            isResponseEditable={this.props.isResponseEditable}
            enableImageContainerScroll={this.enableImageContainerScroll}
            markSheetViewHolderWidth={this.state.zoomabeleWidth}
            enableCommentBox={this.props.enableCommentBox}
            isALinkedPage={true}
            enableCommentsSideView={this.props.enableCommentsSideView}
            currentImageZones={this.props.currentImageZones}
            getImageNaturalDimension={this.getImageNaturalDimension}
            doApplyLinkingScenarios={this.doApplyLinkingScenarios}
            pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
            onScrollForZoom={this.setScrollForZoom}
            refreshCommnetContainer={this.refreshCommentContainer}
            isEBookMarking={this.props.isEBookMarking}
            setScrollPositionCallback={this.findCurrentScrollPosition}
            marksheetContainerHeight={this.imageContainerHeight}
            marksheetContainerWidth={this.imageContainerWidth} />);
    }

    /**
     * Method to render stiched images
     * @param imageZones
     * @param index
     */
    private renderStichedImages(imageZones: Immutable.List<ImageZone>, index: number) {
        let selectedAwardingCandidateData: AwardingCandidateDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            selectedAwardingCandidateData = awardingHelper.awardingSelectedCandidateData();
        }

        return (
            <StitchedImageViewer
                id={'stitched_image_' + index}
                key={'key_stitched_image_' + index}
                selectedLanguage={this.props.selectedLanguage}
                switchViewCallback={this.props.switchViewCallback}
                candidateScriptId={markerOperationModeFactory.operationMode.isAwardingMode ?
                    selectedAwardingCandidateData.responseItemGroups[0].candidateScriptId
                    : this.props.responseDetails.candidateScriptId}
                imageZones={imageZones}
                images={this.props.imagesToRender[index]}
                onImageLoaded={this.imageLoaded}
                getMarkSheetContainerProperties={this.getMarkSheetContainerProperties}
                outputPageNo={index + 1}
                zoomPreference={this.state.zoomPreference}
                setZoomOptions={this.props.setZoomOptions}
                isDrawStart={this.isDrawStart}
                renderedOn={this.state.renderedOn}
                onRotation={this.onRotation}
                isResponseEditable={this.props.isResponseEditable}
                enableImageContainerScroll={this.enableImageContainerScroll}
                markSheetViewHolderWidth={this.state.zoomabeleWidth}
                enableCommentBox={this.props.enableCommentBox}
                biggestRatio={this.biggestRatio}
                enableCommentsSideView={this.props.enableCommentsSideView && !onPageCommentHelper.disableSideViewInDevices}
                currentImageZones={this.props.currentImageZones}
                getImageNaturalDimension={this.getImageNaturalDimension}
                doApplyLinkingScenarios={this.doApplyLinkingScenarios}
                onScrollForZoom={this.setScrollForZoom}
                refreshCommnetContainer={this.refreshCommentContainer}
                setScrollPositionCallback={this.findCurrentScrollPosition}
                marksheetContainerHeight={this.imageContainerHeight}
                marksheetContainerWidth={this.imageContainerWidth} />);
    }

    /**
     * Set the props if image loaded.
     * @param pageNumber
     * @param scrollTop
     * @param naturalImageWidth
     * @param clientImageWidth
     * @param naturalImageHeight
     */
    private imageLoaded(pageNumber: number,
        scrollTop: number,
        naturalImageWidth?: number,
        clientImageWidth?: number,
        naturalImageHeight?: number,
        clientImageHeight: number = 0,
        outputPageNumber: number = 0): void {

        this.props.onImageLoaded(pageNumber);

        if (!this.isUnStructured &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !responseHelper.isMarkByAnnotation(responseHelper.currentAtypicalStatus) &&
            !messageStore.instance.isMessagePanelActive &&
            !exceptionStore.instance.isExceptionPanelActive) {
            keyDownHelper.instance.resetMarkEntryDeactivators();
        }

        // add the natural dimensions of page
        this.addImageNaturalDimensions(pageNumber, naturalImageHeight, naturalImageWidth);

        // Build a cache of the scroll tops of all the images.
        this.scrollTopCache = this.scrollTopCache.set(pageNumber, scrollTop);

        // gets the minimum natural width among all the images of particular response
        // for comment box calculation
        // and passing this values as props to comment container
        if ((naturalImageWidth !== undefined) && (naturalImageWidth < this.minimumNaturalImageWidth ||
            this.minimumNaturalImageWidth === 0)) {
            this.minimumNaturalImageWidth = naturalImageWidth;
        }

        // gets the minimum natural height among all the images of particular response
        // for comment box calculation
        // and passing this values as props to comment container
        if ((naturalImageHeight !== undefined) && (naturalImageHeight < this.minimumNaturalImageHeight ||
            this.minimumNaturalImageHeight === 0)) {
            this.minimumNaturalImageHeight = naturalImageHeight;
        }
        // Keep the large image file natural width to adjust the zoom
        // For ECourseworkComponent height and width will be different for each files, so set it
        if (naturalImageWidth !== undefined && (naturalImageWidth > this.naturalImageWidth || this.props.isECourseworkComponent)) {
            this.naturalImageWidth = naturalImageWidth;
            this.clientImageWidth = clientImageWidth;

            // Will discuss with TA, to confirm whether we need to
            // compare each image height.
            this.naturalImageHeight = naturalImageHeight;
        }

        if (!this.isUnStructured || this.props.isEBookMarking) {
            let structuredImageZone: StructuredImageZone = {
                pageNo: 'img_' + pageNumber + '_' + outputPageNumber,
                zoneWidth: clientImageWidth, zoneHeight: clientImageHeight
            };
            this.structuredImageZone.push(structuredImageZone);
        }

        this.renderedImageCount++;

        if (this.isExternalImageFile) {
            this.setState({ isExternalImageFileLoaded: true });
            this.props.externalImageLoaded(true);
        }


        if (this.hasAllScriptImagesLoaded) {
            // inform responsecontainer that images have loaded
            this.props.allImagesLoaded();

            /* File read status change operation is not available in team management or marking check mode.
               If Supervisor select a subordinate response that has not been viewed, the status
               does not change to file has been viewed.
            */
            if (this.props.isECourseworkComponent && !markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckAvailable) {
                // Invoke action creator to set selected ecoursework file read status and in progress status as true.                
                eCourseworkHelper.updatefileReadStatusProgress(
                    this.markGroupId,
                    eCourseworkHelper.getSelectedECourseworkImages().docPageID);
            }

            this.calculateImagesScrollTops();

            this.refreshUpdates();

            var that = this;

            // This will ensure adjust the thickness of line annotations
            // after the zoom applied.
            setTimeout(() => {
                that.notifyAnimationCompleted();
                if (!that.isUnStructured) {
                    that.fracsLoadedImageCount = 0;
                    //set fracs when new images loaded
                    responseActionCreator.structuredFracsDataSet();
                }
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
        }
    }

    /**
     *  method to return the markgroup id
     */
    private get markGroupId() {
        return markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
            this.props.responseDetails.esMarkGroupId
            : markerOperationModeFactory.operationMode.isAwardingMode
                ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].markGroupId
                : this.props.responseDetails.markGroupId;
    }

    /**
     * refresh after all script loaded
     */
    private refreshUpdates() {
        let isScrollTopSet: boolean = false;
        if (this.props.markThisScrollPosition !== undefined && this.isUnStructured) {
            // Since the scrolltop is getting set, updating manually scrolling to false.
            // This is done to identify manual scrolling in scrollHandler().
            this.isManuallyScrolling = false;
            $('.marksheet-container').scrollTop(this.props.markThisScrollPosition);
            isScrollTopSet = true;
        }
        // re render to pass the updated natural width to zoomable.
        this.setState({
            renderedOn: Date.now(), refreshZoom: Date.now()
        });

        // This will emit and event to each image to refresh the rotation settings
        responseActionCreator.refreshImageRotationSettings();

        // Once settings has been finished this will refresh the screen to set the updated
        // width of marksheet view holder
        responseActionCreator.responseImageRotated(true);

        // Handling the page number indicator once all the images are loaded
        // If scroll top is set then handlePageNumberIndicator() will be called from onScrollHandler()
        if (!isScrollTopSet) {
            this.handlePageNumberIndicator();
        }
    }

    /**
     * handle the action event after setting fracs data
     */
    private structuredFracsDataLoaded(fracsDataSource: enums.FracsDataSetActionSource) {
        //waiting for all fracs to set, to get the most visible page
        this.fracsLoadedImageCount++;
        if (this.fracsLoadedImageCount === this.props.imagesToRender.length) {
            responseActionCreator.findVisibleImageId(true, fracsDataSource);

            this.fracsLoadedImageCount = 0;
        }
    }
    /**
     * if the comment box is open we should close comment box while scrolling using
     * scroll bar
     * @param event
     */
    private onMouseDownHandler = (event: any) => {
        let markSheetWidth = 0;
        let markSheetHeight = 0;
        // Defect 69602 fix : refs will be empty on rendering the component,
        // so check check the existance o element bofore usage to avoid unhandled errors
        if (this.refs.markSheet) {
            markSheetWidth = this.refs.markSheet.getBoundingClientRect().width;
            markSheetHeight = this.refs.markSheet.getBoundingClientRect().height;
        }
        let commentBoxContainer = $('.comment-box');
        let bookmarkBoxContainer = $('.bookmark-entry');
        // checking for the click on scroll Bar inside imageContainer
        if (markSheetWidth <= event.clientX || markSheetHeight <= event.clientY) {
            // if the click is inside the comment box then we should not
            // hide the comment box if it is open
            if ((commentBoxContainer) &&
                !((commentBoxContainer.is(event.target)) || ((commentBoxContainer.has(event.target).length > 0)))
            ) {
                stampActionCreator.showOrHideComment(false);
            }
            if ((bookmarkBoxContainer) &&
                !((bookmarkBoxContainer.is(event.target)) || ((bookmarkBoxContainer.has(event.target).length > 0)))
            ) {
                stampActionCreator.showOrHideBookmarkNameBox(false);
            }
        }
    };
    /**
     * Calculate Image Scoll Tops
     */
    private calculateImagesScrollTops() {
        let isComponentUnstructured: boolean = this.props.imageZonesCollection ? false : true;
        if (this.hasAllScriptImagesLoaded && isComponentUnstructured) {

            // Clear the existing collection
            this.scrollTopCache.clear();
            this.props.fileMetadataList.every((fileMetadata: FileMetadata) => {
                if (!fileMetadata.isSuppressed) {
                    let pageNo = fileMetadata.pageNumber;

                    // Get the top of the image// Image Offset().top value is not accurate.
                    let top = htmlUtilities.getOffsetTop('img_' + pageNo, true);

                    this.scrollTopCache = this.scrollTopCache.set(pageNo, top);
                }

                return true;
            });
        }
    }

    /**
     * On mouse scroll hide context menu
     * @param event
     */
    private onScrollHandler = (event: any) => {
        // to detect if scrolled vertically or horizontally
        let scrollDelta: [number, number] = this.getScrollDelta();
        // let isHorizontalScroll: boolean = scrollDelta[0] > 0;
        let isVerticalScroll: boolean = scrollDelta[1] > 0;

        // In firefox after clicking  yes/no on DeleteComment Popup OnScroll getting executed
        // so the Comment Box getting closed
        // The issue was not able to find in latest version of firefox hence adding the change to onScrollHandler
        if (deviceHelper.isTouchDevice() === true &&
            (stampStore.instance.SelectedOnPageCommentClientToken !== undefined && !this.isSideViewEnabledAndVisible)) {
            stampActionCreator.showOrHideComment(false);
        }

        // close the bookmark textbox only in vertical scroll, to avoid the floating effect on bookmark textbox
        if (isVerticalScroll && deviceHelper.isTouchDevice() === true && markingStore.instance.selectedBookmarkClientToken) {
            stampActionCreator.showOrHideBookmarkNameBox(false);
        }

        if (isVerticalScroll) {
            markingActionCreator.showOrHideRemoveContextMenu(false);

            // find active page for structured and E-bookmarking
            if (this.props.imageZonesCollection && this.previousMarkSheetContainerHeight === this.refs.markSheet.clientHeight &&
                this.previousMarkSheetContainerWidth === this.refs.markSheet.clientWidth && !this.isSideViewPanelToggled) {
                let index: number = 0;
                let pageNo;
                let that = this;
                if (this.props.isEBookMarking) {
                    // need to handle Ebookmarking scenario
                    // renderImages = this.renderEbookmarkingSingleImage(this.props.imageZonesCollection, index);
                    let imageCount: number = 0;
                    // Loop through images either single/Stitched
                    this.props.imageZonesCollection[0].map((item: ImageZone) => {
                        let image: string = that.props.imagesToRender[0][imageCount];
                        pageNo = image ? image.split('/')[9] : 0;
                        imageCount++;
                        index++;
                        let elementId: string = 'outputPageNo_' + index;
                        this.setCurrentImageIdToScroll(elementId);
                    });
                } else {
                    this.props.imageZonesCollection.map((imageZones: Immutable.List<ImageZone>) => {
                        if (imageZones.count() === 1) {
                            pageNo = that.props.imagesToRender[index][0] ? that.props.imagesToRender[index][0].split('/')[9] : 0;
                        } else {
                            pageNo = that.props.imagesToRender[index] ? that.props.imagesToRender[index][0].split('/')[9] : 0;
                        }
                        index++;
                        let elementId: string = 'outputPageNo_' + index;
                        this.setCurrentImageIdToScroll(elementId);
                    });

                    // render the linked pages
                    this.props.imagesToRender.map((images: string[], collectionIndex: number) => {
                        if (collectionIndex >= index) {
                            this.doApplyLinkingScenarios = true;
                            pageNo = images[0] ? images[0].split('/')[9] : 0;
                            let elementId: string = 'outputPageNo_' + index;
                            this.setCurrentImageIdToScroll(elementId);
                        }
                    });
                }
            }

            if (this.isUnStructured && this.isManuallyScrolling) {
                // pass argument as true to indicate the method is invoked from the scroll.
                this.handlePageNumberIndicator();
            }

            if (!this.orientationChange) {
                let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
                if (this.previousMarkSheetContainerHeight === marksheetContainer.clientHeight &&
                    this.previousMarkSheetContainerWidth === marksheetContainer.clientWidth && !this.isSideViewPanelToggled &&
                    !this.isFileViewPanelToggled) {
                    this.findScrollHeightRatio();
                }
                if (!this.isFileViewPanelToggled) {
                    this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                    this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                }
            }
            this.orientationChange = false;
        }
        // sets the right style attribute so that the comment side view is maintained on scroll
        // Checking this.animating to verify when an animation is happening in between and if a scroll
        // has been triggered, we should not re-render the comment container.
        if (this.isSideViewEnabledAndVisible && !isVerticalScroll) {
            let resetScroll: boolean = (this.state.zoomPreference === enums.ZoomPreference.FitWidth);
            this.setCommentContainerRightAttribute(resetScroll, true);
        }
        this.isManuallyScrolling = true;
    };

    /**
     * This method will set current ImageId to scroll
     * @private
     * @memberof ImageContainer
     */
    private setCurrentImageIdToScroll = (elementId: string) => {
        let markSheetElement: any = $('#' + elementId);
        if (markSheetElement[0]) {
            // getting fracs data for particular image
            let fracsData = fracsHelper.getFracs(markSheetElement[0]);
            // adding to array only if the image is visible
            if (fracsData.visible > 0) {
                let currentScrollTop: number = this.refs.markSheet.scrollTop;
                let imageHeight: number = markSheetElement[0].offsetHeight;
                let offsetTop: number = markSheetElement[0].offsetTop;
                if (currentScrollTop > offsetTop && currentScrollTop < offsetTop + imageHeight) {
                    this.currentImageIdToScroll = elementId;
                }
            }
        }
    }

    /**
     * if the comment box is open we should block scrolling using
     * mouse wheel
     * @param event
     */
    private onWheelHandler = (event: any) => {
        let isCommentBoxOpen = stampStore.instance.SelectedOnPageCommentClientToken !== undefined;

        // prevent scroll using mouse Wheel when comment boxk is open
        if (isCommentBoxOpen) {
            event.preventDefault();
            event.stopPropagation();
            return;
            // Fix for defect  58362, when it is scrolled change the comment box from edit mode to read mode
        } else if (stampStore.instance.SelectedSideViewCommentToken !== undefined) {
            stampActionCreator.showOrHideComment(false);
        }
    };

    /**
     * When the user click on the image, set the mark entry box as selected.
     * If OnPage comment or a bookmark has been stamped then the focus should be
     * retained in the corresponding OnPage comment box or bookmark textbox
     * Otherwise focus should be in mark scheme panel
     */
    private onImageContainerClicked = () => {
        // If OnPage comment or a bookmark has been stamped then the focus should be
        // retained in the corresponding OnPage comment box or bookmark textbox, else focus should be in mark scheme panel
        if (!this.isOnPageCommentStamped && !this.isBookmarkTextBoxOpen) {

            // Defect 73138 fix - scroll to the right side of the page before stamping the bookmark
            if (toolbarStore.instance.isBookMarkSelected) {
                let scrollTo = ($('.marksheet-view-holder').width() - $('.marksheet-view-holder').offset().left);
                $('.marksheet-container').scrollLeft(scrollTo);
            }

            markingActionCreator.setMarkEntrySelected();
        } else {
            this.isOnPageCommentStamped = false;
        }
    };

    /**
     * Called when an annotation is added
     * @param stampId stamptypeid
     */
    private onAnnotationAdded(stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation,
        isStitched: boolean): void {
        // Perform only for onpage comment to open comment box
        // for firefox.
        if (stampId === enums.DynamicAnnotation.OnPageComment) {
            this.isOnPageCommentStamped = true;
        }
    }

    /**
     * Calculates the most visible page no and the corresponding image and
     * raises and action to update the page indicator.
     */
    private handlePageNumberIndicator = () => {
        let visiblePages: Array<number> = [];
        let visiblePageTops: Array<number> = [];
        let visiblePageimageNumbers: Array<number> = [];
        let counter: number = 1;
        let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
        let visibleInFracs: Array<any> = [];
        this.props.fileMetadataList.map((fileMetadata: FileMetadata, index: number) => {
            if (!fileMetadata.isSuppressed) {
                let pageNumber = fileMetadata.pageNumber;
                let markSheetElement: any = $('#img_' + pageNumber);
                if (markSheetElement[0]) {
                    /** For displaying the page which has the maximum visibility, the top value of marksheet element
                     * is reduced by 25 percentage of marksheet elements height
                     */
                    let overlayTop: number = markSheetElement[0].getBoundingClientRect().top -
                        (markSheetElement[0].getBoundingClientRect().height * 0.25);

                    // getting fracs data for particular image
                    let fracsData = fracsHelper.getFracs(markSheetElement[0]);

                    // adding to array only if the image is visible
                    if (fracsData.visible > 0) {
                        let obj = { visible: 0, pageNo: 0, imgNo: 0 };
                        obj.imgNo = counter;
                        obj.pageNo = pageNumber;
                        obj.visible = fracsData.visible;
                        visibleInFracs.push(obj);
                    }
                    counter++;
                }
            }
        });

        if (visibleInFracs.length > 0) {
            let _visibleInFracs = visibleInFracs.sort((a: any, b: any) => { return b.visible - a.visible; });
            // EBookMarking scenario will be handled with structrued responses.
            if (!this.props.isEBookMarking && this.isUnStructured) {
                this.currentImageIdToScroll = 'img_' + _visibleInFracs[0].pageNo;
            }

            // removing all image details other than first 2 images (splice(RemoveFromStartIndex,noOfItemstoRemove))
            // because in pageIndicator we used to show maximum up to 2 page numbers
            if (_visibleInFracs.length > constants.BOOKLET_VIEW_IMAGE_COUNT) {

                _visibleInFracs.splice(constants.BOOKLET_VIEW_IMAGE_COUNT, _visibleInFracs.length - constants.BOOKLET_VIEW_IMAGE_COUNT);
            }
            let pageIndicators = this.getPageNumberIndicatorDetails(_visibleInFracs);
            responseActionCreator.updatePageNoIndicator(pageIndicators.newPageNumber, pageIndicators.newImageNumber,
                this.isBookletView);
        }
    };

    /**
     * Show page number indicator while response scrolling
     */
    private getPageNumberIndicatorDetails(_visibleInFracs: Array<any>) {
        this.isBookletView = false;
        if (_visibleInFracs.length === constants.BOOKLET_VIEW_IMAGE_COUNT && _visibleInFracs[0].visible === _visibleInFracs[1].visible) {
            this.isBookletView = true;
        }
        let newPageNumber: Array<number> = [];
        let newImgNumber: Array<number> = [];
        if (this.isBookletView) {
            newPageNumber.push(_visibleInFracs[0].pageNo, _visibleInFracs[1].pageNo);
            newImgNumber.push(_visibleInFracs[0].imgNo, _visibleInFracs[1].imgNo);
        } else {
            newPageNumber.push(_visibleInFracs[0].pageNo);
            newImgNumber.push(_visibleInFracs[0].imgNo);
        }
        return { 'newPageNumber': newPageNumber, 'newImageNumber': newImgNumber };
    }

    /**
     * Gets the image height buffer; the difference between tops of 2 subsequent images.
     * @returns
     */
    private getImageHeightBuffer(): number {
        let keys = this.scrollTopCache.keySeq();

        return this.scrollTopCache.get(keys.get(1)) - this.scrollTopCache.get(keys.get(0));
    }

    /**
     * Handles the Key down Event.
     * @param {KeyboardEvent} event
     */
    private handleKeyDown(event: KeyboardEvent): boolean {
        if (this.isUnStructured && (event.keyCode === keycodes.PAGE_DOWN_KEY || event.keyCode === keycodes.PAGE_UP_KEY)) {
            let newScrollTop = 0;
            let currentScrollTop = ReactDom.findDOMNode(this.refs.markSheet).scrollTop;
            if (event.keyCode === keycodes.PAGE_DOWN_KEY) {
                newScrollTop = this.getPageOffSetFromImageTops(currentScrollTop + ImageContainer.PADDING_VALUE_BETWEEN_IMAGES, true);
            } else if (event.keyCode === keycodes.PAGE_UP_KEY) {
                newScrollTop = this.getPageOffSetFromImageTops(currentScrollTop - ImageContainer.PADDING_VALUE_BETWEEN_IMAGES, false);
            }

            htmlUtilities.scrollToTopWithAnimation('marksheet-container', newScrollTop);
            return true;
        }

        return false;
    }

    /**
     * Get the next nearest scroll top from the collection
     * @param currentScrollTop
     */
    private getPageOffSetFromImageTops(currentScrollTop: number, nextImage: boolean): number {
        let keys = this.scrollTopCache.keySeq();
        let newTop: number = Number.MAX_VALUE;

        if (nextImage) {
            this.scrollTopCache.forEach((top: number, pageNo: number) => {
                if (top > currentScrollTop && top < newTop) {
                    newTop = top;
                }
            });
        } else {
            newTop = Number.MIN_VALUE;
            this.scrollTopCache.forEach((top: number, pageNo: number) => {
                if (top < currentScrollTop && top > newTop) {
                    newTop = top;
                }
            });
        }

        // Firefox is resetting the scroll to 0. Adjust the width to complete the scroll
        // For Large Zoom (200) 1000 not enogh for whole page scroll, setting to 10000.
        if (newTop === Number.MAX_VALUE) {
            return currentScrollTop + 10000;
        }

        // Adjust the top value with the Padding height
        return newTop - ImageContainer.PADDING_VALUE_BETWEEN_IMAGES;
    }

    /**
     * Invoked when zooming option has been changed in Zoom Panel
     * @param responseViewSettings - new zoom settings to apply
     * @param isZooming - distinguish Zooming or Rotating
     * @param isPinchZoom - Pinch zoom in progress for devices only
     */
    private onZoomOptionChanged(responseViewSettings: enums.ResponseViewSettings,
        isZooming: boolean,
        isPinchZoom: boolean = false,
        zoomType?: enums.ZoomType): void {
        // if rotating, return
        if (!isZooming) {
            return;
        }
        if (this.isSideViewEnabledAndVisible) {
            stampActionCreator.toggleCommentLinesVisibility(true, true);
        }
        this.isZoomingInitiated = true;
        let selectedZoomPreference: enums.ZoomPreference = enums.ZoomPreference.None;
        let refreshOn = Date.now();
        var that = this;
        onPageCommentHelper.isFitWidth = responseViewSettings === enums.ResponseViewSettings.FitToWidth;
        switch (responseViewSettings) {
            case enums.ResponseViewSettings.FitToHeight:
                this.currentZoomPercentage = undefined;
                selectedZoomPreference = enums.ZoomPreference.FitHeight;

                // Freeze the comment side view until comment container re-render and
                // finish the animation.
                this.freezeSideView(true);
                setTimeout(() => {
                    // Make comment side view visible
                    that.freezeSideView(false);
                    that.triggerAnimationEndForSideViewComments();
                    that.notifyAnimationCompleted();
                    that.setState({ refreshZoom: Date.now() });
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                break;
            case enums.ResponseViewSettings.FitToWidth:
                this.currentZoomPercentage = undefined;
                selectedZoomPreference = enums.ZoomPreference.FitWidth;

                // Freeze the comment side view until comment container re-render and
                // finish the animation.
                this.freezeSideView(true);
                setTimeout(() => {
                    // Make comment side view visible
                    that.freezeSideView(false);
                    that.triggerAnimationEndForSideViewComments();
                    that.notifyAnimationCompleted();
                    that.setState({ refreshZoom: Date.now() });
                }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                break;
            case enums.ResponseViewSettings.CustomZoom:
                selectedZoomPreference = enums.ZoomPreference.Percentage;
                // Avoiding render for disabling outlet view for Unstructured in devices which handled using jquery.
                // For structured, booklet view is disabled both in device and browser, so handled in react.
                refreshOn = (isPinchZoom || (htmlUtilities.isTabletOrMobileDevice && this.isUnStructured))
                    ? this.state.refreshZoom : Date.now();

                // on before animation start set the comment side view freeze if applicable.
                if (refreshOn !== this.state.refreshZoom && this.isSideViewEnabledAndVisible) {
                    this.freezeSideView(true);
                }

                // for user input custome zoom , fires animationcompleted. 
                // for zoom by + and - animationcompleted will fires from animation end
                // and hide the comment side view
                if (zoomType === enums.ZoomType.UserInput && htmlUtilities.isTabletOrMobileDevice) {
                    setTimeout(() => {
                        that.triggerAnimationEndForSideViewComments();
                        that.notifyAnimationCompleted();
                    }, constants.MARKSHEETS_ANIMATION_TIMEOUT);
                }

                that.setState({ refreshZoom: refreshOn });

                break;
        }
        // If response zoom setting is not custom mode, reset the width to adjust the default behaviour
        // of fitwidth and fitheight.
        this.setState({
            zoomPreference: selectedZoomPreference
        });
    }

    /**
     * Do process on resize event
     * @param {any} event
     */
    private onWindowResize(event: any) {
        if (!htmlUtilities.isTabletOrMobileDevice) {
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
        }

        // Must re-render to reflect the container height and width to set the zoom level, if the
        // user has selected either fitHeight.Width and re-opening the response..
        if ((this.state.zoomPreference === enums.ZoomPreference.FitHeight ||
            this.state.zoomPreference === enums.ZoomPreference.FitWidth) &&
            this.isSideViewEnabledAndVisible === false) {

            timerHelper.handleReactUpdatesOnWindowResize(() => {
                this.setState({
                    renderedOn: Date.now()
                });
            });
        } else if (this.isSideViewEnabledAndVisible === true &&
            stampStore.instance.SelectedSideViewCommentToken === undefined) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * Has all the script images loaded completely
     * @returns flag indicating whether all script images loaded
     */
    private get hasAllScriptImagesLoaded(): boolean {
        let isAllScriptsLoaded: boolean = false;
        if (this.props.imageZonesCollection) {
            var totalImageCount: number = 0;
            this.props.imagesToRender.map((x: any) => {
                totalImageCount += x.length;
            });
            isAllScriptsLoaded = this.renderedImageCount >= totalImageCount;
        } else {
            isAllScriptsLoaded = (this.isExternalImageFile && this.state.isExternalImageFileLoaded) ||
                (!this.isExternalImageFile && this.renderedImageCount === (this.props.imagesToRender &&
                    this.props.imagesToRender.length > 0 &&
                    this.props.imagesToRender[0].length));
        }
        return isAllScriptsLoaded;
    }

    /**
     * function to trigger pinch to zoom
     * @param {enum} zoomtype
     * @param {any} event
     */
    private onPinchZoom = (zoomType: enums.ZoomType, event: any) => {
        if (this.currentZoomPercentage) {
            this.currentZoomPercentage = this.currentZoomPercentage;
        } else {
            this.currentZoomPercentage = responseStore.instance.currentZoomPercentage;
        }

        // Both custom_zoom and pinch_to_zoom for devices has been handled here
        switch (zoomType) {
            case enums.ZoomType.PinchIn:
                this.zoomType = enums.ZoomType.PinchIn;
                this.pinchZoomFactor = -(constants.PINCH_ZOOM_FACTOR);
                this.pinchZoom(event);
                break;
            case enums.ZoomType.PinchOut:
                this.zoomType = enums.ZoomType.PinchOut;
                this.pinchZoomFactor = constants.PINCH_ZOOM_FACTOR;
                this.pinchZoom(event);
                break;
            case enums.ZoomType.CustomZoomIn:
                this.pinchZoomFactor = (constants.MAX_ZOOM_PERCENTAGE - this.currentZoomPercentage) / constants.MIN_ZOOM_PERCENTAGE;
                this.currentZoomPercentage = this.pinchZoomFactor >= 1 ?
                    this.currentZoomPercentage + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                this.customZoom(zoomType);
                break;
            case enums.ZoomType.CustomZoomOut:
                if (this.currentZoomPercentage > constants.MAX_ZOOM_PERCENTAGE) {
                    this.pinchZoomFactor = (constants.MAX_ZOOM_PERCENTAGE - this.currentZoomPercentage) / constants.MIN_ZOOM_PERCENTAGE;
                    this.currentZoomPercentage = this.pinchZoomFactor >= 1 ?
                        this.currentZoomPercentage + constants.MIN_ZOOM_PERCENTAGE : constants.MAX_ZOOM_PERCENTAGE;
                } else {
                    this.pinchZoomFactor = (this.currentZoomPercentage - constants.MIN_ZOOM_PERCENTAGE);
                    this.currentZoomPercentage = this.pinchZoomFactor >= constants.MIN_ZOOM_PERCENTAGE ?
                        this.currentZoomPercentage - constants.MIN_ZOOM_PERCENTAGE : constants.MIN_ZOOM_PERCENTAGE;
                }
                this.customZoom(zoomType);
                break;
            case enums.ZoomType.UserInput:
                this.currentZoomPercentage = responseStore.instance.userZoomValue;
                this.customZoom(zoomType);
                break;
            default:
                break;
        }

    };

    /**
     * function to update zoom preference
     * @param _currentZoomValue
     */
    private updateAndSaveZoomPreference(_currentZoomPercentage?: number) {
        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
            // Defect 65186 fix - on pinchzoom the useroption is get saved as undefined/NaN intermittently.
            // Save the minimal zoom value as a defensive fix
            let _currentZoomValue = _currentZoomPercentage ? _currentZoomPercentage : this.currentZoomValue;

            // EBM zoom preference also should save like unstructured.
            if (this.isUnStructured || responseHelper.isEbookMarking) {

                let zoomPreferenceToSave: string = enums.ZoomPreference.Percentage.toString() + ',' + _currentZoomValue;

                let zoomUserOption: string = userOptionHelper.getUserOptionByName
                    (userOptionKeys.ZOOM_PREFERENCE,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

                // If the response is structured atypical we need to consider saving in structuredway.
                if (responseHelper.isAtypicalResponse() &&
                    responseHelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {

                    zoomPreferenceToSave = zoomHelper.updateAtypicalZoomOption(zoomUserOption,
                        enums.ZoomPreference.MarkschemePercentage,
                        _currentZoomValue);
                } else {

                    let userOption = zoomHelper.getZoomUserOption(zoomUserOption);

                    // Format the saving user preference value.
                    zoomPreferenceToSave = zoomHelper.updateZoomPreference(
                        userOption.userOptionZoomValue,
                        _currentZoomValue,
                        0,
                        enums.ZoomPreference.Percentage,
                        enums.ZoomPreference.FilePercentage.toString(),
                        this.props.selectedECourseworkPageID);
                }

                userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, zoomPreferenceToSave,
                    true, true, false, true,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            } else {
                let zoomUserOption: string = userOptionHelper.getUserOptionByName
                    (userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
                let userOption = zoomHelper.getZoomUserOption(zoomUserOption);

                // Format the saving user preference value.
                let preference: string = zoomHelper.updateZoomPreference(
                    userOption.userOptionZoomValue,
                    _currentZoomValue,
                    markingStore.instance.currentQuestionItemInfo.uniqueId,
                    enums.ZoomPreference.Percentage,
                    userOption.zoomHeader);

                userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE,
                    preference, false, true, false, true, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
            }
        }
    }

    /**
     * function to trigger pinch end
     * @param {any} event
     */
    private onPinchEnd = (event: any) => {

        if (this.props.enableCommentsSideView && this.props.enableCommentBox) {
            // action to trigger the animation on zoom ends here.
            stampActionCreator.toggleCommentLinesVisibility(false, false);
            this.triggerAnimationEndForSideViewComments();
        }

        // preparing scrollLeft and top value based on the changed offsetTop while pinching.
        // adding constant of 10 as including padding value. -1 indicating the how far we have set the top position
        let sT = ($('.marksheet-view-holder').offset().top - ($('.marksheet-container').offset().top) - 10) * -1;
        let sL = ($('.marksheet-view-holder').offset().left - $('.marksheet-container').offset().left - 10) * -1;

        // using last pinch scale value since onPinchEnd is triggered from pinchcancel event
        let resultWidth: number = this.previousZoomWidth *
            (this.pinchScaleFactor === 0 ? this.getPinchScaleFactor(event.scale) : this.pinchScaleFactor);

        let paddingStyle: string = '0px 0px';
        // setting the width and removing transformation
        // For structured response we dont need to set the marksheet holder width explicitly as this is already
        // set in percentage. we only have to set the parent container width then the child will stretch to the
        // specific width.
        if (this.isUnStructured) {
            $('.marksheet-holder').css({
                'font-size': ((resultWidth / 2) / 10) + 'px',
                'width': + resultWidth + 'px', 'margin-left': 0
            });
        } else {
            $('.marksheet-holder').css({
                'font-size': ((resultWidth / 2) / 10) + 'px'
            });
        }
        // modifying the current zoom value
        this.currentZoomPercentage = (resultWidth / this.naturalImageWidth) * 100;

        /* for rotated structured images we need to reset the padding based on the same calculation using on rotation. */
        if (!this.isUnStructured && responseStore.instance.hasRotatedImages
            && this.currentZoomPercentage <= constants.MAX_ZOOM_PERCENTAGE) {

            let padding = zoomHelper.getRotatedPagePadding(resultWidth, this.structuredImageZone, this.rotatedImages,
                this.currentZoomPercentage, responseStore.instance.displayAnglesOfCurrentResponse);
            if (padding > 0) {
                paddingStyle = 0 + ' ' + padding + 'px';
                resultWidth = (resultWidth + (padding * 2));
            }
        }

        $('.marksheet-view-holder').css({
            'width': resultWidth + 'px',
            'transform': '',
            'transform-origin': '',
            'padding': paddingStyle
        });

        // setting scrollTop and Left
        $('.marksheet-container').scrollTop(sT).scrollLeft(sL);

        this.enableImageContainerScroll(true);

        zoomPanelActionCreator.isPinchZooming(false);

        this.animating = false;

        // Defect 65186 fix - on pinchzoom the useroption is get saved as undefined/NaN intermittently.
        // Save the minimal zoom value as a defensive fix
        let _currentZoomPercentage = this.currentZoomPercentage ? this.currentZoomPercentage : constants.AVG_ZOOM_PERCENTAGE;
        // update the value in user option
        this.updateAndSaveZoomPreference(_currentZoomPercentage);
        // update value to store
        zoomPanelActionCreator.responseZoomUpdated(_currentZoomPercentage);
        zoomPanelActionCreator.zoomAnimationEnd(true);
        this.currentZoomPercentage = undefined;

        // Reset the zoom value that are used to set if user zoomed from FITWIDTH/HEIGHT to 0
        // so it will not set any width unless we demand on next re-render
        zoomPanelActionCreator.responsePinchZoomCompleted(resultWidth);

        // removing the class 'zooming' which is added during pinch In and pinch Out
        $('.marksheet-zoom-holder').removeClass('zooming');
        /* Resetting the view holder left and top which was set in custom zoom animation start
          - to handle the scenario of pinch zoom before custom zoom animation ends */
        $('.marksheet-view-holder').css({ 'top': '', 'left': '' });
    };

    /**
     * function to trigger pinch start
     * @param {any} event
     */
    private onPinchStart = (event: any) => {
        this.isPinchReady = false;
        let zoomPreference: enums.ZoomPreference = this.getCurrentUserOption();

        // adding the class 'zooming' which is added during pinch In and pinch Out
        $('.marksheet-zoom-holder').addClass('zooming');
        //Defect 66722 - Comment box does not close on pinch zoom in devices
        //Earlier only if scroll was enabled the comment box was closing
        //So added a call to stampactioncreator to close comment box if pinch to zoom is started
        if (stampStore.instance.SelectedOnPageCommentClientToken !== undefined && !this.isSideViewEnabledAndVisible) {
            stampActionCreator.showOrHideComment(false);
        }

        // hide the comment lines in side view
        if (this.props.enableCommentsSideView && this.props.enableCommentBox) {
            stampActionCreator.toggleCommentLinesVisibility(true, true);
        }

        // taking the current scroll top and left to calculate the touch area and do zoom in/out
        // operation based on this.
        let sT = $('.marksheet-container').scrollTop();
        let sL = $('.marksheet-container').scrollLeft();

        // taking the offpage comment height for calculating the zoomy value
        let enhancedOffPageCommentHeight: number = annotationHelper.percentToPixelConversion(this.enhancedOffPageCommentHeight,
            (window.innerHeight - constants.COMMON_HEADER_HEIGHT));

        // If the user has selected FIT HEIGHT/WIDTH we need to remove the default width and style setting before do
        // pinch to perform the transformation.
        if (zoomPreference === enums.ZoomPreference.FitHeight || zoomPreference === enums.ZoomPreference.FitWidth) {
            let updateToWidth: number = 0;
            let currentHeight: number = $('.marksheet-view-holder').innerHeight();

            // Get the current width of the image holder, This will be set in pixel for each image.
            updateToWidth = this.naturalImageWidth * (responseStore.instance.currentZoomPercentage / 100);

            // Holds the percentage of previous scroll without updating proposed width.
            let previousScroll = ($('.marksheet-container').scrollTop() / $('.marksheet-view-holder').innerHeight()) * 100;

            // Update the container with respect to child holder
            $('.marksheet-view-holder').css({
                'width': updateToWidth + 'px',
                'max-width': ''
            });

            // change the image holder width according to the current width
            zoomPanelActionCreator.prepareResponseImagePinchToZoom(updateToWidth);

            let that = this;
            // This setimeout will ensure the UI update with the width will be completed and we cand proceed
            setTimeout(() => {
                // Recalculating the scrolltop here because we consider that, once we changed the width of each
                // Marksheet-Holder to a specific width then height will get changed and push to the bottom. Then
                // we need to set the scrollTop again to position to pinch start.
                var currentScrollTop = $('.marksheet-container').scrollTop();

                // Update the current scroll position to the previous percentage.
                var updatedScroll = $('.marksheet-view-holder').innerHeight() * (previousScroll / 100);
                $('.marksheet-container').scrollTop(updatedScroll);
                sT = $('.marksheet-container').scrollTop();
                // setting the transform originX and Y based on touch area
                that.zoomX = event.center.x + sL -
                    ($('.marksheet-view-holder').offset().left - $('.marksheet-content-holder').offset().left);
                that.zoomY = (event.center.y + sT -
                    ($('.marksheet-view-holder').offset().top - $('.marksheet-content-holder').offset().top)) -
                    (enhancedOffPageCommentHeight);

                // Lets start the pinch move
                that.isPinchReady = true;
            }, 0);
        } else {

            // setting the transform originX and Y based on touch area
            this.zoomX = event.center.x + sL - ($('.marksheet-view-holder').offset().left - $('.marksheet-content-holder').offset().left);
            this.zoomY = (event.center.y + sT -
                ($('.marksheet-view-holder').offset().top - $('.marksheet-content-holder').offset().top)) - (enhancedOffPageCommentHeight);

            // Lets start the pinch move
            this.isPinchReady = true;
        }

        this.enableImageContainerScroll(false);
        zoomPanelActionCreator.isPinchZooming(true);
        // hide zoompanel
        zoomPanelActionCreator.hideZoomPanel();
        // to set the zoom preference for hiding the onpage comment in side view for the devices
        this.setState({ zoomPreference: zoomPreference });
    };

    /**
     * add/remove rotaed images based on the rotaed angle. This is a callback from image viewer component on rotation.
     * @param rotatedAngle
     */
    protected onRotation = (rotatedAngle: number) => {
        if (rotatedAngle === 0 || rotatedAngle % 360 === 0) {
            let index = this.rotatedImages.indexOf(responseStore.instance.currentlyVisibleImageContainerRefId);
            if (index > -1) {
                this.rotatedImages.splice(index, 1);
            }
        } else {
            if (this.rotatedImages.indexOf(responseStore.instance.currentlyVisibleImageContainerRefId) < 0) {
                this.rotatedImages.push(responseStore.instance.currentlyVisibleImageContainerRefId);
            }
        }

        // Prevent re-rendering comment container when horizontal scroll is triggerd due to the rotation.
        this.animating = true;
        let that = this;
        // need to hide comment lines in rotate and zoom.hence this code comes before the return;
        if (this.isSideViewEnabledAndVisible) {
            this.freezeSideView(true);

            // Given settimeout because in device we are not getting the transion end of marksheet-wrapper
            // The fix for the safari browser is causing the problem. So we are giving explicite delay for re-rendering
            // after transition. There is a delay of .3sec to start the animation and .3sec delay to complete the transition
            // Thats why we are giving a 600
            setTimeout(() => {
                that.animating = false;
                // make visible after the animation and set the right scroll.
                that.freezeSideView(false);
                that.setState({
                    renderedOn: Date.now()
                });
                that.notifyAnimationCompleted();
                that.triggerAnimationEndForSideViewComments(0);
            }, constants.RESPONSE_IMAGE_ROTATION_DELAY);
        } else {
            setTimeout(() => {
                that.animating = false;
                that.setState({
                    renderedOn: Date.now()
                });
                that.notifyAnimationCompleted();
            }, constants.RESPONSE_IMAGE_ROTATION_DELAY);
        }

        // Update the response image width on zoom based on the height to fit to the
        // screen and avoid trimming the page.
        responseActionCreator.responseImageRotated(this.rotatedImages.length > 0, this.rotatedImages);
    };

    /**
     * Refresh the component when the container size has been changed
     * eg: message panel appears
     */
    private getZoomableComponentWidth(containerWidth: number, containerHeight: number): void {
        // update the image width while opening a response
        if (htmlUtilities.isTabletOrMobileDevice && this.isUnStructured
            && this.state.zoomPreference === enums.ZoomPreference.Percentage) {
            let zoomableWidth = this.naturalImageWidth * (responseStore.instance.currentZoomPercentage / 100);
            this.updateImageSize(zoomableWidth);
        }

        if (this.zoomedContainerWidth !== containerWidth) {
            this.zoomedContainerWidth = containerWidth;
            this.setState({ refreshZoom: Date.now() });
        }

        // This method invoked after som timeout after zoom update. So Recalculate the image tops for the updated positions
        this.calculateImagesScrollTops();
    }

    /**
     * set scroll top and left on zoom
     * Increase/Decrease the scroll left and top propational to the increased/decreased height and wifth of the image on zoom
     * @param zoomType
     * @param zoomFactor
     */
    private setScrollPositionOnZoom(zoomType: enums.ZoomType, zoomFactor: number) {

        if (zoomType !== enums.ZoomType.None) {

            /* adding the variation in scroll left and top based on the current zoom to the current scroll left and top*/
            let elem = ReactDom.findDOMNode(this.refs.markSheet);
            elem.scrollTop = elem.scrollHeight * (this.scrollPosition / 100);
            elem.scrollLeft = (this.previousScrollLeft + (($('.marksheet-view-holder').width() - this.previousContainerWidth) / 2));
        }

    }

    /**
     * resize the rotated image according to the current zoom level.
     * @param {number} rotatedImageWidth
     */
    private onResponseImageRotationCompleted(rotatedImageWidth: number): void {

        // setting the rotated image width. If any of the image is rotated
        // then applying the rotated image height percentage. Otherwise same
        // as normal zoom width.
        this.rotatedImageWidth = rotatedImageWidth;
        this.setState({ refreshZoom: Date.now() });
    }

    /**
     * on pinch zoom
     * @param {any} event
     */
    private pinchZoom(event: any) {

        // If user pinch started but didnt move, we dont need to do anything
        if (event.distance === 0 || !this.isPinchReady) {
            return;
        }

        if (this.currentZoomPercentage > constants.MAX_ZOOM_PERCENTAGE) { this.currentZoomPercentage = constants.MAX_ZOOM_PERCENTAGE; }
        if (this.currentZoomPercentage < constants.MIN_ZOOM_PERCENTAGE) { this.currentZoomPercentage = constants.MIN_ZOOM_PERCENTAGE; }

        this.previousZoomWidth = this.naturalImageWidth * (this.currentZoomPercentage / 100);
        let scaleFactor = this.getPinchScaleFactor(event.scale);

        // transform screen
        $('.marksheet-view-holder').css({
            'transform': 'scale(' + (scaleFactor) + ')',
            'transform-origin': '' + this.zoomX + 'px  ' + this.zoomY + 'px'
        });
    }

    /**
     * Gets a value indicating the current scale factor
     * @param {number} currentScale
     * @returns
     */
    private getPinchScaleFactor(currentScale: number): number {

        let result: number = currentScale;
        let widthAccordingToCurrentScale: number = this.previousZoomWidth * currentScale;

        /**
         * if current pinch zoom scale is exceeding the maximum zoom value restrict zoom.
         * @param (this.naturalImageWidth * 2) > widthAccordingToCurrentScale
         */
        if (widthAccordingToCurrentScale > (this.naturalImageWidth * 2)) {

            result = ((this.naturalImageWidth * 2) / this.previousZoomWidth);
        } else if (widthAccordingToCurrentScale < (this.naturalImageWidth * .10)) {
            result = ((this.naturalImageWidth * .10) / this.previousZoomWidth);
        }
        this.pinchScaleFactor = result;
        return result;
    }

    /**
     * Updating the image size
     * @param {number} zoomableWidth
     */
    private updateImageSize(zoomableWidth: number) {

        // As part of defect fix: #45658
        if (isNaN(zoomableWidth) || zoomableWidth === 0) {
            $('.marksheet-view-holder').css({
                'width': 'auto'
            });
        } else {

            $('.marksheet-holder').css({
                'font-size': ((zoomableWidth / 2) / 10) + 'px',
                'width': + zoomableWidth + 'px', 'margin-left': 0
            });

            $('.marksheet-view-holder').css({
                'width': zoomableWidth + 'px'
            });
        }

    }

    /**
     * Custom zoom
     * @param zoomType
     */
    private customZoom(zoomType: enums.ZoomType) {
        this.zoomType = zoomType;
        this.updateAndSaveZoomPreference();
        if (this.currentZoomValue > constants.MAX_ZOOM_PERCENTAGE) { this.currentZoomPercentage = constants.MAX_ZOOM_PERCENTAGE; }
        if (this.currentZoomValue < constants.MIN_ZOOM_PERCENTAGE) { this.currentZoomPercentage = constants.MIN_ZOOM_PERCENTAGE; }

        this.updatedZoomType.push(zoomType);
        this.storeCurrentResponseScroll(zoomType);

        let zoomableWidth = this.naturalImageWidth * (this.currentZoomValue / 100);
        this.updateImageSize(zoomableWidth);
        zoomPanelActionCreator.responseZoomUpdated(this.currentZoomValue);
    }

    /**
     * Get a value indicating the current zoom percentage value
     * @returns
     */
    private get currentZoomValue(): number {

        // For pinch to zoom depending on "currentZoomPercentage". This will be undefined
        // for manual zoom.
        return this.currentZoomPercentage ? this.currentZoomPercentage
            : responseStore.instance.currentZoomPercentage;
    }

    /**
     * Re-render each page and reset FITWIDTH/HEIGHT styles and set the updated width as style
     * then only pinch transform will happen
     */
    private onResponsePinchToZoomStarted(): void {
        this.onZoomOptionChanged(enums.ResponseViewSettings.CustomZoom, true, true);
    }

    /**
     * Triggers when Zoomable transition has been completed (custom zoom only)
     */
    private onAnimationEnd(isFitHeight: boolean) {
        if (isFitHeight) {
            // Inorder to notify overlayholder in fit-to-height mode.
            if (!qigStore.instance.isAcetateMoving) {
                this.notifyAnimationCompleted();
            }
            //re render the side view for comments
            stampActionCreator.renderSideViewComments();
        } else {
            //Don't check disableSideviewOnDevice as this call disables the side view
            // action to trigger the animation on zoom ends here.
            this.triggerAnimationEndForSideViewComments();
            //disabling animation event in fitheight mode to prevent reset scroll top
            // TODO: consider fit height scenario before adding else case
            if (this.updatedZoomType.length > 0) {
                this.animationEnds();
            }
        }
        // TODO: revisit setTimeouts for MARKSHEET_ANIMATION_TIMEOUT using this action, move logic to Zoomable
        // dispatch the action to inform other componenents about animation complete
    }

    /**
     * to trigger the actions to update side view comments on zoom send
     */
    private triggerAnimationEndForSideViewComments(timeout: number = constants.MARKSHEETS_ANIMATION_TIMEOUT): void {
        if (this.props.enableCommentBox && this.props.enableCommentsSideView) {
            let disableSideViewOnDevices: boolean = false;
            let commentSideViewUserOptionValue: boolean = responseStore.instance.isPinchZooming ? false :
                userOptionHelper.getUserOptionByName(userOptionKeys.COMMENTS_SIDE_VIEW) === 'true';
            if (htmlUtilities.isTabletOrMobileDevice) {
                if (this.state.zoomPreference !== enums.ZoomPreference.FitWidth) {
                    disableSideViewOnDevices = true;
                }
                stampActionCreator.toggleCommentSideView
                    (commentSideViewUserOptionValue, stampStore.instance.SelectedSideViewCommentToken, disableSideViewOnDevices);
            }
            stampActionCreator.toggleCommentLinesVisibility(false, false);
            if (!disableSideViewOnDevices) {
                let that = this;
                setTimeout(function () {
                    that.setCommentContainerRightAttribute(false, true);
                }, timeout);
            }
        }
    }

    /**
     * called when toggle the comment side view - mainly for resetting the scroll left
     */
    private onToggleCommentsSideView(): void {
        this.isSideViewPanelToggled = true;
        // Reset the scroll ratio when side view is enabled.
        // As there is already a focus applied on the comment box.
        if (this.isSideViewEnabledAndVisible) {
            this.scrollRatioAgainstCurrentVisibleImage = 0;
        }
        this.setScrollOnContainerSizeChanges(true);
        if (this.isSideViewEnabledAndVisible) {
            let that = this;
            setTimeout(function () {
                that.setCommentContainerRightAttribute(false, true);
                that.findScrollHeightRatio();
            }, constants.MARKSHEETS_ANIMATION_TIMEOUT
            );
        }
    }

    /**
     * called for setting the right attribute of comment container in SIDE View
     * @param resetPosition   - Whether we need to reset the righ attribute of comment container to 0 .
     * @param renderCommentContainer - Whether we need to re-render the comment container.
     * @param commentContainerRight - If this value is not 0 it will set as right of comment container, otherwise marksheetContainerLeft.
     */
    private setCommentContainerRightAttribute(resetPosition: boolean = false, renderCommentContainer: boolean = false,
        commentContainerRight: number = 0): void {

        // We dont need to do this when an animation is happening in background.
        if (this.animating) {
            return;
        }
        let marksheetContainer = htmlUtilities.getElementsByClassName('marksheet-container');
        let marksheetContainerLeft = resetPosition ? 0 : marksheetContainer.length > 0 ? marksheetContainer[0].scrollLeft : 0;
        if (marksheetContainerLeft > 0) { marksheetContainerLeft = -1 * marksheetContainerLeft; }
        //set the style right for commentcontainer on scroll of the marksheet-container
        this.setState({
            commentContainerRight: commentContainerRight !== 0 ? commentContainerRight : marksheetContainerLeft,
            refreshCommentSideView: renderCommentContainer ? Date.now() : this.state.refreshCommentSideView
        });
    }

    /**
     * Triggers when mark sheet transition has started
     */
    private animationStart() {
        let hookPointTopPx: number;
        let hookPointLeftPx: number;
        let hDiffPx: number;
        let wDiffPx: number;
        let marginTopPx: number;
        let marginLeftPx: number;
        let c: number;
        let h: number;
        let x: number;
        let commentConatinerWidthPlusPadding: number = 0;

        let currentTop = this.markSheetWrapper === undefined ?
            $('.marksheet-container').scrollTop() : this.markSheetWrapper.marksheetContainerScrollTop;

        c = this.markSheetWrapper === undefined ?
            $('.marksheet-view-holder').width() : this.markSheetWrapper.marksheetViewHolderWidth;
        h = this.markSheetWrapper === undefined ?
            $('.marksheet-view-holder').height() : this.markSheetWrapper.marksheetViewHolderHeight;

        if (this.isSideViewEnabledAndVisible) {
            commentConatinerWidthPlusPadding = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        }

        // Calculating the top
        // Taking MarksheetViewHolderTop from MarksheetWrapper if not undefined(To solve the scroll issue in IE).
        let topDiff = $('.marksheet-container')[0].getBoundingClientRect().top -
            (this.markSheetWrapper === undefined ?
                $('.marksheet-view-holder')[0].getBoundingClientRect().top :
                this.markSheetWrapper.MarksheetViewHolderTop);

        hookPointTopPx = topDiff +
            (this.markSheetWrapper === undefined ?
                ($('.marksheet-container')[0].clientHeight / 2) :
                (this.markSheetWrapper.MarksheetContainerClientHeight / 2));

        // Calculating the left
        let leftDiff = $('.marksheet-container')[0].getBoundingClientRect().left -
            $('.marksheet-view-holder')[0].getBoundingClientRect().left;

        hookPointLeftPx = leftDiff + (this.markSheetWrapper === undefined ?
            (($('.marksheet-container')[0].clientWidth - commentConatinerWidthPlusPadding) / 2) :
            ((this.markSheetWrapper.MarksheetContainerClientWidth - commentConatinerWidthPlusPadding) / 2));

        this.hookPointTopPercentage = 100 * hookPointTopPx /
            (this.markSheetWrapper === undefined ?
                ($('.marksheet-view-holder')[0].clientHeight + 5) : this.markSheetWrapper.MarksheetViewHolderClientHeight + 5);

        this.hookPointLeftPercentage = 100 * hookPointLeftPx /
            (this.markSheetWrapper === undefined ?
                (($('.marksheet-view-holder')[0].clientWidth)) :
                this.markSheetWrapper.MarksheetViewHolderClientWidth);
        let r = h / c;

        let zoomFactor: number = 0;
        if (this.zoomType === enums.ZoomType.CustomZoomIn) {
            zoomFactor = constants.PINCH_ZOOM_FACTOR;
            x = -1;
        } else if (this.zoomType === enums.ZoomType.CustomZoomOut) {
            zoomFactor = -(constants.PINCH_ZOOM_FACTOR);
            x = 1;
        } else if (this.zoomType === enums.ZoomType.UserInput && !htmlUtilities.isTabletOrMobileDevice) {
            // set zoomFactor for sideViewComments. We dont need to set the zoomFactor
            // as side view comments are only enabled in FitWidth for devices.
            let userZoomValue = responseStore.instance.userZoomValue;
            if (userZoomValue > this.currentZoomValue) {
                // zooming in
                zoomFactor = responseStore.instance.currentCustomZoomDifference;
                x = -1;
            } else {
                // zooming out
                zoomFactor = -(responseStore.instance.currentCustomZoomDifference);
                x = 1;
            }
        }

        // When user zoom without interval, when animation end will not get fired. So we we need to calculate
        // the width diff from the first click itself.
        let width = this.previousImageWidth > 0 ?
            this.previousImageWidth : (this.naturalImageWidth * (this.currentZoomValue) / 100);
        wDiffPx = Math.abs(((this.naturalImageWidth * (this.currentZoomValue + zoomFactor) / 100))
            - (width));

        // Calculating height diff using the ratio. This ration will be same always on
        // all zoom
        hDiffPx = r * wDiffPx;

        this.marginTop = x * this.hookPointTopPercentage * hDiffPx / 100;
        this.marginLeft = x * this.hookPointLeftPercentage * wDiffPx / 100;

        // Consider the very first image width other than the immediate one to calculate the margintop and left.
        // coz when the user clicks fast animation end will not get fire and we are appending only the margin left and top.
        if (!this.animating) {
            this.previousImageWidth = (this.naturalImageWidth * (this.currentZoomValue) / 100);
        }

        $('.marksheet-view-holder').css({ 'top': this.marginTop + 'px', 'left': this.marginLeft + 'px' });

        if (this.zoomType === enums.ZoomType.CustomZoomIn) {
            this.marginTop = currentTop - (this.marginTop);
        } else if (this.zoomType === enums.ZoomType.CustomZoomOut) {
            this.marginTop = currentTop - this.marginTop;
        }

        // Will stop comment container from rerending when a scroll has been fired on setting
        // margine left.
        this.animating = true;
        this.markSheetWrapper = undefined;
    }

    /**
     * Triggers when mark sheet transition has ends
     */
    private animationEnds() {
        let st: number;
        let sl: number;
        let commentConatinerWidthPlusPadding: number = 0;
        if (this.isSideViewEnabledAndVisible) {
            commentConatinerWidthPlusPadding = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        }
        $('.marksheet-view-holder').removeClass('no-animation').addClass('no-animation');
        $('.marksheet-view-holder').css({ 'height': 'auto', 'top': '', 'left': '' });

        var that = this;
        setTimeout(function () {
            $('.marksheet-view-holder').removeClass('no-animation');
        });

        // Calculate new scroll top/left and set.
        st = (this.hookPointTopPercentage * ($('.marksheet-view-holder')[0].clientHeight + 10) / 100)
            - $('.marksheet-container')[0].clientHeight / 2;
        sl = (this.hookPointLeftPercentage * ($('.marksheet-view-holder')[0].clientWidth + 10) / 100)
            - ($('.marksheet-container')[0].clientWidth - commentConatinerWidthPlusPadding) / 2;

        if (htmlUtilities.isIPadDevice) {
            // setting scrollLeft and scrollTop, causes marksheet-container to disappear in ipad safari
            // while performing zoom functionality but it works fine in Android and desktop.
            // checked with UI team, and came up with the below fix of setting the overflow property and removing the same
            // after setting the scrollTop and scrollLeft.
            let markSheetContainer: any = htmlUtilities.getElementsByClassName('marksheet-container');
            markSheetContainer[0].style.overflow = 'hidden';

            $('.marksheet-container').scrollLeft(sl);
            $('.marksheet-container').scrollTop(st);

            markSheetContainer[0].style.removeProperty('overflow');
        } else {
            $('.marksheet-container').scrollLeft(sl);
            $('.marksheet-container').scrollTop(st);
        }

        // Once animation end has been called we dont previous position.
        this.previousImageWidth = 0;

        // Finish the animation after setting top and left
        this.animating = false;
        if (this.isSideViewEnabledAndVisible) {

            // Get the new scroll left and set as the right of the comment container
            // also remove the dummy sideview comment used for freezing the comment container div.
            sl = $('.marksheet-container').scrollLeft();
            this.freezeSideView(false);
            let that = this;
            setTimeout(function () {
                that.setCommentContainerRightAttribute(false, true, (sl < 0 ? sl : sl * -1));
            }, 0);
        }
        this.notifyAnimationCompleted();
    }

    /**
     * Trigger the hide comment side view call
     */
    private toggleCommentsSideView = (e: any) => {
        stampActionCreator.toggleCommentSideView(false);
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * to handle the side view visibility on annotation on and off
     */
    private handleMarksAndAnnotationsVisibility = (): void => {
        this.allowRenderSideViewComments = true;
        this.setState({
            refreshCommentSideView: Date.now(),
            renderedOn: Date.now()
        });
    };

    /**
     * returns whether side view is enabled and open (will rturn false if exception or message windows open)
     */
    private get isSideViewEnabledAndVisible(): boolean {
        return (this.props.enableCommentsSideView && this.props.enableCommentBox && !onPageCommentHelper.disableSideViewInDevices);
    }

    /**
     * Gets the changes in scroll position during scroll
     */
    private getScrollDelta(): [number, number] {
        let deltaX: number = Math.abs(htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollLeft - this.markSheetScrollLeft);
        let deltaY: number = Math.abs(htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollTop - this.markSheetScrollTop);
        this.markSheetScrollLeft = htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollLeft;
        this.markSheetScrollTop = htmlUtilities.getElementsByClassName('marksheet-container')[0].scrollTop;
        return [deltaX, deltaY];
    }

    /**
     * add image natural dimensions
     * @param pageNo
     * @param height
     * @param width
     */
    public addImageNaturalDimensions = (pageNo: number, height: number, width: number): void => {
        this.imageDimensions[pageNo] = { naturalHeight: height, naturalWidth: width };
    };

    /**
     * return natural dimension of image
     * @param pageNo
     */
    public getImageNaturalDimension = (pageNo: number): void => {
        return this.imageDimensions[pageNo];
    }

	/**
	 * Freezing the commentside view visibility on animation is happening in background
	 * @param freeze
	 */
    private freezeSideView(freeze: boolean): void {
        if (this.isSideViewEnabledAndVisible) {
            stampActionCreator.setCommentVisibilityAction(!freeze);
            this.freezeCommentSideView = freeze;
        }
    }

    /**
     * Method to be invoked once the message/exception window minimized or closed
     */
    private resetCommentRightAttribute = (): void => {
        this.setCommentContainerRightAttribute(false, true);
    };

	/**
	 * Notify other componenet that animation has been completed.
	 */
    private notifyAnimationCompleted(): void {
        zoomPanelActionCreator.zoomAnimationEnd(true);
        // (#50530) render CommentSideView(Issue fix for stiched image comment line misalign)
        stampActionCreator.renderSideViewComments(null, null, null, false, false);
    }

    /**
     * returns fileMetadataList
     */
    private get fileMetadataList(): Array<FileMetadata> {
        let fileMetadataList: any;
        if (this.props.doExcludeSuppressedPage) {
            fileMetadataList = this.props.fileMetadataList.toArray().
                filter((fileMetadata: FileMetadata) => fileMetadata.isSuppressed === false);
        } else {
            fileMetadataList = this.props.fileMetadataList.toArray();
        }
        return fileMetadataList;
    }

    /**
     * return if the first file is convertable or not
     */
    private get isExternalImageFile(): boolean {
        return this.fileMetadataList && this.fileMetadataList.length > 0 &&
            !this.fileMetadataList[0].isConvertible && this.fileMetadataList[0].isImage;
    }

    /**
     * This method excute on  load course work file.
     */
    private onloadECourseworkFile = (doAutoIndex: boolean, mediaType: enums.MediaType) => {
        // Reset the rendered image count while changing the coursework file.
        // Re render the image container if the latest selected type is not audio.
        if (mediaType !== enums.MediaType.Audio) {
            this.renderedImageCount = 0;
            // clear the on page comments side view collections
            onPageCommentHelper.resetSideViewCollections();
        }
        if (this.isExternalImageFile && mediaType !== enums.MediaType.Audio) {
            this.setState({ isExternalImageFileLoaded: false });
            this.props.externalImageLoaded(false);
        }

        // resetting the bookmark previous scroll data while navigating to FRV
        responseActionCreator.setBookmarkPreviousScrollData(undefined);
    }

    /**
     * onPanel Height Change
     * @param height
     * @param className
     * @param elementOverlapped
     * @param panActionType
     */
    private onPanelHeightChange(height: string, className: string, elementOverlapped: boolean, panActionType: enums.PanActionType) {
        if (panActionType === enums.PanActionType.End && !enhancedOffPageCommentStore.instance.isEnhancedOffpageCommentResizing) {
            this.enhancedOffPageCommentHeight = Number(height);
            this.reRender();
            this.handlePageNumberIndicator();
        }
    }

    /**
     * on Off Page Comment Panel Resize
     * @param height
     * @param panActionType
     */
    private onOffPageCommentPanelResize = (height: number, panActionType: enums.PanActionType): void => {
        if (panActionType === enums.PanActionType.End) {
            this.reRender();
        }
    }

    /**
     * On zoom updated
     */
    private onZoomUpdated = () => {
        // No need to rerender on zooming by pinching.
        if (this.zoomType !== enums.ZoomType.PinchIn && this.zoomType !== enums.ZoomType.PinchOut) {
            this.calculateImagesScrollTops();
            this.setState({
                resetZoomClass: Date.now()
            });
        }
    }

    /**
     * Show or Hide book mark text box
     */
    private showOrHideBookmarkTextBox = (bookMarkText: string, clientToken: string,
        isVisible: boolean, rotatedAngle?: enums.RotateAngle) => {

        this.isBookmarkTextBoxOpen = isVisible;

        if (this.isBookmarkTextBoxOpen) {
            this.bookmarkText = bookMarkText;
            this.bookmarkClientToken = clientToken;
            this.bookmarkRotatedAngle = rotatedAngle;

            let elementId = 'script-bookmark_' + clientToken;
            let bookmarkElement = htmlUtilities.getElementById(elementId);

            let heightDif: number = constants.BOOKMARK_TEXT_BOX_HEIGHT - bookmarkElement.getBoundingClientRect().height;

            //Bookmark entry box pointing arrow size /2 to be considered in the 'left' attribute when the text box position is right
            let bookMarkArrowWidth: number = BOOKMARK_TEXTBOX_POINITING_ARROW_SIZE / 2;

            this.bookmarkTop = (bookmarkElement.getBoundingClientRect().top -
                this.refs.markSheet.getBoundingClientRect().top - (heightDif / 2)) + this.refs.markSheet.scrollTop;

            this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                this.refs.markSheet.getBoundingClientRect().left - constants.BOOKMARK_TEXT_BOX_WIDTH)
                + this.refs.markSheet.scrollLeft;

            switch (this.bookmarkRotatedAngle) {
                case enums.RotateAngle.Rotate_0:
                    this.bookmarkTextboxPosition = 'left';
                    break;
                case enums.RotateAngle.Rotate_90:
                case enums.RotateAngle.Rotate_270:
                    if (this.refs.markSheet.scrollLeft > this.bookmarkLeft) {
                        this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                            this.refs.markSheet.getBoundingClientRect().left) +
                            bookmarkElement.getBoundingClientRect().width +
                            this.refs.markSheet.scrollLeft + bookMarkArrowWidth;
                        this.bookmarkTextboxPosition = 'right';
                    } else {
                        this.bookmarkTextboxPosition = 'left';
                    }
                    break;
                case enums.RotateAngle.Rotate_180:
                    this.bookmarkLeft = (bookmarkElement.getBoundingClientRect().left -
                        this.refs.markSheet.getBoundingClientRect().left) +
                        bookmarkElement.getBoundingClientRect().width +
                        this.refs.markSheet.scrollLeft + bookMarkArrowWidth;
                    this.bookmarkTextboxPosition = 'right';
                    break;
            }
        } else {
            this.bookmarkClientToken = '';
            this.bookmarkLeft = 0;
            this.bookmarkText = '';
            this.bookmarkTop = 0;
        }
        this.setState({
            renderedOnBookmark: Date.now()
        });
    };

    /**
     * Set focus to bookmark text box
     */
    private setFocusToBookmarkTextBox = (): void => {
        this.isBookmarkTextBoxOpen = true;
    };

    /**
     * return class name related to zoom percentage
     */
    private getZoomLevelClass() {
        let className = '';
        let zoomLevel = responseStore.instance.currentZoomPercentage;
        if (zoomLevel <= 50) {
            className = 'small-zoom';
        } else if (zoomLevel <= 100) {
            className = 'medium-zoom';
        } else {
            className = 'large-zoom';
        }
        return className;
    }

    /**
     * on Book mark item selection
     * @param clientToken
     */
    private bookmarkSelected = (clientToken: string) => {
        let bookmarkPreviousScrollData: BookmarkPreviousScrollData = {
            scrollHeight: this.refs.markSheet.scrollHeight,
            scrollTop: this.refs.markSheet.scrollTop
        };
        responseActionCreator.setBookmarkPreviousScrollData(bookmarkPreviousScrollData);

        let elementId = 'script-bookmark_' + clientToken;
        let bookmarkElement = htmlUtilities.getElementById(elementId);

        let enhancedOffPageComment: HTMLElement = document.getElementById('enhanced-off-page-comments-container');
        let audioPlayer: HTMLElement = document.getElementById('audioPlayerContainer');

        let bookmarkTop = this.refs.markSheet.scrollTop + (bookmarkElement.getBoundingClientRect().top
            - constants.COMMON_HEADER_HEIGHT
            - (enhancedOffPageComment ? enhancedOffPageComment.clientHeight : 0)
            - (audioPlayer ? audioPlayer.clientHeight : 0));
        this.refs.markSheet.scrollTop = bookmarkTop;
    }

    /**
     * on Go Back button Click
     */
    private goBackButtonClicked = () => {
        let prvScrollData: BookmarkPreviousScrollData = responseStore.instance.getBookmarkPreviousScrollData;
        let scrollChangePercentage = (this.refs.markSheet.scrollHeight - prvScrollData.scrollHeight) / prvScrollData.scrollHeight;
        let goBackScrollTop = prvScrollData.scrollTop + (prvScrollData.scrollTop * scrollChangePercentage);
        this.refs.markSheet.scrollTop = goBackScrollTop;
        // resetting the bookmark previous scroll data
        responseActionCreator.setBookmarkPreviousScrollData(undefined);
    }

    /* refresh comment container */
    public refreshCommentContainer = () => {
        this.setState({
            refreshCommentSideView: Date.now()
        });
    }

    /**
     * Maintain mark sheet container scroll on various scenarios.
     * @private
     * @memberof ImageContainer
     */
    private setScrollOnContainerSizeChanges = (forceSet: boolean = false) => {
        let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
        if (this.scrollHeightRatio > 0 && this.currentImageIdToScroll && (this.state.zoomPreference === enums.ZoomPreference.FitWidth ||
            this.state.zoomPreference === enums.ZoomPreference.FitHeight) &&
            ((this.previousMarkSheetContainerHeight !== marksheetContainer.clientHeight ||
                this.previousMarkSheetContainerWidth !== marksheetContainer.clientWidth) || forceSet)) {
            setTimeout(() => {
                // Defect fix: #63665
                if (this.currentImageIdToScroll && $('#' + this.currentImageIdToScroll).length > 0) {
                    let scrollTop: number = $('#' + this.currentImageIdToScroll)[0].offsetTop +
                        (this.scrollRatioAgainstCurrentVisibleImage * marksheetContainer.scrollHeight) / 100;
                    // marksheetContainer.scrollTop =  scrollTop has side effects in ipad
                    // blank message panel is displaying for some time after maximizing the panel.
                    $('.marksheet-container').scrollTop(scrollTop);
                    this.findScrollHeightRatio();
                    this.previousMarkSheetContainerHeight = marksheetContainer.clientHeight;
                    this.previousMarkSheetContainerWidth = marksheetContainer.clientWidth;
                    this.isSideViewPanelToggled = false;
                    this.isFileViewPanelToggled = false;
                }
            }, constants.SCROLL_SET_TIMEOUT);
        }
    }

    /**
     * We've to maintain scroll on mark scheme panel width changes.
     *
     * @private
     * @memberof ImageContainer
     */
    private onPanelResize = (panelWidth, resizeClassName, panelType, panActionType) => {
        if (panelType === enums.ResizePanelType.MarkSchemePanel && panActionType === enums.PanActionType.End) {
            this.setScrollOnContainerSizeChanges(true);
        }
    }

    /**
     * We don't need set the scrollRatio while file browser is toggling
     * @private
     * @memberof ImageContainer
     */
    private toggleFilelistPanelUpdated = () => {
        this.isFileViewPanelToggled = true;
    }

    /**
     * Get user zoom value.
     */
    private getUserZoomValue = () => {
        if (this.naturalImageWidth > 0 && this.isFitToContainerEnabled()) {
            return this.initiateResponseImageZoom(this.naturalImageWidth, this.naturalImageHeight);
        } else {
            return responseStore.instance.userZoomValue;
        }
    }

    /**
     * Determines whether ecoursework image file is opening for first time.
     */
    private isFitToContainerEnabled = (): boolean => {
        let zoomUserOption = userOptionHelper.getUserOptionByName
            (userOptionKeys.ZOOM_PREFERENCE,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        let currentZoomPercentage: any = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, this.props.selectedECourseworkPageID);
        return eCourseworkHelper.isECourseworkComponent
            && eCourseWorkFileStore.instance.isImageFileSelected(this.props.selectedECourseworkPageID)
            && currentZoomPercentage.userOptionZoomValue === 0
            && currentZoomPercentage.selectedECourseworkPageID !== this.props.selectedECourseworkPageID;
    }

    /**
     * Initiate custom zooms w.r.t container size.
     * @param naturalImageWidth
     * @param naturalImageHeight
     */
    private initiateResponseImageZoom(naturalImageWidth: number, naturalImageHeight: number): void {
        let contaninerAttribute = htmlUtilities.getElementsByClassName('marksheet-container')[0];
        let imageHeightWidthRatio: number = naturalImageHeight / naturalImageWidth;
        let scaledImageHeight: number = contaninerAttribute.clientWidth * imageHeightWidthRatio;

        let zoomPreference: enums.ZoomPreference;
        let responseViewSettings: enums.ResponseViewSettings;
        if (scaledImageHeight > contaninerAttribute.clientHeight) {
            zoomPreference = enums.ZoomPreference.FitHeight;
            responseViewSettings = enums.ResponseViewSettings.FitToHeight;
        } else {
            zoomPreference = enums.ZoomPreference.FitWidth;
            responseViewSettings = enums.ResponseViewSettings.FitToWidth;
        }

        let zoomUserOption = userOptionHelper.getUserOptionByName
            (userOptionKeys.ZOOM_PREFERENCE,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        let userOption = zoomHelper.getZoomUserOption(zoomUserOption);
        let zoomPreferenceToSave = zoomHelper.updateZoomPreference(
            userOption.userOptionZoomValue,
            0,
            markingStore.instance.currentQuestionItemInfo.imageClusterId,
            zoomPreference,
            userOption.zoomHeader,
            this.props.selectedECourseworkPageID);
        userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, zoomPreferenceToSave,
            true, true, false, true,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        zoomPanelActionCreator.initiateResponseImageZoom(enums.ZoomType.None, responseViewSettings);
    }

    /**
     * on scroll position changed, update the page number.
     */
    private onScrollPositionChanged = () => {
        if (this.isUnStructured) {
            this.handlePageNumberIndicator();
        }
    }

    /**
     * get image container height.
     */
    private getImageContainerHeight(): number {
        let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
        let marksheetContainerHeight = 0;
        if (marksheetContainer) {
            if (!htmlUtilities.isAndroidDevice) {
                marksheetContainerHeight = marksheetContainer.clientHeight;
            } else {
                // Client Height vary in Android, so using offset height.
                // offsetHeight is not using as common since it is not correct in IE
                marksheetContainerHeight = marksheetContainer.offsetHeight;
            }
        }
        return marksheetContainerHeight;
    }

    /**
     * get image container width.
     */
    private getImageContainerWidth(): number {
        let marksheetContainer: Element = ReactDom.findDOMNode(this.refs.markSheet);
        let marksheetContainerWidth = 0;
        if (marksheetContainer) {
            marksheetContainerWidth = marksheetContainer.clientWidth;
        }
        return marksheetContainerWidth;
    }

    /**
     * Returns the scroll height ratio.
     * @param element
     */
    private getScrollHeightRatio(element: HTMLElement | Element): number {
        return (element.scrollTop / element.scrollHeight) * 100;
    }
}

export = ImageContainer;

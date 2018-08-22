/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import ImageViewerBase = require('./imageviewerbase');
import BusyIndicator = require('../../utility/busyindicator/busyindicator');
import enums = require('../../utility/enums');
import AnnotationOverlay = require('./annotationoverlay');
import Immutable = require('immutable');
import constants = require('../../utility/constants');
import LoadingIndiactor = require('../../utility/loadingindicator/loadingindicator');
import localeStore = require('../../../stores/locale/localestore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import ViewWholePageButton = require('./linktopage/viewwholepagebutton');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import stampStore = require('../../../stores/stamp/stampstore');
import UnzonedPlaceHolder = require('../nondigital/unzonedplaceholder');
import pageLinkHelper = require('./linktopage/pagelinkhelper');
import $ = require('jquery');

interface Props extends PropsBase, LocaleSelectionBase, PropsAnnotationOverlay {
    imageZone: ImageZone;
    image: string;
    onImageLoaded: Function;
    switchViewCallback: Function;
    outputPageNo: number;
    zoomPreference: enums.ZoomPreference;
    isResponseEditable: boolean;
    enableImageContainerScroll: Function;
    markSheetViewHolderWidth: number;
    enableCommentBox: boolean;
    isALinkedPage: boolean;
    biggestRatio: number;
    enableCommentsSideView: boolean;
    getImageNaturalDimension: Function;
    currentImageZones?: Immutable.List<ImageZone>;
    doApplyLinkingScenarios?: boolean;
    pagesLinkedByPreviousMarkers: number[];
    onScrollForZoom: Function;
    refreshCommnetContainer: Function;
    isEBookMarking: boolean;
    setScrollPositionCallback?: Function;
    marksheetContainerHeight: number;
    marksheetContainerWidth: number;
}

interface State {
    renderedOn: number;
    rotateAngle: number;
    zoomPreference: enums.ZoomPreference;
    markSheetDimensionChangedOn?: number;
}

/**
 * React component class for Single Image Zone
 */
class SingleImageViewer extends ImageViewerBase {

    private naturalWidth: number;
    private naturalHeight: number;
    private width: number = 0;
    private height: number = 0;
    private translateXForLinkedPages: number = 0;
    private translateYForLinkedPages: number = 0;
    private imageZoneWidthForLinkedPages: number = 100;
    private imageZoneHeightForLinkedPages: number = 100;


    // To check whether or not to set the image properties.
    private setImageProperties: boolean;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.setImageProperties = true;
        this.state = { renderedOn: 0, rotateAngle: 0, zoomPreference: this.props.zoomPreference, markSheetDimensionChangedOn: 0 };
        this.markingMethod = (props.isEBookMarking) ? enums.MarkingMethod.Unstructured : enums.MarkingMethod.Structured;
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.isMouseOverEnabled = this.isMouseOverEnabled.bind(this);
    }

    /**
     * component did update for single image viewer
     */
    public componentDidUpdate() {
        this.markSheetElement = this.getMarkSheetElement();
        this.checkForMarksheetDimensionChange(this.markSheetElement);

        // Defcet 69970 fix - set the image properties if it is not already set
        if (this.setImageProperties || !this.naturalWidth) {
            // Sets the image properties oncce after first render.
            this.setImagePropertiesForSingleImage(!this.naturalWidth);
            this.setImageProperties = false;
        }
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let aspectRatio: number = 0;
        let rotatedAspectRatio: number = 0;
        let marksheetStyle: React.CSSProperties;
        let wrapperStyle: React.CSSProperties;
        let scalerStyles: React.CSSProperties;

        //Settig the min height to 0 if sideview comment is not enabled
        if (this.props.enableCommentBox === false) {
            this.marksheetHolderMinHeight = 0;
        }
        this.marksheetContainerHeight = this.props.marksheetContainerHeight;
        this.marksheetContainerWidth = this.props.marksheetContainerWidth;
        let unzonedIcon = this.unZonedPlaceholderElement();
        if (this.state.renderedOn === 0 && !unzonedIcon) {
            return (
                <LoadingIndiactor id={enums.BusyIndicatorInvoker.none.toString()}
                    key={enums.BusyIndicatorInvoker.none.toString()} cssClass='section-loader loading' />
            );
        } else {
            let translateX = this.props.isALinkedPage ? this.translateXForLinkedPages :
                this.calculateTranslateX(this.naturalWidth, (this.props.imageZone.leftEdge ? this.props.imageZone.leftEdge : 0));
            let translateY = this.props.isALinkedPage ? this.translateYForLinkedPages :
                this.calculateTranslateY(this.naturalHeight, this.props.imageZone.topEdge);
            let width = this.props.isALinkedPage ? this.imageZoneWidthForLinkedPages :
                this.calculateWidth(this.naturalWidth, (this.props.imageZone.width ? this.props.imageZone.width : 100));

            let imgStyle = this.getImageStyle(translateX, translateY, width);
            let imageWidth;
            let imageHeight;

            [imageWidth, imageHeight] = this.imageProperties(this);

            let paddingTop = this.calculatePaddingTop(imageHeight, imageWidth);
            let scalerStyle = this.getScalerStyle(paddingTop);

            let sheetWidth = {
                'width': (imageWidth / this.width) * 100 + '%'
            };

            // Split the url and get the page No. For identifying the element
            let pageNo = this.pageNumber;

            let topAboveCurrentZone = 0;
            let zoneHeight = 0;
            let zoneTop = 0;
            let zoneLeft = 0;
            let skippedZones: any;
            if (this.props.doApplyLinkingScenarios === true) {
                if (this.props.isALinkedPage && this.props.imageZone && this.props.currentImageZones) {
                    // check if any zones are skipped without rendering for linking scenarios
                    skippedZones = this.props.currentImageZones.filter(item => item.pageNo === parseInt(pageNo)
                        && item.uniqueId !== this.props.imageZone.uniqueId);
                }
                if (this.props.imageZone) {
                    // get all the zones above the linked zone which was previously part of a stitched image
                    let zonesAboveCurrentZone = this.getZonesAboveAZone(this.props.imageZone);
                    topAboveCurrentZone = this.getHeightOfZones(zonesAboveCurrentZone);
                    zoneHeight = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.height);
                    zoneTop = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.topEdge);
                    zoneLeft = this.getImageZoneWidthInPx(this.naturalWidth,
                                    (this.props.imageZone.leftEdge ? this.props.imageZone.leftEdge : 0));
                }
            }

            // Calculate zone height and zone top to display annotation relative to zone.
            if (this.props.isEBookMarking && !this.props.isALinkedPage){
                zoneHeight = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.height);
                zoneTop = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.topEdge);
            }

            aspectRatio = imageWidth / imageHeight;
            rotatedAspectRatio = imageHeight / imageWidth;

            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg.
             * This is useful when user comes back from FR view
             */
            let _imgId: string = 'img_' + pageNo + '_' + this.props.outputPageNo;
            let displayAngle = this.getOriginalDisplayAngle(_imgId);

            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            [marksheetStyle, wrapperStyle, scalerStyles] = this.calculateImageStyleOnZoom(this.state.zoomPreference,
                displayAngle, aspectRatio, rotatedAspectRatio, 0,
                this.props.isALinkedPage ? this.imageZoneWidthForLinkedPages :
                            (this.props.imageZone.width ? this.props.imageZone.width : 100),
                this.props.markSheetViewHolderWidth, this.props.biggestRatio, this.props.enableCommentsSideView, _imgId,
                this.marksheetHeight, this.marksheetWidth);
            let imageClusterId = this.props.imageZone ? this.props.imageZone.imageClusterId : 0;

            let viewWholePageButton = ((markerOperationModeFactory.operationMode.showViewWholePageButton) ?
                <ViewWholePageButton id={'view_whole_page_' + pageNo} isStitched={false} imageZones={this.props.imageZone}
                    isMouseOverEnabled={this.isMouseOverEnabled(this.props.imageZone) }/>
                : null);

            let imageIdentifier = 'img_' + pageNo;
            let markSheetHolderClass = this.getClassNames() + ((unzonedIcon) ? ' unzoned-content' : '');
            return (
                <div className={markSheetHolderClass} style={marksheetStyle} id={'outputPageNo_' + this.props.outputPageNo }
                    ref={imageIdentifier + '_' + this.props.outputPageNo} data-id={imageIdentifier}>
                    <div className='marksheet-holder-inner'>
                        {unzonedIcon}
                        {unzonedIcon ? null : <div className='scaler-wrapper' style={scalerStyles}></div>}
                        {unzonedIcon ? null :
                            <div className='marksheet-wrapper' style={wrapperStyle}>
                                <div className='marksheet-img' style={sheetWidth}>
                                    <img src={this.props.image} style={imgStyle} onLoad={this.imageLoaded.bind(this, pageNo,
                                        0, this.naturalWidth, imageWidth, this.naturalHeight, imageHeight)}
                                        alt={localeStore.instance.TranslateText('marking.response.script-images.script-image-tooltip')} />
                                    <div className='scaler' style={scalerStyle} />
                                    {viewWholePageButton}
                                </div>
                                <AnnotationOverlay
                                    id={'annotationOverlay' + this.props.id + pageNo}
                                    selectedLanguage={this.props.selectedLanguage}
                                    outputPageNo={this.props.outputPageNo}
                                    imageClusterId={imageClusterId}
                                    currentOutputImageHeight={imageHeight}
                                    currentImageMaxWidth={imageWidth}
                                    getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                                    key={'annotationOverlay_' + pageNo}
                                    pageNo={0}
                                    structerdPageNo={parseInt(pageNo)}
                                    isDrawStart={this.props.isDrawStart}
                                    renderedOn={this.props.renderedOn}
                                    displayAngle={displayAngle}
                                    isResponseEditable={this.props.isResponseEditable}
                                    zoomPreference={this.state.zoomPreference}
                                    enableImageContainerScroll={this.props.enableImageContainerScroll}
                                    currentImageNaturalWidth={this.naturalWidth}
                                    enableCommentsSideView={this.props.enableCommentsSideView}
                                    isALinkedPage={this.props.isALinkedPage}
                                    topAboveCurrentZone={topAboveCurrentZone}
                                    renderedOnTime={Date.now()}
                                    zoneHeight={zoneHeight}
                                    zoneTop={zoneTop}
                                    zoneLeft={zoneLeft}
                                    skippedZones={skippedZones}
                                    currentImageZones={this.props.currentImageZones}
                                    getImageNaturalDimension={this.props.getImageNaturalDimension}
                                    currentImagePageNo={parseInt(pageNo)}
                                    doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                                    imageZone={this.props.imageZone}
                                    pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                                    getHeightOfZones={this.getHeightOfZones}
                                    refreshCommnetContainer={this.props.refreshCommnetContainer}
                                    isEBookMarking={this.props.isEBookMarking}/>
                            </div>}
                    </div>
                </div>);
        }
     }

    /**
     * Set the props if image loaded.
     * @param page
     */
    private imageLoaded(pageNumber: number, scrollTop: number, naturalImageWidth: number, clientImageWidth: number,
        naturalImageHeight: number, clientImageHeight: number): void {
        this.props.onImageLoaded(pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight,
            clientImageHeight, this.props.outputPageNo);
    }

    /* return the height of the zones with respect to the natural dimension of the image */
    private getHeightOfZones = (zones: Immutable.List<ImageZone>): number => {
        return this.getZonesHeight(zones);
    }

    /**
     * Returns true, when view whole page button is suppose to be displayed.
     */
    private isMouseOverEnabled(imageZone: ImageZone): boolean {
        return (imageZone && !(imageZone.topEdge === 0
            && imageZone.leftEdge === 0
            && imageZone.width === 100
            && imageZone.height === 100)
            && imageZone.isViewWholePageLinkVisible
            && toolbarStore.instance.selectedStampId === 0
            && toolbarStore.instance.panStampId === 0
            && !stampStore.instance.isDynamicAnnotationActive);
    }

    /**
     * set up the hammer events. not implemented in structured
     */
    protected setUpHammer(): void {
        return;
    }

    /**
     * destroy hammer events. not implemented in structured
     */
    protected destroyHammer(): void {
        return;
    }

    /**
     * returns Unzoned place holder based on image zones
     */
    private unZonedPlaceholderElement(): JSX.Element {
        let element: JSX.Element = (!this.props.currentImageZones ||
            (this.props.currentImageZones && !(this.props.currentImageZones.some((x: ImageZone) => x.height !== 0)))
        && !this.props.isALinkedPage) ?
            <UnzonedPlaceHolder
                key={'unzoned_icon_key'}
                id={'unzoned_icon_id'}
                selectedLanguage={this.props.selectedLanguage} />
            : undefined;
        return element;
    }

    /**
     * Sets the properties of a single image viewer.
     * @param doCallImageLoad
     */
    private setImagePropertiesForSingleImage = (doCallImageLoad: boolean) => {
        let that = this;
        let pageNo = this.pageNumber;
        let imageWidth: number;
        let imageHeight: number;

        this.getImageProperties(this.props.image, function (context: any) {
            that.naturalWidth = context.width;
            that.naturalHeight = context.height;
            [imageWidth, imageHeight] = that.imageProperties(that);

            that.width = imageWidth;
            if (that.isComponentMounted) {
                that.setState({ renderedOn: Date.now() });

                // Defcet 69970 fix - call onImageLoaded manually after setting the image properties, 
                // for recalculating this.props.markSheetViewHolderWidth & this.props.biggestRatio
                // and setting the wrapperStyle and avoid unzoned placeholder
                if (doCallImageLoad && that.state.renderedOn !== 0 && !that.unZonedPlaceholderElement()) {
                    that.props.onImageLoaded(pageNo, 0, that.naturalWidth, imageWidth, that.naturalHeight,
                        imageHeight, that.props.outputPageNo);
                }
            }
        });
    }

    /**
     * Gets the current page number
     */
    private get pageNumber(): string {
        return this.props.imageZone ? this.props.imageZone.pageNo :
            this.props.image ? this.props.image.split('/')[9] : 0;
    }

    /**
     * Gets the image propertie width and height
     */
    private imageProperties(that: this): number[] {
        let imageWidth = that.getImageZoneWidthInPx(that.naturalWidth,
            that.props.isALinkedPage ? that.imageZoneWidthForLinkedPages :
                (that.props.imageZone.width ? that.props.imageZone.width : 100));
        let imageHeight = that.getImageZoneHeightInPx(that.naturalHeight,
            that.props.isALinkedPage ? that.imageZoneHeightForLinkedPages : that.props.imageZone.height);

        return [imageWidth, imageHeight];
    }
}

export = SingleImageViewer;
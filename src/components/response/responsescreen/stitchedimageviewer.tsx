/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import ImageViewerBase = require('./imageviewerbase');
import Immutable = require('immutable');
import BusyIndicator = require('../../utility/busyindicator/busyindicator');
import enums = require('../../utility/enums');
import Promise = require('es6-promise');
import AnnotationOverlay = require('./annotationoverlay');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
import ViewWholePageButton = require('./linktopage/viewwholepagebutton');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import stampStore = require('../../../stores/stamp/stampstore');
import $ = require('jquery');


interface Props extends PropsBase, LocaleSelectionBase, PropsAnnotationOverlay {
    candidateScriptId: number;
    imageZones: Immutable.List<ImageZone>;
    images: string[];
    onImageLoaded: Function;
    switchViewCallback: Function;
    outputPageNo: number;
    zoomPreference: enums.ZoomPreference;
    isResponseEditable: boolean;
    enableImageContainerScroll: Function;
    markSheetViewHolderWidth: number;
    enableCommentBox: boolean;
    biggestRatio: number;
    enableCommentsSideView: boolean;
    currentImageZones?: Immutable.List<ImageZone>;
    doApplyLinkingScenarios: boolean;
    onScrollForZoom: Function;
    refreshCommnetContainer: Function;
    setScrollPositionCallback?: Function;
    marksheetContainerHeight: number;
    marksheetContainerWidth: number;
}

interface State {
    renderedOn: number;
    rotateAngle?: number;
    zoomPreference?: enums.ZoomPreference;
    markSheetDimensionChangedOn?: number;
}

/**
 * React component class for Stitched Image Zone
 * TO DO: Set Css to stitch the images from the collection.
 */
class StitchedImageZone extends ImageViewerBase {

    private imageCacheBuild: boolean;
    private imageInfoCache: any[];
    private imageCounter: number;
    private maxWidth: number;
    private stichedImagesMaxHeight: number = 0;

    // To check whether or not to set the image properties.
    private setImageProperties: boolean;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.setImageProperties = true;
        this.imageInfoCache = [];
        this.imageCacheBuild = false;
        this.imageCounter = 0;
        this.maxWidth = 0;
        this.state = { rotateAngle: 0, zoomPreference: this.props.zoomPreference, markSheetDimensionChangedOn: 0 };
        this.markingMethod = enums.MarkingMethod.Structured; this.getImageContainerRect = this.getImageContainerRect.bind(this);
        this.isMouseOverEnabled = this.isMouseOverEnabled.bind(this);
    }

    /**
     * component did update for single image viewer
     */
    public componentDidUpdate() {
        this.markSheetElement = this.getMarkSheetElement();
        this.checkForMarksheetDimensionChange(this.markSheetElement);
        if (this.setImageProperties) {
            // Sets the image properties oncce after first render.
            this.setImagePropertiesForStitchedImage();
            this.setImageProperties = false;
        }
    }


    /**
     * This method is used to get the imagezone client rect
     */
    public getImageContainerRect() {
        let imageZoneClientRects: Array<ClientRectDOM> = [];
        let index = 0;
        this.props.imageZones.map((imageZone: ImageZone) => {
            imageZoneClientRects[index] = ReactDom.findDOMNode(this.refs['marksheetImgHolder_' + index]).getBoundingClientRect();
            index++;
        });
        return imageZoneClientRects;
    }

    /**
     * gets the maximum width among stitched zones
     * @param {any} imageZones
     */
    private getMaxImageWidthAmongStitchedZones(imageZones: any): any {
        let that = this;
        let maxZoneWidth: number = 0;
        let naturalImageWidthForMaxWidthZone: number = 0;
        let maxStichedImagesWidthInPerc: number = 0;
        imageZones.map(function (imageZone: ImageZone) {
            let keyIndex: number = imageZones.indexOf(imageZone);
            let naturalWidth: number = that.imageInfoCache[keyIndex] ? that.imageInfoCache[keyIndex].naturalWidth : 0;
            let zoneWidth: number = that.getImageZoneWidthInPx(naturalWidth, (imageZone.width ? imageZone.width : 100));
            if (zoneWidth > maxZoneWidth) {
                maxZoneWidth = zoneWidth;
                naturalImageWidthForMaxWidthZone = naturalWidth;
                maxStichedImagesWidthInPerc = (imageZone.width ? imageZone.width : 100);
            }
        });
        return [maxZoneWidth, naturalImageWidthForMaxWidthZone, maxStichedImagesWidthInPerc];
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let stichedImagesHeight = 0;
        let maxStichedImagesWidthInPerc = 0;
        let maxImageWidth = 0;
        let index: number = 0;
        let imageClusterId: number = 0;
        let imageZones: Array<ImageZone> = [];
        let overlayWidth: number = 0;
        let aspectRatio: number = 0;
        let rotatedAspectRatio: number = 0;
        let marksheetStyle: React.CSSProperties;
        let wrapperStyle: React.CSSProperties;
        let scalerStyles: React.CSSProperties;
        // Split the url and get the page No. For identifying the element
        let pageNo = this.props.images[0].split('/')[9];
        let selectedNaturalImageWidth: number = 0;

        //Settig the min height to 0 if sideview comment is not enabled
        if (this.props.enableCommentBox === false) {
            this.marksheetHolderMinHeight = 0;
        }
        this.marksheetContainerHeight = this.props.marksheetContainerHeight;
        this.marksheetContainerWidth = this.props.marksheetContainerWidth;
        [maxImageWidth, selectedNaturalImageWidth, maxStichedImagesWidthInPerc] =
            this.getMaxImageWidthAmongStitchedZones(this.props.imageZones);
        if (maxImageWidth === 0) {
            /** tslint:disable:no-console */
            // console.log('Render busy indicator in stiched image viewer');
            /** tslint:enable:no-console */
            return (
                <LoadingIndicator id={enums.BusyIndicatorInvoker.none.toString()}
                    key={enums.BusyIndicatorInvoker.none.toString()} cssClass='section-loader loading' />
            );
        } else {
            //
            let topAboveCurrentZone = 0;
            let zoneHeight = 0;
            if (this.props.doApplyLinkingScenarios === true) {
                let firstStitchedZone: ImageZone = this.props.imageZones.first();
                let zonesAboveCurrentZone = this.getZonesAboveAZone(firstStitchedZone);
                topAboveCurrentZone = this.getZonesHeight(zonesAboveCurrentZone);
                zoneHeight = this.getZonesHeight(this.props.imageZones);
            }

            let toRender = this.props.imageZones.map((imageZone: ImageZone) => {
                let keyIndex = this.props.imageZones.indexOf(imageZone);
                imageClusterId = imageZone.imageClusterId;

                /** tslint:disable:no-console */
                // console.log('Render stiched image viewer contents');
                /* tslint:enable:no-console */
                let naturalWidth = this.imageInfoCache[keyIndex] ? this.imageInfoCache[keyIndex].naturalWidth : 0;
                let naturalHeight = this.imageInfoCache[keyIndex] ? this.imageInfoCache[keyIndex].naturalHeight : 0;

                let translateX = this.calculateTranslateX(naturalWidth, (imageZone.leftEdge ? imageZone.leftEdge : 0));
                let translateY = this.calculateTranslateY(naturalHeight, imageZone.topEdge);
                let width = this.calculateWidth(naturalWidth, (imageZone.width ? imageZone.width : 100));
                let imgStyle = this.getImageStyle(translateX, translateY, width);

                let imageHeight = this.getImageZoneHeightInPx(naturalHeight, imageZone.height);
                let imageWidth = this.getImageZoneWidthInPx(naturalWidth, (imageZone.width ? imageZone.width : 100));
                let paddingTop = this.calculatePaddingTop(imageHeight, imageWidth);
                let scalerStyle = this.getScalerStyle(paddingTop);

                // Annotation holder should consider Maximum width of zoned image width. Should not consider the actual image width.
                // maxImageWidth = imageWidth > maxImageWidth ? imageWidth : maxImageWidth;

                if (imageWidth > maxImageWidth) {
                    maxImageWidth = imageWidth;
                    selectedNaturalImageWidth = naturalWidth;
                    maxStichedImagesWidthInPerc = (imageZone.width ? imageZone.width : 100);
                }

                stichedImagesHeight = stichedImagesHeight + imageHeight;
                imageZone.holderWidth = (imageWidth / maxImageWidth) * 100;
                imageZone.zonePaddingTop = paddingTop;
                imageZones.push(imageZone);

                let sheetWidth = {
                    'width': (imageWidth / maxImageWidth) * 100 + '%'
                };

                let viewWholePageButton = ((markerOperationModeFactory.operationMode.showViewWholePageButton) ?
                    <ViewWholePageButton id={'view_whole_page_' + index + '_' + imageZone.outputPageNo} isStitched={true}
                        imageZones={imageZone} isMouseOverEnabled={this.isMouseOverEnabled(imageZone)}/>
                    : null);

                return (
                    <div key={'key_' + this.props.id + 'stitched_div' + keyIndex} className='marksheet-img stitched'
                        style={sheetWidth} ref={'marksheetImgHolder_' + index}
                        id={'marksheetImgHolder_' + index + '_' + imageZone.outputPageNo}>
                        <img alt='stitched_img' key={'key_' + this.props.id + 'stitched_img' + keyIndex}
                            onLoad={this.imageLoaded.bind(this, imageZone.pageNo,
                                0, naturalWidth, maxImageWidth, naturalHeight)}
                            src={this.props.images[index++]} style={imgStyle} />
                        <div className='scaler' style={scalerStyle} />
                        {viewWholePageButton}
                    </div>
                );
            });

            // This sepereator is added to set the scaler wrapper padding top style
            // to adjust with the seperator gap.
            let seperator = 3 * (index - 1);

            //stichedImagesHeight += maxImageWidth * ((3 * (index - 1)) / 100);

            // This indicates the width without the seperator. It should consider for rotating the image and fit to
            // the viewable area.
            var actualMaxWidth = maxImageWidth - maxImageWidth * (seperator / 100);
            // adding the seperator gap to the total image height. unless placing the annotations
            // will not be in correct position.
            stichedImagesHeight += maxImageWidth * (seperator / 100);
            aspectRatio = (maxImageWidth / stichedImagesHeight);
            rotatedAspectRatio = (stichedImagesHeight / maxImageWidth);
            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg.
             * This is useful when user comes back from FR view
             */
            let _imgId: string = 'img_' + pageNo + '_' + this.props.outputPageNo;
            let displayAngle = this.getOriginalDisplayAngle(_imgId);
            this.stichedImagesMaxHeight = stichedImagesHeight;

            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            [marksheetStyle, wrapperStyle, scalerStyles] = this.calculateImageStyleOnZoom(this.state.zoomPreference,
                displayAngle, aspectRatio, rotatedAspectRatio, seperator, maxStichedImagesWidthInPerc,
                this.props.markSheetViewHolderWidth, this.props.biggestRatio, this.props.enableCommentsSideView, _imgId,
                this.marksheetHeight, this.marksheetWidth);

            let imageIdentifier = 'img_' + pageNo;
            return (
                <div className={this.getClassNames() + ' stiched'} style={marksheetStyle}
                    id={'outputPageNo_' + this.props.outputPageNo}
                    ref={imageIdentifier + '_' + this.props.outputPageNo} data-id={imageIdentifier}>
                    <div className='marksheet-holder-inner'>
                        <div className='scaler-wrapper' style={scalerStyles}></div>
                        <div className='marksheet-wrapper' style={wrapperStyle}>
                            {toRender}
                            <AnnotationOverlay
                                id={'annotationOverlay' + this.props.id + pageNo}
                                selectedLanguage={this.props.selectedLanguage}
                                outputPageNo={this.props.outputPageNo}
                                imageClusterId={imageClusterId}
                                currentOutputImageHeight={stichedImagesHeight}
                                currentImageMaxWidth={maxImageWidth}
                                imageZones={imageZones}
                                getImageContainerRect={this.getImageContainerRect}
                                getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                                key={'annotationOverlay_' + pageNo}
                                pageNo={0}
                                structerdPageNo = {pageNo}
                                isDrawStart = {this.props.isDrawStart}
                                renderedOn =  {this.props.renderedOn}
                                zoomPreference = {this.state.zoomPreference}
                                isResponseEditable = {this.props.isResponseEditable}
                                displayAngle={displayAngle}
                                enableImageContainerScroll={this.props.enableImageContainerScroll}
                                currentImageNaturalWidth={selectedNaturalImageWidth}
                                enableCommentsSideView={this.props.enableCommentsSideView}
                                renderedOnTime={Date.now()}
                                zoneTop={0}
                                zoneLeft={0}
                                zoneHeight={zoneHeight}
                                topAboveCurrentZone={topAboveCurrentZone}
                                doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                                getImageNaturalDimension={this.props.getImageNaturalDimension}
                                refreshCommnetContainer={this.props.refreshCommnetContainer}/>
                        </div>
                    </div>
                </div>
            );
        }
    }

    /**
     * Set the props if image loaded.
     * @param page
     */
    private imageLoaded(pageNumber: number, scrollTop: number, naturalImageWidth?: number, clientImageWidth?: number,
        naturalImageHeight?: number): void {
        this.props.onImageLoaded(pageNumber, scrollTop, naturalImageWidth, clientImageWidth,
            naturalImageHeight, this.stichedImagesMaxHeight, this.props.outputPageNo);
    }

    /**
     * Invoked when the annotation is dropped on the script
     */
    private allowDrop(): void {
        return;
    }

    /**
     * Returns true, when view whole page button is suppose to be displayed.
     */
    private isMouseOverEnabled(imageZone: ImageZone): boolean {
        return (imageZone && !(imageZone.topEdge === 0
            && (imageZone.leftEdge ? imageZone.leftEdge : 0) === 0
            && (imageZone.width ? imageZone.width : 100) === 100
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
     * Sets the properties of a stitched response image viewer.
     */
    private setImagePropertiesForStitchedImage = () => {
        let index: number = 0;
        this.props.imageZones.forEach((imageZone: ImageZone) => {

            let keyIndex = this.props.imageZones.indexOf(imageZone);

            if (this.imageCacheBuild === false) {

                let that = this;

                this.getImageProperties(this.props.images[index++], function (context: any) {
                    /* tslint:disable:no-console */
                    // console.log('Callback image properties in stiched image viewer');
                    /* tslint:enable:no-console */

                    if (that.getImageZoneWidthInPx(context.width, imageZone.width) > that.maxWidth) {
                        that.maxWidth = context.width;
                    }

                    that.imageInfoCache[keyIndex] = { naturalWidth: context.width, naturalHeight: context.height };

                    if (that.props.imageZones.count() === ++that.imageCounter) {
                        that.imageCacheBuild = true;
                        that.setState({ renderedOn: Date.now() });
                    }
                });
            }
        });
    }
}
export = StitchedImageZone;
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ImageViewerBase = require('./imageviewerbase');
var enums = require('../../utility/enums');
var AnnotationOverlay = require('./annotationoverlay');
var LoadingIndiactor = require('../../utility/loadingindicator/loadingindicator');
var localeStore = require('../../../stores/locale/localestore');
var ViewWholePageButton = require('./linktopage/viewwholepagebutton');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var stampStore = require('../../../stores/stamp/stampstore');
var UnzonedPlaceHolder = require('../nondigital/unzonedplaceholder');
/**
 * React component class for Single Image Zone
 */
var SingleImageViewer = (function (_super) {
    __extends(SingleImageViewer, _super);
    /**
     * @constructor
     */
    function SingleImageViewer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.width = 0;
        this.height = 0;
        this.translateXForLinkedPages = 0;
        this.translateYForLinkedPages = 0;
        this.imageZoneWidthForLinkedPages = 100;
        this.imageZoneHeightForLinkedPages = 100;
        /* return the height of the zones with respect to the natural dimension of the image */
        this.getHeightOfZones = function (zones) {
            return _this.getZonesHeight(zones);
        };
        /**
         * Sets the properties of a single image viewer.
         * @param doCallImageLoad
         */
        this.setImagePropertiesForSingleImage = function (doCallImageLoad) {
            var that = _this;
            var pageNo = _this.pageNumber;
            var imageWidth;
            var imageHeight;
            _this.getImageProperties(_this.props.image, function (context) {
                that.naturalWidth = context.width;
                that.naturalHeight = context.height;
                _a = that.imageProperties(that), imageWidth = _a[0], imageHeight = _a[1];
                that.width = imageWidth;
                if (that.isComponentMounted) {
                    that.setState({ renderedOn: Date.now() });
                    // Defcet 69970 fix - call onImageLoaded manually after setting the image properties, 
                    // for recalculating this.props.markSheetViewHolderWidth & this.props.biggestRatio
                    // and setting the wrapperStyle and avoid unzoned placeholder
                    if (doCallImageLoad && that.state.renderedOn !== 0 && !that.unZonedPlaceholderElement()) {
                        that.props.onImageLoaded(pageNo, 0, that.naturalWidth, imageWidth, that.naturalHeight, imageHeight, that.props.outputPageNo);
                    }
                }
                var _a;
            });
        };
        this.setImageProperties = true;
        this.state = { renderedOn: 0, rotateAngle: 0, zoomPreference: this.props.zoomPreference, markSheetDimensionChangedOn: 0 };
        this.markingMethod = (props.isEBookMarking) ? enums.MarkingMethod.Unstructured : enums.MarkingMethod.Structured;
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.isMouseOverEnabled = this.isMouseOverEnabled.bind(this);
    }
    /**
     * component did update for single image viewer
     */
    SingleImageViewer.prototype.componentDidUpdate = function () {
        this.markSheetElement = this.getMarkSheetElement();
        this.checkForMarksheetDimensionChange(this.markSheetElement);
        // Defcet 69970 fix - set the image properties if it is not already set
        if (this.setImageProperties || !this.naturalWidth) {
            // Sets the image properties oncce after first render.
            this.setImagePropertiesForSingleImage(!this.naturalWidth);
            this.setImageProperties = false;
        }
    };
    /**
     * Render method
     */
    SingleImageViewer.prototype.render = function () {
        var _this = this;
        var aspectRatio = 0;
        var rotatedAspectRatio = 0;
        var marksheetStyle;
        var wrapperStyle;
        var scalerStyles;
        //Settig the min height to 0 if sideview comment is not enabled
        if (this.props.enableCommentBox === false) {
            this.marksheetHolderMinHeight = 0;
        }
        this.marksheetContainerHeight = this.props.marksheetContainerHeight;
        this.marksheetContainerWidth = this.props.marksheetContainerWidth;
        var unzonedIcon = this.unZonedPlaceholderElement();
        if (this.state.renderedOn === 0 && !unzonedIcon) {
            return (React.createElement(LoadingIndiactor, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: 'section-loader loading'}));
        }
        else {
            var translateX = this.props.isALinkedPage ? this.translateXForLinkedPages :
                this.calculateTranslateX(this.naturalWidth, (this.props.imageZone.leftEdge ? this.props.imageZone.leftEdge : 0));
            var translateY = this.props.isALinkedPage ? this.translateYForLinkedPages :
                this.calculateTranslateY(this.naturalHeight, this.props.imageZone.topEdge);
            var width = this.props.isALinkedPage ? this.imageZoneWidthForLinkedPages :
                this.calculateWidth(this.naturalWidth, (this.props.imageZone.width ? this.props.imageZone.width : 100));
            var imgStyle = this.getImageStyle(translateX, translateY, width);
            var imageWidth = void 0;
            var imageHeight = void 0;
            _a = this.imageProperties(this), imageWidth = _a[0], imageHeight = _a[1];
            var paddingTop = this.calculatePaddingTop(imageHeight, imageWidth);
            var scalerStyle = this.getScalerStyle(paddingTop);
            var sheetWidth = {
                'width': (imageWidth / this.width) * 100 + '%'
            };
            // Split the url and get the page No. For identifying the element
            var pageNo_1 = this.pageNumber;
            var topAboveCurrentZone = 0;
            var zoneHeight = 0;
            var zoneTop = 0;
            var zoneLeft = 0;
            var skippedZones = void 0;
            if (this.props.doApplyLinkingScenarios === true) {
                if (this.props.isALinkedPage && this.props.imageZone && this.props.currentImageZones) {
                    // check if any zones are skipped without rendering for linking scenarios
                    skippedZones = this.props.currentImageZones.filter(function (item) { return item.pageNo === parseInt(pageNo_1)
                        && item.uniqueId !== _this.props.imageZone.uniqueId; });
                }
                if (this.props.imageZone) {
                    // get all the zones above the linked zone which was previously part of a stitched image
                    var zonesAboveCurrentZone = this.getZonesAboveAZone(this.props.imageZone);
                    topAboveCurrentZone = this.getHeightOfZones(zonesAboveCurrentZone);
                    zoneHeight = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.height);
                    zoneTop = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.topEdge);
                    zoneLeft = this.getImageZoneWidthInPx(this.naturalWidth, (this.props.imageZone.leftEdge ? this.props.imageZone.leftEdge : 0));
                }
            }
            // Calculate zone height and zone top to display annotation relative to zone.
            if (this.props.isEBookMarking && !this.props.isALinkedPage) {
                zoneHeight = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.height);
                zoneTop = this.getImageZoneHeightInPx(this.naturalHeight, this.props.imageZone.topEdge);
            }
            aspectRatio = imageWidth / imageHeight;
            rotatedAspectRatio = imageHeight / imageWidth;
            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg.
             * This is useful when user comes back from FR view
             */
            var _imgId = 'img_' + pageNo_1 + '_' + this.props.outputPageNo;
            var displayAngle = this.getOriginalDisplayAngle(_imgId);
            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            _b = this.calculateImageStyleOnZoom(this.state.zoomPreference, displayAngle, aspectRatio, rotatedAspectRatio, 0, this.props.isALinkedPage ? this.imageZoneWidthForLinkedPages :
                (this.props.imageZone.width ? this.props.imageZone.width : 100), this.props.markSheetViewHolderWidth, this.props.biggestRatio, this.props.enableCommentsSideView, _imgId, this.marksheetHeight, this.marksheetWidth), marksheetStyle = _b[0], wrapperStyle = _b[1], scalerStyles = _b[2];
            var imageClusterId = this.props.imageZone ? this.props.imageZone.imageClusterId : 0;
            var viewWholePageButton = ((markerOperationModeFactory.operationMode.showViewWholePageButton) ?
                React.createElement(ViewWholePageButton, {id: 'view_whole_page_' + pageNo_1, isStitched: false, imageZones: this.props.imageZone, isMouseOverEnabled: this.isMouseOverEnabled(this.props.imageZone)})
                : null);
            var imageIdentifier = 'img_' + pageNo_1;
            var markSheetHolderClass = this.getClassNames() + ((unzonedIcon) ? ' unzoned-content' : '');
            return (React.createElement("div", {className: markSheetHolderClass, style: marksheetStyle, id: 'outputPageNo_' + this.props.outputPageNo, ref: imageIdentifier + '_' + this.props.outputPageNo, "data-id": imageIdentifier}, React.createElement("div", {className: 'marksheet-holder-inner'}, unzonedIcon, unzonedIcon ? null : React.createElement("div", {className: 'scaler-wrapper', style: scalerStyles}), unzonedIcon ? null :
                React.createElement("div", {className: 'marksheet-wrapper', style: wrapperStyle}, React.createElement("div", {className: 'marksheet-img', style: sheetWidth}, React.createElement("img", {src: this.props.image, style: imgStyle, onLoad: this.imageLoaded.bind(this, pageNo_1, 0, this.naturalWidth, imageWidth, this.naturalHeight, imageHeight), alt: localeStore.instance.TranslateText('marking.response.script-images.script-image-tooltip')}), React.createElement("div", {className: 'scaler', style: scalerStyle}), viewWholePageButton), React.createElement(AnnotationOverlay, {id: 'annotationOverlay' + this.props.id + pageNo_1, selectedLanguage: this.props.selectedLanguage, outputPageNo: this.props.outputPageNo, imageClusterId: imageClusterId, currentOutputImageHeight: imageHeight, currentImageMaxWidth: imageWidth, getMarkSheetContainerProperties: this.props.getMarkSheetContainerProperties, key: 'annotationOverlay_' + pageNo_1, pageNo: 0, structerdPageNo: parseInt(pageNo_1), isDrawStart: this.props.isDrawStart, renderedOn: this.props.renderedOn, displayAngle: displayAngle, isResponseEditable: this.props.isResponseEditable, zoomPreference: this.state.zoomPreference, enableImageContainerScroll: this.props.enableImageContainerScroll, currentImageNaturalWidth: this.naturalWidth, enableCommentsSideView: this.props.enableCommentsSideView, isALinkedPage: this.props.isALinkedPage, topAboveCurrentZone: topAboveCurrentZone, renderedOnTime: Date.now(), zoneHeight: zoneHeight, zoneTop: zoneTop, zoneLeft: zoneLeft, skippedZones: skippedZones, currentImageZones: this.props.currentImageZones, getImageNaturalDimension: this.props.getImageNaturalDimension, currentImagePageNo: parseInt(pageNo_1), doApplyLinkingScenarios: this.props.doApplyLinkingScenarios, imageZone: this.props.imageZone, pagesLinkedByPreviousMarkers: this.props.pagesLinkedByPreviousMarkers, getHeightOfZones: this.getHeightOfZones, refreshCommnetContainer: this.props.refreshCommnetContainer, isEBookMarking: this.props.isEBookMarking})))));
        }
        var _a, _b;
    };
    /**
     * Set the props if image loaded.
     * @param page
     */
    SingleImageViewer.prototype.imageLoaded = function (pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight, clientImageHeight) {
        this.props.onImageLoaded(pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight, clientImageHeight, this.props.outputPageNo);
    };
    /**
     * Returns true, when view whole page button is suppose to be displayed.
     */
    SingleImageViewer.prototype.isMouseOverEnabled = function (imageZone) {
        return (imageZone && !(imageZone.topEdge === 0
            && imageZone.leftEdge === 0
            && imageZone.width === 100
            && imageZone.height === 100)
            && imageZone.isViewWholePageLinkVisible
            && toolbarStore.instance.selectedStampId === 0
            && toolbarStore.instance.panStampId === 0
            && !stampStore.instance.isDynamicAnnotationActive);
    };
    /**
     * set up the hammer events. not implemented in structured
     */
    SingleImageViewer.prototype.setUpHammer = function () {
        return;
    };
    /**
     * destroy hammer events. not implemented in structured
     */
    SingleImageViewer.prototype.destroyHammer = function () {
        return;
    };
    /**
     * returns Unzoned place holder based on image zones
     */
    SingleImageViewer.prototype.unZonedPlaceholderElement = function () {
        var element = (!this.props.currentImageZones ||
            (this.props.currentImageZones && !(this.props.currentImageZones.some(function (x) { return x.height !== 0; })))
                && !this.props.isALinkedPage) ?
            React.createElement(UnzonedPlaceHolder, {key: 'unzoned_icon_key', id: 'unzoned_icon_id', selectedLanguage: this.props.selectedLanguage})
            : undefined;
        return element;
    };
    Object.defineProperty(SingleImageViewer.prototype, "pageNumber", {
        /**
         * Gets the current page number
         */
        get: function () {
            return this.props.imageZone ? this.props.imageZone.pageNo :
                this.props.image ? this.props.image.split('/')[9] : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the image propertie width and height
     */
    SingleImageViewer.prototype.imageProperties = function (that) {
        var imageWidth = that.getImageZoneWidthInPx(that.naturalWidth, that.props.isALinkedPage ? that.imageZoneWidthForLinkedPages :
            (that.props.imageZone.width ? that.props.imageZone.width : 100));
        var imageHeight = that.getImageZoneHeightInPx(that.naturalHeight, that.props.isALinkedPage ? that.imageZoneHeightForLinkedPages : that.props.imageZone.height);
        return [imageWidth, imageHeight];
    };
    return SingleImageViewer;
}(ImageViewerBase));
module.exports = SingleImageViewer;
//# sourceMappingURL=singleimageviewer.js.map
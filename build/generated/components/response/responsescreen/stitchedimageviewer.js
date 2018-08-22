"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
var ImageViewerBase = require('./imageviewerbase');
var enums = require('../../utility/enums');
var AnnotationOverlay = require('./annotationoverlay');
var LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
var ViewWholePageButton = require('./linktopage/viewwholepagebutton');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var stampStore = require('../../../stores/stamp/stampstore');
/**
 * React component class for Stitched Image Zone
 * TO DO: Set Css to stitch the images from the collection.
 */
var StitchedImageZone = (function (_super) {
    __extends(StitchedImageZone, _super);
    /**
     * @constructor
     */
    function StitchedImageZone(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.stichedImagesMaxHeight = 0;
        /**
         * Sets the properties of a stitched response image viewer.
         */
        this.setImagePropertiesForStitchedImage = function () {
            var index = 0;
            _this.props.imageZones.forEach(function (imageZone) {
                var keyIndex = _this.props.imageZones.indexOf(imageZone);
                if (_this.imageCacheBuild === false) {
                    var that_1 = _this;
                    _this.getImageProperties(_this.props.images[index++], function (context) {
                        /* tslint:disable:no-console */
                        // console.log('Callback image properties in stiched image viewer');
                        /* tslint:enable:no-console */
                        if (that_1.getImageZoneWidthInPx(context.width, imageZone.width) > that_1.maxWidth) {
                            that_1.maxWidth = context.width;
                        }
                        that_1.imageInfoCache[keyIndex] = { naturalWidth: context.width, naturalHeight: context.height };
                        if (that_1.props.imageZones.count() === ++that_1.imageCounter) {
                            that_1.imageCacheBuild = true;
                            that_1.setState({ renderedOn: Date.now() });
                        }
                    });
                }
            });
        };
        this.setImageProperties = true;
        this.imageInfoCache = [];
        this.imageCacheBuild = false;
        this.imageCounter = 0;
        this.maxWidth = 0;
        this.state = { rotateAngle: 0, zoomPreference: this.props.zoomPreference, markSheetDimensionChangedOn: 0 };
        this.markingMethod = enums.MarkingMethod.Structured;
        this.getImageContainerRect = this.getImageContainerRect.bind(this);
        this.isMouseOverEnabled = this.isMouseOverEnabled.bind(this);
    }
    /**
     * component did update for single image viewer
     */
    StitchedImageZone.prototype.componentDidUpdate = function () {
        this.markSheetElement = this.getMarkSheetElement();
        this.checkForMarksheetDimensionChange(this.markSheetElement);
        if (this.setImageProperties) {
            // Sets the image properties oncce after first render.
            this.setImagePropertiesForStitchedImage();
            this.setImageProperties = false;
        }
    };
    /**
     * This method is used to get the imagezone client rect
     */
    StitchedImageZone.prototype.getImageContainerRect = function () {
        var _this = this;
        var imageZoneClientRects = [];
        var index = 0;
        this.props.imageZones.map(function (imageZone) {
            imageZoneClientRects[index] = ReactDom.findDOMNode(_this.refs['marksheetImgHolder_' + index]).getBoundingClientRect();
            index++;
        });
        return imageZoneClientRects;
    };
    /**
     * gets the maximum width among stitched zones
     * @param {any} imageZones
     */
    StitchedImageZone.prototype.getMaxImageWidthAmongStitchedZones = function (imageZones) {
        var that = this;
        var maxZoneWidth = 0;
        var naturalImageWidthForMaxWidthZone = 0;
        var maxStichedImagesWidthInPerc = 0;
        imageZones.map(function (imageZone) {
            var keyIndex = imageZones.indexOf(imageZone);
            var naturalWidth = that.imageInfoCache[keyIndex] ? that.imageInfoCache[keyIndex].naturalWidth : 0;
            var zoneWidth = that.getImageZoneWidthInPx(naturalWidth, (imageZone.width ? imageZone.width : 100));
            if (zoneWidth > maxZoneWidth) {
                maxZoneWidth = zoneWidth;
                naturalImageWidthForMaxWidthZone = naturalWidth;
                maxStichedImagesWidthInPerc = (imageZone.width ? imageZone.width : 100);
            }
        });
        return [maxZoneWidth, naturalImageWidthForMaxWidthZone, maxStichedImagesWidthInPerc];
    };
    /**
     * Render method
     */
    StitchedImageZone.prototype.render = function () {
        var _this = this;
        var stichedImagesHeight = 0;
        var maxStichedImagesWidthInPerc = 0;
        var maxImageWidth = 0;
        var index = 0;
        var imageClusterId = 0;
        var imageZones = [];
        var overlayWidth = 0;
        var aspectRatio = 0;
        var rotatedAspectRatio = 0;
        var marksheetStyle;
        var wrapperStyle;
        var scalerStyles;
        // Split the url and get the page No. For identifying the element
        var pageNo = this.props.images[0].split('/')[9];
        var selectedNaturalImageWidth = 0;
        //Settig the min height to 0 if sideview comment is not enabled
        if (this.props.enableCommentBox === false) {
            this.marksheetHolderMinHeight = 0;
        }
        this.marksheetContainerHeight = this.props.marksheetContainerHeight;
        this.marksheetContainerWidth = this.props.marksheetContainerWidth;
        _a = this.getMaxImageWidthAmongStitchedZones(this.props.imageZones), maxImageWidth = _a[0], selectedNaturalImageWidth = _a[1], maxStichedImagesWidthInPerc = _a[2];
        if (maxImageWidth === 0) {
            /** tslint:disable:no-console */
            // console.log('Render busy indicator in stiched image viewer');
            /** tslint:enable:no-console */
            return (React.createElement(LoadingIndicator, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: 'section-loader loading'}));
        }
        else {
            //
            var topAboveCurrentZone = 0;
            var zoneHeight = 0;
            if (this.props.doApplyLinkingScenarios === true) {
                var firstStitchedZone = this.props.imageZones.first();
                var zonesAboveCurrentZone = this.getZonesAboveAZone(firstStitchedZone);
                topAboveCurrentZone = this.getZonesHeight(zonesAboveCurrentZone);
                zoneHeight = this.getZonesHeight(this.props.imageZones);
            }
            var toRender = this.props.imageZones.map(function (imageZone) {
                var keyIndex = _this.props.imageZones.indexOf(imageZone);
                imageClusterId = imageZone.imageClusterId;
                /** tslint:disable:no-console */
                // console.log('Render stiched image viewer contents');
                /* tslint:enable:no-console */
                var naturalWidth = _this.imageInfoCache[keyIndex] ? _this.imageInfoCache[keyIndex].naturalWidth : 0;
                var naturalHeight = _this.imageInfoCache[keyIndex] ? _this.imageInfoCache[keyIndex].naturalHeight : 0;
                var translateX = _this.calculateTranslateX(naturalWidth, (imageZone.leftEdge ? imageZone.leftEdge : 0));
                var translateY = _this.calculateTranslateY(naturalHeight, imageZone.topEdge);
                var width = _this.calculateWidth(naturalWidth, (imageZone.width ? imageZone.width : 100));
                var imgStyle = _this.getImageStyle(translateX, translateY, width);
                var imageHeight = _this.getImageZoneHeightInPx(naturalHeight, imageZone.height);
                var imageWidth = _this.getImageZoneWidthInPx(naturalWidth, (imageZone.width ? imageZone.width : 100));
                var paddingTop = _this.calculatePaddingTop(imageHeight, imageWidth);
                var scalerStyle = _this.getScalerStyle(paddingTop);
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
                var sheetWidth = {
                    'width': (imageWidth / maxImageWidth) * 100 + '%'
                };
                var viewWholePageButton = ((markerOperationModeFactory.operationMode.showViewWholePageButton) ?
                    React.createElement(ViewWholePageButton, {id: 'view_whole_page_' + index + '_' + imageZone.outputPageNo, isStitched: true, imageZones: imageZone, isMouseOverEnabled: _this.isMouseOverEnabled(imageZone)})
                    : null);
                return (React.createElement("div", {key: 'key_' + _this.props.id + 'stitched_div' + keyIndex, className: 'marksheet-img stitched', style: sheetWidth, ref: 'marksheetImgHolder_' + index, id: 'marksheetImgHolder_' + index + '_' + imageZone.outputPageNo}, React.createElement("img", {alt: 'stitched_img', key: 'key_' + _this.props.id + 'stitched_img' + keyIndex, onLoad: _this.imageLoaded.bind(_this, imageZone.pageNo, 0, naturalWidth, maxImageWidth, naturalHeight), src: _this.props.images[index++], style: imgStyle}), React.createElement("div", {className: 'scaler', style: scalerStyle}), viewWholePageButton));
            });
            // This sepereator is added to set the scaler wrapper padding top style
            // to adjust with the seperator gap.
            var seperator = 3 * (index - 1);
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
            var _imgId = 'img_' + pageNo + '_' + this.props.outputPageNo;
            var displayAngle = this.getOriginalDisplayAngle(_imgId);
            this.stichedImagesMaxHeight = stichedImagesHeight;
            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            _b = this.calculateImageStyleOnZoom(this.state.zoomPreference, displayAngle, aspectRatio, rotatedAspectRatio, seperator, maxStichedImagesWidthInPerc, this.props.markSheetViewHolderWidth, this.props.biggestRatio, this.props.enableCommentsSideView, _imgId, this.marksheetHeight, this.marksheetWidth), marksheetStyle = _b[0], wrapperStyle = _b[1], scalerStyles = _b[2];
            var imageIdentifier = 'img_' + pageNo;
            return (React.createElement("div", {className: this.getClassNames() + ' stiched', style: marksheetStyle, id: 'outputPageNo_' + this.props.outputPageNo, ref: imageIdentifier + '_' + this.props.outputPageNo, "data-id": imageIdentifier}, React.createElement("div", {className: 'marksheet-holder-inner'}, React.createElement("div", {className: 'scaler-wrapper', style: scalerStyles}), React.createElement("div", {className: 'marksheet-wrapper', style: wrapperStyle}, toRender, React.createElement(AnnotationOverlay, {id: 'annotationOverlay' + this.props.id + pageNo, selectedLanguage: this.props.selectedLanguage, outputPageNo: this.props.outputPageNo, imageClusterId: imageClusterId, currentOutputImageHeight: stichedImagesHeight, currentImageMaxWidth: maxImageWidth, imageZones: imageZones, getImageContainerRect: this.getImageContainerRect, getMarkSheetContainerProperties: this.props.getMarkSheetContainerProperties, key: 'annotationOverlay_' + pageNo, pageNo: 0, structerdPageNo: pageNo, isDrawStart: this.props.isDrawStart, renderedOn: this.props.renderedOn, zoomPreference: this.state.zoomPreference, isResponseEditable: this.props.isResponseEditable, displayAngle: displayAngle, enableImageContainerScroll: this.props.enableImageContainerScroll, currentImageNaturalWidth: selectedNaturalImageWidth, enableCommentsSideView: this.props.enableCommentsSideView, renderedOnTime: Date.now(), zoneTop: 0, zoneLeft: 0, zoneHeight: zoneHeight, topAboveCurrentZone: topAboveCurrentZone, doApplyLinkingScenarios: this.props.doApplyLinkingScenarios, getImageNaturalDimension: this.props.getImageNaturalDimension, refreshCommnetContainer: this.props.refreshCommnetContainer})))));
        }
        var _a, _b;
    };
    /**
     * Set the props if image loaded.
     * @param page
     */
    StitchedImageZone.prototype.imageLoaded = function (pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight) {
        this.props.onImageLoaded(pageNumber, scrollTop, naturalImageWidth, clientImageWidth, naturalImageHeight, this.stichedImagesMaxHeight, this.props.outputPageNo);
    };
    /**
     * Invoked when the annotation is dropped on the script
     */
    StitchedImageZone.prototype.allowDrop = function () {
        return;
    };
    /**
     * Returns true, when view whole page button is suppose to be displayed.
     */
    StitchedImageZone.prototype.isMouseOverEnabled = function (imageZone) {
        return (imageZone && !(imageZone.topEdge === 0
            && (imageZone.leftEdge ? imageZone.leftEdge : 0) === 0
            && (imageZone.width ? imageZone.width : 100) === 100
            && imageZone.height === 100)
            && imageZone.isViewWholePageLinkVisible
            && toolbarStore.instance.selectedStampId === 0
            && toolbarStore.instance.panStampId === 0
            && !stampStore.instance.isDynamicAnnotationActive);
    };
    /**
     * set up the hammer events. not implemented in structured
     */
    StitchedImageZone.prototype.setUpHammer = function () {
        return;
    };
    /**
     * destroy hammer events. not implemented in structured
     */
    StitchedImageZone.prototype.destroyHammer = function () {
        return;
    };
    return StitchedImageZone;
}(ImageViewerBase));
module.exports = StitchedImageZone;
//# sourceMappingURL=stitchedimageviewer.js.map
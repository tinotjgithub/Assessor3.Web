"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var enums = require('../../utility/enums');
var zoomScaleManager = require('./zoomhelper/unstructuredzoomscalemanager');
var userOptionHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var qigStore = require('../../../stores/qigselector/qigstore');
var stringHelper = require('../../../utility/generic/stringhelper');
var zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
var responseStore = require('../../../stores/response/responsestore');
var responsehelper = require('../../utility/responsehelper/responsehelper');
var zoomHelper = require('./zoomhelper/zoomhelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var constants = require('../../utility/constants');
var markingStore = require('../../../stores/marking/markingstore');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var classNames = require('classnames');
var UNSTRUCTRED_PAGE_REF_NAME = 'UnStructuredPaper';
var MARKSHEET_CONTAINER_PADDING = 10;
var ZoomableUnstructuredImage = (function (_super) {
    __extends(ZoomableUnstructuredImage, _super);
    /**
     * Constructor for zoomable unstructured image
     * @param props
     * @param state
     */
    function ZoomableUnstructuredImage(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Zoom factor
        this.userOptionZoomValue = 0;
        // restrict updating the image based on necessary.
        // we dont need to update the image when there are no changes.
        this.updateImage = false;
        // holds value entered by user for custom zoom
        this.userInputZoomValue = 0;
        this.strokeWidth = '1';
        /**
         * Append the classname
         * @param {enums.ZoomType} zoomType
         * @returns
         */
        this.getClassName = function (zoomType) {
            // adding 'zooming' class only for pinch zoom and its gets removed
            // during pinch end
            return classNames('marksheet-zoom-holder', {
                'zooming': zoomType === enums.ZoomType.PinchOut || zoomType === enums.ZoomType.PinchIn
            });
        };
        /**
         * update the stroke-width for marksheet view holder
         */
        this.updateStrokeWidth = function () {
            if (_this.doAddStrokeWidthStyle) {
                var element = document.getElementsByClassName('marksheet-img')[0];
                if (element) {
                    _this.strokeWidth = annotationHelper.getStrokeWidth(element, 0);
                    _this.setState({ renderedOn: Date.now() });
                }
            }
        };
        this.zoomScaleManager = new zoomScaleManager();
        this.selectedZoomType = enums.ZoomType.None;
        this.zoomPreference = enums.ZoomPreference.None;
        // if already the response is set with zoom value,
        // update according to that.
        this.getCurrentUserOption();
        this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        this.responseImageRotationCompleted = this.responseImageRotationCompleted.bind(this);
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render component
     * @returns
     */
    ZoomableUnstructuredImage.prototype.render = function () {
        var child;
        var attributes = {
            zoomType: this.selectedZoomType,
            zoomEvent: this.props.zoomAttributes.zoomEvent
        };
        this.userInputZoomValue = this.props.userZoomValue;
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item, i) {
                // adding ref to locate the unstructred page to calculate the clientWidth.
                // to update the resized/fitwidth/height value
                return React.cloneElement(item, { zoomAttributes: attributes, ref: UNSTRUCTRED_PAGE_REF_NAME + i });
            });
        }
        else {
            child = React.cloneElement(this.props.children, { zoomAttributes: attributes, ref: UNSTRUCTRED_PAGE_REF_NAME + 1 });
        }
        var className = this.getClassName(this.selectedZoomType);
        var result = (React.createElement("div", {className: className, ref: 'zoomHolder'}, React.createElement("div", {className: 'marksheet-view-holder'}, child, React.createElement("style", null, this.marksheetViewHolderStrokeWidth))));
        return result;
    };
    /**
     * Component will receive props
     * @param {any} nxtProps
     */
    ZoomableUnstructuredImage.prototype.componentWillReceiveProps = function (nxtProps) {
        // If user has changed the zoom option to any choice should reflect here.
        this.getCurrentUserOption();
        // Check naturalWidth is updated then set the width based on that.
        if (nxtProps.naturalImageWidth !== this.props.naturalImageWidth) {
            this.zoomScaleManager.setZoomAttributes(nxtProps.naturalImageWidth, nxtProps.clientImageWidth, nxtProps.naturalImageHeight);
            this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        }
        // When new zoom type comes update to perform the zoom
        // nxtProps.zoomAttributes.zoomType check is added, inorder to avoid performing initiatingZoom. when commentSideView
        // gets invisible while performing zoom functionality in devices.
        if (nxtProps.renderedOn !== this.props.renderedOn
            || (nxtProps.sideViewEnabledAndVisible !== this.props.sideViewEnabledAndVisible
                && nxtProps.zoomAttributes.zoomType === enums.ZoomType.None)) {
            this.updateImage = true;
            if (nxtProps.zoomAttributes.zoomType !== enums.ZoomType.None) {
                var currentZoom = this.zoomScaleManager.getCurrentZoom;
                this.selectedZoomType = nxtProps.zoomAttributes.zoomType;
                this.userInputZoomValue = nxtProps.userZoomValue;
                this.zoomScaleManager.setZoomFactor(this.props.pinchZoomFactor);
                this.zoomScaleManager.performZooming(this.selectedZoomType, undefined, this.userInputZoomValue);
                // If the zoom has been changed then we need to set the marging top.
                // Otherwise prevent from doing those operation to prevent animation.
                if (currentZoom !== this.zoomScaleManager.getCurrentZoom) {
                    this.props.initiatingZoom();
                }
                this.updateAndSaveZoomPreference();
            }
            else {
                var containerAttribute = 0;
                var commentContainerWidth = 0;
                if (nxtProps.sideViewEnabledAndVisible) {
                    commentContainerWidth = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
                }
                switch (this.zoomPreference) {
                    case enums.ZoomPreference.FitHeight:
                        containerAttribute = htmlUtilities.getElementsByClassName('marksheet-container')[0].clientHeight;
                        this.zoomScaleManager.updateZoomToFitHeight(containerAttribute);
                        break;
                    case enums.ZoomPreference.FitWidth:
                        containerAttribute = (htmlUtilities.getElementsByClassName('marksheet-container')[0].clientWidth)
                            - MARKSHEET_CONTAINER_PADDING;
                        this.zoomScaleManager.updateZoomToFitWidth(containerAttribute - commentContainerWidth);
                        break;
                }
            }
        }
        if (this.zoomPreference === enums.ZoomPreference.FitHeight || this.zoomPreference === enums.ZoomPreference.FitWidth) {
            if ($('.marksheet-zoom-holder').hasClass('custom-zoom')) {
                $('.marksheet-zoom-holder').removeClass('custom-zoom');
            }
        }
    };
    /**
     * Component did mount
     */
    ZoomableUnstructuredImage.prototype.componentDidMount = function () {
        this.updateImage = true;
        this.updateImageWidth();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, this.responseImageRotationCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.updateStrokeWidth);
        window.addEventListener('resize', this.updateStrokeWidth);
    };
    /**
     * Component did update
     */
    ZoomableUnstructuredImage.prototype.componentDidUpdate = function () {
        this.updateImageWidth();
    };
    /**
     * Component will unmount
     */
    ZoomableUnstructuredImage.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, this.responseImageRotationCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.updateStrokeWidth);
        window.removeEventListener('resize', this.updateStrokeWidth);
    };
    /**
     * Update the image width to calculate the zoom percentage
     */
    ZoomableUnstructuredImage.prototype.updateImageWidth = function () {
        if (this.props.naturalImageWidth > 0 && this.updateImage) {
            // setting to default
            this.updateImage = false;
            // Indicating a flag to update the scroll position on zooming.
            // this will be false for other rendering eg: annotation drag
            var updateScrollValue = false;
            if (this.zoomPreference !== enums.ZoomPreference.Percentage ||
                this.selectedZoomType !== enums.ZoomType.None) {
                updateScrollValue = true;
            }
            // setting the rotated image width. If any of the image is rotated in 90/270 angle
            // then applying the rotated image height percentage. Otherwise same
            // as normal zoom width.
            this.props.setResponseScroll(this.zoomScaleManager.getContainerWidthInPixel, updateScrollValue, this.selectedZoomType, this.zoomScaleManager.getRotatedImageWidth(responseStore.instance.hasRotatedImagesWithOddAngle));
            zoomPanelActionCreator.responseZoomUpdated(this.zoomValue);
        }
        // always setting to default to prevent other render to use the zoom preferences
        this.selectedZoomType = enums.ZoomType.None;
    };
    Object.defineProperty(ZoomableUnstructuredImage.prototype, "zoomValue", {
        /**
         * Get zoom value
         * @returns
         */
        get: function () {
            var value = 0;
            // For fitwidth/height we should get the container attributes rather than the user option value.
            if (this.zoomPreference === enums.ZoomPreference.Percentage) {
                value = this.userOptionZoomValue;
            }
            else {
                value = this.zoomScaleManager.getCurrentZoom;
            }
            return value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To get currently saved use preference(FW/FH)
     */
    ZoomableUnstructuredImage.prototype.getCurrentUserOption = function () {
        var zoomUserOption;
        var userOption;
        var zoomPreference;
        zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        if (zoomUserOption) {
            if (this.props.selectedECourseworkPageID > 0) {
                // Get the saved zoom percentage value
                userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, this.props.selectedECourseworkPageID);
                this.userOptionZoomValue = userOption.userOptionZoomValue;
                this.zoomPreference = userOption.zoomPreference;
            }
            else {
                if (responsehelper.isAtypicalResponse() &&
                    responsehelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
                    var userOption_1 = zoomHelper.getAtypicalZoomOption(zoomUserOption);
                    this.userOptionZoomValue = userOption_1.userOptionZoomValue;
                    this.zoomPreference = userOption_1.zoomPreference;
                    return;
                }
                var optionWithValue = stringHelper.split(zoomUserOption, stringHelper.COMMA_SEPARATOR).map(Number);
                zoomPreference = optionWithValue && optionWithValue.length > 0 ?
                    optionWithValue[0] : enums.ZoomPreference.FitWidth;
                this.userOptionZoomValue = zoomPreference === enums.ZoomPreference.Percentage ? optionWithValue[1] : 0;
            }
            switch (zoomPreference) {
                case enums.ZoomPreference.FitHeight:
                    this.zoomPreference = enums.ZoomPreference.FitHeight;
                    break;
                case enums.ZoomPreference.FitWidth:
                    this.zoomPreference = enums.ZoomPreference.FitWidth;
                    break;
                case enums.ZoomPreference.Percentage:
                case enums.ZoomPreference.FilePercentage:
                    this.zoomPreference = enums.ZoomPreference.Percentage;
                    break;
            }
        }
        else {
            this.zoomPreference = enums.ZoomPreference.FitWidth;
        }
    };
    /**
     * save the zoom preference to user options
     */
    ZoomableUnstructuredImage.prototype.updateAndSaveZoomPreference = function () {
        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
            var zoomPreferenceToSave = enums.ZoomPreference.Percentage.toString() + ',' + this.zoomScaleManager.getCurrentZoom;
            // Atypical structured responses are treated as unstructured. But saving the zoom preferece
            // upon them should treat as structured.
            if (responsehelper.isAtypicalResponse() &&
                responsehelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
                var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
                zoomPreferenceToSave = zoomHelper.updateAtypicalZoomOption(zoomUserOption, enums.ZoomPreference.MarkschemePercentage, this.zoomScaleManager.getCurrentZoom);
            }
            if (this.props.selectedECourseworkPageID > 0) {
                // Ecoursework response. Update the zoom in the below format
                // 4,[{"f":docstorePageId,"z":zoomValue]
                var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
                var userOption = zoomHelper.getZoomUserOption(zoomUserOption);
                // Format the saving user preference value.
                zoomPreferenceToSave = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, this.zoomScaleManager.getCurrentZoom, this.props.currentQuestion, enums.ZoomPreference.Percentage, enums.ZoomPreference.FilePercentage.toString(), this.props.selectedECourseworkPageID);
            }
            userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, zoomPreferenceToSave, true, true, false, true, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }
        this.getCurrentUserOption();
    };
    /**
     * Updating response has rotated flag.
     */
    ZoomableUnstructuredImage.prototype.responseImageRotationCompleted = function () {
        // setting the rotated image width. If any of the image is rotated in 90/270 angle
        // then applying the rotated image height percentage. Otherwise same
        // as normal zoom width.
        this.props.responseOrientationChanged(this.zoomScaleManager.getRotatedImageWidth(responseStore.instance.hasRotatedImagesWithOddAngle));
    };
    Object.defineProperty(ZoomableUnstructuredImage.prototype, "doAddStrokeWidthStyle", {
        /* return true if we need to add stroke width for marksheet view holder */
        get: function () {
            return responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
                responsehelper.isAtypicalResponse();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ZoomableUnstructuredImage.prototype, "marksheetViewHolderStrokeWidth", {
        /**
         * return marksheet view holder stroke width
         */
        get: function () {
            return '.annotation-holder{stroke-width:' + this.strokeWidth + ';}';
        },
        enumerable: true,
        configurable: true
    });
    return ZoomableUnstructuredImage;
}(pureRenderComponent));
module.exports = ZoomableUnstructuredImage;
//# sourceMappingURL=zoomableunstructuredimage.js.map
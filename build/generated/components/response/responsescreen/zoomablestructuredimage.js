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
var zoomScaleManager = require('./zoomhelper/structuredzoomscalemanager');
var userOptionHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
var responseStore = require('../../../stores/response/responsestore');
var markingStore = require('../../../stores/marking/markingstore');
var zoomHelper = require('./zoomhelper/zoomhelper');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var constants = require('../../utility/constants');
var responsehelper = require('../../utility/responsehelper/responsehelper');
var stringHelper = require('../../../utility/generic/stringhelper');
var classNames = require('classnames');
var STRUCTRED_PAGE_REF_NAME = 'StructuredPaper';
var MARKSHEET_CONTAINER_PADDING = 10;
var ZoomableStructuredImage = (function (_super) {
    __extends(ZoomableStructuredImage, _super);
    /**
     * Constructor for zoomable structured image
     * @param props
     * @param state
     */
    function ZoomableStructuredImage(props, state) {
        var _this = this;
        _super.call(this, props, state);
        // Zoom factor
        this.userOptionZoomValue = 0;
        // holds Image Zone Height
        this.imageZoneHeight = 0;
        // holds Image Zone Width
        this.imageZoneWidth = 0;
        // Holds a value indicating response list containes rotated images.
        this.hasRotatedImages = false;
        //Holds the rotated images
        this.rotatedImages = [];
        //Holds the marksheet view holder padding
        this.marksheetViewHolderPadding = 0;
        //Holds is zoom is modified or not
        this.isZoomModified = false;
        // Holds the marksheet-view-holder width after zoom.
        this.markSheetHolderWidth = 0;
        // restrict updating the image based on necessary.
        // we dont need to update the image when there are no changes.
        this.updateImage = false;
        // holds value entered by user for custom zoom
        this.userInputZoomValue = 0;
        /**
         * update on current question item changed
         */
        this.onCurrentQuestionItemChanged = function () {
            _this.isZoomModified = false;
        };
        /**
         * update on zoom option changed
         */
        this.onZoomOptionChanged = function () {
            _this.isZoomModified = true;
        };
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
            }, {
                'custom-zoom': (zoomType === enums.ZoomType.CustomZoomIn || zoomType === enums.ZoomType.CustomZoomOut ||
                    zoomType === enums.ZoomType.UserInput ||
                    (_this.zoomPreference !== enums.ZoomPreference.FitHeight && _this.zoomPreference !== enums.ZoomPreference.FitWidth))
            });
        };
        this.zoomScaleManager = new zoomScaleManager();
        this.selectedZoomType = enums.ZoomType.None;
        this.zoomPreference = enums.ZoomPreference.None;
        // if already the response is set with zoom value,
        // update according to that.
        this.getCurrentUserOption();
        this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        this.responseImageRotationCompleted = this.responseImageRotationCompleted.bind(this);
        this.onPinchZoomCompleted = this.onPinchZoomCompleted.bind(this);
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render component
     * @returns
     */
    ZoomableStructuredImage.prototype.render = function () {
        var child;
        var style;
        var attributes = {
            zoomType: this.selectedZoomType,
            zoomEvent: this.props.zoomAttributes.zoomEvent
        };
        this.userInputZoomValue = this.props.userZoomValue;
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item, i) {
                // adding ref to locate the structred page to calculate the clientWidth.
                // to update the resized/fitwidth/height value
                return React.cloneElement(item, { zoomAttributes: attributes, ref: STRUCTRED_PAGE_REF_NAME + i });
            });
        }
        else {
            child = React.cloneElement(this.props.children, { zoomAttributes: attributes, ref: STRUCTRED_PAGE_REF_NAME + 1 });
        }
        var className = this.getClassName(this.selectedZoomType);
        if (this.zoomPreference === enums.ZoomPreference.Percentage && this.markSheetHolderWidth > 0) {
            if (this.hasRotatedImages) {
                this.calculateRotatedPagePadding();
            }
            if (this.marksheetViewHolderPadding > 0 && this.hasRotatedImages) {
                style = {
                    'width': (this.markSheetHolderWidth + (this.marksheetViewHolderPadding * 2)) + 'px',
                    'padding': 0 + ' ' + this.marksheetViewHolderPadding + 'px'
                };
            }
            else {
                style = {
                    'width': this.markSheetHolderWidth + 'px',
                    'padding': '0px 0px'
                };
            }
        }
        else {
            style = undefined;
        }
        var result = (React.createElement("div", {className: className, ref: 'zoomHolder'}, React.createElement("div", {className: 'marksheet-view-holder', style: style}, child)));
        return result;
    };
    /**
     * Component will receive props
     * @param {any} nxtProps
     */
    ZoomableStructuredImage.prototype.componentWillReceiveProps = function (nxtProps) {
        // If user has changed the zoom option to any choice should reflect here.
        this.getCurrentUserOption();
        // Check naturalWidth is updated then set the width based on that.
        if (nxtProps.naturalImageWidth !== this.props.naturalImageWidth) {
            this.zoomScaleManager.setZoomAttributes(nxtProps.naturalImageWidth, nxtProps.clientImageWidth, nxtProps.naturalImageHeight);
            this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        }
        // When new zoom type comes update to perform the zoom
        if (nxtProps.renderedOn !== this.props.renderedOn ||
            nxtProps.sideViewEnabledAndVisible !== this.props.sideViewEnabledAndVisible) {
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
                //Calculate Image Zone Height/width
                this.calculateMostvisiblePageWidthHeight();
                var containerAttribute = 0;
                var commentContainerWidth = 0;
                if (nxtProps.sideViewEnabledAndVisible) {
                    commentContainerWidth = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
                }
                switch (this.zoomPreference) {
                    case enums.ZoomPreference.FitHeight:
                        containerAttribute = htmlUtilities.getElementsByClassName('marksheet-container')[0].clientHeight;
                        this.zoomScaleManager.updateZoomToFitHeight(containerAttribute, this.imageZoneHeight);
                        break;
                    case enums.ZoomPreference.FitWidth:
                        containerAttribute = (htmlUtilities.getElementsByClassName('marksheet-container')[0].clientWidth)
                            - MARKSHEET_CONTAINER_PADDING;
                        this.zoomScaleManager.updateZoomToFitWidth((containerAttribute - commentContainerWidth), this.imageZoneWidth);
                        break;
                }
            }
        }
    };
    /**
     * Sets the marksheet view holder padding for rotated images
     */
    ZoomableStructuredImage.prototype.calculateRotatedPagePadding = function () {
        this.marksheetViewHolderPadding = zoomHelper.getRotatedPagePadding(this.markSheetHolderWidth, this.props.structuredImageZone, this.rotatedImages, this.zoomScaleManager.getCurrentZoom, responseStore.instance.displayAnglesOfCurrentResponse);
    };
    /**
     * Sets the Image zone Height and Width of the most visible page
     */
    ZoomableStructuredImage.prototype.calculateMostvisiblePageWidthHeight = function () {
        //getting fracs data to get the most visible page
        var fracs = responseStore.instance.getCurrentVisibleFracsData;
        var zoneWidth = 0;
        var zoneHeight = 0;
        var element;
        var _loop_1 = function(i) {
            var rotatedImage = this_1.rotatedImages.filter((function (x) { return x === element.pageNo; }));
            var displayAngle = 0;
            var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map(function (angle, key) {
                    if (key === element.pageNo) {
                        displayAngle = angle;
                    }
                });
            }
            displayAngle = zoomHelper.getAngleforRotation(displayAngle);
            if (fracs && element.pageNo === fracs.elementId + '_' + ((fracs.outputPage) ? fracs.outputPage : 0)) {
                if (element.pageNo === rotatedImage[0] && (displayAngle === 90 || displayAngle === 270)) {
                    zoneWidth = element.zoneHeight;
                    zoneHeight = element.zoneWidth;
                }
                else {
                    zoneWidth = element.zoneWidth;
                    zoneHeight = element.zoneHeight;
                }
            }
        };
        var this_1 = this;
        for (var i = 0; element = this.props.structuredImageZone[i]; i++) {
            _loop_1(i);
        }
        this.imageZoneHeight = zoneHeight;
        this.imageZoneWidth = zoneWidth;
    };
    /**
     * Component did mount
     */
    ZoomableStructuredImage.prototype.componentDidMount = function () {
        this.updateImage = true;
        this.updateImageWidth();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, this.responseImageRotationCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onCurrentQuestionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, this.onPinchZoomCompleted);
    };
    /**
     * Component did update
     */
    ZoomableStructuredImage.prototype.componentDidUpdate = function () {
        this.updateImageWidth();
    };
    /**
     * Component will unmount
     */
    ZoomableStructuredImage.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, this.responseImageRotationCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onCurrentQuestionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, this.onPinchZoomCompleted);
    };
    /**
     * Update the image width to calculate the zoom percentage
     */
    ZoomableStructuredImage.prototype.updateImageWidth = function () {
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
            // Comparing and update when user pinced the zoom and clicked manual zoom has already changed the zoom
            // width
            if (this.markSheetHolderWidth !== this.zoomScaleManager.getContainerWidthInPixel) {
                this.markSheetHolderWidth = this.zoomScaleManager.getContainerWidthInPixel;
                this.setState({ renderedOn: Date.now() });
            }
            this.props.setResponseScroll(this.markSheetHolderWidth, updateScrollValue, this.selectedZoomType, this.zoomScaleManager.getRotatedImageWidth(this.hasRotatedImages, this.imageZoneHeight));
            zoomPanelActionCreator.responseZoomUpdated(this.zoomValue);
        }
        // always setting to default to prevent other render to use the zoom preferences
        this.selectedZoomType = enums.ZoomType.None;
    };
    Object.defineProperty(ZoomableStructuredImage.prototype, "zoomValue", {
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
    ZoomableStructuredImage.prototype.getCurrentUserOption = function () {
        var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
        var imageCluster = zoomHelper.setImageClusterId(this.isZoomModified);
        // Get the saved zoom percentage value
        var userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, imageCluster);
        // Ebookmarking useroption should be saved like unstructured.
        if (zoomUserOption && responsehelper.isEbookMarking) {
            this.getCurrentUserOptionForEbookmarking(zoomUserOption);
        }
        else {
            this.userOptionZoomValue = userOption.userOptionZoomValue;
            this.zoomPreference = userOption.zoomPreference;
        }
    };
    /**
     * To get currently saved user option for EBM. Since it is saving as usntructured.
     */
    ZoomableStructuredImage.prototype.getCurrentUserOptionForEbookmarking = function (zoomUserOption) {
        if (zoomUserOption) {
            var zoomPreference = void 0;
            var optionWithValue = stringHelper.split(zoomUserOption, stringHelper.COMMA_SEPARATOR).map(Number);
            zoomPreference = optionWithValue && optionWithValue.length > 0 ?
                optionWithValue[0] : enums.ZoomPreference.FitWidth;
            this.userOptionZoomValue = (zoomPreference === enums.ZoomPreference.Percentage ? optionWithValue[1] : 0);
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
    };
    /**
     * save the zoom preference to user options
     */
    ZoomableStructuredImage.prototype.updateAndSaveZoomPreference = function () {
        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {
            var zoomUserOption = userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
            var userOption = zoomHelper.getZoomUserOption(zoomUserOption);
            var preference = '';
            // Ebookmarking useroption should be saved like unstructured.
            if (responsehelper.isEbookMarking) {
                preference = enums.ZoomPreference.Percentage.toString() + ',' + this.zoomScaleManager.getCurrentZoom;
            }
            else {
                // Format the saving user preference value.
                preference = zoomHelper.updateZoomPreference(userOption.userOptionZoomValue, this.zoomScaleManager.getCurrentZoom, this.props.currentQuestion, enums.ZoomPreference.Percentage, userOption.zoomHeader);
            }
            userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE, preference, false, true, false, true, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
        }
        this.getCurrentUserOption();
    };
    /**
     * Updating response has rotated flag.
     * @param hasRotatedImages
     */
    ZoomableStructuredImage.prototype.responseImageRotationCompleted = function (hasRotatedImages, rotatedImages) {
        this.hasRotatedImages = hasRotatedImages;
        this.rotatedImages = rotatedImages;
        this.props.responseOrientationChanged(this.zoomScaleManager.getRotatedImageWidth(hasRotatedImages));
    };
    /**
     * Triggers when user has completed pinch zoom. The pinched value will be updated here to reflect next
     * marnual operation. Like rotate the image after pinch zoom.
     * @param {number} zoomedWidth
     */
    ZoomableStructuredImage.prototype.onPinchZoomCompleted = function (zoomedWidth) {
        this.markSheetHolderWidth = zoomedWidth;
        // If user has changed the zoom option to any choice should reflect here.
        this.getCurrentUserOption();
        // Updating the current zoom value here because if the user has pinched to
        // specific zoom level and after that, they have selected manual zoom should
        // start from the last pinched zoom level. Checking for 0 because if they have manually
        // zoomed from FitWidth/Height zoom level saved will be 0 and we dont need to udpate that.
        if (this.userOptionZoomValue > 0) {
            this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        }
    };
    return ZoomableStructuredImage;
}(pureRenderComponent));
module.exports = ZoomableStructuredImage;
//# sourceMappingURL=zoomablestructuredimage.js.map
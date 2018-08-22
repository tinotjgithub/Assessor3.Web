"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactDom = require('react-dom');
var $ = require('jquery');
var fracs = require('../../../utility/fracs/fracs');
var responseStore = require('../../../stores/response/responsestore');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var markingStore = require('../../../stores/marking/markingstore');
var enums = require('../../utility/enums');
var constants = require('../../utility/constants');
var stampStore = require('../../../stores/stamp/stampstore');
var responseHelper = require('../../utility/responsehelper/responsehelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var eventmanagerbase = require('../../base/eventmanager/eventmanagerbase');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var fracsHelper = require('../../../utility/generic/fracshelper');
//Holds the Top and Bottom padding value.
var PADDING = 10;
//Holds the scroll bar height 17 of desktop browsers
var SCROLL_BAR_HEIGHT_DESKTOP = 17;
//Holds the scroll bar height 4 of device browsers
var SCROLL_BAR_HEIGHT_DEVICE = 4;
/**
 * React component class for Image Viewer Base.
 */
var ImageViewerBase = (function (_super) {
    __extends(ImageViewerBase, _super);
    /**
     * Constructor for image viewer base
     * @param props
     * @param state
     */
    function ImageViewerBase(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.marksheetHolderMinHeight = 0;
        this.marksheetContainerHeight = 0;
        this.marksheetContainerWidth = 0;
        this.addNewBookmarkSelected = false;
        this.marksheetHeight = 0;
        this.marksheetWidth = 0;
        this.isComponentMounted = false;
        /**
         * callback function for zoom settings which decides which option is clicked
         * @param responseViewSettingss
         */
        this.changeOrientation = function (responseViewSettings) {
            var rotateAngle = 90;
            // Updating scroll except for custom zoom
            var isZoomed = false;
            var displayAngle = 0;
            // active response ID
            var activeResponseRefId = responseStore.instance.currentlyVisibleImageContainerRefId;
            var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            // retrives collection of response angles
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map(function (angle, key) {
                    if (key === activeResponseRefId) {
                        displayAngle = angle;
                    }
                });
            }
            switch (responseViewSettings) {
                case (enums.ResponseViewSettings.FitToWidth):
                    _this.setState({ zoomPreference: enums.ZoomPreference.FitWidth });
                    break;
                case (enums.ResponseViewSettings.FitToHeight):
                    _this.setState({ zoomPreference: enums.ZoomPreference.FitHeight });
                    break;
                case (enums.ResponseViewSettings.RotateClockwise):
                    if (_this.refs[activeResponseRefId] !== undefined) {
                        var newAngle = displayAngle + rotateAngle;
                        _this.setState({ rotateAngle: newAngle === 0 ? null : newAngle });
                        responseActionCreator.updateDisplayAngleOfResponse(false, newAngle, activeResponseRefId);
                        _this.onRotatation();
                    }
                    break;
                case (enums.ResponseViewSettings.RotateAntiClockwise):
                    if (_this.refs[activeResponseRefId] !== undefined) {
                        var newAngle = displayAngle - rotateAngle;
                        _this.setState({ rotateAngle: (newAngle === 0 ? null : newAngle) });
                        responseActionCreator.updateDisplayAngleOfResponse(false, newAngle, activeResponseRefId);
                        _this.onRotatation();
                    }
                    break;
                case (enums.ResponseViewSettings.CustomZoom):
                    _this.setState({ zoomPreference: enums.ZoomPreference.Percentage });
                    isZoomed = true;
                    break;
            }
            //finds the active page and set the scroll
            if (_this.refs[activeResponseRefId] !== undefined && !isZoomed) {
                var that = _this;
                setTimeout(function () {
                    that.setScrollForZoom(responseViewSettings);
                }, 400);
            }
        };
        /**
         * This will loop and find the fracs data of each single and stitched image containers.
         */
        this.responseViewModeChanged = function () {
            _this.props.setScrollPositionCallback();
            _this.setFracsDataForResponse();
            _this.props.switchViewCallback();
        };
        /**
         * This will set fracs data after Response Image Loaded
         * triggerScrollEvent True for Emitting event FRACS_DATA_LOADED
         */
        this.setFracsForImageLoaded = function () {
            _this.setFracsDataForResponse(true);
        };
        /**
         * This will set fracs data after Structured Images Loaded
         * structuredFracsDataLoaded True for Emitting event STRUCTURED_FRACS_DATA_LOADED
         */
        this.structuredFracsDataSet = function (_fracsDataSource) {
            _this.setFracsDataForResponse(false, true, _fracsDataSource);
        };
        /**
         * This will set FracsData
         * @param triggerScrollEvent
         */
        this.setFracsDataForResponse = function (triggerScrollEvent, structuredFracsDataLoaded, fracsDataSource) {
            if (triggerScrollEvent === void 0) { triggerScrollEvent = false; }
            if (structuredFracsDataLoaded === void 0) { structuredFracsDataLoaded = false; }
            var isUnStructured = responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
                || responseHelper.isAtypicalResponse();
            if (_this.refs != null) {
                for (var ref in _this.refs) {
                    // Only add to fracs data if the ref is a img.
                    if (ref != null && ref.indexOf('img') === 0) {
                        var ele = ReactDom.findDOMNode(_this.refs[ref]);
                        // get the fracs of current container using fracs
                        // This will call method fracs(action, callback, viewport) with viewport imagecontainer
                        // parameters => action = '', callback = undefined , viewport=imagecontainer DOM element.
                        var fractions = fracsHelper.getFracsWithRespectToContainer('', $('#' + ele.getAttribute('id')), htmlUtilities.getElementById('imagecontainer'));
                        var data = {
                            elementId: isUnStructured && !responseHelper.isEbookMarking ?
                                ele.getAttribute('id') : ele.getAttribute('data-id'),
                            possible: fractions.possible,
                            viewport: fractions.viewport,
                            visible: fractions.visible,
                            offsettop: ele.offsetTop,
                            outputPage: _this.props.outputPageNo
                        };
                        // set fracs data in response store.
                        responseActionCreator.setFracsData(data, triggerScrollEvent, structuredFracsDataLoaded, fracsDataSource);
                    }
                }
            }
        };
        /**
         * This method will get fired when the mouse enters the annotation area
         */
        this.onMouseEnter = function (event) {
            _this.props.onMouseEnter(event);
        };
        /**
         * This method will get fired when the mouse leaves the annotation area
         */
        this.onMouseLeave = function (event) {
            _this.props.onMouseLeave(event);
        };
        /**
         * This method will get fired when the mouse moves over the annotation area
         */
        this.onMouseMove = function (event, annotationAreaWidth, annotationAreaHeight, annotationAreaLeftPos, annotationAreaTopPos) {
            _this.props.onMouseMove(event, annotationAreaWidth, annotationAreaHeight, annotationAreaLeftPos, annotationAreaTopPos);
        };
        /**
         * This will set Fracs data while clicking zoom options
         */
        this.setFracsForZoom = function (responseViewSettings) {
            _this.setFracsDataForResponse();
            _this.props.setZoomOptions(responseViewSettings, _this.markingMethod);
        };
        /**
         * This will start the rotate action
         */
        this.onRotatation = function () {
            if (_this.props.onRotation) {
                _this.props.onRotation(_this.state.rotateAngle);
            }
        };
        /**
         * Called when an annotation is added
         * @param stampId stamptypeid
         * @param addAnnotationAction annotationAction
         * @param annotationOverlayId overlayId
         * @param annotation annotationDetails
         */
        this.onAnnotationAdded = function (stampId, addAnnotationAction, annotationOverlayId, annotation) {
            // resets the rotation, on adding linked annotation from Marking screen.
            if (stampId === constants.LINK_ANNOTATION &&
                responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView) {
                _this.setState({ rotateAngle: null });
                responseActionCreator.updateDisplayAngleOfResponse(true);
                _this.onRotatation();
                _this.setFracsDataForResponse(false, true);
            }
        };
        /**
         * Get the Marksheet Element
         */
        this.getMarkSheetElement = function () {
            var element = ReactDom.findDOMNode(_this);
            return element;
        };
        this.isZoomUpdatedOfZoomPreference = false;
        this.onZoomUpdated = this.onZoomUpdated.bind(this);
        this.onResponsePinchToZoomStarted = this.onResponsePinchToZoomStarted.bind(this);
        this.onRefreshImageRotateSettings = this.onRefreshImageRotateSettings.bind(this);
        this.onCommentHolderRender = this.onCommentHolderRender.bind(this);
        this.onCommentSideViewToggle = this.onCommentSideViewToggle.bind(this);
        this.structuredFracsDataSet = this.structuredFracsDataSet.bind(this);
        this.reRenderMarksheet = this.reRenderMarksheet.bind(this);
        this.changeOrientation = this.changeOrientation.bind(this);
        this.responseViewModeChanged = this.responseViewModeChanged.bind(this);
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    ImageViewerBase.prototype.componentDidMount = function () {
        this.isComponentMounted = true;
        // set unlimited listners for response store because we are using seperate event listners in each image item for
        // finding fracs.
        responseStore.instance.setMaxListeners(0);
        markingStore.instance.setMaxListeners(0);
        stampStore.instance.setMaxListeners(0);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.SETFRACS_ZOOM, this.setFracsForZoom);
        markingStore.instance.addListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.changeOrientation);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);
        responseStore.instance.
            addListener(responseStore.ResponseStore.REFRESH_IMAGE_ROTATE_SETTINGS_EVENT, this.onRefreshImageRotateSettings);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        responseStore.instance.addListener(responseStore.ResponseStore.SET_FRACS_DATA_IMAGE_LOADED_EVENT, this.setFracsForImageLoaded);
        responseStore.instance.addListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_SET_EVENT, this.structuredFracsDataSet);
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_HOLDER_RENDERED_EVENT, this.onCommentHolderRender);
        stampStore.instance.addListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.onCommentSideViewToggle);
        markingStore.instance.addListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderMarksheet);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderMarksheet);
        this.addNewBookmarkSelected = false;
        // set up hammer for unstructured and ecoursework only as this is needed for Boomarks only
        if (this.markingMethod === enums.MarkingMethod.Unstructured) {
            this.setUpHammer();
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    ImageViewerBase.prototype.componentWillUnmount = function () {
        this.isComponentMounted = false;
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, this.responseViewModeChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.SETFRACS_ZOOM, this.setFracsForZoom);
        markingStore.instance.removeListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.changeOrientation);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this.onZoomUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED, this.onResponsePinchToZoomStarted);
        responseStore.instance.
            removeListener(responseStore.ResponseStore.REFRESH_IMAGE_ROTATE_SETTINGS_EVENT, this.onRefreshImageRotateSettings);
        responseStore.instance.removeListener(responseStore.ResponseStore.SET_FRACS_DATA_IMAGE_LOADED_EVENT, this.setFracsForImageLoaded);
        responseStore.instance.removeListener(responseStore.ResponseStore.STRUCTURED_FRACS_DATA_SET_EVENT, this.structuredFracsDataSet);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_HOLDER_RENDERED_EVENT, this.onCommentHolderRender);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, this.onCommentSideViewToggle);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_ADDED, this.onAnnotationAdded);
        markingStore.instance.removeListener(markingStore.MarkingStore.BOOKMARK_ADDED_EVENT, this.reRenderMarksheet);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, this.reRenderMarksheet);
        // destroy hammer for unstructured and ecoursework
        if (this.markingMethod === enums.MarkingMethod.Unstructured) {
            this.destroyHammer();
        }
    };
    /**
     * Sets scroll position after fit W/h or rotation
     * @param responseViewSettings
     */
    ImageViewerBase.prototype.setScrollForZoom = function (responseViewSettings) {
        var marksheetContainerProps = this.props.getMarkSheetContainerProperties();
        var marksheetContainer = marksheetContainerProps.element;
        var currentResponse = this.refs[responseStore.instance.currentlyVisibleImageContainerRefId] ?
            this.refs[responseStore.instance.currentlyVisibleImageContainerRefId].
                getElementsByClassName('marksheet-holder-inner')[0].getBoundingClientRect() : undefined;
        var scroll;
        var imgRendered;
        if (!marksheetContainer || !currentResponse) {
            return;
        }
        if (marksheetContainer.children[0].children[0].children[0]) {
            imgRendered = marksheetContainer.children[0].children[0].children[0].childElementCount;
        }
        //Set vertical scroll to the beginning of active image on fit width/height
        if ((responseViewSettings === enums.ResponseViewSettings.FitToWidth) ||
            (responseViewSettings === enums.ResponseViewSettings.FitToHeight) ||
            (this.state.rotateAngle % 180 !== 0 && imgRendered !== 1)) {
            scroll = marksheetContainer.scrollTop +
                (currentResponse.top - marksheetContainer.getBoundingClientRect().top)
                - constants.RESPONSE_CONTAINER_PADDING;
            marksheetContainer.scrollTop = scroll;
        }
        else if ((this.state.rotateAngle % 180 === 0 && !this.state.zoomPreference) && imgRendered !== 1) {
            //set vertical scroll to the center of active image on rotation of multipage response
            scroll = (marksheetContainer.scrollTop + (currentResponse.height / 2)) -
                (marksheetContainer.getBoundingClientRect().height / 2) - constants.RESPONSE_CONTAINER_PADDING;
            marksheetContainer.scrollTop = scroll;
        }
        else if (imgRendered === 1) {
            //set vertical scroll to the center of active image on rotation of multipage response
            scroll = (marksheetContainer.scrollHeight / 2) - (marksheetContainer.getBoundingClientRect().height / 2) -
                constants.RESPONSE_CONTAINER_PADDING;
            marksheetContainer.scrollTop = scroll;
        }
        this.props.onScrollForZoom();
        //set horizontal scroll to center on rotate
        if ((responseViewSettings === enums.ResponseViewSettings.RotateAntiClockwise
            || responseViewSettings === enums.ResponseViewSettings.RotateClockwise) &&
            this.state.zoomPreference) {
            marksheetContainer.scrollLeft =
                (marksheetContainer.scrollWidth / 2) - (marksheetContainer.getBoundingClientRect()
                    .width / 2);
        }
    };
    /**
     * This will  return original rotated angle of a partucular responseID
     */
    ImageViewerBase.prototype.getOriginalDisplayAngle = function (responseId, fromResponsStore) {
        if (fromResponsStore === void 0) { fromResponsStore = false; }
        var displayAngle = 0;
        if (!fromResponsStore && (this.state.rotateAngle === null || this.state.rotateAngle !== 0)) {
            displayAngle = this.state.rotateAngle === null ? 0 : this.state.rotateAngle;
        }
        else {
            var displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map(function (angle, key) {
                    if (key === responseId) {
                        displayAngle = angle;
                    }
                });
            }
        }
        return displayAngle;
    };
    /**
     * Get class name based on rotation
     */
    ImageViewerBase.prototype.getClassNames = function () {
        var rotateAngle = this.state.rotateAngle;
        var className = 'marksheet-holder ';
        switch (annotationHelper.getAngleforRotation(rotateAngle)) {
            case enums.RotateAngle.Rotate_90:
                className += 'rotate-90';
                break;
            case enums.RotateAngle.Rotate_180:
                className += 'rotate-180';
                break;
            case enums.RotateAngle.Rotate_270:
                className += 'rotate-270';
                break;
        }
        return className;
    };
    /**
     * calculate response styles when zoom options are applied
     * @param zoomPreference
     * @param rotateAngle
     * @param aspectRatio
     * @param rotatedAspectRatio
     */
    ImageViewerBase.prototype.calculateImageStyleOnZoom = function (zoomPreference, rotateAngle, aspectRatio, rotatedAspectRatio, seperatorInPercentage, imageZoneWidthInPercentage, markSheetViewHolderWidthInPx, biggestRatio, enableCommentSideView, imageId, marksheetHeight, marksheetWidth) {
        if (seperatorInPercentage === void 0) { seperatorInPercentage = 0; }
        if (imageZoneWidthInPercentage === void 0) { imageZoneWidthInPercentage = 0; }
        if (markSheetViewHolderWidthInPx === void 0) { markSheetViewHolderWidthInPx = 0; }
        if (biggestRatio === void 0) { biggestRatio = 0; }
        if (enableCommentSideView === void 0) { enableCommentSideView = false; }
        if (imageId === void 0) { imageId = ''; }
        var marksheetStyle;
        var wrapperStyle;
        var scalerStyles;
        var transformCss = 'translate3d(-50% , -50%, 0) rotate(' + rotateAngle + 'deg)';
        if ((htmlUtilities.isChrome || htmlUtilities.isSafari) && this.refs[imageId]) {
            var width = '0px';
            var height = '0px';
            if (rotateAngle === 90 || rotateAngle === 270) {
                width = ((marksheetHeight / 2) - Math.floor(marksheetHeight / 2)).toString() + 'px';
                height = ((marksheetWidth / 2) - Math.floor(marksheetWidth / 2)).toString() + 'px';
            }
            else {
                width = ((marksheetWidth / 2) - Math.floor(marksheetWidth / 2)).toString() + 'px';
                height = ((marksheetHeight / 2) - Math.floor(marksheetHeight / 2)).toString() + 'px';
            }
            transformCss = 'translate3d(calc(-50% + ' + width + '), calc(-50% + ' + height + '), 0) rotate(' + rotateAngle + 'deg)';
        }
        //to adjust the heigth tolerace in devices
        var heightTolerace = 0;
        var commentContainerWidth = 0;
        if (enableCommentSideView) {
            commentContainerWidth = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        }
        else {
            this.marksheetHolderMinHeight = 0;
        }
        var audioPlayer = document.getElementById('audioPlayerContainer');
        var audioPlayerHeight = 0;
        if (audioPlayer) {
            audioPlayerHeight = audioPlayer.clientHeight;
        }
        // checks whether the response will have a horizontal scroll bar.
        if (biggestRatio !== 0) {
            if ((biggestRatio * (this.marksheetContainerHeight - PADDING)) > (this.marksheetContainerWidth - commentContainerWidth)) {
                if (!htmlUtilities.isTabletOrMobileDevice) {
                    heightTolerace = SCROLL_BAR_HEIGHT_DESKTOP;
                }
                else if (htmlUtilities.isAndroidDevice) {
                    heightTolerace = SCROLL_BAR_HEIGHT_DEVICE;
                }
            }
        }
        scalerStyles = {
            paddingTop: (rotateAngle % 180 === 0) ? (100 * rotatedAspectRatio) + '%' :
                (100 * aspectRatio) + '%'
        };
        marksheetStyle = {
            minHeight: this.marksheetHolderMinHeight + 'px'
        };
        switch (zoomPreference) {
            case (enums.ZoomPreference.FitHeight):
                // viewport height is not correct in devices, so setting the width in pixel.
                if (htmlUtilities.isTabletOrMobileDevice) {
                    marksheetStyle = {
                        width: (rotateAngle % 180 === 0) ? ((this.marksheetContainerHeight - (PADDING + heightTolerace + audioPlayerHeight)) * aspectRatio)
                            + 'px' : ((this.marksheetContainerHeight -
                            (PADDING + heightTolerace + audioPlayerHeight)) * rotatedAspectRatio) + 'px',
                        minHeight: this.marksheetHolderMinHeight + 'px',
                        marginLeft: ''
                    };
                }
                else {
                    //NOTE: maxwidth is not correct when offpage comment/Enhanced offpage comment is visible.
                    // These senarios are handled by setting accurate width
                    marksheetStyle = {
                        maxWidth: (rotateAngle % 180 === 0) ?
                            'calc(' + '(' + 100 + 'vh' + ' ' + '-' + ' ' +
                                (constants.HEIGHT_TOLERANCE + heightTolerace + audioPlayerHeight) + 'px)' +
                                ' * ' + aspectRatio + ')' : 'calc(' + '(' + 100 + 'vh' + ' ' + '-' + ' ' +
                            (constants.HEIGHT_TOLERANCE + heightTolerace + audioPlayerHeight) + 'px)' +
                            ' * ' + rotatedAspectRatio + ')',
                        width: (rotateAngle % 180 === 0) ?
                            (this.getViewportHeight() * aspectRatio) + 'vh' : (this.getViewportHeight() * rotatedAspectRatio) + 'vh',
                        minHeight: this.marksheetHolderMinHeight + 'px'
                    };
                }
                wrapperStyle = {
                    width: (rotateAngle % 180 === 0) ? 100 + '%' : aspectRatio * 100 + '%',
                    /*maxWidth: (rotateAngle % 180 === 0) ? 'calc(100% - 10px)' : 'calc(' + (aspectRatio * 100) + '%'+ ' - ' + 10 + 'px)',*/
                    transform: transformCss
                };
                break;
            case (enums.ZoomPreference.FitWidth):
                marksheetStyle = {
                    width: '100%',
                    minHeight: this.marksheetHolderMinHeight + 'px'
                };
                wrapperStyle = {
                    width: (rotateAngle % 180 === 0) ? 100 + '%' : aspectRatio * 100 + '%',
                    transform: transformCss
                };
                break;
            case (enums.ZoomPreference.Percentage):
                if ((responseStore.instance.markingMethod === enums.MarkingMethod.Structured || this.props.isEBookMarking === true)
                    && !responseHelper.isAtypicalResponse()) {
                    var imageZoneWidthInPx = (markSheetViewHolderWidthInPx / 100) * imageZoneWidthInPercentage;
                    var viewHolderPadding = (markSheetViewHolderWidthInPx - (imageZoneWidthInPx * rotatedAspectRatio)) / 2;
                    var _marginLeft = (viewHolderPadding / markSheetViewHolderWidthInPx) * 100;
                    //setting marksheet-holder width individually
                    if (rotateAngle % 180 === 0) {
                        marksheetStyle = {
                            width: imageZoneWidthInPercentage + '%',
                            minHeight: this.marksheetHolderMinHeight + 'px'
                        };
                    }
                    else {
                        //Applying margin left for each marksheet holder, to keep centre align after rotation
                        if ((_marginLeft < 0)) {
                            marksheetStyle = {
                                width: (rotatedAspectRatio * imageZoneWidthInPercentage) + '%',
                                marginLeft: _marginLeft + '%',
                                minHeight: this.marksheetHolderMinHeight + 'px'
                            };
                        }
                        else {
                            marksheetStyle = {
                                width: (rotatedAspectRatio * imageZoneWidthInPercentage) + '%',
                                minHeight: this.marksheetHolderMinHeight + 'px'
                            };
                        }
                    }
                }
                else {
                    if (this.isZoomUpdatedOfZoomPreference === false) {
                        marksheetStyle = {
                            width: '100%',
                            minHeight: this.marksheetHolderMinHeight + 'px'
                        };
                    }
                    else if (markingStore.instance.zoomWidth > 0) {
                        // Update the zoom width when pinch has been started
                        marksheetStyle = {
                            width: markingStore.instance.zoomWidth + 'px',
                            minHeight: this.marksheetHolderMinHeight + 'px'
                        };
                    }
                }
                wrapperStyle = {
                    width: (rotateAngle % 180 === 0) ? 100 + '%' : aspectRatio * 100 + '%',
                    transform: transformCss
                };
                break;
            default:
                break;
        }
        return [marksheetStyle, wrapperStyle, scalerStyles];
    };
    /**
     * Get image properties
     * @param {string} image
     * @param {Function} callback
     */
    ImageViewerBase.prototype.getImageProperties = function (image, callback) {
        if (image !== '') {
            var img = $('<img />');
            img.attr('src', image);
            img.unbind('load');
            img.bind('load', function () {
                callback(this);
            });
        }
    };
    /**
     * Calculate Translate X
     * @param naturalWidth
     * @param leftEdge
     */
    ImageViewerBase.prototype.calculateTranslateX = function (naturalWidth, leftEdge) {
        return ((naturalWidth * (leftEdge / 100)) / naturalWidth) * 100;
    };
    /**
     * Calculate Translate Y
     * @param naturalWidth
     * @param topEdge
     */
    ImageViewerBase.prototype.calculateTranslateY = function (naturalHeight, topEdge) {
        return (((naturalHeight) * (topEdge / 100)) / naturalHeight) * 100;
    };
    /**
     * Calculate width
     * @param naturalWidth
     * @param width
     */
    ImageViewerBase.prototype.calculateWidth = function (naturalWidth, width) {
        return (naturalWidth / (naturalWidth * (width / 100))) * 100;
    };
    /**
     * Calculate padding top
     * @param naturalHeight
     * @param naturalWidth
     * @param height
     * @param width
     */
    ImageViewerBase.prototype.calculatePaddingTop = function (height, width) {
        return (height / width) * 100;
    };
    /**
     * get image zone width in px
     * @param naturalWidth
     * @param imageZoneWidthInPercentage
     */
    ImageViewerBase.prototype.getImageZoneWidthInPx = function (naturalWidth, imageZoneWidthInPercentage) {
        return (naturalWidth * (imageZoneWidthInPercentage / 100));
    };
    /**
     * get image zone height in px
     * @param naturalHeight
     * @param imageZoneHeightInPercentage
     */
    ImageViewerBase.prototype.getImageZoneHeightInPx = function (naturalHeight, imageZoneHeightInPercentage) {
        return (naturalHeight * (imageZoneHeightInPercentage / 100));
    };
    /**
     * get image style
     * @param translateX
     * @param translateY
     * @param width
     */
    ImageViewerBase.prototype.getImageStyle = function (translateX, translateY, width) {
        var imgStyle = {
            'transform': 'translate(-' + translateX + '%,' + '-' + translateY + '%)',
            'WebkitTransform': 'translate(-' + translateX + '%,' + '-' + translateY + '%)',
            'width': width + '%'
        };
        return imgStyle;
    };
    /**
     * getScalerStyle
     *
     * @param {number} paddingTop
     * @returns
     * @memberof ImageViewerBase
     */
    ImageViewerBase.prototype.getScalerStyle = function (paddingTop) {
        var scalerStyle = {
            'paddingTop': paddingTop + '%'
        };
        return scalerStyle;
    };
    /**
     * On zoom updated
     */
    ImageViewerBase.prototype.onZoomUpdated = function () {
        this.isZoomUpdatedOfZoomPreference = true;
        this.setState({ refreshResponseImage: Date.now() });
    };
    /**
     * Re-render each page and reset FITWIDTH/HEIGHT styles and set the updated width as style
     * then only pinch transform will happen
     */
    ImageViewerBase.prototype.onResponsePinchToZoomStarted = function () {
        this.changeOrientation(enums.ResponseViewSettings.CustomZoom);
    };
    /**
     * Refresh image when the current page has already been rotated.
     * This will happen when the user rotated some of the images and navigate back n forth to response page.
     */
    ImageViewerBase.prototype.onRefreshImageRotateSettings = function () {
        if (this.refs != null) {
            var _loop_1 = function(ref) {
                // Only add to fracs data if the ref is a img.
                if (ref != null && ref.indexOf('img') === 0) {
                    var degree = (responseStore.instance.displayAnglesOfCurrentResponse.
                        find(function (value, key) { return key === ref; }));
                    // This will undefind if no corresponding rotation degree has been found
                    if (degree) {
                        this_1.setState({ rotateAngle: degree });
                    }
                }
            };
            var this_1 = this;
            for (var ref in this.refs) {
                _loop_1(ref);
            }
        }
    };
    /**
     * on comment holder render complete
     * @param outputPageNo
     * @param minHeight
     */
    ImageViewerBase.prototype.onCommentHolderRender = function (outputPageNo, minHeight) {
        if (this.props.outputPageNo === outputPageNo || parseInt(this.pageNo) === outputPageNo) {
            this.marksheetHolderMinHeight = minHeight;
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * to reset min height on commentside view hide
     * @param isSideViewEnabled
     */
    ImageViewerBase.prototype.onCommentSideViewToggle = function (isSideViewEnabled) {
        if (isSideViewEnabled === false) {
            this.marksheetHolderMinHeight = 0;
            this.setState({ renderedOn: Date.now() });
        }
    };
    /**
     * return zones above a zone
     * @param zone
     */
    ImageViewerBase.prototype.getZonesAboveAZone = function (zone) {
        return this.props.currentImageZones.filter(function (item) { return item.sequence < zone.sequence
            && item.outputPageNo === zone.outputPageNo; });
    };
    /**
     * return zones below a zone
     * @param zone
     */
    ImageViewerBase.prototype.getZonesBelowAZone = function (zone) {
        return this.props.currentImageZones.filter(function (item) { return item.sequence > zone.sequence
            && item.outputPageNo === zone.outputPageNo; });
    };
    /**
     * return the total of all the zones in the collection
     * @param zones
     */
    ImageViewerBase.prototype.getZonesHeight = function (zones) {
        var _this = this;
        var zonesHeight = 0;
        if (zones) {
            zones.map(function (imageZone) {
                var imageNaturalDimension = _this.props.getImageNaturalDimension(imageZone.pageNo);
                if (imageNaturalDimension) {
                    zonesHeight += _this.getImageZoneHeightInPx(imageNaturalDimension.naturalHeight, imageZone.height);
                }
            });
        }
        return zonesHeight;
    };
    /**
     * Get viewport height
     */
    ImageViewerBase.prototype.getViewportHeight = function () {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible ||
            markerOperationModeFactory.operationMode.isOffPageCommentConfigured) {
            var markSheetContainer = document.getElementsByClassName('marksheet-container');
            // marksheetContainer client height - 10px (padding)
            // it does not have marksheet container ,if there is no content has been assigned for the question item.
            var markSheetContainerHeight = markSheetContainer && markSheetContainer.length > 0 ?
                markSheetContainer[0].clientHeight - 10 : 0;
            var windowHeight = window.innerHeight;
            return (markSheetContainerHeight / windowHeight) * 100;
        }
        else {
            return 100;
        }
    };
    /**
     * Re render mark sheet on receiving events like bookmark added on script etc.
     */
    ImageViewerBase.prototype.reRenderMarksheet = function () {
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * return height and width of marksheet element
     * @param markSheetElement
     */
    ImageViewerBase.prototype.getMarksheetDimension = function (markSheetElement) {
        if (markSheetElement) {
            var clientRect = markSheetElement.getBoundingClientRect();
            return [clientRect.height, clientRect.width];
        }
        return [0, 0];
    };
    /**
     * check for marksheet dimension change
     * @param markSheetElement
     */
    ImageViewerBase.prototype.checkForMarksheetDimensionChange = function (markSheetElement) {
        if (htmlUtilities.isChrome || htmlUtilities.isSafari) {
            var _a = this.getMarksheetDimension(markSheetElement), height = _a[0], width = _a[1];
            if (height !== this.marksheetHeight || width !== this.marksheetWidth) {
                this.marksheetHeight = height;
                this.marksheetWidth = width;
                this.setState({ markSheetDimensionChangedOn: Date.now() });
            }
        }
    };
    return ImageViewerBase;
}(eventmanagerbase));
module.exports = ImageViewerBase;
//# sourceMappingURL=imageviewerbase.js.map
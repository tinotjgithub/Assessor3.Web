/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import $ = require('jquery');
let fracs = require('../../../utility/fracs/fracs');
import responseStore = require('../../../stores/response/responsestore');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markingStore = require('../../../stores/marking/markingstore');
import enums = require('../../utility/enums');
import constants = require('../../utility/constants');
import userOptionHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../stores/qigselector/qigstore');
import stampStore = require('../../../stores/stamp/stampstore');
import responseHelper = require('../../utility/responsehelper/responsehelper');
import annotation = require('../../../stores/response/typings/annotation');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import eventmanagerbase = require('../../base/eventmanager/eventmanagerbase');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import deviceHelper = require('../../../utility/touch/devicehelper');
import eventTypes = require('../../base/eventmanager/eventtypes');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import fracsHelper = require('../../../utility/generic/fracshelper');

//Holds the Top and Bottom padding value.
const PADDING: number = 10;
//Holds the scroll bar height 17 of desktop browsers
const SCROLL_BAR_HEIGHT_DESKTOP: number = 17;
//Holds the scroll bar height 4 of device browsers
const SCROLL_BAR_HEIGHT_DEVICE: number = 4;

/**
 * React component class for Image Viewer Base.
 */
abstract class ImageViewerBase extends eventmanagerbase {

    protected marksheetHolderMinHeight: number = 0;
    protected pageNo: string;

    protected marksheetContainerHeight: number = 0;
    protected marksheetContainerWidth: number = 0;
    protected addNewBookmarkSelected: boolean = false;
    protected markSheetElement: Element;
    protected marksheetHeight = 0;
    protected marksheetWidth = 0;
    protected isComponentMounted: boolean = false;

    /**
     * function to set up the hammer events
     *
     * @protected
     * @abstract
     * @memberof ImageViewerBase
     */
    protected abstract setUpHammer(): void;

    /**
     * function to destroy hammer events
     *
     * @protected
     * @abstract
     * @memberof ImageViewerBase
     */
    protected abstract destroyHammer(): void;

    /**
     * Constructor for image viewer base
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
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

    /* holds the value of current marking method */
    protected markingMethod: enums.MarkingMethod;

    private isZoomUpdatedOfZoomPreference: boolean;

    /** refs */
    public refs: {
        [key: string]: (Element);
        img: (HTMLInputElement);
    };

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
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
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
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
    }

    /**
     * callback function for zoom settings which decides which option is clicked
     * @param responseViewSettingss
     */
    private changeOrientation = (responseViewSettings: enums.ResponseViewSettings): void => {

        let rotateAngle: number = 90;

        // Updating scroll except for custom zoom
        let isZoomed: boolean = false;
        let displayAngle: number = 0;
        // active response ID
        let activeResponseRefId: string = responseStore.instance.currentlyVisibleImageContainerRefId;
        let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        // retrives collection of response angles
        if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
            displayAngleCollection.map((angle: number, key: string) => {
                if (key === activeResponseRefId) {
                    displayAngle = angle;
                }
            });

        }

        switch (responseViewSettings) {
            case (enums.ResponseViewSettings.FitToWidth):
                this.setState({ zoomPreference: enums.ZoomPreference.FitWidth });
                break;
            case (enums.ResponseViewSettings.FitToHeight):
                this.setState({ zoomPreference: enums.ZoomPreference.FitHeight });
                break;
            case (enums.ResponseViewSettings.RotateClockwise):
                if (this.refs[activeResponseRefId] !== undefined) {

                    let newAngle = displayAngle + rotateAngle;
                    this.setState({ rotateAngle: newAngle === 0 ? null : newAngle });
                    responseActionCreator.updateDisplayAngleOfResponse(false, newAngle, activeResponseRefId);
                    this.onRotatation();
                }
                break;
            case (enums.ResponseViewSettings.RotateAntiClockwise):
                if (this.refs[activeResponseRefId] !== undefined) {
                    let newAngle = displayAngle - rotateAngle;
                    this.setState({ rotateAngle: (newAngle === 0 ? null : newAngle) });
                    responseActionCreator.updateDisplayAngleOfResponse(false, newAngle, activeResponseRefId);
                    this.onRotatation();
                }
                break;
            case (enums.ResponseViewSettings.CustomZoom):
                this.setState({ zoomPreference: enums.ZoomPreference.Percentage });
                isZoomed = true;
                break;
        }

        //finds the active page and set the scroll
        if (this.refs[activeResponseRefId] !== undefined && !isZoomed) {
            var that = this;
            setTimeout(() => {
                that.setScrollForZoom(responseViewSettings);
            }, 400);
        }
    };


    /**
     * Sets scroll position after fit W/h or rotation
     * @param responseViewSettings
     */
    private setScrollForZoom(responseViewSettings: enums.ResponseViewSettings) {
        let marksheetContainerProps: any = this.props.getMarkSheetContainerProperties();
        let marksheetContainer = marksheetContainerProps.element as any;
        let currentResponse = this.refs[responseStore.instance.currentlyVisibleImageContainerRefId] ?
            this.refs[responseStore.instance.currentlyVisibleImageContainerRefId].
                getElementsByClassName('marksheet-holder-inner')[0].getBoundingClientRect() : undefined;
        let scroll: number;
        let imgRendered;

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

        } else if ((this.state.rotateAngle % 180 === 0 && !this.state.zoomPreference) && imgRendered !== 1) {
            //set vertical scroll to the center of active image on rotation of multipage response
            scroll = (marksheetContainer.scrollTop + (currentResponse.height / 2)) -
                (marksheetContainer.getBoundingClientRect().height / 2) - constants.RESPONSE_CONTAINER_PADDING;
            marksheetContainer.scrollTop = scroll;
        } else if (imgRendered === 1) {
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
    }

    /**
     * This will  return original rotated angle of a partucular responseID
     */
    protected getOriginalDisplayAngle(responseId: string, fromResponsStore: boolean = false) {
        let displayAngle = 0;
        if (!fromResponsStore && (this.state.rotateAngle === null || this.state.rotateAngle !== 0)) {
            displayAngle = this.state.rotateAngle === null ? 0 : this.state.rotateAngle;
        } else {
            let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map((angle: number, key: string) => {
                    if (key === responseId) {
                        displayAngle = angle;
                    }
                });

            }
        }
        return displayAngle;
    }

    /**
     * Get class name based on rotation
     */
    public getClassNames() {
        let rotateAngle: number = this.state.rotateAngle;
        let className = 'marksheet-holder ';

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
    }

    /**
     * calculate response styles when zoom options are applied
     * @param zoomPreference
     * @param rotateAngle
     * @param aspectRatio
     * @param rotatedAspectRatio
     */
    protected calculateImageStyleOnZoom(zoomPreference: enums.ZoomPreference,
        rotateAngle: number,
        aspectRatio: number,
        rotatedAspectRatio: number,
        seperatorInPercentage: number = 0,
        imageZoneWidthInPercentage: number = 0,
        markSheetViewHolderWidthInPx: number = 0,
        biggestRatio: number = 0,
        enableCommentSideView: boolean = false,
        imageId: string = '', marksheetHeight: number, marksheetWidth: number) {

        let marksheetStyle: React.CSSProperties;
        let wrapperStyle: React.CSSProperties;
        let scalerStyles: React.CSSProperties;
        let transformCss: string = 'translate3d(-50% , -50%, 0) rotate(' + rotateAngle + 'deg)';
        if ((htmlUtilities.isChrome || htmlUtilities.isSafari) && this.refs[imageId]) {
            let width: string = '0px';
            let height: string = '0px';
            if (rotateAngle === 90 || rotateAngle === 270) {
                width = ((marksheetHeight / 2) - Math.floor(marksheetHeight / 2)).toString() + 'px';
                height = ((marksheetWidth / 2) - Math.floor(marksheetWidth / 2)).toString() + 'px';
            } else {
                width = ((marksheetWidth / 2) - Math.floor(marksheetWidth / 2)).toString() + 'px';
                height = ((marksheetHeight / 2) - Math.floor(marksheetHeight / 2)).toString() + 'px';
            }
            transformCss = 'translate3d(calc(-50% + ' + width + '), calc(-50% + ' + height + '), 0) rotate(' + rotateAngle + 'deg)';
        }

        //to adjust the heigth tolerace in devices
        let heightTolerace: number = 0;
        let commentContainerWidth: number = 0;
        if (enableCommentSideView) {
            commentContainerWidth = constants.SIDE_VIEW_COMMENT_PANEL_WIDTH;
        } else {
            this.marksheetHolderMinHeight = 0;
        }

        let audioPlayer: HTMLElement = document.getElementById('audioPlayerContainer');
        let audioPlayerHeight: number = 0;
        if (audioPlayer) {
            audioPlayerHeight = audioPlayer.clientHeight;
        }

        // checks whether the response will have a horizontal scroll bar.
        if (biggestRatio !== 0) {
            if ((biggestRatio * (this.marksheetContainerHeight - PADDING)) > (this.marksheetContainerWidth - commentContainerWidth)) {
                if (!htmlUtilities.isTabletOrMobileDevice) {
                    heightTolerace = SCROLL_BAR_HEIGHT_DESKTOP;
                } else if (htmlUtilities.isAndroidDevice) { // in Ipad devices, scroll bar hide automatically, so not required
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
                        width: (rotateAngle % 180 === 0) ? (
                            (this.marksheetContainerHeight - (PADDING + heightTolerace + audioPlayerHeight)) * aspectRatio)
                            + 'px' : (
                                (this.marksheetContainerHeight -
                                    (PADDING + heightTolerace + audioPlayerHeight)) * rotatedAspectRatio) + 'px',
                        minHeight: this.marksheetHolderMinHeight + 'px',
                        marginLeft: ''
                    };
                } else {
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

                    let imageZoneWidthInPx = (markSheetViewHolderWidthInPx / 100) * imageZoneWidthInPercentage;

                    let viewHolderPadding = (markSheetViewHolderWidthInPx - (imageZoneWidthInPx * rotatedAspectRatio)) / 2;

                    let _marginLeft = (viewHolderPadding / markSheetViewHolderWidthInPx) * 100;

                    //setting marksheet-holder width individually
                    if (rotateAngle % 180 === 0) {
                        marksheetStyle = {
                            width: imageZoneWidthInPercentage + '%',
                            minHeight: this.marksheetHolderMinHeight + 'px'
                        };
                    } else {
                        //Applying margin left for each marksheet holder, to keep centre align after rotation
                        if ((_marginLeft < 0)) {
                            marksheetStyle = {
                                width: (rotatedAspectRatio * imageZoneWidthInPercentage) + '%',
                                marginLeft: _marginLeft + '%',
                                minHeight: this.marksheetHolderMinHeight + 'px'
                            };
                        } else {
                            marksheetStyle = {
                                width: (rotatedAspectRatio * imageZoneWidthInPercentage) + '%',
                                minHeight: this.marksheetHolderMinHeight + 'px'
                            };
                        }
                    }
                } else {
                    if (this.isZoomUpdatedOfZoomPreference === false) {
                        marksheetStyle = {
                            width: '100%',
                            minHeight: this.marksheetHolderMinHeight + 'px'
                        };
                    } else if (markingStore.instance.zoomWidth > 0) {

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
    }

    /**
     * Get image properties
     * @param {string} image
     * @param {Function} callback
     */
    public getImageProperties(image: string, callback: Function) {
        if (image !== '') {
            let img = $('<img />');
            img.attr('src', image);
            img.unbind('load');

            img.bind('load', function () {
                callback(this);
            });
        }
    }

    /**
     * Calculate Translate X
     * @param naturalWidth
     * @param leftEdge
     */
    public calculateTranslateX(naturalWidth: number, leftEdge: number) {
        return ((naturalWidth * (leftEdge / 100)) / naturalWidth) * 100;
    }

    /**
     * Calculate Translate Y
     * @param naturalWidth
     * @param topEdge
     */
    public calculateTranslateY(naturalHeight: number, topEdge: number) {
        return (((naturalHeight) * (topEdge / 100)) / naturalHeight) * 100;
    }

    /**
     * Calculate width
     * @param naturalWidth
     * @param width
     */
    public calculateWidth(naturalWidth: number, width: number) {
        return (naturalWidth / (naturalWidth * (width / 100))) * 100;
    }

    /**
     * Calculate padding top
     * @param naturalHeight
     * @param naturalWidth
     * @param height
     * @param width
     */
    public calculatePaddingTop(height: number, width: number) {
        return (height / width) * 100;
    }

    /**
     * get image zone width in px
     * @param naturalWidth
     * @param imageZoneWidthInPercentage
     */
    public getImageZoneWidthInPx(naturalWidth: number, imageZoneWidthInPercentage: number) {
        return (naturalWidth * (imageZoneWidthInPercentage / 100));
    }

    /**
     * get image zone height in px
     * @param naturalHeight
     * @param imageZoneHeightInPercentage
     */
    public getImageZoneHeightInPx(naturalHeight: number, imageZoneHeightInPercentage: number) {
        return (naturalHeight * (imageZoneHeightInPercentage / 100));
    }

    /**
     * get image style
     * @param translateX
     * @param translateY
     * @param width
     */
    public getImageStyle(translateX: number, translateY: number, width: number) {

        let imgStyle = {
            'transform': 'translate(-' + translateX + '%,' + '-' + translateY + '%)',
            'WebkitTransform': 'translate(-' + translateX + '%,' + '-' + translateY + '%)',
            'width': width + '%'
        };

        return imgStyle;
    }

    /**
     * getScalerStyle
     *
     * @param {number} paddingTop
     * @returns
     * @memberof ImageViewerBase
     */
    public getScalerStyle(paddingTop: number) {

        let scalerStyle = {
            'paddingTop': paddingTop + '%'
        };

        return scalerStyle;
    }

    /**
     * This will loop and find the fracs data of each single and stitched image containers.
     */
    protected responseViewModeChanged = (): void => {
        this.props.setScrollPositionCallback();
        this.setFracsDataForResponse();
        this.props.switchViewCallback();
    };

    /**
     * This will set fracs data after Response Image Loaded
     * triggerScrollEvent True for Emitting event FRACS_DATA_LOADED
     */
    protected setFracsForImageLoaded = (): void => {
        this.setFracsDataForResponse(true);
    };

    /**
     * This will set fracs data after Structured Images Loaded
     * structuredFracsDataLoaded True for Emitting event STRUCTURED_FRACS_DATA_LOADED
     */
    protected structuredFracsDataSet = (_fracsDataSource: enums.FracsDataSetActionSource): void => {
        this.setFracsDataForResponse(false, true, _fracsDataSource);
    };

    /**
     * This will set FracsData
     * @param triggerScrollEvent
     */
    private setFracsDataForResponse = (triggerScrollEvent: boolean = false, structuredFracsDataLoaded: boolean = false,
        fracsDataSource?: enums.FracsDataSetActionSource): void => {
        let isUnStructured: boolean =
            responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured
            || responseHelper.isAtypicalResponse();

        if (this.refs != null) {
            for (let ref in this.refs) {
                // Only add to fracs data if the ref is a img.
                if (ref != null && ref.indexOf('img') === 0) {
                    let ele: any = ReactDom.findDOMNode(this.refs[ref]);
                    // get the fracs of current container using fracs
                    // This will call method fracs(action, callback, viewport) with viewport imagecontainer
                    // parameters => action = '', callback = undefined , viewport=imagecontainer DOM element.
                    let fractions = fracsHelper.getFracsWithRespectToContainer('',
                        $('#' + ele.getAttribute('id')), htmlUtilities.getElementById('imagecontainer'));
                    let data: FracsData = {
                        elementId: isUnStructured && !responseHelper.isEbookMarking ?
                            ele.getAttribute('id') : ele.getAttribute('data-id'),
                        possible: fractions.possible,
                        viewport: fractions.viewport,
                        visible: fractions.visible,
                        offsettop: ele.offsetTop,
                        outputPage: this.props.outputPageNo
                    };

                    // set fracs data in response store.
                    responseActionCreator.setFracsData(data, triggerScrollEvent, structuredFracsDataLoaded,
                        fracsDataSource);
                }
            }
        }
    };

    /**
     * This method will get fired when the mouse enters the annotation area
     */
    public onMouseEnter = (event: MouseEvent) => {
        this.props.onMouseEnter(event);
    };

    /**
     * This method will get fired when the mouse leaves the annotation area
     */
    public onMouseLeave = (event: MouseEvent) => {
        this.props.onMouseLeave(event);
    };

    /**
     * This method will get fired when the mouse moves over the annotation area
     */
    public onMouseMove = (event: MouseEvent, annotationAreaWidth: number, annotationAreaHeight: number,
        annotationAreaLeftPos: number, annotationAreaTopPos: number) => {
        this.props.onMouseMove(event, annotationAreaWidth, annotationAreaHeight, annotationAreaLeftPos, annotationAreaTopPos);
    };

    /**
     * This will set Fracs data while clicking zoom options
     */
    protected setFracsForZoom = (responseViewSettings: enums.ResponseViewSettings): void => {
        this.setFracsDataForResponse();
        this.props.setZoomOptions(responseViewSettings, this.markingMethod);
    };

    /**
     * This will start the rotate action
     */
    protected onRotatation = () => {
        if (this.props.onRotation) {
            this.props.onRotation(this.state.rotateAngle);
        }
    };

    /**
     * On zoom updated
     */
    private onZoomUpdated(): void {
        this.isZoomUpdatedOfZoomPreference = true;
        this.setState({ refreshResponseImage: Date.now() });
    }

    /**
     * Re-render each page and reset FITWIDTH/HEIGHT styles and set the updated width as style
     * then only pinch transform will happen
     */
    private onResponsePinchToZoomStarted(): void {
        this.changeOrientation(enums.ResponseViewSettings.CustomZoom);
    }

    /**
     * Refresh image when the current page has already been rotated.
     * This will happen when the user rotated some of the images and navigate back n forth to response page.
     */
    public onRefreshImageRotateSettings(): void {

        if (this.refs != null) {
            for (let ref in this.refs) {
                // Only add to fracs data if the ref is a img.
                if (ref != null && ref.indexOf('img') === 0) {

                    let degree = (responseStore.instance.displayAnglesOfCurrentResponse.
                        find((value: number, key: string) => { return key === ref; }));

                    // This will undefind if no corresponding rotation degree has been found
                    if (degree) {
                        this.setState({ rotateAngle: degree });
                    }
                }
            }
        }
    }

    /**
     * on comment holder render complete
     * @param outputPageNo
     * @param minHeight
     */
    public onCommentHolderRender(outputPageNo: number, minHeight: number) {
        if (this.props.outputPageNo === outputPageNo || parseInt(this.pageNo) === outputPageNo) {
            this.marksheetHolderMinHeight = minHeight;
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * to reset min height on commentside view hide
     * @param isSideViewEnabled
     */
    public onCommentSideViewToggle(isSideViewEnabled: boolean) {
        if (isSideViewEnabled === false) {
            this.marksheetHolderMinHeight = 0;
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * Called when an annotation is added
     * @param stampId stamptypeid
     * @param addAnnotationAction annotationAction
     * @param annotationOverlayId overlayId
     * @param annotation annotationDetails
     */
    public onAnnotationAdded = (stampId: number,
        addAnnotationAction: enums.AddAnnotationAction,
        annotationOverlayId: string,
        annotation: annotation): void => {
        // resets the rotation, on adding linked annotation from Marking screen.
        if (stampId === constants.LINK_ANNOTATION &&
            responseStore.instance.selectedResponseViewMode !== enums.ResponseViewMode.fullResponseView
        ) {
            this.setState({ rotateAngle: null });
            responseActionCreator.updateDisplayAngleOfResponse(true);
            this.onRotatation();
            this.setFracsDataForResponse(false, true);
        }
    }

    /**
     * return zones above a zone
     * @param zone
     */
    public getZonesAboveAZone(zone: ImageZone) {
        return this.props.currentImageZones.filter(item => item.sequence < zone.sequence
            && item.outputPageNo === zone.outputPageNo);
    }

    /**
     * return zones below a zone
     * @param zone
     */
    public getZonesBelowAZone(zone: ImageZone) {
        return this.props.currentImageZones.filter(item => item.sequence > zone.sequence
            && item.outputPageNo === zone.outputPageNo);
    }

    /**
     * return the total of all the zones in the collection
     * @param zones
     */
    public getZonesHeight(zones: Immutable.List<ImageZone>) {
        let zonesHeight = 0;
        if (zones) {
            zones.map((imageZone: ImageZone) => {
                let imageNaturalDimension = this.props.getImageNaturalDimension(imageZone.pageNo);
                if (imageNaturalDimension) {
                    zonesHeight += this.getImageZoneHeightInPx(imageNaturalDimension.naturalHeight,
                        imageZone.height);
                }
            });
        }

        return zonesHeight;
    }

    /**
     * Get viewport height
     */
    private getViewportHeight(): number {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible ||
            markerOperationModeFactory.operationMode.isOffPageCommentConfigured) {
            let markSheetContainer = document.getElementsByClassName('marksheet-container');
            // marksheetContainer client height - 10px (padding)
            // it does not have marksheet container ,if there is no content has been assigned for the question item.
            let markSheetContainerHeight = markSheetContainer && markSheetContainer.length > 0 ?
                markSheetContainer[0].clientHeight - 10 : 0;
            let windowHeight = window.innerHeight;
            return (markSheetContainerHeight / windowHeight) * 100;
        } else {
            return 100;
        }
    }

    /**
     * Re render mark sheet on receiving events like bookmark added on script etc.
     */
    private reRenderMarksheet(): void {
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Get the Marksheet Element
     */
    protected getMarkSheetElement = (): Element => {
        let element: Element = ReactDom.findDOMNode(this);
        return element;
    };

    /**
     * return height and width of marksheet element
     * @param markSheetElement
     */
    protected getMarksheetDimension(markSheetElement: Element) {
        if (markSheetElement) {
            let clientRect = markSheetElement.getBoundingClientRect();
            return [clientRect.height, clientRect.width];
        }

        return [0, 0];
    }

    /**
     * check for marksheet dimension change
     * @param markSheetElement
     */
    protected checkForMarksheetDimensionChange(markSheetElement: Element) {
        if (htmlUtilities.isChrome || htmlUtilities.isSafari) {
            let [height, width] = this.getMarksheetDimension(markSheetElement);
            if (height !== this.marksheetHeight || width !== this.marksheetWidth) {
                this.marksheetHeight = height;
                this.marksheetWidth = width;
                this.setState({ markSheetDimensionChangedOn: Date.now() });
            }
        }
    }
}

export = ImageViewerBase;
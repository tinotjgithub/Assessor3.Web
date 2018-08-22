/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import zoomAttribute = require('../../utility/zoom/typings/zoomattributes');
import enums = require('../../utility/enums');
import zoomScaleManager = require('./zoomhelper/structuredzoomscalemanager');
import userOptionHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../stores/qigselector/qigstore');
import zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
import responseStore = require('../../../stores/response/responsestore');
import markingStore = require('../../../stores/marking/markingstore');
import zoomHelper = require('./zoomhelper/zoomhelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import constants = require('../../utility/constants');
import responsehelper = require('../../utility/responsehelper/responsehelper');
import stringHelper = require('../../../utility/generic/stringhelper');

let classNames = require('classnames');
const STRUCTRED_PAGE_REF_NAME = 'StructuredPaper';
const MARKSHEET_CONTAINER_PADDING = 10;

interface State {
    renderedOn: number;
}

class ZoomableStructuredImage extends pureRenderComponent<any, State> {

    // Perform the scaling numbers
    private zoomScaleManager: zoomScaleManager;

    // holds a value indicating the zoom type. The default value will be
    // None and when a new zoom type is coming will result to update the same
    // and revert to none when update is commited.
    private selectedZoomType: enums.ZoomType;

    // Indicate whether the user is set manual zooming or fitwidth/height
    private zoomPreference: enums.ZoomPreference;

    // Zoom factor
    private userOptionZoomValue: number = 0;

    // holds Image Zone Height
    private imageZoneHeight: number = 0;

    // holds Image Zone Width
    private imageZoneWidth: number = 0;

    // Holds a value indicating response list containes rotated images.
    private hasRotatedImages: boolean = false;

    //Holds the rotated images
    private rotatedImages: string[] = [];

    //Holds the marksheet view holder padding
    private marksheetViewHolderPadding: number = 0;

    //Holds is zoom is modified or not
    private isZoomModified: boolean = false;

    // Holds the marksheet-view-holder width after zoom.
	private markSheetHolderWidth: number = 0;

	// restrict updating the image based on necessary.
	// we dont need to update the image when there are no changes.
    private updateImage: boolean = false;

    // holds value entered by user for custom zoom
    private userInputZoomValue: number = 0;

    /** refs */
    public refs: {
        [key: string]: (Element),
        zoomHolder: (HTMLDivElement)
    };

     /**
      * Constructor for zoomable structured image
      * @param props
      * @param state
      */
    constructor(props: any, state: State) {
        super(props, state);
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
    public render(): JSX.Element {
        let child;
        let style;
        let attributes: zoomAttribute = {
            zoomType: this.selectedZoomType,
            zoomEvent: this.props.zoomAttributes.zoomEvent
        };

        this.userInputZoomValue = this.props.userZoomValue;
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item: any, i: number) {
                // adding ref to locate the structred page to calculate the clientWidth.
                // to update the resized/fitwidth/height value
                return React.cloneElement(item as React.ReactElement<any>,
                    { zoomAttributes: attributes, ref: STRUCTRED_PAGE_REF_NAME + i });
            });

        } else {
            child = React.cloneElement(this.props.children as React.ReactElement<any>,
                { zoomAttributes: attributes, ref: STRUCTRED_PAGE_REF_NAME + 1 });
        }
        let className = this.getClassName(this.selectedZoomType);
        if (this.zoomPreference === enums.ZoomPreference.Percentage && this.markSheetHolderWidth > 0) {

            if (this.hasRotatedImages) {
                this.calculateRotatedPagePadding();
            }
            if (this.marksheetViewHolderPadding > 0 && this.hasRotatedImages) {
                style = {
                    'width': (this.markSheetHolderWidth + (this.marksheetViewHolderPadding * 2)) + 'px',
                    'padding': 0 + ' ' + this.marksheetViewHolderPadding + 'px'
                };
            } else {
                style = {
                    'width': this.markSheetHolderWidth + 'px',
                    'padding': '0px 0px'
                };
            }
        } else {
            style = undefined;
        }
        let result = (
            <div className = { className } ref = 'zoomHolder'>
                <div className = {'marksheet-view-holder'} style={style} >
                    {child}
                </div>
            </div>
        );

        return result;
    }

    /**
     * Component will receive props
     * @param {any} nxtProps
     */
    public componentWillReceiveProps(nxtProps: any): void {

        // If user has changed the zoom option to any choice should reflect here.
        this.getCurrentUserOption();

        // Check naturalWidth is updated then set the width based on that.
        if (nxtProps.naturalImageWidth !== this.props.naturalImageWidth) {

            this.zoomScaleManager.setZoomAttributes(nxtProps.naturalImageWidth,
                nxtProps.clientImageWidth,
                nxtProps.naturalImageHeight);
            this.zoomScaleManager.setZoomValue(this.userOptionZoomValue);
        }
        // When new zoom type comes update to perform the zoom
        if (nxtProps.renderedOn !== this.props.renderedOn ||
            nxtProps.sideViewEnabledAndVisible !== this.props.sideViewEnabledAndVisible) {

			this.updateImage = true;
            if (nxtProps.zoomAttributes.zoomType !== enums.ZoomType.None) {

                let currentZoom = this.zoomScaleManager.getCurrentZoom;

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
            } else {
                //Calculate Image Zone Height/width
                this.calculateMostvisiblePageWidthHeight();
                let containerAttribute: number = 0;
                let commentContainerWidth: number = 0;
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
    }

    /**
     * Sets the marksheet view holder padding for rotated images
     */
    private calculateRotatedPagePadding() {
        this.marksheetViewHolderPadding = zoomHelper.getRotatedPagePadding(this.markSheetHolderWidth,
            this.props.structuredImageZone,
            this.rotatedImages,
            this.zoomScaleManager.getCurrentZoom,
            responseStore.instance.displayAnglesOfCurrentResponse);
    }

    /**
     * Sets the Image zone Height and Width of the most visible page
     */
    private calculateMostvisiblePageWidthHeight() {
        //getting fracs data to get the most visible page
        let fracs: FracsData = responseStore.instance.getCurrentVisibleFracsData;
        let zoneWidth: number = 0;
        let zoneHeight: number = 0;
        let element: StructuredImageZone;

        for (let i = 0; element = this.props.structuredImageZone[i]; i++) {

            let rotatedImage = this.rotatedImages.filter(((x: string) => x === element.pageNo));
            let displayAngle = 0;
            let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map((angle: number, key: string) => {
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
                } else {
                    zoneWidth = element.zoneWidth;
                    zoneHeight = element.zoneHeight;
                }
            }
        }
        this.imageZoneHeight = zoneHeight;
        this.imageZoneWidth = zoneWidth;
    }

    /**
     * Component did mount
     */
	public componentDidMount() {
		this.updateImage = true;
        this.updateImageWidth();
        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT,
            this.responseImageRotationCompleted);
        markingStore.instance.addListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.onCurrentQuestionItemChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED,
            this.onPinchZoomCompleted);
    }

    /**
     * Component did update
     */
    public componentDidUpdate() {
        this.updateImageWidth();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT,
            this.responseImageRotationCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.ZOOM_SETTINGS, this.onZoomOptionChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.onCurrentQuestionItemChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED,
            this.onPinchZoomCompleted);
    }

    /**
     * update on current question item changed
     */
    private onCurrentQuestionItemChanged = (): void => {
        this.isZoomModified = false;
    };

    /**
     * update on zoom option changed
     */
    private onZoomOptionChanged = (): void => {
        this.isZoomModified = true;
    };

    /**
     * Update the image width to calculate the zoom percentage
     */
    private updateImageWidth() {

		if (this.props.naturalImageWidth > 0 && this.updateImage) {

			// setting to default
			this.updateImage = false;

            // Indicating a flag to update the scroll position on zooming.
            // this will be false for other rendering eg: annotation drag
            let updateScrollValue: boolean = false;

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

            this.props.setResponseScroll(this.markSheetHolderWidth, updateScrollValue, this.selectedZoomType,
                this.zoomScaleManager.getRotatedImageWidth(this.hasRotatedImages, this.imageZoneHeight));
            zoomPanelActionCreator.responseZoomUpdated(this.zoomValue);
        }

        // always setting to default to prevent other render to use the zoom preferences
        this.selectedZoomType = enums.ZoomType.None;
    }

    /**
     * Get zoom value
     * @returns
     */
    private get zoomValue(): number {
        let value: number = 0;

        // For fitwidth/height we should get the container attributes rather than the user option value.
        if (this.zoomPreference === enums.ZoomPreference.Percentage) {
            value = this.userOptionZoomValue;
        } else {
            value = this.zoomScaleManager.getCurrentZoom;
        }
        return value;
    }

    /**
     * Append the classname
     * @param {enums.ZoomType} zoomType
     * @returns
     */
    private getClassName = (zoomType: enums.ZoomType): string => {
        // adding 'zooming' class only for pinch zoom and its gets removed
        // during pinch end
        return classNames('marksheet-zoom-holder', {
            'zooming': zoomType === enums.ZoomType.PinchOut || zoomType === enums.ZoomType.PinchIn
        }, {
                'custom-zoom': (zoomType === enums.ZoomType.CustomZoomIn || zoomType === enums.ZoomType.CustomZoomOut ||
                    zoomType === enums.ZoomType.UserInput ||
                    (this.zoomPreference !== enums.ZoomPreference.FitHeight && this.zoomPreference !== enums.ZoomPreference.FitWidth))
            });
    };

    /**
     * To get currently saved use preference(FW/FH)
     */
    private getCurrentUserOption() {
        let zoomUserOption: string = userOptionHelper.getUserOptionByName
			(userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);

        let imageCluster = zoomHelper.setImageClusterId(this.isZoomModified);

        // Get the saved zoom percentage value
        let userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption,
            imageCluster);
        // Ebookmarking useroption should be saved like unstructured.
        if (zoomUserOption && responsehelper.isEbookMarking) {
            this.getCurrentUserOptionForEbookmarking(zoomUserOption);
        } else {
            this.userOptionZoomValue = userOption.userOptionZoomValue;
            this.zoomPreference = userOption.zoomPreference;
        }
    }

    /**
     * To get currently saved user option for EBM. Since it is saving as usntructured.
     */
    private getCurrentUserOptionForEbookmarking(zoomUserOption: string) {
        if (zoomUserOption) {
            let zoomPreference: enums.ZoomPreference;
            let optionWithValue = stringHelper.split(zoomUserOption, stringHelper.COMMA_SEPARATOR).map(Number);
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
    }

    /**
     * save the zoom preference to user options
     */
    private updateAndSaveZoomPreference() {

        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {

            let zoomUserOption: string = userOptionHelper.getUserOptionByName
				(userOptionKeys.ZOOM_PREFERENCE, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
            let userOption = zoomHelper.getZoomUserOption(zoomUserOption);

            let preference: string = '';
            // Ebookmarking useroption should be saved like unstructured.
            if (responsehelper.isEbookMarking) {
                preference = enums.ZoomPreference.Percentage.toString() + ',' + this.zoomScaleManager.getCurrentZoom;
            } else {
                // Format the saving user preference value.
                preference = zoomHelper.updateZoomPreference(
                    userOption.userOptionZoomValue,
                    this.zoomScaleManager.getCurrentZoom,
                    this.props.currentQuestion,
                    enums.ZoomPreference.Percentage,
                    userOption.zoomHeader);
            }
            userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE,
                preference, false, true, false, true, markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser);
        }

        this.getCurrentUserOption();
    }

    /**
     * Updating response has rotated flag.
     * @param hasRotatedImages
     */
    private responseImageRotationCompleted(hasRotatedImages: boolean, rotatedImages: string[]): void {
        this.hasRotatedImages = hasRotatedImages;
        this.rotatedImages = rotatedImages;
        this.props.responseOrientationChanged(this.zoomScaleManager.getRotatedImageWidth(hasRotatedImages));
    }
    /**
     * Triggers when user has completed pinch zoom. The pinched value will be updated here to reflect next
     * marnual operation. Like rotate the image after pinch zoom.
     * @param {number} zoomedWidth
     */
    private onPinchZoomCompleted(zoomedWidth: number): void {
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
    }
}
export = ZoomableStructuredImage;
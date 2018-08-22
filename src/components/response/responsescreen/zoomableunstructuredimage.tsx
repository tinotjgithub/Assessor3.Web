/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import zoomAttribute = require('../../utility/zoom/typings/zoomattributes');
import enums = require('../../utility/enums');
import zoomScaleManager = require('./zoomhelper/unstructuredzoomscalemanager');
import userOptionHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../stores/qigselector/qigstore');
import stringHelper = require('../../../utility/generic/stringhelper');
import userOptionActionCreator = require('../../../actions/useroption/useroptionactioncreator');
import zoomPanelActionCreator = require('../../../actions/zoompanel/zoompanelactioncreator');
import responseStore = require('../../../stores/response/responsestore');
import responsehelper = require('../../utility/responsehelper/responsehelper');
import zoomHelper = require('./zoomhelper/zoomhelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import constants = require('../../utility/constants');
import markingStore = require('../../../stores/marking/markingstore');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import awardingStore = require('../../../stores/awarding/awardingstore');

let classNames = require('classnames');
const UNSTRUCTRED_PAGE_REF_NAME = 'UnStructuredPaper';
const MARKSHEET_CONTAINER_PADDING = 10;

interface State {
    renderedOn: number;
}

class ZoomableUnstructuredImage extends pureRenderComponent<any, State> {

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

    // restrict updating the image based on necessary.
    // we dont need to update the image when there are no changes.
    private updateImage: boolean = false;

    // holds value entered by user for custom zoom
    private userInputZoomValue: number = 0;

    private strokeWidth = '1';

    /** refs */
    public refs: {
        [key: string]: (Element),
        zoomHolder: (HTMLDivElement)
    };

    /**
     * Constructor for zoomable unstructured image
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
        let attributes: zoomAttribute = {
            zoomType: this.selectedZoomType,
            zoomEvent: this.props.zoomAttributes.zoomEvent
        };

        this.userInputZoomValue = this.props.userZoomValue;
        if (Array.isArray(this.props.children)) {
            child = this.props.children.map(function (item: any, i: number) {
                // adding ref to locate the unstructred page to calculate the clientWidth.
                // to update the resized/fitwidth/height value
                return React.cloneElement(item as React.ReactElement<any>,
                    { zoomAttributes: attributes, ref: UNSTRUCTRED_PAGE_REF_NAME + i });
            });

        } else {
            child = React.cloneElement(this.props.children as React.ReactElement<any>,
                { zoomAttributes: attributes, ref: UNSTRUCTRED_PAGE_REF_NAME + 1 });
        }
        let className = this.getClassName(this.selectedZoomType);
        let result = (
            <div className={className} ref='zoomHolder'>
                <div className={'marksheet-view-holder'}>
                    {child}
                    <style>{this.marksheetViewHolderStrokeWidth}</style>
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
        // nxtProps.zoomAttributes.zoomType check is added, inorder to avoid performing initiatingZoom. when commentSideView
        // gets invisible while performing zoom functionality in devices.
        if (nxtProps.renderedOn !== this.props.renderedOn
            || (nxtProps.sideViewEnabledAndVisible !== this.props.sideViewEnabledAndVisible
                && nxtProps.zoomAttributes.zoomType === enums.ZoomType.None)) {
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
                if (!markerOperationModeFactory.operationMode.isAwardingMode) {
                    this.updateAndSaveZoomPreference();
                }
            } else {
                let containerAttribute: number = 0;
                let commentContainerWidth: number = 0;
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
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.updateStrokeWidth);
        window.addEventListener('resize', this.updateStrokeWidth);
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
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.updateStrokeWidth);
        window.removeEventListener('resize', this.updateStrokeWidth);
    }

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

            // setting the rotated image width. If any of the image is rotated in 90/270 angle
            // then applying the rotated image height percentage. Otherwise same
            // as normal zoom width.
            this.props.setResponseScroll(this.zoomScaleManager.getContainerWidthInPixel, updateScrollValue, this.selectedZoomType,
                this.zoomScaleManager.getRotatedImageWidth(responseStore.instance.hasRotatedImagesWithOddAngle));
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
        });
    };

    /**
     * To get currently saved use preference(FW/FH)
     */
    private getCurrentUserOption() {
        let zoomUserOption: string;
        let userOption;
        let zoomPreference: enums.ZoomPreference;

        zoomUserOption = userOptionHelper.getUserOptionByName
            (userOptionKeys.ZOOM_PREFERENCE,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

        if (zoomUserOption) {
            if (this.props.selectedECourseworkPageID > 0) {
                // Get the saved zoom percentage value
                userOption = zoomHelper.getCurrentZoomPreference(zoomUserOption, 0, this.props.selectedECourseworkPageID);
                this.userOptionZoomValue = userOption.userOptionZoomValue;
                this.zoomPreference = userOption.zoomPreference;
            } else {
                if (responsehelper.isAtypicalResponse() &&
                    responsehelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {
                    let userOption: any = zoomHelper.getAtypicalZoomOption(zoomUserOption);
                    this.userOptionZoomValue = userOption.userOptionZoomValue;
                    this.zoomPreference = userOption.zoomPreference;
                    return;
                }

                let optionWithValue = stringHelper.split(zoomUserOption, stringHelper.COMMA_SEPARATOR).map(Number);
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
        } else {
            this.zoomPreference = enums.ZoomPreference.FitWidth;
        }
    }

    /**
     * save the zoom preference to user options
     */
    private updateAndSaveZoomPreference() {

        if (userOptionHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE) !== undefined) {

            let zoomPreferenceToSave: string =
                enums.ZoomPreference.Percentage.toString() + ',' + this.zoomScaleManager.getCurrentZoom;

            // Atypical structured responses are treated as unstructured. But saving the zoom preferece
            // upon them should treat as structured.
            if (responsehelper.isAtypicalResponse() &&
                responsehelper.CurrentMarkingMethod === enums.MarkingMethod.Structured) {

                let zoomUserOption: string = userOptionHelper.getUserOptionByName
                    (userOptionKeys.ZOOM_PREFERENCE,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

                zoomPreferenceToSave = zoomHelper.updateAtypicalZoomOption(zoomUserOption,
                    enums.ZoomPreference.MarkschemePercentage,
                    this.zoomScaleManager.getCurrentZoom);
            }

            if (this.props.selectedECourseworkPageID > 0) {
                // Ecoursework response. Update the zoom in the below format
                // 4,[{"f":docstorePageId,"z":zoomValue]

                let zoomUserOption: string = userOptionHelper.getUserOptionByName
                    (userOptionKeys.ZOOM_PREFERENCE,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);

                let userOption = zoomHelper.getZoomUserOption(zoomUserOption);

                // Format the saving user preference value.
                zoomPreferenceToSave = zoomHelper.updateZoomPreference(
                    userOption.userOptionZoomValue,
                    this.zoomScaleManager.getCurrentZoom,
                    this.props.currentQuestion,
                    enums.ZoomPreference.Percentage,
                    enums.ZoomPreference.FilePercentage.toString(),
                    this.props.selectedECourseworkPageID);
            }

            userOptionHelper.save(userOptionKeys.ZOOM_PREFERENCE,
                zoomPreferenceToSave, true, true, false, true,
                qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }

        this.getCurrentUserOption();
    }

    /**
     * Updating response has rotated flag.
     */
    private responseImageRotationCompleted(): void {
        // setting the rotated image width. If any of the image is rotated in 90/270 angle
        // then applying the rotated image height percentage. Otherwise same
        // as normal zoom width.
        this.props.responseOrientationChanged(this.zoomScaleManager.getRotatedImageWidth
            (responseStore.instance.hasRotatedImagesWithOddAngle));
    }

    /* return true if we need to add stroke width for marksheet view holder */
    private get doAddStrokeWidthStyle(): boolean {
        return responseStore.instance.markingMethod === enums.MarkingMethod.Unstructured ||
            responsehelper.isAtypicalResponse();
    }

    /**
     * return marksheet view holder stroke width
     */
    private get marksheetViewHolderStrokeWidth() {
        return '.annotation-holder{stroke-width:' + this.strokeWidth + ';}';
    }

    /**
     * update the stroke-width for marksheet view holder
     */
    private updateStrokeWidth = (): void => {
        if (this.doAddStrokeWidthStyle) {
            let element = document.getElementsByClassName('marksheet-img')[0];
            if (element) {
                this.strokeWidth = annotationHelper.getStrokeWidth(element, 0);
                this.setState({ renderedOn: Date.now() });
            }
        }
    };
}
export = ZoomableUnstructuredImage;
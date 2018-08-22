/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import annotation = require('../../../../stores/response/typings/annotation');
import enums = require('../../../utility/enums');
import Highlighter = require('./highlighter');
import moveCoordinates = require('../typings/movecoordinates');
import initCoordinates = require('../typings/initcoordinates');
import pureRenderComponent = require('../../../base/purerendercomponent');
import HorizontalLine = require('./horizontalline');
import Ellipse = require('./ellipse');
import stampData = require('../../../../stores/stamp/typings/stampdata');
import HWavyLine = require('./hwavyline');
import VWavyLine = require('./vwavyline');

interface DynamicFactoryProps extends LocaleSelectionBase, PropsBase {
    imageWidth?: number;
    imageHeight?: number;
    getAnnotationOverlayElement?: Function;
    getMarkSheetContainerProperties?: Function;
    annotationData?: annotation;
    isActive?: boolean;
    isFade?: boolean;
    borderRemovedOn?: number;
    imageZones?: ImageZone[];
    getImageContainerRect?: Function;
    clientToken?: string;
    stampData?: stampData;
    isDrawMode?: boolean;
    setCurrentAnnotationElement?: Function;
    imageClusterId?: number;
    outputPageNo: number;
    pageNo: number;
    toolTip: string;
    setDynamicAnnotationisMoving?: Function;
    setDynamicAnnotationBorder?: Function;
    displayAngle?: number;
    drawDirection?: enums.DrawDirection;
    isDrawEnd?: boolean;
    isStamping?: boolean;
    isVisible?: boolean;
    isResponseEditable?: boolean;
    enableAnnotationOverlayPan?: Function;
    enableImageContainerScroll?: Function;
    isInFullResponseView: boolean;
    overlayBoundary?: Array<AnnotationBoundary>;
    doEnableClickHandler: Function;
    zoneHeight?: number;
    zoneTop: number;
    zoneLeft: number;
    topAboveCurrentZone: number;
    doApplyLinkingScenarios: boolean;
    isInLinkedPage: boolean;
    imageZone: ImageZone;
    currentImagePageNo: number;
    pagesLinkedByPreviousMarkers: number[];
    isAnnotationAdded: boolean;
    isEBookMarking: boolean;
}

/**
 * React component class for Dynamic Stamp.
 */
class DynamicStampFactory extends pureRenderComponent<DynamicFactoryProps, any> {
    /**
     * @constructor
     */
    constructor(props: DynamicFactoryProps, state: any) {
        super(props, state);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        switch (this.props.annotationData.stamp) {
            case enums.DynamicAnnotation.Highlighter:
                return (
                    <Highlighter
                        id = {'highlighter_' + this.props.annotationData.clientToken }
                        key = {'highlighter_' + this.props.annotationData.clientToken}
                        toolTip = {this.props.toolTip}
                        annotationData = {this.props.annotationData}
                        stampData = {this.props.stampData}
                        imageWidth = {this.props.imageWidth}
                        imageHeight = {this.props.imageHeight}
                        isActive={this.props.isActive}
                        isFade={this.props.isFade}
                        clientToken = { this.props.clientToken }
                        imageZones = {this.props.imageZones == null ? [] : this.props.imageZones}
                        getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                        getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                        getImageContainerRect = {this.props.getImageContainerRect ? this.props.getImageContainerRect : null }
                        isDrawMode = {this.props.isDrawMode}
                        setCurrentAnnotationElement = {this.props.setCurrentAnnotationElement}
                        imageClusterId = {this.props.imageClusterId}
                        outputPageNo = { this.props.outputPageNo }
                        pageNo = { this.props.pageNo }
                        setDynamicAnnotationisMoving ={this.props.setDynamicAnnotationisMoving}
                        setDynamicAnnotationBorder={this.props.setDynamicAnnotationBorder}
                        displayAngle  = {this.props.displayAngle}
                        drawDirection={this.props.drawDirection}
                        isDrawEnd={this.props.isDrawEnd}
                        isStamping={this.props.isStamping}
                        isVisible = {this.props.isVisible}
                        isResponseEditable = {this.props.isResponseEditable}
                        enableAnnotationOverlayPan ={this.props.enableAnnotationOverlayPan}
                        enableImageContainerScroll = {this.props.enableImageContainerScroll}
                        isInFullResponseView = {this.props.isInFullResponseView}
                        overlayBoundary = {this.props.overlayBoundary}
                        doEnableClickHandler={this.props.doEnableClickHandler}
                        zoneHeight={this.props.zoneHeight}
                        zoneTop={this.props.zoneTop}
                        zoneLeft={this.props.zoneLeft}
                        topAboveCurrentZone={this.props.topAboveCurrentZone}
                        doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                        isInLinkedPage={this.props.isInLinkedPage}
                        imageZone={this.props.imageZone}
                        currentImagePageNo={this.props.currentImagePageNo}
                        pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                        isAnnotationAdded = {this.props.isAnnotationAdded}
                        isEBookMarking={this.props.isEBookMarking}>
                    </Highlighter>
                );
            case enums.DynamicAnnotation.HorizontalLine:
                return (
                    <HorizontalLine
                        id = {'hl_' + this.props.annotationData.clientToken }
                        key = {'hl_' + this.props.annotationData.annotationId}
                        toolTip = {this.props.toolTip}
                        annotationData={this.props.annotationData}
                        stampData = {this.props.stampData}
                        imageWidth={this.props.imageWidth}
                        imageHeight={this.props.imageHeight}
                        isActive={this.props.isActive}
                        isFade={this.props.isFade}
                        clientToken = { this.props.clientToken }
                        imageZones = {this.props.imageZones == null ? [] : this.props.imageZones}
                        getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                        getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                        getImageContainerRect = {this.props.getImageContainerRect ? this.props.getImageContainerRect : null }
                        isDrawMode = {this.props.isDrawMode}
                        setCurrentAnnotationElement = {this.props.setCurrentAnnotationElement}
                        imageClusterId = {this.props.imageClusterId}
                        outputPageNo = { this.props.outputPageNo }
                        pageNo = { this.props.pageNo }
                        setDynamicAnnotationisMoving ={this.props.setDynamicAnnotationisMoving}
                        setDynamicAnnotationBorder={this.props.setDynamicAnnotationBorder}
                        displayAngle  = {this.props.displayAngle}
                        drawDirection={this.props.drawDirection}
                        isDrawEnd={this.props.isDrawEnd}
                        isStamping={this.props.isStamping}
                        isVisible = {this.props.isVisible}
                        isResponseEditable = {this.props.isResponseEditable}
                        enableAnnotationOverlayPan ={this.props.enableAnnotationOverlayPan}
                        enableImageContainerScroll = {this.props.enableImageContainerScroll}
                        overlayBoundary = {this.props.overlayBoundary}
                        doEnableClickHandler={this.props.doEnableClickHandler}
                        zoneHeight={this.props.zoneHeight}
                        zoneTop={this.props.zoneTop}
                        zoneLeft={this.props.zoneLeft}
                        topAboveCurrentZone={this.props.topAboveCurrentZone}
                        doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                        isInLinkedPage={this.props.isInLinkedPage}
                        imageZone={this.props.imageZone}
                        currentImagePageNo={this.props.currentImagePageNo}
                        isInFullResponseView={this.props.isInFullResponseView}
                        pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                        isAnnotationAdded={this.props.isAnnotationAdded}
                        isEBookMarking={this.props.isEBookMarking}>
                    </HorizontalLine>
                );

            case enums.DynamicAnnotation.Ellipse:
                return (
                    <Ellipse
                        id = {'ellipse_' + this.props.annotationData.clientToken }
                        key = {'ellipse__' + this.props.annotationData.annotationId }
                        toolTip = {this.props.toolTip}
                        annotationData={this.props.annotationData}
                        stampData = {this.props.stampData}
                        imageWidth={this.props.imageWidth}
                        imageHeight={this.props.imageHeight}
                        isActive={this.props.isActive}
                        isFade={this.props.isFade}
                        clientToken = { this.props.clientToken }
                        imageZones = {this.props.imageZones == null ? [] : this.props.imageZones}
                        getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                        getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                        getImageContainerRect = {this.props.getImageContainerRect ? this.props.getImageContainerRect : null }
                        isDrawMode = {this.props.isDrawMode}
                        setCurrentAnnotationElement = {this.props.setCurrentAnnotationElement}
                        imageClusterId = {this.props.imageClusterId}
                        outputPageNo = { this.props.outputPageNo }
                        pageNo = { this.props.pageNo }
                        setDynamicAnnotationisMoving ={this.props.setDynamicAnnotationisMoving}
                        setDynamicAnnotationBorder={this.props.setDynamicAnnotationBorder}
                        displayAngle  = {this.props.displayAngle}
                        drawDirection={this.props.drawDirection}
                        isDrawEnd={this.props.isDrawEnd}
                        isStamping={this.props.isStamping}
                        isVisible = {this.props.isVisible}
                        isResponseEditable = {this.props.isResponseEditable}
                        enableAnnotationOverlayPan ={this.props.enableAnnotationOverlayPan}
                        enableImageContainerScroll = {this.props.enableImageContainerScroll}
                        isInFullResponseView = {this.props.isInFullResponseView}
                        overlayBoundary = {this.props.overlayBoundary}
                        doEnableClickHandler={this.props.doEnableClickHandler}
                        zoneHeight={this.props.zoneHeight}
                        zoneTop={this.props.zoneTop}
                        zoneLeft={this.props.zoneLeft}
                        topAboveCurrentZone={this.props.topAboveCurrentZone}
                        doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                        isInLinkedPage={this.props.isInLinkedPage}
                        imageZone={this.props.imageZone}
                        currentImagePageNo={this.props.currentImagePageNo}
                        pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                        isAnnotationAdded={this.props.isAnnotationAdded}
                        isEBookMarking={this.props.isEBookMarking}>
                    </Ellipse>
                );
            case enums.DynamicAnnotation.HWavyLine:
                return (
                    <HWavyLine
                        id = {'hwavy_' + this.props.annotationData.clientToken }
                        key = {'hwavy_' + this.props.annotationData.annotationId}
                        toolTip = {this.props.toolTip}
                        annotationData = {this.props.annotationData}
                        stampData = {this.props.stampData}
                        imageWidth = {this.props.imageWidth}
                        imageHeight = {this.props.imageHeight}
                        isActive={this.props.isActive}
                        isFade={this.props.isFade}
                        clientToken = { this.props.clientToken }
                        imageZones = {this.props.imageZones == null ? [] : this.props.imageZones}
                        getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                        getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                        getImageContainerRect = {this.props.getImageContainerRect ? this.props.getImageContainerRect : null }
                        isDrawMode = {this.props.isDrawMode}
                        setCurrentAnnotationElement = {this.props.setCurrentAnnotationElement}
                        imageClusterId = {this.props.imageClusterId}
                        outputPageNo = { this.props.outputPageNo }
                        pageNo = { this.props.pageNo }
                        setDynamicAnnotationisMoving ={this.props.setDynamicAnnotationisMoving}
                        setDynamicAnnotationBorder={this.props.setDynamicAnnotationBorder}
                        displayAngle  = {this.props.displayAngle}
                        drawDirection={this.props.drawDirection}
                        isDrawEnd={this.props.isDrawEnd}
                        isStamping={this.props.isStamping}
                        isVisible = {this.props.isVisible}
                        isResponseEditable = {this.props.isResponseEditable}
                        enableAnnotationOverlayPan ={this.props.enableAnnotationOverlayPan}
                        enableImageContainerScroll = {this.props.enableImageContainerScroll}
                        overlayBoundary = {this.props.overlayBoundary}
                        doEnableClickHandler={this.props.doEnableClickHandler}
                        zoneHeight={this.props.zoneHeight}
                        zoneTop={this.props.zoneTop}
                        zoneLeft={this.props.zoneLeft}
                        topAboveCurrentZone={this.props.topAboveCurrentZone}
                        doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                        isInLinkedPage={this.props.isInLinkedPage}
                        imageZone={this.props.imageZone}
                        currentImagePageNo={this.props.currentImagePageNo}
                        isInFullResponseView={this.props.isInFullResponseView}
                        pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                        isAnnotationAdded={this.props.isAnnotationAdded}
                        isEBookMarking={this.props.isEBookMarking}>
                    </HWavyLine>
                );
            case enums.DynamicAnnotation.VWavyLine:
                return (
                    <VWavyLine
                        id = {'vwavy_' + this.props.annotationData.clientToken }
                        key = {'vwavy_' + this.props.annotationData.annotationId}
                        toolTip = {this.props.toolTip}
                        annotationData = {this.props.annotationData}
                        stampData = {this.props.stampData}
                        imageWidth = {this.props.imageWidth}
                        imageHeight = {this.props.imageHeight}
                        isActive={this.props.isActive}
                        isFade={this.props.isFade}
                        clientToken = { this.props.clientToken }
                        imageZones = {this.props.imageZones == null ? [] : this.props.imageZones}
                        getAnnotationOverlayElement={this.props.getAnnotationOverlayElement}
                        getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                        getImageContainerRect = {this.props.getImageContainerRect ? this.props.getImageContainerRect : null }
                        isDrawMode = {this.props.isDrawMode}
                        setCurrentAnnotationElement = {this.props.setCurrentAnnotationElement}
                        imageClusterId = {this.props.imageClusterId}
                        outputPageNo = { this.props.outputPageNo }
                        pageNo = { this.props.pageNo }
                        setDynamicAnnotationisMoving ={this.props.setDynamicAnnotationisMoving}
                        setDynamicAnnotationBorder={this.props.setDynamicAnnotationBorder}
                        displayAngle  = {this.props.displayAngle}
                        drawDirection={this.props.drawDirection}
                        isDrawEnd={this.props.isDrawEnd}
                        isStamping={this.props.isStamping}
                        isVisible = {this.props.isVisible}
                        isResponseEditable = {this.props.isResponseEditable}
                        enableAnnotationOverlayPan ={this.props.enableAnnotationOverlayPan}
                        enableImageContainerScroll = {this.props.enableImageContainerScroll}
                        isInFullResponseView = {this.props.isInFullResponseView}
                        overlayBoundary = {this.props.overlayBoundary}
                        doEnableClickHandler={this.props.doEnableClickHandler}
                        zoneHeight={this.props.zoneHeight}
                        zoneTop={this.props.zoneTop}
                        zoneLeft={this.props.zoneLeft}
                        topAboveCurrentZone={this.props.topAboveCurrentZone}
                        doApplyLinkingScenarios={this.props.doApplyLinkingScenarios}
                        isInLinkedPage={this.props.isInLinkedPage}
                        imageZone={this.props.imageZone}
                        currentImagePageNo={this.props.currentImagePageNo}
                        pagesLinkedByPreviousMarkers={this.props.pagesLinkedByPreviousMarkers}
                        isAnnotationAdded={this.props.isAnnotationAdded}
                        isEBookMarking={this.props.isEBookMarking}>
                    </VWavyLine>
                );
            default:
                return (null);

        }
    }
}

export = DynamicStampFactory;
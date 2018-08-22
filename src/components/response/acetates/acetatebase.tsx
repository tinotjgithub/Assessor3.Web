import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../../utility/enums');
import pureRenderComponent = require('../../base/purerendercomponent');
import responseStore = require('../../../stores/response/responsestore');
import overlayHelper = require('../../utility/overlay/overlayhelper');
import messageStore = require('../../../stores/message/messagestore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import qigStore = require('../../../stores/qigselector/qigstore');

/**
 * React component class for acetate base.
 */
abstract class AcetateBase extends pureRenderComponent<any, any> {

    private overlayBoundary: Array<AnnotationBoundary> = [];

    protected SCRIPT_RESOLUTION: number = 200;
    protected zIndex: number = 0;
    protected isLabelInsideScript: boolean = true;

    /**
     * get label text for acetates
     * @param acetatePoints
     */
    protected abstract getLabelText(acetatePoints: AcetatePoint[]): string;

    /**
     * get label position for acetates
     * @param acetatePoints
     */
    protected abstract getLabelPosition(acetatePoints: AcetatePoint[], isLabelInsideScript: boolean): any;

    /**
     * get zIndex for acetates
     * @param imageProps
     */
    protected abstract getZIndex(imageProps: any): number;

    /**
     * return class name for acetate
     * @param toolType
     */
    protected getClassName(toolType: enums.ToolType) {
        let className = 'overlay-wrap ';
        switch (toolType) {
            case enums.ToolType.ruler:
                className += 'ruler ';
                break;
            case enums.ToolType.multiline:
                className += 'multiline ';
                break;
            case enums.ToolType.protractor:
                className += 'protractor ';
                break;
        }
        if (this.state.isHovering) {
            className += 'hover';
        }
        return className;
    }

    /**
     * mouse over handler
     */
    protected onMouseOver = (event: any) => {
        if (!this.state.isHovering &&
            !messageStore.instance.isMessagePanelVisible &&
            !exceptionStore.instance.isExceptionPanelVisible) {
            // donot set isHovering when message/exception panel is open
            this.setState({ isHovering: true });
        }
    };

    /**
     * mouse leave handler
     */
    protected onMouseLeave = (event: any) => {
        if (this.state.isHovering) {
            this.setState({ isHovering: false });
        }
    };

    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    public findPercentage(numerator: number, denominator: number) {
        return overlayHelper.findPercentage(numerator, denominator);
    }

    /**
     * get points adjusted for image linkning scenario
     * @param p
     */
    protected getAdjustedPoints(p: AcetatePoint, acetateData: AcetateData) {
        let adjustedPoints = { p: { x: 0, y: 0 } };
        if (this.props.doApplyLinkingScenarios) {
            let linkProps = this.props.linkingScenarioProps;
            // in linked page, linked page will be act as a seperate output page. so we will
            // calculating x,y position w.r.t output page
            if (this.props.imageProps.isALinkedPage && acetateData.wholePageNumber > 0) {
                adjustedPoints = {
                    p: { x: p.x, y: p.y }
                };
            } else if (this.props.imageProps.isALinkedPage && acetateData.outputPageNumber > 0) {
                // acetate from skipped zone. in this scenario we need to add the current zone top and height of
                // zones above current skipped zone. these values will be populated when acetates is filtered in overlayholder
                if (this.props.acetateDetails.imageLinkingData) {
                    let linkData = this.props.acetateDetails.imageLinkingData;
                    adjustedPoints = {
                        p: { x: p.x + linkData.skippedZoneLeft, y: Math.abs((p.y - linkData.topAboveZone) + linkData.skippedZoneTop) }
                    };
                } else {
                    // topAboveCurrentZone will be the height of zones above the current zone which made up the current output page
                    // zoneLeft will be left value of the current zone. zoneTop is the top edge from which the current zone is made
                    // we need to substract topAboveCurrentZone from y value as y value in zone will be w.r.t output page before linking.
                    adjustedPoints = {
                        p: { x: p.x + linkProps.zoneLeft, y: Math.abs((p.y - linkProps.topAboveCurrentZone) + linkProps.zoneTop) }
                    };
                }
            } else {
                adjustedPoints = {
                    p: { x: p.x, y: Math.abs(p.y - linkProps.topAboveCurrentZone) }
                };
            }
        } else {
            adjustedPoints = {
                p: { x: p.x, y: p.y }
            };
        }

        return adjustedPoints;
    }

    /**
     * Calculates the stitched image gap offset
     * @param y1
     */
    protected findStitchedImageGapOffset(y1: number): number {
        let stitchedImageSeperator: number = 0;
        let annotationOverlayParentElement = this.props.getAnnotationOverlayElement ?
            this.props.getAnnotationOverlayElement : undefined;
        return overlayHelper.findStitchedImageGapOffset(y1, this.rotatedAngle, annotationOverlayParentElement);
    }

    /**
     *  Sets SVG view box
     * @param x
     * @param y
     * @param width
     * @param height
     */
    protected setSVGViewBox(x: number, y: number, width: number, height: number): string {
        return [x, y, width, height].join(' ');
    }

    /**
     * return point for acetate
     * @param x
     * @param y
     * @param pointName
     */
    protected renderAcetatePoint(x: number, y: number, pointName: string): JSX.Element {
        return (<svg x={x.toString() + '%'} y={y.toString() + '%'} id={pointName} key={pointName}
            className={'overlay-plus-svg ' + pointName}>
            <use transform='translate(-6,-6)'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                xlinkHref='#overlay-point' className='overlay-plus-normal'
                width='12' height='12'></use>
            <use transform='translate(-6,-6)'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                xlinkHref='#overlay-point-hover' className='overlay-plus-hover'
                width='30' height='30'></use>
            <rect className='overlay-mover-area'
                width='30' height='30'
                transform='translate(-15,-15)'></rect>
            <circle cx='0' cy='0' r='4' stroke='black'
                strokeWidth='1' fill='white'
                className='overlay-circle-point'></circle>
        </svg>);
    }

    /**
     * return image dimension
     */
    protected getImageDimension() {
        return overlayHelper.getImageDimension(this.props.imageProps);
    }

    /**
     * return line for acetate
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param className
     */
    protected renderAcetateLine(x1: number, y1: number, x2: number, y2: number, className: string): JSX.Element {
        return (<line x1={x1.toString() + '%'} x2={x2.toString() + '%'}
            y1={y1.toString() + '%'} y2={y2.toString() + '%'} className={className} />);
    }

    /**
     * get color for acetate
     * @param color
     */
    protected getAcetateColor(color: number) {
        let colorClass = '';
        switch (color) {
            case enums.OverlayColor.red:
                colorClass = 'red-overlay';
                break;
            case enums.OverlayColor.black:
                colorClass = 'black-overlay';
                break;
            case enums.OverlayColor.blue:
                colorClass = 'blue-overlay';
                break;
            case enums.OverlayColor.green:
                colorClass = 'green-overlay';
                break;
            case enums.OverlayColor.pink:
                colorClass = 'pink-overlay';
                break;
            case enums.OverlayColor.yellow:
                colorClass = 'yellow-overlay';
                break;
        }
        return colorClass;
    }

    /* return current zoom percentage */
    protected get currentZoomPercentage(): number {
        return responseStore.instance.currentZoomPercentage;
    }

    /**
     * render ruler
     * @param stateAdjuster
     */
    protected reRender(stateAdjuster: number = 0) {
        this.setState({
            renderedOn: Date.now() + stateAdjuster
        });
    }

    /* return rotated angle for current page */
    protected get rotatedAngle(): number {
        return overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
    }

    /* return true if acetate is moving */
    protected get isAcetateMoving(): boolean {
        return qigStore.instance.isAcetateMoving;
    }
}

export = AcetateBase;
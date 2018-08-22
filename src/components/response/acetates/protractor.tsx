import React = require('react');
import ReactDom = require('react-dom');
import AcetateBase = require('./acetatebase');
import enums = require('../../utility/enums');
import constants = require('../../utility/constants');
import markingStore = require('../../../stores/marking/markingstore');
import overlayHelper = require('../../utility/overlay/overlayhelper');

/* props for protractor */
interface Props {
    acetateDetails: Acetate;
    imageProps: any;
    getAnnotationOverlayElement?: Function;
    linkingScenarioProps: any;
    doApplyLinkingScenarios: boolean;
    zoomUpdated?: number;
    getoverlayHolderElement?: Function;
}

/* state for protractor */
interface State {
    isHovering?: boolean;
    renderedOn?: number;
}

/**
 * React component class for protractor.
 */
class Protractor extends AcetateBase {

    private overlayHolderElement: Element;
    private _imageDimension;
    private _acetateData: AcetateData;

    /**
     * constructor for protractor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isHovering: false
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }

    /**
     * The component will mount for protractor
     */
    public componentWillMount() {
        this._imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    }

    /**
     * component will receive props for protractor
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this.overlayHolderElement = this.props.getoverlayHolderElement();
        this._acetateData = nxtProps.acetateDetails.acetateData;
    }

    /**
     * component did mount for protractor
     */
    public componentDidMount() {
        this.overlayHolderElement = this.props.getoverlayHolderElement();
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    }

    /**
     * component will unmount for protractor
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    }

    /**
     * Render method
     */
    public render() {
        let protractorPoints = this._acetateData.acetateLines[0].points;
        let p1: AcetatePoint = protractorPoints[0];
        let p2: AcetatePoint = protractorPoints[1];
        let p3: AcetatePoint = protractorPoints[2];
        p1 = this.getAdjustedPoints(p1, this._acetateData).p;
        p2 = this.getAdjustedPoints(p2, this._acetateData).p;
        p3 = this.getAdjustedPoints(p3, this._acetateData).p;
        this._imageDimension = this.getImageDimension();
        let x1 = this.findPercentage(p1.x, this._imageDimension.imageWidth);
        let x2 = this.findPercentage(p2.x, this._imageDimension.imageWidth);
        let x3 = this.findPercentage(p3.x, this._imageDimension.imageWidth);
        let y1 = this.findPercentage(p1.y, this._imageDimension.imageHeight);
        let y2 = this.findPercentage(p2.y, this._imageDimension.imageHeight);
		let y3 = this.findPercentage(p3.y, this._imageDimension.imageHeight);

		// find stiched image gap and adjust y coordinates
		let stitchedImageGapOffset1 = this.findStitchedImageGapOffset(y1);
		let stitchedImageGapOffset2 = this.findStitchedImageGapOffset(y2);
		let stitchedImageGapOffset3 = this.findStitchedImageGapOffset(y3);
		y1 += stitchedImageGapOffset1;
		y2 += stitchedImageGapOffset2;
		y3 += stitchedImageGapOffset3;
        let viewBox = this.setSVGViewBox(0, 0, this._imageDimension.imageWidth, this._imageDimension.imageHeight);
        let labelPosition = this.getLabelPosition([p1, p2, p3]);
        // set styles for protractor wrapper
        let protractorStyle: React.CSSProperties = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        let labelStyle: React.CSSProperties = {};
        if (labelPosition) {
			labelStyle = {
				left: labelPosition.x + '%',
				top: labelPosition.y + stitchedImageGapOffset2 + '%'
			};
        }
        return (<div id={'protractor_' + this.props.acetateDetails.clientToken}
            key={'protractor_' + this.props.acetateDetails.clientToken}
            data-client-token={this.props.acetateDetails.clientToken}
            className={this.getClassName(enums.ToolType.protractor)}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave} style={protractorStyle} data-tool-type={'protractor'}>
            <div style={labelStyle} className='overlay-text bolder'>{this.getLabelText([p1, p2, p3])}</div>
            <svg className='overlay-svg' xmlns={constants.SVG_XMLNS}
                version={constants.SVG_VERSION}
                xmlnsXlink={constants.SVG_XMLNS_XLINK} height='100%'>
                <g className='overlay-wrap-group' transform='translate(0,0)'>
                    <svg viewBox={viewBox} x='0' y='0' width='100%' height='100%'
                        preserveAspectRatio='none' className='overlay-element-svg'>
                        <g className='red-overlay'>
                            {this.renderAcetateLine(x1, y1, x2, y2, 'overlay-element protractor-line l1')}
                            {this.renderAcetateLine(x3, y3, x2, y2, 'overlay-element protractor-line l2')}
                        </g>
                    </svg>
                    <g className='overlay-hit-area'>
                        <svg xmlns={constants.SVG_XMLNS} version={constants.SVG_VERSION}
                            viewBox={viewBox} x='0' y='0' width='100%' height='100%'
                            preserveAspectRatio='none' className='overlay-hit-element-svg'>
                            {this.renderAcetateLine(x1, y1, x2, y2, 'overlay-hit-area-line l1')}
                            {this.renderAcetateLine(x3, y3, x2, y2, 'overlay-hit-area-line l2')}
                        </svg>
                        {this.renderAcetatePoint(x1, y1, 'p1')}
                        {this.renderAcetatePoint(x2, y2, 'p2')}
                        {this.renderAcetatePoint(x3, y3, 'p3')}
                    </g>
                </g>
            </svg>
        </div>);
    }

    /**
     * return lable text
     * @param points
     */
    protected getLabelText(points: AcetatePoint[]): string {
        let angle = this.getAngle(points[0], points[1], points[2]);
        let angleText = angle > 180 ? 360 - angle : angle;
        return Math.round(angleText).toString() + '°';
    }

    /**
     * return angle
     * @param p1
     * @param p2
     * @param p3
     */
    private getAngle(p1: AcetatePoint, p2: AcetatePoint, p3: AcetatePoint): number {
        let radian = Math.atan2(p1.y - p2.y, p1.x - p2.x) - Math.atan2(p3.y - p2.y, p3.x - p2.x);
        let angle = (360 - radian * 180 / Math.PI) % 360;
        return angle;
    }

    /**
     * return label position
     * @param points
     */
    protected getLabelPosition(points: AcetatePoint[]) {
        let p1 = points[0];
        let p2 = points[1];
        let p3 = points[2];
        let x = 0;
        let y = 0;
        let overlayHolderElement = this.props.getoverlayHolderElement();
        if (overlayHolderElement) {
            let txPx = 0;
            let tyPx = 0;
            // Angle label distance from the point. (Considered based on the zoom value.)
            var angleTextDistance = 20 + (10 * this.currentZoomPercentage / 100);
            let x1 = this.findPercentage(p1.x, this._imageDimension.imageWidth);
            let x2 = this.findPercentage(p2.x, this._imageDimension.imageWidth);
            let x3 = this.findPercentage(p3.x, this._imageDimension.imageWidth);
            let y1 = this.findPercentage(p1.y, this._imageDimension.imageHeight);
            let y2 = this.findPercentage(p2.y, this._imageDimension.imageHeight);
            let y3 = this.findPercentage(p3.y, this._imageDimension.imageHeight);
            let angle = this.getAngle(p1, p2, p3);
            let angleL2 = Math.atan2((y3 - y2) * overlayHolderElement.clientHeight / 100, (x3 - x2)
                * overlayHolderElement.clientWidth / 100) % Math.PI;

            // the angle in second line is returning zero when it is expecting 180, so re-assign 180(ie, PI in radius)
            if (angleL2 === 0) {
                angleL2 = Math.PI;
            }

            let angleMiddle = angleL2 - ((angle / 2) * Math.PI / 180);
            if (angle > 270) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle);
            } else if (angle > 180) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle - Math.PI);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle - Math.PI);
            } else if (angle > 90) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle);
            } else {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle - Math.PI);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle - Math.PI);
            }

            x = 100 * txPx / overlayHolderElement.clientWidth;
            y = 100 * tyPx / overlayHolderElement.clientHeight;
        }

        return { x: x, y: y };
    }

    /**
     * get zIndex for protractor
     * @param imageProps
     */
    protected getZIndex(imageProps: any): number {
        let imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the protractor overlay having the second priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 2);
    }

    /* fired on acetate position updated action */
    private onAcetatePositionUpdated = (acetate: Acetate, acetateAction: enums.AcetateAction): void => {
        if (acetate && this.props.acetateDetails.clientToken === acetate.clientToken) {
            this._acetateData = acetate.acetateData;
            let stateAdjuster = acetateAction === enums.AcetateAction.none ? 10 : 0;
            this.reRender(stateAdjuster);
        }
    }
}

export = Protractor;
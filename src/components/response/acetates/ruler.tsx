import React = require('react');
import ReactDom = require('react-dom');
import AcetateBase = require('./acetatebase');
import enums = require('../../utility/enums');
import constants = require('../../utility/constants');
import markingStore = require('../../../stores/marking/markingstore');
import overlayHelper = require('../../utility/overlay/overlayhelper');
const X_OFFSET: number = 30;
const Y_OFFSET: number = 15;

/* props for ruler */
interface Props {
    acetateDetails: Acetate;
    imageProps: any;
    getAnnotationOverlayElement?: Element;
    linkingScenarioProps: any;
    doApplyLinkingScenarios: boolean;
    zoomUpdated: number;
    doUpdate: boolean;
    isStitchedImage: boolean;
}

/* state for ruler */
interface State {
    isHovering?: boolean;
    renderedOn?: number;
}

/**
 * React component class for ruler.
 */
class Ruler extends AcetateBase {

    private imageDimension = { imageWidth: 0, imageHeight: 0 };
    private _acetateData: AcetateData;
    private _overlayBoundary: Array<AnnotationBoundary>;
    private _renderCount: number = 0;

    /**
     * constructor for ruler
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isHovering: false,
            renderedOn: 0
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }

    /**
     * The component will mount for ruler
     */
    public componentWillMount() {
        this.imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    }

    /**
     * component will receive props for ruler
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this._renderCount = 0;
        this._acetateData = nxtProps.acetateDetails.acetateData;
    }

    /**
     * component did mount for ruler
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
            this.checkLabelPosition();
    }

    /**
     * component will unmount for ruler
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    }

    /**
     * component did update for ruler
     */
    public componentDidUpdate() {
        // Defect 66736 fix - limit the rendering for adjusting label position to 5 
        // (out of that 2 renders are for mouse over and mouse leve), to avoid cyclic- render in a small zoom level. 
        // And reset this value on componentWillReceiveProps for handling any other update
        if (this._renderCount < 5) {
            this.checkLabelPosition();
        }
    }

    /**
     * Render method
     */
    public render() {
        this._overlayBoundary =
            overlayHelper.getStitchedImageBoundary(this.props.getAnnotationOverlayElement, this.rotatedAngle);
        let rulerPoints = this._acetateData.acetateLines[0].points;
        let p1: AcetatePoint = rulerPoints[0];
        let p2: AcetatePoint = rulerPoints[1];
        let point1 = this.getAdjustedPoints(p1, this._acetateData).p;
        let point2 = this.getAdjustedPoints(p2, this._acetateData).p;
        let x1 = this.findPercentage(point1.x, this.imageDimension.imageWidth);
        let x2 = this.findPercentage(point2.x, this.imageDimension.imageWidth);
        let y1 = this.findPercentage(point1.y, this.imageDimension.imageHeight);
        let y2 = this.findPercentage(point2.y, this.imageDimension.imageHeight);
        let stitchedImageGapOffset1 = this.findStitchedImageGapOffset(y1);
        let stitchedImageGapOffset2 = this.findStitchedImageGapOffset(y2);
        y1 += stitchedImageGapOffset1;
        y2 += stitchedImageGapOffset2;
        point1.y += stitchedImageGapOffset1;
        point2.y += stitchedImageGapOffset2;
        let labelPosition = this.getLabelPosition([point1, point2], this.isLabelInsideScript);
        let viewBox = this.setSVGViewBox(0, 0, this.imageDimension.imageWidth, this.imageDimension.imageHeight);
        // set styles
        let ruleStyle: React.CSSProperties = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        let rulerTextStyle: React.CSSProperties = {
            left: labelPosition.x + '%',
            top: labelPosition.y + stitchedImageGapOffset1 + '%'
        };
        return (<div id={'ruler_' + this.props.acetateDetails.clientToken}
            key={'ruler_' + this.props.acetateDetails.clientToken}
            data-client-token={this.props.acetateDetails.clientToken}
            className={this.getClassName(enums.ToolType.ruler)}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            style={ruleStyle} data-tool-type={'ruler'}>
            <div style={rulerTextStyle} className='overlay-text bolder'>
                {this.getLabelText([point1, point2])}
            </div>
            <svg className='overlay-svg' xmlns={constants.SVG_XMLNS}
                version={constants.SVG_VERSION}
                xmlnsXlink={constants.SVG_XMLNS_XLINK} height='100%'>
                <g className='overlay-wrap-group' transform='translate(0,0)'>
                    <svg viewBox={viewBox} x='0' y='0' width='100%' height='100%'
                        preserveAspectRatio='none' className='overlay-element-svg'>
                        <g className='red-overlay'>
                            {this.renderAcetateLine(x1, y1, x2, y2, 'overlay-element ruler-line')}
                        </g>
                    </svg>
                    <g className='overlay-hit-area'>
                        <svg xmlns={constants.SVG_XMLNS} version={constants.SVG_VERSION}
                            viewBox={viewBox} x='0' y='0' width='100%' height='100%'
                            preserveAspectRatio='none' className='overlay-hit-element-svg'>
                            {this.renderAcetateLine(x1, y1, x2, y2, 'overlay-hit-area-line')}
                        </svg>
                        {this.renderAcetatePoint(x1, y1, 'p1')}
                        {this.renderAcetatePoint(x2, y2, 'p2')}
                    </g>
                </g>
            </svg>
        </div>);
    }

    /**
     * return label text for ruler
     * @param points
     */
    protected getLabelText(points: AcetatePoint[]): string {
        let millimetres = this.getRulerLength(points);
        return Math.round(millimetres).toString() + 'mm';
    }

    /**
     * get ruler length
     * @param points
     */
    private getRulerLength(points: AcetatePoint[]) {
        let p1: AcetatePoint = points[0];
        let p2: AcetatePoint = points[1];
        let dx = p1.x - p2.x;
        let dy = p1.y - p2.y;
        let pixels = Math.sqrt((dx * dx) + (dy * dy));
        let inches = pixels / this.SCRIPT_RESOLUTION;
        let millimetres = inches * 25.4;
        return millimetres;
    }

    /**
     * get angle between two points
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    private getTwoPointDegree(x1: number, y1: number, x2: number, y2: number) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        theta = (theta < 0) ? 360 + theta : theta;
        return theta;
    }

    /**
     * get label position for ruler
     * @param points
     * @param isLabelInsideScript
     */
    protected getLabelPosition(points: AcetatePoint[], isLabelInsideScript: boolean) {
        let p1 = points[0];
        let p2 = points[1];
        let position = { x: 0, y: 0 };
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        // get a point halfway between the points
        let x = p1.x + (dx / 2);
        let y = p1.y + (dy / 2);
        let deltaX = X_OFFSET * (100 / this.currentZoomPercentage);
        let deltaY = Y_OFFSET * (100 / this.currentZoomPercentage);
        [deltaX, deltaY] = this.deltaValuesForRulerLabel(deltaX, deltaY, this.rotatedAngle);
        let rulerLength = this.getRulerLength(points);
        let vectorLength = Math.sqrt((dx * dx) + (dy * dy));
        if (vectorLength > 0) {
            if (!isLabelInsideScript && !isNaN(this.currentZoomPercentage)) {
                x = x + ((dy * (deltaX)) / vectorLength);
                y = y + ((-dx * (deltaY)) / vectorLength);
            } else {
                x = x + ((-dy * (deltaX)) / vectorLength);
                y = y + ((dx * (deltaY)) / vectorLength);
            }
        } else {
            // assume label should be underneath point(s)
            y += deltaY;
        }
        position = {
            x: this.findPercentage(x, this.imageDimension.imageWidth),
            y: this.findPercentage(y, this.imageDimension.imageHeight)
        };

        return position;
    }

    /**
     * get zIndex for ruler
     * @param imageProps
     */
    protected getZIndex(imageProps: any): number {
        let imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the ruler overlay having the first priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 3);
    }

    /* fired on acetate position updated action */
    private onAcetatePositionUpdated = (acetate: Acetate, acetateAction: enums.AcetateAction): void => {
        if (acetate && this.props.acetateDetails.clientToken === acetate.clientToken) {
            this._acetateData = acetate.acetateData;
            let stateAdjuster = acetateAction === enums.AcetateAction.none ? 10 : 0;
            this.reRender(stateAdjuster);
        }
    }

    /**
     * Returns the delta values for the ruler label
     * @param deltaX
     * @param deltaY
     * @param rotatedAngle
     */
    private deltaValuesForRulerLabel(deltaX: number, deltaY: number, rotatedAngle: number): [number, number] {
        let adjustedDeltaX = deltaX;
        let adjustedDeltaY = deltaY;
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                adjustedDeltaX = deltaY;
                adjustedDeltaY = deltaX;
                break;
            case enums.RotateAngle.Rotate_180:
                adjustedDeltaX = -deltaX;
                adjustedDeltaY = -deltaY;
                break;
            case enums.RotateAngle.Rotate_270:
                adjustedDeltaX = -deltaY;
                adjustedDeltaY = -deltaX;
                break;
        }
        return [adjustedDeltaX, adjustedDeltaY];
    }

    /**
     * chcek the position of label
     */
    private checkLabelPosition() {
        let overlayHolder = ReactDom.findDOMNode(this);
        if (overlayHolder && !this.isAcetateMoving) {
            let annotationOverlay = this.props.getAnnotationOverlayElement;
            if (annotationOverlay && !isNaN(this.currentZoomPercentage)) {
                let textElement = overlayHolder.getElementsByClassName('overlay-text')[0];
                let textElementClientRect = textElement.getBoundingClientRect();
                let annotationOverlayClientRect = annotationOverlay.getBoundingClientRect();
                this.isLabelInsideScript = overlayHelper.isAcetateInsideHolder(textElementClientRect,
                    annotationOverlayClientRect);
                if (!this.isLabelInsideScript) {
                    this._renderCount++;
                    this.reRender();
                }
            }
        }
    }
}

export = Ruler;
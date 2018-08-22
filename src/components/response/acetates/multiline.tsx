import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import AcetateBase = require('./acetatebase');
import enums = require('../../utility/enums');
import responseStore = require('../../../stores/response/responsestore');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import overlayHelper = require('../../utility/overlay/overlayhelper');
const SVG_XMLNS = 'http://www.w3.org/2000/svg';
const SVG_VERSION = '1.1';
const SVG_XMLNS_XLINK = 'http://www.w3.org/1999/xlink';
let classNames = require('classnames');
import markingStore = require('../../../stores/marking/markingstore');

/* props for multiline */
interface Props {
    acetateDetails: Acetate;
    imageProps: any;
    getAnnotationOverlayElement?: Element;
    linkingScenarioProps: any;
    doApplyLinkingScenarios: boolean;
}

/* state for multiline */
interface State {
    renderedOn?: number;
    isHovering?: boolean;
}

/**
 * React component class for multiline.
 */
class Multiline extends AcetateBase {

    private imageDimension = { imageWidth: 0, imageHeight: 0 };
    private _acetateData: AcetateData;

    /**
     * constructor for multiline
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0,
            isHovering: false
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }

    /**
     * Render method
     */
    public render() {
        let renderPoints = this.constructPoints();
        let renderPath = this.constructPathWithColor();
        let renderHitAreaPath = renderPath ? renderPath.map((path: any, index: number) => {
            let _id = 'multiLinePathArea_' + index;
            return path ? (<path d={path.path}
                className={classNames('overlay-hit-area-line', { 'hidden': path.lineType === enums.LineType.none })}
                key={_id} id={_id}></path>) : null;
        }) : null;
        let renderElementPath = renderPath ? renderPath.map((path: any, index: number) => {
            let _id = 'multiLinePath_' + index;
            return path ? (<g className={path.color} key={_id + 'g'}>
                <path d={path.path} className={classNames('overlay-element multi-line',
                    { 'hidden': path.lineType === enums.LineType.none })} key={_id} id={_id}>
                </path>
            </g>) : null;
        }) : null;
        let viewBox = this.setSVGViewBox(0, 0, this.imageDimension.imageWidth, this.imageDimension.imageHeight);
        // set styles
        let multilineStyle: React.CSSProperties = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        return (<div id={'multiline_' + this.props.acetateDetails.clientToken}
            key={'multiline' + this.props.acetateDetails.clientToken}
            data-client-token={this.props.acetateDetails.clientToken}
            className={classNames(this.getClassName(enums.ToolType.multiline), {'shared-overlay': this.props.acetateDetails.shared})}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            style={multilineStyle}
            data-tool-type={'multiline'}>
            <svg className='overlay-svg' xmlns={SVG_XMLNS}
                version={SVG_VERSION}
                xmlnsXlink={SVG_XMLNS_XLINK} height='100%'>
                <g className='overlay-wrap-group' transform='translate(0,0)'>
                    <svg viewBox={viewBox} x='0' y='0' width='100%' height='100%' preserveAspectRatio='none'
                        className='overlay-element-svg'>
                        {renderElementPath}
                    </svg>
                    <g className='overlay-hit-area'>
                        <svg viewBox={viewBox} x='0' y='0' width='100%' height='100%' preserveAspectRatio='none'
                            className='overlay-hit-element-svg'>
                            {renderHitAreaPath}
                        </svg>
                        {renderPoints}
                    </g>
                </g>
            </svg>
        </div >);
    }


    /**
     * contructing path along with color details for multiline
     */
    private constructPathWithColor(): Array<any> {
        return this._acetateData.acetateLines.map((acetateLine: AcetateLine, lineIndex: number) => {
            let pathstr = { color: '', path: '', lineType: enums.LineType.none };
            pathstr.color = this.getAcetateColor(acetateLine.colour);
            pathstr.lineType = acetateLine.lineType;

            // points for constructing curve path
            let points = [];
            acetateLine.points.map((acetatePoint: AcetatePoint, pointIndex: number) => {
                let _acetatePoint = this.getAdjustedPoints(acetatePoint, this.props.acetateDetails.acetateData).p;
                let x = _acetatePoint.x;
                let y = _acetatePoint.y;
                let ypointInPercent = this.findPercentage(_acetatePoint.y, this.imageDimension.imageHeight);
                let stitchedImageGapOffset = this.findStitchedImageGapOffset(ypointInPercent);
                let ypointInPixel = ((ypointInPercent + stitchedImageGapOffset) / 100) * this.imageDimension.imageHeight;
                if (stitchedImageGapOffset > 0) {
                    y = ypointInPixel;
                }
                pathstr.path = pathstr.path + (pathstr.path === '' ? 'M' : ' L') + x + ' ' + y;
                points.push(x);
                points.push(y);
            });
            if (acetateLine.lineType === enums.LineType.curve) {

                // changing the path based on linetype
                pathstr.path = this.contructCurvePath(points);
            }
            return pathstr;
        });
    }

    /**
     * contructing points for multiline
     */
    private constructPoints(): Array<any> {
        return this._acetateData.acetateLines.map((acetateLine: AcetateLine, lineIndex: number) => {
            return acetateLine.points.map((acetatePoint: AcetatePoint, pointIndex: number) => {
                let point = this.getAdjustedPoints(acetatePoint, this.props.acetateDetails.acetateData).p;
                let x = this.findPercentage(point.x, this.imageDimension.imageWidth);
                let y = this.findPercentage(point.y, this.imageDimension.imageHeight);
                let stitchedImageGapOffset = this.findStitchedImageGapOffset(y);
                let pointName = 'p_' + lineIndex + '_' + pointIndex;
                return this.renderAcetatePoint(x, y + stitchedImageGapOffset, pointName);
            });
        });
    }

    /**
     * contruct Curve Path (logic reused from WA)
     * @param data
     */
    private contructCurvePath(data): string {
        let k = 1;
        let size = data.length;
        let last = size - 4;
        let path = 'M' + [data[0], data[1]];

        for (var i = 0; i < size - 2; i += 2) {

            let x0 = i ? data[i - 2] : data[0];
            let y0 = i ? data[i - 1] : data[1];
            let x1 = data[i + 0];
            let y1 = data[i + 1];
            let x2 = data[i + 2];
            let y2 = data[i + 3];
            let x3 = i !== last ? data[i + 4] : x2;
            let y3 = i !== last ? data[i + 5] : y2;
            let cp1x = x1 + (x2 - x0) / 6 * k;
            let cp1y = y1 + (y2 - y0) / 6 * k;
            let cp2x = x2 - (x3 - x1) / 6 * k;
            let cp2y = y2 - (y3 - y1) / 6 * k;

            path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2];
        }

        return path;
    }

    /**
     * The component will mount for multiline
     */
    public componentWillMount() {
        this.imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    }

    /**
     * The component will receive props for multiline
     */
    public componentWillReceiveProps(nxtProps: Props): void {
        this._acetateData = nxtProps.acetateDetails.acetateData;
    }

    /**
     * The component did mount for multi line
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);

    }

    /**
     * The component will unmount for multi line
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    }

    /**
     * return null for multiline
     * @param acetatePoints
     */
    protected getLabelText(acetatePoints: AcetatePoint[]): string {
        return null;
    }

    /**
     * return null for multiline
     * @param acetatePoints
     */
    protected getLabelPosition(acetatePoints: AcetatePoint[]) {
        return null;
    }

    /**
     * get zIndex for ruler
     * @param imageProps
     */
    protected getZIndex(imageProps: any): number {
        let imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the multi line overlay having the third priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 1);
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

export = Multiline;
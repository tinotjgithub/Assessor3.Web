import htmlutilities = require('../../../../utility/generic/htmlutilities');
import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import stampStore = require('../../../../stores/stamp/stampstore');
import responseStore = require('../../../../stores/response/responsestore');
import enums = require('../../../utility/enums');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import constants = require('../../../utility/constants');

interface Props extends LocaleSelectionBase, PropsBase {
    lineX1: number;
    lineY1: number;
    lineX2: number;
    lineY2: number;
    rgbColor: string;
    enableCommentsSideView: boolean;
    overlayHeight: number;
    overlayWidth: number;
    clientToken: string;
    selectedZoomPreference?: enums.ZoomPreference;
    marksheetHolderLeft: number;
    annotationLeftPx: number;
    annotationWidth: number;
    renderedOn: number;
    displayAngle: number;
}

interface State {
    renderedOn: number;
}

class CommentLine extends pureRenderComponent<Props, State> {
    private stampX: number;
    private stampY: number;
    private isAnnotationMoving: boolean;
    private isInGreyArea: boolean;
    private isInNoDropArea: boolean = false;
    private isZooming: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.isAnnotationMoving = false;
        this.isInGreyArea = false;
        this.onAnnotationMove = this.onAnnotationMove.bind(this);
        this.reRenderOnResetCursor = this.reRenderOnResetCursor.bind(this);

        this.state = {
            renderedOn: Date.now()
        };
    }

    /** refs */
    public refs: {
        [key: string]: (Element);
        commentLineHolder: (HTMLElement);
    };

    /**
     * Render method
     */
    public render(): JSX.Element {
        let x1 = (this.props.enableCommentsSideView === false ? this.props.lineX1 : 0) + '%';
        let y1 = this.props.lineY1 + '%';
        let lineHolderStyle: React.CSSProperties;
        let [lineLeft1Diff, lineTop1Diff] : [number, number] = [0, 0];
        let markSheetHolderLeftBasedOnRotation: number = this.getMarkSheetHolderLeftBasedOnRotation(this.props.annotationWidth);
        let commentLineHolderLeft: number = this.refs.commentLineHolder ?
        this.refs.commentLineHolder.getBoundingClientRect().left : 0;
        if (!this.props.enableCommentsSideView) {
            lineHolderStyle = null;
        } else {
            [lineLeft1Diff, lineTop1Diff] = this.getLineOffsetBasedOnRotation(this.props.annotationWidth);
            // side view logic for line calculations
            y1 = this.props.lineY1 + lineTop1Diff + '%';
            switch (this.props.selectedZoomPreference) {
                case enums.ZoomPreference.FitWidth:
                    lineHolderStyle = { left: (this.props.lineX1 + lineLeft1Diff) + '%'};
                break;
                case enums.ZoomPreference.FitHeight:
                case enums.ZoomPreference.Percentage:
                case enums.ZoomPreference.MarkschemePercentage:
                lineHolderStyle = {left: (this.props.annotationLeftPx * this.props.overlayWidth) +
                    (markSheetHolderLeftBasedOnRotation -
                    commentLineHolderLeft) + 'px'};
                break;
            }
            // calculations during the move of comment annotation
            if (this.isAnnotationMoving === true) {
                x1 = '0%';
                y1 = this.stampY.toString();
                switch (this.props.selectedZoomPreference) {
                    case enums.ZoomPreference.FitWidth:
                        lineHolderStyle = { left: (this.stampX + lineLeft1Diff) + 'px'};
                    break;
                    case enums.ZoomPreference.FitHeight:
                    case enums.ZoomPreference.Percentage:
                    case enums.ZoomPreference.MarkschemePercentage:
                        lineHolderStyle = {
                            left: (this.stampX + lineLeft1Diff) +
                        (this.props.marksheetHolderLeft -
                        commentLineHolderLeft) + 'px'};
                    break;
                }
                this.isAnnotationMoving = false;
            }

            // hide the line when the comment is dragged to grey area
            if ((this.isInGreyArea === true || this.isZooming === true) && this.props.enableCommentsSideView === true) {
                x1 = this.props.lineX2 + '%';
                y1 = this.props.lineY2.toString();
            }
        }
        return (<div className='comment-line-holder' ref='commentLineHolder'>
            <div className='line-svg-holder' style={lineHolderStyle}>
            <svg className='line-svg'>
                <line className='comment-connector'
                    x1={x1}
                    y1={y1}
                    x2={this.props.lineX2 + '%'}
                    y2={this.props.lineY2 + (this.props.enableCommentsSideView === false ? '%' : '') }
                    mask= {this.props.enableCommentsSideView === true ? '' : 'url(#comment-line-mask)'}>
                </line>
            </svg>
            </div>
        </div>);
    }

    /**
     * This function gets invoked after the component is mounted
     */
    public componentDidMount() {
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, this.onAnnotationMove);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.reRenderOnResetCursor);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, this.onAnnotationMove);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.reRenderOnResetCursor);
    }

    /**
     *  annotation move
     */
    private onAnnotationMove(stampX: number, stampY: number, clientToken: string, isInGreyArea: boolean): void {

        if (this.props.clientToken === clientToken) {

            this.isAnnotationMoving = true;
            this.isInGreyArea = isInGreyArea;

            this.stampX = stampX;
            this.stampY = stampY;

            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * Re render the line on reset annotation
     */
    private reRenderOnResetCursor = (): void => {
        if (this.props.clientToken === stampStore.instance.movingCommentToken) {
            this.isInGreyArea = false;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Gets the line offset to calculate to set the comment line dimensions
     * @param annotationSize size of annotation in pixels
     */
    private getLineOffsetBasedOnRotation(annotationSize: number): [number, number] {
        let lineLeft1Diff: number = 0;
        let lineTop1Diff: number = 0;
        switch (this.props.displayAngle) {
            case 90:
                lineLeft1Diff = 0;
                lineTop1Diff = annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            case 180:
                lineLeft1Diff = 0;
                lineTop1Diff = -1 * annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            case 270:
                //Get the annotation size in percentage. ratio * annotation width in percentage
                lineLeft1Diff = (this.props.overlayHeight / this.props.overlayWidth) * 4 ;
                lineTop1Diff = -1 * annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            default:
                lineLeft1Diff = annotationSize * 100 / (this.props.overlayWidth);
                lineTop1Diff = annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
        }
        return [lineLeft1Diff, lineTop1Diff];
    }

    /**
     * Get the value for marksheetholderLeft to set the comment lines positions
     *
     * @private
     * @param {number} annotationSize
     * @returns {number} marksheetholderLeft
     *
     * @memberof CommentHolder
     */
    private getMarkSheetHolderLeftBasedOnRotation(annotationSize: number): number {
        let _markSheetHolderLeft: number = this.props.marksheetHolderLeft;
        // add the annotation size in case of 0 and 270 rotated case
        switch (this.props.displayAngle) {
            case 0:
                _markSheetHolderLeft = _markSheetHolderLeft + annotationSize;
                break;
            case 270:
                _markSheetHolderLeft = _markSheetHolderLeft + annotationSize;
                break;
        }
        return _markSheetHolderLeft;
    }
}

export = CommentLine;

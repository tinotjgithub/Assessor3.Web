import React = require('react');
import Reactdom = require('react-dom');
import localeStore = require('../../../../stores/locale/localestore');
import DynamicStampBase = require('./dynamicstampbase');
import StampbaseProps = require('../../toolbar/stamppanel/stamptype/typings/stampbaseprops');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
import markingStore = require('../../../../stores/marking/markingstore');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');
import wavyAttributes = require('../../annotations/typings/wavyAttributes');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
interface HWavyState {
    left: number;
    top: number;
    width: number;
    height: number;
    isShowBorder: boolean;
    zIndex: number;
    renderedOn: Date;
}

/**
 * React component class for Highlighter.
 */
class HWavyLine extends DynamicStampBase {
    private _hwavyPatternId: string;

    /**
     * Constructor for Hwavyline
     * @param props
     * @param state
     */
    constructor(props: StampbaseProps, state: HWavyState) {
        super(props, state);
        this.resizeMinVal = { width: 20, height: 20 };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0
        };

        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.initiateRender = this.initiateRender.bind(this);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        window.addEventListener('resize', this.checkThickness);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.checkThicknessOnAnimationCompleted);
        /** Initiated when response view mode is changed to 1page/2page/4page */
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.initiateRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        window.removeEventListener('resize', this.checkThickness);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.initiateRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.checkThicknessOnAnimationCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.destroyHammer();

    }

    /**
     * Component Did Update
     */
    public componentDidUpdate() {
        if (this.isPreviousAnnotation || !this.props.isActive) {
            this.destroyHammer();
        } else {
            this.setUpHammer();
        }
    }

    /**
     * Forcefully rerendering component
     */
    private onChange = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Called once highlighter reset/updated
     */
    private onUpdate = (clientToken: string): void => {
        if (clientToken === this.props.annotationData.clientToken) {
            this.isDrawMode = this.props.isDrawEnd ? false : true;
            this.setInitialDimensions(clientToken, this.props.isDrawEnd, this.props.isStamping);

            if (this.isDrawMode) {
                this.props.setCurrentAnnotationElement(Reactdom.findDOMNode(this));
            } else {
                this.props.setCurrentAnnotationElement(undefined);
            }
        }
    };

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let isPreviousAnnotation = this.isPreviousAnnotation;
        let dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';
        let line1: wavyAttributes = { x1: '0', x2: '0', y1: '0', y2: '0', patternWidth: '0%' };
        let line2: wavyAttributes = { x1: '0', x2: '0', y1: '0', y2: '0', patternWidth: '0%' };

        let styleSpan: React.CSSProperties = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.VWavyLine)
        };

        let svgStyle: React.CSSProperties = {
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            display: this.annotationOutsideResponse || !this.props.isVisible ? 'none' : 'block'
        };

        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;

        let imageWidth: number = 0;
        let patternWidth: number = 0;

        // Get the Classname for annotation.
        let className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        if (this.state.width > 0) {
            imageWidth = (this.state.width / 100) * this.props.imageWidth;
            patternWidth = (this.props.imageWidth / 100) * 0.9;
            let calculatedPatternWidth = annotationHelper.calculatePercentage(patternWidth, imageWidth);
            line1 = {
                x1: '0%', y1: '20%', x2: Number(calculatedPatternWidth) / 2 + '%', y2: '80%',
                patternWidth: String(calculatedPatternWidth) + '%'
            };
            line2 = {
                x1: Number(calculatedPatternWidth) / 2 + '%', y1: '80%', x2: calculatedPatternWidth + '%', y2: '20%',
                patternWidth: String(calculatedPatternWidth) + '%'
            };
        }
        /** Loaded only when response mode is changed to single page/ 2 page/ 4 page  */
        if (this.loadEmpty) {
            return (
                <div id={this.props.id + '_' + className} className={className} style={styleSpan}
                    onContextMenu={!this.props.isActive ? null : this.onContextMenu}
                    onMouseOver={!this.props.isActive ? null : this.onMouseOver}
                    onMouseLeave={!this.props.isActive ? null : this.onMouseLeave}
                    title={this.props.toolTip}
                    data-type='dynamicannotation'
                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id}>
                </div>);
        } else {
            return (
                <div id={this.props.id + '_' + className} className={className} style={styleSpan}
                    onContextMenu={!this.props.isActive ? null : this.onContextMenu}
                    onMouseOver={!this.props.isActive ? null : this.onMouseOver}
                    onMouseLeave={!this.props.isActive ? null : this.onMouseLeave}
                    title={this.props.toolTip}
                    data-type='dynamicannotation' key={this.props.id}
                    data-annotation-relevance={dataAnnotationRelevance}>
                    {this.getLineAnnotationHitArea()}
                    <span className='resizer' id={this.props.id + '_resizer'}
                        data-type='dynamicannotation' key={this.props.id + '_resizer'}
                        data-annotation-relevance={dataAnnotationRelevance}>
                        {this.showBorder()}
                    </span>
                    <svg id={this.getDynamicPatternId}
                        data-annotation-relevance={dataAnnotationRelevance}
                        style={svgStyle} key={this.props.id + '_svgwrapper'}>
                        <pattern id={this.getDynamicPatternId + '_Pattern'} ref='pattern' key={this.props.id + '_pattern'}
                            x='0' y='0' width={line1.patternWidth} height='30' patternUnits='userSpaceOnUse'>
                            <g className='wavy-line' key={this.props.id + '_linewrapper'}>
                                <line x1={line1.x1} y1={line1.y1} x2={line1.x2} y2={line1.y2} key={this.props.id + '_line1'}></line>
                                <line x1={line2.x1} y1={line2.y1} x2={line2.x2} y2={line2.y2} key={this.props.id + '_line2'}></line>
                            </g>
                        </pattern>
                        <rect fill={'url(#' + this.getDynamicPatternId + '_Pattern' + ')'} x='0' y='0' width='100%' height='100%'
                            data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_rect'} />
                    </svg>
                </div>
            );
        }
    }
}

export = HWavyLine;
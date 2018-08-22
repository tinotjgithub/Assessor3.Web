/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
/* tslint:enable:no-unused-variable */
import localeStore = require('../../../../stores/locale/localestore');
import DynamicStampBase = require('./dynamicstampbase');
import StampbaseProps = require('../../toolbar/stamppanel/stamptype/typings/stampbaseprops');
import markingStore = require('../../../../stores/marking/markingstore');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');
import constants = require('../../../utility/constants');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
interface HlineState {
    left: Number;
    top: Number;
    width: Number;
    height: Number;
    isShowBorder: boolean;
    renderedOn: Date;
}
/**
 * React component class for Annotation Panel.
 */
class HorizontalLine extends DynamicStampBase {
    /**
     * @constructor
     */
    constructor(props: any, state: HlineState) {
        super(props, state);
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0
        };
        this.resizeMinVal = { width: 20, height: 5 };

        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.initiateRender = this.initiateRender.bind(this);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        window.addEventListener('resize', this.checkThickness);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.checkThicknessOnAnimationCompleted);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        /** Initiated when response view mode is changed to 1page/2page/4page */
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.initiateRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        window.removeEventListener('resize', this.checkThickness);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT,
            this.checkThicknessOnAnimationCompleted);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT,
            this.initiateRender);
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
     * Render method
     */
    public render(): JSX.Element {
        let isPreviousAnnotation = this.isPreviousAnnotation;
        let dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';

        let styleSpan: React.CSSProperties = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: this.state.width + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.HorizontalLine)
        };

        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;
        // Get the Classname for annotation.
        let className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        /** Loaded only when response mode is changed to single page/ 2 page/ 4 page  */
        if (this.loadEmpty) {
            return (
                <span id={this.props.id + '_' + className} className={className} style={styleSpan}
                    onContextMenu={!this.props.isActive ? null : this.onContextMenu}
                    onMouseOver={!this.props.isActive ? null : this.onMouseOver}
                    onMouseLeave={!this.props.isActive ? null : this.onMouseLeave}
                    title={this.props.toolTip}
                    data-type='dynamicannotation' key={this.props.id}
                    data-annotation-relevance={dataAnnotationRelevance}>
                </span>);
        } else {
            return (
                <span id={this.props.id + '_' + className} className={className} style={styleSpan}
                    title={this.props.toolTip} key={this.props.id}
                    onContextMenu={!this.props.isActive ? null : this.onContextMenu}
                    onMouseOver={!this.props.isActive ? null : this.onMouseOver}
                    onMouseLeave={!this.props.isActive ? null : this.onMouseLeave}
                    data-type='dynamicannotation'
                    data-annotation-relevance={dataAnnotationRelevance}>
                    {this.getLineAnnotationHitArea()}
                    <span className='resizer' id={this.props.id + '_resizer'}
                        data-type='dynamicannotation' key={this.props.id + '_resizer'}
                        data-annotation-relevance={dataAnnotationRelevance}>
                        {this.showBorder()}
                    </span>
                    <svg id={this.props.id} data-type='dynamicannotation' key={this.props.id + '_svgwrapper'}>
                        <line x1='0' y1='50%' x2='100%' y2='50%' data-type='dynamicannotation'
                            data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_line'}>
                        </line>
                    </svg>
                </span>
            );
        }
    }
}

export = HorizontalLine;
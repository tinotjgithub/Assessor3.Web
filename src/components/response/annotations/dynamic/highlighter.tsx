import React = require('react');
import Reactdom = require('react-dom');
import localeStore = require('../../../../stores/locale/localestore');
import DynamicStampBase = require('./dynamicstampbase');
import StampbaseProps = require('../../toolbar/stamppanel/stamptype/typings/stampbaseprops');
import markingStore = require('../../../../stores/marking/markingstore');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');

import toolbarStore = require('../../../../stores/toolbar/toolbarstore');
interface HighlighterState {
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
class Highlighter extends DynamicStampBase {

    /**
     * Constructor fopr highlighter
     * @param props
     * @param state
     */
    constructor(props: any, state: HighlighterState) {
        super(props, state);
        this.resizeMinVal = { width: 20, height: 20 };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0,
            renderedOn: 0
        };

        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.resetOverlayStitchedBoundary();
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
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
        this.resetOverlayStitchedBoundary();
    }

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
     * Called once highlighter color reset/updated
     */
    private onChange = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };


    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {

        let resizePointerStyle: React.CSSProperties = {};

        // Get the Classname for annotation.
        let className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);

        let isPreviousAnnotation = this.isPreviousAnnotation;
        let dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';

        let styleSpan: React.CSSProperties = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            height: Math.max(this.state.height) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse ||
                !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.Highlighter)
        };

        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;

        if (!this.props.isActive) {
            resizePointerStyle.pointerEvents = 'none';
        }

        return (
            <span id={this.props.id + '_' + className} className={className} style={styleSpan}
                onContextMenu={!this.props.isActive && !isPreviousAnnotation ? null : this.onContextMenu}
                onMouseOver={!this.props.isActive && !isPreviousAnnotation ? null : this.onMouseOver}
                onMouseLeave={!this.props.isActive && !isPreviousAnnotation ? null : this.onMouseLeave}
                title={this.props.toolTip} data-type='dynamicannotation'
                data-annotation-relevance={dataAnnotationRelevance} key={this.props.id}>
                <span className='resizer' id={this.props.id + '_resizer'}
                    style={resizePointerStyle} key={this.props.id + '_resizer'}
                    data-annotation-relevance={dataAnnotationRelevance}>
                    {this.showBorder()}
                </span>
                <svg id={this.props.id} style={{ display: 'block' }}
                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_rectwrapper'}>
                    <rect width='100%' height='100%' style={{ color: styleSpan.color }}
                        data-type='dynamicannotation' key={this.props.id + '_rectangle'}
                        data-annotation-relevance={dataAnnotationRelevance}></rect>
                </svg>
            </span>
        );
    }
}

export = Highlighter;
/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
/* tslint:enable:no-unused-variable */
import localeStore = require('../../../../stores/locale/localestore');
import DynamicStampBase = require('./dynamicstampbase');
import StampbaseProps = require('../../toolbar/stamppanel/stamptype/typings/stampbaseprops');
import markingStore = require('../../../../stores/marking/markingstore');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');
import toolbarStore = require('../../../../stores/toolbar/toolbarstore');

interface EllipseState {
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
class Ellipse extends DynamicStampBase {

    /**
     * Constructor for Ellipse
     * @param props
     * @param state
     */
    constructor(props: StampbaseProps, state: EllipseState) {
        super(props, state);
        this.resizeMinVal = { width: 20, height: 20 };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0,
            renderedOn: Date.now()
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
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onColorUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onColorUpdated);
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
    }

    /**
     * Called once highlighter color reset/updated
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
     * Called once highlighter color reset/updated
     */
    private onColorUpdated = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {

        let isPreviousAnnotation = this.isPreviousAnnotation;
        let dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';

        let styleSpan: React.CSSProperties = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            height: Math.max(this.state.height) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.Ellipse)
        };
        let styleG: React.CSSProperties = {};

        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;

        if (this.props.isInFullResponseView) {
            styleG.pointerEvents = 'none';
        }

        let resizePointerStyle: React.CSSProperties = {};

        if (!this.props.isActive) {
            resizePointerStyle.pointerEvents = 'none';
        }

        // Get the Classname for annotation.
        let className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);

        return (
            <span id={this.props.id + '_' + className} className={className} style={styleSpan}
                title={this.props.toolTip}
                onContextMenu={!this.props.isActive ? null : this.onContextMenu}
                onMouseOver={!this.props.isActive ? null : this.onMouseOver}
                onMouseLeave={!this.props.isActive ? null : this.onMouseLeave}
                data-annotation-relevance={dataAnnotationRelevance}
                data-type='dynamicannotation' key={this.props.id}>
                <span className='resizer' id={this.props.id + '_resizer' + this.remarkIdPostText}
                    data-type='dynamicannotation'
                    style={resizePointerStyle}
                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_resizer'}>
                    {this.showBorder()}
                </span>
                <svg id={this.props.id + this.remarkIdPostText}
                    data-type='dynamicannotation'
                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_ellipsewrapper'}>
                    <ellipse className='ellipse-shape' cx='50%' cy='50%' rx='50%' ry='50%'
                        data-type='dynamicannotation'
                        data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_ellipse1'}>
                    </ellipse>
                    <g className='ellipse-area'
                        data-type='dynamicannotation'
                        data-annotation-relevance={dataAnnotationRelevance}
                        id={this.props.id + '_clickable' + this.remarkIdPostText}
                        style={styleG} key={this.props.id + '_ellipsepathwrapper'}>
                        <svg x='0px' y='0px' viewBox='0 0 200 200' preserveAspectRatio='none'
                            data-type='dynamicannotation'
                            data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_ellipsesvg'}>
                            <g className='ellipse-area-shape'
                                data-type='dynamicannotation'
                                data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_ellipseg'}>
                                <path d='M100,200h100V100C200,155.2,155.2,200,100,200z'
                                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_path1'}></path>
                                <path d='M0,100v100h100C44.8,200,0,155.2,0,100z'
                                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_path2'}></path>
                                <path d='M100,0H0v100C0,44.8,44.8,0,100,0z'
                                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_path3'}></path>
                                <path d='M100,0c55.2,0,100,44.8,100,100V0H100z'
                                    data-annotation-relevance={dataAnnotationRelevance} key={this.props.id + '_path4'}></path>
                            </g>
                        </svg>
                        <ellipse className='ellipse-area-circle'
                            cx='50%' cy='50%' rx='50%' ry='50%'
                            data-type='dynamicannotation' key={this.props.id + '_ellipse2'}
                            data-annotation-relevance={dataAnnotationRelevance}>
                        </ellipse>
                    </g>
                </svg>
            </span>
        );
    }
}

export = Ellipse;
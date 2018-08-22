/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import stampData = require('../../../../stores/stamp/typings/stampdata');
import StampBase = require('../stampbase');
let classNames = require('classnames');
import toolbarstore = require('../../../../stores/toolbar/toolbarstore');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import enums = require('../../../utility/enums');
import markingStore = require('../../../../stores/marking/markingstore');
import ReactDom = require('react-dom');
import colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');

/**
 * React component class for Image Stamp.
 */
class ImageStamp extends StampBase {

    // Holding mouse click method ref.
    private enterComment: any;

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);

        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.enterComment = this.onEnterCommentSelected.bind(this);
        this.left = 0;
        this.top = 0;
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        // SVG pointer event style added for IE browser fix where use by default will have mouse pointer events
        // which was showing browser default context menu.
        let svgPointerEventsStyle: React.CSSProperties = {};
        let style: React.CSSProperties = {};
        let wrapperStyle: React.CSSProperties = {};
        let isDisplayingInScript: boolean = false;
        let svgId: string = '';
        let classToApply;

        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;
        // Check if current annotation is dragged then we should hide the annotation
        // so that it will not be dispalyed to the user at the initial position from
        // where it is being dragged
        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
            svgPointerEventsStyle.display = 'none';
        } else {

            let isPrevious = this.isPreviousAnnotation;
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';
            this.top = style.top;
            this.left = style.left;

            svgPointerEventsStyle.pointerEvents = 'none';
            classToApply = classNames(
                { 'annotation-wrap': isDisplayingInScript },
                { 'static': isDisplayingInScript },
                {
                    'comment': this.props.stampData !== undefined &&
                    this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment
                },
                { 'open': this.state.isOpen === undefined ? false : this.state.isOpen },
                { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView },
                { 'previous': isPrevious }
            );
        }

        svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';

        //If the stamp is not in the script no need to render the parent span.
        if (!isDisplayingInScript) {
            style.fill = colouredannotationshelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill;
            return this.renderStamp(svgPointerEventsStyle, style, svgId);
        }

        return (
            <span className={classToApply} style={wrapperStyle}
                id={this.props.uniqueId + '-wrapperspan' + this.remarkIdPostText}
                data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}
                onMouseEnter={this.onMouseEnterHandler}
                onMouseMove={this.onMouseMoveHandler}
                onMouseLeave={this.onMouseLeaveHandler}
                onContextMenu={this.onContextMenu}
                onClick={this.enterComment}
                onDoubleClick={this.enterComment}
                // touchtap={this.enterComment} TO DO: Needs to check 
                data-stamp={this.props.stampData.stampId}
                data-token={this.props.clientToken}>
                {this.renderStamp(svgPointerEventsStyle, style, svgId)}
            </span>
        );
    }

    /**
     * Render the Samp.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    private renderStamp(svgPointerEventsStyle: React.CSSProperties, style: React.CSSProperties = {}, svgId: string) {
        return (
            <span className='svg-icon' title={this.props.toolTip} id={this.props.uniqueId + this.remarkIdPostText}
                data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}
                data-stamp={this.props.stampData.stampId} data-token={this.props.clientToken}>
                <svg viewBox='0 0 32 32' className={this.props.id} style={style} id={svgId + this.remarkIdPostText}
                    data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}>
                    <use style={svgPointerEventsStyle} xlinkHref={'#' + this.props.id}
                        data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}></use>
                </svg>
            </span>
        );
    }
}

export = ImageStamp;
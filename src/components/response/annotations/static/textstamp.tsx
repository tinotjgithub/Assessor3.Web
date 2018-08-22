/* tslint:disable:no-unused-variable */
import React = require('react');
import stampData = require('../../../../stores/stamp/typings/stampdata');
import colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import StampBase = require('../stampbase');
let classNames = require('classnames');
import toolbarstore = require('../../../../stores/toolbar/toolbarstore');
import enums = require('../../../utility/enums');

/**
 * React component class for Text Stamp.
 */
class TextStamp extends StampBase {

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);

        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        // Creating the annotation style based on the Coloured Annotations CC
        let style: React.CSSProperties = {};
        let wrapperStyle: React.CSSProperties = {};
        let isDisplayingInScript: boolean = false;
        let svgId: string = '';
        let classToApply;

        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;

        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
        } else {

            // Check if current annotation is dragged then we should hide the annotation
            // so that it will not be dispalyed to the user at the initial position from
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';

            classToApply = classNames(
                { 'annotation-wrap': this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript },
                { 'static': isDisplayingInScript },
                { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView },
                { 'previous': this.isPreviousAnnotation }
            );
        }


            svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';

            // If the stamp is not in the script no need to render the parent span.
            if (!isDisplayingInScript) {
                let annotationStyle = colouredannotationshelper.createAnnotationStyle(this.props.annotationData,
                    enums.DynamicAnnotation.None);
                style.fill = annotationStyle.fill;
                style.border = annotationStyle.border;
                return this.renderStamp(style);
            }

            return (
                <span className={classToApply} style={wrapperStyle}
                    id={this.props.uniqueId + '-wrapperspan' + this.remarkIdPostText}
                    onMouseEnter = {this.onMouseEnterHandler}
                    onMouseMove = {this.onMouseMoveHandler}
                    onMouseLeave={this.onMouseLeaveHandler}
                    onContextMenu={this.onContextMenu} data-stamp = {this.props.stampData.stampId} data-token = {this.props.clientToken}>
                    { this.renderStamp(style) }
                </span>
            );
      }


    /**
     * Render the Samp.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    private renderStamp(style: React.CSSProperties = {}) {
        return (
            <span className='txt-icon' title={this.props.toolTip} id={this.props.uniqueId + this.remarkIdPostText}
                data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}
                data-stamp = {this.props.stampData.stampId} data-token = {this.props.clientToken}>
                <svg viewBox='0 0 32 21' className={this.props.id} style={style} id={this.props.uniqueId + this.remarkIdPostText}
                    data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}>
                    <text
                        id={this.props.stampData.name + '-icon' + this.remarkIdPostText}
                        className='caption' style={style} x='50%' y='50%' dy='.3em'
                        data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}>
                        {this.props.stampData.svgImage === '' ? this.props.stampData.name : this.props.stampData.svgImage}
                    </text>
                </svg>
            </span>
        );
    }
}

export = TextStamp;

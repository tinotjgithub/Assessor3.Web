/* tslint:disable:no-unused-variable */
import React = require('react');
import stampData = require('../../../../stores/stamp/typings/stampdata');
import StampBase = require('../stampbase');
let classNames = require('classnames');

/**
 * React component class for Tools Stamp.
 */
class ToolsStamp extends StampBase {

    /**
     * @constructor
     */
    constructor(props: any) {
        super(props, null);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        let style: React.CSSProperties = {};
        style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
        style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;

        return (
            <span className='svg-icon' id={this.props.uniqueId}
                data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}>
                <svg viewBox='0 0 32 32' className={this.props.id} style={style}
                    data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}>
                    <use xlinkHref={'#' + this.props.id}
                        data-annotation-relevance={this.isPreviousAnnotation ? 'previous' : 'current'}></use>
                </svg>
            </span>
        );
    }
}

export = ToolsStamp;
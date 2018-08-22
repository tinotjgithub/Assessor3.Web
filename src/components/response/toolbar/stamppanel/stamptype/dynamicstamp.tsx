/* tslint:disable:no-unused-variable */
import React = require('react');
import stampData = require('../../../../../stores/stamp/typings/stampdata');
import StampBase = require('../../../annotations/stampbase');
import colouredAnnotationsHelper = require('../../../../../utility/stamppanel/colouredannotationshelper');
let classNames = require('classnames');
import enums = require('../../../../utility/enums');

/**
 * React component class for Dynamic Stamp.
 */
class DynamicStamp extends StampBase {

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
            <span className='svg-icon' id={this.props.uniqueId} data-stamp = {this.props.stampData.stampId}
                data-token = {this.props.clientToken}>
                <svg viewBox='0 0 32 32' className={this.props.id} style={style}>
                    <g
                        fill={this.props.color ? this.props.color :
                            colouredAnnotationsHelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill}>
                        <use xlinkHref={'#' + this.props.id}></use>
                    </g>
                </svg>
            </span>
        );
    }
}

export = DynamicStamp;

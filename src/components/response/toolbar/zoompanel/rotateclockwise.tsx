/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');



/**
 * RotateClockWise class
 * @param {any} any
 * @param {any} any
 * @returns
 */
class RotateClockWise extends pureRenderComponent<any, any> {

    /**
     * Constructor for RotateClockwise
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render() {
        let svgStyle = {
            pointerEvents: 'none'
        };
        return (<a onClick={this.props.onRotateClockWise} id='rotate-right' className='rotate-left-icon' title={this.props.title}
             >
                <span className='svg-icon'style={svgStyle}>
                    <svg viewBox='0 0 32 32' className='icon-rotate-right'>
                        <use xlinkHref='#icon-rotate-right'></use>
                    </svg>
                </span>
            </a>);
    }


}

export = RotateClockWise;
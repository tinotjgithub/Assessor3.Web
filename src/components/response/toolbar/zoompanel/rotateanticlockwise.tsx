/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');


/**
 * RotateAntiClockWise class
 * @param {any} any
 * @param {any} any
 * @returns
 */
class RotateAntiClockWise extends pureRenderComponent<any, any> {

    /**
     * Constructor for rotateanticlockwise
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
        return (<a onClick={this.props.onRotateAntiClockWise } id='rotate-left' className='rotate-right-icon'
            title={this.props.title}  >
                <span className='svg-icon' style={svgStyle}>
                    <svg viewBox='0 0 32 32' className='icon-rotate-left'>
                        <use xlinkHref='#icon-rotate-left'></use>
                    </svg>
                </span>
            </a>);
    }


}

export = RotateAntiClockWise;
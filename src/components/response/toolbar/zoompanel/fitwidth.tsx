/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../../utility/enums');

/**
 * FitWidth class
 * @param {any} any
 * @param {any} any
 * @returns
 */
class FitWidth extends pureRenderComponent<any, any> {
    private _switchFit = null;

    /**
     * Constructor Fitwidth
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        this._switchFit = this.switchFit.bind(this);
    }
    /**
     * fit to width button click function
     */
    private switchFit = (e: MouseEvent) => {
        this.props.switchFit(enums.ZoomPreference.FitWidth);
        e.stopPropagation();
    };

    /**
     * Render component
     */
    public render() {
        return (<a onClick={this._switchFit} id='fit-width' title={this.props.title}
            className={this.props.active}>
            {this.props.name}
        </a>);
    }
}

export = FitWidth;
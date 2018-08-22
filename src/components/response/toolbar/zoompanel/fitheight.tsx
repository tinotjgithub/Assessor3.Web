/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../../utility/enums');

/**
 * FitHeight class
 * @param {any} any
 * @param {any} any
 * @returns
 */
class FitHeight extends pureRenderComponent<any, any> {
    private _switchFit = null;

    /**
     * Constructor for Fitheight
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
        this._switchFit = this.switchFit.bind(this);

    }
    /**
     * fit to height button Click Function
     */
    private switchFit = (e: MouseEvent) => {
        e.stopPropagation();
        this.props.switchFit(enums.ZoomPreference.FitHeight);
    };

    /**
     * Render component
     */
    public render() {
        let fitHeight = localeStore.instance.TranslateText(
            'marking.response.zoom-rotate-panel.zoom-fit-height');
        return (<a onClick={this._switchFit} id='fit-height' title={this.props.title}
            className={this.props.active}>
            {this.props.name}
        </a>);
    }
}

export = FitHeight;
/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../enums');

/*
 * State of banner
 */
interface State {
    renderedOn?: number;
    isVisible?: boolean;
}

/**
 * Properties of banner
 */
interface Props extends LocaleSelectionBase, PropsBase {
    header: string;
    message: string;
    role: string;
    isAriaHidden: boolean;
    bannerType: enums.BannerType;
    isVisible?: boolean;
    onCloseClick?: Function;
}

/**
 * Banner base class
 */
class BannerBase extends pureRenderComponent<Props, State> {

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0,
            isVisible: this.props.isVisible
        };
    }
}

export = BannerBase;
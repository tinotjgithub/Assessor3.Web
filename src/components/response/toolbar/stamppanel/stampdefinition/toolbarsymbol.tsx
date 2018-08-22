/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../../base/purerendercomponent');

const OVERLAY_POINT = 'overlay-point-svg';

interface Props extends PropsBase {
    className?: string;
    symbolData: string;
}

/**
 * React component class for Toolbar symbols
 */
class ToolbarSymbol extends pureRenderComponent<any, any> {
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * The render method
     */
    public render(): JSX.Element {
        return (
            <symbol id={this.props.id}
                key={'Key' + this.props.id}
                className={this.props.className}
                version={this.props.className.indexOf(OVERLAY_POINT) > -1 ? '1.1' : null}
                xmlns={this.props.className.indexOf(OVERLAY_POINT) > -1 ? 'http://www.w3.org/2000/svg' : null}
                dangerouslySetInnerHTML={this.createMarkup(this.props.symbolData)} />
        );
    }

    /**
     * createMarkup method
     */
    private createMarkup(symbolData: string) {
        return {
            __html: symbolData
        };
    }
}

export =  ToolbarSymbol;
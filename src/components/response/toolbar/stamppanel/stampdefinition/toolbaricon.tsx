/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../../base/purerendercomponent');

interface Props extends PropsBase {
    svgImageData: string;
    style?: React.CSSProperties;
}

/**
 * React component class for Toolbar Icons represented in SVG format.
 */
class ToolbarIcon extends pureRenderComponent<any, any> {

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        let style = {};

        if (this.props.style !== undefined && this.props.style !== '') {
            style = this.props.style;
        }

        return (
            <g id={this.props.id}
                key={ 'key_' + this.props.id}
                style={style}
                dangerouslySetInnerHTML={ this.createMarkup(this.props.svgImageData) } />
        );
    }

    /**
     * createMarkup method
     */
    private createMarkup(svgImageData: string) {
        return {
            __html: svgImageData
        };
    }
}

export = ToolbarIcon;

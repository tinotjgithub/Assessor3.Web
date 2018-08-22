/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../../base/purerendercomponent');

interface Props extends PropsBase {
    svgImageData: string;
    style?: React.CSSProperties;
    isEdge?: boolean;
}

/**
 * React component class for Stamp Icons represented in SVG format.
 */
class StampIcon extends pureRenderComponent<any, any> {

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
        let _svgImageData: string = this.props.svgImageData;
        if (this.props.isEdge) {
            _svgImageData = '<svg viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet">' + _svgImageData + '</svg>';
        }

        return (
            <g id={this.props.id}
                key={'key_' + this.props.id}
                dangerouslySetInnerHTML={ this.createMarkup(_svgImageData) } />
        );
    }

    /**
     * Create markUp
     */
    private createMarkup(svgImageData: string) {
        return {
            __html: svgImageData
        };
    }
}

export = StampIcon;

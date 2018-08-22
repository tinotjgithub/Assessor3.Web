import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import Immutable = require('immutable');

/**
 * Properties of a component GenericWrapper
 */
interface Props extends LocaleSelectionBase, PropsBase {
    divClassName: string;
    componentList: Immutable.List<JSX.Element>;
}

/**
 * React component class for GenericWrapper
 */
class GenericComponentWrapper extends pureRenderComponent<Props, any> {

    /**
     * Constructor GenericComponentWrapper
     * @param properties
     * @param state
     */
    constructor(properties: Props, state: any) {
        super(properties, state);
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        return (
            <div className = {this.props.divClassName} >
                {this.props.componentList}
            </div>
        );
    }
}

export = GenericComponentWrapper;
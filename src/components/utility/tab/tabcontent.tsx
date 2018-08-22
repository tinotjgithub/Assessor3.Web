/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');

/* tslint:disable:no-reserved-keywords */
/**
 * Properties of the Tab Content component
 */
interface Props {
    index: number;
    key: string;
    class: string;
    id: string;
    isSelected: boolean;
    content: JSX.Element;
    renderedOn?: number;
}
/* tslint:disable:no-reserved-keywords */

/**
 * Represents the Tab Content Compoent
 */
class TabContent extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }
    /**
     * Render method for Tab Content.
     */
   public render() {
        return (
            <div className={ classNames(this.props.class, { ' active': this.props.isSelected }) }
                key={'key_' + this.props.id}
                id={this.props.id}>
                  {this.props.content }
            </div>
        );
    }
}

export = TabContent;
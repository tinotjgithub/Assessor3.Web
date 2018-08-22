/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');

/**
 * Properties of a component
 */
interface Props extends PropsBase {
    qigname: string;
}

/**
 * Class for the Qig Name.
 */
class QigName extends pureRenderComponent<Props, any> {

    /**
     * Render method for Qig Name.
     */
    public render() {
        return (
                    <span id={ this.props.id + '_name'} key={ this.props.id + '_name'} className='qig-name'>{this.props.qigname}</span>
        );
    }
}

export = QigName;

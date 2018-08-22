/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');

/**
 * Props
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isOnline?: boolean;
    cssClass: string;
    isFrv?: boolean;
}

/**
 * Class for LoadingIndicator component.
 */
class LoadingIndicator extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render method
     */
    public render() {
        if (this.props.isOnline === false) {
            return null;
        } else {
            return (
                <div className= {this.props.cssClass}>
                    <span className= {classNames('loader', (this.props.isFrv ? 'middle-content' : 'text-middle')) }>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>
                    </span>
                </div>
            );
        }
    }
}
export = LoadingIndicator;
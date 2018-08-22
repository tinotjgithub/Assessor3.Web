/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Properties of exception notification indicator component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    exceptionNotificationCount?: number;
}

/**
 * Represents the exception notification indicator component
 */
class ExceptionNotificationIndicator extends pureRenderComponent<Props, any> {

    /**
     * @constructor
     */
    constructor(properties: Props, state: any) {
        super(properties, state);
    }

    /**
     * Render method
     */
    public render() {
        return (<li role='menuitem' className='exception'>
                <a id={this.props.id}
                    href='javascript:void(0)'
                    title= {localeStore.instance.TranslateText('assessor3.notificationindicator.exception') }>
                    <span className='relative'>
                        { this.getExceptionMessageCountRenderer() }
                        <span className='sprite-icon info-icon-light-small'></span>
                        <span className = 'nav-text'>{localeStore.instance.TranslateText('assessor3.worklist.exception-text') }</span>
                    </span>
                </a>
                </li>);
    }

    /**
     * Get's the exception count span div if exception is available for the logged in examiner
     */
    private getExceptionMessageCountRenderer() {
        if (this.props.exceptionNotificationCount > 0) {
            return <span className='notification-count notification circle'>
                    {(this.props.exceptionNotificationCount).toLocaleString(localeStore.instance.Locale) }
                    </span>;
        }
    }

}

export = ExceptionNotificationIndicator;
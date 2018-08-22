import React = require('react');
import Reactdom = require('react-dom');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Properties of component.
 * @param {Props} props
 */
interface ImageProps extends LocaleSelectionBase {
    imageOrder: number;
    showPageNumber: boolean;
    isAdditionalObject?: boolean;
    additionalObjectPageOrder?: number;
    isECourseworkComponent: boolean;
}

/* tslint:disable:variable-name  */
/** Component for comment line */
const SuppressedPage = (props: ImageProps) => {

    /**
     * gets page number
     */
    function getPageNumber(): string {
        if (props.isAdditionalObject) {
            let additionalPageText: string = localeStore.instance.TranslateText
                ('marking.full-response-view.script-page.additional-page-indicator');
            return additionalPageText + ' ' + props.additionalObjectPageOrder;
        } else {
            return props.imageOrder.toString();
        }
    }

    /**
     * gets page number
     */
    function getPageId(): string {
        if (props.isAdditionalObject) {
            return 'AdditionalPage_' + props.additionalObjectPageOrder;
        } else {
            return 'img_' + props.imageOrder.toString();
        }
    }
    if (props.isECourseworkComponent) {
        return null;

    } else {
        return (
            <div className='marksheet-holder no-hover suppressed'
                id={getPageId()}
                key={'suppressed_' + props.imageOrder}>
                <div className='marksheet-holder-inner'>
                    <div className='suppressed-image-holder'
                        title={localeStore.instance.TranslateText('marking.full-response-view.script-page.suppressed-page-tooltip')} >
                        <div className='suppressed-icon-wrapper'>
                            <div className='suppressed-icon-holder'>
                                <span className='eye-icon-large sprite-icon'></span>
                                <span className='suppressed-text'>
                                    {localeStore.instance.TranslateText('marking.full-response-view.script-page.suppressed-page')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {props.showPageNumber === true ? <div className='page-number with-icon'>{getPageNumber()}</div> : ''}
            </div>);
    }
};

/* tslint:enable:variable-name */

export = SuppressedPage;
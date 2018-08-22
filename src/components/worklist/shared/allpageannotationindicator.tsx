/*
  React component for All pages annotation indicator
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');

/**
 * Properties of SLAO annotation indicator
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isAllAnnotated?: boolean;
    isMarkingCompleted: boolean;
    isTileView?: boolean;
    markSchemeGroupId: number;
}

/**
 * React component class for SLAO annotation indicator
 */
class AllPageAnnotationIndicator extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * returns true or false to display or hide the icon
     */
    private isAllPageAnnotationIndiactorIconShow(): boolean {
          /**
           * If allpage annotated cc on, all pages are not annotated and marking is completed
           * then the icon will show. in all other cases icon won't be there
           */

        /** 
         * taking the cc from cc helper
         */
        let _isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ForceAnnotationOnEachPage,
            this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        if (_isAllPagesAnnotatedCC && this.props.isAllAnnotated === false && this.props.isMarkingCompleted) {
            return true;
        }
        return false;
    }

    /**
     * Render component
     */
    public render() {
        let className = 'sprite-icon';
        let title: string = '';
        let isIconVisible = this.isAllPageAnnotationIndiactorIconShow();

        if (isIconVisible) {
            return (
                (this.props.isTileView) ?
                    (<div className='col-inner'>
                            <span id={'allPagesAnnotated_' + this.props.id}
                                key={'allPagesAnnotated_key_' + this.props.id}
                                className='sprite-icon note-and-cross-icon'
                                title={localeStore.instance.TranslateText
                                    ('marking.worklist.response-data.not-all-pages-annotated-icon-tooltip')}>
                            </span>
                        </div>) :
                    (
                        <span className='sprite-icon note-and-cross-icon' id={'allPagesAnnotated_' + this.props.id}
                        key={'allPagesAnnotated_key_' + this.props.id}
                        title={localeStore.instance.TranslateText('marking.worklist.response-data.not-all-pages-annotated-icon-tooltip') }>
                        </span>
                    )
            );
        } else {
            return null;
        }
    }
}

export = AllPageAnnotationIndicator;

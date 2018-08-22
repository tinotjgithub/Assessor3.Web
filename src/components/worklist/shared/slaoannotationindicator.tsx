/*
  React component for SLAO annotation indicator
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import configurableCharacteristicsStore = require('../../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');

/**
 * Properties of SLAO annotation indicator
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isResponseHasSLAO: boolean;
    isAllAnnotated?: boolean;
    isMarkingCompleted: boolean;
    isTileView?: boolean;
    markSchemeGroupId: number;
}

/**
 * React component class for SLAO annotation indicator
 */
class SLAOAnnotationIndicator extends pureRenderComponent<Props, any> {

    /**
     * Constructor fot SLAOAnnotationIndicator
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * returns the below values which define the type of SLAO indicator icon displayed
     *       true        - icon without cross
     *       false       - icon with cross
     *       undefined   - no icon
     */
    private getIconType(): boolean {
        /** 
         * taking the cc from cc helper
         */
        let _isAllPagesAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ForceAnnotationOnEachPage,
            this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        let _isAllSLAOAnnotatedCC = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SLAOForcedAnnotations,
            this.props.markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        /** 
         * If the response has no SLAO's ther will not be an icon in the column, so returning undefined
         */
        if (!this.props.isResponseHasSLAO) {
            return undefined;
        } else if (!this.props.isMarkingCompleted && !this.props.isTileView) {
            /**
             * If the response has SLAO and marking is ot completed the icon without cross will display
             * on the grid column(returning true)
             */
            return true;
        } else if (!_isAllPagesAnnotatedCC && _isAllSLAOAnnotatedCC && this.props.isAllAnnotated === false
            && this.props.isMarkingCompleted) {
            /**
             * If the marking is completed an icon with cross mark will display if the All SLALO CC is on
             * and all SLAO's are not annotated
             */
            return false;
        } else if (!this.props.isTileView && this.props.isMarkingCompleted && this.props.isAllAnnotated === true) {
            /**
             * If the marking is completed , all slo annotated  and listview
             * show sprite-icon bundle-icon 
             */
            return true;
        } else if (!this.props.isTileView) {
           /**
            * show 'sprite-icon bundle-icon' in listview in all other cases otherthan mentioned above.
            * will not show, if the response has no SLAO's.
            */
            return true;
        }
        /**
         * no need to display 'sprite-icon bundle-icon' in tileview .
         */
        return undefined;
    }

    /**
     * Render component
     */
    public render() {
        let className = 'sprite-icon';
        let title: string = '';
        let id: string = '';
        let iconType = this.getIconType();

        /**
         * choosing the class name and title based on the icon type returned from the getIconType() method
         */
        if (iconType === undefined) {
            return null;
        } else if (iconType === true) {
            className = 'sprite-icon bundle-icon';
            title = localeStore.instance.TranslateText('marking.worklist.response-data.additional-objects-icon-tooltip');
        } else if (iconType === false) {
            className = 'sprite-icon bundle-icon-cross';
            id = 'sprite-icon bundle-icon-cross-id';
            title = localeStore.instance.TranslateText('marking.worklist.response-data.additional-objects-not-annotated-icon-tooltip');
        }
        return (
            (this.props.isTileView) ?
                <div className='slao'>
                    <a id={'slaoAnnotation_' + this.props.id}
                        key={'slaoAnnotation_key_' + this.props.id}
                        href='javascript:void(0)' title={title}>
                        <span className={className} id ={id}>slao</span></a>
                </div>
                : <span className='Response has additional answer pages'>
                    <a id={'slaoAnnotation_' + this.props.id}
                        key={'slaoAnnotation_key_' + this.props.id}
                        href='javascript:void(0)' title={title}>
                        <span className={className}>slao</span>
                    </a>
                </span>
        );
    }
}

export = SLAOAnnotationIndicator;
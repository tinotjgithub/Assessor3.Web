import React = require('react');
import localeStore = require('../../stores/locale/localestore');
import qigValidationResultBase = require('../../stores/qigselector/qigvalidationresultbase');

interface RemarkProps extends LocaleSelectionBase, PropsBase {
    qigValidationResult: qigValidationResultBase;
}

/**
 * remarkIndicator contain the remark label and a remark indicator.
 * @param props
 */
const remarkIndicator: React.StatelessComponent<RemarkProps> = (props: RemarkProps) => {

    let remarkIndicatorTooltip: string;
    let remarkIndicatorIconClass: string;

    // Render this indicator only when open remarks are available
    // OR 
    // any remarks are available in the any of the remark pools
    if (props.qigValidationResult.displayRemarkOpenResponseIndicator || props.qigValidationResult.displayRemarkAvailableResponseIndicator) {

        remarkIndicatorIconClass = props.qigValidationResult.displayRemarkOpenResponseIndicator ?
            'downloaded-indicator-icon' :
            'download-indicator-icon';

        remarkIndicatorTooltip = props.qigValidationResult.displayRemarkOpenResponseIndicator ?
            localeStore.instance.TranslateText('home.qig-data.open-re-mark-indicator-icon-tooltip') :
            localeStore.instance.TranslateText('home.qig-data.remarks-available-indicator-tooltip');

        return (
            <div className='remarks-holder shift-right clearfix'
                id='remark_indicator_holder_ID'
                title={remarkIndicatorTooltip}>
                <span className='remarks-text' id='remarks_text_ID'>
                    {localeStore.instance.TranslateText('home.qig-data.remarks-available-indicator') }
                </span>
                <span className={'sprite-icon ' + remarkIndicatorIconClass + ' not-clickable'}
                    id='remarks_indicator_icon_ID'>
                </span>
            </div>
        );
    } else {
        return null;
    }
};

export = remarkIndicator;
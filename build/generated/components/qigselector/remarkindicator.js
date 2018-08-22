"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
/**
 * remarkIndicator contain the remark label and a remark indicator.
 * @param props
 */
var remarkIndicator = function (props) {
    var remarkIndicatorTooltip;
    var remarkIndicatorIconClass;
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
        return (React.createElement("div", {className: 'remarks-holder shift-right clearfix', id: 'remark_indicator_holder_ID', title: remarkIndicatorTooltip}, React.createElement("span", {className: 'remarks-text', id: 'remarks_text_ID'}, localeStore.instance.TranslateText('home.qig-data.remarks-available-indicator')), React.createElement("span", {className: 'sprite-icon ' + remarkIndicatorIconClass + ' not-clickable', id: 'remarks_indicator_icon_ID'})));
    }
    else {
        return null;
    }
};
module.exports = remarkIndicator;
//# sourceMappingURL=remarkindicator.js.map
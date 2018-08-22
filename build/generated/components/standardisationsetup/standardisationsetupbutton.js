"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/**
 * React stateless component for standardisation Setup Button on qig selector
 */
var standardisationSetupButton = function (props) {
    var className = classNames('sprite-icon', { 'remark-download-icon': !props.isMarkedAsProvisional }, { 'downloaded-indicator-icon': props.isMarkedAsProvisional }, 'not-clickable');
    return (React.createElement("div", {className: 'middle-content standardisationsetup-holder text-center'}, React.createElement("div", null, React.createElement("button", {className: 'rounded primary btn-standardisation', id: 'standardisation_btn', key: 'key_standardisation_btn', title: localeStore.instance.TranslateText('home.qig-data.standardisation-button'), onClick: function () { return props.onStandardisationButtonClick(); }}, localeStore.instance.TranslateText('home.qig-data.standardisation-button')), React.createElement("span", {className: className, id: props.isMarkedAsProvisional ? 'stack-indicator-icon' : 'download-indicator-icon', title: props.isMarkedAsProvisional ? localeStore.instance.TranslateText('home.qig-data.stack-indicator-icon') :
        localeStore.instance.TranslateText('home.qig-data.download-indicator-icon')}))));
};
module.exports = standardisationSetupButton;
//# sourceMappingURL=standardisationsetupbutton.js.map
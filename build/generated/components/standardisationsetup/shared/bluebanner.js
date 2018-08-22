"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * StatelessComponent component for BlueBanner
 * @param props
 */
var blueBanner = function (props) {
    return (React.createElement("div", {className: 'message-bar'}, React.createElement("span", {className: 'message-content'}, React.createElement("div", {className: 'text-left', id: 'blue-banner-message'}, React.createElement("p", null, props.blueBannerMessageKey !== '' || props.blueBannerMessageKey !== undefined
        ? localeStore.instance.TranslateText(props.blueBannerMessageKey) : null)))));
};
module.exports = blueBanner;
//# sourceMappingURL=bluebanner.js.map
"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Returns logo based on different login mode
 * @param props
 */
var logo = function (props) {
    return props.isFamiliarisation ?
        React.createElement("span", {className: 'assessor-logo-link breadcrumb-anchor cursor-default familiarisation'}, React.createElement("span", {className: 'sprite-icon logo-small'}), React.createElement("span", {id: props.id, className: 'logo-text'}, localeStore.instance.TranslateText('login.login-page.fam-button'))) : React.createElement("span", {id: props.id + '_link', className: 'assessor-logo-link breadcrumb-anchor cursor-default'}, React.createElement("span", {className: 'sprite-icon assessor-logo', id: props.id}, React.createElement("h1", null, localeStore.instance.TranslateText('login.login-page.rm-assessor'))));
};
module.exports = logo;
//# sourceMappingURL=logo.js.map
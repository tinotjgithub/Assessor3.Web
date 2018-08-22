"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var promoteResponseIcons = function (props) {
    // render TO seed and To Re-use Bucket buttons.
    var renderButtons = (!props.isOpen) ? null : (React.createElement("div", {className: 'tool-option-menu menu', "aria-hidden": 'true', "aria-label": 'submenu'}, React.createElement("div", {className: 'raise-remark-holder'}, React.createElement("p", null, localeStore.instance.TranslateText('team-management.response.promote-panel.header')), React.createElement("div", {className: 'remark-button-holder'}, React.createElement("button", {id: 'id-to-seed', className: 'button primary rounded', title: localeStore.instance.TranslateText('team-management.response.left-toolbar.promote-to-seed-button-tooltip'), onClick: function () { props.onPromoteToSeedButtonClicked(); }}, localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-seed-button'))), React.createElement("div", {className: 'remark-button-holder'}, React.createElement("button", {id: 'id-to-reuse-bucket', className: 'button rounded', title: localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-reuse-bucket-button-tooltip'), onClick: function () { props.onPromoteToReuseButtonClicked(); }}, localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-reuse-bucket-button'))))));
    if (props.isPromotToSeedVisible && props.isPromotToReuseBucketVisible) {
        return (React.createElement("li", {id: 'promote-Response-Icons-dropdown-wrap', className: classNames('promote-seed-icon dropdown-wrap', { 'open': props.isOpen }, { 'close': (!props.isOpen) }), title: localeStore.instance.TranslateText('team-management.response.promote-panel.header'), onClick: function () { props.onPromoteResponseButtonClicked(); }, role: 'navigation', "aria-label": 'Promote response dropdowns'}, React.createElement("a", {className: 'menu-button', href: '#', "aria-haspopup": 'true'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'promote-response-icon'}, React.createElement("use", {xlinkHref: '#promote-seed-icon'}))), React.createElement("span", {id: 'sprite-icon-toolexpand-promote-id', className: 'sprite-icon toolexpand-icon'})), renderButtons));
    }
    else if (props.isPromotToSeedVisible && !props.isPromotToReuseBucketVisible) {
        return (React.createElement("li", {id: 'promote-to-seed', key: 'promote-to-seed-key', className: 'promote-seed-icon', title: localeStore.instance.TranslateText('team-management.response.left-toolbar.promote-to-seed-button-tooltip'), onClick: function () { props.onPromoteToSeedButtonClicked(); }}, React.createElement("a", {className: 'menu-button', href: '#'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'promote-response-icon'}, React.createElement("use", {xlinkHref: '#promote-seed-icon'}))))));
    }
    else if (!props.isPromotToSeedVisible && props.isPromotToReuseBucketVisible) {
        return (React.createElement("li", {id: 'promote-to-reuse', key: 'promote-to-reuse-key', className: 'promote-seed-icon', title: localeStore.instance.TranslateText('team-management.response.promote-panel.promote-to-reuse-bucket-button-tooltip'), onClick: function () { props.onPromoteToReuseButtonClicked(); }}, React.createElement("a", {className: 'menu-button', href: '#'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'promote-response-icon'}, React.createElement("use", {xlinkHref: '#promote-seed-icon'}))))));
    }
    else {
        return null;
    }
};
module.exports = promoteResponseIcons;
//# sourceMappingURL=promoteresponseicons.js.map
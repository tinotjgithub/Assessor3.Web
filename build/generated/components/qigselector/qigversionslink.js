"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/**
 * React stateless component for qig versions link.
 */
var qigVersionsLink = function (props) {
    /**
     * On selecting the qig versions link.
     */
    var onLinkSelection = function () {
        props.onQigVersionLinkClick();
    };
    return (React.createElement("div", {className: 'qig-col5 shift-right qig-col vertical-middle'}, React.createElement("div", {className: 'middle-content text-center'}, React.createElement("a", {href: 'javascript:void(0);', className: 'panel-link', title: localeStore.instance.TranslateText('home.qig-data.qig-versions-link-tooltip'), "aria-expanded": 'true', onClick: onLinkSelection, id: props.id}, React.createElement("span", {className: 'hide-paper'}, localeStore.instance.TranslateText('home.qig-data.hide-paper-versions-link')), React.createElement("span", {className: 'show-paper'}, localeStore.instance.TranslateText('home.qig-data.show-paper-versions-link')), React.createElement("span", {className: 'small-bottom-arrow-blue sprite-icon'})))));
};
module.exports = qigVersionsLink;
//# sourceMappingURL=qigversionslink.js.map
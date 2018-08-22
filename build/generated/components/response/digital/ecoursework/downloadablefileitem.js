"use strict";
var React = require('react');
var localeStore = require('../../../../stores/locale/localestore');
var classNames = require('classnames');
var downloadableFileItem = function (props) {
    // svg element for file icon
    var svgElement = React.createElement("g", {id: 'unknonwn-file-icon'}, React.createElement("svg", {viewBox: '0 0 18 22', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("path", {d: 'M17,22H1c-0.3,0-0.5-0.1-0.7-0.3C0.1,21.5,0,21.3,0,21V1c0-0.6,0.4-1,1-1h12c0.3,0,0.5,0.1,0.7,0.3l4,4.3 C17.9,4.8,18,5,18,5.3V21C18,21.6,17.6,22,17,22z M2,20h14V5.7L12.6,2H2V20z'}), React.createElement("path", {d: 'M17,7h-5c-0.6,0-1-0.4-1-1V1h2v4h4V7z'})));
    return (React.createElement("div", {className: 'file-exception-wrapper'}, React.createElement("div", {className: 'file-exception-msg'}, React.createElement("div", {className: 'exception-file-type'}, React.createElement("div", {className: 'file-icon'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 18 22', className: 'unknown-file-icon'}, React.createElement("use", {xlinkHref: '#unknonwn-file-icon'}, svgElement)))), React.createElement("div", {className: 'file-name'}, props.fileName)), React.createElement("p", {className: 'exception-msg', id: 'msg-text'}, localeStore.instance.TranslateText('marking.response.ecoursework-unsupported-file-placeholder.line-1'), "&#xB3;", '.', React.createElement("br", null), localeStore.instance.TranslateText('marking.response.ecoursework-unsupported-file-placeholder.line-2')))));
};
module.exports = downloadableFileItem;
//# sourceMappingURL=downloadablefileitem.js.map
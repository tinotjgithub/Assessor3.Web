"use strict";
var React = require('react');
var classNames = require('classnames');
var localeStore = require('../../../stores/locale/localestore');
var unZonedPlaceHolder = function (props) {
    //svg element
    var svgElement = React.createElement("g", {id: 'unzoned-content'}, React.createElement("svg", {viewBox: '0 0 18 22', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("path", {d: 'M17.7,4.6l-4-4.3C13.5,0.1,13.3,0,13,0H1C0.4,0,0,0.4,0,1v20c0,0.3,0.1,0.5,0.3,0.7S0.7,22,1,22h16c0.6,0,1-0.4,1-1V5.3C18,5,17.9,4.8,17.7,4.6z M15.4,5H13V2.4L15.4,5z M2,20V2h9v4c0,0.6,0.4,1,1,1h4v13H2z'}), React.createElement("rect", {x: '8', y: '3', transform: 'matrix(0.7926 -0.6097 0.6097 0.7926 -4.9625 7.81)', width: '2', height: '16.4'}))));
    return (React.createElement("div", {id: 'unzoned-holder', className: 'unzoned-holder'}, React.createElement("div", {className: 'unzoned-icon-holder'}, React.createElement("span", {className: 'svg-icon unzoned-icon'}, React.createElement("svg", {viewBox: '0 0 18 22', className: 'unzoned-content-icon'}, React.createElement("use", {xlinkHref: '#unzoned-content'}, svgElement))), React.createElement("div", {className: 'unzone-msg-holder'}, React.createElement("p", {className: 'unzoned-image-message', id: 'unzoned-msg-text'}, localeStore.instance.TranslateText('marking.response.ebookmarking.unzoned-images-placeholder'))))));
};
module.exports = unZonedPlaceHolder;
//# sourceMappingURL=unzonedplaceholder.js.map
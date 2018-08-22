"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var OverlayIcon = require('./overlayicon');
var overlayPanel = function (props) {
    if (!props.isResponseModeClosed) {
        return (React.createElement("ul", {className: 'icon-grouping overlay-icons dt-group', id: 'icon-grouping-overlay'}, React.createElement(OverlayIcon, {overlayIcon: 'ruler', id: 'ruler', key: 'ruler_key'}), React.createElement(OverlayIcon, {overlayIcon: 'protractor', id: 'protractor', key: 'protractor_key'}), React.createElement(OverlayIcon, {overlayIcon: 'multiline-overlay', id: 'multiple_line', key: 'multiple_line_key'})));
    }
    else {
        return (React.createElement("div", {className: 'marking-tools-panel'}, React.createElement("div", {className: 'icon-tray-right'}, React.createElement("div", {className: 'default-marking-tray'}, React.createElement("ul", {className: 'marking-tool-tray overlay-icons', id: 'marking-tool-tray-overlay-icons'}, React.createElement(OverlayIcon, {overlayIcon: 'ruler', id: 'ruler', key: 'ruler_key'}), React.createElement(OverlayIcon, {overlayIcon: 'protractor', id: 'protractor', key: 'protractor_key'}), React.createElement(OverlayIcon, {overlayIcon: 'multiline-overlay', id: 'multiple_line', key: 'multiple_line_key'}))))));
    }
};
module.exports = overlayPanel;
//# sourceMappingURL=overlaypanel.js.map
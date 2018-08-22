"use strict";
var React = require('react');
/**
 * React wrapper component for html viewer
 */
var htmlviewer = function (props) {
    return (React.createElement("iframe", {className: props.className, id: props.iframeID, frameBorder: '0', src: props.url, onLoad: props.onLoadFn()}));
};
module.exports = htmlviewer;
//# sourceMappingURL=htmlviewer.js.map
"use strict";
var React = require('react');
var ToolbarIcon = require('../../toolbar/stamppanel/stampdefinition/toolbaricon');
var fileIconData = require('./fileicondata.json');
var eCourseWorkDefinitions = function (props) {
    var style = {
        display: 'none'
    };
    return (React.createElement("svg", {version: '1.1', style: style}, React.createElement("defs", null, React.createElement(ToolbarIcon, {id: 'pdf-icon', key: 'pdf-icon', svgImageData: fileIconData.pdf_icon}), React.createElement(ToolbarIcon, {id: 'document-icon', key: 'document-icon', svgImageData: fileIconData.document_icon}), React.createElement(ToolbarIcon, {id: 'image-icon', key: 'image-icon', svgImageData: fileIconData.image_icon}), React.createElement(ToolbarIcon, {id: 'video-icon', key: 'video-icon', svgImageData: fileIconData.video_icon}), React.createElement(ToolbarIcon, {id: 'audio-icon', key: 'audio-icon', svgImageData: fileIconData.audio_icon}), React.createElement(ToolbarIcon, {id: 'volume-control', key: 'volume-control', svgImageData: fileIconData.volume_control}), React.createElement(ToolbarIcon, {id: 'unknown-file-icon', key: 'unknown-file-icon', svgImageData: fileIconData.unknown_file_icon}), React.createElement(ToolbarIcon, {id: 'spreadsheet-icon', key: 'spreadsheet-icon', svgImageData: fileIconData.spreadsheet_icon}), React.createElement(ToolbarIcon, {id: 'rtf-icon', key: 'rtf-icon', svgImageData: fileIconData.rtf_icon}), React.createElement(ToolbarIcon, {id: 'ppt-icon', key: 'ppt-icon', svgImageData: fileIconData.ppt_icon}), React.createElement(ToolbarIcon, {id: 'html-icon', key: 'html-icon', svgImageData: fileIconData.html_icon}), React.createElement(ToolbarIcon, {id: 'excel-icon', key: 'excel-icon', svgImageData: fileIconData.excel_icon}), React.createElement(ToolbarIcon, {id: 'convertible-icon', key: 'convertible-icon', svgImageData: fileIconData.convertible_icon}))));
};
module.exports = eCourseWorkDefinitions;
//# sourceMappingURL=ecourseworkdefinitions.js.map
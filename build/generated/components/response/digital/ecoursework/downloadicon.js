"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var DownloadIcon = (function (_super) {
    __extends(DownloadIcon, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function DownloadIcon(props, state) {
        _super.call(this, props, state);
        this.onClick = this.onClick.bind(this);
    }
    /**
     * Render method
     */
    DownloadIcon.prototype.render = function () {
        var iconTitle = localeStore.instance.TranslateText('marking.response.media-player.download-icon-tooltip');
        var svgElement = React.createElement("g", {id: 'download-file-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("polygon", {points: '21.8,16.8 20.2,15.2 17,18.4 17,6 15,6 15,18.4 11.8,15.2 10.2,16.8 16,22.6 	'}), React.createElement("rect", {x: '6', y: '24', className: 'st0', width: '20', height: '2'}))));
        return (React.createElement("div", {className: 'player-control download-file'}, React.createElement("a", {href: 'javascript:void(0);', className: 'download-file-button', title: iconTitle, onClick: this.onClick, id: 'downloadfile'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'download-file-icon'}, React.createElement("use", {xlinkHref: '#download-file-icon'}, svgElement))))));
    };
    /**
     * To click
     */
    DownloadIcon.prototype.onClick = function () {
        this.props.pauseMediaPlayerOnDownloading();
        // handling offline scenarios
        var isOnline = eCourseWorkHelper.openFileInNewWindow(this.props.src);
        if (isOnline) {
            ecourseworkResponseActionCreator.fileDownloadedOustide();
            if (this.props.updateFileViewStatus) {
                this.props.updateFileViewStatus(null, true);
            }
        }
    };
    return DownloadIcon;
}(pureRenderComponent));
module.exports = DownloadIcon;
//# sourceMappingURL=downloadicon.js.map
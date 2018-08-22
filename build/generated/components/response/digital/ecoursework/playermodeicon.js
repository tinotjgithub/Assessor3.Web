"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var localeStore = require('../../../../stores/locale/localestore');
var enums = require('../../../utility/enums');
var ecourseworkresponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var classNames = require('classnames');
var domManager = require('../../../../utility/generic/domhelper');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var URLS = require('../../../../dataservices/base/urls');
/* tslint:disable:variable-name */
var PlayerModeIconItem = function (props) {
    var onItemClick = function (event) {
        ecourseworkresponseActionCreator.mediaPlayerSourceChange(props.pageId, props.candidateScriptId, props.mediaSourceType);
    };
    var tickSvg = React.createElement("g", {id: 'v-icon-tick'}, React.createElement("svg", {viewBox: '0 0 32 32', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("polygon", {points: '12.5,24.3 11.1,21.5 24.9,7.7 27,9.8  '}), React.createElement("polygon", {points: '12.5,24.3 5.1,17 7.3,14.9 14.2,21.8  '})));
    return (React.createElement("li", {className: classNames('menu-item ', { 'selected': (props.isSelected === true) }), onClick: onItemClick}, React.createElement("span", {className: 'svg-icon shift-left tick'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'tick-icon'}, props.isSelected ? React.createElement("use", {xlinkHref: '#v-icon-tick'}, tickSvg) : null)), React.createElement("span", {className: 'label-text'}, props.itemText)));
};
var PlayerModeIcon = (function (_super) {
    __extends(PlayerModeIcon, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function PlayerModeIcon(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * On click method
         */
        this.onClick = function (event) {
            var selectedAudioVideoFile = eCourseWorkFileStore.instance.getSelectedPlayableFile();
            if (eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable) {
                _this.props.pauseMediaPlayerOnDownloading();
                var url = config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
                    selectedAudioVideoFile.alternateLink.linkData.url;
                if (eCourseWorkHelper.openFileInNewWindow(url)) {
                    ecourseworkresponseActionCreator.fileDownloadedOustide();
                    if (_this.props.updateFileViewStatus) {
                        _this.props.updateFileViewStatus(undefined, true);
                    }
                }
            }
            else {
                event.stopPropagation();
                _this.setState({
                    isOpen: !_this.state.isOpen
                });
            }
        };
        /**
         * To hide the list when clicked outside
         */
        this.hideList = function (event) {
            if (event.target !== undefined) {
                if (_this.state.isOpen === true &&
                    domManager.searchParentNode(event.target, function (el) { return el.id === 'media_list'; }) == null) {
                    _this.setState({
                        isOpen: false
                    });
                }
            }
        };
        /**
         * Render player mode icon item method
         */
        this.renderplayermodeIconItem = function (sourceType) {
            var title = (sourceType === enums.MediaSourceType.OriginalFile) ?
                localeStore.instance.TranslateText('marking.response.media-player.play-original-file') :
                localeStore.instance.TranslateText('marking.response.media-player.play-transcoded-file');
            var selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            var selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter(function (x) {
                return (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio);
            }).first() : undefined;
            var pageId = selectedFile ? selectedFile.docPageID : undefined;
            return (React.createElement(PlayerModeIconItem, {id: 'icon_id_' + sourceType, key: 'icon_key_' + sourceType, selectedLanguage: _this.props.selectedLanguage, isSelected: _this.props.playerMode === sourceType, itemText: title, pageId: pageId, candidateScriptId: _this.props.candidateScriptId, mediaSourceType: sourceType}));
        };
        this.state = {
            isOpen: undefined
        };
        this.hideList = this.hideList.bind(this);
    }
    /**
     * Triggers while the component mounts
     */
    PlayerModeIcon.prototype.componentDidMount = function () {
        window.addEventListener('click', this.hideList);
    };
    /**
     * Triggers while component start to unmount
     */
    PlayerModeIcon.prototype.componentWillUnMount = function () {
        window.removeEventListener('click', this.hideList);
    };
    /**
     * Render method
     */
    PlayerModeIcon.prototype.render = function () {
        var title = this.props.isAlternateFileDownloadable ?
            localeStore.instance.TranslateText('marking.response.media-player.download-transcoded-icon-tooltip') :
            localeStore.instance.TranslateText('marking.response.media-player.file-to-play-icon-tooltip');
        var svgElement = React.createElement("g", {id: 'transcode-toggle-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("path", {d: 'M25,6H11c-0.6,0-1,0.4-1,1v3H7c-0.6,0-1,0.4-1,1v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-3h3c0.6,0,1-0.4,1-1V7 C26,6.4,25.6,6,25,6z M20,24H8V12h2v9c0,0.6,0.4,1,1,1h9V24z M24,20H12V8h12V20z'}), React.createElement("polygon", {points: '16,17 20,14 16,11 		'}))));
        return (React.createElement("div", {className: classNames('transcoded-file dropdown-wrap', { 'up': (this.props.isAudioPlayer === false) }, { 'close': (this.state.isOpen === false) }, { 'open': (this.state.isOpen === true) }), id: 'media_list', onClick: this.onClick}, React.createElement("a", {className: 'transcoded-file-button menu-button', title: title, id: 'transcoded_button'}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'transcoded-file-icon'}, React.createElement("use", {xlinkHref: '#transcode-toggle-icon'}, svgElement)))), React.createElement("div", {className: 'relative'}, React.createElement("div", {className: 'menu-callout'})), React.createElement("ul", {className: 'transcode-options menu selectable', id: 'transcoded_list'}, this.renderplayermodeIconItem(enums.MediaSourceType.OriginalFile), this.renderplayermodeIconItem(enums.MediaSourceType.TranscodedFile))));
    };
    return PlayerModeIcon;
}(pureRenderComponent));
module.exports = PlayerModeIcon;
//# sourceMappingURL=playermodeicon.js.map
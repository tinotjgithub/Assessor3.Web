"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var MediaPlayer = require('./mediaplayer');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var localeStore = require('../../../../stores/locale/localestore');
var enums = require('../../../utility/enums');
var busyIndicatorHelper = require('../../../utility/busyindicator/busyindicatorhelper');
var LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
var markingStore = require('../../../../stores/marking/markingstore');
var classNames = require('classnames');
/**
 * React Component class for video  Player
 */
var VideoPlayer = (function (_super) {
    __extends(VideoPlayer, _super);
    /**
     *
     * @param props
     * @param state
     */
    function VideoPlayer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * To change the screen mode
         */
        this.onChangeScreenMode = function (evt) {
            evt.preventDefault();
            _this.setState({ isFullScreen: !_this.state.isFullScreen });
        };
        // this.setPlayerSize();
        this.state = {
            isPlaying: false,
            isMuted: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume === 0,
            volumeLevel: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume,
            previousVolumeLevel: 1,
            seekPosition: 0,
            currentTime: '00:00',
            renderedOn: 0,
            totalDuration: '00:00',
            isFullScreen: false,
            playerMode: enums.MediaSourceType.OriginalFile
        };
        // this flag will be set after setting the player width and padding
        this.isPlayerReady = false;
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.updateSeekTime = this.updateSeekTime.bind(this);
        this.mediaPlayEnd = this.mediaPlayEnd.bind(this);
        this.loadedMetaData = this.loadedMetaData.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.muteOrUnmute = this.muteOrUnmute.bind(this);
        this.seek = this.seek.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.onError = this.onError.bind(this);
        this.onErrorOkClick = this.onErrorOkClick.bind(this);
        this.onChangeScreenMode = this.onChangeScreenMode.bind(this);
        this.pauseMediaPlayerOnDownloading = this.pauseMediaPlayerOnDownloading.bind(this);
        this.changePlayerMode = this.changePlayerMode.bind(this);
        this.updateMediaSource = this.updateMediaSource.bind(this);
        this.onLoadedData = this.onLoadedData.bind(this);
        this.onSeeking = this.onSeeking.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onPlaying = this.onPlaying.bind(this);
        this.onWaiting = this.onWaiting.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
    }
    /**
     * to render the video player component
     */
    VideoPlayer.prototype.render = function () {
        var cssClass = 'section-loader loading';
        cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
        this.mediaErrorHeader = 'marking.response.media-player-error-dialog.header-video';
        this.networkErrorContent = localeStore.instance.TranslateText('marking.response.media-player-error-dialog.body-video-network-error');
        this.genericErrorContent = localeStore.instance.TranslateText('marking.response.media-player-error-dialog.body-video-generic-error');
        // only loading indicator will be shown till the width and padding for player is set
        // player will be hidden till then using the 'hide' class.
        var fileLoadingIndicator = this.isPlayerReady ? null :
            React.createElement(LoadingIndicator, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: cssClass});
        var _styleForSeekSlider = {};
        var _styleForVideoPlayer = {};
        var _styleForMediaPlayer = {};
        var currentAction = this.state.isPlaying ? 'pause' : 'play';
        _styleForSeekSlider.width = this.state.seekPosition + '%';
        var screenModeClassName = this.state.isFullScreen ? 'full-screen' : 'normal-screen';
        _styleForVideoPlayer.paddingTop = this.videoPlayerPadding + '%';
        _styleForMediaPlayer.width = this.videoPlayerWidth + 'px';
        this.setPlayerMode();
        return (React.createElement("div", {id: 'videoPlayerContainer', className: 'media-player-wrapper video'}, fileLoadingIndicator, React.createElement("div", {className: 'media-player-wrapper-inner'}, React.createElement("div", {className: classNames('mediaplayer ' + screenModeClassName, { 'hide': !this.isPlayerReady }), style: _styleForMediaPlayer}, React.createElement("div", {className: 'player'}, React.createElement("div", {className: 'video-scaler', style: _styleForVideoPlayer}), this.renderLoadingIndicator(), React.createElement("video", {ref: 'mediaElement', autoPlay: eCourseWorkFileStore.instance.doAutoPlay(), onTimeUpdate: this.updateSeekTime, onEnded: this.mediaPlayEnd, onLoadedMetadata: this.loadedMetaData, onError: this.onError, onLoadedData: this.onLoadedData, onSeeking: this.onSeeking, onLoadStart: this.onLoadStart, onPlaying: this.onPlaying, onSeeked: this.onSeeked, onWaiting: this.onWaiting, onCanPlay: this.onCanPlay, src: this.updateMediaSource(), id: 'videoplayer', preload: 'metadata', className: 'video-player media-file'}, localeStore.instance.TranslateText('marking.response.media-player.browser-not-supported-error'))), React.createElement("div", {className: 'player-control-bar'}, React.createElement("div", {className: 'player-control-group left'}, React.createElement("div", {className: 'player-control icon'}, React.createElement("a", {href: '#', className: 'playback ' + currentAction, onClick: this.playOrPause, title: localeStore.instance.TranslateText('marking.response.media-player.play-pause-button-tooltip')}, React.createElement("span", {className: 'svg-icon playback-icon'}, React.createElement("svg", {viewBox: '0 0 14 20', className: 'play-pause-icon'}, React.createElement("use", {xlinkHref: '#play-icon', className: 'play-icon'}, localeStore.instance.TranslateText('marking.response.media-player.play-button-tooltip')), React.createElement("use", {xlinkHref: '#pause-icon', className: 'pause-icon'}, localeStore.instance.TranslateText('marking.response.media-player.pause-button-tooltip')))))), React.createElement("div", {className: 'player-control label time-elapsed'}, React.createElement("span", {className: 'elapsed-time'}, this.state.currentTime), React.createElement("span", {className: 'time-seperator'}, "/"), React.createElement("span", {className: 'total-duration'}, this.state.totalDuration))), React.createElement("div", {className: 'player-control-group center'}, React.createElement("div", {className: 'player-control time'}, React.createElement("div", {className: 'slider'}, React.createElement("div", {className: 'slider-track'}), React.createElement("label", {className: 'player-input-label', htmlFor: 'time-silder'}, localeStore.instance.TranslateText('marking.response.media-player.playback-time-tooltip')), React.createElement("input", {type: 'range', min: '0', max: '100', value: this.state.seekPosition, className: 'slider-input time', id: 'time-silder', onChange: this.seek, onMouseDown: this.pause, onMouseUp: this.play, onTouchStart: this.pause, onTouchEnd: this.touchEnd}), React.createElement("div", {id: 'slider-progress', className: 'slider-progress', style: _styleForSeekSlider}, React.createElement("div", {className: 'seek-btn'}))))), React.createElement("div", {className: 'player-control-group right'}, this.renderVolumeControl(), React.createElement("div", {className: 'player-control right-buttons'}, this.renderPlayerModeIcon(false), this.renderDownloadButton(), React.createElement("div", {className: 'full-screen-view'}, React.createElement("a", {href: '#', className: 'view-fullscreen', title: 'Full screen/Exit full screen', onClick: this.onChangeScreenMode}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'toggle-full-screen-icon'}, React.createElement("use", {xlinkHref: '#fullscreen-icon', className: 'full-screen-icon'}, localeStore.instance.TranslateText('marking.response.media-player.full-screen-button-tooltip')), React.createElement("use", {xlinkHref: '#exit-fullscreen-icon', className: 'exit-full-screen-icon'}, localeStore.instance.TranslateText('marking.response.media-player.exit-full-screen-button-tooltip')))))))))), this.renderDefinitions(), React.createElement("div", null, this.renderErrorDialog()))));
    };
    return VideoPlayer;
}(MediaPlayer));
module.exports = VideoPlayer;
//# sourceMappingURL=videoPlayer.js.map
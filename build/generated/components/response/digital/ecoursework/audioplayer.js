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
/**
 * React Component class for Audio Player
 */
var AudioPlayer = (function (_super) {
    __extends(AudioPlayer, _super);
    /**
     *
     * @param props
     * @param state
     */
    function AudioPlayer(props, state) {
        _super.call(this, props, state);
        this.state = {
            isPlaying: false,
            isMuted: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume === 0,
            volumeLevel: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume,
            previousVolumeLevel: 1,
            seekPosition: 0,
            currentTime: '00:00',
            renderedOn: 0,
            totalDuration: '00:00',
            playerMode: enums.MediaSourceType.OriginalFile
        };
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
        this.pauseMediaPlayerOnDownloading = this.pauseMediaPlayerOnDownloading.bind(this);
        this.changePlayerMode = this.changePlayerMode.bind(this);
        this.updateMediaSource = this.updateMediaSource.bind(this);
        this.onLoadedData = this.onLoadedData.bind(this);
        this.onPlaying = this.onPlaying.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onSeeking = this.onSeeking.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
    }
    /**
     * to render the audio player component
     */
    AudioPlayer.prototype.render = function () {
        var _styleForSeekSlider = {};
        var currentAction = this.state.isPlaying ? 'pause' : 'play';
        _styleForSeekSlider.width = this.state.seekPosition + '%';
        this.mediaErrorHeader = 'marking.response.media-player-error-dialog.header-audio';
        this.networkErrorContent = localeStore.instance.TranslateText('marking.response.media-player-error-dialog.body-audio-network-error');
        this.genericErrorContent = localeStore.instance.TranslateText('marking.response.media-player-error-dialog.body-audio-generic-error');
        this.setPlayerMode();
        return (React.createElement("div", {id: 'audioPlayerContainer', className: 'media-player-wrapper audio'}, React.createElement("div", {className: 'mediaplayer'}, React.createElement("div", {className: 'player'}, React.createElement("audio", {ref: 'mediaElement', autoPlay: eCourseWorkFileStore.instance.doAutoPlay(), onTimeUpdate: this.updateSeekTime, onEnded: this.mediaPlayEnd, onLoadedMetadata: this.loadedMetaData, onError: this.onError, onLoadedData: this.onLoadedData, onLoadStart: this.onLoadStart, onSeeking: this.onSeeking, onSeeked: this.onSeeked, onPlaying: this.onPlaying, onCanPlay: this.onCanPlay, src: this.updateMediaSource(), id: 'audiotrack', preload: 'metadata', className: 'audio-track media-file'}, localeStore.instance.TranslateText('marking.response.media-player.browser-not-supported-error'))), React.createElement("div", {className: 'player-control-bar'}, React.createElement("div", {className: 'player-control-group left'}, React.createElement("div", {className: 'player-control icon'}, React.createElement("a", {href: '#', className: 'playback ' + currentAction, onClick: this.playOrPause, title: localeStore.instance.TranslateText('marking.response.media-player.play-pause-button-tooltip')}, React.createElement("span", {className: 'svg-icon playback-icon'}, React.createElement("svg", {viewBox: '0 0 14 20', className: 'play-pause-icon'}, React.createElement("use", {xlinkHref: '#play-icon', className: 'play-icon'}, localeStore.instance.TranslateText('marking.response.media-player.play-button-tooltip')), React.createElement("use", {xlinkHref: '#pause-icon', className: 'pause-icon'}, localeStore.instance.TranslateText('marking.response.media-player.pause-button-tooltip'))))))), this.renderLoadingIndicator(), React.createElement("div", {className: 'player-control-group center'}, React.createElement("div", {className: 'player-control label time-elapsed'}, React.createElement("span", {className: 'elapsed-time'}, this.state.currentTime)), React.createElement("div", {className: 'player-control time'}, React.createElement("div", {className: 'slider'}, React.createElement("div", {className: 'slider-track'}), React.createElement("label", {className: 'player-input-label', htmlFor: 'time-silder'}, localeStore.instance.TranslateText('marking.response.media-player.playback-time-tooltip')), React.createElement("input", {type: 'range', min: '0', max: '100', value: this.state.seekPosition, className: 'slider-input time', id: 'time-silder', onChange: this.seek, onMouseDown: this.pause, onMouseUp: this.play, onTouchStart: this.pause, onTouchEnd: this.touchEnd}), React.createElement("div", {id: 'slider-progress', className: 'slider-progress', style: _styleForSeekSlider}, React.createElement("div", {className: 'seek-btn'})))), React.createElement("div", {className: 'player-control label time-duration'}, React.createElement("span", {className: 'total-duration'}, this.state.totalDuration))), React.createElement("div", {className: 'player-control-group right'}, this.renderVolumeControl(), React.createElement("div", {className: 'player-control right-buttons'}, this.renderPlayerModeIcon(true), this.renderDownloadButton())))), this.renderDefinitions(), React.createElement("div", null, this.renderErrorDialog())));
    };
    return AudioPlayer;
}(MediaPlayer));
module.exports = AudioPlayer;
//# sourceMappingURL=audioplayer.js.map
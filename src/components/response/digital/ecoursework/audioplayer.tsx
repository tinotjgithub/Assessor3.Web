import React = require('react');
import MediaPlayer = require('./mediaplayer');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import localeStore = require('../../../../stores/locale/localestore');
import htmlutilities = require('../../../../utility/generic/htmlutilities');
import MediaErrorDialog = require('../../../logging/mediaerrordialog');
import enums = require('../../../utility/enums');

/**
 * React Component class for Audio Player
 */
class AudioPlayer extends MediaPlayer {
    /**
     *
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);

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
    public render(): JSX.Element {
        let _styleForSeekSlider: React.CSSProperties = {};
        let currentAction = this.state.isPlaying ? 'pause' : 'play';
        _styleForSeekSlider.width = this.state.seekPosition + '%';
        this.mediaErrorHeader = 'marking.response.media-player-error-dialog.header-audio';
        this.networkErrorContent = localeStore.instance.TranslateText
            ('marking.response.media-player-error-dialog.body-audio-network-error');
        this.genericErrorContent = localeStore.instance.TranslateText
            ('marking.response.media-player-error-dialog.body-audio-generic-error');
        this.setPlayerMode();

        return (<div id='audioPlayerContainer' className='media-player-wrapper audio'>
            <div className='mediaplayer'>
                <div className='player'>
                    <audio ref={'mediaElement'}
                        autoPlay={eCourseWorkFileStore.instance.doAutoPlay()}
                        onTimeUpdate={this.updateSeekTime}
                        onEnded={this.mediaPlayEnd}
                        onLoadedMetadata={this.loadedMetaData}
                        onError={this.onError}
                        onLoadedData={this.onLoadedData}
                        onLoadStart={this.onLoadStart}
                        onSeeking={this.onSeeking}
                        onSeeked={this.onSeeked}
                        onPlaying={this.onPlaying}
                        onCanPlay={this.onCanPlay}
                        src={this.updateMediaSource()}
                        id='audiotrack'
                        preload='metadata'
                        className='audio-track media-file'>
                        {localeStore.instance.TranslateText('marking.response.media-player.browser-not-supported-error')}
                    </audio>
                </div>
                <div className='player-control-bar'>
                    <div className='player-control-group left'>
                        <div className='player-control icon'>
                            <a href='#' className={'playback ' + currentAction}
                                onClick={this.playOrPause}
                                title={localeStore.instance.TranslateText('marking.response.media-player.play-pause-button-tooltip')}>
                                <span className='svg-icon playback-icon'>
                                    <svg viewBox='0 0 14 20' className='play-pause-icon'>
                                        <use xlinkHref='#play-icon' className='play-icon'>
                                            {localeStore.instance.TranslateText('marking.response.media-player.play-button-tooltip')}
                                        </use>
                                        <use xlinkHref='#pause-icon' className='pause-icon'>
                                            {localeStore.instance.TranslateText('marking.response.media-player.pause-button-tooltip')}
                                        </use>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                    {this.renderLoadingIndicator()}
                    <div className='player-control-group center'>
                        <div className='player-control label time-elapsed'>
                            <span className='elapsed-time'>{this.state.currentTime}</span>
                        </div>
                        <div className='player-control time'>
                            <div className='slider'>
                                <div className='slider-track'></div>
                                <label className='player-input-label' htmlFor='time-silder'>
                                    {localeStore.instance.TranslateText('marking.response.media-player.playback-time-tooltip')}
                                </label>
                                <input type='range' min='0' max='100' value={this.state.seekPosition}
                                    className='slider-input time'
                                    id='time-silder'
                                    onChange={this.seek}
                                    onMouseDown={this.pause}
                                    onMouseUp={this.play}
                                    onTouchStart={this.pause}
                                    onTouchEnd={this.touchEnd} />
                                <div id='slider-progress' className='slider-progress' style={_styleForSeekSlider}>
                                    <div className='seek-btn'></div>
                                </div>
                            </div>
                        </div>
                        <div className='player-control label time-duration'>
                            <span className='total-duration'>{this.state.totalDuration}</span>
                        </div>
                    </div>
                    <div className='player-control-group right'>
                        {this.renderVolumeControl()}
                        <div className='player-control right-buttons'>
                            {this.renderPlayerModeIcon(true)}
                            {this.renderDownloadButton()}
                        </div >
                    </div >
                </div >
            </div >
            {
                this.renderDefinitions()
            }
            <div>
            {
                this.renderErrorDialog()
            }
            </div>
        </div >

        );
    }
}
export = AudioPlayer;

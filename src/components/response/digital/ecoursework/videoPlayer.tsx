import React = require('react');
import MediaPlayer = require('./mediaplayer');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import localeStore = require('../../../../stores/locale/localestore');
import htmlutilities = require('../../../../utility/generic/htmlutilities');
import enums = require('../../../utility/enums');
import busyIndicatorHelper = require('../../../utility/busyindicator/busyindicatorhelper');
import LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
import markingStore = require('../../../../stores/marking/markingstore');
let classNames = require('classnames');

/**
 * React Component class for video  Player
 */
class VideoPlayer extends MediaPlayer {

    /**
     *
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);

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
    public render(): JSX.Element {

       let cssClass: string = 'section-loader loading';
       cssClass += busyIndicatorHelper.getResponseModeBusyClass(markingStore.instance.currentResponseMode);
       this.mediaErrorHeader = 'marking.response.media-player-error-dialog.header-video';
       this.networkErrorContent = localeStore.instance.TranslateText
           ('marking.response.media-player-error-dialog.body-video-network-error');
       this.genericErrorContent = localeStore.instance.TranslateText
           ('marking.response.media-player-error-dialog.body-video-generic-error');
        // only loading indicator will be shown till the width and padding for player is set
        // player will be hidden till then using the 'hide' class.
       let fileLoadingIndicator = this.isPlayerReady ? null :
           <LoadingIndicator
                id={enums.BusyIndicatorInvoker.none.toString()}
                key={enums.BusyIndicatorInvoker.none.toString()}
                cssClass={cssClass} />;

        let _styleForSeekSlider: React.CSSProperties = {};
        let _styleForVideoPlayer: React.CSSProperties = {};
        let _styleForMediaPlayer: React.CSSProperties = {};

        let currentAction = this.state.isPlaying ? 'pause' : 'play';
        _styleForSeekSlider.width = this.state.seekPosition + '%';

        let screenModeClassName = this.state.isFullScreen ? 'full-screen' : 'normal-screen';
        _styleForVideoPlayer.paddingTop = this.videoPlayerPadding + '%';

        _styleForMediaPlayer.width = this.videoPlayerWidth + 'px';

        this.setPlayerMode();

        return (
            <div id='videoPlayerContainer' className={'media-player-wrapper video'} >
                {fileLoadingIndicator}
                <div className='media-player-wrapper-inner'>
                    <div className={classNames('mediaplayer ' + screenModeClassName, { 'hide': !this.isPlayerReady })}
                        style={_styleForMediaPlayer}>
                        <div className='player'>
                            <div className='video-scaler' style={_styleForVideoPlayer}></div>
                            {this.renderLoadingIndicator()}
                            <video ref={'mediaElement'}
                                autoPlay={eCourseWorkFileStore.instance.doAutoPlay()}
                                onTimeUpdate={this.updateSeekTime}
                                onEnded={this.mediaPlayEnd}
                                onLoadedMetadata={this.loadedMetaData}
                                onError={this.onError}
                                onLoadedData={this.onLoadedData}
                                onSeeking={this.onSeeking}
                                onLoadStart={this.onLoadStart}
                                onPlaying={this.onPlaying}
                                onSeeked={this.onSeeked}
                                onWaiting={this.onWaiting}
                                onCanPlay={this.onCanPlay}
                                src={this.updateMediaSource()}
                                id='videoplayer'
                                preload='metadata'
                                className='video-player media-file'>
                                {localeStore.instance.TranslateText('marking.response.media-player.browser-not-supported-error')}
                            </video>
                        </div>
                        <div className='player-control-bar'>
                            <div className='player-control-group left'>
                                <div className='player-control icon'>
                                    <a href='#' className={'playback ' + currentAction}
                                        onClick={this.playOrPause}
                                        title={localeStore.instance.TranslateText
                                            ('marking.response.media-player.play-pause-button-tooltip')}>
                                        <span className='svg-icon playback-icon'>
                                            <svg viewBox='0 0 14 20' className='play-pause-icon'>
                                                <use xlinkHref='#play-icon' className='play-icon'>
                                                    {localeStore.instance.TranslateText
                                                        ('marking.response.media-player.play-button-tooltip')}
                                                </use>
                                                <use xlinkHref='#pause-icon' className='pause-icon'>
                                                    {localeStore.instance.TranslateText
                                                        ('marking.response.media-player.pause-button-tooltip')}
                                                </use>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                                <div className='player-control label time-elapsed'>
                                    <span className='elapsed-time'>{this.state.currentTime}</span>
                                    <span className='time-seperator'>/</span>
                                    <span className='total-duration'>{this.state.totalDuration}</span>
                                </div>
                            </div>
                            <div className='player-control-group center'>
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
                            </div>
                            <div className='player-control-group right'>
                                {this.renderVolumeControl()}
                                <div className='player-control right-buttons'>
                                    {this.renderPlayerModeIcon(false)}
                                    {this.renderDownloadButton()}
                                    <div className='full-screen-view'>
                                        <a href='#' className='view-fullscreen' title='Full screen/Exit full screen'
                                            onClick={this.onChangeScreenMode} >
                                            <span className='svg-icon'>
                                                <svg viewBox='0 0 32 32' className='toggle-full-screen-icon'>
                                                    <use xlinkHref='#fullscreen-icon' className='full-screen-icon'>
                                                        {localeStore.instance.TranslateText
                                                            ('marking.response.media-player.full-screen-button-tooltip')}
                                                    </use>
                                                    <use xlinkHref='#exit-fullscreen-icon' className='exit-full-screen-icon'>
                                                        {localeStore.instance.TranslateText
                                                            ('marking.response.media-player.exit-full-screen-button-tooltip')}
                                                    </use>
                                                </svg>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.renderDefinitions()
                    }
                    <div>
                        {
                            this.renderErrorDialog()
                        }
                    </div>
                </div>
            </div>
        );
    }

    /**
     * To change the screen mode
     */
    protected onChangeScreenMode = (evt: any): void => {
        evt.preventDefault();
        this.setState({ isFullScreen: !this.state.isFullScreen });
    }
}
export = VideoPlayer;

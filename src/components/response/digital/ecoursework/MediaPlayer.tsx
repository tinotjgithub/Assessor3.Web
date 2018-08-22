import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import MediaPlayerIcon = require('./icon/mediaplayericon');
let mediaPlayerIconData = require('./mediaplayericon.json');
declare let config: any;
import localeStore = require('../../../../stores/locale/localestore');
import htmlutilities = require('../../../../utility/generic/htmlutilities');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import DownloadIcon = require('./downloadicon');
import Configurablecharacteristicshelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import Configurablecharacteristicsname = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import qigStore = require('../../../../stores/qigselector/qigstore');
import eCourseworkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import enums = require('../../../utility/enums');
import MediaErrorDialog = require('../../../logging/mediaerrordialog');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import worklistStore = require('../../../../stores/worklist/workliststore');
import eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import scriptHelper = require('../../../../utility/script/scripthelper');
import responseStore = require('../../../../stores/response/responsestore');
import stringHelper = require('../../../../utility/generic/stringhelper');
import PlayerModeIcon = require('./playermodeicon');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
import constants = require('../../../utility/constants');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');
import markingStore = require('../../../../stores/marking/markingstore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');

interface Props extends LocaleSelectionBase, PropsBase {
    src: string;
    alternateFileSource?: string;
    docPageID: number;
    onCreateNewExceptionClicked: Function;
}

interface State extends LocaleSelectionBase {
    // Whether media player is in fullscreen
    isFullScreen: boolean;
    // Whether media player is currently playing
    isPlaying: boolean;
    // Whether media player sound is muted
    isMuted: boolean;
    // media player sound volume level
    volumeLevel: number;
    // media player sound previous volume level
    previousVolumeLevel: number;
    // media player seek position
    seekPosition: number;
    // media player current time
    currentTime: number;
    // total duration time
    totalDuration: number;
    // is error log display or not
    isErrorDialogDisplaying: boolean;
    // set the retry attempt count
    retryAttemptCount: number;
    //play ended flag
    hasPlayEnded: boolean;
    //file is loading
    isLoadingFile: boolean;
    // rendered on for media player
    renderedOn: number;
}

/**
 * React Component class for the media player component
 */
class MediaPlayer extends pureRenderComponent<any, any>{

    private retryAttemptCount: number = 1;
    private responseData: any;
    private isCurrentFileAlreadyViewed: boolean = false;
    private mediaPlayerTime: number = 0;

    // View more comments display in error dialog popup
    public _errorViewmoreContent: string;
    public errorContentKey: string;


    protected mediaErrorHeader: string;
    protected genericErrorContent: string;
    protected networkErrorContent: string;
    protected playerMode: enums.MediaSourceType = enums.MediaSourceType.OriginalFile;
    protected videoPlayerWidth: number;
    protected videoPlayerPadding: number;
    protected isPlayerReady: boolean;
    private isQuickLinkVisible: boolean = true;

    /** refs */
    public refs: {
        [key: string]: (Element);
        mediaElement: (HTMLMediaElement);
    };

    /**
     *
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.getResponseDetails();
        this.updatefileReadStatus = this.updatefileReadStatus.bind(this);
        this.state = {
            renderedOn: 0,
            hasPlayEnded: false
        };
    }

    /**
     * reseting the player properties
     * @param nxtProps
     */
    public componentWillReceiveProps(nxtProps: Props) {
        this.mediaPlayerTime = this.refs.mediaElement.currentTime;
        if (this.props.src !== nxtProps.src) {
            this.retryAttemptCount = 1;
            this.mediaPlayerTime = 0;
            //Def #65941  saving player saved preference only when player is loaded in the screen ( video)
            if (this.isPlayerReady){
                this.saveMediaPlayerUserPreference();
            }
            this.reInitMediaPlayerValues();
            this.getResponseDetails();
        }
    }

    /**
     * method for getting the response data.
     */
    private getResponseDetails() {
        let _displayId: string = responseStore.instance.selectedDisplayId ?
            responseStore.instance.selectedDisplayId.toString() : '';
        this.responseData =
            (!standardisationSetupStore.instance.isSelectResponsesWorklist) ?
                markerOperationModeFactory.operationMode.openedResponseDetails(_displayId) :
                standardisationSetupStore.instance.fetchSelectedScriptDetails(standardisationSetupStore.instance.selectedResponseId);
    }

    /**
     * Component Did Mount
     */
    public componentDidMount() {
        if (this.refs.mediaElement) {
            this.refs.mediaElement.addEventListener('playing', this.updatefileReadStatus);
        }
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT, this.pause);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT,
            this.changePlayerMode);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);

    }

    /**
     * Component will Unmount
     */
    public componentWillUnmount() {

        //Def #65941  saving player saved preference only when player is loaded in the screen ( video)
        if (this.isPlayerReady){
            this.saveMediaPlayerUserPreference();
        }

        if (this.refs.mediaElement) {
            this.refs.mediaElement.pause();
            this.refs.mediaElement.removeEventListener('playing', this.updatefileReadStatus);
            // we need to clear the source url and need to reload the media element to clear the memory.
            // Defect fix #59272 #60014
            this.refs.mediaElement.src = '';
            this.refs.mediaElement.load();
        }
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT, this.pause);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT,
            this.changePlayerMode);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    }

    /**
     * Function for rendering definitions
     */
    protected renderDefinitions(): JSX.Element {
        let style = {
            display: 'none'
        };

        return (
            <svg version='1.1' style={style}>
                <defs>

                    <MediaPlayerIcon id='play-icon'
                        key='play-icon'
                        svgImageData={mediaPlayerIconData.play_icon} />

                    <MediaPlayerIcon id='pause-icon'
                        key='pause-icon'
                        svgImageData={mediaPlayerIconData.pause_icon} />

                    <MediaPlayerIcon id='mute-icon'
                        key='mute-icon'
                        svgImageData={mediaPlayerIconData.mute_icon} />

                    <MediaPlayerIcon id='download-file-icon'
                        key='download-file-icon'
                        svgImageData={mediaPlayerIconData.download_file_icon} />

                    <MediaPlayerIcon id='fullscreen-icon'
                        key='fullscreen-icon'
                        svgImageData={mediaPlayerIconData.fullscreen_icon} />

                    <MediaPlayerIcon id='exit-fullscreen-icon'
                        key='exit-fullscreen-icon'
                        svgImageData={mediaPlayerIconData.exit_fullscreen_icon} />
                </defs>
            </svg>
        );
    }

    /**
     * Play or pause
     * @param {any} evt
     */
    protected playOrPause = (evt: any): void => {
        evt.preventDefault();
        if (this.refs.mediaElement.paused && htmlutilities.isOnline) {
            // Play the mediaplayer
            this.play();
        } else {
            // Pause the mediaplayer
            this.pause(evt);
        }
    }

    /**
     * Plays the media player
     * @param {any} evt
     */
    protected play = (): void => {
        this.refs.mediaElement.play();
        this.setState({
            isPlaying: true
        });
    }

    /**
     * pause the media player
     * @param {any} evt
     */
    protected pause = (evt: any): void => {
        this.refs.mediaElement.pause();
        this.setState({ isPlaying: false });
    }

    /**
     * change the source type of media player
     */
    protected changePlayerMode = (sourceType: enums.MediaSourceType, isFromErrorDialog: boolean): void => {
        // Set the states and then plays the file
        if (this.playerMode !== sourceType) {
            this.playerMode = sourceType;
            // Reset the user preference when the player mode is changed
            this.saveMediaPlayerUserPreference(true);
            this.reInitMediaPlayerValues();
        }
    }

    /**
     * loaded the media player
     * @param {any} evt
     */
    protected loadedMetaData = (evt: any): void => {

        this.isCurrentFileAlreadyViewed = false;

        this.setPlayerSize(evt);

        let minutes = Math.floor(Math.ceil(this.refs.mediaElement.duration) / 60);
        let secs = Math.ceil(this.refs.mediaElement.duration) - minutes * 60;

        let mediaPlayerTotalDuration = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);

        this.setState({
            totalDuration: mediaPlayerTotalDuration,
            isPlaying: false
        });

        markingActionCreator.setMarkEntrySelected(false);

        /// remove the listener when network comes as online
        if (htmlutilities.isOnline) {
            applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.reloadWhenOnline);
        }
    }

    /**
     * sets the video player width and padding
     */
    public setPlayerSize(evt: any) {

        let paddingTop: number;
        let videoWidth: number;
        let videoHeight: number;

        videoHeight = evt.currentTarget.videoHeight;
        videoWidth = evt.currentTarget.videoWidth;
        paddingTop = (videoHeight / videoWidth) * 100;

        //if the width is undefined or zero we need to set the minimum width.
        if (!videoWidth || paddingTop < constants.VIDEO_PLAYER_MIN_PADDING || videoWidth < constants.VIDEO_PLAYER_MIN_WIDTH) {

            this.setDefaultPlayerWidth();

        } else {

            this.videoPlayerPadding = paddingTop;
            this.videoPlayerWidth = videoWidth;

            // Once the player width and padding is set,
            // player can be shown.
            this.isPlayerReady = true;
        }
    }

    /**
     * Sets a minimum width for the player just in case
     */
    private setDefaultPlayerWidth(): void {

        this.videoPlayerPadding = constants.VIDEO_PLAYER_MIN_PADDING;
        this.videoPlayerWidth = constants.VIDEO_PLAYER_MIN_WIDTH;

        // Once the player width and padding is set,
        // player can be shown.
        this.isPlayerReady = true;
    }

    /**
     * Reset Ecoursework file url on response navigate.
     */
    private onResponseOpened = () => {
        // Reset the stored user preference once the file has finished playing
        this.saveMediaPlayerUserPreference(true);
        if (this.refs.mediaElement && this.refs.mediaElement.currentTime) {
            this.refs.mediaElement.currentTime = 0;
            this.refs.mediaElement.pause();
            this.setState({ isPlaying: false, seekPosition: 0, currentTime: '00:00' });
        }
    }

    /**
     * to reset the media player values
     */
    private reInitMediaPlayerValues() {

        this.refs.mediaElement.muted = eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume === 0;

        this.setState({
            renderedOn: Date.now(),
            currentTime: '00:00',
            isMuted: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume === 0,
            seekPosition: 0,
            previousVolumeLevel: 1,
            volumeLevel: eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume,
            totalDuration: '00:00',
            isPlaying: false,
            isFullScreen: false,
            isLoadingFile: false,
            hasPlayEnded: false
        });
    }

    /**
     * Saves the media player user preference
     * doReset : resets the preference of the player.
     * same docPageID can have both original and transcoded file.
     * when switching the player mode, perference needs to be reset.
     */
    private saveMediaPlayerUserPreference(doReset?: boolean) {

        let volumeLevel: number;
        let currentTime: number;

        if (doReset) {
            volumeLevel = 100;
            currentTime = 0;
        } else {
            volumeLevel = this.state.volumeLevel;
            currentTime = this.refs.mediaElement.currentTime;
        }

        ecourseworkResponseActionCreator.saveMediaPlayerUserPreference(this.props.docPageID, volumeLevel, currentTime);
    }

    /**
     * Loads the user preference for the media player.
     */
    private loadMediaPlayerUserPreference() {
        if (eCourseWorkFileStore.instance.selectedMediaLastPlayedTime > 0) {
            this.refs.mediaElement.currentTime = eCourseWorkFileStore.instance.selectedMediaLastPlayedTime;
        }
        this.loadPlayerControls(eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume);
    }



    /**
     * update the mediaplayer controls from loadeddata event
     */
    private loadPlayerControls(volumeLevel: number): void {
        // fix for video seekbar (def 65964) .
        // update the mediaplayer for the first time while loading
        // controls value from saved preference  from loadeddata event
        this.refs.mediaElement.volume = volumeLevel / 100;
        if (!isNaN(this.refs.mediaElement.duration)) {
            let value = (100 / this.refs.mediaElement.duration) * this.refs.mediaElement.currentTime;
            let minutes = Math.floor(Math.ceil(this.refs.mediaElement.currentTime) / 60);
            let secs = Math.ceil(this.refs.mediaElement.currentTime) - minutes * 60;
            let currentTime = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);
            this.setState({
                seekPosition: value,
                currentTime: currentTime,
                isMuted: volumeLevel === 0,
                volumeLevel: volumeLevel
            });
        } else {
            // if mediaplayer duration  is undefined setting player volume from store value
            this.setState({
                isMuted: volumeLevel === 0,
                volumeLevel: volumeLevel
            });
        }
    }

    /**
     * Adjust the media player
     * @param {any} evt
     */
    protected changeVolume = (evt: any): void => {
        //update the mediaplayer mute state
        if (this.refs.mediaElement.muted) {
            this.refs.mediaElement.muted = false;
        }

        this.setPlayerVolume(Number(evt.target.value));
    }

    /**
     * Update the media player volume in player
     */
    private setPlayerVolume(volumeLevel: number): void {

        this.refs.mediaElement.volume = volumeLevel / 100;
        this.setState({ isMuted: volumeLevel === 0, volumeLevel: volumeLevel });
    }

    /**
     * Mute or unmute the media player
     * @param {any} evt
     */
    protected muteOrUnmute = (evt: any): void => {
        if (!this.refs.mediaElement.muted) {
            // Mute the media player
            this.refs.mediaElement.muted = true;
            this.refs.mediaElement.volume = 0;
            this.setState({ isMuted: true, previousVolumeLevel: this.state.volumeLevel, volumeLevel: 0 });
        } else {
            // Unmute the media player
            this.refs.mediaElement.muted = false;
            this.refs.mediaElement.volume = this.state.previousVolumeLevel / 100;
            this.setState({ isMuted: false, volumeLevel: this.state.previousVolumeLevel });
        }
    }

    /**
     * Seeks media player to a specific position
     * @param {any} evt
     */
    protected seek = (evt: any): void => {
        // Calculate the new time
        if (!isNaN(this.refs.mediaElement.duration)) {
            let newSeekTime = this.refs.mediaElement.duration * (Number(evt.target.value) / 100);
            this.refs.mediaElement.currentTime = newSeekTime;
        }
    }

    /**
     * Update the media player seek position
     * @param {any} evt
     */
    protected updateSeekTime = (evt: any): void => {
        // Calculate the slider value
        if (!isNaN(this.refs.mediaElement.duration)) {
            let value = (100 / this.refs.mediaElement.duration) * this.refs.mediaElement.currentTime;
            let minutes = Math.floor(Math.ceil(this.refs.mediaElement.currentTime) / 60);
            let secs = Math.ceil(this.refs.mediaElement.currentTime) - minutes * 60;
            let currentTime = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);
            this.setState({ seekPosition: value, currentTime: currentTime });
        }
    }

    /**
     * On media player end
     * @param {any} evt
     */
    protected mediaPlayEnd = (evt: any): void => {
        // Reset the stored user preference once the file has finished playing
        this.saveMediaPlayerUserPreference(true);
        // playback end fix for IE
        this.refs.mediaElement.currentTime = 0;
        this.refs.mediaElement.pause();
        this.setState({ isPlaying: false, seekPosition: 0, currentTime: '00:00', hasPlayEnded: true });
    }

    /**
     * change the seek position on tocuh
     */
    protected touchEnd = (evt: any): void => {
        if (htmlutilities.isIPadDevice) {
            let width = document.getElementById('time-silder').getBoundingClientRect().width;
            let start = document.getElementById('time-silder').getBoundingClientRect().left;
            let end = evt.changedTouches[0].clientX;
            let position = Math.round(((end - start) / width) * 100);
            let newSeekTime = this.refs.mediaElement.duration * (position / 100);
            this.refs.mediaElement.currentTime = newSeekTime;
        }
        this.play();
    }

    /**
     * get volume control visibility
     */
    protected renderVolumeControl(): any {
        let _styleForVolumeSlider: React.CSSProperties = {};
        let volumAction = this.state.isMuted ? 'unmute' : 'mute';
        _styleForVolumeSlider.width = this.state.volumeLevel + '%';
        return !htmlutilities.isIPadDevice ? (<div className='player-control volume'>
            <a href='#' className={'volume-mute ' + volumAction}
                onClick={this.muteOrUnmute}
                title={localeStore.instance.TranslateText('marking.response.media-player.mute-unmute-button-tooltip')}>
                <span className='svg-icon'>
                    <svg viewBox='0 0 28 22' className='audio-icon'>
                        <use xmlnsXlink='http://www.w3.org/1999/xlink'
                            xlinkHref='#volume-control'
                            className='unmute-icon'>
                            {localeStore.instance.TranslateText('marking.response.media-player.unmute-button-tooltip')}
                        </use>
                        <use xmlnsXlink='http://www.w3.org/1999/xlink'
                            xlinkHref='#mute-icon'
                            className='mute-icon'>{localeStore.instance.TranslateText('marking.response.media-player.mute-button-tooltip')}
                        </use>
                    </svg>
                </span>
            </a>
            <div className='slider'>
                <div className='slider-track'></div>
                <label htmlFor='volume-label' className='player-input-label'>
                    {localeStore.instance.TranslateText('marking.response.media-player.volume-slider-tooltip')}
                </label>
                <input type='range' min='0' max='100'
                    className='slider-input volume'
                    id='volume-label'
                    onChange={this.changeVolume}
                    value={this.state.volumeLevel} />
                <div className='slider-progress' style={_styleForVolumeSlider}>
                    <div className='seek-btn'></div>
                </div>
            </div>
        </div>) : null;
    }

    /**
     * Error dialog visibility
     */
    protected renderErrorDialog(): any {
        return (<MediaErrorDialog isOpen={this.state.isErrorDialogDisplaying}
            isCustomError={false}
            header={this.mediaErrorHeader}
            content={this.errorContentKey}
            viewMoreContent={this._errorViewmoreContent}
            onOkClick={this.onErrorOkClick}
            showErrorIcon={true}
            src={this.updateMediaSource()}
            isTranscodedExists={this.props.alternateFileSource !== null ? true : false}
            playerMode={this.playerMode}
            candidateScriptId={this.responseData.candidateScriptId}
            markGroupId={this.responseData.markGroupId}
            onCreateNewExceptionClicked={this.props.onCreateNewExceptionClicked}
            isQuickLinkVisible={this.isQuickLinkVisible}
            selectedLanguage={this.props.selectedLanguage} />);
    }

    /**
     * Invoked on the OK click of the error dialog window
     */
    protected onErrorOkClick() {
        // on error we need to set the default player size
        this.setDefaultPlayerWidth();
        this.setState({ isErrorDialogDisplaying: false });
        markingActionCreator.setMarkEntrySelected();
        this.isQuickLinkVisible = true;

        if (!htmlutilities.isOnline) {
            applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.reloadWhenOnline);
        }
    }

    /**
     * Load the media player when reloadWhenOnline method triggered.
     */
    private reloadWhenOnline = (): void => {
        if (applicationStore.instance.isOnline) {
            this.refs.mediaElement.load();
        }
    };

    /**
     * get the error details
     */
    protected onError = (evt: any): void => {
        // for removing the mark entry selection when error dialog opened
        markingActionCreator.removeMarkEntrySelection();
        switch (this.refs.mediaElement.error.code) {
            case this.refs.mediaElement.error.MEDIA_ERR_ABORTED:
            case this.refs.mediaElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                // checking offline problems while fetching source url
                if (this.refs.mediaElement.error.code === this.refs.mediaElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED &&
                    !htmlutilities.isOnline) {
                    this.handleNetworkError(evt);
                    this.isQuickLinkVisible = false;
                } else {
                    this.handleGenericError(evt);
                }
                break;
            case this.refs.mediaElement.error.MEDIA_ERR_DECODE:
                if (htmlutilities.isIE || htmlutilities.isEdge) {
                    this.handleNetworkError(evt);
                } else {
                    this.handleGenericError(evt);
                }
                break;
            case this.refs.mediaElement.error.MEDIA_ERR_NETWORK:
                // auto mediaplayer reload after any media file issues
                this.handleNetworkError(evt);
                break;
            default:
                this.errorContentKey = this.genericErrorContent;
                this.setState({ isErrorDialogDisplaying: true });
                break;
        }
    }

    /**
     * This method will check whether Error code 4 is thrown due to offline or not
     * @private
     * @memberof MediaPlayer
     */
    private isOfflineError = (): boolean => {
        let isOfflineError: boolean = false;
        if ((htmlutilities.isIE || htmlutilities.isEdge)) {
            // offline check for IE and Edge
            isOfflineError = this.refs.mediaElement.error.msExtendedCode &&
                this.refs.mediaElement.error.msExtendedCode === constants.MEDIA_ERROR_MS_EXTENDED_CODE_OFFLINE;
        } else {
            // offline error check for chrome
            isOfflineError = this.refs.mediaElement.error.message &&
                this.refs.mediaElement.error.message.indexOf('MEDIA_ELEMENT_ERROR') !== -1;
        }
        return isOfflineError;
    }

    /**
     * event listner for audio/video load complete event
     */
    protected onLoadedData = (event: any): void => {

        if (this.refs.mediaElement instanceof HTMLVideoElement || this.refs.mediaElement instanceof HTMLAudioElement) {

            if (this.retryAttemptCount === 1) {
                this.loadMediaPlayerUserPreference();
            }

            //Ie issue fix after packet has  expired
            if (this.refs.mediaElement.readyState >= 2 && this.mediaPlayerTime > 0
                && this.mediaPlayerTime !== undefined && !this.state.hasPlayEnded) {
                if (!isNaN(this.refs.mediaElement.duration)) {
                    this.refs.mediaElement.currentTime = this.mediaPlayerTime;
                }
            }

            if ((this.refs.mediaElement.currentTime > 0 || htmlutilities.isIE
                || htmlutilities.isEdge || htmlutilities.getUserDevice().userDevice === 'Mac') &&
                (this.refs.mediaElement.readyState >= 2 && (eCourseWorkFileStore.instance.doAutoPlay()
                    || this.mediaPlayerTime > 0) && !this.state.hasPlayEnded)) {
                this.play();
            }
        }
        this.retryAttemptCount = 1;
    }

    /**
     * event listner for audio/video load complete event
     */
    protected onLoadStart = (): void => {
        this.setState({ isLoadingFile: true });
    }

    /**
     * event listner for audio/video isplaying event
     */
    protected onPlaying = (): void => {
        this.setState({ isLoadingFile: false, isPlaying: true });
    }

    /**
     * event listner for playing event
     */
    protected onCanPlay = (): void => {
        this.setState({ isLoadingFile: false });
    }

    /**
     * waiting event(IE) for mediaplayer
     */
    protected onSeeking = (): void => {
        //waiting event for ie and edge
        if (htmlutilities.isIE || htmlutilities.isEdge) {
            //loading logic display logic
            if (this.refs.mediaElement.currentTime !== 0) {
                this.setState({
                    isLoadingFile: true
                });
            }
            // device new file selection scenario
            if (this.refs.mediaElement.paused) {
                this.setState({
                    isLoadingFile: false
                });
            }
        }
    }

    /**
     * seek complete for audio
     */
    protected onSeeked = (evt: any): void => {
        // seek completed for audio  & video (ie)
        this.setState({
            isLoadingFile: false
        });
    }

    /**
     * event listner for audio/video load complete event
     */
    protected onWaiting = (): void => {
        //waiting event not working with ie and edge
        if (!htmlutilities.isIE && !htmlutilities.isEdge) {
            this.setState({ isLoadingFile: true });
        }
    }

    /**
     * loading indicator component
     */
    protected renderLoadingIndicator(): JSX.Element {
        //loading indicator for audio/video
        return (this.state.isLoadingFile ?
            <LoadingIndicator id='loading' key='loading' isFrv={true} cssClass='section-loader media-loader loading' />
            : null);
    }

    /**
     * render download icon
     */
    protected renderDownloadButton(): JSX.Element {
        if (this.isDownloadButtonVisible()) {
            return (
                <DownloadIcon
                    id={'download_audio'}
                    key={'download_audio'}
                    selectedLanguage={this.props.selectedLanguage}
                    src={this.updateMediaSource()}
                    updateFileViewStatus={this.updatefileReadStatus}
                    pauseMediaPlayerOnDownloading={this.pauseMediaPlayerOnDownloading} />);
        }
    }

    /**
     * render filechange icon
     */
    protected renderPlayerModeIcon(isAudioPlayer): JSX.Element {
        if (this.props.alternateFileSource !== null) {
            let isAlternateFileDownloadable = eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable;
            return (
                <PlayerModeIcon
                    id={'file_change_icon'}
                    key={'file_change_icon'}
                    selectedLanguage={this.props.selectedLanguage}
                    isVisible={true}
                    candidateScriptId={this.responseData.candidateScriptId}
                    isAudioPlayer={isAudioPlayer}
                    playerMode={this.playerMode}
                    updateFileViewStatus={this.updatefileReadStatus}
                    pauseMediaPlayerOnDownloading={this.pauseMediaPlayerOnDownloading}
                    isAlternateFileDownloadable={isAlternateFileDownloadable} />
            );
        }

    }

    /**
     * To check the visibility
     */
    protected isDownloadButtonVisible(): boolean {
        let qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        let selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter((x: eCourseworkFile) =>
            (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio)).first() : undefined;
        // if the cc AllowDownloadofAllFiles is enabled or the doc permission is set for the
        if (Configurablecharacteristicshelper.getCharacteristicValue
            (Configurablecharacteristicsname.AllowDownloadOfAllFiles, qigId).toLowerCase() === 'true'
            || (selectedFile && selectedFile.docPermission === 1)) {
            return true;
        }

        return false;
    }

    /**
     * To update the view status of file
     */
    private updatefileReadStatus = (evt?: any, doUpdate: boolean = false): void => {
        // for updating read status of downloaded media files
        if (!this.isCurrentFileAlreadyViewed && this.refs.mediaElement && (!this.refs.mediaElement.error || doUpdate)) {
            this.isCurrentFileAlreadyViewed = true;
            if (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !standardisationSetupStore.instance.isSelectResponsesWorklist &&
                !worklistStore.instance.isMarkingCheckAvailable) {

                let markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ? this.responseData.esMarkGroupId :
                                                    this.responseData.markGroupId;
                // Invoke action creator to set selected ecoursework file read status and in progress status as true.
                eCourseWorkHelper.updatefileReadStatusProgress(markGroupId, this.props.docPageID);
            }
        }
    }


    /**
     * to handle generic error
     */
    private handleGenericError = (evt: any): void => {
        // for generic error
        this.errorContentKey = this.genericErrorContent;
        this._errorViewmoreContent = stringHelper.format(
            localeStore.instance.TranslateText('marking.response.media-player-error-dialog.error-details'),
            [evt.target.error.code, evt.target.innerHTML]);
        this.setState({ isErrorDialogDisplaying: true, isLoadingFile: false, currentTime: '00:00' });
    }

    /**
     * to handle network error
     */
    private handleNetworkError = (evt: any): void => {
        // for network error
        if (this.retryAttemptCount > config.general.RETRY_ATTEMPT_COUNT) {
            this.errorContentKey = this.networkErrorContent;
            this._errorViewmoreContent = stringHelper.format(
                localeStore.instance.TranslateText('marking.response.media-player-error-dialog.error-details'),
                [evt.target.error.code, evt.target.innerHTML]);
            this.setState({ isErrorDialogDisplaying: true, isLoadingFile: false, isPlaying: false, currentTime: '00:00' });
        } else {
            this.retryAttemptCount = this.retryAttemptCount + 1;
            this.mediaPlayerTime = this.refs.mediaElement.currentTime;
            if (!this.state.hasPlayEnded) {
                this.refs.mediaElement.load();
            }
        }
    }

    /**
     * To update the media source of the media player
     */
    protected updateMediaSource(): string {

        return ((this.playerMode === enums.MediaSourceType.OriginalFile || this.playerMode === undefined) ?
            this.props.src : this.props.alternateFileSource);
    }

    /**
     * To pause an audio/video player before downloading the file
     */
    protected pauseMediaPlayerOnDownloading(evt?: any): void {
        if (this.state.isPlaying) {
            this.pause(evt);
        }
    }

    /**
     * setting the selected player mode by referring the store for persistence
     */
    protected setPlayerMode() {
        let selectedFile = eCourseWorkFileStore.instance.getSelectedPlayableFile();
        this.playerMode = (selectedFile) ?
            (selectedFile.playerMode ? selectedFile.playerMode : enums.MediaSourceType.OriginalFile)
            : enums.MediaSourceType.OriginalFile;
    }

}
export = MediaPlayer;
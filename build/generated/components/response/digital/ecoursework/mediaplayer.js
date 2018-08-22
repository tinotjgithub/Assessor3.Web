"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var MediaPlayerIcon = require('./icon/mediaplayericon');
var mediaPlayerIconData = require('./mediaplayericon.json');
var localeStore = require('../../../../stores/locale/localestore');
var htmlutilities = require('../../../../utility/generic/htmlutilities');
var eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
var DownloadIcon = require('./downloadicon');
var Configurablecharacteristicshelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var Configurablecharacteristicsname = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var qigStore = require('../../../../stores/qigselector/qigstore');
var enums = require('../../../utility/enums');
var MediaErrorDialog = require('../../../logging/mediaerrordialog');
var markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
var worklistStore = require('../../../../stores/worklist/workliststore');
var eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
var responseStore = require('../../../../stores/response/responsestore');
var stringHelper = require('../../../../utility/generic/stringhelper');
var PlayerModeIcon = require('./playermodeicon');
var markingActionCreator = require('../../../../actions/marking/markingactioncreator');
var ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
var LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
var constants = require('../../../utility/constants');
var applicationStore = require('../../../../stores/applicationoffline/applicationstore');
var markingStore = require('../../../../stores/marking/markingstore');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
/**
 * React Component class for the media player component
 */
var MediaPlayer = (function (_super) {
    __extends(MediaPlayer, _super);
    /**
     *
     * @param props
     * @param state
     */
    function MediaPlayer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.retryAttemptCount = 1;
        this.isCurrentFileAlreadyViewed = false;
        this.mediaPlayerTime = 0;
        this.playerMode = enums.MediaSourceType.OriginalFile;
        this.isQuickLinkVisible = true;
        /**
         * Play or pause
         * @param {any} evt
         */
        this.playOrPause = function (evt) {
            evt.preventDefault();
            if (_this.refs.mediaElement.paused && htmlutilities.isOnline) {
                // Play the mediaplayer
                _this.play();
            }
            else {
                // Pause the mediaplayer
                _this.pause(evt);
            }
        };
        /**
         * Plays the media player
         * @param {any} evt
         */
        this.play = function () {
            _this.refs.mediaElement.play();
            _this.setState({
                isPlaying: true
            });
        };
        /**
         * pause the media player
         * @param {any} evt
         */
        this.pause = function (evt) {
            _this.refs.mediaElement.pause();
            _this.setState({ isPlaying: false });
        };
        /**
         * change the source type of media player
         */
        this.changePlayerMode = function (sourceType, isFromErrorDialog) {
            // Set the states and then plays the file
            if (_this.playerMode !== sourceType) {
                _this.playerMode = sourceType;
                // Reset the user preference when the player mode is changed
                _this.saveMediaPlayerUserPreference(true);
                _this.reInitMediaPlayerValues();
            }
        };
        /**
         * loaded the media player
         * @param {any} evt
         */
        this.loadedMetaData = function (evt) {
            _this.isCurrentFileAlreadyViewed = false;
            _this.setPlayerSize(evt);
            var minutes = Math.floor(Math.ceil(_this.refs.mediaElement.duration) / 60);
            var secs = Math.ceil(_this.refs.mediaElement.duration) - minutes * 60;
            var mediaPlayerTotalDuration = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);
            _this.setState({
                totalDuration: mediaPlayerTotalDuration,
                isPlaying: false
            });
            markingActionCreator.setMarkEntrySelected(false);
            /// remove the listener when network comes as online
            if (htmlutilities.isOnline) {
                applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, _this.reloadWhenOnline);
            }
        };
        /**
         * Reset Ecoursework file url on response navigate.
         */
        this.onResponseOpened = function () {
            // Reset the stored user preference once the file has finished playing
            _this.saveMediaPlayerUserPreference(true);
            if (_this.refs.mediaElement.currentTime) {
                _this.refs.mediaElement.currentTime = 0;
                _this.refs.mediaElement.pause();
                _this.setState({ isPlaying: false, seekPosition: 0, currentTime: '00:00' });
            }
        };
        /**
         * Adjust the media player
         * @param {any} evt
         */
        this.changeVolume = function (evt) {
            //update the mediaplayer mute state
            if (_this.refs.mediaElement.muted) {
                _this.refs.mediaElement.muted = false;
            }
            _this.setPlayerVolume(Number(evt.target.value));
        };
        /**
         * Mute or unmute the media player
         * @param {any} evt
         */
        this.muteOrUnmute = function (evt) {
            if (!_this.refs.mediaElement.muted) {
                // Mute the media player
                _this.refs.mediaElement.muted = true;
                _this.refs.mediaElement.volume = 0;
                _this.setState({ isMuted: true, previousVolumeLevel: _this.state.volumeLevel, volumeLevel: 0 });
            }
            else {
                // Unmute the media player
                _this.refs.mediaElement.muted = false;
                _this.refs.mediaElement.volume = _this.state.previousVolumeLevel / 100;
                _this.setState({ isMuted: false, volumeLevel: _this.state.previousVolumeLevel });
            }
        };
        /**
         * Seeks media player to a specific position
         * @param {any} evt
         */
        this.seek = function (evt) {
            // Calculate the new time
            if (!isNaN(_this.refs.mediaElement.duration)) {
                var newSeekTime = _this.refs.mediaElement.duration * (Number(evt.target.value) / 100);
                _this.refs.mediaElement.currentTime = newSeekTime;
            }
        };
        /**
         * Update the media player seek position
         * @param {any} evt
         */
        this.updateSeekTime = function (evt) {
            // Calculate the slider value
            if (!isNaN(_this.refs.mediaElement.duration)) {
                var value = (100 / _this.refs.mediaElement.duration) * _this.refs.mediaElement.currentTime;
                var minutes = Math.floor(Math.ceil(_this.refs.mediaElement.currentTime) / 60);
                var secs = Math.ceil(_this.refs.mediaElement.currentTime) - minutes * 60;
                var currentTime = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);
                _this.setState({ seekPosition: value, currentTime: currentTime });
            }
        };
        /**
         * On media player end
         * @param {any} evt
         */
        this.mediaPlayEnd = function (evt) {
            // Reset the stored user preference once the file has finished playing
            _this.saveMediaPlayerUserPreference(true);
            // playback end fix for IE
            _this.refs.mediaElement.currentTime = 0;
            _this.refs.mediaElement.pause();
            _this.setState({ isPlaying: false, seekPosition: 0, currentTime: '00:00', hasPlayEnded: true });
        };
        /**
         * change the seek position on tocuh
         */
        this.touchEnd = function (evt) {
            if (htmlutilities.isIPadDevice) {
                var width = document.getElementById('time-silder').getBoundingClientRect().width;
                var start = document.getElementById('time-silder').getBoundingClientRect().left;
                var end = evt.changedTouches[0].clientX;
                var position = Math.round(((end - start) / width) * 100);
                var newSeekTime = _this.refs.mediaElement.duration * (position / 100);
                _this.refs.mediaElement.currentTime = newSeekTime;
            }
            _this.play();
        };
        /**
         * Load the media player when reloadWhenOnline method triggered.
         */
        this.reloadWhenOnline = function () {
            if (applicationStore.instance.isOnline) {
                _this.refs.mediaElement.load();
            }
        };
        /**
         * get the error details
         */
        this.onError = function (evt) {
            // for removing the mark entry selection when error dialog opened
            markingActionCreator.removeMarkEntrySelection();
            switch (_this.refs.mediaElement.error.code) {
                case _this.refs.mediaElement.error.MEDIA_ERR_ABORTED:
                case _this.refs.mediaElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    // checking offline problems while fetching source url
                    if (_this.refs.mediaElement.error.code === _this.refs.mediaElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED &&
                        !htmlutilities.isOnline) {
                        _this.handleNetworkError(evt);
                        _this.isQuickLinkVisible = false;
                    }
                    else {
                        _this.handleGenericError(evt);
                    }
                    break;
                case _this.refs.mediaElement.error.MEDIA_ERR_DECODE:
                    if (htmlutilities.isIE || htmlutilities.isEdge) {
                        _this.handleNetworkError(evt);
                    }
                    else {
                        _this.handleGenericError(evt);
                    }
                    break;
                case _this.refs.mediaElement.error.MEDIA_ERR_NETWORK:
                    // auto mediaplayer reload after any media file issues
                    _this.handleNetworkError(evt);
                    break;
                default:
                    _this.errorContentKey = _this.genericErrorContent;
                    _this.setState({ isErrorDialogDisplaying: true });
                    break;
            }
        };
        /**
         * This method will check whether Error code 4 is thrown due to offline or not
         * @private
         * @memberof MediaPlayer
         */
        this.isOfflineError = function () {
            var isOfflineError = false;
            if ((htmlutilities.isIE || htmlutilities.isEdge)) {
                // offline check for IE and Edge
                isOfflineError = _this.refs.mediaElement.error.msExtendedCode &&
                    _this.refs.mediaElement.error.msExtendedCode === constants.MEDIA_ERROR_MS_EXTENDED_CODE_OFFLINE;
            }
            else {
                // offline error check for chrome
                isOfflineError = _this.refs.mediaElement.error.message &&
                    _this.refs.mediaElement.error.message.indexOf('MEDIA_ELEMENT_ERROR') !== -1;
            }
            return isOfflineError;
        };
        /**
         * event listner for audio/video load complete event
         */
        this.onLoadedData = function (event) {
            if (_this.refs.mediaElement instanceof HTMLVideoElement || _this.refs.mediaElement instanceof HTMLAudioElement) {
                if (_this.retryAttemptCount === 1) {
                    _this.loadMediaPlayerUserPreference();
                }
                //Ie issue fix after packet has  expired
                if (_this.refs.mediaElement.readyState >= 2 && _this.mediaPlayerTime > 0
                    && _this.mediaPlayerTime !== undefined && !_this.state.hasPlayEnded) {
                    if (!isNaN(_this.refs.mediaElement.duration)) {
                        _this.refs.mediaElement.currentTime = _this.mediaPlayerTime;
                    }
                }
                if ((_this.refs.mediaElement.currentTime > 0 || htmlutilities.isIE
                    || htmlutilities.isEdge || htmlutilities.getUserDevice().userDevice === 'Mac') &&
                    (_this.refs.mediaElement.readyState >= 2 && (eCourseWorkFileStore.instance.doAutoPlay()
                        || _this.mediaPlayerTime > 0) && !_this.state.hasPlayEnded)) {
                    _this.play();
                }
            }
            _this.retryAttemptCount = 1;
        };
        /**
         * event listner for audio/video load complete event
         */
        this.onLoadStart = function () {
            _this.setState({ isLoadingFile: true });
        };
        /**
         * event listner for audio/video isplaying event
         */
        this.onPlaying = function () {
            _this.setState({ isLoadingFile: false, isPlaying: true });
        };
        /**
         * event listner for playing event
         */
        this.onCanPlay = function () {
            _this.setState({ isLoadingFile: false });
        };
        /**
         * waiting event(IE) for mediaplayer
         */
        this.onSeeking = function () {
            //waiting event for ie and edge
            if (htmlutilities.isIE || htmlutilities.isEdge) {
                //loading logic display logic
                if (_this.refs.mediaElement.currentTime !== 0) {
                    _this.setState({
                        isLoadingFile: true
                    });
                }
                // device new file selection scenario
                if (_this.refs.mediaElement.paused) {
                    _this.setState({
                        isLoadingFile: false
                    });
                }
            }
        };
        /**
         * seek complete for audio
         */
        this.onSeeked = function (evt) {
            // seek completed for audio  & video (ie)
            _this.setState({
                isLoadingFile: false
            });
        };
        /**
         * event listner for audio/video load complete event
         */
        this.onWaiting = function () {
            //waiting event not working with ie and edge
            if (!htmlutilities.isIE && !htmlutilities.isEdge) {
                _this.setState({ isLoadingFile: true });
            }
        };
        /**
         * To update the view status of file
         */
        this.updatefileReadStatus = function (evt, doUpdate) {
            if (doUpdate === void 0) { doUpdate = false; }
            // for updating read status of downloaded media files
            if (!_this.isCurrentFileAlreadyViewed && _this.refs.mediaElement && (!_this.refs.mediaElement.error || doUpdate)) {
                _this.isCurrentFileAlreadyViewed = true;
                if (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                    !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup &&
                    !worklistStore.instance.isMarkingCheckAvailable) {
                    var markGroupId = markerOperationModeFactory.operationMode.isStandardisationSetupMode ? _this.responseData.esMarkGroupId :
                        _this.responseData.markGroupId;
                    // Invoke action creator to set selected ecoursework file read status and in progress status as true.
                    eCourseWorkHelper.updatefileReadStatusProgress(markGroupId, _this.props.docPageID);
                }
            }
        };
        /**
         * to handle generic error
         */
        this.handleGenericError = function (evt) {
            // for generic error
            _this.errorContentKey = _this.genericErrorContent;
            _this._errorViewmoreContent = stringHelper.format(localeStore.instance.TranslateText('marking.response.media-player-error-dialog.error-details'), [evt.target.error.code, evt.target.innerHTML]);
            _this.setState({ isErrorDialogDisplaying: true, isLoadingFile: false, currentTime: '00:00' });
        };
        /**
         * to handle network error
         */
        this.handleNetworkError = function (evt) {
            // for network error
            if (_this.retryAttemptCount > config.general.RETRY_ATTEMPT_COUNT) {
                _this.errorContentKey = _this.networkErrorContent;
                _this._errorViewmoreContent = stringHelper.format(localeStore.instance.TranslateText('marking.response.media-player-error-dialog.error-details'), [evt.target.error.code, evt.target.innerHTML]);
                _this.setState({ isErrorDialogDisplaying: true, isLoadingFile: false, isPlaying: false, currentTime: '00:00' });
            }
            else {
                _this.retryAttemptCount = _this.retryAttemptCount + 1;
                _this.mediaPlayerTime = _this.refs.mediaElement.currentTime;
                if (!_this.state.hasPlayEnded) {
                    _this.refs.mediaElement.load();
                }
            }
        };
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
    MediaPlayer.prototype.componentWillReceiveProps = function (nxtProps) {
        this.mediaPlayerTime = this.refs.mediaElement.currentTime;
        if (this.props.src !== nxtProps.src) {
            this.retryAttemptCount = 1;
            this.mediaPlayerTime = 0;
            this.saveMediaPlayerUserPreference();
            this.reInitMediaPlayerValues();
            this.getResponseDetails();
        }
    };
    /**
     * method for getting the response data.
     */
    MediaPlayer.prototype.getResponseDetails = function () {
        var _displayId = responseStore.instance.selectedDisplayId ?
            responseStore.instance.selectedDisplayId.toString() : '';
        this.responseData =
            (!markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) ?
                markerOperationModeFactory.operationMode.openedResponseDetails(_displayId) :
                standardisationSetupStore.instance.fetchSelectedScriptDetails(standardisationSetupStore.instance.selectedResponseId);
    };
    /**
     * Component Did Mount
     */
    MediaPlayer.prototype.componentDidMount = function () {
        if (this.refs.mediaElement) {
            this.refs.mediaElement.addEventListener('playing', this.updatefileReadStatus);
        }
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT, this.pause);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT, this.changePlayerMode);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    };
    /**
     * Component will Unmount
     */
    MediaPlayer.prototype.componentWillUnmount = function () {
        this.saveMediaPlayerUserPreference();
        if (this.refs.mediaElement) {
            this.refs.mediaElement.pause();
            this.refs.mediaElement.removeEventListener('playing', this.updatefileReadStatus);
            // we need to clear the source url and need to reload the media element to clear the memory.
            // Defect fix #59272 #60014
            this.refs.mediaElement.src = '';
            this.refs.mediaElement.load();
        }
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT, this.pause);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT, this.changePlayerMode);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    };
    /**
     * Function for rendering definitions
     */
    MediaPlayer.prototype.renderDefinitions = function () {
        var style = {
            display: 'none'
        };
        return (React.createElement("svg", {version: '1.1', style: style}, React.createElement("defs", null, React.createElement(MediaPlayerIcon, {id: 'play-icon', key: 'play-icon', svgImageData: mediaPlayerIconData.play_icon}), React.createElement(MediaPlayerIcon, {id: 'pause-icon', key: 'pause-icon', svgImageData: mediaPlayerIconData.pause_icon}), React.createElement(MediaPlayerIcon, {id: 'mute-icon', key: 'mute-icon', svgImageData: mediaPlayerIconData.mute_icon}), React.createElement(MediaPlayerIcon, {id: 'download-file-icon', key: 'download-file-icon', svgImageData: mediaPlayerIconData.download_file_icon}), React.createElement(MediaPlayerIcon, {id: 'fullscreen-icon', key: 'fullscreen-icon', svgImageData: mediaPlayerIconData.fullscreen_icon}), React.createElement(MediaPlayerIcon, {id: 'exit-fullscreen-icon', key: 'exit-fullscreen-icon', svgImageData: mediaPlayerIconData.exit_fullscreen_icon}))));
    };
    /**
     * sets the video player width and padding
     */
    MediaPlayer.prototype.setPlayerSize = function (evt) {
        var paddingTop;
        var videoWidth;
        var videoHeight;
        videoHeight = evt.currentTarget.videoHeight;
        videoWidth = evt.currentTarget.videoWidth;
        paddingTop = (videoHeight / videoWidth) * 100;
        //if the width is undefined or zero we need to set the minimum width.
        if (!videoWidth || paddingTop < constants.VIDEO_PLAYER_MIN_PADDING || videoWidth < constants.VIDEO_PLAYER_MIN_WIDTH) {
            this.setDefaultPlayerWidth();
        }
        else {
            this.videoPlayerPadding = paddingTop;
            this.videoPlayerWidth = videoWidth;
            // Once the player width and padding is set,
            // player can be shown.
            this.isPlayerReady = true;
        }
    };
    /**
     * Sets a minimum width for the player just in case
     */
    MediaPlayer.prototype.setDefaultPlayerWidth = function () {
        this.videoPlayerPadding = constants.VIDEO_PLAYER_MIN_PADDING;
        this.videoPlayerWidth = constants.VIDEO_PLAYER_MIN_WIDTH;
        // Once the player width and padding is set,
        // player can be shown.
        this.isPlayerReady = true;
    };
    /**
     * to reset the media player values
     */
    MediaPlayer.prototype.reInitMediaPlayerValues = function () {
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
    };
    /**
     * Saves the media player user preference
     * doReset : resets the preference of the player.
     * same docPageID can have both original and transcoded file.
     * when switching the player mode, perference needs to be reset.
     */
    MediaPlayer.prototype.saveMediaPlayerUserPreference = function (doReset) {
        var volumeLevel;
        var currentTime;
        if (doReset) {
            volumeLevel = 100;
            currentTime = 0;
        }
        else {
            volumeLevel = this.state.volumeLevel;
            currentTime = this.refs.mediaElement.currentTime;
        }
        ecourseworkResponseActionCreator.saveMediaPlayerUserPreference(this.props.docPageID, volumeLevel, currentTime);
    };
    /**
     * Loads the user preference for the media player.
     */
    MediaPlayer.prototype.loadMediaPlayerUserPreference = function () {
        if (eCourseWorkFileStore.instance.selectedMediaLastPlayedTime > 0) {
            this.refs.mediaElement.currentTime = eCourseWorkFileStore.instance.selectedMediaLastPlayedTime;
        }
        this.loadPlayerControls(eCourseWorkFileStore.instance.selectedMediaLastPlayedVolume);
    };
    /**
     * update the mediaplayer controls from loadeddata event
     */
    MediaPlayer.prototype.loadPlayerControls = function (volumeLevel) {
        // fix for video seekbar (def 65964) .
        // update the mediaplayer for the first time while loading
        // controls value from saved preference  from loadeddata event
        this.refs.mediaElement.volume = volumeLevel / 100;
        if (!isNaN(this.refs.mediaElement.duration)) {
            var value = (100 / this.refs.mediaElement.duration) * this.refs.mediaElement.currentTime;
            var minutes = Math.floor(Math.ceil(this.refs.mediaElement.currentTime) / 60);
            var secs = Math.ceil(this.refs.mediaElement.currentTime) - minutes * 60;
            var currentTime = ('00' + minutes.toFixed(0)).slice(-2) + ':' + ('00' + secs.toFixed(0)).slice(-2);
            this.setState({
                seekPosition: value,
                currentTime: currentTime,
                isMuted: volumeLevel === 0,
                volumeLevel: volumeLevel
            });
        }
        else {
            // if mediaplayer duration  is undefined setting player volume from store value
            this.setState({
                isMuted: volumeLevel === 0,
                volumeLevel: volumeLevel
            });
        }
    };
    /**
     * Update the media player volume in player
     */
    MediaPlayer.prototype.setPlayerVolume = function (volumeLevel) {
        this.refs.mediaElement.volume = volumeLevel / 100;
        this.setState({ isMuted: volumeLevel === 0, volumeLevel: volumeLevel });
    };
    /**
     * get volume control visibility
     */
    MediaPlayer.prototype.renderVolumeControl = function () {
        var _styleForVolumeSlider = {};
        var volumAction = this.state.isMuted ? 'unmute' : 'mute';
        _styleForVolumeSlider.width = this.state.volumeLevel + '%';
        return !htmlutilities.isIPadDevice ? (React.createElement("div", {className: 'player-control volume'}, React.createElement("a", {href: '#', className: 'volume-mute ' + volumAction, onClick: this.muteOrUnmute, title: localeStore.instance.TranslateText('marking.response.media-player.mute-unmute-button-tooltip')}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 28 22', className: 'audio-icon'}, React.createElement("use", {xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#volume-control', className: 'unmute-icon'}, localeStore.instance.TranslateText('marking.response.media-player.unmute-button-tooltip')), React.createElement("use", {xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#mute-icon', className: 'mute-icon'}, localeStore.instance.TranslateText('marking.response.media-player.mute-button-tooltip'))))), React.createElement("div", {className: 'slider'}, React.createElement("div", {className: 'slider-track'}), React.createElement("label", {htmlFor: 'volume-label', className: 'player-input-label'}, localeStore.instance.TranslateText('marking.response.media-player.volume-slider-tooltip')), React.createElement("input", {type: 'range', min: '0', max: '100', className: 'slider-input volume', id: 'volume-label', onChange: this.changeVolume, value: this.state.volumeLevel}), React.createElement("div", {className: 'slider-progress', style: _styleForVolumeSlider}, React.createElement("div", {className: 'seek-btn'}))))) : null;
    };
    /**
     * Error dialog visibility
     */
    MediaPlayer.prototype.renderErrorDialog = function () {
        return (React.createElement(MediaErrorDialog, {isOpen: this.state.isErrorDialogDisplaying, isCustomError: false, header: this.mediaErrorHeader, content: this.errorContentKey, viewMoreContent: this._errorViewmoreContent, onOkClick: this.onErrorOkClick, showErrorIcon: true, src: this.updateMediaSource(), isTranscodedExists: this.props.alternateFileSource !== null ? true : false, playerMode: this.playerMode, candidateScriptId: this.responseData.candidateScriptId, markGroupId: this.responseData.markGroupId, onCreateNewExceptionClicked: this.props.onCreateNewExceptionClicked, isQuickLinkVisible: this.isQuickLinkVisible, selectedLanguage: this.props.selectedLanguage}));
    };
    /**
     * Invoked on the OK click of the error dialog window
     */
    MediaPlayer.prototype.onErrorOkClick = function () {
        // on error we need to set the default player size
        this.setDefaultPlayerWidth();
        this.setState({ isErrorDialogDisplaying: false });
        markingActionCreator.setMarkEntrySelected();
        this.isQuickLinkVisible = true;
        if (!htmlutilities.isOnline) {
            applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.reloadWhenOnline);
        }
    };
    /**
     * loading indicator component
     */
    MediaPlayer.prototype.renderLoadingIndicator = function () {
        //loading indicator for audio/video
        return (this.state.isLoadingFile ?
            React.createElement(LoadingIndicator, {id: 'loading', key: 'loading', isFrv: true, cssClass: 'section-loader media-loader loading'})
            : null);
    };
    /**
     * render download icon
     */
    MediaPlayer.prototype.renderDownloadButton = function () {
        if (this.isDownloadButtonVisible()) {
            return (React.createElement(DownloadIcon, {id: 'download_audio', key: 'download_audio', selectedLanguage: this.props.selectedLanguage, src: this.updateMediaSource(), updateFileViewStatus: this.updatefileReadStatus, pauseMediaPlayerOnDownloading: this.pauseMediaPlayerOnDownloading}));
        }
    };
    /**
     * render filechange icon
     */
    MediaPlayer.prototype.renderPlayerModeIcon = function (isAudioPlayer) {
        if (this.props.alternateFileSource !== null) {
            var isAlternateFileDownloadable = eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable;
            return (React.createElement(PlayerModeIcon, {id: 'file_change_icon', key: 'file_change_icon', selectedLanguage: this.props.selectedLanguage, isVisible: true, candidateScriptId: this.responseData.candidateScriptId, isAudioPlayer: isAudioPlayer, playerMode: this.playerMode, updateFileViewStatus: this.updatefileReadStatus, pauseMediaPlayerOnDownloading: this.pauseMediaPlayerOnDownloading, isAlternateFileDownloadable: isAlternateFileDownloadable}));
        }
    };
    /**
     * To check the visibility
     */
    MediaPlayer.prototype.isDownloadButtonVisible = function () {
        var qigId = qigStore.instance.selectedQIGForMarkerOperation !== undefined ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        var selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        var selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter(function (x) {
            return (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio);
        }).first() : undefined;
        // if the cc AllowDownloadofAllFiles is enabled or the doc permission is set for the
        if (Configurablecharacteristicshelper.getCharacteristicValue(Configurablecharacteristicsname.AllowDownloadOfAllFiles, qigId).toLowerCase() === 'true'
            || (selectedFile && selectedFile.docPermission === 1)) {
            return true;
        }
        return false;
    };
    /**
     * To update the media source of the media player
     */
    MediaPlayer.prototype.updateMediaSource = function () {
        return ((this.playerMode === enums.MediaSourceType.OriginalFile || this.playerMode === undefined) ?
            this.props.src : this.props.alternateFileSource);
    };
    /**
     * To pause an audio/video player before downloading the file
     */
    MediaPlayer.prototype.pauseMediaPlayerOnDownloading = function (evt) {
        if (this.state.isPlaying) {
            this.pause(evt);
        }
    };
    /**
     * setting the selected player mode by referring the store for persistence
     */
    MediaPlayer.prototype.setPlayerMode = function () {
        var selectedFile = eCourseWorkFileStore.instance.getSelectedPlayableFile();
        this.playerMode = (selectedFile) ?
            (selectedFile.playerMode ? selectedFile.playerMode : enums.MediaSourceType.OriginalFile)
            : enums.MediaSourceType.OriginalFile;
    };
    return MediaPlayer;
}(pureRenderComponent));
module.exports = MediaPlayer;
//# sourceMappingURL=mediaplayer.js.map
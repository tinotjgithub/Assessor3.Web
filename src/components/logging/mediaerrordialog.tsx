/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
let classNames = require('classnames');
import enums = require('../utility/enums');
import keydownHelper = require('../../utility/generic/keydownhelper');
import ErrorDialogBase = require('./errordialogbase');
import ecourseworkresponseActionCreator = require('../../actions/ecoursework/ecourseworkresponseactioncreator');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
import eCourseworkFile = require('../../stores/response/digital/typings/courseworkfile');
import exceptionHelper = require('../utility/exception/exceptionhelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import stringHelper = require('../../utility/generic/stringhelper');
import exceptionStore = require('../../stores/exception/exceptionstore');
declare let config: any;
import URLS = require('../../dataservices/base/urls');
import worklistStore = require('../../stores/worklist/workliststore');
import eCourseWorkHelper = require('../utility/ecoursework/ecourseworkhelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
/**
 * Props of ErrorDialog component
 */
interface Props extends LocaleSelectionBase {
    content: string;
    viewMoreContent: string;
    isOpen?: boolean;
    onOkClick: Function;
    isCustomError: boolean;
    header: string;
    showErrorIcon: boolean;
    src: string;
    playerMode: enums.MediaSourceType;
    newExceptionLink: string;
    isTranscodedExists: boolean;
    candidateScriptId: number;
    onCreateNewExceptionClicked: Function;
    markGroupId: number;
    isQuickLinkVisible: boolean;
}

/**
 * State of ErrorDialog component
 */
interface State {
    isViewMoreOpen?: enums.Tristate;
}

/**
 * React component class for Header for Authorized pages
 */
class MediaErrorDialog extends ErrorDialogBase {

    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isViewMoreOpen: enums.Tristate.notSet
        };
        this.onOkClick = this.onOkClick.bind(this);
        this.onDownloadLinkClick = this.onDownloadLinkClick.bind(this);
        this.onPlayAlternateFile = this.onPlayAlternateFile.bind(this);
        this.onRaiseNewExceptionClick = this.onRaiseNewExceptionClick.bind(this);
    }

    /**
     * Render
     */
    public render() {
        if (this.props.isOpen) {
            return (
                <div
                    id='mediaerrorPopup'
                    role='dialog'
                    aria-labelledby='popup5Title'
                    aria-describedby='popup5Desc'
                    className={classNames(
                        'popup small popup-overlay close-button error-popup',
                        {
                            'open': this.props.isOpen,
                            'close': !this.props.isOpen
                        }
                    )}
                >
                    <div id='mediaerrorpopupwrap' className='popup-wrap'>
                        {this.renderErrorDialogHeader()}
                        {this.renderContent()}
                        {this.renderOKButton()}
                    </div>
                </div >
            );
        } else {
            return null;
        }
    }

    /**
     * To render the content of error dialog
     */
    private renderContent(): JSX.Element {
        let fileExceptionTypeId: number = 25;
        let downloadexceptionlinks: JSX.Element;
        let isResponseReadOnly: boolean = markerOperationModeFactory.operationMode.isTeamManagementMode ||
        standardisationSetupStore.instance.isSelectResponsesWorklist
            || markerOperationModeFactory.operationMode.isAwardingMode;
        if (exceptionHelper.canRaiseException(isResponseReadOnly)
            && !exceptionStore.instance.isExceptionTypeRaisedAlready(fileExceptionTypeId)) {
            downloadexceptionlinks = this.props.isQuickLinkVisible ? (<span><a href='javascript:void(0);'
                id='downloadquicklink'
                onClick={this.onDownloadLinkClick}
            >{localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-download-file')}</a>
                {localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-or')}
                <a href='javascript:void(0);'
                    id='raiseException'
                    onClick={this.onRaiseNewExceptionClick}>
                    {localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-raise-exception')}
                </a>.
            </span>) : null;
        } else {
            downloadexceptionlinks = this.props.isQuickLinkVisible ? (<span><a href='javascript:void(0);'
                id='downloadquicklink'
                onClick={this.onDownloadLinkClick}
            >{localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-download-file')}</a>.</span>) :
                null;
        }

        return (
            <div className='popup-content' id='mediaErrorPopupContent'>
                <div className={classNames({
                    'indented': this.props.showErrorIcon
                })} >
                    <p>
                        {this.props.content}
                        {downloadexceptionlinks}
                        {this.getAlternateFileLink()}
                    </p>
                </div>
                {this.renderMoreInfo()}
            </div>
        );
    }

    /**
     * On click event handling of raise new exception
     */
    private onRaiseNewExceptionClick(event: any) {
        this.props.onCreateNewExceptionClicked(true, this.props.viewMoreContent);
        this.onOkClick(event);
    }
    /**
     * On click event handling of download link
     */
    private onDownloadLinkClick(event: any) {
        this.onOkClick(event);
        let isOnline: boolean = eCourseWorkHelper.openFileInNewWindow(this.props.src);
        if (isOnline) {
            ecourseworkresponseActionCreator.fileDownloadedOustide();
            this.updateFileViewedStatus();
        }
    }

    /**
     * To play the alternate file of the current playing media file
     * @param event
     */
    private onPlayAlternateFile(event: any) {
        let isOnline: boolean = true;
        //TODO -- Use the method in store to get selectedAudioVideo files
        let selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        ////TODO Modify to use selectedEcourseWorkFiles
        let selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter((x: eCourseworkFile) =>
            (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio)).first() : undefined;
        let pageId = selectedFile.docPageID;

        this.onOkClick(event);
        if (eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable) {
            isOnline = eCourseWorkHelper.openFileInNewWindow(config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
                selectedFile.alternateLink.linkData.url);
            if (isOnline) {
                ecourseworkresponseActionCreator.fileDownloadedOustide();
                this.updateFileViewedStatus();
            }
        } else {
            ecourseworkresponseActionCreator.mediaPlayerSourceChange(pageId, this.props.candidateScriptId,
                this.props.playerMode === enums.MediaSourceType.OriginalFile ?
                    enums.MediaSourceType.TranscodedFile : enums.MediaSourceType.OriginalFile);
        }
    }

    /**
     * To play the alternate file of the current playing media file
     * @param event
     */
    private updateFileViewedStatus() {
        let selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter((x: eCourseworkFile) =>
            (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio)).first() : undefined;

        if (selectedFile &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !worklistStore.instance.isMarkingCheckAvailable &&
            worklistStore.instance.getResponseMode === enums.ResponseMode.open &&
            !selectedFile.readStatus) {
            // Invoke action creator to set selected ecoursework file read status and in progress status as true.
            eCourseWorkHelper.updatefileReadStatusProgress(this.props.markGroupId, selectedFile.docPageID);
        }
    }

    /**
     * To get the alternate file text
     */
    private getAlternateFileText(): string {
        return this.props.playerMode === enums.MediaSourceType.OriginalFile ||
            this.props.playerMode === undefined ?
            localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-transcoded') :
            localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-original');
    }

    /**
     * To get the alternate file link
     */
    private getAlternateFileLink(): JSX.Element {
        return (
            this.props.isTranscodedExists && this.props.isQuickLinkVisible ? (
                <span>
                    {localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-alternate')}
                    < a href='javascript:void(0);'
                        id='playAlternateFile'
                        onClick={this.onPlayAlternateFile}
                    > {this.getAlternateFileText()}</a >
                    {localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-alternate-suffix')}
                </span>) : null
        );
    }
}

export = MediaErrorDialog;
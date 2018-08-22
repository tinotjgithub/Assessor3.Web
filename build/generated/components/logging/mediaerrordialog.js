"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Confirmation Popup
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var enums = require('../utility/enums');
var ErrorDialogBase = require('./errordialogbase');
var ecourseworkresponseActionCreator = require('../../actions/ecoursework/ecourseworkresponseactioncreator');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
var exceptionHelper = require('../utility/exception/exceptionhelper');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
var exceptionStore = require('../../stores/exception/exceptionstore');
var URLS = require('../../dataservices/base/urls');
var worklistStore = require('../../stores/worklist/workliststore');
var eCourseWorkHelper = require('../utility/ecoursework/ecourseworkhelper');
/**
 * React component class for Header for Authorized pages
 */
var MediaErrorDialog = (function (_super) {
    __extends(MediaErrorDialog, _super);
    /**
     * Constructor ErrorDialog
     * @param props
     * @param state
     */
    function MediaErrorDialog(props, state) {
        _super.call(this, props, state);
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
    MediaErrorDialog.prototype.render = function () {
        if (this.props.isOpen) {
            return (React.createElement("div", {id: 'mediaerrorPopup', role: 'dialog', "aria-labelledby": 'popup5Title', "aria-describedby": 'popup5Desc', className: classNames('popup small popup-overlay close-button error-popup', {
                'open': this.props.isOpen,
                'close': !this.props.isOpen
            })}, React.createElement("div", {id: 'mediaerrorpopupwrap', className: 'popup-wrap'}, this.renderErrorDialogHeader(), this.renderContent(), this.renderOKButton())));
        }
        else {
            return null;
        }
    };
    /**
     * To render the content of error dialog
     */
    MediaErrorDialog.prototype.renderContent = function () {
        var fileExceptionTypeId = 25;
        var downloadexceptionlinks;
        var isResponseReadOnly = markerOperationModeFactory.operationMode.isTeamManagementMode ||
            markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup;
        if (exceptionHelper.canRaiseException(isResponseReadOnly)
            && !exceptionStore.instance.isExceptionTypeRaisedAlready(fileExceptionTypeId)) {
            downloadexceptionlinks = this.props.isQuickLinkVisible ? (React.createElement("span", null, React.createElement("a", {href: 'javascript:void(0);', id: 'downloadquicklink', onClick: this.onDownloadLinkClick}, localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-download-file')), localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-or'), React.createElement("a", {href: 'javascript:void(0);', id: 'raiseException', onClick: this.onRaiseNewExceptionClick}, localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-raise-exception')), ".")) : null;
        }
        else {
            downloadexceptionlinks = this.props.isQuickLinkVisible ? (React.createElement("span", null, React.createElement("a", {href: 'javascript:void(0);', id: 'downloadquicklink', onClick: this.onDownloadLinkClick}, localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-download-file')), ".")) :
                null;
        }
        return (React.createElement("div", {className: 'popup-content', id: 'mediaErrorPopupContent'}, React.createElement("div", {className: classNames({
            'indented': this.props.showErrorIcon
        })}, React.createElement("p", null, this.props.content, downloadexceptionlinks, this.getAlternateFileLink())), this.renderMoreInfo()));
    };
    /**
     * On click event handling of raise new exception
     */
    MediaErrorDialog.prototype.onRaiseNewExceptionClick = function (event) {
        this.props.onCreateNewExceptionClicked(true, this.props.viewMoreContent);
        this.onOkClick(event);
    };
    /**
     * On click event handling of download link
     */
    MediaErrorDialog.prototype.onDownloadLinkClick = function (event) {
        this.onOkClick(event);
        var isOnline = eCourseWorkHelper.openFileInNewWindow(this.props.src);
        if (isOnline) {
            ecourseworkresponseActionCreator.fileDownloadedOustide();
            this.updateFileViewedStatus();
        }
    };
    /**
     * To play the alternate file of the current playing media file
     * @param event
     */
    MediaErrorDialog.prototype.onPlayAlternateFile = function (event) {
        var isOnline = true;
        //TODO -- Use the method in store to get selectedAudioVideo files
        var selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        ////TODO Modify to use selectedEcourseWorkFiles
        var selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter(function (x) {
            return (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio);
        }).first() : undefined;
        var pageId = selectedFile.docPageID;
        this.onOkClick(event);
        if (eCourseWorkFileStore.instance.isSelectedPlayableFilesAlternateDownloadable) {
            isOnline = eCourseWorkHelper.openFileInNewWindow(config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
                selectedFile.alternateLink.linkData.url);
            if (isOnline) {
                ecourseworkresponseActionCreator.fileDownloadedOustide();
                this.updateFileViewedStatus();
            }
        }
        else {
            ecourseworkresponseActionCreator.mediaPlayerSourceChange(pageId, this.props.candidateScriptId, this.props.playerMode === enums.MediaSourceType.OriginalFile ?
                enums.MediaSourceType.TranscodedFile : enums.MediaSourceType.OriginalFile);
        }
    };
    /**
     * To play the alternate file of the current playing media file
     * @param event
     */
    MediaErrorDialog.prototype.updateFileViewedStatus = function () {
        var selectedECourseWorkFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        var selectedFile = (selectedECourseWorkFiles) ? selectedECourseWorkFiles.filter(function (x) {
            return (x.linkData.mediaType === enums.MediaType.Video || x.linkData.mediaType === enums.MediaType.Audio);
        }).first() : undefined;
        if (selectedFile &&
            !markerOperationModeFactory.operationMode.isTeamManagementMode &&
            !worklistStore.instance.isMarkingCheckAvailable &&
            worklistStore.instance.getResponseMode === enums.ResponseMode.open &&
            !selectedFile.readStatus) {
            // Invoke action creator to set selected ecoursework file read status and in progress status as true.
            eCourseWorkHelper.updatefileReadStatusProgress(this.props.markGroupId, selectedFile.docPageID);
        }
    };
    /**
     * To get the alternate file text
     */
    MediaErrorDialog.prototype.getAlternateFileText = function () {
        return this.props.playerMode === enums.MediaSourceType.OriginalFile ||
            this.props.playerMode === undefined ?
            localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-transcoded') :
            localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-original');
    };
    /**
     * To get the alternate file link
     */
    MediaErrorDialog.prototype.getAlternateFileLink = function () {
        return (this.props.isTranscodedExists && this.props.isQuickLinkVisible ? (React.createElement("span", null, localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-alternate'), React.createElement("a", {href: 'javascript:void(0);', id: 'playAlternateFile', onClick: this.onPlayAlternateFile}, " ", this.getAlternateFileText()), localeStore.instance.TranslateText('marking.response.media-player-error-dialog.quick-link-play-alternate-suffix'))) : null);
    };
    return MediaErrorDialog;
}(ErrorDialogBase));
module.exports = MediaErrorDialog;
//# sourceMappingURL=mediaerrordialog.js.map
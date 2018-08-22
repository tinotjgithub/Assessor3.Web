"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var enums = require('../../components/utility/enums');
var base = require('../base/actioncreatorbase');
var pauseMediaPlayerAction = require('./mediaplayerpauseaction');
var eCourseWorkFileSelectAction = require('./ecourseworkfileselectaction');
var fileListPanelToggleAction = require('./filelistpaneltoggleaction');
var filelistPanelSwitchViewAction = require('./filelistpanelswitchviewaction');
var updateZoomOnToggleFileListPanelAction = require('./updatezoomontogglefilelistpanelaction');
var fileNameDisplayAction = require('./filenamedisplayaction');
var fileReadStatusChangeAction = require('./filereadstatuschangeaction');
var eCourseworkDataService = require('../../dataservices/response/ecourseworkdataservice');
var updateAllFilesViewedStatusAction = require('./updateallfilesviewedstatusaction');
var mediaPlayerUserPreferenceSaveAction = require('./mediaplayeruserpreferencesaveaction');
var mediaPlayerSourceChangeAction = require('./mediaplayersourcechangeaction');
var fileDownloadedOutsideAction = require('./filedownloadedoutsideaction');
var mediaPanelTransitionEndAction = require('./mediapaneltransitionendaction');
var clearEcourseworkFileDataAction = require('./clearecourseworkdataaction');
var reloadFailedImageAction = require('./reloadfailedimageaction');
var EcourseworkResponseActionCreator = (function (_super) {
    __extends(EcourseworkResponseActionCreator, _super);
    function EcourseworkResponseActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Pause the media player for some other user action
     */
    EcourseworkResponseActionCreator.prototype.pauseMediaPlayer = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new pauseMediaPlayerAction());
        }).catch();
    };
    /**
     * The action for selecting a link
     */
    EcourseworkResponseActionCreator.prototype.eCourseworkFileSelect = function (selectedCourseWorkFile, doAutoPlay, doSetIndexes, isInFullResponseView) {
        if (doAutoPlay === void 0) { doAutoPlay = false; }
        if (doSetIndexes === void 0) { doSetIndexes = false; }
        if (isInFullResponseView === void 0) { isInFullResponseView = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new eCourseWorkFileSelectAction(selectedCourseWorkFile, doAutoPlay, doSetIndexes, isInFullResponseView));
        }).catch();
    };
    /**
     * The action for selecting a link
     */
    EcourseworkResponseActionCreator.prototype.fileListPanelToggle = function (isFilelistPanelCollapsed) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fileListPanelToggleAction(isFilelistPanelCollapsed));
        }).catch();
    };
    /**
     * The action for file list panel transition end
     */
    EcourseworkResponseActionCreator.prototype.mediaPanelTransitionEnd = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new mediaPanelTransitionEndAction());
        }).catch();
    };
    /**
     * The action for switching file list panel view
     */
    EcourseworkResponseActionCreator.prototype.filelistPanelSwitchView = function (currentView, doEmit) {
        if (currentView === void 0) { currentView = enums.FileListPanelView.List; }
        if (doEmit === void 0) { doEmit = true; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new filelistPanelSwitchViewAction(currentView, doEmit));
        }).catch();
    };
    /**
     * Action for updating zoom on toggle filelist panel
     */
    EcourseworkResponseActionCreator.prototype.updateZoomOnToggleFileListPanel = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateZoomOnToggleFileListPanelAction());
        }).catch();
    };
    /**
     * The action for displaying filename
     */
    EcourseworkResponseActionCreator.prototype.displayFileName = function (fileName) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fileNameDisplayAction(fileName));
        }).catch();
    };
    /**
     * The action for changing file read status.
     */
    EcourseworkResponseActionCreator.prototype.saveFileReadStatus = function (fileReadstatusArgument) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            eCourseworkDataService.changeFileReadStatus(fileReadstatusArgument, function (success, fileReadStatusReturn) {
                if (that.validateCall(fileReadStatusReturn, false, false)) {
                    dispatcher.dispatch(new fileReadStatusChangeAction(fileReadstatusArgument.docstorePageId, fileReadstatusArgument.markGroupId, false, success));
                    resolve(fileReadStatusReturn);
                }
                else {
                    reject(null);
                }
            });
        });
    };
    /**
     * The action for changing file read status in_progress value to store.
     */
    EcourseworkResponseActionCreator.prototype.updatefileReadStatusProgress = function (pageId, markGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fileReadStatusChangeAction(pageId, markGroupId, true, true));
        }).catch();
    };
    /**
     * The action for updating all files viewed status.
     */
    EcourseworkResponseActionCreator.prototype.updateAllFilesViewedStatus = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateAllFilesViewedStatusAction());
        }).catch();
    };
    /**
     * Action to save the media player user preferences
     */
    EcourseworkResponseActionCreator.prototype.saveMediaPlayerUserPreference = function (docPageId, lastPlayedVolume, lastPlayedMediaTime) {
        new Promise.Promise(function (resolve, reject) { resolve(); })
            .then(function () {
            dispatcher.dispatch(new mediaPlayerUserPreferenceSaveAction(docPageId, lastPlayedVolume, lastPlayedMediaTime));
        })
            .catch();
    };
    /**
     * The action to change the source type of media player.
     */
    EcourseworkResponseActionCreator.prototype.mediaPlayerSourceChange = function (pageId, candidateScriptId, mediaSourceType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new mediaPlayerSourceChangeAction(pageId, candidateScriptId, mediaSourceType));
        }).catch();
    };
    /**
     * The action to set the isFileDownloadedOutside variable.
     */
    EcourseworkResponseActionCreator.prototype.fileDownloadedOustide = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new fileDownloadedOutsideAction());
        }).catch();
    };
    /**
     * Clear the ecoursework file data from store
     */
    EcourseworkResponseActionCreator.prototype.clearEcourseworkFileData = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new clearEcourseworkFileDataAction());
        }).catch();
    };
    /**
     * Reload failed images
     */
    EcourseworkResponseActionCreator.prototype.reloadFailedImage = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new reloadFailedImageAction());
        }).catch();
    };
    return EcourseworkResponseActionCreator;
}(base));
var eCourseworkResponseActionCreator = new EcourseworkResponseActionCreator();
module.exports = eCourseworkResponseActionCreator;
//# sourceMappingURL=ecourseworkresponseactioncreator.js.map
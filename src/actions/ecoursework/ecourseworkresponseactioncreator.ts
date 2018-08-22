import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import enums = require('../../components/utility/enums');
import base = require('../base/actioncreatorbase');
import pauseMediaPlayerAction = require('./mediaplayerpauseaction');
import eCourseWorkFile = require('../../stores/response/digital/typings/courseworkfile');
import eCourseWorkFileSelectAction = require('./ecourseworkfileselectaction');
import fileListPanelToggleAction = require('./filelistpaneltoggleaction');
import filelistPanelSwitchViewAction = require('./filelistpanelswitchviewaction');
import updateZoomOnToggleFileListPanelAction = require('./updatezoomontogglefilelistpanelaction');
import fileNameDisplayAction = require('./filenamedisplayaction');
import fileReadStatusChangeAction = require('./filereadstatuschangeaction');
import eCourseworkDataService = require('../../dataservices/response/ecourseworkdataservice');
import fileReadStatusReturn = require('../../dataservices/response/ecourseworkfilereadstatusreturn');
import updateAllFilesViewedStatusAction = require('./updateallfilesviewedstatusaction');
import mediaPlayerUserPreferenceSaveAction = require('./mediaplayeruserpreferencesaveaction');
import mediaPlayerSourceChangeAction = require('./mediaplayersourcechangeaction');
import fileDownloadedOutsideAction = require('./filedownloadedoutsideaction');
import mediaPanelTransitionEndAction = require('./mediapaneltransitionendaction');
import clearEcourseworkFileDataAction = require('./clearecourseworkdataaction');
import reloadFailedImageAction = require('./reloadfailedimageaction');

class EcourseworkResponseActionCreator extends base {

    /**
     * Pause the media player for some other user action
     */
    public pauseMediaPlayer() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new pauseMediaPlayerAction());
        }).catch();
    }

    /**
     * The action for selecting a link
     */
    public eCourseworkFileSelect(selectedCourseWorkFile: eCourseWorkFile,
        doAutoPlay: boolean = false,
        doSetIndexes: boolean = false,
        isInFullResponseView: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new eCourseWorkFileSelectAction(selectedCourseWorkFile, doAutoPlay, doSetIndexes, isInFullResponseView));
        }).catch();
    }

    /**
     * The action for selecting a link
     */
    public fileListPanelToggle(isFilelistPanelCollapsed: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fileListPanelToggleAction(isFilelistPanelCollapsed));
        }).catch();
    }

    /**
     * The action for file list panel transition end
     */
    public mediaPanelTransitionEnd() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new mediaPanelTransitionEndAction());
        }).catch();
    }

    /**
     * The action for switching file list panel view
     */
    public filelistPanelSwitchView(currentView: enums.FileListPanelView = enums.FileListPanelView.List, doEmit: boolean = true) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new filelistPanelSwitchViewAction(currentView, doEmit));
        }).catch();
    }

    /**
     * Action for updating zoom on toggle filelist panel
     */
    public updateZoomOnToggleFileListPanel() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateZoomOnToggleFileListPanelAction());
        }).catch();
    }

    /**
     * The action for displaying filename
     */
    public displayFileName(fileName: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fileNameDisplayAction(fileName));
        }).catch();
    }

    /**
     * The action for changing file read status.
     */
    public saveFileReadStatus(fileReadstatusArgument: ECourseworkFileReadStatusArguments) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            eCourseworkDataService.changeFileReadStatus(fileReadstatusArgument, function (success: boolean,
                fileReadStatusReturn: fileReadStatusReturn) {
                if (that.validateCall(fileReadStatusReturn, false, false)) {
                    dispatcher.dispatch(new fileReadStatusChangeAction(fileReadstatusArgument.docstorePageId,
                        fileReadstatusArgument.markGroupId, false, success));
                    resolve(fileReadStatusReturn);
                } else {
                    reject(null);
                }
            });
        });
    }

    /**
     * The action for changing file read status in_progress value to store.
     */
    public updatefileReadStatusProgress(pageId: number, markGroupId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fileReadStatusChangeAction(pageId, markGroupId, true, true));
        }).catch();
    }

    /**
     * The action for updating all files viewed status.
     */
    public updateAllFilesViewedStatus() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateAllFilesViewedStatusAction());
        }).catch();
    }

    /**
     * Action to save the media player user preferences
     */
    public saveMediaPlayerUserPreference(docPageId : number, lastPlayedVolume: number, lastPlayedMediaTime: number) {
        new Promise.Promise(function (resolve: any, reject: any) { resolve(); })
            .then(() => {
                dispatcher.dispatch(new mediaPlayerUserPreferenceSaveAction(docPageId, lastPlayedVolume, lastPlayedMediaTime));
            })
            .catch();
    }

    /**
     * The action to change the source type of media player.
     */
    public mediaPlayerSourceChange(pageId: number, candidateScriptId: number, mediaSourceType: enums.MediaSourceType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new mediaPlayerSourceChangeAction(pageId, candidateScriptId, mediaSourceType));
        }).catch();
    }

    /**
     * The action to set the isFileDownloadedOutside variable.
     */
    public fileDownloadedOustide() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new fileDownloadedOutsideAction());
        }).catch();
    }

    /**
     * Clear the ecoursework file data from store
     */
    public clearEcourseworkFileData() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new clearEcourseworkFileDataAction());
        }).catch();
    }

    /**
     * Reload failed images
     */
    public reloadFailedImage() {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new reloadFailedImageAction());
        }).catch();
    }
}

let eCourseworkResponseActionCreator = new EcourseworkResponseActionCreator();
export = eCourseworkResponseActionCreator;
import Immutable = require('immutable');
import storeBase = require('../../base/storebase');
import dispatcher = require('../../../app/dispatcher');
import action = require('../../../actions/base/action');
import linkData = require('./typings/linkdata');
import enums = require('../../../components/utility/enums');
import actionType = require('../../../actions/base/actiontypes');
import eCourseWorkFile = require('./typings/courseworkfile');
import eCourseWorkFileReturn = require('./typings/ecourseworkfilesreturn');
import candidateECourseWorkMetadataRetrievalAction = require('../../../actions/script/candidateecourseworkmetadataretrievalaction');
import eCourseworkFileSelectAction = require('../../../actions/ecoursework/ecourseworkfileselectaction');
import scriptImageDownloadRequest = require('../../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloadrequest');
import loadContainerAction = require('../../../actions/navigation/loadcontaineraction');
import qigSelectorDataFetchAction = require('../../../actions/qigselector/qigselectordatafetchaction');
import fileListPanelToggleAction = require('../../../actions/ecoursework/filelistpaneltoggleaction');
import filelistPanelSwitchViewAction = require('../../../actions/ecoursework/filelistpanelswitchviewaction');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import displayFileNameAction = require('../../../actions/ecoursework/filenamedisplayaction');
import jsonHelper = require('../../../utility/generic/jsonhelper');
import fileReadStatusChangeAction = require('../../../actions/ecoursework/filereadstatuschangeaction');
import mediaPlayerSoureChangeAction = require('../../../actions/ecoursework/mediaplayersourcechangeaction');
import mediaPlayerUserPreferenceSaveAction = require('../../../actions/ecoursework/mediaplayeruserpreferencesaveaction');
import worklistStore = require('../../worklist/workliststore');
import responseStore = require('../../response/responsestore');
import responseOpenAction = require('../../../actions/response/responseopenaction');
import standardisationCentreScriptOpenAction = require('../../../actions/standardisationsetup/standardisationcentrescriptopenaction');
import markerOperationModeChangedAction = require('../../../actions/userinfo/markeroperationmodechangedaction');
/**
 * store for e-course work files
 */
class ECourseWorkFileStore extends storeBase {
    // holds course work file meta data against every mark group id
    // key is markGroupId and value will be a list of files against that mark group id
    private _courseWorkFiles: Immutable.Map<number, Immutable.List<eCourseWorkFile>>;

    /* variable to holds the ecoursework files against the current response */
    private _currentResponseCourseWorkFiles: Array<eCourseWorkFile>;

    /* variable to holds the candidate script id of the current response */
    private _currentCandidateScriptId: number;

    // Holds the constant for representing the candidate e-course work metadata retrieval action
    public static CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT = 'CandidateECourseWorkMetadataRetrievalEvent';

    // Holds the constant of representing Filelist panel toggle action
    public static FILE_LIST_PANEL_TOGGLE_ACTION_EVENT = 'FileListPanelToggleActionEvent';

    // Holds the constant of representing Filelist panel switch view action
    public static FILELIST_PANEL_SWITCH_VIEW_EVENT = 'FilelistPanelSwitchViewActionEvent';

    // Holds the constant for representing the file selectionchanged event
    public static ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT = 'ECourseWorkFileSelectionChangedEvent';

    public static DISPLAY_FILE_NAME_EVENT = 'DisplayFileNameEvent';

    // holds expand / collapse status of ecoursework filelist panel
    private _isFilelistPanelCollapsed: boolean;

    // holds expand / collapse status of ecoursework filelist panel
    private _fileListPanelCurrentView: enums.FileListPanelView = enums.FileListPanelView.List;

    // holds the autoplay status
    private _doAutoPlay: boolean;

    // Holds the doc page id of the recently selected file.
    private _recentlySelectedFileDocPageId: number;

    private _isCustomToolbarMessageDisplayed: boolean;

    private _isFileDownloadedOutside: boolean = false;

    public static UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT = 'updateZoomOnToggleFileListPanelEvent';

    public static PAUSE_MEDIA_PLAYER_EVENT = 'pauseMediaPlayerEvent';

    private _fileName: string;

    public static FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT = 'FileReadStatusChangeInProgressActionEvent';

    public static FILE_READ_STATUS_UPDATED = 'FileReadStatusUpdated';

    public static UPDATE_ALL_FILES_VIEWED = 'UpdateAllFilesViewed';

    public static MEDIA_PLAYER_SOURCE_CHANGED_EVENT = 'MediaPlayerSourceChangedEvent';

    public static MEDIA_PANEL_TRANSITION_END_EVENT = 'mediaPanelTransitionEndEvent';

    public static ECOURSEWORK_FILE_DATA_CLEARED_EVENT = 'ecourseworkFileDataClearedEvent';

    public static RELOAD_FAILED_IMAGE = 'reloadfailedimage';

    /* variable to holds the mark group id of the current response */
    private _currentMarkGroupId: number;

    /* Variable to hold the selected candidate script in the standardisation setup tab. */
    private _selectedCandidateScript: number;
    private _markerOperationMode: enums.MarkerOperationMode;

    /**
     * Constructor for ECourseWorkFileStore
     */
    constructor() {
        super();
        this._courseWorkFiles = Immutable.Map<number, Immutable.List<eCourseWorkFile>>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVED:
                    let candidateECourseWorkMetadataRetrievalAction = action as candidateECourseWorkMetadataRetrievalAction;
                    let courseWorkFileMetadata = candidateECourseWorkMetadataRetrievalAction.getCandidateECourseWorkMetadata();
                    if (courseWorkFileMetadata && courseWorkFileMetadata.fileList !== undefined) {
                        this.processCourseWorkFileMetadata(
                            courseWorkFileMetadata.fileList,
                            candidateECourseWorkMetadataRetrievalAction.isSelectResponsesWorklist
                        );
                    }
                    this.emit(ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT);
                    break;
                case actionType.OPEN_RESPONSE:
                    let _responseOpenAction = action as responseOpenAction;
                    let candidateScriptId: number = _responseOpenAction.candidateScriptId;
                    let isStandardisationSetupMode: boolean = this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup;
                    this._selectedCandidateScript = _responseOpenAction.selectedDisplayId;
                    this._currentCandidateScriptId = _responseOpenAction.candidateScriptId;
                    this._currentMarkGroupId = _responseOpenAction.selectedMarkGroupId;
                    /* resetting the current response coursework files collection for every response*/
                    this._currentResponseCourseWorkFiles = [];
                    if (this._courseWorkFiles) {
                        let identifier: number =
                            this._currentMarkGroupId > 0
                                ? this._currentMarkGroupId
                                : _responseOpenAction.selectedDisplayId;
                        this.setCurrentCourseWorkFiles(this.getCourseWorkFilesAgainstIdentifier(identifier));
                    }
                    this._isFileDownloadedOutside = false;
                    // we need to reset auto play variable while opening a response.
                    this._doAutoPlay = false;
                    break;
                case actionType.ECOURSEWORK_FILE_SELECT_ACTION:
                    let courseWorkFileSelected = action as eCourseworkFileSelectAction;
                    this._recentlySelectedFileDocPageId = courseWorkFileSelected.selectedECourseWorkFile.docPageID;
                    this.setCourseWorkFileSelection(courseWorkFileSelected);
                    // each file selection need to check customize toolbar visibility defect#57204
                    if (
                        courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType !== enums.MediaType.Video &&
                        courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType !== enums.MediaType.Audio &&
                        !this._isCustomToolbarMessageDisplayed
                    ) {
                        this._isCustomToolbarMessageDisplayed = true;
                    }
                    this.emit(
                        ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
                        courseWorkFileSelected.doSetIndexes,
                        courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType,
                        courseWorkFileSelected.isInFullResponseView
                    );
                    break;
                case actionType.FILE_LIST_PANEL_TOGGLE_ACTION:
                    this._isFilelistPanelCollapsed = (action as fileListPanelToggleAction).isFilelistPanelCollapsed;
                    this.emit(ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, this._isFilelistPanelCollapsed);
                    break;
                case actionType.MEDIA_PANEL_TRANSITION_END_ACTION:
                    this.emit(ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT);
                    break;
                case actionType.FILELIST_PANEL_SWITCH_VIEW_ACTION:
                    let _filelistPanelSwitchViewAction = action as filelistPanelSwitchViewAction;
                    this._fileListPanelCurrentView = _filelistPanelSwitchViewAction.currentView;
                    if (_filelistPanelSwitchViewAction.doEmit) {
                        this.emit(ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT);
                    }
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    let _loadContainerAction: loadContainerAction = action as loadContainerAction;
                    this._isCustomToolbarMessageDisplayed = false;
                    if (
                        _loadContainerAction.containerPage === enums.PageContainers.QigSelector &&
                        (this._courseWorkFiles && this._courseWorkFiles.count() > 0)
                    ) {
                        this.clearCourseWorkFiles();
                    }
                    break;
                case actionType.MEDIA_PLAYER_PAUSE_ACTION:
                    this.emit(ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT);
                    break;
                case actionType.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL:
                    this.emit(ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT);
                    break;
                case actionType.DISPLAY_FILE_NAME_ACTION:
                    this._fileName = (action as displayFileNameAction).fileName;
                    this.emit(ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT, this._fileName);
                    break;
                case actionType.FILE_READ_STATUS_CHANGE_ACTION:
                    let _fileReadStatusChangeAction = action as fileReadStatusChangeAction;
                    this.updateSelectedCourseWorkFileReadStatus(
                        _fileReadStatusChangeAction.pageId,
                        _fileReadStatusChangeAction.markGroupId,
                        _fileReadStatusChangeAction.isChangeInProgress,
                        _fileReadStatusChangeAction.isSaveCompleted
                    );
                    if (_fileReadStatusChangeAction.isChangeInProgress) {
                        this.emit(
                            ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT,
                            _fileReadStatusChangeAction.pageId
                        );
                    }
                    if (
                        _fileReadStatusChangeAction.isSaveCompleted &&
                        !_fileReadStatusChangeAction.isChangeInProgress
                    ) {
                        this.emit(ECourseWorkFileStore.FILE_READ_STATUS_UPDATED);
                        if (this.checkIfAllFilesViewed(_fileReadStatusChangeAction.markGroupId)) {
                            this.emit(ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED);
                        }
                    }
                    break;
                case actionType.MEDIA_PLAYER_SOURCE_CHANGE_ACTION:
                    let _mediaPlayerSourceChanged = action as mediaPlayerSoureChangeAction;
                    this.setSeletedPlayerMode(
                        _mediaPlayerSourceChanged.docPageID,
                        _mediaPlayerSourceChanged.sourceType
                    );
                    this.emit(
                        ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT,
                        _mediaPlayerSourceChanged.sourceType
                    );
                    break;
                case actionType.MEDIA_PLAYER_USER_PREFERENCE_SAVE_ACTION:
                    let _preference = action as mediaPlayerUserPreferenceSaveAction;
                    this.setMediaPlayerUserPreference(
                        _preference.docPageID,
                        _preference.lastPlayedVolume,
                        _preference.lastPlayedMediaTime
                    );
                    break;
                case actionType.FILE_DOWNLOADED_OUTSIDE_ACTION:
                    this._isFileDownloadedOutside = true;
                    break;
                case actionType.SAVE_AND_NAVIGATE:
                    // the flag needs to be reset when Leave Response button is clicked from the
                    // combined warning popup
                    this._isFileDownloadedOutside = false;
                    break;
                case actionType.CLEAR_COURSEWORK_DATA_ACTION:
                    this.clearCourseWorkFiles();
                    this.emit(ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT);
                    break;
                case actionType.RELOAD_FAILED_IMAGE:
                    this.emit(ECourseWorkFileStore.RELOAD_FAILED_IMAGE);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    this._selectedCandidateScript = (action as standardisationCentreScriptOpenAction).selectedCandidateScriptId;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this._markerOperationMode = markerOperationMode.operationMode;
                    break;
            }
        });
    }

    /**
     * to set the coursework files collection of current response
     * @param candidateScriptId
     */
    private setCurrentCourseWorkFiles(currentResponseCourseWorkFiles: any): void {
        if (currentResponseCourseWorkFiles && currentResponseCourseWorkFiles.length > 0) {
            let counter: number = 1;
            let that = this;
            /* mapping the current files and creating new instnaces (if not the ref in the _courseworkfiles collection will update here)
               to add the same into array */
            currentResponseCourseWorkFiles.map((item: eCourseWorkFile) => {
                let newObject: eCourseWorkFile = {
                    title: item.title,
                    docPageID: item.docPageID,
                    linkData: item.linkData,
                    readStatus: item.readStatus,
                    pageType: item.pageType,
                    linkType: item.linkType,
                    docPermission: item.docPermission,
                    alternateLink: item.alternateLink,
                    processed: item.processed,
                    convertedDocumentId: item.convertedDocumentId,
                    rowVersion: item.rowVersion,
                    readProgressStatus: item.readProgressStatus,
                    playerMode: item.playerMode,
                    lastPlayedVolume: item.lastPlayedVolume,
                    lastPlayedMediaTime: item.lastPlayedMediaTime,
                    /* setting the first file item selected by default */
                    isSelected: counter === 1 ? true : item.isSelected
                };
                counter++;
                that._currentResponseCourseWorkFiles.push(newObject);
            });
        }
    }

    /**
     * Set the selected coursework files
     * @param eCourseWorkFileSelectionData
     */
    private setCourseWorkFileSelection(eCourseWorkFileSelectionData: eCourseworkFileSelectAction) {
        let selectedEcourseworkFile: eCourseWorkFile = eCourseWorkFileSelectionData.selectedECourseWorkFile;
        this._doAutoPlay = eCourseWorkFileSelectionData.doAutoPlay;
        this.setSelectedFiles(selectedEcourseworkFile);
    }

    /**
     * to set the isSelected property of selected ecoursework file
     * @param selectedEcourseworkFile
     */
    private setSelectedFiles(selectedEcourseworkFile: eCourseWorkFile) {
        let _selectionFilteredFiles = this.getFilteredFileListForSelection(selectedEcourseworkFile);
        /* based on the multiple selection logic (if any) setting the currently selected files in the collection */
        if (this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0) {
            this._currentResponseCourseWorkFiles.map((item: eCourseWorkFile) => {
                item.isSelected = false;
                if (_selectionFilteredFiles && _selectionFilteredFiles.length > 0) {
                    if (_selectionFilteredFiles.some((x) => x.docPageID === item.docPageID)) {
                        item.isSelected = true;
                    }
                }
                if (item.docPageID === selectedEcourseworkFile.docPageID) {
                    item.isSelected = true;
                }
            });
        }
    }

    /**
     * returns the filtered list for setting the current selection based on the multiple selection.
     * @param selectedEcourseworkFile
     */
    private getFilteredFileListForSelection(selectedEcourseworkFile: eCourseWorkFile) {
        let filteredECourseWorkList: eCourseWorkFile[];
        let _selectedeCourseWorkFiles = this._currentResponseCourseWorkFiles
            ? this._currentResponseCourseWorkFiles.filter((x) => x.isSelected === true)
            : undefined;
        if (
            this.isMultipleSelectionAvailable(selectedEcourseworkFile) &&
            (_selectedeCourseWorkFiles &&
                _selectedeCourseWorkFiles.length > 0 &&
                _selectedeCourseWorkFiles.every((x: eCourseWorkFile) => this.isMultipleSelectionAvailable(x)))
        ) {
            // find files with similar file type of the new file in original list,
            // if exist then exclude from the original list creating a filtered list.
            filteredECourseWorkList = _selectedeCourseWorkFiles.filter(
                (x: eCourseWorkFile) => x.linkData.mediaType !== selectedEcourseworkFile.linkData.mediaType
            );

            // for all other file types other than audio for the new file,
            // only audio (if present) needs to be retained in the original list.
            // multiple audio selection will be handled it the first filtering
            if (selectedEcourseworkFile.linkData.mediaType !== enums.MediaType.Audio) {
                filteredECourseWorkList = filteredECourseWorkList.filter(
                    (x: eCourseWorkFile) => x.linkData.mediaType === enums.MediaType.Audio
                );
            }
        }
        return filteredECourseWorkList;
    }

    /**
     * Returns whether multiple selection is available with the file
     */
    private isMultipleSelectionAvailable(file: eCourseWorkFile): boolean {

        return (file.pageType === enums.PageType.Page ||
            file.linkData.mediaType === enums.MediaType.Audio ||
            file.linkData.mediaType === enums.MediaType.Image);
    }

    /**
     * update the selected course work file read status.
     */
    private updateSelectedCourseWorkFileReadStatus(
        pageId: number,
        markGroupId: number,
        isChangeInProgress: boolean,
        isSaveCompleted: boolean
    ) {
        let coureworkFiles = this.getCourseWorkFilesAgainstIdentifier(markGroupId);
        if (coureworkFiles) {
            coureworkFiles.forEach((courseworkFile: eCourseWorkFile) => {
                if (courseworkFile.docPageID === pageId) {
                    // If any issues while saving read status in database, then set read and progress status as false.
                    if (!isSaveCompleted) {
                        courseworkFile.readStatus = false;
                        courseworkFile.readProgressStatus = false;
                        // TODO: Readstatus is updated in two collections (_currentResponseCourseWorkFiles and _courseWorkFiles)
                        // Change to single collection
                        this.setEcourseworkFileStatus(pageId, false, false);
                    } else {
                        courseworkFile.readStatus = true;
                        courseworkFile.readProgressStatus = isChangeInProgress;
                        // TODO: Readstatus is updated in two collections (_currentResponseCourseWorkFiles and _courseWorkFiles)
                        // Change to single collection
                        this.setEcourseworkFileStatus(pageId, true, isChangeInProgress);
                    }
                }
            });
        }
    }

    /**
     * sets the selected player mode of the media
     * @param docPageId
     * @param playerMode
     */
    private setSeletedPlayerMode(docPageId: number, playerMode: enums.MediaSourceType) {
        this._currentResponseCourseWorkFiles.filter((x) => x.docPageID === docPageId)[0].playerMode = playerMode;
    }

    /**
     * Sets the user preferences of the media player.
     * @param docPageId
     * @param lastPlayedVolume
     * @param lastPlayedMediaTime
     */
    private setMediaPlayerUserPreference(docPageId: number, lastPlayedVolume: number, lastPlayedMediaTime: number) {
        this._currentResponseCourseWorkFiles.map((file: eCourseWorkFile) => {
            if (file.docPageID === docPageId) {
                file.lastPlayedVolume = lastPlayedVolume;
                file.lastPlayedMediaTime = lastPlayedMediaTime;
            }
        });
    }

    /**
     * gets the volume of the selected media player
     */
    public get selectedMediaLastPlayedVolume(): number {
        let selectedPlayableFile: eCourseWorkFile = this.getSelectedPlayableFile();

        return selectedPlayableFile && !isNaN(selectedPlayableFile.lastPlayedVolume)
            ? selectedPlayableFile.lastPlayedVolume
            : 100;
    }

    /**
     * gets the seek position of the selected media player
     */
    public get selectedMediaLastPlayedTime(): number {
        let selectedPlayableFile: eCourseWorkFile = this.getSelectedPlayableFile();

        return selectedPlayableFile && selectedPlayableFile.lastPlayedMediaTime
            ? selectedPlayableFile.lastPlayedMediaTime
            : 0;
    }

    /**
     * sets the selected status of ecoursework files
     * @param docPageId
     * @param readStatus
     * @param readProgressStatus
     */
    private setEcourseworkFileStatus(
        docPageId: number,
        readStatus: boolean = false,
        readProgressStatus: boolean = false
    ) {
        this._currentResponseCourseWorkFiles.filter((x) => x.docPageID === docPageId)[0].readStatus = readStatus;
        this._currentResponseCourseWorkFiles.filter(
            (x) => x.docPageID === docPageId
        )[0].readProgressStatus = readProgressStatus;
    }

    /**
     * get expand/collapse status of filelist panel
     */
    public get isFilelistPanelCollapsed(): boolean {
        return this._isFilelistPanelCollapsed;
    }

    /**
     * get current view status of filelist panel
     */
    public get fileListPanelCurrentView(): enums.FileListPanelView {
        return this._fileListPanelCurrentView;
    }

    /**
     * get expand/collapse status of filelist panel
     */
    public get fileName(): string {
        return this._fileName;
    }

    /**
     * returns the last selected ECoursework file
     */
    public get lastSelectedECourseworkFile(): eCourseWorkFile {
        let selectedEcourseworkFiles = this.getSelectedECourseWorkFiles();

        let lastSelectedEcourseworkFile = selectedEcourseworkFiles
            ? selectedEcourseworkFiles.filter(
                (file: eCourseWorkFile) => file.docPageID === this._recentlySelectedFileDocPageId
            )
            : undefined;

        return lastSelectedEcourseworkFile ? lastSelectedEcourseworkFile.first() : undefined;
    }

    /**
     * process the retrieved course work files
     * @param courseWorkFileList
     */
    private processCourseWorkFileMetadata(
        eCourseWorkFileReturn: Immutable.List<eCourseWorkFileReturn>,
        isSelectResponsesInStdSetup: boolean
    ) {
        eCourseWorkFileReturn.map((item: eCourseWorkFileReturn) => {
            if (isSelectResponsesInStdSetup) {
                this.addOrUpdateCourseWorkFiles(item.candidateScriptId, item.files);
                /* for SSU select responses, we have only candidatescriptId */
                if (item.candidateScriptId === this._selectedCandidateScript) {
                    this.setCurrentCourseWorkFiles(item.files);
                }
            } else {
                this.addOrUpdateCourseWorkFiles(item.markGroupId, item.files);
                /*sets the current response coursework file selection based on the mark group id */
                if (item.markGroupId === this._currentMarkGroupId) {
                    this.setCurrentCourseWorkFiles(item.files);
                }
            }
        });
    }

    /**
     * add or update course work files against a candidateScriptID(incase of standardisation setup)/markGroupId.
     * @param identifier
     * @param courseWorkFiles
     */
    private addOrUpdateCourseWorkFiles(identifier: number, courseWorkFiles: Immutable.List<eCourseWorkFile>) {
        if (identifier > 0 && courseWorkFiles) {
            this._courseWorkFiles = this._courseWorkFiles.set(identifier, courseWorkFiles);
        }
    }

    /**
     * clear the course work file list
     */
    private clearCourseWorkFiles() {
        this._courseWorkFiles = Immutable.Map<number, Immutable.List<eCourseWorkFile>>();
        this._currentResponseCourseWorkFiles = [];
    }

    /**
     * get course work files
     */
    public getCourseWorkFiles(): Immutable.Map<number, Immutable.List<eCourseWorkFile>> {
        return this._courseWorkFiles;
    }

    /**
     * return course work files against a candidateScriptID(incase of standardisation setup)/markGroupId.
     * @param identifier
     */
    public getCourseWorkFilesAgainstIdentifier(identifier: number): Immutable.List<eCourseWorkFile> {
        return this._courseWorkFiles.get(identifier);
    }

    /**
     * Gets the selected EcourseworkFile list. Ideally there will be one .
     * In case of mixed selection of audio + image or audio + document there can be 2 files.
     */
    public getSelectedECourseWorkFiles(): Immutable.List<eCourseWorkFile> {
        let selectedFiles =
            this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0
                ? this._currentResponseCourseWorkFiles.filter((x) => x.isSelected === true)
                : undefined;

        return selectedFiles && selectedFiles.length > 0 ? Immutable.List<eCourseWorkFile>(selectedFiles) : undefined;
    }

    /**
     * returns the coversheet metadata of given mark group Id and the file item
     * @param markGroupId -
     * @param docpageId - docpageid of the file item
     */
    public getCoversheetMetaData(markGroupId: number, docpageId: number): Immutable.List<CoverSheetMetaData> {
        /* TODO: Change the members of CoverSheetMetaData type into camel case once we have converted the content JSON into
        camel case in server (newtonsoft) */
        let metadataList: CoverSheetMetaDataList;
        let coureworkFiles = this.getCourseWorkFilesAgainstIdentifier(markGroupId);
        let metadata = coureworkFiles ? coureworkFiles.filter((x) => x.docPageID === docpageId)[0] : undefined;

        if (metadata && metadata.linkData && metadata.linkData.content) {
            let content: any = jsonHelper.toCamelCase(JSON.parse(metadata.linkData.content));
            if (content.additionalInfo.coversheetMetaDataCollection) {
                metadataList = content.additionalInfo.coversheetMetaDataCollection;
                /* The coversheet metadata json will be an array only if there are more than one metadata. If only one metadata available
                 it will get parsed as a single object than an immutable list. Hence we are checking the metadata array length and adding
                 it into list
                 TODO: Research the fix for handling this in server side (newtonsoft)*/
                if (!(content.additionalInfo.coversheetMetaDataCollection.coversheetMetaData.length > 0)) {
                    let value: Array<CoverSheetMetaData> = [];
                    value.push(content.additionalInfo.coversheetMetaDataCollection.coversheetMetaData);
                    metadataList.coversheetMetaData = Immutable.List<CoverSheetMetaData>(value);
                }
            }
        }

        return metadataList ? metadataList.coversheetMetaData : undefined;
    }

    /**
     * Get the autoplay status for media file auto play
     */
    public doAutoPlay(): boolean {
        return this._doAutoPlay;
    }

    /**
     * This method will return the corresponding E-Course workfile
     *
     * @param {number} markGroupId
     * @param {number} docPageID
     * @memberof ECourseWorkFileStore
     */
    public getECourseWorkFile(markGroupId: number, docPageID: number): eCourseWorkFile {
        let eCourseWorkFile: eCourseWorkFile;
        let eCourseWorkFileList = this.getCourseWorkFilesAgainstIdentifier(markGroupId);
        if (eCourseWorkFileList) {
            eCourseWorkFile = eCourseWorkFileList.filter((x: eCourseWorkFile) => x.docPageID === docPageID)[0];
        }
        return eCourseWorkFile;
    }

    /**
     * This method will return the index(order) a E-Course workfile
     *
     * @param {number} markGroupId
     * @param {number} docPageID
     * @memberof ECourseWorkFileStore
     */
    public getIndexOfECourseWorkFile(markGroupId: number, docPageID: number): number {
        let index: number = -1;
        let eCourseWorkFileList = this.getCourseWorkFilesAgainstIdentifier(markGroupId);
        if (eCourseWorkFileList) {
            eCourseWorkFileList.map((x: eCourseWorkFile, i: number) => {
                if (x.docPageID === docPageID) {
                    index = i;
                }
            });
        }
        return index;
    }

    /**
     * Check whether all coursework files for a particular response is viewed or not.
     */
    public checkIfAllFilesViewed(_markGroupId: number): boolean {
        let isAllFilesViewed: boolean = true;
        if (this._courseWorkFiles.count() > 0) {
            let selectedCourseworkFile = this._courseWorkFiles.get(_markGroupId);
            if (selectedCourseworkFile) {
                selectedCourseworkFile.map((item: eCourseWorkFile) => {
                    if (item.readStatus === false || item.readProgressStatus === true) {
                        isAllFilesViewed = false;
                    }
                });
            }
        }
        return isAllFilesViewed;
    }

    /**
     * returns the selected audio/video file among the currently selected coursework files ( if any multiple selection there)
     */
    public getSelectedPlayableFile(): eCourseWorkFile {
        let selectedECourseWorkFiles = this.getSelectedECourseWorkFiles();

        let selectedFile = selectedECourseWorkFiles
            ? selectedECourseWorkFiles
                .filter(
                    (x: eCourseWorkFile) =>
                        x.linkData.mediaType === enums.MediaType.Video ||
                        x.linkData.mediaType === enums.MediaType.Audio
                )
                .first()
            : undefined;

        return selectedFile;
    }

    /**
     * returns whether the audio/video file currently selected has a downloadable alternate file.
     */
    public get isSelectedPlayableFilesAlternateDownloadable(): boolean {
        let selectedAudioVideoFile = this.getSelectedPlayableFile();
        return (
            selectedAudioVideoFile &&
            selectedAudioVideoFile.alternateLink &&
            !selectedAudioVideoFile.alternateLink.linkData.canDisplayInApplication
        );
    }

    /**
     * returns whether any file downloaded outside Assessor
     */
    public get isFileDownloadedOutside(): boolean {
        return this._isFileDownloadedOutside;
    }

    /**
     * Returns the recently slected file's doc page id.
     */
    public get recentlySelectedFileDocPageId(): number {
        return this._recentlySelectedFileDocPageId;
    }

    public get iscustomToolbarMessageDisplayed(): boolean {
        return this._isCustomToolbarMessageDisplayed;
    }

    /**
     * returns true/false depends on selected ecoursework file is image or not.
     */
    public isImageFileSelected(ecourseworkPageId: number): boolean {
        return this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0
            ? this._currentResponseCourseWorkFiles.filter(
                (x) => x.docPageID === ecourseworkPageId && x.linkData.mediaType === enums.MediaType.Image
            ).length > 0
            : false;
    }
}

let instance = new ECourseWorkFileStore();
export = { ECourseWorkFileStore, instance };

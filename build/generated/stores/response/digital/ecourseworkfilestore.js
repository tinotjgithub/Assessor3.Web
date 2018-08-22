"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Immutable = require('immutable');
var storeBase = require('../../base/storebase');
var dispatcher = require('../../../app/dispatcher');
var enums = require('../../../components/utility/enums');
var actionType = require('../../../actions/base/actiontypes');
var jsonHelper = require('../../../utility/generic/jsonhelper');
var worklistStore = require('../../worklist/workliststore');
var standardisationSetupStore = require('../../standardisationsetup/standardisationsetupstore');
/**
 * store for e-course work files
 */
var ECourseWorkFileStore = (function (_super) {
    __extends(ECourseWorkFileStore, _super);
    /**
     * Constructor for ECourseWorkFileStore
     */
    function ECourseWorkFileStore() {
        var _this = this;
        _super.call(this);
        // holds expand / collapse status of ecoursework filelist panel
        this._fileListPanelCurrentView = enums.FileListPanelView.List;
        this._isFileDownloadedOutside = false;
        this._courseWorkFiles = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVED:
                    var candidateECourseWorkMetadataRetrievalAction_1 = action;
                    var courseWorkFileMetadata = candidateECourseWorkMetadataRetrievalAction_1.getCandidateECourseWorkMetadata();
                    if (courseWorkFileMetadata && courseWorkFileMetadata.fileList !== undefined) {
                        _this.processCourseWorkFileMetadata(courseWorkFileMetadata.fileList, candidateECourseWorkMetadataRetrievalAction_1.getIsSelectResponsesInStdSetup);
                    }
                    _this.emit(ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT);
                    break;
                case actionType.OPEN_RESPONSE:
                    var _responseOpenAction = action;
                    var responseDetails = void 0;
                    var isStandardisationSetupMode = standardisationSetupStore.instance.selectedStandardisationSetupWorkList !== enums.StandardisationSetup.None;
                    if (!isStandardisationSetupMode) {
                        responseDetails = worklistStore.instance.getResponseDetails(_responseOpenAction.selectedDisplayId.toString());
                    }
                    else {
                        responseDetails = standardisationSetupStore.instance.getResponseDetails(_responseOpenAction.selectedDisplayId.toString());
                    }
                    _this._selectedCandidateScript = _responseOpenAction.selectedDisplayId;
                    _this._currentCandidateScriptId = responseDetails ? responseDetails.candidateScriptId : undefined;
                    _this._currentMarkGroupId = responseDetails ? isStandardisationSetupMode ? responseDetails.esMarkGroupId :
                        responseDetails.markGroupId : undefined;
                    /* resetting the current response coursework files collection for every response*/
                    _this._currentResponseCourseWorkFiles = [];
                    if (_this._courseWorkFiles) {
                        var identifier = _this._currentMarkGroupId > 0
                            ? _this._currentMarkGroupId
                            : standardisationSetupStore.instance.selectedResponseId;
                        _this.setCurrentCourseWorkFiles(_this.getCourseWorkFilesAgainstMarkGroupId(identifier));
                    }
                    _this._isFileDownloadedOutside = false;
                    // we need to reset auto play variable while opening a response.
                    _this._doAutoPlay = false;
                    break;
                case actionType.ECOURSEWORK_FILE_SELECT_ACTION:
                    var courseWorkFileSelected = action;
                    _this._recentlySelectedFileDocPageId = courseWorkFileSelected.selectedECourseWorkFile.docPageID;
                    _this.setCourseWorkFileSelection(courseWorkFileSelected);
                    // each file selection need to check customize toolbar visibility defect#57204
                    if (courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType !== enums.MediaType.Video &&
                        courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType !== enums.MediaType.Audio &&
                        !_this._isCustomToolbarMessageDisplayed) {
                        _this._isCustomToolbarMessageDisplayed = true;
                    }
                    _this.emit(ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT, courseWorkFileSelected.doSetIndexes, courseWorkFileSelected.selectedECourseWorkFile.linkData.mediaType, courseWorkFileSelected.isInFullResponseView);
                    break;
                case actionType.FILE_LIST_PANEL_TOGGLE_ACTION:
                    _this._isFilelistPanelCollapsed = action.isFilelistPanelCollapsed;
                    _this.emit(ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT, _this._isFilelistPanelCollapsed);
                    break;
                case actionType.MEDIA_PANEL_TRANSITION_END_ACTION:
                    _this.emit(ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT);
                    break;
                case actionType.FILELIST_PANEL_SWITCH_VIEW_ACTION:
                    var _filelistPanelSwitchViewAction = action;
                    _this._fileListPanelCurrentView = _filelistPanelSwitchViewAction.currentView;
                    if (_filelistPanelSwitchViewAction.doEmit) {
                        _this.emit(ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT);
                    }
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    var _loadContainerAction = action;
                    _this._isCustomToolbarMessageDisplayed = false;
                    if (_loadContainerAction.containerPage === enums.PageContainers.QigSelector &&
                        (_this._courseWorkFiles && _this._courseWorkFiles.count() > 0)) {
                        _this.clearCourseWorkFiles();
                    }
                    break;
                case actionType.MEDIA_PLAYER_PAUSE_ACTION:
                    _this.emit(ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT);
                    break;
                case actionType.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL:
                    _this.emit(ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT);
                    break;
                case actionType.DISPLAY_FILE_NAME_ACTION:
                    _this._fileName = action.fileName;
                    _this.emit(ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT, _this._fileName);
                    break;
                case actionType.FILE_READ_STATUS_CHANGE_ACTION:
                    var _fileReadStatusChangeAction = action;
                    _this.updateSelectedCourseWorkFileReadStatus(_fileReadStatusChangeAction.pageId, _fileReadStatusChangeAction.markGroupId, _fileReadStatusChangeAction.isChangeInProgress, _fileReadStatusChangeAction.isSaveCompleted);
                    if (_fileReadStatusChangeAction.isChangeInProgress) {
                        _this.emit(ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT, _fileReadStatusChangeAction.pageId);
                    }
                    if (_fileReadStatusChangeAction.isSaveCompleted &&
                        !_fileReadStatusChangeAction.isChangeInProgress) {
                        _this.emit(ECourseWorkFileStore.FILE_READ_STATUS_UPDATED);
                        if (_this.checkIfAllFilesViewed(_fileReadStatusChangeAction.markGroupId)) {
                            _this.emit(ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED);
                        }
                    }
                    break;
                case actionType.MEDIA_PLAYER_SOURCE_CHANGE_ACTION:
                    var _mediaPlayerSourceChanged = action;
                    _this.setSeletedPlayerMode(_mediaPlayerSourceChanged.docPageID, _mediaPlayerSourceChanged.sourceType);
                    _this.emit(ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT, _mediaPlayerSourceChanged.sourceType);
                    break;
                case actionType.MEDIA_PLAYER_USER_PREFERENCE_SAVE_ACTION:
                    var _preference = action;
                    _this.setMediaPlayerUserPreference(_preference.docPageID, _preference.lastPlayedVolume, _preference.lastPlayedMediaTime);
                    break;
                case actionType.FILE_DOWNLOADED_OUTSIDE_ACTION:
                    _this._isFileDownloadedOutside = true;
                    break;
                case actionType.SAVE_AND_NAVIGATE:
                    // the flag needs to be reset when Leave Response button is clicked from the
                    // combined warning popup
                    _this._isFileDownloadedOutside = false;
                    break;
                case actionType.CLEAR_COURSEWORK_DATA_ACTION:
                    _this.clearCourseWorkFiles();
                    _this.emit(ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT);
                    break;
                case actionType.RELOAD_FAILED_IMAGE:
                    _this.emit(ECourseWorkFileStore.RELOAD_FAILED_IMAGE);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    _this._selectedCandidateScript = action.selectedCandidateScriptId;
                    break;
            }
        });
    }
    /**
     * to set the coursework files collection of current response
     * @param candidateScriptId
     */
    ECourseWorkFileStore.prototype.setCurrentCourseWorkFiles = function (currentResponseCourseWorkFiles) {
        if (currentResponseCourseWorkFiles && currentResponseCourseWorkFiles.length > 0) {
            var counter_1 = 1;
            var that_1 = this;
            /* mapping the current files and creating new instnaces (if not the ref in the _courseworkfiles collection will update here)
               to add the same into array */
            currentResponseCourseWorkFiles.map(function (item) {
                var newObject = {
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
                    isSelected: counter_1 === 1 ? true : item.isSelected
                };
                counter_1++;
                that_1._currentResponseCourseWorkFiles.push(newObject);
            });
        }
    };
    /**
     * Set the selected coursework files
     * @param eCourseWorkFileSelectionData
     */
    ECourseWorkFileStore.prototype.setCourseWorkFileSelection = function (eCourseWorkFileSelectionData) {
        var selectedEcourseworkFile = eCourseWorkFileSelectionData.selectedECourseWorkFile;
        this._doAutoPlay = eCourseWorkFileSelectionData.doAutoPlay;
        this.setSelectedFiles(selectedEcourseworkFile);
    };
    /**
     * to set the isSelected property of selected ecoursework file
     * @param selectedEcourseworkFile
     */
    ECourseWorkFileStore.prototype.setSelectedFiles = function (selectedEcourseworkFile) {
        var _selectionFilteredFiles = this.getFilteredFileListForSelection(selectedEcourseworkFile);
        /* based on the multiple selection logic (if any) setting the currently selected files in the collection */
        if (this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0) {
            this._currentResponseCourseWorkFiles.map(function (item) {
                item.isSelected = false;
                if (_selectionFilteredFiles && _selectionFilteredFiles.length > 0) {
                    if (_selectionFilteredFiles.some(function (x) { return x.docPageID === item.docPageID; })) {
                        item.isSelected = true;
                    }
                }
                if (item.docPageID === selectedEcourseworkFile.docPageID) {
                    item.isSelected = true;
                }
            });
        }
    };
    /**
     * returns the filtered list for setting the current selection based on the multiple selection.
     * @param selectedEcourseworkFile
     */
    ECourseWorkFileStore.prototype.getFilteredFileListForSelection = function (selectedEcourseworkFile) {
        var _this = this;
        var filteredECourseWorkList;
        var _selectedeCourseWorkFiles = this._currentResponseCourseWorkFiles
            ? this._currentResponseCourseWorkFiles.filter(function (x) { return x.isSelected === true; })
            : undefined;
        if (this.isMultipleSelectionAvailable(selectedEcourseworkFile) &&
            (_selectedeCourseWorkFiles &&
                _selectedeCourseWorkFiles.length > 0 &&
                _selectedeCourseWorkFiles.every(function (x) { return _this.isMultipleSelectionAvailable(x); }))) {
            // find files with similar file type of the new file in original list,
            // if exist then exclude from the original list creating a filtered list.
            filteredECourseWorkList = _selectedeCourseWorkFiles.filter(function (x) { return x.linkData.mediaType !== selectedEcourseworkFile.linkData.mediaType; });
            // for all other file types other than audio for the new file,
            // only audio (if present) needs to be retained in the original list.
            // multiple audio selection will be handled it the first filtering
            if (selectedEcourseworkFile.linkData.mediaType !== enums.MediaType.Audio) {
                filteredECourseWorkList = filteredECourseWorkList.filter(function (x) { return x.linkData.mediaType === enums.MediaType.Audio; });
            }
        }
        return filteredECourseWorkList;
    };
    /**
     * Returns whether multiple selection is available with the file
     */
    ECourseWorkFileStore.prototype.isMultipleSelectionAvailable = function (file) {
        return (file.pageType === enums.PageType.Page ||
            file.linkData.mediaType === enums.MediaType.Audio ||
            file.linkData.mediaType === enums.MediaType.Image);
    };
    /**
     * update the selected course work file read status.
     */
    ECourseWorkFileStore.prototype.updateSelectedCourseWorkFileReadStatus = function (pageId, markGroupId, isChangeInProgress, isSaveCompleted) {
        var _this = this;
        var coureworkFiles = this.getCourseWorkFilesAgainstMarkGroupId(markGroupId);
        if (coureworkFiles) {
            coureworkFiles.forEach(function (courseworkFile) {
                if (courseworkFile.docPageID === pageId) {
                    // If any issues while saving read status in database, then set read and progress status as false.
                    if (!isSaveCompleted) {
                        courseworkFile.readStatus = false;
                        courseworkFile.readProgressStatus = false;
                        // TODO: Readstatus is updated in two collections (_currentResponseCourseWorkFiles and _courseWorkFiles)
                        // Change to single collection
                        _this.setEcourseworkFileStatus(pageId, false, false);
                    }
                    else {
                        courseworkFile.readStatus = true;
                        courseworkFile.readProgressStatus = isChangeInProgress;
                        // TODO: Readstatus is updated in two collections (_currentResponseCourseWorkFiles and _courseWorkFiles)
                        // Change to single collection
                        _this.setEcourseworkFileStatus(pageId, true, isChangeInProgress);
                    }
                }
            });
        }
    };
    /**
     * sets the selected player mode of the media
     * @param docPageId
     * @param playerMode
     */
    ECourseWorkFileStore.prototype.setSeletedPlayerMode = function (docPageId, playerMode) {
        this._currentResponseCourseWorkFiles.filter(function (x) { return x.docPageID === docPageId; })[0].playerMode = playerMode;
    };
    /**
     * Sets the user preferences of the media player.
     * @param docPageId
     * @param lastPlayedVolume
     * @param lastPlayedMediaTime
     */
    ECourseWorkFileStore.prototype.setMediaPlayerUserPreference = function (docPageId, lastPlayedVolume, lastPlayedMediaTime) {
        this._currentResponseCourseWorkFiles.map(function (file) {
            if (file.docPageID === docPageId) {
                file.lastPlayedVolume = lastPlayedVolume;
                file.lastPlayedMediaTime = lastPlayedMediaTime;
            }
        });
    };
    Object.defineProperty(ECourseWorkFileStore.prototype, "selectedMediaLastPlayedVolume", {
        /**
         * gets the volume of the selected media player
         */
        get: function () {
            var selectedPlayableFile = this.getSelectedPlayableFile();
            return selectedPlayableFile && !isNaN(selectedPlayableFile.lastPlayedVolume)
                ? selectedPlayableFile.lastPlayedVolume
                : 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "selectedMediaLastPlayedTime", {
        /**
         * gets the seek position of the selected media player
         */
        get: function () {
            var selectedPlayableFile = this.getSelectedPlayableFile();
            return selectedPlayableFile && selectedPlayableFile.lastPlayedMediaTime
                ? selectedPlayableFile.lastPlayedMediaTime
                : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * sets the selected status of ecoursework files
     * @param docPageId
     * @param readStatus
     * @param readProgressStatus
     */
    ECourseWorkFileStore.prototype.setEcourseworkFileStatus = function (docPageId, readStatus, readProgressStatus) {
        if (readStatus === void 0) { readStatus = false; }
        if (readProgressStatus === void 0) { readProgressStatus = false; }
        this._currentResponseCourseWorkFiles.filter(function (x) { return x.docPageID === docPageId; })[0].readStatus = readStatus;
        this._currentResponseCourseWorkFiles.filter(function (x) { return x.docPageID === docPageId; })[0].readProgressStatus = readProgressStatus;
    };
    Object.defineProperty(ECourseWorkFileStore.prototype, "isFilelistPanelCollapsed", {
        /**
         * get expand/collapse status of filelist panel
         */
        get: function () {
            return this._isFilelistPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "fileListPanelCurrentView", {
        /**
         * get current view status of filelist panel
         */
        get: function () {
            return this._fileListPanelCurrentView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "fileName", {
        /**
         * get expand/collapse status of filelist panel
         */
        get: function () {
            return this._fileName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "lastSelectedECourseworkFile", {
        /**
         * returns the last selected ECoursework file
         */
        get: function () {
            var _this = this;
            var selectedEcourseworkFiles = this.getSelectedECourseWorkFiles();
            var lastSelectedEcourseworkFile = selectedEcourseworkFiles
                ? selectedEcourseworkFiles.filter(function (file) { return file.docPageID === _this._recentlySelectedFileDocPageId; })
                : undefined;
            return lastSelectedEcourseworkFile ? lastSelectedEcourseworkFile.first() : undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * process the retrieved course work files
     * @param courseWorkFileList
     */
    ECourseWorkFileStore.prototype.processCourseWorkFileMetadata = function (eCourseWorkFileReturn, isSelectResponsesInStdSetup) {
        var _this = this;
        eCourseWorkFileReturn.map(function (item) {
            if (isSelectResponsesInStdSetup) {
                _this.addOrUpdateCourseWorkFiles(item.candidateScriptId, item.files);
                /* for SSU select responses, we have only candidatescriptId */
                if (item.candidateScriptId === _this._selectedCandidateScript) {
                    _this.setCurrentCourseWorkFiles(item.files);
                }
            }
            else {
                _this.addOrUpdateCourseWorkFiles(item.markGroupId, item.files);
                /*sets the current response coursework file selection based on the mark group id */
                if (item.markGroupId === _this._currentMarkGroupId) {
                    _this.setCurrentCourseWorkFiles(item.files);
                }
            }
        });
    };
    /**
     * add or update course work files against a candidateScriptID(incase of standardisation setup)/markGroupId.
     * @param identifier
     * @param courseWorkFiles
     */
    ECourseWorkFileStore.prototype.addOrUpdateCourseWorkFiles = function (identifier, courseWorkFiles) {
        if (identifier > 0 && courseWorkFiles) {
            this._courseWorkFiles = this._courseWorkFiles.set(identifier, courseWorkFiles);
        }
    };
    /**
     * clear the course work file list
     */
    ECourseWorkFileStore.prototype.clearCourseWorkFiles = function () {
        this._courseWorkFiles = Immutable.Map();
        this._currentResponseCourseWorkFiles = [];
    };
    /**
     * get course work files
     */
    ECourseWorkFileStore.prototype.getCourseWorkFiles = function () {
        return this._courseWorkFiles;
    };
    /**
     * return course work files against a candidateScriptID(incase of standardisation setup)/markGroupId.
     * @param identifier
     */
    ECourseWorkFileStore.prototype.getCourseWorkFilesAgainstMarkGroupId = function (identifier) {
        return this._courseWorkFiles.get(identifier);
    };
    /**
     * Gets the selected EcourseworkFile list. Ideally there will be one .
     * In case of mixed selection of audio + image or audio + document there can be 2 files.
     */
    ECourseWorkFileStore.prototype.getSelectedECourseWorkFiles = function () {
        var selectedFiles = this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0
            ? this._currentResponseCourseWorkFiles.filter(function (x) { return x.isSelected === true; })
            : undefined;
        return selectedFiles && selectedFiles.length > 0 ? Immutable.List(selectedFiles) : undefined;
    };
    /**
     * returns the coversheet metadata of given mark group Id and the file item
     * @param markGroupId -
     * @param docpageId - docpageid of the file item
     */
    ECourseWorkFileStore.prototype.getCoversheetMetaData = function (markGroupId, docpageId) {
        /* TODO: Change the members of CoverSheetMetaData type into camel case once we have converted the content JSON into
        camel case in server (newtonsoft) */
        var metadataList;
        var coureworkFiles = this.getCourseWorkFilesAgainstMarkGroupId(markGroupId);
        var metadata = coureworkFiles ? coureworkFiles.filter(function (x) { return x.docPageID === docpageId; })[0] : undefined;
        if (metadata && metadata.linkData && metadata.linkData.content) {
            var content = jsonHelper.toCamelCase(JSON.parse(metadata.linkData.content));
            if (content.additionalInfo.coversheetMetaDataCollection) {
                metadataList = content.additionalInfo.coversheetMetaDataCollection;
                /* The coversheet metadata json will be an array only if there are more than one metadata. If only one metadata available
                 it will get parsed as a single object than an immutable list. Hence we are checking the metadata array length and adding
                 it into list
                 TODO: Research the fix for handling this in server side (newtonsoft)*/
                if (!(content.additionalInfo.coversheetMetaDataCollection.coversheetMetaData.length > 0)) {
                    var value = [];
                    value.push(content.additionalInfo.coversheetMetaDataCollection.coversheetMetaData);
                    metadataList.coversheetMetaData = Immutable.List(value);
                }
            }
        }
        return metadataList ? metadataList.coversheetMetaData : undefined;
    };
    /**
     * Get the autoplay status for media file auto play
     */
    ECourseWorkFileStore.prototype.doAutoPlay = function () {
        return this._doAutoPlay;
    };
    /**
     * This method will return the corresponding E-Course workfile
     *
     * @param {number} markGroupId
     * @param {number} docPageID
     * @memberof ECourseWorkFileStore
     */
    ECourseWorkFileStore.prototype.getECourseWorkFile = function (markGroupId, docPageID) {
        var eCourseWorkFile;
        var eCourseWorkFileList = this.getCourseWorkFilesAgainstMarkGroupId(markGroupId);
        if (eCourseWorkFileList) {
            eCourseWorkFile = eCourseWorkFileList.filter(function (x) { return x.docPageID === docPageID; })[0];
        }
        return eCourseWorkFile;
    };
    /**
     * This method will return the index(order) a E-Course workfile
     *
     * @param {number} markGroupId
     * @param {number} docPageID
     * @memberof ECourseWorkFileStore
     */
    ECourseWorkFileStore.prototype.getIndexOfECourseWorkFile = function (markGroupId, docPageID) {
        var index = -1;
        var eCourseWorkFileList = this.getCourseWorkFilesAgainstMarkGroupId(markGroupId);
        if (eCourseWorkFileList) {
            eCourseWorkFileList.map(function (x, i) {
                if (x.docPageID === docPageID) {
                    index = i;
                }
            });
        }
        return index;
    };
    /**
     * Check whether all coursework files for a particular response is viewed or not.
     */
    ECourseWorkFileStore.prototype.checkIfAllFilesViewed = function (_markGroupId) {
        var isAllFilesViewed = true;
        if (this._courseWorkFiles.count() > 0) {
            var selectedCourseworkFile = this._courseWorkFiles.get(_markGroupId);
            if (selectedCourseworkFile) {
                selectedCourseworkFile.map(function (item) {
                    if (item.readStatus === false || item.readProgressStatus === true) {
                        isAllFilesViewed = false;
                    }
                });
            }
        }
        return isAllFilesViewed;
    };
    /**
     * returns the selected audio/video file among the currently selected coursework files ( if any multiple selection there)
     */
    ECourseWorkFileStore.prototype.getSelectedPlayableFile = function () {
        var selectedECourseWorkFiles = this.getSelectedECourseWorkFiles();
        var selectedFile = selectedECourseWorkFiles
            ? selectedECourseWorkFiles
                .filter(function (x) {
                return x.linkData.mediaType === enums.MediaType.Video ||
                    x.linkData.mediaType === enums.MediaType.Audio;
            })
                .first()
            : undefined;
        return selectedFile;
    };
    Object.defineProperty(ECourseWorkFileStore.prototype, "isSelectedPlayableFilesAlternateDownloadable", {
        /**
         * returns whether the audio/video file currently selected has a downloadable alternate file.
         */
        get: function () {
            var selectedAudioVideoFile = this.getSelectedPlayableFile();
            return (selectedAudioVideoFile &&
                selectedAudioVideoFile.alternateLink &&
                !selectedAudioVideoFile.alternateLink.linkData.canDisplayInApplication);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "isFileDownloadedOutside", {
        /**
         * returns whether any file downloaded outside Assessor
         */
        get: function () {
            return this._isFileDownloadedOutside;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "recentlySelectedFileDocPageId", {
        /**
         * Returns the recently slected file's doc page id.
         */
        get: function () {
            return this._recentlySelectedFileDocPageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseWorkFileStore.prototype, "iscustomToolbarMessageDisplayed", {
        get: function () {
            return this._isCustomToolbarMessageDisplayed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns true/false depends on selected ecoursework file is image or not.
     */
    ECourseWorkFileStore.prototype.isImageFileSelected = function (ecourseworkPageId) {
        return this._currentResponseCourseWorkFiles && this._currentResponseCourseWorkFiles.length > 0
            ? this._currentResponseCourseWorkFiles.filter(function (x) { return x.docPageID === ecourseworkPageId && x.linkData.mediaType === enums.MediaType.Image; }).length > 0
            : false;
    };
    // Holds the constant for representing the candidate e-course work metadata retrieval action
    ECourseWorkFileStore.CANDIDATE_ECOURSE_WORK_METADATA_RETRIEVAL_EVENT = 'CandidateECourseWorkMetadataRetrievalEvent';
    // Holds the constant of representing Filelist panel toggle action
    ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT = 'FileListPanelToggleActionEvent';
    // Holds the constant of representing Filelist panel switch view action
    ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT = 'FilelistPanelSwitchViewActionEvent';
    // Holds the constant for representing the file selectionchanged event
    ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT = 'ECourseWorkFileSelectionChangedEvent';
    ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT = 'DisplayFileNameEvent';
    ECourseWorkFileStore.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL_EVENT = 'updateZoomOnToggleFileListPanelEvent';
    ECourseWorkFileStore.PAUSE_MEDIA_PLAYER_EVENT = 'pauseMediaPlayerEvent';
    ECourseWorkFileStore.FILE_READ_STATUS_CHANGE_INPROGRESS_ACTION_EVENT = 'FileReadStatusChangeInProgressActionEvent';
    ECourseWorkFileStore.FILE_READ_STATUS_UPDATED = 'FileReadStatusUpdated';
    ECourseWorkFileStore.UPDATE_ALL_FILES_VIEWED = 'UpdateAllFilesViewed';
    ECourseWorkFileStore.MEDIA_PLAYER_SOURCE_CHANGED_EVENT = 'MediaPlayerSourceChangedEvent';
    ECourseWorkFileStore.MEDIA_PANEL_TRANSITION_END_EVENT = 'mediaPanelTransitionEndEvent';
    ECourseWorkFileStore.ECOURSEWORK_FILE_DATA_CLEARED_EVENT = 'ecourseworkFileDataClearedEvent';
    ECourseWorkFileStore.RELOAD_FAILED_IMAGE = 'reloadfailedimage';
    return ECourseWorkFileStore;
}(storeBase));
var instance = new ECourseWorkFileStore();
module.exports = { ECourseWorkFileStore: ECourseWorkFileStore, instance: instance };
//# sourceMappingURL=ecourseworkfilestore.js.map
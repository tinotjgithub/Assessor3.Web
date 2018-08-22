"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../enums');
var responseContainerHelperBase = require('./responsecontainerhelperbase');
var eCourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var FileListPanel = require('../../response/digital/ecoursework/filelistpanel');
var scriptHelper = require('../../../utility/script/scripthelper');
var responseStore = require('../../../stores/response/responsestore');
var eCourseWorkfileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var scriptActionCreator = require('../../../actions/script/scriptactioncreator');
var Immutable = require('immutable');
var eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
var URLS = require('../../../dataservices/base/urls');
var AudioPlayer = require('../../response/digital/ecoursework/audioplayer');
var VideoPlayer = require('../../response/digital/ecoursework/videoPlayer');
var AutoDownloadPlaceHolder = require('../../response/digital/ecoursework/downloadablefileitem');
var messageStore = require('../../../stores/message/messagestore');
var onPageCommentHelper = require('../annotation/onpagecommenthelper');
var FileNameIndicator = require('../../response/responsescreen/filenameindicator');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var ECourseworkContainerHelper = (function (_super) {
    __extends(ECourseworkContainerHelper, _super);
    function ECourseworkContainerHelper(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode) {
        var _this = this;
        _super.call(this, _responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
        /**
         * called for setting the side view class
         * @returns
         */
        this.enableSideViewComment = function (isExceptionPanelVisible) {
            var selectedFileMetadataList = _this.selectedFileMetadataList;
            _this.responseContainerProperty.hasOnPageComments = onPageCommentHelper.hasOnPageComments(selectedFileMetadataList, true, _this.responseContainerProperty.imageZonesCollection);
            return (_this.responseContainerProperty.hasOnPageComments &&
                ((!_this.responseContainerProperty.isMessagePanelVisible && !isExceptionPanelVisible) ||
                    (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize ||
                        _this.responseContainerProperty.isExceptionPanelMinimized)));
        };
        /**
         * get file list component.
         */
        this.fileList = function (identifier, selectedLanguage) {
            var componentProps = {
                key: 'FilelistPanel',
                id: 'FilelistPanel_key',
                selectedLanguage: selectedLanguage,
                renderedOn: Date.now(),
                responseId: identifier
            };
            return React.createElement(FileListPanel, componentProps);
        };
        /**
         * Method for getting alternate URL
         */
        this.getAlternateFile = function (selectedCourseWorkFile) {
            return (!selectedCourseWorkFile.alternateLink) ?
                null : _this.getECourseworkFileContentUrl(selectedCourseWorkFile.alternateLink.linkData.url);
        };
        /**
         * Method for creating the audio player component
         */
        this.audioPlayer = function (selectedLanguage, selectedCourseWorkVideoOrAudioFile, onCreateNewExceptionClicked) {
            var selectedCourseWorkFile = selectedCourseWorkVideoOrAudioFile;
            if (selectedCourseWorkFile) {
                var alternateFile = _this.getAlternateFile(selectedCourseWorkFile);
                var componentProps = {
                    key: 'MediaPlayer_key',
                    id: 'MediaPlayer_id',
                    selectedLanguage: selectedLanguage,
                    src: _this.getECourseworkFileContentUrl(selectedCourseWorkFile.linkData.url),
                    alternateFileSource: alternateFile,
                    docPageID: selectedCourseWorkFile.docPageID,
                    onCreateNewExceptionClicked: onCreateNewExceptionClicked
                };
                return React.createElement(AudioPlayer, componentProps);
            }
        };
        /**
         * Method for creating the video player component
         */
        this.videoPlayer = function (selectedLanguage, selectedCourseWorkVideoOrAudioFile, onCreateNewExceptionClicked) {
            var selectedCourseWorkFile = selectedCourseWorkVideoOrAudioFile;
            if (selectedCourseWorkFile) {
                var alternateFile = _this.getAlternateFile(selectedCourseWorkFile);
                var componentProps = {
                    key: 'MediaPlayer_key',
                    id: 'MediaPlayer_id',
                    selectedLanguage: selectedLanguage,
                    src: _this.getECourseworkFileContentUrl(selectedCourseWorkFile.linkData.url),
                    alternateFileSource: alternateFile,
                    docPageID: selectedCourseWorkFile.docPageID,
                    onCreateNewExceptionClicked: onCreateNewExceptionClicked
                };
                return React.createElement(VideoPlayer, componentProps);
            }
        };
        /**
         * called for getting selected ecoursework audio/video file
         */
        this.getSelectedCourseworkVideoOrAudioFile = function () {
            var ecourseWorkSelectedFile = eCourseWorkfileStore.instance.getSelectedECourseWorkFiles();
            var selectedVideoOrAudioFile;
            if (ecourseWorkSelectedFile) {
                selectedVideoOrAudioFile = ecourseWorkSelectedFile.filter(function (x) { return x.linkData.mediaType === enums.MediaType.Audio
                    || x.linkData.mediaType === enums.MediaType.Video; }).first();
            }
            return selectedVideoOrAudioFile;
        };
        /**
         * called for geting class name for media
         * @returns
         */
        this.getMediaPlayerContainerClassName = function (isInFullResponseView) {
            var className = '';
            var selectedFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
            if (selectedFiles) {
                className = ' e-course';
                if (isInFullResponseView) {
                    return className;
                }
                selectedFiles.forEach(function (file) {
                    /* no need to append these classes if the file is not supported by the application*/
                    if (file.linkData.canDisplayInApplication === true) {
                        switch (file.linkData.mediaType) {
                            case enums.MediaType.None:
                                if (file.pageType === enums.PageType.Page) {
                                    className += ' document';
                                }
                                break;
                            case enums.MediaType.Audio:
                                className += ' audio';
                                break;
                            case enums.MediaType.Image:
                                className += ' image';
                                break;
                            case enums.MediaType.Video:
                                className += ' video';
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            return className;
        };
        /**
         * Method for creating the downloadable File Item component
         */
        this.autoDownloadPlaceHolder = function (selectedLanguage) {
            var selectedCourseWorkFile = eCourseworkHelper.getCurrentEcourseworkFile();
            if (selectedCourseWorkFile && !selectedCourseWorkFile.linkData.canDisplayInApplication) {
                var componentProps = {
                    key: 'DownloadableFileItem_key',
                    id: 'DownloadableFileItem_id',
                    selectedLanguage: selectedLanguage,
                    fileName: decodeURIComponent(selectedCourseWorkFile.linkData.mediaFileName)
                };
                return React.createElement(AutoDownloadPlaceHolder, componentProps);
            }
        };
        /**
         * to render the media player as per the selected link type
         */
        this.renderMediaPlayer = function (onCreateNewExceptionClicked) {
            if (!_this.responseContainerProperty.isInFullResponseView &&
                !_this.responseContainerProperty.isNotSupportedFileElement) {
                var selectedMediaFiles = _this.getSelectedCourseworkVideoOrAudioFile();
                var mediaType = selectedMediaFiles ?
                    selectedMediaFiles.linkData.mediaType : selectedMediaFiles;
                _this.responseContainerProperty.isPlayerLoaded = mediaType ?
                    (mediaType === enums.MediaType.Audio || mediaType === enums.MediaType.Video) : false;
                if (mediaType && mediaType === enums.MediaType.Audio) {
                    return _this.audioPlayer(_this.selectedLanguage, selectedMediaFiles, onCreateNewExceptionClicked);
                }
                else if (mediaType && mediaType === enums.MediaType.Video) {
                    return _this.videoPlayer(_this.selectedLanguage, selectedMediaFiles, onCreateNewExceptionClicked);
                }
                return null;
            }
            else {
                return null;
            }
        };
        /**
         * not supported file placeholder element
         */
        this.notSupportedElement = function () {
            var notSupportedFileElement = !_this.responseContainerProperty.isInFullResponseView ?
                _this.autoDownloadPlaceHolder(_this.selectedLanguage) : null;
            if (notSupportedFileElement) {
                _this.responseContainerProperty.isNotSupportedFileElement = true;
            }
            else {
                _this.responseContainerProperty.isNotSupportedFileElement = false;
            }
            return notSupportedFileElement;
        };
    }
    Object.defineProperty(ECourseworkContainerHelper.prototype, "isSelectedFileNonConvertable", {
        /**
         * return true if the selected file is convertible for an eCoursework component
         */
        get: function () {
            var selectedFileMetadataList;
            var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
            if (this.responseContainerProperty.fileMetadataList && eCourseworkFiles) {
                selectedFileMetadataList = this.responseContainerProperty.fileMetadataList.
                    filter((function (x) { return x.pageId === eCourseworkFileStore.instance.recentlySelectedFileDocPageId; }));
                return this.responseContainerProperty.fileMetadataList.size > 0 &&
                    selectedFileMetadataList.size > 0 && !selectedFileMetadataList.first().isConvertible;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseworkContainerHelper.prototype, "selectedFileMetadataList", {
        /**
         * returns selected eCoursework file metadata list for doc/images
         */
        get: function () {
            var selectedFileMetadataList;
            var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
            var selectedFile;
            // Filtering the file to find its metadata
            //Filtering the image/doc file to find its metadata
            if (eCourseworkFiles) {
                var selectedCourseWorkFile = eCourseworkFiles.filter(function (y) {
                    return y.pageType === enums.PageType.Page || y.linkData.mediaType === enums.MediaType.Image;
                }).first();
                selectedFile = selectedCourseWorkFile ? selectedCourseWorkFile : eCourseworkFiles.first();
            }
            if (this.responseContainerProperty.fileMetadataList && selectedFile) {
                selectedFileMetadataList = this.responseContainerProperty.fileMetadataList.filter((function (x) { return x.pageId === selectedFile.docPageID; }));
            }
            return selectedFileMetadataList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ECourseworkContainerHelper.prototype, "selectedFilePageNumber", {
        /**
         * returns selected file page number
         * if audio/video + imagefile selected it returns imagefiles page number
         */
        get: function () {
            var selectedFileMetadataList;
            var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
            var selectedFile;
            var _fileMetaDataList = this.getFileMetadata();
            // Filtering the file to find its metadata
            //Filtering the image/doc file to find its metadata
            if (eCourseworkFiles) {
                var selectedCourseWorkFile = eCourseworkFiles.filter(function (y) {
                    return y.pageType === enums.PageType.Page || y.linkData.mediaType === enums.MediaType.Image;
                }).first();
                selectedFile = selectedCourseWorkFile ? selectedCourseWorkFile : eCourseworkFiles.first();
            }
            if (_fileMetaDataList && selectedFile) {
                selectedFileMetadataList = _fileMetaDataList.filter((function (x) { return x.pageId === selectedFile.docPageID; }));
            }
            return selectedFileMetadataList ? selectedFileMetadataList.first().pageNumber : 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * wrapper class name
     * @param isExceptionPanelVisible
     * @param isCommentsSideViewEnabled
     */
    ECourseworkContainerHelper.prototype.getResponseModeWrapperClassName = function (isExceptionPanelVisible, isCommentsSideViewEnabled, isInFullResponseView) {
        var enableSideViewComment = this.enableSideViewComment(isExceptionPanelVisible);
        // Append media player specific class ( only in normal view not in FRV)
        var responseModeWrapperClassName = this.getWrapperClassName(isExceptionPanelVisible, isCommentsSideViewEnabled, enableSideViewComment) + this.getMediaPlayerContainerClassName(isInFullResponseView);
        return responseModeWrapperClassName;
    };
    /**
     * Fetch images for ecourse work script images.
     */
    ECourseworkContainerHelper.prototype.fetchUnstructuredScriptImages = function () {
        var _this = this;
        var imagesToRender = [];
        // Fetch coursework file from the store.
        var selectedCourseWorkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        if (selectedCourseWorkFile) {
            var startPage_1 = selectedCourseWorkFile.linkData.startPage;
            var endPage_1 = selectedCourseWorkFile.linkData.endPage;
            var images_1 = [];
            // Get script image details.
            var scriptDetails = this.responseContainerProperty.scriptHelper.getScriptImageDetails();
            if (scriptDetails) {
                scriptDetails.forEach(function (scriptImage) {
                    if (scriptImage != null && !scriptImage.isSuppressed) {
                        if (scriptImage.pageNumber >= startPage_1 && scriptImage.pageNumber <= endPage_1) {
                            var rowVersion = scriptImage.rowVersion;
                            var scriptImageUrl = _this.responseContainerProperty.scriptHelper.
                                getScriptImageURLforTheScriptImage(scriptImage.pageNumber, rowVersion);
                            images_1.push(scriptImageUrl);
                        }
                    }
                });
            }
            if (images_1.length > 0) {
                imagesToRender.push(images_1);
            }
        }
        return imagesToRender;
    };
    /**
     * Get the urls for all images.
     */
    ECourseworkContainerHelper.prototype.getAllImageURLs = function () {
        var _this = this;
        var imageOrder = 0;
        var imageUrls = [];
        var additionalObjectFlag = Immutable.Map();
        this.responseContainerProperty.scriptHelper = new scriptHelper();
        // Fetch course work file content from the store.
        var selectedECourseworkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        // Get script image details.
        var scriptDetails = this.responseContainerProperty.scriptHelper.getScriptImageDetails();
        scriptDetails.forEach(function (scriptImage) {
            imageOrder++;
            if (scriptImage.isSuppressed) {
                imageUrls.push('');
            }
            else {
                if (selectedECourseworkFile) {
                    var startPage = selectedECourseworkFile.linkData.startPage;
                    var endPage = selectedECourseworkFile.linkData.endPage;
                    if (scriptImage.pageNumber >= startPage && scriptImage.pageNumber <= endPage) {
                        imageUrls.push(_this.responseContainerProperty.scriptHelper.
                            getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion));
                    }
                }
            }
            additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
        });
        scriptActionCreator.
            saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        return Immutable.List(imageUrls);
    };
    /**
     * Get the file meta data.
     */
    ECourseworkContainerHelper.prototype.getFileMetadata = function () {
        var _this = this;
        var imageOrder = 0;
        var additionalObjectFlag = Immutable.Map();
        this.responseContainerProperty.scriptHelper = new scriptHelper();
        var fileMetadataList = Immutable.List();
        var fileMetadata = [];
        var identifier;
        if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            identifier = standardisationSetupStore.instance.fetchSelectedScriptDetails(responseStore.instance.selectedDisplayId).candidateScriptId;
        }
        else if (responseStore.instance.selectedDisplayId) {
            var responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
            identifier = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                responseDetails.esMarkGroupId : responseDetails.markGroupId;
        }
        // Fetch ecourseworkfiles from the store.
        var eCourseworkFiles = eCourseworkFileStore.instance.
            getCourseWorkFilesAgainstMarkGroupId(identifier);
        if (eCourseworkFiles) {
            eCourseworkFiles.forEach(function (courseworkFile) {
                if (courseworkFile.pageType === enums.PageType.Page) {
                    // Get script image details.
                    var scriptDetails = _this.responseContainerProperty.scriptHelper.getScriptImageDetails();
                    scriptDetails.forEach(function (scriptImage) {
                        imageOrder++;
                        if (courseworkFile) {
                            // Check whether the link type is allowed for generating script images.
                            if (_this.isLinkTypeAllowedForScriptImage(courseworkFile.linkType)) {
                                var startPage = courseworkFile.linkData.startPage;
                                var endPage = courseworkFile.linkData.endPage;
                                if (scriptImage.pageNumber >= startPage && scriptImage.pageNumber <= endPage) {
                                    if (!scriptImage.isSuppressed) {
                                        // Add script images for course workfile with page type as page.
                                        var metadata = {
                                            url: _this.responseContainerProperty.scriptHelper.
                                                getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion),
                                            name: courseworkFile.title,
                                            pageId: courseworkFile.docPageID,
                                            isSuppressed: scriptImage.isSuppressed,
                                            pageNumber: scriptImage.pageNumber,
                                            linkType: courseworkFile.linkType,
                                            isConvertible: true,
                                            isImage: false
                                        };
                                        fileMetadata.push(metadata);
                                    }
                                }
                            }
                        }
                        additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
                    });
                }
                else if (courseworkFile.pageType === enums.PageType.Link) {
                    //Add link types such as audio, video etc in the file list meta data.
                    var isCloudContent = false;
                    isCloudContent = courseworkFile.linkData.cloudType !== enums.CloudType.None;
                    var responsedatafetch = {
                        url: _this.getECourseworkFileContentUrl(courseworkFile.linkData.url),
                        name: courseworkFile.title,
                        pageId: courseworkFile.docPageID,
                        isSuppressed: false,
                        pageNumber: courseworkFile.linkData.startPage,
                        linkType: courseworkFile.linkType,
                        isConvertible: false,
                        isImage: courseworkFile.linkData.mediaType === enums.MediaType.Image
                    };
                    fileMetadata.push(responsedatafetch);
                }
            });
            scriptActionCreator.
                saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
            fileMetadataList = Immutable.List(fileMetadata);
        }
        return fileMetadataList;
    };
    Object.defineProperty(ECourseworkContainerHelper.prototype, "doExcludeSuppressedPage", {
        /**
         * Return true if the component is e-course work
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Construct the ecoursework file content url.
     * @param url
     * @param isCloudContent
     */
    ECourseworkContainerHelper.prototype.getECourseworkFileContentUrl = function (url) {
        return config.general.SERVICE_BASE_URL +
            URLS.GET_ECOURSE_WORK_BASE_URL + url + '/';
    };
    /**
     * Return true only if the link type is allowed for generating script images
     */
    ECourseworkContainerHelper.prototype.isLinkTypeAllowedForScriptImage = function (linkType) {
        var isAllowed = false;
        switch (linkType.toLowerCase()) {
            case 'doc':
            case 'pdf':
            case 'rtf':
            case 'docx':
                isAllowed = true;
                break;
        }
        return isAllowed;
    };
    /**
     * fileNameIndicatorComponent element for ecoursework container
     * this indicator appears for all files except images, pdfs and word files.
     * for images the filename indicator is rendered in the imagecontainer.
     * @param renderedOn
     */
    ECourseworkContainerHelper.prototype.fileNameIndicatorComponent = function (renderedOn) {
        var lastSelectedFile = eCourseworkFileStore.instance.lastSelectedECourseworkFile;
        if (lastSelectedFile && lastSelectedFile.pageType === enums.PageType.Link &&
            lastSelectedFile.linkData.mediaType !== enums.MediaType.Image &&
            this.responseViewMode !== enums.ResponseViewMode.fullResponseView) {
            var componentProps = {
                key: 'filename-key',
                renderedOn: renderedOn
            };
            return React.createElement(FileNameIndicator, componentProps);
        }
        return null;
    };
    /**
     * Hide annotation toolbar, bookmarks panel and zoom panel for digital files.
     */
    ECourseworkContainerHelper.prototype.isDigitalFileSelected = function () {
        var selectedFileCount = 1;
        var isDigitalFile = false;
        selectedFileCount = eCourseworkFileStore.instance.getSelectedECourseWorkFiles() ?
            eCourseworkFileStore.instance.getSelectedECourseWorkFiles().count() : 0;
        if (selectedFileCount > 1) {
            isDigitalFile = false;
        }
        else if (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video)
            || eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio)) {
            isDigitalFile = true;
        }
        else {
            isDigitalFile = false;
        }
        return isDigitalFile;
    };
    return ECourseworkContainerHelper;
}(responseContainerHelperBase));
module.exports = ECourseworkContainerHelper;
//# sourceMappingURL=ecourseworkcontainerhelper.js.map
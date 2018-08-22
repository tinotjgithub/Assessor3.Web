import React = require('react');
import enums = require('../enums');
import responseContainerHelperBase = require('./responsecontainerhelperbase');
import eCourseWorkFile = require('../../../stores/response/digital/typings/courseworkfile');
import eCourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import FileListPanel = require('../../response/digital/ecoursework/filelistpanel');
import scriptHelper = require('../../../utility/script/scripthelper');
import responseStore = require('../../../stores/response/responsestore');
import eCourseWorkfileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import scriptActionCreator = require('../../../actions/script/scriptactioncreator');
import Immutable = require('immutable');
import eCourseworkHelper = require('../ecoursework/ecourseworkhelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import URLS = require('../../../dataservices/base/urls');
import AudioPlayer = require('../../response/digital/ecoursework/audioplayer');
import VideoPlayer = require('../../response/digital/ecoursework/videoPlayer');
import AutoDownloadPlaceHolder = require('../../response/digital/ecoursework/downloadablefileitem');
import responseContainerPropertyBase = require('./responsecontainerpropertybase');
import messageStore = require('../../../stores/message/messagestore');
import onPageCommentHelper = require('../annotation/onpagecommenthelper');
import markingStore = require('../../../stores/marking/markingstore');
import enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import FileNameIndicator = require('../../response/responsescreen/filenameindicator');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
import qigStore = require('../../../stores/qigselector/qigstore');
import awardingStore = require('../../../stores/awarding/awardingstore');
declare let config: any;

class ECourseworkContainerHelper extends responseContainerHelperBase {

    constructor(_responseContainerPropertyBase: responseContainerPropertyBase, renderedOn: number, selectedLanguage: string,
        _responseViewMode: enums.ResponseViewMode) {
        super(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
    }

    /**
     * return true if the selected file is convertible for an eCoursework component
     */
    public get isSelectedFileNonConvertable(): boolean {
        let selectedFileMetadataList: any;

        let eCourseworkFiles: Immutable.List<eCourseWorkFile> = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        if (this.responseContainerProperty.fileMetadataList && eCourseworkFiles) {
            selectedFileMetadataList = this.responseContainerProperty.fileMetadataList.
                filter(((x: FileMetadata) => x.pageId === eCourseworkFileStore.instance.recentlySelectedFileDocPageId));
            return this.responseContainerProperty.fileMetadataList.size > 0 &&
                selectedFileMetadataList.size > 0 && !selectedFileMetadataList.first().isConvertible;
        }
        return false;
    }

    /**
     * returns selected eCoursework file metadata list for doc/images
     */
    public get selectedFileMetadataList(): any {
        let selectedFileMetadataList: any;
        let eCourseworkFiles: Immutable.List<eCourseWorkFile> = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile;

        // Filtering the file to find its metadata
        //Filtering the image/doc file to find its metadata
        if (eCourseworkFiles) {
            let selectedCourseWorkFile = eCourseworkFiles.filter((y: eCourseWorkFile) =>
                y.pageType === enums.PageType.Page || y.linkData.mediaType === enums.MediaType.Image).first();

            selectedFile = selectedCourseWorkFile ? selectedCourseWorkFile : eCourseworkFiles.first();
        }

        if (this.responseContainerProperty.fileMetadataList && selectedFile) {
            selectedFileMetadataList = this.responseContainerProperty.fileMetadataList.filter
                (((x: FileMetadata) => x.pageId === selectedFile.docPageID));
        }
        return selectedFileMetadataList;
    }

    /**
     * returns selected file page number
     * if audio/video + imagefile selected it returns imagefiles page number
     */
    public get selectedFilePageNumber(): number {
        let selectedFileMetadataList: any;
        let eCourseworkFiles: Immutable.List<eCourseWorkFile> = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedFile;
        let _fileMetaDataList = this.getFileMetadata();
        // Filtering the file to find its metadata
        //Filtering the image/doc file to find its metadata
        if (eCourseworkFiles) {
            let selectedCourseWorkFile = eCourseworkFiles.filter((y: eCourseWorkFile) =>
                y.pageType === enums.PageType.Page || y.linkData.mediaType === enums.MediaType.Image).first();

            selectedFile = selectedCourseWorkFile ? selectedCourseWorkFile : eCourseworkFiles.first();
        }

        if (_fileMetaDataList && selectedFile) {
            selectedFileMetadataList = _fileMetaDataList.filter
                (((x: FileMetadata) => x.pageId === selectedFile.docPageID));
        }
        return selectedFileMetadataList ? selectedFileMetadataList.first().pageNumber : 0;
    }

    /**
     * called for setting the side view class
     * @returns
     */
    public enableSideViewComment = (isExceptionPanelVisible: boolean): boolean => {
        let selectedFileMetadataList: Immutable.List<FileMetadata> = this.selectedFileMetadataList;
        this.responseContainerProperty.hasOnPageComments = onPageCommentHelper.hasOnPageComments(selectedFileMetadataList, true,
            this.responseContainerProperty.imageZonesCollection);
        return (this.responseContainerProperty.hasOnPageComments &&
            ((!this.responseContainerProperty.isMessagePanelVisible && !isExceptionPanelVisible) ||
                (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize ||
                    this.responseContainerProperty.isExceptionPanelMinimized))
        );
    };

    /**
     * wrapper class name
     * @param isExceptionPanelVisible
     * @param isCommentsSideViewEnabled
     */
    public getResponseModeWrapperClassName(isExceptionPanelVisible: boolean, isCommentsSideViewEnabled: boolean,
        isInFullResponseView: boolean): string {
        let enableSideViewComment = this.enableSideViewComment(isExceptionPanelVisible);
        // Append media player specific class ( only in normal view not in FRV)
        let responseModeWrapperClassName = this.getWrapperClassName(isExceptionPanelVisible,
            isCommentsSideViewEnabled, enableSideViewComment) + this.getMediaPlayerContainerClassName(isInFullResponseView);

        return responseModeWrapperClassName;
    }

    /**
     * get file list component.
     */
    public fileList = (identifier: number, selectedLanguage: string): JSX.Element => {
        let componentProps = {
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
    public getAlternateFile = (selectedCourseWorkFile: eCourseWorkFile): string => {
        return (!selectedCourseWorkFile.alternateLink) ?
            null : this.getECourseworkFileContentUrl(selectedCourseWorkFile.alternateLink.linkData.url);
    }

    /**
     * Method for creating the audio player component
     */
    public audioPlayer = (selectedLanguage: string, selectedCourseWorkVideoOrAudioFile: eCourseWorkFile,
        onCreateNewExceptionClicked: Function): JSX.Element => {
        let selectedCourseWorkFile = selectedCourseWorkVideoOrAudioFile;
        if (selectedCourseWorkFile) {
            let alternateFile = this.getAlternateFile(selectedCourseWorkFile);
            let componentProps = {
                key: 'MediaPlayer_key',
                id: 'MediaPlayer_id',
                selectedLanguage: selectedLanguage,
                src: this.getECourseworkFileContentUrl(selectedCourseWorkFile.linkData.url),
                alternateFileSource: alternateFile,
                docPageID: selectedCourseWorkFile.docPageID,
                onCreateNewExceptionClicked: onCreateNewExceptionClicked
            };

            return React.createElement(AudioPlayer, componentProps);
        }
    }

    /**
     * Method for creating the video player component
     */
    public videoPlayer = (selectedLanguage: string, selectedCourseWorkVideoOrAudioFile: eCourseWorkFile,
        onCreateNewExceptionClicked: Function): JSX.Element => {
        let selectedCourseWorkFile = selectedCourseWorkVideoOrAudioFile;

        if (selectedCourseWorkFile) {
            let alternateFile = this.getAlternateFile(selectedCourseWorkFile);
            let componentProps = {
                key: 'MediaPlayer_key',
                id: 'MediaPlayer_id',
                selectedLanguage: selectedLanguage,
                src: this.getECourseworkFileContentUrl(selectedCourseWorkFile.linkData.url),
                alternateFileSource: alternateFile,
                docPageID: selectedCourseWorkFile.docPageID,
                onCreateNewExceptionClicked: onCreateNewExceptionClicked
            };

            return React.createElement(VideoPlayer, componentProps);
        }
    }

    /**
     * called for getting selected ecoursework audio/video file
     */
    public getSelectedCourseworkVideoOrAudioFile = (): any => {
        let ecourseWorkSelectedFile = eCourseWorkfileStore.instance.getSelectedECourseWorkFiles();
        let selectedVideoOrAudioFile;
        if (ecourseWorkSelectedFile) {
            selectedVideoOrAudioFile = ecourseWorkSelectedFile.filter(
                (x: eCourseWorkFile) => x.linkData.mediaType === enums.MediaType.Audio
                    || x.linkData.mediaType === enums.MediaType.Video).first();
        }
        return selectedVideoOrAudioFile;
    }

    /**
     * called for geting class name for media
     * @returns
     */
    public getMediaPlayerContainerClassName = (isInFullResponseView: boolean): string => {

        let className: string = '';
        let selectedFiles: Immutable.List<eCourseWorkFile> = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();

        if (selectedFiles) {

            className = ' e-course';

            if (isInFullResponseView) {
                return className;
            }
            selectedFiles.forEach((file: eCourseWorkFile) => {
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
    }

    /**
     * Method for creating the downloadable File Item component
     */
    public autoDownloadPlaceHolder = (selectedLanguage: string): JSX.Element => {
        let selectedCourseWorkFile = eCourseworkHelper.getCurrentEcourseworkFile();

        if (selectedCourseWorkFile && !selectedCourseWorkFile.linkData.canDisplayInApplication) {
            let componentProps = {
                key: 'DownloadableFileItem_key',
                id: 'DownloadableFileItem_id',
                selectedLanguage: selectedLanguage,
                fileName: decodeURIComponent(selectedCourseWorkFile.linkData.mediaFileName)
            };

            return React.createElement(AutoDownloadPlaceHolder, componentProps);
        }
    }

    /**
     * Fetch images for ecourse work script images.
     */
    public fetchUnstructuredScriptImages() {
        let imagesToRender: string[][] = [];
        // Fetch coursework file from the store.
        let selectedCourseWorkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        if (selectedCourseWorkFile) {
            let startPage = selectedCourseWorkFile.linkData.startPage;
            let endPage = selectedCourseWorkFile.linkData.endPage;
            let images: string[] = [];
            // Get script image details.
            let scriptDetails = this.responseContainerProperty.scriptHelper.getScriptImageDetails();
            // filtering the script images for getting un supressed images
            // when clicking the image file in the ecw component in awarding mode
            if (markerOperationModeFactory.operationMode.isAwardingMode
                && selectedCourseWorkFile.linkData.mediaType === enums.MediaType.Image) {
                scriptDetails = scriptDetails.filter(x => x.isSuppressed);
            }
            if (scriptDetails) {
                scriptDetails.forEach((scriptImage: ScriptImage) => {
                    if (scriptImage != null && !scriptImage.isSuppressed) {
                        if (scriptImage.pageNumber >= startPage && scriptImage.pageNumber <= endPage) {
                            let rowVersion = scriptImage.rowVersion;
                            let scriptImageUrl = this.responseContainerProperty.scriptHelper.
                                getScriptImageURLforTheScriptImage(scriptImage.pageNumber,
                                    rowVersion,
                                    scriptImage.candidateScriptId,
                                    scriptImage.documentId,
                                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                            images.push(scriptImageUrl);
                        }
                    }
                });
            }
            if (images.length > 0) {
                imagesToRender.push(images);
            }
        }

        return imagesToRender;
    }

    /**
     * Get the urls for all images.
     */
    public getAllImageURLs(): Immutable.List<string> {
        let imageOrder: number = 0;
        let imageUrls: string[] = [];
        let additionalObjectFlag = Immutable.Map<number, boolean>();
        this.responseContainerProperty.scriptHelper = new scriptHelper();
        // Fetch course work file content from the store.
        let selectedECourseworkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        // Get script image details.
        let scriptDetails = this.responseContainerProperty.scriptHelper.getScriptImageDetails();
        scriptDetails.forEach((scriptImage: ScriptImage) => {
            imageOrder++;
            if (scriptImage.isSuppressed) {
                imageUrls.push('');
            } else {
                if (selectedECourseworkFile) {
                    let startPage = selectedECourseworkFile.linkData.startPage;
                    let endPage = selectedECourseworkFile.linkData.endPage;
                    if (scriptImage.pageNumber >= startPage && scriptImage.pageNumber <= endPage) {
                        imageUrls.push(this.responseContainerProperty.scriptHelper.
                            getScriptImageURLforTheScriptImage(scriptImage.pageNumber,
                                scriptImage.rowVersion,
                                scriptImage.candidateScriptId,
                                scriptImage.documentId,
                                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId));
                    }
                }
            }
            additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
        });
        scriptActionCreator.
            saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        return Immutable.List<string>(imageUrls);
    }

    /**
     * Get the file meta data.
     */
    public getFileMetadata(): Immutable.List<FileMetadata> {
        let imageOrder: number = 0;
        let additionalObjectFlag = Immutable.Map<number, boolean>();
        this.responseContainerProperty.scriptHelper = new scriptHelper();
        let fileMetadataList = Immutable.List<FileMetadata>();
        let fileMetadata = [];
        let identifier: number;
        if (standardisationSetupStore.instance.isSelectResponsesWorklist) {
            identifier = standardisationSetupStore.instance.fetchSelectedScriptDetails
                (responseStore.instance.selectedDisplayId).candidateScriptId;
        } else if (responseStore.instance.selectedDisplayId) {
            let responseDetails = markerOperationModeFactory.operationMode.openedResponseDetails
                (responseStore.instance.selectedDisplayId.toString());
            identifier = markerOperationModeFactory.operationMode.isStandardisationSetupMode ?
                responseDetails.esMarkGroupId : responseDetails.markGroupId;
        }
        // Fetch ecourseworkfiles from the store.
        let eCourseworkFiles = eCourseworkFileStore.instance.
            getCourseWorkFilesAgainstIdentifier(identifier);
        if (eCourseworkFiles) {
            eCourseworkFiles.forEach((courseworkFile: eCourseWorkFile) => {
                if (courseworkFile.pageType === enums.PageType.Page) {
                    // Get script image details.
                    let scriptDetails = this.responseContainerProperty.scriptHelper.getScriptImageDetails();
                    scriptDetails.forEach((scriptImage: ScriptImage) => {
                        imageOrder++;
                        if (courseworkFile) {
                            // Check whether the link type is allowed for generating script images.
                            if (this.isLinkTypeAllowedForScriptImage(courseworkFile.linkType)) {
                                let startPage = courseworkFile.linkData.startPage;
                                let endPage = courseworkFile.linkData.endPage;
                                if (scriptImage.pageNumber >= startPage && scriptImage.pageNumber <= endPage) {
                                    if (!scriptImage.isSuppressed) {
                                        // Add script images for course workfile with page type as page.
                                        let metadata: FileMetadata = {
                                            url: this.responseContainerProperty.scriptHelper.
                                                getScriptImageURLforTheScriptImage(scriptImage.pageNumber,
                                                    scriptImage.rowVersion,
                                                    scriptImage.candidateScriptId,
                                                    scriptImage.documentId,
                                                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId),
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
                } else if (courseworkFile.pageType === enums.PageType.Link) {
                    //Add link types such as audio, video etc in the file list meta data.
                    let isCloudContent: boolean = false;
                    isCloudContent = courseworkFile.linkData.cloudType !== enums.CloudType.None;
                    let responsedatafetch: FileMetadata = {
                        url: this.getECourseworkFileContentUrl(courseworkFile.linkData.url),
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
    }

    /**
     * Return true if the component is e-course work
     */
    public get doExcludeSuppressedPage(): boolean {
        return true;
    }

    /**
     * Construct the ecoursework file content url.
     * @param url
     * @param isCloudContent
     */
    public getECourseworkFileContentUrl(url: string) {
        let requestedExaminerId: number = markerOperationModeFactory.operationMode.isAwardingMode
            ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerId : 0;

        return config.general.SERVICE_BASE_URL +
            URLS.GET_ECOURSE_WORK_BASE_URL + url + '/' + requestedExaminerId + '/';
    }

    /**
     * Return true only if the link type is allowed for generating script images
     */
    public isLinkTypeAllowedForScriptImage(linkType: string) {
        let isAllowed: boolean = false;
        switch (linkType.toLowerCase()) {
            case 'doc':
            case 'pdf':
            case 'rtf':
            case 'docx':
                isAllowed = true;
                break;
        }

        return isAllowed;
    }

    /**
     * fileNameIndicatorComponent element for ecoursework container
     * this indicator appears for all files except images, pdfs and word files.
     * for images the filename indicator is rendered in the imagecontainer.
     * @param renderedOn
     */
    public fileNameIndicatorComponent(renderedOn: number): JSX.Element {

        let lastSelectedFile: eCourseWorkFile = eCourseworkFileStore.instance.lastSelectedECourseworkFile;

        if (lastSelectedFile && lastSelectedFile.pageType === enums.PageType.Link &&
            lastSelectedFile.linkData.mediaType !== enums.MediaType.Image &&
            this.responseViewMode !== enums.ResponseViewMode.fullResponseView) {
            let componentProps = {
                key: 'filename-key',
                renderedOn: renderedOn
            };

            return React.createElement(FileNameIndicator, componentProps);
        }

        return null;
    }

    /**
     * Hide annotation toolbar, bookmarks panel and zoom panel for digital files.
     */
    public isDigitalFileSelected() {
        let selectedFileCount: number = 1;
        let isDigitalFile: boolean = false;
        selectedFileCount = eCourseworkFileStore.instance.getSelectedECourseWorkFiles() ?
            eCourseworkFileStore.instance.getSelectedECourseWorkFiles().count() : 0;
        if (selectedFileCount > 1) {
            isDigitalFile = false;
        } else if (eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Video)
            || eCourseworkHelper.getSelectedECourseworkMediaFile(enums.MediaType.Audio)) {
            isDigitalFile = true;
        } else {
            isDigitalFile = false;
        }
        return isDigitalFile;
    }

    /**
     * to render the media player as per the selected link type
     */
    public renderMediaPlayer = (onCreateNewExceptionClicked: Function): JSX.Element => {
        if (!this.responseContainerProperty.isInFullResponseView &&
            !this.responseContainerProperty.isNotSupportedFileElement) {
            let selectedMediaFiles = this.getSelectedCourseworkVideoOrAudioFile();
            let mediaType = selectedMediaFiles ?
                selectedMediaFiles.linkData.mediaType : selectedMediaFiles;

            this.responseContainerProperty.isPlayerLoaded = mediaType ?
                (mediaType === enums.MediaType.Audio || mediaType === enums.MediaType.Video) : false;

            if (mediaType && mediaType === enums.MediaType.Audio) {
                return this.audioPlayer(this.selectedLanguage,
                    selectedMediaFiles, onCreateNewExceptionClicked);
            } else if (mediaType && mediaType === enums.MediaType.Video) {
                return this.videoPlayer(this.selectedLanguage,
                    selectedMediaFiles, onCreateNewExceptionClicked);
            }
            return null;
        } else {
            return null;
        }
    }

    /**
     * not supported file placeholder element
     */
    public notSupportedElement = (): JSX.Element => {
        let notSupportedFileElement = !this.responseContainerProperty.isInFullResponseView ?
            this.autoDownloadPlaceHolder(this.selectedLanguage) : null;
        if (notSupportedFileElement) {
            this.responseContainerProperty.isNotSupportedFileElement = true;
        } else {
            this.responseContainerProperty.isNotSupportedFileElement = false;
        }

        return notSupportedFileElement;
    };
}
export = ECourseworkContainerHelper;
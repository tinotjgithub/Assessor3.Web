import React = require('react');
import enums = require('../enums');
import Immutable = require('immutable');
import worklistStore = require('../../../stores/worklist/workliststore');
import eCourseworkArgument = require('../../../dataservices/script/typings/ecourseworkarguments');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import scriptActionCreator = require('../../../actions/script/scriptactioncreator');
import eCourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import eCourseworkFile = require('../../../stores/response/digital/typings/courseworkfile');
declare let config: any;
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
import ECourseWorkDefinitions = require('../../response/digital/ecoursework/ecourseworkdefinitions');
import localeStore = require('../../../stores/locale/localestore');
import eCourseworkResponseActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
import URLS = require('../../../dataservices/base/urls');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import stampStore = require('../../../stores/stamp/stampstore');
import makerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
import awardingStore = require('../../../stores/awarding/awardingstore');

/**
 * helper class for e-course work
 */
class ECourseworkHelper {

    /* return true if the component is e-course work */
    public static get isECourseworkComponent() {
        let ccValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ECoursework);
        return ccValue.toLowerCase() === 'true' ? true : false;
    }

    /**
     * return the arguments for e-course work data service call
     */
    public static getECourseWorkFileArguments(displayId: number, isSelectResponseInStdSetup: boolean) {

        let eCourseWorkArguments: Immutable.List<eCourseworkArgument> = Immutable.List<eCourseworkArgument>();
        let isEsResponse = ECourseworkHelper.isESResponse;
        let eCourseWorkArgument;

        if (displayId) {
            let _responseData: any = isSelectResponseInStdSetup ? standardisationSetupStore.instance.fetchSelectedScriptDetails(displayId)
                : makerOperationModeFactory.operationMode.openedResponseDetails(displayId.toString());
            eCourseWorkArgument = this.getECourseWorkArgument(_responseData, isSelectResponseInStdSetup);
            if (eCourseWorkArgument) {
                eCourseWorkArgument.isESResponse = isEsResponse;
                eCourseWorkArguments = eCourseWorkArguments.set(0, eCourseWorkArgument);
            }
        } else {
            let responseList = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
            if (responseList) {
                let _index: number = 0;
                responseList.map((item: ResponseBase) => {
                    eCourseWorkArgument = this.getECourseWorkArgument(item);
                    if (eCourseWorkArgument) {
                        eCourseWorkArgument.isESResponse = isEsResponse;
                        eCourseWorkArguments = eCourseWorkArguments.set(_index, eCourseWorkArgument);
                        _index++;
                    }
                });
            }
        }
        return eCourseWorkArguments;
    }

    /**
     * return the arguments for e-course work
     */
    private static getECourseWorkArgument(_responseData: any, isSelectResponseInStdSetup: boolean = false): eCourseworkArgument {
        let isStandardisationSetupMode = makerOperationModeFactory.operationMode.isStandardisationSetupMode;
        if (!eCourseWorkFileStore.instance.getCourseWorkFilesAgainstIdentifier(
            isSelectResponseInStdSetup ? _responseData.candidateScriptId :
                isStandardisationSetupMode ? _responseData.esMarkGroupId : _responseData.markGroupId)) {
            let eCourseWorkArgument = new eCourseworkArgument();
            eCourseWorkArgument.markGroupId = isSelectResponseInStdSetup ? 0 : isStandardisationSetupMode ?
                _responseData.esMarkGroupId : _responseData.markGroupId;
            eCourseWorkArgument.candidateScriptId = _responseData.candidateScriptId;
            eCourseWorkArgument.isDefinitive = isSelectResponseInStdSetup ? 0 : _responseData.isDefinitiveResponse;
            return eCourseWorkArgument;
        } else {
            return null;
        }
    }

    /**
     * determine if the response is ES or not
     */
    public static get isESResponse() {
        let currentWorkListType = worklistStore.instance.currentWorklistType;
        let isEsResponse: boolean = currentWorkListType === enums.WorklistType.standardisation ||
            currentWorkListType === enums.WorklistType.practice ||
            currentWorkListType === enums.WorklistType.secondstandardisation ||
            currentWorkListType === enums.WorklistType.simulation ||
            makerOperationModeFactory.operationMode.isStandardisationSetupMode;
        return isEsResponse;
    }

    /**
     * handles data load for the e-course work file metadata
     */
    public static fetchECourseWorkCandidateScriptMetadata(displayId: number,
        isFromBackgroundHelper: boolean = false,
        isSelectResponseInStdSetup: boolean = false) {
        if (ECourseworkHelper.isECourseworkComponent) {
            let eCourseWorkArguments = ECourseworkHelper.getECourseWorkFileArguments(displayId, isSelectResponseInStdSetup);
            let examinerId = examinerStore.instance.getMarkerInformation ?
                examinerStore.instance.getMarkerInformation.examinerId : 0;
            let examinerRoleId = (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions
                && teamManagementStore.instance.selectedException) ?
                teamManagementStore.instance.selectedException.originatorExaminerRoleId : operationModeHelper.examinerRoleId;
            let batchSize: number = config.general.ECOURSEFILE_METADATA_DOWNLOAD_BATCH_SIZE;
            if (eCourseWorkArguments.count() > 0) {
                let argumentCount = eCourseWorkArguments.count();
                // if the concurrentLimit is set to 0 then we will assume that we need to send the whole list
                if (argumentCount <= batchSize || batchSize === 0) {
                    // collection had less number of items than the concurrent limit.
                    // so we need to send the whole collection to get the data
                    scriptActionCreator.fetchECourseWorkCandidateScriptMetadata(
                        eCourseWorkArguments,
                        examinerId,
                        examinerRoleId,
                        isFromBackgroundHelper ? enums.Priority.Second : enums.Priority.First,
                        makerOperationModeFactory.operationMode.isStandardisationSetupMode,
                        standardisationSetupStore.instance.isSelectResponsesWorklist);
                } else {
                    for (let startIndex = 0; startIndex < argumentCount; startIndex += batchSize) {
                        let endIndex = startIndex + batchSize;
                        let newCollection;
                        if (endIndex > argumentCount) {
                            newCollection = eCourseWorkArguments.slice(startIndex, argumentCount).toList();
                        } else {
                            newCollection = eCourseWorkArguments.slice(startIndex, endIndex).toList();
                        }
                        // get the items which are not undefined as slice will give undefined items
                        newCollection = newCollection.filter(item => item !== undefined);
                        scriptActionCreator.fetchECourseWorkCandidateScriptMetadata(
                            newCollection,
                            examinerId,
                            examinerRoleId,
                            isFromBackgroundHelper ? enums.Priority.Second : enums.Priority.First,
                            makerOperationModeFactory.operationMode.isStandardisationSetupMode,
                            standardisationSetupStore.instance.isSelectResponsesWorklist);
                    }
                }
            }
        }
    }

    /**
     * Get the selected ecoursework file which contain page type as page.
     */
    public static getSelectedECourseworkImageFile() {
        let eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedECourseWorkFile: eCourseworkFile;
        selectedECourseWorkFile = eCourseworkFiles ?
            (eCourseworkFiles.filter((x: eCourseworkFile) =>
                x.pageType === enums.PageType.Page || x.linkData.mediaType === enums.MediaType.Image).first()) : selectedECourseWorkFile;
        return selectedECourseWorkFile;
    }

    /**
     * Get the selected ecoursework file by the media type value.
     */
    public static getSelectedECourseworkMediaFile(mediaType: enums.MediaType) {
        let eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedECourseWorkFile: eCourseworkFile;
        if (eCourseworkFiles) {
            selectedECourseWorkFile = (eCourseworkFiles.filter((x: eCourseworkFile) =>
                (x.linkData.mediaType === mediaType)).first());
        }

        return selectedECourseWorkFile;
    }

    /**
     *  Get the selected file is digital file or not
     */
    public static isDigitalFile() {
        let isDigitalFile: boolean = false;

        if (!stampStore.instance.isFavouriteToolbarEmpty
            || this.getSelectedECourseworkMediaFile(enums.MediaType.Video)
            || this.getSelectedECourseworkMediaFile(enums.MediaType.Audio)) {
            isDigitalFile = true;
        }

        return isDigitalFile;
    }

    /**
     * Get the selected ecoursework images.
     */
    public static getSelectedECourseworkImages() {
        let eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        let selectedECourseWorkFile: eCourseworkFile;
        if (eCourseworkFiles) {
            selectedECourseWorkFile = (eCourseworkFiles.filter((x: eCourseworkFile) =>
                (x.linkData.mediaType === enums.MediaType.Image) || (x.pageType === enums.PageType.Page)).first());
        }

        return selectedECourseWorkFile;
    }

    /**
     * Get the currently selected ecoursework file
     */
    public static getCurrentEcourseworkFile(pageId = undefined) {
        let eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        if (eCourseworkFiles) {
            return pageId ? eCourseworkFiles.filter((x: eCourseworkFile) => x.docPageID === pageId).first()
                : eCourseworkFiles.last();
        }
    }

    /**
     * Getting Icon from linkType
     */
    public static getIconStyleForSvg(linkType: string, isEnhancedOffpageComment: boolean = false) {

        let icon: string;
        let svgClass: string;
        let listItemClass: string = isEnhancedOffpageComment ? '' : 'media-file-item ';
        let viewBox: string = '';

        switch (linkType.toLowerCase()) {
            case 'tif':
            case 'jpeg':
            case 'jpg':
            case 'png':
            case 'gif':
                icon = 'image-icon';
                svgClass = 'image-icon';
                listItemClass = listItemClass + 'image-file';
                viewBox = '0 0 18 22';
                break;
            case 'doc':
            case 'text':
            case 'docx':
                icon = 'document-icon';
                svgClass = 'doc-icon';
                listItemClass = listItemClass + 'doc-file';
                viewBox = '0 0 18 22';
                break;
            case 'video':
            case 'mp4':
            case 'mpeg':
            case 'wmv':
                icon = 'video-icon';
                svgClass = 'video-icon';
                listItemClass = listItemClass + 'video-file';
                viewBox = '0 0 18 22';
                break;
            case 'audio':
            case 'mp3':
            case 'wav':
                icon = 'audio-icon';
                svgClass = 'audio-icon';
                listItemClass = listItemClass + 'audio-file';
                viewBox = '0 0 18 22';
                break;
            case 'pdf':
                icon = 'pdf-icon';
                svgClass = 'pdf-icon';
                listItemClass = listItemClass + 'pdf-file';
                viewBox = '0 0 18 22';
                break;
            case 'zip':
            case 'unknown':
                icon = 'unknown-file-icon';
                svgClass = 'unknown-file-icon';
                listItemClass = listItemClass + 'unknown-file';
                viewBox = '0 0 18 22';
                break;
            case 'ppt':
            case 'pptx':
            case 'pps':
                icon = 'ppt-icon';
                svgClass = 'ppt-icon';
                listItemClass = listItemClass + 'ppt-file';
                viewBox = '0 0 18 22';
                break;
            case 'rtf':
                icon = 'rtf-icon';
                svgClass = 'rtf-icon';
                listItemClass = listItemClass + 'rtf-file';
                viewBox = '0 0 18 22';
                break;
            case 'xslt':
            case 'csv':
            case 'xlsb':
            case 'xls':
            case 'xlsx':
                icon = 'excel-icon';
                svgClass = 'excel-icon';
                listItemClass = listItemClass + 'excel-file';
                viewBox = '0 0 18 22';
                break;
            case 'html':
                icon = 'html-icon';
                svgClass = 'html-icon';
                listItemClass = listItemClass + 'html-file';
                viewBox = '0 0 18 22';
                break;
            default:
        }

        return {
            icon: icon,
            svgClass: svgClass,
            listItemClass: listItemClass,
            viewBox: viewBox
        };
    }

    /**
     * Function for rendering definitions
     */
    public static renderDefinitions(): JSX.Element {
        let eCourseWorkDefinitionsProps = {
            id: 'ecourse_work_definitions',
            key: 'ecourse_work_definitions_key',
            selectedLanguage: localeStore.instance.Locale
        };

        return React.createElement(ECourseWorkDefinitions, eCourseWorkDefinitionsProps);
    }

    /**
     * Method to set the selected ecoursework file read and in progress status to true.
     */
    public static updatefileReadStatusProgress(markGroupId, pageId = undefined) {
        let eCourseworkFiles = ECourseworkHelper.getCurrentEcourseworkFile(pageId);
        if (eCourseworkFiles && !eCourseworkFiles.readStatus) {
            // event to update readStatus and fileInProgress value to "True" in Store
            eCourseworkResponseActionCreator.
                updatefileReadStatusProgress(eCourseworkFiles.docPageID, markGroupId);
        }
    }

    /**
     * Construct the ecoursework file content url.
     * @param url
     */
    public static getECourseworkFileContentUrl(url: string) {
        // passing the examiner id as part of awarding responses while open via the awarding
        let requestedExaminerId: number = makerOperationModeFactory.operationMode.isAwardingMode
            ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerId : 0;

        return config.general.SERVICE_BASE_URL +
            URLS.GET_ECOURSE_WORK_BASE_URL + url + '/' + requestedExaminerId + '/';
    }

    /**
     * Method to Pause VideoFile
     */
    public static pauseVideo() {
        let selectedEcourseWorkFiles: eCourseworkFile = eCourseWorkFileStore.instance.getSelectedPlayableFile();
        if (selectedEcourseWorkFiles) {
            if (selectedEcourseWorkFiles.linkData.mediaType === enums.MediaType.Video) {
                eCourseworkResponseActionCreator.pauseMediaPlayer();
            }
        }

    }

    /**
     * open source url in new window (Download)
     * @static
     * @memberof ECourseworkHelper
     */
    public static openFileInNewWindow = (sourceURL: string, handleOffline: boolean = true): boolean => {
        let isOnline: boolean = applicationStore.instance.isOnline;
        let requestedExaminerId: number = makerOperationModeFactory.operationMode.isAwardingMode
            ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerId : 0;
        //Content disposition header needs to be added to the request for a file from cloud to download
        //'CloudContent' method's second parameter determines whether the file needs to be downloaded or not
        // So checks whether the file is in cloud, if yes, enable the parameter for content disposition
        let contentDisposition: string = sourceURL.indexOf('CloudContent/') > 0 ?
            (sourceURL.substring(sourceURL.length - 1) === '/' ? 'true' : '/true') : '';
        sourceURL = sourceURL + contentDisposition;
        if (handleOffline && isOnline) {
            // if application just went to offline then we've to call ping method
            applicationActionCreator.validateNetWorkStatus();
            // if we call checkActionInterrupted() method directly, we won't get 
            // correct online status. That's why we used a setTimeOut with 0 delay to call that method . Promise logic is
            // not working here. This will re-queues this line of code to the end of the execution queue.
            setTimeout(() => {
                isOnline = applicationActionCreator.checkActionInterrupted();
                // handling offline scenario
                if (isOnline) {
                    window.open(sourceURL);
                }
            }, 0);
        } else if (handleOffline) {
            // show network error popup
            applicationActionCreator.checkActionInterrupted();
        } else {
            window.open(sourceURL);
        }

        return isOnline;
    }

    /**
     * Clear the ecoursework file data from store
     */
    public static clearEcourseworkFileData = (): void => {
        eCourseworkResponseActionCreator.clearEcourseworkFileData();
    }
}
export = ECourseworkHelper;
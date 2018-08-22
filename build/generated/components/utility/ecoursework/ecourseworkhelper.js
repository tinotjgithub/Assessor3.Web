"use strict";
var React = require('react');
var enums = require('../enums');
var Immutable = require('immutable');
var worklistStore = require('../../../stores/worklist/workliststore');
var eCourseworkArgument = require('../../../dataservices/script/typings/ecourseworkarguments');
var configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var examinerStore = require('../../../stores/markerinformation/examinerstore');
var scriptActionCreator = require('../../../actions/script/scriptactioncreator');
var eCourseworkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');
var ECourseWorkDefinitions = require('../../response/digital/ecoursework/ecourseworkdefinitions');
var localeStore = require('../../../stores/locale/localestore');
var eCourseworkResponseActionCreator = require('../../../actions/ecoursework/ecourseworkresponseactioncreator');
var URLS = require('../../../dataservices/base/urls');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var operationModeHelper = require('../userdetails/userinfo/operationmodehelper');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var stampStore = require('../../../stores/stamp/stampstore');
var makerOperationModeFactory = require('../markeroperationmode/markeroperationmodefactory');
/**
 * helper class for e-course work
 */
var ECourseworkHelper = (function () {
    function ECourseworkHelper() {
    }
    Object.defineProperty(ECourseworkHelper, "isECourseworkComponent", {
        /* return true if the component is e-course work */
        get: function () {
            var ccValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ECoursework);
            return ccValue.toLowerCase() === 'true' ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return the arguments for e-course work data service call
     */
    ECourseworkHelper.getECourseWorkFileArguments = function (displayId, isSelectResponseInStdSetup) {
        var _this = this;
        var eCourseWorkArguments = Immutable.List();
        var isEsResponse = ECourseworkHelper.isESResponse;
        var eCourseWorkArgument;
        if (displayId) {
            var _responseData = isSelectResponseInStdSetup ? standardisationSetupStore.instance.fetchSelectedScriptDetails(displayId)
                : makerOperationModeFactory.operationMode.openedResponseDetails(displayId.toString());
            eCourseWorkArgument = this.getECourseWorkArgument(_responseData, isSelectResponseInStdSetup);
            if (eCourseWorkArgument) {
                eCourseWorkArgument.isESResponse = isEsResponse;
                eCourseWorkArguments = eCourseWorkArguments.set(0, eCourseWorkArgument);
            }
        }
        else {
            var responseList = worklistStore.instance.getCurrentWorklistResponseBaseDetails();
            if (responseList) {
                var _index_1 = 0;
                responseList.map(function (item) {
                    eCourseWorkArgument = _this.getECourseWorkArgument(item);
                    if (eCourseWorkArgument) {
                        eCourseWorkArgument.isESResponse = isEsResponse;
                        eCourseWorkArguments = eCourseWorkArguments.set(_index_1, eCourseWorkArgument);
                        _index_1++;
                    }
                });
            }
        }
        return eCourseWorkArguments;
    };
    /**
     * return the arguments for e-course work
     */
    ECourseworkHelper.getECourseWorkArgument = function (_responseData, isSelectResponseInStdSetup) {
        if (isSelectResponseInStdSetup === void 0) { isSelectResponseInStdSetup = false; }
        var isStandardisationSetupMode = makerOperationModeFactory.operationMode.isStandardisationSetupMode;
        if (!eCourseWorkFileStore.instance.getCourseWorkFilesAgainstMarkGroupId(isSelectResponseInStdSetup ? _responseData.candidateScriptId :
            isStandardisationSetupMode ? _responseData.esMarkGroupId : _responseData.markGroupId)) {
            var eCourseWorkArgument = new eCourseworkArgument();
            eCourseWorkArgument.markGroupId = isSelectResponseInStdSetup ? 0 : isStandardisationSetupMode ?
                _responseData.esMarkGroupId : _responseData.markGroupId;
            eCourseWorkArgument.candidateScriptId = _responseData.candidateScriptId;
            eCourseWorkArgument.isDefinitive = isSelectResponseInStdSetup ? 0 : _responseData.isDefinitiveResponse;
            return eCourseWorkArgument;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(ECourseworkHelper, "isESResponse", {
        /**
         * determine if the response is ES or not
         */
        get: function () {
            var currentWorkListType = worklistStore.instance.currentWorklistType;
            var isEsResponse = currentWorkListType === enums.WorklistType.standardisation ||
                currentWorkListType === enums.WorklistType.practice ||
                currentWorkListType === enums.WorklistType.secondstandardisation ||
                currentWorkListType === enums.WorklistType.simulation ||
                makerOperationModeFactory.operationMode.isStandardisationSetupMode;
            return isEsResponse;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * handles data load for the e-course work file metadata
     */
    ECourseworkHelper.fetchECourseWorkCandidateScriptMetadata = function (displayId, isFromBackgroundHelper, isSelectResponseInStdSetup) {
        if (isFromBackgroundHelper === void 0) { isFromBackgroundHelper = false; }
        if (isSelectResponseInStdSetup === void 0) { isSelectResponseInStdSetup = false; }
        if (ECourseworkHelper.isECourseworkComponent) {
            var eCourseWorkArguments = ECourseworkHelper.getECourseWorkFileArguments(displayId, isSelectResponseInStdSetup);
            var examinerId = examinerStore.instance.getMarkerInformation ?
                examinerStore.instance.getMarkerInformation.examinerId : 0;
            var examinerRoleId = (teamManagementStore.instance.selectedTeamManagementTab === enums.TeamManagement.Exceptions
                && teamManagementStore.instance.selectedException) ?
                teamManagementStore.instance.selectedException.originatorExaminerRoleId : operationModeHelper.examinerRoleId;
            var batchSize = config.general.ECOURSEFILE_METADATA_DOWNLOAD_BATCH_SIZE;
            if (eCourseWorkArguments.count() > 0) {
                var argumentCount = eCourseWorkArguments.count();
                // if the concurrentLimit is set to 0 then we will assume that we need to send the whole list
                if (argumentCount <= batchSize || batchSize === 0) {
                    // collection had less number of items than the concurrent limit.
                    // so we need to send the whole collection to get the data
                    scriptActionCreator.fetchECourseWorkCandidateScriptMetadata(eCourseWorkArguments, examinerId, examinerRoleId, isFromBackgroundHelper ? enums.Priority.Second : enums.Priority.First, makerOperationModeFactory.operationMode.isStandardisationSetupMode);
                }
                else {
                    for (var startIndex = 0; startIndex < argumentCount; startIndex += batchSize) {
                        var endIndex = startIndex + batchSize;
                        var newCollection = void 0;
                        if (endIndex > argumentCount) {
                            newCollection = eCourseWorkArguments.slice(startIndex, argumentCount).toList();
                        }
                        else {
                            newCollection = eCourseWorkArguments.slice(startIndex, endIndex).toList();
                        }
                        // get the items which are not undefined as slice will give undefined items
                        newCollection = newCollection.filter(function (item) { return item !== undefined; });
                        scriptActionCreator.fetchECourseWorkCandidateScriptMetadata(newCollection, examinerId, examinerRoleId, isFromBackgroundHelper ? enums.Priority.Second : enums.Priority.First, makerOperationModeFactory.operationMode.isStandardisationSetupMode);
                    }
                }
            }
        }
    };
    /**
     * Get the selected ecoursework file which contain page type as page.
     */
    ECourseworkHelper.getSelectedECourseworkImageFile = function () {
        var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        var selectedECourseWorkFile;
        selectedECourseWorkFile = eCourseworkFiles ?
            (eCourseworkFiles.filter(function (x) {
                return x.pageType === enums.PageType.Page || x.linkData.mediaType === enums.MediaType.Image;
            }).first()) : selectedECourseWorkFile;
        return selectedECourseWorkFile;
    };
    /**
     * Get the selected ecoursework file by the media type value.
     */
    ECourseworkHelper.getSelectedECourseworkMediaFile = function (mediaType) {
        var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        var selectedECourseWorkFile;
        if (eCourseworkFiles) {
            selectedECourseWorkFile = (eCourseworkFiles.filter(function (x) {
                return (x.linkData.mediaType === mediaType);
            }).first());
        }
        return selectedECourseWorkFile;
    };
    /**
     *  Get the selected file is digital file or not
     */
    ECourseworkHelper.isDigitalFile = function () {
        var isDigitalFile = false;
        if (!stampStore.instance.isFavouriteToolbarEmpty
            || this.getSelectedECourseworkMediaFile(enums.MediaType.Video)
            || this.getSelectedECourseworkMediaFile(enums.MediaType.Audio)) {
            isDigitalFile = true;
        }
        return isDigitalFile;
    };
    /**
     * Get the selected ecoursework images.
     */
    ECourseworkHelper.getSelectedECourseworkImages = function () {
        var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        var selectedECourseWorkFile;
        if (eCourseworkFiles) {
            selectedECourseWorkFile = (eCourseworkFiles.filter(function (x) {
                return (x.linkData.mediaType === enums.MediaType.Image) || (x.pageType === enums.PageType.Page);
            }).first());
        }
        return selectedECourseWorkFile;
    };
    /**
     * Get the currently selected ecoursework file
     */
    ECourseworkHelper.getCurrentEcourseworkFile = function (pageId) {
        if (pageId === void 0) { pageId = undefined; }
        var eCourseworkFiles = eCourseworkFileStore.instance.getSelectedECourseWorkFiles();
        if (eCourseworkFiles) {
            return pageId ? eCourseworkFiles.filter(function (x) { return x.docPageID === pageId; }).first()
                : eCourseworkFiles.last();
        }
    };
    /**
     * Getting Icon from linkType
     */
    ECourseworkHelper.getIconStyleForSvg = function (linkType, isEnhancedOffpageComment) {
        if (isEnhancedOffpageComment === void 0) { isEnhancedOffpageComment = false; }
        var icon;
        var svgClass;
        var listItemClass = isEnhancedOffpageComment ? '' : 'media-file-item ';
        var viewBox = '';
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
    };
    /**
     * Function for rendering definitions
     */
    ECourseworkHelper.renderDefinitions = function () {
        var eCourseWorkDefinitionsProps = {
            id: 'ecourse_work_definitions',
            key: 'ecourse_work_definitions_key',
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(ECourseWorkDefinitions, eCourseWorkDefinitionsProps);
    };
    /**
     * Method to set the selected ecoursework file read and in progress status to true.
     */
    ECourseworkHelper.updatefileReadStatusProgress = function (markGroupId, pageId) {
        if (pageId === void 0) { pageId = undefined; }
        var eCourseworkFiles = ECourseworkHelper.getCurrentEcourseworkFile(pageId);
        if (eCourseworkFiles && !eCourseworkFiles.readStatus) {
            // event to update readStatus and fileInProgress value to "True" in Store
            eCourseworkResponseActionCreator.
                updatefileReadStatusProgress(eCourseworkFiles.docPageID, markGroupId);
        }
    };
    /**
     * Construct the ecoursework file content url.
     * @param url
     */
    ECourseworkHelper.getECourseworkFileContentUrl = function (url) {
        return config.general.SERVICE_BASE_URL +
            URLS.GET_ECOURSE_WORK_BASE_URL + url + '/';
    };
    /**
     * Method to Pause VideoFile
     */
    ECourseworkHelper.pauseVideo = function () {
        var selectedEcourseWorkFiles = eCourseWorkFileStore.instance.getSelectedPlayableFile();
        if (selectedEcourseWorkFiles) {
            if (selectedEcourseWorkFiles.linkData.mediaType === enums.MediaType.Video) {
                eCourseworkResponseActionCreator.pauseMediaPlayer();
            }
        }
    };
    /**
     * open source url in new window (Download)
     * @static
     * @memberof ECourseworkHelper
     */
    ECourseworkHelper.openFileInNewWindow = function (sourceURL, handleOffline) {
        if (handleOffline === void 0) { handleOffline = true; }
        var isOnline = applicationStore.instance.isOnline;
        //Content disposition header needs to be added to the request for a file from cloud to download
        //'CloudContent' method's second parameter determines whether the file needs to be downloaded or not
        // So checks whether the file is in cloud, if yes, enable the parameter for content disposition
        var contentDisposition = sourceURL.indexOf('CloudContent/') > 0 ?
            (sourceURL.substring(sourceURL.length - 1) === '/' ? 'true' : '/true') : '';
        sourceURL = sourceURL + contentDisposition;
        if (handleOffline && isOnline) {
            // if application just went to offline then we've to call ping method
            applicationActionCreator.validateNetWorkStatus();
            // if we call checkActionInterrupted() method directly, we won't get 
            // correct online status. That's why we used a setTimeOut with 0 delay to call that method . Promise logic is
            // not working here. This will re-queues this line of code to the end of the execution queue.
            setTimeout(function () {
                isOnline = applicationActionCreator.checkActionInterrupted();
                // handling offline scenario
                if (isOnline) {
                    window.open(sourceURL);
                }
            }, 0);
        }
        else if (handleOffline) {
            // show network error popup
            applicationActionCreator.checkActionInterrupted();
        }
        else {
            window.open(sourceURL);
        }
        return isOnline;
    };
    /**
     * Clear the ecoursework file data from store
     */
    ECourseworkHelper.clearEcourseworkFileData = function () {
        eCourseworkResponseActionCreator.clearEcourseworkFileData();
    };
    return ECourseworkHelper;
}());
module.exports = ECourseworkHelper;
//# sourceMappingURL=ecourseworkhelper.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var storageAdapterFactory = require('../storageadapters/storageadapterfactory');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var storageAdapterHelper = require('../storageadapters/storageadapterhelper');
var StandardisationSetupDataServices = (function (_super) {
    __extends(StandardisationSetupDataServices, _super);
    function StandardisationSetupDataServices() {
        _super.apply(this, arguments);
        this._storageAdapterHelper = new storageAdapterHelper();
    }
    /**
     * initiate the tags API call and returns the left panel target details.
     * @param callback
     */
    StandardisationSetupDataServices.prototype.getStandardisationTargetDetails = function (markSchemeGroupId, examinerRoleId, callback) {
        var url = urls.GET_STANDARDISATION_TARGET_DETAILS;
        var getStdTargetsPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId + '/' + examinerRoleId);
        var that = this;
        getStdTargetsPromise.then(function (json) {
            var standardisationTargetDetailsData = that.getImmutableStandardisationTargetDetails(JSON.parse(json));
            callback(true, standardisationTargetDetailsData);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * API call to get getReuseRigDetails
     * @param examinerRoleId
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     * @param callback
     */
    StandardisationSetupDataServices.prototype.getReuseRigDetails = function (examinerRoleId, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, useCache, callback) {
        var that;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('standardisationSetup', 'getReuseRigDetails_' + examinerRoleId + '_' + markSchemeGroupID + '_' +
                isReUsableResponsesSelected + '_' + isHideResponsesSelected, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                callback(jsonResult.success, jsonResult.value);
            }).catch(function (jsonResult) {
                that.getReuseRigDetailsFromServer(examinerRoleId, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, callback);
            });
        }
        else {
            this.getReuseRigDetailsFromServer(examinerRoleId, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, callback);
        }
    };
    /**
     * Server Call to get ReuseRigDetails
     * @param examinerRoleId
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     * @param callback
     */
    StandardisationSetupDataServices.prototype.getReuseRigDetailsFromServer = function (examinerRoleId, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, callback) {
        var that = this;
        var url = urls.GET_REUSE_RIG_DETAILS;
        var standardisationSetupReusableDetailsList;
        var reuseRigPromise = this.makeAJAXCall('GET', url
            + '/' + examinerRoleId
            + '/' + markSchemeGroupID
            + '/' + isReUsableResponsesSelected
            + '/' + isHideResponsesSelected);
        reuseRigPromise.then(function (json) {
            var result;
            result = (JSON.parse(json));
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Server Call to update the isActive Status to hide a Reuse RIG
     * @param isActiveStatus
     * @param dislayId
     * @param callback
     */
    StandardisationSetupDataServices.prototype.updateHideResponseStatus = function (displayId, isActiveStatus, callback) {
        var that = this;
        var url = urls.UPDATE_REUSE_HIDE_RESPONSE_STATUS;
        var isHideStatusCompleted = false;
        var updateHideStatusPromise = this.makeAJAXCall('POST', url
            + '/' + displayId
            + '/' + isActiveStatus);
        updateHideStatusPromise.then(function (json) {
            isHideStatusCompleted = (JSON.parse(json));
            callback(true, isHideStatusCompleted);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Gets the standardisation centre details from the API
     * @param questionPaperId
     * @param specialNeed
     * @param isMarkFromPaper
     * @param examinerRoleId
     * @param useCache
     * @param callback
     */
    StandardisationSetupDataServices.prototype.getStandardisationCentresDetails = function (questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, useCache, callback) {
        var that = this;
        if (useCache) {
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('standardisationSetup', 'centreList_' + questionPaperId + '_' + examinerRoleId, true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                /* if the data ahs been received from storage adapter, return the result */
                callback(jsonResult.success, jsonResult.value);
            }).catch(function (jsonResult) {
                that.getStandardisationCentresDetailsFromServer(questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, callback);
            });
        }
        else {
            this.getStandardisationCentresDetailsFromServer(questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, callback);
        }
    };
    /**
     * Get the standardisation setup centre list detailS from server
     * @param questionPaperId
     * @param specialNeed
     * @param isMarkFromPaper
     * @param examinerRoleId
     * @param callback
     */
    StandardisationSetupDataServices.prototype.getStandardisationCentresDetailsFromServer = function (questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, callback) {
        var that = this;
        var centreList;
        var url = urls.GET_STANDARDISATION_CENTRE_LIST +
            '/' + questionPaperId +
            '/' + specialNeed +
            '/' + isMarkFromPaper +
            '/' + examinerRoleId;
        // Make an ajax call to retrieve data and store the same in storage adapter.
        var standardisationCentreListPromise = that.makeAJAXCall('GET', url);
        // Store the data in in-memory storage adapter.
        standardisationCentreListPromise.then(function (json) {
            centreList = JSON.parse(json);
            if (callback) {
                storageAdapterFactory.getInstance().storeData('standardisationSetup', 'centreList_' + questionPaperId + '_' + examinerRoleId, centreList, true).then(function () {
                    callback(true, that.getImmutableCentreDetailsList(centreList));
                }).catch();
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * retrives the script details, for the selected centre.
     * @param markSchemeGroupId
     * @param questionPaperID
     * @param centreID
     * @param considerAtypical
     * @param examinerRoleId
     * @param callback
     */
    StandardisationSetupDataServices.prototype.GetScriptDetailsOfSelectedCentre = function (markSchemeGroupId, questionPaperID, centrePartID, considerAtypical, examinerRoleId, callback) {
        var url = urls.GET_SCRIPTLIST_OF_SELECT_CENTRE;
        var that = this;
        var centreScriptListPromise = this.makeAJAXCall('GET', url + '/' + markSchemeGroupId
            + '/' + questionPaperID
            + '/' + centrePartID
            + '/' + considerAtypical
            + '/' + examinerRoleId);
        centreScriptListPromise.then(function (json) {
            var result;
            result = that.getImmutableScriptDetailsList(JSON.parse(json));
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    StandardisationSetupDataServices.prototype.getImmutableCentreDetailsList = function (data) {
        var immutableList = Immutable.List(data.centreList);
        data.centreList = immutableList;
        return data;
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    StandardisationSetupDataServices.prototype.getImmutableScriptDetailsList = function (data) {
        var immutableList = Immutable.List(data.centreScriptList);
        data.centreScriptList = immutableList;
        return data;
    };
    /**
     * Initiate the Standardisation API call and returns the classified response details.
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     * @param callback
     */
    StandardisationSetupDataServices.prototype.GetClassifiedResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, isOnline, callback) {
        var that = this;
        var memoryStorageKey = enums.StandardisationSetup.ClassifiedResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        var url = urls.GET_CLASSIFIED_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, memoryStorageKey, callback, enums.PageContainers.StandardisationSetup, url, enums.StandardisationSetup.ClassifiedResponse);
    };
    /**
     * initiate the tags API call and returns the Unclassified response details.
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     * @param doUseCache
     * @param callback
     */
    StandardisationSetupDataServices.prototype.GetUnClassifiedResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, callback) {
        var that = this;
        var memoryStorageKey = enums.StandardisationSetup.UnClassifiedResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        var url = urls.GET_UNCLASSIFIED_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, memoryStorageKey, callback, enums.PageContainers.StandardisationSetup, url, enums.StandardisationSetup.UnClassifiedResponse);
    };
    /**
     * Make ajax call to get std response details.
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     * @param memoryStorageKey
     * @param callback
     * @param pageContainer
     * @param url
     */
    StandardisationSetupDataServices.prototype.makeAjaxCallToGetSTDResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, memoryStorageKey, callback, pageContainer, url, standardisationSetupWorklist) {
        var getSTDResponseDetailsPromise = this.makeAJAXCall('GET', url + '/' + examinerRoleID + '/' + examinerId + '/'
            + markSchemeGroupId + '/' + isViewMCQRIGMarks + '/' + worklistViewType);
        getSTDResponseDetailsPromise.then(function (json) {
            var result;
            result = JSON.parse(json);
            callback(true, result);
        }).catch(function (json) {
            callback(false, undefined);
        });
    };
    /**
     * Initiate the Standardisation API call and returns the provisional response details.
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     * @param doUseCache
     * @param isOnline
     * @param callback
     */
    StandardisationSetupDataServices.prototype.GetProvisionalResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, doUseCache, isOnline, callback) {
        var that = this;
        var memoryStorageKey = enums.StandardisationSetup.ProvisionalResponse.toString() + '_'
            + enums.getEnumString(enums.STDWorklistViewType, worklistViewType) + '_'
            + examinerRoleID;
        var url = urls.GET_PROVISIONAL_WORKLIST_DETAILS;
        that.makeAjaxCallToGetSTDResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, memoryStorageKey, callback, enums.PageContainers.StandardisationSetup, url, enums.StandardisationSetup.ProvisionalResponse);
    };
    /**
     * Create Standardisation Rig for provisional
     * @param arg Create argument
     */
    StandardisationSetupDataServices.prototype.createStandardisationRig = function (arg, callback) {
        var url = urls.STANDARDISATION_CREATE_RIG;
        var that = this;
        var standardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        standardisationPromise.then(function (json) {
            if (callback) {
                var result = that.getImmutable(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Complete Standardisation Setup for component
     * @param arg Create argument
     */
    StandardisationSetupDataServices.prototype.completeStandardisation = function (arg, callback) {
        var url = urls.COMPLETE_STANDARDISATION_SETUP;
        var that = this;
        var standardisationPromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        standardisationPromise.then(function (json) {
            if (callback) {
                var result = void 0;
                result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    StandardisationSetupDataServices.prototype.getImmutable = function (dataToParse) {
        var data = JSON.parse(dataToParse);
        var immutableList = Immutable.List(data.createStandardisationRIGReturnDetails);
        data.createStandardisationRIGReturnDetails = immutableList;
        return data;
    };
    /**
     *  Method which converts the standardisationTargetDetails to immutable list
     * @param data
     */
    StandardisationSetupDataServices.prototype.getImmutableStandardisationTargetDetails = function (data) {
        data.standardisationTargetDetails = Immutable.List(data.standardisationTargetDetails);
        return data;
    };
    /**
     * Declassify the script based on the parameters
     * @param candidateScriptId
     * @param markSchemeGroupId
     * @param markingModeId
     * @param examinerId
     * @param esCandidateScriptMarkSchemeGroupId
     * @param callback
     */
    StandardisationSetupDataServices.prototype.updateESMarkGroupMarkingMode = function (arg, callback) {
        var url = urls.UPDATE_ES_MARK_GROUP_MARKING_MODE;
        var declassifyResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        declassifyResponsePromise.then(function (json) {
            callback(true);
        }).catch(function (json) {
            callback(false);
        });
    };
    /**
     * Method to save standardistation response notes
     * @param esMarkGrupId
     * @param callback
     */
    StandardisationSetupDataServices.prototype.saveNotes = function (arg, callback) {
        var url = urls.SAVE_NOTES;
        var saveNoteResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg));
        saveNoteResponsePromise.then(function (json) {
            callback(true);
        }).catch(function (json) {
            callback(false);
        });
    };
    /**
     * Discard Standardisation response
     */
    StandardisationSetupDataServices.prototype.discardStandardisationResponse = function (arg, callback) {
        var url = urls.DISCARD_STANDARDISATION_RESPONSE;
        var that = this;
        var discardStandardisationResponsePromise = this.makeAJAXCall('POST', url, JSON.stringify(arg), true, false);
        discardStandardisationResponsePromise.then(function (json) {
            if (callback) {
                var result = void 0;
                result = JSON.parse(json);
                callback(true, result);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    return StandardisationSetupDataServices;
}(dataServiceBase));
var standardisationSetupDataServices = new StandardisationSetupDataServices();
module.exports = standardisationSetupDataServices;
//# sourceMappingURL=standardisationsetupdataservices.js.map
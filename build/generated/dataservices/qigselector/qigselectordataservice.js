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
var loginSession = require('../../../src/app/loginsession');
var QigSelectorDataService = (function (_super) {
    __extends(QigSelectorDataService, _super);
    function QigSelectorDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Method which converts the QIG Summary collection to an Immutable List
     * @param data
     */
    QigSelectorDataService.prototype.getImmutable = function (data) {
        var immutableList = Immutable.List(data.qigSummary);
        data.qigSummary = immutableList;
        return data;
    };
    /**
     *  Method which converts the simulationModeExitedQigList to immutable list
     * @param data
     */
    QigSelectorDataService.prototype.getImmutableSimulationModeExitedQigData = function (data) {
        data.qigList = Immutable.List(data.qigList);
        return data;
    };
    /**
     * Method which converts the locksInQigDetailsList to immutable list
     * @param data
     */
    QigSelectorDataService.prototype.getImmutableLocksInQigData = function (data) {
        data.locksInQigDetailsList = Immutable.List(data.locksInQigDetailsList);
        return data;
    };
    /**
     * Method which retrieves the data for the QIG Selector
     * @param callback
     * @param qigToBeFetched
     */
    QigSelectorDataService.prototype.getQIGSelectorData = function (callback, qigToBeFetched, subExaminerId) {
        var that = this;
        // If data of all the QIGs relevant to the examiner is to be fetched,
        // then first check in the in -memory storage and if not found, make the server call to retrieve the same.
        if (qigToBeFetched === 0) {
            // Returns the Promise object for in-memory storage adapter
            var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('qigselector', 'overviewdata', true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult) {
                // If retrieved from memory, simply invoke the callback
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult) {
                // If not found in memory, invoke the call to the server to fetch the QIG data
                that.makeAJAXCallToFetchQigData(qigToBeFetched, subExaminerId, true, callback);
            });
        }
        else {
            // If data for a particular QIG alone is to be fetched,
            // then retrieve the data directly from the server by invoking the AJAX request
            that.makeAJAXCallToFetchQigData(qigToBeFetched, subExaminerId, false, callback);
        }
    };
    /**
     * Method which retrieves the data for the QIG Selector
     * @param callback
     */
    QigSelectorDataService.prototype.getAdminRemarkerQIGSelectorData = function (callback) {
        var that = this;
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('qigselector', 'overviewdata', true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            // If retrieved from memory, simply invoke the callback
            if (callback) {
                callback(true, jsonResult.value);
            }
        }).catch(function (jsonResult) {
            // If not found in memory, invoke the call to the server to fetch the QIG data
            that.makeAJAXCallToFetchAdminRemarkerQigData(true, callback);
        });
    };
    /**
     * Method which retrieves the data for the QIG Selector
     * @param markSchemeGroupId
     */
    QigSelectorDataService.prototype.createAdminRemarkerRole = function (markSchemeGroupId) {
        var url = urls.CREATE_ADMINREMARKER_ROLE + '/' + markSchemeGroupId;
        // Returns the Promise object for the AJAX call
        return this.makeAJAXCall('GET', url, '', false, false);
    };
    /**
     * Method which makes the AJAX call to fetch the QIG data
     * @param qigToBeFetched
     * @param doCacheData
     * @param callback
     */
    QigSelectorDataService.prototype.makeAJAXCallToFetchQigData = function (qigToBeFetched, subExaminerId, doCacheData, callback) {
        var url = urls.MARKINGLIST_URL + '/' + qigToBeFetched + '/' + loginSession.MARKING_SESSION_TRACKING_ID + '/' + subExaminerId;
        // Returns the Promise object for the AJAX call
        var getQigSelectorDataPromise = this.makeAJAXCall('GET', url, '', false, false);
        var that = this;
        getQigSelectorDataPromise.then(function (json) {
            var overviewData = that.getImmutable(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('qigselector', 'overviewdata', overviewData, true).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(overviewData.success, overviewData);
            }
        }).catch(function (json) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which makes the AJAX call to fetch the QIG
     * @param doCacheData
     * @param callback
     */
    QigSelectorDataService.prototype.makeAJAXCallToFetchAdminRemarkerQigData = function (doCacheData, callback) {
        var url = urls.ADMIN_REMARKERS_MARKINGLIST_URL;
        // Returns the Promise object for the AJAX call
        var getQigSelectorDataPromise = this.makeAJAXCall('GET', url, '', false, false);
        var that = this;
        getQigSelectorDataPromise.then(function (json) {
            var overviewData = that.getImmutable(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('qigselector', 'overviewdata', overviewData, true).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(true, overviewData);
            }
        }).catch(function (json) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which retrieves no of locks againts QIGs
     */
    QigSelectorDataService.prototype.getLocksInQigs = function (callback) {
        var url = urls.GET_LOCKS_IN_QIGS_URL;
        var that = this;
        /**  Making AJAX call to get the allocated response */
        var getLocksInQigsPromise = this.makeAJAXCall('GET', url, '', false, false);
        getLocksInQigsPromise.then(function (data) {
            var locksInQigData = that.getImmutableLocksInQigData(JSON.parse(data));
            if (callback) {
                callback(true, locksInQigData);
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    /**
     * Method which retrieves the list of QIGs that exited simulation mode
     * @param callback
     * @param doCacheData
     */
    QigSelectorDataService.prototype.getSimulationModeExitedQigs = function (callback) {
        var that = this;
        var inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('simulationexitedqigs', 'qigdata', true, config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult) {
            // If retrieved from memory, simply invoke the callback
            if (callback) {
                callback(true, jsonResult.value);
            }
        }).catch(function (jsonResult) {
            // If not found in memory, invoke the call to the server to fetch the simulation exited QIG data
            that.makeAJAXCallToFetchSimulationExitedQigData(true, callback);
        });
    };
    /**
     * Method which makes the AJAX call to fetch simulation exited qig data
     * @param doCacheData
     * @param callback
     */
    QigSelectorDataService.prototype.makeAJAXCallToFetchSimulationExitedQigData = function (doCacheData, callback) {
        var url = urls.GET_SIMULATION_MODE_EXITED_QIGS_URL;
        // Returns the Promise object for the AJAX call
        var getSimulationModeExitedQigsPromise = this.makeAJAXCall('GET', url, '', false, false);
        var that = this;
        getSimulationModeExitedQigsPromise.then(function (json) {
            var simulationModeExitedQigData = that.getImmutableSimulationModeExitedQigData(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('simulationexitedqigs', 'qigdata', simulationModeExitedQigData, true).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(true, simulationModeExitedQigData);
            }
        }).catch(function (json) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Method which sets the simulation target to complete for the provided mark scheme groupids
     * @param callback
     * @param simulationArgument
     */
    QigSelectorDataService.prototype.setSimulationTargetToComplete = function (callback, simulationArgument) {
        var url = urls.SET_SIMULATION_TARGET_TO_COMPLETE_URL;
        /** Making AJAX call to set the simulation target complete */
        var setSimulationTargetToCompletePromise = this.makeAJAXCall('POST', url, JSON.stringify(simulationArgument), false, false);
        setSimulationTargetToCompletePromise.then(function (data) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    };
    /**
     * Method which checks if the standardisation setup is completed for the markschemegroupid.
     * @param callback
     * @param markSchemeGroupId
     */
    QigSelectorDataService.prototype.checkStandardisationSetupCompleted = function (callback, markSchemeGroupId) {
        var url = urls.CHECK_STANDARDISATION_SETUP_COMPLETED_URL + '/' + markSchemeGroupId;
        /** Making AJAX call to check if standardisation setup is completed for the qig */
        var standardisationSetupCompletedPromise = this.makeAJAXCall('GET', url, '', false, false);
        standardisationSetupCompletedPromise.then(function (data) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    };
    return QigSelectorDataService;
}(dataServiceBase));
var qigSelectorDataService = new QigSelectorDataService();
module.exports = qigSelectorDataService;
//# sourceMappingURL=qigselectordataservice.js.map
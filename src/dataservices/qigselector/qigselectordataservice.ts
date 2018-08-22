import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
import overviewData = require('../../stores/qigselector/typings/overviewdata');
declare let config: any;
import Immutable = require('immutable');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');
import loginSession = require('../../../src/app/loginsession');
import simulationModeExitedQigList = require('../../stores/qigselector/typings/simulationmodeexitedqiglist');
import simulationTargetCompleteArgument = require('../../stores/qigselector/typings/simulationtargetcompleteargument');

class QigSelectorDataService extends dataServiceBase {

    /**
     * Method which converts the QIG Summary collection to an Immutable List
     * @param data
     */
    private getImmutable(data: overviewData): overviewData {
        let immutableList = Immutable.List(data.qigSummary);
        data.qigSummary = immutableList;
        return data;
    }

    /**
     *  Method which converts the simulationModeExitedQigList to immutable list
     * @param data
     */
    private getImmutableSimulationModeExitedQigData(data: simulationModeExitedQigList): simulationModeExitedQigList {
        data.qigList = Immutable.List(data.qigList);
        return data;
    }

    /**
     * Method which converts the locksInQigDetailsList to immutable list
     * @param data
     */
    private getImmutableLocksInQigData(data: locksInQigDetailsList): locksInQigDetailsList {
        data.locksInQigDetailsList = Immutable.List(data.locksInQigDetailsList);
        return data;
    }

    /**
     * Method which retrieves the data for the QIG Selector
     * @param callback
     * @param qigToBeFetched
     */
    public getQIGSelectorData(callback: ((success: boolean, json: overviewData) => void), qigToBeFetched: number,
                                                                                        subExaminerId: number) {
        let that = this;

        // If data of all the QIGs relevant to the examiner is to be fetched,
        // then first check in the in -memory storage and if not found, make the server call to retrieve the same.
        if (qigToBeFetched === 0) {
            // Returns the Promise object for in-memory storage adapter
            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('qigselector',
                'overviewdata',
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                // If retrieved from memory, simply invoke the callback
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                // If not found in memory, invoke the call to the server to fetch the QIG data
                that.makeAJAXCallToFetchQigData(qigToBeFetched, subExaminerId, true, callback);
            });
        } else {
            // If data for a particular QIG alone is to be fetched,
            // then retrieve the data directly from the server by invoking the AJAX request
            that.makeAJAXCallToFetchQigData(qigToBeFetched, subExaminerId, false, callback);
        }
    }

    /**
     * Method which retrieves the data for the QIG Selector
     * @param callback
     */
    public getAdminRemarkerQIGSelectorData(callback: ((success: boolean, json: overviewData) => void)) {
        let that = this;

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('qigselector',
                'overviewdata',
                true,
                config.cacheconfig.TWO_MINUTES_CACHE_TIME);
            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                // If retrieved from memory, simply invoke the callback
                if (callback) {
                    callback(true, jsonResult.value);
                }
            }).catch(function (jsonResult: any) {
                // If not found in memory, invoke the call to the server to fetch the QIG data
                that.makeAJAXCallToFetchAdminRemarkerQigData(true, callback);
            });
    }

    /**
     * Method which retrieves the data for the QIG Selector
     * @param markSchemeGroupId
     */
    public createAdminRemarkerRole(markSchemeGroupId: number) {
        let url = urls.CREATE_ADMINREMARKER_ROLE + '/' + markSchemeGroupId;

        // Returns the Promise object for the AJAX call
        return this.makeAJAXCall('GET', url, '', false, false);
    }

    /**
     * Method which makes the AJAX call to fetch the QIG data
     * @param qigToBeFetched
     * @param doCacheData
     * @param callback
     */
    private makeAJAXCallToFetchQigData(qigToBeFetched: number, subExaminerId: number, doCacheData: boolean, callback?: Function): void {
        let url = urls.MARKINGLIST_URL + '/' + qigToBeFetched + '/' + loginSession.MARKING_SESSION_TRACKING_ID + '/' + subExaminerId;
        // Returns the Promise object for the AJAX call
        let getQigSelectorDataPromise = this.makeAJAXCall('GET', url, '', false, false);
        let that = this;
        getQigSelectorDataPromise.then(function (json: any) {

            let overviewData = that.getImmutable(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('qigselector', 'overviewdata', overviewData, true).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(overviewData.success, overviewData);
            }
        }).catch(function (json: any) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which makes the AJAX call to fetch the QIG
     * @param doCacheData
     * @param callback
     */
    private makeAJAXCallToFetchAdminRemarkerQigData(doCacheData: boolean, callback?: Function): void {
        let url = urls.ADMIN_REMARKERS_MARKINGLIST_URL;
        // Returns the Promise object for the AJAX call
        let getQigSelectorDataPromise = this.makeAJAXCall('GET', url, '', false, false);
        let that = this;
        getQigSelectorDataPromise.then(function (json: any) {

            let overviewData = that.getImmutable(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('qigselector', 'overviewdata', overviewData, true).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(true, overviewData);
            }
        }).catch(function (json: any) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which retrieves no of locks againts QIGs
     */
    public getLocksInQigs(callback: ((success: boolean, json: locksInQigDetailsList) => void)) {
        let url = urls.GET_LOCKS_IN_QIGS_URL;

        let that = this;

        /**  Making AJAX call to get the allocated response */
        let getLocksInQigsPromise = this.makeAJAXCall('GET', url, '', false, false);

        getLocksInQigsPromise.then(function (data: any) {

            let locksInQigData = that.getImmutableLocksInQigData(JSON.parse(data));

            if (callback) {
                callback(true, locksInQigData);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, data);
            }
        });

    }

    /**
     * Method which retrieves the list of QIGs that exited simulation mode
     * @param callback
     * @param doCacheData
     */
    public getSimulationModeExitedQigs(callback: ((success: boolean, json: simulationModeExitedQigList) => void)) {
        let that = this;

        let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('simulationexitedqigs',
            'qigdata',
            true,
            config.cacheconfig.TWO_MINUTES_CACHE_TIME);
        inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
            // If retrieved from memory, simply invoke the callback
            if (callback) {
                callback(true, jsonResult.value);
            }
        }).catch(function (jsonResult: any) {
            // If not found in memory, invoke the call to the server to fetch the simulation exited QIG data
            that.makeAJAXCallToFetchSimulationExitedQigData(true, callback);
        });
    }

    /**
     * Method which makes the AJAX call to fetch simulation exited qig data
     * @param doCacheData
     * @param callback
     */
    private makeAJAXCallToFetchSimulationExitedQigData(doCacheData: boolean, callback?: Function): void {
        let url = urls.GET_SIMULATION_MODE_EXITED_QIGS_URL;
        // Returns the Promise object for the AJAX call
        let getSimulationModeExitedQigsPromise = this.makeAJAXCall('GET', url, '', false, false);
        let that = this;
        getSimulationModeExitedQigsPromise.then(function (json: any) {

            let simulationModeExitedQigData = that.getImmutableSimulationModeExitedQigData(JSON.parse(json));
            // If data to be cached, then store it in the in-memory storage adapter
            if (doCacheData) {
                storageAdapterFactory.getInstance().storeData('simulationexitedqigs',
                    'qigdata',
                    simulationModeExitedQigData,
                    true, ).then().catch();
            }
            // if callback exists, invoke the same
            if (callback) {
                callback(true, simulationModeExitedQigData);
            }
        }).catch(function (json: any) {
            // if callback exists, invoke the same with success as false since the AJAX call failed
            if (callback) {
                callback(false, json);
            }
        });
    }

    /**
     * Method which sets the simulation target to complete for the provided mark scheme groupids
     * @param callback
     * @param simulationArgument
     */
    public setSimulationTargetToComplete(callback: ((success: boolean, data: any) => void),
        simulationArgument: simulationTargetCompleteArgument) {

        let url = urls.SET_SIMULATION_TARGET_TO_COMPLETE_URL;

        /** Making AJAX call to set the simulation target complete */
        let setSimulationTargetToCompletePromise = this.makeAJAXCall('POST', url, JSON.stringify(simulationArgument), false, false);

        setSimulationTargetToCompletePromise.then(function (data: any) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    }

    /**
     * Method which checks if the standardisation setup is completed for the markschemegroupid.
     * @param callback
     * @param markSchemeGroupId
     */
    public checkStandardisationSetupCompleted(callback: ((success: boolean, data: any) => void),
        markSchemeGroupId: number) {

        let url = urls.CHECK_STANDARDISATION_SETUP_COMPLETED_URL + '/' + markSchemeGroupId;

        /** Making AJAX call to check if standardisation setup is completed for the qig */
        let standardisationSetupCompletedPromise = this.makeAJAXCall('GET', url, '', false, false);

        standardisationSetupCompletedPromise.then(function (data: any) {
            if (callback) {
                callback(true, JSON.parse(data));
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    }
}

let qigSelectorDataService = new QigSelectorDataService();

export = qigSelectorDataService;
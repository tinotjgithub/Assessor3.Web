import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import storageAdapterFactory = require('../storageadapters/storageadapterfactory');
declare let config: any;
import Immutable = require('immutable');
import cluster = require('../../stores/markschemestructure/typings/cluster');
import answerItem = require('../../stores/markschemestructure/typings/answeritem');
import item = require('../../stores/markschemestructure/typings/item');
import markScheme = require('../../stores/markschemestructure/typings/markscheme');

/**
 * Class for Getting MarkSchemeStructure details
 */
class MarkSchemeStructureDataService extends dataServiceBase {

    /**
     * Get the MarkSchemeStructure details.
     * @param {((success} callback
     * @param {function} json
     * @param questionPaperId
     * @param useCache
     */
	public getMarkSchemeStructureDetails(callback: ((success: boolean, json: MarkSchemeStructure) => void),
		markSchemeGroupId: number,
		questionPaperId: number,
		useCache: boolean,
		examSessionId: number,
        isAwarding: boolean): void {

        let that = this;

        if (useCache) {

            let inMemoryStorageAdapterPromise = storageAdapterFactory.getInstance().getData('markscheme',
                'markschemestructure_' + questionPaperId,
                true,
                config.
                    cacheconfig.THIRTY_MINUTES_CACHE_TIME);

            inMemoryStorageAdapterPromise.then(function (jsonResult: any) {
                if (callback) {
                    callback(true, jsonResult.value);
                }
			}).catch(function (jsonResult: any) {
				that.getMarkSchemeStructureOnline(questionPaperId, markSchemeGroupId, callback, examSessionId, isAwarding);
			});
		} else {
			this.getMarkSchemeStructureOnline(questionPaperId, markSchemeGroupId, callback, examSessionId, isAwarding);
        }
    }

    /**
     * Call Api to get the data
     * @param {number} questionPaperId
     * @param callback?
     */
	private getMarkSchemeStructureOnline(
		questionPaperId: number,
		markSchemeGroupId: number,
		callback?: Function,
		examSessionId: number = 0,
		isAwarding: boolean = false): void {
        let url = urls.MARK_SCHEME_STRUCTURE_GET_URL + '/' + markSchemeGroupId + '/' + examSessionId + '/' + isAwarding;

        let getMarkSchemeStructurePromise = this.makeAJAXCall('GET', url);
        let that = this;
        getMarkSchemeStructurePromise.then(function (jsonData: any) {

            if (callback) {

                let resultData = that.parseJsonResult(jsonData);

                resultData = that.getImmutableMarkSchemeStructure(resultData);

                storageAdapterFactory.getInstance().storeData('markscheme', 'markschemestructure_' + questionPaperId,
                    resultData, true).then().catch();
                callback(resultData.success, resultData, false);
            }
        }).catch(function (jsonData: any) {

            if (callback) {
                callback(false, jsonData);
            }
        });
    }

    /**
     * Map the result JSON to the object.
     * @param {string} json
     * @returns The mapped result
     */
    private parseJsonResult(json: string): MarkSchemeStructure {

        let result: MarkSchemeStructure;
        result = JSON.parse(json);
        return result;
    }

    /**
     * Get the mark scheme structure to the the immutable
     * @param markSchemeStructureData
     */
    private getImmutableMarkSchemeStructure(markSchemeStructureData: MarkSchemeStructure): MarkSchemeStructure {

        // Map each mark Scheme group details.
        for (let item in markSchemeStructureData.clusters) {

            // Added to resolve ts lint issue
            if (markSchemeStructureData.clusters.hasOwnProperty(item)) {
                markSchemeStructureData.clusters[item] = this.processCluster(markSchemeStructureData.clusters[item]);
            }
        }
        return markSchemeStructureData;
    }

    /**
     * Convert the cluster objects to the immutable
     * @param cluster
     */
    private processCluster(_cluster: cluster): cluster {
        if (_cluster.answerItems != null) {
            _cluster.answerItems = this.getImmutableList(_cluster.answerItems);
            _cluster.answerItems.forEach((answerItem: answerItem) => {

                let index = _cluster.answerItems.indexOf(answerItem);
                _cluster.answerItems[index] = this.processAnswerItem(answerItem);
            });
        }

        if (_cluster.childClusters != null) {
            _cluster.childClusters = this.getImmutableList(_cluster.childClusters);
            _cluster.childClusters.forEach((childCluster: cluster) => {

                let index = _cluster.childClusters.indexOf(childCluster);
                _cluster.childClusters[index] = this.processCluster(childCluster);
            });
        }

        if (_cluster.parentCluster != null) {
            _cluster.parentCluster = this.processCluster(_cluster.parentCluster);
        }

        if (_cluster.markSchemes != null) {
            _cluster.markSchemes = this.getImmutableList(_cluster.markSchemes);
        }

        return _cluster;
    }

    /**
     * Convert the answer item objects to immutable
     * @param answerItem
     */
    private processAnswerItem(_answerItem: answerItem): answerItem {
        if (_answerItem.markSchemes !== undefined) {
            _answerItem.markSchemes = this.getImmutableList(_answerItem.markSchemes);
            return _answerItem;
        }
    }

    /**
     * Convert the item objects to immutable
     * @param item
     */
    private processItem(_item: item): item {
        if (_item.markSchemes !== undefined) {
            _item.markSchemes = this.getImmutableList(_item.markSchemes);
            return _item;
        }
    }

    /**
     * Get the object to immutable
     * @param list
     */
    private getImmutableList(list: any): Immutable.List<any> {
        return Immutable.List(list);
    }
}

let markSchemeStructureDataService = new MarkSchemeStructureDataService();
export = markSchemeStructureDataService;

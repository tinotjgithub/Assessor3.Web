import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import Immutable = require('immutable');

class SupportAdminDataServices extends dataServiceBase {

    /**
     * Gets the amin support examiner details from the API
     * @param callback 
     */
	public getSupportAdminExaminerLists(
		callback: ((success: boolean, json: SupportAdminExaminerList) => void)): void {
		let that = this;
		let examinerList: SupportAdminExaminers;
		let url = urls.GET_SUPPORT_EXAMINER_LIST_URL;

		// Make an ajax call to retrieve data and store the same in storage adapter.
		let supportAdminExaminerListPromise = that.makeAJAXCall('GET', url);

		// Store the data in in-memory storage adapter.
		supportAdminExaminerListPromise.then(function (json: any) {
			let supportAdminExaminerList = that.getImmutableExaminerList(JSON.parse(json));
			if (callback) {
				callback(true, supportAdminExaminerList);
			}
		}).catch(function (json: any) {
			if (callback) {
				callback(false, json);
			}
		});
	}

	/**
	 * Change json object to immutable list
	 * @param data
	 */
	private getImmutableExaminerList(data: SupportAdminExaminerList): SupportAdminExaminerList {
		data.getSupportExaminerList = Immutable.List(data.getSupportExaminerList);
		return data;
	}
}
let supportAdminDataServices = new SupportAdminDataServices();
export =  supportAdminDataServices;
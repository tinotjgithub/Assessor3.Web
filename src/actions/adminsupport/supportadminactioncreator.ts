import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import adminSupportSortAction = require('./adminsupportsortaction');
import adminSupportSortDetails = require('../../components/utility/grid/adminsupportsortdetails');
import supportAdminDataServices = require('../../dataservices/adminsupport/supportadmindataservices');
import supportAdminExaminerListsAction = require('./getsupportadminexaminerlistsaction');

/**
 * Standardisation setup action creator
 */
class SupportAdminActionCreator extends base {

    /**
     * Action creator to retrive centre details, for the selected response.
     */
	public getSupportAdminExaminerLists() {
		supportAdminDataServices.getSupportAdminExaminerLists(
			function (success: boolean, supportAdminExaminerListData: SupportAdminExaminerList) {
				new Promise.Promise(function (resolve: any, reject: any) {
					resolve();
				}).then(() => {
					dispatcher.dispatch(new supportAdminExaminerListsAction(success, supportAdminExaminerListData));
				}).catch();
			});
	}

	/**
	 * Handle the sort order
	 */
	public onSortedClick(sortDetails: adminSupportSortDetails) {
		new Promise.Promise(function (resolve: any, reject: any) {
			resolve();
		}).then(() => {
			dispatcher.dispatch(new adminSupportSortAction(sortDetails));
		}).catch();
    }
}

let supportAdminActionCreator = new SupportAdminActionCreator();
export = supportAdminActionCreator;


import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Admin Support Examiner Code comparer class
 */
class AdminSupportUsernameComparer implements comparerInterface {

	/** Comparer to sort the Admin Support Examiner list in ascending order of liveUserName */
	public compare(a: SupportAdminExaminers, b: SupportAdminExaminers) {
		if (a.liveUserName.trim().toLowerCase() > b.liveUserName.trim().toLowerCase()) {
			return 1;
		}
		if (a.liveUserName.trim().toLowerCase() < b.liveUserName.trim().toLowerCase()) {
			return -1;
		}
		return 0;
	}
}

export = AdminSupportUsernameComparer;
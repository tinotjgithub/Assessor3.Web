import stringFormatHelper = require('../../../stringformat/stringformathelper');
import comparerInterface = require('../../sortbase/comparerinterface');

/**
 * This is a Admin Support Examiner Code comparer class
 */
class AdminSupportNameComparerDesc implements comparerInterface {

	/**
	 * Comparer to sort the Admin Support Examiner list in descending order of examiner name
	 */
	public compare(a: SupportAdminExaminers, b: SupportAdminExaminers) {

		if (this.getFormattedExaminerName(a.initials, a.surname) > this.getFormattedExaminerName(b.initials, b.surname)) {
			return -1;
		}
		if (this.getFormattedExaminerName(a.initials, a.surname) < this.getFormattedExaminerName(b.initials, b.surname)) {
			return 1;
		}
		return 0;
	}

	/**
	 * Returns the formatted examiner name
	 * @param initials
	 * @param surname
	 */
	private getFormattedExaminerName(initials: string, surname: string): string {
		let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
		formattedString = formattedString.replace('{initials}', initials);
		formattedString = formattedString.replace('{surname}', surname);
		return formattedString;
	}
}

export = AdminSupportNameComparerDesc;
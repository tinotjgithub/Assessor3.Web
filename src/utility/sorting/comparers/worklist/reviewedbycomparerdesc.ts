import comparerInterface = require('../../sortbase/comparerinterface');
import stringFormatHelper = require('../../../stringformat/stringformathelper');
import operationModeHelper = require('../../../../components/utility/userdetails/userinfo/operationmodehelper');
import localeStore = require('../../../../stores/locale/localestore');
import loginSession = require('../../../../app/loginsession');

/**
 * This is a ReviewedBy comparer class and method
 */
class ReviewedByComparerDesc implements comparerInterface {
    /** Comparer to sort the work list in descending order of ReviewedBy */
    public compare(a: any, b: any) {
        let userNameA: string = this.getUserName(a);
        let userNameB: string = this.getUserName(b);

        if (userNameA > userNameB) {
            return -1;
        }
        if (userNameA < userNameB) {
            return 1;
        }

        return 0;
    }

    /**
     * Get username
     * @param object
     * @returns UserName
     */
    private getUserName(a: any) {
        if (a.reviewedById > 0) {
            if (loginSession.EXAMINER_ID === a.reviewedById) {
                return '0';
            } else {
                return this.getFormattedName(a.reviewedByInitials, a.reviewedBySurname);
            }
        } else {
            return ' ';
        }
    }

    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    private getFormattedName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);

        return formattedString;
    }
}

export = ReviewedByComparerDesc;
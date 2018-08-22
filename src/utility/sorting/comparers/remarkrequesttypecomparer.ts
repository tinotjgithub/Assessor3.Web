import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');
import comparerInterface = require('../sortbase/comparerinterface');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../../components/utility/enums');

/**
 * This is a Remark request comparer class and method
 */
class RemarkRequestComparer implements comparerInterface {
    private localeKey: string = 'generic.remark-types.long-names.';

    /** Comparer to sort the remark request based on locale text */
    public compare(a: any, b: any) {

        let firstRemarkRequestType: number;
        let secondRemarkRequestType: number;

        if (a.remarkRequestType !== undefined) {
            firstRemarkRequestType = a.remarkRequestType;
            secondRemarkRequestType = b.remarkRequestType;
        } else {
            firstRemarkRequestType = a.remarkRequestTypeID;
            secondRemarkRequestType = b.remarkRequestTypeID;
        }

        if (this.getRemarkRequestLocaleText(firstRemarkRequestType) > this.getRemarkRequestLocaleText(secondRemarkRequestType)) {
            return 1;
        }

        if (this.getRemarkRequestLocaleText(firstRemarkRequestType) < this.getRemarkRequestLocaleText(secondRemarkRequestType)) {
            return -1;
        }

        return 0;
    }

    /**
     * Get remark request locale text
     * @param remarkRequestType
     */
    private getRemarkRequestLocaleText(remarkRequestType: enums.RemarkRequestType) {
        return localeStore.instance.TranslateText(this.localeKey + enums.RemarkRequestType[remarkRequestType]);
    }
}

export = RemarkRequestComparer;
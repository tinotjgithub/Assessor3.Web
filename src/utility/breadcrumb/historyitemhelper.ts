import enums = require('../../components/utility/enums');
import qigSummary = require('../../stores/qigselector/typings/qigsummary');
import qigStore = require('../../stores/qigselector/qigstore');
import localeStore = require('../../stores/locale/localestore');
import permissions = require('../../stores/standardisationsetup/typings/permissions');

/**
 * Helper for History item
 */
class HistoryItemHelper {

   /**
    * Gets Standardisation Setup Link Text
    * @param qigId
    */
    public static getStandardisationSetupLinkText(qigId: number): string {
        let qigSummary: qigSummary = qigStore.instance.getQigSummary(qigId);
        let isStandardisationSetupButtonVisible: boolean = qigStore.instance.isStandardisationSetupButtonVisible(qigSummary);
        let isStandardisationSetupLinkVisible: boolean = qigStore.instance.isStandardisationSetupLinkVisible(qigSummary);
        let linkName: string = '';
        if (isStandardisationSetupButtonVisible) {
            linkName = localeStore.instance.TranslateText('home.qig-data.standardisation-button');
        } else if (isStandardisationSetupLinkVisible) {
            let stdSetupPermission: permissions = qigStore.instance.getSSUPermissionsData(qigId).role.permissions;
            if (qigStore.instance.isQigHasBrowseScriptPermissionOnly(qigSummary)) {
                linkName = localeStore.instance.TranslateText('home.qig-data.browse-standardisation-scripts');
            } else if (stdSetupPermission.editDefinitives) {
                linkName = localeStore.instance.TranslateText('home.qig-data.manage-definitive-mark-link');
            } else if (stdSetupPermission.viewDefinitives) {
                linkName = localeStore.instance.TranslateText('home.qig-data.view-definitive-mark-link');
            }
        }
        return linkName;
    }
}

export = HistoryItemHelper;
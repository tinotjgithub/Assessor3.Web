import xmlHelper = require('../generic/xmlhelper');
import configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import enums = require('../../components/utility/enums');
import Immutable = require('immutable');

/**
 * Helper class for markschemegroup related activities during standardisation setup.. 
 */
class MarkSchemeGroupHelper {

    /**
     * Gets RestrictStandardisationSetupTargets CC value by markscheme group id.
     */
    private static getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId(markSchemeGroupId: number) {
        return configurableCharacteristicsHelper.getCharacteristicValue('RestrictStandardisationSetupTargets', markSchemeGroupId);
    }

    /**
     * Gets restricted standardisation setup targets.
     * @param markSchemeGroupId
     */
    public static getRestrictedStandardisationSetupTargets(markSchemeGroupId: number): Immutable.List<enums.MarkingMode> {
        let restrictedTargetsList: Immutable.List<enums.MarkingMode> = Immutable.List<enums.MarkingMode>();
        let restrictStandardisationSetupTargetsCCValue = MarkSchemeGroupHelper.
            getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId(markSchemeGroupId);
        if (restrictStandardisationSetupTargetsCCValue !== '') {
            let xmlHelperObj = new xmlHelper(restrictStandardisationSetupTargetsCCValue);
            let allChildNodes = xmlHelperObj.getAllChildNodes();
            for (let i = 0; i < allChildNodes.length; i++) {
                let targetName: string = allChildNodes[i].childNodes[0].nodeValue;
                let markingMode: enums.MarkingMode = MarkSchemeGroupHelper.getMarkingModeForTarget(targetName);
                restrictedTargetsList = restrictedTargetsList.push(markingMode);
            }
        }

        return restrictedTargetsList;
    }

    /**
     * Returns the marking mode for given target name.
     * @param targetName
     */
    private static getMarkingModeForTarget(targetName: string): enums.MarkingMode {
        switch (targetName) {
            case 'Practice':
                return enums.MarkingMode.Practice;
            case 'Standardisation':
                return enums.MarkingMode.Approval;
            case 'STMStandardisation':
                return enums.MarkingMode.ES_TeamApproval;
            case 'Seed':
                return enums.MarkingMode.Seeding;
        }
    }

    /**
     * Checks whether RestrictStandardisationSetupTargets CC is ON.
     */
    public static isRestrictStandardisationSetupTargetsCCOn(markSchemeGroupId: number) {
        return MarkSchemeGroupHelper.
            getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId(markSchemeGroupId) !== '';
    }
}

export = MarkSchemeGroupHelper;
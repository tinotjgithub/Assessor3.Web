"use strict";
var xmlHelper = require('../generic/xmlhelper');
var configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
var enums = require('../../components/utility/enums');
var Immutable = require('immutable');
/**
 * Helper class for markschemegroup related activities during standardisation setup..
 */
var MarkSchemeGroupHelper = (function () {
    function MarkSchemeGroupHelper() {
    }
    /**
     * Gets RestrictStandardisationSetupTargets CC value by markscheme group id.
     */
    MarkSchemeGroupHelper.getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId = function (markSchemeGroupId) {
        return configurableCharacteristicsHelper.getCharacteristicValue('RestrictStandardisationSetupTargets', markSchemeGroupId);
    };
    /**
     * Gets restricted standardisation setup targets.
     * @param markSchemeGroupId
     */
    MarkSchemeGroupHelper.getRestrictedStandardisationSetupTargets = function (markSchemeGroupId) {
        var restrictedTargetsList = Immutable.List();
        var restrictStandardisationSetupTargetsCCValue = MarkSchemeGroupHelper.
            getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId(markSchemeGroupId);
        if (restrictStandardisationSetupTargetsCCValue !== '') {
            var xmlHelperObj = new xmlHelper(restrictStandardisationSetupTargetsCCValue);
            var allChildNodes = xmlHelperObj.getAllChildNodes();
            for (var i = 0; i < allChildNodes.length; i++) {
                var targetName = allChildNodes[i].childNodes[0].nodeValue;
                var markingMode = MarkSchemeGroupHelper.getMarkingModeForTarget(targetName);
                restrictedTargetsList = restrictedTargetsList.push(markingMode);
            }
        }
        return restrictedTargetsList;
    };
    /**
     * Returns the marking mode for given target name.
     * @param targetName
     */
    MarkSchemeGroupHelper.getMarkingModeForTarget = function (targetName) {
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
    };
    /**
     * Checks whether RestrictStandardisationSetupTargets CC is ON.
     */
    MarkSchemeGroupHelper.isRestrictStandardisationSetupTargetsCCOn = function (markSchemeGroupId) {
        return MarkSchemeGroupHelper.
            getRestrictStandardisationSetupTargetsCCValueByMarkSchemeGroupId(markSchemeGroupId) !== '';
    };
    return MarkSchemeGroupHelper;
}());
module.exports = MarkSchemeGroupHelper;
//# sourceMappingURL=markschemegrouphelper.js.map
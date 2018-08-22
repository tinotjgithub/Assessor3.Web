"use strict";
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var enums = require('../../../components/utility/enums');
/**
 * Helper class for help examiner data
 */
var HelpExaminerDataHelper = (function () {
    function HelpExaminerDataHelper() {
        var _this = this;
        /**
         * Get SEP Actions.
         */
        this.getSEPActions = function (examinerRoleId) {
            if (teamManagementStore && teamManagementStore.instance.examinersForHelpExaminers) {
                _this.sepActions = new Array();
                var examinersForHelpExaminers = teamManagementStore.instance.examinersForHelpExaminers.toArray();
                examinersForHelpExaminers.forEach(function (examiner) {
                    if (examiner.examinerRoleId === examinerRoleId) {
                        var actions = examiner.actions;
                        actions.forEach(function (item) {
                            if (item === enums.SEPAction.ProvideSecondStandardisation
                                || item === enums.SEPAction.Approve
                                || item === enums.SEPAction.Re_approve
                                || item === enums.SEPAction.SendMessage) {
                                _this.sepActions.push(item);
                            }
                        });
                    }
                });
            }
            return _this.sepActions;
        };
    }
    return HelpExaminerDataHelper;
}());
module.exports = HelpExaminerDataHelper;
//# sourceMappingURL=helpexaminersdatahelper.js.map
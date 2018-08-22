"use strict";
var enums = require('../../../components/utility/enums');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Helper class for warning message popup
 */
var WarningMessagePopupHelper = (function () {
    function WarningMessagePopupHelper() {
    }
    /**
     * Method to bind the warning message popup content.
     */
    WarningMessagePopupHelper.prototype.bindWarningMessagePopupContent = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.subordinate-withdrawn-dialog.' +
                        enums.FailureCode[enums.FailureCode.SubordinateExaminerWithdrawn] + '-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.subordinate-withdrawn-dialog.' +
                        enums.FailureCode[enums.FailureCode.SubordinateExaminerWithdrawn] + '-title');
                break;
            case enums.FailureCode.Withdrawn:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.withdrawn-dialog.' +
                        enums.FailureCode[enums.FailureCode.Withdrawn] + '-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.withdrawn-dialog.' +
                        enums.FailureCode[enums.FailureCode.Withdrawn] + '-title');
                break;
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.NotASeniorExaminer:
            case enums.FailureCode.NotTeamLead:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.hierarchy-changed-dialog.' +
                        enums.FailureCode[enums.FailureCode.HierarchyChanged] + '-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.hierarchy-changed-dialog.' +
                        enums.FailureCode[enums.FailureCode.HierarchyChanged] + '-title');
                break;
            case enums.FailureCode.ExaminerStatusAlreadyChanged:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.subordinate-status-already-changed-dialog.' +
                        enums.FailureCode[enums.FailureCode.ExaminerStatusAlreadyChanged] + '-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.subordinate-status-already-changed-dialog.' +
                        enums.FailureCode[enums.FailureCode.ExaminerStatusAlreadyChanged] + '-title');
                break;
            case enums.FailureCode.Suspended:
            case enums.FailureCode.NotApproved:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.suspended-dialog.' +
                        enums.FailureCode[enums.FailureCode.Suspended] + '-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.suspended-dialog.' +
                        enums.FailureCode[enums.FailureCode.Suspended] + '-title');
                break;
            case enums.FailureCode.InvalidPriority:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.hierarchy-changed-dialog.body-priority-changed');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.hierarchy-changed-dialog.HierarchyChanged-title');
                break;
            case enums.FailureCode.AlreadyLocked:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.body');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.ExaminerAlreadyLocked-title');
                break;
            case enums.FailureCode.NotInLockStatus:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.body');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.ExaminerAlreadyunlocked-title');
                break;
            case enums.FailureCode.LockLimitMet:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-limit-reached-dialog.LockLimitReached-content');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-limit-reached-dialog.LockLimitReached-title');
                break;
            case enums.FailureCode.LockIsRequired:
                this._warningPopupContent =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.body');
                this._warningPopupTitle =
                    localeStore.instance.TranslateText('team-management.examiner-worklist.lock-failure-dialog.header-lock-removed');
                break;
        }
    };
    Object.defineProperty(WarningMessagePopupHelper.prototype, "warningPopupContent", {
        /**
         * Returns the warning message popup content
         */
        get: function () {
            return this._warningPopupContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WarningMessagePopupHelper.prototype, "warningPopupTitle", {
        /**
         * Returns the warning message popup title
         */
        get: function () {
            return this._warningPopupTitle;
        },
        enumerable: true,
        configurable: true
    });
    return WarningMessagePopupHelper;
}());
module.exports = WarningMessagePopupHelper;
//# sourceMappingURL=warningmessagepopuphelper.js.map
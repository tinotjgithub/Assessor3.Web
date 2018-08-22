"use strict";
var storageAdapterFactory = require('./storageadapterfactory');
var enums = require('../../components/utility/enums');
/**
 * Helper class for storageadapter
 */
var StorageAdapterHelper = (function () {
    function StorageAdapterHelper() {
    }
    /**
     * Clear open/pending/closed cache in worklist
     * data has to be refreshed in all worklist on submitting otherwise
     * data mismatch will be there
     * @param markSchemeGroupId
     * @param markingMode
     * @param remarkRequestType
     * @param examinerRoleId
     */
    StorageAdapterHelper.prototype.clearCache = function (markSchemeGroupId, markingMode, remarkRequestType, examinerRoleId, worklistType) {
        storageAdapterFactory.getInstance().deleteData('worklist', this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.open, remarkRequestType, examinerRoleId))
            .catch();
        storageAdapterFactory.getInstance().deleteData('worklist', this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.pending, remarkRequestType, examinerRoleId))
            .catch();
        storageAdapterFactory.getInstance().deleteData('worklist', this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.closed, remarkRequestType, examinerRoleId))
            .catch();
        // Clearing the cache for Marker Progress as well
        storageAdapterFactory.getInstance().deleteData('marker', 'markerProgress_' + examinerRoleId).catch();
    };
    /**
     * Get MemoryStorage Key for Worklist data
     * @param markingmode
     * @param responseMode
     * @param remarkRequestType
     * @param examinerRoleId
     */
    StorageAdapterHelper.prototype.getMemoryStorageKeyForWorklistData = function (markingmode, responseMode, remarkRequestType, examinerRoleId) {
        return enums.getEnumString(enums.WorklistType, markingmode) + '_'
            + enums.getEnumString(enums.ResponseMode, responseMode) + '_'
            + enums.getEnumString(enums.RemarkRequestType, remarkRequestType) + '_'
            + examinerRoleId;
    };
    /**
     * Clear the marker information and qig selector data in certain scenarios
     * @param examinerRoleId
     * @param submissionResult
     */
    StorageAdapterHelper.prototype.clearCachePostSubmission = function (examinerRoleId, markingMode, submissionResult) {
        switch (markingMode) {
            case enums.MarkingMode.LiveMarking:
                if (submissionResult.hasQualityFeedbackOutstanding ||
                    submissionResult.seedSubmissionStatus !== enums.SeedSubmissionStatus.NotApplicable) {
                    storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata').catch();
                }
                storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
                break;
            case enums.MarkingMode.Practice:
            case enums.MarkingMode.Approval:
            case enums.MarkingMode.ES_TeamApproval:
            case enums.MarkingMode.Remarking:
                storageAdapterFactory.getInstance().deleteData('marker', 'markerInformation_' + examinerRoleId).catch();
                storageAdapterFactory.getInstance().deleteData('qigselector', 'overviewdata').catch();
                break;
        }
    };
    /**
     * Clear cache by key
     * @param key
     * @param value
     */
    StorageAdapterHelper.prototype.clearCacheByKey = function (key, value) {
        storageAdapterFactory.getInstance().deleteData(key, value).catch();
    };
    /**
     * clear storage area.
     */
    StorageAdapterHelper.prototype.clearStorageArea = function (key) {
        storageAdapterFactory.getInstance().deleteStorageArea(key);
    };
    /**
     * clear team data from cache
     */
    StorageAdapterHelper.prototype.clearTeamDataCache = function (examinerRoleId, markSchemeGroupId, isHelpExaminer) {
        if (isHelpExaminer === void 0) { isHelpExaminer = false; }
        var teamCacheKey = 'team';
        var _key;
        _key = new Array();
        if (isHelpExaminer) {
            _key.push('helpExaminersData_');
            _key.push('teamOverviewCount_');
        }
        else {
            _key.push('myTeamData_');
        }
        for (var i = 0; i < _key.length; i++) {
            var teamCacheValue = _key[i] + examinerRoleId + '_' + markSchemeGroupId;
            this.clearCacheByKey(teamCacheKey, teamCacheValue);
        }
    };
    return StorageAdapterHelper;
}());
module.exports = StorageAdapterHelper;
//# sourceMappingURL=storageadapterhelper.js.map
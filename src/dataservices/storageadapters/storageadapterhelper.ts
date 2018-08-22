import storageAdapterFactory = require('./storageadapterfactory');
import enums = require('../../components/utility/enums');

/**
 * Helper class for storageadapter
 */
class StorageAdapterHelper {

    /**
     * Clear open/pending/closed cache in worklist
     * data has to be refreshed in all worklist on submitting otherwise
     * data mismatch will be there
     * @param markSchemeGroupId
     * @param markingMode
     * @param remarkRequestType
     * @param examinerRoleId
     */
    public clearCache(markSchemeGroupId: number,
        markingMode: enums.MarkingMode,
        remarkRequestType: enums.RemarkRequestType,
        examinerRoleId: number,
        worklistType: enums.WorklistType): void {

        storageAdapterFactory.getInstance().deleteData('worklist',
            this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.open, remarkRequestType, examinerRoleId))
            .catch();
        storageAdapterFactory.getInstance().deleteData('worklist',
            this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.pending, remarkRequestType, examinerRoleId))
            .catch();
        storageAdapterFactory.getInstance().deleteData('worklist',
            this.getMemoryStorageKeyForWorklistData(worklistType, enums.ResponseMode.closed, remarkRequestType, examinerRoleId))
            .catch();

        // Clearing the cache for Marker Progress as well
        storageAdapterFactory.getInstance().deleteData('marker', 'markerProgress_' + examinerRoleId).catch();
    }

    /**
     * Get MemoryStorage Key for Worklist data
     * @param markingmode
     * @param responseMode
     * @param remarkRequestType
     * @param examinerRoleId
     */
    public getMemoryStorageKeyForWorklistData(
        markingmode: enums.WorklistType,
        responseMode: enums.ResponseMode,
        remarkRequestType: enums.RemarkRequestType,
        examinerRoleId: number) {
        return enums.getEnumString(enums.WorklistType, markingmode) + '_'
            + enums.getEnumString(enums.ResponseMode, responseMode) + '_'
            + enums.getEnumString(enums.RemarkRequestType, remarkRequestType) + '_'
            + examinerRoleId;
    }

    /**
     * Clear the marker information and qig selector data in certain scenarios
     * @param examinerRoleId
     * @param submissionResult
     */
    public clearCachePostSubmission(
        examinerRoleId: number,
        markingMode: enums.MarkingMode,
        submissionResult: SubmitResponseReturn) {

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
    }

    /**
     * Clear cache by key
     * @param key
     * @param value
     */
    public clearCacheByKey(key: string,
        value: string) {
        storageAdapterFactory.getInstance().deleteData(key, value).catch();
    }

    /**
     * clear storage area.
     */
    public clearStorageArea(key: string) {
        storageAdapterFactory.getInstance().deleteStorageArea(key);
    }

    /**
     * clear team data from cache
     */
    public clearTeamDataCache(examinerRoleId: number, markSchemeGroupId: number, isHelpExaminer: boolean = false) {
        let teamCacheKey = 'team';
        let _key: Array<string>;
        _key = new Array<string>();
        if (isHelpExaminer) {
            _key.push('helpExaminersData_');
            _key.push('teamOverviewCount_');
        } else {
            _key.push('myTeamData_');
        }
        for (var i = 0; i < _key.length; i++) {
            let teamCacheValue = _key[i] + examinerRoleId + '_' + markSchemeGroupId;
            this.clearCacheByKey(teamCacheKey, teamCacheValue);
        }
    }
}
export = StorageAdapterHelper;
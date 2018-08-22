import Immutable = require('immutable');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import stringFormatHelper = require('../../stringformat/stringformathelper');
import enums = require('../../../components/utility/enums');
import sortHelper = require('../../sorting/sorthelper');
import comparerList = require('../../sorting/sortbase/comparerlist');
import localeStore = require('../../../stores/locale/localestore');
import LocaleHelper = require('../../locale/localehelper');
import loginSession = require('../../../app/loginsession');

/**
 * Helper class for Examiner view data
 */
class ExaminerViewDataHelper {

    private flatExaminerViewDataItems: Array<ExaminerViewDataItem>;
    private comparerName: string;
    private sortDirection: enums.SortDirection;

    /*
    * This method will returns the corresponding examiner view item list
    */
    public getExaminerViewDataItems = (comparerName: string, sortDirection: enums.SortDirection): Immutable.List<ExaminerViewDataItem> => {
        let examinerDataItems: Immutable.List<ExaminerData> = teamManagementStore.instance.myTeamData;
        if (examinerDataItems.size === 0) {
            return;
        }
        return this.getExaminerTreeViewData(examinerDataItems, comparerName, sortDirection);
    };

    /**
     * Returns examiner tree view data
     * This method is directly calling from Jest Unit test for populating examiner tree view data
     */
    public getExaminerTreeViewData = (examinerDataItems: Immutable.List<ExaminerData>,
                                      comparerName: string, sortDirection: enums.SortDirection): Immutable.List<ExaminerViewDataItem> => {
        this.comparerName = comparerName;
        this.sortDirection = sortDirection;
        this.flatExaminerViewDataItems = new Array<ExaminerViewDataItem>();
        // iterate through examiner data Items and populate items list
        this.mapExaminerDataToExaminerViewData(examinerDataItems);
        return Immutable.List<ExaminerViewDataItem>(this.flatExaminerViewDataItems);
    };

    /**
     * Converts the ExaminerData to Examiner view data
     */
    private mapExaminerDataToExaminerViewData = (examinerDataItems: Immutable.List<ExaminerData>) => {
        let isSortOnFulllist: boolean = this.isSortOnFullList(this.comparerName);
        // add examiner data items to a flat list for displaying in grid.
        if (!isSortOnFulllist && examinerDataItems.size > 0) {
            examinerDataItems = Immutable.List<ExaminerData>(sortHelper.sort(examinerDataItems.toArray(),
            comparerList[this.comparerName]));
        }

        examinerDataItems.forEach((item: ExaminerData) => {
            this.addToFlatList(item);
            // sort the subordinate list in alphabetical order
            let sortedSubordinates = isSortOnFulllist ? item.subordinates :
                            sortHelper.sort(item.subordinates, comparerList[this.comparerName]);
            sortedSubordinates.forEach((examinerDataItem: ExaminerData) => {
                if (this.isExpanded(item) && (examinerDataItem.subordinates.length > 0)) {
                    this.addToFlatList(examinerDataItem);
                    if (this.isExpanded(examinerDataItem)) {
                        this.mapExaminerDataToExaminerViewData(Immutable.List<ExaminerData>(examinerDataItem.subordinates));
                    }
                } else if (this.isExpanded(item) && examinerDataItem.subordinates.length === 0) {
                    this.addToFlatList(examinerDataItem);
                }
            });
        });
        if (isSortOnFulllist) {
            this.flatExaminerViewDataItems = sortHelper.sort(this.flatExaminerViewDataItems,
                        comparerList[this.comparerName]) as Array<ExaminerViewDataItem>;
        }
    };

    /**
     * Add examiners to a flat list for displaying in grid
     */
    private addToFlatList = (examinerDataItem: ExaminerData) => {
        let item: ExaminerViewDataItem = {
            examinerId: examinerDataItem.examinerId,
            examinerLevel: examinerDataItem.examinerLevel,
            examinerRoleId: examinerDataItem.examinerRoleId,
            parentExaminerRoleId: examinerDataItem.parentExaminerRoleId,
            examinerName: this.getFormattedExaminerName(examinerDataItem.initials, examinerDataItem.surname),
            isExpanded: this.isExpanded(examinerDataItem),
            hasSubordinates: this.hasSubordinates(examinerDataItem),
            markingTargetName: this.getMarkingTarget(examinerDataItem.markingModeId,
                examinerDataItem.isElectronicStandardisationTeamMember),
            examinerProgress: examinerDataItem.progress,
            examinerTarget: examinerDataItem.target,
            roleName: examinerDataItem.roleName,
            coordinationComplete: examinerDataItem.coordinationComplete,
            examinerState: examinerDataItem.examinerState,
            suspendedCount: examinerDataItem.suspendedCount,
            markingModeId: examinerDataItem.markingModeId,
            isElectronicStandardisationTeamMember: examinerDataItem.isElectronicStandardisationTeamMember,
            lockedDuration: examinerDataItem.lockedByExaminerID > 0 ?
                this.getLockedDurationToDisplay(examinerDataItem.lockedDate) : '',
            lockedByExaminerID: examinerDataItem.lockedByExaminerID,
            lockedByExaminerName: examinerDataItem.lockedByExaminerID > 0 ?
                (loginSession.EXAMINER_ID === examinerDataItem.lockedByExaminerID ?
                    localeStore.instance.TranslateText('team-management.my-team.my-team-data.locked-by-me') :
                    this.getFormattedExaminerName(examinerDataItem.lockedByExaminerInitials,
                        examinerDataItem.lockedByExaminerSurname)) : '',
            responsesToReviewCount : examinerDataItem.responsesToReviewCount
        };
        this.flatExaminerViewDataItems.push(item);
    };

    /**
     * Returns the target string
     * @param markingTargetName
     */
    private getMarkingTarget(markingModeId: number, isElectronicStandardisationTeamMember: boolean) {
        let targetName: string;
        switch (markingModeId) {
            case enums.MarkingMode.LiveMarking: //'LIVE MARKING TARGET':
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.live');
                break;
            case enums.MarkingMode.Practice: //'PRACTICE TARGET':
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.practice');
                break;
            case enums.MarkingMode.Approval: // 'APPROVAL TARGET':
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.standardisation');
                break;
            case enums.MarkingMode.ES_TeamApproval: //'ES TEAM APPROVAL TARGET':
                // If the examiner is marking on their STM/2nd standardisation marking,
                //   then returns the status as 'STM/2nd Standardisation Marking'.
                targetName = isElectronicStandardisationTeamMember === true ?
                    localeStore.instance.TranslateText('team-management.my-team.examiner-targets.stm-standardisation') :
                    localeStore.instance.TranslateText('team-management.my-team.examiner-targets.second-standardisation');
                break;
            case enums.MarkingMode.Remarking: //'REMARKING TARGET':
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.examiner-target-live');
                break;
            case enums.MarkingMode.Simulation: // 'SIMULATION MARKING TARGET':
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.examiner-target-simulation');
                break;
        }

        return targetName;
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

    /**
     * Returns whether a node is expandable or not
     * @param dataItem
     */
    private isExpanded(dataItem: ExaminerData): boolean {
        // if we want to sort on full list then we want expand all the nodes.
        if (this.isSortOnFullList(this.comparerName)) {
            return true;
        } else {
            // if examinerRoleId does not exist in Map, It will return false, else return the stored value.
            return teamManagementStore.instance.expandOrCollapseDetails.get(dataItem.examinerRoleId, false);
        }
    }

    /**
     * return true if examiner has subordinates
     * @param dataItem
     */
    private hasSubordinates(dataItem: ExaminerData): boolean {
        return !this.isSortOnFullList(this.comparerName) && dataItem.subordinates && dataItem.subordinates.length > 0;
    }

    /**
     * Returns the Formatted Lock Durartion
     * @param lockedDate
     */
    private getLockedDurationToDisplay(lockedDate: Date): string {

        // Get Current Date
        var currentDate = new Date();

        // Get Locked date
        lockedDate = new Date(lockedDate.toString());

        let lockedDuration = Math.floor((((currentDate.getTime() - lockedDate.getTime()) / 1000) / 60) / 60);

        if (lockedDuration > 23) {
            let lockedDurationInDays = Math.floor(lockedDuration / 24);
            if (lockedDurationInDays === 1) {
                return '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.day-single');
            } else {
                return lockedDurationInDays + ' ' +
                    localeStore.instance.TranslateText('generic.time-periods.days-plural');
            }
        } else {
            // If the locked duration column is O, it means in hours. Disply the value as 1
            if (lockedDuration === 1 || lockedDuration <= 0) {
                return '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.hour-single');
            } else {
                return lockedDuration + ' ' +
                    localeStore.instance.TranslateText('generic.time-periods.hours-plural');
            }
        }
    }

    /**
     * Returns whether the sort is applicable to full list or not.
     * @param comparerName : string
     */
    private isSortOnFullList(comparerName: string) {
        switch (comparerName) {
            case comparerList[comparerList.TargetProgressComparer]:
            case comparerList[comparerList.TargetProgressComparerDesc]:
                 return true;
            default:
                 return false;
        }
    }
}

export = ExaminerViewDataHelper;
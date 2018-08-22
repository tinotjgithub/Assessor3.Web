"use strict";
var Immutable = require('immutable');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var stringFormatHelper = require('../../stringformat/stringformathelper');
var enums = require('../../../components/utility/enums');
var sortHelper = require('../../sorting/sorthelper');
var comparerList = require('../../sorting/sortbase/comparerlist');
var localeStore = require('../../../stores/locale/localestore');
var loginSession = require('../../../app/loginsession');
/**
 * Helper class for Examiner view data
 */
var ExaminerViewDataHelper = (function () {
    function ExaminerViewDataHelper() {
        var _this = this;
        /*
        * This method will returns the corresponding examiner view item list
        */
        this.getExaminerViewDataItems = function (comparerName, sortDirection) {
            var examinerDataItems = teamManagementStore.instance.myTeamData;
            if (examinerDataItems.size === 0) {
                return;
            }
            return _this.getExaminerTreeViewData(examinerDataItems, comparerName, sortDirection);
        };
        /**
         * Returns examiner tree view data
         * This method is directly calling from Jest Unit test for populating examiner tree view data
         */
        this.getExaminerTreeViewData = function (examinerDataItems, comparerName, sortDirection) {
            _this.comparerName = comparerName;
            _this.sortDirection = sortDirection;
            _this.flatExaminerViewDataItems = new Array();
            // iterate through examiner data Items and populate items list
            _this.mapExaminerDataToExaminerViewData(examinerDataItems);
            return Immutable.List(_this.flatExaminerViewDataItems);
        };
        /**
         * Converts the ExaminerData to Examiner view data
         */
        this.mapExaminerDataToExaminerViewData = function (examinerDataItems) {
            var isSortOnFulllist = _this.isSortOnFullList(_this.comparerName);
            // add examiner data items to a flat list for displaying in grid.
            if (!isSortOnFulllist && examinerDataItems.size > 0) {
                examinerDataItems = Immutable.List(sortHelper.sort(examinerDataItems.toArray(), comparerList[_this.comparerName]));
            }
            examinerDataItems.forEach(function (item) {
                _this.addToFlatList(item);
                // sort the subordinate list in alphabetical order
                var sortedSubordinates = isSortOnFulllist ? item.subordinates :
                    sortHelper.sort(item.subordinates, comparerList[_this.comparerName]);
                sortedSubordinates.forEach(function (examinerDataItem) {
                    if (_this.isExpanded(item) && (examinerDataItem.subordinates.length > 0)) {
                        _this.addToFlatList(examinerDataItem);
                        if (_this.isExpanded(examinerDataItem)) {
                            _this.mapExaminerDataToExaminerViewData(Immutable.List(examinerDataItem.subordinates));
                        }
                    }
                    else if (_this.isExpanded(item) && examinerDataItem.subordinates.length === 0) {
                        _this.addToFlatList(examinerDataItem);
                    }
                });
            });
            if (isSortOnFulllist) {
                _this.flatExaminerViewDataItems = sortHelper.sort(_this.flatExaminerViewDataItems, comparerList[_this.comparerName]);
            }
        };
        /**
         * Add examiners to a flat list for displaying in grid
         */
        this.addToFlatList = function (examinerDataItem) {
            var item = {
                examinerId: examinerDataItem.examinerId,
                examinerLevel: examinerDataItem.examinerLevel,
                examinerRoleId: examinerDataItem.examinerRoleId,
                parentExaminerRoleId: examinerDataItem.parentExaminerRoleId,
                examinerName: _this.getFormattedExaminerName(examinerDataItem.initials, examinerDataItem.surname),
                isExpanded: _this.isExpanded(examinerDataItem),
                hasSubordinates: _this.hasSubordinates(examinerDataItem),
                markingTargetName: _this.getMarkingTarget(examinerDataItem.markingModeId, examinerDataItem.isElectronicStandardisationTeamMember),
                examinerProgress: examinerDataItem.progress,
                examinerTarget: examinerDataItem.target,
                roleName: examinerDataItem.roleName,
                coordinationComplete: examinerDataItem.coordinationComplete,
                examinerState: examinerDataItem.examinerState,
                suspendedCount: examinerDataItem.suspendedCount,
                markingModeId: examinerDataItem.markingModeId,
                isElectronicStandardisationTeamMember: examinerDataItem.isElectronicStandardisationTeamMember,
                lockedDuration: examinerDataItem.lockedByExaminerID > 0 ?
                    _this.getLockedDurationToDisplay(examinerDataItem.lockedDate) : '',
                lockedByExaminerID: examinerDataItem.lockedByExaminerID,
                lockedByExaminerName: examinerDataItem.lockedByExaminerID > 0 ?
                    (loginSession.EXAMINER_ID === examinerDataItem.lockedByExaminerID ?
                        localeStore.instance.TranslateText('team-management.my-team.my-team-data.locked-by-me') :
                        _this.getFormattedExaminerName(examinerDataItem.lockedByExaminerInitials, examinerDataItem.lockedByExaminerSurname)) : '',
                responsesToReviewCount: examinerDataItem.responsesToReviewCount
            };
            _this.flatExaminerViewDataItems.push(item);
        };
    }
    /**
     * Returns the target string
     * @param markingTargetName
     */
    ExaminerViewDataHelper.prototype.getMarkingTarget = function (markingModeId, isElectronicStandardisationTeamMember) {
        var targetName;
        switch (markingModeId) {
            case enums.MarkingMode.LiveMarking:
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.live');
                break;
            case enums.MarkingMode.Practice:
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.practice');
                break;
            case enums.MarkingMode.Approval:
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.standardisation');
                break;
            case enums.MarkingMode.ES_TeamApproval:
                // If the examiner is marking on their STM/2nd standardisation marking,
                //   then returns the status as 'STM/2nd Standardisation Marking'.
                targetName = isElectronicStandardisationTeamMember === true ?
                    localeStore.instance.TranslateText('team-management.my-team.examiner-targets.stm-standardisation') :
                    localeStore.instance.TranslateText('team-management.my-team.examiner-targets.second-standardisation');
                break;
            case enums.MarkingMode.Remarking:
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.examiner-target-live');
                break;
            case enums.MarkingMode.Simulation:
                targetName = localeStore.instance.TranslateText('team-management.my-team.examiner-targets.examiner-target-simulation');
                break;
        }
        return targetName;
    };
    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    ExaminerViewDataHelper.prototype.getFormattedExaminerName = function (initials, surname) {
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    /**
     * Returns whether a node is expandable or not
     * @param dataItem
     */
    ExaminerViewDataHelper.prototype.isExpanded = function (dataItem) {
        // if we want to sort on full list then we want expand all the nodes.
        if (this.isSortOnFullList(this.comparerName)) {
            return true;
        }
        else {
            // if examinerRoleId does not exist in Map, It will return false, else return the stored value.
            return teamManagementStore.instance.expandOrCollapseDetails.get(dataItem.examinerRoleId, false);
        }
    };
    /**
     * return true if examiner has subordinates
     * @param dataItem
     */
    ExaminerViewDataHelper.prototype.hasSubordinates = function (dataItem) {
        return !this.isSortOnFullList(this.comparerName) && dataItem.subordinates && dataItem.subordinates.length > 0;
    };
    /**
     * Returns the Formatted Lock Durartion
     * @param lockedDate
     */
    ExaminerViewDataHelper.prototype.getLockedDurationToDisplay = function (lockedDate) {
        // Get Current Date
        var currentDate = new Date();
        // Get Locked date
        lockedDate = new Date(lockedDate.toString());
        var lockedDuration = Math.floor((((currentDate.getTime() - lockedDate.getTime()) / 1000) / 60) / 60);
        if (lockedDuration > 23) {
            var lockedDurationInDays = Math.floor(lockedDuration / 24);
            if (lockedDurationInDays === 1) {
                return '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.day-single');
            }
            else {
                return lockedDurationInDays + ' ' +
                    localeStore.instance.TranslateText('generic.time-periods.days-plural');
            }
        }
        else {
            // If the locked duration column is O, it means in hours. Disply the value as 1
            if (lockedDuration === 1 || lockedDuration <= 0) {
                return '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.hour-single');
            }
            else {
                return lockedDuration + ' ' +
                    localeStore.instance.TranslateText('generic.time-periods.hours-plural');
            }
        }
    };
    /**
     * Returns whether the sort is applicable to full list or not.
     * @param comparerName : string
     */
    ExaminerViewDataHelper.prototype.isSortOnFullList = function (comparerName) {
        switch (comparerName) {
            case comparerList[comparerList.TargetProgressComparer]:
            case comparerList[comparerList.TargetProgressComparerDesc]:
                return true;
            default:
                return false;
        }
    };
    return ExaminerViewDataHelper;
}());
module.exports = ExaminerViewDataHelper;
//# sourceMappingURL=examinerviewdatahelper.js.map
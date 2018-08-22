import Immutable = require('immutable');
import enums = require('../enums');
import localehelper = require('../../../utility/locale/localehelper');
import localeStore = require('../../../stores/locale/localestore');
import toTeamList = require('../../../stores/message/typings/teamreturn');
import messageStore = require('../../../stores/message/messagestore');
import stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
import sortHelper = require('../../../utility/sorting/sorthelper');
import comparerList = require('../../../utility/sorting/sortbase/comparerlist');

class TeamListPopupHelper {

    /**
     * get to address list for message to list popup tree
     * @param teamList team list
     */
    public static getTreeViewTeamList(teamList: toTeamList, examinerRoleId: number): toTeamList {
        teamList.team.isOpen = true;
        teamList.team.toTeam = false;

        if (teamList.team && teamList.team.examinerRoleId === examinerRoleId) {
            teamList.team.isCurrentExaminer = true;
            teamList.team.fullName = this.getFormattedExaminerName(teamList.team.initials, teamList.team.surname);
            if (teamList.team.parent) {
                teamList.team.parent.isChecked = false;
                teamList.team.parent.fullName = this.getFormattedExaminerName(teamList.team.parent.initials, teamList.team.parent.surname);
            }
            if (teamList.team.stmParent) {
                teamList.team.stmParent.isChecked = false;
                teamList.team.stmParent.fullName =
                    this.getFormattedExaminerName(teamList.team.stmParent.initials, teamList.team.stmParent.surname);
            }
        }
        this.getTeamListDefaultStatus(teamList.team.subordinates, false);

        return teamList;
    }

    /**
     * update team list
     */
    public static updateTeamList(teamList: toTeamList, examinerRoleId: number, isExpand: boolean): toTeamList {
    // avoid assigning while clicking Expand/Collapse button
        if (!isExpand) {
            teamList.team.toTeam = false;
        }
        if (!isExpand && teamList.team.parent && teamList.team.parent.examinerRoleId === examinerRoleId) {
            teamList.team.parent.isChecked = !teamList.team.parent.isChecked;
        } else {
            this.updateStatus(teamList.team.subordinates, examinerRoleId, isExpand);
        }
        return teamList;
    }

    /**
     * select entire team
     */
    public static selectEntireTeam(teamList: toTeamList, isChecked: boolean): toTeamList {
        teamList.team.toTeam = isChecked;
        if (teamList.team.parent) {
            teamList.team.parent.isChecked = isChecked;
        }
        this.updateEntireTeam(teamList.team.subordinates, isChecked);
        return teamList;
    }

    /**
     * update status
     */
    private static updateStatus(teamList: Array<ExaminerInfo>, examinerRoleId: number,
        isExpand: boolean): Array<ExaminerInfo> {
        let that = this;

        for (var i = 0; i < teamList.length; i++) {
            if (teamList[i].examinerRoleId === examinerRoleId) {
                if (isExpand) {
                    teamList[i].isOpen = !teamList[i].isOpen;
                } else {
                    teamList[i].isChecked = !teamList[i].isChecked;
                }
                break;
            }
            if (teamList[i].subordinates.length > 0) {
                that.updateStatus(teamList[i].subordinates, examinerRoleId, isExpand);
            }
        }

        return teamList;
    }

    /**
     * get address list default visibility
     */
    private static getTeamListDefaultStatus(teamList: Array<ExaminerInfo>, status: boolean): Array<ExaminerInfo> {
        let that = this;
        let sortedSubordinates = sortHelper.sort(teamList, comparerList.examinerDataComparer);
        sortedSubordinates.map(function (examinerInfo: ExaminerInfo) {
            examinerInfo.isOpen = status;
            examinerInfo.isChecked = status;
            examinerInfo.fullName = that.getFormattedExaminerName(examinerInfo.initials, examinerInfo.surname);

            if (examinerInfo.subordinates && examinerInfo.subordinates.length > 0) {
                that.getTeamListDefaultStatus(examinerInfo.subordinates, status);
            }

        });
        return teamList;
    }

    /**
     *  update entire team
     */
    private static updateEntireTeam(teamList: Array<ExaminerInfo>, isChecked: boolean): Array<ExaminerInfo> {
        let that = this;
        teamList.map(function (examinerInfo: ExaminerInfo) {
            examinerInfo.isOpen = isChecked;
            examinerInfo.isChecked = isChecked;
            examinerInfo.toTeam = isChecked;
            if (examinerInfo.subordinates.length > 0) {
                that.updateEntireTeam(examinerInfo.subordinates, isChecked);
            }

        });
        return teamList;
    }

    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    private static getFormattedExaminerName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    }
}

export = TeamListPopupHelper;
import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import worklistDataFetchAction = require('../../actions/worklist/worklistdatafetchaction');
import markerProgressData = require('./typings/markerprogressdata');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import Immutable = require('immutable');
import worklistinitialisationaction = require('../../actions/worklist/worklistinitialisationaction');
import markingTargetSummary = require('./typings/markingtargetsummary');
import enums = require('../../components/utility/enums');
import examinerStore = require('../markerinformation/examinerstore');
import teamManagementTabSelectAction = require('../../actions/teammanagement/teammanagementtabselectaction');
import teamManagementHistoryInfoAction = require('../../actions/teammanagement/teammanagementhistoryinfoaction');
import teamManagementTabHelper = require('./../../utility/teammanagement/helpers/teammanagementtabhelper');

class TargetSummaryStore extends storeBase {

    public static MARKING_PROGRESS_EVENT = 'marking_Target_Data_Recieved';
    public static WORKLIST_INITIALISATION_COMPLETED = 'worklist_initialisation_completed';

    private success: boolean;

    private markerProgressData: markerProgressData;

    private _supervisorRemarkResponseCreated: boolean = false;

    /**
     * Constructor for targetsummary store
     */
    constructor() {
        super();
        this.success = false;
        this.markerProgressData = null;
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.WORKLIST_DATA_GET:
                    this.success = (action as worklistDataFetchAction).success;
                    if (this.success) {
                        this.setMarkingTargetResult((action as worklistDataFetchAction).getExaminerProgressData());
                    }

                    this.emit(TargetSummaryStore.MARKING_PROGRESS_EVENT);
                    this._supervisorRemarkResponseCreated = false;
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:

                    let resultData = (action as worklistinitialisationaction).markerProgressData;
                    if (resultData !== undefined && resultData.success) {
                        this.setMarkingTargetResult(resultData);
                    }

                    // This event should send because to load the target information on the left side for Live worklist.
                    // This is to set the stare after marking progress data has been loaded.
                    this.emit(TargetSummaryStore.MARKING_PROGRESS_EVENT);

                    // This will let the qigselector know that worklist intialisation has been completed and can continue
                    // response allocation(in case of practice/std response) or select the default target.
                    this.emit(TargetSummaryStore.WORKLIST_INITIALISATION_COMPLETED);
                    break;
                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    //Setting a variable when the supervisor response is created to avoid taking data from cache
                    this._supervisorRemarkResponseCreated = true;
                    break;
            }
        });
    }

    /**
     * To get the examiners target progress
     */
    public getExaminerMarkingTargetProgress() {
        let examinerMarkingTargetProgress = this.markerProgressData != null ?
            // If maximumMarkingLimit is 0 it is not used. So filter those targets here for avoiding issues.
            Immutable.List<markingTargetSummary>(this.markerProgressData.markingTargets.filter(
                (x: markingTargetSummary) => x.markingModeID !== enums.MarkingMode.Practice || x.maximumMarkingLimit > 0)) :
            undefined;

        // Only Qualification responses are displaying from help examiners.
        // Filter the targets, If there are any responses [Standardisation / Seed]
        if (examinerMarkingTargetProgress &&
            teamManagementTabHelper.selectedTeamManagementTab === enums.TeamManagement.HelpExaminers) {
            // Live marking target has to be shown only when the marker has been approved for live marking
            return Immutable.List<markingTargetSummary>(
                examinerMarkingTargetProgress.filter((x) =>
                    (((x.markingModeID === enums.MarkingMode.Approval ||
                        x.markingModeID === enums.MarkingMode.ES_TeamApproval) && x.isTargetCompleted) ||
                        (x.isCurrentTarget && x.markingModeID === enums.MarkingMode.LiveMarking &&
                        examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.NotApproved))
                ));
        }

        return examinerMarkingTargetProgress;
    }

    /**
     * Sort the marking target summary list
     * @param markingTargetsSummary
     */
    private sortMarkingTargets(markingTargets: Immutable.List<any>): Immutable.List<any> {
        // If same date exist in the list then sort by marking mode id
        if (this.isSameTargetDateExist(markingTargets) === true) {
            markingTargets = Immutable.List<any>(sortHelper.sort(markingTargets.toArray(),
                comparerList.MarkingTargetComparer));
        }

        return markingTargets;
    }


    /**
     * Sort the marking target summary list on completed date
     * @param markingTargetsSummary
     */
    public sortMarkingTargetsOnCompletedDate(markingTargets: Immutable.List<any>): Immutable.List<any> {
        markingTargets = Immutable.List<any>(sortHelper.sort(markingTargets.toArray(), comparerList.markingTargetCompletedDateComparer));
        return markingTargets;
    }

    /**
     * Check whether same date exist in the list
     * @param markingTargets
     */
    private isSameTargetDateExist(markingTargets: Immutable.List<any>): boolean {
        // Get target date only from the list
        let targetDateList = markingTargets.map(function (t: any) { return t.markingTargetDate; }).toArray();

        // Filter same date to the list
        let uniqueTargetDateList = targetDateList.filter(function (elem: any, pos: any) {
            return targetDateList.indexOf(elem) === pos;
        });

        // If marking target collection has the following
        // Live marking - 22/03/2016, Practise marking - 22/03/2016, Standardisation marking - 22/03/2016
        // then targetDateList will have 22/03/2016, 22/03/2016, 22/03/2016 and
        // uniqueTargetDateList will have only 22/03/2016. Comparing the length will let us know duplicates
        // exist or not
        if (targetDateList.length !== uniqueTargetDateList.length) {
            return true;
        }

        return false;
    }

    /**
     * Returns the current marking mode which the examiner is in now.
     * @returns markingModeId
     */
    public getCurrentMarkingMode(): number {
        let markingModeId: number = 0;
        this.markerProgressData.markingTargets.map(function (targets: markingTargetSummary) {
            if (targets.isCurrentTarget === true) {
                markingModeId = targets.markingModeID;
                return markingModeId;
            }
        });
        return markingModeId;
    }

    /**
     * Returns the current target which the examiner is in now.
     * @returns target
     */
    public getCurrentTarget(): markingTargetSummary {
        let currentTarget: markingTargetSummary = undefined;
        this.markerProgressData.markingTargets.map(function (targets: markingTargetSummary) {
            if (targets.isCurrentTarget === true) {
                currentTarget = targets;
                return currentTarget;
            }
        });
        return currentTarget;
    }

    /**
     * return the requested remark targets
     * @param remarkRequestType remark request typoe
     */
    public getRemarkTarget(remarkRequestType: enums.RemarkRequestType): markingTargetSummary {
        let target = undefined;
        this.markerProgressData.markingTargets.map(function (targets: markingTargetSummary) {
            if (targets.markingModeID === enums.MarkingMode.Remarking && targets.remarkRequestTypeID === remarkRequestType) {
                target = targets;
                return target;
            }
        });
        return target;
    }

    /**
     * Updates the marking target data with a sorted List of Targets
     * @param {markerProgressData} resultData
     */
    private setMarkingTargetResult(resultData: markerProgressData) {
        this.markerProgressData = resultData;

        /** Modified sorting logic w.r.t User Story 29636 requirement-Pooled re-mark worklist shall be sorted by
         * target date (earliest target date displayed first, below Live marking)- sorting list of pooled remarks
         * and the remaining worklists as seperate lists and sorting the lists and finally concatenating the lists
         */
        let pooledRemarkMarkerProgressData = Immutable.List<markingTargetSummary>();
        let excludePooledRemarkMarkerProgressData = Immutable.List<markingTargetSummary>();

        excludePooledRemarkMarkerProgressData = this.sortMarkingTargets(Immutable.List<markingTargetSummary>
            (this.markerProgressData.markingTargets.filter(
                (x: markingTargetSummary) => x.markingModeID !== enums.MarkingMode.Remarking)));

        pooledRemarkMarkerProgressData = this.sortMarkingTargets(Immutable.List<markingTargetSummary>
            (this.markerProgressData.markingTargets.filter(
                (x: markingTargetSummary) => x.markingModeID === enums.MarkingMode.Remarking)));
        this.markerProgressData.markingTargets = Immutable.List<any>(excludePooledRemarkMarkerProgressData.concat
            (pooledRemarkMarkerProgressData));
    }

    /**
     * Returns the current response mode which the examiner is in now.
     * @returns markingModeId
     */
    public getCurrentResponseMode(markingMode: enums.MarkingMode,
                                  worklistType: enums.WorklistType,
                                  currentMarkingMode: enums.MarkingMode): enums.ResponseMode {
        let responseMode: enums.ResponseMode = enums.ResponseMode.none;
        this.markerProgressData.markingTargets.map(function (targets: markingTargetSummary) {

            if (targets.markingModeID === markingMode) {
                // If the target is completed and marker is still in Not Approved status
                // (scenario: completed standardisation inacurately), then marker should be in open worklist
                if (worklistType === enums.WorklistType.atypical) {
                    responseMode = enums.ResponseMode.open;
                } else if (targets.isTargetCompleted === true
                    && examinerStore.instance.getMarkerInformation.approvalStatus !== enums.ExaminerApproval.NotApproved) {
                    if (targets.examinerProgress.openResponsesCount >= 0 && worklistType === enums.WorklistType.live) {
                        responseMode = enums.ResponseMode.open;
                    } else {
                        if (targets.examinerProgress.pendingResponsesCount > 0) {
                            responseMode = enums.ResponseMode.pending;
                        } else if (targets.examinerProgress.closedResponsesCount > 0) {
                            responseMode = enums.ResponseMode.closed;
                        } else {
                            responseMode = enums.ResponseMode.open;
                        }
                    }
                } else if (targets.isTargetCompleted === true
                    // Bug fix - 49420 - When the marker is in second standardisation stage, not approved and
                    // logs out from standardisation worklist. Closed worklist needs to be shown on login.
                    && (worklistType === enums.WorklistType.practice || worklistType === enums.WorklistType.standardisation)
                    && currentMarkingMode !== markingMode
                    && examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.NotApproved) {
                    responseMode = enums.ResponseMode.closed;
                } else {
                    responseMode = enums.ResponseMode.open;
                }
            }
        });
        return responseMode;
    }

    /**
     * Gets the current response mode which the worklist should be for marking check
     */
    public get currentResponseModeForMarkingCheck(): enums.ResponseMode {

        let responseMode: enums.ResponseMode = enums.ResponseMode.none;

        this.markerProgressData.markingTargets.map(function (targets: markingTargetSummary) {

            if (targets.markingModeID === enums.MarkingMode.LiveMarking) {

                if (targets.examinerProgress.closedResponsesCount > 0) {
                    responseMode = enums.ResponseMode.closed;
                } else if (targets.examinerProgress.pendingResponsesCount > 0) {
                    responseMode = enums.ResponseMode.pending;
                } else if (targets.examinerProgress.openResponsesCount > 0) {
                    responseMode = enums.ResponseMode.open;
                } else {
                    responseMode = enums.ResponseMode.closed;
                }
            }
        });

        return responseMode;
    }

    /**
     * Returns whether a supervisor remark is created or not
     * @returns
     */
    public get isSupervisorRemarkCreated(): boolean {
        return this._supervisorRemarkResponseCreated;
    }
}

let instance = new TargetSummaryStore();
export = { TargetSummaryStore, instance };
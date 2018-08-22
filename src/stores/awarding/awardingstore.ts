import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import awardingIndicatorAction = require('../../actions/awarding/awardingindicatoraction');
import awardingcomponentselectaction = require('../../actions/awarding/awardingcomponentselectaction');
import componentAndSessionGetAction = require('../../actions/awarding/componentandsessiongetaction');
import awardingCandidateDetailsGetAction = require('../../actions/awarding/awardingcandidatedetailsgetaction');
import updateFilterforCandidateDataSelectAction = require('../../actions/awarding/updateFilterforCandidateDataSelectAction');
import setSelectedCandidateDataAction = require('../../actions/awarding/setselectedcandidatedataaction');
import Immutable = require('immutable');
import awardingJudgementStatusGetAction = require('../../actions/awarding/awardingjudgementstatusgetaction');
import awardingJudgementStatusSelectAction = require('../../actions/awarding/selectawardingjudgementstatusaction');
/**
 * Awarding store
 */
class AwardingStore extends storeBase {

	private _hasAwardingAccess: boolean;
	private _hasPendingJudgement: boolean;
	private _selectedComponentId: string;
	private _selectedExamProductID: string;
	private _selectedSession: AwardingComponentAndSession;
	private _examSessionID: any;
	private _componentList: Immutable.List<AwardingComponentAndSession>;
	private _sessionList: Immutable.List<AwardingComponentAndSession>;
	private _componentAndSessionCollection: Immutable.List<AwardingComponentAndSession>;
	private _selectedComponentName: string;
	private _candidateDetails: Immutable.List<AwardingCandidateDetails>;
	private _gradeDetails: Immutable.List<AwardingCandidateDetails>;
	private _grades: any;
	private _totalMarks: any;
	private _totalMarkDetails: Immutable.List<AwardingCandidateDetails>;
	private _selectedGrade: string;
	private _selectedTotalMark: string;
	private _orderbyGrade: boolean;
	private _expandedOrCollapsedItemList = Immutable.Map<number, Immutable.Map<string, boolean>>();
	private _selectedCandidateData: AwardingCandidateDetails;
	private _awardingJudgementStausList: Immutable.List<AwardingJudgementStatus>;

	public static SET_PANEL_STATE = 'setAwardingLeftPanelState';
	public static AWARDING_ACCESS_DETAILS = 'getAwardingAccessDetails';
	public static AWARDING_COMPONENT_SELECTED = 'selectAwardingComponent';
	public static AWARDING_COMPONENT_DATA_RETRIEVED = 'retrievedAwardingComponentData';
	public static AWARDING_CANDIDATE_DATA_RETRIEVED = 'retrievedAwardingCandidatetData';
	public static SELECTED_CANDIDATE_DATA_UPDATED = 'selectedcandidatedataupdated';
	public static AWARDING_JUDGEMENT_STATUS_SELECTED = 'awardingjudgementstatusselected';

    /**
     * @constructor
     */
	constructor() {
		super();

		this._dispatchToken = dispatcher.register((action: action) => {
			switch (action.actionType) {

				case actionType.GET_AWARDING_ACCESS_DETAILS:
					let awardingAccessDetailsData = (action as awardingIndicatorAction).awardingAccessDetailsData;
					this._hasAwardingAccess = awardingAccessDetailsData.hasAwardingAccess;
					this._hasPendingJudgement = awardingAccessDetailsData.hasPendingJudgement;
					this.emit(AwardingStore.AWARDING_ACCESS_DETAILS);
					break;

				case actionType.AWARDING_COMPONENT_SELECT:
					let _action = (action as awardingcomponentselectaction);
					this._selectedExamProductID = _action.examProductId;
					this._selectedComponentId = _action.componentId;
					this._selectedComponentName = _action.assessmentCode;
					this._selectedSession = this._componentList.find(x => x.componentId === this._selectedComponentId &&
						x.examProductId.toString() === this._selectedExamProductID);
					this._sessionList = this._componentAndSessionCollection.filter(x => x.componentId === this._selectedComponentId &&
						x.examProductId.toString() === this._selectedExamProductID).
						toList();
					this._sessionList = this._sessionList.groupBy(x => x.examSessionId).map(x => x.first()).toList();
					this.emit(AwardingStore.AWARDING_COMPONENT_SELECTED, _action.viaUserOption);
					break;

				case actionType.COMPONENT_AND_SESSION_GET:
					let _componentAndSessionGetAction = (action as componentAndSessionGetAction);
					this._componentAndSessionCollection = Immutable.List<AwardingComponentAndSession>(_componentAndSessionGetAction.
						componentAndSessionList.awardingComponentAndSessionList);
					/* Setting the first component as selected by default */
					let firstComponent = (this._componentAndSessionCollection) ?
						this._componentAndSessionCollection.groupBy(x => x.componentId
							&& x.examProductId).map(x => x.first()).first() : undefined;
					this._selectedComponentId = (firstComponent) ? firstComponent.componentId : this._selectedComponentId;
					this._selectedExamProductID = (firstComponent) ? firstComponent.examProductId.toString() : this._selectedExamProductID;
					this._selectedComponentName = (firstComponent) ? firstComponent.assessmentCode : this._selectedComponentName;
					/* Processing the components and session data collection and keep the distinct component in a collection*/
					this._selectedSession = firstComponent;
					this.processComponentData(this._componentAndSessionCollection);
					if (this._selectedSession) {
						this.emit(AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED);
					}
					break;

				case actionType.CANDIDATE_DETAILS_GET:
					let _candidateDetailsGetAction = (action as awardingCandidateDetailsGetAction);
					this._candidateDetails = Immutable.List<AwardingCandidateDetails>
						(_candidateDetailsGetAction.candidateDetailsList.awardingCandidateList);
					this._examSessionID = _candidateDetailsGetAction.selectedExamSessionId;
					this._gradeDetails = this._candidateDetails.groupBy(x => x.grade).map(x => x.first()).toList();
					this._grades = this._gradeDetails.sort((x, y) => {
						return x.grade.localeCompare(y.grade);
					});
					this._selectedSession = this._sessionList.find(x => (x.examSessionId === this._examSessionID));
					this._totalMarkDetails = this._candidateDetails.groupBy(x => x.totalMark.toFixed(2)).map(x => x.first()).toList();
					this._totalMarks = this._totalMarkDetails.sort((x, y) => {
						return x.totalMark - y.totalMark;
					});
					if (this._selectedSession) {
						this.emit(AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED);
					}
                    break;

				case actionType.SET_SELECTED_CANDIDATE_DATA:
					let _selectedCandidateDataAction = (action as setSelectedCandidateDataAction);
					this._selectedCandidateData = this._candidateDetails.filter
						(x => x.awardingCandidateID === _selectedCandidateDataAction.awardingCandidateId).first();
					this.emit(AwardingStore.SELECTED_CANDIDATE_DATA_UPDATED);
                    break;

				case actionType.AWARDING_JUDGEMENT_STATUS:
					let _awardingJudgementStatusAction = (action as awardingJudgementStatusGetAction);
					this._awardingJudgementStausList = Immutable.List<AwardingJudgementStatus>
						(_awardingJudgementStatusAction.judgementStatusList.awardingJudgementStatusList);
                    break;

				case actionType.SELECT_AWARDING_JUDGEMENT_STATUS:
					let _judgementStatusSelectAction = (action as awardingJudgementStatusSelectAction);
                    this.updateSelectedJudgementStatus(_judgementStatusSelectAction.selectedJudgementStatus);
                    this._selectedCandidateData.awardingJudgementCount = (_judgementStatusSelectAction.totalJudgmementCount);
					this.emit(AwardingStore.AWARDING_JUDGEMENT_STATUS_SELECTED);
					break;
			}
		});
	}

    /**
     * Returns a value indicating whether the examiner has awarding access or not
     */
	public get hasAwardingAccess(): boolean {
		return this._hasAwardingAccess;
	}

    /**
     *  Returns a value indicating whether the examiner has pending judgement or not
     */
	public get hasPendingJudgement(): boolean {
		return this._hasPendingJudgement;
	}

    /**
     * returns the distinct component collection for awarding
     */
	public get componentList(): Immutable.List<AwardingComponentAndSession> {
		return this._componentList;
	}

    /**
     *  Returns the component id of the selected component
     */
	public get selectedComponentId(): string {
		return this._selectedComponentId;
	}

    /**
     *  Returns the exam product id of the selected component
     */
	public get selectedExamProductId(): string {
		return this._selectedExamProductID.toString();
	}

    /**
     * returns the distinct exam session for the selected component
     */
	public get sessionList(): Immutable.List<AwardingComponentAndSession> {
		return this._sessionList;
	}

    /**
     *  Returns the selected session name
     */
	public get selectedSession(): AwardingComponentAndSession {
		return this._selectedSession;
	}

    /**
     * Returns a list grades for the selected exam session
     */
	public get gradeList(): Immutable.List<AwardingCandidateDetails> {
		return this._grades;
	}

    /**
     * Returns a list marks for the selected exam session
     */
	public get markList(): Immutable.List<AwardingCandidateDetails> {
		return this._totalMarks;
	}

    /**
     * Retrieve awarding candidate grid data
     */
	public get awardingCandidateData(): Immutable.List<AwardingCandidateDetails> {
		return this._candidateDetails;
	}

    /**
     * return the expanded or collapsed items
     */
	public get epandedOrCollapsedItem(): Immutable.Map<number, Immutable.Map<string, boolean>> {
		return this._expandedOrCollapsedItemList;
	}

    /**
     * retunr the selected item group
     * @param selectedDisplayId
     */
	public get selectedCandidateData(): AwardingCandidateDetails {
		return this._selectedCandidateData;
	}

    /**
     * set the distinct component collection in the local variable
     * @param componentAndSessionCollection
     */
	private processComponentData(componentAndSessionCollection: Immutable.List<AwardingComponentAndSession>) {
		if (this._selectedComponentId && componentAndSessionCollection) {
			this._componentList = componentAndSessionCollection.groupBy(x => x.componentId && x.examProductId).map(x => x.first()).toList();
			this._sessionList = componentAndSessionCollection.filter(x => x.componentId === this._selectedComponentId
				&& x.examProductId.toString() === this._selectedExamProductID).toList();
			this._sessionList = this._sessionList.groupBy(x => x.examSessionId).map(x => x.first()).toList();
		}
	}

	/**
	 * Returns a awarding judgement status
	 */
	public get awardingJudgementStatusList(): Immutable.List<AwardingJudgementStatus> {
		return this._awardingJudgementStausList;
	}

	/**
	 * update the judgement status of selected candidate in store.
	 * @param judgementStatus
	 */
	private updateSelectedJudgementStatus(judgementStatus: AwardingJudgementStatus) {
		if (this._selectedCandidateData && judgementStatus) {
			this._candidateDetails.forEach((can: AwardingCandidateDetails) => {
				if (can.awardingCandidateID === this._selectedCandidateData.awardingCandidateID) {
					can.awardingJudgementID = judgementStatus.awardingJudgementID,
						can.awardingJudgementStatusName = judgementStatus.awardingJudgementID === -1 ?
							undefined : judgementStatus.awardingJudgementStatusName;
				}
			});

			this._selectedCandidateData.awardingJudgementStatusID = judgementStatus.awardingJudgementID;
			this._selectedCandidateData.awardingJudgementStatusName = judgementStatus.awardingJudgementID === -1
				? undefined : judgementStatus.awardingJudgementStatusName;
		}
	}


	/**
	 * Get the related markGroupIds for awarding samples.
	 *  returns related mgIds of the currentMarkGroupId
	 */
    public  getRelatedMarkGroupIdForAwarding(): number[] {
        let markGroupIds: number[] = [];
		this._selectedCandidateData.responseItemGroups.map((x: any) => {
			markGroupIds.push(x.markGroupId);
		});

        return markGroupIds;
	}
}

let instance = new AwardingStore();
export = { AwardingStore, instance };

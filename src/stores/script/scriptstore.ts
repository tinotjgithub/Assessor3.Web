import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import candidateScriptMetadataRetrievalAction = require('../../actions/script/candidatescriptmetadataretrievalaction');
import candidateResponseMetadata = require('./typings/candidateresponsemetadata');
import additionalObjectFlagSaveAction = require('../../actions/script/additionalobjectflagsaveaction');
import stdSetupWorkListSelectAction = require('../../actions/standardisationsetup/standardisationsetupworklistselectaction');
import enums = require('../../components/utility/enums');
import Immutable = require('immutable');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');

/**
 * Class for Script Store
 */
class ScriptStore extends storeBase {

    // Holds the constant for representing the script refresh action event
    public static SCRIPT_REFRESH_EVENT = 'ScriptRefreshEvent';

    // Holds the constant for representing the candidate response metadata retrieval action event
    public static CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT = 'CandidateResponseMetadataRetrievalEvent';

    // Holds the candidate response metadata
    private candidateResponseMetadata: candidateResponseMetadata;

    // filtered candidate response metadata
    private _filteredCandidateResponseMetadata: candidateResponseMetadata;

    private _additionalObjectFlagCollection: Immutable.Map<number, boolean>;

    private awardingFlag: boolean = true;
    private _selectedStandardisationSetupWorkList: enums.StandardisationSetup;
    /**
     * @Constructor
     */
    constructor() {
        super();
        this.awardingFlag = false;
        this._additionalObjectFlagCollection = Immutable.Map<number, boolean>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED:
                    let candidateScriptMetadataRetrievalAction = (action as candidateScriptMetadataRetrievalAction);
                    let currentSelectedWorklistType: enums.StandardisationSetup =
                        candidateScriptMetadataRetrievalAction.selectedStandardisationSetupWorklist;
                    if (candidateScriptMetadataRetrievalAction.getCandidateResponseMetadata() !== undefined) {
                        if (candidateScriptMetadataRetrievalAction.isAutoRefreshCall) {
                            // initializing candidateResponseMetadata object.
                            this._filteredCandidateResponseMetadata = { 'scriptImageList': null };
                            let filteredInfo: ScriptImage[] = [];
                            let previousCandidateMetaData = this.candidateResponseMetadata;
                            let currentCandidateMetaData = candidateScriptMetadataRetrievalAction.getCandidateResponseMetadata();
                            currentCandidateMetaData.scriptImageList.map((x: ScriptImage) => {
                                let item = previousCandidateMetaData.scriptImageList.find((y: ScriptImage) => {
                                    return y.candidateScriptId === x.candidateScriptId && y.documentId === x.documentId &&
                                        y.pageNumber === x.pageNumber;
                                });
                                // if item is new or row version is changed we will push that into filtered list.
                                if ((item !== undefined && item.rowVersion !== x.rowVersion) || (item === undefined)) {
                                    filteredInfo.push(x);
                                }
                            });

                            this._filteredCandidateResponseMetadata.scriptImageList = Immutable.List(filteredInfo);
                        }

                        if (this._selectedStandardisationSetupWorkList === currentSelectedWorklistType ||
                            currentSelectedWorklistType === enums.StandardisationSetup.None || this.awardingFlag) {
                            this.candidateResponseMetadata = candidateScriptMetadataRetrievalAction.getCandidateResponseMetadata();
                        }

                        this.emit(ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
                            candidateScriptMetadataRetrievalAction.isAutoRefreshCall);
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    if (responseDataGetAction.searchedResponseData &&
                        responseDataGetAction.searchedResponseData.triggerPoint
                        !== enums.TriggerPoint.DisplayIdSearch) {
                        this.candidateResponseMetadata = undefined;
                    }
                    break;
                case actionType.ADDITIONAL_OBJECT_FLAG_SAVE_ACTION:
                    let additionalObjectFlagSaveAction = (action as additionalObjectFlagSaveAction);
                    this._additionalObjectFlagCollection = additionalObjectFlagSaveAction.additionalObjectFlagCollection;
                    break;
                case actionType.CANDIDATE_DETAILS_GET:
                    this.awardingFlag = true;
                    break;
                case actionType.STANDARDISATION_SETUP_WORKLIST_SELECT_ACTION:
                    this._selectedStandardisationSetupWorkList = (action as stdSetupWorkListSelectAction).selectedWorkList;
                    break;
            }
        });
    }

    /**
     * Gets All the Script Details for a candidate.
     * @param candidateScriptId
     */
    public getScriptDetails(candidateScriptId: number, pageNo: number) {
        if (this.candidateResponseMetadata != null) {
            let scriptImage = this.candidateResponseMetadata.scriptImageList.filter((scriptImage: ScriptImage) =>
                scriptImage.candidateScriptId === candidateScriptId && scriptImage.pageNumber === pageNo
            );

            if (scriptImage != null) {
                return scriptImage.first();
            }
        }

        return null;
    }

    /**
     * Get All the Script Details for a candidate.
     * @param candidateScriptId
     */
    public getAllScriptDetailsForTheCandidateScript(candidateScriptId: number): Immutable.List<ScriptImage> {
        if (this.candidateResponseMetadata != null) {
            let scriptImages = this.candidateResponseMetadata.scriptImageList.filter((scriptImage: ScriptImage) =>
                scriptImage.candidateScriptId === candidateScriptId
            );
            return Immutable.List<ScriptImage>(scriptImages.values());
        }

        return null;
    }

    /**
     * Returns back the candidate response metadata
     */
    public get getCandidateResponseMetadata(): candidateResponseMetadata {
        return this.candidateResponseMetadata;
    }

    /**
     * Returns back the filtered candidate response metadata
     */
    public get filteredCandidateResponseMetadata(): candidateResponseMetadata {
        return this._filteredCandidateResponseMetadata;
    }

    /**
     * Returns additional object flag value aganist the image.
     */
    public getAdditionalObjectFlagValue = (pageNumber: number): boolean => {
        return this._additionalObjectFlagCollection.get(pageNumber);
    }

}

let instance = new ScriptStore();
export = { ScriptStore, instance };
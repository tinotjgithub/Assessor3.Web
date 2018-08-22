import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import markSchemeStructureGetAction = require('../../actions/markschemestructure/markschemestructuregetaction');
import worklistinitialisationaction = require('../../actions/worklist/worklistinitialisationaction');
import treeViewItem = require('./typings/treeviewitem');
import enums = require('../../components/utility/enums');
import Immutable = require('immutable');
import qigStore = require('../qigselector/qigstore');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import cluster = require('./typings/cluster');
import answerItem = require('./typings/answeritem');
import markScheme = require('./typings/markscheme');
import resetMarkInfoLoadStatusAction = require('../../actions/marking/resetmarkinfoloadstatusaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');

/**
 * Class for Mark Scheme Structure store
 */
class MarkSchemeStructureStore extends storeBase {

    // MarkSchemeStructure object.
    private _markSchemeStructure: MarkSchemeStructure;
    // The  tree view item collection for the mark scheme view.
    private _treeItem: treeViewItem = undefined;

    private _isMarkSchemeStructureLoaded: boolean = false;

    // MarkSchemeStructureLoaded event name.
    public static MARK_SCHEME_STRUCTURE_LOADED_EVENT = 'MarkSchemeStructureLoadedEvent';


    /**
     * @Constructor
     */
    constructor() {
        super();

        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.MARK_SCHEME_STRUCTURE_LOAD:
                    let actionResult = (action as markSchemeStructureGetAction);
                    if (actionResult.success) {
                        this._markSchemeStructure = actionResult.markSchemeStructure;
                        this._isMarkSchemeStructureLoaded = true;
                    } else {
                        this._isMarkSchemeStructureLoaded = false;
                        // If a new qig has been selected and call has been failed, clear the previous selection
                        this._markSchemeStructure = null;
                    }

                    this.emit(MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT);
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:
                    let markschemeData = (action as worklistinitialisationaction).markSchemeStuctureData;
                    if (markschemeData.success) {
                        this._isMarkSchemeStructureLoaded = true;
                        this._markSchemeStructure = markschemeData;
                    }
                    break;
                case actionType.RESET_MARK_INFO_LOAD_STATUS:
                    let markInfoResetAction: resetMarkInfoLoadStatusAction = action as resetMarkInfoLoadStatusAction;
                    if (markInfoResetAction.resetMarkSchemeLoadStatus) {
                        this._isMarkSchemeStructureLoaded = false;
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    if (responseDataGetAction.searchedResponseData &&
                        responseDataGetAction.searchedResponseData.triggerPoint
                        !== enums.TriggerPoint.DisplayIdSearch) {
                        this._isMarkSchemeStructureLoaded = false;
                    }
                    break;
            }
        });

    }

    /**
     * Get the MarkSchemeStructure against the current qig
     * @returns
     */
    public get markSchemeStructure(): MarkSchemeStructure {
        return this._markSchemeStructure;
    }

    /**
     * Check isMarkSchemeStructureLoaded
     */
    public isMarkSchemeStructureLoaded(): boolean {
        return this._isMarkSchemeStructureLoaded;
    }
}

let instance = new MarkSchemeStructureStore();
export = { MarkSchemeStructureStore, instance };

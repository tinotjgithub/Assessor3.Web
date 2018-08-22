"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var standardisationSetupStore = require('../standardisationsetup/standardisationsetupstore');
var enums = require('../../components/utility/enums');
var Immutable = require('immutable');
/**
 * Class for Script Store
 */
var ScriptStore = (function (_super) {
    __extends(ScriptStore, _super);
    /**
     * @Constructor
     */
    function ScriptStore() {
        var _this = this;
        _super.call(this);
        /**
         * Returns additional object flag value aganist the image.
         */
        this.getAdditionalObjectFlagValue = function (pageNumber) {
            return _this._additionalObjectFlagCollection.get(pageNumber);
        };
        this._additionalObjectFlagCollection = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED:
                    var candidateScriptMetadataRetrievalAction_1 = action;
                    var currentSelectedWorklistType = candidateScriptMetadataRetrievalAction_1.selectedStandardisationSetupWorklist;
                    if (candidateScriptMetadataRetrievalAction_1.getCandidateResponseMetadata() !== undefined) {
                        if (candidateScriptMetadataRetrievalAction_1.isAutoRefreshCall) {
                            // initializing candidateResponseMetadata object.
                            _this._filteredCandidateResponseMetadata = { 'scriptImageList': null };
                            var filteredInfo_1 = [];
                            var previousCandidateMetaData_1 = _this.candidateResponseMetadata;
                            var currentCandidateMetaData = candidateScriptMetadataRetrievalAction_1.getCandidateResponseMetadata();
                            currentCandidateMetaData.scriptImageList.map(function (x) {
                                var item = previousCandidateMetaData_1.scriptImageList.find(function (y) {
                                    return y.candidateScriptId === x.candidateScriptId && y.documentId === x.documentId &&
                                        y.pageNumber === x.pageNumber;
                                });
                                // if item is new or row version is changed we will push that into filtered list.
                                if ((item !== undefined && item.rowVersion !== x.rowVersion) || (item === undefined)) {
                                    filteredInfo_1.push(x);
                                }
                            });
                            _this._filteredCandidateResponseMetadata.scriptImageList = Immutable.List(filteredInfo_1);
                        }
                        if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === currentSelectedWorklistType ||
                            currentSelectedWorklistType === enums.StandardisationSetup.None) {
                            _this.candidateResponseMetadata = candidateScriptMetadataRetrievalAction_1.getCandidateResponseMetadata();
                        }
                        _this.emit(ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, candidateScriptMetadataRetrievalAction_1.isAutoRefreshCall);
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    _this.candidateResponseMetadata = undefined;
                    break;
                case actionType.ADDITIONAL_OBJECT_FLAG_SAVE_ACTION:
                    var additionalObjectFlagSaveAction_1 = action;
                    _this._additionalObjectFlagCollection = additionalObjectFlagSaveAction_1.additionalObjectFlagCollection;
                    break;
            }
        });
    }
    /**
     * Gets All the Script Details for a candidate.
     * @param candidateScriptId
     */
    ScriptStore.prototype.getScriptDetails = function (candidateScriptId, pageNo) {
        if (this.candidateResponseMetadata != null) {
            var scriptImage = this.candidateResponseMetadata.scriptImageList.filter(function (scriptImage) {
                return scriptImage.candidateScriptId === candidateScriptId && scriptImage.pageNumber === pageNo;
            });
            if (scriptImage != null) {
                return scriptImage.first();
            }
        }
        return null;
    };
    /**
     * Get All the Script Details for a candidate.
     * @param candidateScriptId
     */
    ScriptStore.prototype.getAllScriptDetailsForTheCandidateScript = function (candidateScriptId) {
        if (this.candidateResponseMetadata != null) {
            var scriptImages = this.candidateResponseMetadata.scriptImageList.filter(function (scriptImage) {
                return scriptImage.candidateScriptId === candidateScriptId;
            });
            return Immutable.List(scriptImages.values());
        }
        return null;
    };
    Object.defineProperty(ScriptStore.prototype, "getCandidateResponseMetadata", {
        /**
         * Returns back the candidate response metadata
         */
        get: function () {
            return this.candidateResponseMetadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScriptStore.prototype, "filteredCandidateResponseMetadata", {
        /**
         * Returns back the filtered candidate response metadata
         */
        get: function () {
            return this._filteredCandidateResponseMetadata;
        },
        enumerable: true,
        configurable: true
    });
    // Holds the constant for representing the script refresh action event
    ScriptStore.SCRIPT_REFRESH_EVENT = 'ScriptRefreshEvent';
    // Holds the constant for representing the candidate response metadata retrieval action event
    ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT = 'CandidateResponseMetadataRetrievalEvent';
    return ScriptStore;
}(storeBase));
var instance = new ScriptStore();
module.exports = { ScriptStore: ScriptStore, instance: instance };
//# sourceMappingURL=scriptstore.js.map
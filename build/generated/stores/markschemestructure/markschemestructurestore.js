"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
/**
 * Class for Mark Scheme Structure store
 */
var MarkSchemeStructureStore = (function (_super) {
    __extends(MarkSchemeStructureStore, _super);
    /**
     * @Constructor
     */
    function MarkSchemeStructureStore() {
        var _this = this;
        _super.call(this);
        // The  tree view item collection for the mark scheme view.
        this._treeItem = undefined;
        this._isMarkSchemeStructureLoaded = false;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.MARK_SCHEME_STRUCTURE_LOAD:
                    var actionResult = action;
                    if (actionResult.success) {
                        _this._markSchemeStructure = actionResult.markSchemeStructure;
                        _this._isMarkSchemeStructureLoaded = true;
                    }
                    else {
                        _this._isMarkSchemeStructureLoaded = false;
                        // If a new qig has been selected and call has been failed, clear the previous selection
                        _this._markSchemeStructure = null;
                    }
                    _this.emit(MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT);
                    break;
                case actionType.WORKLIST_INITIALISATION_STARTED:
                    var markschemeData = action.markSchemeStuctureData;
                    if (markschemeData.success) {
                        _this._isMarkSchemeStructureLoaded = true;
                        _this._markSchemeStructure = markschemeData;
                    }
                    break;
                case actionType.RESET_MARK_INFO_LOAD_STATUS:
                    var markInfoResetAction = action;
                    if (markInfoResetAction.resetMarkSchemeLoadStatus) {
                        _this._isMarkSchemeStructureLoaded = false;
                    }
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    _this._isMarkSchemeStructureLoaded = false;
                    break;
            }
        });
    }
    Object.defineProperty(MarkSchemeStructureStore.prototype, "markSchemeStructure", {
        /**
         * Get the MarkSchemeStructure against the current qig
         * @returns
         */
        get: function () {
            return this._markSchemeStructure;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check isMarkSchemeStructureLoaded
     */
    MarkSchemeStructureStore.prototype.isMarkSchemeStructureLoaded = function () {
        return this._isMarkSchemeStructureLoaded;
    };
    // MarkSchemeStructureLoaded event name.
    MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT = 'MarkSchemeStructureLoadedEvent';
    return MarkSchemeStructureStore;
}(storeBase));
var instance = new MarkSchemeStructureStore();
module.exports = { MarkSchemeStructureStore: MarkSchemeStructureStore, instance: instance };
//# sourceMappingURL=markschemestructurestore.js.map
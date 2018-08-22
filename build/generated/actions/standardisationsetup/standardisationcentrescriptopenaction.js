"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var StandardisationCentreScriptOpenAction = (function (_super) {
    __extends(StandardisationCentreScriptOpenAction, _super);
    /**
     * Constructor
     * @param candidateScriptId
     */
    function StandardisationCentreScriptOpenAction(candidateScriptId, scriptAvailable) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN);
        this._selectedCandidateScriptId = candidateScriptId;
        this._scriptAvailable = scriptAvailable;
    }
    Object.defineProperty(StandardisationCentreScriptOpenAction.prototype, "selectedCandidateScriptId", {
        /**
         * returns the selected candidate script id.
         */
        get: function () {
            return this._selectedCandidateScriptId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationCentreScriptOpenAction.prototype, "scriptAvailable", {
        /**
         * get if the selected script is available or not.
         */
        get: function () {
            return this._scriptAvailable;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationCentreScriptOpenAction;
}(action));
module.exports = StandardisationCentreScriptOpenAction;
//# sourceMappingURL=standardisationcentrescriptopenaction.js.map
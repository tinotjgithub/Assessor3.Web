"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for storing the standardisation centre script filter.
 */
var StandardisationCentreScriptFilterAction = (function (_super) {
    __extends(StandardisationCentreScriptFilterAction, _super);
    /**
     * Constructor for StandardisationCentreScriptFilterAction
     */
    function StandardisationCentreScriptFilterAction(standardisationCentreScriptFilterDetails) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_CENTRE_SCRIPT_FILTER);
        this._standardisationCentreScriptFilterDetails = standardisationCentreScriptFilterDetails;
    }
    Object.defineProperty(StandardisationCentreScriptFilterAction.prototype, "getStandardisationCentreScriptFilterDetails", {
        /**
         * Gets standardisation centre script filter details
         */
        get: function () {
            return this._standardisationCentreScriptFilterDetails;
        },
        enumerable: true,
        configurable: true
    });
    return StandardisationCentreScriptFilterAction;
}(action));
module.exports = StandardisationCentreScriptFilterAction;
//# sourceMappingURL=standardisationcentrescriptfilteraction.js.map
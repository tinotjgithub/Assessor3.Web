"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for fetching the reclassify multi option popup display action.
 */
var ReclassifyMultiOptionPopupDisplayAction = (function (_super) {
    __extends(ReclassifyMultiOptionPopupDisplayAction, _super);
    /**
     * Constructor for ReclassifyMultiOptionPopupDisplayAction
     */
    function ReclassifyMultiOptionPopupDisplayAction(esMarkGroupId) {
        _super.call(this, action.Source.View, actionType.STANDARDISATION_RECLASSIFY_MULTI_OPTION_POPUP);
        this._esMarkGroupId = esMarkGroupId;
    }
    Object.defineProperty(ReclassifyMultiOptionPopupDisplayAction.prototype, "reclassifiedEsMarkGroupId", {
        /**
         * Gets esMarkGroupId of response to be reclassfied.
         */
        get: function () {
            return this._esMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return ReclassifyMultiOptionPopupDisplayAction;
}(action));
module.exports = ReclassifyMultiOptionPopupDisplayAction;
//# sourceMappingURL=reclassifymultioptionpopupdisplayaction.js.map
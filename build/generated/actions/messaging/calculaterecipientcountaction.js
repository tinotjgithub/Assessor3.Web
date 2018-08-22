"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var CalculateRecipientCountAction = (function (_super) {
    __extends(CalculateRecipientCountAction, _super);
    /**
     * Constructor
     * @param success
     */
    function CalculateRecipientCountAction() {
        _super.call(this, action.Source.View, actionType.CALCULATE_RECIPIENT_COUNT_ACTION);
    }
    return CalculateRecipientCountAction;
}(action));
module.exports = CalculateRecipientCountAction;
//# sourceMappingURL=calculaterecipientcountaction.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AwardingComponentSelectAction = (function (_super) {
    __extends(AwardingComponentSelectAction, _super);
    function AwardingComponentSelectAction(componentId, examproductId, assessmentCode, viaUserOption) {
        _super.call(this, action.Source.View, actionType.AWARDING_COMPONENT_SELECT);
        this._examProductId = examproductId;
        this._componentId = componentId;
        this._assessmentCode = assessmentCode;
        this._viaUserOption = viaUserOption;
    }
    Object.defineProperty(AwardingComponentSelectAction.prototype, "examProductId", {
        get: function () {
            return this._examProductId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingComponentSelectAction.prototype, "componentId", {
        get: function () {
            return this._componentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingComponentSelectAction.prototype, "assessmentCode", {
        get: function () {
            return this._assessmentCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingComponentSelectAction.prototype, "viaUserOption", {
        get: function () {
            return this._viaUserOption;
        },
        enumerable: true,
        configurable: true
    });
    return AwardingComponentSelectAction;
}(action));
module.exports = AwardingComponentSelectAction;
//# sourceMappingURL=awardingcomponentselectaction.js.map
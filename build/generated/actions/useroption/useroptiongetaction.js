"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var UserOptionGetAction = (function (_super) {
    __extends(UserOptionGetAction, _super);
    /**
     * Constructor UserOptionGetAction
     * @param success
     * @param json
     */
    function UserOptionGetAction(success, json) {
        _super.call(this, action.Source.View, actionType.USER_OPTION_GET, success);
        this.userOptions = json;
    }
    Object.defineProperty(UserOptionGetAction.prototype, "getUserOptions", {
        /**
         * for returning user options
         * @returns
         */
        get: function () {
            return this.userOptions;
        },
        enumerable: true,
        configurable: true
    });
    return UserOptionGetAction;
}(dataRetrievalAction));
module.exports = UserOptionGetAction;
//# sourceMappingURL=useroptiongetaction.js.map
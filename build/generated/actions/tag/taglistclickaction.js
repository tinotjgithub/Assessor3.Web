"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var TagListClickAction = (function (_super) {
    __extends(TagListClickAction, _super);
    /**
     * Constructor of tag list click action.
     * @param markGroupId
     */
    function TagListClickAction(markGroupId) {
        _super.call(this, action.Source.View, actionType.TAG_LIST_CLICK);
        this._markGroupId = markGroupId;
    }
    Object.defineProperty(TagListClickAction.prototype, "markGroupId", {
        /**
         * returns the mark group id of which the tag indicator has been selected.
         */
        get: function () {
            return this._markGroupId;
        },
        enumerable: true,
        configurable: true
    });
    return TagListClickAction;
}(action));
module.exports = TagListClickAction;
//# sourceMappingURL=taglistclickaction.js.map
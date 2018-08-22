"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to display all page not annotated popup.
 */
var ShowAllPageNotAnnotatedMessageAction = (function (_super) {
    __extends(ShowAllPageNotAnnotatedMessageAction, _super);
    /**
     * Constructor
     * @param navigatingTo
     */
    function ShowAllPageNotAnnotatedMessageAction(navigatingTo) {
        _super.call(this, action.Source.View, actionType.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE);
        this._navigatingTo = navigatingTo;
    }
    Object.defineProperty(ShowAllPageNotAnnotatedMessageAction.prototype, "navigatingTo", {
        /**
         * Navigating from response to different view
         */
        get: function () {
            return this._navigatingTo;
        },
        enumerable: true,
        configurable: true
    });
    return ShowAllPageNotAnnotatedMessageAction;
}(action));
module.exports = ShowAllPageNotAnnotatedMessageAction;
//# sourceMappingURL=showallpagenotannotatedmessageaction.js.map
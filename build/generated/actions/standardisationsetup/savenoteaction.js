"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SaveNoteAction = (function (_super) {
    __extends(SaveNoteAction, _super);
    function SaveNoteAction(esMarkGroupID, note) {
        _super.call(this, action.Source.View, actionType.SAVE_NOTE_ACTION);
        this._esMarkGroupID = esMarkGroupID;
        this._note = note;
    }
    Object.defineProperty(SaveNoteAction.prototype, "esMarkGroupID", {
        /**
         * This method will returns es_mark_group_id
         */
        get: function () {
            return this._esMarkGroupID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SaveNoteAction.prototype, "note", {
        /**
         * This method will returns corresponding note against response
         */
        get: function () {
            return this._note;
        },
        enumerable: true,
        configurable: true
    });
    return SaveNoteAction;
}(action));
module.exports = SaveNoteAction;
//# sourceMappingURL=savenoteaction.js.map
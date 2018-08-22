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
 * Class for Marking Instruction store
 */
var MarkingInstructionStore = (function (_super) {
    __extends(MarkingInstructionStore, _super);
    /**
     * @constructor
     */
    function MarkingInstructionStore() {
        var _this = this;
        _super.call(this);
        this._isMarkingInstructionPanelOpen = false;
        this._markingInstructionPanelPreviousState = false;
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.LOAD_MARKINGINSTRUCTIONS_DATA_ACTION:
                    var _loadmarkinginstructionsdataaction = action;
                    _this._markinginstructionsList = _loadmarkinginstructionsdataaction.markingInstructionsData;
                    _this.emit(MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT);
                    break;
                case actionType.MARKING_INSTRUCTION_PANEL_CLICK_ACTION:
                    _this._markingInstructionPanelPreviousState = _this._isMarkingInstructionPanelOpen;
                    _this._isMarkingInstructionPanelOpen = action.isMarkingInstructionPanelOpen;
                    if (!_this._isMarkingInstructionPanelOpen &&
                        _this._markingInstructionPanelPreviousState !== _this._isMarkingInstructionPanelOpen) {
                        // emit only if the action is closing and check the previous action action to avoid multiple emits of same action
                        _this.emit(MarkingInstructionStore.MARKINGINSTRUCTION_PANEL_CLOSED_EVENT);
                    }
                    break;
            }
        });
    }
    Object.defineProperty(MarkingInstructionStore.prototype, "markingInstructionList", {
        /**
         * Gets the marking instruction list
         */
        get: function () {
            return this._markinginstructionsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkingInstructionStore.prototype, "isMarkingInstructionPanelOpen", {
        /**
         * Gets is marking instruction panel is open or not
         */
        get: function () {
            return this._isMarkingInstructionPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    MarkingInstructionStore.MARKINGINSTRUCTIONS_DATA_LOADED_EVENT = 'markinginstructionsdataloadedevent';
    MarkingInstructionStore.MARKINGINSTRUCTION_PANEL_CLOSED_EVENT = 'markinginstructionpanelclickedevent';
    return MarkingInstructionStore;
}(storeBase));
var instance = new MarkingInstructionStore();
module.exports = { MarkingInstructionStore: MarkingInstructionStore, instance: instance };
//# sourceMappingURL=markinginstructionstore.js.map
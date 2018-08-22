"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var actionCreatorBase = require('../base/actioncreatorbase');
var markinginstructionDataservice = require('../../dataservices/markinginstructions/markinginstructionsdataservice');
var loadMarkingInstructionsDataAction = require('./loadmarkinginstructionsdataaction');
var markingInstructionPnaleClickAction = require('./markinginstructionpanelclickaction');
/**
 * class for Marking Instructions Action Creator
 */
var MarkingInstructionActionCreator = (function (_super) {
    __extends(MarkingInstructionActionCreator, _super);
    function MarkingInstructionActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * parameter data
     * @param markSchemeGroupId
     */
    MarkingInstructionActionCreator.prototype.getMarkingInstructionsActionCreator = function (markSchemeGroupId, markingInstructionCCValue, useCache) {
        if (useCache === void 0) { useCache = true; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            markinginstructionDataservice.getmarkinginstructions(function (success, markingInstructionsList) {
                if (that.validateCall(markingInstructionsList)) {
                    dispatcher.dispatch(new loadMarkingInstructionsDataAction(success, markingInstructionsList));
                    resolve(markingInstructionsList);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            }, markSchemeGroupId, markingInstructionCCValue, useCache);
        });
    };
    /**
     * On opening or closing marking instruction file panel
     * @param isMarkingInstructionPanelOpen
     */
    MarkingInstructionActionCreator.prototype.markingInstructionPanelOpenActionCreator = function (isMarkingInstructionPanelOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markingInstructionPnaleClickAction(isMarkingInstructionPanelOpen));
        }).catch();
    };
    return MarkingInstructionActionCreator;
}(actionCreatorBase));
var markingInstructionActionCreator = new MarkingInstructionActionCreator();
module.exports = markingInstructionActionCreator;
//# sourceMappingURL=markinginstructionactioncreator.js.map
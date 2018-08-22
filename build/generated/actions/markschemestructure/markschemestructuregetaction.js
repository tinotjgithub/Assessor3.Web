"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../../stores/markschemestructure/typings/markschemestructure.ts' />
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var MarkSchemeStructureGetAction = (function (_super) {
    __extends(MarkSchemeStructureGetAction, _super);
    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} markSchemeStructureList
     */
    function MarkSchemeStructureGetAction(success, markSchemeStructure) {
        // Map the collection
        _super.call(this, action.Source.View, actionType.MARK_SCHEME_STRUCTURE_LOAD, success);
        this._markSchemeStructure = markSchemeStructure;
    }
    Object.defineProperty(MarkSchemeStructureGetAction.prototype, "markSchemeStructure", {
        /**
         * Returns the mark Scheme Structure associated to the selected QIG.
         * @returns
         */
        get: function () {
            return this._markSchemeStructure;
        },
        enumerable: true,
        configurable: true
    });
    return MarkSchemeStructureGetAction;
}(dataRetrievalAction));
module.exports = MarkSchemeStructureGetAction;
//# sourceMappingURL=markschemestructuregetaction.js.map
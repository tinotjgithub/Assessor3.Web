"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var markSchemeStructureGetAction = require('./markschemestructuregetaction');
var markSchemeHeaderDropDownAction = require('./markschemeheaderdropdownaction');
var markSchemeStructureDataService = require('../../dataservices/markschemestructure/markschemestructuredataservice');
var annotationToolTipSetAction = require('./annotationtooltipsetaction');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
/**
 * Class for markSchemeStructure actioncreator
 */
var MarkSchemeStructureActionCreator = (function (_super) {
    __extends(MarkSchemeStructureActionCreator, _super);
    function MarkSchemeStructureActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Get the list of image zones of structured paper. If the selected marking method is other than structured clear the selection.
     * @param {number} questionPaperId
     * @param {boolean = true} useCache
     * @param {boolean = true} initiateDispatch
     */
    MarkSchemeStructureActionCreator.prototype.getmarkSchemeStructureList = function (markSchemeGroupId, questionPaperId, useCache, initiateDispatch, examSessionId, isAwarding) {
        if (useCache === void 0) { useCache = true; }
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        if (examSessionId === void 0) { examSessionId = 0; }
        if (isAwarding === void 0) { isAwarding = false; }
        var that = this;
        //Get data from cache or online
        return new Promise.Promise(function (resolve, reject) {
            markSchemeStructureDataService.getMarkSchemeStructureDetails(function (success, jsonData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                // If the call is not depended on promise ensure dispatcer is dispatching.
                if (that.validateCall(jsonData) && initiateDispatch) {
                    dispatcher.dispatch(new markSchemeStructureGetAction(success, jsonData));
                }
                resolve(jsonData);
            }, markSchemeGroupId, questionPaperId, useCache, examSessionId, isAwarding);
        });
    };
    /**
     * This will update the annotation tooltip information against markSchemeIds
     * @param toolTipInfo annotation tooltips dictionary with markSchemeId as key
     */
    MarkSchemeStructureActionCreator.prototype.updateAnnotationToolTip = function (toolTipInfo) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new annotationToolTipSetAction(true, toolTipInfo));
        }).catch();
    };
    /**
     * mark scheme header dropdown opened.
     */
    MarkSchemeStructureActionCreator.prototype.markSchemeHeaderDropDown = function (isHeaderDropDownOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markSchemeHeaderDropDownAction(isHeaderDropDownOpen));
        }).catch();
    };
    return MarkSchemeStructureActionCreator;
}(base));
var markSchemeStructureActionCreator = new MarkSchemeStructureActionCreator();
module.exports = markSchemeStructureActionCreator;
//# sourceMappingURL=markschemestructureactioncreator.js.map
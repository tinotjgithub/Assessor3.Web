"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var Immutable = require('immutable');
/**
 * Class for getting acetates details
 */
var AcetatesDataSevice = (function (_super) {
    __extends(AcetatesDataSevice, _super);
    function AcetatesDataSevice() {
        _super.apply(this, arguments);
    }
    /**
     * Converts acetatereturn collection to an immutable list
     * @param data
     */
    AcetatesDataSevice.prototype.getImmutableAcetates = function (data) {
        return Immutable.List(data.tools);
    };
    /**
     * Converts acetatereturn collection to an immutable list
     * @param data
     */
    AcetatesDataSevice.prototype.getImmutableAcetatesAfterSave = function (data) {
        return Immutable.List(data.acetatesReturnList);
    };
    /**
     * Loads the acetates data
     * @param callback
     * @param questionPaperID
     * @param markSchemeGroupId
     * @param includeRelatedQigs
     */
    AcetatesDataSevice.prototype.loadAcetates = function (callback, questionPaperID, markSchemeGroupId, includeRelatedQigs) {
        var url = urls.LOAD_ACETATES_URL + '/' + questionPaperID + '/' + markSchemeGroupId + '/' + includeRelatedQigs;
        /** Makes AJAX call to get acetates   */
        var getAcetatesPromise = this.makeAJAXCall('GET', url, '', false, false);
        var that = this;
        getAcetatesPromise.then(function (data) {
            var acetatesList = that.getImmutableAcetates(JSON.parse(data));
            if (callback) {
                callback(true, acetatesList);
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    /**
     * Save acetates details. AcetatesReturnList
     * @param saveAcetatesArgs
     * @param callback
     */
    AcetatesDataSevice.prototype.saveAcetates = function (callback, args) {
        var url = urls.SAVE_ACETATES_URL;
        var saveacetatesJson = JSON.stringify(args);
        /**  Making AJAX call to save the marks and annotations */
        var saveAcetatesPromise = this.makeAJAXCall('POST', url, saveacetatesJson);
        var that = this;
        saveAcetatesPromise.then(function (data) {
            var acetatesList = that.getImmutableAcetatesAfterSave(JSON.parse(data));
            if (callback) {
                callback(true, acetatesList);
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    };
    return AcetatesDataSevice;
}(dataServiceBase));
var acetatesDataService = new AcetatesDataSevice();
module.exports = acetatesDataService;
//# sourceMappingURL=acetatesdataservice.js.map
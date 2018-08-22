"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var Immutable = require('immutable');
var SupportAdminDataServices = (function (_super) {
    __extends(SupportAdminDataServices, _super);
    function SupportAdminDataServices() {
        _super.apply(this, arguments);
    }
    /**
     * Gets the amin support examiner details from the API
     * @param callback
     */
    SupportAdminDataServices.prototype.getSupportAdminExaminerLists = function (callback) {
        var that = this;
        var examinerList;
        var url = urls.GET_SUPPORT_EXAMINER_LIST_URL;
        // Make an ajax call to retrieve data and store the same in storage adapter.
        var supportAdminExaminerListPromise = that.makeAJAXCall('GET', url);
        // Store the data in in-memory storage adapter.
        supportAdminExaminerListPromise.then(function (json) {
            var supportAdminExaminerList = that.getImmutableExaminerList(JSON.parse(json));
            if (callback) {
                callback(true, supportAdminExaminerList);
            }
        }).catch(function (json) {
            if (callback) {
                callback(false, json);
            }
        });
    };
    /**
     * Change json object to immutable list
     * @param data
     */
    SupportAdminDataServices.prototype.getImmutableExaminerList = function (data) {
        data.getSupportExaminerList = Immutable.List(data.getSupportExaminerList);
        return data;
    };
    return SupportAdminDataServices;
}(dataServiceBase));
var supportAdminDataServices = new SupportAdminDataServices();
module.exports = supportAdminDataServices;
//# sourceMappingURL=supportadmindataservices.js.map
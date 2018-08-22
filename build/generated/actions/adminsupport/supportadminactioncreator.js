"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var adminSupportSortAction = require('./adminsupportsortaction');
var supportAdminDataServices = require('../../dataservices/adminsupport/supportadmindataservices');
var supportAdminExaminerListsAction = require('./getsupportadminexaminerlistsaction');
/**
 * Standardisation setup action creator
 */
var SupportAdminActionCreator = (function (_super) {
    __extends(SupportAdminActionCreator, _super);
    function SupportAdminActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Action creator to retrive centre details, for the selected response.
     */
    SupportAdminActionCreator.prototype.getSupportAdminExaminerLists = function () {
        supportAdminDataServices.getSupportAdminExaminerLists(function (success, supportAdminExaminerListData) {
            new Promise.Promise(function (resolve, reject) {
                resolve();
            }).then(function () {
                dispatcher.dispatch(new supportAdminExaminerListsAction(success, supportAdminExaminerListData));
            }).catch();
        });
    };
    /**
     * Handle the sort order
     */
    SupportAdminActionCreator.prototype.onSortedClick = function (sortDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new adminSupportSortAction(sortDetails));
        }).catch();
    };
    return SupportAdminActionCreator;
}(base));
var supportAdminActionCreator = new SupportAdminActionCreator();
module.exports = supportAdminActionCreator;
//# sourceMappingURL=supportadminactioncreator.js.map
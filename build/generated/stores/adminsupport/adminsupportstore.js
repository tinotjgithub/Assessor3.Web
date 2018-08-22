"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * store class for Admin Support
 */
var AdminSupportStore = (function (_super) {
    __extends(AdminSupportStore, _super);
    /**
     * @constructor
     */
    function AdminSupportStore() {
        var _this = this;
        _super.call(this);
        this._adminSupportSortDetails = new Array();
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.GET_SUPPORT_ADMIN_EXAMINER_LISTS:
                    var _getSupportAdminExaminerListsAction = action;
                    _this._getSupportAdminExaminerLists = _getSupportAdminExaminerListsAction.SupportAdminExaminerList;
                    _this.emit(AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT);
                    break;
                case actionType.ADMIN_SUPPORT_SORT_ACTION:
                    var _sortClickAction = action;
                    var _sortDetails = _sortClickAction.getAdminSupportSortDetails;
                    var examinerSortDetails = {
                        comparerName: _sortDetails.comparerName,
                        sortDirection: enums.SortDirection.Ascending
                    };
                    _this._adminSupportSortDetails.push(examinerSortDetails);
                    for (var i = 0; i < _this._adminSupportSortDetails.length; i++) {
                        if (_sortDetails.comparerName) {
                            _this._adminSupportSortDetails[i].comparerName = _sortDetails.comparerName;
                            _this._adminSupportSortDetails[i].sortDirection = _sortDetails.sortDirection;
                        }
                    }
                    _this.emit(AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT);
                    break;
                case actionType.SUPPORTLOGIN_EXAMINER_SELECTED:
                    var _selectExaminerAction = action;
                    _this._examinerId = _selectExaminerAction.examinerId;
                    if (_this._getSupportAdminExaminerLists.getSupportExaminerList) {
                        _this._getSupportAdminExaminerLists.getSupportExaminerList.map(function (item) {
                            item.isSelected = item.examinerId === _this._examinerId;
                        });
                    }
                    _this.emit(AdminSupportStore.EXAMINER_SELECTED_EVENT);
                    break;
            }
        });
    }
    Object.defineProperty(AdminSupportStore.prototype, "getExaminerID", {
        /* Returns examiner ID */
        get: function () {
            return this._examinerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdminSupportStore.prototype, "getSupportAdminExaminerLists", {
        /**
         * Returns the support admin examiner list
         */
        get: function () {
            return this._getSupportAdminExaminerLists;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdminSupportStore.prototype, "adminSupportSortDetails", {
        /**
         * retrieve the sort deatils for admin support.
         */
        get: function () {
            return this._adminSupportSortDetails;
        },
        enumerable: true,
        configurable: true
    });
    // Events
    AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT = 'GetAdminSupportExaminerListEvent';
    AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT = 'aminsupportsortactionEvent';
    AdminSupportStore.EXAMINER_SELECTED_EVENT = 'Examinerselectedevent';
    return AdminSupportStore;
}(storeBase));
var instance = new AdminSupportStore();
module.exports = { AdminSupportStore: AdminSupportStore, instance: instance };
//# sourceMappingURL=adminsupportstore.js.map
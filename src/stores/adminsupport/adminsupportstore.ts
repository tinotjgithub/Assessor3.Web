import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import enums = require('../../components/utility/enums');
import getSupportAdminExaminerListsAction = require('../../actions/adminsupport/getsupportadminexaminerlistsaction');
import sortClickAction = require('../../actions/adminsupport/adminsupportsortaction');
import adminSupportSortDetails = require('../../components/utility/grid/adminsupportsortdetails');
import selectExaminerAction = require('../../actions/adminsupport/selectexamineraction');

/**
 * store class for Admin Support
 */
class AdminSupportStore extends storeBase {

	// adminsupport data collection
	private _getSupportAdminExaminerLists: SupportAdminExaminerList;
    public _adminSupportSortDetails: Array<adminSupportSortDetails>;
    private _examinerId: number;

	// Events
	public static GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT = 'GetAdminSupportExaminerListEvent';
    public static ADMIN_SUPPORT_SORT_ACTION_EVENT = 'aminsupportsortactionEvent';
    public static EXAMINER_SELECTED_EVENT = 'Examinerselectedevent';

    /**
     * @constructor
     */
	constructor() {
        super();
		this._adminSupportSortDetails = new Array<adminSupportSortDetails>();
		this._dispatchToken = dispatcher.register((action: action) => {
			switch (action.actionType) {
				case actionType.GET_SUPPORT_ADMIN_EXAMINER_LISTS:
					let _getSupportAdminExaminerListsAction: getSupportAdminExaminerListsAction = action as getSupportAdminExaminerListsAction;
					this._getSupportAdminExaminerLists = _getSupportAdminExaminerListsAction.SupportAdminExaminerList;
					this.emit(AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT);
					break;
				case actionType.ADMIN_SUPPORT_SORT_ACTION:
					let _sortClickAction: sortClickAction = (action as sortClickAction);
					let _sortDetails: adminSupportSortDetails = _sortClickAction.getAdminSupportSortDetails;
					let examinerSortDetails: adminSupportSortDetails = {
						comparerName: _sortDetails.comparerName,
						sortDirection: enums.SortDirection.Ascending
					};
					this._adminSupportSortDetails.push(examinerSortDetails);
					for (var i = 0; i < this._adminSupportSortDetails.length; i++) {
						if (_sortDetails.comparerName) {
							this._adminSupportSortDetails[i].comparerName = _sortDetails.comparerName;
							this._adminSupportSortDetails[i].sortDirection = _sortDetails.sortDirection;
						}
					}
					this.emit(AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT);
                    break;
                case actionType.SUPPORTLOGIN_EXAMINER_SELECTED:
                    let _selectExaminerAction: selectExaminerAction = (action as selectExaminerAction);
                    this._examinerId = _selectExaminerAction.examinerId;
                    if (this._getSupportAdminExaminerLists.getSupportExaminerList) {
                        this._getSupportAdminExaminerLists.getSupportExaminerList.map((item: SupportAdminExaminers) => {
                            item.isSelected = item.examinerId === this._examinerId;
                        });
                    }
                    this.emit(AdminSupportStore.EXAMINER_SELECTED_EVENT);
                    break;
			}
		});
    }

    /* Returns examiner ID */
    public get getExaminerID(): number {
        return this._examinerId;
    }

    /**
     * Returns the support admin examiner list
     */
    public get getSupportAdminExaminerLists(): SupportAdminExaminerList {
		return this._getSupportAdminExaminerLists;
	}

	/**
	 * retrieve the sort deatils for admin support.
	 */
	public get adminSupportSortDetails() {
        return this._adminSupportSortDetails;
	}
}

let instance = new AdminSupportStore();
 export = { AdminSupportStore, instance };
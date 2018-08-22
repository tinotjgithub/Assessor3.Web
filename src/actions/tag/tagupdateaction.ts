import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class TagUpdateAction extends dataRetrievalAction {

	private _tagUpdate: TagUpdateReturn;
	private _tagId: number;
	private _markGroupList: Array<Number>;
	private _tagOrder?: number;
	private _markGroupId: number;
	private _markingMode: enums.MarkingMode;

    /**
     * Constructor of tag update action
     * @param success
     * @param json
     */
	constructor(success: boolean, tagId: number, markGroupList: Array<Number>, tagOrder: number,
		markGroupId: number, markingMode: enums.MarkingMode, json?: TagUpdateReturn) {
		super(action.Source.View, actionType.TAG_UPDATE, success);
		this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());

		this._tagId = tagId;
		this._markGroupList = markGroupList;
		this._tagOrder = tagOrder;
		this._tagUpdate = json;
		this._markGroupId = markGroupId;
		this._markingMode = markingMode;
	}

    /**
     * returns the updated tag id.
     */
	public get tagId(): number{
		return this._tagId;
	}

    /**
     * returns the all mark group ids of which the tag id has been updated.
     */
	public get markGroupList(): Array<Number> {
		return this._markGroupList;
	}

    /**
     * returns the current mark group id of which the tag id has been updated.
     */
	public get markGroupId(): number {
		return this._markGroupId;
	}

    /**
     * returns the updated tag order.
     */
	public get tagOrder(): number {
		return this._tagOrder;
	}

	/**
	 * returns the current marking mode id of which the response has been updated.
	 */
	public get markingMode(): enums.MarkingMode {
		return this._markingMode;
	}
}

export = TagUpdateAction;
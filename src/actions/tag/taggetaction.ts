import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class TagGetAction extends dataRetrievalAction {

    private _tagData: TagData;

    /**
     * Constructor of tag get action
     * @param success
     * @param json
     */
    constructor(success: boolean, json?: TagData) {
        super(action.Source.View, actionType.TAG_GET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());

        this._tagData = json;
    }

    /**
     * returns the list of tags
     */
    public get tagData(): Immutable.List<Tag> {
        return this._tagData.tagList;
    }
}

export = TagGetAction;

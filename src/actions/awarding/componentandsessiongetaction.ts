import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import Immutable= require('immutable');

class ComponentAndSessionGetAction extends dataRetrievalAction {
    private _componentAndSessionList: AwardingComponentsAndSessionList;

    constructor(success: boolean, componentAndSessionList: AwardingComponentsAndSessionList) {
        super(action.Source.View, actionType.COMPONENT_AND_SESSION_GET , success);
        this._componentAndSessionList = componentAndSessionList;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }

    public get isSuccess(): boolean{
        return this._componentAndSessionList.success;
    }

    public get componentAndSessionList(): AwardingComponentsAndSessionList{
        return this._componentAndSessionList;
    }
}

export = ComponentAndSessionGetAction;

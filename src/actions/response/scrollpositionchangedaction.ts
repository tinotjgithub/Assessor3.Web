import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class ScrollPositionChangedAction extends dataRetrievalAction {

    // variable for holding current scroll position.
    private _currentScrollPosition: number;
    // variable for checking whether or not to emit the event.
    private _doEmit: boolean;
    // variable for checking whether or not to update the scrollposition.
    private _updateScrollPosition: boolean;

    /**
     * Constructor ScrollPositionChangedAction
     * @param success
     * @param currentScrollPosition
     */
    constructor(success: boolean, currentScrollPosition: number, doEmit: boolean, updateScrollPosition: boolean) {
        super(action.Source.View, actionType.SCROLL_POSITION_CHANGED, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._currentScrollPosition = currentScrollPosition;
        this._doEmit = doEmit;
        this._updateScrollPosition = updateScrollPosition;
    }

    /**
     * This will returns the current scroll position.
     */
    public get currentScrollPosition(): number {
        return this._currentScrollPosition;
    }

    /**
     * This will returns whether or not to emit the event.
     */
    public get doEmit(): boolean {
        return this._doEmit;
    }

    /**
     * This will return whether or not to update the scroll position.
     */
    public get updateScrollPosition(): boolean {
        return this._updateScrollPosition;
    }
}

export = ScrollPositionChangedAction;
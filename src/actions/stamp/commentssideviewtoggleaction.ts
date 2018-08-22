import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class CommentsSideViewToggleAction extends action {

    private _enableSideView: boolean;
    private _disableSideViewOnDevices: boolean;
    private _currentCommentToken: string;

    /**
     * Initializing a new instance for both switching to side view of comments.
     * @param {boolean} enableSideView
     */
    constructor(enableSideView: boolean, currentCommentToken?: string, disableSideViewOnDevices: boolean = false) {
        super(action.Source.View, actionType.COMMENTS_SIDEVIEW_TOGGLE_ACTION);
        this._enableSideView = enableSideView;
        this._currentCommentToken = currentCommentToken;
        this._disableSideViewOnDevices = disableSideViewOnDevices;
    }

    /**
     * Gets a value indicating whether the side view is enabled.
     * @returns
     */
    public get enableSideView(): boolean {
        return this._enableSideView;
    }

    /**
     * Gets a value indicating whether the side view is disabled for devices.
     * @returns
     */
    public get disableSideViewOnDevices(): boolean {
        return this._disableSideViewOnDevices;
    }

    /**
     * Gets a value of current comments clinet token
     * @returns
     */
    public get currentCommentToken(): string {
        return this._currentCommentToken;
    }
}
export = CommentsSideViewToggleAction;

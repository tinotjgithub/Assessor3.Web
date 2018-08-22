import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ZoomAnimationEndAction extends action {
    private _doReRender: boolean;
/**
 * Creates an instance of ZoomAnimationEndAction.
 * @param {boolean} doReRender
 *
 * @memberOf ZoomAnimationEndAction
 */
    constructor(doReRender: boolean) {
        super(action.Source.View, actionType.ZOOM_ANIMATION_END);
        this._doReRender = doReRender;
    }

    /**
     * property to check whether to re-render or not
     *
     * @readonly
     * @type {boolean}
     * @memberOf ZoomAnimationEndAction
     */
    public get doReRender(): boolean {
        return this._doReRender;
    }
}

export = ZoomAnimationEndAction;

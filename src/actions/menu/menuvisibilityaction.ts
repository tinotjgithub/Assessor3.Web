import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for Menu Wrapper Visibility.
 */
class MenuVisibilityAction extends action {

    private _doVisibleMenu: boolean;
    /**
     * @constructor
     */
    constructor(doVisible: boolean) {
        super(action.Source.View, actionType.MENU_VISIBILITY_ACTION);
        this._doVisibleMenu = doVisible;
    }

   /**
    * Get menu visiblity
    */
    public get doVisibleMenu(): boolean {
        return this._doVisibleMenu;
    }
}

export = MenuVisibilityAction;

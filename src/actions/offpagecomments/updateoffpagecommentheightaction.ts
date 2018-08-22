import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UpdateOffPageCommentHeightAction extends action {
    private _panelHeight: number;
    private _panActionType: enums.PanActionType;
    constructor(panelActionType: enums.PanelActionType, panActionType?: enums.PanActionType, height?: number) {
        if (!height) {
            height = 0;
        }
        switch (panelActionType) {
            case enums.PanelActionType.ResizedPanel:
                super(action.Source.View, actionType.UPDATE_OFF_PAGE_COMMENT_HEIGHT);
                this._panActionType = panActionType;
                this._panelHeight = height;
                break;
            default:
                break;
        }
    }

    /**
     * Get Panel Height
     */
    public get panelHeight(): number {
        return this._panelHeight;
    }

    /**
     * get pan action type
     */
    public get panActionType(): enums.PanActionType {
        return this._panActionType;
    }
}
export = UpdateOffPageCommentHeightAction;

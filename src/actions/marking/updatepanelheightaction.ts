import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UpdatePanelHeightAction extends action {
    private _panelHeight: string;
    private _resizePanelType: enums.ResizePanelType;
    private _isOverlapped: boolean;
    private _resizeClassName: string;
    private _panActionType: enums.PanActionType;

    /**
     * Constructor
     * @param type
     * @param width
     * @param className
     * @param previousMarkListWidth
     * @param isPreviousMarkListColumnVisible
     */
    constructor(panelActionType: enums.PanelActionType, panActionType?: enums.PanActionType, height?: string, className?: string,
        resizePanelType?: enums.ResizePanelType, offsetOverlapped?: boolean) {
        if (!height) {
            height = '';
        }
        switch (panelActionType) {
            case enums.PanelActionType.ResizedPanel:
                super(action.Source.View, actionType.PANEL_HEIGHT);
                this._panelHeight = height;
                this._resizeClassName = className;
                this._isOverlapped = offsetOverlapped;
                this._resizePanelType = resizePanelType;
                this._panActionType = panActionType;
                break;
            case enums.PanelActionType.Visiblity:
                super(action.Source.View, actionType.PANEL_VISIBLITY_ACTION);
                break;
            default:
                super(action.Source.View, actionType.SET_RESIZE_CLASSNAME);
                this._resizeClassName = className;
                this._resizePanelType = resizePanelType;
                break;
        }

        let errorText: string = this.auditLog.logContent;
    }

    /**
     * Get panel height.
     */
    public get panelHeight(): string {
        return this._panelHeight;
    }

    /**
     * Get resize classname
     */
    public get resizeClassName(): string {
        return this._resizeClassName;
    }

    /**
     * Get Resizing panel type.
     */
    public get resizePanelType(): enums.ResizePanelType {
        return this._resizePanelType;
    }

    /**
     * Get element offset overlapped.
     */
    public get elementOverlapped(): boolean {
        return this._isOverlapped;
    }

    /**
     * Get pan action type
     */
    public get panActionType(): enums.PanActionType {
        return this._panActionType;
    }
}
export = UpdatePanelHeightAction;
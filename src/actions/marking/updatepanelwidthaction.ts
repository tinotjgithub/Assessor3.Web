import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UpdatePanelWidthAction extends action {
    private _panelWidth: string;
    private _defaultPanelWidth: string;
    private _newDefaultPanelWidth: string;
    private _minimumPanelWidth: string;
    private _resizeClassName: string;
    private _previousMarkListWidth: number;
    private _isPreviousMarkListColumnVisible: boolean;
    private _panActionType: enums.PanActionType;
    private _panelType: enums.ResizePanelType;

    /**
     * Constructor
     * @param type
     * @param width
     * @param className
     * @param previousMarkListWidth
     * @param isPreviousMarkListColumnVisible
     */
    constructor(markSchemePaneltype: enums.markSchemePanelType, width?: string, className?: string, panelType?: enums.ResizePanelType,
        panActionType?: enums.PanActionType, previousMarkListWidth?: number, isPreviousMarkListColumnVisible: boolean = false) {
        if (!width) {
            width = '';
        }
        switch (markSchemePaneltype) {
            case enums.markSchemePanelType.defaultPanel:
                super(action.Source.View, actionType.DEFAULT_PANEL_WIDTH);
                this._defaultPanelWidth = width;
                this._previousMarkListWidth = previousMarkListWidth ? previousMarkListWidth : 0;
                break;
            case enums.markSchemePanelType.resizedPanel:
                super(action.Source.View, actionType.PANEL_WIDTH);
                this._panelWidth = width;
                this._resizeClassName = className;
                this._panActionType = panActionType;
                this._panelType = panelType;
                break;
            case enums.markSchemePanelType.minimumWidthPanel:
                super(action.Source.View, actionType.MINIMUM_PANEL_WIDTH);
                this._minimumPanelWidth = width;
                break;
            case enums.markSchemePanelType.updateDefaultPanel:
                super(action.Source.View, actionType.DEFAULT_PANEL_WIDTH_AFTER_COLUMN_UPDATION);
                this._newDefaultPanelWidth = width;
                this._isPreviousMarkListColumnVisible = isPreviousMarkListColumnVisible;
                break;
            default:
                super(action.Source.View, actionType.PANEL_RESIZE_CLASSNAME);
                this._resizeClassName = className;
                break;
        }

        let errorText: string = this.auditLog.logContent;
    }

    /**
     * Get panel width
     */
    public get panelWidth(): string {
        return this._panelWidth;
    }

    /**
     * Get resize classname
     */
    public get resizeClassName(): string {
        return this._resizeClassName;
    }

    /**
     * Get default panel width
     */
    public get defaultPanelWidth(): string {
        return this._defaultPanelWidth;
    }

    /**
     * Get new default panel width
     */
    public get defaultPanelWidthAfterColumnUpdate(): string {
        return this._newDefaultPanelWidth;
    }

    /**
     * Get minimum panel width
     */
    public get minimumPanelWidth(): string {
        return this._minimumPanelWidth;
    }

    /**
     * Get previous marklist column width
     */
    public get previousMarkListWidth(): number {
        return this._previousMarkListWidth;
    }

    /**
     * Get previous marklist column visible or not
     */
    public get previousMarkListColumnVisible(): boolean {
        return this._isPreviousMarkListColumnVisible;
    }

   /** 
    * Returns pan action type   
    * @readonly
    * @type {enums.PanActionType}
    * @memberof UpdatePanelWidthAction
    */
    public get panActionType() : enums.PanActionType {
        return this._panActionType;
    }

   /**
    * Returns panel type
    * @readonly
    * @type {enums.ResizePanelType}
    * @memberof UpdatePanelWidthAction
    */
    public get panelType() : enums.ResizePanelType {
        return this._panelType;
    }
}
export = UpdatePanelWidthAction;
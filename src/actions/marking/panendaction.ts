import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class PanEndAction extends action {
    private _elementId: string;
    private _xPos: number;
    private _yPos: number;
    private _panSource: enums.PanSource;
    private _stampId: number;
    private _isAnnotationOverlapped: boolean;
    private _isAnnotationPlacedInGreyArea: boolean;

    /**
     * Constructor
     * @param xPos
     * @param yPos
     * @param elementId
     * @param panSource
     * @param isAnnotationOverlapped
     * @param isAnnotationPlacedInGreyArea
     */
    constructor(stampId: number, xPos: number, yPos: number, elementId: string, panSource: enums.PanSource,
        isAnnotationOverlapped: boolean,
        isAnnotationPlacedInGreyArea: boolean) {
        super(action.Source.View, actionType.PAN_END);
        this._elementId = elementId;
        this._xPos = xPos;
        this._yPos = yPos;
        this._panSource = panSource;
        this._stampId = stampId;
        this._isAnnotationOverlapped = isAnnotationOverlapped;
        this._isAnnotationPlacedInGreyArea = isAnnotationPlacedInGreyArea;
        this.auditLog.logContent = this.auditLog.logContent
            .replace('{0}', elementId);
    }

    /**
     * Get element Id over touch end happened.
     */
    public get elementId(): string {
        return this._elementId;
    }

    public get xPos(): number {
        return this._xPos;
    }

    public get yPos(): number {
        return this._yPos;
    }

    public get panSource(): enums.PanSource {
        return this._panSource;
    }

    public get stampId(): number {
        return this._stampId;
    }

    public get isAnnotationOverlapped(): boolean {
        return this._isAnnotationOverlapped;
    }

    public get isAnnotationPlacedInGreyArea(): boolean {
        return this._isAnnotationPlacedInGreyArea;
    }
}

export = PanEndAction;
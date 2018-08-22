import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class UpdateFavoriteStampCollectionAction extends action {
    private _favoriteStampId: number;
    private _favoriteStampActionType: enums.FavoriteStampActionType;
    private _favoriteStampList: Immutable.List<number>;
    private _insertedOverStampId: number;

    /**
     * Constructor
     * @param favoriteStampActionType
     * @param favoriteStampId
     * @param addFavoriteStampList
     */
    constructor(favoriteStampActionType: enums.FavoriteStampActionType,
                addFavoriteStampId: number,
                addFavoriteStampList?: Immutable.List<number>,
                insertedOverStampId?: number) {
        super(action.Source.View, actionType.FAVORITE_STAMP_UPDATED);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stampId}/g,
            addFavoriteStampId !== undefined
                ? addFavoriteStampId.toString() : addFavoriteStampList.toArray().toString());
        this._favoriteStampId = addFavoriteStampId;
        this._favoriteStampActionType = favoriteStampActionType;
        this._favoriteStampList = addFavoriteStampList;
        this._insertedOverStampId = insertedOverStampId;
    }

    /**
     * Get the favorite stamp id for adding or removing to/from favorite tool bar
     */
    public get getFavoriteStampId(): number {
        return this._favoriteStampId;
    }

    /**
     * Get the favorite stamp action type
     */
    public get getFavoriteStampActionType(): enums.FavoriteStampActionType {
        return this._favoriteStampActionType;
    }

    /**
     * Get the favorite stamp list from user option
     */
    public get getFavoriteStampListFromUserOption(): Immutable.List<number> {
        return this._favoriteStampList;
    }

    public get getInsertedOverStampId(): number {
        return this._insertedOverStampId;
    }
}

export = UpdateFavoriteStampCollectionAction;
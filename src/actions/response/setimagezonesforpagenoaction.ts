import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');

/**
 * Action class for setting image zones against Page number for mark this page functionality
 */
class SetImageZonesForPageNoAction extends action {

    private _imageZones: Immutable.List<ImageZone>;
    private _linkedAnnotations: annotation[];

    /**
     * constructor
     * @param imageZones
     */
    constructor(imageZones: Immutable.List<ImageZone>, linkedAnnotations: annotation[]) {
        super(action.Source.View, actionType.SET_IMAGE_ZONES_FOR_PAGE_NO);
        this._imageZones = imageZones;
        this._linkedAnnotations = linkedAnnotations;
    }

    /**
     * Returns image zone list against page number
     */
    public get imageZones(): any {
        return this._imageZones;
    }

    /**
     * Returns image zone list against page number
     */
    public get linkedAnnotaion(): any {
        return this._linkedAnnotations;
    }
}

export = SetImageZonesForPageNoAction;

import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class ResponseImageRotatedAction extends action {

    // Holds a value indicating any of the respones images have
    // rotated.
    private _hasRotatedImages: boolean;
    private _rotatedImages: string[];

    /**
     * Constructor ResponseImageRotatedAction
     * @param hasRotatedImages
     */
    constructor(hasRotatedImages: boolean, rotatedImages: string[]) {
        super(action.Source.View, actionType.RESPONSE_IMAGE_ROTATED_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
        this._hasRotatedImages = hasRotatedImages;
        this._rotatedImages = rotatedImages;
    }

    /**
     * Get a value indicating whether response has been rortated
     * @returns
     */
    public get hasResponseImageRotated(): boolean {
        return this._hasRotatedImages;
    }

    public get getRotatedImages(): string[] {
        return this._rotatedImages;
    }

}
export = ResponseImageRotatedAction;

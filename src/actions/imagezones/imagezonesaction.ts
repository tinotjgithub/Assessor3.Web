import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import enums = require('../../components/utility/enums');

class ImageZoneAction extends dataRetrievalAction {
    /**
     * holds list of imagezone list
     */
    private _imageZoneList: ImageZoneList;
    private _originalMarkingMethod: enums.MarkingMethod;
    private _questionPaperId: number;

    /**
     * @Constructor.
     * @param {boolean} success
     * @param {any} imageZoneList
     * @param {enums.MarkingMethod} originalMarkingMethod
     */
    constructor(success: boolean, imageZoneList: any, originalMarkingMethod: enums.MarkingMethod, questionPaperId: number) {
        super(action.Source.View, actionType.IMAGEZONE_LOAD, success);
        // Map the collection
        this._imageZoneList = imageZoneList;
        this._originalMarkingMethod = originalMarkingMethod;
        this._questionPaperId = questionPaperId;
    }

    /**
     * Returns the list of image zones associated to the selected QIG.
     * @returns
     */
    public get imageZoneList() {
        return this._imageZoneList;
    }

    /**
     * Returns the originalMarkingMethod.
     * @returns
     */
    public get originalMarkingMethod() {
        return this._originalMarkingMethod;
    }

    /**
     * Returns the questionpaperId
     */
    public get questionPaperId() {
        return this._questionPaperId;
    }
}

export = ImageZoneAction;
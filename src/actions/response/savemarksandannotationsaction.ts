import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import saveMarksAndAnnotationsReturn = require('../../stores/marking/typings/savemarksandannotationsreturn');
import Immutable = require('immutable');


/**
 * Class for save marks and Annotations action.
 */
class SaveMarksAndAnnotationsAction extends dataRetrievalAction {

    private _saveMarksAndAnnotationsData: saveMarksAndAnnotationsReturn;
    private _markGroupId: number = 0;
    private _marksAndAnnotations: MarksAndAnnotationsToReturn;
    private _markSchemeGroupIdKeys: Array<string>;
    private _saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint;
    private _dataServiceRequestErrorType: enums.DataServiceRequestErrorType;
    private _isWholeResponse: boolean;
    private _hasComplexOptionality: boolean;

    /**
     * Constructor SaveMarksAndAnnotationsAction
     * @param data
     * @param markGroupId
     * @param saveMarksAndAnnotationTriggeringPoint
     * @param success
     * @param dataServiceRequestErrorType
     */
    constructor(data: saveMarksAndAnnotationsReturn,
        markGroupId: number,
        saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint,
        success: boolean,
        dataServiceRequestErrorType: enums.DataServiceRequestErrorType,
        isWholeResponse: boolean,
        hasComplexOptionality: boolean) {

        super(action.Source.View, actionType.SAVE_MARKS_AND_ANNOTATIONS, success);
        this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        this._dataServiceRequestErrorType = dataServiceRequestErrorType;
        this._markGroupId = markGroupId;
        this._isWholeResponse = isWholeResponse;
        if (data && success) {
            this._saveMarksAndAnnotationsData = data;
            if (this._saveMarksAndAnnotationsData.updatedMarkAnnotationDetails) {
                this._markSchemeGroupIdKeys = Object.keys(data.updatedMarkAnnotationDetails);
                // for multi qig functionality we should multiple data structures against same key we have to change the
                // current data structure at that time.
                this._markSchemeGroupIdKeys.map((markSchemeGroupId: string) => {
                    this._marksAndAnnotations = data.updatedMarkAnnotationDetails[parseInt(markSchemeGroupId)];
                });
            }
        }

        this._hasComplexOptionality = hasComplexOptionality;

        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/g, this.markGroupId.toString()).
                                                                          replace(/{success}/g, success.toString());
    }

   /**
    *  returns the return data loaded from server.
    */
    public get saveMarksAndAnnotationsData(): saveMarksAndAnnotationsReturn {
        return this._saveMarksAndAnnotationsData;
    }

   /**
    * marks and annotations list from the return data.
    */
    public get marksAndAnnotations(): MarksAndAnnotationsToReturn {
        return this._marksAndAnnotations;
    }

   /**
    * returns the markGroupId
    */
    public get markGroupId(): number {
        return this._markGroupId;
    }

   /**
    * returns the saveMarksAndAnnotationTriggeringPoint
    */
    public get saveMarksAndAnnotationTriggeringPoint(): enums.SaveMarksAndAnnotationsProcessingTriggerPoint {
        return this._saveMarksAndAnnotationTriggeringPoint;
    }

   /**
    * returns the dataServiceRequestErrorType
    */
    public get dataServiceRequestErrorType(): enums.DataServiceRequestErrorType {
        return this._dataServiceRequestErrorType;
    }

   /**
    * returns the whole response flag
    */
    public get isWholeResponse(): boolean {
        return this._isWholeResponse;
    }

   /**
    * returns Complex optionality cc
    */
    public get hasComplexOptionality(): boolean {
        return this._hasComplexOptionality;
    }
}

export = SaveMarksAndAnnotationsAction;
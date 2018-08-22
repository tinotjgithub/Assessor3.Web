import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import configurableCharacteristicsData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import markerProgressData = require('../../stores/worklist/typings/markerprogressdata');
import actionType = require('../base/actiontypes');
import markerinformation = require('../../stores/markerinformation/typings/markerinformation');

class WorklistInitialisationAction extends action {

    private _markSchemeStructureData: MarkSchemeStructure;
    private _configurableCharacteristicData: configurableCharacteristicsData;
    private _markerProgressData: markerProgressData;
    private _markerinformationData: markerinformation;

    /**
     * @Constructor
     * @param markSchemeStructureData
     * @param ccData
     * @param markingProgressData
     */
    constructor(markSchemeStructureData: MarkSchemeStructure, ccData: configurableCharacteristicsData,
        markerInformationData: markerinformation, markingProgressData: markerProgressData) {
        super(action.Source.View, actionType.WORKLIST_INITIALISATION_STARTED);
        this._markSchemeStructureData = markSchemeStructureData;
        this._configurableCharacteristicData = ccData;
        this._markerProgressData = markingProgressData;
        this._markerinformationData = markerInformationData;
    }

    public get markSchemeStuctureData(): MarkSchemeStructure {
        return this._markSchemeStructureData;
    }

    public get configurableCharacteristicData(): configurableCharacteristicsData {
        return this._configurableCharacteristicData;
    }

    public get markerProgressData(): markerProgressData {
        return this._markerProgressData;
    }

    public get markerInformationData(): markerinformation {
        return this._markerinformationData;
    }
}

export = WorklistInitialisationAction;
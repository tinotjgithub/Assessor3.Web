import configurableCharacteristicsAction = require('../../actions/configurablecharacteristics/configurablecharacteristicsaction');
import configurableCharacteristicsData = require('./typings/configurablecharacteristicsdata');
import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import enums = require('../../components/utility/enums');
import worklistinitialisationaction = require('../../actions/worklist/worklistinitialisationaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');

/**
 * Class for Configurable Characteristics Store
 */
class ConfigurableCharacteristicsStore extends storeBase {

    private success: boolean;
    // MarkSchemeGroup set event
    public static MARKSCHEME_GROUP_CC_GET = 'MarkSchemGroupGet';
    public static EXAM_BODY_CC_GET = 'ExamBodyCCGet';
    private examBodyCCData: configurableCharacteristicsData;
    private markSchemeGroupCCData: configurableCharacteristicsData;
    private examBodyCCLoaded: boolean;
    private _ccLoadedForMarkSchemeGroupId: number = 0;
    private _operationMode: enums.MarkerOperationMode = enums.MarkerOperationMode.Marking;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            if (action.actionType === actionType.CC) {
                this.success = (action as configurableCharacteristicsAction).success;
                if (this.success) {
                    // Depending on the CC level passed-in, different objects in the store gets filled in
                    switch ((action as configurableCharacteristicsAction).getCCLevel) {
                        case enums.ConfigurableCharacteristicLevel.ExamBody:
                            this.examBodyCCLoaded = true;
                            this.examBodyCCData = (action as configurableCharacteristicsAction).getConfigurableCharacteristics;
                            this.emit(ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET);
                            break;
                        case enums.ConfigurableCharacteristicLevel.MarkSchemeGroup:
                            let _configurableCharacteristicsAction = (action as configurableCharacteristicsAction);
                            this.markSchemeGroupCCData = _configurableCharacteristicsAction.getConfigurableCharacteristics;
                            this._ccLoadedForMarkSchemeGroupId = _configurableCharacteristicsAction.getCCLoadedForMarkSchemeGroupId;
                            this.emit(ConfigurableCharacteristicsStore.MARKSCHEME_GROUP_CC_GET);
                            break;
                        default:
                            break;
                    }
                }
            }

            if (action.actionType === actionType.WORKLIST_INITIALISATION_STARTED) {

                let result = (action as worklistinitialisationaction).configurableCharacteristicData;
                if (result.configurableCharacteristics !== undefined) {
                    this.markSchemeGroupCCData = result;
                }
            }
            // Current operation mode is stored to refer in the ConfigurableCharacteristicsHelper to avoid circular reference
            if (action.actionType === actionType.MARKER_OPERATION_MODE_CHANGED_ACTION) {
                let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                this._operationMode = markerOperationMode.operationMode;
            }
        });
    }

    /**
     * Get ExamBody Configurable Characteristics Data
     */
    public get getExamBodyConfigurableCharacteristicsData(): configurableCharacteristicsData {
        return this.examBodyCCData;
    }

    /**
     * Get MarkScheme Configurable Characteristics Data
     */
    public get getMarkSchemeGroupConfigurableCharacteristicsData(): configurableCharacteristicsData {
        return this.markSchemeGroupCCData;
    }

    /**
     * Check if isExamBodyCCLoaded
     */
    public get isExamBodyCCLoaded(): boolean {
        return this.examBodyCCLoaded;
    }

    /**
     * Get the mark Scheme Group Id for the cc
     */
    public get ccLoadedForMarkSchemeGroupId(): number {
        return this._ccLoadedForMarkSchemeGroupId;
    }


    /**
     * Returns the current operation mode.
     * we are using this in this store to refer in configurablecharacterstichelper and to avoid circular depenedency
     */
    public get currentOperationMode(): enums.MarkerOperationMode {
        return this._operationMode;
    }
}

let instance = new ConfigurableCharacteristicsStore();
export = { ConfigurableCharacteristicsStore, instance };
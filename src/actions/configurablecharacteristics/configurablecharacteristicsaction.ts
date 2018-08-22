import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import configurableCharacteristicsData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import enums = require('../../components/utility/enums');

class ConfigurableCharacteristicsAction extends dataRetrievalAction {

    private configurableCharacteristics: configurableCharacteristicsData;
    private ccLevel: enums.ConfigurableCharacteristicLevel;
    private ccLoadedForMarkSchemeGroupId: number = 0;
    private _isFromHistory: boolean = false;

    /**
     * Constructor
     * @param success
     * @param ccLevel
     * @param configurableCharacteristics
     * @param isFromHistory
     */
    constructor(success: boolean,
                ccLevel: enums.ConfigurableCharacteristicLevel,
                markSchemeGroupId: number,
                configurableCharacteristics: configurableCharacteristicsData) {

        super(action.Source.View, actionType.CC, success);

        this.configurableCharacteristics = configurableCharacteristics;
        this.ccLevel = ccLevel;
        this.ccLoadedForMarkSchemeGroupId = markSchemeGroupId;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    /**
     * returns the Configurable Characteristics Data
     */
    get getConfigurableCharacteristics(): configurableCharacteristicsData {
        return this.configurableCharacteristics;
    }

	/**
	 * returns the Configurable Characteristic Level
	 */
    get getCCLevel(): enums.ConfigurableCharacteristicLevel {
        return this.ccLevel;
    }

    /**
     * Get the mark Scheme Group Id for the cc
     */
    get getCCLoadedForMarkSchemeGroupId(): number {
        return this.ccLoadedForMarkSchemeGroupId;
    }
}

export = ConfigurableCharacteristicsAction;
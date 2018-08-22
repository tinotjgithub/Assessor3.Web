import configurableCharacteristicsStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import configurableCharacteristicsData = require('../../stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import configurableCharacteristicsNames = require('./configurablecharacteristicsnames');
import enums = require('../../components/utility/enums');
import xmlHelper = require('../generic/xmlhelper');

/**
 * CC Utility class
 */
class ConfigurableCharacteristicsHelper {
    /**
     * Get's the configurable characteristic value
     * @param ccName
     */
    public static getCharacteristicValue(ccName: string, markschemeGroupId: number = 0): string {
        let ccCollection: configurableCharacteristicsData;
        let ccValueFound = '';

        // Get value from Exam Body
        ccCollection = configurableCharacteristicsStore.instance.getExamBodyConfigurableCharacteristicsData;

        // In Team management mode we dont need to consider the value of these CC's
        // configurableCharacteristicsStore is used to avoid cyclic dependency
        if (configurableCharacteristicsStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
            && (ccName === configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks ||
            ccName === configurableCharacteristicsNames.AutomaticQualityFeedback)) {
            ccValueFound = 'true';
            return ccValueFound;
        }

        if (ccCollection !== undefined && ccCollection != null && ccCollection.configurableCharacteristics != null) {
            ccCollection.configurableCharacteristics.map((cc: any) => {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase()
                    && (markschemeGroupId === 0 ? true : cc.markSchemeGroupID === markschemeGroupId)) {
                    ccValueFound = cc.ccValue;
                }
            });
        }

        // If value not available from Exam Body get the list from Mark Scheme Group
        ccCollection = configurableCharacteristicsStore.instance.getMarkSchemeGroupConfigurableCharacteristicsData;
        if (ccCollection !== undefined && ccCollection != null && ccCollection.configurableCharacteristics != null) {
            ccCollection.configurableCharacteristics.map((cc: any) => {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase()
                    && (markschemeGroupId === 0 ? true : cc.markSchemeGroupID === markschemeGroupId)) {
                    ccValueFound = cc.ccValue;
                }
            });
        }

        return ccValueFound;
    }

    /**
     * Get's the configurable characteristic value specific to the exam session.
     * @param ccName
     * @param examSessionId
     */
    public static getExamSessionCCValue(ccName: string, examSessionId: number): string {
        let ccCollection: configurableCharacteristicsData;
        let ccValueFound = '';

        ccCollection = configurableCharacteristicsStore.instance.getMarkSchemeGroupConfigurableCharacteristicsData;

        if (ccCollection && ccCollection.configurableCharacteristics) {
            ccCollection.configurableCharacteristics.map((cc: any) => {
                if (cc.ccName.toLowerCase() === ccName.toLowerCase() && cc.examSessionID === examSessionId) {
                    ccValueFound = cc.ccValue;
                }
            });
        }

        return ccValueFound;
    }

    /**
     * Checking whether the response marking is enabled my mark by annotation.
     * @param {boolean} isAtypical
     * @returns
     */
    public static isMarkByAnnotation(atypicalStatus: enums.AtypicalStatus,
        markschemeGroupId: number = 0): boolean {
        let markByAnnotationCCOn = this.getCharacteristicValue(
            configurableCharacteristicsNames.MarkbyAnnotation, markschemeGroupId) === 'true';

        if (atypicalStatus === enums.AtypicalStatus.AtypicalUnscannable) {
            return false;
        }
        return markByAnnotationCCOn;
	}

    /**
     * Gets the marking instruction cc value
     */
    public static get markingInstructionCCValue(): number {

        let markingInstructionCC = this.getCharacteristicValue('MarkingInstructions');

        let xmlHelperObj = new xmlHelper(markingInstructionCC);
        let ccValue = xmlHelperObj.getNodeValueByName('Level');
        if (ccValue === 'Question Paper') {
            return enums.MarkingInstructionCC.QuestionPaper;
        } else {
            return enums.MarkingInstructionCC.QIG;
        }
    }
}

export = ConfigurableCharacteristicsHelper;
import enums = require('../../../components/utility/enums');

/**
 * interface for Configurable Characteristics information
 */

interface ConfigurableCharacteristicData {
    ccName: string;
    ccValue: string;
    valueType: enums.ConfigurableCharacteristics;
    markSchemeGroupId: number;
    questionPaperId: number;
    examSessionId: number;
}

export = ConfigurableCharacteristicData;

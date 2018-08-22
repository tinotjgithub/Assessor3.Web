import ConfigurableCharacteristic = require('./configurablecharacteristic');
/**
 * interface for Configurable Characteristics Collection
 */

interface ConfigurableCharacteristicsData {
    configurableCharacteristics: Immutable.List<Immutable.Record.IRecord<ConfigurableCharacteristic>>;
}

export = ConfigurableCharacteristicsData;
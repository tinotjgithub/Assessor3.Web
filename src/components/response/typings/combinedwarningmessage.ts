import enums = require('../../utility/enums');
import warning = require('./warning');

class CombinedWarningMessage {
    public header: string;
    public content: string;
    public primaryButton: string;
    public secondaryButton: string;
    public responseNavigateFailureReasons: Array<warning>;
    public warningType: enums.WarningType;
}
export = CombinedWarningMessage;
import enums = require('../../utility/enums');

class Warning {
    public warning: enums.ResponseNavigateFailureReason;
    public priority: enums.ResponseWarningPriority;
    public message: string;
    public id: string;
}
export = Warning;
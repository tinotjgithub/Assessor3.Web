import qigValidationResultBase = require('./qigvalidationresultbase');

class QigValidationResult extends qigValidationResultBase {
    public openResponsesCount: number;
    public statusColourClass: string;
    public isSimulationMode: boolean = false;
    public isInStandardisationMode: boolean = false;
}

export = QigValidationResult;
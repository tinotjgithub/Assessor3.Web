import action = require('./action');
import actionAuditLogInfo = require('./auditloginfo/actionauditloginfo');

/**
 * Data retrieval base action class
 */
class DataRetrievalAction extends action {

    private _success: boolean;
    private statusCode: number;
    private errorMessage: string;

    /**
     * Constructor
     * @param source
     * @param actionType
     * @param success
     * @param errorJsonObject
     */
    constructor(source: action.Source,
        actionType: string,
        success: boolean,
        errorJsonObject?: any) {

        super(source, actionType);
        this._success = success;

        //Check if error response is not undefined
        if (errorJsonObject !== undefined && errorJsonObject !== 'undefined' && errorJsonObject.toString().length > 0) {
            this.parseError(errorJsonObject);
        }
    }

    get success(): boolean {
        return this._success;
    }

    get getStatusCode(): number {
        return this.statusCode;
    }

    get getErrorMessage(): string {
        return this.errorMessage;
    }

    /**
     * To parse error
     * @param json
     */
    private parseError(json: any): void {
        let xhr = (json !== undefined && json.toString().length > 0) ? json.xhr : undefined;

        if (xhr !== undefined && xhr !== 'undefined') {
            this.statusCode = xhr.status;
            this.errorMessage = (xhr.responseJSON !== undefined) ? xhr.responseJSON.error : '';
        } else {
            this.statusCode = 0;
            this.errorMessage = '';
        }
    }
}

export = DataRetrievalAction;
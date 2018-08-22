import enums = require('../../components/utility/enums');

/**
 * Holds the data service failure reason
 */
class ServiceErrorReturn {

    // holds the xhr error details
    private _xhr: any;

    // holds the xhr error status
    private _status: any;

    // holds the xhr error details
    private _error: string;

    // Holds a value indicating to handle the exception
    private _handleException: boolean;

    /**
     * Initialising instance of service error return.
     * @param {any} xhr
     * @param {any} status
     * @param {string} error
     */
    constructor(xhr: any, status: any, error: string, handleException: boolean) {

        this._xhr = xhr;
        this._status = status;
        this._error = error;
        this._handleException = handleException;
    }

    /**
     * Gets a value indicating the dataservice error
     * @returns
     */
    public get xhr(): any {
        return this._xhr;
    }

   /**
    * Gets a value indicating the dataservice error status
    * @returns
    */
    public get status(): any {
        return this._status;
    }

   /**
    * Gets a value indicating the dataservice error
    * @returns
    */
    public get error(): string {
        return this._error;
    }

   /**
    * Gets a value indicating the dataservice error
    * @returns
    */
    public get errorType(): enums.DataServiceRequestErrorType {
        // holds the error type
        let dataServiceRequestErrorType: enums.DataServiceRequestErrorType;

        if (!this._xhr) {
            dataServiceRequestErrorType = enums.DataServiceRequestErrorType.Skipped;
        } else {
            switch (this._xhr.status) {
                case 401:
                    dataServiceRequestErrorType = enums.DataServiceRequestErrorType.Unauthorized;
                    break;
                case 0:
                    dataServiceRequestErrorType = enums.DataServiceRequestErrorType.NetworkError;
                    break;
                default:
                    dataServiceRequestErrorType = enums.DataServiceRequestErrorType.GenericError;
                    break;
            }
        }
        return dataServiceRequestErrorType;
    }

    /**
     * Gets a value indicating to handle the exception.
     * @returns
     */
    public get handleException(): boolean {
        return this._handleException;
    }
}

export = ServiceErrorReturn;
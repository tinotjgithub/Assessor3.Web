import enums = require('../../components/utility/enums');

/**
 * Holds the data service failure reason
 */
class ConcurrentSessionErrorReturn {


    // holds the xhr error details
    private _error: string;

    /**
     * Initialising instance of service error return.
     * 
     * @param {string} error
     */
    constructor( error: string) {
     this._error = error;
  }

    /**
     * Gets a value indicating the dataservice error
     * @returns
     */
    public get error(): string {
        return this._error;
    }
}

export = ConcurrentSessionErrorReturn;
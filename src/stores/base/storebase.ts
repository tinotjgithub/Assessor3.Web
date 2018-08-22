import Events = require('events');

/**
 * Base class for Store
 */
class StoreBase extends Events.EventEmitter {

    protected _dispatchToken: string;

    /**
     * @constructor
     */
    constructor() {
        super();
    }

   /**
    *  gets the dispatch token
    */
    public get dispatchToken(): string {
        return this._dispatchToken;
    }

    /**
     *  sets the dispatch token variable
     */
    public set dispatchToken(dispatchToken: string) {
        this._dispatchToken = dispatchToken;
    }
}

export = StoreBase;
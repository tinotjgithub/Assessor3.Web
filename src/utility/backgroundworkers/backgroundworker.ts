import enums = require('../../components/utility/enums');

/**
 * Class for handling background server calls
 */
class BackgroundWorker {

    // The background worker
    private _worker: Worker;

    // The source URL
    private _source: string;

    // The background worker type
    private _backgroundWorkerType: enums.BackgroundWorkers;

   /**
    * Returns the background worker type for this instance
    */
    public get backgroundWorkerType(): enums.BackgroundWorkers {
        return this._backgroundWorkerType;
    }

    /**
     * The constructor method
     * @param source
     * @param autoStart
     */
    constructor(backgroundWorkerType: enums.BackgroundWorkers, autoStart: boolean = false) {
        this._source = 'build\\generated\\synchronisers\\backgroundworkersynchroniser.js';
        this._backgroundWorkerType = backgroundWorkerType;

        if (autoStart) {
            this.initialise();
        }
    }

    /**
     * On starting the background worker
     */
    public start(): void {
        if (this._worker != null) {
            this._worker.postMessage('start');
        }
    }

    /**
     * On pausing the background worker
     */
    public pause(): void {
        if (this._worker != null) {
            this._worker.postMessage('pause');
        }
    }

    /**
     * On stopping the background worker
     */
    public stop(): void {
        this._worker.terminate();
    }

    /**
     * Method invoked on passing parameter
     * @param parameters
     */
    public passParameters(parameters: any): void {
        // Stop the previous job, if any
        if (this._worker != null) {
            this._worker.terminate();
        }

        // Start again
        this.initialise();

        // Pass new parameters
        this._worker.postMessage(parameters);
    }

    /**
     * Initialising the background worker
     */
    private initialise(): void {
        this._worker = new Worker(this._source);
        this._worker.addEventListener('message', this.onMessage.bind(this), false);
        this._worker.addEventListener('error', this.onError.bind(this), false);
    }

    /**
     * On message even listener method for the background worker
     * @param e
     */
    private onMessage(e: MessageEvent) {
        /* tslint:disable:no-empty */
    }

    /**
     * On error even listener method for the background worker
     * @param e
     */
    private onError(e: ErrorEvent) {
        /* tslint:disable:no-empty */
    }
}

export = BackgroundWorker;
"use strict";
/**
 * Class for handling background server calls
 */
var BackgroundWorker = (function () {
    /**
     * The constructor method
     * @param source
     * @param autoStart
     */
    function BackgroundWorker(backgroundWorkerType, autoStart) {
        if (autoStart === void 0) { autoStart = false; }
        this._source = 'build\\generated\\synchronisers\\backgroundworkersynchroniser.js';
        this._backgroundWorkerType = backgroundWorkerType;
        if (autoStart) {
            this.initialise();
        }
    }
    Object.defineProperty(BackgroundWorker.prototype, "backgroundWorkerType", {
        /**
         * Returns the background worker type for this instance
         */
        get: function () {
            return this._backgroundWorkerType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * On starting the background worker
     */
    BackgroundWorker.prototype.start = function () {
        if (this._worker != null) {
            this._worker.postMessage('start');
        }
    };
    /**
     * On pausing the background worker
     */
    BackgroundWorker.prototype.pause = function () {
        if (this._worker != null) {
            this._worker.postMessage('pause');
        }
    };
    /**
     * On stopping the background worker
     */
    BackgroundWorker.prototype.stop = function () {
        this._worker.terminate();
    };
    /**
     * Method invoked on passing parameter
     * @param parameters
     */
    BackgroundWorker.prototype.passParameters = function (parameters) {
        // Stop the previous job, if any
        if (this._worker != null) {
            this._worker.terminate();
        }
        // Start again
        this.initialise();
        // Pass new parameters
        this._worker.postMessage(parameters);
    };
    /**
     * Initialising the background worker
     */
    BackgroundWorker.prototype.initialise = function () {
        this._worker = new Worker(this._source);
        this._worker.addEventListener('message', this.onMessage.bind(this), false);
        this._worker.addEventListener('error', this.onError.bind(this), false);
    };
    /**
     * On message even listener method for the background worker
     * @param e
     */
    BackgroundWorker.prototype.onMessage = function (e) {
        /* tslint:disable:no-empty */
    };
    /**
     * On error even listener method for the background worker
     * @param e
     */
    BackgroundWorker.prototype.onError = function (e) {
        /* tslint:disable:no-empty */
    };
    return BackgroundWorker;
}());
module.exports = BackgroundWorker;
//# sourceMappingURL=backgroundworker.js.map
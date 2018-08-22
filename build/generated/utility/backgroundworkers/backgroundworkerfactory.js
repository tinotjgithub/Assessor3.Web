"use strict";
var backgroundWorker = require('./backgroundworker');
/**
 * Class for handling background server calls
 */
var BackgroundWorkerFactory = (function () {
    function BackgroundWorkerFactory() {
    }
    Object.defineProperty(BackgroundWorkerFactory.prototype, "backgroundWorkerList", {
        /*
        * Returns the initialised list of background workers
        */
        get: function () {
            return this.initialisedBackgroundWorkerList;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialises the required instance of background worker
     * @param backgroundWorkerType
     */
    BackgroundWorkerFactory.prototype.initialiseBackgroundWorker = function (backgroundWorkerType) {
        var backgroundWorkerInstance;
        if (backgroundWorkerType !== undefined) {
            backgroundWorkerInstance = new backgroundWorker(backgroundWorkerType);
            if (this.initialisedBackgroundWorkerList === undefined) {
                this.initialisedBackgroundWorkerList = [];
            }
            this.initialisedBackgroundWorkerList.push(backgroundWorkerInstance);
        }
        return backgroundWorkerInstance;
    };
    /**
     * Method which returns back the background worker instance if it exists already
     * @param backgroundWorkerType
     */
    BackgroundWorkerFactory.prototype.getBackgroundWorker = function (backgroundWorkerType) {
        var backgroundWorkerInstance;
        if (this.initialisedBackgroundWorkerList !== undefined) {
            backgroundWorkerInstance = this.initialisedBackgroundWorkerList.map(function (backgroundWorker) {
                if (backgroundWorker.backgroundWorkerType === backgroundWorkerType) {
                    return backgroundWorker;
                }
            });
        }
        return backgroundWorkerInstance !== undefined ? backgroundWorkerInstance[0] : undefined;
    };
    /**
     * Method which clears the background worker queue for the specified type
     */
    BackgroundWorkerFactory.prototype.clearBackgroundWorkerQueue = function (backgroundWorkerType) {
        if (this.initialisedBackgroundWorkerList !== undefined) {
            this.initialisedBackgroundWorkerList.map(function (worker) {
                worker.stop();
            });
            this.initialisedBackgroundWorkerList = [];
        }
    };
    return BackgroundWorkerFactory;
}());
var instance = new BackgroundWorkerFactory();
module.exports = { instance: instance, BackgroundWorkerFactory: BackgroundWorkerFactory };
//# sourceMappingURL=backgroundworkerfactory.js.map
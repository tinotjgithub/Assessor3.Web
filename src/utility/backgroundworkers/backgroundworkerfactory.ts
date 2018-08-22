import backgroundWorker = require('./backgroundworker');
import enums = require('../../components/utility/enums');
import immutable = require('immutable');

/**
 * Class for handling background server calls
 */
class BackgroundWorkerFactory {

    // Holds the initialised list of background workers
    private initialisedBackgroundWorkerList: Array<backgroundWorker>;

    /*
    * Returns the initialised list of background workers
    */
    public get backgroundWorkerList(): Array<backgroundWorker> {
        return this.initialisedBackgroundWorkerList;
    }

    /**
     * Initialises the required instance of background worker
     * @param backgroundWorkerType
     */
    public initialiseBackgroundWorker(backgroundWorkerType: enums.BackgroundWorkers): backgroundWorker {
        let backgroundWorkerInstance: backgroundWorker;
        if (backgroundWorkerType !== undefined) {
            backgroundWorkerInstance = new backgroundWorker(backgroundWorkerType);
            if (this.initialisedBackgroundWorkerList === undefined) {
                this.initialisedBackgroundWorkerList = [];
            }
            this.initialisedBackgroundWorkerList.push(backgroundWorkerInstance);
        }
        return backgroundWorkerInstance;
    }

    /**
     * Method which returns back the background worker instance if it exists already
     * @param backgroundWorkerType
     */
    public getBackgroundWorker(backgroundWorkerType: enums.BackgroundWorkers): backgroundWorker {
        let backgroundWorkerInstance;
        if (this.initialisedBackgroundWorkerList !== undefined) {
            backgroundWorkerInstance = this.initialisedBackgroundWorkerList.map((backgroundWorker: backgroundWorker) => {
                if (backgroundWorker.backgroundWorkerType === backgroundWorkerType) {
                    return backgroundWorker;
                }
            });
        }

        return backgroundWorkerInstance !== undefined ? backgroundWorkerInstance[0] : undefined;
    }

    /**
     * Method which clears the background worker queue for the specified type
     */
    public clearBackgroundWorkerQueue(backgroundWorkerType: enums.BackgroundWorkers) {
        if (this.initialisedBackgroundWorkerList !== undefined) {
            this.initialisedBackgroundWorkerList.map((worker: backgroundWorker) => {
                worker.stop();
            });
            this.initialisedBackgroundWorkerList = [];
        }
    }
}

let instance = new BackgroundWorkerFactory();

export = { instance, BackgroundWorkerFactory };
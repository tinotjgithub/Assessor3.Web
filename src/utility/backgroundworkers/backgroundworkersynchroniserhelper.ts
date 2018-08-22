import backgroundWorker = require('./backgroundworker');
import backgroundWorkerFactory = require('./backgroundworkerfactory');

/**
 * Synchronises the background worker calls with the normal AJAX calls
 */
class BackgroundWorkerSynchroniserHelper {

    /**
     * Method which informs the available background worker synchronisers to change the state
     * @param pause
     */
    public informSynchronisers(pause: boolean): void {
        let synchronisers = backgroundWorkerFactory.instance.backgroundWorkerList;
        if (synchronisers !== undefined) {
            for (let i = 0; i < synchronisers.length; i++) {
                if (synchronisers[i] != null) {
                    if (pause) {
                        synchronisers[i].pause();
                    } else {
                        synchronisers[i].start();
                    }
                }
            }
        }
    }
}

let instance = new BackgroundWorkerSynchroniserHelper();

export = { instance, BackgroundWorkerSynchroniserHelper };
"use strict";
var backgroundWorkerFactory = require('./backgroundworkerfactory');
/**
 * Synchronises the background worker calls with the normal AJAX calls
 */
var BackgroundWorkerSynchroniserHelper = (function () {
    function BackgroundWorkerSynchroniserHelper() {
    }
    /**
     * Method which informs the available background worker synchronisers to change the state
     * @param pause
     */
    BackgroundWorkerSynchroniserHelper.prototype.informSynchronisers = function (pause) {
        var synchronisers = backgroundWorkerFactory.instance.backgroundWorkerList;
        if (synchronisers !== undefined) {
            for (var i = 0; i < synchronisers.length; i++) {
                if (synchronisers[i] != null) {
                    if (pause) {
                        synchronisers[i].pause();
                    }
                    else {
                        synchronisers[i].start();
                    }
                }
            }
        }
    };
    return BackgroundWorkerSynchroniserHelper;
}());
var instance = new BackgroundWorkerSynchroniserHelper();
module.exports = { instance: instance, BackgroundWorkerSynchroniserHelper: BackgroundWorkerSynchroniserHelper };
//# sourceMappingURL=backgroundworkersynchroniserhelper.js.map
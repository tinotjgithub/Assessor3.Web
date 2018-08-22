"use strict";
var InMemoryStorageAdapter = require('./InMemoryStorageAdapter');
/**
 * Class which represents the StorageAdapterFactory
 * This class returns an instance of the type of storage adapter requested for
 */
var StorageAdapterFactory = (function () {
    function StorageAdapterFactory() {
    }
    /**
     * Static method which returns back an instance of the Storage Adapter of the requested type
     * @param type
     */
    StorageAdapterFactory.getInstance = function (storageAdaptertype) {
        // TODO - Add other types here as needed
        switch (storageAdaptertype) {
            case 'InMemory':
                return StorageAdapterFactory._inMemoryInstance;
            default:
                // Default to the in-memory adapter
                return StorageAdapterFactory._inMemoryInstance;
        }
    };
    /**
     * Static method which returns new instance of the Storage Adapter  of in memory.
     */
    StorageAdapterFactory.resetInMemmoryInstance = function () {
        StorageAdapterFactory._inMemoryInstance = new InMemoryStorageAdapter();
    };
    // Create and initialise an instance of the InMemoryStorageAdapter
    StorageAdapterFactory._inMemoryInstance = new InMemoryStorageAdapter();
    return StorageAdapterFactory;
}());
module.exports = StorageAdapterFactory;
//# sourceMappingURL=storageadapterfactory.js.map
import StorageAdapterInterface = require('./StorageAdapterInterface');
import InMemoryStorageAdapter = require('./InMemoryStorageAdapter');

/**
 * Class which represents the StorageAdapterFactory
 * This class returns an instance of the type of storage adapter requested for
 */
class StorageAdapterFactory {

    // Create and initialise an instance of the InMemoryStorageAdapter
    private static _inMemoryInstance = new InMemoryStorageAdapter();

    /**
     * Static method which returns back an instance of the Storage Adapter of the requested type
     * @param type
     */
     public static getInstance(storageAdaptertype?: string): StorageAdapterInterface {
        // TODO - Add other types here as needed
         switch (storageAdaptertype) {
            case 'InMemory':
                return StorageAdapterFactory._inMemoryInstance;
            default:
                // Default to the in-memory adapter
                return StorageAdapterFactory._inMemoryInstance;
        }
    }

     /**
      * Static method which returns new instance of the Storage Adapter  of in memory. 
      */
     public static resetInMemmoryInstance() {
         StorageAdapterFactory._inMemoryInstance = new InMemoryStorageAdapter();
     }
}

export = StorageAdapterFactory;
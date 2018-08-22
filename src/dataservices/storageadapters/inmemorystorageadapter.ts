declare let config: any;
import storageAdapterInterface = require('./StorageAdapterInterface');
import Promise = require('es6-promise');

/**
 * This class represents the InMemoryStorageAdapter
 * It uses Promise mechanism to complete each operation.
 * Each method which require a return shall return a promise object
 */
class InMemoryStorageAdapter implements storageAdapterInterface {

    // The text bit which needs to be appended with the Storage Key for storing/retrieving the cached time corresponding to a data
    private static EXPIRY_BIT_TEXT: string = '_expiry';

    // Holds the storage object for InMemoryStorage
    private _storage: any;

    /**
     * Initializes an instance of the InMemoryStorageAdapter
     */
    constructor() {
        // Initializing the storage object
        this._storage = {};
    }

    /**
     * Method which checks if the storage area exists or not.
     * @param storageArea
     * @return Promise object
     */
    private storageAreaExists(storageArea: string): Promise<any> {
        let that = this;
        // Creating and returning new promise object
        return new Promise.Promise<any>(function (resolve: any, reject: any) {
            // Checking if the storage area exists
            if (that._storage[storageArea]) {
                resolve({ success: true });
            } else {
                reject({ success: false });
            }
        });
    }

	/**
	 * Method which checks if the item exists in the storage area or not.
	 * @param storageArea
	 * @param storageKey
	 * @param checkForExpiry
	 * @return Promise object
	 */
    private itemExists(storageArea: string, storageKey: string, checkForExpiry: boolean = false, expiryInMinutes: number = 0)
        : Promise<any> {

        let that = this;
        // Creating and returning new promise object
        return new Promise.Promise<any>(function (resolve: any, reject: any) {
            // Checking if the storage area and the storage key in the storage area exists
            if (that._storage[storageArea] && that._storage[storageArea][storageKey]) {
                // Checking if the cache expiration needs to be considered
                if (checkForExpiry) {
                    // Retrieving the time at which item was cached
                    let itemCachedTime = that._storage[storageArea][storageKey + InMemoryStorageAdapter.EXPIRY_BIT_TEXT];
                    let currentTime = Date.now() / (60 * 1000);

                    if (expiryInMinutes === 0) {
                        expiryInMinutes = config.general.STORAGE_ADAPTER_CACHE_TIME_IN_MINUTES;
                    }

                    // If cache time exists, then
                    if (itemCachedTime) {
                        // Check if the difference between current time and cached time
                        // crosses the maximum allowed cache time in the Config file
                        if (currentTime - itemCachedTime >= expiryInMinutes) {
                            // Cache expired ==> Delete the item from the storage and rejecting the Promise that the item doesn't exist
                            delete that._storage[storageArea][storageKey];
                            reject({ success: false });
                        } else {
                            // Cache is still valid ==> Resolving the Promise that the item does exist in the storage
                            resolve({ success: true });
                        }
                    } else {
                        // Cache expiry time is not stored in storage ==> Hence resolving the 
                        // Promise that the item does exist in the storage
                        resolve({ success: true });
                    }
                } else {
                    // Expiry needn't be checked and hence resolving the Promise that the item does exist in the storage
                    resolve({ success: true });
                }
            } else {
                // Rejecting the promise as the item doesn't exist in the storage
                reject({ success: false });
            }
        });
    }

	/**
	 * Method which retrieves the data from the storage area
	 * @param storageArea
	 * @param storageKey
	 * @param callback
	 * @param checkForExpiry
	 * @return Promise object
	 */
    public getData(storageArea: string, storageKey: string, checkForExpiry: boolean = false, expiryInMinutes: number = 0): Promise<any> {
        let doesItemExist = this.itemExists(storageArea, storageKey, checkForExpiry, expiryInMinutes);
        let that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the item to be retrieved exists or not
            doesItemExist.then(function (json: any) {
                resolve({ success: true, value: that._storage[storageArea][storageKey] });
            }).catch(function (json: any) {
                reject({ success: false, value: null });
            });
        });
    }

	/**
	 * Method which stores the data to the storage area
	 * The promise object created doesn't have a reject case as the value shall be stored in the storage object
	 * @param storageArea
	 * @param storageKey
	 * @param data
	 * @param callback
	 * @param includeExpiry
	 * @return Promise object
	 */
    public storeData(storageArea: string, storageKey: string, data: any, includeExpiry: boolean = false): Promise<any> {
        let doesStorageAreaExist = this.storageAreaExists(storageArea);
        let that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json: any) {
                // Storing the data to the storage
                that._storage[storageArea][storageKey] = data;
                // If expiry time needs to be stored for the object, add the expiry time as well to the storage area
                if (includeExpiry) {
                    that._storage[storageArea][storageKey + InMemoryStorageAdapter.EXPIRY_BIT_TEXT] = Date.now() / (60 * 1000);
                }
                resolve({ success: true });
            }).catch(function (json: any) {
                // Initializing the storage since the storage doesn't current exist
                that._storage[storageArea] = {};
                // Storing the data to the storage
                that._storage[storageArea][storageKey] = data;
                // If expiry time needs to be stored for the object, add the expiry time as well to the storage area
                if (includeExpiry) {
                    that._storage[storageArea][storageKey + InMemoryStorageAdapter.EXPIRY_BIT_TEXT] = Date.now() / (60 * 1000);
                }
                resolve({ success: true });
            });
        });
    }

	/**
	 * Method which deletes the data from the storage area through a particular storage key
	 * @param storageArea
	 * @param storageKey
	 * @param callback
	 * @return Promise object
	 */
    public deleteData(storageArea: string, storageKey: string): Promise<any> {
        let doesItemExist = this.itemExists(storageArea, storageKey);
        let that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the item exists or not
            doesItemExist.then(function (json: any) {
                // Deleting the data from the storage
                let data = that._storage[storageArea];
                if (data) {
                    delete data[storageKey];
                }
                resolve({ success: true });
            }).catch(function (json: any) {
                // Item doesn't exist in the storage, hence rejecting the promise
                reject({ success: false });
            });
        });
    }

	/**
	 * Method which retrieves the number of rows of data available in the storage area
	 * The promise object created doesn't have a reject case
	 * @param storageArea
	 * @param callback
	 * @return Promise object
	 */
    public getRowCount(storageArea: string): Promise<any> {
        let doesStorageAreaExist = this.storageAreaExists(storageArea);
              let that = this;
		// Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json: any) {
                resolve({ success: true,  value: Object.keys(that._storage[storageArea]).length });
            }).catch(function (json: any){
                resolve({ success: true, value: 0 });
            });
        });
    }

	/**
	 * Method which retrieves all the rows available in the storage area
	 * The promise object created doesn't have a reject case
	 * @param storageArea
	 * @param callback
	 * @return Promise object
	 */
    public getAllRows(storageArea: string): Promise<any> {
        let doesStorageAreaExist = this.storageAreaExists(storageArea);
              let that = this;
		// Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json: any) {
                resolve({ success: true, value: that._storage[storageArea] });
            }).catch(function (json: any) {
                resolve({ success: true, value: {}});
            });
        });
    }

	/**
	 * Method which deletes the storage area itself
	 * @param storageArea
	 * @param callback
	 * @return Promise object
	 */
    public deleteStorageArea(storageArea: string): Promise<any> {
        let doesStorageAreaExist = this.storageAreaExists(storageArea);
              let that = this;
		// Creating and returning new promise object
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Checking if the storage area exists or not
                        doesStorageAreaExist.then(function (json: any) {
				// Deleting the storage area
                delete that._storage[storageArea];
                resolve({ success: true });
            }).catch(function (json: any) {
                reject({ success: false });
            });
        });
    }
}

// Exporting the InMemoryStorageAdapter class
export = InMemoryStorageAdapter;
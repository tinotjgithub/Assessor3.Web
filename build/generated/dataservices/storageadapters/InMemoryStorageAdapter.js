"use strict";
var Promise = require('es6-promise');
/**
 * This class represents the InMemoryStorageAdapter
 * It uses Promise mechanism to complete each operation.
 * Each method which require a return shall return a promise object
 */
var InMemoryStorageAdapter = (function () {
    /**
     * Initializes an instance of the InMemoryStorageAdapter
     */
    function InMemoryStorageAdapter() {
        // Initializing the storage object
        this._storage = {};
    }
    /**
     * Method which checks if the storage area exists or not.
     * @param storageArea
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.storageAreaExists = function (storageArea) {
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area exists
            if (that._storage[storageArea]) {
                resolve({ success: true });
            }
            else {
                reject({ success: false });
            }
        });
    };
    /**
     * Method which checks if the item exists in the storage area or not.
     * @param storageArea
     * @param storageKey
     * @param checkForExpiry
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.itemExists = function (storageArea, storageKey, checkForExpiry, expiryInMinutes) {
        if (checkForExpiry === void 0) { checkForExpiry = false; }
        if (expiryInMinutes === void 0) { expiryInMinutes = 0; }
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area and the storage key in the storage area exists
            if (that._storage[storageArea] && that._storage[storageArea][storageKey]) {
                // Checking if the cache expiration needs to be considered
                if (checkForExpiry) {
                    // Retrieving the time at which item was cached
                    var itemCachedTime = that._storage[storageArea][storageKey + InMemoryStorageAdapter.EXPIRY_BIT_TEXT];
                    var currentTime = Date.now() / (60 * 1000);
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
                        }
                        else {
                            // Cache is still valid ==> Resolving the Promise that the item does exist in the storage
                            resolve({ success: true });
                        }
                    }
                    else {
                        // Cache expiry time is not stored in storage ==> Hence resolving the 
                        // Promise that the item does exist in the storage
                        resolve({ success: true });
                    }
                }
                else {
                    // Expiry needn't be checked and hence resolving the Promise that the item does exist in the storage
                    resolve({ success: true });
                }
            }
            else {
                // Rejecting the promise as the item doesn't exist in the storage
                reject({ success: false });
            }
        });
    };
    /**
     * Method which retrieves the data from the storage area
     * @param storageArea
     * @param storageKey
     * @param callback
     * @param checkForExpiry
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.getData = function (storageArea, storageKey, checkForExpiry, expiryInMinutes) {
        if (checkForExpiry === void 0) { checkForExpiry = false; }
        if (expiryInMinutes === void 0) { expiryInMinutes = 0; }
        var doesItemExist = this.itemExists(storageArea, storageKey, checkForExpiry, expiryInMinutes);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the item to be retrieved exists or not
            doesItemExist.then(function (json) {
                resolve({ success: true, value: that._storage[storageArea][storageKey] });
            }).catch(function (json) {
                reject({ success: false, value: null });
            });
        });
    };
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
    InMemoryStorageAdapter.prototype.storeData = function (storageArea, storageKey, data, includeExpiry) {
        if (includeExpiry === void 0) { includeExpiry = false; }
        var doesStorageAreaExist = this.storageAreaExists(storageArea);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json) {
                // Storing the data to the storage
                that._storage[storageArea][storageKey] = data;
                // If expiry time needs to be stored for the object, add the expiry time as well to the storage area
                if (includeExpiry) {
                    that._storage[storageArea][storageKey + InMemoryStorageAdapter.EXPIRY_BIT_TEXT] = Date.now() / (60 * 1000);
                }
                resolve({ success: true });
            }).catch(function (json) {
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
    };
    /**
     * Method which deletes the data from the storage area through a particular storage key
     * @param storageArea
     * @param storageKey
     * @param callback
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.deleteData = function (storageArea, storageKey) {
        var doesItemExist = this.itemExists(storageArea, storageKey);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the item exists or not
            doesItemExist.then(function (json) {
                // Deleting the data from the storage
                var data = that._storage[storageArea];
                if (data) {
                    delete data[storageKey];
                }
                resolve({ success: true });
            }).catch(function (json) {
                // Item doesn't exist in the storage, hence rejecting the promise
                reject({ success: false });
            });
        });
    };
    /**
     * Method which retrieves the number of rows of data available in the storage area
     * The promise object created doesn't have a reject case
     * @param storageArea
     * @param callback
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.getRowCount = function (storageArea) {
        var doesStorageAreaExist = this.storageAreaExists(storageArea);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json) {
                resolve({ success: true, value: Object.keys(that._storage[storageArea]).length });
            }).catch(function (json) {
                resolve({ success: true, value: 0 });
            });
        });
    };
    /**
     * Method which retrieves all the rows available in the storage area
     * The promise object created doesn't have a reject case
     * @param storageArea
     * @param callback
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.getAllRows = function (storageArea) {
        var doesStorageAreaExist = this.storageAreaExists(storageArea);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json) {
                resolve({ success: true, value: that._storage[storageArea] });
            }).catch(function (json) {
                resolve({ success: true, value: {} });
            });
        });
    };
    /**
     * Method which deletes the storage area itself
     * @param storageArea
     * @param callback
     * @return Promise object
     */
    InMemoryStorageAdapter.prototype.deleteStorageArea = function (storageArea) {
        var doesStorageAreaExist = this.storageAreaExists(storageArea);
        var that = this;
        // Creating and returning new promise object
        return new Promise.Promise(function (resolve, reject) {
            // Checking if the storage area exists or not
            doesStorageAreaExist.then(function (json) {
                // Deleting the storage area
                delete that._storage[storageArea];
                resolve({ success: true });
            }).catch(function (json) {
                reject({ success: false });
            });
        });
    };
    // The text bit which needs to be appended with the Storage Key for storing/retrieving the cached time corresponding to a data
    InMemoryStorageAdapter.EXPIRY_BIT_TEXT = '_expiry';
    return InMemoryStorageAdapter;
}());
module.exports = InMemoryStorageAdapter;
//# sourceMappingURL=InMemoryStorageAdapter.js.map
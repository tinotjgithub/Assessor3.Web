 /**
  * Interface for storage adapters
  */
interface StorageAdapterInterface {

	/** Method to get the data from the Storage Adapter */
    getData(storageArea: string, storageKey: string, revisionTracking: boolean, expiryInMinutes: number): Promise<any>;

	/** Method to store the data to the Storage Adapter */
    storeData(storageArea: string, storageKey: string, data: any, revisionTracking: boolean): Promise<any>;

	/** Method to delete the data from the Storage Adapter */
    deleteData(storageArea: string, storageKey: string): Promise<any>;

	/** Method to get the row count from the Storage Adapter */
    getRowCount(storageArea: string): Promise<any>;

	/** Method to get all the rows from the Storage Adapter */
    getAllRows(storageArea: string, revisionTracking?: boolean): Promise<any>;

	/** Method to delete the storage area itself */
    deleteStorageArea(storageArea: string): Promise<any>;
}

/** Exporting storage adapter interface */
export = StorageAdapterInterface;
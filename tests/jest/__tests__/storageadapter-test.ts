/// <reference path="../../../src/dataservices/storageadapters/inmemorystorageadapter.ts" />
/// <reference path="../../../typings/jest/jest.d.ts" />
jest.dontMock("es6-promise");
jest.dontMock("../../../src/dataservices/storageadapters/storageadapterfactory");
jest.dontMock("../../../src/dataservices/storageadapters/inmemorystorageadapter");

import StorageAdapterFactory = require("../../../src/dataservices/storageadapters/storageadapterfactory");
import InMemoryStorageAdapter = require("../../../src/dataservices/storageadapters/inmemorystorageadapter");

/**
 * Test suite for storage adapter factory.
 */
describe("Test suite for storage adapters", function () {

    var storageAdapterType = "InMemory";
	let storageAdapter;
    beforeEach(function () {		
    });
	
    /**
    * test for getting the instance of the Storage Adapter of the requested type
    */
    it("should retrieve the storage adapter passing in the storage adapter type", function () {
		storageAdapter = StorageAdapterFactory.getInstance(storageAdapterType);
		expect(storageAdapter).toBeDefined();
    });
	
	// THE FOLLOWING SET OF TESTS ARE COMMENTED BECAUSE JEST v0.8.2 DOES'T SEEM TO SUPPORT PROMISE - IT'S WORKING FINE WITH v.0.5.0
	// THOUGH IT'S NOT RECOMMENDED TO DOWNGRADE TO v0.5.0

	//pit("should make sure that the storage area initially doesn't exist", function () {
	//	var storageAreaExists = storageAdapter.storageAreaExists("testArea");
	//	return storageAreaExists.catch(function (json) {
	//		expect(json.success).toBe(false);
	//	});
	//});

	//pit("should store the data passed in to the storage area", function () {
	//	var storeDataPromise = storageAdapter.storeData("testArea", "testKey", { data: "test" }, false);	
	//	return storeDataPromise.then(function (json) {
	//		expect(json.success).toBe(true);
	//	});
	//});

	//pit("should make sure that the storage area exists after storing the data", function () {
	//	var storageAreaExists = storageAdapter.storageAreaExists("testArea");
	//	return storageAreaExists.then(function (json) {
	//		expect(json.success).toBe(true);
	//	});
	//});

	//pit("should make sure that the data stored is retrieved successfully from the storage area", function () {
	//	var retrieveDataPromise = storageAdapter.getData("testArea", "testKey", false);
	//	return retrieveDataPromise.then(function (json) {
	//		expect(json.success).toBe(true);
	//		expect(json.value).toEqual({ data: 'test' });
	//	});
	//});

	//pit("should retrieve the total row count from the storage area", function () {
	//	var retrieveRowCountPromise = storageAdapter.getRowCount("testArea");
	//	return retrieveRowCountPromise.then(function (json) {
	//		expect(json.success).toBe(true);
	//		expect(json.value).toEqual(1);
	//	});
	//});

	//pit("should retrieve all the rows from the storage area", function () {
	//	var retrieveAllRowsPromise = storageAdapter.getAllRows("testArea");
	//	return retrieveAllRowsPromise.then(function (json) {			
	//		expect(json.success).toBe(true);
	//		expect(json.value).toEqual({ testKey: { data: 'test' } });
	//	});
	//});

	//pit("should delete data from the storage area", function () {
	//	var deleteDataPromise = storageAdapter.deleteData("testArea", "testKey");
	//	return deleteDataPromise.then(function (json) {
	//		expect(json.success).toBe(true);
	//	});
	//});

	//pit("should make sure that the data stored is retrieved successfully from the storage area", function () {
	//	var retrieveDataPromise = storageAdapter.getData("testArea", "testKey", false);
	//	return retrieveDataPromise.catch(function (json) {
	//		expect(json.success).toBe(false);
	//		expect(json.value).toBeNull();
	//	});
	//});
});
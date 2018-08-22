
/// <reference path="../../../typings/userdefinedtypings/immutable/immutable-overrides.d.ts" />
jest.dontMock("../../../src/stores/imagezones/imagezonestore");
import imageZoneStore = require("../../../src/stores/imagezones/imagezonestore");
import dispatcher = require("../../../src/app/dispatcher");
import Immutable = require("immutable");

describe("Unit test fot Image zone store", () => {

    var imageZoneAction;
    beforeEach(() => {
        imageZoneAction = require('../../../src/actions/imagezones/imagezonesaction');
        //imageStore = new imageZoneStore.ImageZoneStore();
    });

    it("Initiaze the test and check the collection", () => {
        expect(imageZoneStore.instance.imageZoneList).toBeUndefined();
    });

    it("should add the values to the collection on a successfull result", () => {

        var json = "{\"imageZones\":[{\"uniqueId\":648,\"imageClusterId\":505,\"description\":\"QA1a\",\"pageNo\":1,\"sequence\":1,\"leftEdge\":0.0,\"topEdge\":0.0,\"width\":100.0,\"height\":100.0,\"outputPageNo\":1,\"inputFileFormatId\":0,\"outputFileFormatId\":1,\"inputFormat\":\"TIFF\",\"outputFormat\":\"TIFF\",\"examBodyImageZoneNo\":11132001,\"itemId\":0}],\"success\":true,\"errorMessage\":null}";

        var result: ImageZoneList;
        result = JSON.parse(json);
        result.imageZones = Immutable.List<ImageZone>(JSON.parse(json).imageZones);
        dispatcher.dispatch(new imageZoneAction(result.success, result));

        // Assertions
        expect(imageZoneStore.instance.imageZoneList).not.toBeUndefined();
        expect(imageZoneStore.instance.imageZoneList.imageZones.count()).toBe(1);
    });

    it("should clear the values when the call has been failed", () => {

        var json = "{\"imageZones\":[],\"success\":false,\"errorMessage\":null}";

        var result: ImageZoneList;
        result = JSON.parse(json);
        result.imageZones = Immutable.List<ImageZone>(JSON.parse(json).imageZones);
        dispatcher.dispatch(new imageZoneAction(result.success, result));

        // Assertions
        expect(imageZoneStore.instance.imageZoneList).toBeNull();
    });
});

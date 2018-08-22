jest.dontMock("../../../src/utility/sorting/sortbase/comparerlist");

import sortHelper = require("../../../src/utility/sorting/sorthelper");
import comparerFactory = require("../../../src/utility/sorting/sortbase/comparerfactory");
import comparerList = require("../../../src/utility/sorting/sortbase/comparerlist");
import auditLogInfoArgument = require("../../../src/dataservices/logging/auditloginfoargument");
import immutable = require("immutable");

/**
 * Test suite for sort helper and sorting framework.
 */
describe("Test suite for sorting framework", function () {
    var sampleArray;

    beforeEach(function () {
        /** Declaring an array of AuditLogInfoArgument. And adding AuditLogInfoArgument items into the array */
        sampleArray = new Array<auditLogInfoArgument>();
        var item1 = new auditLogInfoArgument();
        item1.Content = "This is a test log";
        item1.LoggedDate = new Date('6/29/2015 10:10:11 PM UTC').toLocaleString();
        item1.LoggedAction = "Action1";
        item1.EsMarkGroupId = 1;
        item1.MarkGroupId = 1;
        item1.MarkSchemeGroupId = 1;
        sampleArray.push(item1);

        var item2 = new auditLogInfoArgument();
        item2.Content = "This is a test log";
        item2.LoggedDate = new Date('6/29/2011 10:10:11 PM UTC').toLocaleString();
        item2.LoggedAction = "Action2";
        item2.EsMarkGroupId = 1;
        item2.MarkGroupId = 1;
        item2.MarkSchemeGroupId = 1;
        sampleArray.push(item2);

        var item3 = new auditLogInfoArgument();
        item3.Content = "This is a test log";
        item3.LoggedDate = new Date('6/29/2013 10:10:11 PM UTC').toLocaleString();
        item3.LoggedAction = "Action3";
        item3.EsMarkGroupId = 1;
        item3.MarkGroupId = 1;
        item3.MarkSchemeGroupId = 1;
        sampleArray.push(item3);

    });

    /**
    * Test for the sort method of sortHelper
    */
    it("should sort the array of audit log in ascending order of logged date", function () {
        var sortedList = sortHelper.sort(sampleArray, comparerList.AuditLogComparer);

        /**The sorted list should not be undefined*/
        expect(sortedList).not.toBeUndefined();

        /** After sorting the first item should be with LoggedAction "Action2" which has the earliest logged date*/
        expect(sortedList[0].LoggedAction).toEqual("Action2");

        /** After sorting the last item should be with LoggedAction "Action1" which has the highest logged date*/
        expect(sortedList[2].LoggedAction).toEqual("Action1");

    });

    /**
    * Test for the comparere factory and its getComparer method.
    */
    it("the comparerfactory should returns a comparere object corresponding to the given name", function () {
        var comparer = comparerFactory.getComparer(comparerList.AuditLogComparer);

        /** the comparer object should not be undefined*/
        expect(comparer).not.toBeUndefined();
    });

});
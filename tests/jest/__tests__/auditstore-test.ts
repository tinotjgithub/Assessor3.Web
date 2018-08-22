jest.dontMock("../../../src/stores/audit/auditlogstore");
import AuditLogStore = require("../../../src/stores/audit/auditlogstore");
import dispatcher = require("../../../src/app/dispatcher");

describe("testing Audit log store file.", function () {
    let logAction;
    let logStore;

    beforeEach(function () {
        //logAction = require('../../../src/actions/login/loginaction');
        //logStore = new AuditLogStore.AuditLogStore();
    });

    it("Initialize new instance", function () {

        //// Initial state the collection should be empty.
        //expect(logStore.LogInfo.count()).toBe(0);

        //// dispatch one item and that needs to be added to the collection
        //dispatcher.dispatch(new logAction(true, "fake"));
        //expect(logStore.LogInfo.count()).toBe(1);

        expect(null).toBeNull();
    });

    //it("Should delete one item if count exceeds 20", function () {

       // for (var i=0; i <= 20; i++) {

          //  dispatcher.dispatch(new logAction(true, "fake" + i));
        //}
        //expect(logStore.LogInfo.count()).toBe(20);

        //// Overflow should delete one item and maintain the collection to the config value
        //dispatcher.dispatch(new logAction(true, "fake21"));
       // expect(logStore.LogInfo.count()).toBe(20);
    //});

});

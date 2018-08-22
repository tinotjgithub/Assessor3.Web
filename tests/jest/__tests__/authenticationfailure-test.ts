/// <reference path="../../../typings/jest/jest.d.ts" />

jest.dontMock("../../../src/stores/login/loginStore");

import dispatcher = require("../../../src/app/dispatcher");
import LoginStore = require("../../../src/stores/login/loginStore");
import LoginAction = require("../../../src/actions/login/loginaction");

/**
 * Describe sample test suite for login textbox
 */
describe("test suite for login store", function () {
    it("should set correct status code", function () {
        dispatcher.dispatch(new LoginAction(false, "alwin", JSON.parse('{"xhr":{"readyState":4,"responseText":{"error":"User not Authenticated."},"responseJSON":{"error":"User not Authenticated."},"status":400,"statusText":"Bad Request"},"status":"error","error":"Bad Request"}')));
        expect(LoginStore.instance.getStatusCode).not.toBe(200);
    });
});
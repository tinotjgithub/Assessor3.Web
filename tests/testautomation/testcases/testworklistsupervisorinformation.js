var worklistuserinformation = require("../testdata/worklistuserinformation.json");
var objRepo = require("../objectrepository/objectrepository.json");

module.exports = {
    /* Verifies whether the supervisor information is visible. */
    TC_1506_01: function (browser) {
        browser.expect.element(objRepo.worklistsupervisorinformation.supervisorpanel).to.be.visible;
    },

    /* Verifies whether the supervisor name is rendered correctly when login as AE. */
    TC_1506_02: function (browser) {
        browser.verify.containsText(objRepo.worklistsupervisorinformation.supervisorname, worklistuserinformation.supervisorinformation.supervisornameAEText, 'Checking the supervisor name while login as AE');
    },

    /* Verifies whether the supervisor name is rendered correctly when login as TL. */
    TC_1506_03: function (browser) {
        browser.verify.containsText(objRepo.worklistsupervisorinformation.supervisorname, worklistuserinformation.supervisorinformation.supervisornameTLText, 'Checking the supervisor name while login as TL');
    },

    /* Verifies whether the supervisor information is not visible when login as PE. */
    TC_1506_04: function (browser) {
        browser.expect.element(objRepo.worklistsupervisorinformation.supervisorpanel).not.to.be.present;
    },

    /* Verifies whether the send message area is visible when login as AE. */
    TC_1507_01: function (browser) {
        browser.expect.element(objRepo.worklistsupervisorinformation.sendmessagearea).to.be.visible;
    },

    /* Verifies whether the online status is visible when login as AE. */
    TC_1508_01: function (browser) {
        browser.expect.element(objRepo.worklistsupervisorinformation.onlinestatus).to.be.visible;
    },

    /* Verifies whether the online status is showing as 'Online' when login as AE. */
    TC_1508_02: function (browser) {
        browser.assert.containsText(objRepo.worklistsupervisorinformation.onlinestatus, worklistuserinformation.supervisorinformation.onlinestatustext, "Checking if the online status indicator is showing the text as online");
    }
}
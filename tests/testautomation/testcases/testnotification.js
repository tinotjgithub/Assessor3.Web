var userProfile = require("../features/userprofile.js");
var userProfileData = require("../testdata/userprofile.json");
var utilityObj = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");

module.exports = {

    /* Waits for notification icon to be visible */
    TC_1096_01: function (browser) {
        // change this
        browser.pause(1000);
        // browser.useXpath()
      //  browser.click(".menu-button")
        // browser.useCss()
        browser.pause(1000)
 
        browser.waitForElementVisible(objRepo.userinfo.notificationicon, 1000, 'Notification icon is visible in User Profile.');
    },

    /* Checks the notification count visible on the notification icon */
    TC_1097_01: function (browser) {
        objData = utilityObj.getDataParam(browser, userProfileData);
        userProfile.verifyNotificationCount(browser, objData);
    }

}
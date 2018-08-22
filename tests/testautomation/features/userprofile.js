var objRepo = require("../objectrepository/objectrepository.json");


module.exports = {

    /* Gets the text user fullname, username and email from the page then verifies if the expected text and the actual text is same */
    verifyUserInformation: function (browser, objData) {
        browser.getText(objRepo.userinfo.userfullname, function (result) {
            browser.verify.equal(result.value, objData.userfullname);
        });
        browser.getText(objRepo.userinfo.loggedinusername, function (result) {
            browser.verify.equal(result.value, objData.loggedinusername);
        });
        //browser.getText(objRepo.userinfo.email, function (result) {
        //    browser.verify.equal(result.value, objData.email);
        //});
        
    },

    /* Gets the notification count from page and verifies if the expected and actual count are same */
    verifyNotificationCount: function (browser, objData) {
        browser.getText(objRepo.userinfo.notificationcount, function (result) {
            browser.verify.equal(result.value, objData.notificationcount);
        });
    }  

}
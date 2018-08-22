var userProfile = require("../features/userprofile.js");
var userProfileData = require("../testdata/userprofile.json");
var utilityObj = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var data = require("../testdata/login.json");
var changeLanguage = require("../features/changelanguage.js");

module.exports = {
    /* Waits for the user profile icon to be displayed */
    TC_1103_01: function (browser) {
        browser.waitForElementVisible(objRepo.userinfo.userImage, 2000, 'User Profile icon is visible.')
    },

    /* Clicks the user profile icon and waits for the profile to be opened */
    TC_1103_02: function (browser) {
        // change this
        browser.pause(1000);
        // browser.useXpath()
        browser.click(objRepo.userinfo.userImage);
        // browser.useCss()
        browser.pause(1000);
       // browser.click(objRepo.userinfo.userprofileicon);
        browser.waitForElementVisible(objRepo.userinfo.userinfopanel, 8000, 'Check User Profile is opened');
    },

    /*Gets the user full name, username and email data from the json file and verifies if the data is correct */
    TC_1103_03: function (browser) {
        objData = utilityObj.getDataParam(browser, userProfileData);
        userProfile.verifyUserInformation(browser, objData);
    },

    /* Checks if the logout button is visible in the user profile */
    TC_1103_04: function (browser) {
        browser.verify.visible(objRepo.userinfo.logout, 'Check Logout button is visible in User Profile.');
    },

    /* Clicks on the user pofile icon and wait for  Edit Settings element to be visible */
    TC_1105_01: function (browser) {
        browser.waitForElementVisible(objRepo.userinfo.editsettings, 3000, 'Check Edit settings link is visible');     
    },

    /* Clicks Edit settings link and checks if the user setings panel is displayed */
    TC_1105_02: function (browser) {
        browser.click(objRepo.userinfo.editsettings);
        browser.waitForElementVisible(objRepo.userinfo.editsettingsdropdown, 1000, 'Check User settings is opened');
    },

    /* Verify General tab */
    TC_1106: function (browser) {
        browser.useXpath();
        browser.waitForElementVisible(objRepo.userinfo.general, 1000, 'Check General tab is visible');
    },

    /* Verify Marking tab */
    TC_1107: function (browser) {
        browser.useXpath();
        browser.waitForElementVisible(objRepo.userinfo.marking, 1000, 'Check Marking tab is visible');
        browser.end();
    },

    /* Verify Save on closing Settings */
    TC_1108: function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        changeLanguage.selectLanguage(browser, objData.spanish);
        browser.click(objRepo.userinfo.editsettings);

    },

    /* Verify that clicking 'Edit settings' link displays the user settings options */
    //TC_1105_02: function (browser) {
    //    browser.waitForElementVisible(objRepo.userinfo.general, 1000, 'General tab is visible');
    //    browser.waitForElementVisible(objRepo.userinfo.languagesettingsform, 1000, 'Language settings form is visible');
    //    browser.waitForElementVisible(objRepo.userinfo.logoutsettingsform, 1000, 'Logout settings form is visible');
    //    browser.waitForElementVisible(objRepo.userinfo.marking, 1000, 'Marking tab is visible');
    //}

   
}
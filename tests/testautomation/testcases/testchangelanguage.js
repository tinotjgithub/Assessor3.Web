var changeLanguage = require("../features/changelanguage.js");
var data = require("../testdata/login.json");
var utilityobj = require("../utilityfunctions/utility.js");
var pageobj = require("../objectrepository/objectrepository.json");
var signIn = require("../features/login.js");
var objOR = pageobj.changeLanguage;


module.exports = {

    /** Launches the application and assert for "select language" dropdown element **/
    TC_642_01: function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        signIn.launchApplication(browser, objData);
        browser.waitForElementVisible(objOR.selectlanguagebox, 2000, 'Check the select language field is visible.')
    },

    /** Verifies that "select language" dropdown contains the configured languages**/
    TC_642_02: function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        changeLanguage.verifyLanguages(browser, objData);
    },

    /** Click on the dropdown element to open the dropdown **/
    TC_643_01: function (browser) {      
        changeLanguage.openDropDownBox(browser);
    },

    /**Changes to a language and change back to default language**/
    TC_643_02: function (browser) {      
        changeLanguage.selectLanguage(browser, objData.spanish)
        changeLanguage.verifyChangedLanguage(browser, objData.spanish);
        changeLanguage.openDropDownBox(browser);      
        changeLanguage.selectLanguage(browser, objData.english)
        changeLanguage.verifyChangedLanguage(browser, objData.english);       
    },

    /**Changes to a language, say spanish and verfies a text, get the cookie and verifies the cookie, reload the url 
    and verifies that the text is loaded in spanish**/
    TC_645_01: function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        changeLanguage.openDropDownBox(browser);
        changeLanguage.selectLanguage(browser, objData.spanish)
        changeLanguage.verifyChangedLanguage(browser, objData.spanish);
        changeLanguage.getCookie(browser, objData.spanish);
        browser.refresh();
        changeLanguage.verifyChangedLanguage(browser, objData.spanish);
        
    },

    /** Selects the language from the "select language" dropdown and verifies the text**/
    TC_645_02: function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        changeLanguage.openDropDownBox(browser);
        changeLanguage.selectLanguage(browser, objData.spanish)
        changeLanguage.verifyChangedLanguage(browser, objData.spanish);
    },

    /**Deletes all cookies of browser and load the page again and checks whether the page is loaded 
    in default language**/
    TC_619_01: function (browser) {
        objData = utilityobj.getDataParam(browser, data);       
        changeLanguage.deleteCookies(browser);
        browser.refresh();
        changeLanguage.verifyChangedLanguage(browser, objData.english);
    }

};

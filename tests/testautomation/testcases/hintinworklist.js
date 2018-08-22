//L3 layer containg all the testcases

var signIn = require("../features/login.js");
var homePageLog = require("../features/HomePage.js");
var data = require("../testdata/login.json");
var utilityobj = require("../utilityfunctions/utility.js");
var pageobj = require("../objectrepository/objectrepository.json");
var changeLanguage = require("../features/changeLanguage.js");
var homePageData = require("../testdata/homePage.json");
module.exports = {




    TC_1502: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.noResponseUser, objDataHomepage.noResponsePass);


        
        homePageLog.selectQig(browser, objDataHomepage.nothingToDownloadQig, "mark");


        //Verify the disabled button.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintDesabledButton);


        browser.end()

    },



    TC_1504: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.noResponseCenterUser, objDataHomepage.noResponseCenterPass);
 



        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");


        //Verify the disabled button text.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintEnableButton);
        

        browser.end()


    },




    TC_1514: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.markerRejectedUser, objDataHomepage.markerRejectedPass);




        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");


        //Verify the disabled button text.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintEnableButton);


        //Verify nothing to download text.
        homePageLog.verifyHintMessage(browser, pageobj.hint.messageBody, objDataHomepage.downloadResponseText);

        browser.end()



    },




    TC_1515: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.responseAvailableUser, objDataHomepage.responseAvailablePass);




        homePageLog.selectQig(browser, objDataHomepage.nothingToDownloadQig, "mark");


        //Verify the disabled button.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintDesabledButton);


        //Verify nothing to download text.
        homePageLog.verifyHintMessage(browser, pageobj.hint.messageBody, objDataHomepage.noResponseHint);

        browser.end()


    },


    TC_1519: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.noResponseMarkerRejextedUser, objDataHomepage.noResponseMarkerRejextedPass);



        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");


        //Verify the disabled button text.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintEnableButton);


        //Verify nothing to download text.
        homePageLog.verifyHintMessage(browser, pageobj.hint.messageBody, objDataHomepage.downloadResponseText);

        browser.end()


    },












    TC_1521: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.openWorkListUser, objDataHomepage.openWorkListPass);




        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");


        //Verify the disabled button text.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintEnableButton);


        browser.end()




    },



    TC_1523: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.openWorkListUser, objDataHomepage.openWorkListPass);




        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");


        //Verify the disabled button text.
        browser.pause(1000);
        browser.verify.visible(pageobj.hint.hintEnableButton);


        //Verify worklist empty message. 
        homePageLog.verifyHintMessage(browser, pageobj.hint.messageBody, objDataHomepage.downloadResponseText);

        browser.end()




    },







    
    languageChangeMainPage: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.launchApplication(browser, objData);

        /**change language in the login page and verify it*/
        changeLanguage.openDropDownBox(browser);
        changeLanguage.selectLanguage(browser, objData.spanish)
        changeLanguage.verifyChangedLanguage(browser, objData.spanish);

        /**Login to the application */
        signIn.enterUsernameAndPassword(browser, objDataHomepage.noResponseCenterUser, objDataHomepage.noResponseCenterPass);
        browser.click(pageobj.signIn.login);
        browser.pause(1000);


        homePageLog.selectQig(browser, objDataHomepage.downloadNewResponse, "mark");



      homePageLog.verifyHintMessage(browser, pageobj.hint.messageBody, objDataHomepage.downloadResponseTextSpanish);


       browser.end();
    }










};

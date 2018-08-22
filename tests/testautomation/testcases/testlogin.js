//L3 layer containg all the testcases

var signIn = require("../features/login.js");
var data = require("../testdata/login.json");
var utilityobj = require("../utilityfunctions/utility.js");
var pageobj = require("../objectrepository/objectrepository.json");
var objOR = (pageobj.signIn);
fs = require('fs');
module.exports = {

    /** User Story Enter username and password  Start **/

    TC_603: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 603 verify the username field is showing or not**/
        browser.pause(1000);
        browser.verify.visible(objOR.username);
       
    },

    TC_604: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        /** TC ID 604 verify the password field is showing or not**/
        browser.pause(1000);
        browser.verify.visible(objOR.password);

    },


    TC_607_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);


        /** TC ID 607 case 02 Invalid user name and pass**/
        signIn.enterUsernameAndPassword(browser, objData.invalidUsername, objData.invalidPassword);
        browser.pause(1000);
        browser.verify.visible(objOR.login);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },

    TC_607_03: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        /** TC ID 607 case 03 with no data**/
        signIn.enterUsernameAndPassword(browser, '', '');
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessageNoData, 'Error message check')
        browser.refresh()

    },

    TC_607_04: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        /** TC ID 607 case 04 login with charactor**/
        signIn.enterUsernameAndPassword(browser, objData.usernameCharacters, objData.passwordCharacters);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()

    },

    TC_607_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        /** TC ID 607 case 01 valid login**/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
        browser.click(objOR.login);
        browser.pause(1000);
        browser.verify.visible(objOR.loginMessage);
        browser.end()
    },



    /** TC ID 608 case 01  with blank user name and valid password**/
    TC_608_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);

        signIn.enterUsernameAndPassword(browser, '', objData.validpassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessageUserName, 'Error message check')
        browser.refresh()
    },
        /** TC ID 608 case 2 with blank user name and invalid password**/
    TC_608_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.enterUsernameAndPassword(browser, '', objData.invalidPassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessageUserName, 'Error message check')
        browser.end()

    },
 
    /** TC ID 609 case 01 with valid user name and blank password**/
    TC_609_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);

        signIn.enterUsernameAndPassword(browser, objData.validusername, '');
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessagePassword, 'Error message check')
        browser.refresh()
    },


    /** TC ID 609 case 2 with invalid user name and blank password**/
    TC_609_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.enterUsernameAndPassword(browser, objData.usernameCharacters, '');
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessagePassword, 'Error message check')
        browser.end()


    },



    /** TC ID 611 **/
    TC_611_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 611 case 02 invalid login with enter key**/
        signIn.enterUsernameAndPassword(browser, objData.invalidUsername, objData.invalidPassword);
        browser.keys(['\uE007'])
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },


    /** TC ID 611 case 03 with valid user name and blank password with enter key**/
    TC_611_03: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.enterUsernameAndPassword(browser, objData.validusername, '');
        browser.keys(['\uE007'])
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessagePassword, 'Error message check')
        browser.refresh()

    },

    /** TC ID 611 case 04 with valid user name and blank password with enter key**/
    TC_611_04: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.enterUsernameAndPassword(browser, '', objData.validpassword);
        browser.keys(['\uE007'])
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessageUserName, 'Error message check')
        browser.refresh()
    },

    /** TC ID 611 case 01 valid login with enter key**/
    TC_611_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

    signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
    browser.keys(['\uE007'])
    browser.pause(1000);
    browser.verify.visible(objOR.loginMessage);
    browser.end()


},




    TC_612_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 612 Invalid user name and pass**/
        signIn.enterUsernameAndPassword(browser, objData.invalidUsername, objData.invalidPassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },

    TC_612_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 612 case 02 valid password and username of different user **/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpasswordUser1);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },


    /** TC ID 612 case 3 blank password and character in user name enter **/
    TC_612_03: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.enterUsernameAndPassword(browser, objData.usernameCharacters, '');
        browser.keys(['\uE007'])
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessagePassword, 'Error message check')
        browser.refresh()
    },

    /** TC ID 612 case 4 character in user name and password enter **/
    TC_612_04: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

    signIn.enterUsernameAndPassword(browser, objData.usernameCharacters, objData.passwordCharacters);
    browser.click(objOR.login);
    browser.pause(10000);
    browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
    browser.end()

    },

    //*******************************************************************************
    //*******************************************************************************
    //*******************************************************************************
    //*******************************************************************************


    TC_614_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 614 case 01 Valid login with in 1 sec **/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
        browser.click(objOR.login);
        browser.pause(1000);
        browser.verify.visible(objOR.loginMessage);
        browser.end()

    },

    /** TC ID 614 case 02 Valid login with in 1 sec Enter key**/
    TC_614_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);
        signIn.launchApplication(browser, objData);
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
        browser.keys(['\uE007'])
        browser.pause(1000);
        browser.verify.visible(objOR.loginMessage);
        browser.end()


    },

    //*******************************************************************************
    //*******************************************************************************
    //*******************************************************************************
    //*******************************************************************************


    /** User Story Enter username and password  End **/

    /** User Story Customer branding  Start **/

    /** TC ID 708  **/
    TC_708: function (browser) {

    objData = utilityobj.getDataParam(browser, data);

    signIn.launchApplication(browser, objData);
    browser.pause(10000);
    signIn.customerBranding(browser, objData.customerLogoText);
    signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
    browser.click(objOR.login);
    browser.pause(10000);
    browser.verify.visible(objOR.loginMessage);
    signIn.logOut(browser);
    browser.pause(1000);
    signIn.customerBranding(browser, objData.customerLogoText);

    browser.end()

     


    },

    /** User Story Customer branding  End **/



    /** User Story Authentication failure   Start **/

    TC_718_01: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        
        /** TC ID 718 case 01 valid username and incorrect password**/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.invalidPassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },


    TC_718_02: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        /** TC ID 718 case 01Invalid username and valid password**/
        signIn.enterUsernameAndPassword(browser, objData.invalidUsername, objData.validpassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.refresh()
    },


    TC_718_03: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 607 case 02 Invalid user name and pass**/
        signIn.enterUsernameAndPassword(browser, objData.invalidUsername, objData.invalidPassword);
        browser.click(objOR.login);
        browser.pause(10000);
        browser.verify.containsText(objOR.errorMessage, objData.errorMessage, 'Error message check')
        browser.end()
    },



    TC_632: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        signIn.launchApplication(browser, objData);
        /** TC ID 632 log out from the application**/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
        browser.click(objOR.login);
        browser.pause(1000);
        browser.verify.visible(objOR.loginMessage);
        browser.pause(1000);
        signIn.logOut(browser);
        browser.pause(1000);
        browser.verify.visible(objOR.login);
    },



    TC_633: function (browser) {

        objData = utilityobj.getDataParam(browser, data);

        /** TC ID 632 log out from the application**/
        signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
        browser.click(objOR.login);
        browser.pause(1000);
        browser.verify.visible(objOR.loginMessage);
        browser.pause(1000);

        browser.click(objOR.logOutButton);
        browser.pause(1000);

        browser.verify.containsText(objOR.logOutMeddageText, objData.logOutMessage, 'Checking Log out popup message')


        browser.click(objOR.logOutYes);

        browser.pause(1000);
        browser.verify.visible(objOR.login);


        browser.end()
    }


  



};

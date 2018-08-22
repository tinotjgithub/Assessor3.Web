var notif = require("../../testcases/testnotification.js");
var profile = require("../../testcases/testuserprofile.js");
var objRepo = require("../../objectrepository/objectrepository.json");
var signIn = require("../../features/login.js");
var utilityobj = require("../../utilityfunctions/utility.js");
var data = require("../../testdata/login.json");
var logOut = require("../../testcases/TestLogOut.js");
var changelanguage = require("../../testcases/testchangelanguage.js");

module.exports = {



    "TC_1096_01 Verify that Notification icon is visible in User Profile": function (browser) {
        objData = utilityobj.getDataParam(browser, data);
        signIn.login(browser, objData.notificationusername, objData.notificationpwd);
        notif.TC_1096_01(browser);      
    },

    //"TC_1097_01 Verify that notification count is dispayed in the Notification icon": function (browser) {
    //    browser.pause(5000);
    //    notif.TC_1097_01(browser);
    //},
    
    "TC_1103_01 Verify whether User Profile icon is displayed": function (browser) {
        profile.TC_1103_01(browser);
    },

    "TC_1103_02 Verify that clicking the user profile icon opens the user options panel": function (browser) {
        profile.TC_1103_02(browser);
    },

    " TC_1103_03 Verify that clicking on the User Profile icon displays the user's Fullname, Username and Email-id of the logged in user": function (browser) {
        profile.TC_1103_03(browser);
    },

    "TC_1103_04 Verify that Logout button is visible in the User Profile": function (browser) {
        profile.TC_1103_04(browser);
    },
   
    "TC_1105_01 Verify that 'Edit settings' link is available in User Profile": function (browser) {
        profile.TC_1105_01(browser);
    },

    "TC_1105_02 Verify that clicking 'Edit settings' opens the settings options": function (browser) {
        profile.TC_1105_02(browser);
       
    },

    "TC_1106 Verify General tab": function (browser) {
        profile.TC_1106(browser);
    },

    "TC_1107 Verify Marking tab": function (browser) {
        profile.TC_1107(browser);
    },




    /** User Story Change language after login */



    "Verify the languages displayed in the user profile menu is ame as the language selected in login page": function (browser) {

        logOut.TC_1091(browser);

    },


    "Verify if the user is able to change the language from the user option menu": function (browser) {

        logOut.TC_1092(browser);

    },

    "Verify if the user is able to close the menu": function (browser) {

        logOut.TC_1093(browser);

    },

    "Verify the text displayed in the application screens is updated": function (browser) {

        logOut.TC_1094(browser);

    },


    /** User Story Change language after login End */



    "Verify the logout confirmation option is turned ON ": function (browser) {

        logOut.TC_1110(browser);

    },


    "Verify if marker is getting an alert message ": function (browser) {

        logOut.TC_1111(browser);

    },


    "Verify and validate the dialog box  ": function (browser) {

        logOut.TC_1113(browser);

    },


    "Verify the logout confirmation option is getting turned OFF ": function (browser) {

        logOut.TC_1114(browser);

    },


    "Verify if marker is not getting an alert message for logging out": function (browser) {

        logOut.TC_1206(browser);

    },

    "Verify if marker is not getting an alert message for logging out": function (browser) {

        logOut.TC_1206(browser);

    },



    "Verify the logout confirmation option is getting turned OFF": function (browser) {

        logOut.TC_1217(browser);

    },


    "Pre Condition (Turn on Ask on log out option for next execution)": function (browser) {

        logOut.turnOnAskOnLogOut(browser);

    },


    //  //Logout
    "Verify the behaviour of option 'NO' in the log out confirmation pop up": function (browser) {

        logOut.TC_636(browser);

    },

    "Verify the login screen after logging out from Assessor3": function (browser) {

        logOut.TC_637(browser);
        browser.end();

    }



   

}
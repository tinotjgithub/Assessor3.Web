var login = require("../../testcases/testlogin.js");
var changelanguage = require("../../testcases/testchangelanguage.js");

module.exports = {
    


    /** User Story Enter username and password  Start **/

    // TC 603 Test case
  "TC_ID 603 Verify the username field": function (browser) {
       login.TC_603(browser);

 },
//    // TC 603 Test case End

    // TC 604 Test case
    "TC_ID 604 Verify the password field": function (browser) {
        login.TC_604(browser);

    },

    // TC 604 Test case End

    // TC 607 Test case Start
    "TC_ID 607 login with with Invalid user name and password": function (browser) {
        login.TC_607_02(browser);

    },


    "TC_ID 607 login with with blank username and password": function (browser) {
        login.TC_607_03(browser);

    },


    "TC_ID 607 login with special charactor": function (browser) {
        login.TC_607_04(browser);

    },


    "TC_ID 607 Valid Login": function (browser) {
        login.TC_607_01(browser);

    },

//    // TC 607 Test case End


//    // TC 608 Test case start

    "TC_ID 608 login with blank username and valid password": function (browser) {
        login.TC_608_01(browser);

    },


    "TC_ID 608 Login with blank ussername and invalid password": function (browser) {
        login.TC_608_02(browser);

    },
    // TC 608 Test case End

    // TC 609 Test case start

    "TC_ID 609 login with valid username and blank password": function (browser) {
        login.TC_609_01(browser);

    },


    "TC_ID 609 Login with invalid username and blank password": function (browser) {
        login.TC_609_02(browser);

    },
//    // TC 609 Test case End


////    // TC 611 Test case start

    "TC_ID 611 Invalid login with enter key": function (browser) {
        login.TC_611_02(browser);

    },

    "TC_ID 611 Valid username and blank password with enter key": function (browser) {
        login.TC_611_03(browser);

    },

    "TC_ID 611 Blank username and valid password with enter key": function (browser) {
        login.TC_611_04(browser);

    },

    "TC_ID 611 Valid login with enter key": function (browser) {
        login.TC_611_01(browser);

    },
//    // TC 611 Test case End

////    // TC 612 Test case start

    "TC_ID 612 Login with invalid username and password": function (browser) {
        login.TC_612_01(browser);

    },

    "TC_ID 612 Login with Valid password and username of different users": function (browser) {
        login.TC_612_02(browser);

    },

    "TC_ID 612 Login with Blank password and special character as username (enter key)": function (browser) {
        login.TC_612_03(browser);

    },

    "TC_ID 612 Login with special charaters in username and password field (enter key)": function (browser) {
        login.TC_612_04(browser);

    },

////    // TC 612 Test case End

////    // TC 614 Test case start

    "TC_ID 614 login time check (clicking on the marking button)": function (browser) {
        login.TC_614_01(browser);

    },


    "TC_ID 614 login time check (Enter key.)": function (browser) {
        login.TC_614_02(browser);

    },

//    // TC 614 Test case End

//    /** User Story Enter username and password  End **/


    /** User Story Customer branding  Start **/

   // TC 708 Test case start

    //"TC_ID 708 Customer branding (Verify the customer logo is showing or not)": function (browser) {
    //    login.TC_708(browser);

    //},

//    // TC 708 Test case End

//    /** User Story Customer branding  End **/




//    /** User Story Authentication failure   Start **/
    "TC_ID 718 Login with valid username and incorrect password": function (browser) {
        login.TC_718_01(browser);

    },


    "TC_ID 718 Login with Invalid username and valid password": function (browser) {
        login.TC_718_02(browser);

    },

    "TC_ID 718 Login with Invalid username and invalid password": function (browser) {
        login.TC_718_03(browser);

    },
    /** User Story Authentication failure   End **/


    "TC_642 Verify if the language selection dropdown is available in login page": function (browser) {
        changelanguage.TC_642_01(browser);

    },

    "TC_643 Verify that on clicking the dropdown box it is opened": function (browser) {
        changelanguage.TC_643_01(browser);

    },

    "TC_642 Verify all the languages available in the dropdown box": function (browser) {
        changelanguage.TC_642_02(browser);

    },

    "TC_643 Verify that language can be changed back to default language": function (browser) {
        changelanguage.TC_643_02(browser);

    },

    "TC_645 Verify that application is launched using cookie settings": function (browser) {
        changelanguage.TC_645_01(browser);

    },

    "TC_645 Verify that application is launched using cookie settings": function (browser) {
        changelanguage.TC_645_01(browser);

    },

    "TC_645 Select different language and check that the login page is displayed in selected language": function (browser) {
        changelanguage.TC_645_02(browser);

    },

    "TC_619 Deletes the cookie and verifies that application is loaded based on default language": function (browser) {
        changelanguage.TC_619_01(browser);
        browser.end();

    }
   

};

//L3 layer containg all the testcases

var signIn = require("../features/login.js");
var homePageLog = require("../features/HomePage.js");
var data = require("../testdata/login.json");
var utilityobj = require("../utilityfunctions/utility.js");
var pageobj = require("../objectrepository/objectrepository.json");
var changeLanguage = require("../features/changeLanguage.js");
module.exports = {



    // Log out

    TC_635: function (browser) {


        objData = utilityobj.getDataParam(browser, data);

        signIn.login(browser, objData.validusername, objData.validpassword);

        // change this
        browser.pause(1000);
        // browser.useXpath()
        browser.click(".menu-button")
        // browser.useCss()
        browser.pause(1000);

        /**Navigate to the user field */
        browser.click(pageobj.userinfo.userImage)
        browser.pause(1000);

        browser.click(pageobj.logOut.logOutButton);
        browser.pause(1000);


        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE004'])
        browser.pause(1000);
        browser.keys(['\uE007'])

        browser.pause(1000);
        browser.verify.visible(pageobj.signIn.username);


        browser.end()


    },


    TC_636: function (browser) {


        /** Turn On ask on log out option **/
        objData = utilityobj.getDataParam(browser, data);

        signIn.login(browser, objData.validusername, objData.validpassword);

        // change this
        browser.pause(1000);
        // browser.useXpath()
        browser.click(".menu-button")
        // browser.useCss()
        browser.pause(1000);

        /**Navigate to the user field */
        browser.click(pageobj.userinfo.userImage)
        browser.pause(1000);
        browser.click(pageobj.userinfo.editSettingsButton)
        browser.pause(1000);

        browser.click(pageobj.logOut.logOutButton);
        browser.pause(1000);


        browser.click(pageobj.logOut.logOutNo);
        browser.pause(1000);

        browser.waitForElementVisible(pageobj.userinfo.userImage,1000);


        browser.end()



    },


    TC_637: function (browser) {


        /** TC ID 1113 validate the dialog box  displayed when user click on the logout button **/
        objData = utilityobj.getDataParam(browser, data);

        signIn.login(browser, objData.validusername, objData.validpassword);

        // change this
        browser.pause(1000);
        // browser.useXpath()
        browser.click(".menu-button")
        // browser.useCss()
        browser.pause(1000);

        /**Navigate to the user field */
        browser.click(pageobj.userinfo.userImage)
        browser.pause(1000);
        browser.click(pageobj.userinfo.editSettingsButton)
        browser.pause(1000);



        browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValue);

        browser.click(pageobj.logOut.logOutButton);
        browser.pause(1000);

        browser.verify.containsText(pageobj.logOut.logOutMeddageText, objData.logOutMessage, 'verify popup message')
        browser.useXpath()
        browser.verify.containsText(pageobj.logOut.logOutMeddageAsk, objData.logOutMeddageAsk, 'verify check box message')
        browser.useCss()
        browser.click(pageobj.logOut.logOutNo);



        browser.click(pageobj.logOut.logOutButton);
        browser.pause(1000);


        browser.click(pageobj.logOut.logOutYes);
        browser.pause(1000);

        browser.verify.visible(pageobj.signIn.username);
        browser.pause(1000);

        signIn.login(browser, objData.validusername, objData.validpassword);

        browser.pause(1000);
        browser.waitForElementVisible(pageobj.userinfo.userImage, 1000);



        browser.end()



    },








    //** User Story Change language after login */

TC_1091: function (browser) {


    /** TC ID 1091 Verify the languages displayed in the user profile menu is same as the language selected in login page**/
    objData = utilityobj.getDataParam(browser, data);

    signIn.launchApplication(browser, objData);

    /**change language in the login page and verify it*/
    changeLanguage.openDropDownBox(browser);
    changeLanguage.selectLanguage(browser, objData.spanish)
    changeLanguage.verifyChangedLanguage(browser, objData.spanish);

    /**Login to the application */
    signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
    browser.click(pageobj.signIn.login);
    browser.pause(1000);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click(".menu-button")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field and check the language drop down*/
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);

    browser.useXpath()
    browser.waitForElementPresent(pageobj.userinfo.spanishLanMenu, 1000);
   browser.useCss()

   browser.end()
},


TC_1092: function (browser) {


    /** TC ID 1092 Verify if the user is able to change the language from the user option menu**/
    objData = utilityobj.getDataParam(browser, data);

    signIn.launchApplication(browser, objData);

    /**change language in the login page and verify it*/
    changeLanguage.openDropDownBox(browser);
    changeLanguage.selectLanguage(browser, objData.spanish)
    changeLanguage.verifyChangedLanguage(browser, objData.spanish);

    /**Login to the application */
    signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
    browser.click(pageobj.signIn.login);
    browser.pause(1000);


    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);


    /**Navigate to the user field and check the language drop down*/
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);
    
    browser.useXpath()
    browser.waitForElementPresent(pageobj.userinfo.spanishLanMenu, 1000);
    browser.useCss()

    /**Change the language from the user field and verify it*/
    browser.click(pageobj.userinfo.languageField)
    changeLanguage.selectLanguage(browser, objData.english)
   
    browser.useXpath()
    browser.waitForElementPresent(pageobj.userinfo.englisgLanMenu, 1000);
    browser.useCss()

    browser.verify.containsText(pageobj.userinfo.userNameText, objData.userNameField, 'Checking user name field')

    browser.verify.containsText(pageobj.signIn.logOutButton, objData.logOutText, 'Checking the log out button text')

    browser.end()
},



TC_1093: function (browser) {


    /** TC ID 1093 Verify if the user is able to close the menu **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);


    /**click out side of the user field and verify the user field is closed*/
    browser.click(pageobj.userinfo.notificationicon)
    browser.pause(1000);
    browser.waitForElementPresent(pageobj.userinfo.editSettingsButton, 1000);
    browser.end()
},


TC_1094: function (browser) {


    /** TC ID 1094 Verify the text displayed in the application screens is updated **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.launchApplication(browser, objData);

    /**change language in the login page and verify it*/
    changeLanguage.openDropDownBox(browser);
    changeLanguage.selectLanguage(browser, objData.spanish)
    changeLanguage.verifyChangedLanguage(browser, objData.spanish);

    /**Login to the application */
    signIn.enterUsernameAndPassword(browser, objData.validusername, objData.validpassword);
    browser.click(pageobj.signIn.login);
    browser.pause(1000);


    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);


    /**Navigate to the user field and check the language drop down*/
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);
    
    browser.useXpath()
    browser.waitForElementPresent(pageobj.userinfo.spanishLanMenu, 1000);
    browser.useCss()

    /**Change the language from the user field and verify it*/
    browser.click(pageobj.userinfo.languageField)
    changeLanguage.selectLanguage(browser, objData.english)
   
    browser.useXpath()
    browser.waitForElementPresent(pageobj.userinfo.englisgLanMenu, 1000);
    browser.useCss()

    browser.verify.containsText(pageobj.userinfo.userNameText, objData.userNameField, 'Checking user name field')

    browser.verify.containsText(pageobj.signIn.logOutButton, objData.logOutText, 'Checking the log out button text')


    
    browser.end()
},







    /** user story ask on log out */


TC_1110: function (browser) {


    /** TC ID 1110 Verify the logout confirmation option is turned ON by default**/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);
    
    // change this
    browser.pause(1000);
   // browser.useXpath()
    browser.click("#qigSelectorDropdown")
  //  browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValue);


    browser.end()
},



TC_1111: function (browser) {


    /** TC ID 1111 Verify if marker is getting an alert message for logging out **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
   // browser.useXpath()
    browser.click("#qigSelectorDropdown")
   // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValue);

    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);

    browser.verify.containsText(pageobj.logOut.logOutMeddageText, objData.logOutMessage, 'verify popup message')

    browser.click(pageobj.logOut.logOutYes);
    browser.pause(1000);


    browser.end()
},




TC_1113: function (browser) {


    /** TC ID 1113 validate the dialog box  displayed when user click on the logout button **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValue);

    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);

    browser.verify.containsText(pageobj.logOut.logOutMeddageText, objData.logOutMessage, 'verify popup message')
    browser.useXpath()
    browser.verify.containsText(pageobj.logOut.logOutMeddageAsk, objData.logOutMeddageAsk, 'verify check box message')
    browser.useCss()
    browser.click(pageobj.logOut.logOutNo);



    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);


    browser.click(pageobj.logOut.logOutYes);
    browser.pause(1000);

    browser.verify.visible(pageobj.signIn.username);



    browser.end()
},



TC_1114: function (browser) {


    /** TC ID 1114 Verify the logout confirmation option is getting turned OFF **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



    browser.click(pageobj.userinfo.toggleSwitch)
    browser.pause(1000);

    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValueFalse);

    //pre condition turn on the log out conformation.
    browser.click(pageobj.userinfo.toggleSwitch)
    browser.pause(1000);

    browser.end()

},


TC_1206: function (browser) {


    /** TC ID 1114 Verify the logout confirmation option is getting turned OFF **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);


    browser.click(pageobj.userinfo.toggleSwitch)
    browser.pause(1000);

    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValueFalse);

    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);

    browser.verify.visible(pageobj.signIn.login);

    browser.end()

},





TC_1217: function (browser) {


    /** TC ID 1206 Verify the logout confirmation option is getting turned ON  **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



    browser.click(pageobj.userinfo.toggleSwitch)
    browser.expect.element(pageobj.userinfo.logOutStatus).to.have.attribute(pageobj.userinfo.logOutStatusAttribute).which.contains(pageobj.userinfo.logOutStatusAttributeValue);

    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);

    browser.verify.containsText(pageobj.logOut.logOutMeddageText, objData.logOutMessage, 'verify popup message')

    browser.useXpath()
    browser.verify.containsText(pageobj.logOut.logOutMeddageAsk, objData.logOutMeddageAsk, 'verify check box message')
    browser.click(pageobj.logOut.logOutMeddageAsk)
    browser.useCss()



    browser.click(pageobj.logOut.logOutNo);

    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);
    browser.verify.visible(pageobj.signIn.username);


    browser.end()




},



turnOnAskOnLogOut: function (browser) {


    /** Turn On ask on log out option **/
    objData = utilityobj.getDataParam(browser, data);

    signIn.login(browser, objData.validusername, objData.validpassword);

    // change this
    browser.pause(1000);
    // browser.useXpath()
    browser.click("#qigSelectorDropdown")
    // browser.useCss()
    browser.pause(1000);

    /**Navigate to the user field */
    browser.click(pageobj.userinfo.userImage)
    browser.pause(1000);
    browser.click(pageobj.userinfo.editSettingsButton)
    browser.pause(1000);



   
    browser.click(pageobj.userinfo.toggleSwitch)
    browser.pause(1000);
    browser.click(pageobj.logOut.logOutButton);
    browser.pause(1000);


    browser.click(pageobj.logOut.logOutYes);
    browser.pause(1000);


    browser.end()




},


    


};

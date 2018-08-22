
var pageobj = require("../objectrepository/objectrepository.json");
var objOR = (pageobj.signIn);

var TCname;

module.exports = {

    /** Launch browser and navigate to the app url **/
    launchApplication: function (browser, objData) {
        console.log(objData.URL);
        browser
              .windowMaximize()       
              .url(objData.URL)              
        browser.pause(4000);
      //  browser.verify.visible(objOR.username);
    },



    /** This will verify the user name and password field and enter data. **/
    enterUsernameAndPassword: function (browser,username,password) {




        browser.waitForElementPresent(objOR.username, 10000);
        //browser.pause(5000);
        browser.clearValue(objOR.username)
        browser.setValue(objOR.username, username)

        browser.clearValue(objOR.password)
        browser.setValue(objOR.password, password)

    },

    /** verify the customar logo. **/
    customerBranding: function (browser, logoText) {

        browser.pause(1000);
        browser.verify.visible(objOR.customerLogo);
        browser.expect.element(objOR.customerLogo).to.have.attribute('alt').which.contains(logoText);



    },

    /** verify text. **/
    verifyText: function (browser, elementID, VerificationText) {

        browser.getText(elementID, function (result) {
            var result = result.value;
            console.log(result)


        });

    },


    /** Log out. **/
    logOut: function (browser) {

        browser.click(pageobj.userinfo.userImage);
        browser.pause(2000);
        browser.click(objOR.logOutButton);
        browser.pause(2000);
        browser.click(objOR.logOutYes);
    },

     
    login: function (browser, username, password) {

        this.launchApplication(browser, objData);
        this.enterUsernameAndPassword(browser, username, password);
        browser.click(objOR.login);
        browser.pause(1000);

    }




}







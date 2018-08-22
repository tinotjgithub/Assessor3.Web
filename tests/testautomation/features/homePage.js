
var pageobj = require("../objectrepository/objectrepository.json");
var objOR = (pageobj.signIn);

var TCname;

module.exports = {




    /** Log out. **/
    logOut: function (browser) {

        /**Navigate to the user field */
        browser.click(pageobj.userinfo.userImage)
        browser.pause(1000);
        browser.click(pageobj.userinfo.editSettingsButton)
        browser.pause(1000);






        browser.getAttribute(pageobj.userinfo.logOutStatus, pageobj.userinfo.logOutStatusAttribute, function (result) {

            (result.value);


            if (result.value == "false") {
                console.log("False " + result.value);

                browser.click(pageobj.logOut.logOutButton);
                browser.pause(1000);

            } else {
                console.log("true " + result.value);


                browser.click(pageobj.logOut.logOutButton);
                browser.pause(1000);

                browser.click(pageobj.logOut.logOutYes);
                browser.pause(1000);
            }





        });


    },


    /**Change language. **/
    languageChange: function (browser, language) {


        browser.click(".sprite-icon.menu-arrow-icon");
        browser.useXpath();
        browser.verify.visible(language);
        browser.click(language);
        browser.useCss();
    },



    /**Click on the qig button. **/
    selectQig: function (browser, qigName, button) {

       // browser.pause(4000);
        //  browser.click(pageobj.livemarking.qigdropdown);

       

        //browser.getAttribute(pageobj.hint.qigOpenClose, "class", function (result1) {

        // //   console.log(result1)

        //    if (result1.value == pageobj.hint.qigStatusClassName) {


        //        browser.click(pageobj.livemarking.qigdropdown);
        //    }

        //});



    //    browser.pause(4000);
        browser.useXpath();

        browser.click("//*[@id='content']/div/div/div/header/div[1]/div/input");
         browser.pause(4000);

        browser.getAttribute("//span[text()='"+qigName+"']", "id", function (result) {

          //  console.log(result.value);
            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");

            str = str.substring(0, lastIndex);

         //   console.log(str);
            browser.click("//*[@id='"+str+"_button']/div/a/span[2]")
            browser.useCss()
            //browser.pause(5000);

        });

    },



    randomText: function (number) {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < number; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
    },






    /**verify hint message**/
    verifyHintMessage: function (browser, objID, hintMessage) {


        browser.pause(1000);
        browser.useXpath()
        browser.getText(objID, function (result) {

            this.assert.equal(result.value, hintMessage);

        });
        browser.useCss()

    },








}







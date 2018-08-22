//L3 layer containg all the testcases

var signIn = require("../features/login.js");
var homePageLog = require("../features/HomePage.js");
var data = require("../testdata/login.json");
var utilityobj = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var changeLanguage = require("../features/changeLanguage.js");
var homePageData = require("../testdata/homePage.json");
var tileViewFeature = require("../features/liveworklist.js");

module.exports = {



    //User Story Simple tile view.

    detailViewAndTileViewSwitching: function (browser) {


        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(3000);
        //Select a qig
        homePageLog.selectQig(browser, objDataHomepage.tileViewResponse, "mark");
        browser.pause(3000);


        //Verify that the simple view is showing when the user login
        browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;
        browser.pause(2000);

        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");





        //Switch the grid to tile view
        tileViewFeature.switchView(browser, "tile");

        browser.end();

    },



    rememberGridView: function (browser) {


        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(4000);
        //Select a qig
        homePageLog.selectQig(browser, objDataHomepage.tileViewResponse, "mark");
        browser.pause(3000);

        //Verify that the simple view is showing when the user login
        browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;


        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");
        browser.pause(6000);
        signIn.logOut(browser);
        browser.pause(2000);
        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(8000);
        browser.expect.element(objRepo.tileview.tileViewDetail).to.be.visible;

        //Switch the grid to tile view (ore condition for next test case)
        tileViewFeature.switchView(browser, "tile");


        browser.end();



    },



    checkGridContent: function (browser) {


        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(4000);

      //  Select a qig
        homePageLog.selectQig(browser, objDataHomepage.tileViewResponse, "mark");
        browser.pause(3000);


        //Verify that the simple view is showing when the user login
      browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;



      tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.responseData, "dtup", objDataHomepage.responseDataDate);

      tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.responseMarkingNotStarted, "dtup", objDataHomepage.responseMarking);

      tileViewFeature.tileViewColourCheck(browser, objRepo.tileview.colourCheckTile, objDataHomepage.colourCodeTile);



        //Switch the grid to detailed view
    tileViewFeature.switchView(browser, "");


    tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.responseData, "dtup", objDataHomepage.responseDataDate);

    tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.responseMarkingNotStarted, "dtup", objDataHomepage.responseMarking);

      //  Switch the grid to tile view
        tileViewFeature.switchView(browser, "tile");

        browser.pause(2000);
        //open worklist
        //browser.useXpath();
        //browser.click(objRepo.tileview.openResponseOpen);
        //browser.useCss();
        //browser.pause(2000);
        //browser.verify.containsText(objRepo.tileview.responseOpenMessageCheck, objDataHomepage.responseCheckMessage);

       
        browser.end();

    },





//***********************************************************************************************************************************
    //User story View closed response list.
     CloseddetailViewAndTileViewSwitching: function (browser) {


         objData = utilityobj.getDataParam(browser, data);
         objDataHomepage = utilityobj.getDataParam(browser, homePageData);

         signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
         browser.pause(4000);

     // if closed tab switching is needed.
        browser.click(objRepo.tileview.closedResponseTab);

        browser.pause(2000);
        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");

        //Switch the grid to tile view
        tileViewFeature.switchView(browser, "tile");

        browser.end();

    },





    ClosedcheckGridContent: function (browser) {


        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(4000);

        browser.click(objRepo.tileview.closedResponseTab);
        browser.pause(3000);
        //Verify that the simple view is showing when the user login
        browser.expect.element(objRepo.tileview.tileGridClosed).to.be.visible;


        tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.closedResponseData, "dtsubmit", objDataHomepage.closedResponseCheck);



        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");
        browser.pause(2000);

        tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.closedResponseData, "dtsubmit", objDataHomepage.closedResponseCheck);

        //  Switch the grid to tile view
        tileViewFeature.switchView(browser, "tile");

        browser.pause(2000);
        //open worklist
        //browser.useXpath();
        //browser.click(objRepo.tileview.openResponseClosed);
        //browser.useCss();
        //browser.pause(2000);
        //browser.verify.containsText(objRepo.tileview.responseOpenMessageCheck, objDataHomepage.responseCheckMessage);



        browser.end();

    },



    checkDefaultOrder: function (browser) {

        

        objData = utilityobj.getDataParam(browser, data);
        objDataHomepage = utilityobj.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
        browser.pause(4000);

        browser.click(objRepo.tileview.closedResponseTab);
        browser.pause(3000);
        
     
        

        browser.elements('xpath', objRepo.tileview.closedListViewTable, function (result) {
            console.log("RESULT length:" + result.value.length);
            //   var responseArray = new Array();

            //  var responseArray = ["6363845", "6376683", "6977219", "671689", "6409995", "6767319", "6723138", "6522451", "6552837"];           
            var responseArray = (objDataHomepage.responseArr);

            for (var i = 0; i < result.value.length; i++) {

                function getText(i) {

                    browser.getText("#res_" + i + "_ResponseIdColumn_0", function (result) {

                        var str = (result.value);


                        //    console.log("Check " + str + " = " + responseArray[i]);

                        browser.verify.equal(str, responseArray[i]);

                    });
                }(i)

                getText(i);
                 

            }
        });



        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");
        browser.pause(2000);




        browser.end();

    },



    //User Story Simple tile view.

    switchTileView: function (browser) {


    objData = utilityobj.getDataParam(browser, data);
    objDataHomepage = utilityobj.getDataParam(browser, homePageData);

    signIn.login(browser, objDataHomepage.tileWorklistUser, objDataHomepage.tileWorklistUserPass);
    browser.pause(3000);
        //Select a qig
    homePageLog.selectQig(browser, objDataHomepage.tileViewResponse, "mark");
    browser.pause(2000);


        
    browser.useXpath();
    browser.getAttribute(objRepo.tileview.tileSwitchButtonSwitch, "class", function (result) {



        if (result.value == objRepo.tileview.buttonValueSwitch) {

            ////Switch the grid to tile view
            //browser.useCss();
            //browser.click(objRepo.tileview.viewSwitch);
            //browser.pause(3000);

        } else {

            //Switch the grid to tile view
            browser.useCss();
            browser.click(objRepo.tileview.viewSwitch);
            browser.pause(3000);
        }

    });




  


    browser.end();

}

   



};

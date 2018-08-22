var live        = require("../../testcases/testlivemarking.js");
var wlsidepanel = require("../../testcases/testworklistsidepanel.js");
var qig = require("../../testcases/testqig.js");
var signIn = require("../../features/login.js");
var logindata   = require("../../testdata/login.json");
var utilityobj = require("../../utilityfunctions/utility.js");

var objRepo = require("../../objectrepository/objectrepository.json");
var data = require("../../testdata/login.json");
var testmarkerinformation = require("../../testcases/testmarkerinformation.js");
var testworklistsupervisorinformation = require("../../testcases/testworklistsupervisorinformation.js");
var worklistuserinformation = require("../../testdata/worklistuserinformation.json");
var changelanguage = require("../../features/changelanguage");




module.exports = {
  
    
//*************************Marking target indicator test cases starts here
    //************************************************************************************************
  //  //***************************************************************************************************
  ////////  A3AQ_maasher21,Computer12,xxAQA UNSTRUCTUR/xx19,2213AQA UNSTRUCTUR Whole
        "TC_1465 worklist indicator showing livemarking targetdate_exceeded and pending days zero until": function (browser) {
           
          
       objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, objData.worklistliveusername1, objData.worklistlivepassword1);
              
        wlsidepanel.livemarkingMarkingIndicator_targetdate_exceeded_zerountil(browser)
      browser.end();
          
    },

//   //// A3AQ_selijah23,Computer12,wwAQA UNSTRUCTUR/ww19,222AQA UNSTRUCTUR Whole Paper
   

        "TC_1466 worklist indicator showing livemarking fullsubmitted_zero util": function (browser) {
         
         
            signIn.login(browser, objData.worklistliveusername3, objData.worklistlivepassword3);
            wlsidepanel.livemarkingMarkingIndicator_fullsubmitted_zerountil(browser)
            browser.end();

    },

  ////  //A3AQ_zruth16,COmputer12,xxAQA UNSTRUCTUR/xx19,2213AQA UNSTRUCTUR Whole
        "TC_1465 worklist indicator showing livemarking target future targetdate with open, close,in grace validation": function (browser) {
      
            signIn.login(browser, objData.worklistliveusername2, objData.worklistlivepassword2);
            wlsidepanel.livemarkingMarkingIndicator_futuretargetdate(browser)
           browser.end();
        },

  //  //A3AQ_aizabellep26,COmputer12,xxAQA UNSTRUCTUR/xx19,2213AQA UNSTRUCTUR Whole
        "TC_1465 worklist indicator showing livemarking target future targetdate for validating pending days": function (browser) {
        

            signIn.login(browser, objData.worklistliveusername5, objData.worklistlivepassword5);
            wlsidepanel.livemarkingMarkingIndicator_pendingdays(browser)
            browser.end();
        },

    ////awaiting approval case invalid
    ////A3AQ_pnathaniel22,COmputer12,wwAQA UNSTRUCTUR/ww19,222AQA UNSTRUCTUR Whole Paper
    //    "TC_1469 worklist indicator showing livemarking marker not approved": function (browser) {
            
          
    //            signIn.login(browser, objData.worklistliveusername6, objData.worklistlivepassword6);
    //           wlsidepanel.livemarkingMarkingIndicator_awatingapproval(browser)
    //           browser.end();
    //    },
            
   // A3AQ_selijah23,COmputer12,EEAQA UNSTRUCTUR/EE19,ATAQA UNSTRUCTUR Whole Paper
        "TC_1606 worklist indicator showing livemarking no live response but available in pool": function (browser) {
          

                signIn.login(browser, objData.worklistliveusername3, objData.worklistlivepassword3);
                wlsidepanel.livemarkingMarkingIndicator_liveresponseavailableinpool(browser)
                browser.end();
            
        },


  //  ////A3AQ_aesther24,COmputer12,wwAQA UNSTRUCTUR/ww19,222AQA UNSTRUCTUR Whole Paper
  //   //   "TC_1522 worklist indicator marker withdrawn from qig": function (browser) {

  //   //           signIn.login(browser, objData.worklistliveusername4, objData.worklistlivepassword4);
  //   //           wlsidepanel.livemarkingMarkingIndicator_noQig(browser)

    ////A3AQ_aesther24,COmputer12,wwAQA UNSTRUCTUR/ww19,222AQA UNSTRUCTUR Whole Paper
    //    "TC_1522 worklist indicator marker withdrawn from qig": function (browser) {
    //        objData = utilityobj.getDataParam(browser, logindata);
    //        if (process.argv[4] == "AQA") {
    //            signIn.login(browser, objData.worklistliveusername4, objData.worklistlivepassword4);
    //            wlsidepanel.livemarkingMarkingIndicator_noQig(browser)

    //        }

     //},


    //*************************Marking target indicator test cases ends here
    //************************************************************************************************
    //***************************************************************************************************



////    // ----------------------------------------------------- Test cases for Marker Information Panel starts here -----------------------------------------------------

//////    /* Log in as Assistant Examiner who is not approved. */
//        "TC_1493_01 Verify whether the personal information loads": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.markerinformation.testAEUserName, worklistuserinformation.markerinformation.testAEPassword);

//            browser.pause(5000)
//            browser.useXpath()
//                .click(objRepo.qig.qigdropdown).pause(2000)
//            browser.useCss()
//                .click(objRepo.markerinformation.markButton)
//                .pause(1000);

//            testmarkerinformation.TC_1493_01(browser);
//        },

//        "TC_1493_03 Verify whether the user's role loads": function (browser) {
//            testmarkerinformation.TC_1493_02(browser);
//        },

//        "TC_1493_04 Verify whether the user's approval status loads": function (browser) {
//            testmarkerinformation.TC_1493_03(browser);
//        },

//        "TC_1494_01 Verify whether the user's role for an AE is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_01(browser);
//        },

//        "TC_1494_02 Verify whether the user's approval status(Not Approved) is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_02(browser);
//        },

//        "TC_1494_02(B) Verify whether the user's approval status(Not Approved) and AE Role is translatable(Spanish)": function (browser) {

//            // changing the language to spanish.
//            changelanguage.changeLanguageFromUserOption(browser, "Spanish");

//            testmarkerinformation.TC_1494_02_B(browser);

//            // change the language back to english.        
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_02(C) Verify whether the user's approval status(Not Approved) and AE Role is translatable(French)": function (browser) {

//            // changing the language to spanish.
//            changelanguage.changeLanguageFromUserOption(browser, "French");

//            testmarkerinformation.TC_1494_02_C(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_03 Verify whether the user's approval status(Not Approved) css loads correctly": function (browser) {
//            testmarkerinformation.TC_1494_03(browser);
//        },

//    /* Log out and re-login as PE who is approved. */
//        "TC_1493_01 Verify whether the personal information for a PE loads": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.markerinformation.testPEUserName, worklistuserinformation.markerinformation.testPEPassword);

//            //browser.pause(5000)
//            //browser.useXpath()
//            //    .click(objRepo.qig.qigdropdown).pause(2000)
//            //browser.useCss()
//            //    //.click(objRepo.markerinformation.markButton)
//                //.pause(1000);
//            browser.pause(5000);
//            testmarkerinformation.TC_1493_01(browser);
//        },

//        "TC_1494_04 Verify whether the user's role for an PE is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_04(browser);
//        },

//        "TC_1494_05 Verify whether the user's approval status(Approved) is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_05(browser);
//        },

//        "TC_1494_05(B) Verify whether the user's approval status(Approved) and PE Role is translatable(Spanish)": function (browser) {

//            // changing the language to spanish.
//            changelanguage.changeLanguageFromUserOption(browser, "Spanish");

//            testmarkerinformation.TC_1494_05_B(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_05(C) Verify whether the user's approval status(Approved) and PE Role is translatable(French)": function (browser) {

//            // changing the language to french.
//            changelanguage.changeLanguageFromUserOption(browser, "French");

//            testmarkerinformation.TC_1494_05_C(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_06 Verify whether the user's approval status(Approved) css loads correctly": function (browser) {
//            testmarkerinformation.TC_1494_06(browser);
//        },

//    /* Log out and re-login as a TL. */
//        "TC_1493_01 Verify whether the personal information for a TL loads": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.markerinformation.testTLUserName, worklistuserinformation.markerinformation.testTLPassword);

//            //browser.pause(5000)
//            //browser.useXpath()
//            //    .click(objRepo.qig.qigdropdown).pause(2000)
//            //browser.useCss()
//            //    .click(objRepo.markerinformation.markButton)
//            //    .pause(1000);
//            browser.pause(5000);
//            testmarkerinformation.TC_1493_01(browser);
//        },

//        "TC_1494_07 Verify whether the user's role for a TL is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_07(browser);
//        },

//        "TC_1494_07(B) Verify whether the user's TL Role is translatable(Spanish)": function (browser) {

//            // changing the language to spanish.
//            changelanguage.changeLanguageFromUserOption(browser, "Spanish");

//            testmarkerinformation.TC_1494_07_B(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_07(C) Verify whether the user's TL Role is translatable(French)": function (browser) {

//            // changing the language to french.
//            changelanguage.changeLanguageFromUserOption(browser, "French");

//            testmarkerinformation.TC_1494_07_C(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//    /* Log out and re-login as a suspended marker. */
//        "TC_1493_01 Verify whether the personal information for a suspended marker loads": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.markerinformation.testSuspendedUserName, worklistuserinformation.markerinformation.testSuspendedPassword);

//            //browser.pause(5000)
//            //browser.useXpath()
//            //    .click(objRepo.qig.qigdropdown).pause(2000)
//            //browser.useCss()
//            //    .click(objRepo.markerinformation.markButton)
//            //    .pause(1000);
//            browser.pause(5000);
//            testmarkerinformation.TC_1493_01(browser);
//        },

//        "TC_1494_08 Verify whether the user's approval status(Suspended) is displayed as expected": function (browser) {
//            testmarkerinformation.TC_1494_08(browser);
//        },

//        "TC_1494_08(B) Verify whether the user's approval status(Suspended) is translatable(Spanish)": function (browser) {

//            // changing the language to spanish.
//            changelanguage.changeLanguageFromUserOption(browser, "Spanish");

//            testmarkerinformation.TC_1494_08_B(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_08(C) Verify whether the user's approval status(Suspended) is translatable(French)": function (browser) {

//            // changing the language to french.
//            changelanguage.changeLanguageFromUserOption(browser, "French");

//            testmarkerinformation.TC_1494_08_C(browser);

//            // change the language back to english.
//            changelanguage.changeLanguageFromUserOption(browser, "English");
//        },

//        "TC_1494_09 Verify whether the user's approval status(Suspended) css loads correctly": function (browser) {
//            testmarkerinformation.TC_1494_09(browser);
//        },

//    //// ----------------------------------------------------- Test cases for Marker Information Panel ends here -----------------------------------------------------

//    //// ----------------------------------------------------- Test cases for Supervisor Information Panel starts here -----------------------------------------------------    

//        "TC_1506_01 Verify if the supervisor information section is rendered when login as AE": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.supervisorinformation.testAEUserName, worklistuserinformation.supervisorinformation.testAEPassword);

//            browser.pause(5000)
//            browser.useXpath()
//                .click(objRepo.qig.qigdropdown).pause(2000)
//            browser.useCss()
//                .click(objRepo.markerinformation.markButton)
//                .pause(1000);
//            testworklistsupervisorinformation.TC_1506_01(browser);
//        },

//        "TC_1506_02 Verify if the supervisor name is rendered correctly while login as AE": function (browser) {
//            testworklistsupervisorinformation.TC_1506_02(browser);
//        },

//        "TC_1506_01 Verify if the supervisor information section is rendered while login as TL": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.supervisorinformation.testTLUserName, worklistuserinformation.supervisorinformation.testTLPassword);

//            browser.pause(5000);
//            //browser.useXpath()
//            //    .click(objRepo.qig.qigdropdown).pause(2000)
//            //browser.useCss()
//            //browser.pause(5000)
//                //.click(objRepo.markerinformation.markButton)
//                //.pause(1000);
//            testworklistsupervisorinformation.TC_1506_01(browser);
//            browser.pause(5000);
//        },

//        "TC_1506_03 Verify if the supervisor name is rendered correctly while login as TL": function (browser) {
//            testworklistsupervisorinformation.TC_1506_03(browser);
//        },

//        "TC_1506_04 Verify if the supervisor information section is not rendered while login as PE": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.supervisorinformation.testPEUserName, worklistuserinformation.supervisorinformation.testPEPassword);

//            browser.pause(5000);
//            //browser.useXpath()
//            //    .click(objRepo.qig.qigdropdown).pause(2000)
//            //browser.useCss()
//            //browser.pause(5000)
//            //    .click(objRepo.markerinformation.markButton)
//            //    .pause(1000);
//            //browser.pause(5000);
//            testworklistsupervisorinformation.TC_1506_04(browser);
//            browser.pause(5000);
//        },

//        "TC_1507_01 Verify if the send message is visible in the supervisor information section when login as AE": function (browser) {
//            objData = utilityobj.getDataParam(browser, data);
//            signIn.login(browser, worklistuserinformation.supervisorinformation.testAEUserName, worklistuserinformation.supervisorinformation.testAEPassword);

//            browser.pause(5000)
//            browser.useXpath()
//                .click(objRepo.qig.qigdropdown).pause(2000)
//            browser.useCss()
//                .click(objRepo.markerinformation.markButton)
//                .pause(1000);
//                browser.pause(5000);
//            testworklistsupervisorinformation.TC_1507_01(browser);
//            browser.pause(5000);
//        },

//        "TC_1508_01 Verify if the online status indicator is visible in the supervisor information section when login as AE": function (browser) {
//            testworklistsupervisorinformation.TC_1508_01(browser);
//        },

//        "TC_1508_02 Verify if the online status indicator is showing the text as online in the supervisor information section when login as AE": function (browser) {
//            testworklistsupervisorinformation.TC_1508_02(browser);
//            browser.end();
//        },

////    // ----------------------------------------------------- Test cases for Supervisor Information Panel ends here --------------------------------------------------

   


}
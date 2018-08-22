var qig = require("../../testcases/testqig.js");
var refactorQig = require("../../testdata/refactorQig.json");
var login = require("../../testdata/login.json");
var utilityobj = require("../../utilityfunctions/utility.js");
var signIn = require("../../features/login.js");

module.exports = {

    //*************************************************************************************************************************************
    //                                        RefactorQigList Testcase starts here
    //*************************************************************************************************************************************

    ////ATMathSP2TZ0XXXX-AT-Math
    ////A3IB_nseena8 / 8
    ////ATMathSP2TZ0XXXX
    "verify qig in awaiting standardisation status": function (browser) {
        objData = utilityobj.getDataParam(browser, login);
        signIn.login(browser, refactorQig.userinformation.testAwaitingUserName, refactorQig.userinformation.testAwaitingPassword);
        qig.verifyQigListforAwaitingResponse(browser)


    },


    "verify qig in simulation status": function (browser) {
        qig.verifyQigListforSimulationResponse(browser)


    },
   
    "verify qig in Practise status": function (browser) {
        qig.verifyQigListforPractiseResponse(browser)


    },
    "verify qig in standardisation status": function (browser) {
       
        qig.verifyQigListforStandardisationResponse(browser)



    },

   
    "verify qig in Live Complete status": function (browser) {
        qig.verifyQigListforLiveCompleteResponse(browser)

        browser.end();
    },


 

  
    "verify qig in 2nd standardisation status": function (browser) {

        signIn.login(browser, refactorQig.userinformation.teststandUserName, refactorQig.userinformation.teststandPassword);
        qig.verifyQigListfor2ndStandardisationResponse(browser)


    },
      
    "verify qig in quality feedback status with open response": function (browser) {

        qig.verifyQigListforQualityFeedbackResponse(browser)

    },



    "verify qig in suspended status with open response": function (browser) {

        qig.verifyQigListforSuspendedResponse(browser)
        browser.end();

    },


    "verify qig in STM standardisation status": function (browser) {
        signIn.login(browser, refactorQig.userinformation.testSTMUserName, refactorQig.userinformation.testSTMPassword);
        qig.verifyQigListforSTMResponse(browser)


    },
    //    ////A3IB_nseena8 / 8
    //    //ATremarkCntTZ0XXXX-AT-RemarkCnt
    //    //ATremarkCntTZ0XXXX

    //    "verify qig in awaiting approval status": function (browser) {
    //        verifyQigSelectionanywhereInPanel
    //        verifyTitle
    //        verifyQigListStatus - "awaiting approval"
    //        verifyTextColor - "Red"
    //        verifyProgressbar - "No"
    //        verifyTarget - "No Target"
    //        verifyTargetDate - "No TargetDate"
    //        verifyIndicator - "No indicator"

    //    },
   
    "verify qig in  Live Marking status - pool indicator only": function (browser) {
        qig.verifyQigListforLiveOnlyInPoolResponse(browser)


    },


    "verify qig in  Live Marking status - open indicator only": function (browser) {
        qig.verifyQigListforLiveInOpenResponse(browser)

    },

 
    "verify qig in  Live Marking status with no indicator": function (browser) {
        qig.verifyQigListforLiveNoIndicatorResponse(browser)
        browser.end();

    },





    //    //login as TL
    //    "verify message in qig box with no_Qig selected": function (browser) {
    //       "please select"

    //    },

    //    //**************************REG******************************************

    //    "verify alphabetic order for a multiqig selection": function (browser) {


    //    },


    //    "verify spacing between qigs  for a multiqig ": function (browser) {


    //    },


    //    "verify Mark button not available in the Qig": function (browser) {


    //    },


    //    "verify cheveron indicator pointed at the right end": function (browser) {


    //    },




    //    //verifyProgressbarWidth
    //    //verifyProgressbarcolor(closed,grace,open,pool)



    //    //*************************************************************************************************************************************
    //    //                                        RememberQig Testcase starts here
    //    //*************************************************************************************************************************************
    //    "verify RememberQig in user logout": function (browser) {
    //        objData = utilityobj.getDataParam(browser, login);
    //        qig.RememberQig_userlogout(browser);
    //    },
    //    "verify RememberQig in user Re-login": function (browser) {
    //        qig.RememberQig_Relogin(browser)

    //    },

    //    "verify RememberQig for unsuccessful logout": function (browser) {

    //        qig.verifyrememberQig_unsuccesslogout(browser);
    //    },
    //    "verify RememberQig for unsuccessful logout in secondlogin": function (browser) {

    //        qig.verifyrememberQig_secondlogin(browser, "physiSP2ENGTZ1XXXX-PHYSICS SL PAPER II", objData.awaitingnosimusername, objData.awaitingnosimpassword);
    //        browser.end();
    //    },

    //    "verify selectedqig for first time login": function (browser) {

    //        qig.selectqigfirstlogin(browser);

    //    },

    //    "verify selectedqig in secondlogin _ no prior qig selection": function (browser) {

    //        qig.verifyrememberQig_secondlogin(browser, "Select QIG", objData.livepoolusername, objData.livepoolpassword);
    //        browser.end();
    //    }
    //    //*************************************************************************************************************************************
    //    //                                        RememberQig Testcase starts here
    //    //*************************************************************************************************************************************
    //"verify RememberQig in user logout": function (browser) {
    //    objData = utilityobj.getDataParam(browser, login);
    //   // qig.RememberQig_userlogout(browser);
    //},
    //"verify RememberQig in user Re-login": function (browser) {
    //    qig.RememberQig_Relogin(browser)

    //},

    //"verify RememberQig for unsuccessful logout": function (browser) {

    //    qig.verifyrememberQig_unsuccesslogout(browser);
    //},
    //"verify RememberQig for unsuccessful logout in secondlogin": function (browser) {

    //    qig.verifyrememberQig_secondlogin(browser, "physiSP2ENGTZ1XXXX-PHYSICS SL PAPER II", objData.awaitingnosimusername, objData.awaitingnosimpassword);
    //    browser.end();
    //},

    //"verify selectedqig for first time login": function (browser) {

    //    qig.selectqigfirstlogin(browser);

    //},

    //"verify selectedqig in secondlogin _ no prior qig selection": function (browser) {

    //    qig.verifyrememberQig_secondlogin(browser, "please select", objData.livepoolusername, objData.livepoolpassword);
    //    browser.end();
    //},

    //    //********************************************************************************************************************
    //    //                                                  Remember Qig testcase ends here
    //    //**********************************************************************************************************************

    //    //********************************************************************************************************************
    //    //                                                  Remember Qig testcase ends here
    //    //**********************************************************************************************************************







}

//  //
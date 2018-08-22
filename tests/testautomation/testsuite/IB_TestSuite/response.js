var logindata = require("../../testdata/login.json");
var testdata = require("../../testdata/response.json");
var utilityobj = require("../../utilityfunctions/utility.js");
var signIn = require("../../features/login.js");
var testresponse = require("../../testcases/testresponse.js");

module.exports = {

    "verify Image Displayed in muliple pages and stitched model -In worklist grid view ": function (browser) {
        objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
     
        testresponse.VerifyImageZone_grid(browser)
            

    },
    "verify Image Displayed in muliple pages and stitched model -In worklist tile view ": function (browser) {
         testresponse.VerifyImageZone_tile(browser)
         browser.end();

    }
    








}

////*********************************This test verifies the text "Response" once clicked in response ID. Now it is changed to Image instead of Response text***********

////"TC_2099 Verify the Response ID, response window and close button is available. (in normal/expanded view)": function (browser) {

////    objData = utilityobj.getDataParam(browser, logindata);
////    signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
////    testresponse.verify_responsescreen_with_closebutton(browser, false);
////    testresponse.verify_responsescreen_closebutton_click(browser);
////    browser.end();
////},

////"TC_2100 Verify the Response ID, response window and close button is available in tile view": function(browser){

////    objData = utilityobj.getDataParam(browser, logindata);
////    signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
////    testresponse.verify_responsescreen_with_closebutton(browser, true);
////    testresponse.verify_responsescreen_closebutton_click(browser);
////    browser.end();
////}
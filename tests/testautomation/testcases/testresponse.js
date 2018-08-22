var responseData = require("../testdata/response.json");
var response = require("../features/response.js");
var common = require("../features/common.js");
var qig = require("../features/qig.js");
var live = require("../features/liveworklist.js");
var objRepo = require("../objectrepository/objectrepository.json");

module.exports = {

    VerifyImageZone_grid: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, responseData.qigName.ImagezoneQig, objRepo.refactorQig.qigname)
        browser.pause(2000);
        live.worklistSwitchView(browser, "grid")        
        response.selectResponseID(browser, responseData.ImageZoneResponse.ImageZoneResponseID)
        response.verifyImagePresent(browser)
        response.verifyStitchedImagePresent(browser)
        response.verifyMultipleOutputPagesPresent(browser)
        response.verifyResponeClose(browser, responseData.ImageZoneResponse.ImageZoneResponseID)

    },

    VerifyImageZone_tile: function (browser) {
    qig.selectMenuDropdown(browser)
    browser.pause(2000)
    qig.selectQigElement(browser, responseData.qigName.ImagezoneQig, objRepo.refactorQig.qigname)
    browser.pause(2000);
    live.worklistSwitchView(browser, "tile")        
    response.selectResponseID(browser, responseData.ImageZoneResponse.ImageZoneResponseID)
    response.verifyImagePresent(browser)
    response.verifyStitchedImagePresent(browser)
    response.verifyMultipleOutputPagesPresent(browser)
    response.verifyResponeClose(browser, responseData.ImageZoneResponse.ImageZoneResponseID)

}




    

}

//*********************************This test verifies the text "Response" once clicked in response ID. Now it is changed to Image instead of Response text***********

//verify response screen with close button
//    verify_responsescreen_with_closebutton: function (browser, tileView) {
//        browser.pause(5000);

//        if (tileView)
//        {
//            common.verifyItemClick(browser, objectrepository.response.worklistSplitViewButtonId);
//        }

//        response.openResponseItem(browser, objectrepository.response.responseItemXpath);
//        // This will verify Response Screen using "Response" text
//        common.verifyItemText(browser, objectrepository.response.responseTextId, testdata.text.responseText);
//        // This will verify Response button
//        common.verifyItemText(browser, objectrepository.response.responseCloseButtonId, testdata.text.responseCloseButtonText);

//    },

//    // verify response screen close button functionality
//    verify_responsescreen_closebutton_click: function (browser) {
//        common.verifyItemClick(browser, objectrepository.response.responseCloseButtonId);
//        browser.pause(5000);
//        common.verifyItemText(browser, objectrepository.response.worklistHeaderClass, testdata.text.worklistHeaderText);
//        browser.pause(2000);
//    }
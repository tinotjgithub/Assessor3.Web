var live = require("../../testcases/testlivemarking.js");
var logindata = require("../../testdata/login.json");
var utilityobj = require("../../utilityfunctions/utility.js");
//var login = require("../testcases/testlogin.js");
var live = require("../../testcases/testlivemarking.js");
var hint = require("../../testcases/hintinworklist.js");

module.exports = {


    //A3AQ_selijah23, xxAQA UNSTRUCTUR/xx19 DONE
    "TC_1472 Verify the Approved marker without live response is navigated to expanded live worklist on selecting a QIG": function (browser) {
        live.approvedMarkerWithoutLiveResponse(browser);
        browser.end();
    },

    //A3AQ_telizabeth67, A3AQ_aizabelle17 DONE 1479
    "TC_1474 Verify the Non-Approved marker is navigated to expanded live worklist on selecting a QIG": function (browser) {
        live.nonApprovedMarker(browser);
        browser.end();
    },

    //A3AQ_pgeogery70 DONE
    "TC_1475 Verify the Suspended marker with live response is navigated to expanded live worklist on selecting a QIG": function (browser) {
        live.suspendedMarkerWithLiveResponse(browser);
        browser.end();
    },

    //CHECK CASE
    //"TC_1477 Verify the marker is able to see live target value on the marking tab": function (browser) {
    //    live.checkLiveTargetValueOnLiveTab(browser);
    //},

    //fake, 23
    "TC_1471 Verify the Approved marker with live response is navigated to expanded live worklist on selecting a QIG": function (browser) {
        live.approvedMarkerWithLiveResponse(browser);
    },

    //DONE
    "TC_1478 Verify the number of open live response available for the marker if there is an open response": function (browser) {
        live.checkLiveTargetValueOnLiveTab(browser);
        //browser.end();
    },

    //1474
    //"TC_1479 Verify the number of open live response available for the marker if there is no open response": function (browser) {
    //    live.checkLiveTargetValueWithNoResponse(browser);
    //},

    //DONE WITH 1478
    //"TC_1480 Verify the marker is able to see live open responses when user clicks on the live response type in the marking worklist": function (browser) {
    //    live.checkOpenCount(browser);
    //    browser.end();
    //},

    //DONE
    "TC_1481 Verify the response ID displayed in the open live work list": function (browser) {
        live.checkResponsesInOpenTab(browser);
        //browser.end();
    },

    //DONE
    "TC_1484 Verify the response status when the marking is not completed": function (browser) {
        live.checkResponseStatusInOpenTab(browser);
    },

    //DONE
    "TC_1485 Verify the response status when the marking is completed": function (browser) {
        live.checkResponseStatusInOpenTabAfterMarkingComplete(browser);
    },

    //DONE
    "TC_1486 Verify the response status when the marking is completed but an exception raised against that response": function (browser) {
        live.checkResponseStatusInOpenTabAfterMarkingCompleteWithError(browser);
    },


    //    "TC_1487 Verify the response status when the marking is completed but marker status changed to not approved": function (browser) {
    //        live.checkResponseStatusInOpenTabAfterMarkingCompleteForSuspendedMarker(browser);
    //    },

    //No component setup
    //    "TC_1488 Verify the response status for a response having optionality": function (browser) {
    //        live.checkResponseStatusInOpenTabAfterMarkingComplete(browser);
    //    },

    //DONE
    "TC_1525 Verify the response allocated date and time is displayed when the marker download a response": function (browser) {
        live.checkAllocatedTimestampAddedForDownloadedResponse(browser);
    },

    //DONE
    "TC_1529 Verify the response allocated date and time is not getting updated when the marking is started": function (browser) {
        live.checkAllocatedTimestampUpdatedForMarkedResponse(browser);
    },

    //DONE
    "TC_1530 Verify the Last updated date and time is getting updated when the marking is started": function (browser) {
        live.checkModifiedTimestampUpdatedForMarkedResponse(browser);
    },

    //DONE
    "TC_1531 Verify the Last updated date and time is replaced with Marking not started when the marking is started": function (browser) {
        live.checkStatusUpdatedForNotMarkedResponse(browser);
    },

    //DONE
    "TC_1533 Verify the total marks awarded is indicated against each response as X/Y": function (browser) {
        live.checkTotalMarksForNumericResponse(browser);
    },

    //non-numeric component not available for the current customers
    //    "TC_1534 Verify the total marks column in case of non-numeric marking": function (browser) {
    //        live.checkTotalMarksForNonNumericResponse(browser);
    //    },

    //DONE
    "TC_1535 Verify the total marks column when the marking is not started or marks removed by the marker": function (browser) {
        live.checkTotalMarksForNonMarkedResponse(browser);
        browser.end();
    },

    //"TC_1536 Verify the marking percentage is updated on the basis of total mark displayed ": function (browser) {
    //    live.checkStatusUpdatedForMarkedResponse(browser);
    //},





    //Hint message Check.

    "Verify the ‘Get new response button’ if there are no responses available to download from the live pool": function (browser) {
        hint.TC_1502(browser)
    },

    "Verify the ‘Get new response button’ if there are no responses available for the center allocated to the marker but responses are available for center allocated to other markers": function (browser) {
        hint.TC_1504(browser)
    },


    "Verify the ‘Get new response button’ if there are no responses available to download from the live pool but marker rejected one response from his open worklist": function (browser) {
        hint.TC_1514(browser)
    },


    "Verify the message entitled \"Nothing to download\" is displayed if there are no responses available to download from the live pool ": function (browser) {
        hint.TC_1515(browser)
    },

    "Verify the message entitled \"Nothing to download\" is not displayed if there are no responses available to download from the live pool but another marker rejected one response from his open worklist ": function (browser) {
        hint.TC_1519(browser)
    },


    "Verify the ‘Get new response button’ is enabled when open worklist is empty and there are responses available to download from the live pool": function (browser) {
        hint.TC_1521(browser)
    },

    "Verify message entitled \"Download new responses\" is displayed when open worklist is empty and there are responses available to download from the live pool": function (browser) {
        hint.TC_1523(browser)
    },


    "Verify the language change in the qig": function (browser) {
        hint.languageChangeMainPage(browser)
    }


}
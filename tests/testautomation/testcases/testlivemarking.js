var loginPage = require("../features/login.js");
var login = require("../testdata/login.json");
var live = require("../testdata/live.json");
var liveopen = require("../features/liveworklist.js");
var homepage = require("../features/homePage.js");
var utilityObj = require("../utilityfunctions/utility.js");

module.exports = {

    //1471
    approvedMarkerWithLiveResponse: function (browser) {
        //login with approved marker with live response
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.approvedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.approvedliveqig, "mark");
        browser.pause(6000);
        //verifies that Live tab is active in page
        liveopen.verifyLiveTabIsVisible(browser);
    },

    //1472
    approvedMarkerWithoutLiveResponse: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.approvedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.approvedwithoutliveqig, "mark");
        browser.pause(6000);
        liveopen.verifyLiveTabIsVisible(browser);
        browser.end();       

    },

    //1474
    nonApprovedMarker: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.nonapprovedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.nonapprovedliveqig, "mark");
        browser.pause(6000);
        liveopen.verifyLiveTabIsVisible(browser);
        

    },

    //1475
    suspendedMarkerWithLiveResponse: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.suspendedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.suspendedmarkerqig, "mark");
        browser.pause(6000);
        liveopen.verifyLiveTabIsVisible(browser);        
    },


    //1477
    checkLiveTargetValueOnMarkingTab: function () {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.approvedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.suspendedmarkerqig, "mark");
        browser.pause(6000);
        liveopen.verifyLiveTabIsVisible(browser);

    },

    //1478
    checkLiveTargetValueOnLiveTab: function (browser) {
        liveopen.verifyLiveCountInPage(browser, "Live", "5");
        liveopen.verifyElementsCount(browser, "5");

    },

    //1479
    checkLiveTargetValueWithNoResponse: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.open.nonapprovedmarker, live.open.markerpassword);
        browser.pause(8000);
        homepage.selectQig(browser, live.open.nonapprovedliveqig, "mark");
        browser.pause(6000);
        liveopen.verifyLiveCountInPage(browser, "Live", "0");
        liveopen.verifyElementsCount(browser, "[]");

    },

    //1480
    checkOpenCount: function () {
        loginPage.login(browser, username, password);
        //select qig which has live response. ADD CODE
        liveopen.verifyLiveCountInPage(browser, "Open", live.open.opencount);
        

    },

    //1481
    checkResponsesInOpenTab: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        //loginPage.login(browser, "fake", "23");
        //browser.pause(8000);
        //homepage.clickQig(browser, "ATAQA UNSTRUCTUR 1 Whole Paper", "mark");
        //browser.pause(6000);
        liveopen.verifyResponseIsDisplayedInGrid(browser, live.open.responses);
    },

    //1484
    checkResponseStatusInOpenTab: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseStatus(browser, live.open.notcompletedrid, live.open.notcompletedpercentage, "Not completed");
    },

    //1485
    checkResponseStatusInOpenTabAfterMarkingComplete: function (browser) {
        liveopen.verifyResponseStatus(browser, live.open.completedrid, live.open.completedbutton, "Completed");
    },

    //1486
    checkResponseStatusInOpenTabAfterMarkingCompleteWithError: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseStatus(browser, live.open.res1, "100%", "Completed with error");
    },

    //1487
    checkResponseStatusInOpenTabAfterMarkingCompleteForSuspendedMarker: function () {
        //login with suspended marker
        loginPage.login(browser, username, password);
        //liveopen.verifyResponseStatus(browser, respId, "Submit", "Completed");
    },
    
    //1488
    checkResponseStatusInOpenTabAfterMarkingCompleteWithError1: function () {
        //based on data setup
        loginPage.login(browser, username, password);
        liveopen.verifyResponseStatus(browser, respId, "Submit", "Completed");
    },

    //1525 ADD DATE
    checkAllocatedTimestampAddedForDownloadedResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseMarkingStatus(browser, live.open.res2, "Allocated", "11/02/2016, 11:50:00");
    },

    //1529 CHECK
    checkAllocatedTimestampUpdatedForMarkedResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseMarkingStatus(browser, live.open.res3, "Allocated", "11/02/2016, 11:49:45");
    },

    //1530 ADD DATE
    checkModifiedTimestampUpdatedForMarkedResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseMarkingStatus(browser, live.open.res3, "Last Updated", "12/02/2016, 07:11:08");
    },

    //1531
    checkStatusUpdatedForNotMarkedResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyResponseMarkingStatus(browser, live.open.res4, "Marking not started");
    },

    //1533
    checkTotalMarksForNumericResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyTotalMark(browser, live.open.res3, "4", "90", "123");
    },

    //1534
    checkTotalMarksForNonNumericResponse: function () {
        loginPage.login(browser, username, password);
        liveopen.verifyTotalMark(browser, respId, "NA", "", "ABC");
    },

    //1535
    checkTotalMarksForNonMarkedResponse: function (browser) {
        //loginPage.login(browser, username, password);
        liveopen.verifyTotalMark(browser, live.open.res2, "--", "", "--");
    },

    //1536
    checkTotalMarksForNonMarkedResponse11: function () {
        loginPage.login(browser, username, password);
        liveopen.verifyTotalMark(browser, respId, "", "", "123");
        liveopen.verifyResponseStatus(browser, live.open.statuspercentage, live.open.responses, "Not completed");

    },
}
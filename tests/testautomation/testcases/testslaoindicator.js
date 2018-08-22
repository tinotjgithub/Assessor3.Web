var loginPage = require("../features/login.js");
var login = require("../testdata/login.json");
var live = require("../testdata/live.json");
var liveopen = require("../features/liveworklist.js");
var homepage = require("../features/homePage.js");
var utilityObj = require("../utilityfunctions/utility.js");
var objrepo = require("../objectrepository/objectrepository.json");

module.exports = {

    // SLAO

    //1
    checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete: function (browser) {
        
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.SLAO.allpagesoffslaooff.username, live.SLAO.allpagesoffslaooff.password);
        browser.pause(8000);
        liveopen.toggleView(browser, "grid");
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesoffslaooff.response1.slaoindicator);
      
    },

    //2
    checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesoffslaooff.response2.slaoindicator);
    },

    //3
    checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaooff.response3.slaoindicator);
    },

    //4
    checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaooff.response4.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaooff.response4.submitbutton);
        browser.end();
    },

    //5
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.SLAO.allpagesonslaooff.username, live.SLAO.allpagesonslaooff.password);
        browser.pause(8000);
        liveopen.toggleView(browser, "grid");
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaooff.response1.slaoindicator);
    },

    //6
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response2.allpagesindicator);
        liveopen.verifyMarkingProgressIndicator(browser, live.SLAO.allpagesonslaooff.response2.markingprogressindicator, live.SLAO.allpagesonslaooff.response2.markingpercentage);
    },

    //7
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_NotComplete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaooff.response3.slaoindicator);
    },

    //8
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_Complete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaooff.response4.slaoindicator);
    },

    //9
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response5.slaoindicator);
    },

    //10
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response6.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response6.allpageindicator);
    },

    //11
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response7.slaoindicator);
    },

    //12
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response8.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response8.allpageindicator);
    },

    //13
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response9.slaoindicator);
    },

    //14
    checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response10.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaooff.response10.submitbutton);
        browser.end();
    },

    //15
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.SLAO.allpagesoffslaoon.username, live.SLAO.allpagesoffslaoon.password);
        browser.pause(8000);
        liveopen.toggleView(browser, "grid");
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesoffslaoon.response1.slaoindicator);
    },

    //16
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesoffslaoon.response2.slaoindicator);
    },

    //17
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NA_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaoon.response3.slaoindicator);
    },

    //18
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NA_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaoon.response4.slaoindicator);
        liveopen.verifyMarkingProgressIndicator(browser, live.SLAO.allpagesoffslaoon.response4.markingprogressindicator, live.SLAO.allpagesoffslaoon.response4.markingpercentage);
        liveopen.verifyTooltipForIndicator(browser, live.SLAO.allpagesoffslaoon.response4.slaocrossindicatortitleindicator, live.SLAO.allpagesoffslaoon.response4.slaocrossindicatortitle);
    },

    //19
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NA_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaoon.response5.slaoindicator);
        
    },

    //20
    checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NA_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesoffslaoon.response6.slaoindicator);
        browser.end();
    },

    //31
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.SLAO.allpagesonslaoon.username, live.SLAO.allpagesonslaoon.password);
        browser.pause(8000);
        liveopen.toggleView(browser, "grid");
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaoon.response1.slaoindicator);
    },

    //32
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response2.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response2.markingprogressindicator, live.SLAO.allpagesonslaoon.response2.markingpercentage);
    },

    //33
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_NotComplete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaoon.response3.slaoindicator);
    },

    //34
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_Complete: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.SLAO.allpagesonslaoon.response4.slaoindicator);
    },

    //35
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response5.slaoindicator);
    },

    //36
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response6.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response6.allpageindicator);
    },

    //37
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response7.slaoindicator);
    },

    //38
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response8.slaoindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response8.allpageindicator);
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response8.markingprogressindicator, live.SLAO.allpagesonslaoon.response8.markingpercentage);
        liveopen.verifyTooltipForIndicator(browser, live.SLAO.allpagesonslaoon.response8.slaoindicator, live.SLAO.allpagesonslaoon.response8.slaoindicatortitle);
        liveopen.verifyTooltipForIndicator(browser, live.SLAO.allpagesonslaoon.response8.allpageindicator, live.SLAO.allpagesonslaoon.response8.notallpagesannotatedtitle);
    },

    //39
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_NotComplete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response9.slaoindicator);
    },

    //40
    checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_Complete: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.SLAO.allpagesonslaoon.response10.slaoindicator);
        browser.end();
    }


}
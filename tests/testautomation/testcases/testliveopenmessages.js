var loginPage = require("../features/login.js");
var login = require("../testdata/login.json");
var live = require("../testdata/live.json");
var liveopen = require("../features/liveworklist.js");
var homepage = require("../features/homePage.js");
var utilityObj = require("../utilityfunctions/utility.js");
var objrepo = require("../objectrepository/objectrepository.json");

module.exports = {

    checkMessageIndicator_IsNotDisplayed_Response_NotLinkedToAnyMessage: function (browser) {
        objData = utilityObj.getDataParam(browser, login);
        loginPage.login(browser, live.message.username, live.message.password);
        browser.pause(5000);
        browser.useXpath();
        browser.waitForElementPresent(live.open.newresponsebutton, 10000);
        browser.useCss();
        liveopen.verifyElementNotPresent(browser, live.message.nomessage.indicator);
    },


    checkMessageIndicator_IsDisplayed_Response_LinkedTo_ReceivedMessage: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.message.received.indicator);
    },


    checkMessageIndicator_IsDisplayed_Response_LinkedTo_SentMessage: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.message.sent.indicator);
    },

    //2057
    checkMessageIndicator_IsDisplayed_Response_LinkedTo_DeletedMessage: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.message.deleted.indicator);
    },

    //2058
    checkMessageCount_IsDisplayed_Response_Has_UnreadMessage: function (browser) {
        liveopen.verifyMessageIndicatorCount(browser, live.message.unread.countindicator, live.message.unread.count);
    },

    //2059
    checkMessageCount_IsNotDisplayed_Response_Has_ReceivedMessage: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.message.received.countindicator);
    },

    checkMessageCount_IsNotDisplayed_Response_Has_SentMessage: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.message.sent.countindicator);
    },

    checkMessageCount_IsNotDisplayed_Response_Has_DeletedMessage: function (browser) {
        liveopen.verifyElementNotPresent(browser, live.message.deleted.countindicator);
    },

    //2062
    checkMessageCount_IsDisplayed_OnNotificationIcon: function (browser) {
        liveopen.verifyElementIsVisible(browser, live.message.notification.indicator);
        liveopen.verifyMessageIndicatorCount(browser, live.message.notification.countindicator, live.message.notification.count);
    },

    checkMessageIndicator_Tooltip_Unread: function (browser) {
        liveopen.verifyTooltipForIndicator(browser, live.message.tooltipUnread.indicator, live.message.tooltipUnread.title);
    },
    checkMessageIndicator_Tooltip_AllRead: function (browser) {
        liveopen.verifyTooltipForIndicator(browser, live.message.tooltipNoUnread.indicator, live.message.tooltipNoUnread.title);
    }


}
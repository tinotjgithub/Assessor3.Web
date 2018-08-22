var utilityobj  = require("../../utilityfunctions/utility.js");
var live = require("../../testcases/testliveopenmessages.js");

module.exports = {

    //MESSAGE INDICATOR
    "Verify that message icon is not displayed for response not linked to any message": function (browser) {
        live.checkMessageIndicator_IsNotDisplayed_Response_NotLinkedToAnyMessage(browser)

    },

    "Verify that message icon is displayed for response linked to received message": function (browser) {
        live.checkMessageIndicator_IsDisplayed_Response_LinkedTo_ReceivedMessage(browser)

    },

    "Verify that message icon is displayed for response linked to sent message": function (browser) {
        live.checkMessageIndicator_IsDisplayed_Response_LinkedTo_SentMessage(browser)

    },

    "Verify that message icon is displayed for response linked to deleted message": function (browser) {
        live.checkMessageIndicator_IsDisplayed_Response_LinkedTo_DeletedMessage(browser)

    },

    "Verify that message count is displayed for response that has unread message": function (browser) {
        live.checkMessageCount_IsDisplayed_Response_Has_UnreadMessage(browser)

    },

    "Verify that message count is not displayed for response that has received message": function (browser) {
        live.checkMessageCount_IsNotDisplayed_Response_Has_ReceivedMessage(browser)

    },

    "Verify that message count is not displayed for response that has sent message": function (browser) {
        live.checkMessageCount_IsNotDisplayed_Response_Has_SentMessage(browser)

    },

    "Verify that message count is not displayed for response that has deleted message": function (browser) {
        live.checkMessageCount_IsNotDisplayed_Response_Has_DeletedMessage(browser)

    },


    //"Verify that message count is displayed aaginst notification icon for a response": function (browser) {
    //    live.checkMessageCount_IsDisplayed_OnNotificationIcon(browser)

    //},

    "Verify that  tooltipUnread message icon displayed": function (browser) {
        live.checkMessageIndicator_Tooltip_Unread(browser)

    },
    "Verify that tooltipNothingToRead message icon displayed": function (browser) {
        live.checkMessageIndicator_Tooltip_AllRead(browser)

    }

}


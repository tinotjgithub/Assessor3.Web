var testdata = require("../testdata/liveworklisttab.json");
var liveworklisttab = require("../features/liveworklisttab.js");
var common = require("../features/common.js");
var objectrepository = require("../objectrepository/objectrepository.json");
var qig = require("../features/qig.js");


module.exports = {

    // verify tabitem by checking count and text.
    verify_TabItem: function (browser, tabcount, tabtext) {
        browser.pause(5000);
        qig.selectMenuDropdown(browser)
        qig.selectQigElement(browser, testdata.text.allTabQigName, objectrepository.refactorQig.qigname)
        browser.pause(5000);

        liveworklisttab.verifyTabItem(browser, tabcount, tabtext, this.getTabPath(tabtext));
        browser.pause(2000);
    },

    // verify current screen is live marking worklist screen.
    verify_liveworklist_screen: function(browser) {
        browser.pause(5000);
        common.verifyItemText(browser, objectrepository.liveworklisttab.worklistHeaderClass, testdata.text.worklistHeaderText);
        browser.pause(2000);
    },

    // verify default opened tab.
    verify_Default_Tab: function (browser) {
        browser.pause(5000);
        common.verifyCssClassIsPresent(browser, objectrepository.liveworklisttab.openTabId, objectrepository.liveworklisttab.tabSelectedClassName);
    },

    // verify whether a tab is exists or not.
    check_Tab_Exists: function(browser, tabtext){
        browser.pause(5000);
        qig.selectMenuDropdown(browser)
        qig.selectQigElement(browser, testdata.text.noGraceQigName, objectrepository.refactorQig.qigname)
        browser.pause(5000);
        common.verifyElementIsPresent(browser, this.getTabId(tabtext))
    },

    // This method will return the tab count and tab text xpath value.
    getTabPath: function (tabtext) {

        switch (tabtext) {
            case "In Grace":
                return { countPath: objectrepository.liveworklisttab.inGraceTabPathForCount, textPath: objectrepository.liveworklisttab.inGraceTabPathForText };
            case "Closed":
                return { countPath: objectrepository.liveworklisttab.closedTabPathForCount, textPath: objectrepository.liveworklisttab.closedTabPathForText }
            default:
                return { countPath: objectrepository.liveworklisttab.openTabPathForCount, textPath: objectrepository.liveworklisttab.openTabPathForText };
        }
    },

    // This method will return the corresponding ids for tab text.
    getTabId: function (tabtext) {
        switch (tabtext) {
            case "In Grace":
                return objectrepository.liveworklisttab.inGraceTabId;
            case "Closed":
                return objectrepository.liveworklisttab.closedTabId;
            default:
                return objectrepository.liveworklisttab.openTabId;
        }

    }

}
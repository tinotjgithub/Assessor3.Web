var logindata = require("../../testdata/login.json");
var utilityobj = require("../../utilityfunctions/utility.js");
var testdata = require("../../testdata/liveworklisttab.json");
var signIn = require("../../features/login.js");
var testliveworklistTab = require("../../testcases/testliveworklisttab.js");

module.exports = {

    "TC_2098 Verify if the 'Open' tab is selected by default upon navigating to a worklist": function (browser) {

        objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
        // this will verify the default tab.
        testliveworklistTab.verify_Default_Tab(browser);
        browser.end();
    },

    "TC_2097 Verify the title 'Live Marking' is displayed in the QIG worklist": function (browser) {

        objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
        testliveworklistTab.verify_liveworklist_screen(browser);
        browser.end();
    },

    "TC_2096 Verify the QIG overview tabs of a marker if value of Grace period CC is not greater than zero": function (browser) {

        objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, testdata.logincredentials.graceTabCheckUserName, testdata.logincredentials.graceTabCheckPassword);
        testliveworklistTab.check_Tab_Exists(browser, "In Grace");
        browser.end();
    },

    "TC_2095 Verify the tabs in QIG worklist shows the number of Open, In Grace and Closed tabs with count": function (browser) {

        objData = utilityobj.getDataParam(browser, logindata);
        signIn.login(browser, testdata.logincredentials.openResponseUserName, testdata.logincredentials.openResponsePassword);
        // pass tabcount and tab text
        testliveworklistTab.verify_TabItem(browser, testdata.text.openTabCount, testdata.text.openTabText);
        testliveworklistTab.verify_TabItem(browser, testdata.text.inGraceTabCount, testdata.text.inGraceTabText);
        testliveworklistTab.verify_TabItem(browser, testdata.text.closedTabCount, testdata.text.closedTabText);
        browser.end();
    }

}
var testworklistgrid = require("../../testcases/testliveworklistgrid.js");
var utility = require("../../utilityfunctions/utility.js");

// Global declaration
var testgrid = undefined

/**
 * Live open worklist exception gridview.
*/
module.exports = {

    /**
     * Initializing the test.
     * @param {type} browser
     */
    "571 inizialize Linked Exception Indicator Test": function (browser) {

        var objRepo = require("../../objectrepository/objectrepository.json");
        var liveDummyData = require("../../testdata/live.json");
        var loginDummyData = require("../../testdata/login.json");

        // this is a global variable set to support login and launching application.
        // TODO this needs to be moved for classification.
        // TO DO this is now in window scope
       testgrid = new testworklistgrid();


        objData = utility.getDataParam(browser, loginDummyData);
        testgrid.initialize(browser, objData.login.liveworklisttest.exception.username, objData.login.liveworklisttest.exception.password);
    },

    /**
     * Test for checking none of the indicator is displaying if no exception has been raised.
     * @param {type} browser`
     */
    "TC_2069 Verify Exception indicator visible no exception raised": function (browser) {



        testgrid.isExceptionIndicatorVisibleWhenNoException(browser);
    },

    /**
     * Verify the exception indicator is displayed for a response if an exception is blocking submission.
     * @param {type} browser
     */
    "TC_2070,TC_2072 Verify indicator shown and highlighted on is blocking exception": function (browser) {

        testgrid.testIndicatorVisbleForBlockingException(browser);
    },

    /**
     * Verify the exception indicator is displayed for a response if an exception is not blocking submission
     * @param {type} browser
     */
    "TC_2071 Verify the exception indicator for non blocking submission": function (browser) {

        testgrid.TestExceptionIndicatorForNonBlockingSubmission(browser);
    },

    /**
     * Verifying the count shown for the blocking exception is matching.
     * @param {type} browser
     */
    "TC_2073 Verify exception count for blocking submission": function (browser) {

        testgrid.TestExceptionCountForBlockingSubmission(browser);
    },

    /**
     * Exception count is visible when all the blocking exceptions are in resolved state
     * @param {type} browser
     */
    "TC_2074 Verify exception count for resolved blocking submission": function (browser) {

        testgrid.TestExceptionCountForBlockedExceptionWhenReolved(browser);
    },

    /**
     * Verify the exception count for non blocking resolved.
     * @param {type} browser
     */
    "TC_2075, 2076 Verify exception count for resolved non blocking submission": function (browser) {

        testgrid.TestExceptionCountForNonBlockedExceptionWhenReolved(browser);
    },

    /**
     * Verify inidcator for closed exception
     * @param {type} browser
     */
    "TC_2077 Verify exception indicator for closed": function (browser) {

        testgrid.TestExceptionIndicatorWhenAllClosed(browser);
    },

    /**
     * Verify exception indicator for open blocking and non blocking
     * @param {type} browser
     */
    "TC_2078 Verify exception indicator for open blocking and non blocking": function (browser) {

        testgrid.TestExceptionIndicatorForOpenNonAndBlockingException(browser);
    },

    /**
     * Verify exception indicator for open non blocking and resolved blocking
     * @param {type} browser
     */
    "TC_2079 Verify exception indicator for open non blocking and resolved blocking": function (browser) {

        testgrid.TestExceptionIndicatorForOpenNonAndResolvedBlockingException(browser);
    },

    /**
     * Verify exception indicator for open non blocking and closed blocking
     * @param {type} browser
     */
    "TC_2080 Verify exception indicator for open non blocking and closed blocking": function (browser) {

        testgrid.TestExceptionIndicatorForOpenNonAndClosedblockingException(browser);
    },

    /**
     * Verify exception indicator for open blocking and resolved non blocking
     * @param {type} browser
     */
    "TC_2081 Verify exception indicator for open blocking and resolved non blocking": function (browser) {

        testgrid.TestExceptionIndicatorForOpenlockingAndResovedNonBlockingException(browser);
    },

    /**
     * Verify exception indicator for open blocking and closed others
     * @param {type} browser
     */
    "TC_2082 Verify exception indicator for open blocking and closed others": function (browser) {

        testgrid.TestExceptionIndicatorForOpenBlockingAndClosedOthers(browser);
    },

    /**
     * Verify exception indicator for resolved blocking and non blocking
     * @param {type} browser
     */
    "TC_2084 Verify exception indicator for resolved blocking and non blocking": function (browser) {

        testgrid.TestExceptionIndicatorForResolvedBlockingAndNonBlocking(browser);
    },

    /**
     * Verify the tool tip
     * @param {type} browser
     */
    "TC_2085 Verify exception Tool tip": function (browser) {

        // Open blocking exception
        testgrid.TestExceptionToolTipVisibleForOpenBlockingException(browser);

        // Testing non blocking open
        testgrid.TestExceptionToolTipVisibleForOpenNonBlockingException(browser);

        // resolved blocking
        testgrid.TestExceptionToolTipVisibleForResolvedBlockingException(browser);

        // resolved non blocking
        testgrid.TestExceptionToolTipVisibleForResolvedNonBlockingException(browser);

        // Closed non blocking.
        testgrid.TestExceptionToolTipVisibleForClosedNonBlockingException(browser);
        browser.end();
    },

}
var liveWorklist = require("../features/liveworklist.js");
var utility = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var liveData = require("../testdata/live.json");
var loginForm = require("../features/login.js");
var loginData = require("../testdata/login.json");
var homePageLog = require("../features/homePage.js");
var exceptionHelper = require("../features/livemarking/exception/exception.js");
/**
 * Test cases for live worklist grid
*/
var liveworklistgrid = (function () {

    // Exception feature validate helper.
    var helper = undefined;

    /**
     * @Constructor
     */
    function liveworklistgrid() {
    }

    /**
     * Login to assessor
     * @param {type} browser
     * @param {type} userName
     * @param {type} password
     */
    liveworklistgrid.prototype.initialize = function (browser, userName, password) {

        loginForm.login(browser, userName, password);
        browser.pause(2000);
        //homePageLog.selectQig(browser, liveData.exception.selectedqig, liveData.exception.selectedmarkingtype);



        // Validating the grid properies
        validateGrid(browser);
        helper = new exceptionHelper();
    };

    /**
     * Checking wether any of the exception has been raised if no exception has been raised or to be resolved?
     * @param {type} browser
     */
    liveworklistgrid.prototype.isExceptionIndicatorVisibleWhenNoException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.noexception;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify the exception indicator is displayed for a response if an exception is blocking submission
     * @param {type} browser
     */

    liveworklistgrid.prototype.testIndicatorVisbleForBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.blockedopen;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Asserting when there is no blocking exception but has exception shoule show the indicator.
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorForNonBlockingSubmission = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.nonblockingopen;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verifying the count shown for the blocking exception is matching.
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionCountForBlockingSubmission = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.blockingresolved;
        helper.assertExceptionCount(browser, selectedResponseList);
    }

    /**
     * Exception count is visible when all the blocking exceptions are in resolved state
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionCountForBlockedExceptionWhenReolved = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.blockingresolved;
        helper.assertExceptionCount(browser, selectedResponseList);
    }

    /**
     * Verify the exception count for non blocking resolved.
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionCountForNonBlockedExceptionWhenReolved = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.nonblockingresolved;
        helper.assertExceptionCount(browser, selectedResponseList);
    }

    /**
     * Verify inidcator for closed exception
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorWhenAllClosed = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.closedexception;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify exception indicator for open blocking and non blocking
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorForOpenNonAndBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.opennonandblocking;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify exception indicator for open non blocking and resolved blocking
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorForOpenNonAndResolvedBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.opennonblockingresolvedblocking;
        helper.assertException(browser, selectedResponseList);
    }

    /**
    * Verify exception indicator for open non blocking and closed blocking
    * @param {type} browser
    */
    liveworklistgrid.prototype.TestExceptionIndicatorForOpenNonAndClosedblockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.nonblockingopenandblockingclosed;
        helper.assertException(browser, selectedResponseList);
    }

    /**
    * Verify exception indicator for open blocking and closed others
    * @param {type} browser
    */
    liveworklistgrid.prototype.TestExceptionIndicatorForOpenBlockingAndClosedOthers = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.openBlockingandclosedOthers;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify exception indicator for resolved blocking and non blocking
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorForResolvedBlockingAndNonBlocking = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.resolvedblockingnonblocking;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify exception indicator for open blocking and resolved non blocking
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionIndicatorForOpenlockingAndResovedNonBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.openandresolvedblocking;
        helper.assertException(browser, selectedResponseList);
    }

    /**
     * Verify the tool tip for blocked exception
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionToolTipVisibleForOpenBlockingException= function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.blockedopen;
        helper.assertExceptionTitle(browser, selectedResponseList);
    }

    /**
     * Verify the tool tip for non blocked exception
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionToolTipVisibleForOpenNonBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.nonblockingopen;
        helper.assertExceptionTitle(browser, selectedResponseList);
    }

    /**
     * Verify the tool tip for blocked exception resolved
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionToolTipVisibleForResolvedBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.blockingresolved;
        helper.assertExceptionTitle(browser, selectedResponseList);
    }

    /**
     * Verify the tool tip for non blocking exception resolved
     * @param {type} browser
     */
    liveworklistgrid.prototype.TestExceptionToolTipVisibleForResolvedNonBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.nonblockingresolved;
        helper.assertExceptionTitle(browser, selectedResponseList);
    }

    /**
    * Verify the tool tip for non blocking exception closed
    * @param {type} browser
    */
    liveworklistgrid.prototype.TestExceptionToolTipVisibleForClosedNonBlockingException = function (browser) {

        // Get the expected data.
        var selectedResponseList = liveData.exception.resonselist.closedexception;
        helper.assertExceptionTitle(browser, selectedResponseList);
    }

    /**
     * Validate grid properties and class names before doing the actual assertions to
     * ensure CSS are correct
     * @param {type} browser
     */
    function validateGrid(browser) {
   
        // TO need to remove when integrating.
        // browser.waitForElementPresent('.grid-wrapper', 100000);

        // (1) validate css class name indicates a GRID to ensure user is viewing Grid view.
        // (2) validate whether the user viewing OPEN response worklist.
        browser.useXpath()
        .verify.visible(objRepo.livemarking.exception.classname.gridview, "Validating live marking worklist Grid is visble.")
        .verify.visible(objRepo.livemarking.exception.classname.openresponsetab, "Validating live marking open response is selected.");
    }

    return liveworklistgrid;
})();

module.exports = liveworklistgrid;

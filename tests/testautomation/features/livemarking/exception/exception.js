var gridHelper = require("../../gridhelper.js");
var settings = require("../../../objectrepository/objectrepository.json");
var liveData = require("../../../testdata/live.json").exception;

var exception = (function () {

    // The exception format id to locate the exception using row and column.
    this.exceptionIdFormat = "{row}_LinkedException_{column}_execeptionIndicator";

    // Notification count format
    this.exceptionNotificatgionCountFormat = "{row}_LinkedException_{column}_execeptionIndicatorNotification";

    // Column index
    const columnIndex = "5";

    // Grid wrapper name
    const exceptionGridWrapperClass = "grid-wrapper";

    // Highlight class name
    const exceptionGridHighlightClass = "row warning-alert";

    // Gets or sets the selected response
    var selectedResponse = undefined;

    /**
     * @construtor.
     */
    function exception() {
    }

    /**
     * Verify whether the grid has any exceptions or not
     * @param browser
     * @param rowIndex
     * @param columnIndex
     */
    exception.prototype.assertException = function (browser, selectedResponseList) {

        // validate to ensure grid view is there as this is only applicable to gridview.
        isWorkListGridActive(browser);
        selectedResponse = selectedResponseList;

        var currentelement = getLinkedExceptionElementName(browser);
        verifyExceptionVisibility(browser, currentelement);
    }

    /**
     * Assert the grid which belongs to the exception is highligted
     * @param {type} browser
     * @param {type} rowIndex
     * @param {type} selectedResponseList
     */
    exception.prototype.assertExceptionHighligted = function (browser, selectedResponseList) {

        selectedResponse = selectedResponseList;

        // Need to increment rowindex as if index is 0 we are pointing 1st LI.
        browser.verify.attributeContains("//div[@class='" + exceptionGridWrapperClass + "']/ul/li[" + (selectedResponse.index + 1) + "]", "class", exceptionGridHighlightClass, "Asserting exception indicator is highlighted");
    }

    /**
     * Assrert the exception count against the selected row.
     * @param browser
     * @param rowIndex
     * @param columnIndex
     * @param expectedExceptionCount
     */
    exception.prototype.assertExceptionCount = function (browser, selectedResponseList) {

        isWorkListGridActive(browser);
        selectedResponse = selectedResponseList;

        var currentelement = getExceptionNotificationElementName(browser);
        verifyExceptionCount(browser, currentelement);
    }

    exception.prototype.assertExceptionTitle = function (browser, selectedResponseList) {

        selectedResponse = selectedResponseList;
        var currentelement = getLinkedExceptionElementName(browser);
        verifyExceptionTitle(browser, currentelement);
    }

    /**
     * Double checking whether the grid worklist is active.
     * @param browser
     */
    function isWorkListGridActive(browser) {

        browser.expect.element(settings.livemarking.exception.classname.gridview).to.be.present;
    }

    /**
     * Get the exception element
     * @param browser
     */
    function getLinkedExceptionElementName(browser) {

        return exceptionElement = "//div[@id='" + this.exceptionIdFormat.replace("{column}", columnIndex).replace("{row}", selectedResponse.index) + "']";
    }

    /**
    * Get the exception notification element
    * @param browser
    */
    function getExceptionNotificationElementName(browser) {

        return exceptionElement = "//span[@id='" + this.exceptionNotificatgionCountFormat.replace("{column}", columnIndex).replace("{row}", selectedResponse.index) + "']";
    }

    /**
     * Verify the exception element.
     * @param {type} browser
     * @param {type} element
     */
    function verifyExceptionVisibility(browser, element) {

        // If has exception
        if (selectedResponse.totalexceptioncount > 0) {
            // Element is visible.

            console.log("final element : "+element);

            browser.expect.element(element).to.be.visible;

            this.exceptionIconType = undefined;

            if (selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount > 0) {

                // Assert css
                this.exceptionIconType = settings.livemarking.exception.classname.exceptioniconblocking;
            }
            else if (selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount == 0) {
                this.exceptionIconType = settings.livemarking.exception.classname.exceptioniconblocking;
            }
            else if (!selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount > 0) {
                this.exceptionIconType = settings.livemarking.exception.classname.exceptioniconnormal;
            }
            else if (!selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount == 0) {
                this.exceptionIconType = settings.livemarking.exception.classname.exceptioniconnormal;
            }
            else {
                this.exceptionIconType = settings.livemarking.exception.classname.exceptioniconnormal;
            }

            browser.verify.attributeContains(element + "/div/a/span", "class", this.exceptionIconType, "Asserting exception is highlighted.");
        }
        else {
            browser.expect.element(element + "/div/a/span").to.not.be.present;
        }
    }

    /**
     * Verifying exception title.
     * @param {type} browser
     * @param {type} element
     */
    function verifyExceptionTitle(browser, element) {

        this.exceptionTitle = undefined;

        if (selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount > 0) {
            this.exceptionTitle = liveData.title.has_exceptions_blocking_submission_few_resolved.replace("{0}",selectedResponse.resolvedexceptioncount);
        }
        else if (selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount == 0) {
            this.exceptionTitle = liveData.title.has_exceptions_blocking_submission;
        }
        else if (!selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount > 0) {
            this.exceptionTitle = liveData.title.has_exceptions_few_resolved.replace("{0}", selectedResponse.resolvedexceptioncount);
        }
        else if (!selectedResponse.hasblockingexception && selectedResponse.resolvedexceptioncount == 0) {
            this.exceptionTitle = liveData.title.has_exceptions_text;
        }
        else {
            this.exceptionTitle = liveData.title.has_exceptions_text;
        }

        browser.verify.attributeContains(element + "/div/a", "title", this.exceptionTitle, "Asserting the valid title is present");
    }

    /**
     * Verify the expected value
     * @param {type} browser
     * @param {type} element
     * @param {type} expectedValue
     */
    function verifyExceptionCount(browser, element) {

        // If any of the exceptions has been raised or in pending action
        if (selectedResponse.totalexceptioncount > 0)
        {
            browser.expect.element(element + "/span[1]").text.to.equal(selectedResponse.resolvedexceptioncount);
        }
    }

    return exception;
})();
module.exports = exception;
module.exports = {

    verifyItemText: function (browser, selector, text) {
        browser.useCss();
        browser.pause(2000);
        browser.getText(selector, function (result) {         
            this.verify.equal(text, result.value);
        });
    },

    verifyItemText_Xpath: function (browser, selector, text) {
        browser.useXpath();
        browser.pause(2000);
        browser.getText(selector, function (result) {        
            this.verify.equal(text, result.value);
        });
    },

    verifyItemClick: function (browser, selector) {
        browser.useCss();
        browser.pause(5000);
        browser.click(selector);
    },

    verifyCssClassIsPresent: function (browser, selector, cssClassName) {
        browser.useCss();
        browser.assert.cssClassPresent(selector, cssClassName);
    },

    verifyElementIsPresent: function (browser, selector) {
        browser.useCss();
        browser.expect.element(selector).to.not.present;
    },

    waitForElementPresent : function (browser, element, callback) {
        browser.waitForElementPresent(element, 20000, function () { });
    },

    waitForElementNotPresent : function (browser, element, callback) {
        browser.waitForElementNotPresent(element, 5000);
    }

    

    

}
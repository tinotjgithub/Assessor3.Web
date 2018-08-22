
module.exports = {

    getLengthByElement: function (browser, element) {
        browser.elements('xpath', element, function (result) {
            return result.value.length;
        });
    },

    getTextByElement: function (browser, element) {
        browser.useXpath();
        browser.getText(element, function (result) {
            console.log("TEST:" + result.value);
            return result.value;
        });
    },

    getElementVisible: function (browser, element) {
        browser.useXpath();
        browser.isVisible(element, function (result) {
            return result.value;
        });
    },

    getElementNotVisible: function (browser, element) {
        browser.useXpath();
        return browser.expect.element(element).to.not.be.visible;
    }


}



var objRepo = require("../objectrepository/objectrepository.json");
module.exports = {

 
    selectResponseID: function (browser, responseID) {
        browser.useXpath();
        browser.waitForElementPresent("//*[text()='" + responseID + "']", 50000, false);
        browser.getAttribute("//*[text()='" + responseID + "']", "id", function (result) {
           
        browser.useCss();
        browser.click("#"+result.value)
        });
    },

    verifyImagePresent: function (browser) {
        browser.waitForElementPresent(objRepo.ImageZone.ImageData.ImagePresent, 30000, false);
                 
    },

    verifyStitchedImagePresent: function (browser) {
        browser.useXpath();
        browser.elements("xpath", "//*[@class='marksheet-holder stiched']", function (result) {
        browser.useCss();
        browser.elementIdElements(result.value[0].ELEMENT, 'css selector', '.marksheet-img', function (result1) {
           
            if (result1.value.length > 1) {
                browser.verify.equal("stitched Image Present", "stitched Image Present")
            }
            else
            {
                browser.verify.equal("stitched Image not present", "stitched Image  present")
            }
        });

        });
    },

    verifyMultipleOutputPagesPresent: function (browser) {
        browser.useXpath();
        browser.elements("xpath", "//*[@class='marksheet-holder']", function (result) {
           
            if (result.value.length >= 1) {
                browser.verify.equal("MultiplePage Image Present", "MultiplePage Image Present")
            }
            else {
                browser.verify.equal("MultiplePage Image not present", "MultiplePage Image present")
            }
        });
        browser.useCss();
    },
    verifyTileView: function (browser) {
       
    },
    verifyResponeClose: function (browser, responseID) {
        
        browser.click(objRepo.response.responseCloseButtonId);
        browser.useXpath();
        browser.waitForElementPresent("//*[text()='" + responseID + "']", 3000, false);
        browser.useCss();
    }
}
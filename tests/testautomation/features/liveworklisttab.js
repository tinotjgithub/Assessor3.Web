var common = require("../features/common.js");
module.exports = {

    verifyTabItem: function(browser, tabcount, tabtext, tabPath) {
        browser.pause(2000);
        common.verifyItemText_Xpath(browser, tabPath.countPath, tabcount );
        common.verifyItemText_Xpath(browser, tabPath.textPath, tabtext );
        browser.pause(2000);
    }

}
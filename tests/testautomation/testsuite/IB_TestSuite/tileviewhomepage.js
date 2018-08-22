var tileview = require("../../testcases/testtileview.js");


module.exports = {


    "Pre Condition Switch to tile view": function (browser) {

        tileview.switchTileView(browser);

    },

    

    "Check simple and detailed view switching.": function (browser) {

        tileview.detailViewAndTileViewSwitching(browser);

    },

    "check the content in the grid both simple and detailed view.": function (browser) {

        tileview.checkGridContent(browser);

    },

    "Check the application remember the view selection": function (browser) {

        tileview.rememberGridView(browser);

    },


    "Check the tile view switching in closed status": function (browser) {

        tileview.CloseddetailViewAndTileViewSwitching(browser);

    },

   
    "Check content in closed status": function (browser) {

        tileview.ClosedcheckGridContent(browser);

    },
    
    "Check default order in the list": function (browser) {

        tileview.checkDefaultOrder(browser);
        browser.end();

    },

}
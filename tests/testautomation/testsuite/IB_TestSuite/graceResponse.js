var testworklistgrid = require("../../testcases/testGraceResponse.js");
var testgrid = undefined


module.exports = {




    "Check content in the Grace Response both tile and detailed view.": function (browser) {


        testgrid = new testworklistgrid();
        testgrid.checkGraceResponseGridContent(browser);
    },

    "Check default order in grace period.": function (browser) {


        testgrid = new testworklistgrid();
        testgrid.GraceResponsecheckDefaultOrder(browser);
    }


}


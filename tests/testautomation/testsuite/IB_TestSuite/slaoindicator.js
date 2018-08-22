var utilityobj  = require("../../utilityfunctions/utility.js");
var live = require("../../testcases/testslaoindicator.js");

module.exports = {


    //OFF, OFF
    "1 Verify that indicator is blank when both CCs OFF & has no SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete(browser);

    },

    "2 Verify that indicator is blank when both CCs OFF & has no SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete(browser);

    },

    "3 Verify that indicator is displayed when both CCs OFF & has SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete(browser);

    },

    "4 Verify that indicator is displayed when both CCs OFF & has SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete(browser);
        
    },

    //ON OFF
    "5 Verify that indicator is blank when AllPages CC is ON and SLAO CC is OFF & has no SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_NotComplete(browser);

    },

    "6 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has no SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_Complete(browser)

    },

    "7 Verify that indicator is blank when AllPages CC is ON and SLAO CC is OFF & has no SLAO & all pages annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_NotComplete(browser)

    },

    "8 Verify that indicator is blank when AllPages CC is ON and SLAO CC is OFF & has no SLAO & all pages annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_Complete(browser)

    },

    "9 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO & pages or SLAOs are not annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_NotComplete(browser)

    },

    "10 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO & pages or SLAOs are not annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_Complete(browser)

    },

    "11 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO &  all SLAOs are annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_NotComplete(browser)

    },

    "12 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO &  all SLAOs are annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_Complete(browser)

    },

    "13 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO &  all SLAOs and pages are annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_NotComplete(browser)

    },


    "14 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is OFF & has SLAO &  all SLAOs and pages are annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_OFF_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_Complete(browser)
        //browser.end();
    },


    "15 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has no SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_NotComplete(browser)

    },

    "16 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has no SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NA_Marking_Complete(browser)

    },

    "17 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NA_Marking_NotComplete(browser)

    },

    
    "18 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NA_Marking_Complete(browser)

    },

    "19 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has SLAO & all pages annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NA_Marking_NotComplete(browser)

    },

    "20 Verify that indicator is displayed when AllPages CC is OFF and SLAO CC is ON & has SLAO & all pages annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_OFF_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NA_Marking_Complete(browser)
        //browser.end();
    },


    "21 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_NotComplete(browser)

    },

    "22 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_NO_Marking_Complete(browser)
    },

    "23 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has no SLAO & all pages annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_NotComplete(browser)

    },

    "24 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has no SLAO & all pages annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_NO_AllSLAOAnnotated_NA_AllPagesAnnotated_YES_Marking_Complete(browser)

    },

    "25 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_NotComplete(browser)

    },

    "26 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_NO_AllPagesAnnotated_NO_Marking_Complete(browser)

    },

    "27 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO & all SLAOs annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_NotComplete(browser)

    },

    "28 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO & all SLAOs annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_NO_Marking_Complete(browser)

    },

    "29 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO & all SLAOs and pages annotated with marking not completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_NotComplete(browser)

    },

    "30 Verify that indicator is displayed when AllPages CC is ON and SLAO CC is ON & has SLAO & all SLAOs and pages annotated with marking completed": function (browser) {
        live.checkSLAOIndicator_AllPages_ON_AllSLAO_ON_ResponseSLAO_YES_AllSLAOAnnotated_YES_AllPagesAnnotated_YES_Marking_Complete(browser);
        browser.end();

    }

}

var signIn          = require("../features/login.js");
var qig             = require("../features/qig.js");
var wlsidepanel     = require("../features/worklistsidepanel.js");
var login           = require("../testdata/login.json");
var worklist        = require("../testdata/worklistuserinformation.json");


module.exports = {
    //verify live marking indicator in worklist sidebar
    livemarkingMarkingIndicator_targetdate_exceeded_zerountil: function (browser) {

        //var qigName = "'2213AQA UNSTRUCTUR Whole'";
        browser.pause(5000)
        qig.selectMenuDropdown(browser)
        browser.pause(5000)
        qig.selectQigElement(browser, "2213AQA UNSTRUCTUR Whole","name")

        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : xxAQA UNSTRUCTUR/xx19 X An Introduction to PhilosophySJ : 2213AQA UNSTRUCTUR Whole")
        wlsidepanel.verifyLivemarkingIndicatorcolorcheck(browser, "null", "pink", "null", "1")
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
      //  var targetdate = new Date("9/20/2013");       
      //  console.log(targetdate.toLocaleDateString("en-GB"));
      //  wlsidepanel.verifyTargetDate(browser, "Target:  " + targetdate.toLocaleDateString("en-GB"));
        wlsidepanel.verifyTargetDate(browser, "Target:9/20/2013");
        wlsidepanel.verifypendingdays(browser,"0days until");
        wlsidepanel.verifyNumberResponsesOpen(browser,"live","aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "0/100");        
    },
    //*************************************************************************************
    //***************************************************************************************

    livemarkingMarkingIndicator_fullsubmitted_zerountil: function (browser) {
     //   var qigName = "'222AQA UNSTRUCTUR Whole Paper'";
     
        browser.pause(5000)
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, "222AQA UNSTRUCTUR Whole Paper", "name")
        browser.pause(5000)
       
        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : wwAQA UNSTRUCTUR/ww19 X An Introduction to PhilosophySJ : 222AQA UNSTRUCTUR Whole Paper")
        wlsidepanel.verifyLivemarkingIndicatorcolorcheck(browser, "green", "null", "null", "1")
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, "2/12/2016");
        wlsidepanel.verifypendingdays_completed(browser, "Completed");
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "1/1");
        //*[@id='targetNameLarge_40_23']
    },


    //*************************************************************************************
    //***************************************************************************************

    livemarkingMarkingIndicator_futuretargetdate: function (browser) {
       
        var pendingdate;
     //   var qigName = "'2213AQA UNSTRUCTUR Whole'";
        browser.pause(5000)
        qig.selectMenuDropdown(browser)
        qig.selectQigElement(browser, "2213AQA UNSTRUCTUR Whole","name")
        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : xxAQA UNSTRUCTUR/xx19 X An Introduction to PhilosophySJ : 2213AQA UNSTRUCTUR Whole")
        pendingdate = wlsidepanel.remainingDaysForMarkingCompletion(browser,"3/10/2016");
        wlsidepanel.verifyLivemarkingIndicatorcolorcheck(browser, "green", "pink", "violet", "3")
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, "Target:3/10/2016");
        wlsidepanel.verifypendingdays(browser, pendingdate + "days until");
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "4/10");
    },

    //*************************************************************************************
    //***************************************************************************************

    livemarkingMarkingIndicator_pendingdays: function (browser) {
        
        var pendingdate;     
     
        browser.pause(5000)
        qig.selectMenuDropdown(browser)
        qig.selectQigElement(browser, "2213AQA UNSTRUCTUR Whole", "name")

        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : xxAQA UNSTRUCTUR/xx19 X An Introduction to PhilosophySJ : 2213AQA UNSTRUCTUR Whole")
       
        pendingdate = wlsidepanel.remainingDaysForMarkingCompletion(browser,"2/15/2017");
        wlsidepanel.verifyLivemarkingIndicatorcolorcheck(browser, "null", "pink", "null", "1")
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, "Target:2/15/2017");
        wlsidepanel.verifypendingdays(browser, pendingdate + "days until");
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "0/2");
    },



    //*************************************************************************************
    //***************************************************************************************

    livemarkingMarkingIndicator_awatingapproval: function (browser) {
       
        var pendingdate;       
        browser.pause(5000)
        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : wwAQA UNSTRUCTUR/ww19 X An Introduction to PhilosophySJ : 222AQA UNSTRUCTUR Whole Paper")
     
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, "Target:9/20/2013");
        wlsidepanel.verifypendingdays(browser, "0days until");
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "0/100");
    },



    //*************************************************************************************
    //***************************************************************************************

    livemarkingMarkingIndicator_liveresponseavailableinpool: function (browser) {
            
       
        browser.pause(5000)
      //  var qigName = "'ATAQA UNSTRUCTUR Whole Paper'";
        browser.pause(2000)
        qig.selectMenuDropdown(browser)
        qig.selectQigElement(browser, "ATAQA UNSTRUCTUR Whole Paper","name")
        qig.verifyselectedqigIndropdown(browser, "MARCH2015 : EEAQA UNSTRUCTUR/EE19 X An Introduction to PhilosophySJ : ATAQA UNSTRUCTUR Whole Paper")
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, "Target:2/15/2016");
        wlsidepanel.verifypendingdays(browser, "0days until");
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical","null");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, "Submitted", "0/2");
    },

    //
    livemarkingMarkingIndicator_noQig: function (browser) {

        var qigName = "'222AQA UNSTRUCTUR Whole Paper'";
        browser.pause(2000)
        qig.selectMenuDropdown(browser)
        wlsidepanel.verifyqigavailability(browser, qigName,"success");
     

    },

    worklistsidepanelverification:function(browser){
        wlsidepanel.verifyLivemarkingIndicatorcheck(browser)
        wlsidepanel.verifyMarkingLabel(browser);
        wlsidepanel.verifyTargetDate(browser, worklist.worklistSidepanel.lvPoolTargetText + worklist.worklistSidepanel.lvPoolTargetDate);
        wlsidepanel.verifypendingdays(browser, worklist.worklistSidepanel.pendingday);
        wlsidepanel.verifyNumberResponsesOpen(browser, "live", "aTypical");
        wlsidepanel.verifyMarkingTotal_submittedCount(browser, worklist.worklistSidepanel.lvPoolSubmittedText, worklist.worklistSidepanel.lvPoolTargetSubmitted);

}
}


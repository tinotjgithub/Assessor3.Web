var allocateResponse = require("../../testcases/testallocateResponse.js");
var allocateData = require("../../testdata/allocateResponse.json");
var utilityobj = require("../../utilityfunctions/utility.js");
var signIn = require("../../features/login.js");
var login = require("../../testdata/login.json");
module.exports = {

    //*************************************************************************************************************************************
    //                                        Allocate Response Testcase starts here
    //*************************************************************************************************************************************
    "verify allocateResponse in awaiting standardisation status": function (browser) {
        objData = utilityobj.getDataParam(browser, login);
        signIn.login(browser, allocateData.userinformation.testAwaitingUserName, allocateData.userinformation.testAwaitingPassword);
       
        allocateResponse.allocateResponseforAwaitingResponse(browser)
        
    },
      "verify allocateResponse in Simulation status": function (browser) {
     allocateResponse.allocateResponseforSimulationResponse(browser)
        
      },

      "verify allocateResponse in Practice Marking status": function (browser) {
            allocateResponse.allocateResponseforPracticeMarkingResponse(browser)
            browser.end();
      },
    
      "verify allocateResponse in Standardisation Marking status": function (browser) {
          signIn.login(browser, allocateData.userinformation.teststandUserName, allocateData.userinformation.teststandPassword);
          allocateResponse.allocateResponseforStandrdisationMarkingResponse(browser)
        
      },
    
      "verify allocateResponse in Second Standardisation Marking status": function (browser) {
             allocateResponse.allocateResponsefor2ndStandrdisationMarkingResponse(browser)
        
          },


        "Download liveResponse for suspended marker": function (browser) {

             allocateResponse.DownloadResponseforSuspendedMarker(browser)
                browser.end();

        },

   
    
      "verify allocateResponse in STM Standardisation Marking status": function (browser) {
          signIn.login(browser, allocateData.userinformation.testSTMUserName, allocateData.userinformation.testSTMPassword);
          allocateResponse.allocateResponseforSTMStandrdisationMarkingResponse(browser)
         
        
      },
     
////    //need restore functinality
//      "Download liveResponse with response not in open status but responses in pool": function (browser) {
//          allocateResponse.allocateResponseforLiveresponseOnlyInPool(browser)
 
//},
    
 

////    "Download liveResponse for conditionally approved concurrent limit": function (browser) {
      
////    },

    "verify GetNewResponse - when opened and concurrent limit are equal": function (browser) {
        allocateResponse.Reachedopenresponselimit(browser)
       
    },

    "Download liveResponse for Live target with response not in pool and not in open status": function (browser) {
        allocateResponse.DownloadResponseNotInPool(browser)
        

    },

        "verify Response allocation error 3 closed 3open 4 concurrent 6 target": function (browser) {
            allocateResponse.ResponseallocationError(browser)
            browser.end();
        },

        "Download liveResponse for Live target with response 1 closed 19open 20 concurrent 20 target": function (browser) {
            signIn.login(browser, allocateData.userinformation.testlvWLMeetTargetQigNameUserName, allocateData.userinformation.testlvWLMeetTargetQigNamePassword);
            allocateResponse.worklistMeetTarget(browser)
            browser.end();

    },

    //"Verify response allocation error with responses both in Live and aTypical": function (browser) {
  
    //    signIn.login(browser, allocateData.userinformation.testlvAtypicalUserName, allocateData.userinformation.testlvAtypicalPassword);
    //    allocateResponse.LiveAndaTypicalResponseError(browser)

    //},
    

//    "Download liveResponse with response not in open status 3 closed 5 target 3 concurrentlimit ": function (browser) {

//        "Only X responses have been downloaded as the number of  responses in your worklist has reached the number of responses required to meet your marking target"

//    },

//    "Download liveResponse with response not in open status 5 target 3 concurrent limit only two in pool": function (browser) {

//       pop up message  "X responses have been downloaded. It is not possible to download further responses to mark as there are no more  responses available"
//        select popup , it should disappear
//    },

//    "Download INPROGRESS and download button disabled": function (browser) {

        

//    },

   

   
//    "verify allocation rule for central eligibility": function (browser) {

        

//    },

//    "verify allocation rule for previously selected": function (browser) {

        

//    },

//    "verify allocation rule for randamisation": function (browser) {

        

//    },



//    //***********************************************REG*************************************
//    "Download liveResponse for Live target 2 open and 5 concurrentlimit": function (browser) {
       

//    },
//    "Download liveResponse for Live target 2 open and 1 concurrentlimit": function (browser) {
       

//    },
//    "Download liveResponse for Live target with concurrentlimit equal to target": function (browser) {
       

//    },
//    "Download liveResponse for Live target with concurrentlimit equal to zero": function (browser) {
       

//    },
//    // 3 target 4 concurrent 5 pool
//    "Download liveResponse concurrent greater than tartget with responses available in pool": function (browser) {


//    },

   

}
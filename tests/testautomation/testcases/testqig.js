//L3 layer containg all the testcases

//var signIn = require("../features/login.js");
var qig = require("../features/qig.js");
var liveopen = require("../features/liveworklist.js");
var refactorqig = require("../testdata/refactorQig.json");
var objRepo = require("../objectrepository/objectrepository.json");
var signIn = require("../features/login.js");

module.exports = {



//    //*************************************************************************************************************************************
//    //                                        RememberQig testcases starts here
//    //*************************************************************************************************************************************

        RememberQig_userlogout: function (browser) {
            // pre-condition: qig selected for marking for the first login
          
            var qigName = "'ATPhySP2TZ0XXXX'";
            //verify selected qig remembered by checking workilist page
          
            signIn.login(browser, objData.awaitingnosimusername, objData.awaitingnosimpassword);
            //browser.pause(2000);
            //browser.useXpath();
         
            //qig.verifyselectedqigIndropdown(browser, "physiSP2ENGTZ1XXXX-PHYSICS SL PAPER II")
            qig.selectMenuDropdown(browser)
                     
          
           qig.selectQig_worklistDropdown(browser, qigName)

           qig.verifyselectedqigIndropdown(browser, "ATPhySP2TZ0XXXX-AT-Phy")
          

       //Markerlogout
         signIn.logOut(browser);
        browser.end()

        },

        RememberQig_Relogin: function (browser) {
            // pre-condition: qig selected for marking for the first login

         //   var qigName = "'physiSP2ENGTZ1XXXX'";
            //verify selected qig remembered by checking workilist page

            signIn.login(browser, objData.awaitingnosimusername, objData.awaitingnosimpassword);
            browser.pause(2000);
           
            qig.verifyselectedqigIndropdown(browser, "ATPhySP2TZ0XXXX-AT-Phy")
            //qig.selectMenuDropdown(browser)


            //qig.selectQig_worklistDropdown(browser, qigName)          

            //browser.pause(2000);
            ////Markerlogout
            //signIn.logOut(browser);
            browser.end()

        },


  
        verifyrememberQig_unsuccesslogout: function (browser) {
            var qigName = "'ATPhySP2TZ0XXXX'";
            signIn.login(browser, objData.awaitingnosimusername, objData.awaitingnosimpassword);
         
            //verifying the rememberqig name in menu dropdown
          //  qig.verifyselectedqigIndropdown(browser, "physiSP2ENGTZ1XXXX-PHYSICS SL PAPER II")
           
            //change the qig for marking
            qig.selectMenuDropdown(browser)
            qig.selectQig_worklistDropdown(browser, qigName)
            qig.verifyselectedqigIndropdown(browser, "ATPhySP2TZ0XXXX-AT-Phy")
           

            //close browser without logout
            browser.end();

        },

        selectqigfirstlogin: function (browser) {
            var qigName = "'AT1bioSP1ENGTZ1XXXX'";
            signIn.login(browser, objData.livepoolusername, objData.livepoolpassword);
            browser.pause(5000);
            qig.selectQig_worklistDropdown(browser, qigName)
            qig.verifyselectedqigIndropdown(browser, "AT1bioSP1ENGTZ1XXXX-AT-Biology")

           browser.end();

        },

        verifyrememberQig_secondlogin: function (browser, qigName, username, password) {
            signIn.login(browser, username, password);
            browser.pause(5000);
        qig.verifyselectedqigIndropdown(browser, qigName)

    },
  
    //*************************************************************************************************************************************
    //                                        RememberQig testcases ends here
    //*************************************************************************************************************************************
     
    
      //*************************************************************************************************************************************
    //                                       Refactor qiglist testcases starts here
    //*************************************************************************************************************************************
    verifyQigListforAwaitingResponse: function (browser) {
      
            qig.selectMenuDropdown(browser)
            browser.pause(2000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.awaitingQigName, "name", refactorqig.qigName.wlstatus)
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.awaitingQigName, "currentMarkingMode", refactorqig.qigStatus.awaitingstatus) //- //"awaiting"
            qig.verifyTextColor(browser, refactorqig.qigName.awaitingQigName, "currentMarkingMode", refactorqig.qigColor.awaitingstatus)//- "Red"
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "progressIndicator_progress", refactorqig.qigProgress.awaitingstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "submittedTargetText", refactorqig.qigTarget.awaitingText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "submittedTargetValue", refactorqig.qigTarget.awaitingValue)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "targetDateText", refactorqig.qigTargetDate.awaitingtargetDateText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "targetDate", refactorqig.qigTargetDate.awaitingtargetDate)   
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "downloadedIndicator", refactorqig.qigIndicator.awaitingOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.awaitingQigName, "downloadIndicator", refactorqig.qigIndicator.awaitingPool)
                },
      
        verifyComponent_Session_alignment: function (browser) {
       //                 ***************component level verification******************
          //  browser.waitForElementPresent(objRepo.refactorQig.component, 1000, false, function (result) {
          //          browser.verify.equal(result.state, "success");
          //          browser.useCss();
          //  });

          ////  ******************session level verification*******************
          //  browser.waitForElementPresent(objRepo.refactorQig.session, 1000, false, function (result) {
          //                  browser.verify.equal(result.state, "success");
          //                  browser.useCss();
          //              });

                    browser.getLocation(objRepo.refactorQig.component, function (result1) {
                    console.log(result1);
                    browser.getLocation(objRepo.refactorQig.session, function (result2) {
                    console.log(result2);       
                    browser.verify.equal(result1.value.y, result2.value.y);
          
                    });      

                });
        
        },


        verifyQigListforSimulationResponse: function (browser) {
           
            //qig.selectMenuDropdown(browser)
            browser.pause(2000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.simulationQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.simulationQigName, "currentMarkingMode", refactorqig.qigStatus.simulationstatus) 
            qig.verifyTextColor(browser, refactorqig.qigName.simulationQigName, "currentMarkingMode", refactorqig.qigColor.simulationstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "progressIndicator_progress", refactorqig.qigProgress.simulationstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "submittedTargetText", refactorqig.qigTarget.simulationText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "submittedTargetValue", refactorqig.qigTarget.simulationValue)
 
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "targetDateText", refactorqig.qigTargetDate.simulationtargetDateText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "targetDate", refactorqig.qigTargetDate.simulationtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "downloadedIndicator", refactorqig.qigIndicator.simulationOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.simulationQigName, "downloadIndicator", refactorqig.qigIndicator.simulationPool)
         
            
        },

        verifyQigListforPractiseResponse: function (browser) {

            //qig.selectMenuDropdown(browser)
            browser.pause(2000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.practicestatus)
            qig.verifyTextColor(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.practicestatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.progressIndicator_progress, refactorqig.qigProgress.practicestatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.practiceText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.practiceValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.practicetargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.practicetargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.practiceOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.practiceQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.practicePool)
         
        },

        verifyQigListforLiveCompleteResponse: function (browser) {

          //  qig.selectMenuDropdown(browser)
            browser.pause(2000);
          
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.lvCompletestatus)
            qig.verifyTextColor(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.lvCompletestatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.lvCompleteQigName, refactorqig.qigProgress.lvCompleteclosed, refactorqig.qigProgress.lvCompletepending, refactorqig.qigProgress.lvCompleteopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltilvComplete)

            qig.verifyQigstatus(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.lvCompleteText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.lvCompleteValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.lvCompletetargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.lvCompletetargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.lvCompleteOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvCompleteQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvCompletePool)
          
        },
        verifyQigListforStandardisationResponse: function (browser) {

           // qig.selectMenuDropdown(browser)
            browser.pause(2000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.standQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.standQigName, "currentMarkingMode", refactorqig.qigStatus.standstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.standQigName, "currentMarkingMode", refactorqig.qigColor.standstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.standQigName, "progressIndicator_progress", refactorqig.qigProgress.standstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.standQigName, "submittedTargetText", refactorqig.qigTarget.standText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.standQigName, "submittedTargetValue", refactorqig.qigTarget.standValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.standQigName, "targetDateText", refactorqig.qigTargetDate.standtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.standQigName, "targetDate", refactorqig.qigTargetDate.standtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.standQigName, "downloadedIndicator", refactorqig.qigIndicator.standOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.standQigName, "downloadIndicator", refactorqig.qigIndicator.standPool)
           
        },

        verifyQigListfor2ndStandardisationResponse: function (browser) {
          
            qig.selectMenuDropdown(browser)
            browser.pause(2000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.secndstandQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            qig.verifyQigstatus(browser, refactorqig.qigName.secndstandQigName, "currentMarkingMode", refactorqig.qigStatus.secndstandstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.secndstandQigName, "currentMarkingMode", refactorqig.qigColor.secndstandstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.secndstandQigName, "progressIndicator_progress", refactorqig.qigProgress.secndstandstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.secndstandQigName, "submittedTargetText", refactorqig.qigTarget.secndstandText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.secndstandQigName, "submittedTargetValue", refactorqig.qigTarget.secndstandValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.secndstandQigName, "targetDateText", refactorqig.qigTargetDate.secndstandtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.secndstandQigName, "targetDate", refactorqig.qigTargetDate.secndstandtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.secndstandQigName, "downloadedIndicator", refactorqig.qigIndicator.secndstandOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.secndstandQigName, "downloadIndicator", refactorqig.qigIndicator.secndstandPool)
          },

        verifyQigListforQualityFeedbackResponse: function (browser) {
         
            //qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.qualityfbstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.qualityfbstatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.qualityfbQigName, refactorqig.qigProgress.qualityfbclosed, refactorqig.qigProgress.qualityfbpending, refactorqig.qigProgress.qualityfbopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltipquality)

            qig.verifyQigstatus(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.qualityfbText)
            qig.verifyQigstatus(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.qualityfbValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.qualityfbtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.qualityfbtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.qualityfbOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.qualityfbQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.qualityfbPool)
        
        },

        verifyQigListforSuspendedResponse: function (browser) {
           
            //qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.suspendedstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.suspendedstatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.suspendedQigName, refactorqig.qigProgress.suspendedclosed, refactorqig.qigProgress.suspendedpending, refactorqig.qigProgress.suspendedopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltipsuspended)

            qig.verifyQigstatus(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.suspendedText)
            qig.verifyQigstatus(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.suspendedValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.suspendedtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.suspendedtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.suspendedOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.suspendedQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.suspendedPool)
          
        },

        verifyQigListforSTMResponse: function (browser) {

            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.STMstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.STMstatus)
          
            qig.verifyElementNotPresent(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.progressIndicator_progress, refactorqig.qigProgress.STMstatus)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.STMText)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.STMValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.STMtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.STMtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.STMOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.STMQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.STMPool)
         
        },

        verifyQigListforLiveOnlyInPoolResponse: function (browser) {

           // qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.lvPoolstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.lvPoolstatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.lvPoolQigName, refactorqig.qigProgress.lvPoolclosed, refactorqig.qigProgress.lvPoolpending, refactorqig.qigProgress.lvPoolopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltiplvPool)

            qig.verifyQigstatus(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.lvPoolText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.lvPoolValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.lvPooltargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.lvPooltargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.lvPoolOPen)
            qig.verifyElementPresent(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvPoolPool)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvPoolQigName, objRepo.refactorQig.downloadIndicator,"title", refactorqig.qigIndicator.tooltiplvPool)
             
        },

        verifyQigListforLiveInOpenResponse: function (browser) {

          //  qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.lvOpenstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.lvOpenstatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.lvOpenQigName, refactorqig.qigProgress.lvOpenclosed, refactorqig.qigProgress.lvOpenpending, refactorqig.qigProgress.lvOpenopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltiplvOpen)

            qig.verifyQigstatus(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.lvOpenText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.lvOpenValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.lvOpentargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.lvOpentargetDate)
            qig.verifyElementPresent(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.lvOpenOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvOpenPool)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvOpenQigName, objRepo.refactorQig.downloadedIndicator, "title", refactorqig.qigIndicator.tooltiplvOpen)

        },

        verifyQigListforLiveNoIndicatorResponse: function (browser) {

          //  qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigSelectionanywhereInPanel(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.qigname, refactorqig.qigName.wlstatus)
            browser.pause(2000);
            qig.selectMenuDropdown(browser)
            browser.pause(5000);
            qig.verifyQigstatus(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigStatus.lvNoIndstatus)
            qig.verifyTextColor(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.currentMarkingMode, refactorqig.qigColor.lvNoIndstatus)
            qig.verifyProgressbar(browser, refactorqig.qigName.lvNoIndQigName, refactorqig.qigProgress.lvNoIndclosed, refactorqig.qigProgress.lvNoIndpending, refactorqig.qigProgress.lvNoIndopen)
            qig.verifyQigattribute(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.progressIndicator_progress, "title", refactorqig.qigProgress.tooltiplvNoInd)

            qig.verifyQigstatus(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.submittedTargetText, refactorqig.qigTarget.lvNoIndText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.submittedTargetValue, refactorqig.qigTarget.lvNoIndValue)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.targetDateText, refactorqig.qigTargetDate.lvNoIndtargetDateText)
            qig.verifyQigstatus(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.targetDate, refactorqig.qigTargetDate.lvNoIndtargetDate)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.downloadedIndicator, refactorqig.qigIndicator.lvNoIndOPen)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvNoIndPool)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvNoIndPool)
            qig.verifyElementNotPresent(browser, refactorqig.qigName.lvNoIndQigName, objRepo.refactorQig.downloadIndicator, refactorqig.qigIndicator.lvNoIndPool)
           
        },


    
    
}; 

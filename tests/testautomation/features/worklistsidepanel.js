var objRepo = require("../objectrepository/objectrepository.json");


module.exports = {

    verifyLivemarkingIndicatorcolorcheck: function (browser,green,pink,violet,count) {
        //browser.useXpath();     
       

        ////browser.waitForElementPresent("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][1]",1000, "marking indicator days remaining indicator check", function (result) {

        ////});

        //// color check
        ////*************************************************************************************************
        //if (count > 0) {

        //    browser.getAttribute("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][1]", "class", function (result) {
               
        //        if (result.value == "target-progress-style path") {
        //            if (green == "green") {
                       
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][1]", 'class', "target-progress-style path");
        //            }
        //        }


        //        else if (result.value == "target-progress-style1 path") {
        //            if (pink == "pink") {
                       
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][1]", 'class', "target-progress-style1 path");

        //            }
        //        }

        //        else if (result.value == "target-progress-style2 path") {
        //            if (violet == "violet") {
                       
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][1]", 'class', "target-progress-style2 path");


        //                  }
        //        }


        //    });

        //}

        ////**************************************************************************************************

        //if (count > 1) {
        //    browser.getAttribute("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][2]", "class", function (result) {
        //        if (result.value == "target-progress-style path") {                    
        //            if (green == "green") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][2]", 'class', "target-progress-style path");

        //      }
        //        }


        //        else if (result.value == "target-progress-style1 path") {
        //            if (pink == "pink") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][2]", 'class', "target-progress-style1 path");


        //                }
        //        }

        //        else if (result.value == "target-progress-style2 path") {
        //            if (violet == "violet") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][2]", 'class', "target-progress-style2 path");


        //                 }
        //        }


        //    });
        //}

        ////*************************************************************************************************
        //if (count == 3) {
        //    browser.getAttribute("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][3]", "class", function (result) {
        //        if (result.value == "target-progress-style path") {
        //            if (green == "green") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][3]", 'class', "target-progress-style path");

        //                 }
        //        }


        //        else if (result.value == "target-progress-style1 path") {
        //            if (pink == "pink") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][3]", 'class', "target-progress-style1 path");

        //              }
        //        }

        //        else if (result.value == "target-progress-style2 path") {
        //            if (violet == "violet") {
        //                browser.verify.attributeContains("//*[@id='target_30_0']/div[1]/*[local-name() = 'svg']/*[local-name() = 'path'][3]", 'class', "target-progress-style2 path");

        //               }
        //        }


        //    });

        //}
            
        //browser.useCss();
    },


    //***************************************************************************************************
    //****************************************************************************************************


    verifyLivemarkingIndicatorcheck: function (browser) {
        //browser.useXpath();
      
        //browser.waitForElementPresent("(.//*[local-name() = 'svg']/*[local-name() = 'circle'])[1]",1000,"marking indicator progress indicator check")

        //browser.waitForElementPresent("(.//*[local-name() = 'svg']/*[local-name() = 'circle'])[2]",1000,"marking indicator remaining days indicator check")
        
        //browser.useCss();
    },


    verifyqigavailability: function (browser, qigname, status) {
        browser.useXpath();
        browser.pause(10000);        
        browser.getText("//span[text()='" + qigname + "']", function (result) {
           // browser.verify.equal(result.value, livecount);
            console.log(result);
            browser.useCss();

        });

    },


        
       






















    //*************************************************************************************************
    //**************************************************************************************************

    verifyMarkingLabel: function (browser, count) {
        browser.useXpath();
        browser.getText("//*[@id='targetNameLarge_30_0']", function (result) {
            browser.verify.equal(result.value, "Marking");
           

            browser.useCss();
        });
    },
    //*************************************************************************************
    //***************************************************************************************
    verifyNumberResponsesOpen: function (browser, live, aTypical, supervisor) {
       
        browser.useXpath();
        var liveCount = 0;
        var aTypicalCount = 0;
        var supervisorCount = 0;
        var openCount = 0;
        var text;
        if (live == "live") {
           
            browser.getText("//*[@id='worklistTypeworklist_live']/span[1]", function (result) {
                liveCount = result.value
               
               
                openCount += parseInt(liveCount);
              
            });

            browser.getText("//*[@id='worklistTypeworklist_live']/span[2]", function (result) {
                browser.verify.equal(result.value, "Live");

            });
            
        }

        //*****************************************************************
        if (aTypical == "aTypical") {
         
            browser.getText("//*[@id='worklistTypeworklist_atypical']/span[1]", function (result) {
                aTypicalCount = result.value
              
                
                openCount += parseInt(aTypicalCount);
              
            });

            browser.getText("//*[@id='worklistTypeworklist_atypical']/span[2]", function (result) {
                browser.verify.equal(result.value, "Atypical");

            });


        }
        //*****************************************************************************
        if (supervisor == "supervisor") {
         
            browser.getText("//*[@id='worklistTypeworklist_supervisorRemark']/span[1]", function (result) {
                supervisorCount = result.value
               
           
                openCount += parseInt(supervisorCount);
               
            });

            browser.getText("//*[@id='worklistTypeworklist_supervisorRemark']/span[2]", function (result) {
                browser.verify.equal(result.value, "Supervisor Remark");

            });

        }
        //*********************************validating count**********************
      
        browser.getText("//*[@id='targetname_30_0']/span[1]", function (result) {
           
        browser.verify.equal(result.value, openCount);
          
        });
        //*************************************************************************

        browser.getText("//*[@id='targetname_30_0']/span[1]", function (result) {
           
            text = result.value
        

        });
        browser.getText("//*[@id='targetname_30_0']/span[2]", function (result) {
          
            text = text + result.value
         

        });
        browser.getText("//*[@id='targetname_30_0']/span[3]", function (result) {
          
            text = text + result.value          
            browser.verify.equal(text, openCount+"open");

        });

        browser.useCss();
    },

    //**********************************************************************************************
    //**********************************************************************************************
    verifyMarkingTotal_submittedCount: function (browser,text,value) {
        browser.useXpath();
        
        var count;
       
            browser.getText("//div[@id='targetSummaryCount_30_0']/span[1]", function (result) {
                count = result.value;            
                
            });

            browser.getText("//div[@id='targetSummaryCount_30_0']/span[2]", function (result) {
                count = count + result.value;                

            });

            browser.getText("//div[@id='targetSummaryCount_30_0']/span[3]", function (result) {
                count = count + result.value;             
                browser.verify.equal(count, value);
            });

            browser.getText("//*[@id='targetname_30_0']/parent::div/preceding-sibling::div[1]", function (result) {
               
                browser.verify.equal(result.value, text);
            });

        
        browser.useCss();
        },

    //****************************************************************************************
    //*******************************************************************************************
    verifypendingdays: function (browser,exp) {
        browser.useXpath();        

        browser.getText("//*[@id='targetremainingDays_30_0']/span[1]", function (result) {
            browser.getText("//*[@id='targetremainingDays_30_0']/span[2]", function (result2) {
                var text = result.value + result2.value
               
                browser.verify.equal(text, exp);
            });
        });       

        browser.useCss();
    },

    //****************************************************************************************
    //*******************************************************************************************
    verifypendingdays_completed: function (browser, exp) {
        browser.useCss();

        browser.getText("#targetremainingDays_30_0", function (result) {
          
                var text = result.value 

                browser.verify.equal(text, exp);
            
        });

        
    },


    //*********************************************************************************
    //*************************************************************************************

    verifyTargetDate: function (browser,exp) {
        browser.useXpath();

        browser.getText("//*[@id='targetname_30_0']/div/span[1]", function (result) {
            browser.getText("//*[@id='targetCompleteDate_30_0']", function (result2) {
                var text = result.value + result2.value                
               browser.verify.equal(text,exp);
            });
        });

        browser.useCss();
    },

    //*******************************************************************************
    //********************************************************************************

    /**
     * Get the remaining days for the completion date. Shouldn't be negetive.
     * If target is met return the value as 0.
     * @param markingCompletionDate
     */
    remainingDaysForMarkingCompletion: function (browser, targetdate) {
        var today = new Date();
        var markingDate = new Date(targetdate);

        // Converting milli seconds to 1 day.
        var one_day = 1000 * 60 *  60 * 24;

        var noOfDays = (Math.ceil((markingDate.getTime() - today.getTime()) / (one_day)));        

        if (noOfDays < 0) {
            return 0;
        }
        else {
            return(noOfDays);
        }
    }

}
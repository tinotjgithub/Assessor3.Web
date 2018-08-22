var qig = require("../features/qig.js");
var liveworklist = require("../features/liveworklist.js");
var refactorQig = require("../testdata/refactorQig.json");
var allocate = require("../testdata/allocateResponse.json");
var objRepo = require("../objectrepository/objectrepository.json");
var worklist = require("../testcases/testworklistsidepanel.js")
module.exports = {

    //*************************************************************************************************************************************
    //                                        Allocate Response Testcase starts here
    //*************************************************************************************************************************************
    allocateResponseforAwaitingResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(5000)
        qig.selectQigElement(browser, refactorQig.qigName.awaitingQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
        browser.verify.equal(result.state, "success")})
      
    },
    allocateResponseforSimulationResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.simulationQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
            browser.verify.equal(result.state, "success")
        })

    },

    allocateResponseforPracticeMarkingResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.practiceQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
            browser.verify.equal(result.state, "success")
        })

    },

    allocateResponseforStandrdisationMarkingResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.standQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
            browser.verify.equal(result.state, "success")
        })

    },

    allocateResponsefor2ndStandrdisationMarkingResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.secndstandQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
            browser.verify.equal(result.state, "success")
        })

    },

    allocateResponseforSTMStandrdisationMarkingResponse: function (browser) {
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.STMQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        browser.waitForElementNotPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
            browser.verify.equal(result.state, "success")
        })

    },

    allocateResponseforLiveresponseOnlyInPool: function (browser) {
       
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.lvPoolQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);
        //browser.getText(objRepo.allocateResponse.lvPoolMsg1, 1000, false, function (result) {
        //    browser.verify.equal(result.value, allocate.liveMarking.lvPoolMsg1)
        //})
        //browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
        //    browser.verify(result.value, allocate.liveMarking.GetNewResponses)
        //})
        //liveworklist.selectGetNewResponse(browser)
        liveworklist.verifyElementsCount(browser, allocate.liveMarking.lvPoolResponseIDCount)
   
        browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
            this.verify.equal(result.value,objRepo.allocateResponse.getNewResponse_button_disable);
            
        });

        browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
        })
        browser.getText(objRepo.allocateResponse.getNewResponseButton_subText, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.lvPoolGetResponseSubText)
        })
        worklist.worklistsidepanelverification(browser)
    },


        DownloadResponseforSuspendedMarker: function (browser) {
            qig.selectMenuDropdown(browser)
            browser.pause(2000)
            qig.selectQigElement(browser, refactorQig.qigName.suspendedQigName, objRepo.refactorQig.qigname)
            browser.pause(2000);
            browser.waitForElementPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
                browser.verify.equal(result.state, "success")
            })         
            browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
            })
           

            browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
                this.verify.equal(result.value,objRepo.allocateResponse.getNewResponse_button_disable);

            });

            
        },

        DownloadResponseNotInPool: function (browser) {
            qig.selectMenuDropdown(browser)
            browser.pause(2000)
            qig.selectQigElement(browser, refactorQig.qigName.lvNoIndQigName, objRepo.refactorQig.qigname)
            browser.pause(2000);
            browser.waitForElementPresent(objRepo.allocateResponse.getNewResponse_button, 1000, false, function (result) {
                browser.verify.equal(result.state, "success")
            })
            browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
            })
            browser.getText(objRepo.allocateResponse.getNewResponseButton_subText, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvCompleteGetResponseSubText)
            })

            browser.getText(objRepo.allocateResponse.lv_complete_workListMessage_messageHeader, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvComplete_workListMessage_messageHeader)
            })
            browser.getText(objRepo.allocateResponse.lv_Complete_workListMessage_messageContent, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvComplete_workListMessage_messageContent)
            })



            browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
                this.verify.equal(result.value, objRepo.allocateResponse.getNewResponse_button_disable);

            });


        },
        ResponseallocationError: function (browser) {
            browser.pause(2000);
     
            qig.selectMenuDropdown(browser)
            
            qig.selectQigElement(browser, refactorQig.qigName.lvResAllocationErrorQigName, objRepo.refactorQig.qigname)
            browser.pause(5000);
            browser.useCss();
            browser.waitForElementPresent(objRepo.allocateResponse.getNewResponse_button, 10000, false, function (result) {
                browser.verify.equal(result.state, "success")
            })
            browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.GetNewResponses)

            })

            browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
                this.verify.equal(result.value, objRepo.allocateResponse.getNewResponse_button_enable);

            });

            liveworklist.selectGetNewResponse(browser)

            browser.waitForElementPresent(objRepo.allocateResponse.popup_responseallocationerrordialog_header, 10000, false, function (result) {
                browser.verify.equal(result.state, "success")
            })
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_header, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvResponse_Allocation_Error)
            })
            browser.waitForElementPresent(objRepo.allocateResponse.popup_responseallocationerrordialog_description, 10000, false, function (result) {
                browser.verify.equal(result.state, "success")
            })
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_description, function (result) {
                console.log(result.value);
                browser.verify.equal(result.value, allocate.liveMarking.lvpopup_responseallocationerrordialog_description)
            })

            browser.click(objRepo.allocateResponse.popup_responseallocationerrordialog_ok_button)


        },

    


    Reachedopenresponselimit: function (browser) {
            qig.selectMenuDropdown(browser)
            browser.pause(2000)
            qig.selectQigElement(browser, refactorQig.qigName.lvReachedMaimumLtQigName, objRepo.refactorQig.qigname)
            browser.pause(2000);          
   
            browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
            this.verify.equal(result.value,objRepo.allocateResponse.getNewResponse_button_disable);
            
            });

            browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
            })
            browser.getText(objRepo.allocateResponse.getNewResponseButton_subText, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.lvPoolGetResponseSubText)
            })
        
    },

    worklistMeetTarget: function (browser) {
        browser.pause(2000)
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.lvWLMeetTargetQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);

        browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
            this.verify.equal(result.value, objRepo.allocateResponse.getNewResponse_button_enable);

        });

        browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
        })
        liveworklist.selectGetNewResponse(browser)
            browser.pause(5000)
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_header, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvResponse_Allocation_Error)
            })
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_description, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvpopup_responseallocationerrordialog_lvWLMeetTargetQigName)
                })

            browser.click(objRepo.allocateResponse.popup_responseallocationerrordialog_ok_button)

    },

    LiveAndaTypicalResponseError: function (browser) {
        browser.pause(2000)
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.lvAtypicalQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);

        browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
            this.verify.equal(result.value, objRepo.allocateResponse.getNewResponse_button_enable);

        });

        browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
        })
      
         liveworklist.selectGetNewResponse(browser)
            browser.pause(5000)
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_header, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvResponse_Allocation_Error)
            })
            browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_description, function (result) {
                browser.verify.equal(result.value, allocate.liveMarking.lvpopup_responseallocationerrordialog_aTypical)
            })

            browser.click(objRepo.allocateResponse.popup_responseallocationerrordialog_ok_button)

    },

    VerifyImageZone: function (browser) {
        browser.pause(2000)
        qig.selectMenuDropdown(browser)
        browser.pause(2000)
        qig.selectQigElement(browser, refactorQig.qigName.ImageZoneQigName, objRepo.refactorQig.qigname)
        browser.pause(2000);

        browser.getAttribute(objRepo.allocateResponse.getNewResponse_button, "class", function (result) {
            this.verify.equal(result.value, objRepo.allocateResponse.getNewResponse_button_enable);

        });

        browser.getText(objRepo.allocateResponse.getNewResponse_text, function (result) {
            this.verify.equal(result.value, allocate.liveMarking.GetNewResponses)
        })
        liveworklist.selectGetNewResponse(browser)
        browser.pause(5000)
        browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_header, function (result) {
            browser.verify.equal(result.value, allocate.liveMarking.lvResponse_Allocation_Error)
        })
        browser.getText(objRepo.allocateResponse.popup_responseallocationerrordialog_description, function (result) {
            browser.verify.equal(result.value, allocate.liveMarking.lvpopup_responseallocationerrordialog_lvWLMeetTargetQigName)
        })

        browser.click(objRepo.allocateResponse.popup_responseallocationerrordialog_ok_button)

    },

    
    
    
}
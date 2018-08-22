var utility = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var liveData = require("../testdata/live.json");
var loginForm = require("../features/login.js");
var data = require("../testdata/login.json");
var responseSubmissionHelper = require("../features/livemarking/submission/responsesubmission.js");
var common = require("../features/common.js");
var qig = require("../features/qig.js");
var promise = require("es6-promise");

var allresponsesubmission = (function () {

    var helper = undefined;

    /**
     * @Constructor
     */
    function allresponsesubmission() {
    }

    allresponsesubmission.prototype.initialize = function (browser, userName, password) {
        loginData = utility.getDataParam(browser, data);
        //loginForm.launchApplication(browser, loginData);
        loginForm.login(browser, "fake", "132,,A3IB");
        //loginForm.login(browser, "A3IB_atjoselive135", "Computer1");
        browser.pause(5000);
        //validateGrid(browser);
        helper = new responseSubmissionHelper();
    };


    //2948 A3IB_atjoselive135
    allresponsesubmission.prototype.TestSubmitResponseButtonVisibility = function (browser) {
        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(InGarce)", "name");
        browser.pause(5000);
      
        helper.getSubmitButtonCount(browser, function (count) {
            if (count >= 1) {
                browser.verify.visible(objRepo.submission.submitall);
            } else {
                browser.verify.elementNotPresent(objRepo.submission.submitall);
            }
        });                       
               
    }

    //2962 A3IB_atjoselive135
    allresponsesubmission.prototype.TestConfirmationPop_Visible_Text_Title_OnSubmitResponses = function (browser) {      
        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(InGarce)", "name");
       
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submitAll(browser);
        
        helper.isSubmitConfirmationPopupDisplayed(browser, function (popup) {
            browser.verify.equal(popup, 0);
        });    
       
        helper.getSubmitPopupTitle(browser, function (title) {
            browser.verify.equal(title, liveData.responsesubmission.submitall.popuptitle);
        });
               
        helper.getSubmitPopupContent(browser, function (content) {
            browser.verify.equal(content, liveData.responsesubmission.submitall.popupcontent);
        });
       
    }

    //2969 A3IB_atjoselive135
    allresponsesubmission.prototype.TestSubmitAllResponses_To_Grace = function (browser) {

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(InGarce)", "name");
       
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        var p1 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Grace", function (gracecount) {
                resolve(gracecount);
                grace = Number(gracecount);
            });
        });

        var p2 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Open", function (opencount) {
                resolve(opencount);
                open = Number(opencount);
            });
        });

        var p3 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Live", function (livecount) {
                resolve(livecount);
                live = Number(livecount);
            });
        });

        var p4 = new Promise(function (resolve, reject) {
            helper.getSubmitButtonCount(browser, function (submitcount) {
                resolve(submitcount);
                submit = Number(submitcount);
            });
        });

        var p5 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "ProgressWheelSubmitted", function (submittedcount, totalcount) {
                resolve(submittedcount, totalcount);
                submitted =  Number(submittedcount);
            })
        });

        var p6 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "ProgressWheelOpen", function (count) {
                resolve(count);
                openleftpanelcount = Number(count);
            })
        });

        Promise.all([p1, p2, p3, p4, p5, p6]).then(function (values) {
        });

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);    
       
       
        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace + submit, "grace count after submission");
        });      
       
        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - submit, "open count after submission");
        });
               
        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - submit, "live count after submission");
        });
      
        
        helper.getResponseCount(browser, "ProgressWheelSubmitted", function (currentsubmitted, totalcount) {
            browser.verify.equal(currentsubmitted, submitted + submit, "submitted count after submission");
        });      
      
        helper.getResponseCount(browser, "ProgressWheelOpen", function (currentopenleftpanel) {
            browser.verify.equal(currentopenleftpanel, openleftpanelcount - submit, "open count in left panel after submission");
        });
        
        qig.selectMenuDropdown(browser);
        helper.getResponseCount(browser, "QigListSubmitted", function (qiglistsubmittedcount) {
            browser.verify.equal(qiglistsubmittedcount, submitted + submit, "qiglist submitted count after submission");
        });

    }


   //2970
    allresponsesubmission.prototype.TestSubmitAllResponses_To_Closed = function (browser) {
        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(Closed)", "name");

        common.waitForElementPresent(browser, objRepo.submission.submitall);

        var p1 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Closed", function (closedcount) {
                resolve(closedcount);
                closed = Number(closedcount);
            });
        });

        var p2 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Open", function (opencount) {
                resolve(opencount);
                open = Number(opencount);
            });
        });

        var p3 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Live", function (livecount) {
                resolve(livecount);
                live = Number(livecount);
            });
        });

        var p4 = new Promise(function (resolve, reject) {
            helper.getSubmitButtonCount(browser, function (submitcount) {
                resolve(submitcount);
                submit = Number(submitcount);
            });
        });

        var p5 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "ProgressWheelSubmitted", function (submittedcount, totalcount) {
                resolve(submittedcount, totalcount);
                submitted = Number(submittedcount);
            })
        });

        var p6 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "ProgressWheelOpen", function (count) {
                resolve(count);
                openleftpanelcount = Number(count);
            })
        });

        Promise.all([p1, p2, p3, p4, p5, p6]).then(function (values) {
        });

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);


        helper.getResponseCount(browser, "Closed", function (currentclosed) {
            browser.verify.equal(currentclosed, closed + submit, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - submit, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - submit, "live count after submission");
        });


        helper.getResponseCount(browser, "ProgressWheelSubmitted", function (currentsubmitted, totalcount) {
            browser.verify.equal(currentsubmitted, submitted + submit, "submitted count after submission");
        });

        helper.getResponseCount(browser, "ProgressWheelOpen", function (currentopenleftpanel) {
            browser.verify.equal(currentopenleftpanel, openleftpanelcount - submit, "open count in left panel after submission");
        });

        qig.selectMenuDropdown(browser);
        helper.getResponseCount(browser, "QigListSubmitted", function (qiglistsubmittedcount) {
            browser.verify.equal(qiglistsubmittedcount, submitted + submit, "qiglist submitted count after submission");
        }); 
    
    }

    //2926 partial
    allresponsesubmission.prototype.TestBusyIndicator_Text = function (browser) {
       
        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(InGarce)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);
        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.busyIndicatorText);        
        helper.getBusyIndicatorText(browser, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submitall.busyindicatortext);           
        })                  
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);
        
    }

    allresponsesubmission.prototype.Test_Response_Count_In_Grid_Same_As_Open_Tab = function (browser) {

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(InGarce)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);
        var p1 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Open", function (opencount) {
                resolve(opencount);
            });
        }).then(function(opencount){
            helper.getCountByElement(browser, "Grid", function (rowcount) {
                browser.verify.equal(rowcount, opencount, "Number of responses in screen same as Open tab count");
            });
        });
        
    }

    allresponsesubmission.prototype.Test_MultiSubmit_For_Suspended_Marker = function (browser) {
        //loginData = utility.getDataParam(browser, data);
        //loginForm.login(browser, loginData.login.submit.suspendedusername, loginData.login.submit.suspendedpassword);

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(Closed)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submitall.messageforsuspendedmarker);
        });

        // browser.close();
    }


    allresponsesubmission.prototype.Test_MultiSubmit_For_Suspended_Marker = function (browser) {
        //loginData = utility.getDataParam(browser, data);
        //loginForm.login(browser, loginData.login.submit.suspendedusername, loginData.login.submit.suspendedpassword);

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(Closed)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submitall.messageforsuspendedmarker);
        });

        // browser.close();
    }
    

    allresponsesubmission.prototype.Test_MultiSubmit_For_Withdrawn_Marker = function (browser) {
        //loginData = utility.getDataParam(browser, data);
        //loginForm.login(browser, loginData.login.submit.withdrawnusername, loginData.login.submit.withdrawnpassword);

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(Closed)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submitall.messageforwithdrawnmarker);
        });

        //browser.close();
    }

    allresponsesubmission.prototype.Test_MultiSubmit_For_NotAprroved_Marker = function (browser) {
        //loginData = utility.getDataParam(browser, data);
        //loginForm.login(browser, loginData.login.submit.notapprovedusername, loginData.login.submit.notapprovedpassword);

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, "ATPhysics(Closed)", "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submitAll(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submitall.messagefornotapprovedmarker);
        });

       // browser.close();
    }


    function validateGrid(browser) {

        // TO need to remove when integrating.
        // browser.waitForElementPresent('.grid-wrapper', 100000);

        // (1) validate css class name indicates a GRID to ensure user is viewing Grid view.
        // (2) validate whether the user viewing OPEN response worklist.
        browser
        .verify.visible('.grid-holder.grid-view', "Validating live marking worklist grid is visible.")
        .verify.visible('.resp-open.active', "Validating live marking open response is active.");
    }

    return allresponsesubmission;
})();

module.exports = allresponsesubmission;
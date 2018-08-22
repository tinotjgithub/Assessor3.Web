var utility = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var liveData = require("../testdata/live.json");
var loginForm = require("../features/login.js");
var data = require("../testdata/login.json");
var responseSubmissionHelper = require("../features/livemarking/submission/responsesubmission.js");
var qig = require("../features/qig.js");
var common = require("../features/common.js");
var promise = require("es6-promise");

var submission = (function () {

    var helper = undefined;

    /**
     * @Constructor
     */
    function submission() {
    }

    submission.prototype.initialize = function (browser, userName, password) {
       
        helper = new responseSubmissionHelper();
    };
 
    //working
    submission.prototype.Test_Single_Submit_Responses_To_Grace = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.responsesubmission.username, loginData.login.liveworklisttest.submit.responsesubmission.password);
        
        browser.pause(5000);
        
        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });
       
        common.waitForElementPresent(browser, objRepo.submission.livecountcss);

        var p1 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Grace", function (gracecount) {
                resolve(gracecount);
                grace = Number(gracecount);
                //console.log("grace:" + grace);
            });
        });

        var p2 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Open", function (opencount) {
                resolve(opencount);
                open = Number(opencount);
                //console.log("open:" + open);
            });
        });

        var p3 = new Promise(function (resolve, reject) {
            helper.getResponseCount(browser, "Live", function (livecount) {
                resolve(livecount);
                live = Number(livecount);
                //console.log("live:" + live);
            });
        });

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.submit(browser);
      
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.busyIndicatorText);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);
       
       
        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace + 1, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - 1, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - 1, "live count after submission");
        });

        //browser.close();
        
    }

 
    //working TO CHECK DATA
    submission.prototype.Test_Single_Submit_Responses_To_Closed = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.responsesubmission.username, loginData.login.liveworklisttest.submit.responsesubmission.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);


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

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.submit(browser);

        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);

        helper.getResponseCount(browser, "Closed", function (currentclosed) {
            browser.verify.equal(currentclosed, closed + 1, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - 1, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - 1, "live count after submission");
        });

    }

    //working
    submission.prototype.TestNotConfirmingSubmittingSingleResponse = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.responsesubmission.username, loginData.login.liveworklisttest.submit.responsesubmission.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);
            
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

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.submit(browser);

        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupNo(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);

        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace, "grace count after not confirming submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open, "open count after not confirming submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live, "live count after not confirming submission");
        });

    }

    //working
    submission.prototype.Test_SingleSubmit_NonBlockingException_To_Grace = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.responsesubmission.username, loginData.login.liveworklisttest.submit.responsesubmission.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);

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

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.clickSubmitByRow(browser, liveData.responsesubmission.submit.nonblockingexception.response);

        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);
           
        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace + 1, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - 1, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - 1, "live count after submission");
        });

    }

    //2907 working
    submission.prototype.Test_SingleSubmit_Not_Available_For_Response_With_Blocking_Exception = function (browser) {
        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.responsesubmission.username, loginData.login.liveworklisttest.submit.responsesubmission.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);

        var p1 = new Promise(function (resolve, reject) {
            helper.getSubmitByRow(browser, liveData.responsesubmission.blockingexception.response, function (element, status) {
                resolve(status);
            });

        }).then(function (status) {
            browser.verify.equal(status, -1, "submit button not available for response with blocking exception");
        });
       
    }

    //2909, 2916 working for login A3IB_atgraham86
    submission.prototype.Test_SingleSubmit_For_Response_SLAO_ON_HasSLAO_SLAO_Annotated = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.annotated.username, loginData.login.liveworklisttest.submit.annotated.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.annotated.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);

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

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.clickSubmitByRow(browser, liveData.responsesubmission.submit.annotated.response);
       
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);        

        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace + 1, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - 1, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - 1, "live count after submission");
        });

    }


    //2946 working for login A3IB_atjosphine137
    submission.prototype.Test_SingleSubmit_For_Seed_Response = function (browser) {

        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.seedsubmission.username, loginData.login.liveworklisttest.submit.seedsubmission.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);
           
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

        Promise.all([p1, p2, p3]).then(function (values) {
        });

        helper.clickSubmitByRow(browser, liveData.responsesubmission.submit.seed.response);

        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementNotPresent(browser, objRepo.submission.busyIndicatorText);

        helper.getResponseCount(browser, "Grace", function (currentgrace) {
            browser.verify.equal(currentgrace, grace + 1, "grace count after submission");
        });

        helper.getResponseCount(browser, "Open", function (currentopen) {
            browser.verify.equal(currentopen, open - 1, "open count after submission");
        });

        helper.getResponseCount(browser, "Live", function (currentlive) {
            browser.verify.equal(currentlive, live - 1, "live count after submission");
        });


    }

    submission.prototype.Test_SingleSubmit_For_Suspended_Marker = function (browser) {
        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.liveworklisttest.submit.suspended.username, loginData.login.liveworklisttest.submit.suspended.password);

        browser.pause(5000);

        helper.selectMenuDropdown(browser, function (callback) { });
        helper.selectQigElement(browser, liveData.responsesubmission.submit.grace.qigname, "name", function (callback) { });

        common.waitForElementPresent(browser, objRepo.submission.livecountcss);

        helper.submit(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submit.messageforsuspendedmarker);
        });
      
        //browser.close();
    }


    submission.prototype.Test_SingleSubmit_For_NotAprroved_Marker = function (browser) {
        loginData = utility.getDataParam(browser, data);
        loginForm.login(browser, loginData.login.submit.notapproved.username, loginData.login.submit.notapproved.password);

        qig.selectMenuDropdown(browser);
        qig.selectQigElement(browser, liveData.responsesubmission.submit.closed.qigname, "name");
        common.waitForElementPresent(browser, objRepo.submission.submitall);

        helper.submit(browser);
        common.waitForElementPresent(browser, objRepo.submission.popup);
        helper.clickConfirmationPopupYes(browser);
        common.waitForElementPresent(browser, objRepo.submission.errmessagepopup);

        helper.getElementText(browser, objRepo.submission.errmessagepopup, function (text) {
            browser.verify.equal(text, liveData.responsesubmission.submit.messagefornotapprovedmarker);
        });

        //browser.close();
    }

    return submission;
})();

module.exports = submission;
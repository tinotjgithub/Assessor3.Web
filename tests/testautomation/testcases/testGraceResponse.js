var utility = require("../utilityfunctions/utility.js");
var objRepo = require("../objectrepository/objectrepository.json");
var homePageLog = require("../features/HomePage.js");

var data = require("../testdata/login.json");
var homePageData = require("../testdata/homePage.json");
var tileViewFeature = require("../features/liveworklist.js");
var signIn = require("../features/login.js");

var gracePeriosList = (function () {



    function gracePeriosList() {
    }

    gracePeriosList.prototype.checkGraceResponseGridContent = function (browser) {

        objData = utility.getDataParam(browser, data);
        objDataHomepage = utility.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.graceUser, objDataHomepage.graceUserPass);
        browser.pause(4000);

        browser.pause(20000);

        //  Select a qig
        homePageLog.selectQig(browser, objDataHomepage.graceQuigName, "mark");
        browser.pause(3000);

        this.changeToTileView(browser);
        browser.useCss();
        browser.click(objRepo.tileview.graceResponseTab);
        browser.pause(4000);

        //Verify that the simple view is showing when the user login
        browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;

        tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.graceResponseId, "dtup", objDataHomepage.graceResponseDate);

        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");

        tileViewFeature.tileViewResponseVerify(browser, objDataHomepage.graceResponseId, "dtup", objDataHomepage.graceResponseDate);
        tileViewFeature.detailViewIndicationCheck(browser, objDataHomepage.graceResponseId, objRepo.tileview.graceMessageIcon);
        tileViewFeature.detailViewIndicationCheck(browser, objDataHomepage.graceResponseId, objRepo.tileview.graceNotificationI);

        //  Switch the grid to tile view
        tileViewFeature.switchView(browser, "tile");

        browser.pause(2000);

        //  browser.end();

    };

    /*
 * check the array is sorted
 * return: if positive ->  1
 *         if negative -> -1
 *         not sorted  ->  0
 */
    Array.prototype.isSorted = function () {
        return (function (direction) {
            return this.reduce(function (prev, next, i, arr) {
                if (direction === undefined)
                    return (direction = prev <= next ? 1 : -1) || true;
                else
                    return (direction + 1 ?
                      (arr[i - 1] <= next) :
                      (arr[i - 1] > next));
            }) ? Number(direction) : false;
        }).call(this);
    }

    var dtArray = [0];


    function getText(browser, i) {
        browser.getText("#res_" + i + "ResponseIdColumn_0", function (result) {

            var str = (result.value);
            var parts = (str.split(','));

            browser.useXpath();
            browser.getAttribute("//a[text()='" + str + "']", "id", function (result) {

                var fullId = (result.value);
                var index = fullId.indexOf("_");
                var id = fullId.substr(index + 1);
                id = id.slice(0, -1).replace(/[^\d.]/g, '');
                browser.useCss()
                browser.getText("#dtGrace_" + id + "GracePeriodTime_1", function (result) {
                    var numValue = (result.value);
                    onlyNumber = numValue.replace(/[^\d.]/g, '');

                    dtArray.push(Number(onlyNumber));


                });
            });


        });
    }




    gracePeriosList.prototype.GraceResponsecheckDefaultOrder = function (browser) {

        browser.elements('xpath', objRepo.tileview.graceTableView, function (result) {
            for (var i = 0; i < result.value.length; i++) {
                getText(browser, i);
            }
        });




        setTimeout(function () {

            var sortStatus = (dtArray.isSorted());
            browser.verify.equal(sortStatus, "1", "Checking the sort order.");

        }, 4000);

        browser.end();
    }






    gracePeriosList.prototype.GraceResponseConditionCheck = function (browser) {


        objData = utility.getDataParam(browser, data);
        objDataHomepage = utility.getDataParam(browser, homePageData);

        signIn.login(browser, objDataHomepage.graceUser, objDataHomepage.graceUserPass);
        browser.pause(2000);

        //  Select a qig
        homePageLog.selectQig(browser, objDataHomepage.graceQuigName, "mark");
        browser.pause(3000);

        browser.click(objRepo.tileview.graceResponseTab);
        browser.pause(2000);


        // Verify that the simple view is showing when the user login
        browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;



        this.checkTimeValue(browser, objDataHomepage.graceResponseId);

        //Switch the grid to detailed view
        tileViewFeature.switchView(browser, "");

        browser.end();


    },


        gracePeriosList.prototype.changeToTileView = function (browser) {

            browser.useXpath();
            browser.getAttribute(objRepo.tileview.tileSwitchButtonSwitch, "class", function (result) {

           //     console.log(result.value);
//console.log(objRepo.tileview.buttonValueSwitch);

                if (result.value == objRepo.tileview.buttonValueSwitchChange) {

                    //Switch the grid to tile view
                    browser.useCss();
                    browser.click(objRepo.tileview.viewSwitch);
                    browser.pause(3000);

                }

            });

        };


    // Show time to end of grace period for each response
    gracePeriosList.prototype.checkTimeValue = function (browser, data) {

        browser.useXpath();
        browser.getAttribute("//a[text()='" + data + "']", "id", function (result) {
            //   console.log(result.value);
            var fullId = (result.value);
            var index = fullId.indexOf("_");
            var id = fullId.substr(index + 1);
            var ss = (id.length);
            var ss1 = (ss - 1);
            id = id.slice(0, -ss1);
            browser.useCss()
            browser.getText("#dtGrace_" + id + "GracePeriodTime_1", function (result) {
                var numValue = (result.value);
                onlyNumber = numValue.replace(/[^\d.]/g, '');


             //   console.log(onlyNumber);

                //if ((onlyNumber == 1) || (onlyNumber > 1)) {
                //    browser.verify.equal(onlyNumber, onlyNumber, "The Value is equal or greater than 1");
                //} else {
                //    browser.verify.equal(onlyNumber + 1, onlyNumber + 2, "The Value is less than 1");
                //}
            });
        });
    };



    return gracePeriosList;
})();

module.exports = gracePeriosList;

var grid = require("../features/gridhelper.js");
var objRepo = require("../objectrepository/objectrepository.json");


module.exports = {

    verifyLiveTabIsVisible: function (browser) {
        browser.useXpath();
        browser.isVisible(objRepo.livemarking.menulivetab, function (result) {
            browser.verify.equal(result.value, true);
        });
        browser.useCss();
    },


    //count in Live menu
    verifyLiveCountInPage: function (browser, tabName, expCount) {
        if (tabName == "Live") {
            browser.useXpath();
            browser.getText(objRepo.livemarking.menulivetab, function (result) {
                browser.verify.equal(result.value, expCount);
            });
        } else {
            console.log("err");
        }

        //if (tabName == "Open") {
        //    browser.verify.equal(grid.getTextByElement(browser, objRepo.livemarking.opencount), expCount);
        //}
        browser.useCss();
    },

    //check if response id is displayed in grid
    verifyResponseIsDisplayedInGrid: function (browser, expRespId) {
        var str_array = expRespId.split(',');
        for (var i = 0; i < str_array.length; i++) {
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
            browser.useXpath();
            browser.isVisible('//a[text()=' + str_array[i] + ']', function (result) {
                browser.verify.equal(result.value, true);;
            });
        }
        browser.useCss();
    },

    //check if response id is not displayed in grid
    verifyResponseIsNotDisplayedInGrid: function (browser, expRespId) {
        browser.verify.equal(grid.getElementNotVisible(browser, '//a[text()=' + exprespId + ']'), true);
    },

    verifyResponseCountInGrid: function (browser, expCount) {
        browser.verify.equal(grid.getRowCount((browser, objRepo.livemarkinggrid), expCount));
    },

    verifyResponseCountMatches: function (browser) {
        browser.verify.equal(grid.getCountInMenu(browser, objRepo.livemarking.menulivetab),
        grid.getRowCount((browser, objRepo.livemarking.opengrid)));
    },


    //verify the marking status based on response id
    verifyResponseStatus: function (browser, respId, expStatus, stage) {
        if (stage == "Not completed") {
            browser.useXpath();
            browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::span[@class=\'inline-bubble oval pink\']', function (result) {
                browser.verify.equal(result.value, expStatus);
            });
            //browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::span[@class=\'inline-bubble oval\']/text()[last()]', function (result) {
            //    browser.verify.equal(result.value, expStatus);
            //});
            // var actStatus = grid.getTextByElement(browser, '//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::span[@class=\'inline-bubble oval\']/text()[last()]');
            // browser.verify.equal(actStatus, expStatus);
        } else if (stage == "Completed") {
            browser.useXpath();
            browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::div/button[text()]', function (result) {
                browser.verify.equal(result.value, expStatus);
            });
        } else if (stage == "Completed with error") {
            browser.useXpath()
            browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::span[@class=\'inline-bubble oval\']', function (result) {
                browser.verify.equal(result.value, expStatus);
            });
            //"//*[@id='responseTab1']/div/div[2]/ul/li[2]"
            browser.getCssProperty("//*[@id='responseTab1']/div/div[2]/ul/li[2]", "color", function (result) {
                var str = (result.value);
                //console.log("COLOR:"+str);
                var a = str.split("(")[1].split(")")[0];
                a = a.split(",");
                var b = a.map(function (x) {             //For each array element
                    x = parseInt(x).toString(16);      //Convert to a base16 string
                    return (x.length == 1) ? "0" + x : x;  //Add zero if we get only one character
                })

                b = "#" + b.join("");
                //console.log(b); //#ff9e0401
                browser.verify.equal(b, "#ff9e0401");

            });
        }

        browser.useCss();

    },

    //verify response date and time with Allocated text
    verifyResponseMarkingStatus: function (browser, respId, expStatus, expDate) {
        switch (true) {
            case (expStatus.indexOf('Allocated') >= 0):
                browser.useXpath();
                browser.getText('//a[text()=' + respId + ']//ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-allocated-date\']/descendant::span[@class=\'ex-dim-text txt-label\']', function (result) {
                    browser.verify.equal(result.value, "Allocated:");
                });
                browser.getText('//a[text()=' + respId + ']//ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-allocated-date\']/descendant::span[@class=\'ex-dim-text txt-label\']/following-sibling::span', function (result) {
                    browser.verify.equal(result.value, expDate);
                });
                break;
            case (expStatus.indexOf('Last Updated') >= 0):
                browser.useXpath();
                browser.getText('//a[text()=' + respId + ']/parent::div/following-sibling::p/span', function (result) {
                    browser.verify.equal(result.value, "Last Updated:");
                });
                browser.getText('//a[text()=' + respId + ']/parent::div/following-sibling::p/span[@class=\'dim-text txt-val\']', function (result) {
                    browser.verify.equal(result.value, expDate);
                });
                break;
            case (expStatus.indexOf('Marking not started') >= 0):
                browser.useXpath();
                browser.getText('//a[text()=' + respId + ']/parent::div/following-sibling::p/span[@class=\'dim-text txt-val\']', function (result) {
                    browser.verify.equal(result.value, "Marking not started");
                });
                break;
        }
        browser.useCss();

    },

    //verify mark/total mark CHECK
    verifyTotalMark: function (browser, respId, expMark, expTot, type) {
        switch (true) {
            case (type.indexOf('123') >= 0):
                browser.useXpath();
                browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-mark text-center\']/descendant::span[@class=\'padding-bottom-5\']', function (result) {
                    browser.verify.equal(result.value, expMark);
                });
                browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-mark text-center\']/descendant::div[@class=\'large-text dark-link mark-obt\']/following-sibling::div[@class=\'dim-text small-text total-mark\']', function (result) {
                    browser.verify.equal(result.value, expTot);
                });
                break;
            case (type.indexOf('ABC') >= 0):
                browser.useXpath();
                var actMark = grid.getTextByElement(browser, '//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-mark text-center\']/descendant::span[@class=\'padding-bottom-5\']/text()[last()]');
                browser.verify.equal(actMark, expMark);
                break;
            case (type.indexOf('--') >= 0):
                browser.useXpath();
                browser.getText('//a[text()=' + respId + ']/ancestor::div[@class=\'col wl-id\']/following-sibling::div[@class=\'col wl-mark text-center\']/descendant::span[@class=\'padding-bottom-5\']', function (result) {
                    browser.verify.equal(result.value, expMark);
                });
                break;
        }
        browser.useCss();
    },


    verifyElementsCount: function (browser, expCount) {
        browser.elements('css selector', '.row', function (result) {
            browser.verify.equal(result.value.length, expCount);
        });
    },



    /**verify hint message**/
    //Switch the view to tile or expand.
    // Parameter : tile (for tile view),For expand view leve it blank "")

    switchView: function (browser, view) {



        if (view == 'tile') {

            browser.click(objRepo.tileview.viewSwitch);
            browser.pause(3000);

            browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;

        } else {

            browser.click(objRepo.tileview.viewSwitch);
            browser.pause(3000);




            browser.expect.element(objRepo.tileview.tileViewDetail).to.be.visible;
        }
    },



    /**Verify the tile view response. **/
    tileViewResponseVerify: function (browser, responseIdData, checkWhat, checkValue) {



        browser.useXpath();
        browser.getAttribute("//a[text()='" + responseIdData + "']", "id", function (result) {
            //   console.log(result.value);
            var fullId = (result.value);
            var index = fullId.indexOf("_");
            var id = fullId.substr(index + 1);
            console.log(id);

            browser.useCss()
            browser

            browser.verify.containsText('#' + checkWhat + '_' + id, checkValue)

        });



    },



    //colour check
    tileViewColourCheck: function (browser, responseIdData, checkValue) {


        browser.useXpath();
        browser.getCssProperty(responseIdData, "color", function (result) {
            var str = (result.value);
            console.log("COLOR:" + str);
            var a = str.split("(")[1].split(")")[0];
            a = a.split(",");
            var b = a.map(function (x) {             //For each array element
                x = parseInt(x).toString(16);      //Convert to a base16 string
                return (x.length == 1) ? "0" + x : x;  //Add zero if we get only one character
            })

            b = "#" + b.join("");
            //  console.log(b); //#ff9e0401
            browser.verify.equal(b, checkValue);

        });
        browser.useCss();






    },

    selectGetNewResponse: function (browser) {

        browser.expect.element(objRepo.allocateResponse.getNewResponse_button).to.be.enabled;
        browser.click(objRepo.allocateResponse.getNewResponse_button)
    },


    verifyElement: function (browser, respId, elem) {
        browser.useXpath();
        browser.getAttribute("//a[text()='" + respId + "']", "id", function (result) {
            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");
            str = str.substring(0, lastIndex);
            browser.useCss();
            browser.verify.visible(live.slao.indicator);
        });

    },

    //verifies whether the SLAO indicator is displayed
    verifySLAOIndicator: function (browser, indicator) {
        browser.verify.visible(indicator);
    },

    //verifies the tooltip
    verifyTooltipForIndicator: function (browser, indicator, title) {
        browser.useXpath();
        //browser.expect.element(indicator).to.have.attribute('title').which.contains(title);
        browser.getAttribute(indicator, "title", function (result) {
            var tooltiptitle = result.value;
            browser.verify.equal(tooltiptitle, title);
        });
        browser.useCss();
    },

    //verifies that indicator is not visible
    verifyElementNotVisible: function (browser) {
        browser.element('xpath', '', function (visible) {
            browser.verify.equal(visible.status, 0);
        });
    },

    verifyElementIsVisible: function (browser, msgindicator) {
        browser.useXpath();
        browser.verify.visible(msgindicator);
        browser.useCss();
    },

    verifyMessageIndicatorCount: function (browser, msgcountindicator, msgcount) {
        browser.useXpath();
        browser.getText('xpath', msgcountindicator, function (result) {
            browser.verify.equal(result.value, msgcount);
        });
        browser.useCss();
    },

    verifyElementNotPresent: function (browser, msgcountindicator) {
        browser.useXpath();
        browser.waitForElementNotPresent(msgcountindicator, 1000);
        browser.useCss();
    },

    verifyMarkingProgressIndicator: function (browser, element, percentage) {
        //browser.getText('//div[@id=\'1_MarkingProgress_0_markingProgress\']/div/span', function (result) {
        //    console.log("RESULT:" + result.value);
        //    browser.verify.equal(result.value, percentage);
        //});
        browser.useXpath();
        if (browser.verify.visible(element)) {
            browser.getText(element, function (result) {
                browser.verify.equal(result.value, percentage);
            });
        }
        browser.useCss();
    },


    /**Verify Icons. **/
    detailViewIndicationCheck: function (browser, responseIdData, msgValue) {



        browser.useXpath();
        browser.getAttribute("//a[text()='" + responseIdData + "']", "id", function (result) {
            //   console.log(result.value);
            var fullId = (result.value);
            var index = fullId.indexOf("_");
            var id = fullId.substr(index + 1);
            console.log("Display Id : " + id);
            var dd = id.slice(0, -2)
            var onlyNumber = dd.replace(/[^\d.]/g, '');

            browser.verify.visible("//*[@id='" + onlyNumber + msgValue + "']");

            browser.useCss()

        });



    },




    worklistSwitchView: function (browser,view) {
    browser.useXpath();
    browser.waitForElementPresent(objRepo.tileview.tileSwitchButtonSwitch, 500000, false);
    browser.getAttribute(objRepo.tileview.tileSwitchButtonSwitch, "class", function (result) {
        browser.useCss();
        if (result.value == objRepo.tileview.buttonValueSwitch) {
                  
            if (view == 'grid') {
                    
                browser.click(objRepo.tileview.viewSwitch);
                browser.pause(3000);
                browser.expect.element(objRepo.tileview.tileViewDetail).to.be.visible;
            }
            else {
                //already in tile view
            }
        }
        else {

            if (view == 'tile') {

                browser.click(objRepo.tileview.viewSwitch);
                browser.pause(3000);
                browser.expect.element(objRepo.tileview.tileViewGrid).to.be.visible;

            }
            else {

                //already in grid view
            }
        }


    });
    browser.useCss();
    },

    toggleView: function (browser, view) {
        var toggle;
        browser.useXpath();
        browser.getAttribute("//a[@id='gridtogglebutton_liveworklist_worklistcontainer_undefined']/span", "class", function (result) {
            toggle = result.value;
            switch (view) {
                case "tile":
                    console.log("test:" + toggle);
                    if (toggle.indexOf(view) > -1) {
                        browser.click("//a[@id='gridtogglebutton_liveworklist_worklistcontainer_undefined']");
                        browser.pause(3000);
                    }
                    else {
                        break;
                    }
                    break;
                case "grid":
                    if (toggle.indexOf(view) > -1) {
                        browser.click("//a[@id='gridtogglebutton_liveworklist_worklistcontainer_undefined']");
                        browser.pause(3000);
                    }
                    else {
                        break;
                    }
                    break;
            }
        })


        browser.useCss();



    }


}
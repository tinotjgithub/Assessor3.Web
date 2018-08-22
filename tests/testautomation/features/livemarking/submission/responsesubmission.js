var settings = require("../../../objectrepository/objectrepository.json");
var liveData = require("../../../testdata/live.json").submission;

var responsesubmission = (function () {

    this.submitButtonCss = '.button.primary.rounded';
    this.popupWrapperCss = '.popup-wrap';
    this.popupTitleCss = '.popup-header h4#popup4Title';
    this.popupContentCss = 'div#popup14Desc.popup-content p';
    this.popupYesButtonCss = '.button.rounded.primary';
    this.popupNoButtonCss = '.button.close-button.rounded';
    this.liveCountCss = '.active a#worklistTypeworklist_live.left-submenu-item span.menu-count';
    this.markingCountCss = '.menu-count.graph-transition';
    this.submittedCountCss = 'div#targetSummaryCount_30_0.large-text';
    this.openCountCss = 'div#targetname_30_0.status-text';
    this.openResponseCountId = 'tabHeaderItem_0';
    this.graceResponseCountId = 'tabHeaderItem_1';
   // this.graceResponseCountId = '.resp-grace';
    this.closedResponseCountId = 'tabHeaderItem_2';
    this.responseCountCss = '.response-count.count';
    this.busyIndicatorClass = 'worklist-loader vertical-middle';
    this.busyIndicatorTextCss = '.loading-text.padding-top-30';

    function responsesubmission() {        
    }

    responsesubmission.prototype.submit = function (browser) {
        var submitelement = getSubmitButton(browser, function (submitelement) {
            browser.elementIdClick(submitelement);
        });   
    }


    responsesubmission.prototype.submitAll = function (browser) {
        var element = getSubmitAllButton(browser, function (submitallelement) {
            browser.elementIdClick(submitallelement);
        });      
    }

    responsesubmission.prototype.isSubmitConfirmationPopupDisplayed = function (browser, callback) {
        var submitpopup = getSubmitPopup(browser, function (submitpopup) {
            return callback(submitpopup);
        });     
    }

    responsesubmission.prototype.clickConfirmationPopupYes = function (browser) {
        var popupyes = getSubmitPopupYesButton(browser, function (yes) {
            browser.elementIdClick(yes);
        });
    }

    responsesubmission.prototype.clickConfirmationPopupNo = function (browser) {
        var popupno = getSubmitPopupNoButton(browser, function (no) {
            browser.elementIdClick(no);
        });
    }

    responsesubmission.prototype.isBusyIndicatorDisplayed = function (browser, callback) {
        var busy = getBusyIndicator(browser, function (busy) {
            return callback(busy);
        });
    }

    responsesubmission.prototype.getBusyIndicatorTextDisplayed = function (browser, callback) {
        var busytext = getBusyIndicatorText(browser, function (busytext) {
            return callback(busytext);
        });
    }

    responsesubmission.prototype.clickSubmitByRow = function (browser, dispId) {
        var submitelement = this.getSubmitByRow(browser, dispId, function (submitelement, status) {
            browser.elementIdClick(submitelement);         
        });
    }

    responsesubmission.prototype.getSubmitButtonCount = function (browser, callback) {
        browser.elements('css selector', submitButtonCss, function (result) {
            callback(result.value.length);
        });
    }

    responsesubmission.prototype.getCountByElement = function (browser, element, callback) {
        switch (element) {
            case 'Submit':             
                browser.elements('css selector', submitButtonCss, function (result) {
                    callback(result.value.length);
                });
                break;
            case 'Grid':
                browser.elements('class name', 'row', function (result) {
                    console.log("row:" + result.value.length);
                    callback(result.value.length);
                });
                break;
            default:
                console.log("Element name incorrect");
        }
    }


    responsesubmission.prototype.getSubmitPopupTitle = function (browser, callback) {
        browser.getText(popupTitleCss, function (result) {
            callback(result.value);
        });
    }

    responsesubmission.prototype.getSubmitPopupContent = function (browser, callback) {
        browser.getText(popupContentCss, function (result) {
            callback(result.value);
        });
    }

    responsesubmission.prototype.getSubmitByRow = function (browser, dispId, callback) {
        browser.useXpath();
        browser.element('xpath', '//a[text()=' + dispId + ']/ancestor::div[@class=\'col wl-id\']/preceding-sibling::div/descendant::div/button', function (result) {
            browser.useCss();
            callback(result.value.ELEMENT, result.status);
        });

    }

    

    //responsesubmission.prototype.getLiveResponseCount = function (browser, callback) {
    //    browser.getText('css selector', liveCountCss, function (result) {
    //        callback(result.value);
    //    });
    //}

    responsesubmission.prototype.getMarkingCount = function (browser, callback) {
        browser.getText('css selector', markingCountCss, function (result) {
            callback(result.value);
        });
    }

    //responsesubmission.prototype.getSubmittedResponseCount = function (browser, callback) {
    //    browser.getText('css selector', submittedCountCss, function (result) {
    //        var arrayOfStrings = result.value.split("/");
    //        callback(arrayOfStrings[0], arrayOfStrings[1]);
    //    });
    //}

    //responsesubmission.prototype.getOpenCount = function (browser, callback) {
    //    browser.getText('css selector', openCountCss, function (result) {
    //        var arrayOfStrings = result.value.split(' ');
    //        callback(arrayOfStrings[0]);
    //    });
    //}

    //responsesubmission.prototype.getOpenResponseCount = function (browser, callback) {
    //    browser.element('id', openResponseCountId, function (result) {
    //        var openScreen = result.value.ELEMENT;
    //        browser.elementIdElement(openScreen, 'css selector', responseCountCss, function (result) {
    //            var openScreenCount = result.value.ELEMENT;
    //            browser.elementIdText(openScreenCount, function (result) {
    //                callback(result.value);
    //            });
    //        });
    //    });

    //}


    //responsesubmission.prototype.getGraceResponseCount = function (browser, callback) {
    //    browser.element('id', graceResponseCountId, function (result) {
    //        var graceScreen = result.value.ELEMENT;
    //        browser.elementIdElement(graceScreen, 'css selector', responseCountCss, function (result) {
    //            var graceScreenCount = result.value.ELEMENT;
    //            browser.elementIdText(graceScreenCount, function (result) {
    //                callback(result.value);
    //            });
    //        });
    //    });
    //}

    //responsesubmission.prototype.getClosedResponseCount = function (browser, callback) {
    //    browser.element('id', closedResponseCountId, function (result) {
    //        var closedScreen = result.value.ELEMENT;
    //        browser.elementIdElement(closedScreen, 'css selector', responseCountCss, function (result) {
    //            var closedScreenCount = result.value.ELEMENT;
    //            browser.elementIdText(closedScreenCount, function (result) {
    //                callback(result.value);
    //            });
    //        });
    //    });
    //}

    responsesubmission.prototype.getSubmittedQigListCount = function (browser, callback) {
        browser.getText('css selector', 'span#component_1_qig_1_submittedTargetValue', function (result) {
            var arrayOfStrings = result.value.split('/');
            callback(arrayOfStrings[0]);
        });
    }

    responsesubmission.prototype.getResponseCount = function (browser, elementName, callback) {
        switch (elementName) {
            case 'Grace':             
                browser.element('id', graceResponseCountId, function (result) {
                    browser.elementIdElement(result.value.ELEMENT, 'css selector', responseCountCss, function (result) {
                        browser.elementIdText(result.value.ELEMENT, function (result) {
                            callback(result.value);
                        });
                    });
                });
                break;
            case 'Closed':             
                browser.element('id', closedResponseCountId, function (result) {
                    browser.elementIdElement(result.value.ELEMENT, 'css selector', responseCountCss, function (result) {
                        browser.elementIdText(result.value.ELEMENT, function (result) {
                            callback(result.value);
                        });
                    });
                });
                break;
            case 'Open':
                browser.element('id', openResponseCountId, function (result) {
                    browser.elementIdElement(result.value.ELEMENT, 'css selector', responseCountCss, function (result) {
                        browser.elementIdText(result.value.ELEMENT, function (result) {
                            callback(result.value);
                        });
                    });
                });
                break;
            case 'ProgressWheelOpen':
                browser.getText('css selector', openCountCss, function (result) {
                    var arrayOfStrings = result.value.split(' ');
                    callback(arrayOfStrings[0]);
                });
                break;
            case 'ProgressWheelSubmitted':
                browser.getText('css selector', submittedCountCss, function (result) {
                    var arrayOfStrings = result.value.split("/");
                    callback(arrayOfStrings[0], arrayOfStrings[1]);
                });
                break;
            case 'Live':
                browser.getText('css selector', liveCountCss, function (result) {
                    callback(result.value);
                });
                break;
            case 'QigListSubmitted':
                browser.getText('css selector', 'span#component_1_qig_1_submittedTargetValue', function (result) {
                    var arrayOfStrings = result.value.split('/');
                    callback(arrayOfStrings[0]);
                });
                break;

            default:
                console.log("Element name incorrect");
        }
        
    }

    responsesubmission.prototype.getBusyIndicator = function (browser, callback) {
        browser.element('class name', busyIndicatorClass, function (result) {
            callback(result.status);
        });
    }

    responsesubmission.prototype.getBusyIndicatorText = function (browser, callback) {
        browser.getText('css selector', busyIndicatorTextCss, function (result) {
            callback(result.value);
        });
    }

    responsesubmission.prototype.getElementText = function (browser, element, callback) {
        browser.getText('css selector', element, function (result) {
            callback(result.value);
        });
               
    }

    function getSubmitButton(browser, callback) {
        browser.element('css selector', this.submitButtonCss, function (result) {
            callback(result.value.ELEMENT);
        });

    }

    function getSubmitAllButton(browser, callback) {
        browser.element('css selector', 'button#submitResponseAll_liveworklist_worklistcontainer_undefined.primary.rounded', function (result) {
            callback(result.value.ELEMENT);
        });
    }

    function getSubmitPopup(browser, callback) {
        browser.element('css selector', popupWrapperCss, function (result) {
            callback(result.status);
        });         
    }   
 
    function getSubmitPopupYesButton(browser, callback) {
        browser.element('css selector', popupYesButtonCss, function (result) {
            callback(result.value.ELEMENT);
        });
    }

    function getSubmitPopupNoButton(browser, callback) {
        browser.element('css selector', popupNoButtonCss, function (result) {
            callback(result.value.ELEMENT);
        });
    }

    function getText(browser, i) {
        
        browser.getText('id', "res_" + i + "ResponseIdColumn_0", function (result) {
            
            var str = (result.value);
            console.log("str:"+str);
        });
       
    }

    responsesubmission.prototype.getResponseIdByText = function (browser, callback) {      
        browser.elements('class name', 'row', function (result) {
            browser.click('li#tabHeaderItem_1.resp-grace');
            browser.pause(3000);
            for (var i = 0; i < result.value.length; i++) {
                getText(browser, i);
            }
            
        });
    }

    responsesubmission.prototype.selectMenuDropdown = function (browser, callback) {
        browser.useCss();
        browser.waitForElementPresent("#qigSelectorDropdown", 10000);       
        browser.click("#qigSelectorDropdown");
        callback(this);
    },

    responsesubmission.prototype.selectQigElement = function (browser, qigName, button, callback) {
        browser.useXpath();
        //browser.pause(5000);
        browser.waitForElementPresent("//span[text()='" + qigName + "']", 10000, false);
        browser.getAttribute("//span[text()='" + qigName + "']", "id", function (result) {
            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");

            str = str.substring(0, lastIndex);

            //   console.log(str);

            browser.useCss()
            //browser.pause(5000);
            browser.click("#" + str + "_" + button)
            callback(this);

        });
        
    }
      
    responsesubmission.prototype.getResponseIdBySubmit = function (browser, callback) {
        var count = 0;
        resarray = new Array();
        browser.elements('class name', 'row', function (res1) {
            res1.value.forEach(function (e1) {
                browser.elementIdElements(e1.ELEMENT, 'tag name', 'div', function (res2) {
                    res2.value.forEach(function (e2) {
                        browser.elementIdAttribute(e2.ELEMENT, 'class', function (res3) {                    
                                if (res3.value == 'col wl-status text-center') {
                                    browser.elementIdElement(e2.ELEMENT, 'tag name', 'button', function (res4) {
                                            browser.elementIdAttribute(res4.value.ELEMENT, 'id', function (res5) {                                            
                                                var text = res5.value;
                                                var text1 = JSON.stringify(text);
                                                if (text1.includes("Marking")) {
                                                    var arrayOfStrings = text1.split('_');
                                                    var progressid = arrayOfStrings[0].replace(/['"]+/g, '');
                                                    console.log(progressid);
                                                    resarray.push("res_" + progressid + "_ResponseIdColumn_1");
                                                    //console.log(resarray.toString());
                                                    
                                                }
                                            })
                                    })
                                }                       
                        })
                    })
                })
            })
        })
        callback(resarray);
        
    }

    

    return responsesubmission;
})();
module.exports = responsesubmission;
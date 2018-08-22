var objRepo = require("../objectrepository/objectrepository.json");
module.exports = {

    //    //*************************************************************************************************************************************
    //    //                                        RememberQig functionality starts here
    //    //*************************************************************************************************************************************

    verifyselectedqigIndropdown: function (browser,qigname) {
       // browser.useXpath();
       // browser.pause(2000);
       //// browser.waitForElementPresent("//*[@class='dropdown-wrap close header-dropdown']/input[@value='Selected QIG']", 20000);
       // browser.getAttribute("//*[@class='dropdown-wrap close header-dropdown']/input[@value='Selected QIG']", "value", function (result) {
       //     browser.verify.equal(result.value, qigname);
       //     console.log(result.value);
        //     browser.useCss();

        browser.useCss();
         browser.pause(5000);
         browser.waitForElementPresent("#qigSelectorDropdown", 20000);
         browser.getAttribute("#qigSelectorDropdown", "value", function (result) {
             browser.verify.equal(result.value, qigname);
             console.log(result.value);
             
        })
      
    },  

    verifyQigWorklist: function (browser, qigstatus) {
       
        browser.useXpath();
    
        browser.getText("", function (result) {
            browser.verify.equal(result.value, qigstatus);     
            browser.useCss();
           
        })      

    },

    selectMenuDropdown: function (browser) {
        browser.useCss();
        browser.pause(8000)
        browser.waitForElementPresent("#qigSelectorDropdown", 2000);
        browser.click("#qigSelectorDropdown");
        
    },

   

        selectQig_worklistDropdown: function (browser, qigname) {

            browser.getAttribute("//span[text()='" + qigname + "']", "id", function (result) {

                  console.log(result.value);

                var str = (result.value);
                var lastIndex = str.lastIndexOf("_");

                str = str.substring(0, lastIndex);

                //   console.log(str);

                browser.useCss()
                //browser.pause(5000);
                browser.click("#" + str + "_button")

            });
        },


    selectQigElement: function (browser, qigName, button) {
        browser.useXpath();
        //browser.pause(5000);
        browser.waitForElementPresent("//span[text()='" + qigName + "']", 10000, false);
        browser.getAttribute("//span[text()='" + qigName + "']", "id", function (result) {

            //  console.log(result.value);

            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");

            str = str.substring(0, lastIndex);

            //   console.log(str);

            browser.useCss()
            //browser.pause(5000);
            browser.click("#" + str + "_" + button)

        });
        
    },

    verifyQigstatus: function (browser, qigName,object, status) {
        browser.useXpath();
        browser.getAttribute("//span[text()='" + qigName + "']", "id", function (result) {

           
            console.log("first"+result.value)
            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");

            str = str.substring(0, lastIndex);

            //   console.log(str);
            browser.useCss();
          
            browser.getText("#" + str + "_" + object, function (result) {
                console.log("second" + result.value)
                browser.verify.equal(result.value, status);
                
               

        })

        });

    },






    verifyQigattribute: function (browser, qigName,object,attribute,status) {
        browser.useXpath();
        browser.pause(5000);
       
        browser.getAttribute("//span[text()='" + qigName + "']", "id", function (result) {
           
            var str = (result.value);
            var lastIndex = str.lastIndexOf("_");

            str = str.substring(0, lastIndex);

            browser.useCss();
           
            browser.getAttribute("#" + str + "_" + object,attribute, function (result) {
                browser.verify.equal(result.value, status);
              
        })      

        });

    },    

    //    verifyqigavailability: function (browser, qigname,status) {
    //        browser.waitForElementNotPresent("//h5[text()= "+qigname+" ]", 1000, false, function (result) {
    //                    browser.verify.equal(result.state, status);
    //                    browser.useCss();

    //                });

    //    },

   

    //     //*************************************************************************************************************************************
    //    //                                        RememberQig functionality ends here
    //    //*************************************************************************************************************************************



    
    //     //*************************************************************************************************************************************
    //    //                                        Refactor qigList functionality starts here
    //    //*************************************************************************************************************************************



    //    //*********************************************************************************************************************

    //    //verifyProgressbarWidth: function (browser,status) {
    //    //     browser.waitForElementPresent(, 1000, false, function (result) {
    //    //        browser.verify.equal(result.state, status);

    //    //        browser.useCss();

    //    //    });

    //    //},

    //    //*********************************************************************************************************************

    verifyQigSelectionanywhereInPanel: function (browser, QigName, button, QigStatus) {
          
        this.selectQigElement(browser, QigName, button)
        // verifyQigWorklist(browser, QigStatus)
        
    },
        /**Click on the qig button. **/
  
    verifyTextColor: function (browser, QigName, object, QigStatus) {

        this.verifyQigattribute(browser, QigName, object,"class", QigStatus)
    },

        verifyElementNotPresent: function (browser, qigname, object, status) {
            browser.useXpath();
            browser.getAttribute("//span[text()='" + qigname + "']", "id", function (result) {

                var str = (result.value);
                var lastIndex = str.lastIndexOf("_");

                str = str.substring(0, lastIndex);

                browser.useCss();
                browser.waitForElementNotPresent("#" + str + "_" + object, 1000, false, function (result) {
                    browser.verify.equal(result.state, status);
                    browser.useCss();


                });
            });

        },

        verifyElementPresent: function (browser, qigname, object, status) {
            browser.useXpath();
            browser.getAttribute("//span[text()='" + qigname + "']", "id", function (result) {

                var str = (result.value);
                var lastIndex = str.lastIndexOf("_");

                str = str.substring(0, lastIndex);

                browser.useCss();
                browser.waitForElementPresent("#" + str + "_" + object, 1000, false, function (result) {
                    browser.verify.equal(result.state, status);
                    browser.useCss();


                });
            });

        },


        verifyProgressbar: function (browser, qigname, closed, pending, open) {
      
            this.verifyQigattribute(browser, qigname, objRepo.refactorQig.progressIndicator_closedProgress, "style", closed)
            this.verifyQigattribute(browser, qigname, objRepo.refactorQig.progressIndicator_pendingProgress, "style", pending)
            this.verifyQigattribute(browser, qigname, objRepo.refactorQig.progressIndicator_openProgress, "style", open)

        }

    }
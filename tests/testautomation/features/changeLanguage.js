var pageobj = require("../objectrepository/objectrepository.json");
var objOR = pageobj.changeLanguage;
var languagetext = require("../testdata/languagetext.json");
var util = require('util');


module.exports = {

    openDropDownBox: function (browser, objData) {
        browser.useCss();
        browser.click(objOR.selectlanguagebox);      
        browser.useXpath();
        browser.isVisible(objOR.opendropdown, function (result) {
            this.verify.equal(result.value, true);
        });
    },

    selectLanguage: function (browser, objData) {               
        browser.useXpath();
        switch (objData) {
            case 'English':             
                browser
                .click(objOR.english)
                browser.pause(2000);
                break;
            case 'Deutsch':
                browser
                .click(objOR.deutsch);             
                break;
            case 'Spanish':
                browser
                .click(objOR.spanish);
                browser.pause(2000);             
                break;
            case 'French':
                browser
                .click(objOR.french);            
                break;
            case 'Arabic':
                browser
                .click(objOR.arabic);            
                break;
            default:
                console.log("Language did not match");
        }       
    },

    verifyLanguages: function (browser, objData) {
        browser.useCss()
        browser.getText('.menu', function (result) {
            var result = result.value;
            var resval = result.replace(/\s/g, ",");
            var lang = objData.languages;
            var rsult;
            if (resval === lang)
                rsult = true
            else
                rsult = false           
            browser.verify.equal(rsult, true);
        });
    },
      
    verifyText: function (browser, locator, content) {
        browser.useCss();
        browser.getText(locator, function (result) {                 
            //var header = "Agrega a FavoritosContacto\nEspañol";     
            console.log("txt : " + result.value)
            this.verify.equal(content, result.value);
        });
    },

    verifyChangedLanguage: function (browser, objData) {
        
        switch (objData) {
            case 'English':
                browser.useXpath();
                browser.verify.elementPresent(languagetext.en.usernamelabel);
                browser.verify.elementPresent(languagetext.en.passwordlabel);
                browser.verify.elementPresent(languagetext.en.markingbutton);                
                this.verifyText(browser, objOR.header, languagetext.en.header);
                this.verifyText(browser, objOR.footer, languagetext.en.footer);
                this.verifyText(browser, objOR.loginlinks, languagetext.en.loginlinks);
                break;
            case 'Deutsch':              
                break;
            case 'Spanish':
                browser.useXpath();
                browser.verify.elementPresent(languagetext.es.usernamelabel);
                browser.verify.elementPresent(languagetext.es.passwordlabel);
                browser.verify.elementPresent(languagetext.es.markingbutton);
                //this.verifyText(browser, objOR.usernamelabel, languagetext.es.usernamelabel);
                console.log("exp : "+languagetext.es.header)
               

                
                this.verifyText(browser, objOR.header, languagetext.es.header);
                this.verifyText(browser, objOR.footer, languagetext.es.footer);
                this.verifyText(browser, objOR.loginlinks, languagetext.es.loginlinks);                                    
                break;
            default:
                console.log("err");
        }
    },

    getCookie: function (browser, objData) {
        browser.getCookies(function callback(result) {         
            console.log(result.value[0].value);
            console.log(result.value[0].name);
            switch (objData) {
                case 'English':                                              
                    browser.verify.equal(result.value[0].name, languagetext.cookiename);
                    browser.verify.equal(result.value[0].value, languagetext.cookievalueenglish);
                    break;
                case 'Deutsch':                   
                    break;
                case 'Spanish':
                    browser.verify.equal(result.value[0].name, languagetext.cookiename);
                    browser.verify.equal(result.value[0].value, languagetext.cookievaluespanish);
                    break;
                default:
                    console.log("Language did not match");
            }
        });
    },

    deleteCookies: function (browser) {
        browser.deleteCookies(function () {         
        });      
       
    },

    changeLanguageFromUserOption: function (browser, languageToChangeTo) {

        browser.click(".sprite-icon.user-icon").pause(1000);
        browser.click(".edit-settings-nav-holder").pause(1000);
        browser.useXpath();
        browser.click("//*[@id='settingsTab1']/div[1]/div/a/span[2]").pause(1000);

        switch (languageToChangeTo) {
            case 'English':
                browser.click("//*[@id='settingsTab1']/div[1]/div/ul/li[1]/a").pause(1000);
                break;
            case 'French':
                browser.click("//*[@id='settingsTab1']/div[1]/div/ul/li[4]/a").pause(1000);
                break;
            case 'Spanish':
                browser.click("//*[@id='settingsTab1']/div[1]/div/ul/li[3]/a").pause(1000);
                break;
            default:
                console.log("Language did not match");
        }

        browser.useCss();
        browser.click(".sprite-icon.user-icon");
    }

}
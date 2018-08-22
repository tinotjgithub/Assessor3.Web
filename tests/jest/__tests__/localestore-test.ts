jest.dontMock("../../../src/stores/locale/localestore");

import dispatcher = require("../../../src/app/dispatcher");
import localeStore = require("../../../src/stores/locale/localestore");
import localeAction = require("../../../src/actions/locale/localeaction");

/**
 * Teest suite for locale store.
 */
describe("Test suite for locale store", function () {
    var localeChangeAction;
    var localeEN = "rm-en";
    var localeFR = "rm-fr";
    var localeJsonEN = {
        "login": {
            "login-header": "Login for RM"
        }
    };
    var localeJsonFR = {
        "login": {
            "login-header": "Ceci est en français"
        }
    };

    beforeEach(function () {
        localeChangeAction = localeChangeAction = new localeAction(true, localeEN, localeJsonEN);
    });

    /**
    * test for registering the locale with the corresponding json
    */
    it("should set the locale and register corresponding JSON", function () {
        dispatcher.dispatch(localeChangeAction);
        var selectedLocale = localeStore.instance.Locale;
        var selectedLocaleJson = localeStore.instance.LocaleJson;
        //selected loclae should be rm-en.
        expect(selectedLocale).toEqual(localeEN);
        //there should be a json registered to the selected locale.
        expect(selectedLocaleJson).not.toBeUndefined()
    });

    /**
    * test for the translate function in locale store.
    */
    it("should translate the element with the value in current locale JSON for en", function () {
        dispatcher.dispatch(localeChangeAction);

        var translatedText = localeStore.instance.TranslateText("login.login-header");
        expect(translatedText).toEqual("Login for RM");
    });

    /**
    * test for the translate function in locale store.
    */
    it("should translate the element with the value in current locale JSON for fr", function () {
        localeChangeAction = localeChangeAction = new localeAction(true, localeFR, localeJsonFR);
        dispatcher.dispatch(localeChangeAction);

        var translatedText = localeStore.instance.TranslateText("login.login-header");
        expect(translatedText).toEqual("Ceci est en français");
    });
});
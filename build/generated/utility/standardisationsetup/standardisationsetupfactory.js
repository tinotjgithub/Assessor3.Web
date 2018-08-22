"use strict";
var classifiedHelper = require('../../components/utility/grid/standardisationsetuphelpers/classifiedhelper');
var unclassifiedHelper = require('../../components/utility/grid/standardisationsetuphelpers/unclassifiedhelper');
var provisionalHelper = require('../../components/utility/grid/standardisationsetuphelpers/provisionalhelper');
var selectResponseHelper = require('../../components/utility/grid/standardisationsetuphelpers/selectresponsehelper');
var enums = require('../../components/utility/enums');
var StandardisationSetupFactory = (function () {
    function StandardisationSetupFactory() {
    }
    /**
     * returns the standard helper object based on the type
     * @param teamManagementTab
     */
    StandardisationSetupFactory.prototype.getStandardisationSetUpWorklistHelper = function (standardisationSetUpWorkList) {
        var standardisationSetUpHelper;
        switch (standardisationSetUpWorkList) {
            case enums.StandardisationSetup.SelectResponse:
                standardisationSetUpHelper = new selectResponseHelper();
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                standardisationSetUpHelper = new provisionalHelper();
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                standardisationSetUpHelper = new unclassifiedHelper();
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                standardisationSetUpHelper = new classifiedHelper();
                break;
        }
        return standardisationSetUpHelper;
    };
    return StandardisationSetupFactory;
}());
var standardisationSetupFactory = new StandardisationSetupFactory();
module.exports = standardisationSetupFactory;
//# sourceMappingURL=standardisationsetupfactory.js.map
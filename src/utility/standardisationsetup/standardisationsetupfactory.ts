import classifiedHelper = require('../../components/utility/grid/standardisationsetuphelpers/classifiedhelper');
import unclassifiedHelper = require('../../components/utility/grid/standardisationsetuphelpers/unclassifiedhelper');
import provisionalHelper = require('../../components/utility/grid/standardisationsetuphelpers/provisionalhelper');
import selectResponseHelper = require('../../components/utility/grid/standardisationsetuphelpers/selectresponsehelper');

import enums = require('../../components/utility/enums');

class StandardisationSetupFactory {

    /**
     * returns the standard helper object based on the type
     * @param teamManagementTab
     */
    public getStandardisationSetUpWorklistHelper(standardisationSetUpWorkList: enums.StandardisationSetup) {

        let standardisationSetUpHelper;

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
    }
}

let standardisationSetupFactory = new StandardisationSetupFactory();
export = standardisationSetupFactory;
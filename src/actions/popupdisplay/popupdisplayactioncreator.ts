import dispatcher = require('../../app/dispatcher');
import popUpDisplayAction = require('./popupdisplayaction');
import promise = require('es6-promise');
import enums = require('../../components/utility/enums');

class PopUpDisplayActionCreator {

    /**
     * Action Creator to display the popup
     * @param popUpType
     * @param popUpActionType
     * @param popUpData
     */
    public popUpDisplay(popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none, popUpData: PopUpData,
        actionFromCombinedPopup: boolean = false,
        navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new popUpDisplayAction(popUpType, popUpActionType, navigateFrom,
                popUpData, actionFromCombinedPopup, navigateTo));
        }).catch();
    }
}

let popUpDisplayActionCreator = new PopUpDisplayActionCreator();
export = popUpDisplayActionCreator;
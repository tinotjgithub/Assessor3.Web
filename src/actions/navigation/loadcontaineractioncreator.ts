import dispatcher = require('../../app/dispatcher');
import promise = require('es6-promise');
import enums = require('../../components/utility/enums');
import LoadContainerAction = require('./loadcontaineraction');
import addToRecentHistoryAction = require('./addtorecenthistoryaction');
import worklistHistoryInfo = require('../../utility/breadcrumb/worklisthistoryinfo');
import historyItem = require('../../utility/breadcrumb/historyitem');

class LoadContainerActionCreator {

    /**
     * Loading the container
     * @param containerPage
     * @param isFromMenu
     * @param containerPageType
     * @param isFromSwitchUser
     */
    public loadContainer(containerPage: enums.PageContainers, isFromMenu: boolean = false,
        containerPageType: enums.PageContainersType = enums.PageContainersType.None, isFromSwitchUser: boolean = false) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new LoadContainerAction(containerPage, isFromMenu, containerPageType, isFromSwitchUser));
        }).catch();
    }

    /**
     * Adding recent history
     * @param _historyItem
     */
    public addToRecentHistory(_historyItem: historyItem) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addToRecentHistoryAction(_historyItem));
        }).catch();
    }

}

let loadContainerActionCreator = new LoadContainerActionCreator();
export = loadContainerActionCreator;
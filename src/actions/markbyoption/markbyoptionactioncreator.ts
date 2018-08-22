import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import markByOptionClickedAction = require('./markbyoptionclickedaction');

/**
 * Class for creating Mark By Option Action Creator
 */
class MarkByOptionActionCreator {

    /**
     * mark by option panel is opened or closed
     */
    public markByOptionClicked(isMarkByOptionOpen: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markByOptionClickedAction(isMarkByOptionOpen));
        });
    }
}

let markByOptionActionCreator = new MarkByOptionActionCreator();
export = markByOptionActionCreator;


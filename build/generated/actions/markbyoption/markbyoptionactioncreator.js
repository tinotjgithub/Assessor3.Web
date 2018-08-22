"use strict";
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var markByOptionClickedAction = require('./markbyoptionclickedaction');
/**
 * Class for creating Mark By Option Action Creator
 */
var MarkByOptionActionCreator = (function () {
    function MarkByOptionActionCreator() {
    }
    /**
     * mark by option panel is opened or closed
     */
    MarkByOptionActionCreator.prototype.markByOptionClicked = function (isMarkByOptionOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markByOptionClickedAction(isMarkByOptionOpen));
        });
    };
    return MarkByOptionActionCreator;
}());
var markByOptionActionCreator = new MarkByOptionActionCreator();
module.exports = markByOptionActionCreator;
//# sourceMappingURL=markbyoptionactioncreator.js.map
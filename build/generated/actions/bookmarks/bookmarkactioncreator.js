"use strict";
var dispatcher = require('../../app/dispatcher');
var addNewBookmarkAction = require('./addnewbookmarkaction');
var bookmarkAddedAction = require('./bookmarkAddedAction');
var bookmarkSelectedAction = require('./bookmarkselectedaction');
var goBackButtonClickAction = require('./bookmarkgobackbuttonclickaction');
var updateBookmarkNameAction = require('./updateBookmarkNameAction');
var promise = require('es6-promise');
var BookmarkActionCreator = (function () {
    function BookmarkActionCreator() {
    }
    /**
     * Add new Bookmark selected from toolbar
     */
    BookmarkActionCreator.prototype.addNewBookmark = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new addNewBookmarkAction(true));
        }).catch();
    };
    /**
     * A bookmark is placed on the script
     */
    BookmarkActionCreator.prototype.bookmarkAdded = function (bookmark) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new bookmarkAddedAction(bookmark));
        }).catch();
    };
    /**
     * On Book Mark selection
     */
    BookmarkActionCreator.prototype.bookmarkItemSelection = function (clientToken) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new bookmarkSelectedAction(clientToken));
        }).catch();
    };
    /**
     * On Go Back Button Click
     */
    BookmarkActionCreator.prototype.goBackButtonClick = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new goBackButtonClickAction());
        }).catch();
    };
    /**
     * Update bookmark name
     */
    BookmarkActionCreator.prototype.updateBookmarkName = function (bookmarkName, clientToken) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateBookmarkNameAction(bookmarkName, clientToken));
        }).catch();
    };
    return BookmarkActionCreator;
}());
var bookmarkActionCreator = new BookmarkActionCreator();
module.exports = bookmarkActionCreator;
//# sourceMappingURL=bookmarkactioncreator.js.map
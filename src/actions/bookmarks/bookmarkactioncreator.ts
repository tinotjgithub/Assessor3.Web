import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import addNewBookmarkAction = require('./addnewbookmarkaction');
import bookmarkAddedAction = require('./bookmarkAddedAction');
import bookmarkSelectedAction = require('./bookmarkselectedaction');
import goBackButtonClickAction = require('./bookmarkgobackbuttonclickaction');
import bookmark = require('../../stores/response/typings/bookmark');
import updateBookmarkNameAction = require('./updateBookmarkNameAction');
import promise = require('es6-promise');

class BookmarkActionCreator {

    /**
     * Add new Bookmark selected from toolbar
     */
    public addNewBookmark(): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new addNewBookmarkAction(true));
        }).catch();
    }

    /**
     * A bookmark is placed on the script
     */
    public bookmarkAdded(bookmark): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new bookmarkAddedAction(bookmark));
        }).catch();
    }

    /**
     * On Book Mark selection
     */
    public bookmarkItemSelection(clientToken: string): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new bookmarkSelectedAction(clientToken));
        }).catch();
    }

    /**
     * On Go Back Button Click
     */
    public goBackButtonClick(): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new goBackButtonClickAction());
        }).catch();
    }

    /**
     * Update bookmark name
     */
    public updateBookmarkName(bookmarkName: string, clientToken: string): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateBookmarkNameAction(bookmarkName, clientToken));
        }).catch();
    }
}
let bookmarkActionCreator = new BookmarkActionCreator();
/* exporting an instance of BookmarkActionCreator */
export = bookmarkActionCreator;
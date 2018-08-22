import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import enums = require('../../components/utility/enums');
import base = require('../base/actioncreatorbase');
import enhancedOffPageCommentsVisibilityAction = require('./enhancedoffpagecommentsvisibilityaction');
import ehnachedOffPageCommentSortAction = require('./enhancedoffpagecommentsortaction');
import saveEnhancedOffPageCommentAction = require('./saveenhancedoffpagecommentaction');
import enhancedOffPageCommentUpdatedAction = require('./enhancedoffpagecommentupdatedaction');
import switchEnhancedOffPageCommentsAction = require('./switchenhancedoffpagecommentsaction');
import enhancedOffPageCommentButtonAction = require('./enhancedoffpagecommentbuttonaction');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');

class EnhancedOffPageCommentActionCreator extends base {
    /**
     * The action for changing the visibility of enhanced off-page comments.
     * @param isVisible
     * @param markSchemeToNavigate
     */
    public updateEnhancedOffPageCommentsVisibility(isVisible: boolean, markSchemeToNavigate?: treeViewItem) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new enhancedOffPageCommentsVisibilityAction(isVisible, markSchemeToNavigate));
        }).catch();
    }

    /**
     * This method will update the current sort details.
     * @param sortDetails 
     */
    public onSortClick(sortDetails: EnhancedOffPageCommentSortDetails) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new ehnachedOffPageCommentSortAction(sortDetails));
        }).catch();
    }

    /**
     * Save the enhanced off page comments
     * @param enhancedOffPageCommentDetails to save
     */
    public saveEnhancedOffpageComments(enhancedOffPageClientToken: Array<string>, markingOperation: enums.MarkingOperation,
                                                   commentText?: string, selectedMarkSchemeId?: number, selectedFileId?: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new saveEnhancedOffPageCommentAction(enhancedOffPageClientToken, markingOperation,
                    commentText, selectedMarkSchemeId, selectedFileId));
        }).catch();
    }

    /**
     * Update the Enhanced off Page comment details
     * @param isEdited
     */
    public updateEnhancedOffPageComment(isEdited: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new enhancedOffPageCommentUpdatedAction(isEdited));
        }).catch();
    }

    /**
     * Update the Enhanced off Page comment details
     * @param showDiscardMessage : show discard popup
     */
    public switchEnhancedOffPageComments(showDiscardMessage: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new switchEnhancedOffPageCommentsAction(showDiscardMessage));
        }).catch();
    }

    /**
     * enhanced offpage comment action
     * @param {enums.EnhancedOffPageCommentAction} enhancedOffPageCommentButtonAction 
     * @memberof EnhancedOffPageCommentActionCreator
     */
    public onEnhancedOffPageCommentButtonAction(buttonAction: enums.EnhancedOffPageCommentAction) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new enhancedOffPageCommentButtonAction(buttonAction));
        }).catch();
    }
}

let enhancedOffPageCommentActionCreator = new EnhancedOffPageCommentActionCreator();
export = enhancedOffPageCommentActionCreator;
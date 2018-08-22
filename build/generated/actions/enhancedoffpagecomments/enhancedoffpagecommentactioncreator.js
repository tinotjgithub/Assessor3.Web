"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var enhancedOffPageCommentsVisibilityAction = require('./enhancedoffpagecommentsvisibilityaction');
var ehnachedOffPageCommentSortAction = require('./enhancedoffpagecommentsortaction');
var saveEnhancedOffPageCommentAction = require('./saveenhancedoffpagecommentaction');
var enhancedOffPageCommentUpdatedAction = require('./enhancedoffpagecommentupdatedaction');
var switchEnhancedOffPageCommentsAction = require('./switchenhancedoffpagecommentsaction');
var enhancedOffPageCommentButtonAction = require('./enhancedoffpagecommentbuttonaction');
var EnhancedOffPageCommentActionCreator = (function (_super) {
    __extends(EnhancedOffPageCommentActionCreator, _super);
    function EnhancedOffPageCommentActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * The action for changing the visibility of enhanced off-page comments.
     * @param isVisible
     * @param markSchemeToNavigate
     */
    EnhancedOffPageCommentActionCreator.prototype.updateEnhancedOffPageCommentsVisibility = function (isVisible, markSchemeToNavigate) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new enhancedOffPageCommentsVisibilityAction(isVisible, markSchemeToNavigate));
        }).catch();
    };
    /**
     * This method will update the current sort details.
     * @param sortDetails
     */
    EnhancedOffPageCommentActionCreator.prototype.onSortClick = function (sortDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new ehnachedOffPageCommentSortAction(sortDetails));
        }).catch();
    };
    /**
     * Save the enhanced off page comments
     * @param enhancedOffPageCommentDetails to save
     */
    EnhancedOffPageCommentActionCreator.prototype.saveEnhancedOffpageComments = function (enhancedOffPageClientToken, markingOperation, commentText, selectedMarkSchemeId, selectedFileId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new saveEnhancedOffPageCommentAction(enhancedOffPageClientToken, markingOperation, commentText, selectedMarkSchemeId, selectedFileId));
        }).catch();
    };
    /**
     * Update the Enhanced off Page comment details
     * @param isEdited
     */
    EnhancedOffPageCommentActionCreator.prototype.updateEnhancedOffPageComment = function (isEdited) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new enhancedOffPageCommentUpdatedAction(isEdited));
        }).catch();
    };
    /**
     * Update the Enhanced off Page comment details
     * @param showDiscardMessage : show discard popup
     */
    EnhancedOffPageCommentActionCreator.prototype.switchEnhancedOffPageComments = function (showDiscardMessage) {
        if (showDiscardMessage === void 0) { showDiscardMessage = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new switchEnhancedOffPageCommentsAction(showDiscardMessage));
        }).catch();
    };
    /**
     * enhanced offpage comment action
     * @param {enums.EnhancedOffPageCommentAction} enhancedOffPageCommentButtonAction
     * @memberof EnhancedOffPageCommentActionCreator
     */
    EnhancedOffPageCommentActionCreator.prototype.onEnhancedOffPageCommentButtonAction = function (buttonAction) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new enhancedOffPageCommentButtonAction(buttonAction));
        }).catch();
    };
    return EnhancedOffPageCommentActionCreator;
}(base));
var enhancedOffPageCommentActionCreator = new EnhancedOffPageCommentActionCreator();
module.exports = enhancedOffPageCommentActionCreator;
//# sourceMappingURL=enhancedoffpagecommentactioncreator.js.map
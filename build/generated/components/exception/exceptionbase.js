"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var popupHelper = require('../utility/popup/popuphelper');
var exceptionStore = require('../../stores/exception/exceptionstore');
var exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var ExceptionBase = (function (_super) {
    __extends(ExceptionBase, _super);
    /**
     * Constructor ExceptionBase
     * @param props
     * @param state
     */
    function ExceptionBase(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.navigateTo = enums.SaveAndNavigate.none;
        this._questionName = '';
        this._questionId = undefined;
        this._markSchemeGroup = undefined;
        /**
         * Method fired when the exception panel is minimized.
         */
        this.onMinimize = function () {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Minimize);
        };
        /**
         * Method fired when the exception panel is maximized.
         */
        this.onMaximize = function () {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
            if (_this.props.isNewException && _this.refs.commentTextBox !== undefined) {
                _this.refs.commentTextBox.focus();
            }
            exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
        };
        /**
         * Reset message panel and close
         */
        this.resetAndCloseExceptionPanel = function () {
            _this.props.closeExceptionPanel();
        };
        /**
         * Method fired when discard message is confirmed.
         */
        this.onDiscardExceptionConfirmed = function () {
            // Close the Message Panel.
            _this.resetAndCloseExceptionPanel();
            // on message close navigate away from response scenario
            if (_this.navigateTo !== enums.SaveAndNavigate.none && _this.navigateTo !== enums.SaveAndNavigate.exceptionWithInResponse) {
                // if navigate away from Resposne then close the response and move to worklist.
                popupHelper.navigateAway(_this.navigateTo);
                _this.navigateTo = enums.SaveAndNavigate.none;
            }
            if (exceptionStore.instance.navigateFrom === enums.SaveAndNavigate.submit) {
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
            }
        };
        /**
         * Method fired when discard exception is cancelled.
         */
        this.onDiscardExceptionCancelled = function () {
            if (_this.props.isExceptionPanelEdited) {
                _this.props.validateException(null, false);
            }
            // reset navigate away from response
            _this.navigateTo = enums.SaveAndNavigate.none;
        };
    }
    return ExceptionBase;
}(pureRenderComponent));
module.exports = ExceptionBase;
//# sourceMappingURL=exceptionbase.js.map
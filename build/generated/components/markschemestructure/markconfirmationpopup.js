"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var markingStore = require('../../stores/marking/markingstore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var localeStore = require('../../stores/locale/localestore');
var constants = require('../utility/constants');
var enums = require('../utility/enums');
var navigationHelper = require('../utility/navigation/navigationhelper');
/**
 * MarkConfirmationPopup button.
 * @param {Props} props
 * @returns
 */
var MarkConfirmationPopup = (function (_super) {
    __extends(MarkConfirmationPopup, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function MarkConfirmationPopup(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Method to perform navigation after on screen confirmation.
         */
        this.navigateAfterConfirmation = function (event) {
            if (event && (event.type === 'animationend') && (event.animationName === 'showAtTop')
                && event.target.id === 'markfeedback') {
                _this.navigationInProgress = false;
                // removing animation from markconfirmationpopup class
                _this.markConfirmationPopupClass = 'mark-feedback';
                // Checking whether we need to show mbq confirmation popup.
                navigationHelper.checkForMbqConfirmationPopup(enums.ResponseNavigation.markScheme);
                markingActionCreator.markSchemeScrollReset();
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        /**
         * Show mark confirmation popup with animation
         */
        this.showPopup = function () {
            if (markingStore.instance.currentQuestionItemInfo) {
                _this.mark = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark;
                _this.markConfirmationPopupClass = 'mark-feedback animate ' + 'digit-' + _this.mark.length;
                if (_this.mark.trim() === constants.NOT_ATTEMPTED) {
                    _this.mark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
                }
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * This method will show the on screen mark confirmation popup.
         */
        this.markChanged = function () {
            if (markingStore.instance.currentQuestionItemInfo) {
                _this.mark = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark;
                if ((_this.mark && (_this.mark.trim() === constants.NOT_MARKED ||
                    _this.mark.trim() === constants.NO_MARK)) ||
                    !markingStore.instance.isEdited) {
                    // Checking whether we need to show mbq confirmation popup.
                    navigationHelper.checkForMbqConfirmationPopup(enums.ResponseNavigation.markScheme);
                }
                else {
                    if (_this.navigationInProgress) {
                        return;
                    }
                    _this.navigationInProgress = true;
                    _this.markConfirmationPopupHide();
                    // remove the animate class and then add it again to show the confirmation.
                    var that = _this;
                    setTimeout(that.showPopup, 15);
                }
            }
        };
        /**
         * This method will trigger navigation after popup hide.
         */
        this.markConfirmationPopupHide = function () {
            _this.markConfirmationPopupClass = 'mark-feedback';
            _this.mark = ''; // This is for fixing issues in IE - Defect 19111
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.markConfirmationPopupClass = 'mark-feedback';
        this.navigationInProgress = false;
        this.navigateAfterConfirmation = this.navigateAfterConfirmation.bind(this);
        if (markingStore.instance.currentQuestionItemInfo) {
            this.mark = (markingStore.instance.currentQuestionItemInfo.allocatedMarks) ?
                (markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark) : '';
            if (this.mark.trim() === constants.NOT_ATTEMPTED) {
                this.mark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
        }
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * The render method
     */
    MarkConfirmationPopup.prototype.render = function () {
        return (React.createElement("div", {id: 'markfeedback', className: this.markConfirmationPopupClass}, React.createElement("div", {className: 'feedback-bubble'}, React.createElement("div", {className: 'mark-txt'}, this.mark), React.createElement("div", {className: 'scaler'}))));
    };
    /**
     * This function gets invoked when the component is about to be mounted
     */
    MarkConfirmationPopup.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SAVED, this.markChanged);
        var markConfirmationPopupElement = document.getElementById('markfeedback');
        if (markConfirmationPopupElement) {
            markConfirmationPopupElement.addEventListener('animationend', this.navigateAfterConfirmation);
        }
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkConfirmationPopup.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SAVED, this.markChanged);
        var markConfirmationPopupElement = document.getElementById('markfeedback');
        if (markConfirmationPopupElement) {
            markConfirmationPopupElement.removeEventListener('animationend', this.navigateAfterConfirmation);
        }
    };
    return MarkConfirmationPopup;
}(pureRenderComponent));
module.exports = MarkConfirmationPopup;
//# sourceMappingURL=markconfirmationpopup.js.map
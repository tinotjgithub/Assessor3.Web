/*
React component for Set As Review Button
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var localeStore = require('../../stores/locale/localestore');
var enums = require('../utility/enums');
var genericRadioButtonItems = require('../utility/genericradiobuttonitems');
var GenericPopupWithRadioButton = require('../utility/genericpopupwithradiobuttons');
var GenericButton = require('../utility/genericbutton');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var domManager = require('../../utility/generic/domhelper');
var responseStore = require('../../stores/response/responsestore');
var ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
var worklistStore = require('../../stores/worklist/workliststore');
var classNames = require('classnames');
var SetAsReviewedButton = (function (_super) {
    __extends(SetAsReviewedButton, _super);
    /**
     * @constructor
     */
    function SetAsReviewedButton(props) {
        var _this = this;
        _super.call(this, props, null);
        this._onClick = null;
        this.selectedReviewComment = enums.SetAsReviewedComment.None;
        /**
         * To get the button name along with comment selected for the set as reviewed button
         */
        this.getSetAsReviewedButtonContentWithSelectedComment = function () {
            var childElement = new Array();
            var content = _this.state.doDisable ?
                localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.reviewed-button') :
                localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.set-as-reviewed-button');
            childElement.push(React.createElement("span", {id: 'supervisor- review - button - text', className: 'padding-left-5 padding-right-10'}, " ", content));
            // The comment id text has to be added only when there is a selected text
            if (_this.selectedReviewComment !== enums.SetAsReviewedComment.None) {
                childElement.push(React.createElement("span", {id: 'supervisor-review-comment-text', className: 'supervisor-selcted small-text'}, localeStore.instance.
                    TranslateText('team-management.response.review-comments.' + _this.selectedReviewComment)));
            }
            return childElement;
        };
        /**
         * On Set as reviewed button is clicked
         */
        this.onButtonClick = function () {
            if (ccValues.supervisorReviewComments) {
                _this.setState({
                    doHide: !_this.state.doHide
                });
            }
            else {
                _this.props.onReviewButtonClick(enums.SetAsReviewedComment.None);
            }
        };
        /**
         * Handle click events on the window
         * @param {any} source - The source element
         */
        this.handleOnClick = function (source) {
            if (source.target !== undefined &&
                domManager.searchParentNode(source.target, function (el) {
                    return el.id === 'setasreviewed-wrapper' || el.id === 'setAsReviewedButtonID';
                }) == null) {
                if (_this.state.doHide !== undefined && _this.state.doHide === false) {
                    _this.setState({ doHide: true });
                }
            }
        };
        /**
         * On clicking items in radio button popup
         * @param item
         */
        this.onCheckedChange = function (item) {
            if (item.id !== _this.selectedReviewComment && !_this.state.doHide) {
                // updating the checked property
                _this.items.map(function (i) {
                    i.isChecked = i.id === item.id ? true : false;
                    if (i.isChecked === true) {
                        _this.props.onReviewButtonClick(i.id);
                        i.isChecked = false;
                    }
                });
                // disabling the button. After selecting a comment the button will get disabled
                _this.setState({
                    renderedOn: Date.now(),
                    doHide: true
                });
            }
        };
        /**
         * When response is changed reset the variables
         */
        this.onResponseChanged = function () {
            _this.selectedReviewComment = _this.props.setAsReviewedComment;
            _this.setState({
                renderedOn: Date.now(),
                doHide: true,
                doDisable: _this.props.isDisabled
            });
        };
        /**
         * When response is reviewed
         */
        this.onResponseReviewed = function (reviewResponseDetails) {
            _this.selectedReviewComment = reviewResponseDetails.setAsReviewedCommentId;
            // disabling the button. After selecting a comment the button will get disabled
            _this.setState({
                renderedOn: Date.now(),
                doDisable: true
            });
        };
        this.selectedReviewComment = this.props.setAsReviewedComment;
        this.state = {
            renderedOn: 0,
            doHide: true,
            doDisable: this.props.isDisabled
        };
        this._onClick = this.handleOnClick.bind(this);
    }
    /**
     * Render method
     */
    SetAsReviewedButton.prototype.render = function () {
        var _this = this;
        var buttonTooltip = this.props.isDisabled ?
            localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.reviewed-button-tooltip') :
            localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.set-as-reviewed-button-tooltip');
        return (React.createElement("div", {className: classNames('setreview-btn-holder dropdown-wrap up white supervisor-remark-comment', { 'open': !this.state.doHide })}, React.createElement(GenericButton, {id: this.props.id + 'ID', disabled: this.state.doDisable, key: this.props.id + 'Key', title: buttonTooltip, className: classNames('button rounded primary set-reviewed', { 'disabled': this.state.doDisable }), onClick: function () { _this.onButtonClick(); }, childrens: this.getSetAsReviewedButtonContentWithSelectedComment(), buttonType: enums.ButtonType.SetAsReviewed}), React.createElement("div", {className: 'menu', id: 'setasreviewed-wrapper'}, React.createElement("div", {className: 'review-options'}, React.createElement(GenericPopupWithRadioButton, {className: 'supervisor-select-options', id: 'popup-setasreviewed', items: this.items, selectedLanguage: this.props.selectedLanguage, onCheckedChange: this.onCheckedChange, renderedOn: this.state.renderedOn, key: 'key-popup-supervisor-sampling'})))));
    };
    /**
     * Component did mount
     */
    SetAsReviewedButton.prototype.componentDidMount = function () {
        this.populateData();
        window.addEventListener('click', this._onClick);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.onResponseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
        worklistStore.instance.addListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.onResponseReviewed);
    };
    /**
     * Component will unmount
     */
    SetAsReviewedButton.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._onClick);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.onResponseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.onResponseReviewed);
    };
    /**
     * adding items to radio buttons
     */
    SetAsReviewedButton.prototype.populateData = function () {
        this.items = new Array();
        var obj;
        for (var item in enums.SetAsReviewedComment) {
            if (parseInt(item) > 0) {
                var commentItem = parseInt(item);
                obj = new genericRadioButtonItems();
                obj.isChecked = false;
                obj.name = localeStore.instance.TranslateText('team-management.response.review-comments.' + commentItem);
                obj.id = commentItem;
                switch (commentItem) {
                    case enums.SetAsReviewedComment.AllCorrect:
                        obj.sequenceNo = 1;
                        break;
                    case enums.SetAsReviewedComment.Good:
                        obj.sequenceNo = 2;
                        break;
                    case enums.SetAsReviewedComment.AcceptableNoFeedback:
                        obj.sequenceNo = 3;
                        break;
                    case enums.SetAsReviewedComment.AcceptableGiveFeedback:
                        obj.sequenceNo = 4;
                        break;
                    case enums.SetAsReviewedComment.CausingConcernGiveFeedback:
                        obj.sequenceNo = 5;
                        break;
                    case enums.SetAsReviewedComment.UnAcceptableConsultPE:
                        obj.sequenceNo = 6;
                        break;
                }
                this.items.push(obj);
            }
        }
        var _sampleReviewCommentComparer = 'SampleReviewCommentComparer';
        sortHelper.sort(this.items, comparerList[_sampleReviewCommentComparer]);
    };
    return SetAsReviewedButton;
}(pureRenderComponent));
module.exports = SetAsReviewedButton;
//# sourceMappingURL=setasreviewedbutton.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var domManager = require('../../utility/generic/domhelper');
var localeStore = require('../../stores/locale/localestore');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var qigStore = require('../../stores/qigselector/qigstore');
var markByOptionActionCreator = require('../../actions/markbyoption/markbyoptionactioncreator');
var loggingHelper = require('../utility/marking/markingauditlogginghelper');
var loggerConstants = require('../utility/loggerhelperconstants');
var classNames = require('classnames');
var MarkByOption = (function (_super) {
    __extends(MarkByOption, _super);
    /**
     * Constructor for Allocated response button
     * @param props
     */
    function MarkByOption(props) {
        var _this = this;
        _super.call(this, props, null);
        /**
         * Method to handle onclick event of menu button
         */
        this.onClickMarkByMenuButton = function () {
            _this.setState({
                isOpen: !_this.state.isOpen,
                isClickedArrowButton: true
            });
        };
        /**
         * Method which handles the click event of window
         */
        this.handleOnClick = function (source) {
            /** check if the clicked element is a child of the user details list item. if not close the open window */
            if (source.target !== undefined &&
                domManager.searchParentNode(source.target, function (el) {
                    return el.id === 'markby_menu_button';
                }) == null) {
                if (_this.state.isOpen !== undefined && _this.state.isOpen === true) {
                    /** Close the dropdown list */
                    _this.setState({
                        isOpen: false
                    });
                }
            }
            if (source.type !== 'touchend') {
                markByOptionActionCreator.markByOptionClicked(_this.state.isOpen);
            }
        };
        this.state = {
            isOpen: false,
            isMBQ: userOptionsHelper.getUserOptionByName(userOptionKeys.IS_MBQ_SELECTED, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId)
                === 'true' ? true : false,
            isClickedArrowButton: false
        };
        this.onClickMarkByMenuButton = this.onClickMarkByMenuButton.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    MarkByOption.prototype.render = function () {
        return (React.createElement("div", {className: 'mark-by-holder'}, React.createElement("label", {id: 'mark-by-label', className: 'mark-by-label'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by')), React.createElement("div", {id: 'mark-by-menu', className: classNames('dropdown-wrap mark-by-menu', {
            'open': this.state.isOpen && this.state.isClickedArrowButton,
            'close': !this.state.isOpen && this.state.isClickedArrowButton,
            '': this.state.isClickedArrowButton
        })}, React.createElement("a", {id: 'markby_menu_button', className: 'menu-button', onClick: this.onClickMarkByMenuButton}, React.createElement("span", {className: 'markby-txt'}, this.state.isMBQ ?
            localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-question')
            : localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-candidate')), React.createElement("span", {className: 'sprite-icon menu-arrow-icon'})), React.createElement("ul", {className: 'menu'}, React.createElement("li", null, React.createElement("input", {type: 'radio', id: 'markByCandidate', name: 'markBy', defaultChecked: !this.state.isMBQ}), React.createElement("label", {htmlFor: 'markByCandidate', onClick: this.onMarkByQuestionClicked.bind(this, false)}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-candidate')))), React.createElement("li", null, React.createElement("input", {type: 'radio', id: 'markByQuestion', name: 'markBy', defaultChecked: this.state.isMBQ}), React.createElement("label", {htmlFor: 'markByQuestion', onClick: this.onMarkByQuestionClicked.bind(this, true)}, React.createElement("span", {className: 'radio-ui'}), React.createElement("span", {className: 'label-text'}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.mark-by-question'))))))));
    };
    /**
     * When component mounts
     */
    MarkByOption.prototype.componentDidMount = function () {
        window.addEventListener('touchend', this.handleOnClick);
        window.addEventListener('click', this.handleOnClick);
    };
    /**
     * When component unmounts
     */
    MarkByOption.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this.handleOnClick);
        window.removeEventListener('touchend', this.handleOnClick);
    };
    /**
     * Method to handle changing of mark by option
     */
    MarkByOption.prototype.onMarkByQuestionClicked = function (isMBQChecked) {
        userOptionsHelper.save(userOptionKeys.IS_MBQ_SELECTED, isMBQChecked.toString(), true, true);
        this.setState({
            isMBQ: isMBQChecked,
            isOpen: false
        });
        // Log the marking mode changed log.
        new loggingHelper().logMBQChangeAction(loggerConstants.MARKENTRY_REASON_MARKING_MODE_CHANGED, loggerConstants.MARKENTRY_TYPE_MARKING_MODE_CHANGED, isMBQChecked);
    };
    return MarkByOption;
}(pureRenderComponent));
module.exports = MarkByOption;
//# sourceMappingURL=markbyoption.js.map
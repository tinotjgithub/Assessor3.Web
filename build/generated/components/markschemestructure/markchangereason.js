"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
var domManager = require('../../utility/generic/domhelper');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var keyDownHelper = require('../../utility/generic/keydownhelper');
var markingStore = require('../../stores/marking/markingstore');
var deviceHelper = require('../../utility/touch/devicehelper');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var ReactDom = require('react-dom');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var enums = require('../utility/enums');
var markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
/**
 * Mark Change Reason component.
 * @param {Props} props
 * @returns
 */
var MarkChangeReason = (function (_super) {
    __extends(MarkChangeReason, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function MarkChangeReason(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._onClick = null;
        /**
         * Render markchangereason text area
         */
        this.renderMarkChangeReasonTextArea = function () {
            return (_this.props.isResponseEditable ?
                React.createElement("textarea", {name: 'markChangeReasonTextarea', id: 'markChangeReasonTextarea', className: 'eur-edit-input', ref: 'markChangeReasonTextarea', value: _this._markChangeReason ? _this._markChangeReason : '', onChange: _this.handleChange, onClick: _this.onClickOfMarkChangeReason, readOnly: !_this.props.isResponseEditable}) :
                React.createElement("div", {id: 'markChangeReasonTextarea', className: 'eur-edit-input input-box'}, _this._markChangeReason ? _this._markChangeReason : ''));
        };
        /**
         * Change visibility of mark change reason
         */
        this.showHideMarkChangeReason = function () {
            if (markingStore.instance.isMarkChangeReasonVisible(markingStore.instance.currentMarkGroupId)) {
                _this.setState({ isVisible: true });
            }
            else if (_this.state.isVisible) {
                markingActionCreator.markChangeReasonUpdated('');
                _this.setState({ isVisible: false });
            }
        };
        /**
         * handling click of MarkChangeReason text area
         */
        this.onClickOfMarkChangeReason = function (event) {
            event.stopPropagation();
        };
        /**
         * Open mark change reason
         */
        this.openMarkChangeReason = function () {
            keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarksChangeReason);
            _this.setState({ isOpen: true });
        };
        /**
         * Click event of MarkChangeReason icon
         */
        this.onMarkChangeReasonClick = function (event) {
            if (!markerOperationModeFactory.operationMode.isTeamManagementMode || _this._markChangeReason) {
                if (_this.state.isOpen) {
                    _this.saveMarkChangeReason();
                    keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
                }
                else {
                    keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.MarksChangeReason);
                }
                _this.setState({
                    isOpen: !_this.state.isOpen,
                    markChangeReasonRenderedOn: Date.now()
                });
            }
        };
        /**
         * Handle click events on the window
         * @param {any} source - The source element
         */
        this.handleOnClick = function (source) {
            if (source.target !== undefined &&
                domManager.searchParentNode(source.target, function (el) { return el.id === 'markChangeReason'; }) == null) {
                if (_this.state.isOpen !== undefined && _this.state.isOpen === true) {
                    _this.saveMarkChangeReason();
                    _this.setState({ isOpen: false });
                    keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
                }
            }
        };
        /**
         * On mouse scroll hide context menu
         * @param event
         */
        this.onScrollHandler = function (event) {
            if (_this.state.isOpen) {
                event.stopPropagation();
            }
        };
        /**
         * On Response opened
         * When response is changed close the mark change reason text box
         */
        this.onResponseOpened = function () {
            _this.setState({ isOpen: false });
        };
        this.state = {
            isOpen: undefined,
            markChangeReasonRenderedOn: Date.now(),
            isVisible: false
        };
        this._markChangeReason = this.props.markChangeReason;
        this.onMarkChangeReasonClick = this.onMarkChangeReasonClick.bind(this);
        this._onClick = this.handleOnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openMarkChangeReason = this.openMarkChangeReason.bind(this);
        this.onClickOfMarkChangeReason = this.onClickOfMarkChangeReason.bind(this);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.showHideMarkChangeReason = this.showHideMarkChangeReason.bind(this);
    }
    /**
     * Render component
     * @returns
     */
    MarkChangeReason.prototype.render = function () {
        var _className = 'sprite-icon ';
        if (this._markChangeReason && this._markChangeReason.trim().length > 0) {
            _className = _className + 'edit-box-icon';
        }
        else if (markerOperationModeFactory.operationMode.
            hasMarkChangeReasonYellowIcon(this.props.isResponseEditable, this.props.isInResponse)) {
            _className = _className + 'edit-box-yellow-icon';
        }
        var isTeamManagement = markerOperationModeFactory.operationMode.isTeamManagementMode;
        var popoutHeader = isTeamManagement ?
            (this._markChangeReason ?
                localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header') :
                localeStore.instance.TranslateText('team-management.examiner-worklist.response-data.mark-change-reason-not-specified-icon-tooltip')) :
            localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header');
        var menuCallOutText = isTeamManagement ?
            localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.header') :
            localeStore.instance.TranslateText('marking.response.eur-marks-change-popout.body');
        if (this.props.isInResponse) {
            if (this.state.isVisible) {
                return (React.createElement("div", {className: classNames('eur-reason-holder icon-menu-wrap dropdown-wrap up white', { 'open': this.state.isOpen }), id: 'markChangeReason'}, React.createElement("a", {href: 'javascript:void(0)', className: classNames('eur-reason-link menu-button'), onClick: this.onMarkChangeReasonClick}, React.createElement("span", {className: _className, title: popoutHeader})), React.createElement("div", {className: 'menu-callout'}), React.createElement("div", {className: 'menu'}, React.createElement("div", {className: 'eur-reason-label dim-text'}, menuCallOutText), React.createElement("div", {className: 'eur-reason-edit'}, this.renderMarkChangeReasonTextArea()))));
            }
            else {
                return null;
            }
        }
        else {
            return (React.createElement("span", {className: _className, title: markerOperationModeFactory.operationMode.markChangeReasonTitle}));
        }
    };
    /**
     * This function gets called when the component is mounted
     */
    MarkChangeReason.prototype.componentDidMount = function () {
        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
        window.addEventListener('click', this._onClick);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_MARK_CHANGE_REASON, this.openMarkChangeReason);
        document.documentElement.addEventListener('touchstart', this.onScrollHandler, true);
        document.documentElement.addEventListener('touchmove', this.onScrollHandler, true);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkChangeReason.prototype.componentWillUnmount = function () {
        if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }
        window.removeEventListener('click', this._onClick);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_MARK_CHANGE_REASON, this.openMarkChangeReason);
        if (this.props.isInResponse) {
            keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.MarksChangeReason);
        }
        document.documentElement.removeEventListener('touchstart', this.onScrollHandler, true);
        document.documentElement.removeEventListener('touchmove', this.onScrollHandler, true);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.onResponseOpened);
    };
    /**
     * This function gets called when the component is remounted
     */
    MarkChangeReason.prototype.componentDidUpdate = function () {
        if (this.refs && this.refs.markChangeReasonTextarea) {
            this.refs.markChangeReasonTextarea.focus();
        }
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    MarkChangeReason.prototype.componentWillReceiveProps = function (nextProps) {
        this._markChangeReason = nextProps.markChangeReason;
    };
    /**
     * This method will hook the touch events
     */
    MarkChangeReason.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = 'pan-x,pan-y';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });
            this.eventHandler.on(eventTypes.PAN, this.handleOnClick);
        }
    };
    /**
     * unsubscribing hammer touch events and handlers
     */
    MarkChangeReason.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * Saving mark change reason
     */
    MarkChangeReason.prototype.saveMarkChangeReason = function () {
        if (this.props.isResponseEditable) {
            var markChangeReason = this.refs.markChangeReasonTextarea.value;
            if (!markChangeReason.replace(/\s/g, '').length) {
                markChangeReason = '';
            }
            markingActionCreator.markChangeReasonUpdated(markChangeReason);
        }
    };
    /**
     * Setting markchange reason text
     */
    MarkChangeReason.prototype.handleChange = function (e) {
        if (markerOperationModeFactory.operationMode.isTeamManagementMode || this.props.isResponseEditable) {
            if (e.target.value.length <= 500) {
                this._markChangeReason = e.target.value;
                this.saveMarkChangeReason();
                this.setState({
                    markChangeReasonRenderedOn: Date.now()
                });
            }
        }
    };
    return MarkChangeReason;
}(eventManagerBase));
module.exports = MarkChangeReason;
//# sourceMappingURL=markchangereason.js.map
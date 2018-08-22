"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var Reactdom = require('react-dom');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var markingStore = require('../../stores/marking/markingstore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var MarkButton = require('./markbutton');
var MaxButton = require('./maxbutton');
var localeStore = require('../../stores/locale/localestore');
var deviceHelper = require('../../utility/touch/devicehelper');
var eventManagerBase = require('../base/eventmanager/eventmanagerbase');
var eventTypes = require('../base/eventmanager/eventtypes');
var direction = require('../base/eventmanager/direction');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var timerHelper = require('../../utility/generic/timerhelper');
var responseStore = require('../../stores/response/responsestore');
var NOT_ATTEMPTED = 'NR';
var classNames = require('classnames');
var MAX_MARK_WITH_UP_BUTTONS_HEIGHT = 81;
var MARK_BUTTON_HEIGHT = 58;
var SWIPE_MOVE_FACTOR = 2;
var MOVE_FACTOR_PIXEL = 10;
/**
 * Marking buttons.
 * @param {Props} props
 * @returns
 */
var MarkButtonsContainer = (function (_super) {
    __extends(MarkButtonsContainer, _super);
    /**
     * Constructor MarkButtonsContainer
     * @param props
     * @param state
     */
    function MarkButtonsContainer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /* Whether the down navigation button viusisble or not */
        this.isDownButtonVisible = false;
        /* Whether the up navigation button viusisble or not */
        this.isUpButtonVisible = false;
        /* Array of mark button elements */
        this.marks = [];
        /*The number of mark buttons to show in available marks */
        this.visibleMarksCount = 0;
        /* The ending index */
        this.bottomIndex = -1;
        /* The starting index */
        this.topIndex = 0;
        /* Whether the window is getting resized or not */
        this.isResizing = false;
        /*Checks whether the extendView class needs to be applied or not */
        this.extendEndView = false;
        this.markButtonMask = null;
        this.markButtonContainer = null;
        /*checks user action is swipe or pan*/
        this.isSwipe = false;
        /* Checks whether the noNr class needs to be applied or not */
        this.showNR = false;
        this.isNavigationInProgress = false;
        /**
         * When the window gets resized
         */
        this.onWindowResize = function () {
            _this.isResizing = true;
            /* resetting the index values on window resize*/
            _this.resetIndex();
            _this.setNumberOfMarkButtonsToShow();
            timerHelper.handleReactUpdatesOnWindowResize(function () {
                _this.setState({
                    renderedOn: Date.now()
                });
            });
        };
        /**
         * changing the selected mark button on mark updation without navigation(last markable item)
         */
        this.markChangedWithoutNavigation = function () {
            // Rerender the mark buttons on next question
            _this.resetIndex();
            _this.setState({ reRenderedOn: Date.now() });
        };
        /**
         * To unregister events when response is changed.
         */
        this.onResponseNavigation = function () {
            _this.unRegisterEvents();
        };
        /**
         * Click event for Max button
         * @param e - MouseEvent of click function
         */
        this.onMaxButtonClick = function (e) {
            e.preventDefault();
            /* To determine the number of indexes to subtract for setting the bottom index */
            var index = _this.totalAvailableMarksCount - _this.topIndex - 1;
            _this.topIndex = _this.totalAvailableMarksCount - 1;
            _this.bottomIndex = _this.bottomIndex + index;
            _this.setState({ reRenderedOn: Date.now() });
        };
        /**
         * move up on clicking up arrow
         */
        this.moveUp = function () {
            if (_this.topIndex < (_this.totalAvailableMarksCount - 1) && !_this.extendEndView) {
                _this.topIndex++;
                _this.bottomIndex++;
                _this.setState({ reRenderedOn: Date.now() });
            }
        };
        /**
         * move up on clicking down arrow
         */
        this.moveDown = function () {
            if (_this.bottomIndex > 0 && !_this.extendEndView) {
                _this.bottomIndex--;
                _this.topIndex--;
            }
            _this.setState({ reRenderedOn: Date.now() });
        };
        /**
         * move up block wise on clicking up arrow
         */
        this.blockMoveUp = function () {
            if (_this.isNavigationInProgress === false && (_this.topIndex < (_this.totalAvailableMarksCount - 1))) {
                var buttonsAbove = _this.totalAvailableMarksCount - 1 - _this.topIndex;
                var index = buttonsAbove > _this.visibleMarksCount ? _this.visibleMarksCount : buttonsAbove;
                _this.topIndex = _this.topIndex + index;
                _this.bottomIndex = _this.bottomIndex + index;
                _this.setState({ reRenderedOn: Date.now() });
            }
            else {
                _this.setState({ reRenderedOn: Date.now() });
            }
        };
        /**
         * move down block wise on clicking down arrow
         */
        this.blockMoveDown = function () {
            if (_this.isNavigationInProgress === false && _this.bottomIndex > 0) {
                var index = _this.bottomIndex > _this.visibleMarksCount ? _this.visibleMarksCount : _this.bottomIndex;
                _this.topIndex = _this.topIndex - index;
                _this.bottomIndex = _this.bottomIndex - index;
                _this.setState({ reRenderedOn: Date.now() });
            }
            else {
                _this.setState({ reRenderedOn: Date.now() });
            }
        };
        /**
         * Click event for NR button click
         */
        this.onNRButtonClick = function (e) {
            e.preventDefault();
            var allocatedMark;
            allocatedMark = {
                displayMark: 'NR',
                valueMark: 'NR'
            };
            markingActionCreator.markUpdated(allocatedMark);
        };
        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onTouchMove = null;
        this.onPanMove = this.onPanMove.bind(this);
        this.onSwipe = this.onSwipe.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.markSchemeHelper = new markSchemeHelper();
    }
    /**
     * Render component
     * @returns
     */
    MarkButtonsContainer.prototype.render = function () {
        var _this = this;
        /* if there is a selected mark available */
        if (markingStore.instance.currentQuestionItemInfo) {
            this.marks = this.getMarksToShowAndHighlightSelected();
            this.isNavigationInProgress = false;
            /* Enable max button if the totalAvailableMarksCount is greater than the availableMarks to display */
            var isMaxVisible = (this.totalAvailableMarksCount) > this.visibleMarksCount;
            /* check if NR is selected for the particular question  */
            var nrSelected = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark === NOT_ATTEMPTED;
            var upArrowClass = '';
            /* Hiding up arrow button if there is no marks to scroll  */
            if (!this.isUpButtonVisible && !isMaxVisible) {
                upArrowClass = ' hide';
            }
            else if ((this.totalAvailableMarksCount - 1) === this.topIndex) {
                upArrowClass = ' disabled';
            }
            /* If allowNR is defined for the question then set showNR to true */
            this.showNR = this.markSchemeHelper.isAllowNRDefinedForTheMarkScheme;
            var mbcClass = classNames('mark-button-container', { 'extend-end-view': (this.extendEndView === true) }, { 'no-nr': (this.showNR === false) });
            return (React.createElement("div", {className: mbcClass, ref: 'markbuttoncontainer', onClick: this.onClickHandler}, React.createElement(MaxButton, {id: 'maxbutton', key: 'maxbutton', isVisible: isMaxVisible, mark: markingStore.instance.currentQuestionItemInfo.availableMarks.last(), onClick: function (e) { return _this.onMaxButtonClick(e); }}), React.createElement("a", {href: 'javascript:void(0)', className: classNames('mark-button-nav up') + upArrowClass, title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.next-mark-button-tooltip'), onClick: this.blockMoveUp, onWheel: this.onMouseWheel}, React.createElement("span", {className: 'sprite-icon top-arrow-blue'}, "Mark Button Up")), React.createElement("div", {className: 'mark-button-mask', ref: 'markbuttonmask'}, React.createElement("div", {className: 'mark-button-holder'}, React.createElement("div", {className: 'mark-button-wrapper', onWheel: this.onMouseWheel, onTouchMove: this.onTouchMove}, this.marks))), this.getNRButtonVisiblity(nrSelected, this.showNR), React.createElement("a", {href: 'javascript:void(0)', className: classNames('mark-button-nav down', { 'disabled': !this.isDownButtonVisible }), title: localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-mark-button-tooltip'), onClick: this.blockMoveDown, onWheel: this.onMouseWheel}, React.createElement("span", {className: 'sprite-icon bottom-arrow-blue'}, "Next/Previous"))));
        }
        else {
            /* If there is no selected mark, do not show available marks */
            return null;
        }
    };
    /**
     * On click handler
     * @param event
     */
    MarkButtonsContainer.prototype.onClickHandler = function (event) {
        stampActionCreator.showOrHideComment(false);
    };
    /**
     * This function gets invoked when the component is  receiving new props
     */
    MarkButtonsContainer.prototype.componentWillReceiveProps = function (nextProps) {
        /**
         * resetting the index only on re-rendering of components on props value change (not on
         *   re-rendering of up/down arrow click)
         */
        if (this.props.renderedOn !== nextProps.renderedOn) {
            this.resetIndex();
            this.setNumberOfMarkButtonsToShow();
        }
    };
    /**
     * This function gets called when the component is mounted
     */
    MarkButtonsContainer.prototype.componentDidMount = function () {
        // Adding subscription to the events
        this.addEventListeners();
        this.setUpEvents();
        this.resetIndex();
        this.setNumberOfMarkButtonsToShow();
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    MarkButtonsContainer.prototype.componentWillUnmount = function () {
        // Removing subscription to the events
        this.removeEventListeners();
        // unregister events
        this.unRegisterEvents();
    };
    /**
     * This function gets called when the component is updated
     */
    MarkButtonsContainer.prototype.componentDidUpdate = function () {
        if (markingStore.instance.currentQuestionItemInfo && deviceHelper.isTouchDevice()) {
            // setup events
            this.setUpEvents();
        }
        this.setNumberOfMarkButtonsToShow();
        this.markButtonContainer = Reactdom.findDOMNode(this.refs.markbuttoncontainer);
        if (this.markButtonContainer) {
            var containerWidth = this.markButtonContainer.getBoundingClientRect().width;
            this.props.getMarkButtonsContainerWidth(containerWidth);
        }
    };
    /**
     * This function subscribes to different events
     */
    MarkButtonsContainer.prototype.addEventListeners = function () {
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT, this.markChangedWithoutNavigation);
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SAVED, this.markChangedWithoutNavigation);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseNavigation);
    };
    /**
     * This function removes all the event subscriptions
     */
    MarkButtonsContainer.prototype.removeEventListeners = function () {
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT, this.markChangedWithoutNavigation);
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SAVED, this.markChangedWithoutNavigation);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseNavigation);
        if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }
    };
    /**
     * This will setup events
     */
    MarkButtonsContainer.prototype.setUpEvents = function () {
        var element = Reactdom.findDOMNode(this);
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 15 });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 15 });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipe);
        }
    };
    /**
     * unregister events
     */
    MarkButtonsContainer.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * returns the arrar of mark button jsx elements
     */
    MarkButtonsContainer.prototype.getMarksToShowAndHighlightSelected = function () {
        /*Collection of marks elements to show */
        var marksToShow = [];
        /* Total available marks count */
        this.totalAvailableMarksCount = markingStore.instance.currentQuestionItemInfo.availableMarks.size;
        /* Total number of marks to show */
        var totalMarksToShow = this.visibleMarksCount < this.totalAvailableMarksCount ?
            this.visibleMarksCount : this.totalAvailableMarksCount;
        /* The starting index */
        if (this.topIndex === 0) {
            this.topIndex = totalMarksToShow - 1;
        }
        if (this.bottomIndex === -1) {
            this.selectedMarkIndex = this.getSelectedMarkIndex(totalMarksToShow);
        }
        /*if the starting index is less than the total marks count, there will always be a next mark to navigate */
        this.isUpButtonVisible = this.topIndex < this.totalAvailableMarksCount - 1 && this.topIndex >= 0 ?
            true : false;
        /*down button is visible if bottom index is greater than 0*/
        this.isDownButtonVisible = this.bottomIndex > 0 ? true : false;
        marksToShow = this.getMarkButtons(this.selectedMarkIndex);
        return marksToShow;
    };
    /**
     * Generate and returns the array of mark button elements based on the given params
     * @param bottomIndex - index of the bottom most mark displayed
     * @param topIndex - index of the top most mark displayed
     * @param selectedMarkIndex - index of the selected mark if mark is alreday there
     * @returns array of mark button elements
     */
    MarkButtonsContainer.prototype.getMarkButtons = function (selectedMarkIndex) {
        /* Class name of each mark */
        var className = 'mark-button';
        /*Collection of marks elements to show */
        var marksToShow = [];
        var currentMark;
        var top = this.totalAvailableMarksCount - 1; // index start from 1 less than count
        /* To avoid NR button to be displayed while iterating the collection */
        while (top >= 0) {
            className = top === this.topIndex ? className += ' end-view' : className;
            className = top === selectedMarkIndex ? className += ' active' : className;
            currentMark = markingStore.instance.currentQuestionItemInfo.availableMarks.get(top);
            marksToShow.push(React.createElement(MarkButton, {className: className, allocatedMark: currentMark, id: top.toString(), key: top.toString(), isUnzoned: this.props.isUnzoned}));
            top--;
            className = top === this.bottomIndex ? 'mark-button start-view' : 'mark-button';
        }
        return marksToShow;
    };
    /**
     * resetting the top and bottom index based on currently eneterd mark to be visisble .
     * @param totalMarksToShow
     * @returns selected Mark Index
     */
    MarkButtonsContainer.prototype.getSelectedMarkIndex = function (totalMarksToShow) {
        /* already entered mark for the selected mark scheme */
        var selectedMark = markingStore.instance.currentQuestionItemInfo.allocatedMarks;
        /* The index of the selected mark in the available marks collection.*/
        var selectedMarkIndex = -1;
        var index = 0;
        markingStore.instance.currentQuestionItemInfo.availableMarks.forEach(function (item) {
            /* The index of the selected mark in the available marks collection. Include decimals as well by using parseFloat */
            var _selectedMark = selectedMark.displayMark;
            if (_selectedMark.toString().match(/^-?\d+\.\d{0,2}$/) != null) {
                _selectedMark = parseFloat(selectedMark.displayMark).toString();
            }
            if (item.displayMark === _selectedMark) {
                selectedMarkIndex = index;
            }
            index++;
        });
        this.isDownButtonVisible = false;
        /* resetting the bottom index from -1 to 0*/
        this.bottomIndex = 0;
        /* if a mark is not entred always show the first set of available marks */
        if (selectedMark.displayMark !== '-' && selectedMark.displayMark !== NOT_ATTEMPTED && selectedMarkIndex !== -1) {
            /* To find the center position of the displayed mark Buttons */
            var centerIndex = Math.ceil(totalMarksToShow / 2);
            /* Checking whether center index needed to be modified  */
            if (selectedMarkIndex >= centerIndex && totalMarksToShow - 1 < this.totalAvailableMarksCount - 1) {
                /* Adjusting the center index based on the calculated value */
                var calculatedTopIndex = totalMarksToShow - centerIndex;
                /* Index position based on which the current display needed to be modified */
                var noOfPosition = (selectedMarkIndex + calculatedTopIndex)
                    >= this.totalAvailableMarksCount - 1 ? 0 : calculatedTopIndex;
                if (noOfPosition === 0) {
                    var index_1 = 0;
                    for (var i = calculatedTopIndex; i > 0; i--) {
                        if ((selectedMarkIndex + i) < (this.totalAvailableMarksCount - 1)) {
                            index_1 = i;
                            break;
                        }
                    }
                    noOfPosition = index_1;
                }
                this.topIndex = selectedMarkIndex + noOfPosition;
                this.bottomIndex = this.topIndex - (totalMarksToShow - 1);
                /* if the selected mark is not in the first set then there will always be a mark to navigate down */
                this.isDownButtonVisible = true;
            }
        }
        return selectedMarkIndex;
    };
    /**
     * Set the number of mark buttons to show in the available marks
     */
    MarkButtonsContainer.prototype.setNumberOfMarkButtonsToShow = function () {
        // Set the current visible marks count.
        var visibleMarkCount = this.visibleMarksCount;
        // Check the component has items rendered.
        if (!this.refs.markbuttonmask) {
            return;
        }
        // Get the height of the 'mark button mask' div
        var height = this.refs.markbuttonmask.getBoundingClientRect().height;
        // No of items can hold for the element.
        this.visibleMarksCount = Math.floor(height / MARK_BUTTON_HEIGHT);
        // Based on the available marks, set the value for the end value which is used to diplay MAX value.
        if (this.totalAvailableMarksCount > this.visibleMarksCount) {
            this.extendEndView = null;
        }
        // Check the MAX value is displaying in UI
        var isMaxVisible = (this.totalAvailableMarksCount - 1) > this.visibleMarksCount;
        // If MAX value is displaying, try to accomadate remaing mark buttons without displaying MAX div in UI
        if (isMaxVisible && (height + MAX_MARK_WITH_UP_BUTTONS_HEIGHT > (this.totalAvailableMarksCount * MARK_BUTTON_HEIGHT))) {
            // Can accomadate all avilable buttons update the visibleMarksCount
            this.extendEndView = true;
            this.visibleMarksCount = this.totalAvailableMarksCount;
        }
        // Render the component only if the value has been changed.
        if (visibleMarkCount !== this.visibleMarksCount) {
            // Reset the index values before the render.
            this.resetIndex();
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    /**
     * handles mouseWheel navigation
     */
    MarkButtonsContainer.prototype.onMouseWheel = function (event) {
        if (this.isNavigationInProgress === false) {
            /*To check if there is only one mark available to display */
            if (event.deltaY > 0) {
                if (this.bottomIndex > 0) {
                    this.moveDown();
                }
            }
            else if (!this.extendEndView) {
                this.moveUp();
            }
        }
        else {
            this.setState({ reRenderedOn: Date.now() });
        }
    };
    /**
     * Trigger on swipe move.
     */
    MarkButtonsContainer.prototype.onSwipe = function (event) {
        this.isSwipe = true;
        /** To prevent event bubbling */
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        var timeTaken = event.deltaTime;
        this.numberOfNodesToMove = this.calculateNumberOfNodesToMove(Math.abs(displacement), timeTaken, true);
        this.isMoveUp = (displacement > 0) ? true : false;
    };
    /**
     * Trigger on touch move.
     */
    MarkButtonsContainer.prototype.onPanMove = function (event) {
        event.srcEvent.preventDefault();
        var displacement = event.deltaY;
        var timeTaken = event.deltaTime;
        if (Math.abs(displacement) > MOVE_FACTOR_PIXEL && !this.isSwipe) {
            this.isMoveUp = (displacement > 0) ? true : false;
            this.numberOfNodesToMove = this.calculateNumberOfNodesToMove(Math.abs(displacement), timeTaken, false);
        }
        this.isSwipe = false;
    };
    /**
     * Trigger on touch move.
     */
    MarkButtonsContainer.prototype.onPanEnd = function (event) {
        event.srcEvent.preventDefault();
        while (this.numberOfNodesToMove > 0) {
            if (this.isMoveUp) {
                this.moveUp();
            }
            else {
                this.moveDown();
            }
            this.numberOfNodesToMove--;
        }
    };
    /**
     * Calculating the number of nodes to move based on the velocity of swipe
     * @param displacement - displacement on swiping.
     * @param time - time taken for swiping.
     * @param isVelocityBased - Whether the number of node calculation is velocity based (for swipe) or not(for pan).
     * @retrn number - number of nodes to be moved.
     */
    MarkButtonsContainer.prototype.calculateNumberOfNodesToMove = function (displacement, time, isVelocityBased) {
        var velocity;
        var numberOfNodes = 1;
        velocity = displacement / time;
        if (isVelocityBased) {
            numberOfNodes = Math.floor(velocity * SWIPE_MOVE_FACTOR);
        }
        else {
            /**
             * Setting this to 1 for roll (touch and move). To move to next node on every touch move event.
             */
            numberOfNodes = 1;
        }
        return numberOfNodes;
    };
    /**
     * Trigger on touch move.
     */
    MarkButtonsContainer.prototype.onTouchMove = function (event) {
        /**
         * To prevent the default flickering behavior of ipad safari.
         */
        event.preventDefault();
    };
    /**
     * resetting the top and bottom index values
     */
    MarkButtonsContainer.prototype.resetIndex = function () {
        this.bottomIndex = -1;
        this.topIndex = 0;
        this.isNavigationInProgress = true;
        this.selectedMarkIndex = undefined;
    };
    /**
     * Gets the visibility of NR button based on AllowNR
     * @param nrSelected - checks if nr is selected for the question item
     * @param showNR - to check whether nr button needs to be shown for the item
     */
    MarkButtonsContainer.prototype.getNRButtonVisiblity = function (nrSelected, showNR) {
        var _this = this;
        var nrButton = null;
        if (showNR) {
            nrButton = (React.createElement("a", {href: '#', className: classNames('mark-button nr-button', { 'active': nrSelected }), draggable: false, onClick: function (e) { return _this.onNRButtonClick(e); }}, localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response')));
        }
        return nrButton;
    };
    return MarkButtonsContainer;
}(eventManagerBase));
module.exports = MarkButtonsContainer;
//# sourceMappingURL=markbuttonscontainer.js.map
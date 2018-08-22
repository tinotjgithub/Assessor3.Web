/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import markingStore = require('../../stores/marking/markingstore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import MarkButton = require('./markbutton');
import MaxButton = require('./maxbutton');
import localeStore = require('../../stores/locale/localestore');
import deviceHelper = require('../../utility/touch/devicehelper');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import eventTypes = require('../base/eventmanager/eventtypes');
import direction = require('../base/eventmanager/direction');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import timerHelper = require('../../utility/generic/timerhelper');
import messageStore = require('../../stores/message/messagestore');
import responseStore = require('../../stores/response/responsestore');
const NOT_ATTEMPTED = 'NR';
let classNames = require('classnames');
const MAX_MARK_WITH_UP_BUTTONS_HEIGHT = 81;
const MARK_BUTTON_HEIGHT = 58;
const SWIPE_MOVE_FACTOR = 2;
const MOVE_FACTOR_PIXEL = 10;

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    renderedOn?: number;
    parentHeight?: number;
    getMarkButtonsContainerWidth: Function;
    isUnzoned: boolean;
}

/**
 * State of a component
 */
interface State {
    reRenderedOn?: number;
}

/**
 * Marking buttons.
 * @param {Props} props
 * @returns
 */
class MarkButtonsContainer extends eventManagerBase {
    /* Whether the down navigation button viusisble or not */
    private isDownButtonVisible: boolean = false;
    /* Whether the up navigation button viusisble or not */
    private isUpButtonVisible: boolean = false;
    /* Array of mark button elements */
    private marks: Array<JSX.Element> = [];
    /*The number of mark buttons to show in available marks */
    private visibleMarksCount: number = 0;
    /* The ending index */
    private bottomIndex: number = -1;
    /* The starting index */
    private topIndex: number = 0;
    /* Total available marks count */
    private totalAvailableMarksCount: number;
    /* Whether the window is getting resized or not */
    private isResizing: boolean = false;
    /*Checks whether the extendView class needs to be applied or not */
    private extendEndView: boolean = false;
    /* index of the already entered/selected mark */
    private selectedMarkIndex: number;

    private markButtonMask: HTMLElement = null;

    private markButtonContainer: HTMLElement = null;

    /* calculates the number of nodes to move in each swipe*/
    private numberOfNodesToMove: number;
    /*checks the direction of swipe*/
    private isMoveUp: boolean;
    /*checks user action is swipe or pan*/
    private isSwipe: boolean = false;
    /* The markscheme helper */
    private markSchemeHelper: markSchemeHelper;
    /* Checks whether the noNr class needs to be applied or not */
    private showNR: boolean = false;
    private isNavigationInProgress: boolean = false;
    /**
     * Markbuttonmask ref for calculating the number of marks to be displayed in the current view
     */

    /* The ending index */

    public refs: {
        [key: string]: (Element);
        markbuttonmask: (HTMLTextAreaElement);
        markbuttoncontainer: (HTMLDivElement);
    };

    /**
     * Constructor MarkButtonsContainer
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.moveUp = this.moveUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onTouchMove = null;
        this.onPanMove = this.onPanMove.bind(this);
        this.onSwipe = this.onSwipe.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.resetActiveMarkingButton = this.resetActiveMarkingButton.bind(this);
        this.markSchemeHelper = new markSchemeHelper();
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        /* if there is a selected mark available */
        if (markingStore.instance.currentQuestionItemInfo) {

            this.marks = this.getMarksToShowAndHighlightSelected();
            this.isNavigationInProgress = false;
            /* Enable max button if the totalAvailableMarksCount is greater than the availableMarks to display */
            let isMaxVisible: boolean = (this.totalAvailableMarksCount) > this.visibleMarksCount;
            /* check if NR is selected for the particular question  */
            let nrSelected: boolean = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark === NOT_ATTEMPTED;
            let upArrowClass = '';

            /* Hiding up arrow button if there is no marks to scroll  */
            if (!this.isUpButtonVisible && !isMaxVisible) {
                upArrowClass = ' hide';
            } else if ((this.totalAvailableMarksCount - 1) === this.topIndex) {
                upArrowClass = ' disabled';
            }

            /* If allowNR is defined for the question then set showNR to true */
            this.showNR = this.markSchemeHelper.isAllowNRDefinedForTheMarkScheme;
            let mbcClass = classNames('mark-button-container', { 'extend-end-view': (this.extendEndView === true) },
                { 'no-nr': (this.showNR === false)});
            return (
                <div className={ mbcClass } ref ='markbuttoncontainer'  onClick={this.onClickHandler}>
                    <MaxButton id='maxbutton' key='maxbutton' isVisible={isMaxVisible}
                        mark={markingStore.instance.currentQuestionItemInfo.availableMarks.last()}
                        onClick={(e) => this.onMaxButtonClick(e) }
                        />
                    <a href='javascript:void(0)' className= {classNames('mark-button-nav up') + upArrowClass }
                        title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.next-mark-button-tooltip') }
                        onClick={this.blockMoveUp}
                        onWheel = {this.onMouseWheel}>
                        <span className='sprite-icon top-arrow-blue'>Mark Button Up</span>
                    </a>
                    <div className='mark-button-mask' ref='markbuttonmask'>
                        <div className='mark-button-holder'>
                            <div className='mark-button-wrapper'
                                onWheel = {this.onMouseWheel}
                                onTouchMove = {this.onTouchMove}>
                                { this.marks }
                            </div>
                        </div>
                    </div>
                    {this.getNRButtonVisiblity(nrSelected, this.showNR)}
                    <a href='javascript:void(0)' className={classNames('mark-button-nav down',
                        { 'disabled': !this.isDownButtonVisible }) }
                        title={localeStore.instance.TranslateText('marking.response.mark-scheme-panel.previous-mark-button-tooltip') }
                        onClick={this.blockMoveDown}
                        onWheel = {this.onMouseWheel}>
                        <span className='sprite-icon bottom-arrow-blue'>
                            Next/Previous</span>
                    </a>
                </div>);
        } else {
            /* If there is no selected mark, do not show available marks */
            return null;
        }
    }

    /**
     * On click handler
     * @param event
     */
    private onClickHandler(event: any) {
        stampActionCreator.showOrHideComment(false);
    }

    /**
     * This function gets invoked when the component is  receiving new props
     */
    public componentWillReceiveProps(nextProps: Props) {
        /**
         * resetting the index only on re-rendering of components on props value change (not on
         *   re-rendering of up/down arrow click)
         */
        if (this.props.renderedOn !== nextProps.renderedOn) {
            this.resetIndex();
            this.setNumberOfMarkButtonsToShow();
        }
    }

    /**
     * This function gets called when the component is mounted
     */
    public componentDidMount() {
        // Adding subscription to the events
        this.addEventListeners();
        this.setUpEvents();
        this.resetIndex();
        this.setNumberOfMarkButtonsToShow();
    }


    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        // Removing subscription to the events
        this.removeEventListeners();
        // unregister events
        this.unRegisterEvents();
    }

    /**
     * This function gets called when the component is updated
     */
    public componentDidUpdate() {
        if (markingStore.instance.currentQuestionItemInfo && deviceHelper.isTouchDevice()) {
            // setup events
            this.setUpEvents();
        }

        this.setNumberOfMarkButtonsToShow();

        this.markButtonContainer = Reactdom.findDOMNode(this.refs.markbuttoncontainer) as HTMLElement;
        if (this.markButtonContainer) {
            let containerWidth = this.markButtonContainer.getBoundingClientRect().width;
            this.props.getMarkButtonsContainerWidth(containerWidth);
        }
    }

    /**
     * When the window gets resized
     */
    private onWindowResize = () => {
        this.isResizing = true;
        /* resetting the index values on window resize*/
        this.resetIndex();
        this.setNumberOfMarkButtonsToShow();
        timerHelper.handleReactUpdatesOnWindowResize(() => {
            this.setState({
                renderedOn: Date.now()
            });
        });
    };

    /**
     * This function subscribes to different events
     */
    private addEventListeners() {
        window.addEventListener('resize', this.onWindowResize);
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT,
            this.markChangedWithoutNavigation);
        markingStore.instance.addListener(
            markingStore.MarkingStore.MARK_SAVED,
            this.markChangedWithoutNavigation);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseNavigation);
        markingStore.instance.addListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.resetActiveMarkingButton);
    }

    /**
     * This function removes all the event subscriptions
     */
    private removeEventListeners() {
        window.removeEventListener('resize', this.onWindowResize);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT,
            this.markChangedWithoutNavigation);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_SAVED,
            this.markChangedWithoutNavigation);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseNavigation);
        markingStore.instance.removeListener(
            markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
            this.resetActiveMarkingButton);
         if (deviceHelper.isTouchDevice()) {
            this.unRegisterEvents();
        }
    }

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = Reactdom.findDOMNode(this);

        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            let touchActionValue: string = 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 15 });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 15 });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipe);
        }
    }

    /**
     * unregister events
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Reset currently selected marking button
     */
    private resetActiveMarkingButton = (index: number, forceUpdate: boolean, isClearMarkAsDefinitive: boolean): void => {
        if (isClearMarkAsDefinitive) {
            this.resetIndex();
            this.setState({ reRenderedOn: Date.now() });
        }
    };

    /**
     * changing the selected mark button on mark updation without navigation(last markable item)
     */
    private markChangedWithoutNavigation = (): void => {
         // Rerender the mark buttons on next question
        this.resetIndex();
        this.setState({ reRenderedOn: Date.now() });
    };

    /**
     * To unregister events when response is changed.
     */
    private onResponseNavigation = () => {
        this.unRegisterEvents();
    };

    /**
     * returns the arrar of mark button jsx elements
     */
    private getMarksToShowAndHighlightSelected(): Array<JSX.Element> {
        /*Collection of marks elements to show */
        let marksToShow: Array<JSX.Element> = [];
        /* Total available marks count */
        this.totalAvailableMarksCount = markingStore.instance.currentQuestionItemInfo.availableMarks.size;
        /* Total number of marks to show */

        let totalMarksToShow: number = this.visibleMarksCount < this.totalAvailableMarksCount ?
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
    }

    /**
     * Click event for Max button
     * @param e - MouseEvent of click function
     */
    private onMaxButtonClick = (e: any): void => {
        e.preventDefault();
        /* To determine the number of indexes to subtract for setting the bottom index */
        let index = this.totalAvailableMarksCount - this.topIndex - 1;
        this.topIndex = this.totalAvailableMarksCount - 1;
        this.bottomIndex = this.bottomIndex + index;
        this.setState({ reRenderedOn: Date.now() });
    };

    /**
     * Generate and returns the array of mark button elements based on the given params
     * @param bottomIndex - index of the bottom most mark displayed
     * @param topIndex - index of the top most mark displayed
     * @param selectedMarkIndex - index of the selected mark if mark is alreday there
     * @returns array of mark button elements
     */
    private getMarkButtons(selectedMarkIndex?: number)
        : Array<JSX.Element> {
        /* Class name of each mark */
        let className: string = 'mark-button';
        /*Collection of marks elements to show */
        let marksToShow: Array<JSX.Element> = [];
        let currentMark: AllocatedMark;
        let top = this.totalAvailableMarksCount - 1; // index start from 1 less than count
        /* To avoid NR button to be displayed while iterating the collection */
        while (top >= 0) {
            className = top === this.topIndex ? className += ' end-view' : className;
            className = top === selectedMarkIndex ? className += ' active' : className;
            currentMark = markingStore.instance.currentQuestionItemInfo.availableMarks.get(top);
            marksToShow.push(<MarkButton className={className}
                allocatedMark={currentMark} id={top.toString()} key={top.toString()} isUnzoned={this.props.isUnzoned}/>);
            top--;
            className = top === this.bottomIndex ? 'mark-button start-view' : 'mark-button';
        }

        return marksToShow;
    }

    /**
     * resetting the top and bottom index based on currently eneterd mark to be visisble .
     * @param totalMarksToShow
     * @returns selected Mark Index
     */
    private getSelectedMarkIndex(totalMarksToShow: number): number {
        /* already entered mark for the selected mark scheme */
        let selectedMark: AllocatedMark = markingStore.instance.currentQuestionItemInfo.allocatedMarks;

        /* The index of the selected mark in the available marks collection.*/
        let selectedMarkIndex: number = -1;
        let index = 0;
        markingStore.instance.currentQuestionItemInfo.availableMarks.forEach((item: AllocatedMark) => {

            /* The index of the selected mark in the available marks collection. Include decimals as well by using parseFloat */
            let _selectedMark: string = selectedMark.displayMark;
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
            let centerIndex: number = Math.ceil(totalMarksToShow / 2);
            /* Checking whether center index needed to be modified  */
            if (selectedMarkIndex >= centerIndex && totalMarksToShow - 1 < this.totalAvailableMarksCount - 1) {
                /* Adjusting the center index based on the calculated value */
                let calculatedTopIndex: number = totalMarksToShow - centerIndex;
                /* Index position based on which the current display needed to be modified */
                let noOfPosition: number = (selectedMarkIndex + calculatedTopIndex)
                    >= this.totalAvailableMarksCount - 1 ? 0 : calculatedTopIndex;

                if (noOfPosition === 0) {
                    let index: number = 0;
                    for (let i = calculatedTopIndex; i > 0; i--) {
                        if ((selectedMarkIndex + i) < (this.totalAvailableMarksCount - 1)) {
                            index = i;
                            break;
                        }
                    }
                    noOfPosition = index;
                }

                this.topIndex = selectedMarkIndex + noOfPosition;
                this.bottomIndex = this.topIndex - (totalMarksToShow - 1);
                /* if the selected mark is not in the first set then there will always be a mark to navigate down */
                this.isDownButtonVisible = true;
            }
        }

        return selectedMarkIndex;
    }

    /**
     * Set the number of mark buttons to show in the available marks
     */
    private setNumberOfMarkButtonsToShow() {
        // Set the current visible marks count.
        let visibleMarkCount = this.visibleMarksCount;

        // Check the component has items rendered.
        if (!this.refs.markbuttonmask) {
            return;
        }

        // Get the height of the 'mark button mask' div
        let height: number = this.refs.markbuttonmask.getBoundingClientRect().height;

        // No of items can hold for the element.
        this.visibleMarksCount = Math.floor(height / MARK_BUTTON_HEIGHT);

        // Based on the available marks, set the value for the end value which is used to diplay MAX value.
        if (this.totalAvailableMarksCount > this.visibleMarksCount) {
            this.extendEndView = null;
        }

        // Check the MAX value is displaying in UI
        let isMaxVisible: boolean = (this.totalAvailableMarksCount - 1) > this.visibleMarksCount;

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
    }

    /**
     * move up on clicking up arrow
     */
    private moveUp = (): void => {
        if (this.topIndex < (this.totalAvailableMarksCount - 1) && !this.extendEndView) {
            this.topIndex++;
            this.bottomIndex++;
            this.setState({ reRenderedOn: Date.now() });
        }
    };

    /**
     * move up on clicking down arrow
     */
    private moveDown = (): void => {
        if (this.bottomIndex > 0 && !this.extendEndView) {
            this.bottomIndex--;
            this.topIndex--;
        }
        this.setState({ reRenderedOn: Date.now() });
    };

    /**
     * move up block wise on clicking up arrow
     */
    private blockMoveUp = (): void => {
        if (this.isNavigationInProgress === false && (this.topIndex < (this.totalAvailableMarksCount - 1))) {
            let buttonsAbove = this.totalAvailableMarksCount - 1 - this.topIndex;
            let index = buttonsAbove > this.visibleMarksCount ? this.visibleMarksCount : buttonsAbove;
            this.topIndex = this.topIndex + index;
            this.bottomIndex = this.bottomIndex + index;
            this.setState({ reRenderedOn: Date.now() });
        } else {
            this.setState({ reRenderedOn: Date.now() });
        }
    };

    /**
     * move down block wise on clicking down arrow
     */
    private blockMoveDown = (): void => {
        if (this.isNavigationInProgress === false && this.bottomIndex > 0) {
            let index = this.bottomIndex > this.visibleMarksCount ? this.visibleMarksCount : this.bottomIndex;
            this.topIndex = this.topIndex - index;
            this.bottomIndex = this.bottomIndex - index;
            this.setState({ reRenderedOn: Date.now() });
        } else {
            this.setState({ reRenderedOn: Date.now() });
        }
    };

    /**
     * Click event for NR button click
     */
    private onNRButtonClick = (e: any): void => {
        e.preventDefault();
        let allocatedMark: AllocatedMark;
        allocatedMark = {
            displayMark: 'NR',
            valueMark: 'NR'
        };

        markingActionCreator.markUpdated(allocatedMark);
    };


    /**
     * handles mouseWheel navigation
     */
    private onMouseWheel(event: any) {
        if (this.isNavigationInProgress === false) {
            /*To check if there is only one mark available to display */
            if (event.deltaY > 0) {
                if (this.bottomIndex > 0) {
                    this.moveDown();
                }
            } else if (!this.extendEndView) {
                this.moveUp();
            }
        } else {
            this.setState({ reRenderedOn: Date.now() });
        }
    }

    /**
     * Trigger on swipe move.
     */
    private onSwipe(event: EventCustom) {
        this.isSwipe = true;
        /** To prevent event bubbling */
        event.srcEvent.preventDefault();
        let displacement: number = event.deltaY;
        let timeTaken: number = event.deltaTime;
        this.numberOfNodesToMove = this.calculateNumberOfNodesToMove(Math.abs(displacement), timeTaken, true);
        this.isMoveUp = (displacement > 0) ? true : false;
    }

    /**
     * Trigger on touch move.
     */
    private onPanMove(event: EventCustom) {
        event.srcEvent.preventDefault();
        let displacement: number = event.deltaY;
        let timeTaken: number = event.deltaTime;
        if (Math.abs(displacement) > MOVE_FACTOR_PIXEL && !this.isSwipe) {
            this.isMoveUp = (displacement > 0) ? true : false;
            this.numberOfNodesToMove = this.calculateNumberOfNodesToMove(Math.abs(displacement), timeTaken, false);
        }
        this.isSwipe = false;
    }

    /**
     * Trigger on touch move.
     */
    private onPanEnd(event: EventCustom) {
        event.srcEvent.preventDefault();
        while (this.numberOfNodesToMove > 0) {
            if (this.isMoveUp) {
                this.moveUp();
            } else {
                this.moveDown();
            }
            this.numberOfNodesToMove--;
        }
    }

    /**
     * Calculating the number of nodes to move based on the velocity of swipe
     * @param displacement - displacement on swiping.
     * @param time - time taken for swiping.
     * @param isVelocityBased - Whether the number of node calculation is velocity based (for swipe) or not(for pan).
     * @retrn number - number of nodes to be moved.
     */
    private calculateNumberOfNodesToMove(displacement: number, time: number, isVelocityBased: boolean): number {
        let velocity: number;
        let numberOfNodes: number = 1;
        velocity = displacement / time;
        if (isVelocityBased) {
            numberOfNodes = Math.floor(velocity * SWIPE_MOVE_FACTOR);
        } else {
            /**
             * Setting this to 1 for roll (touch and move). To move to next node on every touch move event.
             */
            numberOfNodes = 1;
        }

        return numberOfNodes;
    }

    /**
     * Trigger on touch move.
     */
    private onTouchMove(event: any) {
        /**
         * To prevent the default flickering behavior of ipad safari.
         */
        event.preventDefault();
    }

    /**
     * resetting the top and bottom index values
     */
    private resetIndex(): void {
        this.bottomIndex = -1;
        this.topIndex = 0;
        this.isNavigationInProgress = true;
        this.selectedMarkIndex = undefined;
    }

    /**
     * Gets the visibility of NR button based on AllowNR
     * @param nrSelected - checks if nr is selected for the question item
     * @param showNR - to check whether nr button needs to be shown for the item
     */
    private getNRButtonVisiblity(nrSelected: boolean, showNR): JSX.Element {
        let nrButton = null;
        if (showNR) {
            nrButton = (<a href='#' className={classNames('mark-button nr-button',
                { 'active': nrSelected })} draggable={false} onClick={(e) => this.onNRButtonClick(e)}>
                {localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response')}
            </a>);
        }

        return nrButton;
    }
}

export = MarkButtonsContainer;

/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import GridControl = require('../utility/grid/gridcontrol');
import eventTypes = require('../base/eventmanager/eventtypes');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import enums = require('../utility/enums');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import TableControl = require('../utility/table/tablewrapper');
import gridRow = require('../utility/grid/gridrow');
import Immutable = require('immutable');
import timerHelper = require('../../utility/generic/timerhelper');
import tableHelper = require('../utility/table/tablehelper');
import deviceHelper = require('../../utility/touch/devicehelper');
import direction = require('../base/eventmanager/direction');
const SCROLL_DAMPENING_FACTOR = 15;
const INITIAL_DISPLACEMENT_OFFSET = 20;

interface Props extends PropsBase, LocaleSelectionBase {
    awardingFrozenHeaderRows: Immutable.List<Row>;
    awardingColumnHeaderRows: Immutable.List<Row>;
    awardingCandidateGradeViewCollection: [Immutable.List<gridRow>, Immutable.List<gridRow>];
    onSortClick?: Function;
    renderedOn: number;
}

interface State {
    renderedOn: number;
}

/**
 * React wrapper component for awarding details grid tables
 */
class AwardingTableWrapper extends eventManagerBase {

    private cssRowHeaderTableStyle: React.CSSProperties;
    private cssRowHeaderHeaderTableStyle: React.CSSProperties;
    private cssContentWrapTableStyle: React.CSSProperties;
    private cssBodyWrapTableStyle: React.CSSProperties;
    private frozenHeadStyle: React.CSSProperties;
    private isScrolledLeft: boolean;
    private isScrolledRight: boolean;
    private frozenTableHolderWidth: number;
    /*checks user action is swipe or pan*/
    private isSwipe: boolean = false;
    private cssFrozenTableStyle: React.CSSProperties;
    private isManuallyScrolled: boolean = false;
    private isAutoScrolled: boolean = false;



    /** refs */
    public refs: {
        [key: string]: (Element);
        tableScrollHolder: (HTMLDivElement);
        awardingGridPanel: (HTMLDivElement);
        headerScrollHolder: (HTMLDivElement);
        frozenTableHolder: (HTMLDivElement);
        frozenHeader: (HTMLDivElement);
    };

    /**
     * 
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onSwipeHandler = this.onSwipeHandler.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;
        this.onFrozenColumnScroll = this.onFrozenColumnScroll.bind(this);
    }
    /**
     * margins and styles should be set after first render.
     */
    public componentDidMount() {
        this.setMarginsAndStyle();
        window.addEventListener('resize', this.setMarginsAndStyle);

        if (deviceHelper.isTouchDevice()) {
            this.setUpEvents();
        }
    }

    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this.refs.frozenTableHolder);

        if (element && !this.eventHandler.isInitialized) {
            this.eventHandler.initEvents(element);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipeHandler);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: 5 });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
        }
    }

    private setColumnWidths = () => {
        tableHelper.setColumnWidthsForTable('awarding_grid', 'frozenHeader_', 'rowHeader_');
        tableHelper.setColumnWidthsForTable('awarding_grid', 'columnHeader_', '');
    }
    /**
     * set the left/right scrollable variables
     * @param tableScrollHolder
     */
    private setScrollablevariable() {
        if (this.refs.tableScrollHolder) {
            if (this.refs.tableScrollHolder.scrollLeft <= 0) {
                this.isScrolledLeft = true;
            } else {
                this.isScrolledLeft = false;
            }
            if ((this.refs.tableScrollHolder.scrollLeft + this.refs.tableScrollHolder.offsetWidth) >=
                this.refs.tableScrollHolder.scrollWidth) {

                this.isScrolledRight = true;
            } else {
                this.isScrolledRight = false;
            }
        }
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        window.removeEventListener('resize', this.setMarginsAndStyle);

        // unregister events
        this.unRegisterEvents();
    }
    /**
     * unsubscribing hammer touch events and handlers
     */
    private unRegisterEvents() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }


    /**
     * componentDidUpdate reate life cycle event
     */
    public componentDidUpdate() {
        if (this.refs.frozenTableHolder && this.frozenTableHolderWidth !== this.refs.frozenTableHolder.offsetWidth) {
            // dynamically set the examiner column width on node expansion
            this.setMarginsAndStyle();
        } else {
            this.setColumnWidths();
        }
    }

    /**
     * render 
     */
    public render() {
        return <div className={this.getGridClass()} style={this.cssRowHeaderTableStyle} ref={'awardingGridPanel'}>
            <div className='table-header-wrap' style={this.cssRowHeaderHeaderTableStyle} >
                <div className='table-wrap-lt' ref={'frozenHeader'} style={this.frozenHeadStyle} >
                    <TableControl
                        tableHeaderRows={this.props.awardingFrozenHeaderRows}
                        gridStyle={'table-view'}
                        id={'frozenHeader_awarding_grid'}
                        key={'key_frozenHeader_' + this.props.id}
                        selectedLanguage={this.props.selectedLanguage}
                        onSortClick={this.onSortClick}
                        renderedOn={this.props.renderedOn} />
                </div>
                < div className='table-wrap-t' >
                    <div className='header-scroll-holder' ref={'headerScrollHolder'}>
                        <TableControl
                            tableHeaderRows={this.props.awardingColumnHeaderRows}
                            gridStyle={'table-view'}
                            id={'columnHeader_awarding_grid'}
                            key={'key_columnHeader_' + this.props.id}
                            selectedLanguage={this.props.selectedLanguage}
                            onSortClick={this.onSortClick}
                            renderedOn={this.props.renderedOn} />
                    </div>
                    < div className='drop-shadow' > </div>
                </div>
            </div>
            < div className='table-content-wrap' style={this.cssContentWrapTableStyle} >
                <div className={'table-wrap-l tree-view'}
                    ref={'frozenTableHolder'} >
                    <TableControl
                        tableBodyRows={this.props.awardingCandidateGradeViewCollection[0]}
                        gridStyle={'table-view'}
                        id={'rowHeader_awarding_grid'}
                        key={'key_rowHeader_' + this.props.id}
                        selectedLanguage={this.props.selectedLanguage}
                        renderedOn={this.props.renderedOn} />
                </div>
                < div className='table-body-wrap' >
                    <div className='table-scroll-holder'
                        style={this.cssBodyWrapTableStyle}
                        ref={'tableScrollHolder'}
                        onScroll={this.onScrollHandler} >
                        <div className='table-content-holder' >
                            <TableControl
                                tableBodyRows={this.props.awardingCandidateGradeViewCollection[1]}
                                gridStyle={'table-view'}
                                id={'awarding_grid'}
                                key={'key_awarding_grid'}
                                selectedLanguage={this.props.selectedLanguage}
                                renderedOn={this.props.renderedOn} />
                        </div>
                    </div>
                    < div className='drop-shadow' > </div>
                </div>
            </div>
        </div>;
    }

    /**
     * on scroll on the worklist set the scroll of the display IDs table
     * @param any
     */
    private onScrollHandler = (e: any) => {
        if (this.isAutoScrolled === false) {
            this.isManuallyScrolled = true;
        }
        let tableScrollHolder = this.refs.tableScrollHolder;
        let scrollTop: number = this.refs.tableScrollHolder.scrollTop;
        let scrollleft: number = this.refs.tableScrollHolder.scrollLeft;

        this.refs.frozenTableHolder.scrollTop = scrollTop;
        this.refs.headerScrollHolder.scrollLeft = scrollleft;

        this.setScrollablevariable();
        this.refs.awardingGridPanel.className = this.getGridClass();

        if (this.isAutoScrolled) {
            this.isAutoScrolled = false;
        }
    };

	/**
	 * Trigger on frozen column scroll.
	 */
    private onFrozenColumnScroll = (e: any) => {
        if (this.isManuallyScrolled === false) {
            this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop;
            this.isAutoScrolled = true;
        }

        if (this.isManuallyScrolled) {
            this.isManuallyScrolled = false;
        }
    };

    /**
     * Trigger on mouse scroll.
     */
    private onMouseWheel = (e: any) => {

        this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop + e.deltaY;
        this.setScrollablevariable();
        this.refs.teamManagementGridPanel.className = this.getGridClass();
    };

    /**
     * Trigger on swipe move.
     */
    private onSwipeHandler(event: EventCustom) {
        this.isSwipe = true;
        /** To prevent event bubbling */
        event.srcEvent.preventDefault();
        let displacement: number = event.deltaY;
        this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - displacement;
    }

    /**
     * Trigger on touch move.
     */
    private onPanMove(event: EventCustom) {
        event.srcEvent.preventDefault();
        let displacement: number = event.deltaY;
        let timeTaken: number = event.deltaTime;
        if (!this.isSwipe) {
            event.srcEvent.preventDefault();
            let displacement: number = event.deltaY;
            if (Math.abs(displacement) > INITIAL_DISPLACEMENT_OFFSET && this.refs.tableScrollHolder && this.refs.frozenTableHolder) {
                // The displacement is divided by a dampening factor to restrict the fast scroll movement 
                this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - (displacement / SCROLL_DAMPENING_FACTOR);
            }
        }
        this.isSwipe = false;
    }

    /**
     * set the margins and css styles for diff divs and tables in worklist
     */
    private setMarginsAndStyle = () => {
        if (this.refs.frozenTableHolder) {
            let tableScrollHolder = this.refs.tableScrollHolder;
            this.frozenTableHolderWidth = this.refs.frozenTableHolder.offsetWidth;
            if (this.refs.frozenTableHolder) {
                this.frozenHeadStyle = {};
            }

            if (tableScrollHolder) {
                let hScrollbarWidth = tableScrollHolder.offsetWidth - tableScrollHolder.clientWidth;
                let vScrollbarWidth = tableScrollHolder.offsetHeight - tableScrollHolder.clientHeight;

                //NaN check for removing react warning
                hScrollbarWidth = isNaN(hScrollbarWidth) ? 0 : hScrollbarWidth;
                vScrollbarWidth = isNaN(vScrollbarWidth) ? 0 : vScrollbarWidth;

                this.cssRowHeaderTableStyle = { marginRight: -hScrollbarWidth };
                this.cssRowHeaderHeaderTableStyle = { marginRight: hScrollbarWidth };
                this.cssContentWrapTableStyle = { paddingBottom: vScrollbarWidth, paddingRight: hScrollbarWidth };
                this.cssBodyWrapTableStyle = { right: -hScrollbarWidth, bottom: -vScrollbarWidth };
                this.cssFrozenTableStyle = { marginRight: -hScrollbarWidth };

                this.setScrollablevariable();
                timerHelper.handleReactUpdatesOnWindowResize(() => {
                    this.setState({
                        renderedOn: Date.now()
                    });
                });
            }

            // we need to recalculate the column widths in window resize
            this.setColumnWidths();
        }
    };

    /**
     * returns the grid class (for shadow)
     */
    private getGridClass = (): string => {

        let gridClass = classNames('work-list-grid scrolled-left scrolled-right');

        return gridClass;
    };

    /**
     * This method will call on table header click for sorting.
     */
    private onSortClick = (comparerName: string, sortDirection: enums.SortDirection) => {
        return null;
    };
}
export = AwardingTableWrapper;

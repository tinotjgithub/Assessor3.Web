import React = require('react');
import ReactDom = require('react-dom');
import TableControl = require('../utility/table/tablewrapper');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
let classNames = require('classnames');
import timerHelper = require('../../utility/generic/timerhelper');
import deviceHelper = require('../../utility/touch/devicehelper');
import eventManagerBase = require('../base/eventmanager/eventmanagerbase');
import eventTypes = require('../base/eventmanager/eventtypes');
import direction = require('../base/eventmanager/direction');
import tableHelper = require('../utility/table/tablehelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import DraggingRowHolder = require('../worklist/shared/draggingrowholder');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import gridRow = require('../utility/grid/gridrow');
import immutable = require('immutable');
import qigStore = require('../../stores/qigselector/qigstore');
import stdSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');
import stdSetupHelper = require('../../utility/standardisationsetup/standardisationsetuphelper');
import constants = require('../utility/constants');

const ROW_HEIGHT = 41;
const DRAGGING_ROW_HEIGHT = 86;
const PRESS_TIME_DELAY = 250;

interface Props extends PropsBase, LocaleSelectionBase {
    standardisationSetupType: enums.StandardisationSetup;
    frozenHeaderRows: Immutable.List<Row>;
    columnHeaderRows: Immutable.List<Row>;
    frozenBodyRows?: Immutable.List<Row>;
    gridRows?: Immutable.List<Row>;
    getGridControlId: Function;
    onSortClick?: Function;
    renderedOn: number;
    onRowClick?: Function;
    isBorderRequired: boolean;
    doSetMinWidth?: boolean;
    gridType?: enums.GridType;
}

interface State {
    renderedOn: number;
}
/**
 * React wrapper component for Standardisation tables
 */
class StandardisationSetupTableWrapper extends eventManagerBase {

    private cssRowHeaderTableStyle: React.CSSProperties;
    private cssRowHeaderHeaderTableStyle: React.CSSProperties;
    private cssContentWrapTableStyle: React.CSSProperties;
    private cssBodyWrapTableStyle: React.CSSProperties;
    private frozenHeadStyle: React.CSSProperties;
    private isScrolledLeft: boolean;
    private isScrolledRight: boolean;
    /*checks user action is swipe or pan*/
    private isSwipe: boolean = false;
    private selectedDraggableRow: immutable.List<Row>;
    private currentMarkingModeId: enums.MarkingMode;
    private previousMarkingModeId: enums.MarkingMode;
    private oldRigOrder: number;
    private newRigOrder: number;
    private candidateScriptId: number;
    private totalMark: number;
    private displayId: string;
    private esCandidateScriptMarkGroupId: number;
    private isDraggingEnabled: boolean;
    private isReclassifyPopupOpened: boolean = false;
    private frozenBodyRows: immutable.List<Row>;
    private classifiedFrozenBodyRows: immutable.List<gridRow>;
    private classifiedGridRows: immutable.List<gridRow>;
    private gridRows: immutable.List<Row>;
    private standardisationSetupHelper: stdSetupHelper;
    private isGridUpdateRequired: boolean;
    private prevPageY: number = 0;
    private allowDrag: boolean = false;
    private esMarkGroupRowVersion: string;

    /** refs */
    public refs: {
        [key: string]: (Element);
        tableScrollHolder: (HTMLDivElement);
        standardisationSetupGridPanel: (HTMLDivElement);
        headerScrollHolder: (HTMLDivElement);
        frozenTableHolder: (HTMLDivElement);
        frozenHeader: (HTMLDivElement);
        tableContentHolder: (HTMLDivElement);
    };

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);

        // construct data here for classification worklist alone
        // part of refactoring
        if (this.isClassificationWorklist) {
            this.getClassificationGridRows();
        }
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onSwipeHandler = this.onSwipeHandler.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onPanStart = this.onPanStart.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.isScrolledLeft = true;
        this.isScrolledRight = true;

        this.onSortClick = this.onSortClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.setReclassifyPopupOpenFlag = this.setReclassifyPopupOpenFlag.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchHold = this.onTouchHold.bind(this);
        this.setTableWrapperMarginsAndStyle = this.setTableWrapperMarginsAndStyle.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        let gridId: string = this.props.getGridControlId();
        let rowId = this.selectedDraggableRow ? this.selectedDraggableRow.first().getRowId() : undefined;

        // if reclassification/Reordering occurred.
        if (this.isGridUpdateRequired) {
            this.getClassificationGridRows();
            this.isGridUpdateRequired = false;
        }

        let draggingRowHolder = this.isClassificationWorklist ?
            <DraggingRowHolder id={gridId + 'draggable'}
                key={gridId + 'draggable'}
                rowId={rowId}
                selectedRow={this.selectedDraggableRow}
                renderedOn={this.props.renderedOn} /> : null;
        return (
            <div className={this.getGridClass()} id={gridId + 'Wrapper'}
                style={this.cssRowHeaderTableStyle} ref={'standardisationSetupGridPanel'}>
                {draggingRowHolder}
                <div className='table-header-wrap' id={'tableHeaders'}
                    style={this.cssRowHeaderHeaderTableStyle} >
                    <div className='table-wrap-lt' ref={'frozenHeader'} style={this.frozenHeadStyle} >
                        <TableControl
                            tableHeaderRows={this.props.frozenHeaderRows}
                            gridStyle={this.getTableStyle()}
                            id={'frozenHeader_' + gridId}
                            key={'key_frozenHeader_' + this.props.id}
                            selectedLanguage={this.props.selectedLanguage}
                            onSortClick={this.onSortClick}
                            renderedOn={this.props.renderedOn} />
                    </div>
                    < div className='table-wrap-t' >
                        <div className='header-scroll-holder' ref={'headerScrollHolder'}>
                            <TableControl
                                tableHeaderRows={this.props.columnHeaderRows}
                                gridStyle={this.getTableStyle()}
                                id={'columnHeader_' + gridId}
                                key={'key_columnHeader_' + this.props.id}
                                selectedLanguage={this.props.selectedLanguage}
                                onSortClick={this.onSortClick}
                                renderedOn={this.props.renderedOn}
                                avoidLastColumn={this.isClassificationWorklist}
                            />
                        </div>
                        < div className='drop-shadow' > </div>
                    </div>
                </div>
                <div className='table-content-wrap' ref={'tableContentHolder'} id={'tableContent'} style={this.cssContentWrapTableStyle}>
					<div className={'table-wrap-l'}
						ref={'frozenTableHolder'}
                        onWheel={this.onMouseWheel}>
                            <TableControl
                                tableBodyRows={this.isClassificationWorklist ? this.frozenBodyRows : this.props.frozenBodyRows}
                                gridStyle={this.getTableStyle()}
                                id={'rowHeader_' + gridId}
                                key={'key_rowHeader_' + this.props.id}
                                selectedLanguage={this.props.selectedLanguage}
                                renderedOn={this.props.renderedOn}
                                standardisationSetUpType={this.props.standardisationSetupType}
                                onRowClick={this.props.onRowClick}
                                selectedRowIdToDrag={rowId}
                                onMouseDown={this.onMouseDown}
                                onMouseUp={this.onMouseUp}
                                onTouchStart={this.onGridRowSelected} />
                    </div>
                    < div className='table-body-wrap' >
                        <div className='table-scroll-holder'
                            style={this.cssBodyWrapTableStyle}
                            ref={'tableScrollHolder'}
                            onScroll={this.onScrollHandler} >
                            <div className='table-content-holder' >
                                <TableControl
                                    tableBodyRows={this.isClassificationWorklist ? this.gridRows : this.props.gridRows}
                                    gridStyle={this.getTableStyle()}
                                    id={gridId}
                                    key={'key_' + this.props.id}
                                    selectedLanguage={this.props.selectedLanguage}
                                    renderedOn={this.props.renderedOn}
                                    onRowClick={this.props.onRowClick}
                                    avoidLastColumn={this.isClassificationWorklist}
                                    standardisationSetUpType={this.props.standardisationSetupType}
                                    selectedRowIdToDrag={rowId}
                                    onMouseDown={this.onMouseDown}
                                    onMouseUp={this.onMouseUp}
                                    onTouchStart={this.onGridRowSelected} />
                            </div>
                        </div>
                        < div className='drop-shadow' > </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Set Grid table style
     */
    private getTableStyle() {
        if (this.props.isBorderRequired) {
            return 'table-view';
        } else {
            return 'table-view no-border';
        }
    }


    /**
     * on scroll on the STD Setup worklist set the scroll of the display IDs table
     * @param any
     */
    private onScrollHandler = (e: any) => {
        let tableScrollHolder = this.refs.tableScrollHolder;
        let scrollTop: number = this.refs.tableScrollHolder.scrollTop;
        let scrollleft: number = this.refs.tableScrollHolder.scrollLeft;

        this.refs.frozenTableHolder.scrollTop = scrollTop;
        this.refs.headerScrollHolder.scrollLeft = scrollleft;

        this.setScrollablevariable();
        this.refs.standardisationSetupGridPanel.className = this.getGridClass();
    };

    /**
     * on mouse wheel on the STD Setup worklist, set the scroll of the display IDs table
     * @param any
     */
    private onMouseWheel = (e: any) => {

        this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop + e.deltaY;
        this.setScrollablevariable();
        this.refs.standardisationSetupGridPanel.className = this.getGridClass();
    };

    /**
     * Trigger on swipe move.
     */
    private onSwipeHandler(event: EventCustom) {
        if (deviceHelper.isTouchDevice()) {
            this.isSwipe = true;
            /** To prevent event bubbling */
            event.srcEvent.preventDefault();
            let displacement: number = event.deltaY;
            this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop - displacement;
        }
    }

    /**
     * Trigger on pan move.
     */
    private onPanMove(event: EventCustom) {
        event.preventDefault();
        if (!htmlUtilities.isAndroidChrome() && this.allowDrag) {
            let scrollTop: number;
            let actualX = event.changedPointers[0].clientX;
            let actualY = event.changedPointers[0].clientY;
            let yCoord = event.center.y;
            let displacement = event.deltaY;

            this.allowDragging(actualX, actualY, displacement, yCoord);
        }
    }

    /**
     * Method trigger on touch move.
     * @param event
     */
    private onTouchMove(event: any) {
        // Work only for android/chrome browser combination.
        // TO DO: Investigation needed why PAN Move cancel in android chrome device.
        // Introduced Touch Move event as PAN Move cancelled after initial move
        // Happened in android device alone.
        if (htmlUtilities.isAndroidChrome() && this.allowDrag) {
            event.preventDefault();
            let pageY = event.changedTouches[0].pageY;
            let actualX = event.changedTouches[0].clientX;
            let actualY = event.changedTouches[0].clientY;
            let displacement = this.prevPageY - pageY;

            this.prevPageY = pageY;
            this.allowDragging(actualX, actualY, displacement, pageY);
        }
    }

    /**
     * event handler for touch end
     * Reset the grid to remove styles added as part of Dragging/Droping
     */
    private onTouchEnd = (event: any) => {
        this.prevPageY = 0;
        this.allowDrag = false;
        this.onPanEnd(event);
    };

    /**
     * This method is seperately added to handle both PAN/Touch move events.
     * @param actualX
     * @param actualY
     * @param yCoord
     */
    private allowDragging(actualX: any, actualY: any, displacement: any, yCoord: any) {
        // Allow dragging only if classify permission available for the examiner.
        if (this.isClassificationWorklist && standardisationSetupStore.instance.
            stdSetupPermissionCCData.role.permissions.classify) {
            this.onDraggingRow(actualX, actualY, yCoord, displacement);
        }
    }

    /**
     * Method to handle the logic of dragging row over classififcation worklist.
     * @param event
     */
    private onDraggingRow(actualX: any, actualY: any, yCoord: any, displacement?: any) {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            let draggingRow = htmlUtilities.getElementsByClassName('draggable');
            let draggingRowIndex = draggingRow.length > 0 ? draggingRow[0].getAttribute('id').split('_')[1] : -1;
            let gridTop = htmlUtilities.getElementsByClassName('grid-wrapper')[0].getBoundingClientRect().top;
            let gridBottom = Math.min(this.refs.frozenTableHolder.lastElementChild.getBoundingClientRect().bottom,
                htmlUtilities.getElementsByClassName('grid-wrapper')[0].getBoundingClientRect().bottom);

            let draggableRowTopPos = (gridTop + ROW_HEIGHT);
            let draggableRowBottomPos = (gridBottom - ROW_HEIGHT);

            // Logic to calculate scroll top when number of rows exceeded the grid size.
            if (displacement && Math.abs(displacement) > 2 && (draggableRowTopPos > yCoord || draggableRowBottomPos < yCoord)) {
                this.refs.tableScrollHolder.scrollTop = this.refs.tableScrollHolder.scrollTop + displacement;
            }

            // Getting the element at the current cursor position
            var element: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
            var row = htmlUtilities.findAncestor(element, 'row');
            if (row) {

                // Logic to calculate scroll top when number of rows exceeded the grid size.
                // add/minus displacement based on grid top/bottom.
                if (displacement && Math.abs(displacement) > 2 &&
                    (draggableRowTopPos > yCoord || draggableRowBottomPos < yCoord)) {
                    if (draggableRowTopPos > yCoord) {
                        displacement = -ROW_HEIGHT;
                    } else if (draggableRowBottomPos < yCoord) {
                        displacement = ROW_HEIGHT;
                    }
                    this.refs.tableScrollHolder.scrollTop = this.refs.frozenTableHolder.scrollTop + displacement;
                }

                // if any draggable row available, set its row style.
                if (draggingRowIndex !== -1) {
                    this.frozenBodyRows.toArray()[draggingRowIndex].setRowStyle('row draggable');
                    this.gridRows.toArray()[draggingRowIndex].setRowStyle('row draggable');
                }

                // Update the position of draagable row element on pan move.
                let offsetTop = yCoord - gridTop - (ROW_HEIGHT / 2);
                standardisationActionCreator.setMousePosition(offsetTop);

                var dropIndex = row ? row.rowIndex : -1;
                var className = '';

                // Avoid dragging beyond the grid
                if (yCoord <= gridBottom) {

                    let droppingRow = this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('droping') > -1);

                    // Reset the classifcation grid before applying the row styles.
                    if (droppingRow.count() > 0) {
                        let rowStyle: string = row.classList.contains('placeholder-row') ? 'row placeholder-row' :
                            (row.classList.contains('warning-alert') ? 'row warning-alert' : 'row');
                        this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('droping') > -1).first().setRowStyle(rowStyle);
                        this.gridRows.filter(x => x.getRowStyle().indexOf('droping') > -1).first().setRowStyle(rowStyle);
                    }

                    // exclude classification header rows from droping.pa
                    if (row && !row.classList.contains('classify-items-row') && dropIndex !== -1) {

                        let currentRowStyle: string;

                        // add class 'droping' to the dropping row(frozen and un frozen).
                        if (this.frozenBodyRows.toArray()[dropIndex] && this.gridRows.toArray()[dropIndex]) {
                            currentRowStyle = this.frozenBodyRows.toArray()[dropIndex].getRowStyle();
                            let dropingRowStyle =
                                currentRowStyle.indexOf('droping') > -1 ? currentRowStyle : (currentRowStyle + ' droping');
                            this.frozenBodyRows.toArray()[dropIndex].setRowStyle(dropingRowStyle);
                            this.gridRows.toArray()[dropIndex].setRowStyle(dropingRowStyle);
                        }

                        // find the position where we have to drop the response.
                        //  either before or after.
                        var dropingRowElement: Element = htmlUtilities.getElementFromPosition(actualX, actualY);
                        var dropedRow = htmlUtilities.findAncestor(dropingRowElement, 'row');

                        if (dropedRow) {
                            var dropPoint = yCoord - dropedRow.getBoundingClientRect().top;
                            className = dropPoint > (DRAGGING_ROW_HEIGHT / 2) ? ' after' : ' before';
                            droppingRow = this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('droping') > -1);
                            if (droppingRow.count() > 0) {
                                currentRowStyle = droppingRow.first().getRowStyle();
                                let dropPosStyle: string =
                                    currentRowStyle.indexOf(className) > -1 ? currentRowStyle : (currentRowStyle + className);
                                this.frozenBodyRows.filter(
                                    x => x.getRowStyle().indexOf('droping') > -1).first().setRowStyle(dropPosStyle);
                                this.gridRows.filter(
                                    x => x.getRowStyle().indexOf('droping') > -1).first().setRowStyle(dropPosStyle);
                            }
                        }
                    } else {
                        this.isGridUpdateRequired = true;
                    }
                    this.setState({ renderedOn: Date.now() });
                } else {
                    // reset the grid.
                    this.resetDraggableRow(true);
                }
            } else {
                // reset the grid.
                this.resetDraggableRow(false);
            }
        }
    }

    /**
     * set the margins and css styles for diff divs and tables in worklist
     */
    private setMarginsAndStyle = () => {

        // we need to recalculate the column widths in window resize
        this.setColumnWidths();

        let tableScrollHolder = this.refs.tableScrollHolder;

        if (this.refs.frozenTableHolder) {
            this.frozenHeadStyle = {};
        }

        if (tableScrollHolder) {
            let hScrollbarWidth = tableScrollHolder.offsetWidth - tableScrollHolder.clientWidth;
            let vScrollbarWidth = tableScrollHolder.offsetHeight - tableScrollHolder.clientHeight;

            this.cssRowHeaderTableStyle = { marginRight: -hScrollbarWidth };
            this.cssRowHeaderHeaderTableStyle = { marginRight: hScrollbarWidth };
            this.cssContentWrapTableStyle = { paddingBottom: vScrollbarWidth, paddingRight: hScrollbarWidth };
            this.cssBodyWrapTableStyle = { right: -hScrollbarWidth, bottom: -vScrollbarWidth };

            this.setScrollablevariable();
            timerHelper.handleReactUpdatesOnWindowResize(() => {
                this.setState({
                    renderedOn: Date.now()
                });
            });
        }
    };


    /**
     * This will setup events
     */
    private setUpEvents() {
        let element: Element = ReactDom.findDOMNode(this.refs.tableContentHolder);

        if (element && !this.eventHandler.isInitialized) {
            let touchActionValue: string = deviceHelper.isTouchDevice() ? 'auto' : 'none';
            let threshold = deviceHelper.isTouchDevice() ? constants.PAN_THRESHOLD : 0;
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.SWIPE, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: threshold});
            this.eventHandler.on(eventTypes.SWIPE, this.onSwipeHandler);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_VERTICAL, threshold: threshold });
            this.eventHandler.on(eventTypes.PAN, this.onPanMove);
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart);
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            if (deviceHelper.isTouchDevice()) {
                this.eventHandler.get(eventTypes.PRESS, { time: PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
                this.eventHandler.on(eventTypes.PRESS_UP, this.onPressUp);
            }
        }
    }

    /* pressup event for annotation overlay */
    protected onPressUp = (event: EventCustom) => {
        if (this.isClassificationWorklist) {
            this.resetDraggableRow(false);
            this.allowDrag = false;
        }

        event.preventDefault();
    }

    /**
     * event handler for touch start
     */
    private onGridRowSelected = (rowId: number) => {
        if (this.isClassificationWorklist) {
            this.onSelectGridRow(rowId);
        }
    }

    /**
     * Method to drag grid row on touch devices.
     * @param event
     */
    private onTouchHold = (event: EventCustom) => {
        event.srcEvent.stopPropagation();
        event.srcEvent.preventDefault();
        let actualX = event.changedPointers[0].clientX;
        let actualY = event.changedPointers[0].clientY;
        let yCoord = event.center.y;
        this.allowDrag = true;
        if (this.isClassificationWorklist && standardisationSetupStore.instance.
            stdSetupPermissionCCData.role.permissions.classify && this.selectedDraggableRow) {
            this.isDraggingEnabled = true;
            this.onDraggingRow(actualX, actualY, yCoord);
            this.setState({ renderedOn: Date.now });
        }
    }

    /**
     * This will call on pan start in stamp panel
     * @param event: Custom event type
     */
    private onPanStart = (event: EventCustom) => {
        // allow dragging only if classify permission available.
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
            this.isClassificationWorklist &&
            standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.classify &&
            !deviceHelper.isTouchDevice() && this.selectedDraggableRow) {
            this.isDraggingEnabled = true;
            this.allowDrag = true;
            event.preventDefault();
            this.setState({ renderedOn: Date.now });
        }
    }

    /**
     * This method will call on panend event
     */
    private onPanEnd = (event: any) => {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
            this.isClassificationWorklist && standardisationSetupStore.instance.
                stdSetupPermissionCCData.role.permissions.classify) {
            let dropingRow = this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('droping') > -1);
            let draggableRow = this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('draggable') > -1);
            if (dropingRow.count() > 0 && draggableRow.count() > 0) {
                let draggableRowId = draggableRow.first().getRowId();

                let isPlaceHolderRow: boolean = dropingRow.first().getRowStyle().indexOf('placeholder-row') > -1;
                let droppingRowId = isPlaceHolderRow ?
                    this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('droping') > -1).first().getRowId() :
                    dropingRow.first().getRowId();
                let isDroppedAfter: boolean = dropingRow.first().getRowStyle().indexOf('after') > -1 ? true : false;

                // get the response details of dragged and dropped response.
                this.draggedOrDropedResponseDetails(draggableRowId, false, isPlaceHolderRow);
                this.draggedOrDropedResponseDetails(droppingRowId, true, isPlaceHolderRow, isDroppedAfter);

                // Re order logic. move response within a classification type if previousMarkingModeId and current markink mode id s same
                // else reclassify Logic. move from one classification type to another.
                if (this.previousMarkingModeId === this.currentMarkingModeId) {
                    standardisationActionCreator.reorderResponse(draggableRowId.toString(),
                        this.previousMarkingModeId, this.currentMarkingModeId,
                        this.candidateScriptId, this.esCandidateScriptMarkGroupId,
                        this.newRigOrder, standardisationSetupStore.instance.markSchemeGroupId, this.esMarkGroupRowVersion);
                } else if (this.previousMarkingModeId !== this.currentMarkingModeId) {
                    standardisationActionCreator.reclassifyPopupOpen(draggableRowId.toString(), this.totalMark,
                        this.previousMarkingModeId, this.currentMarkingModeId,
                        this.candidateScriptId, this.esCandidateScriptMarkGroupId,
                        this.newRigOrder, standardisationSetupStore.instance.markSchemeGroupId,
                        this.oldRigOrder, this.esMarkGroupRowVersion);
                }
            }

            // If any rows being set as draggable, reset them.
            if (draggableRow.count() > 0) {
                this.frozenBodyRows.filter(x => x.getRowStyle().indexOf('draggable') > -1).first().setRowStyle('row');
                this.gridRows.filter(x => x.getRowStyle().indexOf('draggable') > -1).first().setRowStyle('row');
            }
        }

        // Reset grid after dragging.
        this.resetClassificationGrid();
    }

    /**
     * get the response details for Dragged response.
     * @param rowIndex
     * @param isNewRowPosition
     * @param isPlaceHolderRow
     * @param isDroppedAfter
     */
    private draggedOrDropedResponseDetails(rowId: number, isNewRowPosition: boolean,
        isPlaceHolderRow: boolean, isDroppedAfter: boolean = false) {
        let responseDetails: StandardisationResponseDetails =
            standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses.filter(x =>
                x.displayId === rowId.toString()).first();

        // If row not moved to new position.
        if (!isNewRowPosition) {
            this.previousMarkingModeId = responseDetails.markingModeId;
            this.oldRigOrder = responseDetails.rigOrder;
            this.totalMark = responseDetails.totalMarkValue;
            this.candidateScriptId = responseDetails.candidateScriptId;
            this.esCandidateScriptMarkGroupId = responseDetails.esCandidateScriptMarkSchemeGroupId;
            this.esMarkGroupRowVersion = responseDetails.esMarkGroupRowVersion;
        } else {
            this.currentMarkingModeId = isPlaceHolderRow ?
                rowId : responseDetails.markingModeId;
			// If marking mode is seeding set rig order as null. In case of reorder set the new rig order accordingly.
			if (this.currentMarkingModeId === enums.MarkingMode.Seeding) {
				this.newRigOrder = null;
			}else if (this.currentMarkingModeId === this.previousMarkingModeId) {
                let dropingRigOrder = responseDetails.rigOrder;
                this.newRigOrder = this.oldRigOrder < dropingRigOrder ?
                    (isDroppedAfter ? responseDetails.rigOrder : (responseDetails.rigOrder - 1)) :
                    (isDroppedAfter ? (responseDetails.rigOrder + 1) : responseDetails.rigOrder);
            } else {
                this.newRigOrder = isPlaceHolderRow ? 1 : (isDroppedAfter ? (responseDetails.rigOrder + 1) : responseDetails.rigOrder);
            }
        }
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
     * margins and styles should be set after first render.
     */
    public componentDidMount() {
        this.setMarginsAndStyle();
        window.addEventListener('resize', this.setMarginsAndStyle);

        // Logic to add padding for grid when scroll appears to avoid column misalignment with frozen column.        
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT, this.setMarginsAndStyle);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.setReclassifyPopupOpenFlag);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE,
            this.setTableWrapperMarginsAndStyle);
        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.TAG_UPDATED_EVENT, this.refreshGrid.bind(this, true));
        this.setUpEvents();
        this.refs.tableContentHolder.addEventListener('touchstart', this.onTouchStart);
        this.refs.tableContentHolder.addEventListener('touchmove', this.onTouchMove);
        this.refs.tableContentHolder.addEventListener('touchend', this.onTouchEnd);
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        window.removeEventListener('resize', this.setMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT, this.setMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this.setReclassifyPopupOpenFlag);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT, this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
            this.resetDraggableRow.bind(this, true));
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE,
            this.setTableWrapperMarginsAndStyle);
        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.TAG_UPDATED_EVENT, this.refreshGrid.bind(this, true));

        // unregister events
        this.unRegisterEvents();
        this.refs.tableContentHolder.removeEventListener('touchstart', this.onTouchStart);
        this.refs.tableContentHolder.removeEventListener('touchmove', this.onTouchMove);
        this.refs.tableContentHolder.removeEventListener('touchend', this.onTouchEnd);
    }

    /**
     * Comparing the props to check the rerender
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.selectedLanguage !== nextProps.selectedLanguage) {
            worklistActionCreator.setScrollWorklistColumns();
        }
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
     * returns the grid class (for shadow)
     */
    private getGridClass = (): string => {
        let gridClass = classNames('work-list-grid',
            { ' row-draggable': this.isClassificationWorklist },
            { 'scrolled-left': this.isScrolledLeft === true },
            { 'scrolled-right': this.isScrolledRight === true },
            { 'row-dragging': this.isDraggingEnabled },
            { 'allow-dragging': this.isDraggingEnabled });
        return gridClass;
    };

    /**
     * Returns whether classification worklist or not
     */
    private get isClassificationWorklist(): boolean {
        return this.props.standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ? true : false;
    }

    private onSortClick = (comparerName: string, sortDirection: enums.SortDirection) => {
        this.props.onSortClick(comparerName, sortDirection);
    };

    private setColumnWidths = () => {
        tableHelper.setColumnWidthsForTable(this.props.getGridControlId(), 'frozenHeader_', 'rowHeader_');
        tableHelper.setColumnWidthsForTable(this.props.getGridControlId(), 'columnHeader_', '');
    }

    /**
     * Get Row selected on mouse down.
     * @param rowId
     */
    private onMouseDown(rowId: number) {
        if (!deviceHelper.isTouchDevice() && this.isClassificationWorklist) {
            this.onSelectGridRow(rowId);
        }
    }

    /**
     * Method to make a row selected for dragging
     * @param rows
     * @param rowId
     */
    private onSelectGridRow(rowId: number) {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
            let selectedTableRow = this.frozenBodyRows.filter(x => x.getRowId() === rowId &&
                x.getRowStyle().indexOf('classify-items-row') === -1 &&
                x.getRowStyle().indexOf('placeholder-row') === -1);

            // If selected row is not a placeholder and not a banner row(Practice/Seed/Approval/STM)
            if (selectedTableRow.count() > 0) {
                this.selectedDraggableRow = this.getSelectedDraggableRow(rowId);
            }
        }
    }

    /**
     * Method to set the scroll top.
     * @param event
     */
    private onTouchStart = (event: any) => {

        // logic for calculating the displacement while dragging to next row.
        // Need to set the scroll top based on that.
        this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
    }

    /**
     * Get Row selected on mouse up.
     * @param rowId
     */
    private onMouseUp(rowId: number) {
        if (!deviceHelper.isTouchDevice()) {
            // reset the grid and remove the classes added related to Dragging and dropping
            this.resetClassificationGrid();
        }
    }

    /**
     * Method to reset the grid by removing the classes added as part of dragging and dropping.
     */
    private resetClassificationGrid = () => {
        if (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete &&
            !this.isReclassifyPopupOpened && this.isClassificationWorklist) {

            // reset the grid and remove the classes added related to Dragging and dropping
            this.resetDraggableRow(false);
        }
    }

    /**
     * Get selected draggable row.
     * @param rowId
     */
    private getSelectedDraggableRow(rowId: number): Immutable.List<Row> {
        let selectedDraggableGridRow: gridRow = new gridRow();
        let selectedDraggableGridRowCollection = Array<gridRow>();
        let draggableFrozenRow = this.classifiedFrozenBodyRows.filter(x => x.getRowId() === rowId).first();
        let draggableRow = this.classifiedGridRows.filter(x => x.getRowId() === rowId).first();
        let draggableRowCells = draggableFrozenRow.getCells();
        draggableRowCells = draggableRowCells.concat(draggableRow.getCells());

        // Craete grid row.
        selectedDraggableGridRow.setRowStyle('row');
        selectedDraggableGridRow.setRowId(parseFloat(rowId.toString()));
        selectedDraggableGridRow.setCells(draggableRowCells);
        selectedDraggableGridRow.setAdditionalElement(undefined);
        selectedDraggableGridRowCollection.push(selectedDraggableGridRow);

        return immutable.List<Row>(selectedDraggableGridRowCollection);
    }

    /**
     * Reset the grid class list once we done the reclassification.
     */
    private gridDragReset() {
        this.isDraggingEnabled = false;
        this.isReclassifyPopupOpened = false;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Reset Draggable row on canceling the reclassify action
     */
    private resetDraggableRow = (isGridUpdateRequired: boolean) => {
        this.selectedDraggableRow = undefined;
        this.refreshGrid(isGridUpdateRequired);
        this.gridDragReset();
    }

    /**
     * Refresh grid when reclassify/declassify happens.
     */
    private refreshGrid = (isGridUpdateRequired: boolean) => {
        this.isGridUpdateRequired = isGridUpdateRequired;

        if (isGridUpdateRequired) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /**
     * method to notify that Reclassify popup is open.
     */
    private setReclassifyPopupOpenFlag() {
        this.isReclassifyPopupOpened = true;
    }

    /**
     * method to set MarginsAndStyle
     */
    private setTableWrapperMarginsAndStyle() {
        this.setMarginsAndStyle();
    }

    /**
     * Method to get the details of classification responses.
     * Part of refactoring
     */
    private getClassificationGridRows() {
        this.standardisationSetupHelper =
            stdSetupFactory.getStandardisationSetUpWorklistHelper(enums.StandardisationSetup.ClassifiedResponse);
        this.classifiedFrozenBodyRows = this.standardisationSetupHelper.generateStandardisationFrozenRowBody(
            '', undefined, this.props.standardisationSetupType, this.props.gridType);
        this.frozenBodyRows = this.classifiedFrozenBodyRows;
        this.classifiedGridRows = this.standardisationSetupHelper.generateStandardisationRowDefinion(
            '', undefined, this.props.standardisationSetupType, this.props.gridType);
        this.gridRows = this.classifiedGridRows;
    }
}
export = StandardisationSetupTableWrapper;
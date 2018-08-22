import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');
import enums = require('../enums');
import gridCell = require('../grid/gridcell');

/* tslint:disable:no-reserved-keywords */
interface TableProps extends PropsBase {
    cellSpacing?: number;
    cellPadding?: number;
    border?: number;
    width?: number;
    class?: string;
    tableHeader?: JSX.Element;
    tableBody?: JSX.Element;
    renderedOn: number;
}

interface TableRowProps extends PropsBase {
    tableCells?: Array<JSX.Element>;
    class?: string;
    title?: string;
    onClick?: Function;
    additionalElement?: JSX.Element;
    renderedOn: number;
    onMouseDown?: Function;
    onMouseUp?: Function;
    rowId?: number;
    onTouchStart?: Function;
}

interface TableCellProps extends PropsBase {
    cellElement?: JSX.Element;
    class?: string;
    onClick?: Function;
    additionalElement?: JSX.Element;
    comparerName?: string;
    sortDirection?: enums.SortDirection;
    isSortable?: boolean;
    renderedOn: number;
}
/* tslint:disable:no-reserved-keywords */

/* tslint:disable:variable-name */
const TableControl = (props: TableProps) => {

    let header: JSX.Element = (props.tableHeader) ? <thead>{props.tableHeader}</thead> : <thead></thead>;
    let body: JSX.Element = (props.tableBody) ? <tbody id='table_body' >{props.tableBody}</tbody> : <tbody></tbody>;
    let tableStyle: React.CSSProperties = {};
    tableStyle = {
        width: '100%',
    };

    return (
        <table style={tableStyle} cellPadding='0' cellSpacing='0'
            id={props.id} key={'key_' + props.id} className={props.class}>
            {header}
            {body}
        </table>
    );
};

/* tslint:disable:variable-name */
const TableRow = (props: TableRowProps) => {
    const onClickHandler = (event) => {
        if (props.onClick) {
            props.onClick(event);
        }
    };

    const onMouseClickHandler = (event, rowId: number) => {
        if (props.onMouseDown) {
            props.onMouseDown(rowId);
        }
    };

    const onMouseUpClickHandler = (event, rowId: number) => {
        if (props.onMouseUp) {
            props.onMouseUp(rowId);
        }
    };

    const onTouchStartHandler = (event, rowId: number) => {
        if (props.onTouchStart) {
            props.onTouchStart(rowId);
        }
    };

    let additionalElement: JSX.Element = (props.additionalElement) ? props.additionalElement : null;
    return (
        <tr id={props.id} className={props.class} onClick={onClickHandler}
            onMouseDown={onMouseClickHandler.bind(this, props.rowId)}
            onMouseUp={onMouseUpClickHandler.bind(this, props.rowId)}
            onTouchStart={onTouchStartHandler.bind(this, props.rowId)}>
            {props.tableCells}
            {additionalElement}
        </tr>
    );
};

/* tslint:disable:variable-name */
const TableBodyCell = (props: TableCellProps) => {

    let additionalElement: JSX.Element = (props.additionalElement) ? props.additionalElement : null;

    return (
        <td className={props.class} id={props.id} >
            <div className='cell-data'>
                {props.cellElement}
                {props.additionalElement}
            </div>
        </td>
    );
};

/* tslint:disable:variable-name */
const TableHeaderCell = (props: TableCellProps) => {

    const onClickHandler = (event) => {
        if (props.onClick && props.comparerName && props.isSortable) {
            props.onClick(props.comparerName, props.sortDirection);
        }
    };

    let additionalElement: JSX.Element = (props.additionalElement) ? props.additionalElement : null;

    return (
        <th className={props.class} id={props.id} >
            <span className='visually-hidden'> visually hidden text </span>
            <div className={classNames('header-data', { 'hand': props.onClick && props.comparerName && props.isSortable })}
                onClick={onClickHandler}>
                {props.cellElement}
                {additionalElement}
            </div>
        </th>
    );
};



/**
 * Properties of GridControl component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    tableHeaderRows?: Immutable.List<Row>;
    tableBodyRows?: Immutable.List<Row>;
    gridStyle: string;
    onClickCallBack?: Function;
    worklistType?: enums.WorklistType;
    wrapperStyle?: string;
    onSortClick?: Function;
    renderedOn: number;
    onRowClick?: Function;
    avoidLastColumn?: boolean;
    standardisationSetUpType?: enums.StandardisationSetup;
    selectedRowIdToDrag?: number;
    onMouseDown?: Function;
    onMouseUp?: Function;
    isDraggableRow?: boolean;
    onTouchStart?: Function;
}
/**
 * Helper fucntions for the table statless components
 */
class TableHelper {


    /**
     * This method will call callback function
     */
    private static handleClick = function (props: Props, rowId?: number): void {
        if (props.onRowClick) {
            props.onRowClick(rowId);
        }
    };

    /**
     * This method will call callback function for mouse down click of row.
     */
    private static mouseDownClick = function (props: Props, rowId: number): void {
        if (props.onMouseDown) {
            props.onMouseDown(rowId);
        }
    };

    /**
     * This method will call callback function for mouse up click of row.
     */
    private static mouseUpClick(props: Props, rowId: number) {
        if (props.onMouseUp) {
            props.onMouseUp(rowId);
        }
    }

    /**
     * This method will call callback function for touch start of row.
     */
    private static touchStart(props: Props, rowId: number) {
        if (props.onTouchStart) {
            props.onTouchStart(rowId);
        }
    }

    /**
     * returns the table row (tr) collection based on the given list of row data
     * @param rows - collection of rows
     * @param isHeader - whethere the row is a header row or not
     */
    public static getRows(rows: Immutable.List<Row>, isHeader: boolean, props: Props): any {

        let tableId: string = props.id;
        let that = this;
        let rowSeq = rows.keySeq();
        let seqIndex = 0;

        //Creating table rows - tr
        let tableElement = rows.map(function (tableRow: Row) {
            let rowSeqKey = rowSeq.get(seqIndex++);
            let additionalRowElement = tableRow.getAdditionalElement();
            let cellIndex = 0;

            //Creating td/th elements
            let rowElement = tableRow.getCells().map(function (gridCell: gridCell) {

                let gridCellElement = gridCell.columnElement;
                let cellAdditionalElement = gridCell.getAdditionalElement();
                cellIndex++;
                let style = gridCell.getCellStyle();
                style = (style) ? style : '';
                if (gridCell.isHidden !== true) {
                    if (isHeader === true) {
                        return (
                            <TableHeaderCell
                                cellElement={gridCellElement}
                                class={style}
                                additionalElement={cellAdditionalElement}
                                key={tableId + '_th_' + rowSeqKey + '_' + cellIndex}
                                id={'th_' + rowSeqKey + '_' + cellIndex}
                                onClick={props.onSortClick}
                                comparerName={gridCell.comparerName}
                                sortDirection={gridCell.sortDirection}
                                isSortable={gridCell.isSortable}
                                renderedOn={props.renderedOn} />
                        );
                    } else {
                        return (
                            <TableBodyCell
                                cellElement={gridCellElement}
                                class={style}
                                additionalElement={cellAdditionalElement}
                                key={tableId + '_td_' + rowSeqKey + '_' + cellIndex}
                                id={'td_' + rowSeqKey + '_' + cellIndex}
                                renderedOn={props.renderedOn} />
                        );
                    }
                }
            });

            if (!props.avoidLastColumn) {
                if (isHeader) {
                    rowElement.push(<th className='last-cell-header'
                        key={tableId + '_th_' + rowSeqKey + '_empty'}
                        id={'th_' + rowSeqKey + '_empty'}>
                        <span className='visually-hidden'> visually hidden text </span>
                        <div className='header-data'></div></th>);
                } else {
                    rowElement.push(<td className='last-cell'
                        key={tableId + '_td_' + rowSeqKey + '_empty'}
                        id={'td_' + rowSeqKey + '_empty'}>
                        <div className='cell-data'></div></td>);
                }
            }
            return (
                <TableRow class={classNames({ [tableRow.getRowStyle()]: true },
                    {
                        'draggable': !props.isDraggableRow ?
                            (props.selectedRowIdToDrag ? tableRow.getRowId() === props.selectedRowIdToDrag : false) : false
                    })}
                    title={tableRow.getRowTitle()}
                    tableCells={rowElement}
                    key={tableId + '_tableRow_Key_' + rowSeqKey}
                    id={'tableRow_' + rowSeqKey}
                    additionalElement={additionalRowElement}
                    onClick={that.handleClick.bind(that, props, tableRow.getRowId())}
                    renderedOn={props.renderedOn}
                    onMouseDown={that.mouseDownClick.bind(that, props, tableRow.getRowId())}
                    onMouseUp={that.mouseUpClick.bind(that, props, tableRow.getRowId())}
                    onTouchStart={that.touchStart.bind(that, props, tableRow.getRowId())}
                />
            );
        });

        return tableElement;
    }
}


/**
 * Represents the table Component
 */
const TableWrapper = (props: Props) => {

    let headerRows: JSX.Element;
    let bodyRows: JSX.Element;

    if (props.tableHeaderRows) {
        headerRows = TableHelper.getRows(props.tableHeaderRows, true, props);
    }

    if (props.tableBodyRows) {
        bodyRows = TableHelper.getRows(props.tableBodyRows, false, props);
    }

    if (headerRows || bodyRows) {
        return (
            <TableControl tableHeader={headerRows}
                tableBody={bodyRows}
                class={props.gridStyle}
                id={props.id} key={'key_' + props.id}
                renderedOn={props.renderedOn} />
        );
    } else {
        return null;
    }
};

export = TableWrapper;
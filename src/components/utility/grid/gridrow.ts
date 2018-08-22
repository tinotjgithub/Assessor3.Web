/// <reference path='typings/row.ts' />
import gridCell = require('./gridcell');

/**
 * Row Definition for Grid Compoent
 */
class GridRow implements Row {

    private cells: Array<gridCell>;
    private rowStyle: string;
    private rowId: number;
    private rowTitle: string;
    private additionalElement: JSX.Element;

    /**
     * returns the rowId
     */
    public getRowId() {
        return this.rowId;
    }

    /**
     * returns the cells
     */
    public getCells() {
        return this.cells;
    }

    /**
     * set the cells
     */
    public setCells(_cells: Array<gridCell>) {
        this.cells = _cells;
    }

    /**
     * returns the rowStyle
     */
    public getRowStyle() {
        return this.rowStyle;
    }

    /**
     * set the rowStyle
     */
    public setRowStyle(_rowStyle: string) {
        this.rowStyle = _rowStyle;
    }

    /**
     * set the rowId
     * @param rowId
     */
    public setRowId(rowId: number) {
        this.rowId = rowId;
    }

    /**
     * returns the rowTitle
     */
    public getRowTitle() {
        return this.rowTitle;
    }

    /**
     * returns the rowTitle
     */
    public setRowTitle(title: string) {
        this.rowTitle = title;
    }

    /**
     * returns the additional row Element
     */
    public getAdditionalElement(): JSX.Element {
        return this.additionalElement;
    }

    /**
     * returns the additional row Element
     */
    public setAdditionalElement(_additionalElement: JSX.Element) {
        this.additionalElement = _additionalElement;
    }
}

export = GridRow;
/// <reference path='typings/cell.ts' />
import enums = require('../enums');

/**
 * Cell for GridControl Compoent
 */
class GridCell implements Cell {

    private cellStyle: string;
    private additionalElement: JSX.Element;

    /**
     *  Grid cell's Element
     */
    public columnElement: JSX.Element;

    /**
     * returns the cell style
     */
    public getCellStyle() {
        return this.cellStyle;
    }

    /** 
     * set the cell style
     * @param {string} _cellStyle
     */
    public setCellStyle(_cellStyle: string) {
        this.cellStyle = _cellStyle;
    }

    /**
     * returns the additional cell Element
     */
    public getAdditionalElement(): JSX.Element {
        return this.additionalElement;
    }

    /**
     * sets the additional cell Element
     * @param _additionalElement
     */
    public setAdditionalElement(_additionalElement: JSX.Element) {
        this.additionalElement = _additionalElement;
    }

    /** returns whether the cell is hidden */
    public isHidden: boolean;

    public comparerName: string = undefined;

    public sortDirection: enums.SortDirection = undefined;

    public isSortable: boolean = true;
}

export = GridCell;
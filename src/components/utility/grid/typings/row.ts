/// <reference path='cell.ts' />
/**
 * Row Definition for Grid Compoent
 */
interface Row {

   /**
    * returns the rowStyle
    */
    getRowId(): number;

    /**
     * returns the cells
     */
    getCells(): Array<Cell>;

    /**
     * set the cells
     */
    setCells(cells: Array<Cell>);

    /**
     * returns the rowStyle
     */
    getRowStyle(): string;

    /**
     * set the rowStyle
     */
    setRowStyle(rowStyle: string);

    /**
     * set the rowStyle
     */
    setRowId(rowId: number);

    /**
     * set the rowTitle
     */
    setRowTitle(rowTitle: string);

    /**
     * get the rowTitle
     */
    getRowTitle();

   /**
    * returns the additional row Element
    */
    getAdditionalElement(): JSX.Element;

    /**
     * returns the additional row Element
     */
    setAdditionalElement(_additionalElement: JSX.Element);

}
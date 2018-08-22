/**
 * Row Definition for Table Compoent
 */
interface TableRow {

   /**
    * returns the rowStyle
    */
    getRowId(): number;

    /**
     * returns the cells
     */
    getCells(): Array<TableCell>;

    /**
     * set the cells
     */
    setCells(cells: Array<TableCell>);

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
}
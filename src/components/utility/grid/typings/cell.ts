/**
 * Cell for GridControl Compoent
 */
interface Cell {

    /**
     *  Grid cell's Element
     */
    columnElement: JSX.Element;

    /**
     * returns the cell Style
     */
    getCellStyle(): string;

    /**
     * set the cell style
     */
    setCellStyle(rowStyle: string);

   /**
    * returns the additional cell Element
    */
    getAdditionalElement(): JSX.Element;

    /**
     * sets the additional cell Element
     */
    setAdditionalElement(_additionalElement: JSX.Element);

   /**
    * Defines whether the cell is hidden or not
    */
    isHidden?: boolean;

    /**
     * Defines the comparer name
     */
    comparerName?: string;

    /**
     * Defines the sort direction
     */
    sortDirection?: any;
}
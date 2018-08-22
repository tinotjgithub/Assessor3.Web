import enums = require('../../components/utility/enums');
import gridRow = require('../../components/utility/grid/gridrow');
import gridCell = require('../../components/utility/grid/gridcell');

/**
 * Interface for various TeamManagement tab helpers
 */
interface TeamManagementHelper {

    /**
     * Generate row definition for myTeam and Help other examiners tab
     * @param teamManagementTabData - collection of examiner data
     * @param teamManagementTab - MyTeam or HelpOtherExaminers
     */
    generateRowDefinion(teamManagementTabData: Immutable.List<GridData>,
        teamManagementTab: enums.TeamManagement): Immutable.List<gridRow>;

    /**
     * Generates the header Table headers for myTeam and Help other examiners tab
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     */
    generateTableHeader(teamManagementTab: enums.TeamManagement, comparerName: string,
        sortDirection: enums.SortDirection, tabData: any): Immutable.List<gridRow>;

    /**
     * Generate frozen row body is used for generating row collection for my team or help other examiners grid
     * @param examinerListData - type of the examiner data
     * @param teamManagementTab - type of team management tab
     * @returns grid row collection.
     */
     generateFrozenRowBody(examinerListData: any, teamManagementTab: enums.TeamManagement): Immutable.List<gridRow>;

    /**
     * Is used for generating row header collection for team management tabs
     * @param teamManagementTab
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     */
    generateFrozenRowHeader(teamManagementTab: enums.TeamManagement,
         comparerName: string, sortDirection: enums.SortDirection, isSortable?: boolean): Immutable.List<gridRow>;

    /**
     * creating react element for the  TotalMark component
     * @param responseData - response data
     * @param hasNumericMark - flag for hasNumericMark
     * @param maximumMark - maximum Mark for the response
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    getTotalMarkElement(responseData: ResponseBase,
        hasNumericMark: boolean,
        maximumMark: number,
        propsNames: any,
        seq: string): JSX.Element;

    /**
     * creating react element for the  getAllocatedDateElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    getAllocatedDateElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showAllocatedDateElement: boolean,
        showMarkingProgress: boolean,
        showGracePeriodTimeElement: boolean): JSX.Element;

    /**
     * creating react element for the  getAllocatedDateElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    getGracePeriodElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        isTileView: boolean): JSX.Element;

    /**
     * creating react element for the  getAllocatedDateElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    getSLAOIndicatorElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean): JSX.Element;

    /**
     * creating react element for the  getAllocatedDateElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    getAllPageAnnotatedIndicatorElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean): JSX.Element;

    /**
     * creating react element for the  getAllocatedDateElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    getAllocatedDate(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showAllocatedDateElement: boolean): JSX.Element;

    /**
     * Creating react component for the LinkedMessage component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    getLinkedMessageElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element;

    /**
     * Creating react component for the AccuracyIndicator component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    getAccuracyIndicatorElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element;

    /**
     * Creating react component for the MarksDifferenceColumn component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    getMarksDifferenceColumnElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element;

    /**
     * Creating react component for the MarksDifferenceColumn component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    getMarksDifferenceElement(responseData: ResponseBase, propsNames: any, seq: string,
        marksDifferenceType: enums.MarksDifferenceType): JSX.Element;

    /**
     * Creating react component for Linked Exception component.
     * @param {Response} responseData response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    getLinkedExceptionElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element;

    /**
     * Set row style to amber if the response has blocking exceptions
     * or all pages are not annotated
     * Set row style based on Accuracy Indicator
     * @param responseStatus
     * @param accuracyType
     */
    setRowStyle(responseStatus: Immutable.List<enums.ResponseStatus>, accuracyType?: enums.AccuracyIndicatorType): string;

    /**
     * Set row title based on Accuracy Indicator
     * @param accuracyType
     */
    setRowTitle(accuracyType?: enums.AccuracyIndicatorType): string;

    /**
     * creating react element for the  MarkingProgress component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    getMarkingProgressElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseStatuses: Immutable.List<enums.ResponseStatus>,
        worklistType: enums.WorklistType,
        isTileView: boolean): JSX.Element;

    /**
     * creating react element for the  MarkingProgress component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @param responseMode - key value for the component
     * @param isTileView - whether tile view
     * @returns JSX.Element.
     */
    getLastUpdatedElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseMode?: enums.ResponseMode,
        isTileView?: boolean): JSX.Element;

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    getResponseIdColumnElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseMode?: enums.ResponseMode,
        displayText?: string,
        isResponseIdClickable?: boolean,
        isSeedResponse?: boolean,
        isTileView?: boolean): JSX.Element;

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    getResponseIdElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        displayText?: string,
        isResponseIdClickable?: boolean,
        isTileView?: boolean): JSX.Element;

    /**
     * get date value fpr response id column according to response mode
     * @param responseMode
     * @param response
     * @param propsNames
     */
    getDateValueForResponseIdElement(responseMode: enums.ResponseMode, response: ResponseBase, propsNames: any): Date;

    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    getWrappedColumn(elements: Immutable.List<JSX.Element>, className: string, seq: string): gridCell;

    /**
     * creating grid columns collection
     * @param gridgridLeftColumn
     * @param gridMiddleColumn
     * @param key
     * @param gridRightColumn - to display AMD and TMD based on Accuracy Indicator
     * @returns grid cell collection.
     */
    getGridCells(
        gridgridLeftColumn: Array<JSX.Element>,
        gridMiddleColumn: Array<JSX.Element>,
        key: string,
        gridRightColumn?: Array<JSX.Element>): Array<gridCell>;

    /**
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    getGridRow(
        responseStatus: Immutable.List<enums.ResponseStatus>,
        displayId: string,
        gridCells: Array<gridCell>,
        accuracyType?: enums.AccuracyIndicatorType,
        additionalComponent?: JSX.Element): gridRow;

    /**
     * Group the elements based on the classNames.
     * @param {string} groupClassName
     * @param {string} seq
     * @returns the grouped JSX.Element.
     * @Summary groupClassName is the root element className and the column list may contain
     * the key same as groupClassName. Then that will not group the elements instead add it as
     * immediate child node.
     */
    groupColumnElements(groupClassName: string, seq: string): JSX.Element;

    /**
     * Show the AllPageAnnotationIndicator when the CC is on and marking is completed
     * blocking submission.
     * @param {ResponseBase} responseData
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    getAllPageAnnotationIndicatorElement
        (responseData: ResponseBase,
        propsNames: any,
        seq: string): JSX.Element;

    /**
     * Start with fresh group.
     */
    emptyGroupColumns(): void;

    /**
     * Mapping the each elements to a group.
     * This add the elements to a dictionary which has className as key
     * and list of elements that  grouped under the className.
     * @param {string} className
     * @param {JSX.Element} element
     */
    mapGroupColumns(className: string, element: JSX.Element): void;

    /**
     * Check if response is seed
     * @param seedType
     */
    isSeedResponse(seedType: enums.SeedType);

    /**
     * returns the table row collection for worklist table header.
     * @param worklistType
     * @param responseMode
     */
    getTableHeaderForListView(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow>;

    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    getFrozenRowBodyForListView(responseListData: WorklistBase, worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode): Immutable.List<gridRow>;

    /**
     * returns the table row elements for frozen table header
     * @param responseListData - list of responses
     * @returns grid row collection.
     */
    getFrozenRowHeaderForListView(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean): Immutable.List<gridRow>;

    /**
     * return the display text for response id
     * @param worklistType
     */
    getDisplayTextOfResponse(worklistType: enums.WorklistType): string;
}

export = TeamManagementHelper;
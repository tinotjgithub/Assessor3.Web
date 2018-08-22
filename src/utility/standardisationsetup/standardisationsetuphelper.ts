import enums = require('../../components/utility/enums');
import gridRow = require('../../components/utility/grid/gridrow');
import gridCell = require('../../components/utility/grid/gridcell');

/**
 * StandardisationSetupHelper class
 */
interface StandardisationSetupHelper {
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData
     * @param gridType
     */
    generateStandardisationRowDefinion(comparerName: string, sortDirection: enums.SortDirection,
        tabSelection: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow>;

    /**
     * Generate Reusable responses Row Definition
     *  @param standardisationCentreList
     */
    generateReusableResponsesRowDefinition(reusableResponsesList: Immutable.List<StandardisationResponseDetails>,
        comparerName?: string,
        sortDirection?: enums.SortDirection);

    /**
     * generateStandardisationFrozenRowBodyReusableGrid is used for generating row collection for STD WorkList Grid
     * @param standardisationSetupType
     * @param gridType
     */
    generateStandardisationFrozenRowBodyReusableGrid(reusableResponsesList: Immutable.List<StandardisationResponseDetails>,
        comparerName?: string,
        sortDirection?: enums.SortDirection):
        Immutable.List<gridRow>;

    /**
     * GenerateTableHeader is used for generating header collection.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param selectedTab
     * @param gridType
     * @param centreOrScript
     */
    generateTableHeader(standardisationSetupType: enums.StandardisationSetup, comparerName: string,
        sortDirection: enums.SortDirection, gridType?: enums.GridType,
        selectedTab?: enums.StandardisationSessionTab, centreOrScript?: string): Immutable.List<gridRow>;

    /**
     * generateFrozenRowBody is used for generating row collection for Standardisation Setup Grid
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    generateFrozenRowBody(standardisationSetupDetailsList: StandardisationSetupDetailsList,
        standardisationSetupType: enums.StandardisationSetup,
        gridType?: enums.GridType,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<gridRow>;

    /**
     * Is used for generating row header collection for WorkList table
     * @param comparerName
     * @param sortDirection
     * @param standardisationSetupType
     * @param selectedTab
     * @param isSortable
     */
    generateFrozenRowHeader(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup,
        selectedTab: enums.StandardisationSessionTab, isSortable?: boolean): Immutable.List<gridRow>;

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
     * returns the table row collection for table header.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param selectedTab
     * @param gridType
     * @param centreOrScript
     */
    getTableHeader(standardisationSetupType: enums.StandardisationSetup, comparerName: string,
        sortDirection: enums.SortDirection, selectedTab: enums.StandardisationSessionTab,
        gridType: enums.GridType, centreOrScript?: string): Immutable.List<gridRow>;

    /**
     * returns the table row collection of frozen table
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    getFrozenRowBodyForListView(standardisationSetupDetailsList: StandardisationSetupDetailsList,
        standardisationSetupType: enums.StandardisationSetup, gridType?: enums.GridType,
        comparerName?: string, sortDirection?: enums.SortDirection): Immutable.List<gridRow>;

    /**
     * returns the table row elements for frozen table header
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     * @param standardisationSetupType
     * @param selectedTab
     */
    getFrozenRowHeader(comparerName: string, sortDirection: enums.SortDirection,
        isSortable: boolean,
        standardisationSetupType: enums.StandardisationSetup, selectedTab: enums.StandardisationSessionTab): Immutable.List<gridRow>;

    /**
     * returns the blue banner element
     * @param selectedTab
     * @param targetCount
     */
    getBlueBannerForTargets(selectedTab: enums.StandardisationSetup, targetCount:
        number, isESTeamMember?: boolean, selectedSession?: enums.StandardisationSessionTab): JSX.Element;

	/**
	 * Generate Centre Row Definition
	 * @param standardisationCentreList
	 */
    generateCentreRowDefinition(standardisationCentreList: StandardisationCentreDetailsList);

	/**
	 * generateScriptRowDefinition is used for generating row collection for Select response Script Grid
	 * @param standardisationScriptList
	 */
    generateScriptRowDefinition(standardisationScriptList: StandardisationScriptDetailsList): Immutable.List<gridRow>;

    /**
     * generateStandardisationFrozenRowBody is used for generating row collection for STD WorkList Grid
     * @param standardisationSetupType
     * @param gridType
     */
    generateStandardisationFrozenRowBody(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow>;

    /**
     * Get the Configurable characteristic value.
     * @param ccName
     * @returns
     */
    getSessionTabVisibiltyinSelectResponse();

    /**
     * Getting restricted standardisation targets against markscheme group id
     */
    getRestrictedSSUTarget(markSchemeGroupId: number): Immutable.List<enums.MarkingMode>;

    /**
     * Getting required standardisation targets.
     */
    getStandardisationSetupRequiredTargets(): Immutable.List<enums.MarkingMode>;
}
export = StandardisationSetupHelper;
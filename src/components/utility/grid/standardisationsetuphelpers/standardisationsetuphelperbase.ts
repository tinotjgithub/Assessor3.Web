import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import Immutable = require('immutable');
import gridCell = require('../../../utility/grid/gridcell');
import localeStore = require('../../../../stores/locale/localestore');
import enums = require('../../enums');
import GenericComponentWrapper = require('../genericcomponentwrapper');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import ColumnHeader = require('../../../worklist/shared/columnheader');
import gridColumnNames = require('../gridcolumnnames');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
import localHelper = require('../../../../utility/locale/localehelper');
import htmUtilities = require('../../../../utility/generic/htmlutilities');
import constants = require('../../constants');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
import immutable = require('immutable');
import standardisationSetupHelper = require('../../../../utility/standardisationsetup/standardisationsetuphelper');
let standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
import blueBannerMessage = require('../../../standardisationsetup/shared/bluebanner');
import totalMark = require('../../../worklist/shared/totalmarkdetail');
import TagList = require('../../../response/responsescreen/taglist');
import stdResponseId = require('../../../standardisationsetup/shared/standardisationresponseid');
import LinkedMessageIndicator = require('../../../worklist/shared/linkedmessageindicator');
import LastUpdatedColumn = require('../../../worklist/shared/lastupdatedcolumn');
import scriptidgridelement = require('../../../standardisationsetup/shared/scriptidgridelement');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
import ecourseWorkHelper = require('../../ecoursework/ecourseworkhelper');
import RigOrder = require('../../../standardisationsetup/shared/rigorder');
import tagStore = require('../../../../stores/tags/tagstore');
import slaoAnnotationIndicator = require('../../../worklist/shared/slaoannotationindicator');
import MarkingProgress = require('../../../worklist/shared/markingprogress');
import marksColumn = require('../../../worklist/shared/markscolumn');
import allPageAnnotationIndicator = require('../../../worklist/shared/allpageannotationindicator');
import allFilesNotViewedIndicator = require('../../../worklist/shared/allfilesnotviewedindicator');
import eCourseworkHelper = require('../../ecoursework/ecourseworkhelper');
import submitHelper = require('../../submit/submithelper');
import DeclassifyButton = require('../../../standardisationsetup/declassifybutton');
import qigStore = require('../../../../stores/qigselector/qigstore');
import stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
import genericDate = require('../../../worklist/shared/genericdate');
import xmlHelper = require('../../../../utility/generic/xmlhelper');
import sortHelper = require('../../../../utility/sorting/sorthelper');
import standardisationTargetDetail = require('../../../../stores/standardisationsetup/typings/standardisationtargetdetail');
import sharedResponseIndicatorElement = require('../../../standardisationsetup/shared/sharedresponseindicator');
/**
 * class for WorkList Helper implementation
 */
class StandardisationSetupHelperBase implements standardisationSetupHelper {

    /* variable to holds the column details JSON*/
    public resolvedGridColumnsJson: any;

    /* Grid rows collection */
    public _stdSetUpWorkListCollection: Immutable.List<gridRow>;

    public _stdWorkListFrozenRowBodyCollection: Immutable.List<gridRow>;

    public _tableHeaderCollection: Immutable.List<gridRow>;

    // Elements to hold a dictionary with key as class name to group and collection
    // of elements
    private _groupColumns: { [id: string]: { values: Immutable.List<JSX.Element> } };

    private _dateLengthInPixel: number = 0;

    private _isNonNumeric: boolean = false;
    private rowTitle: string;

    /**
     * Get the Configurable characteristic value.
     * @param ccName
     * @returns
     */
    protected getCCValue(ccName: string, markSchemeGroupId: number): any {
        return configurableCharacteristicsHelper.getCharacteristicValue(ccName, markSchemeGroupId);
    }

    /**
     * Get Session tab visibilty in SSU
     */
    public getSessionTabVisibiltyinSelectResponse(): boolean {
        return (configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ReuseRIG).toLowerCase() === 'true'
            && standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.reuseResponses);
    }

    /**
     * Get the retain provisional CC
     */
    public isRetainProvisionalMarksCCOn(): boolean {
        return configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.RetainProvisionalMarks,
            standardisationSetupStore.instance.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
    }

	/**
	 * generateStandardisationRowDefinion is used for generating row collection for WorkList Grid
	 * @param comparerName
	 * @param sortDirection
	 * @param workListSelection
	 * @param gridType
	 */
    public generateStandardisationRowDefinion(comparerName: string, sortDirection: enums.SortDirection,
        workListSelection: enums.StandardisationSetup, gridType: enums.GridType): Immutable.List<gridRow> {
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Generating Reusable response worklist grid row definition
     * @param reusableResponsesList
     */
    public generateReusableResponsesRowDefinition(reusableResponsesList: Immutable.List<StandardisationResponseDetails>) {
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Generating frozen row body for reusable responses grid
     * @param reusableResponsesList
     */
    public generateStandardisationFrozenRowBodyReusableGrid(reusableResponsesList: Immutable.List<StandardisationResponseDetails>,
        comparerName?: string,
        sortDirection?: enums.SortDirection) {
        return this._stdWorkListFrozenRowBodyCollection;
    }

	/**
	 * generateScriptRowDefinition is used for generating row collection for Select response Script Grid
	 * @param standardisationScriptList
	 */
    public generateScriptRowDefinition(standardisationScriptList: StandardisationScriptDetailsList): Immutable.List<gridRow> {
        return this._stdSetUpWorkListCollection;
    }

    /**
     * GenerateTableHeader is used for generating header collection.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param gridType
     * @param selectedSessionTab
     * @param centreOrScript
     */
    public generateTableHeader(standardisationSetupType: enums.StandardisationSetup, comparerName: string,
        sortDirection: enums.SortDirection,
        gridType?: enums.GridType,
        selectedSessionTab?: enums.StandardisationSessionTab,
        centreOrScript?: string): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        let _tableHeaderCollection = this.getTableHeader(standardisationSetupType,
            comparerName, sortDirection, selectedSessionTab, gridType, centreOrScript);
        return _tableHeaderCollection;
    }

    /**
     * generateFrozenRowBody is used for generating row collection for Standardisation Setup Grid
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    public generateFrozenRowBody(standardisationSetupDetailsList: StandardisationSetupDetailsList,
        standardisationSetupType: enums.StandardisationSetup,
        gridType?: enums.GridType,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);

        let _workListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(
            standardisationSetupDetailsList, standardisationSetupType, gridType, comparerName, sortDirection);

        return _workListFrozenRowBodyCollection;
    }

    /**
     * Is used for generating row header collection for WorkList table
     * @param comparerName
     * @param sortDirection
     * @param standardisationSetupType
     * @param selectedSessionTab
     * @param isSortable
     */
    public generateFrozenRowHeader(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup,
        selectedSessionTab: enums.StandardisationSessionTab = enums.StandardisationSessionTab.CurrentSession,
        isSortable: boolean = true): Immutable.List<gridRow> {

        // Get the frozen column list from json
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        let _frozenRowHeaderCollection = this.getFrozenRowHeader(comparerName,
            sortDirection, isSortable, standardisationSetupType, selectedSessionTab);

        return _frozenRowHeaderCollection;
    }

    /**
     * Is used for generating frozen row body collection for STD WorkList table
     * @param standardisationResponseListData
     * @param standardisationSetupType
     * @param gridType
     */
    public generateStandardisationFrozenRowBody(comparerName: string, sortDirection: enums.SortDirection,
        standardisationSetupType: enums.StandardisationSetup,
        gridType: enums.GridType): Immutable.List<gridRow> {
        return this._stdWorkListFrozenRowBodyCollection;
    }

    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    public getWrappedColumn(elements: Immutable.List<JSX.Element>, className: string, seq: string): gridCell {
        let componentProps: any;
        let _workListCell: gridCell;
        let _gridCell = new gridCell();
        let element: gridCell;

        componentProps = {
            key: seq,
            divClassName: className,
            componentList: elements
        };
        _workListCell = new gridCell();
        _workListCell.columnElement = React.createElement(GenericComponentWrapper, componentProps);
        return _workListCell;
    }

    /**
     * creating grid columns collection
     * @param gridgridLeftColumn
     * @param gridMiddleColumn
     * @param key
     * @param gridRightColumn - to display AMD and TMD based on Accuracy Indicator
     * @returns grid cell collection.
     */
    public getGridCells(
        gridgridLeftColumn: Array<JSX.Element>,
        gridMiddleColumn: Array<JSX.Element>,
        key: string,
        gridRightColumn?: Array<JSX.Element>): Array<gridCell> {
        let _gridCells: Array<gridCell> = new Array();
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridgridLeftColumn), 'col left-col', 'Grid_left_' + key));
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridMiddleColumn), 'col centre-col', 'Grid_centre_' + key));
        // create column for AMD and TMD only if gridRightColumn is not null
        if (gridRightColumn !== null) {
            _gridCells.push(this.getWrappedColumn(Immutable.List(gridRightColumn), 'col right-col', 'Grid_right_' + key));
        }
        return _gridCells;
    }

    /**
     * Group the elements based on the classNames.
     * @param {string} groupClassName
     * @param {string} seq
     * @returns the grouped JSX.Element.
     * @Summary groupClassName is the root element className and the column list may contain
     * the key same as groupClassName. Then that will not group the elements instead add it as
     * immediate child node.
     */
    public groupColumnElements(groupClassName: string, seq: string): JSX.Element {

        let elements = Immutable.List<JSX.Element>();

        // loop through the class group names to find the child and group.
        for (let key in this._groupColumns) {
            if (this._groupColumns[key].values) {
                let componentProps = {
                    id: this._groupColumns[key] + seq,
                    key: this._groupColumns[key] + seq,
                    divClassName: key,
                    componentList: this._groupColumns[key].values
                };

                // If the key same as main group className then we dont need to create a childnode.
                // treating it as immediate child of the main element.
                if (key !== groupClassName) {
                    elements = elements.push(React.createElement(GenericComponentWrapper, componentProps));
                } else {

                    this._groupColumns[key].values.map((x: JSX.Element) => {
                        elements = elements.push(x);
                    });
                }
            }
        }

        let componentProps = {
            id: groupClassName + seq,
            key: groupClassName + seq,
            divClassName: groupClassName,
            componentList: elements
        };
        return React.createElement(GenericComponentWrapper, componentProps);
    }

    /**
     * Start with fresh group.
     */
    public emptyGroupColumns(): void {
        // start with a fresh list of column group set.
        this._groupColumns = {};
    }

    /**
     * Return the group columns
     * @returns
     */
    public get groupColumns(): any {
        return this._groupColumns;
    }

    /**
     * Mapping the each elements to a group.
     * This add the elements to a dictionary which has className as key
     * and list of elements that  grouped under the className.
     * @param {string} className
     * @param {JSX.Element} element
     */
    public mapGroupColumns(className: string, element: JSX.Element): void {

        // If not group class has been added create a new object
        // otherwise add to the existing.
        if (this._groupColumns[className] === undefined) {
            this._groupColumns[className] = { values: Immutable.List<JSX.Element>() };
        }
        this._groupColumns[className].values = this._groupColumns[className].values.push(element);
    }

    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    protected getColumnHeaderElement(seq: string, headerText?: string, gridColumn?: string,
        isCurrentSort?: boolean, isSortRequired?: boolean, sortDirection?: enums.SortDirection): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            headerText: headerText,
            sortDirection: sortDirection,
            isCurrentSort: isCurrentSort,
            isSortingRequired: isSortRequired
        };

        return React.createElement(ColumnHeader, componentProps);
    }

    /**
     * returns the table row collection for table header.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param selectedSessionTab
     * @param gridType
     * @param centreOrScript
     */
    public getTableHeader(standardisationSetupType: enums.StandardisationSetup,
        comparerName: string,
        sortDirection: enums.SortDirection,
        selectedSessionTab: enums.StandardisationSessionTab = enums.StandardisationSessionTab.CurrentSession,
        gridType?: enums.GridType, centreOrScript?: string): Immutable.List<gridRow> {
        let _columnHeaderCollection = Array<gridRow>();
        let _cell: gridCell;
        let _row = new gridRow();
        let _columnHeaderCellcollection: Array<gridCell> = new Array();
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson,
            standardisationSetupType, false, gridType, selectedSessionTab, centreOrScript);
        let gridColumnLength = gridColumns.length;

        this.resetDynamicColumnSettings();

        // Getting the classified worklist columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _cell = new gridCell();
            let _responseColumn = gridColumns[gridColumnCount].GridColumn;
            let headerText = gridColumns[gridColumnCount].ColumnHeader;
            let _comparerName = gridColumns[gridColumnCount].ComparerName;

            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            let key = 'columnHeader_' + gridColumnCount;
            let isCurrentSort: any =
                standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                    undefined : (comparerName === _comparerName);
            let isSortRequired: any =
                standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                    false : (gridColumns[gridColumnCount].Sortable === 'true');
            let currentSortDirection: enums.SortDirection =
                standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                    undefined : sortDirection;

            _cell.columnElement = this.getColumnHeaderElement(
                key,
                headerText,
                _responseColumn,
                isCurrentSort,
                isSortRequired,
                currentSortDirection
            );

            _cell.isHidden = this.getCellVisibility(_responseColumn);

            // No sort for classification
            if (standardisationSetupType !== enums.StandardisationSetup.ClassifiedResponse) {
                _cell.comparerName = _comparerName;
                _cell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);
            }
            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _cell.setCellStyle(cellStyle);

            // Creating the grid row collection.
            _columnHeaderCellcollection.push(_cell);

        }

        // Get Dynamic Headers for Individual question when Mark By question view selected
        if (gridType === enums.GridType.markByQuestion) {
            let standardisationResponseListData =
                Immutable.List<StandardisationResponseDetails>(
                    standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
            _columnHeaderCellcollection.concat(
                this.getDynamicHeadersForMarks(standardisationResponseListData, _columnHeaderCellcollection)
            );

            if (standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse &&
                (standardisationSetupStore.instance.stdSetupPermissionCCData &&
                    standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                this.isRetainProvisionalMarksCCOn() &&
                !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                let key = 'columnHeader_Declassify';
                let cellStyle = 'last-cell-header';
                _cell = new gridCell();
                // create question header element for each question.
                _cell.columnElement = this.getColumnHeaderElement(
                    key,
                    '',
                    undefined,
                    undefined,
                    false,
                    undefined
                );

                _cell.isHidden = false;
                _cell.setCellStyle(cellStyle);
                // Creating the grid row collection.
                _columnHeaderCellcollection.push(_cell);
            } else {
                //Adding the 'last-cell' column as this column is not added to classified worklst by default
                let key = 'columnHeader_Declassify';
                let cellStyle = 'last-cell-header';
                _cell = new gridCell();
                _cell.isHidden = false;
                _cell.setCellStyle(cellStyle);
                // Creating the grid row collection.
                _columnHeaderCellcollection.push(_cell);
            }

        }

        _row.setRowId(1);
        _row.setCells(_columnHeaderCellcollection);
        _columnHeaderCollection.push(_row);

        let _standardisationTableHeaderCollection = Immutable.fromJS(_columnHeaderCollection);
        return _standardisationTableHeaderCollection;
    }

    /**
     * returns the table row collection of frozen table
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    public getFrozenRowBodyForListView(standardisationSetupDetailsList: StandardisationSetupDetailsList,
        standardisationSetupType: enums.StandardisationSetup,
        gridType?: enums.GridType,
        comparerName?: string,
        sortDirection?: enums.SortDirection): Immutable.List<gridRow> {

        let _rowHeaderCellcollection = Array<gridCell>();
        let _row: gridRow;
        let _rowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let _cell: gridCell;
        let key: string;
        let cssClass: string;
        let submitResponse: submitHelper = new submitHelper();

        if (standardisationSetupDetailsList != null) {
            let gridSeq: any;
            let _responseListData: any;
            let gridColumns: any;
            let gridRowIdColumn: string;

            switch (standardisationSetupType) {
                case enums.StandardisationSetup.SelectResponse:
                    if (standardisationSetupDetailsList.standardisationScriptDetailsList) {
                        gridSeq = standardisationSetupDetailsList.standardisationScriptDetailsList.centreScriptList.keySeq();
                        _responseListData = standardisationSetupDetailsList.standardisationScriptDetailsList.centreScriptList.toArray();
                        gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, standardisationSetupType, true,
                            null,
                            enums.StandardisationSessionTab.CurrentSession,
                            'Script');
                        gridRowIdColumn = 'candidateScriptId';
                    } else {
                        return;
                    }
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    _responseListData = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
                    let sortedData: any;
                    sortedData = Immutable.List<any>(sortHelper.sort(_responseListData, comparerList[comparerName]));
                    _responseListData = sortedData.toArray();

                    gridSeq = Immutable.List<StandardisationResponseDetails>
                        (_responseListData).keySeq();
                    gridColumns = this.getGridColumns(
                        this.resolvedGridColumnsJson,
                        standardisationSetupType,
                        true, gridType);
                    break;
                case enums.StandardisationSetup.None:
                    break;
            }

            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the list data row
                _row = new gridRow();
                _rowHeaderCellcollection = new Array();

                let responseData = _responseListData[responseListCount];
                let gridColumnLength = gridColumns.length;
                let responseStatuses: Immutable.List<enums.ResponseStatus> =
                    submitResponse.submitButtonValidate(responseData, responseData.markingProgress, false, false);

                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _cell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;

                    //Switch statement for adding frozen columns.
                    switch (_responseColumn) {
                        case gridColumnNames.ScriptId:
                            key = gridSeq.get(responseListCount) + '_ScriptId_' + gridColumnCount;
                            _cell.columnElement = this.getScriptIdElement(responseData,
                                componentPropsJson,
                                key,
                                (localeStore.instance.TranslateText
                                    ('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.script-id')
                                    + ' '),
                                true);

                            _cell.setCellStyle('col-script-id header-col');
                            _rowHeaderCellcollection.push(_cell);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _cell.columnElement = this.getResponseIdColumnElement(
                                responseData,
                                key,
                                true
                            );

                            _cell.setCellStyle('col-response header-col');
                            _rowHeaderCellcollection.push(_cell);
                            break;
                        case gridColumnNames.IsSharedProvisional:
                            let isSharedProvisional = this.isCommonProvisionalStandardisationOn()
                                && standardisationSetupStore.instance.stdSetupPermissionCCData.role
                                    .permissions.viewCommonProvisionalAvailableResponses
                                && responseData.isSharedProvisional;
                                key = gridSeq.get(responseListCount) + '_ShareResponseIndicatorColumn_' + gridColumnCount;
                                _cell.columnElement = this.getSharedResponseIndicatorElement(
                                    isSharedProvisional,
                                    key
                                );
                                _cell.setCellStyle('col-share');
                                _rowHeaderCellcollection.push(_cell);
                            break;
                    }
                }

                // Creating the table row collection.
                _rowCollection.push(
                    this.getGridRow(
                        responseData[gridRowIdColumn],
                        _rowHeaderCellcollection,
                        undefined,
                        cssClass,
                        responseStatuses
                    ));
            }
        }
        let _frozenRowBodyCollection = Immutable.fromJS(_rowCollection);
        return _frozenRowBodyCollection;
    }

    /**
     * get Script Id Element
     * @param standardisationScriptDetails 
     * @param propsNames 
     * @param seq 
     * @param displayText 
     * @param isScriptIdClickable 
     */
    public getScriptIdElement(standardisationScriptDetails: StandardisationScriptDetails,
        propsNames: any,
        seq: string,
        displayText?: string,
        isScriptIdClickable: boolean = true): JSX.Element {
        let componentProps: any;
        let _displayText: string;

        _displayText = standardisationScriptDetails[propsNames.ScriptId];

        componentProps = {
            key: seq,
            id: seq,
            displayId: standardisationScriptDetails[propsNames.ScriptId],
            displayText: _displayText,
            isClickable: isScriptIdClickable
        };
        return React.createElement(scriptidgridelement, componentProps);
    }


    /**
     * returns the table row elements for frozen table header
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     * @param standardisationSetupType
     * @param selectedTab
     */
    public getFrozenRowHeader(comparerName: string, sortDirection: enums.SortDirection,
        isSortable: boolean,
        standardisationSetupType: enums.StandardisationSetup,
        selectedSessionTab: enums.StandardisationSessionTab): Immutable.List<gridRow> {

        let _columnHeaderCollection = Array<gridRow>();
        let _row = new gridRow();
        let _columnHeaderCellcollection: Array<gridCell> = new Array();

        let _comparerName: comparerList;
        let _gridColumnName: string = '';
        let _cellStyle: string = '';

        switch (standardisationSetupType) {
            case enums.StandardisationSetup.SelectResponse:
                switch (selectedSessionTab) {
                    case enums.StandardisationSessionTab.CurrentSession:
                        _comparerName = comparerList.stdScriptIdComparer;
                        _gridColumnName = localeStore.instance.TranslateText(
                            'standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.script-id');
                        _cellStyle = 'col-script-id header-col';

                        // Creating the grid row collection.
                        _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName, _cellStyle,
                            comparerName, isSortable, _comparerName, sortDirection));
                        break;
                    case enums.StandardisationSessionTab.PreviousSession:
                        let _cell: gridCell;
                        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson,
                            enums.StandardisationSetup.SelectResponse, true, null,
                            enums.StandardisationSessionTab.PreviousSession);
                        let gridColumnLength = gridColumns.length;

                        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                            _cell = new gridCell();
                            let key = 'frozenRowHeader_' + gridColumnCount;
                            let currentComparer: string = gridColumns[gridColumnCount].ComparerName;
                            let isSortRequired: boolean = gridColumns[gridColumnCount].Sortable === 'true';
                            let headerText = gridColumns[gridColumnCount].ColumnHeader;
                            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
                            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';

                            // Creating the grid row collection.
                            _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, headerText, cellStyle,
                                comparerName, isSortRequired, comparerList[currentComparer], sortDirection));
                        }
                        break;
                }
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                _gridColumnName =
                    localeStore.instance.
                        TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.response-id');
                _cellStyle = 'col-response header-col';

                // Creating the grid row collection.
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, '',
                    'col-std-classify-items header-col', '', false));
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName,
                    _cellStyle, '', false));
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                let gridColumns = this.getGridColumns(
                    this.resolvedGridColumnsJson,
                    standardisationSetupType,
                    true);
                let gridColumnLength = gridColumns.length;
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                        let currentComparer: string = gridColumns[gridColumnCount].ComparerName;
                        _gridColumnName = gridColumns[gridColumnCount].ColumnHeader;
                        _gridColumnName = (_gridColumnName && _gridColumnName !== '') ?
                            localeStore.instance.TranslateText(_gridColumnName) : '';
                        _cellStyle = (gridColumns[gridColumnCount].CssClass) ?
                            gridColumns[gridColumnCount].CssClass : ''; // 'col-response header-col';
                        let isSortRequired: boolean = gridColumns[gridColumnCount].Sortable === 'true';

                        // Creating the grid row collection.
                        _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName,
                            _cellStyle, comparerName, isSortRequired, comparerList[currentComparer], sortDirection));
                }
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                _gridColumnName =
                    localeStore.instance.
                        TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.response-id');
                _cellStyle = 'col-response header-col';

                _comparerName = comparerList.responseIdComparer;

                // Creating the grid row collection.
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName,
                    _cellStyle, comparerName, isSortable, _comparerName, sortDirection));
                break;
            case enums.StandardisationSetup.None:
                break;
        }

        _row.setRowId(1);
        _row.setCells(_columnHeaderCellcollection);
        _columnHeaderCollection.push(_row);

        let _frozenRowHeaderCollection = Immutable.fromJS(_columnHeaderCollection);

        return _frozenRowHeaderCollection;
    }

    /**
     * Setting frozen header columns (Rig order empty column/Response Id for Classifed)
     * @param columnHeader
     * @param cellStyle
     */
    protected setFrozenColumnHeaders(standardisationSetupType: enums.StandardisationSetup,
        columnHeader: string, cellStyle: string,
        currentComparer: string, isSortable: boolean,
        _comparerName?: comparerList, sortDirection?: enums.SortDirection) {
        let _cell: gridCell;
        _cell = new gridCell();
        let key = 'frozenRowHeader';

        let isCurrentSort: any =
            standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                undefined : (comparerList[currentComparer] === _comparerName);
        let isSortRequired: any =
            standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                false : isSortable;
        let currentSortDirection: enums.SortDirection =
            standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                undefined : sortDirection;

        //TODO : Move the magic strings outside (json?)
        _cell.columnElement = this.getColumnHeaderElement(
            key,
            columnHeader,
            '',
            isCurrentSort,
            isSortRequired,
            currentSortDirection
        );

        if (standardisationSetupType !== enums.StandardisationSetup.ClassifiedResponse) {
            _cell.comparerName = comparerList[_comparerName];
            _cell.sortDirection = this.getSortDirection((comparerList[currentComparer] === _comparerName), sortDirection);
        }

        _cell.setCellStyle(cellStyle);

        return _cell;
    }

    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param resolvedGridColumnsJson
     * @param standardisationSetupType
     * @param isFrozen
     * @param selectedSessionTab
     * @param centreOrScript
     */
    protected getGridColumns(resolvedGridColumnsJson: any, standardisationSetupType: enums.StandardisationSetup,
        isFrozen: boolean = false, gridType?: enums.GridType,
        selectedSessionTab?: enums.StandardisationSessionTab, centreOrScript?: string) {
        let gridColumns: any;
        switch (standardisationSetupType) {
            case enums.StandardisationSetup.SelectResponse:
                if (selectedSessionTab === enums.StandardisationSessionTab.CurrentSession) {
                    if (centreOrScript === 'Script') {
                        gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.standardisationsetup.SelectResponse.Script.GridColumns
                            : resolvedGridColumnsJson.standardisationsetup.SelectResponse.FrozenRows.GridColumns;
                    } else {
                        gridColumns = resolvedGridColumnsJson.standardisationsetup.SelectResponse.Centre.GridColumns;
                    }
                } else if (selectedSessionTab === enums.StandardisationSessionTab.PreviousSession) {
                    gridColumns = (isFrozen === false) ?
                        resolvedGridColumnsJson.standardisationsetup.PreviousSession.ReusableResponse.GridColumns
                        : resolvedGridColumnsJson.standardisationsetup.PreviousSession.frozenRows.GridColumns;
                }
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                gridColumns = (isFrozen === false) ? (gridType === enums.GridType.totalMarks ?
                    resolvedGridColumnsJson.standardisationsetup.ProvisionalResponse.totalmarksview.GridColumns
                    : resolvedGridColumnsJson.standardisationsetup.ProvisionalResponse.marksbyquestionview.GridColumns)
                    : resolvedGridColumnsJson.standardisationsetup.ProvisionalResponse.frozenRows.GridColumns;
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                gridColumns = (isFrozen === false) ? (gridType === enums.GridType.totalMarks ?
                    resolvedGridColumnsJson.standardisationsetup.UnClassifiedResponse.totalmarksview.GridColumns
                    : resolvedGridColumnsJson.standardisationsetup.UnClassifiedResponse.marksbyquestionview.GridColumns)
                    : resolvedGridColumnsJson.standardisationsetup.UnClassifiedResponse.frozenRows.GridColumns;
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                gridColumns = (isFrozen === false) ? (gridType === enums.GridType.totalMarks ?
                    resolvedGridColumnsJson.standardisationsetup.ClassifiedResponse.totalmarksview.GridColumns
                    : resolvedGridColumnsJson.standardisationsetup.ClassifiedResponse.marksbyquestionview.GridColumns)
                    : resolvedGridColumnsJson.standardisationsetup.ClassifiedResponse.frozenRows.GridColumns;
                break;
            case enums.StandardisationSetup.None:
                break;
        }
        return gridColumns;
    }

    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    protected getCellVisibility(column: string): boolean {
        if (ecourseWorkHelper.isECourseworkComponent && column === 'FirstScanned') {
            return true;
        }
        if (!(configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false) && column === 'QuestionItems') {
            return true;
        }
        return false;
    }

    /**
     * Reset dynamic column
     */
    protected resetDynamicColumnSettings() {
        this._dateLengthInPixel = 0;
    }

    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    protected getSortDirection(isCurrentSort: boolean, sortDirection: enums.SortDirection): enums.SortDirection {
        return ((isCurrentSort === true) ?
            ((sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending)
            : enums.SortDirection.Ascending);
    }

    /**
     * returns the blue banner element
     * @param selectedWorkList
     * @param targetCount
     * @param isESTeamMember
     * @param selectedSession
     */
    public getBlueBannerForTargets = (selectedWorkList: enums.StandardisationSetup, targetCount:
        number, isESTeamMember?: boolean, selectedSession?: enums.StandardisationSessionTab): JSX.Element => {
        let componentProps: any;
        componentProps = {
            key: selectedWorkList + '_blueBanner',
            blueBannerMessageKey: this.getRightContainerBlueBannerKey(selectedWorkList, targetCount, isESTeamMember, selectedSession)
        };
        return React.createElement(blueBannerMessage, componentProps);
    }

    /**
     * returns the blue banner message key for resource file
     * @param selectedWorkList
     * @param targetCount
     * @param isESTeamMember
     * @param selectedSession
     */
    private getRightContainerBlueBannerKey = (selectedWorkList: enums.StandardisationSetup,
        targetCount: number, isESTeamMember: boolean = false, selectedSession?: enums.StandardisationSessionTab): string => {

        let key: string;
        switch (selectedWorkList) {
            case enums.StandardisationSetup.None:
                key = 'standardisation-setup.right-container.select-response-bluebanner-message';
                break;
            case enums.StandardisationSetup.SelectResponse:
                if (selectedSession !== null && selectedSession !== undefined
                    && selectedSession === enums.StandardisationSessionTab.PreviousSession) {
                    targetCount === 0 ?
                    key = 'standardisation-setup.right-container.select-response-previouse-session-empty-message' :
                    key = 'standardisation-setup.right-container.select-response-previouse-session-default-message' ;
                } else {
                    key = 'standardisation-setup.right-container.select-response-bluebanner-message';
                }
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                key = targetCount > 0 ? 'standardisation-setup.right-container.provisional-bluebanner-message' :
                    'standardisation-setup.right-container.empty-responses-provisional-bluebanner-message';
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                let isSeedVisible = standardisationSetupStore.instance.stdSetupPermissionCCData ?
                    standardisationSetupStore.instance.stdSetupPermissionCCData.role.viewByClassification.classifications.seeding :
                    false;

                // Check whether the logged in examiner role is present in the 'StandardisationSetupPermissions' CC
                let isLoggedInExaminerRolePresentInCC =
                    standardisationSetupStore.instance.stdSetupPermissionCCData.isLoggedInExaminerRolePresentInCC;
                let loggedInExaminerRole = standardisationSetupStore.instance.stdSetupPermissionCCData.role.name;

                key = targetCount > 0 ?
                    ((isESTeamMember && (isSeedVisible === false || isSeedVisible === undefined)) ?
                        'standardisation-setup.right-container.unclassified-bluebanner-message-for-esteam' :
                        'standardisation-setup.right-container.unclassified-bluebanner-message') :
                    (isESTeamMember && !isLoggedInExaminerRolePresentInCC) ?
                        'standardisation-setup.right-container.empty-responses-unclassified-without-role-bluebanner-message' :
                        'standardisation-setup.right-container.empty-responses-unclassified-bluebanner-message';
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                key = targetCount > 0 ? 'standardisation-setup.right-container.classified-bluebanner-message' :
                    'standardisation-setup.right-container.empty-responses-classified-bluebanner-message';
                break;
        }
        return key;
    }

	/**
	 * Get the text value for Grid Column
	 * @param textValue
	 * @param seq
	 */
    public getGenericTextElement(textValue: string, seq: string, title?: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            title: title
        };
        return React.createElement(GenericTextColumn, componentProps);
    }

    /**
     * Get the Formatted date element.
     * @param value
     * @param seq
     */
    public getGenericFormattedDateElement(value: Date, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            dateValue: new Date(value.toString()),
            className: 'dim-text txt-val small-text'
        };
        return React.createElement(genericDate, componentProps);
    }

    /**
     * Get the Converted text value for Grid Column
     *  @param textValue
     * @param seq
     */
    public getConvertTextElement(textValue: string, seq: string): JSX.Element {
        let componentProps: any;
        switch (textValue) {
            case 'true':
                textValue = 'Yes';
                break;
            case 'false':
                textValue = 'No';
                break;
        }
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue
        };
        return React.createElement(GenericTextColumn, componentProps);
    }


    /**
     * Get the Marks Grid Column
     * @param textValue
     * @param seq
     * @param usedInTotal
     */
    public getMarksColumn(textValue: string, seq: string, usedInTotal: boolean): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            usedInTotal: usedInTotal
        };
        return React.createElement(marksColumn, componentProps);
    }


	/**
	 * creating react element for the  TotalMark component
	 * @param mark
	 * @param seq
	 */
    public getTotalMarkElement(mark: number,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            isNonNumericMark: false,
            maximumMark: 100,
            totalMark: mark,
            markingProgress: 100,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(totalMark, componentProps);
    }


    /**
     * returns the Selected Tag Id of response.
     * @param seq
     * @param tagId
     * @param tagList
     * @param markGroupId
     */
    protected getTag(seq: string, tagId: number, tagList: immutable.List<Tag>,
        markGroupId: number, markingMode: enums.MarkingMode): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            selectedTagId: tagId,
            tagList: tagList,
            markGroupId: markGroupId,
            selectedLanguage: localeStore.instance.Locale,
            // isESResponse = true when tag updated from standardisation setup.
            isESResponse: true,
            markingMode: markingMode
        };

        return React.createElement(TagList, componentProps);
    }

    /**
     * creating react element for the  ResponseIdColumn component
     * @param stdResponseData
     * @param seq
     * @param isResponseIdClickable
     */
    public getResponseIdColumnElement(stdResponseData: StandardisationResponseDetails,
        seq: string,
        isResponseIdClickable: boolean = true,
        isReusableResponseView: boolean = false,
        candidateScriptId: string = ''): JSX.Element {
        let componentProps: any;
        let displayId = stdResponseData.displayId;

        componentProps = {
            key: seq,
            id: seq,
            displayId: displayId.toString(),
            isResponseIdClickable: isResponseIdClickable,
            selectedLanguage: localeStore.instance.Locale,
            isReusableResponseView: isReusableResponseView,
            candidateScriptId: '1' + stdResponseData.candidateScriptId
        };
        return React.createElement(stdResponseId, componentProps);
    }

	/**
	 * creating react element for the  LinkedMessagrIndicator component
	 * @param responseData
	 * @param propsNames
	 * @param seq
	 * @param isTileView
	 */
    public getLinkedMessageElement(
        responseData: StandardisationResponseDetails, propsNames: any, seq: string, isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            messageCount: responseData[propsNames.unreadMessagesCount],
            hasMessages: responseData[propsNames.hasMessages],
            displayId: responseData[propsNames.displayId],
            selectedLanguage: localeStore.instance.Locale,
            isTileView: isTileView,
            isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode
        };
        return React.createElement(LinkedMessageIndicator, componentProps);
    }

	/**
	 * creating react element for the  Last updated component
	 * @param lastUpdatedDate
	 * @param seq
	 */
    public getLastUpdatedElement(stdResponseData: StandardisationResponseDetails,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            dateType: enums.WorkListDateType.lastUpdatedDate,
            dateValue: new Date(stdResponseData[propsNames.updatedDate]),
            isTileView: false
        };
        return React.createElement(LastUpdatedColumn, componentProps);
    }

    /**
     * create react element for declassify button
     * @param title
     * @param anchorclassName
     * @param spanclassName
     * @param seq
     */
    private getDeclassifyButtonElement(title: string,
        anchorclassName: string,
        spanclassName: string,
        seq: string,
        displayId: string,
		totalMarkValue: number,
		candidateScriptId: number,
		esCandidateScriptMarkSchemeGroupId: number,
        markingModeId: number,
        rigOrder: number,
        esMarkGroupRowVersion: string
    ): JSX.Element {
        let componentProps: any;
        componentProps = {
            title: title,
            id: seq,
            anchorclassName: anchorclassName,
            spanclassName: spanclassName,
            displayId: displayId,
			totalMarkValue: totalMarkValue,
			candidateScriptId: candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            markSchemeGroupId: standardisationSetupStore.instance.markSchemeGroupId,
			markingModeId: markingModeId,
            rigOrder: rigOrder,
            esMarkGroupRowVersion: esMarkGroupRowVersion
        };
        return React.createElement(DeclassifyButton, componentProps);
    }

    /**
     * creating grid row
     * @param {string} uniqueId 
     * @param {Array<gridCell>} gridCells 
     * @param {JSX.Element} [additionalComponent] 
     * @param {string} [cssClass] 
     * @param {Immutable.List<enums.ResponseStatus>} [responseStatus] 
     * @param {boolean} [overClassified]
     * @returns {gridRow} 
     * @memberof StandardisationSetupHelperBase
     */
    public getGridRow(
        uniqueId: string,
        gridCells: Array<gridCell>,
        additionalComponent?: JSX.Element,
        cssClass?: string,
        responseStatus?: Immutable.List<enums.ResponseStatus>,
        overClassified?: boolean): gridRow {
        let _gridRow: gridRow = new gridRow();
        let className = this.setRowStyle(responseStatus, overClassified);
        className = (cssClass) ? (className + ' ' + cssClass) : className;

        _gridRow.setRowStyle(className);
        _gridRow.setRowId(parseFloat(uniqueId));
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        return _gridRow;
    }

    /**
     * Set row style to amber if the response has blocking exceptions or other reasons
     * @param {Immutable.List<enums.ResponseStatus>} responseStatus 
     * @returns {string} 
     * @memberof StandardisationSetupHelperBase
     */
    public setRowStyle(responseStatus: Immutable.List<enums.ResponseStatus>, overClassified: boolean): string {

        // Check whetehr the classifcation type exceeded the current target,
        // if so highlight the exceeded last rows with amber color.
        if ((responseStatus && (responseStatus.contains(enums.ResponseStatus.hasException) ||
            responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
            responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ||
            responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
            responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
            responseStatus.contains(enums.ResponseStatus.notAllFilesViewed))) || overClassified) {
            return 'row warning-alert';
        } else {
            return 'row';
        }
    }

	/**
	 * Generate Centre Row Definition
	 * @param standardisationCentreList
	 */
    public generateCentreRowDefinition(standardisationCentreList: StandardisationCentreDetailsList) {
        return this._stdSetUpWorkListCollection;
    }

    /**
     * Return the dynamic headers for questions
     * @param standardisationResponseListData 
     * @param _columnHeaderCellcollection 
     */
    protected getDynamicHeadersForMarks(standardisationResponseListData: any,
        _columnHeaderCellcollection: Array<gridCell>): Array<gridCell> {
        // Get the Standardisation marks for the response if exist.
        let _stdMarksData = standardisationResponseListData.first().standardisationMarks;
        let questionsCount: any = _stdMarksData.length;
        let _cell: gridCell;

        // iterate through each questions and get the display label.
        for (let questionItemCount = 0; questionItemCount < questionsCount; questionItemCount++) {
            _cell = new gridCell();

            let headerText = _stdMarksData[questionItemCount].displayLabel;
            let _comparerName = '';

            headerText = (headerText && headerText !== '') ? headerText : '';
            let key = 'columnHeader_' + questionItemCount;

            // create question header element for each question.
            _cell.columnElement = this.getColumnHeaderElement(
                key,
                headerText,
                undefined,
                undefined,
                false,
                undefined
            );

            _cell.isHidden = false;
            _cell.comparerName = _comparerName;
            let cellStyle = 'col-question-item';
            _cell.setCellStyle(cellStyle);

            // Creating the grid row collection.
            _columnHeaderCellcollection.push(_cell);
        }

        return _columnHeaderCellcollection;
    }

    /**
     * Get Dynamic Value For Marks
     * @param gridSeq
     * @param stdResponseData
     * @param _stdRowHeaderCellcollection
     * @param index 
     */
    protected getDynamicValueForMarks(stdResponseData: any,
        _stdRowHeaderCellcollection: Array<gridCell>, index: number): Array<gridCell> {

        let _stdGridCell: gridCell;
        let key: string;

        // Get the Standardisation marks for the response if exist.
        let stdMarks = stdResponseData.standardisationMarks;
        let noOfQuestions = stdMarks.length;
        let mark: string;
        let usedInTotal: boolean;

        // Getting the Marks Data
        for (let questionItemCount = 0; questionItemCount < noOfQuestions; questionItemCount++) {
            _stdGridCell = new gridCell();
            key = index + '_Questions_' + questionItemCount;
            mark = isNaN(parseInt(stdMarks[questionItemCount].mark.toString())) ?
                stdMarks[questionItemCount].mark : parseInt(stdMarks[questionItemCount].mark.toString());
            usedInTotal = stdMarks[questionItemCount].usedInTotal;
            _stdGridCell.columnElement = this.getMarksColumn(mark, key, usedInTotal);
            _stdGridCell.isHidden = false;
            let cellStyle = 'col-question-item';
            _stdGridCell.setCellStyle(cellStyle);
            _stdRowHeaderCellcollection.push(_stdGridCell);
        }

        return _stdRowHeaderCellcollection;
    }

    /**
     * Method to create Frozen Body Data for different std worklists.
     * @param stdResponseData
     * @param gridSeq
     * @param gridType
     */
    public getFrozenRowData(stdResponseData: StandardisationResponseDetails,
        gridType: enums.GridType, gridColumns: any, index: number, overClassified: boolean): gridRow {
        let _stdWorkListRowHeaderCellcollection = Array<gridCell>();
        let _stdWorkListCell: gridCell;
        let key: string;
        let cellStyle: string;
        let _stdResponseColumn: any;
        let componentPropsJson: any;
        let gridColumnLength = gridColumns.length;
        let submitResponse: submitHelper = new submitHelper();
        let responseStatuses: Immutable.List<enums.ResponseStatus> =
            submitResponse.submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);

        // Set rig order as "Seed" for seed responses.
        let isSeed: boolean = (stdResponseData.markingModeId === enums.MarkingMode.Seeding);

        // Getting the STD worklist columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
            _stdWorkListCell = new gridCell();
            componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
            //Switch statement for adding frozen columns in future.
            switch (_stdResponseColumn) {
                case gridColumnNames.RigOrderColumn:
                    key = index + '_RigOrderColumn_' + gridColumnCount;
                    let className = 'dim-text small-text classify-index';
                    _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(
                        key,
                        className,
                        undefined,
                        isSeed ? 'Seed' : stdResponseData.rigOrder.toString()
                    );
                    cellStyle = 'col-std-classify-items header-col';
                    break;

                case gridColumnNames.ResponseIdColumn:
                    key = index + '_ResponseIdColumn_' + gridColumnCount;
                    _stdWorkListCell.columnElement = this.getResponseIdColumnElement(
                        stdResponseData,
                        key,
                        true
                    );
                    cellStyle = 'col-response header-col';
                    break;
            }
            _stdWorkListCell.setCellStyle(cellStyle);
            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
        }

        // Return the table row.
        return this.getGridRow(stdResponseData.displayId.toString(),
            _stdWorkListRowHeaderCellcollection,
            undefined,
            undefined,
            responseStatuses,
            overClassified);
    }

    /**
     * Method to return ufrozen row data for different type.
     * @param stdResponseListData
     * @param gridColumns
     * @param gridSeq
     * @param gridType
     */
    public getRowData(stdResponseListData: Immutable.List<StandardisationResponseDetails>,
        gridColumns: any, gridType: enums.GridType, index: number, standardisationSetupType: enums.StandardisationSetup): Array<gridRow> {
        let stdGridRowCollection = Array<gridRow>();
        let submitResponse: submitHelper = new submitHelper();

        // Loop through each response
        stdResponseListData.map((stdResponseData: StandardisationResponseDetails) => {
            let stdGridRowHeaderCellcollection = Array<gridCell>();
            let _stdResponseColumn: any;
            let componentPropsJson: any;
            let _stdGridCell: gridCell;
            let key: string;
            let responseStatuses: Immutable.List<enums.ResponseStatus> =
                submitResponse.submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);
            // Getting the worklist columns
            for (let gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;

                componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                _stdGridCell = new gridCell();
                switch (_stdResponseColumn) {
                    case gridColumnNames.ScriptId:
                        key = index + '_ScriptId_' + gridColumnCount;
                        let candidateScriptId = '1' + stdResponseData.candidateScriptId.toString();
                        _stdGridCell.columnElement = this.getGenericTextElement(
                            candidateScriptId,
                            key
                        );
                        break;
                    case gridColumnNames.Centre:
                        key = index + '_Centre_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getGenericTextElement(
                            stdResponseData.centreNumber,
                            key
                        );
                        break;
                    case gridColumnNames.CentreCandidateNum:
                        key = index + '_Candidate_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getGenericTextElement(
                            stdResponseData.centreCandidateNumber,
                            key
                        );
                        break;
                    case gridColumnNames.MarksColumn:
                        key = index + '_Marks_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getTotalMarkElement(
                            stdResponseData.totalMarkValue,
                            key
                        );
                        break;
                    case gridColumnNames.LastMarkerColumn:
                        key = index + '_LastMarker_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getGenericTextElement(
                            stringFormatHelper.getFormattedExaminerName(stdResponseData.lastMarkerInitials,
                                stdResponseData.lastMarkerSurname), key);
                        break;
                    case gridColumnNames.NoteColumn:
                        key = index + '_Note_' + gridColumnCount;
                        let title = stdResponseData.note;
                        _stdGridCell.columnElement = this.getGenericTextElement(stdResponseData.note, key, title);
                        break;
                    case gridColumnNames.LinkedMessageIndicator:
                        key = index + '_LinkedMessage_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getLinkedMessageElement(
                            stdResponseData,
                            componentPropsJson,
                            key,
                            false
                        );
                        break;
                    case gridColumnNames.TagIndicator:
                        key = index + '_TagIndicator_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getTag(
                            key,
                            stdResponseData.tagId,
                            tagStore.instance.tags,
                            stdResponseData.esMarkGroupId,
                            stdResponseData.markingModeId
                        );
                        break;
                    case gridColumnNames.LastUpdatedColumn:
                        key = index + '_LastUpdated_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getLastUpdatedElement(
                            stdResponseData,
                            componentPropsJson,
                            key
                        );
                        break;
                    case gridColumnNames.Status:
                        responseStatuses = submitResponse.submitButtonValidate
                            (stdResponseData, stdResponseData.markingProgress, false, false);
                        key = index + '_Status_' + gridColumnCount;
                        _stdGridCell.columnElement = this.getMarkingProgressElement(
                            stdResponseData,
                            componentPropsJson,
                            key,
                            responseStatuses,
                            standardisationSetupType
                        );
                        break;
                    case gridColumnNames.DeClassifyColumn:
                        if ((standardisationSetupStore.instance.stdSetupPermissionCCData &&
                            standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                            this.isRetainProvisionalMarksCCOn() &&
                            !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                            key = index + '_DeClassify_' + gridColumnCount;
                            _stdGridCell.columnElement = this.getDeclassifyButtonElement(
                                'Declassify',
                                'close-icon-link',
                                'close-icon',
                                key,
                                stdResponseData.displayId,
								stdResponseData.totalMarkValue,
								stdResponseData.candidateScriptId,
								stdResponseData.esCandidateScriptMarkSchemeGroupId,
								stdResponseData.markingModeId,
                                stdResponseData.rigOrder,
                                stdResponseData.esMarkGroupRowVersion
                            );
                        } else {
                            //Adding the 'last-cell' column as this column is not added to classified worklst by default
                            key = index + '_DeClassify_' + gridColumnCount;
                        }
                        break;
                    case gridColumnNames.SLAOIndicator:
                        key = index + '_SLAOIndicator_' + gridColumnCount;
                        _stdGridCell.columnElement = (this.getSLAOIndicatorElementForStandardisationResponses(stdResponseData,
                            componentPropsJson,
                            key,
                            true,
                            false));
                        break;
                    case gridColumnNames.AllPageAnnotedIndicator:
                        key = index + '_AllPageAnnotated_' + gridColumnCount;

                        // Create annotation indicator element.
                        _stdGridCell.columnElement = this.getAllPageAnnotationIndicatorElement(
                            stdResponseData,
                            componentPropsJson,
                            key);
                        break;
                    case gridColumnNames.AllFilesNotViewedIndicator:
                        key = index + '_AllFilesNotViewed_' + gridColumnCount;

                        // Create annotation indicator element.
                        _stdGridCell.columnElement = this.getAllFilesNotViewedIndicatorElement(
                            stdResponseData,
                            componentPropsJson,
                            key);
                        break;
                    default:
                }

                _stdGridCell.isHidden = this.getCellVisibility(_stdResponseColumn);
                let cellStyle = gridColumns[gridColumnCount].CssClass
                    ? gridColumns[gridColumnCount].CssClass
                    : '';
                _stdGridCell.setCellStyle(cellStyle);
                stdGridRowHeaderCellcollection.push(_stdGridCell);
            }

            // Get individual question's marks if Mark by question view.
            if (gridType === enums.GridType.markByQuestion) {
                stdGridRowHeaderCellcollection.concat(
                    this.getDynamicValueForMarks(
                        stdResponseData,
                        stdGridRowHeaderCellcollection,
                        index
                    )
                );

                if (standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse &&
                    (standardisationSetupStore.instance.stdSetupPermissionCCData &&
                        standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                    this.isRetainProvisionalMarksCCOn() &&
                    !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                    _stdGridCell = new gridCell();
                    key = index + '_DeClassify_' + stdGridRowHeaderCellcollection.length + 1;
                    _stdGridCell.columnElement = this.getDeclassifyButtonElement(
                        'Declassify',
                        'close-icon-link',
                        'close-icon',
                        key,
                        stdResponseData.displayId,
						stdResponseData.totalMarkValue,
						stdResponseData.candidateScriptId,
						stdResponseData.esCandidateScriptMarkSchemeGroupId,
						stdResponseData.markingModeId,
                        stdResponseData.rigOrder,
                        stdResponseData.esMarkGroupRowVersion
                    );
                    _stdGridCell.isHidden = this.getCellVisibility(_stdResponseColumn);
                    let cellStyle = 'last-cell col-declassify';
                    _stdGridCell.setCellStyle(cellStyle);
                    stdGridRowHeaderCellcollection.push(_stdGridCell);
                } else {
                    //Adding the 'last-cell' column as this column is not added to classified worklst by default
                    _stdGridCell = new gridCell();
                    key = index + '_DeClassify_' + stdGridRowHeaderCellcollection.length + 1;
                    _stdGridCell.isHidden = this.getCellVisibility(_stdResponseColumn);
                    let cellStyle = 'last-cell';
                    _stdGridCell.setCellStyle(cellStyle);
                    stdGridRowHeaderCellcollection.push(_stdGridCell);
                }
            }

            // Check whetehr the classifcation type exceeded the current target,
            // if so highlight the exceeded last rows with amber color.
            // Applicable for Classified Worklist
            let overClassified: boolean =
                this.isSSUTargetsOverClassified(standardisationSetupType, stdResponseData.markingModeId, stdResponseData.rigOrder);

            // Creating the grid row collection.
            stdGridRowCollection.push(
                this.getGridRow(
                    stdResponseData.displayId.toString(),
                    stdGridRowHeaderCellcollection,
                    undefined,
                    undefined,
                    responseStatuses,
                    overClassified));
            index++;
        });

        // Return the STD Set up row collection for Unfrozen data.
        return stdGridRowCollection;
    }

    /**
     * Creating react element for the  RIG Order Column component
     * @param seq
     * @param className
     * @param classificationType
     * @param rigOrder
     */
    public getRIGOrderColumnElement(
        seq: string,
        className: string,
        classificationType?: enums.MarkingMode,
        rigOrder?: string): JSX.Element {
        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            classificationType: classificationType,
            rigOrder: rigOrder,
            className: className
        };
        return React.createElement(RigOrder, componentProps);
    }

	/**
	 * creating react element for the  getSLAOIndicatorElement component
	 * @param standardisationScriptDetails
	 * @param propsNames
	 * @param seq
	 * @param showMarkingProgress
	 * @param isTileView
	 */
    public getSLAOIndicatorElement(standardisationScriptDetails: StandardisationScriptDetails,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean = true): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isResponseHasSLAO: standardisationScriptDetails.hasAdditionalObjects,
            isAllAnnotated: false,
            isMarkingCompleted: false,
            isTileView: isTileView,
            markSchemeGroupId: standardisationSetupStore.instance.markSchemeGroupId
        };
        return React.createElement(slaoAnnotationIndicator, componentProps);
    }

    /**
     * Getting SLAO Indicator Element for Standardisation Responses
     * @param {StandardisationResponseDetails} standardisationResponseDetails 
     * @param {*} propsNames 
     * @param {string} seq 
     * @param {boolean} showMarkingProgress 
     * @param {boolean} [isTileView=true] 
     * @returns {JSX.Element} 
     * @memberof StandardisationSetupHelperBase
     */
    private getSLAOIndicatorElementForStandardisationResponses(standardisationResponseDetails: StandardisationResponseDetails,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean = true): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isResponseHasSLAO: standardisationResponseDetails.hasAdditionalObjects,
            isAllAnnotated: standardisationResponseDetails.hasAllPagesAnnotated,
            isMarkingCompleted: ((showMarkingProgress ? standardisationResponseDetails.markingProgress : 100) === 100) ? true : false,
            isTileView: isTileView,
            markSchemeGroupId: standardisationSetupStore.instance.markSchemeGroupId
        };
        return React.createElement(slaoAnnotationIndicator, componentProps);
    }

	/**
	 * Creating react element for the  MarkingProgress component.
	 * @param standardisationResponses
	 * @param propsNames
	 * @param seq
	 * @param responseStatuses
	 * @param standardisationSetup
	 */
    private getMarkingProgressElement(standardisationResponses: StandardisationResponseDetails,
        propsNames: any,
        seq: string,
        responseStatuses: Immutable.List<enums.ResponseStatus>,
        standardisationSetup: enums.StandardisationSetup): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            responseStatus: responseStatuses,
            progress: standardisationResponses.markingProgress,
            selectedLanguage: localeStore.instance.Locale,
            markGroupId: standardisationResponses.esMarkGroupId,
			isSubmitDisabled: false,
            standardisationSetupTab: standardisationSetup,
            stdResponseDetails: standardisationResponses
        };
        return React.createElement(MarkingProgress, componentProps);
    }

    /**
     * Show the AllPageAnnotationIndicator when the CC is on and marking is completed
     * blocking submission.
     * @param {ResponseBase} responseData
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    private getAllPageAnnotationIndicatorElement
        (responseData: StandardisationResponseDetails,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean = true): JSX.Element {

        let isForceAnnotationCCOn = this.getCCValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage,
            responseData.markSchemeGroupId);
        let markingProgress = responseData[propsNames.markingProgress];

        // we need to show this in tile view only if we 100% marked responses and
        // all page annotation cc is on.
        if (isForceAnnotationCCOn === 'true' && markingProgress === 100) {

            let componentProps: any;
            componentProps = {
                key: seq,
                id: seq,
                selectedLanguage: localeStore.instance.Locale,
                isAllAnnotated: responseData[propsNames.hasAllPagesAnnotated],
                isMarkingCompleted: ((showMarkingProgress ? responseData[propsNames.markingProgress] : 100) === 100) ? true : false,
                isTileView: false,
                markSchemeGroupId: responseData.markSchemeGroupId
            };

            let allPageElement = Immutable.List<JSX.Element>([React.createElement(allPageAnnotationIndicator, componentProps)]);
            return this.getWrappedColumn(allPageElement, 'col wl-slao-holder', seq + 'wrapped').columnElement;
        }
        return undefined;
    }


    /**
     * creating react element for the  getAllPageAnnotatedIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    private getAllFilesNotViewedIndicatorElement(responseData: StandardisationResponseDetails,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            allFilesViewed: responseData[propsNames.allFilesViewed],
            isMarkingCompleted: responseData[propsNames.markingProgress] === 100 ? true : false,
            isTileView: false,
            isECourseworkComponent: eCourseworkHelper.isECourseworkComponent
        };

        return React.createElement(allFilesNotViewedIndicator, componentProps);
    }

    /**
     * creating react element for the  Shared Response Indicator component
     * @param stdResponseData
     * @param seq
     */
    private getSharedResponseIndicatorElement(isSharedProvisional: boolean,
        seq: string,
        ): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isSharedProvisional: isSharedProvisional
        };
        return React.createElement(sharedResponseIndicatorElement, componentProps);
    }

    /**
     * creating react element for the  Shared Response Indicator component
     * @param stdResponseData
     * @param seq
     */
    private isCommonProvisionalStandardisationOn() {
      return this.getCCValue(configurableCharacteristicsNames.CommonProvisionalStandardisation,
            standardisationSetupStore.instance.markSchemeGroupId).toLowerCase() === 'true';
    }

    /**
     * Get restricted Classification types
     * which should be highlighted as amber when over classified.
     * @param markSchemeGroupId
     */
    public getRestrictedSSUTarget(markSchemeGroupId: number): immutable.List<enums.MarkingMode> {
        let restrictSSUTargetsCCValue =
            configurableCharacteristicsHelper.getCharacteristicValue('RestrictStandardisationSetupTargets', markSchemeGroupId);

        if (restrictSSUTargetsCCValue !== '') {
            let xmlHelperObj = new xmlHelper(restrictSSUTargetsCCValue);
            let restrictedTargetNodes = xmlHelperObj.getAllChildNodes();
            let restrictedTargets: immutable.List<enums.MarkingMode> = immutable.List<enums.MarkingMode>();
            if (restrictedTargetNodes) {
                // get targets which are restricted. exclude seed.
                for (var node = 0; node < restrictedTargetNodes.length; node++) {
                    switch (restrictedTargetNodes[node].firstChild.nodeValue) {
                        case 'Practice':
                            restrictedTargets =
                                immutable.List<enums.MarkingMode>(restrictedTargets.concat(enums.MarkingMode.Practice));
                            break;
                        case 'Standardisation':
                            restrictedTargets =
                                immutable.List<enums.MarkingMode>(restrictedTargets.concat(enums.MarkingMode.Approval));
                            break;
                        case 'STMStandardisation':
                            restrictedTargets =
                                immutable.List<enums.MarkingMode>(restrictedTargets.concat(enums.MarkingMode.ES_TeamApproval));
                            break;
                    }
                }
                return restrictedTargets;
            }
            return undefined;
        }
    }

    /**
     * Get Standardisation Setup Required Targets
     */
    public getStandardisationSetupRequiredTargets(): Immutable.List<enums.MarkingMode> {
        let standardisationSetupRequiredTargetsCCValue =
            configurableCharacteristicsHelper.getCharacteristicValue('StandardisationSetupRequiredTargets');

        if (standardisationSetupRequiredTargetsCCValue !== '') {
            let xmlHelperObj = new xmlHelper(standardisationSetupRequiredTargetsCCValue);
            let requiredTargetNodes = xmlHelperObj.getAllChildNodes();
            let requiredTargets: Immutable.List<enums.MarkingMode> = Immutable.List<enums.MarkingMode>();
            if (requiredTargetNodes) {
                // get targets which are restricted. exclude seed.
                for (var node = 0; node < requiredTargetNodes.length; node++) {
                    if (requiredTargetNodes[node].firstChild !== null) {
                        switch (requiredTargetNodes[node].firstChild.nodeValue) {
                            case 'Practice':
                                requiredTargets =
                                    Immutable.List<enums.MarkingMode>(requiredTargets.concat(enums.MarkingMode.Practice));
                                break;
                            case 'Standardisation':
                                requiredTargets =
                                    Immutable.List<enums.MarkingMode>(requiredTargets.concat(enums.MarkingMode.Approval));
                                break;
                            case 'STMStandardisation':
                                requiredTargets =
                                    Immutable.List<enums.MarkingMode>(requiredTargets.concat(enums.MarkingMode.ES_TeamApproval));
                                break;
                        }
                    }
                }
                return requiredTargets;
            }
            return undefined;
        }
    }

    /**
     * Check whether the specified target ov3erclassified
     * @param tabSelection
     * @param markingMode
     * @param rigOrder
     */
    public isSSUTargetsOverClassified(tabSelection: enums.StandardisationSetup,
        markingMode: enums.MarkingMode, rigOrder: number): boolean {

        // Hold the Restricted targets which should be highlighted when over classified.
        let restrictedSSUTargets =
            this.getRestrictedSSUTarget(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        let classificationSummaryTargetDetails: Immutable.List<standardisationTargetDetail> =
            standardisationSetupStore.instance.classificationSummaryTargetDetails;

        return tabSelection === enums.StandardisationSetup.ClassifiedResponse &&
            restrictedSSUTargets && restrictedSSUTargets.contains(markingMode) &&
            classificationSummaryTargetDetails.some(x => x.markingModeId === markingMode &&
                x.markingModeId !== enums.MarkingMode.Seeding &&
                x.count > x.target && rigOrder > x.target);
    }
}
export = StandardisationSetupHelperBase;
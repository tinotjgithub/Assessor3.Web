"use strict";
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var localeStore = require('../../../../stores/locale/localestore');
var enums = require('../../enums');
var GenericComponentWrapper = require('../genericcomponentwrapper');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var ColumnHeader = require('../../../worklist/shared/columnheader');
var gridColumnNames = require('../gridcolumnnames');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
var immutable = require('immutable');
var standardisationSetupGridColumnsJson = require('../../../utility/grid/standardisationsetupgridcolumns.json');
var blueBannerMessage = require('../../../standardisationsetup/shared/bluebanner');
var totalMark = require('../../../worklist/shared/totalmarkdetail');
var TagList = require('../../../response/responsescreen/taglist');
var stdResponseId = require('../../../standardisationsetup/shared/standardisationresponseid');
var LinkedMessageIndicator = require('../../../worklist/shared/linkedmessageindicator');
var LastUpdatedColumn = require('../../../worklist/shared/lastupdatedcolumn');
var scriptidgridelement = require('../../../standardisationsetup/shared/scriptidgridelement');
var standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');
var ecourseWorkHelper = require('../../ecoursework/ecourseworkhelper');
var RigOrder = require('../../../standardisationsetup/shared/rigorder');
var tagStore = require('../../../../stores/tags/tagstore');
var slaoAnnotationIndicator = require('../../../worklist/shared/slaoannotationindicator');
var MarkingProgress = require('../../../worklist/shared/markingprogress');
var marksColumn = require('../../../worklist/shared/markscolumn');
var allPageAnnotationIndicator = require('../../../worklist/shared/allpageannotationindicator');
var allFilesNotViewedIndicator = require('../../../worklist/shared/allfilesnotviewedindicator');
var eCourseworkHelper = require('../../ecoursework/ecourseworkhelper');
var submitHelper = require('../../submit/submithelper');
var DeclassifyButton = require('../../../standardisationsetup/declassifybutton');
var qigStore = require('../../../../stores/qigselector/qigstore');
var stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
var genericDate = require('../../../worklist/shared/genericdate');
var xmlHelper = require('../../../../utility/generic/xmlhelper');
var sortHelper = require('../../../../utility/sorting/sorthelper');
/**
 * class for WorkList Helper implementation
 */
var StandardisationSetupHelperBase = (function () {
    function StandardisationSetupHelperBase() {
        var _this = this;
        this._dateLengthInPixel = 0;
        this._isNonNumeric = false;
        /**
         * returns the blue banner element
         * @param selectedWorkList
         * @param targetCount
         * @param isESTeamMember
         * @param selectedSession
         */
        this.getBlueBannerForTargets = function (selectedWorkList, targetCount, isESTeamMember, selectedSession) {
            var componentProps;
            componentProps = {
                key: selectedWorkList + '_blueBanner',
                blueBannerMessageKey: _this.getRightContainerBlueBannerKey(selectedWorkList, targetCount, isESTeamMember, selectedSession)
            };
            return React.createElement(blueBannerMessage, componentProps);
        };
        /**
         * returns the blue banner message key for resource file
         * @param selectedWorkList
         * @param targetCount
         * @param isESTeamMember
         * @param selectedSession
         */
        this.getRightContainerBlueBannerKey = function (selectedWorkList, targetCount, isESTeamMember, selectedSession) {
            if (isESTeamMember === void 0) { isESTeamMember = false; }
            var key;
            switch (selectedWorkList) {
                case enums.StandardisationSetup.None:
                    key = 'standardisation-setup.right-container.select-response-bluebanner-message';
                    break;
                case enums.StandardisationSetup.SelectResponse:
                    if (selectedSession !== null && selectedSession !== undefined
                        && selectedSession === enums.StandardisationSessionTab.PreviousSession) {
                        key = 'standardisation-setup.right-container.select-response-previouse-session-empty-message';
                    }
                    else {
                        key = 'standardisation-setup.right-container.select-response-bluebanner-message';
                    }
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    key = targetCount > 0 ? 'standardisation-setup.right-container.provisional-bluebanner-message' :
                        'standardisation-setup.right-container.empty-responses-provisional-bluebanner-message';
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    var isSeedVisible = standardisationSetupStore.instance.stdSetupPermissionCCData ?
                        standardisationSetupStore.instance.stdSetupPermissionCCData.role.viewByClassification.classifications.seeding :
                        false;
                    // Check whether the logged in examiner role is present in the 'StandardisationSetupPermissions' CC
                    var isLoggedInExaminerRolePresentInCC = standardisationSetupStore.instance.stdSetupPermissionCCData.isLoggedInExaminerRolePresentInCC;
                    var loggedInExaminerRole = standardisationSetupStore.instance.stdSetupPermissionCCData.role.name;
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
        };
    }
    /**
     * Get the Configurable characteristic value.
     * @param ccName
     * @returns
     */
    StandardisationSetupHelperBase.prototype.getCCValue = function (ccName, markSchemeGroupId) {
        return configurableCharacteristicsHelper.getCharacteristicValue(ccName, markSchemeGroupId);
    };
    /**
     * Get Session tab visibilty in SSU
     */
    StandardisationSetupHelperBase.prototype.getSessionTabVisibiltyinSelectResponse = function () {
        return (configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ReuseRIG).toLowerCase() === 'true'
            && standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.reuseResponses);
    };
    /**
     * Get the retain provisional CC
     */
    StandardisationSetupHelperBase.prototype.isRetainProvisionalMarksCCOn = function () {
        return configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.RetainProvisionalMarks, standardisationSetupStore.instance.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
    };
    /**
     * generateStandardisationRowDefinion is used for generating row collection for WorkList Grid
     * @param comparerName
     * @param sortDirection
     * @param workListSelection
     * @param gridType
     */
    StandardisationSetupHelperBase.prototype.generateStandardisationRowDefinion = function (comparerName, sortDirection, workListSelection, gridType) {
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Generating Reusable response worklist grid row definition
     * @param reusableResponsesList
     */
    StandardisationSetupHelperBase.prototype.generateReusableResponsesRowDefinition = function (reusableResponsesList) {
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Generating frozen row body for reusable responses grid
     * @param reusableResponsesList
     */
    StandardisationSetupHelperBase.prototype.generateStandardisationFrozenRowBodyReusableGrid = function (reusableResponsesList, comparerName, sortDirection) {
        return this._stdWorkListFrozenRowBodyCollection;
    };
    /**
     * generateScriptRowDefinition is used for generating row collection for Select response Script Grid
     * @param standardisationScriptList
     */
    StandardisationSetupHelperBase.prototype.generateScriptRowDefinition = function (standardisationScriptList) {
        return this._stdSetUpWorkListCollection;
    };
    /**
     * GenerateTableHeader is used for generating header collection.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param gridType
     * @param selectedSessionTab
     * @param centreOrScript
     */
    StandardisationSetupHelperBase.prototype.generateTableHeader = function (standardisationSetupType, comparerName, sortDirection, gridType, selectedSessionTab, centreOrScript) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        var _tableHeaderCollection = this.getTableHeader(standardisationSetupType, comparerName, sortDirection, selectedSessionTab, gridType, centreOrScript);
        return _tableHeaderCollection;
    };
    /**
     * generateFrozenRowBody is used for generating row collection for Standardisation Setup Grid
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    StandardisationSetupHelperBase.prototype.generateFrozenRowBody = function (standardisationSetupDetailsList, standardisationSetupType, gridType, comparerName, sortDirection) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        var _workListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(standardisationSetupDetailsList, standardisationSetupType, gridType, comparerName, sortDirection);
        return _workListFrozenRowBodyCollection;
    };
    /**
     * Is used for generating row header collection for WorkList table
     * @param comparerName
     * @param sortDirection
     * @param standardisationSetupType
     * @param selectedSessionTab
     * @param isSortable
     */
    StandardisationSetupHelperBase.prototype.generateFrozenRowHeader = function (comparerName, sortDirection, standardisationSetupType, selectedSessionTab, isSortable) {
        if (selectedSessionTab === void 0) { selectedSessionTab = enums.StandardisationSessionTab.CurrentSession; }
        if (isSortable === void 0) { isSortable = true; }
        // Get the frozen column list from json
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(standardisationSetupGridColumnsJson);
        var _frozenRowHeaderCollection = this.getFrozenRowHeader(comparerName, sortDirection, isSortable, standardisationSetupType, selectedSessionTab);
        return _frozenRowHeaderCollection;
    };
    /**
     * Is used for generating frozen row body collection for STD WorkList table
     * @param standardisationResponseListData
     * @param standardisationSetupType
     * @param gridType
     */
    StandardisationSetupHelperBase.prototype.generateStandardisationFrozenRowBody = function (comparerName, sortDirection, standardisationSetupType, gridType) {
        return this._stdWorkListFrozenRowBodyCollection;
    };
    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getWrappedColumn = function (elements, className, seq) {
        var componentProps;
        var _workListCell;
        var _gridCell = new gridCell();
        var element;
        componentProps = {
            key: seq,
            divClassName: className,
            componentList: elements
        };
        _workListCell = new gridCell();
        _workListCell.columnElement = React.createElement(GenericComponentWrapper, componentProps);
        return _workListCell;
    };
    /**
     * creating grid columns collection
     * @param gridgridLeftColumn
     * @param gridMiddleColumn
     * @param key
     * @param gridRightColumn - to display AMD and TMD based on Accuracy Indicator
     * @returns grid cell collection.
     */
    StandardisationSetupHelperBase.prototype.getGridCells = function (gridgridLeftColumn, gridMiddleColumn, key, gridRightColumn) {
        var _gridCells = new Array();
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridgridLeftColumn), 'col left-col', 'Grid_left_' + key));
        _gridCells.push(this.getWrappedColumn(Immutable.List(gridMiddleColumn), 'col centre-col', 'Grid_centre_' + key));
        // create column for AMD and TMD only if gridRightColumn is not null
        if (gridRightColumn !== null) {
            _gridCells.push(this.getWrappedColumn(Immutable.List(gridRightColumn), 'col right-col', 'Grid_right_' + key));
        }
        return _gridCells;
    };
    /**
     * Group the elements based on the classNames.
     * @param {string} groupClassName
     * @param {string} seq
     * @returns the grouped JSX.Element.
     * @Summary groupClassName is the root element className and the column list may contain
     * the key same as groupClassName. Then that will not group the elements instead add it as
     * immediate child node.
     */
    StandardisationSetupHelperBase.prototype.groupColumnElements = function (groupClassName, seq) {
        var elements = Immutable.List();
        // loop through the class group names to find the child and group.
        for (var key in this._groupColumns) {
            if (this._groupColumns[key].values) {
                var componentProps_1 = {
                    id: this._groupColumns[key] + seq,
                    key: this._groupColumns[key] + seq,
                    divClassName: key,
                    componentList: this._groupColumns[key].values
                };
                // If the key same as main group className then we dont need to create a childnode.
                // treating it as immediate child of the main element.
                if (key !== groupClassName) {
                    elements = elements.push(React.createElement(GenericComponentWrapper, componentProps_1));
                }
                else {
                    this._groupColumns[key].values.map(function (x) {
                        elements = elements.push(x);
                    });
                }
            }
        }
        var componentProps = {
            id: groupClassName + seq,
            key: groupClassName + seq,
            divClassName: groupClassName,
            componentList: elements
        };
        return React.createElement(GenericComponentWrapper, componentProps);
    };
    /**
     * Start with fresh group.
     */
    StandardisationSetupHelperBase.prototype.emptyGroupColumns = function () {
        // start with a fresh list of column group set.
        this._groupColumns = {};
    };
    Object.defineProperty(StandardisationSetupHelperBase.prototype, "groupColumns", {
        /**
         * Return the group columns
         * @returns
         */
        get: function () {
            return this._groupColumns;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Mapping the each elements to a group.
     * This add the elements to a dictionary which has className as key
     * and list of elements that  grouped under the className.
     * @param {string} className
     * @param {JSX.Element} element
     */
    StandardisationSetupHelperBase.prototype.mapGroupColumns = function (className, element) {
        // If not group class has been added create a new object
        // otherwise add to the existing.
        if (this._groupColumns[className] === undefined) {
            this._groupColumns[className] = { values: Immutable.List() };
        }
        this._groupColumns[className].values = this._groupColumns[className].values.push(element);
    };
    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    StandardisationSetupHelperBase.prototype.getColumnHeaderElement = function (seq, headerText, gridColumn, isCurrentSort, isSortRequired, sortDirection) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            headerText: headerText,
            sortDirection: sortDirection,
            isCurrentSort: isCurrentSort,
            isSortingRequired: isSortRequired
        };
        return React.createElement(ColumnHeader, componentProps);
    };
    /**
     * returns the table row collection for table header.
     * @param standardisationSetupType
     * @param comparerName
     * @param sortDirection
     * @param selectedSessionTab
     * @param gridType
     * @param centreOrScript
     */
    StandardisationSetupHelperBase.prototype.getTableHeader = function (standardisationSetupType, comparerName, sortDirection, selectedSessionTab, gridType, centreOrScript) {
        if (selectedSessionTab === void 0) { selectedSessionTab = enums.StandardisationSessionTab.CurrentSession; }
        var _columnHeaderCollection = Array();
        var _cell;
        var _row = new gridRow();
        var _columnHeaderCellcollection = new Array();
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, standardisationSetupType, false, gridType, selectedSessionTab, centreOrScript);
        var gridColumnLength = gridColumns.length;
        this.resetDynamicColumnSettings();
        // Getting the classified worklist columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _cell = new gridCell();
            var _responseColumn = gridColumns[gridColumnCount].GridColumn;
            var headerText = gridColumns[gridColumnCount].ColumnHeader;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var key = 'columnHeader_' + gridColumnCount;
            var isCurrentSort = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                undefined : (comparerName === _comparerName);
            var isSortRequired = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                false : (gridColumns[gridColumnCount].Sortable === 'true');
            var currentSortDirection = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
                undefined : sortDirection;
            _cell.columnElement = this.getColumnHeaderElement(key, headerText, _responseColumn, isCurrentSort, isSortRequired, currentSortDirection);
            _cell.isHidden = this.getCellVisibility(_responseColumn);
            // No sort for classification
            if (standardisationSetupType !== enums.StandardisationSetup.ClassifiedResponse) {
                _cell.comparerName = _comparerName;
                _cell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);
            }
            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _cell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _columnHeaderCellcollection.push(_cell);
        }
        // Get Dynamic Headers for Individual question when Mark By question view selected
        if (gridType === enums.GridType.markByQuestion) {
            var standardisationResponseListData = Immutable.List(standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses);
            _columnHeaderCellcollection.concat(this.getDynamicHeadersForMarks(standardisationResponseListData, _columnHeaderCellcollection));
            if (standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse &&
                (standardisationSetupStore.instance.stdSetupPermissionCCData &&
                    standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                this.isRetainProvisionalMarksCCOn() &&
                !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                var key = 'columnHeader_Declassify';
                var cellStyle = 'last-cell-header';
                _cell = new gridCell();
                // create question header element for each question.
                _cell.columnElement = this.getColumnHeaderElement(key, '', undefined, undefined, false, undefined);
                _cell.isHidden = false;
                _cell.setCellStyle(cellStyle);
                // Creating the grid row collection.
                _columnHeaderCellcollection.push(_cell);
            }
            else {
                //Adding the 'last-cell' column as this column is not added to classified worklst by default
                var key = 'columnHeader_Declassify';
                var cellStyle = 'last-cell-header';
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
        var _standardisationTableHeaderCollection = Immutable.fromJS(_columnHeaderCollection);
        return _standardisationTableHeaderCollection;
    };
    /**
     * returns the table row collection of frozen table
     * @param standardisationSetupDetailsList
     * @param standardisationSetupType
     */
    StandardisationSetupHelperBase.prototype.getFrozenRowBodyForListView = function (standardisationSetupDetailsList, standardisationSetupType, gridType, comparerName, sortDirection) {
        var _rowHeaderCellcollection = Array();
        var _row;
        var _rowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _cell;
        var key;
        var cssClass;
        var submitResponse = new submitHelper();
        if (standardisationSetupDetailsList != null) {
            var gridSeq = void 0;
            var _responseListData = void 0;
            var gridColumns = void 0;
            var gridRowIdColumn = void 0;
            switch (standardisationSetupType) {
                case enums.StandardisationSetup.SelectResponse:
                    if (standardisationSetupDetailsList.standardisationScriptDetailsList) {
                        gridSeq = standardisationSetupDetailsList.standardisationScriptDetailsList.centreScriptList.keySeq();
                        _responseListData = standardisationSetupDetailsList.standardisationScriptDetailsList.centreScriptList.toArray();
                        gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, standardisationSetupType, true, null, enums.StandardisationSessionTab.CurrentSession, 'Script');
                        gridRowIdColumn = 'candidateScriptId';
                    }
                    else {
                        return;
                    }
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    _responseListData = standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses;
                    var sortedData = void 0;
                    sortedData = Immutable.List(sortHelper.sort(_responseListData, comparerList[comparerName]));
                    _responseListData = sortedData.toArray();
                    gridSeq = Immutable.List(_responseListData).keySeq();
                    gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, standardisationSetupType, true, gridType);
                    break;
                case enums.StandardisationSetup.None:
                    break;
            }
            for (var responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the list data row
                _row = new gridRow();
                _rowHeaderCellcollection = new Array();
                var responseData = _responseListData[responseListCount];
                var gridColumnLength = gridColumns.length;
                var responseStatuses = submitResponse.submitButtonValidate(responseData, responseData.markingProgress, false, false);
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _cell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns.
                    switch (_responseColumn) {
                        case gridColumnNames.ScriptId:
                            key = gridSeq.get(responseListCount) + '_ScriptId_' + gridColumnCount;
                            _cell.columnElement = this.getScriptIdElement(responseData, componentPropsJson, key, (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.script-id')
                                + ' '), true);
                            _cell.setCellStyle('col-script-id header-col');
                            _rowHeaderCellcollection.push(_cell);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _cell.columnElement = this.getResponseIdColumnElement(responseData, key, true);
                            _cell.setCellStyle('col-response header-col');
                            _rowHeaderCellcollection.push(_cell);
                            break;
                    }
                }
                // Creating the table row collection.
                _rowCollection.push(this.getGridRow(responseData[gridRowIdColumn], _rowHeaderCellcollection, undefined, cssClass, responseStatuses));
            }
        }
        var _frozenRowBodyCollection = Immutable.fromJS(_rowCollection);
        return _frozenRowBodyCollection;
    };
    /**
     * get Script Id Element
     * @param standardisationScriptDetails
     * @param propsNames
     * @param seq
     * @param displayText
     * @param isScriptIdClickable
     */
    StandardisationSetupHelperBase.prototype.getScriptIdElement = function (standardisationScriptDetails, propsNames, seq, displayText, isScriptIdClickable) {
        if (isScriptIdClickable === void 0) { isScriptIdClickable = true; }
        var componentProps;
        var _displayText;
        _displayText = standardisationScriptDetails[propsNames.ScriptId];
        componentProps = {
            key: seq,
            id: seq,
            displayId: standardisationScriptDetails[propsNames.ScriptId],
            displayText: _displayText,
            isClickable: isScriptIdClickable
        };
        return React.createElement(scriptidgridelement, componentProps);
    };
    /**
     * returns the table row elements for frozen table header
     * @param comparerName
     * @param sortDirection
     * @param isSortable
     * @param standardisationSetupType
     * @param selectedTab
     */
    StandardisationSetupHelperBase.prototype.getFrozenRowHeader = function (comparerName, sortDirection, isSortable, standardisationSetupType, selectedSessionTab) {
        var _columnHeaderCollection = Array();
        var _row = new gridRow();
        var _columnHeaderCellcollection = new Array();
        var _comparerName;
        var _gridColumnName = '';
        var _cellStyle = '';
        switch (standardisationSetupType) {
            case enums.StandardisationSetup.SelectResponse:
                switch (selectedSessionTab) {
                    case enums.StandardisationSessionTab.CurrentSession:
                        _comparerName = comparerList.stdScriptIdComparer;
                        _gridColumnName = localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.script-id');
                        _cellStyle = 'col-script-id header-col';
                        // Creating the grid row collection.
                        _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName, _cellStyle, comparerName, isSortable, _comparerName, sortDirection));
                        break;
                    case enums.StandardisationSessionTab.PreviousSession:
                        var _cell = void 0;
                        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, enums.StandardisationSetup.SelectResponse, true, null, enums.StandardisationSessionTab.PreviousSession);
                        var gridColumnLength = gridColumns.length;
                        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                            _cell = new gridCell();
                            var key = 'frozenRowHeader_' + gridColumnCount;
                            var currentComparer = gridColumns[gridColumnCount].ComparerName;
                            var isSortRequired = gridColumns[gridColumnCount].Sortable === 'true';
                            var headerText = gridColumns[gridColumnCount].ColumnHeader;
                            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
                            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                            // Creating the grid row collection.
                            _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, headerText, cellStyle, comparerName, isSortRequired, comparerList[currentComparer], sortDirection));
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
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, '', 'col-std-classify-items header-col', '', false));
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName, _cellStyle, '', false));
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                _comparerName = comparerList.responseIdComparer;
                _gridColumnName =
                    localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.response-id');
                _cellStyle = 'col-response header-col';
                // Creating the grid row collection.
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName, _cellStyle, comparerName, isSortable, _comparerName, sortDirection));
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                _gridColumnName =
                    localeStore.instance.
                        TranslateText('standardisation-setup.standardisation-setup-worklist.total-mark-view-column-headers.response-id');
                _cellStyle = 'col-response header-col';
                _comparerName = comparerList.responseIdComparer;
                // Creating the grid row collection.
                _columnHeaderCellcollection.push(this.setFrozenColumnHeaders(standardisationSetupType, _gridColumnName, _cellStyle, comparerName, isSortable, _comparerName, sortDirection));
                break;
            case enums.StandardisationSetup.None:
                break;
        }
        _row.setRowId(1);
        _row.setCells(_columnHeaderCellcollection);
        _columnHeaderCollection.push(_row);
        var _frozenRowHeaderCollection = Immutable.fromJS(_columnHeaderCollection);
        return _frozenRowHeaderCollection;
    };
    /**
     * Setting frozen header columns (Rig order empty column/Response Id for Classifed)
     * @param columnHeader
     * @param cellStyle
     */
    StandardisationSetupHelperBase.prototype.setFrozenColumnHeaders = function (standardisationSetupType, columnHeader, cellStyle, currentComparer, isSortable, _comparerName, sortDirection) {
        var _cell;
        _cell = new gridCell();
        var key = 'frozenRowHeader';
        var isCurrentSort = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
            undefined : (comparerList[currentComparer] === _comparerName);
        var isSortRequired = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
            false : isSortable;
        var currentSortDirection = standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse ?
            undefined : sortDirection;
        //TODO : Move the magic strings outside (json?)
        _cell.columnElement = this.getColumnHeaderElement(key, columnHeader, '', isCurrentSort, isSortRequired, currentSortDirection);
        if (standardisationSetupType !== enums.StandardisationSetup.ClassifiedResponse) {
            _cell.comparerName = comparerList[_comparerName];
            _cell.sortDirection = this.getSortDirection((comparerList[currentComparer] === _comparerName), sortDirection);
        }
        _cell.setCellStyle(cellStyle);
        return _cell;
    };
    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param resolvedGridColumnsJson
     * @param standardisationSetupType
     * @param isFrozen
     * @param selectedSessionTab
     * @param centreOrScript
     */
    StandardisationSetupHelperBase.prototype.getGridColumns = function (resolvedGridColumnsJson, standardisationSetupType, isFrozen, gridType, selectedSessionTab, centreOrScript) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        switch (standardisationSetupType) {
            case enums.StandardisationSetup.SelectResponse:
                if (selectedSessionTab === enums.StandardisationSessionTab.CurrentSession) {
                    if (centreOrScript === 'Script') {
                        gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.standardisationsetup.SelectResponse.Script.GridColumns
                            : resolvedGridColumnsJson.standardisationsetup.SelectResponse.FrozenRows.GridColumns;
                    }
                    else {
                        gridColumns = resolvedGridColumnsJson.standardisationsetup.SelectResponse.Centre.GridColumns;
                    }
                }
                else if (selectedSessionTab === enums.StandardisationSessionTab.PreviousSession) {
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
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    StandardisationSetupHelperBase.prototype.getCellVisibility = function (column) {
        if (ecourseWorkHelper.isECourseworkComponent && column === 'FirstScanned') {
            return true;
        }
        if (!(configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false) && column === 'QuestionItems') {
            return true;
        }
        return false;
    };
    /**
     * Reset dynamic column
     */
    StandardisationSetupHelperBase.prototype.resetDynamicColumnSettings = function () {
        this._dateLengthInPixel = 0;
    };
    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    StandardisationSetupHelperBase.prototype.getSortDirection = function (isCurrentSort, sortDirection) {
        return ((isCurrentSort === true) ?
            ((sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending)
            : enums.SortDirection.Ascending);
    };
    /**
     * Get the text value for Grid Column
     * @param textValue
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getGenericTextElement = function (textValue, seq, title) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            title: title
        };
        return React.createElement(GenericTextColumn, componentProps);
    };
    /**
     * Get the Formatted date element.
     * @param value
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getGenericFormattedDateElement = function (value, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            dateValue: new Date(value.toString()),
            className: 'dim-text txt-val small-text'
        };
        return React.createElement(genericDate, componentProps);
    };
    /**
     * Get the Converted text value for Grid Column
     *  @param textValue
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getConvertTextElement = function (textValue, seq) {
        var componentProps;
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
    };
    /**
     * Get the Marks Grid Column
     * @param textValue
     * @param seq
     * @param usedInTotal
     */
    StandardisationSetupHelperBase.prototype.getMarksColumn = function (textValue, seq, usedInTotal) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue,
            usedInTotal: usedInTotal
        };
        return React.createElement(marksColumn, componentProps);
    };
    /**
     * creating react element for the  TotalMark component
     * @param mark
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getTotalMarkElement = function (mark, seq) {
        var componentProps;
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
    };
    /**
     * returns the Selected Tag Id of response.
     * @param seq
     * @param tagId
     * @param tagList
     * @param markGroupId
     */
    StandardisationSetupHelperBase.prototype.getTag = function (seq, tagId, tagList, markGroupId, markingMode) {
        var componentProps;
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
    };
    /**
     * creating react element for the  ResponseIdColumn component
     * @param stdResponseData
     * @param seq
     * @param isResponseIdClickable
     */
    StandardisationSetupHelperBase.prototype.getResponseIdColumnElement = function (stdResponseData, seq, isResponseIdClickable) {
        if (isResponseIdClickable === void 0) { isResponseIdClickable = true; }
        var componentProps;
        var displayId = stdResponseData.displayId;
        componentProps = {
            key: seq,
            id: seq,
            displayId: displayId.toString(),
            isResponseIdClickable: isResponseIdClickable,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(stdResponseId, componentProps);
    };
    /**
     * creating react element for the  LinkedMessagrIndicator component
     * @param responseData
     * @param propsNames
     * @param seq
     * @param isTileView
     */
    StandardisationSetupHelperBase.prototype.getLinkedMessageElement = function (responseData, propsNames, seq, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * creating react element for the  Last updated component
     * @param lastUpdatedDate
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getLastUpdatedElement = function (stdResponseData, propsNames, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            dateType: enums.WorkListDateType.lastUpdatedDate,
            dateValue: new Date(stdResponseData[propsNames.updatedDate]),
            isTileView: false
        };
        return React.createElement(LastUpdatedColumn, componentProps);
    };
    /**
     * create react element for declassify button
     * @param title
     * @param anchorclassName
     * @param spanclassName
     * @param seq
     */
    StandardisationSetupHelperBase.prototype.getDeclassifyButtonElement = function (title, anchorclassName, spanclassName, seq, displayId, totalMarkValue, candidateScriptId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder) {
        var componentProps;
        componentProps = {
            title: title,
            id: seq,
            anchorclassName: anchorclassName,
            spanclassName: spanclassName,
            displayId: displayId,
            totalMarkValue: totalMarkValue,
            candidateScriptId: candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            markingModeId: markingModeId,
            rigOrder: rigOrder
        };
        return React.createElement(DeclassifyButton, componentProps);
    };
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
    StandardisationSetupHelperBase.prototype.getGridRow = function (uniqueId, gridCells, additionalComponent, cssClass, responseStatus, overClassified) {
        var _gridRow = new gridRow();
        var className = this.setRowStyle(responseStatus, overClassified);
        className = (cssClass) ? (className + ' ' + cssClass) : className;
        _gridRow.setRowStyle(className);
        _gridRow.setRowId(parseFloat(uniqueId));
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        return _gridRow;
    };
    /**
     * Set row style to amber if the response has blocking exceptions or other reasons
     * @param {Immutable.List<enums.ResponseStatus>} responseStatus
     * @returns {string}
     * @memberof StandardisationSetupHelperBase
     */
    StandardisationSetupHelperBase.prototype.setRowStyle = function (responseStatus, overClassified) {
        // Check whetehr the classifcation type exceeded the current target,
        // if so highlight the exceeded last rows with amber color.
        if ((responseStatus && (responseStatus.contains(enums.ResponseStatus.hasException) ||
            responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
            responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ||
            responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
            responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected) ||
            responseStatus.contains(enums.ResponseStatus.notAllFilesViewed))) || overClassified) {
            return 'row warning-alert';
        }
        else {
            return 'row';
        }
    };
    /**
     * Generate Centre Row Definition
     * @param standardisationCentreList
     */
    StandardisationSetupHelperBase.prototype.generateCentreRowDefinition = function (standardisationCentreList) {
        return this._stdSetUpWorkListCollection;
    };
    /**
     * Return the dynamic headers for questions
     * @param standardisationResponseListData
     * @param _columnHeaderCellcollection
     */
    StandardisationSetupHelperBase.prototype.getDynamicHeadersForMarks = function (standardisationResponseListData, _columnHeaderCellcollection) {
        // Get the Standardisation marks for the response if exist.
        var _stdMarksData = standardisationResponseListData.first().standardisationMarks;
        var questionsCount = _stdMarksData.length;
        var _cell;
        // iterate through each questions and get the display label.
        for (var questionItemCount = 0; questionItemCount < questionsCount; questionItemCount++) {
            _cell = new gridCell();
            var headerText = _stdMarksData[questionItemCount].displayLabel;
            var _comparerName = '';
            headerText = (headerText && headerText !== '') ? headerText : '';
            var key = 'columnHeader_' + questionItemCount;
            // create question header element for each question.
            _cell.columnElement = this.getColumnHeaderElement(key, headerText, undefined, undefined, false, undefined);
            _cell.isHidden = false;
            _cell.comparerName = _comparerName;
            var cellStyle = 'col-question-item';
            _cell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _columnHeaderCellcollection.push(_cell);
        }
        return _columnHeaderCellcollection;
    };
    /**
     * Get Dynamic Value For Marks
     * @param gridSeq
     * @param stdResponseData
     * @param _stdRowHeaderCellcollection
     * @param index
     */
    StandardisationSetupHelperBase.prototype.getDynamicValueForMarks = function (stdResponseData, _stdRowHeaderCellcollection, index) {
        var _stdGridCell;
        var key;
        // Get the Standardisation marks for the response if exist.
        var stdMarks = stdResponseData.standardisationMarks;
        var noOfQuestions = stdMarks.length;
        var mark;
        var usedInTotal;
        // Getting the Marks Data
        for (var questionItemCount = 0; questionItemCount < noOfQuestions; questionItemCount++) {
            _stdGridCell = new gridCell();
            key = index + '_Questions_' + questionItemCount;
            mark = isNaN(parseInt(stdMarks[questionItemCount].mark.toString())) ?
                stdMarks[questionItemCount].mark : parseInt(stdMarks[questionItemCount].mark.toString());
            usedInTotal = stdMarks[questionItemCount].usedInTotal;
            _stdGridCell.columnElement = this.getMarksColumn(mark, key, usedInTotal);
            _stdGridCell.isHidden = false;
            var cellStyle = 'col-question-item';
            _stdGridCell.setCellStyle(cellStyle);
            _stdRowHeaderCellcollection.push(_stdGridCell);
        }
        return _stdRowHeaderCellcollection;
    };
    /**
     * Method to create Frozen Body Data for different std worklists.
     * @param stdResponseData
     * @param gridSeq
     * @param gridType
     */
    StandardisationSetupHelperBase.prototype.getFrozenRowData = function (stdResponseData, gridType, gridColumns, index, overClassified) {
        var _stdWorkListRowHeaderCellcollection = Array();
        var _stdWorkListCell;
        var key;
        var cellStyle;
        var _stdResponseColumn;
        var componentPropsJson;
        var gridColumnLength = gridColumns.length;
        var submitResponse = new submitHelper();
        var responseStatuses = submitResponse.submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);
        // Set rig order as "Seed" for seed responses.
        var isSeed = (stdResponseData.markingModeId === enums.MarkingMode.Seeding);
        // Getting the STD worklist columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
            _stdWorkListCell = new gridCell();
            componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
            //Switch statement for adding frozen columns in future.
            switch (_stdResponseColumn) {
                case gridColumnNames.RigOrderColumn:
                    key = index + '_RigOrderColumn_' + gridColumnCount;
                    var className = 'dim-text small-text classify-index';
                    _stdWorkListCell.columnElement = this.getRIGOrderColumnElement(key, className, undefined, isSeed ? 'Seed' : stdResponseData.rigOrder.toString());
                    cellStyle = 'col-std-classify-items header-col';
                    break;
                case gridColumnNames.ResponseIdColumn:
                    key = index + '_ResponseIdColumn_' + gridColumnCount;
                    _stdWorkListCell.columnElement = this.getResponseIdColumnElement(stdResponseData, key, true);
                    cellStyle = 'col-response header-col';
                    break;
            }
            _stdWorkListCell.setCellStyle(cellStyle);
            _stdWorkListRowHeaderCellcollection.push(_stdWorkListCell);
        }
        // Return the table row.
        return this.getGridRow(stdResponseData.displayId.toString(), _stdWorkListRowHeaderCellcollection, undefined, undefined, responseStatuses, overClassified);
    };
    /**
     * Method to return ufrozen row data for different type.
     * @param stdResponseListData
     * @param gridColumns
     * @param gridSeq
     * @param gridType
     */
    StandardisationSetupHelperBase.prototype.getRowData = function (stdResponseListData, gridColumns, gridType, index, standardisationSetupType) {
        var _this = this;
        var stdGridRowCollection = Array();
        var submitResponse = new submitHelper();
        // Loop through each response
        stdResponseListData.map(function (stdResponseData) {
            var stdGridRowHeaderCellcollection = Array();
            var _stdResponseColumn;
            var componentPropsJson;
            var _stdGridCell;
            var key;
            var responseStatuses = submitResponse.submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);
            // Getting the worklist columns
            for (var gridColumnCount = 0; gridColumnCount < gridColumns.length; gridColumnCount++) {
                _stdResponseColumn = gridColumns[gridColumnCount].GridColumn;
                componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                _stdGridCell = new gridCell();
                switch (_stdResponseColumn) {
                    case gridColumnNames.ScriptId:
                        key = index + '_ScriptId_' + gridColumnCount;
                        var candidateScriptId = '1' + stdResponseData.candidateScriptId.toString();
                        _stdGridCell.columnElement = _this.getGenericTextElement(candidateScriptId, key);
                        break;
                    case gridColumnNames.Centre:
                        key = index + '_Centre_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getGenericTextElement(stdResponseData.centreNumber, key);
                        break;
                    case gridColumnNames.CentreCandidateNum:
                        key = index + '_Candidate_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getGenericTextElement(stdResponseData.centreCandidateNumber, key);
                        break;
                    case gridColumnNames.MarksColumn:
                        key = index + '_Marks_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getTotalMarkElement(stdResponseData.totalMarkValue, key);
                        break;
                    case gridColumnNames.LastMarkerColumn:
                        key = index + '_LastMarker_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getGenericTextElement(stringFormatHelper.getFormattedExaminerName(stdResponseData.lastMarkerInitials, stdResponseData.lastMarkerSurname), key);
                        break;
                    case gridColumnNames.NoteColumn:
                        key = index + '_Note_' + gridColumnCount;
                        var title = stdResponseData.note;
                        _stdGridCell.columnElement = _this.getGenericTextElement(stdResponseData.note, key, title);
                        break;
                    case gridColumnNames.LinkedMessageIndicator:
                        key = index + '_LinkedMessage_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getLinkedMessageElement(stdResponseData, componentPropsJson, key, false);
                        break;
                    case gridColumnNames.TagIndicator:
                        key = index + '_TagIndicator_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getTag(key, stdResponseData.tagId, tagStore.instance.tags, stdResponseData.esMarkGroupId, stdResponseData.markingModeId);
                        break;
                    case gridColumnNames.LastUpdatedColumn:
                        key = index + '_LastUpdated_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getLastUpdatedElement(stdResponseData, componentPropsJson, key);
                        break;
                    case gridColumnNames.Status:
                        responseStatuses = submitResponse.submitButtonValidate(stdResponseData, stdResponseData.markingProgress, false, false);
                        key = index + '_Status_' + gridColumnCount;
                        _stdGridCell.columnElement = _this.getMarkingProgressElement(stdResponseData, componentPropsJson, key, responseStatuses, standardisationSetupType);
                        break;
                    case gridColumnNames.DeClassifyColumn:
                        if ((standardisationSetupStore.instance.stdSetupPermissionCCData &&
                            standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                            _this.isRetainProvisionalMarksCCOn() &&
                            !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                            key = index + '_DeClassify_' + gridColumnCount;
                            _stdGridCell.columnElement = _this.getDeclassifyButtonElement('Declassify', 'close-icon-link', 'close-icon', key, stdResponseData.displayId, stdResponseData.totalMarkValue, stdResponseData.candidateScriptId, stdResponseData.esCandidateScriptMarkSchemeGroupId, stdResponseData.markingModeId, stdResponseData.rigOrder);
                        }
                        else {
                            //Adding the 'last-cell' column as this column is not added to classified worklst by default
                            key = index + '_DeClassify_' + gridColumnCount;
                        }
                        break;
                    case gridColumnNames.SLAOIndicator:
                        key = index + '_SLAOIndicator_' + gridColumnCount;
                        _stdGridCell.columnElement = (_this.getSLAOIndicatorElementForStandardisationResponses(stdResponseData, componentPropsJson, key, true, false));
                        break;
                    case gridColumnNames.AllPageAnnotedIndicator:
                        key = index + '_AllPageAnnotated_' + gridColumnCount;
                        // Create annotation indicator element.
                        _stdGridCell.columnElement = _this.getAllPageAnnotationIndicatorElement(stdResponseData, componentPropsJson, key);
                        break;
                    case gridColumnNames.AllFilesNotViewedIndicator:
                        key = index + '_AllFilesNotViewed_' + gridColumnCount;
                        // Create annotation indicator element.
                        _stdGridCell.columnElement = _this.getAllFilesNotViewedIndicatorElement(stdResponseData, componentPropsJson, key);
                        break;
                    default:
                }
                _stdGridCell.isHidden = _this.getCellVisibility(_stdResponseColumn);
                var cellStyle = gridColumns[gridColumnCount].CssClass
                    ? gridColumns[gridColumnCount].CssClass
                    : '';
                _stdGridCell.setCellStyle(cellStyle);
                stdGridRowHeaderCellcollection.push(_stdGridCell);
            }
            // Get individual question's marks if Mark by question view.
            if (gridType === enums.GridType.markByQuestion) {
                stdGridRowHeaderCellcollection.concat(_this.getDynamicValueForMarks(stdResponseData, stdGridRowHeaderCellcollection, index));
                if (standardisationSetupType === enums.StandardisationSetup.ClassifiedResponse &&
                    (standardisationSetupStore.instance.stdSetupPermissionCCData &&
                        standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.declassify) &&
                    _this.isRetainProvisionalMarksCCOn() &&
                    !qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) {
                    _stdGridCell = new gridCell();
                    key = index + '_DeClassify_' + stdGridRowHeaderCellcollection.length + 1;
                    _stdGridCell.columnElement = _this.getDeclassifyButtonElement('Declassify', 'close-icon-link', 'close-icon', key, stdResponseData.displayId, stdResponseData.totalMarkValue, stdResponseData.candidateScriptId, stdResponseData.esCandidateScriptMarkSchemeGroupId, stdResponseData.markingModeId, stdResponseData.rigOrder);
                    _stdGridCell.isHidden = _this.getCellVisibility(_stdResponseColumn);
                    var cellStyle = 'last-cell col-declassify';
                    _stdGridCell.setCellStyle(cellStyle);
                    stdGridRowHeaderCellcollection.push(_stdGridCell);
                }
                else {
                    //Adding the 'last-cell' column as this column is not added to classified worklst by default
                    _stdGridCell = new gridCell();
                    key = index + '_DeClassify_' + stdGridRowHeaderCellcollection.length + 1;
                    _stdGridCell.isHidden = _this.getCellVisibility(_stdResponseColumn);
                    var cellStyle = 'last-cell';
                    _stdGridCell.setCellStyle(cellStyle);
                    stdGridRowHeaderCellcollection.push(_stdGridCell);
                }
            }
            // Check whetehr the classifcation type exceeded the current target,
            // if so highlight the exceeded last rows with amber color.
            // Applicable for Classified Worklist
            var overClassified = _this.isSSUTargetsOverClassified(standardisationSetupType, stdResponseData.markingModeId, stdResponseData.rigOrder);
            // Creating the grid row collection.
            stdGridRowCollection.push(_this.getGridRow(stdResponseData.displayId.toString(), stdGridRowHeaderCellcollection, undefined, undefined, responseStatuses, overClassified));
            index++;
        });
        // Return the STD Set up row collection for Unfrozen data.
        return stdGridRowCollection;
    };
    /**
     * Creating react element for the  RIG Order Column component
     * @param seq
     * @param className
     * @param classificationType
     * @param rigOrder
     */
    StandardisationSetupHelperBase.prototype.getRIGOrderColumnElement = function (seq, className, classificationType, rigOrder) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            classificationType: classificationType,
            rigOrder: rigOrder,
            className: className
        };
        return React.createElement(RigOrder, componentProps);
    };
    /**
     * creating react element for the  getSLAOIndicatorElement component
     * @param standardisationScriptDetails
     * @param propsNames
     * @param seq
     * @param showMarkingProgress
     * @param isTileView
     */
    StandardisationSetupHelperBase.prototype.getSLAOIndicatorElement = function (standardisationScriptDetails, propsNames, seq, showMarkingProgress, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
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
    StandardisationSetupHelperBase.prototype.getSLAOIndicatorElementForStandardisationResponses = function (standardisationResponseDetails, propsNames, seq, showMarkingProgress, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * Creating react element for the  MarkingProgress component.
     * @param standardisationResponses
     * @param propsNames
     * @param seq
     * @param responseStatuses
     * @param standardisationSetup
     */
    StandardisationSetupHelperBase.prototype.getMarkingProgressElement = function (standardisationResponses, propsNames, seq, responseStatuses, standardisationSetup) {
        var componentProps;
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
    };
    /**
     * Show the AllPageAnnotationIndicator when the CC is on and marking is completed
     * blocking submission.
     * @param {ResponseBase} responseData
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    StandardisationSetupHelperBase.prototype.getAllPageAnnotationIndicatorElement = function (responseData, propsNames, seq, showMarkingProgress) {
        if (showMarkingProgress === void 0) { showMarkingProgress = true; }
        var isForceAnnotationCCOn = this.getCCValue(configurableCharacteristicsNames.ForceAnnotationOnEachPage, responseData.markSchemeGroupId);
        var markingProgress = responseData[propsNames.markingProgress];
        // we need to show this in tile view only if we 100% marked responses and
        // all page annotation cc is on.
        if (isForceAnnotationCCOn === 'true' && markingProgress === 100) {
            var componentProps = void 0;
            componentProps = {
                key: seq,
                id: seq,
                selectedLanguage: localeStore.instance.Locale,
                isAllAnnotated: responseData[propsNames.hasAllPagesAnnotated],
                isMarkingCompleted: ((showMarkingProgress ? responseData[propsNames.markingProgress] : 100) === 100) ? true : false,
                isTileView: false,
                markSchemeGroupId: responseData.markSchemeGroupId
            };
            var allPageElement = Immutable.List([React.createElement(allPageAnnotationIndicator, componentProps)]);
            return this.getWrappedColumn(allPageElement, 'col wl-slao-holder', seq + 'wrapped').columnElement;
        }
        return undefined;
    };
    /**
     * creating react element for the  getAllPageAnnotatedIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    StandardisationSetupHelperBase.prototype.getAllFilesNotViewedIndicatorElement = function (responseData, propsNames, seq) {
        var componentProps;
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
    };
    /**
     * Get restricted Classification types
     * which should be highlighted as amber when over classified.
     * @param markSchemeGroupId
     */
    StandardisationSetupHelperBase.getRestrictedSSUTarget = function (markSchemeGroupId) {
        var restrictSSUTargetsCCValue = configurableCharacteristicsHelper.getCharacteristicValue('RestrictStandardisationSetupTargets', markSchemeGroupId);
        if (restrictSSUTargetsCCValue !== '') {
            var xmlHelperObj = new xmlHelper(restrictSSUTargetsCCValue);
            var restrictedTargetNodes = xmlHelperObj.getAllChildNodes();
            var restrictedTargets = immutable.List();
            if (restrictedTargetNodes) {
                // get targets which are restricted. exclude seed.
                for (var node = 0; node < restrictedTargetNodes.length; node++) {
                    switch (restrictedTargetNodes[node].firstChild.nodeValue) {
                        case 'Practice':
                            restrictedTargets =
                                immutable.List(restrictedTargets.concat(enums.MarkingMode.Practice));
                            break;
                        case 'Standardisation':
                            restrictedTargets =
                                immutable.List(restrictedTargets.concat(enums.MarkingMode.Approval));
                            break;
                        case 'STMStandardisation':
                            restrictedTargets =
                                immutable.List(restrictedTargets.concat(enums.MarkingMode.ES_TeamApproval));
                            break;
                    }
                }
                return restrictedTargets;
            }
            return undefined;
        }
    };
    /**
     * Check whether the specified target ov3erclassified
     * @param tabSelection
     * @param markingMode
     * @param rigOrder
     */
    StandardisationSetupHelperBase.prototype.isSSUTargetsOverClassified = function (tabSelection, markingMode, rigOrder) {
        // Hold the Restricted targets which should be highlighted when over classified.
        var restrictedSSUTargets = StandardisationSetupHelperBase.getRestrictedSSUTarget(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
        var classificationSummaryTargetDetails = standardisationSetupStore.instance.classificationSummaryTargetDetails;
        return tabSelection === enums.StandardisationSetup.ClassifiedResponse &&
            restrictedSSUTargets && restrictedSSUTargets.contains(markingMode) &&
            classificationSummaryTargetDetails.some(function (x) { return x.markingModeId === markingMode &&
                x.markingModeId !== enums.MarkingMode.Seeding &&
                x.count > x.target && rigOrder > x.target; });
    };
    return StandardisationSetupHelperBase;
}());
module.exports = StandardisationSetupHelperBase;
//# sourceMappingURL=standardisationsetuphelperbase.js.map
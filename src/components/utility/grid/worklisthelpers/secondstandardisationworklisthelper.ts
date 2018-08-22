import React = require('react');
import enums = require('../../enums');
import gridColumnNames = require('../gridcolumnnames');
import gridRow = require('../../../utility/grid/gridrow');
import gridCell = require('../../../utility/grid/gridcell');
let worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
import Immutable = require('immutable');
import localeStore = require('../../../../stores/locale/localestore');
import responseIdColumn = require('../../../worklist/shared/responseidcolumn');
import worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
import worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
import worklistHelperBase = require('./worklisthelperbase');
import josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import qigStore = require('../../../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');

/**
 * class for WorkList Helper implementation
 */
class StandardisationWorklistHelper extends worklistHelperBase {

    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of second std responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    public generateRowDefinion(responseListData: WorklistBase,
        responseType: enums.ResponseMode,
        gridType: enums.GridType): Immutable.List<gridRow> {
        this.resolvedGridColumnsJson = josnRefResolver.resolveRefs(worklistGridColumnsJson);
        this._immutableWorkListCollection = Immutable.List<gridRow>();
        switch (responseType) {
            case enums.ResponseMode.open:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForOpenDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForOpenTiled(responseListData);
                        break;
                    default:
                }
                break;
            case enums.ResponseMode.closed:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForClosedDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForClosedTiled(responseListData);
                        break;
                    default:
                }
                break;
        }
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForClosedTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of standardisation open responses
     * @returns grid row collection.
     */
    private getRowDefinionForClosedTiled(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;
        let isESTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

        if (responseListData !== null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();
                let gridColumns = this.resolvedGridColumnsJson.marking.standardisationworklist.closed.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.closed,
                                (isESTeamMember ?
                                    localeStore.instance.TranslateText
                                        ('marking.worklist.response-data.stm-standardisation-response-title') :
                                    localeStore.instance.TranslateText
                                        ('marking.worklist.response-data.second-standardisation-response-title'))
                                + ' ');
                            break;
                        case gridColumnNames.MarksDifference:
                            key = gridSeq.get(responseListCount) + '_MarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = this.getMarksDifferenceColumnElement(responseData,
                                componentPropsJson,
                                key, true);
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }
                // setting row style and row title according to its accuracy type
                _worklistRow.setRowStyle(
                    this.setRowStyle(Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none),
                        this.getAccuracyType(enums.ResponseMode.closed, responseData)));
                _worklistRow.setRowTitle(this.setRowTitle(this.getAccuracyType(enums.ResponseMode.closed, responseData)));
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of Standardisation open responses
     * @returns grid row collection.
     */
    private getRowDefinionForOpenTiled(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;
        let isESTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;

        if (responseListData !== null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                /** Getting the worklist data row */
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);

                let gridColumns = this.resolvedGridColumnsJson.marking.standardisationworklist.open.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;

                // Get fresh set of groups for every columns
                this.emptyGroupColumns();

                /** Getting the worklist columns */
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            let element = this.getMarkingProgressElement(responseData,
                                componentPropsJson,
                                key,
                                responseStatus,
                                enums.WorklistType.secondstandardisation);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.open,
                                (isESTeamMember ?
                                    localeStore.instance.TranslateText
                                        ('marking.worklist.response-data.stm-standardisation-response-title') :
                                    localeStore.instance.TranslateText
                                        ('marking.worklist.response-data.second-standardisation-response-title'))
                                + ' ');
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotated_' + gridColumnCount;

                            // Create annotation indicator element.
                            let allPageElement = this.getAllPageAnnotationIndicatorElement(
                                responseData,
                                componentPropsJson,
                                key);

                            // Checking whether the indicator is valid to display.
                            if (allPageElement !== undefined) {
                                this.mapGroupColumns('icon-holder', allPageElement);
                            }
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                true));
                            break;
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            let allFilesNotViewedElement = (this.getAllFilesNotViewedIndicatorElement(
                                responseData,
                                componentPropsJson,
                                key));
                            this.mapGroupColumns('worklist-tile-footer', allFilesNotViewedElement);
                            break;
                        default:
                    }
                    _workListCellcollection.push(_workListCell);
                }

                // If there are elements queued to group, then group the elements.
                if (this.groupColumns) {

                    _workListCell = new gridCell();
                    key = gridSeq.get(responseListCount) + '_Tile_Group_';
                    _workListCell.columnElement = this.groupColumnElements('worklist-tile-footer', key);
                    _workListCellcollection.push(_workListCell);
                }
                _worklistRow.setRowStyle(this.setRowStyle(responseStatus));
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of standardisation open responses
     * @returns grid row collection.
     */
    private getRowDefinionForOpenDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();

            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                /** Getting the worklist data row */
                let gridColumns = this.resolvedGridColumnsJson.marking.standardisationworklist.open.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);

                /** Getting the worklist columns */
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();

                    switch (_responseColumn) {
                        case gridColumnNames.MarkingProgress:
                            key = gridSeq.get(responseListCount) + '_MarkingProgress_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarkingProgressElement(responseData,
                                componentPropsJson,
                                key,
                                responseStatus,
                                enums.WorklistType.standardisation,
                                false));
                            break;
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData,
                                responseListData.hasNumericMark,
                                responseListData.maximumMark,
                                componentPropsJson,
                                key));
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData,
                                componentPropsJson,
                                key,
                                enums.ResponseMode.open, true));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDate(responseData,
                                componentPropsJson,
                                key,
                                true));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotatedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllPageAnnotatedIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedExceptionElement(responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllFilesNotViewedIndicatorElement(
                                responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                        default:
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }

                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.open, responseData),
                        undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForClosedDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of standardisation open responses
     * @returns grid row collection.
     */
    private getRowDefinionForClosedDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();

            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                /** Getting the worklist data row */
                let gridColumns = this.resolvedGridColumnsJson.marking.standardisationworklist.closed.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId =
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                /** Getting the worklist columns */
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();

                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData,
                                responseListData.hasNumericMark,
                                responseListData.maximumMark,
                                componentPropsJson,
                                key));
                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData,
                                componentPropsJson,
                                key,
                                enums.ResponseMode.closed, false));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDate(responseData,
                                componentPropsJson,
                                key,
                                true));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.AllPageAnnotedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllPageAnnotatedIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllPageAnnotatedIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedExceptionElement(responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = (this.getAccuracyIndicatorElement(
                                    responseData,
                                    componentPropsJson,
                                    key, false));
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                componentPropsJson,
                                key,
                                enums.MarksDifferenceType.AbsoluteMarksDifference,
                                false));
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                            _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                componentPropsJson,
                                key,
                                enums.MarksDifferenceType.TotalMarksDifference,
                                false));
                            break;
                        case gridColumnNames.ReviewedByLabel:
                            key = gridSeq.get(responseListCount) + '_ReviewedByLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getReviewedByLabel(key,
                                responseData));
                            break;
                        case gridColumnNames.SupervisorReviewComment:
                            key = gridSeq.get(responseListCount) + '_SupervisorReviewComment_' + gridColumnCount;
                                _workListCell.columnElement = (this.getSupervisorReviewComment(key,
                                responseData));
                            break;
                        default:
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }

                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none),
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.closed, responseData),
                        undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    protected getResponseStatus(responseData: ResponseBase, responseMode: enums.ResponseMode):
        Immutable.List<enums.ResponseStatus> {

        let responseStatus: Immutable.List<enums.ResponseStatus>;

        switch (responseMode) {
            case enums.ResponseMode.open:
                responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.standardisationOpen).
                    submitButtonValidate(responseData);
                break;
            case enums.ResponseMode.closed:
                responseStatus = Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none);
                break;
        }

        return responseStatus;
    }

    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    protected getCellVisibility(column: string): boolean {

        let isHidden: boolean = false;

        switch (column) {
            case gridColumnNames.AbsoluteMarksDifference:
            case gridColumnNames.TotalMarksDifference:
            case gridColumnNames.AccuracyIndicator:
                isHidden = !(configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
                break;
            case gridColumnNames.SLAOIndicator:
                if (this.isStructuredQIG() === false) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.AllPageAnnotedIndicator:
                if (this.isStructuredQIG() === true) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.ReviewedByLabel:
                isHidden = markerOperationModeFactory.operationMode.isReviewedByLabelHidden;
                break;
            case gridColumnNames.SupervisorReviewComment:
                isHidden = markerOperationModeFactory.operationMode.isSupervisorReviewCommentColumnHidden;
                break;
        }

        return isHidden;
    }

    /**
     * returns the grdicolumns based on the response mode and worklist type
     * @param responseMode
     */
    protected getGridColumns(resolvedGridColumnsJson: any, worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        isFrozen: boolean = false) {

        let gridColumns: any;

        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.standardisationworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.standardisationworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.standardisationworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.standardisationworklist.closed.frozenRows.GridColumns;
                break;
        }

        return gridColumns;
    }

    /**
     * returns the accuracy type based on accuracy  and CC values
     * @param responseMode
     * @param responseData
     */
    protected getAccuracyType(responseMode: enums.ResponseMode, responseData: ResponseBase): enums.AccuracyIndicatorType {

        let _isShowStandardisationDefinitiveMarks = (configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ShowStandardisationDefinitiveMarks,
            responseData.markSchemeGroupId).toLowerCase() === 'true');

        if (responseMode === enums.ResponseMode.closed && _isShowStandardisationDefinitiveMarks === true) {
            return responseData.accuracyIndicatorTypeID;
        } else {
            return enums.AccuracyIndicatorType.Unknown;
        }
    }
}

export = StandardisationWorklistHelper;
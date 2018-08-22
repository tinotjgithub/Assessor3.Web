import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import Immutable = require('immutable');
import gridCell = require('../../../utility/grid/gridcell');
let worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
import worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
import worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
import enums = require('../../enums');
import gridColumnNames = require('../gridcolumnnames');
import worklistHelperBase = require('./worklisthelperbase');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import stringFormatHelper = require('../../../../utility/stringformat/stringformathelper');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import xmlHelper = require('../../../../utility/generic/xmlhelper');
import worklistStore = require('../../../../stores/worklist/workliststore');
import qigStore = require('../../../../stores/qigselector/qigstore');
import localeStore = require('../../../../stores/locale/localestore');
import MarkChangeReason = require('../../../markschemestructure/markchangereason');
import qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');

/**
 * class for WorkList Helper implementation
 */
class AtypicalWorklistHelper extends worklistHelperBase {

    /** variable to holds whether the original marker name shows or not based on DB value (not CC) */
    private showOriginalMarkerName: boolean;

    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of atypical open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    public generateRowDefinion(responseListData: WorklistBase,
        responseType: enums.ResponseMode,
        gridType: enums.GridType): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);

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
                }
                break;
            case enums.ResponseMode.pending:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingTiled(responseListData);
                        break;
                }
                break;
        }
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForAtypicalOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of atypical open responses
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

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);

                let gridColumns = this.resolvedGridColumnsJson.marking.atypicalworklist.open.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;

                // Get fresh set of groups for every columns
                this.emptyGroupColumns();

                // Getting the worklist columns
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
                                enums.WorklistType.atypical);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.open,
                                undefined,
                                false, false, true);
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;

                            // show only if there are blocking exceptions
                            if (responseData[componentPropsJson.hasBlockingExceptions]) {

                                let element = this.getLinkedExceptionElement(responseData,
                                    componentPropsJson,
                                    key);
                                this.mapGroupColumns('icon-holder', element);
                            }
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
                        default:
                            break;
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
     * getRowDefinionForClosedTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of atypical open responses
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
        let isSeedHighlighted: boolean = false;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.closed.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;

                // Get fresh set of groups for every columns
                this.emptyGroupColumns();

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
                                undefined,
                                false,
                                false);
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }

                let _rowStyle: string = this.setRowStyle(Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none),
                    enums.AccuracyIndicatorType.Unknown);
                _worklistRow.setRowStyle(_rowStyle);
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * Get atypical pending worklist details.
     * @param {WorklistBase} responseListData
     * @returns
     */
    private getRowDefinionForPendingTiled(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.pending.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;
                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + 'ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.pending);
                            break;
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = this.getAllocatedDateElement(responseData,
                                componentPropsJson,
                                key,
                                false,
                                false,
                                true);
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }
                _worklistRow.setRowStyle(
                    this.setRowStyle(Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none), undefined));
                _worklistRow.setRowTitle(this.setRowTitle(responseData.accuracyIndicatorTypeID));
                _worklistRow.setRowId(parseFloat(responseData.displayId));
                _worklistRow.setCells(_workListCellcollection);
                _workListRowCollection.push(_worklistRow);
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForAtypicalOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of atypical open responses
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

            this.setShowOriginalMarkerName(responseListData);

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.atypicalworklist.open.detailview.GridColumns;
                //this.resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);

                // Getting the worklist columns
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
                                enums.WorklistType.atypical,
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
                        case gridColumnNames.OriginalMarkerName:
                            key = gridSeq.get(responseListCount) + '_OriginalMarker_' + gridColumnCount;
                            let originalMarkerName: string = this.getFormattedName
                                (responseData.originalMarkerInitials, responseData.originalMarkerSurname);
                            _workListCell.columnElement = (this.getGenericTextElement(originalMarkerName,
                                key));
                            break;
                        case gridColumnNames.CentreNum:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber,
                                key));
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber,
                                key));
                            break;
                        default:
                            break;
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
                        enums.AccuracyIndicatorType.Unknown,
                        undefined));
            }
        }

        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * Generate row defenitions for pending detailed worklist in atypical
     * @param responseListData
     */
    private getRowDefinionForPendingDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let _worklistRow: gridRow;
        let componentPropsJson: any;
        let key: string;
        // Grid columns
        let gridLeftColumn = Array<JSX.Element>();
        let gridMiddleColumn = Array<JSX.Element>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _workListCell: gridCell;

        if (responseListData != null) {

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.atypicalworklist.pending.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.open);

                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    _workListCell = new gridCell();

                    switch (_responseColumn) {
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + 'TotalMark_' + gridColumnCount;
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
                                enums.ResponseMode.pending, true));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + 'LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getLinkedMessageElement(
                                    responseData,
                                    componentPropsJson, key, false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + 'LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getLinkedExceptionElement(
                                    responseData,
                                    componentPropsJson, key, false));
                            break;
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getGracePeriodElement(
                                    responseData,
                                    componentPropsJson,
                                    key, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.CentreNum:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber,
                                key));
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber,
                                key));
                            break;
                        default:
                            break;
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
                        enums.AccuracyIndicatorType.Unknown,
                        undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);

        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForAtypicalClosedDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    private getRowDefinionForClosedDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let _worklistRow: gridRow;
        let componentPropsJson: any;
        let key: string;
        // Grid columns
        let gridLeftColumn = Array<JSX.Element>();
        let gridMiddleColumn = Array<JSX.Element>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _workListCell: gridCell;
        let isSeedResponse: boolean;
        let isSeedHighlighted: boolean = false;
        let cssClass: string;

        if (responseListData != null) {

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.atypicalworklist.closed.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.closed);

                gridLeftColumn = new Array();
                gridMiddleColumn = new Array();

                // Getting the worklist columns
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
                                enums.ResponseMode.closed,
                                false));
                            break;
                        case gridColumnNames.AllocatedDate:
                            key = gridSeq.get(responseListCount) + '_AllocatedDate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getAllocatedDateElement(responseData,
                                componentPropsJson,
                                key,
                                false,
                                false,
                                false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getLinkedMessageElement(
                                    responseData,
                                    componentPropsJson, key, false));
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getLinkedExceptionElement(
                                    responseData,
                                    componentPropsJson, key, false));
                            break;
                        case gridColumnNames.SLAOIndicator:
                            key = gridSeq.get(responseListCount) + '_SLAOIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSLAOIndicatorElement(responseData,
                                componentPropsJson,
                                key,
                                true,
                                false));
                            break;
                        case gridColumnNames.CentreNum:
                            key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber,
                                key));
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber,
                                key));
                            break;
                        default:
                            break;
                    }
                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }

                let additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.directedRemark);
                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        enums.AccuracyIndicatorType.Unknown,
                        additionalComponent,
                        cssClass));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * Get the out put of formatted username
     * @param {userInfoArgument} userInforArg
     * @returns
     */
    private getFormattedName(initials: string, surname: string): string {
        let formattedString: string = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);

        return formattedString;
    }

    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    protected getCellVisibility(column: string): boolean {

        let isHidden: boolean = false;

        switch (column) {
            case gridColumnNames.OriginalMarkerName:
                isHidden = (this.getRemarkSeedingCCValue() === true) || (this.showOriginalMarkerName === false);
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
            case gridColumnNames.TotalMark:
                if (this.isNonNumeric() === true) {
                    isHidden = true;
                }
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
                    resolvedGridColumnsJson.marking.atypicalworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.atypicalworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.atypicalworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.closed.frozenRows.GridColumns;
                break;
        }

        return gridColumns;
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
                responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.directedRemarkOpen).
                    submitButtonValidate(responseData);
                break;
            case enums.ResponseMode.closed:
            case enums.ResponseMode.pending:
                responseStatus = Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none);
                break;
        }

        return responseStatus;
    }

    /**
     * set the variable of showOriginalMarkerName based on the value in worklist data.
     * @param responseListData
     */
    private setShowOriginalMarkerName(responseListData: WorklistBase) {
        let _responseListData = responseListData.responses.toArray();
        for (let _responseCount = 0; _responseCount < _responseListData.length; _responseCount++) {
            if (_responseListData[_responseCount].showOriginalMarkerName === true) {
                this.showOriginalMarkerName = true;
                return;
            }
        }
        this.showOriginalMarkerName = false;
    }

    /**
     * get the value of remark seeding cc based on the remark type.
     */
    private getRemarkSeedingCCValue() {
        let ccValue = configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.RemarkSeeding,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId);
        if (ccValue && ccValue !== '') {
            let xmlHelperObj = new xmlHelper(ccValue);
            let remarkType = xmlHelperObj.getNodeValueByName('RemarkType');
            remarkType = (remarkType) ? remarkType.replace(/ /g, '') : '';

            return (enums.RemarkRequestType[worklistStore.instance.getRemarkRequestType] === remarkType);
        } else {
            return false;
        }
    }
}

export = AtypicalWorklistHelper;
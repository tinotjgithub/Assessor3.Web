import React = require('react');
import enums = require('../../enums');
import Immutable = require('immutable');
import gridColumnNames = require('../gridcolumnnames');
import gridRow = require('../../../utility/grid/gridrow');
import worklistHelperBase = require('./worklisthelperbase');
import gridCell = require('../../../utility/grid/gridcell');
import qigStore = require('../../../../stores/qigselector/qigstore');
import josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
import worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');

let worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');

/**
 * class for Marking Check WorkList Helper implementation
 */
class MarkingCheckWorklistHelper extends worklistHelperBase {

    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of live open responses
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
                if (gridType === enums.GridType.detailed) {

                    this._immutableWorkListCollection = this.getRowDefinionForOpenDetail(responseListData);
                }
                break;
            case enums.ResponseMode.closed:
                if (gridType === enums.GridType.detailed) {
                    this._immutableWorkListCollection = this.getRowDefinionForClosedDetail(responseListData);
                }
                break;
            case enums.ResponseMode.pending:
                if (gridType === enums.GridType.detailed) {
                    this._immutableWorkListCollection = this.getRowDefinionForPendingDetail(responseListData);
                }
                break;
        }
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for closed WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    private getRowDefinionForClosedDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let key: string;
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _workListCell: gridCell;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.closed.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.closed);

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

                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }

                            break;
                        case gridColumnNames.LastUpdatedColumn:
                            key = gridSeq.get(responseListCount) + '_LastUpdatedColumn_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLastUpdatedElement(responseData,
                                componentPropsJson,
                                key,
                                enums.ResponseMode.closed,
                                false));
                            break;
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getLinkedMessageElement(
                                    responseData,
                                    componentPropsJson, key, false));
                            break;
                    }

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
                        this.getAccuracyType(enums.ResponseMode.closed, responseData),
                        undefined));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for open WorkList Grid in detail view
     * @param responseListData - list of live open responses
     * @returns grid row collection.
     */
    private getRowDefinionForOpenDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
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
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.open.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();

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
                                enums.WorklistType.live,
                                false));
                            break;
                        case gridColumnNames.TotalMark:
                            key = gridSeq.get(responseListCount) + '_TotalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTotalMarkElement(responseData,
                                responseListData.hasNumericMark,
                                responseListData.maximumMark,
                                componentPropsJson,
                                key));

                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }

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
                        case gridColumnNames.LinkedMessageIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedMessage_' + gridColumnCount;
                            _workListCell.columnElement = (this.getLinkedMessageElement(responseData,
                                componentPropsJson,
                                key,
                                false));
                            break;
                    }

                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }

                let additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.open, responseData),
                        additionalComponent));
            }
        }

        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * Generate row defenitions for pending detailed worklist in live
     * @param responseListData
     */
    private getRowDefinionForPendingDetail(responseListData: WorklistBase): Immutable.List<gridRow> {
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let key: string;
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _workListCell: gridCell;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.markingcheckworklist.pending.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let responseStatus = this.getResponseStatus(responseData, enums.ResponseMode.pending);

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

                            if (this.isNonNumeric() === true) {
                                _workListCell.isHidden = true;
                            }

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
                        case gridColumnNames.GracePeriodTime:
                            key = gridSeq.get(responseListCount) + 'GracePeriodTime_' + gridColumnCount;
                            _workListCell.columnElement = (
                                this.getGracePeriodElement(
                                    responseData,
                                    componentPropsJson,
                                    key, false));
                            break;
                    }

                    let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
                    _workListCell.setCellStyle(cellStyle);
                    _workListRowHeaderCellcollection.push(_workListCell);
                }

                let additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.pending, responseData),
                        additionalComponent));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);

        return this._immutableWorkListCollection;
    }

    /**
     * returns the response status based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    protected getResponseStatus(responseData: ResponseBase, responseMode: enums.ResponseMode):
        Immutable.List<enums.ResponseStatus> {

        let responseStatus: Immutable.List<enums.ResponseStatus>;
        responseStatus = worklistValidatorFactory.getValidator(worklistValidatorList.liveOpen).
            submitButtonValidate(responseData);

        return responseStatus;
    }

    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    protected getGridColumns(resolvedGridColumnsJson: any, worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        isFrozen: boolean = false) {

        let gridColumns: any;
        switch (responseMode) {
            case enums.ResponseMode.open:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.markingcheckworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.markingcheckworklist.closed.frozenRows.GridColumns;
                break;
        }

        return gridColumns;
    }
}

export = MarkingCheckWorklistHelper;
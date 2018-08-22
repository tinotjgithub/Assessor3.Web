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
import josnRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
import markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
import qigStore = require('../../../../stores/qigselector/qigstore');
import tagStore = require('../../../../stores/tags/tagstore');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import localeStore = require('../../../../stores/locale/localestore');

/**
 * class for WorkList Helper implementation
 */
class LiveWorklistHelper extends worklistHelperBase {

    /* variable to holds the response type for showing the response type label*/
    private _responseType = enums.ResponseType.None;

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
            case enums.ResponseMode.pending:
                switch (gridType) {
                    case enums.GridType.detailed:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingDetail(responseListData);
                        break;
                    case enums.GridType.tiled:
                        this._immutableWorkListCollection = this.getRowDefinionForPendingTiled(responseListData);
                        break;
                }
        }
        return this._immutableWorkListCollection;
    }

    /**
     * getRowDefinionForLiveOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of live open responses
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

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let isSeedHighlighted: boolean = false;

            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: LiveClosedResponse = _responseListData[responseListCount] as LiveClosedResponse;

                responseData.markSchemeGroupId = (responseData.isWholeResponse &&
                    responseData.relatedRIGDetails) ? 0 :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId;

                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.closed.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;

                let isSeedResponse: boolean = (responseData as LiveClosedResponse).seedTypeId !== enums.SeedType.None ? true : false;

                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.closed);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.closed,
                                undefined,
                                true,
                                isSeedResponse,
                                true,
                                this._responseType);
                            break;
                        case gridColumnNames.MarksDifference:

                            if (isSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_MarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = this.getMarksDifferenceColumnElement(responseData,
                                    componentPropsJson,
                                    key, true);
                            }
                            break;
                        default:
                            break;
                    }
                    _workListCellcollection.push(_workListCell);
                }

                let _rowStyle: string = this.setRowStyle(Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none),
                    isSeedResponse === true ? responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);

                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }

                if (isSeedResponse && this.showSeedLabel) {
                    _rowStyle += ' seed';
                }

                if (!isSeedHighlighted
                    && qualityFeedbackHelper.isSeedNeededToBeHighlighted(responseData.qualityFeedbackStatusId, isSeedResponse)) {
                    _rowStyle += ' highlight-seed';
                    isSeedHighlighted = true;
                }

                _worklistRow.setRowStyle(_rowStyle);
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
     * getRowDefinionForLiveOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of live open responses
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

                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.open.tileview.GridColumns;
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
                                enums.WorklistType.live);
                            this.mapGroupColumns('worklist-tile-footer', element);
                            break;
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData, enums.ResponseMode.open);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.open);
                            break;
                        case gridColumnNames.LinkedExceptionIndicator:
                            key = gridSeq.get(responseListCount) + '_LinkedException_' + gridColumnCount;

                            // show only if there are blocking exceptions or zoning exceptions
                            if (responseData[componentPropsJson.hasBlockingExceptions]
                                || responseData[componentPropsJson.hasZoningExceptions]) {

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
                        case gridColumnNames.AllFilesNotViewedIndicator:
                            key = gridSeq.get(responseListCount) + '_AllFilesNotViewedIndicator_' + gridColumnCount;
                            let allFilesNotViewedElement = (this.getAllFilesNotViewedIndicatorElement(
                                responseData,
                                componentPropsJson,
                                key));
                            this.mapGroupColumns('worklist-tile-footer', allFilesNotViewedElement);
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

                let _rowStyle: string = this.setRowStyle(responseStatus);

                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }

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
     * getRowDefinionForLiveOpenDetail is used for generating row collection for WorkList Grid in detail view
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
        let cssClass: string;
        let isResponseTypeLabelVisible: boolean;
        let isSeedResponse: boolean;
        let isSeedHighlighted: boolean = false;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;
             this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.closed.detailview.GridColumns;
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
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                   localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                     localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType ,
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
                        case gridColumnNames.ResponseTypeLabel:
                            this._responseType = this.getResponseLabelType(responseData as LiveClosedResponse, enums.ResponseMode.closed);
                            isResponseTypeLabelVisible = this._responseType !== enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;

                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, this._responseType));

                            if (!isSeedHighlighted && qualityFeedbackHelper.isSeedNeededToBeHighlighted(
                                (responseData as LiveClosedResponse).qualityFeedbackStatusId, isResponseTypeLabelVisible)) {
                                cssClass = 'highlight-seed';
                                isSeedHighlighted = true;
                            } else {
                                cssClass = '';
                            }
                            break;
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = (this.getAccuracyIndicatorElement(responseData,
                                    componentPropsJson,
                                    key,
                                    false));
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.MarksDifferenceType.AbsoluteMarksDifference,
                                    false));
                            }
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            isSeedResponse = markerOperationModeFactory.operationMode.isSeedResponse(responseData);
                            if (isSeedResponse) {
                                key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.MarksDifferenceType.TotalMarksDifference,
                                    false
                                ));
                            }
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key,
                                responseData.sampleCommentId));
                            break;
                        case gridColumnNames.ReviewedByLabel:
                            key = gridSeq.get(responseListCount) + '_ReviewedByLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getReviewedByLabel(key,
                                responseData));
                            break;
                        case gridColumnNames.CentreNum:
                            if (!markerOperationModeFactory.operationMode.shouldDisplayCenterNumber &&
                                !markerOperationModeFactory.operationMode.isSeedResponse(responseData)) {
                                key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber,
                                    key));
                            }
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key,
                                responseData.tagId,
                                tagStore.instance.tags,
                                responseData.markGroupId));
                            break;
                        case gridColumnNames.SupervisorReviewComment:
                            key = gridSeq.get(responseListCount) + '_SupervisorReviewComment_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSupervisorReviewComment(key,
                                responseData));
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
                        this.getAccuracyType(enums.ResponseMode.closed, responseData),
                        undefined,
                        cssClass));
            }
        }
        this._immutableWorkListCollection = Immutable.fromJS(_workListRowCollection);
        return this._immutableWorkListCollection;
    }

    /**
     * Get the response label type for worklist
     * @param responseData
     * @param responseMode
     */
    private getResponseLabelType(responseData, responseMode: enums.ResponseMode): enums.ResponseType {

        let isPEOrAPE = markerOperationModeFactory.operationMode.isSelectedExaminerPEOrAPE;
        let isSTM: boolean = markerOperationModeFactory.operationMode.isLoggedInExaminerSTM;

        let showSeedResponsLabel: boolean = responseData.seedTypeId !== enums.SeedType.None;

        let showPromotedSeedResponseLabel: boolean = responseData.isCurrentMarkGroupPromotedAsSeed && isSTM;

        let showDefinitiveResponseLabel: boolean;

        if ((responseData).isWholeResponse) {
            return enums.ResponseType.WholeResponse;
        }

        if (responseData.isPromotedSeed) {
            showDefinitiveResponseLabel = responseData.isCurrentMarkGroupPromotedAsSeed && isPEOrAPE;
        } else {
            showDefinitiveResponseLabel = responseData.hasDefinitiveMarks && isPEOrAPE;
        }

        if (responseMode === enums.ResponseMode.open) {
            return showSeedResponsLabel ? enums.ResponseType.Seed : enums.ResponseType.None;
        } else {
            return showSeedResponsLabel ? enums.ResponseType.Seed
                : showDefinitiveResponseLabel ? enums.ResponseType.Definitive
                    : showPromotedSeedResponseLabel ? enums.ResponseType.PromotedSeed : enums.ResponseType.None;
        }
    }

    /**
     * getRowDefinionForLiveOpenDetail is used for generating row collection for WorkList Grid in detail view
     * @param responseListData - list of live open responses
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
        let isSeedResponse: boolean;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;
            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns;
                //this.resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns;
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
                                enums.WorklistType.live,
                                false));
                            break;
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                   localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                     localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType ,
                                    key));
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
                        case gridColumnNames.ResponseTypeLabel:
                            this._responseType = this.getResponseLabelType(responseData as LiveOpenResponse, enums.ResponseMode.open);
                            isSeedResponse = this._responseType !== enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isSeedResponse, this._responseType));
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key,
                                responseData.sampleCommentId));
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key,
                                responseData.tagId,
                                tagStore.instance.tags,
                                responseData.markGroupId));
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
        let _worklistRow: gridRow;
        let componentPropsJson: any;
        let key: string;
        let isResponseTypeLabelVisible: boolean;
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
                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.pending.detailview.GridColumns;
                let gridColumnLength = gridColumns.length;
                _workListRowHeaderCellcollection = new Array();
                _worklistRow = new gridRow();

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
                            break;
                        case gridColumnNames.SpecialistType:
                            key = gridSeq.get(responseListCount) + '_SpecialistType_' + gridColumnCount;
                            _workListCell.columnElement =
                                (this.getGenericTextElement(responseData.specialistType ===
                                   localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType) ?
                                     localeStore.instance.TranslateText
                                   ('marking.worklist.response-data.specialisttype-' + responseData.specialistType)
                                    : responseData.specialistType ,
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
                        case gridColumnNames.ResponseTypeLabel:
                            // for pending tab there is only whole respones label is used
                            this._responseType = this.getResponseLabelType(responseData as LiveOpenResponse, enums.ResponseMode.pending);
                            isResponseTypeLabelVisible = this._responseType === enums.ResponseType.WholeResponse;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, this._responseType));
                            break;
                        case gridColumnNames.SampleLabel:
                            key = gridSeq.get(responseListCount) + '_SampleLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getSampleLabel(key,
                                responseData.sampleCommentId));
                            break;
                        case gridColumnNames.TagIndicator:
                            key = gridSeq.get(responseListCount) + '_TagIndicator_' + gridColumnCount;
                            _workListCell.columnElement = (this.getTag(key,
                                responseData.tagId,
                                tagStore.instance.tags,
                                responseData.markGroupId));
                            break;
                        default:
                            break;
                    }

                    _workListCell.isHidden = this.getCellVisibility(_responseColumn);
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
     * Generate row defenitions for pending tiled worklist in live
     * @param responseListData
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

                let gridColumns = this.resolvedGridColumnsJson.marking.liveworklist.pending.tileview.GridColumns;
                let gridColumnLength = gridColumns.length;
                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData as LiveOpenResponse, enums.ResponseMode.pending);
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

                let _rowStyle: string = this.setRowStyle(Immutable.List<enums.ResponseStatus>().push(enums.ResponseStatus.none), undefined);

                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }

                _worklistRow.setRowStyle(_rowStyle);
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
     * returns the resposne staus based on the worklist and its validator type
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
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    protected getCellVisibility(column: string): boolean {

        let isHidden: boolean = false;
        let specialistResponseCC = (configurableCharacteristicsHelper.getExamSessionCCValue(
            configurableCharacteristicsNames.SpecialistResponseMarking,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true');

        switch (column) {
            case gridColumnNames.AbsoluteMarksDifference:
            case gridColumnNames.TotalMarksDifference:
            case gridColumnNames.AccuracyIndicator:
                isHidden = markerOperationModeFactory.operationMode.isQualityFeedbackWorklistColumnsHidden;
                break;
            case gridColumnNames.SLAOIndicator:
                isHidden = markerOperationModeFactory.operationMode.isSLAOIndicatorHidden(this.isStructuredQIG());
                break;
            case gridColumnNames.AllPageAnnotedIndicator:
                isHidden = markerOperationModeFactory.operationMode.isAllPageAnnotedIndicatorHidden(this.isStructuredQIG());
                break;
            case gridColumnNames.LinkedExceptionIndicator:
                isHidden = markerOperationModeFactory.operationMode.isLinkedExceptionIndicatorHidden;
                break;
            case gridColumnNames.TotalMark:
                if (this.isNonNumeric() === true) {
                    isHidden = true;
                }
                break;
            case gridColumnNames.ResponseTypeLabel:
                isHidden = (this._responseType === enums.ResponseType.Seed) ?
                    markerOperationModeFactory.operationMode.isSeedLabelHidden : false;
                break;
            case gridColumnNames.SampleLabel:
                isHidden = markerOperationModeFactory.operationMode.isSampleLabelHidden(enums.WorklistType.live);
                break;
            case gridColumnNames.ReviewedByLabel:
                isHidden = markerOperationModeFactory.operationMode.isReviewedByLabelHidden;
                break;
            case gridColumnNames.CentreNum:
                isHidden = markerOperationModeFactory.operationMode.isHelpExaminersView ?
                           true : markerOperationModeFactory.operationMode.shouldDisplayCenterNumber;
                break;
            case gridColumnNames.SpecialistType:
                isHidden = !((examinerStore.instance.getMarkerInformation.isSpecialist
                    || (qigStore.instance.selectedQIGForMarkerOperation &&
                    qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer))
                        && specialistResponseCC );
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
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ? resolvedGridColumnsJson.marking.liveworklist.closed.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.closed.frozenRows.GridColumns;
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

        let accuracyType;

        switch (responseMode) {
            case enums.ResponseMode.open:
            case enums.ResponseMode.pending:
                accuracyType = enums.AccuracyIndicatorType.Unknown;
                break;

            case enums.ResponseMode.closed:
                let qualityFeedbackCC = (configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.AutomaticQualityFeedback,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');

                let isSeedResponse = ((responseData as LiveClosedResponse).seedTypeId !== enums.SeedType.None) &&
                    (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown);

                accuracyType = ((isSeedResponse === true && (qualityFeedbackCC === true ||
                    markerOperationModeFactory.operationMode.isTeamManagementMode)) ?
                    responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                break;
        }

        return accuracyType;
    }
}

export = LiveWorklistHelper;
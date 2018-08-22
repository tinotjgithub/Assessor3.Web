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
import SupervisorRemarkDecisionIcon = require('../../../markschemestructure/supervisorremarkdecisionicon');
import qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
import markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
import markingOperationMode = require('../../markeroperationmode/markingoperationmode');
import tagStore = require('../../../../stores/tags/tagstore');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');

/**
 * class for WorkList Helper implementation
 */
class RemarkWorklistHelper extends worklistHelperBase {

    /** variable to holds whether the original marker name shows or not based on DB value (not CC) */
    private showOriginalMarkerName: boolean;

    /* variable to holds the response type for showing the response type label*/
    private _responseType = enums.ResponseType.None;

    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of directed remark open responses
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
     * getRowDefinionForDirectedRemarkOpenTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of directed remark open responses
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

                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.open.tileview.GridColumns;
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
                                enums.WorklistType.directedRemark);
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
                        case gridColumnNames.MarkChangeReason:
                            if (responseData[componentPropsJson.markingProgress] === 100 &&
                                responseData.markChangeReasonVisible
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                                && !responseData.markChangeReason) {
                                key = gridSeq.get(responseListCount) + '_MarkChangeReason_' + gridColumnCount;
                                let element = this.getMarkChangeReasonColumnElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.ResponseMode.open);
                                this.mapGroupColumns('icon-holder', element);
                            }
                            break;
                        case gridColumnNames.SupervisorRemarkDecision:
                            if (this.isSupervisorRemarkDecisionVisible() &&
                                (responseData.supervisorRemarkMarkChangeReasonID === 0) &&
                                responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_RemarkdecisonButton_' + gridColumnCount;
                                let element = this.getSupervisorDecisionColumnElement(responseData,
                                    key, true);
                                this.mapGroupColumns('icon-holder', element);
                            }
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
     * Gets the response label type for remark worklist
     * @param responseData
     */
    private getResponseLabelType(responseData): enums.ResponseType {
        let isSeedResponse: boolean = ((responseData).seedTypeId !== enums.SeedType.None)
            && (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown);

          return isSeedResponse ? enums.ResponseType.Seed : enums.ResponseType.None;
    }

    /**
     * getRowDefinionForClosedTiled is used for generating row collection for WorkList Grid in tiled view
     * @param responseListData - list of directed open responses
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

                let isSeedResponse: boolean = (responseData as DirectedRemarkClosedResponse).seedTypeId !==
                    enums.SeedType.None ? true : false;

                let isEurSeedResponse: boolean = (responseData as DirectedRemarkClosedResponse).seedTypeId ===
                    enums.SeedType.EUR;

                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            this._responseType = this.getResponseLabelType(responseData as DirectedRemarkClosedResponse);
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdColumnElement(responseData,
                                componentPropsJson,
								key,
								responseListData.hasNumericMark,
                                enums.ResponseMode.closed,
                                undefined,
                                false,
                                isEurSeedResponse,
                                true,
                                this._responseType);
                            break;
                        case gridColumnNames.MarksDifference:

                            if (isEurSeedResponse === true && markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn) {
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
                    isEurSeedResponse === true ? responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);

                if (this._responseType !== enums.ResponseType.None) {
                    _rowStyle += ' labeled';
                }

                if (isSeedResponse && this.showSeedLabel) {
                    _rowStyle += ' seed';
                }

                if (!isSeedHighlighted
                    && qualityFeedbackHelper.isSeedNeededToBeHighlighted((responseData as DirectedRemarkClosedResponse).
                        qualityFeedbackStatusId, isEurSeedResponse)) {
                    _rowStyle += ' highlight-seed';
                    isSeedHighlighted = true;
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
     * Get directed remark pending worklist details.
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
        let isSeedResponseVisible: boolean;

        if (responseListData != null) {

            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns;
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
                                enums.WorklistType.directedRemark,
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
                        case gridColumnNames.OriginalMarkerName:
                            key = gridSeq.get(responseListCount) + '_OriginalMarker_' + gridColumnCount;
                            let originalMarkerName: string = this.getFormattedName
                                (responseData.originalMarkerInitials, responseData.originalMarkerSurname);
                            _workListCell.columnElement = (this.getGenericTextElement(originalMarkerName,
                                key));
                            break;
                        case gridColumnNames.CentreNum:
                            if (this.getRemarkSeedingCCValue() === false) {
                                key = gridSeq.get(responseListCount) + '_Centre_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(responseData.centreNumber,
                                    key));
                            }
                            break;
                        case gridColumnNames.CentreCandidateNum:
                            key = gridSeq.get(responseListCount) + '_CentreCandidate_' + gridColumnCount;
                            _workListCell.columnElement = (this.getGenericTextElement(responseData.centreCandidateNumber,
                                key));
                            break;
                        case gridColumnNames.MarkChangeReason:
                            if (responseData[componentPropsJson.markingProgress] === 100 &&
                                responseData.markChangeReasonVisible
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Accurate
                                && !responseData.markChangeReason) {
                                key = gridSeq.get(responseListCount) + '_MarkChangeReason_' + gridColumnCount;
                                _workListCell.columnElement = this.getMarkChangeReasonColumnElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.ResponseMode.open);
                            }
                            break;
                        case gridColumnNames.SupervisorRemarkDecision:
                            if (this.isSupervisorRemarkDecisionVisible() &&
                                (responseData.supervisorRemarkMarkChangeReasonID === 0) &&
                                responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_RemarkdecisonButton_' + gridColumnCount;
                                _workListCell.columnElement = this.getSupervisorDecisionColumnElement(responseData,
                                    key);
                            }
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            isSeedResponseVisible = (responseData as DirectedRemarkOpenResponse).seedTypeId !== enums.SeedType.None;
                            let responseType = isSeedResponseVisible ? enums.ResponseType.Seed : enums.ResponseType.None;
                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isSeedResponseVisible, responseType));
                            break;
                        case gridColumnNames.OriginalMark:
                            if (responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkElement(key,
                                    responseData, componentPropsJson, (responseData.markingProgress === 100)));
                            }
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown
                                && responseData.markingProgress === 100) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key,
                                    responseData, componentPropsJson, (responseData.markingProgress === 100)));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            let decisionType: string = this.getSupervisorRemarkDecisionType(responseData);

                            if (this.isSupervisorRemarkDecisionVisible() && decisionType !== null) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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
     * get supervisor remark decision type
     * @param response
     */
    private getSupervisorRemarkDecisionType(response: ResponseBase): string {
        let supervisorRemarkFinalMarkSetID: number = response.supervisorRemarkFinalMarkSetID;
        if (supervisorRemarkFinalMarkSetID === 2) {
            return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.original-marks-chosen');
        } else if (supervisorRemarkFinalMarkSetID === 1) {
            return localeStore.instance.TranslateText('marking.worklist.supervisor-remark-decision.remark-chosen');
        } else {
            return '';
        }
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
        // Grid columns
        let gridLeftColumn = Array<JSX.Element>();
        let gridMiddleColumn = Array<JSX.Element>();
        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _workListCell: gridCell;

        if (responseListData != null) {

            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.pending.detailview.GridColumns;
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
                        case gridColumnNames.OriginalMark:
                            key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getOriginalMarkElement(key,
                                responseData, componentPropsJson, true));
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key,
                                    responseData, componentPropsJson, true));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            let decisionType: string = this.getSupervisorRemarkDecisionType(responseData);

                            if (this.isSupervisorRemarkDecisionVisible()) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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

                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.pending, responseData),
                        undefined));
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
        let isSeedResponse: boolean;
        let isSeedHighlighted: boolean = false;
        let cssClass: string;

        if (responseListData != null) {

            this.setShowOriginalMarkerName(responseListData);
            this.setNonNumeric(!responseListData.hasNumericMark);

            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            let responseListLength = _responseListData.length;

            this.resetDynamicColumnSettings();
            for (let responseListCount = 0; responseListCount < responseListLength; responseListCount++) {
                // Getting the worklist data row
                let gridColumns = this.resolvedGridColumnsJson.marking.directedremarkworklist.closed.detailview.GridColumns;
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
                let isEurSeedResponse: boolean = (responseData as DirectedRemarkClosedResponse).seedTypeId ===
                    enums.SeedType.EUR;

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
                        case gridColumnNames.AccuracyIndicator:
                            // accuracy indicator is shown only when its values is set
                            if (isEurSeedResponse === true
                                && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_AccuracyIndicator_' + gridColumnCount;
                                _workListCell.columnElement = (this.getAccuracyIndicatorElement(responseData,
                                    componentPropsJson,
                                    key,
                                    false));
                            }
                            break;
                        case gridColumnNames.AbsoluteMarksDifference:
                            if (isEurSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_AbsoluteMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.MarksDifferenceType.AbsoluteMarksDifference,
                                    false));
                            }
                            break;
                        case gridColumnNames.TotalMarksDifference:
                            if (isEurSeedResponse === true) {
                                key = gridSeq.get(responseListCount) + '_TotalMarksDifference_' + gridColumnCount;
                                _workListCell.columnElement = (this.getMarksDifferenceElement(responseData,
                                    componentPropsJson,
                                    key,
                                    enums.MarksDifferenceType.TotalMarksDifference,
                                    false
                                ));
                            }
                            break;
                        case gridColumnNames.ResponseTypeLabel:
                            let responseType = this.getResponseLabelType(responseData as DirectedRemarkClosedResponse);
                            let isResponseTypeLabelVisible = responseType !== enums.ResponseType.None;

                            key = gridSeq.get(responseListCount) + '_ResponseTypeLabel_' + gridColumnCount;
                            _workListCell.columnElement = (this.getResponseTypeLabel(key, isResponseTypeLabelVisible, responseType));

                            if (!isSeedHighlighted && qualityFeedbackHelper.isSeedNeededToBeHighlighted(
                                (responseData as DirectedRemarkClosedResponse).qualityFeedbackStatusId, isResponseTypeLabelVisible)) {
                                cssClass = 'highlight-seed';
                                isSeedHighlighted = true;
                            } else {
                                cssClass = '';
                            }
                            break;
                        case gridColumnNames.OriginalMark:
                            key = gridSeq.get(responseListCount) + '_OriginalMark_' + gridColumnCount;
                            _workListCell.columnElement = (this.getOriginalMarkElement(key,
                                responseData, componentPropsJson, true));
                            break;
                        case gridColumnNames.OriginalMarkAccuracy:
                            // accuracy indicator is shown only when its values is set
                            if (responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown) {
                                key = gridSeq.get(responseListCount) + '_OriginalMarkAccuracy_' + gridColumnCount;
                                _workListCell.columnElement = (this.getOriginalMarkAccuracyElement(key,
                                    responseData, componentPropsJson, true));
                            }
                            break;
                        case gridColumnNames.Finalmarkselected:
                            let decisionType: string = this.getSupervisorRemarkDecisionType(responseData);

                            if (this.isSupervisorRemarkDecisionVisible() && decisionType !== null) {
                                key = gridSeq.get(responseListCount) + '_Finalmarkselected_' + gridColumnCount;
                                _workListCell.columnElement = (this.getGenericTextElement(decisionType, key));
                            }
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

                let additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.directedRemark);
                // Creating the grid row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(enums.ResponseMode.closed, responseData),
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
        let specialistResponseCC = (configurableCharacteristicsHelper.getExamSessionCCValue(
            configurableCharacteristicsNames.SpecialistResponseMarking,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true');
        switch (column) {
            case gridColumnNames.AbsoluteMarksDifference:
            case gridColumnNames.TotalMarksDifference:
            case gridColumnNames.AccuracyIndicator:
                isHidden = !((configurableCharacteristicsHelper.getCharacteristicValue(
                    configurableCharacteristicsNames.AutomaticQualityFeedback,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true')
                    && (this.getRemarkSeedingCCValue() === true));
                break;
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
            case gridColumnNames.ResponseTypeLabel:
                isHidden = markerOperationModeFactory.operationMode.isSeedLabelHidden;
                break;
            case gridColumnNames.SupervisorRemarkDecision:
            case gridColumnNames.Finalmarkselected:
                isHidden = !this.isSupervisorRemarkColumnsVisible;
                break;
            case gridColumnNames.OriginalMark:
            case gridColumnNames.OriginalMarkAccuracy:
                isHidden = !this.isSupervisorRemarkColumnsVisible || this.isNonNumeric();
                break;
            case gridColumnNames.CentreNum:
                isHidden = (worklistStore.instance.getResponseMode === enums.ResponseMode.open) &&
                           (this.getRemarkSeedingCCValue() === true) ? true : false;
                break;
            case gridColumnNames.SpecialistType:
                isHidden = !( (examinerStore.instance.getMarkerInformation.isSpecialist
                    || (qigStore.instance.getSelectedQIGForTheLoggedInUser &&
                        qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer))
                        && specialistResponseCC );
                break;
        }

        return isHidden;
    }

    /**
     * return whether we need to show/hide the supervisor remark worklist columns
     */
    private get isSupervisorRemarkColumnsVisible() {
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

        let isSupervisorRemarkDecisionCCOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        return (isSupervisorRemarkDecisionCCOn
            && worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark);
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
                    resolvedGridColumnsJson.marking.directedremarkworklist.open.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.open.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.pending:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.directedremarkworklist.pending.detailview.GridColumns
                    : resolvedGridColumnsJson.marking.liveworklist.pending.frozenRows.GridColumns;
                break;
            case enums.ResponseMode.closed:
                gridColumns = (isFrozen === false) ?
                    resolvedGridColumnsJson.marking.directedremarkworklist.closed.detailview.GridColumns
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

                accuracyType = ((isSeedResponse === true && qualityFeedbackCC === true && this.getRemarkSeedingCCValue() === true) ?
                    responseData.accuracyIndicatorTypeID : enums.AccuracyIndicatorType.Unknown);
                break;
        }

        return accuracyType;
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

    /**
     * creating react element for the  MarkChangeReason component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @param responseMode - response mode
     * @returns JSX.Element.
     */
    public getMarkChangeReasonColumnElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseMode?: enums.ResponseMode): JSX.Element {
        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isInResponse: false,
            markChangeReason: responseData.markChangeReason
        };

        let markChangeReason = Immutable.List<JSX.Element>([React.createElement(MarkChangeReason, componentProps)]);
        return this.getWrappedColumn(markChangeReason, 'col wl-eur-reason-holder', seq + 'wrapped').columnElement;

    }

    /**
     * get supervisor remark decision visibility
     * @param response
     */
    private isSupervisorRemarkDecisionVisible(): boolean {
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;

        let isSupervisorRemarkDecisionCCOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SupervisorRemarkDecision, markSchemeGroupId).toLowerCase() === 'true' ? true : false;

        return (isSupervisorRemarkDecisionCCOn
            && worklistStore.instance.getRemarkRequestType === enums.RemarkRequestType.SupervisorRemark);
    }

    /**
     * creating react element for the  Supervisordecision component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     */
    public getSupervisorDecisionColumnElement(responseData: ResponseBase,
        seq: string,
        isTileView: boolean = false): JSX.Element {
        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            isTileView: isTileView,
            selectedLanguage: localeStore.instance.Locale
        };

        return React.createElement(SupervisorRemarkDecisionIcon, componentProps);
    }
}

export = RemarkWorklistHelper;
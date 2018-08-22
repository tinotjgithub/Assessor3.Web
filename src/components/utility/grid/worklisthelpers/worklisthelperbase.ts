import React = require('react');
import gridRow = require('../../../utility/grid/gridrow');
import Immutable = require('immutable');
import gridCell = require('../../../utility/grid/gridcell');
import MarkingProgress = require('../../../worklist/shared/markingprogress');
import LastUpdatedColumn = require('../../../worklist/shared/lastupdatedcolumn');
import totalMark = require('../../../worklist/shared/totalmarkdetail');
import responseIdColumn = require('../../../worklist/shared/responseidcolumn');
import ResponseIdGridElement = require('../../../worklist/shared/responseidgridelement');
import allocatedDateColumn = require('../../../worklist/shared/allocateddatecolumn');
import LinkedMessageIndicator = require('../../../worklist/shared/linkedmessageindicator');
import AccuracyIndicator = require('../../../worklist/shared/accuracyindicator');
import MarksDifferenceColumn = require('../../../worklist/shared/marksdifferencecolumn');
import MarksDifference = require('../../../worklist/shared/marksdifference');
import LinkedExceptionIndicator = require('../../../worklist/shared/linkedexceptionindicator');
import gracePeriodTime = require('../../../worklist/shared/graceperiodtime');
import localeStore = require('../../../../stores/locale/localestore');
import worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
import worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
import enums = require('../../enums');
import GenericComponentWrapper = require('../genericcomponentwrapper');
import configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import allPageAnnotationIndicator = require('../../../worklist/shared/allpageannotationindicator');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import ResponseTypeLabel = require('../../../worklist/shared/responsetypelabel');
import ColumnHeader = require('../../../worklist/shared/columnheader');
import allocatedDateElement = require('../../../worklist/shared/allocateddate');
import slaoannotationindicator = require('../../../worklist/shared/slaoannotationindicator');
import qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
import QualityFeedbackBanner = require('../../../worklist/banner/qualityfeedbackbanner');
import gridColumnNames = require('../gridcolumnnames');
import jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
import qigStore = require('../../../../stores/qigselector/qigstore');
import worklistHelper = require('../../../../utility/worklist/worklisthelper');
let worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
import GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
import worklistStore = require('../../../../stores/worklist/workliststore');
import localHelper = require('../../../../utility/locale/localehelper');
import htmUtilities = require('../../../../utility/generic/htmlutilities');
import constants = require('../../constants');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import SampleLabel = require('../../../worklist/shared/samplelabel');
import ReviewedByLabel = require('../../../worklist/shared/reviewedbylabel');
import markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
import OriginalMark = require('../../../worklist/shared/originalmarktotal');
import OriginalMarkAccuracy = require('../../../worklist/shared/originalmarkaccuracy');
import immutable = require('immutable');
import TagList = require('../../../response/responsescreen/taglist');
import allFilesNotViewedIndicator = require('../../../worklist/shared/allfilesnotviewedindicator');
import eCourseworkHelper = require('../../ecoursework/ecourseworkhelper');
import SupervisorReviewComment = require('../../../worklist/shared/supervisorreviewcomment');

/**
 * class for WorkList Helper implementation
 */
class WorklistHelperBase implements worklistHelper {

    /* variable to holds the column details JSON*/
    public resolvedGridColumnsJson: any;

    /* Grid rows collection */
    public _immutableWorkListCollection: Immutable.List<gridRow>;

    // Elements to hold a dictionary with key as class name to group and collection
    // of elements
    private _groupColumns: { [id: string]: { values: Immutable.List<JSX.Element> } };

    private _dateLengthInPixel: number = 0;

    private _isNonNumeric: boolean = false;

    /**
     * Get the Configurable characteristic value.
     * @param ccName
     * @returns
     */
    protected getCCValue(ccName: string, markSchemeGroupId: number): any {
        return configurableCharacteristicsHelper.getCharacteristicValue(ccName, markSchemeGroupId);
    }

   /**
    * GenerateRowDefinion is used for generating row collection for WorkList Grid
    * @param responseListData - list of live open responses
    * @param worklistType - type of the worklist choosen
    * @param responseType - type of the response
    * @param gridType - type of gridview tile/detail
    * @returns grid row collection.
    */
    public generateRowDefinion(responseListData: WorklistBase,
        responseType: enums.ResponseMode,
        gridType: enums.GridType): Immutable.List<gridRow> {
        return this._immutableWorkListCollection;
    }

    /**
     * GenerateTableHeader is used for generating header collection.
     * @param responseType - type of the response
     * @param worklistType - type of the worklist
     * @param comparerName - type of the comparer Name
     * @param sortDirection - type of the sort Direction ascending or descending
     * @returns header collection.
     */
    public generateTableHeader(responseType: enums.ResponseMode,
        worklistType: enums.WorklistType, comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
        let _workListTableHeaderCollection = this.getTableHeaderForListView(worklistType, responseType, comparerName, sortDirection);
        return _workListTableHeaderCollection;
    }

    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    public generateFrozenRowBody(responseListData: WorklistBase,
        responseType: enums.ResponseMode,
        worklistType: enums.WorklistType): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);

        let _workListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(responseListData, worklistType, responseType);

        return _workListFrozenRowBodyCollection;
    }

    /**
     * Is used for generating row header collection for WorkList table
     * @param responseListData - list of live open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    public generateFrozenRowHeader(responseListData: WorklistBase,
        responseType: enums.ResponseMode,
        worklistType: enums.WorklistType,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean = true): Immutable.List<gridRow> {

        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
        let _workListFrozenRowHeaderCollection = this.getFrozenRowHeaderForListView
            (worklistType, responseType, comparerName, sortDirection, isSortable);

        return _workListFrozenRowHeaderCollection;
    }


   /**
    * creating react element for the  TotalMark component
    * @param responseData - response data
    * @param hasNumericMark - flag for hasNumericMark
    * @param maximumMark - maximum Mark for the response
    * @param propsNames - prop names for the component
    * @param seq - key value for the component
    * @returns JSX.Element.
    */
    public getTotalMarkElement(responseData: ResponseBase,
        hasNumericMark: boolean,
        maximumMark: number,
        propsNames: any,
        seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            isNonNumericMark: !hasNumericMark,
            maximumMark: maximumMark,
            totalMark: responseData[propsNames.totalMarkValue],
            markingProgress: responseData[propsNames.markingProgress],
            selectedLanguage: localeStore.instance.Locale
        };
        this._isNonNumeric = !hasNumericMark;
        return React.createElement(totalMark, componentProps);
    }

/**
 * NOTE: allocatedDateColumn is Obsolete after New List view worklist Changes ***
 * creating react element for the  allocatedDateColumn component
 * @param responseData - response data
 * @param propsNames - prop names for the component
 * @param seq - key value for the component
 * @returns JSX.Element.
 */
    public getAllocatedDateElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showAllocatedDateElement: boolean,
        showMarkingProgress: boolean,
        showGracePeriodTimeElement: boolean,
        isTileView: boolean = true): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            dateValue: responseData[propsNames.allocatedDate] ? new Date(responseData[propsNames.allocatedDate]) : null,
            selectedLanguage: localeStore.instance.Locale,
            isResponseHasSLAO: responseData[propsNames.hasAdditionalObjects],
            isAllAnnotated: responseData[propsNames.hasAllPagesAnnotated],
            markingProgress: showMarkingProgress ? responseData[propsNames.markingProgress] : 100,
            showAllocatedDate: showAllocatedDateElement,
            showTimeToEndofGracePeriod: showGracePeriodTimeElement,
            timeToEndOfGracePeriod: responseData[propsNames.timeToEndOfGracePeriod],
            isTileView: isTileView,
            renderedOn: Date.now(),
            markSchemeGroupId: responseData.markSchemeGroupId
        };
        return React.createElement(allocatedDateColumn, componentProps);
    }

   /**
    * creating react element for the  getGracePeriodElement component
    * @param responseData - response data
    * @param propsNames - prop names for the component
    * @param seq - key value for the component
    * @returns JSX.Element.
    */
    public getGracePeriodElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        isTileView: boolean = true): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            timeToEndOfGracePeriod: responseData[propsNames.timeToEndOfGracePeriod],
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(gracePeriodTime, componentProps);
    }

   /**
    * creating react element for the  getSLAOIndicatorElement component
    * @param responseData - response data
    * @param propsNames - prop names for the component
    * @param seq - key value for the component
    * @param showMarkingProgress - key value for the component
    * @returns JSX.Element.
    */
    public getSLAOIndicatorElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean = true): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isResponseHasSLAO: responseData[propsNames.hasAdditionalObjects],
            isAllAnnotated: responseData[propsNames.hasAllPagesAnnotated],
            isMarkingCompleted: ((showMarkingProgress ? responseData[propsNames.markingProgress] : 100) === 100) ? true : false,
            isTileView: isTileView,
            markSchemeGroupId: responseData.markSchemeGroupId
        };
        return React.createElement(slaoannotationindicator, componentProps);
    }

   /**
    * creating react element for the  getAllPageAnnotatedIndicatorElement component
    * @param responseData - response data
    * @param propsNames - prop names for the component
    * @param seq - key value for the component
    * @param showMarkingProgress - key value for the component
    * @returns JSX.Element.
    */
    public getAllPageAnnotatedIndicatorElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showMarkingProgress: boolean,
        isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            isAllAnnotated: responseData[propsNames.hasAllPagesAnnotated],
            isMarkingCompleted: ((showMarkingProgress ? responseData[propsNames.markingProgress] : 100) === 100) ? true : false,
            isTileView: isTileView,
            markSchemeGroupId: responseData.markSchemeGroupId
        };

        return React.createElement(allPageAnnotationIndicator, componentProps);
    }

   /**
    * creating react element for the  getAllocatedDate component
    * @param responseData - response data
    * @param propsNames - prop names for the component
    * @param seq - key value for the component
    * @returns JSX.Element.
    */
    public getAllocatedDate(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        showAllocatedDateElement: boolean): JSX.Element {

        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            dateValue: responseData[propsNames.allocatedDate] ? new Date(responseData[propsNames.allocatedDate]) : null,
            selectedLanguage: localeStore.instance.Locale,
            showAllocatedDate: showAllocatedDateElement,
            renderedOn: Date.now()
        };

        return React.createElement(allocatedDateElement, componentProps);
    }

   /**
    * Creating react component for the LinkedMessage component
    * @param {Response} responseData - response data
    * @param {any} propsNames prop names for the component
    * @param {number} seq key value for the component
    * @returns JSX.Element.
    */
    public getLinkedMessageElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean = true): JSX.Element {
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
    * Creating react component for the AccuracyIndicator component
    * @param {Response} responseData - response data
    * @param {any} propsNames prop names for the component
    * @param {number} seq key value for the component
    * @returns JSX.Element.
    */
    public getAccuracyIndicatorElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element {
        let componentProps: any;
        let tileView: boolean = isTileView !== null ? isTileView : false;
        componentProps = {
            key: seq,
            id: seq,
            accuracyIndicator: responseData[propsNames.accuracyIndicatorTypeID],
            isTileView: tileView,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(AccuracyIndicator, componentProps);
    }

   /**
    * Creating react component for the MarksDifferenceColumn component
    * @param {Response} responseData - response data
    * @param {any} propsNames prop names for the component
    * @param {number} seq key value for the component
    * @returns JSX.Element.
    */
    public getMarksDifferenceColumnElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean): JSX.Element {
        let componentProps: any;
        let tileView: boolean = isTileView !== null ? isTileView : false;
        componentProps = {
            key: seq,
            id: seq,
            absoluteMarksDifference: responseData[propsNames.absoluteMarksDifference],
            totalMarksDifference: responseData[propsNames.totalMarksDifference],
            accuracyIndicator: responseData[propsNames.accuracyIndicatorTypeID],
            isTileView: tileView,
            selectedLanguage: localeStore.instance.Locale,
            showAccuracyIndicator: this.doShowAccuracyIndicator,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
        };
        return React.createElement(MarksDifferenceColumn, componentProps);
    }

   /**
    * Creating react component for the MarksDifferenceColumn component
    * @param {Response} responseData - response data
    * @param {any} propsNames prop names for the component
    * @param {number} seq key value for the component
    * @returns JSX.Element.
    */
    public getMarksDifferenceElement(responseData: ResponseBase, propsNames: any, seq: string,
        marksDifferenceType: enums.MarksDifferenceType, isTileView?: boolean): JSX.Element {
        let componentProps: any;

        let marksDifference: number;
        let marksDifferenceText: string;
        let title: string;
        let className: string;
        let classNameAmd: string = 'amd small-text';
        let classNameTmd: string = 'tmd small-text';
        let titleAmd: string = markerOperationModeFactory.operationMode.absoluteMarkDifferenceTitle;
        let titleTmd: string = markerOperationModeFactory.operationMode.totalMarkDifferenceTitle;
        let marksDifferenceTextAmd: string = 'marking.worklist.tile-view-labels.amd';
        let marksDifferenceTextTmd: string = 'marking.worklist.tile-view-labels.tmd';

        switch (marksDifferenceType) {
            case enums.MarksDifferenceType.AbsoluteMarksDifference:
                marksDifference = responseData[propsNames.absoluteMarksDifference];
                marksDifferenceText = marksDifferenceTextAmd;
                title = titleAmd;
                className = classNameAmd;
                break;
            case enums.MarksDifferenceType.TotalMarksDifference:
                marksDifference = responseData[propsNames.totalMarksDifference];
                marksDifferenceText = marksDifferenceTextTmd;
                title = titleTmd;
                className = classNameTmd;
                break;
        }

        componentProps = {
            key: seq,
            id: seq,
            className: className,
            title: title,
            //TODO: remove the below ternaries once the AMD,TMD and accuracy columns included in API and SP
            marksDifference: (marksDifference) ? marksDifference : '',
            marksDifferenceText: (marksDifferenceText) ? marksDifferenceText : '',
            marksDifferenceType: (marksDifferenceType) ? marksDifferenceType : '',
            isTileView: isTileView
        };
        return React.createElement(MarksDifference, componentProps);
    }

   /**
    * Creating react component for Linked Exception component.
    * @param {Response} responseData response data
    * @param {any} propsNames prop names for the component
    * @param {number} seq key value for the component
    * @returns JSX.Element.
    */
    public getLinkedExceptionElement(responseData: ResponseBase, propsNames: any, seq: string, isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            hasExceptions: responseData[propsNames.hasExceptions],
            hasBlockingExceptions: responseData[propsNames.hasBlockingExceptions],
            hasZoningExceptions: responseData[propsNames.hasZoningExceptions],
            isZoningExceptionRaisedInSameScript: responseData[propsNames.isZoningExceptionRaisedInSameScript],
            selectedLanguage: localeStore.instance.Locale,
            resolvedExceptionsCount: responseData[propsNames.resolvedExceptionsCount],
            isTileView: isTileView,
            displayId: responseData[propsNames.displayId],
            isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode,
            unactionedExceptionCount: responseData[propsNames.unactionedExceptionCount]
        };
        return React.createElement(LinkedExceptionIndicator, componentProps);
    }

    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    public getGenericTextElement(textValue: string, seq: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue
        };
        return React.createElement(GenericTextColumn, componentProps);
    }

   /**
    * Set row style to amber if the response has blocking exceptions
    * or all pages are not annotated
    * Set row style based on Accuracy Indicator
    * @param responseStatus
    * @param accuracyType
    */
    public setRowStyle(responseStatus: Immutable.List<enums.ResponseStatus>, accuracyType?: enums.AccuracyIndicatorType): string {
        let accuracy: any;
        /**  'else' condition is put as the exception/ all pages annotated icons won't appear in Closed worklist */
        if (worklistStore.instance.isMarkingCheckMode) {
            return 'row';
        } else if (responseStatus.contains(enums.ResponseStatus.hasException) ||
            responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
            responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ||
            responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
            responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected)) {
            return 'row warning-alert';
        } else if (accuracyType !== null && this.doShowAccuracyIndicator) {
            switch (accuracyType) {
                case enums.AccuracyIndicatorType.Accurate:
                case enums.AccuracyIndicatorType.AccurateNR:
                    accuracy = 'row accurate';
                    break;
                case enums.AccuracyIndicatorType.OutsideTolerance:
                case enums.AccuracyIndicatorType.OutsideToleranceNR:
                    accuracy = 'row inaccurate';
                    break;
                case enums.AccuracyIndicatorType.WithinTolerance:
                case enums.AccuracyIndicatorType.WithinToleranceNR:
                    accuracy = 'row intolerance';
                    break;
                default:
                    accuracy = 'row';
                    break;
            }
            return accuracy;
        } else {
            return 'row';
        }
    }

    public get doShowAccuracyIndicator(): boolean {
        return markerOperationModeFactory.operationMode.doShowAccuracyIndicator;
    }

    /**
     * returns true if the seed label should be displayed.
     * @returns
     */
    public get showSeedLabel(): boolean {
        let workListType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        if (markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
            (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark)) {
            return true;
        } else {
            return false;
        }
    }

   /**
    * Set row title based on Accuracy Indicator
    * @param accuracyType
    */
    public setRowTitle(accuracyType?: enums.AccuracyIndicatorType): string {
        let title: any;
        if (accuracyType !== null) {
            switch (accuracyType) {
                case enums.AccuracyIndicatorType.Accurate:
                case enums.AccuracyIndicatorType.AccurateNR:
                    title = markerOperationModeFactory.operationMode.accurateAccuracyIndicatorTitle;
                    break;
                case enums.AccuracyIndicatorType.OutsideTolerance:
                case enums.AccuracyIndicatorType.OutsideToleranceNR:
                    title = markerOperationModeFactory.operationMode.inaccurateAccuracyIndicatorTitle;
                    break;
                case enums.AccuracyIndicatorType.WithinTolerance:
                case enums.AccuracyIndicatorType.WithinToleranceNR:
                    title = markerOperationModeFactory.operationMode.intoleranceAccuracyIndicatorTitle;
                    break;
                default:
                    title = '';
                    break;
            }
            return title;
        } else {
            return '';
        }
    }

   /**
    * creating react element for the  MarkingProgress component
    * @param responseData - response data
    * @param propsNames - prop names for the MarkingProgress component
    * @param seq - key value for the component
    * @returns JSX.Element.
    */
    public getMarkingProgressElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseStatuses: Immutable.List<enums.ResponseStatus>,
        worklistType: enums.WorklistType,
        isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        let _worklistValidatorList: worklistValidatorList = worklistValidatorList.liveOpen;
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
            _worklistValidatorList = worklistValidatorList.directedRemarkOpen;
        }
        componentProps = {
            key: seq,
            id: seq,
            responseStatus:
            worklistValidatorFactory.getValidator(_worklistValidatorList).submitButtonValidate(responseData),
            progress: responseData[propsNames.markingProgress],
            selectedLanguage: localeStore.instance.Locale,
            markGroupId: responseData[propsNames.markGroupId],
            isSubmitDisabled: markerOperationModeFactory.operationMode.isSubmitDisabled(worklistType),
            isTileView: isTileView,
            isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode
        };
        return React.createElement(MarkingProgress, componentProps);
    }

   /**
    * creating react element for the  MarkingProgress component
    * @param responseData - response data
    * @param propsNames - prop names for the MarkingProgress component
    * @param seq - key value for the component
    * @param responseMode - key value for the component
    * @param isTileView - whether tile view
    * @returns JSX.Element.
    */
    public getLastUpdatedElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        responseMode?: enums.ResponseMode,
        isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            dateType: responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending ?
                enums.WorkListDateType.lastUpdatedDate : enums.WorkListDateType.submittedDate,
            dateValue: this.getDateValueForResponseIdElement(responseMode, responseData, propsNames),
            selectedLanguage: localeStore.instance.Locale,
            isTileView: isTileView
        };
        return React.createElement(LastUpdatedColumn, componentProps);
    }

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    public getResponseIdColumnElement(responseData: ResponseBase,
        propsNames: any,
		seq: string,
		hasNumericMark: boolean,
        responseMode?: enums.ResponseMode,
		displayText?: string,
        isResponseIdClickable: boolean = true,
        isSeedResponse: boolean = false,
        isTileView: boolean = true,
        isResponseLabelType?: enums.ResponseType): JSX.Element {
        let componentProps: any;
        let _displayId = ((displayText) ? displayText : '') + responseData[propsNames.displayId];
        let qualityFeedbackCCOn = (configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.AutomaticQualityFeedback,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');

        if ((responseData).isWholeResponse) {
            isResponseLabelType = enums.ResponseType.WholeResponse;
        }
        componentProps = {
            key: seq,
            id: seq,
            displayId: _displayId,
            isClickable: isResponseIdClickable,
            worklistDateType: responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending ?
                enums.WorkListDateType.lastUpdatedDate : enums.WorkListDateType.submittedDate,
            dateValue: this.getDateValueForResponseIdElement(responseMode, responseData, propsNames),
            selectedLanguage: localeStore.instance.Locale,
            isResponseTypeLabelVisible: ((responseData).isWholeResponse && (responseData).atypicalStatus === 0) ? true :
                !markerOperationModeFactory.operationMode.isSeedLabelHidden
                && isSeedResponse  && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown,
			isTileView: isTileView,
			hasNumericMark: hasNumericMark,
			markingProgress: responseData.markingProgress,
            totalMarkValue: responseData.totalMarkValue,
            responseType: isResponseLabelType

        };
        return React.createElement(responseIdColumn, componentProps);
    }

    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    public getResponseIdElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        displayText?: string,
        isResponseIdClickable: boolean = true,
        isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        let _displayText: string;

        if (displayText) {
            _displayText = (responseData[propsNames.rigOrder] !== 0 && !isTileView) ?
                displayText + responseData[propsNames.rigOrder] + ' (' + responseData[propsNames.esDisplayId] + ')' :
                displayText + responseData[propsNames.displayId];
        } else {
            _displayText = responseData[propsNames.displayId];
        }

        componentProps = {
            key: seq,
            id: seq,
            displayId: responseData[propsNames.displayId],
            displayText: _displayText,
            isClickable: isResponseIdClickable,
            isTileView: isTileView
        };
        return React.createElement(ResponseIdGridElement, componentProps);
    }

    /**
     * get date value fpr response id column according to response mode
     * @param responseMode
     * @param response
     * @param propsNames
     */
    public getDateValueForResponseIdElement(responseMode: enums.ResponseMode, response: ResponseBase, propsNames: any): Date {
        let dateValue: Date = undefined;

        if (responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending) {
            dateValue = response[propsNames.updatedDate] ?
                new Date(response[propsNames.updatedDate]) : null;
        } else {
            dateValue = response[propsNames.submittedDate] ?
                new Date(response[propsNames.submittedDate]) : null;
        }
        return dateValue;
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
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    public getGridRow(
        responseStatus: Immutable.List<enums.ResponseStatus>,
        displayId: string,
        gridCells: Array<gridCell>,
        accuracyType?: enums.AccuracyIndicatorType,
        additionalComponent?: JSX.Element,
        cssClass?: string): gridRow {

        let _gridRow: gridRow = new gridRow();
        let className = this.setRowStyle(responseStatus, accuracyType !== null ? accuracyType : null);
        className = (cssClass) ? (className + ' ' + cssClass) : className;

        _gridRow.setRowStyle(className);
        _gridRow.setRowId(parseFloat(displayId));
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        // setting row title based on Accuracy Indicator
        _gridRow.setRowTitle(this.setRowTitle(accuracyType !== null ? accuracyType : null));
        return _gridRow;
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
     * Show the AllPageAnnotationIndicator when the CC is on and marking is completed
     * blocking submission.
     * @param {ResponseBase} responseData
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    public getAllPageAnnotationIndicatorElement
        (responseData: ResponseBase,
        propsNames: any,
        seq: string,
        isTileView: boolean = true,
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
                isTileView: isTileView,
                markSchemeGroupId: responseData.markSchemeGroupId
            };

            let allPageElement = Immutable.List<JSX.Element>([React.createElement(allPageAnnotationIndicator, componentProps)]);
            return this.getWrappedColumn(allPageElement, 'col wl-slao-holder', seq + 'wrapped').columnElement;
        }
        return undefined;
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
     * Check if response is seed
     * @param seedType
     */
    public isSeedResponse(seedType: enums.SeedType) {

        return seedType !== enums.SeedType.None ? true : false;
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
     * Gets the response label type for worklist
     *
     * @protected
     * @param {string} seq
     * @param {boolean} [isResponseTypeLabelVisible]
     * @param {enums.ResponseType} [responseType]
     * @returns {JSX.Element}
     * @memberof WorklistHelperBase
     */
    protected getResponseTypeLabel(seq: string,
        isResponseTypeLabelVisible?: boolean, responseType?: enums.ResponseType): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            isResponseTypeLabelVisible: isResponseTypeLabelVisible,
            responseType: responseType
        };

        return React.createElement(ResponseTypeLabel, componentProps);
    }

    /**
     * returns the sample label element
     * @param seq
     * @param sampleCommentId
     */
    protected getSampleLabel(seq: string,
        sampleCommentId: number): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            sampleCommentId: sampleCommentId
        };

        return React.createElement(SampleLabel, componentProps);
    }

    /**
     * returns the reviewed by label element
     * @param seq
     * @param responseData
     */
    protected getReviewedByLabel(seq: string,
        responseData: ResponseBase): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            reviewedById: responseData.reviewedByRoleId,
            reviewedByInitials: responseData.reviewedByInitials,
            reviewedBySurname: responseData.reviewedBySurname,
            isAutoChecked: !this.getSeniorExaminerPoolCCValue() && responseData.esMarkGroupStatus === enums.ESMarkGroupStatus.AutoChecked
        };

        return React.createElement(ReviewedByLabel, componentProps);
    }

    /**
     * returns the QualityFeedbackBanner component
     * @param index - row index
     * @param worklistType
     */
    protected renderQualityFeedbackBanner(rowIndex: number, worklistType: enums.WorklistType) {

        let isQualityFeedbackMessageToBeDisplayed: boolean =
            qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(worklistType);
        if (rowIndex === 0 && isQualityFeedbackMessageToBeDisplayed) {
            let componentProps = {
                id: 'quality-feedback-banner',
                key: 'quality-feedback-banner',
                isAriaHidden: false,
                selectedLanguage: localeStore.instance.Locale,
                header: '',
                message: qualityFeedbackHelper.getQualityFeedbackStatusMessage(),
                role: '',
                bannerType: enums.BannerType.QualityFeedbackBanner
            };

            return React.createElement(QualityFeedbackBanner, componentProps);
        }
    }

    /**
     * returns the OriginalMark React component
     * @param seq
     * @param responseData
     */
    protected getOriginalMarkElement(seq: string,
        responseData: ResponseBase,
        propsNames: any,
        isVisible: boolean): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            isNonNumericMark: this._isNonNumeric,
            originalMarkTotal: responseData[propsNames.originalMarkTotal],
            isVisible: isVisible,
            accuracyIndicatorType: responseData[propsNames.accuracyIndicatorTypeID]
        };

        return React.createElement(OriginalMark, componentProps);
    }

    /**
     * returns the OriginalMark accuracy React component
     * @param seq
     * @param responseData
     */
    protected getOriginalMarkAccuracyElement(seq: string,
        responseData: ResponseBase,
        propsNames: any,
        isVisible: boolean): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            isVisible: isVisible,
            accuracyIndicatorType: responseData[propsNames.accuracyIndicatorTypeID]
        };

        return React.createElement(OriginalMarkAccuracy, componentProps);
    }

    /**
     * returns supervisor review comment
     * @param seq
     * @param responseData
     */
    protected getSupervisorReviewComment(seq: string,
        responseData: ResponseBase): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            reviewCommentId: responseData.setAsReviewedCommentId,
        };

        return React.createElement(SupervisorReviewComment, componentProps);
    }

    /**
     * returns the table row collection for worklist table header.
     * @param worklistType
     * @param responseMode
     */
    public getTableHeaderForListView(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        comparerName: string, sortDirection: enums.SortDirection): Immutable.List<gridRow> {

        let _workListColumnHeaderCollection = Array<gridRow>();
        let _workListCell: gridCell;
        let _worklistRow = new gridRow();
        let _workListColumnHeaderCellcollection: Array<gridCell> = new Array();
        let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, worklistType, responseMode);
        let gridColumnLength = gridColumns.length;

        this.resetDynamicColumnSettings();

        // Getting the worklist columns
        for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {

            _workListCell = new gridCell();
            let _responseColumn = gridColumns[gridColumnCount].GridColumn;

            let headerText = gridColumns[gridColumnCount].ColumnHeader;
            let _comparerName = gridColumns[gridColumnCount].ComparerName;

            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            let key = 'columnHeader_' + gridColumnCount;


            _workListCell.columnElement = this.getColumnHeaderElement(
                key,
                headerText,
                _responseColumn,
                (comparerName === _comparerName),
                (gridColumns[gridColumnCount].Sortable === 'true'),
                sortDirection
            );

            _workListCell.isHidden = this.getCellVisibility(_responseColumn);

            _workListCell.comparerName = _comparerName;
            _workListCell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);

            let cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _workListCell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _workListColumnHeaderCellcollection.push(_workListCell);
        }

        _worklistRow.setRowId(1);
        _worklistRow.setCells(_workListColumnHeaderCellcollection);
        _workListColumnHeaderCollection.push(_worklistRow);

        let _workListTableHeaderCollection = Immutable.fromJS(_workListColumnHeaderCollection);
        return _workListTableHeaderCollection;
    }

    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    public getFrozenRowBodyForListView(responseListData: WorklistBase, worklistType: enums.WorklistType,
        responseMode: enums.ResponseMode): Immutable.List<gridRow> {

        let _workListRowHeaderCellcollection = Array<gridCell>();
        let _worklistRow: gridRow;
        let _workListRowCollection = Array<gridRow>();
        let _responseColumn: any;
        let componentPropsJson: any;
        let _workListCell: gridCell;
        let key: string;
        let cssClass: string;

        if (responseListData != null) {
            let gridSeq = responseListData.responses.keySeq();
            let _responseListData = responseListData.responses.toArray();
            for (let responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListRowHeaderCellcollection = new Array();

                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                let responseData: ResponseBase = _responseListData[responseListCount];
                let responseStatus = this.getResponseStatus(responseData, responseMode);

                let gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, worklistType, responseMode, true);
                let gridColumnLength = gridColumns.length;

                // Getting the worklist columns
                for (let gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;

                    //Switch statement for adding frozen columns in future.
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdElement(responseData,
                                componentPropsJson,
                                key,
                                this.getDisplayTextOfResponse(worklistType), true, false);

                            _workListCell.setCellStyle('col-response header-col');
                            _workListRowHeaderCellcollection.push(_workListCell);
                            if (worklistType === enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark) {
                                let additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                                _workListCell.setAdditionalElement(additionalComponent);
                                cssClass = (additionalComponent) ? 'highlight-seed' : '';
                            } else {
                                cssClass = '';
                            }

                            break;
                    }
                }

                // Creating the table row collection.
                _workListRowCollection.push(
                    this.getGridRow(
                        responseStatus,
                        responseData.displayId,
                        _workListRowHeaderCellcollection,
                        this.getAccuracyType(responseMode, responseData),
                        undefined,
                        cssClass
                    ));
            }
        }
        let _workListFrozenRowBodyCollection = Immutable.fromJS(_workListRowCollection);
        return _workListFrozenRowBodyCollection;
    }

   /**
    * returns the table row elements for frozen table header
    * @param responseListData - list of responses
    * @returns grid row collection.
    */
    public getFrozenRowHeaderForListView(worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        comparerName: string, sortDirection: enums.SortDirection, isSortable: boolean): Immutable.List<gridRow> {

        let _workListColumnHeaderCollection = Array<gridRow>();
        let _workListCell: gridCell;
        let _worklistRow = new gridRow();
        let _workListColumnHeaderCellcollection: Array<gridCell> = new Array();
        _workListCell = new gridCell();
        let key = 'frozenRowHeader';

        let _comparerName = comparerList.responseIdComparer;

        //TODO : Move the magic strings outside (json?)
        _workListCell.columnElement = this.getColumnHeaderElement(
            key,
            localeStore.instance.TranslateText('marking.worklist.list-view-column-headers.response-id'),
            undefined,
            (comparerList[comparerName] === _comparerName),
            isSortable,
            sortDirection
        );
        _workListCell.comparerName = comparerList[_comparerName];
        _workListCell.sortDirection = this.getSortDirection((comparerList[comparerName] === _comparerName), sortDirection);

        _workListCell.setCellStyle('col-response header-col');
        // Creating the grid row collection.
        _workListColumnHeaderCellcollection.push(_workListCell);

        _worklistRow.setRowId(1);
        _worklistRow.setCells(_workListColumnHeaderCellcollection);
        _workListColumnHeaderCollection.push(_worklistRow);

        let _workListFrozenRowHeaderCollection = Immutable.fromJS(_workListColumnHeaderCollection);

        return _workListFrozenRowHeaderCollection;
    }

    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    protected getGridColumns(resolvedGridColumnsJson: any, worklistType: enums.WorklistType, responseMode: enums.ResponseMode,
        isFrozen: boolean = false) {
        let gridColumns: any;
        return gridColumns;
    }

    /**
     * return the display text for response id
     * @param worklistType
     */
    public getDisplayTextOfResponse(worklistType: enums.WorklistType): string {

        let displayText: string = undefined;

        switch (worklistType) {
            case enums.WorklistType.practice:
                displayText = localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title') + ' ';
                break;
            case enums.WorklistType.standardisation:
                displayText = localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title') + ' ';
                break;
            case enums.WorklistType.secondstandardisation:
                let isESTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
                displayText = isESTeamMember ?
                    localeStore.instance.TranslateText('marking.worklist.response-data.stm-standardisation-response-title') + ' ' :
                    localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title') + ' ';
                break;
        }

        return displayText;
    }

    /**
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    protected getResponseStatus(responseData: ResponseBase, responseMode: enums.ResponseMode):
        Immutable.List<enums.ResponseStatus> {

        let responseStatus: Immutable.List<enums.ResponseStatus>;
        return responseStatus;
    }

   /**
    * returns whether the the given column is hidden or not
    * @param responseColumn
    */
    protected getCellVisibility(column: string): boolean {
        return false;
    }

    /**
     * returns the accuracy type based on accuracy  and CC values
     * @param responseMode
     * @param responseData
     */
    protected getAccuracyType(responseMode: enums.ResponseMode, responseData: ResponseBase): enums.AccuracyIndicatorType {

        return enums.AccuracyIndicatorType.Unknown;
    }

    /**
     * returns whether the current qig is structured or not.
     */
    protected isStructuredQIG(): boolean {
        return (qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.Structured);
    }

    /**
     * returns whether the value is numeric or not.
     */
    protected isNonNumeric(): boolean {
        return this._isNonNumeric;
    }


    /**
     * Sets the whether the response is numeric or not.
     */
    protected setNonNumeric(isNonNumeric: boolean): void {
        this._isNonNumeric = isNonNumeric;
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
     * get the value of senior examiner pool cc.
     */
    protected getSeniorExaminerPoolCCValue() {
        let ccValue = configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.SeniorExaminerPool,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        return ccValue;
    }

    /**
     * returns the Selected Tag Id of response.
     * @param seq
     * @param tagId
     * @param tagList
     * @param markGroupId
     */
    protected getTag(seq: string, tagId: number, tagList: immutable.List<Tag>,
        markGroupId: number): JSX.Element {

        let componentProps: any;

        componentProps = {
            key: seq,
            id: seq,
            selectedTagId: tagId,
            tagList: tagList,
            markGroupId: markGroupId
        };

        return React.createElement(TagList, componentProps);
    }

    /**
     * creating react element for the  getAllPageAnnotatedIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    public getAllFilesNotViewedIndicatorElement(responseData: ResponseBase,
        propsNames: any,
        seq: string,
        isTileView: boolean = true): JSX.Element {
        let componentProps: any;
        componentProps = {
            key: seq,
            id: seq,
            selectedLanguage: localeStore.instance.Locale,
            allFilesViewed: responseData[propsNames.allFilesViewed],
            isMarkingCompleted: responseData[propsNames.markingProgress] === 100 ? true : false,
            isTileView: isTileView,
            isECourseworkComponent: eCourseworkHelper.isECourseworkComponent
        };

        return React.createElement(allFilesNotViewedIndicator, componentProps);
    }
}
export = WorklistHelperBase;
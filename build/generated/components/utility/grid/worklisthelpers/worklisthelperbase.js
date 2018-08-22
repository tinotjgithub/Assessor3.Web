"use strict";
var React = require('react');
var gridRow = require('../../../utility/grid/gridrow');
var Immutable = require('immutable');
var gridCell = require('../../../utility/grid/gridcell');
var MarkingProgress = require('../../../worklist/shared/markingprogress');
var LastUpdatedColumn = require('../../../worklist/shared/lastupdatedcolumn');
var totalMark = require('../../../worklist/shared/totalmarkdetail');
var responseIdColumn = require('../../../worklist/shared/responseidcolumn');
var ResponseIdGridElement = require('../../../worklist/shared/responseidgridelement');
var allocatedDateColumn = require('../../../worklist/shared/allocateddatecolumn');
var LinkedMessageIndicator = require('../../../worklist/shared/linkedmessageindicator');
var AccuracyIndicator = require('../../../worklist/shared/accuracyindicator');
var MarksDifferenceColumn = require('../../../worklist/shared/marksdifferencecolumn');
var MarksDifference = require('../../../worklist/shared/marksdifference');
var LinkedExceptionIndicator = require('../../../worklist/shared/linkedexceptionindicator');
var gracePeriodTime = require('../../../worklist/shared/graceperiodtime');
var localeStore = require('../../../../stores/locale/localestore');
var worklistValidatorFactory = require('../../../../utility/worklistvalidators/worklistvalidatorfactory');
var worklistValidatorList = require('../../../../utility/worklistvalidators/worklistvalidatorlist');
var enums = require('../../enums');
var GenericComponentWrapper = require('../genericcomponentwrapper');
var configurableCharacteristicsHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var allPageAnnotationIndicator = require('../../../worklist/shared/allpageannotationindicator');
var ResponseTypeLabel = require('../../../worklist/shared/responsetypelabel');
var ColumnHeader = require('../../../worklist/shared/columnheader');
var allocatedDateElement = require('../../../worklist/shared/allocateddate');
var slaoannotationindicator = require('../../../worklist/shared/slaoannotationindicator');
var qualityFeedbackHelper = require('../../../../utility/qualityfeedback/qualityfeedbackhelper');
var QualityFeedbackBanner = require('../../../worklist/banner/qualityfeedbackbanner');
var gridColumnNames = require('../gridcolumnnames');
var jsonRefResolver = require('../../../../utility/jsonrefresolver/josnrefresolver');
var qigStore = require('../../../../stores/qigselector/qigstore');
var worklistGridColumnsJson = require('../../../utility/grid/worklistgridcolumns.json');
var GenericTextColumn = require('../../../worklist/shared/generictextcolumn');
var worklistStore = require('../../../../stores/worklist/workliststore');
var comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
var SampleLabel = require('../../../worklist/shared/samplelabel');
var ReviewedByLabel = require('../../../worklist/shared/reviewedbylabel');
var markerOperationModeFactory = require('../../markeroperationmode/markeroperationmodefactory');
var OriginalMark = require('../../../worklist/shared/originalmarktotal');
var OriginalMarkAccuracy = require('../../../worklist/shared/originalmarkaccuracy');
var TagList = require('../../../response/responsescreen/taglist');
var allFilesNotViewedIndicator = require('../../../worklist/shared/allfilesnotviewedindicator');
var eCourseworkHelper = require('../../ecoursework/ecourseworkhelper');
var SupervisorReviewComment = require('../../../worklist/shared/supervisorreviewcomment');
/**
 * class for WorkList Helper implementation
 */
var WorklistHelperBase = (function () {
    function WorklistHelperBase() {
        this._dateLengthInPixel = 0;
        this._isNonNumeric = false;
    }
    /**
     * Get the Configurable characteristic value.
     * @param ccName
     * @returns
     */
    WorklistHelperBase.prototype.getCCValue = function (ccName, markSchemeGroupId) {
        return configurableCharacteristicsHelper.getCharacteristicValue(ccName, markSchemeGroupId);
    };
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseListData - list of live open responses
     * @param worklistType - type of the worklist choosen
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    WorklistHelperBase.prototype.generateRowDefinion = function (responseListData, responseType, gridType) {
        return this._immutableWorkListCollection;
    };
    /**
     * GenerateTableHeader is used for generating header collection.
     * @param responseType - type of the response
     * @param worklistType - type of the worklist
     * @param comparerName - type of the comparer Name
     * @param sortDirection - type of the sort Direction ascending or descending
     * @returns header collection.
     */
    WorklistHelperBase.prototype.generateTableHeader = function (responseType, worklistType, comparerName, sortDirection) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
        var _workListTableHeaderCollection = this.getTableHeaderForListView(worklistType, responseType, comparerName, sortDirection);
        return _workListTableHeaderCollection;
    };
    /**
     * GenerateRowDefinion is used for generating row collection for WorkList Grid
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    WorklistHelperBase.prototype.generateFrozenRowBody = function (responseListData, responseType, worklistType) {
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
        var _workListFrozenRowBodyCollection = this.getFrozenRowBodyForListView(responseListData, worklistType, responseType);
        return _workListFrozenRowBodyCollection;
    };
    /**
     * Is used for generating row header collection for WorkList table
     * @param responseListData - list of live open responses
     * @param responseType - type of the response
     * @param gridType - type of gridview tile/detail
     * @returns grid row collection.
     */
    WorklistHelperBase.prototype.generateFrozenRowHeader = function (responseListData, responseType, worklistType, comparerName, sortDirection, isSortable) {
        if (isSortable === void 0) { isSortable = true; }
        this.resolvedGridColumnsJson = jsonRefResolver.resolveRefs(worklistGridColumnsJson);
        var _workListFrozenRowHeaderCollection = this.getFrozenRowHeaderForListView(worklistType, responseType, comparerName, sortDirection, isSortable);
        return _workListFrozenRowHeaderCollection;
    };
    /**
     * creating react element for the  TotalMark component
     * @param responseData - response data
     * @param hasNumericMark - flag for hasNumericMark
     * @param maximumMark - maximum Mark for the response
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getTotalMarkElement = function (responseData, hasNumericMark, maximumMark, propsNames, seq) {
        var componentProps;
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
    };
    /**
     * NOTE: allocatedDateColumn is Obsolete after New List view worklist Changes ***
     * creating react element for the  allocatedDateColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getAllocatedDateElement = function (responseData, propsNames, seq, showAllocatedDateElement, showMarkingProgress, showGracePeriodTimeElement, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * creating react element for the  getGracePeriodElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getGracePeriodElement = function (responseData, propsNames, seq, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            timeToEndOfGracePeriod: responseData[propsNames.timeToEndOfGracePeriod],
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(gracePeriodTime, componentProps);
    };
    /**
     * creating react element for the  getSLAOIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getSLAOIndicatorElement = function (responseData, propsNames, seq, showMarkingProgress, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * creating react element for the  getAllPageAnnotatedIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getAllPageAnnotatedIndicatorElement = function (responseData, propsNames, seq, showMarkingProgress, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * creating react element for the  getAllocatedDate component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getAllocatedDate = function (responseData, propsNames, seq, showAllocatedDateElement) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            dateValue: responseData[propsNames.allocatedDate] ? new Date(responseData[propsNames.allocatedDate]) : null,
            selectedLanguage: localeStore.instance.Locale,
            showAllocatedDate: showAllocatedDateElement,
            renderedOn: Date.now()
        };
        return React.createElement(allocatedDateElement, componentProps);
    };
    /**
     * Creating react component for the LinkedMessage component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getLinkedMessageElement = function (responseData, propsNames, seq, isTileView) {
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
     * Creating react component for the AccuracyIndicator component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getAccuracyIndicatorElement = function (responseData, propsNames, seq, isTileView) {
        var componentProps;
        var tileView = isTileView !== null ? isTileView : false;
        componentProps = {
            key: seq,
            id: seq,
            accuracyIndicator: responseData[propsNames.accuracyIndicatorTypeID],
            isTileView: tileView,
            selectedLanguage: localeStore.instance.Locale
        };
        return React.createElement(AccuracyIndicator, componentProps);
    };
    /**
     * Creating react component for the MarksDifferenceColumn component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getMarksDifferenceColumnElement = function (responseData, propsNames, seq, isTileView) {
        var componentProps;
        var tileView = isTileView !== null ? isTileView : false;
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
    };
    /**
     * Creating react component for the MarksDifferenceColumn component
     * @param {Response} responseData - response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getMarksDifferenceElement = function (responseData, propsNames, seq, marksDifferenceType, isTileView) {
        var componentProps;
        var marksDifference;
        var marksDifferenceText;
        var title;
        var className;
        var classNameAmd = 'amd small-text';
        var classNameTmd = 'tmd small-text';
        var titleAmd = markerOperationModeFactory.operationMode.absoluteMarkDifferenceTitle;
        var titleTmd = markerOperationModeFactory.operationMode.totalMarkDifferenceTitle;
        var marksDifferenceTextAmd = 'marking.worklist.tile-view-labels.amd';
        var marksDifferenceTextTmd = 'marking.worklist.tile-view-labels.tmd';
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
    };
    /**
     * Creating react component for Linked Exception component.
     * @param {Response} responseData response data
     * @param {any} propsNames prop names for the component
     * @param {number} seq key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getLinkedExceptionElement = function (responseData, propsNames, seq, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * Get generic text column
     * @param {string} textValue
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    WorklistHelperBase.prototype.getGenericTextElement = function (textValue, seq) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            textValue: textValue
        };
        return React.createElement(GenericTextColumn, componentProps);
    };
    /**
     * Set row style to amber if the response has blocking exceptions
     * or all pages are not annotated
     * Set row style based on Accuracy Indicator
     * @param responseStatus
     * @param accuracyType
     */
    WorklistHelperBase.prototype.setRowStyle = function (responseStatus, accuracyType) {
        var accuracy;
        /**  'else' condition is put as the exception/ all pages annotated icons won't appear in Closed worklist */
        if (worklistStore.instance.isMarkingCheckMode) {
            return 'row';
        }
        else if (responseStatus.contains(enums.ResponseStatus.hasException) ||
            responseStatus.contains(enums.ResponseStatus.hasZoningException) ||
            responseStatus.contains(enums.ResponseStatus.notAllPagesAnnotated) ||
            responseStatus.contains(enums.ResponseStatus.markChangeReasonNotExist) ||
            responseStatus.contains(enums.ResponseStatus.supervisorRemarkDecisionNotSelected)) {
            return 'row warning-alert';
        }
        else if (accuracyType !== null && this.doShowAccuracyIndicator) {
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
        }
        else {
            return 'row';
        }
    };
    Object.defineProperty(WorklistHelperBase.prototype, "doShowAccuracyIndicator", {
        get: function () {
            return markerOperationModeFactory.operationMode.doShowAccuracyIndicator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WorklistHelperBase.prototype, "showSeedLabel", {
        /**
         * returns true if the seed label should be displayed.
         * @returns
         */
        get: function () {
            var workListType = worklistStore.instance.currentWorklistType;
            if (markerOperationModeFactory.operationMode.isAutomaticQualityFeedbackCCOn &&
                (workListType === enums.WorklistType.live || workListType === enums.WorklistType.directedRemark)) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set row title based on Accuracy Indicator
     * @param accuracyType
     */
    WorklistHelperBase.prototype.setRowTitle = function (accuracyType) {
        var title;
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
        }
        else {
            return '';
        }
    };
    /**
     * creating react element for the  MarkingProgress component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getMarkingProgressElement = function (responseData, propsNames, seq, responseStatuses, worklistType, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
        var _worklistValidatorList = worklistValidatorList.liveOpen;
        if (worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark) {
            _worklistValidatorList = worklistValidatorList.directedRemarkOpen;
        }
        componentProps = {
            key: seq,
            id: seq,
            responseStatus: worklistValidatorFactory.getValidator(_worklistValidatorList).submitButtonValidate(responseData),
            progress: responseData[propsNames.markingProgress],
            selectedLanguage: localeStore.instance.Locale,
            markGroupId: responseData[propsNames.markGroupId],
            isSubmitDisabled: markerOperationModeFactory.operationMode.isSubmitDisabled(worklistType),
            isTileView: isTileView,
            isTeamManagementMode: markerOperationModeFactory.operationMode.isTeamManagementMode
        };
        return React.createElement(MarkingProgress, componentProps);
    };
    /**
     * creating react element for the  MarkingProgress component
     * @param responseData - response data
     * @param propsNames - prop names for the MarkingProgress component
     * @param seq - key value for the component
     * @param responseMode - key value for the component
     * @param isTileView - whether tile view
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getLastUpdatedElement = function (responseData, propsNames, seq, responseMode, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getResponseIdColumnElement = function (responseData, propsNames, seq, hasNumericMark, responseMode, displayText, isResponseIdClickable, isSeedResponse, isTileView, isResponseLabelType) {
        if (isResponseIdClickable === void 0) { isResponseIdClickable = true; }
        if (isSeedResponse === void 0) { isSeedResponse = false; }
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
        var _displayId = ((displayText) ? displayText : '') + responseData[propsNames.displayId];
        var qualityFeedbackCCOn = (configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.AutomaticQualityFeedback, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId) === 'true');
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
                    && isSeedResponse && responseData.accuracyIndicatorTypeID !== enums.AccuracyIndicatorType.Unknown,
            isTileView: isTileView,
            hasNumericMark: hasNumericMark,
            markingProgress: responseData.markingProgress,
            totalMarkValue: responseData.totalMarkValue,
            responseType: isResponseLabelType
        };
        return React.createElement(responseIdColumn, componentProps);
    };
    /**
     * creating react element for the  ResponseIdColumn component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getResponseIdElement = function (responseData, propsNames, seq, displayText, isResponseIdClickable, isTileView) {
        if (isResponseIdClickable === void 0) { isResponseIdClickable = true; }
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
        var _displayText;
        if (displayText) {
            _displayText = (responseData[propsNames.rigOrder] !== 0 && !isTileView) ?
                displayText + responseData[propsNames.rigOrder] + ' (' + responseData[propsNames.esDisplayId] + ')' :
                displayText + responseData[propsNames.displayId];
        }
        else {
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
    };
    /**
     * get date value fpr response id column according to response mode
     * @param responseMode
     * @param response
     * @param propsNames
     */
    WorklistHelperBase.prototype.getDateValueForResponseIdElement = function (responseMode, response, propsNames) {
        var dateValue = undefined;
        if (responseMode === enums.ResponseMode.open || responseMode === enums.ResponseMode.pending) {
            dateValue = response[propsNames.updatedDate] ?
                new Date(response[propsNames.updatedDate]) : null;
        }
        else {
            dateValue = response[propsNames.submittedDate] ?
                new Date(response[propsNames.submittedDate]) : null;
        }
        return dateValue;
    };
    /**
     * create a wraper for grid column
     * @param elements
     * @param className
     * @param seq
     */
    WorklistHelperBase.prototype.getWrappedColumn = function (elements, className, seq) {
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
    WorklistHelperBase.prototype.getGridCells = function (gridgridLeftColumn, gridMiddleColumn, key, gridRightColumn) {
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
     * creating grid row
     * @param responseStatus
     * @param displayId
     * @param gridCells
     * @param accuracyType - to display AMD and TMD based on Accuracy Indicator
     * @returns grid row.
     */
    WorklistHelperBase.prototype.getGridRow = function (responseStatus, displayId, gridCells, accuracyType, additionalComponent, cssClass) {
        var _gridRow = new gridRow();
        var className = this.setRowStyle(responseStatus, accuracyType !== null ? accuracyType : null);
        className = (cssClass) ? (className + ' ' + cssClass) : className;
        _gridRow.setRowStyle(className);
        _gridRow.setRowId(parseFloat(displayId));
        _gridRow.setCells(gridCells);
        _gridRow.setAdditionalElement(additionalComponent);
        // setting row title based on Accuracy Indicator
        _gridRow.setRowTitle(this.setRowTitle(accuracyType !== null ? accuracyType : null));
        return _gridRow;
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
    WorklistHelperBase.prototype.groupColumnElements = function (groupClassName, seq) {
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
     * Show the AllPageAnnotationIndicator when the CC is on and marking is completed
     * blocking submission.
     * @param {ResponseBase} responseData
     * @param {any} propsNames
     * @param {string} seq
     * @returns
     */
    WorklistHelperBase.prototype.getAllPageAnnotationIndicatorElement = function (responseData, propsNames, seq, isTileView, showMarkingProgress) {
        if (isTileView === void 0) { isTileView = true; }
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
                isTileView: isTileView,
                markSchemeGroupId: responseData.markSchemeGroupId
            };
            var allPageElement = Immutable.List([React.createElement(allPageAnnotationIndicator, componentProps)]);
            return this.getWrappedColumn(allPageElement, 'col wl-slao-holder', seq + 'wrapped').columnElement;
        }
        return undefined;
    };
    /**
     * Start with fresh group.
     */
    WorklistHelperBase.prototype.emptyGroupColumns = function () {
        // start with a fresh list of column group set.
        this._groupColumns = {};
    };
    Object.defineProperty(WorklistHelperBase.prototype, "groupColumns", {
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
    WorklistHelperBase.prototype.mapGroupColumns = function (className, element) {
        // If not group class has been added create a new object
        // otherwise add to the existing.
        if (this._groupColumns[className] === undefined) {
            this._groupColumns[className] = { values: Immutable.List() };
        }
        this._groupColumns[className].values = this._groupColumns[className].values.push(element);
    };
    /**
     * Check if response is seed
     * @param seedType
     */
    WorklistHelperBase.prototype.isSeedResponse = function (seedType) {
        return seedType !== enums.SeedType.None ? true : false;
    };
    /**
     * creating react element for the  Column Header component
     * @param seq - key value for the component
     * @param displayText - the text to append with the display id.
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getColumnHeaderElement = function (seq, headerText, gridColumn, isCurrentSort, isSortRequired, sortDirection) {
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
     * Gets the response label type for worklist
     *
     * @protected
     * @param {string} seq
     * @param {boolean} [isResponseTypeLabelVisible]
     * @param {enums.ResponseType} [responseType]
     * @returns {JSX.Element}
     * @memberof WorklistHelperBase
     */
    WorklistHelperBase.prototype.getResponseTypeLabel = function (seq, isResponseTypeLabelVisible, responseType) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            isResponseTypeLabelVisible: isResponseTypeLabelVisible,
            responseType: responseType
        };
        return React.createElement(ResponseTypeLabel, componentProps);
    };
    /**
     * returns the sample label element
     * @param seq
     * @param sampleCommentId
     */
    WorklistHelperBase.prototype.getSampleLabel = function (seq, sampleCommentId) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            sampleCommentId: sampleCommentId
        };
        return React.createElement(SampleLabel, componentProps);
    };
    /**
     * returns the reviewed by label element
     * @param seq
     * @param responseData
     */
    WorklistHelperBase.prototype.getReviewedByLabel = function (seq, responseData) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            reviewedById: responseData.reviewedByRoleId,
            reviewedByInitials: responseData.reviewedByInitials,
            reviewedBySurname: responseData.reviewedBySurname,
            isAutoChecked: !this.getSeniorExaminerPoolCCValue() && responseData.esMarkGroupStatus === enums.ESMarkGroupStatus.AutoChecked
        };
        return React.createElement(ReviewedByLabel, componentProps);
    };
    /**
     * returns the QualityFeedbackBanner component
     * @param index - row index
     * @param worklistType
     */
    WorklistHelperBase.prototype.renderQualityFeedbackBanner = function (rowIndex, worklistType) {
        var isQualityFeedbackMessageToBeDisplayed = qualityFeedbackHelper.isQualtiyHelperMessageNeededToBeDisplayed(worklistType);
        if (rowIndex === 0 && isQualityFeedbackMessageToBeDisplayed) {
            var componentProps = {
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
    };
    /**
     * returns the OriginalMark React component
     * @param seq
     * @param responseData
     */
    WorklistHelperBase.prototype.getOriginalMarkElement = function (seq, responseData, propsNames, isVisible) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            isNonNumericMark: this._isNonNumeric,
            originalMarkTotal: responseData[propsNames.originalMarkTotal],
            isVisible: isVisible,
            accuracyIndicatorType: responseData[propsNames.accuracyIndicatorTypeID]
        };
        return React.createElement(OriginalMark, componentProps);
    };
    /**
     * returns the OriginalMark accuracy React component
     * @param seq
     * @param responseData
     */
    WorklistHelperBase.prototype.getOriginalMarkAccuracyElement = function (seq, responseData, propsNames, isVisible) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            isVisible: isVisible,
            accuracyIndicatorType: responseData[propsNames.accuracyIndicatorTypeID]
        };
        return React.createElement(OriginalMarkAccuracy, componentProps);
    };
    /**
     * returns supervisor review comment
     * @param seq
     * @param responseData
     */
    WorklistHelperBase.prototype.getSupervisorReviewComment = function (seq, responseData) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            reviewCommentId: responseData.setAsReviewedCommentId,
        };
        return React.createElement(SupervisorReviewComment, componentProps);
    };
    /**
     * returns the table row collection for worklist table header.
     * @param worklistType
     * @param responseMode
     */
    WorklistHelperBase.prototype.getTableHeaderForListView = function (worklistType, responseMode, comparerName, sortDirection) {
        var _workListColumnHeaderCollection = Array();
        var _workListCell;
        var _worklistRow = new gridRow();
        var _workListColumnHeaderCellcollection = new Array();
        var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, worklistType, responseMode);
        var gridColumnLength = gridColumns.length;
        this.resetDynamicColumnSettings();
        // Getting the worklist columns
        for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
            _workListCell = new gridCell();
            var _responseColumn = gridColumns[gridColumnCount].GridColumn;
            var headerText = gridColumns[gridColumnCount].ColumnHeader;
            var _comparerName = gridColumns[gridColumnCount].ComparerName;
            headerText = (headerText && headerText !== '') ? localeStore.instance.TranslateText(headerText) : '';
            var key = 'columnHeader_' + gridColumnCount;
            _workListCell.columnElement = this.getColumnHeaderElement(key, headerText, _responseColumn, (comparerName === _comparerName), (gridColumns[gridColumnCount].Sortable === 'true'), sortDirection);
            _workListCell.isHidden = this.getCellVisibility(_responseColumn);
            _workListCell.comparerName = _comparerName;
            _workListCell.sortDirection = this.getSortDirection((comparerName === _comparerName), sortDirection);
            var cellStyle = (gridColumns[gridColumnCount].CssClass) ? gridColumns[gridColumnCount].CssClass : '';
            _workListCell.setCellStyle(cellStyle);
            // Creating the grid row collection.
            _workListColumnHeaderCellcollection.push(_workListCell);
        }
        _worklistRow.setRowId(1);
        _worklistRow.setCells(_workListColumnHeaderCellcollection);
        _workListColumnHeaderCollection.push(_worklistRow);
        var _workListTableHeaderCollection = Immutable.fromJS(_workListColumnHeaderCollection);
        return _workListTableHeaderCollection;
    };
    /**
     *  returns the table row collection of frozen table (response id)
     * @param responseListData
     * @param worklistType
     * @param responseMode
     */
    WorklistHelperBase.prototype.getFrozenRowBodyForListView = function (responseListData, worklistType, responseMode) {
        var _workListRowHeaderCellcollection = Array();
        var _worklistRow;
        var _workListRowCollection = Array();
        var _responseColumn;
        var componentPropsJson;
        var _workListCell;
        var key;
        var cssClass;
        if (responseListData != null) {
            var gridSeq = responseListData.responses.keySeq();
            var _responseListData = responseListData.responses.toArray();
            for (var responseListCount = 0; responseListCount < _responseListData.length; responseListCount++) {
                // Getting the worklist data row
                _worklistRow = new gridRow();
                _workListRowHeaderCellcollection = new Array();
                // instead of accessing _responseListData[responseListCount] collection inside loop, its accessed
                // outside the loop globally
                var responseData = _responseListData[responseListCount];
                var responseStatus = this.getResponseStatus(responseData, responseMode);
                var gridColumns = this.getGridColumns(this.resolvedGridColumnsJson, worklistType, responseMode, true);
                var gridColumnLength = gridColumns.length;
                // Getting the worklist columns
                for (var gridColumnCount = 0; gridColumnCount < gridColumnLength; gridColumnCount++) {
                    _responseColumn = gridColumns[gridColumnCount].GridColumn;
                    _workListCell = new gridCell();
                    componentPropsJson = gridColumns[gridColumnCount].ComponentProps;
                    //Switch statement for adding frozen columns in future.
                    switch (_responseColumn) {
                        case gridColumnNames.ResponseIdColumn:
                            key = gridSeq.get(responseListCount) + '_ResponseIdColumn_' + gridColumnCount;
                            _workListCell.columnElement = this.getResponseIdElement(responseData, componentPropsJson, key, this.getDisplayTextOfResponse(worklistType), true, false);
                            _workListCell.setCellStyle('col-response header-col');
                            _workListRowHeaderCellcollection.push(_workListCell);
                            if (worklistType === enums.WorklistType.live || worklistType === enums.WorklistType.directedRemark) {
                                var additionalComponent = this.renderQualityFeedbackBanner(responseListCount, enums.WorklistType.live);
                                _workListCell.setAdditionalElement(additionalComponent);
                                cssClass = (additionalComponent) ? 'highlight-seed' : '';
                            }
                            else {
                                cssClass = '';
                            }
                            break;
                    }
                }
                // Creating the table row collection.
                _workListRowCollection.push(this.getGridRow(responseStatus, responseData.displayId, _workListRowHeaderCellcollection, this.getAccuracyType(responseMode, responseData), undefined, cssClass));
            }
        }
        var _workListFrozenRowBodyCollection = Immutable.fromJS(_workListRowCollection);
        return _workListFrozenRowBodyCollection;
    };
    /**
     * returns the table row elements for frozen table header
     * @param responseListData - list of responses
     * @returns grid row collection.
     */
    WorklistHelperBase.prototype.getFrozenRowHeaderForListView = function (worklistType, responseMode, comparerName, sortDirection, isSortable) {
        var _workListColumnHeaderCollection = Array();
        var _workListCell;
        var _worklistRow = new gridRow();
        var _workListColumnHeaderCellcollection = new Array();
        _workListCell = new gridCell();
        var key = 'frozenRowHeader';
        var _comparerName = comparerList.responseIdComparer;
        //TODO : Move the magic strings outside (json?)
        _workListCell.columnElement = this.getColumnHeaderElement(key, localeStore.instance.TranslateText('marking.worklist.list-view-column-headers.response-id'), undefined, (comparerList[comparerName] === _comparerName), isSortable, sortDirection);
        _workListCell.comparerName = comparerList[_comparerName];
        _workListCell.sortDirection = this.getSortDirection((comparerList[comparerName] === _comparerName), sortDirection);
        _workListCell.setCellStyle('col-response header-col');
        // Creating the grid row collection.
        _workListColumnHeaderCellcollection.push(_workListCell);
        _worklistRow.setRowId(1);
        _worklistRow.setCells(_workListColumnHeaderCellcollection);
        _workListColumnHeaderCollection.push(_worklistRow);
        var _workListFrozenRowHeaderCollection = Immutable.fromJS(_workListColumnHeaderCollection);
        return _workListFrozenRowHeaderCollection;
    };
    /**
     * returns the gridcolumns based on the response mode and worklist type
     * @param responseMode
     */
    WorklistHelperBase.prototype.getGridColumns = function (resolvedGridColumnsJson, worklistType, responseMode, isFrozen) {
        if (isFrozen === void 0) { isFrozen = false; }
        var gridColumns;
        return gridColumns;
    };
    /**
     * return the display text for response id
     * @param worklistType
     */
    WorklistHelperBase.prototype.getDisplayTextOfResponse = function (worklistType) {
        var displayText = undefined;
        switch (worklistType) {
            case enums.WorklistType.practice:
                displayText = localeStore.instance.TranslateText('marking.worklist.response-data.practice-response-title') + ' ';
                break;
            case enums.WorklistType.standardisation:
                displayText = localeStore.instance.TranslateText('marking.worklist.response-data.standardisation-response-title') + ' ';
                break;
            case enums.WorklistType.secondstandardisation:
                var isESTeamMember = qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember;
                displayText = isESTeamMember ?
                    localeStore.instance.TranslateText('marking.worklist.response-data.stm-standardisation-response-title') + ' ' :
                    localeStore.instance.TranslateText('marking.worklist.response-data.second-standardisation-response-title') + ' ';
                break;
        }
        return displayText;
    };
    /**
     * returns the resposne staus based on the worklist and its validator type
     * @param worklistType
     * @param responseMode
     */
    WorklistHelperBase.prototype.getResponseStatus = function (responseData, responseMode) {
        var responseStatus;
        return responseStatus;
    };
    /**
     * returns whether the the given column is hidden or not
     * @param responseColumn
     */
    WorklistHelperBase.prototype.getCellVisibility = function (column) {
        return false;
    };
    /**
     * returns the accuracy type based on accuracy  and CC values
     * @param responseMode
     * @param responseData
     */
    WorklistHelperBase.prototype.getAccuracyType = function (responseMode, responseData) {
        return enums.AccuracyIndicatorType.Unknown;
    };
    /**
     * returns whether the current qig is structured or not.
     */
    WorklistHelperBase.prototype.isStructuredQIG = function () {
        return (qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.Structured);
    };
    /**
     * returns whether the value is numeric or not.
     */
    WorklistHelperBase.prototype.isNonNumeric = function () {
        return this._isNonNumeric;
    };
    /**
     * Sets the whether the response is numeric or not.
     */
    WorklistHelperBase.prototype.setNonNumeric = function (isNonNumeric) {
        this._isNonNumeric = isNonNumeric;
    };
    /**
     * Reset dynamic column
     */
    WorklistHelperBase.prototype.resetDynamicColumnSettings = function () {
        this._dateLengthInPixel = 0;
    };
    /**
     * return the sort direction - if it is current sort just reverse the direction otherwise asc as defaualt direction.
     * @param isCurrentSort
     * @param sortDirection
     */
    WorklistHelperBase.prototype.getSortDirection = function (isCurrentSort, sortDirection) {
        return ((isCurrentSort === true) ?
            ((sortDirection === enums.SortDirection.Ascending) ? enums.SortDirection.Descending : enums.SortDirection.Ascending)
            : enums.SortDirection.Ascending);
    };
    /**
     * get the value of senior examiner pool cc.
     */
    WorklistHelperBase.prototype.getSeniorExaminerPoolCCValue = function () {
        var ccValue = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.SeniorExaminerPool, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true' ? true : false;
        return ccValue;
    };
    /**
     * returns the Selected Tag Id of response.
     * @param seq
     * @param tagId
     * @param tagList
     * @param markGroupId
     */
    WorklistHelperBase.prototype.getTag = function (seq, tagId, tagList, markGroupId) {
        var componentProps;
        componentProps = {
            key: seq,
            id: seq,
            selectedTagId: tagId,
            tagList: tagList,
            markGroupId: markGroupId
        };
        return React.createElement(TagList, componentProps);
    };
    /**
     * creating react element for the  getAllPageAnnotatedIndicatorElement component
     * @param responseData - response data
     * @param propsNames - prop names for the component
     * @param seq - key value for the component
     * @param showMarkingProgress - key value for the component
     * @returns JSX.Element.
     */
    WorklistHelperBase.prototype.getAllFilesNotViewedIndicatorElement = function (responseData, propsNames, seq, isTileView) {
        if (isTileView === void 0) { isTileView = true; }
        var componentProps;
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
    };
    return WorklistHelperBase;
}());
module.exports = WorklistHelperBase;
//# sourceMappingURL=worklisthelperbase.js.map
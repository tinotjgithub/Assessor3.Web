"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var classNames = require('classnames');
var awardingCandidateDetailsHelper = require('../utility/awarding/helpers/awardingcandidatedetailshelper');
var awardingStore = require('../../stores/awarding/awardingstore');
var ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
var Immutable = require('immutable');
var AwardingTableWrapper = require('./awardingtablewrapper');
var AwardingCandidateDetails = (function (_super) {
    __extends(AwardingCandidateDetails, _super);
    /**
     * @constructor
     */
    function AwardingCandidateDetails(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.expandedItemDetails = Immutable.Map();
        /**
         *  reset
         */
        this.candidateDataFilterUpdated = function () {
            _this.expandedItemDetails = Immutable.Map();
            _this.reRender();
        };
        /**
         * set the awarding candidate details calback
         * @param expandedItemList
         */
        this.expandOrCollapseCallback = function (selectedItem, isExpanded, currentCilckedItem, isParentItem, parentItemName) {
            if (isExpanded) {
                if (_this.expandedItemDetails.has(parentItemName)) {
                    var keys = _this.expandedItemDetails.get(parentItemName);
                    keys = keys.set(selectedItem, isExpanded);
                    _this.expandedItemDetails = _this.expandedItemDetails.set(parentItemName, keys);
                }
                else {
                    var expandedItemCollection = Immutable.Map();
                    expandedItemCollection = expandedItemCollection.set(selectedItem, isExpanded);
                    _this.expandedItemDetails = _this.expandedItemDetails.set(parentItemName, expandedItemCollection);
                }
            }
            else {
                if (isParentItem) {
                    _this.expandedItemDetails = _this.expandedItemDetails.delete(parentItemName);
                }
                else {
                    var keys = _this.expandedItemDetails.get(parentItemName);
                    keys = keys.delete(selectedItem);
                    _this.expandedItemDetails = _this.expandedItemDetails.set(parentItemName, keys);
                }
            }
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * setAwardingComponentsSelectin
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        // initialising examiner view data helper
        this.awardingCandidateDetailsHelper = new awardingCandidateDetailsHelper();
        this.expandedItemDetails = Immutable.Map();
        /* getting user preference for the grid view */
        this.state = {
            isBusy: false,
            renderedOn: this.props.renderedOn
        };
    }
    /**
     * componentDidMount React lifecycle event
     */
    AwardingCandidateDetails.prototype.componentDidMount = function () {
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.candidateDataFilterUpdated);
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_FILTER_UPDATED, this.candidateDataFilterUpdated);
        ccStore.instance.addListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.reRender);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    AwardingCandidateDetails.prototype.componentWillUnmount = function () {
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED, this.candidateDataFilterUpdated);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_FILTER_UPDATED, this.candidateDataFilterUpdated);
        ccStore.instance.removeListener(ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET, this.reRender);
    };
    /**
     * Component will receive props
     */
    AwardingCandidateDetails.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props !== nextProps) {
            this.expandedItemDetails = Immutable.Map();
        }
    };
    /**
     * render
     */
    AwardingCandidateDetails.prototype.render = function () {
        this.awardingCandidateData = this.getFilteredCandidateData();
        this.awardingFrozenTableHeaderRow = this.awardingCandidateDetailsHelper.
            generateFrozenRowHeader(enums.AwardingViewType.Totalmark, '', enums.SortDirection.Ascending, true);
        this.awardingTableHeaderRow = this.awardingCandidateDetailsHelper.generateTableHeader('', enums.SortDirection.Ascending, this.awardingCandidateData, enums.AwardingViewType.Grade);
        this.awardingCandidateGradeViewCollection = this.awardingCandidateDetailsHelper.
            generateAwardingGridItems(this.awardingCandidateData, this.props.viewType, this.expandedItemDetails, this.expandOrCollapseCallback);
        return (React.createElement(AwardingTableWrapper, {awardingFrozenHeaderRows: this.awardingFrozenTableHeaderRow, awardingColumnHeaderRows: this.awardingTableHeaderRow, awardingCandidateGradeViewCollection: this.awardingCandidateGradeViewCollection}));
    };
    /**
     * filtering the candiadte details collection based on filter values.
     */
    AwardingCandidateDetails.prototype.getFilteredCandidateData = function () {
        var data = awardingStore.instance.awardingCandidateData;
        var _selectedTotalMark = this.props.selectedMark;
        var _selectedGrade = this.props.selectedGrade;
        return Immutable.List(data.filter(function (x) { return x.totalMark.toFixed(2).toString() ===
            (_selectedTotalMark === 'All' ? x.totalMark.toFixed(2).toString() : _selectedTotalMark)
            && x.grade === (_selectedGrade === 'All' ? x.grade : _selectedGrade); }));
    };
    return AwardingCandidateDetails;
}(pureRenderComponent));
module.exports = AwardingCandidateDetails;
//# sourceMappingURL=awardingcandidatedetailsview.js.map
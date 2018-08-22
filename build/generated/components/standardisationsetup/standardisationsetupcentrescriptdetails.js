"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var enums = require('../utility/enums');
var Immutable = require('immutable');
var localeStore = require('../../stores/locale/localestore');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../utility/sorting/sorthelper');
var StandardisationSetupTableWrapper = require('./standardisationsetuptablewrapper');
var standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
var qigStore = require('../../stores/qigselector/qigstore');
var LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
var scriptStore = require('../../stores/script/scriptstore');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var SearchPanel = require('../utility/search/searchpanel');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
/**
 * StandardisationSetup Centre Script Details
 */
var StandardisationSetupCentreScriptDetails = (function (_super) {
    __extends(StandardisationSetupCentreScriptDetails, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function StandardisationSetupCentreScriptDetails(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.searchData = { isVisible: true, isSearching: undefined, searchText: '' };
        /**
         * on meta data for the scripts loaded for the selected centre
         */
        this.reRenderOnMetaDataLoaded = function () {
            _this.metaDataLoaded = true;
            _this.setState({ renderedOn: Date.now() });
        };
        /*
         * get selected Response std grid component
         */
        this.getSelectResponseStdResponseGridComponent = function () {
            var grid;
            if (!_this.comparerName) {
                _this.setDefaultComparer();
            }
            var loadingindicator = (React.createElement(LoadingIndicator, {id: 'centreScriptLoading', key: 'centreScriptLoading', cssClass: 'section-loader loading'}));
            // if the direction is descending the text 'Desc' is appending to the comparer name since all
            // descending comparere has the same name followed by text 'Desc'
            var _comparerName = (_this.sortDirection === enums.SortDirection.Ascending) ? _this.comparerName : _this.comparerName + 'Desc';
            _this.filteredData = JSON.parse(JSON.stringify(standardisationSetupStore.instance.standardisationScriptList));
            if (_this.filteredData) {
                if (_this.searchData.isSearching && _this.searchData.searchText !== '') {
                    _this.filteredData = standardisationSetupStore.instance.getFilteredStdCentreScriptList(_this.searchData.searchText);
                }
                else {
                    _this.filteredData.centreScriptList = Immutable.List(_this.filteredData.centreScriptList);
                }
                if (_this.comparerName !== undefined) {
                    _this.filteredData.centreScriptList = Immutable.List(sortHelper
                        .sort(_this.filteredData.centreScriptList.toArray(), comparerList[_comparerName]));
                }
            }
            var filteredDetails = {
                standardisationCentreDetailsList: standardisationSetupStore.instance.standardisationCentreList,
                standardisationScriptDetailsList: _this.filteredData
            };
            var gridRows = _this.props.standardisationSetupHelper.generateScriptRowDefinition(_this.filteredData);
            grid = (React.createElement("div", {className: 'grid-wrapper', ref: 'scriptDetails'}, _this.metaDataLoaded === false ? loadingindicator :
                (React.createElement(StandardisationSetupTableWrapper, {standardisationSetupType: _this.props.standardisationSetupWorkList, frozenHeaderRows: _this.props.standardisationSetupHelper.generateFrozenRowHeader(_this.comparerName, _this.sortDirection, _this.props.standardisationSetupWorkList, enums.StandardisationSessionTab.CurrentSession), columnHeaderRows: _this.props.standardisationSetupHelper.generateTableHeader(_this.props.standardisationSetupWorkList, _this.comparerName, _this.sortDirection, null, enums.StandardisationSessionTab.CurrentSession, 'Script'), frozenBodyRows: _this.props.standardisationSetupHelper.generateFrozenRowBody(filteredDetails, _this.props.standardisationSetupWorkList), gridRows: gridRows, getGridControlId: _this.getGridControlId, onSortClick: _this.onSortClick, renderedOn: _this.state.renderedOn}))));
            return grid;
        };
        /**
         * Get the grid control id
         * @param centreOrScript //used only for select response.
         */
        this.getGridControlId = function () {
            var gridId = '';
            gridId = enums.StandardisationSetup[_this.props.standardisationSetupWorkList] + '_script_grid_' + _this.props.id;
            return gridId;
        };
        /**
         * Callback function for on_search functionality.
         */
        this.onSearch = function (searchText) {
            _this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
            // set the filter string in store 
            standardisationActionCreator.onStdCentreScriptListFilter(_this.searchData.searchText);
            _this.filteredScripts();
        };
        this.state = {
            renderedOn: 0
        };
        this.onSortClick = this.onSortClick.bind(this);
        this.setDefaultComparer = this.setDefaultComparer.bind(this);
        this.getGridControlId = this.getGridControlId.bind(this);
        this.resetScriptTableScrollPosition = this.resetScriptTableScrollPosition.bind(this);
        this.filteredData = standardisationSetupStore.instance.standardisationScriptList;
    }
    /**
     * componentDidMount
     */
    StandardisationSetupCentreScriptDetails.prototype.componentDidMount = function () {
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.reRenderOnMetaDataLoaded);
        standardisationSetupStore.instance.addListener(standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.resetScriptTableScrollPosition);
    };
    /**
     * componentWillUnmount
     */
    StandardisationSetupCentreScriptDetails.prototype.componentWillUnmount = function () {
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, this.reRenderOnMetaDataLoaded);
        standardisationSetupStore.instance.removeListener(standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT, this.resetScriptTableScrollPosition);
    };
    /**
     * render method
     */
    StandardisationSetupCentreScriptDetails.prototype.render = function () {
        var hide = true;
        if (standardisationSetupStore.instance.selectedCentreId > 0) {
            if (standardisationSetupStore.instance.standardisationScriptList) {
                hide = false;
            }
            else {
                var centrePartId = standardisationSetupStore.instance.
                    standardisationSetupSelectedCentrePartId(standardisationSetupStore.instance.selectedCentreId);
                standardisationActionCreator.getScriptsOfSelectedCentre(standardisationSetupStore.instance.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, centrePartId, false, standardisationSetupStore.instance.examinerRoleId, standardisationSetupStore.instance.selectedCentreId);
            }
        }
        var centreNo = standardisationSetupStore.instance.standardisationSetUpSelectedCentreNo;
        var className = 'grid-split-wrapper std-response-grid with-searchbox' + (hide ? ' hide' : ' open');
        var title = localeStore.instance.
            TranslateText('standardisation-setup.right-container.scripts-for-centre');
        // Display the search panel based on eBookmarking CC.
        this.searchData.isVisible =
            configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;
        // Set the default filter 
        if (this.searchData.isVisible && !this.searchData.isSearching) {
            this.setDefaultFilter();
        }
        var divSearchPanel = null;
        if (this.searchData.isVisible) {
            divSearchPanel = (React.createElement("div", {className: 'search-box-wrap padding-top-10'}, React.createElement(SearchPanel, {id: 'search-panel-questionitem', key: 'search-panel-questionitem-key', searchData: this.searchData, onSearch: this.onSearch, isSearchResultTextVisible: false, searchResultsFor: '', searchPlaceHolder: localeStore.instance.
                TranslateText('standardisation-setup.right-container.search-by-questionitems-placeholder'), searchTooltip: '', searchCancel: localeStore.instance.
                TranslateText('standardisation-setup.right-container.cancel-search-tooltip'), searchClassName: 'search-box-panel', searchWrapClass: ''})));
        }
        return (React.createElement("div", {className: className, id: 'stdResponseGrid'}, React.createElement("div", {className: 'grid-holder grid-view'}, React.createElement("div", {className: 'clearfix page-sub-header'}, React.createElement("h3", {className: 'shift-left page-sub-title sub-heading'}, title + ' ', React.createElement("span", {className: 'centerId'}, centreNo))), divSearchPanel, hide ? '' : this.getSelectResponseStdResponseGridComponent())));
    };
    /**
     * Set the comparer for the current standardisation
     */
    StandardisationSetupCentreScriptDetails.prototype.setDefaultComparer = function () {
        var defaultComparers = standardisationSetupStore.instance.standardisationSortDetails;
        var standardisationSetup = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
        var entry = defaultComparers.filter(function (x) {
            return x.selectedWorkList === standardisationSetup &&
                x.qig === standardisationSetupStore.instance.markSchemeGroupId &&
                x.centreOrScriptOrReuse === 'Script';
        });
        if (entry.length > 0) {
            this.comparerName = comparerList[entry[0].comparerName];
            this.sortDirection = entry[0].sortDirection;
        }
    };
    /**
     * Set the default filter
     */
    StandardisationSetupCentreScriptDetails.prototype.setDefaultFilter = function () {
        var defaultfilter = standardisationSetupStore.instance.standardisationCentreScriptFilterDetails;
        if (defaultfilter) {
            this.searchData = { isVisible: true, isSearching: true, searchText: defaultfilter.filterString };
        }
    };
    /**
     * Call back function from table wrapper on sorting
     * @param comparerName
     * @param sortDirection
     */
    StandardisationSetupCentreScriptDetails.prototype.onSortClick = function (comparerName, sortDirection) {
        this.comparerName = comparerName;
        this.sortDirection = sortDirection;
        var sortDetails = {
            qig: standardisationSetupStore.instance.markSchemeGroupId,
            comparerName: comparerList[this.comparerName],
            sortDirection: this.sortDirection,
            selectedWorkList: this.props.standardisationSetupWorkList,
            centreOrScriptOrReuse: 'Script'
        };
        standardisationActionCreator.onSortedClick(sortDetails);
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * Load the scripts for selected centre in centre list
     */
    StandardisationSetupCentreScriptDetails.prototype.resetScriptTableScrollPosition = function () {
        this.metaDataLoaded = false;
        if (this.refs.scriptDetails && this.refs.scriptDetails.getElementsByClassName('table-scroll-holder')[0]) {
            this.refs.scriptDetails.getElementsByClassName('table-scroll-holder')[0].scrollTop = 0;
        }
        this.filteredData = standardisationSetupStore.instance.standardisationScriptList;
        this.searchData = { isVisible: true, isSearching: undefined, searchText: '' };
        this.setState({ renderedOn: Date.now() });
    };
    /**
     * Re render the page after applied the filter.
     */
    StandardisationSetupCentreScriptDetails.prototype.filteredScripts = function () {
        this.setState({
            renderedOn: Date.now()
        });
    };
    return StandardisationSetupCentreScriptDetails;
}(pureRenderComponent));
module.exports = StandardisationSetupCentreScriptDetails;
//# sourceMappingURL=standardisationsetupcentrescriptdetails.js.map
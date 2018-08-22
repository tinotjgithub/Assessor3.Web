import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import Immutable = require('immutable');
import localeStore = require('../../stores/locale/localestore');

import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import standardisationsortdetails = require('../utility/grid/standardisationsortdetails');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../utility/sorting/sorthelper');
import standardisationSetupHelper = require('../../utility/standardisationsetup/standardisationsetuphelper');
import StandardisationSetupTableWrapper = require('./standardisationsetuptablewrapper');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');
import LoadingIndicator = require('../utility/loadingindicator/loadingindicator');
import scriptStore = require('../../stores/script/scriptstore');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import SearchPanel = require('../utility/search/searchpanel');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');

interface Props extends LocaleSelectionBase, PropsBase {
	standardisationSetupHelper: standardisationSetupHelper;
    standardisationSetupWorkList: enums.StandardisationSetup;
	renderedOn: number;
}

interface State {
	renderedOn?: number;
}

/**
 * StandardisationSetup Centre Script Details
 */
class StandardisationSetupCentreScriptDetails extends pureRenderComponent<Props, State> {
	private comparerName: string;
	private sortDirection: enums.SortDirection;
	private metaDataLoaded: boolean;
	private searchData: SearchData = { isVisible: true, isSearching: undefined, searchText: '' };
	private filteredData: StandardisationScriptDetailsList;

	/** refs */
	public refs: {
		scriptDetails: (HTMLDivElement);
	};

	/**
	 * Constructor
	 * @param props
	 * @param state
	 */
	constructor(props: Props, state: State) {
		super(props, state);

		this.state = {
			renderedOn: 0
		};

		this.onSortClick = this.onSortClick.bind(this);
		this.setDefaultComparer = this.setDefaultComparer.bind(this);
		this.getGridControlId = this.getGridControlId.bind(this);
		this.resetScriptTableScrollPosition = this.resetScriptTableScrollPosition.bind(this);
        this.filteredData = standardisationSetupStore.instance.standardisationScriptList;
        this.onQigSelectedFromHistory = this.onQigSelectedFromHistory.bind(this);
	}

	/**
	 * componentDidMount
	 */
	public componentDidMount() {
        scriptStore.instance.addListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.reRenderOnMetaDataLoaded);
		standardisationSetupStore.instance.addListener(
			standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.resetScriptTableScrollPosition);
        qigStore.instance.addListener(
            qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT,
            this.onQigSelectedFromHistory);
	}

	/**
	 * componentWillUnmount
	 */
	public componentWillUnmount() {
        scriptStore.instance.removeListener(scriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            this.reRenderOnMetaDataLoaded);
		standardisationSetupStore.instance.removeListener(
			standardisationSetupStore.StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
            this.resetScriptTableScrollPosition);
        qigStore.instance.removeListener(
            qigStore.QigStore.QIG_SELECTED_FROM_HISTORY_EVENT,
            this.onQigSelectedFromHistory);
	}

	/**
	 * on meta data for the scripts loaded for the selected centre
	 */
    private reRenderOnMetaDataLoaded = () => {
		this.metaDataLoaded = true;
	    this.setState({ renderedOn: Date.now() });
    };

	/**
	 * render method
	 */
    public render() {
		let hide: boolean = true;
		if (standardisationSetupStore.instance.selectedCentreId > 0) {
			if (standardisationSetupStore.instance.standardisationScriptList) {
				hide = false;
			} else {
				let centrePartId: number = standardisationSetupStore.instance.
					standardisationSetupSelectedCentrePartId(standardisationSetupStore.instance.selectedCentreId);

				standardisationActionCreator.getScriptsOfSelectedCentre
					(standardisationSetupStore.instance.markSchemeGroupId,
					qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
					centrePartId,
					false,
					standardisationSetupStore.instance.examinerRoleId,
					standardisationSetupStore.instance.selectedCentreId);
			}
		}

		let centreNo: string = standardisationSetupStore.instance.standardisationSetUpSelectedCentreNo;
		let className: string = 'grid-split-wrapper std-response-grid with-searchbox' + (hide ? ' hide' : ' open');
		let title: string = localeStore.instance.
            TranslateText('standardisation-setup.right-container.scripts-for-centre');

        // Display the search panel based on eBookmarking CC.
        this.searchData.isVisible =
            configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.eBookmarking).toLowerCase() === 'true' ? true : false;
        // Set the default filter 
        if (this.searchData.isVisible && !this.searchData.isSearching) {
            this.setDefaultFilter();
        }

        let divSearchPanel: JSX.Element = null;
        if (this.searchData.isVisible) {
            divSearchPanel = (
                <div className='search-box-wrap padding-top-10'>
                    <SearchPanel
                        id='search-panel-questionitem'
                        key='search-panel-questionitem-key'
                        searchData={this.searchData}
                        onSearch={this.onSearch}
                        isSearchResultTextVisible={false}
                        searchResultsFor={''}
                        searchPlaceHolder={localeStore.instance.
                            TranslateText('standardisation-setup.right-container.search-by-questionitems-placeholder')}
                        searchTooltip={''}
                        searchCancel={localeStore.instance.
                            TranslateText('standardisation-setup.right-container.cancel-search-tooltip')}
                        searchClassName={'search-box-panel'}
                        searchWrapClass={''}
                    />
                </div >);
        }

		return (
            <div className={className} id='stdResponseGrid'>
                <div className='grid-holder grid-view'>
                    <div className='clearfix page-sub-header'>
                        <h3 className='shift-left page-sub-title sub-heading'>{title + ' '}<span className='centerId'>{centreNo}</span>
                        </h3>
					</div>
					{divSearchPanel}
                    {hide ? '' : this.getSelectResponseStdResponseGridComponent()}
                </div>
			</div>);
	}

	/**
	 * Set the comparer for the current standardisation
	 */
	private setDefaultComparer() {
		let defaultComparers = standardisationSetupStore.instance.standardisationSortDetails;
		let standardisationSetup: enums.StandardisationSetup = standardisationSetupStore.instance.selectedStandardisationSetupWorkList;

		let entry: standardisationsortdetails[] = defaultComparers.filter((x: standardisationsortdetails) =>
			x.selectedWorkList === standardisationSetup &&
			x.qig === standardisationSetupStore.instance.markSchemeGroupId &&
			x.centreOrScriptOrReuse === 'Script');

		if (entry.length > 0) {
			this.comparerName = comparerList[entry[0].comparerName];
			this.sortDirection = entry[0].sortDirection;
        }

    }

    /**
     * Set the default filter
     */
    private setDefaultFilter() {
        let defaultfilter = standardisationSetupStore.instance.standardisationCentreScriptFilterDetails;

        if (defaultfilter) {
            this.searchData = { isVisible: true, isSearching: true, searchText: defaultfilter.filterString };
        }
    }

	/*
	 * get selected Response std grid component
	 */
	private getSelectResponseStdResponseGridComponent = (): JSX.Element => {
        let grid: JSX.Element;

		if (!this.comparerName) {
			this.setDefaultComparer();
        }

		let loadingindicator = (<LoadingIndicator id='centreScriptLoading' key='centreScriptLoading'
		cssClass='section-loader loading'/>);

		// if the direction is descending the text 'Desc' is appending to the comparer name since all
		// descending comparere has the same name followed by text 'Desc'
		let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        this.filteredData = JSON.parse(JSON.stringify(standardisationSetupStore.instance.standardisationScriptList));
		if (this.filteredData) {
			if (this.searchData.isSearching && this.searchData.searchText !== '') {
                this.filteredData = standardisationSetupStore.instance.getFilteredStdCentreScriptList(this.searchData.searchText);
			} else {
				this.filteredData.centreScriptList = Immutable.List<StandardisationScriptDetails>(this.filteredData.centreScriptList);
			}
			if (this.comparerName !== undefined) {
				this.filteredData.centreScriptList = Immutable.List<any>(sortHelper
					.sort(this.filteredData.centreScriptList.toArray(), comparerList[_comparerName]));
			}
		}

		let filteredDetails: StandardisationSetupDetailsList = {
			standardisationCentreDetailsList: standardisationSetupStore.instance.standardisationCentreList,
			standardisationScriptDetailsList: this.filteredData
		};

		let gridRows = this.props.standardisationSetupHelper.generateScriptRowDefinition(this.filteredData);

		grid = (<div className='grid-wrapper' ref={'scriptDetails'}>
			{this.metaDataLoaded === false ? loadingindicator :
            (<StandardisationSetupTableWrapper
                    standardisationSetupType={this.props.standardisationSetupWorkList}
                frozenHeaderRows={this.props.standardisationSetupHelper.generateFrozenRowHeader(this.comparerName,
                        this.sortDirection, this.props.standardisationSetupWorkList, enums.StandardisationSessionTab.CurrentSession)}
                columnHeaderRows={this.props.standardisationSetupHelper.generateTableHeader(this.props.standardisationSetupWorkList,
                    this.comparerName, this.sortDirection, null,
                    enums.StandardisationSessionTab.CurrentSession, 'Script')}
				frozenBodyRows={this.props.standardisationSetupHelper.generateFrozenRowBody(
                        filteredDetails, this.props.standardisationSetupWorkList)}
                gridRows={gridRows}
                getGridControlId={this.getGridControlId}
                onSortClick={this.onSortClick}
                renderedOn={this.state.renderedOn}
            />)}
        </div>);

		return grid;
	}

	/**
	 * Get the grid control id
	 * @param centreOrScript //used only for select response.
	 */
	private getGridControlId = (): string => {
		let gridId: string = '';
        gridId = enums.StandardisationSetup[this.props.standardisationSetupWorkList] + '_script_grid_' + this.props.id;
		return gridId;
	}

	/**
	 * Call back function from table wrapper on sorting
	 * @param comparerName
	 * @param sortDirection
	 */
	private onSortClick(comparerName: string, sortDirection: enums.SortDirection) {
		this.comparerName = comparerName;
		this.sortDirection = sortDirection;

		let sortDetails: standardisationsortdetails = {
			qig: standardisationSetupStore.instance.markSchemeGroupId,
			comparerName: comparerList[this.comparerName],
			sortDirection: this.sortDirection,
            selectedWorkList: this.props.standardisationSetupWorkList,
			centreOrScriptOrReuse: 'Script'
		};

		standardisationActionCreator.onSortedClick(sortDetails);
		this.setState({ renderedOn: Date.now() });
	}

	/**
	 * Load the scripts for selected centre in centre list
	 */
    private resetScriptTableScrollPosition() {
		this.metaDataLoaded = false;
		if (this.refs.scriptDetails && this.refs.scriptDetails.getElementsByClassName('table-scroll-holder')[0]) {
			this.refs.scriptDetails.getElementsByClassName('table-scroll-holder')[0].scrollTop = 0;
		}
		this.filteredData = standardisationSetupStore.instance.standardisationScriptList;

		this.searchData = { isVisible: true, isSearching: undefined, searchText: '' };
        this.setState({ renderedOn: Date.now() });
	}

	/**
	 * Callback function for on_search functionality.
	 */
    private onSearch = (searchText: string) => {
        this.searchData = { isVisible: true, isSearching: true, searchText: searchText };

        // set the filter string in store 
        standardisationActionCreator.onStdCentreScriptListFilter(this.searchData.searchText);
		this.filteredScripts();
	}

	/**
	 * Re render the page after applied the filter.
	 */
	private filteredScripts() {
		this.setState({
			renderedOn: Date.now()
		});
    }

    /**
     * Reset sort order when qig is selected from history
     */
    private onQigSelectedFromHistory() {
        this.resetSortAttributes();
    }

    /**
     * Resets the comparer and sort order
     */
    private resetSortAttributes() {
        this.comparerName = undefined;
        this.sortDirection = undefined;
    }
}

export = StandardisationSetupCentreScriptDetails;
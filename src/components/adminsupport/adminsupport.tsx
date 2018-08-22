/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import Header = require('../header');
import Footer = require('../footer');
import enums = require('../utility/enums');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import GenericButton = require('../utility/genericbutton');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../utility/sorting/sorthelper');
import Immutable = require('immutable');
import adminSupportSortDetails = require('../utility/grid/adminsupportsortdetails');
import navigationHelper = require('../utility/navigation/navigationhelper');
import AdminSupportTableWrapper = require('./adminsupporttablewrapper');
import adminSupportInterface = require('../../utility/adminsupport/adminsupportinterface');
import adminSupportHelperBase = require('../utility/grid/adminsupporthelpers/adminsupporthelperbase');
import adminSupportStore = require('../../stores/adminsupport/adminsupportstore');
import adminsupportActionCreator = require('../../actions/adminsupport/supportadminactioncreator');
import loginActionCreator = require('../../actions/login/loginactioncreator');
import loginStore = require('../../stores/login/loginstore');
import SearchPanel = require('../utility/search/searchpanel');
import navigationStore = require('../../stores/navigation/navigationstore');

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
	renderedOn: number;
    isLiveSelected: boolean;
    doDisableLogin: boolean;
}


/**
 * React component class for Login
 */
class AdminSupport extends pureRenderComponent<Props, State> {
	private adminSupportHelper: adminSupportInterface;
	private comparerName: string;
    private sortDirection: enums.SortDirection;
    private supportExaminerSelectionEnabled: boolean = false;
    private _examinerSelected: boolean = false;
    private searchData: SearchData = { isVisible: true, isSearching: false, searchText: '' };
    private filteredData: SupportAdminExaminerList;
    private _comparerName: string;
    /**
     * Constructor LoginForm
     * @param props
     * @param state
     */
	constructor(props: Props, state: State) {
		super(props, state);
		this.state = {
			renderedOn: Date.now(),
            isLiveSelected: false,
            doDisableLogin: true
		};
		this.onClick = this.onClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.adminSupportHelper = new adminSupportHelperBase();
        this.loadSupportAdminExaminerData = this.loadSupportAdminExaminerData.bind(this);
        this.onSortClick = this.onSortClick.bind(this);
        this.filteredData = adminSupportStore.instance.getSupportAdminExaminerLists;
	}

	/**
	 * component will Mount event
	 */
	public componentWillMount() {
            adminsupportActionCreator.getSupportAdminExaminerLists();
	}

    /**
     * Render
     */
    public render() {
		let header = (
			<Header selectedLanguage={this.props.selectedLanguage}
				isInTeamManagement={false}
				renderedOn={this.state.renderedOn}
				containerPage={enums.PageContainers.AdminSupport} />
		);

		let loginButton = (<GenericButton id={'env-login-btn'}
			key={'key_complete_button'}
			onClick={this.onClick}
            disabled={this.state.doDisableLogin}
			content={localeStore.instance.TranslateText('support-login.support-login-page.login-button-text')}
			className={'primary rounded compose-msg popup-nav'}
            title={localeStore.instance.TranslateText('support-login.support-login-page.login-button-text')} />);

        let cancelButton;
        let pageTitle;
        let pageContent;
        if (navigationStore.instance.isFromSwitchUser) {
            cancelButton = (<GenericButton
                id={'button-rounded-cancel-button'}
                key={'key-button-rounded-cancel-button'}
                className={'rounded'}
                title={localeStore.instance.TranslateText('support-login.support-login-page.cancel-button-text')}
                content={localeStore.instance.TranslateText('support-login.support-login-page.cancel-button-text')}
                disabled={false}
                onClick={this.onCancelClick}
            />
            );
            pageTitle = localeStore.instance.TranslateText('support-login.support-login-page.page-title-switch-user');
            pageContent = localeStore.instance.TranslateText('support-login.support-login-page.content-switch-user');
        }else {
            pageTitle = localeStore.instance.TranslateText('support-login.support-login-page.page-title');
            pageContent = localeStore.instance.TranslateText('support-login.support-login-page.content');
        }
        let data = adminSupportStore.instance.getSupportAdminExaminerLists;

        this._comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

        this.searchData.isSearching = this.searchData.searchText !== '';

        if (data !== undefined && this.searchData.isSearching && !this.state.isLiveSelected) {
                this.searchinSupportTable(data, this._comparerName);
            data = { getSupportExaminerList: this.filteredData.getSupportExaminerList };
            this.searchData.isSearching = false;
        }

        if (data !== undefined && this.comparerName !== undefined && !this.supportExaminerSelectionEnabled) {
			data.getSupportExaminerList = Immutable.List<SupportAdminExaminers>(sortHelper.sort(
                data.getSupportExaminerList.toArray(), comparerList[this._comparerName]));
        } else {
            this.supportExaminerSelectionEnabled = false;
        }

		let supportAdminTable = data ? (<AdminSupportTableWrapper
			columnHeaderRows={this.getGridColumnHeaderRows(this.comparerName, this.sortDirection)}
			gridRows={this.adminSupportHelper.generateExaminersRowDefinition(data)}
			onSortClick={this.onSortClick}
			id={this.props.id}
			renderedOn={this.state.renderedOn}
			/>) : null;

		return (
			<div className='env-login-wrapper'>
				{header}
				<div className='content-wrapper'>
					<div className='column-right'>
						<div className='wrapper'>
							<div className='clearfix'>
                                <h3 className='shift-left page-title padding-top-25 padding-bottom-15' id='support_login_header'>
                                    <span className='page-title-text'
                                    >{pageTitle}
									</span>
									<span className='right-spacer'></span>
								</h3>
							</div>
							<div className='message-bar' id='support_login_messagebar'>
                                <span className='message-content'
                                >{pageContent}</span>
							</div>
                            {this.renderOptionButtons()}
                            {this.renderSearchPanel()}
                            <div id='support_enviornment_grid'
                                className={classNames('grid-holder grid-view selectable-grid padding-top-15',
                                    { 'disabled': this.state.isLiveSelected })}>
								<div className='grid-wrapper'>
									{supportAdminTable}
								</div>
							</div>
                            <div className='footer-holder padding-top-10 padding-bottom-20'>{cancelButton}{loginButton}</div>
						</div>
					</div>
				</div>
			</div>);
    }

    /**
     * Perform search in Support Table
     * @param data
     * @param _comparerName
     */
    private searchinSupportTable(data: SupportAdminExaminerList, _comparerName: string) {
        this.filteredData = JSON.parse(JSON.stringify(data));
        if (this.filteredData) {
            if (this.searchData.searchText !== '') {
                let filterSearchArray: string[] = this.searchData.searchText.toLowerCase().split('');
                this.filteredData.getSupportExaminerList = Immutable.List<SupportAdminExaminers>
                    (this.filteredData.getSupportExaminerList
                        .filter((examiner: SupportAdminExaminers) =>
                            ((examiner.initials.toLowerCase() + ' ' + examiner.surname.toLowerCase())
                                .indexOf(this.searchData.searchText.toLowerCase()) !== -1) ||
                            (examiner.initials.toLowerCase()
                                .indexOf(this.searchData.searchText.toLowerCase()) !== -1) ||
                            (examiner.surname.toLowerCase()
                                .indexOf(this.searchData.searchText.toLowerCase()) !== -1) || (examiner.liveUserName.toLowerCase()
                                .indexOf(this.searchData.searchText.toLowerCase()) !== -1) ||
                            (examiner.employeeNum.toLowerCase()
                                .indexOf(this.searchData.searchText.toLowerCase()) !== -1)));
            } else {
                this.filteredData.getSupportExaminerList = Immutable.List<SupportAdminExaminers>
                    (this.filteredData.getSupportExaminerList);
            }
            if (this.comparerName !== undefined) {
                this.filteredData.getSupportExaminerList = Immutable.List<any>(sortHelper
                    .sort(this.filteredData.getSupportExaminerList.toArray(), comparerList[_comparerName]));
            }
        }
    }

    /**
     * Render the search panel in support enviornment login
     */
    private renderSearchPanel(): JSX.Element {
        let disable = false;
        if (this.state.isLiveSelected) {
            this.searchData.searchText = '';
            disable = true;
        }
        return(
            <div className='search-box-wrap env-search-wrap padding-top-15'>
                <SearchPanel
                    id='search-panel'
                    key='search-panel-key'
                    searchData={this.searchData}
                    onSearch={this.onSearch}
                    isSearchResultTextVisible={false}
                    isdisable={disable}
                    searchResultsFor={''}
                    searchPlaceHolder={localeStore.instance.
                        TranslateText('support-login.support-login-search.search-placeholder')}
                    searchTooltip={''}
                    searchCancel={localeStore.instance.
                        TranslateText('support-login.support-login-search.close')}
                    searchClassName={'search-box-panel'}
                    searchWrapClass={''}
                />
            </div >);
    }

    /* Called when search text changed */
    private onSearch = (searchText: string) => {
        this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
        this.filteredExaminers();
        if (adminSupportStore.instance.getExaminerID) {
            loginActionCreator.selectExaminer(0);
        }
    }

    /**
     * Re render the page after applied the filter.
     */
    private filteredExaminers() {
        this.setState({
            renderedOn: Date.now()
        });
    }

	/**
	 * Method to render the option buttons
	 */
    private renderOptionButtons() {
        if (!navigationStore.instance.isFromSwitchUser){
            return (
                <div className='login-options-holder padding-top-10 padding-bottom-20'>
                    <ul className='option-items' id='support_login_options'>
                        <li className='padding-top-10'>
                            <input
                                type='radio'
                                id='loginLiveEnv'
                                name='loginEnv'
                                checked={this.state.isLiveSelected ? true : false} />
                            <label htmlFor='loginLiveEnv' id='loginLiveEnv_label' onClick={this.onOptionButtonClick.bind(this, true)}>
                                <span className='radio-ui'></span>
                                <span
                                    className='label-text font-bold'
                                >{localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-live')}</span>
                            </label>
                        </li>
                        <li className='padding-top-10'>
                            <input
                                type='radio'
                                value='selected'
                                id='loginsupportEnv'
                                name='loginEnv'
                                checked={this.state.isLiveSelected ? false : true} />
                            <label htmlFor='loginsupportEnv' id='loginsupportEnv_label'
                                onClick={this.onOptionButtonClick.bind(this, false)}>
                                <span className='radio-ui'></span>
                                <span
                                    className='label-text'
                                >{localeStore.instance.TranslateText('support-login.support-login-page.radio-button-text-support')}</span>
                            </label>
                        </li>
                    </ul>
                </div>);
        }
	}

	/**
	 * Method to handle the support login click event
	 */
    private onClick() {
        if (this.state.isLiveSelected) {
            // Login to the live environment as myself.
            navigationHelper.navigateToQigSelector('false');
        } else {
            let supportadminlist = adminSupportStore.instance.getSupportAdminExaminerLists;
            let _examinerId: number = 0;
            let _liveUserName: string;
            if (supportadminlist.getSupportExaminerList) {
                supportadminlist.getSupportExaminerList.map((item: SupportAdminExaminers) => {
                    //Check any examiner in support enviornment is selected and retrive liveUsername and examinerId
                    if (item.isSelected) {
                        _liveUserName = item.liveUserName;
                        _examinerId = item.examinerId;
                    }
                    item.isSelected = false;
                });

                // Login to the support environment as a selected examiner.
                if (_examinerId > 0 && _liveUserName) {
                    loginActionCreator.supportLogin(_liveUserName, _examinerId);
                }
            }
        }
    }

    /**
     * Method to handle the support cancel button click event
     */
    private onCancelClick() {
        navigationHelper.navigateToQigSelector('false');
    }

    /**
     * Method to handle option button click
     * @param isLiveSelected
     */
    private onOptionButtonClick(isLiveSelected: boolean) {
        //reset the selection in examiner list
        if (this._examinerSelected && isLiveSelected) {
            loginActionCreator.selectExaminer(0);
            this._examinerSelected = false;
        }

		this.setState({
			renderedOn: Date.now(),
            isLiveSelected: isLiveSelected,
            doDisableLogin: !isLiveSelected && !this._examinerSelected
		});
	}

	/**
	 * Call back function from table wrapper on sorting
	 * @param comparerName
	 * @param sortDirection
	 */
	private onSortClick(comparerName: string, sortDirection: enums.SortDirection) {
		this.comparerName = comparerName;
		this.sortDirection = sortDirection;

		let sortDetails: adminSupportSortDetails = {
			comparerName: comparerList[this.comparerName],
			sortDirection: this.sortDirection
		};

		adminsupportActionCreator.onSortedClick(sortDetails);
	}

	/**
	 * componentDidMount React lifecycle event
	 */
    public componentDidMount() {
		adminSupportStore.instance.addListener(
			adminSupportStore.AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT,
			this.loadSupportAdminExaminerData);
		adminSupportStore.instance.addListener(
			adminSupportStore.AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT,
            this.loadSupportAdminExaminerData);
        adminSupportStore.instance.addListener(
            adminSupportStore.AdminSupportStore.EXAMINER_SELECTED_EVENT,
            this.selectExaminerInSupportEnviornmentGrid);
        loginStore.instance.addListener(loginStore.LoginStore.SUPPORT_LOGIN_EVENT,
            this.navigate);
	}

    /**
     * componentWillUnmount React lifecycle event
     */
	public componentWillUnmount() {
		adminSupportStore.instance.removeListener(
			adminSupportStore.AdminSupportStore.GET_ADMIN_SUPPORT_EXAMINER_LIST_EVENT,
			this.loadSupportAdminExaminerData);
		adminSupportStore.instance.removeListener(
			adminSupportStore.AdminSupportStore.ADMIN_SUPPORT_SORT_ACTION_EVENT,
            this.loadSupportAdminExaminerData);
        adminSupportStore.instance.removeListener(
            adminSupportStore.AdminSupportStore.EXAMINER_SELECTED_EVENT,
            this.selectExaminerInSupportEnviornmentGrid);
        loginStore.instance.removeListener(loginStore.LoginStore.SUPPORT_LOGIN_EVENT,
            this.navigate);
	}

    /**
     * navigate to qig selector
     */
    private navigate() {
        navigationHelper.navigateToQigSelector('false');
    }

	/**
	 * Loading examiner data for admin support
	 */
	private loadSupportAdminExaminerData = () => {
		if (adminSupportStore &&
			adminSupportStore.instance.getSupportAdminExaminerLists &&
			adminSupportStore.instance.adminSupportSortDetails.length <= 0) {
			let sortDetails: adminSupportSortDetails = {
				comparerName: comparerList.adminSupportNameComparer,
				sortDirection: enums.SortDirection.Ascending
			};
			adminsupportActionCreator.onSortedClick(sortDetails);

			this.comparerName = comparerList[sortDetails.comparerName].toString();
			this.sortDirection = sortDetails.sortDirection;
		}

		this.setState({
            renderedOn: Date.now(),
            isLiveSelected: false,
            doDisableLogin: !this._examinerSelected
        });

        // Remove adminsupport key from windows session storage so that admin support page will not be loaded on refresh.
        window.sessionStorage.removeItem('adminsupport');
    }

    /* select examiner in support enviornment grid */
    private selectExaminerInSupportEnviornmentGrid = () => {
        let supportadminlist = adminSupportStore.instance.getSupportAdminExaminerLists;
            this.supportExaminerSelectionEnabled = this._examinerSelected =
                supportadminlist.getSupportExaminerList ?
                    supportadminlist.getSupportExaminerList.some((item: SupportAdminExaminers) => item.isSelected) : false;
            this.setState({
                renderedOn: Date.now(),
                doDisableLogin: !this._examinerSelected && !this.state.isLiveSelected
            });
    }

	/**
	 * Generating Grid Rows
	 * @param comparerName
	 * @param sortDirection
	 */
	private getGridColumnHeaderRows(comparerName: string, sortDirection: enums.SortDirection): Immutable.List<Row> {
		return this.adminSupportHelper.generateTableHeader(comparerName, sortDirection);
	}
}

export = AdminSupport;
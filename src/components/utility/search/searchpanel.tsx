import React = require('react');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase, PropsBase {
	onSearch: Function;
	searchData: SearchData;
    isSearchResultTextVisible: boolean;
    isdisable?: boolean;
	searchResultsFor: string;
	searchPlaceHolder: string;
	searchTooltip: string;
	searchCancel: string;
	searchClassName: string;
	searchWrapClass: string;
}

const searchPanel = (props: Props) => {
	if (!props.searchData.isVisible) {
		return null;
	}

	let _divSearchResult: JSX.Element;
	if (props.isSearchResultTextVisible) {
		_divSearchResult = (
			<div className='col-6-of-12 search-result-panel'>
				<p className='searching-txt'>
					<span className='searching-result-caption' id='search-result-caption'>
						{props.searchResultsFor + ' '}
					</span>
					<span className='bolder' id='search-result-caption-dots'>{props.searchData.searchText}...</span>
				</p>
				<span className='loader text-middle'>
					<span className='dot'></span>
					<span className='dot'></span>
					<span className='dot'></span>
				</span>
			</div>
		);
	} else {
		_divSearchResult = null;
	}

	return (
		<div
			className={classNames(props.searchWrapClass, {
				'loading': props.searchData.isSearching !== undefined
					? props.searchData.isSearching
					: false,
				'search-complete': props.searchData.isSearching !== undefined
					? !props.searchData.isSearching
					: false
			})}>

			{_divSearchResult}
			<div className={props.searchClassName}>
				<div className='relative'>
					<span id='search-icon' className='search-link'>
						<span className='sprite-icon search-icon-small-grey'>Search</span>
					</span>
					<input
						type='text'
						id='message-search'
						className='text-underline msg-search-input'
						onChange={onSearch}
						required
						tabIndex={1}
						placeholder={props.searchPlaceHolder}
                        title={props.searchTooltip}
                        disabled={props.isdisable}
                        aria-label={props.searchTooltip}
						autoComplete='off'
						value={props.searchData.searchText} />
					<a
						id='search-close-link'
						href='javascript:void(0);'
						onClick={onSearchClear}
						className='close-link'
						title={props.searchCancel}>
						<span className='sprite-icon search-close'>Closed</span>
					</a>
					<span className='bar'></span>
				</div>
			</div>
		</div>
	);

    /**
     * Will call on search text change.
     * @param e event
     */
	function onSearch(e: any) {
		props.onSearch(e.target.value);
	}

    /**
     * This method will clear the search contents.
     */
	function onSearchClear() {
		props.onSearch('');
	}
};

export = searchPanel;
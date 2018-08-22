import React = require('react');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');

interface Props extends LocaleSelectionBase, PropsBase {
    onSearch: Function;
    onSearchClick: Function;
    qigName: string;
    searchText: string;
}

const searchPanel = (props: Props) => {
    return (
        <div className='menu-page-block menu-page-search' id='menu-search-area'>
            <h2 id='menu-search-area-header'>{localeStore.instance.
                TranslateText('search-response.search-header')}</h2>
            <ul className='menu-holder recent-items'>
                <li className='menu-items'>
                    <div className='recent-links-quig' id='menu-search-area-qigname'
                        title={props.qigName}>
                        {props.qigName}</div>
                </li>
                <li className='search-box-wrap lite'>
                    <div className='search-box-panel'>
                        <div className='relative'>
                            <span id='search-icon' className='search-link'>
                                <span className='sprite-icon search-icon-small-grey'>
                                    Search for a response by ID
                                </span>
                            </span>
                            <input
                                type='text'
                                id='menu-search-response'
                                className='text-underline msg-search-input'
                                onChange={onSearch}
                                required
                                placeholder={localeStore.instance.
                                    TranslateText('search-response.search-placeholder')}
                                title={localeStore.instance.
                                    TranslateText('search-response.search-tooltip')}
                                disabled={false}
                                aria-label={localeStore.instance.
                                    TranslateText('search-response.search-tooltip')}
                                autoComplete='off'
                                value={props.searchText} />
                            <a
                                id='menu-search-close-link'
                                href='javascript:void(0);'
                                onClick={onSearchClear}
                                className='close-link'
                                title={localeStore.instance.
                                    TranslateText('search-response.search-close-button-text')}>
                                <span className='sprite-icon search-close'>Closed</span>
                            </a>
                            <span className='bar'></span>
                        </div>
                    </div>
                </li>
                <li>
                    <button className='primary rounded logout-btn' id='menu-search-btn'
                        onClick={onSearchClick} title={localeStore.instance.
                        TranslateText('search-response.search-button-text')}>{localeStore.instance.
                            TranslateText('search-response.search-button-text')}</button>
                </li>
            </ul>
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

    /**
     * This method will clear the search contents.
     */
    function onSearchClick() {
        props.onSearchClick();
    }
};

export = searchPanel;
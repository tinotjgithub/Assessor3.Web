"use strict";
var React = require('react');
var classNames = require('classnames');
var searchPanel = function (props) {
    if (!props.searchData.isVisible) {
        return null;
    }
    var _divSearchResult;
    if (props.isSearchResultTextVisible) {
        _divSearchResult = (React.createElement("div", {className: 'col-6-of-12 search-result-panel'}, React.createElement("p", {className: 'searching-txt'}, React.createElement("span", {className: 'searching-result-caption', id: 'search-result-caption'}, props.searchResultsFor + ' '), React.createElement("span", {className: 'bolder', id: 'search-result-caption-dots'}, props.searchData.searchText, "...")), React.createElement("span", {className: 'loader text-middle'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}))));
    }
    else {
        _divSearchResult = null;
    }
    return (React.createElement("div", {className: classNames(props.searchWrapClass, {
        'loading': props.searchData.isSearching !== undefined
            ? props.searchData.isSearching
            : false,
        'search-complete': props.searchData.isSearching !== undefined
            ? !props.searchData.isSearching
            : false
    })}, _divSearchResult, React.createElement("div", {className: props.searchClassName}, React.createElement("div", {className: 'relative'}, React.createElement("span", {id: 'search-icon', className: 'search-link'}, React.createElement("span", {className: 'sprite-icon search-icon-small-grey'}, "Search")), React.createElement("input", {type: 'text', id: 'message-search', className: 'text-underline msg-search-input', onChange: onSearch, required: true, tabIndex: 1, placeholder: props.searchPlaceHolder, title: props.searchTooltip, disabled: props.isdisable, "aria-label": props.searchTooltip, autoComplete: 'off', value: props.searchData.searchText}), React.createElement("a", {id: 'search-close-link', href: 'javascript:void(0);', onClick: onSearchClear, className: 'close-link', title: props.searchCancel}, React.createElement("span", {className: 'sprite-icon search-close'}, "Closed")), React.createElement("span", {className: 'bar'})))));
    /**
     * Will call on search text change.
     * @param e event
     */
    function onSearch(e) {
        props.onSearch(e.target.value);
    }
    /**
     * This method will clear the search contents.
     */
    function onSearchClear() {
        props.onSearch('');
    }
};
module.exports = searchPanel;
//# sourceMappingURL=searchpanel.js.map
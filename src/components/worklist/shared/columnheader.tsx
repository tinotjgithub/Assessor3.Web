import React = require('react');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import SortArrow = require('../../utility/table/sortarrow');

interface Props extends PropsBase {
    headerText: string;
    sortDirection?: enums.SortDirection;
    isCurrentSort?: boolean;
    isSortingRequired?: boolean;
    sortOption?: enums.SortOption;
}

/* tslint:disable:variable-name */
const ColumnHeader = (props: Props) => {

    if (props.isSortingRequired) {
        return (
            <a className={getSortClassName()}
                href='javascript:void(0)'
                title={getTitleText()} >
                <div className='frozen-header'>
                    <span className='sort-head-text' id={'col_' + props.headerText.replace(/ /g, '')}>{props.headerText}</span>
                    <SortArrow sortOption={props.sortOption} />
                </div>
            </a>);
    } else {

        return (
            <div className='frozen-header'>
                <span className='sort-head-text' id={'col_' + props.headerText.replace(/ /g, '')}>{props.headerText}</span>
            </div>);
    }

    /**
     * This method will return the sort className
     */
    function getSortClassName() {
        if (!props.isSortingRequired) {
            return '';
        }

        if (props.isCurrentSort) {
            if (props.sortOption === undefined || props.sortOption === enums.SortOption.Both) {
                return (props.sortDirection === enums.SortDirection.Descending) ?
                    'sortable-link desc' : 'sortable-link asc';
            } else if (props.sortOption === enums.SortOption.Up) {
                return ('sortable-link asc');
            } else {
                return ('sortable-link desc');
            }
        } else {
            return 'sortable-link';
        }
    }

    /**
     * Gets Title text.
     */
    function getTitleText() {
        if (props.headerText && props.headerText !== '') {
            return localeStore.instance.TranslateText
                ('marking.worklist.list-view-column-headers.sort-by-tooltip') + ' ' + props.headerText;
        }
    }
};

export = ColumnHeader;
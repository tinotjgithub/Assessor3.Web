import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import tableHeader = require('../../../utility/enhancedoffpagecomment/typings/tableheader');
import enums = require('../../../utility/enums');
import SortArrow = require('../../../utility/table/sortarrow');
let classNames = require('classnames');

interface Props extends LocaleSelectionBase {
    Items: Immutable.List<tableHeader>;
    onSortClick: Function;
    headerRefCallBack: Function;
}

interface State {
    renderedOn?: number;
}

interface TableHeaderItemProps extends PropsBase {
    columnIndex: number;
    headerText: string;
    width?: React.CSSProperties;
    isSortable?: boolean;
    comparerName: string;
    isCurrentSort?: boolean;
    sortDirection?: enums.SortDirection;
    sortOption?: enums.SortOption;
    onClick?: Function;
}

class EnhancedOffPageCommentTableHeader extends pureRenderComponent<Props, State> {

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Render method
     */
    public render() {
        let tableHeaders = this.props.Items.map((header: tableHeader) => {
            let tableHeaderItemProps: TableHeaderItemProps = {
                id: 'column_header_' + header.columnName.toLowerCase(),
                key: 'column_header_key_' + header.columnName.toLowerCase(),
                columnIndex: header.columnIndex,
                headerText: header.header, isSortable: header.isSortRequired,
                comparerName: header.comparerName, isCurrentSort: header.isCurrentSort, sortDirection: header.sortDirection,
                sortOption: header.sortOption
            };

            return (this.tableHeaderItem(tableHeaderItemProps));
        });

        return (
            <thead className='offpage-comment-table-header'>
                <tr>
                    {tableHeaders}
                </tr>
            </thead>
        );
    }

    /**
     * Render table header item
     */
    private tableHeaderItem = (props: TableHeaderItemProps) => {

        let sort: JSX.Element = props.isSortable ?
            <a href='javascript:void(0)' className={this.getSortClassName(props)} title=''>
                <span className='sort-head-text'>{props.headerText}</span>
                <SortArrow sortOption={props.sortOption} /></a> : null;

        return (
            <th className={'comment-col col' + props.columnIndex} id={props.id} key={props.key}
                ref={(element) => { this.props.headerRefCallBack(element, props.headerText); }}>
                <span className='visually-hidden'>
                    visually hidden text
                </span>
                <div className={classNames('th-content', { 'hand': props.isSortable})}
                    onClick={() => { this.props.onSortClick(props.comparerName, props.sortDirection); }}>
                    <div className='table-text small-text ex-dim-text'>
                        {sort}
                    </div>
                </div>
            </th>
        );
    }

    /**
     * Returns the sort class names
     * @returns 
     */
    private getSortClassName(tableHeaderProps: TableHeaderItemProps) {
        if (!tableHeaderProps.isSortable) {
            return '';
        }

        if (tableHeaderProps.isCurrentSort) {
            if (tableHeaderProps.sortOption === undefined || tableHeaderProps.sortOption === enums.SortOption.Both) {
                // if sort direction is descending then we have to display accending class, for 
                // calling sort we are sending opposite sort direction using getCurrentSort method.
                return (tableHeaderProps.sortDirection === enums.SortDirection.Descending) ?
                    'sortable-link asc' : 'sortable-link desc';
            } else if (tableHeaderProps.sortOption === enums.SortOption.Up) {
                return ('sortable-link asc');
            } else {
                return ('sortable-link desc');
            }
        } else {
            return 'sortable-link';
        }
    }
}

export = EnhancedOffPageCommentTableHeader;
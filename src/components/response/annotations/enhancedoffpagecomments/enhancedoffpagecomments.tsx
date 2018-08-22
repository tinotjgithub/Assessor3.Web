import React = require('react');
import enums = require('../../../utility/enums');
import tableHeader = require('../../../utility/enhancedoffpagecomment/typings/tableheader');
import enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import gridColumnNames = require('../../../utility/grid/gridcolumnnames');
import worklistStore = require('../../../../stores/worklist/workliststore');
import localeStore = require('../../../../stores/locale/localestore');
import eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import eCourseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import TableHeader = require('./enhancedoffpagecommenttableheader');
let classNames = require('classnames');


interface Props extends LocaleSelectionBase, PropsBase {
    enhancedOffPageComments: Immutable.List<EnhancedOffPageCommentViewDataItem>;
    tableHeaders: Immutable.List<tableHeader>;
    onSortClick: Function;
    isAddCommentLinkVisible: boolean;
    headerRefCallBack: Function;
    onCommentClick?: Function;
    style: string;
    selectedCommentIndex: number;
}

// tslint:disable-next-line:variable-name
const Col = (props: { width: number }) => {
    return (<col width={props.width + '%'} />);
};

// tslint:disable-next-line:variable-name
const ColGroup = (props: { headerItems: Immutable.List<tableHeader> }) => {
    let col = props.headerItems.map((header: tableHeader, index: number) => {
        let width: number = header.columnName === gridColumnNames.Comment ? 100 : 0;
        if (enhancedOffPageCommentHelper.getCellVisibility(header.columnName)) {
            return (<Col key={'col-group-key-' + index + 1} width={width} />);
        } else {
            return null;
        }
    });

    return (
        <colgroup>
            {col}
        </colgroup>
    );
};


// tslint:disable-next-line:variable-name
const File = (props: {
    id: string,
    text: any,
    isItemSelected?: boolean
}) => {
    let eCourseWorkFile: eCourseWorkFile;
    if (parseInt(props.text) > 0) {
        eCourseWorkFile = enhancedOffPageCommentHelper.getECourseWorkFile(parseInt(props.text));
    }
    if (eCourseWorkFile) {
        let classnames = eCourseworkHelper.getIconStyleForSvg(eCourseWorkFile.linkType, true);
        return (
            <div className={classNames('table-text ', { 'active': props.isItemSelected })} id={props.id}>
                <div className={'file-icon ' + classnames.listItemClass}>
                    <span className='svg-icon'>
                        <svg className={classnames.svgClass} viewBox={classnames.viewBox}>
                            <use xmlnsXlink={'http://www.w3.org/1999/xlink'} xlinkHref={'#' + classnames.icon} />
                        </svg>
                    </span>
                </div>
                <div className='file-name'>{eCourseWorkFile.title}</div>
            </div>
        );
    } else {
        return (
            <div className='table-text'>
            </div>
        );
    }
};

// tslint:disable-next-line:variable-name
const Item = (props: {
    id: string,
    text: any,
    isItemSelected?: boolean
}) => {
    return (
        <div className={classNames('table-text ', { 'active': props.isItemSelected })} id={props.id}>
            {props.text}
        </div>
    );
};


// tslint:disable-next-line:variable-name
const TableRowCoulmn = (props: {
    index: number,
    row: number,
    className: string,
    gridColumn: string,
    text: any,
    isItemSelected?: boolean
}) => {
    let id: string = 'text-' + props.row + '-' + props.index;
    let child: JSX.Element = props.gridColumn === gridColumnNames.File ?
        <File id={id} text={props.text} isItemSelected={props.isItemSelected} /> :
        <Item id={id} text={props.text} isItemSelected={props.isItemSelected} />;

    if (enhancedOffPageCommentHelper.getCellVisibility(props.gridColumn)) {
        return (
            <td className={props.className} id={'col-' + props.row + '-' + props.index} >
                {child}
            </td>
        );
    } else {
        return null;
    }
};

// tslint:disable-next-line:variable-name
const TableRowBlank = (props: { row: number, headerData: Immutable.List<tableHeader> }) => {
    let blankRows = props.headerData.map((header: tableHeader) => {
        return (
            <TableRowCoulmn key={'blank-row-column-key-' + header.columnIndex } index={header.columnIndex} row={props.row}
            className={'col col' + header.columnIndex} gridColumn={header.columnName} text={header.header} />
        );
    });

    return (
        <tr className='comment-row blank-row'>
            {blankRows}
        </tr>
    );
};

// tslint:disable-next-line:variable-name
const TableRow = (props: {
    data: Immutable.List<EnhancedOffPageCommentViewDataItem>,
    headerData: Immutable.List<tableHeader>, onCommentClick: Function
}) => {
    let rowCount: number = 1;
    let tableBody: any;
    let isMarkSchemeSelected: boolean;
    let isFileSelected: boolean;
    let currentWorklistType: enums.WorklistType = worklistStore.instance.currentWorklistType;
    tableBody = props.data.map((item: EnhancedOffPageCommentViewDataItem, index: number) => {
        rowCount = index + 1;
        isMarkSchemeSelected = item.isMarkSchemeSelected;
        isFileSelected =  item.isFileSelected;
        return (
            <tr className='comment-row' id={'comment-row' + index + 1} key={'comment-row-key-' + index + 1}
                onClick={() => { props.onCommentClick(item); }}>
                <TableRowCoulmn index={enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.Item)} row={index + 1}
                    className={'comment-col col1'} gridColumn={gridColumnNames.Item} text={item.itemText}
                    isItemSelected={isMarkSchemeSelected} />
                <TableRowCoulmn index={enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.File)} row={index + 1}
                    className={'comment-col col2'} gridColumn={gridColumnNames.File} text={item.fileId}
                    isItemSelected={isFileSelected} />
                <TableRowCoulmn index={enhancedOffPageCommentHelper.getColumnIndex(gridColumnNames.Comment)} row={index + 1}
                    className={'comment-col col3'} gridColumn={gridColumnNames.Comment} text={item.comment} />
            </tr>
        );
    });

    return (
        <tbody className='offpage-comment-table-content' id='offpage-comment-table-content'>
            {tableBody}
            <TableRowBlank row={rowCount} headerData={props.headerData} />
        </tbody>
    );
};

// tslint:disable-next-line:variable-name
const Table = (props: {
    data: Immutable.List<EnhancedOffPageCommentViewDataItem>,
    headerData: Immutable.List<tableHeader>, onSortClick: Function, onCommentClick: Function,
    headerRefCallBack: Function
}) => {
    return (
        <table cellPadding='0' cellSpacing='0' className='offpage-comment-table'>
            <ColGroup headerItems={props.headerData} />
            <TableHeader Items={props.headerData} onSortClick={props.onSortClick} headerRefCallBack={props.headerRefCallBack} />
            <TableRow data={props.data} headerData={props.headerData} onCommentClick={props.onCommentClick} />
        </table>
    );
};



/**
 * Enhanced off-page comments table
 * @param props
 */
// tslint:disable-next-line:variable-name
const EnhancedOffPageComments = (props: Props) => {
    let headerStyle: React.CSSProperties = {};
    headerStyle = {
        backgroundColor: props.style
    };
    return (
        <div className='comment-table-container'>
            {props.selectedCommentIndex !== 0 ? (
                <div className='comment-remark-bg' id='comment-remark-bg' style={headerStyle}></div>) : null}
            <div className='offpage-comment-wrapper'>
                <Table data={props.enhancedOffPageComments}
                    headerData={props.tableHeaders}
                    onSortClick={props.onSortClick}
                    headerRefCallBack={props.headerRefCallBack}
                    onCommentClick={props.onCommentClick} />
            </div>
        </div >
    );
};

export = EnhancedOffPageComments;
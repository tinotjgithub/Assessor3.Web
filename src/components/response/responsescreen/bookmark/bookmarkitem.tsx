import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import enums = require('../../../utility/enums');
import localeStore = require('../../../../stores/locale/localestore');
import Immutable = require('immutable');
let classNames = require('classnames');
import bookmarkActionCreator = require('../../../../actions/bookmarks/bookmarkactioncreator');
import bookmarkComponentWrapper = require('../../../../stores/marking/bookmarkcomponentwrapper');
import bookmarkhelper = require('../../../../stores/marking/bookmarkhelper');

interface BookmarkItemProps extends PropsBase {
    id: string;
    bookmarkId: string;
    pageNo: number;
    comment: any;
    fileName: any;
    toolTip: string;
    clientToken: string;
    bookmarkTop: number;
}

/**
 * List Item component to display the each bookmark items
 * @param props
 */
const bookmarkItem: React.StatelessComponent<BookmarkItemProps> = (props: BookmarkItemProps) => {

    const onBookmarkItemClicked = (event: any) => {
        bookmarkActionCreator.bookmarkItemSelection(props.clientToken);
    };
    return (
        <li className='list-item'>
            <a id={props.id}
                className='bookmark-name list-item-data'
                href='javascript:void(0)'
                data-token={props.clientToken}
                title={props.toolTip}
                onClick={onBookmarkItemClicked}>
                {props.comment}
            </a>
        </li>);
};

export = bookmarkItem;
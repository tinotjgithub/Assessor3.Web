import React = require('react');
import localeStore = require('../../../../stores/locale/localestore');
import Immutable = require('immutable');
let classNames = require('classnames');
import responseStore = require('../../../../stores/response/responsestore');
import bookmarkComponentWrapper = require('../../../../stores/marking/bookmarkcomponentwrapper');
import BookmarkItem = require('./bookmarkitem');
import enums = require('../../../utility/enums');
import worklistStore = require('../../../../stores/worklist/workliststore');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import bookmarkActionCreator = require('../../../../actions/bookmarks/bookmarkactioncreator');
import toolBarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');

interface BookmarkHolderProps extends PropsBase, LocaleSelectionBase {
    bookmarkItems: Array<bookmarkComponentWrapper>;
}

/**
 * This component is used to Render the bookmark items inside the response screen left panel toolbar
 * Bookmarks associated with the response should pass to the component and cunstruct the new entity here.
 * @param props
 */
const bookmarkHolder: React.StatelessComponent<BookmarkHolderProps> = (props: BookmarkHolderProps) => {

    let renderNewItemHeader: JSX.Element;
    let showMenuContent: JSX.Element;
    let idPrefix: string = 'bookmark-';
    let isTeamManagement: boolean = markerOperationModeFactory.operationMode.isTeamManagementMode;

    /**
     * This method will do the actions when a new bookmark is created
     */
    const onAddNewBookmarkClicked = (event: any) => {
        toolBarActionCreator.isBookmarkSidePanelOpen(false);
        bookmarkActionCreator.addNewBookmark();
    };

    /**
     * Go back button click
     */
    const onGoBackClick = (event: any) => {
        bookmarkActionCreator.goBackButtonClick();
    };

    // Set the 'Add new bookmark' header panel
    if (!isTeamManagement &&
        !worklistStore.instance.isMarkingCheckMode &&
        (responseStore.instance.selectedResponseMode === enums.ResponseMode.open ||
            responseStore.instance.selectedResponseMode === enums.ResponseMode.pending)){
        renderNewItemHeader = (
            <div id='bookmark-header' className='list-menu-header' >
                <a id='create-new-bookmark-item' className='create-new-list-item' onClick={onAddNewBookmarkClicked}>
                    <span id='create-new-bookmark-icon' className='svg-icon'>
                                <svg viewBox='0 0 32 32' className='added-bookmark-icon'>
                                    <use xlinkHref='#add-new-book-mark'>
                                        #shadow-root (closed)
                                        <g id='add-new-book-mark'></g>
                                    </use>
                                </svg>
                            </span>
                            < span id='create-new-bookmark-label' className='new-bookmark-label' >
                                {localeStore.instance.TranslateText('marking.response.bookmarks-panel.add-new-bookmark')}</span >
                        </a >
                        </div>);
    }

    // Set the 'Go Back' header panel
    let goBackClassName = 'go-back-menu ' +
        (responseStore.instance.getBookmarkPreviousScrollData === undefined ? 'disabled' : '');
    let showGoBackOption = (
        <a href='javascript:void(0);' className={goBackClassName}
            title={localeStore.instance.TranslateText('marking.response.bookmarks-panel.return-to-selected-page')}
            onClick={onGoBackClick}>
            <span className='svg-icon'>
                <svg viewBox='0 0 32 32' className='icon-left-arrow'>
                    <use xlinkHref='#icon-left-arrow-a'>
                        #shadow-root (closed)
                        <g id='icon-left-arrow-a'></g>
                    </use>
                </svg>
            </span>
            < span id='create-new-bookmark-label' className='new-message-label'>
                {localeStore.instance.TranslateText('marking.response.bookmarks-panel.go-back')}</span >
        </a>);

    // Set the bookmark list panel and bookmarks contents
    if (props.bookmarkItems && props.bookmarkItems.length > 0) {

        let visibleBookMarks: Array<bookmarkComponentWrapper> = props.bookmarkItems.filter((bookmarkItem: bookmarkComponentWrapper) =>
            bookmarkItem.markingOperation !== enums.MarkingOperation.deleted
        );

        if (visibleBookMarks.length > 0) {
        showMenuContent = (
            <div id='bookmark-list-content' className='list-menu-content'>
                <ul id='bookmark-contents-holder' className='list-menu-item-holder'>{
                    visibleBookMarks.map((bookmarkItem: bookmarkComponentWrapper, index: number) => {
                        if (bookmarkItem.markingOperation !== enums.MarkingOperation.deleted) {
                        return (<BookmarkItem
                            id={idPrefix + index}
                            key={idPrefix + index}
                            bookmarkId={idPrefix + bookmarkItem.bookmarkId}
                            pageNo={bookmarkItem.pageNo}
                            comment={bookmarkItem.comment.length === 0 ? bookmarkItem.toolTip : bookmarkItem.comment}
                            fileName={bookmarkItem.fileName}
                            toolTip={bookmarkItem.toolTip}
                            clientToken={bookmarkItem.clientToken}
                            bookmarkTop={bookmarkItem.top}
                        />);
                        }
                    }) }
                </ul>
            </div>);
    }
    }

    return (
        <div id={props.id} className={classNames('bookmark-panel list-menu tool-option-menu menu')}>
            {renderNewItemHeader}
            <div id='go-back-header' className='list-menu-header'>
                {showGoBackOption}
            </div>
            {showMenuContent}
        </div>
    );

};
export = bookmarkHolder;

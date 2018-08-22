/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import Immutable = require('immutable');
import localeStore = require('../../../../stores/locale/localestore');
let classNames = require('classnames');
import courseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import FileItem = require('./fileitem');
import eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import userOptionHelper = require('../../../../utility/useroption/useroptionshelper');
import constants = require('../../../utility/constants');
import responseStore = require('../../../../stores/response/responsestore');
import eCourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
declare let config: any;
import URLS = require('../../../../dataservices/base/urls');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import worklistStore = require('../../../../stores/worklist/workliststore');
import enums = require('../../../utility/enums');
import applicationActionCreator = require('../../../../actions/applicationoffline/applicationactioncreator');
import ecourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import ecourseworkFilelistPanelState = require('../../../../stores/useroption/typings/ecourseworkfilelistpanelstate');
import stampActionCreator = require('../../../../actions/stamp/stampactioncreator');
import stampStore = require('../../../../stores/stamp/stampstore');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');
import stampActioncreator = require('../../../../actions/stamp/stampactioncreator');
interface Props extends PropsBase, LocaleSelectionBase {
    renderedOn: number;
    responseId: number;
}

interface State {
    renderedOn: number;
    fileListScrollHeight?: number;
}

/**
 * React component class for response toolbar.
 */
class FilelistPanel extends pureRenderComponent<Props, State> {

    private _eCourseWorkFileList: Immutable.List<courseWorkFile>;
    private topIndex: number = 0;
    private bottomIndex: number = 0;
    private totalNoOfItems: number = 0;
    private totalElements: any;
    private maxNoOfIcons: number = 0;
    private selectedFileIndex: number = 0;
    private prevPageY: number = 0;
    private allowUp: boolean = false;
    private allowDown: boolean = false;
    private isTouchInitialised: boolean = false;
    private docPageIdsWithError: Array<number>;
    private onErrorRetryCount: number = config.general.CLOUD_IMAGE_RETRY_COUNT;
    private docPageIdsWithSuccess: Array<number>;
    private hasScrolled: boolean = false;

    /** refs */
    public refs: {
        [key: string]: (Element);
        fileList: (HTMLDivElement);
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

        this._eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstIdentifier(
            this.props.responseId);
        this.upArrowClick = this.upArrowClick.bind(this);
        this.downArrowClick = this.downArrowClick.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.toggleFilelistPanel = this.toggleFilelistPanel.bind(this);
        this.toggleFilelistView = this.toggleFilelistView.bind(this);
        this.fileListPanelViewUpdated = this.fileListPanelViewUpdated.bind(this);
        this.docPageIdsWithError = new Array<number>();
        this.docPageIdsWithSuccess = new Array<number>();
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.onFileItemHover = this.onFileItemHover.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        // logic for disabling the arrow keys
        let doDisableUpArrow: boolean = this.topIndex === 0;
        // if the this.totalElements are not updated, then donot show the down arrow, will set correctly after loading the files
        let doDisableDownArrow: boolean = this.totalElements && (this.totalElements.length === 0 ||
                                                this.bottomIndex === this.totalElements.length - 1);
        let isListView: boolean = eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List;
        let linkButtonIcon: string = isListView ? 'tile-view-icon' : 'grid-view-icon';
        let linkButtonText: string = isListView ? localeStore.instance.TranslateText('marking.response.media-player.thumbnail-view') :
            localeStore.instance.TranslateText('marking.response.media-player.list-view');
        let fileListViewClass: string = isListView ? 'list-view' : 'thumbnail-view';
        let switchViewButton: JSX.Element = this.isImageFileExists(this.props.responseId) ? (<a href='javascript:void(0);'
            onClick={this.toggleFilelistView}
            id='toggleFileListView'
            className='switch-view'
            title={linkButtonText}>
            <span className={classNames('sprite-icon', linkButtonIcon)}>{linkButtonText}</span>
            <span className='view-text'>{linkButtonText}</span>
        </a>) : null;
        return (
            <div className={classNames('media-panel', fileListViewClass)} id={'media-panel'}>
                <div className='media-panel-inner'>
                    <div className='panel-header'>
                        <div id={'media_panel_header'}
                            className='panel-header-label'>
                            {localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.header')}
                        </div>
                        <a href='javascript:void(0);' className='exp-col-media-panel' id={'ecourseworkpanel'}
                            title={eCourseWorkFileStore.instance.isFilelistPanelCollapsed ?
                                localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.expand-button-tooltip') :
                                localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.collapse-button-tooltip')}
                            onTransitionEnd={this.onAnimationEnd}
                            onClick={this.toggleFilelistPanel}>
                            <span className='sprite-icon exp-collapse-arrow right'>
                                {eCourseWorkFileStore.instance.isFilelistPanelCollapsed ?
                                    localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.expand-button-tooltip') :
                                    localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.collapse-button-tooltip')}
                            </span>
                        </a>
                    </div>
                    <div className='panel-content'>
                        <div className='media-panel-nav'>
                            <div className='panel-view-contol'>
                                {switchViewButton}
                            </div>
                            <a href='javascript:void(0);' id='mediaFileUpArrow' onClick={this.upArrowClick}
                                className={classNames('panel-control prev', { 'disabled': doDisableUpArrow })}
                                title={localeStore.instance.TranslateText
                                    ('marking.response.ecoursework-file-browser.previous-button-tooltip')}>
                                <span className='sprite-icon top-arrow-blue'>{localeStore.instance.TranslateText
                                    ('marking.response.ecoursework-file-browser.previous-button-tooltip')}
                                </span>
                            </a>
                        </div>
                        {this.getFileList()}
                        <div className='media-panel-nav'>
                            <div className='panel-bottom-contol'></div>
                            <a href='javascript:void(0);' id='mediaFileDownArrow'
                                onClick={this.isOnlyOneFileInPanel ? null : this.downArrowClick}
                                className={classNames('panel-control next', { 'disabled': doDisableDownArrow })}
                                title={localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.next-button-tooltip')}>
                                <span className='sprite-icon bottom-arrow-blue'>
                                    {localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.next-button-tooltip')}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
                {
                    this.renderDefinitions()
                }
            </div>
        );
    }

    /**
     * On Component Mount
     */
    public componentDidMount() {
        eCourseWorkFileStore.instance.
            addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.changeFileSelection);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanelUpdated);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT,
            this.fileListPanelViewUpdated);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        window.addEventListener('resize', this.setIndexes);

        let mediaPanel: HTMLElement = document.getElementById('media-panel');
        if (mediaPanel) {
            mediaPanel.addEventListener('transitionend', this.setScroll);
            mediaPanel.addEventListener('webkitTransitionEnd', this.setScroll);
        }
        // getting htmlElements collections
        this.totalElements = document.getElementsByClassName('media-file-item');
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        eCourseWorkFileStore.instance.
            removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.changeFileSelection);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_LIST_PANEL_TOGGLE_ACTION_EVENT,
            this.toggleFilelistPanelUpdated);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILELIST_PANEL_SWITCH_VIEW_EVENT,
            this.fileListPanelViewUpdated);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.responseChanged);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.responseChanged);
        window.removeEventListener('resize', this.setIndexes);

        let mediaPanel: HTMLElement = document.getElementById('media-panel');
        if (mediaPanel) {
            mediaPanel.removeEventListener('transitionend', this.setScroll);
            mediaPanel.removeEventListener('webkitTransitionEnd', this.setScroll);
        }
        this.refs.fileList.removeEventListener('touchstart', this.onTouchStart);
        this.refs.fileList.removeEventListener('touchmove', this.onTouchMove);
        this.refs.fileList.removeEventListener('touchend', this.onTouchEnd);
        // update current view to store while moving out from response
        this.updateFileListView(this.props.responseId);
    }

    /**
     * componentDidUpdate
     */
    public componentDidUpdate() {

        // due to animation DOM elements of filelist won't be available
        // so to avoid settimeout function, added check for filling html collection
        if (this.totalElements.length === 0) {
            // ensuring whether the file list html collections exists
            this.totalElements = document.getElementsByClassName('media-file-item');
        } else if (this.topIndex === 0 && this.bottomIndex === 0 && this.totalElements.length > 1) {
            // calculate indexex only if this.totalElements.length > 1, to avoid cyclic re-render
            // if this.totalElements.length is 1, then this.topIndex and this.bottomIndex are 0, no need of recalculation
            // to set top and bottom indexes
            this.setIndexes();
        }

        /* these events are used to block default scrolling in ipad and implement custom 
           scrolling logic to prevent the elastic scroll behavior of safari */
        if (this.refs.fileList && this.isTouchInitialised === false && htmlUtilities.isIPadDevice) {
            this.isTouchInitialised = true;
            this.refs.fileList.addEventListener('touchstart', this.onTouchStart);
            this.refs.fileList.addEventListener('touchmove', this.onTouchMove);
            this.refs.fileList.addEventListener('touchend', this.onTouchEnd);
        }
    }

    /**
     * component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {
        this._eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstIdentifier(nextProps.responseId);
        if (nextProps.responseId !== this.props.responseId) {
            this.docPageIdsWithError = new Array<number>();
            this.docPageIdsWithSuccess = new Array<number>();
            // update current view to store while moving out from response
            this.updateFileListView(this.props.responseId);
        }
    }

    /**
     * event handler for touch start
     */
    private onTouchStart = (event: any) => {
        this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
        let content = (this.refs.fileList as HTMLElement);
        this.allowUp = (content.scrollTop > 0);
        this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
    };

    /**
     * Method To Render Sideview
     */
    private onAnimationEnd() {
        stampActioncreator.renderSideViewComments();
    }

    /**
     * event handler for touch move
     */
    private onTouchMove = (event: any) => {

        event.preventDefault();
        let content = (this.refs.fileList as HTMLElement);
        let pageY = event.changedTouches[0].pageY;
        var up = (pageY > this.prevPageY);
        var down = (pageY < this.prevPageY);
        let diff = Math.abs(this.prevPageY - event.pageY);

        this.prevPageY = event.pageY;

        if ((up && this.allowUp)) {
            content.scrollTop = (content.scrollTop - diff);
        } else if (down && this.allowDown) {
            content.scrollTop = (content.scrollTop + diff);
        }
    };

    /**
     * event handler for touch end
     */
    private onTouchEnd = (event: any) => {
        this.prevPageY = 0;
    };

    /**
     * file list panel style
     */
    private get fileListPanelStyle(): string {
        return classNames('file-list', { 'scrolling': this.hasScrolled });
    }

    /**
     * Function for getting file list
     */
    private getFileList(): JSX.Element {
        if (this._eCourseWorkFileList) {

            let index: number = 0;
            let that = this;
            let files = this._eCourseWorkFileList.map(function (_eCourseWorkFile: courseWorkFile) {

                // logic for adding startview and endview classes
                let doAddStartView: boolean = index === that.bottomIndex;
                let doAddEndView: boolean = index === that.topIndex;
                let metadata = eCourseWorkFileStore.instance.getCoversheetMetaData(that.props.responseId,
                    _eCourseWorkFile.docPageID);

                    let fileItemComponent = (
                        <FileItem
                            selectedLanguage={that.props.selectedLanguage}
                            id={'FileItem' + index}
                            key={'FileItem_key' + index}
                            eCourseWorkFile={_eCourseWorkFile}
                            isSelected={eCourseWorkFileStore.instance.
                                getSelectedECourseWorkFiles() ?
                                eCourseWorkFileStore.instance.getSelectedECourseWorkFiles().
                                    some(x => x.docPageID === _eCourseWorkFile.docPageID) : false}
                            onCouseWorkFileClick={that.eCourseworkFileSelectionchange}
                            doAddStartView={doAddStartView} doAddEndView={doAddEndView}
                            isUnread={!_eCourseWorkFile.readStatus}
                            metaData={metadata}
                            isFilelistPanelCollapsed={eCourseWorkFileStore.instance.isFilelistPanelCollapsed}
                            scrollHeight={that.state.fileListScrollHeight}
                            fileListPanelView={eCourseWorkFileStore.instance.fileListPanelCurrentView} renderedOn={that.state.renderedOn}
                            onError={that.onError}
                            docPageId={_eCourseWorkFile.docPageID}
                            onSuccess={that.onSuccess}
                            onFileItemHover={that.onFileItemHover} />
                    );
                    index++;
                    return fileItemComponent;
            });

            return (
                <ul className={this.fileListPanelStyle} role='list' id={'File_List'}
                    onWheel ={this.isOnlyOneFileInPanel ? null : this.onMouseWheel}
                    onScroll={this.isOnlyOneFileInPanel ? null : this.onScroll}
                    ref = {'fileList'}>
                    {files}
                </ul>
            );
        } else {
            return null;
        }
    }

    /**
     * to check whether image file exits in file list
     */
    private isImageFileExists(identifier: number): boolean {
        let _eCourseWorkFileList = eCourseWorkFileStore.instance.getCourseWorkFilesAgainstIdentifier(identifier);
        if (_eCourseWorkFileList) {
            return _eCourseWorkFileList.some((courseWorkFile: courseWorkFile) =>
                courseWorkFile.linkData.mediaType === enums.MediaType.Image);
        }
        return false;
    }

    /**
     * update current view to store while moving out from response
     */
    private updateFileListView(identifier: number) {
        let doShowSwitchViewButton: boolean = this.isImageFileExists(identifier);
        if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.Thumbnail
            && !doShowSwitchViewButton) {
            eCourseworkResponseActionCreator.filelistPanelSwitchView(enums.FileListPanelView.List, false);
            this.updateFileListPanelUserOption(enums.FileListPanelView.List, eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
        }
    }

    /**
     * OnError of image load
     */
    private onError = (docPageID: number) => {
        this.docPageIdsWithError.push(docPageID);
        this.renderCloudImages();
    };

    /**
     * OnSuccess of image load
     */
    private onSuccess = (docPageID: number) => {
        this.docPageIdsWithSuccess.push(docPageID);
        this.renderCloudImages();
    };

    /**
     * check rerender of cloud images
     */
    private renderCloudImages() {
        /*filter cloud images*/
        let courseWorkFileList: any = this._eCourseWorkFileList.filter(x =>
            x.linkData.cloudType !== enums.CloudType.None &&
            x.linkData.mediaType === enums.MediaType.Image);

        /* if any of the image not loaded do a retry to load the images */
        if (this.onErrorRetryCount > 0 && this.docPageIdsWithError.length > 0 &&
            courseWorkFileList.length === (this.docPageIdsWithError.length + this.docPageIdsWithSuccess.length)) {
            this.onErrorRetryCount = this.onErrorRetryCount - 1;
            eCourseworkResponseActionCreator.reloadFailedImage();
            this.docPageIdsWithError = [];
        }
    }

    /**
     * Save selected ecourse work file in the store.
     */
    private eCourseworkFileSelectionchange = (eCourseworkfile: courseWorkFile) => {

        // for handling offline scenario for image types. While selecting an image we need to display an offline popup
        if (eCourseworkfile.linkData.mediaType === enums.MediaType.Image) {
            // displaying offline error popup
            applicationActionCreator.checkActionInterrupted();
        }
        // To avoid displaying file name in expanded view
        if (eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
            eCourseworkResponseActionCreator.displayFileName(eCourseworkfile.title);
        }

        let courseWorkSelectedFile = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        let isSameFileSelected = courseWorkSelectedFile ? courseWorkSelectedFile.filter((x: courseWorkFile) => x.docPageID ===
            eCourseworkfile.docPageID).count() === 0 : true;

        if (!eCourseworkfile.linkData.canDisplayInApplication || isSameFileSelected) {
            // Invoke action creator to save selected ecourse file in the store.
            eCourseworkResponseActionCreator.eCourseworkFileSelect(eCourseworkfile, true);
        }
        if (stampStore.instance.isFavouriteToolbarEmpty && !eCourseWorkFileStore.instance.iscustomToolbarMessageDisplayed) {
            stampActionCreator.updateStampBannerVisibility(enums.BannerType.CustomizeToolBarBanner, true);
        }

    };

    /**
     * Function for rendering definitions
     */
    private renderDefinitions(): JSX.Element {
        return eCourseWorkHelper.renderDefinitions();
    }

    /**
     * Re Render on File selection change
     */
    private changeFileSelection = (doSetIndex: boolean) => {
        this.doAutoDownloadFileItem(false);
        if (doSetIndex) {
            this.setIndexes(null, doSetIndex);
        } else {
            this.doRender();
        }
    }

    /**
     * reset values while response navigation
     */
    private responseChanged = () => {
        this.bottomIndex = 0;
        this.topIndex = 0;
    }

    /**
     * Function for switching filelist view
     */
    private toggleFilelistView = () => {
        this.setTopIndex();
        let _viewToUpdate: enums.FileListPanelView = enums.FileListPanelView.List;

        //Defect #59177 check OnlineStatus when switch to thumbnail View
        if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List &&
            !applicationActionCreator.checkActionInterrupted()) {
            return;
        }
        if (eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List) {
            _viewToUpdate = enums.FileListPanelView.Thumbnail;
        }
        eCourseworkResponseActionCreator.filelistPanelSwitchView(_viewToUpdate);
        this.updateFileListPanelUserOption(_viewToUpdate, eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
    };

    /**
     * Function for getting expand/collapse status
     */
    private toggleFilelistPanel = () => {
        // re-setting indexes in collapsed state
        if (this.refs.fileList && !eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
            this.setTopIndex();
            let actualHeight = this.refs.fileList.clientHeight - constants.DEFAULT_MEDIA_ARROW_ICON_HEIGHT;
            this.totalNoOfItems = this.totalElements.length;

            // setting single icon width
            let singleIconWidth = constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;

            // setting max no of icons fits within particular height
            this.maxNoOfIcons = Math.floor(actualHeight / singleIconWidth);


            let _bottomIndex = this.topIndex + this.maxNoOfIcons;
            this.bottomIndex = (_bottomIndex > this.totalNoOfItems ? this.totalNoOfItems : _bottomIndex) - 1;
        }
        this.updateFileListPanelUserOption(eCourseWorkFileStore.instance.fileListPanelCurrentView,
            !eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
        eCourseworkResponseActionCreator.fileListPanelToggle(!eCourseWorkFileStore.instance.isFilelistPanelCollapsed);
    };

    /**
     * Method to save user option of ecoursework file list panel state
     */
    private updateFileListPanelUserOption = (fileListPanelView: enums.FileListPanelView, iscollapsed: boolean): void => {
        let _ecourseworkFilelistPanelState: ecourseworkFilelistPanelState = new ecourseworkFilelistPanelState();
        _ecourseworkFilelistPanelState.iscollapsed = iscollapsed;
        _ecourseworkFilelistPanelState.fileListPanelView = fileListPanelView;
        userOptionHelper.save(userOptionKeys.ECOURSEWORK_FILELIST_PANEL_STATE, JSON.stringify(_ecourseworkFilelistPanelState), true, true);
    }

    /**
     * Method to update filelist panel in the store
     */
    private toggleFilelistPanelUpdated = (): void => {
        this.doRender();
    }

    /**
     * Method to handle up arrow click file Navigation
     */
    private upArrowClick() {

        // block navigation only when top index reaches first file
        if (this.topIndex !== 0) {
            this.moveUp();
        }
    }

    /**
     * Method to handle down arrow click file Navigation
     */
    private downArrowClick() {

        // block navigation only when bottom index reaches last file
        if (this.bottomIndex !== this.totalNoOfItems - 1) {
            this.moveDown();
        }
    }

    /**
     * handles mouseWheel navigation in file list collapsed mode
     */
    private onMouseWheel(event: any) {
        if (eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
            // handles mouse sroll down event
            if (event.deltaY > 0 && (this.bottomIndex !== this.totalNoOfItems - 1)) {
                this.moveDown();
            } else if (event.deltaY < 0 && this.topIndex !== 0) {

                // handles mouse sroll up event
                this.moveUp();
            }
        }
    }

    /*
     * event handler for file list panel scroll.
     */
    private onScroll = () => {

        this.hasScrolled = true;
        if (!eCourseWorkFileStore.instance.isFilelistPanelCollapsed) {
            this.setState({
                renderedOn: this.state.renderedOn,
                fileListScrollHeight: this.getFileListScrollHeight()
            }, () => {
                this.hasScrolled = false;
            });
        }
    };

    /*
     * event handler for file list panel item hover.
     */
    private onFileItemHover = () => {
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * returns the file list scroll height
     */
    private getFileListScrollHeight(): number {
        return (this.refs.fileList) ? (this.refs.fileList.clientHeight + this.refs.fileList.scrollTop) : undefined;
    }

    /**
     * handles fileicon navigation upwards
     */
    private moveUp() {
        // this.maxNoOfIcons indicates max no of icons should be in particular file list based on height
        // checks of difference between two indexes matches this.maxNoOfIcons
        if (Math.abs(this.topIndex - this.bottomIndex) === (this.maxNoOfIcons - 1)) {
            this.bottomIndex--;
        }

        this.topIndex--;
        this.doRender();
    }

    /**
     * handles fileicon navigation downwards
     */
    private moveDown() {
        this.topIndex++;
        this.bottomIndex++;
        this.doRender();
    }
    /**
     * setting / resetting index for first time based on filelist height
     */
    private setIndexes = (event?: any, doSetIndex: boolean = false): void => {
        if ((eCourseWorkFileStore.instance.isFilelistPanelCollapsed || doSetIndex) && this.refs.fileList) {
            // getting actual height of filelist html element
            var actualHeight = this.refs.fileList.clientHeight;
            this.totalNoOfItems = this.totalElements.length;

            // setting single icon width
            let singleIconWidth = constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;

            // setting max no of icons fits within particular height
            this.maxNoOfIcons = Math.floor(actualHeight / singleIconWidth);

            this.topIndex = 0;

            // setting default value while the maxnooficons is 1 or less than 1
            // which avoids cyclic re-render through  componentDidMount
            this.bottomIndex = this.maxNoOfIcons <= 1 ?
                1 : (this.maxNoOfIcons > this.totalNoOfItems ?
                    this.totalNoOfItems : this.maxNoOfIcons) - 1;

            // setting index based on file Index
            // while resizing the selected file should be shown and
            // also while returning back to collapsed mode from expanded mode then selected file should shown
            this.setSelectedFileIndex(doSetIndex);
            this.doRender();
        }
    };

    /**
     * Function for setting top Index value to calculate scrollTop value
     */
    private setTopIndex() {
        let fileListElement = this.refs.fileList;
        if (fileListElement) {
            let currentFileListPosition: number = Math.round(fileListElement.getBoundingClientRect().top);
            for (var i = 0; i < this.totalElements.length; i++) {

                // setting topindex for viewable icon (partially selected or fully selected)
                // this.totalElements[i].getBoundingClientRect().top ---> returns the current icon's position
                // if this icon is less than currentFileListPosition then it is hidden
                // so based on this condition index is setted
                if (Math.round(this.totalElements[i].getBoundingClientRect().top) < currentFileListPosition
                    && Math.round(this.totalElements[i].getBoundingClientRect().bottom) > currentFileListPosition) {
                    this.topIndex = i;
                    break;
                } else if (Math.round(this.totalElements[i].getBoundingClientRect().top) >= currentFileListPosition) {
                    this.topIndex = i;
                    break;
                }
            }
        }
    }

    /**
     * setting / resetting scroll position
     */
    private setScroll = (event?: any): void => {

        let isMediaEvent = event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd')
            && (event.propertyName === 'margin-left' || (htmlUtilities.isIPadDevice && event.propertyName === 'margin'))
            && event.target.className === 'media-panel-inner';

        // setting scroll bar while switching between thumnailview and listview
        let isThumbNailEvent = event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd')
            && (event.propertyName === 'height' || (htmlUtilities.isIPadDevice && event.propertyName === 'margin'))
            && event.target.className === 'thumbnail-image';

        // for fixing partial visible icons issue after transition end
        // for fixing scroll persist in filelist panel for ipad
        if (isMediaEvent || isThumbNailEvent) {
            if (!eCourseWorkFileStore.instance.isFilelistPanelCollapsed && this.refs.fileList) {
                let fileItemHeight: number = 0;

                // include meta data height when the selected file is
                // above the file which present at first position in collapsed view (i < this.topIndex)
                for (var i = 0; i < this.topIndex; i++) {
                    fileItemHeight = fileItemHeight + this.totalElements[i].offsetHeight;
                }

                // skip scroll top calculation for first Item
                let _scrollTop = this.topIndex === 0 ? 0 : fileItemHeight;
                this.refs.fileList.scrollTop = _scrollTop > 0 ? _scrollTop : 0;
            } else {
                // call the action for updating the on page comment's line position
                eCourseworkResponseActionCreator.mediaPanelTransitionEnd();
            }
        }
    };

    /**
     * setting / resetting index based on selected file
     */
    private setSelectedFileIndex(doSetIndex: boolean = false) {
        let pageId = eCourseWorkFileStore.instance.
            getSelectedECourseWorkFiles() ? eCourseWorkFileStore.instance.
                getSelectedECourseWorkFiles().last().docPageID : 0;

        let index: number = 0;
        let that = this;
        this._eCourseWorkFileList.map(function (_eCourseWorkFile: courseWorkFile) {
            if (pageId === _eCourseWorkFile.docPageID) {
                that.selectedFileIndex = index;
            }
            index++;
        });

        // setting index based on selected file index
        if (this.selectedFileIndex > 0 && this.maxNoOfIcons > 0) {
            let _topIndex = 0;
            let doLoop: boolean = true;
            while (doLoop) {
                _topIndex = _topIndex + this.maxNoOfIcons;
                if (_topIndex > this.selectedFileIndex) {
                    this.topIndex = _topIndex - this.maxNoOfIcons;
                    let _bottomIndex = this.topIndex + this.maxNoOfIcons - 1;
                    this.bottomIndex = _bottomIndex > this.totalNoOfItems - 1 ? this.totalNoOfItems - 1 : _bottomIndex;
                    break;
                }
            }
            if (doSetIndex) {
                let metaDataFileHeight: number = 0;
                if (this.totalElements[this.selectedFileIndex]) {
                    metaDataFileHeight = this.totalElements[this.selectedFileIndex].offsetHeight - constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT;
                }

                // skip scroll top calculation for first Item
                let _scrollTop = this.topIndex === 0 ? 0 :
                    (this.topIndex * constants.DEFAULT_MEDIA_FILE_ICON_HEIGHT) + metaDataFileHeight;
                this.refs.fileList.scrollTop = _scrollTop > 0 ? _scrollTop : 0;
            }
        }
    }

    /**
     * To download the file item
     * it is used to download files with formats which cannot be displayed in A3
     * if the first file upon opening a response is unsupported, then the download will only take place on selecting the metadata.
     */
    private doAutoDownloadFileItem(multipleDownload: boolean) {
        let isOnline: boolean = true;
        let selectedCourseWorkFile = eCourseWorkHelper.getCurrentEcourseworkFile();
        let canDownload = multipleDownload ? multipleDownload
            : eCourseWorkFileStore.instance.doAutoPlay();
        if (!selectedCourseWorkFile.linkData.canDisplayInApplication && canDownload) {
            // handling offline scenario
            if (!applicationActionCreator.checkActionInterrupted()) {
                return;
            }

            if (!markerOperationModeFactory.operationMode.isTeamManagementMode &&
                !worklistStore.instance.isMarkingCheckAvailable) {
                // Invoke action creator to set selected ecoursework file read status and in progress status as true.
                eCourseWorkHelper.updatefileReadStatusProgress(this.props.responseId);
            }

            let url: string = config.general.SERVICE_BASE_URL + URLS.GET_ECOURSE_WORK_BASE_URL +
                selectedCourseWorkFile.linkData.url;
            /* Delaying the download window to complete the file item and metadata div animation.
            Otherwise the client height of meta data div became zero and causing issues od show more button visibility */
            if (htmlUtilities.isIPadDevice) {
                if (eCourseWorkHelper.openFileInNewWindow(url)) {
                    ecourseworkResponseActionCreator.fileDownloadedOustide();
                }
            } else {
                setTimeout(() => {
                    // We can't download file if application is offline
                    if (eCourseWorkHelper.openFileInNewWindow(url)) {
                        ecourseworkResponseActionCreator.fileDownloadedOustide();
                    }
                }, constants.GENERIC_IMMEDIATE_AFTER_ANIMATION_TIMEOUT);
            }
        }
    }

    /**
     * to force rerender
     */
    private doRender() {
        this.setState({
            renderedOn: Date.now(),
            fileListScrollHeight: this.getFileListScrollHeight()
        });
    }

    /**
     * to force rerender
     */
    private fileListPanelViewUpdated() {
        this.doRender();
    }

    /**
     * returns true if the panel having only one file.
     */
    private get isOnlyOneFileInPanel() {
        return this.bottomIndex === 0 && this.topIndex === 0;
    }
}

export = FilelistPanel;
import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import EnhancedOffPageComments = require('./enhancedOffpagecomments');
import enums = require('../../../utility/enums');
import Immutable = require('immutable');
import enhancedOffPageCommentHelper = require('../../../utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import tableHeader = require('../../../utility/enhancedoffpagecomment/typings/tableheader');
import EnhancedOffPageCommentDetailView = require('./enhancedoffpagecommentdetailview');
import markingStore = require('../../../../stores/marking/markingstore');
import enhancedOffPageCommentActionCreator = require('../../../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
import enhancedOffPageCommentStore = require('../../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import responseStore = require('../../../../stores/response/responsestore');
import comparerList = require('../../../../utility/sorting/sortbase/comparerlist');
import PanelResizer = require('../../../utility/panelresizer/panelresizer');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../../stores/qigselector/qigstore');
import annotationHelper = require('../../../utility/annotation/annotationhelper');
import eCourseworkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import eCourseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import markingActionCreator = require('../../../../actions/marking/markingactioncreator');
import ecourseWorkResponseActionCreator = require('../../../../actions/ecoursework/ecourseworkresponseactioncreator');
import localeStore = require('../../../../stores/locale/localestore');
import ecourseWorkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import markerOperationModeFactory = require('../../../utility/markeroperationmode/markeroperationmodefactory');
import worklistStore = require('../../../../stores/worklist/workliststore');
import constants = require('../../../utility/constants');
let classNames = require('classnames');
import ccHelper = require('../../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import examinerStore = require('../../../../stores/markerinformation/examinerstore');
import standardisationSetupStore = require('../../../../stores/standardisationsetup/standardisationsetupstore');

interface Props extends PropsBase, LocaleSelectionBase {
    isVisible: boolean;
    enhancedOffPageCommentDetails: EnhancedOffPageCommentDetailViewDetails;
    onEnhanceOffPageCommentButtonClicked: Function;
    updateEnhancedOffPageCommentDetails: Function;
    renderedOn: number;
    hasMultipleToolbarColumn: boolean;
    renderedOnDataUpdate: number;
    isStampPanelVisible: boolean;
}

interface State {
    renderedOn?: number;
    height?: string;
    refreshMarkschemePanelResizer?: number;
}

class EnhancedOffPageCommentsContainer extends pureRenderComponent<Props, State> {

    private enhancedOffPageComments: Immutable.List<EnhancedOffPageCommentViewDataItem>;
    private tableHeaders: Immutable.List<tableHeader>;
    private comparerName: string;
    private sortDirection: enums.SortDirection;
    private isDetailViewEnabled: boolean = false;
    private commentText: string = '';
    private isEnhancedOffPageCommentEdited: boolean = false;
    private resizedPanelHeight: string;
    private resizePanelClassName: string;
    private isPanelOverlapped: boolean = false;
    private enhancedOffpageComment: HTMLElement;
    private selectedCommentMarkSchemeId: number;
    private selectedFileId: number;
    private selectedEnhancedOffPageClientToken: string;
    private isAddButtonClicked: boolean;
    private itemHeaderElement: HTMLTableHeaderCellElement;
    private fileHeaderElement: HTMLTableHeaderCellElement;
    private itemHeaderElementStyle: React.CSSProperties = {};
    private fileHeaderElementStyle: React.CSSProperties = {};
    private isTableHeaderWrapped: boolean = false;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.isEnhancedOffPageCommentEdited = enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited ?
            enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited : false;
        this.enhancedOffPageComments = Immutable.List<EnhancedOffPageCommentViewDataItem>();
        this.onCommentClickHandler = this.onCommentClickHandler.bind(this);
        this.onButtonClickHandler = this.onButtonClickHandler.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onAddCommentLinkClicked = this.onAddCommentLinkClicked.bind(this);
        this.renderAddCommentLink = this.renderAddCommentLink.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.selectedCommentMarkSchemeId = 0;
        this.selectedFileId = 0;

        // Set the default states
        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        // load Enhanced off-page comment data.
        this.loadEnhancedOffPageCommentData();
        return (
            <div className={this.getContainerClassName()}
                id='enhanced-off-page-comments-container'
                style={this.setPanelStyle()}>
                <div className='comment-flip-holder'>
                    {this.renderAddCommentLink()}
                    {this.renderEnhancedOffPageComment()}
                </div>
                <PanelResizer id='panel-resizer' key='panel-resizer'
                    resizerType={enums.ResizePanelType.EnhancedOffPageComment}>
                </PanelResizer>
            </div>
        );
    }

    /**
     * Render EnhancedOffPageComment Containers.
     * @private
     * @returns
     * @memberof EnhancedOffPageCommentsContainer
     */
    private renderEnhancedOffPageComment() {

        let view: enums.EnhancedOffPageCommentView =
            this.isDetailViewEnabled ? enums.EnhancedOffPageCommentView.detail : enums.EnhancedOffPageCommentView.grid;
        let currentEnhancedOffpageCommentIndex: number = enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        switch (view) {
            case enums.EnhancedOffPageCommentView.detail:
                return (<EnhancedOffPageCommentDetailView id={'offpage-comments-detail-view'}
                    key={'offpage-comments-detail-key'}
                    selectedLanguage={this.props.selectedLanguage}
                    onButtonClick={this.onButtonClickHandler}
                    responseMode={responseStore.instance.selectedResponseMode}
                    commentText={this.commentText}
                    enhancedOffPageCommentClientToken={this.selectedEnhancedOffPageClientToken}
                    textAreaChanged={this.onTextChanged}
                    selectedCommentQuestionId={this.selectedCommentMarkSchemeId === null ? 0 : this.selectedCommentMarkSchemeId}
                    selectedFileId={this.selectedFileId === null ? 0 : this.selectedFileId}
                    onQuestionItemOrFileChanged={this.onQuestionOrFileItemChanged}
                    isAddButtonClicked={this.isAddButtonClicked}
                    selectedCommentIndex={currentEnhancedOffpageCommentIndex}
                    isTeamManagementMode={markerOperationModeFactory.operationMode.isTeamManagementMode}
                    heightInPercentage={this.updateDetailViewPanelNewHeight}
                    containerElement={this.enhancedOffpageComment} />);
            case enums.EnhancedOffPageCommentView.grid:
                return (<EnhancedOffPageComments id={'offpage-comments-table'}
                    key={'offpage-comments-table-key'}
                    selectedLanguage={this.props.selectedLanguage}
                    enhancedOffPageComments={this.enhancedOffPageComments}
                    tableHeaders={this.tableHeaders}
                    onCommentClick={this.onCommentClickHandler}
                    onSortClick={this.onSortClick}
                    isAddCommentLinkVisible={this.isAddCommentLinkVisible()}
                    headerRefCallBack={this.headerReferenceCallback}
                    style={this.getCommentBackgroundColor()}
                    selectedCommentIndex={currentEnhancedOffpageCommentIndex} />);
        }
    }

    /**
     * Render the add comment link
     */
    private renderAddCommentLink() {
        let fileDummyElement = (this.fileHeaderElementStyle.minWidth) > 0 ? (< span className='dummy-head-text'
            style={this.fileHeaderElementStyle}>
            {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.file-column-header')} </span>) : null;

        let addCommentLink = this.isAddCommentLinkVisible() ? (
            <a className='add-comment-link'
                title={localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.add-comment')}
                id='addEnhancedOffPageCommentLink'
                onClick={this.onAddCommentLinkClicked}>
                {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.add-comment')}</a>) : null;

        let currentRemarkName = !this.isAddCommentLinkVisible() ? (<span className='current-remark-selected'>
            {enhancedOffPageCommentStore.instance.commentHeaderText} </span>) : null;

        return (this.isDetailViewEnabled ? null :
            (<div className='comment-link-holder' id='comment-link-holder'>
                <div className='comment-dummy-header small-text'>
                    <span className='dummy-head-text'
                        style={{ ...this.itemHeaderElementStyle }} >
                        {localeStore.instance.TranslateText('marking.response.enhanced-off-page-comments-panel.item-column-header')} </span>
                    {fileDummyElement}
                    <span className='dummy-head-text comment-txt'>
                        {localeStore.instance.TranslateText
                            ('marking.response.enhanced-off-page-comments-panel.comment-column-header')} </span>
                </div>
                <div className='link-holder'>
                    {addCommentLink}
                    {currentRemarkName}
                </div>
            </div>));

    }

    /**
     * on Comment Click Handler.
     */
    private onCommentClickHandler(enhancedOffPageComment: EnhancedOffPageCommentViewDataItem) {
        this.isDetailViewEnabled = true;
        this.isAddButtonClicked = false;
        this.commentText = enhancedOffPageComment.comment;
        this.selectedEnhancedOffPageClientToken = enhancedOffPageComment.clientToken;
        this.selectedCommentMarkSchemeId = enhancedOffPageComment.itemId;
        this.selectedFileId = enhancedOffPageComment.fileId;
        this.linkCommentFiletoLHSPanel();
        this.updateEnhancedOffPageCommentDetails();
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Link the LHS file to file item of selected Enhanced Off Page Comment
     * @private
     * @returns
     * @memberof EnhancedOffPageCommentsContainer
     */
    private linkCommentFiletoLHSPanel() {
        if (this.selectedFileId > 0) {
            //The File of the selected Enhanced Off Page Comment
            let eCourseWorkSelectedCommentFile: eCourseWorkFile = enhancedOffPageCommentHelper.getECourseWorkFile(this.selectedFileId);
            //The selected Files from the LHS File Panel
            let eCourseworkLHSPanelFiles = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
            if (eCourseworkLHSPanelFiles) {
                let files = eCourseworkLHSPanelFiles.filter(
                    (item: eCourseWorkFile) => item.docPageID === eCourseWorkSelectedCommentFile.docPageID);
                if (files && files.size === 0) {
                    eCourseworkResponseActionCreator.eCourseworkFileSelect(eCourseWorkSelectedCommentFile, true);
                }
            }
        }
    }

    /**
     * on button click handler.
     * To handle all the button clicks in Enhanced off page comment detail view
     * @param buttonAction To know which button has been clicked
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private onButtonClickHandler(buttonAction: enums.EnhancedOffPageCommentAction, clientToken?: string) {
        if (buttonAction === enums.EnhancedOffPageCommentAction.Close &&
            enhancedOffPageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
            this.closeEnhancedOffPageCommentEditView();
        } else {
            // The method has to be made common once the implementation of save and edit is implemented
            this.props.onEnhanceOffPageCommentButtonClicked(buttonAction, clientToken);
        }
    }
    /**
     * componentDidMount
     * @memberof EnhancedOffPageCommentsContainer
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT,
            this.onCommentUpdateCompleted);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT,
            this.onResponseChanged);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT,
            this.onPanelResize);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.setPanelResizeClassName);
        enhancedOffPageCommentStore.instance.addListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.reRender);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.addListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT, this.handleEnhancedOffPageCommentButtonAction);
        this.enhancedOffpageComment = document.getElementById('enhanced-off-page-comments-container');
        if (this.enhancedOffpageComment) {
            this.enhancedOffpageComment.addEventListener('transitionend', this.onAnimationEnd);
        }
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.renderEnhancedOffPageCommentInQigChanges);
        let enhancedOffPageCommentHeightInUserOption: string = userOptionsHelper.getUserOptionByName(
            userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT);
        // appending toolbar-space class
        if (this.resizedPanelHeight === undefined && enhancedOffPageCommentHeightInUserOption) {
            this.doAppendToolBarSpace();
        }

    }

    /**
     * ComponentDidUpdate.
     */
    public componentDidUpdate() {
        // Update the item header style minWidth and file header minWidth when the component is updated for the first time
        if (this.itemHeaderElement && (this.itemHeaderElementStyle.minWidth !== this.itemHeaderElement.clientWidth)) {
            this.itemHeaderElementStyle = { minWidth : this.itemHeaderElement.clientWidth };
            this.setState({ renderedOn: Date.now() });
        } else if (this.fileHeaderElement && (this.fileHeaderElementStyle.minWidth !== this.fileHeaderElement.clientWidth)) {
            this.fileHeaderElementStyle = { minWidth : this.fileHeaderElement.clientWidth };
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * ComponentWillRecieveProps
     *
     * @param {Props} nextProps
     * @memberof EnhancedOffPageCommentsContainer
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.hasMultipleToolbarColumn !== nextProps.hasMultipleToolbarColumn) {
            this.doAppendToolBarSpace();
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * ComponentWillUnMount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT, this.reRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT,
            this.onCommentUpdateCompleted);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ON_RESPONSE_CHANGED_EVENT, this.onResponseChanged);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT,
            this.onPanelResize);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.
            EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, this.setPanelResizeClassName);
        enhancedOffPageCommentStore.instance.removeListener(
            enhancedOffPageCommentStore.EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
            this.handleEnhancedOffPageCommentsVisibility);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.ECOURSE_WORK_FILE_SELECTION_CHANGED_EVENT,
            this.reRender);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE, this.handleEnhancedOffPageCommentsVisibility);
        enhancedOffPageCommentStore.instance.removeListener(enhancedOffPageCommentStore.EnhancedOffPageCommentStore.
            ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT, this.handleEnhancedOffPageCommentButtonAction);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.renderEnhancedOffPageCommentInQigChanges);
        if (this.enhancedOffpageComment) {
            this.enhancedOffpageComment.removeEventListener('transitionend', this.onAnimationEnd);
        }
    }

    /**
     * Update local variables
     * @param nxtProps
     */
    public componentWillMount() {
        if (this.props.enhancedOffPageCommentDetails) {
            this.commentText = this.props.enhancedOffPageCommentDetails.comment;
            this.isDetailViewEnabled = this.props.enhancedOffPageCommentDetails.isDetailViewEnabled;
            this.selectedCommentMarkSchemeId = this.props.enhancedOffPageCommentDetails.itemId;
            this.selectedFileId = this.props.enhancedOffPageCommentDetails.fileId;
            this.selectedEnhancedOffPageClientToken = this.props.enhancedOffPageCommentDetails.clientToken;
            this.isAddButtonClicked = this.props.enhancedOffPageCommentDetails.isAddButtonClicked;
        }
    }

    /**
     * load Enhanced offPage comment data
     *
     * @param {string} comparerName
     * @param {enums.SortDirection} sortDirection
     * @memberof EnhancedOffPageCommentsContainer
     */
    public loadEnhancedOffPageCommentData() {
        if (!this.comparerName) {
            let sortDetails: EnhancedOffPageCommentSortDetails =
                enhancedOffPageCommentStore.instance.markGroupSortDetails(responseStore.instance.selectedMarkGroupId);
            this.comparerName = comparerList[sortDetails.comparerName];
            this.sortDirection = sortDetails.sortDirection;
        }

        // This is to set marking index to set current comments and previous marking comments.
        let index = enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        this.enhancedOffPageComments =
            enhancedOffPageCommentHelper.getEnhancedOffPageComments(this.comparerName, this.sortDirection, index);
        this.tableHeaders = enhancedOffPageCommentHelper.generateTableHeader();
    }

    /**
     * Call back function from enhanced off-page comment table on sorting
     */
    private onSortClick = (comparerName: string, sortDirection: enums.SortDirection) => {
        this.sortDirection = sortDirection;
        this.comparerName = comparerName;
        // update sort details in store
        enhancedOffPageCommentActionCreator.onSortClick({
            markGroupId: responseStore.instance.selectedMarkGroupId,
            comparerName: comparerList[this.comparerName], sortDirection: this.sortDirection
        });
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Method to reRender
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private reRender = () => {
        this.setState({ renderedOn: Date.now() });
    }


    /**
     * on Message Deleted
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private onCommentUpdateCompleted = (): void => {
        this.isAddButtonClicked = false;
        this.isEnhancedOffPageCommentEdited = false;
        enhancedOffPageCommentHelper.handleCommentEdit(this.isEnhancedOffPageCommentEdited);
        this.isDetailViewEnabled = false;
        this.updateEnhancedOffPageCommentDetails();
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * on Response changed.
     */
    private onResponseChanged = () => {
        this.closeEnhancedOffPageCommentEditView();
        this.comparerName = undefined;
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Returns Classname for Enhanced offpage comment container.
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private getContainerClassName = (): string => {
        let enhancedOffPageCommentContainerClass: string = 'enhanced offpage-comment-container ';
        if (this.isDetailViewEnabled) {
            enhancedOffPageCommentContainerClass += 'detail-view ';
        }
        if (!this.props.isVisible) {
            enhancedOffPageCommentContainerClass += 'hide ';
        }
        if (this.isPanelOverlapped && this.props.isStampPanelVisible) {
            enhancedOffPageCommentContainerClass += 'tool-panel-space ';
        }
        if (this.resizePanelClassName) {
            enhancedOffPageCommentContainerClass += this.resizePanelClassName;
        }

        return enhancedOffPageCommentContainerClass;
    }

    /**
     * Set style for panel.
     *
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private setPanelStyle = () => {
        let containerHeightInUserOption: string = userOptionsHelper.getUserOptionByName(
            userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT);
        let stylePanel: React.CSSProperties = {};
        if (this.resizedPanelHeight || containerHeightInUserOption) {
            stylePanel = {
                height: this.resizedPanelHeight ? this.resizedPanelHeight + '%' :
                    (containerHeightInUserOption) ? containerHeightInUserOption + '%' : ''
            };
        }
        return stylePanel;
    }

    /**
     * on Panel resize.
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private onPanelResize = (height: string, className: string, elementOverlapped: boolean, panActionType: enums.PanActionType): void => {
        if (height && panActionType === enums.PanActionType.Move) {
            this.resizedPanelHeight = height;
            this.resizePanelClassName = className;
            this.isPanelOverlapped = this.props.hasMultipleToolbarColumn ? elementOverlapped : false;
            this.setState({ height: height });
        }
    };

    /**
     * Determines to append toolbar space class name.
     */
    private doAppendToolBarSpace = () => {
        let annotationPanelHolderElement = document.getElementsByClassName('annotation-panel-holder')[0];
        if (annotationPanelHolderElement && this.enhancedOffpageComment) {
            let annotationPanelHolder: number = annotationPanelHolderElement.getBoundingClientRect().top;
            let enhancedOffPageContainerBottom: number = this.enhancedOffpageComment.getBoundingClientRect().bottom;
            this.isPanelOverlapped = enhancedOffPageContainerBottom > annotationPanelHolder;
        }
    }

    /**
     * on Text changed.
     */
    private onTextChanged(content: string) {
        this.isEnhancedOffPageCommentEdited = true;
        enhancedOffPageCommentHelper.handleCommentEdit(this.isEnhancedOffPageCommentEdited);
        this.commentText = content;
        this.updateEnhancedOffPageCommentDetails();
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Changes the comment view when the visibility is changed
     * @param isVisible
     */
    private handleEnhancedOffPageCommentsVisibility = () => {
        if (this.isDetailViewEnabled) {
            this.isDetailViewEnabled = false;
            this.updateEnhancedOffPageCommentDetails();
        }
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * Updates the enhanced off page comment details
     * @param isVisible
     */
    private updateEnhancedOffPageCommentDetails = () => {
        let enhancedOffPageCommentDetailView: EnhancedOffPageCommentDetailViewDetails = {
            clientToken: this.selectedEnhancedOffPageClientToken,
            comment: this.commentText,
            fileId: this.selectedFileId,
            itemId: this.selectedCommentMarkSchemeId,
            isCommentEdited: this.isEnhancedOffPageCommentEdited,
            isDetailViewEnabled: this.isDetailViewEnabled,
            isAddButtonClicked: this.isAddButtonClicked
        };
        this.props.updateEnhancedOffPageCommentDetails(enhancedOffPageCommentDetailView);
    }

    /**
     * Updates the enhanced off page comment details when question item or file item is changed
     */
    private onQuestionOrFileItemChanged = (selectedId: number, dropDowntype: enums.DropDownType) => {
        if (dropDowntype === enums.DropDownType.EnhancedOffPageCommentQuestionItem) {
            this.selectedCommentMarkSchemeId = selectedId;
        }
        if (dropDowntype === enums.DropDownType.EnhancedOffPageCommentFile) {
            this.selectedFileId = selectedId;
        }

        this.updateEnhancedOffPageCommentDetails();
    }

    /**
     * Set panel resize classname
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private setPanelResizeClassName = (height: string, className: string, elementOverlapped: boolean,
        panActionType: enums.PanActionType): void => {
        this.resizePanelClassName = className ? className : '';
        if (this.resizePanelClassName === '' && panActionType === enums.PanActionType.End) {
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * on animation end
     * @private
     * @memberof EnhancedOffPageCommentsContainer
     */
    private onAnimationEnd = () => {
        markingActionCreator.reRenderImageOnVisiblityChange();
        this.doAppendToolBarSpace();
        this.setState({ renderedOn: Date.now() });
    }

    /**
     * On Add Comment Link clicked
     */
    private onAddCommentLinkClicked = (event: any): void => {

        // pause the media player on clicking the add comment button
        let selectedEcourseWorkFiles: Immutable.List<eCourseWorkFile> = eCourseWorkFileStore.instance.getSelectedECourseWorkFiles();
        if (selectedEcourseWorkFiles) {
            if (userOptionsHelper.getUserOptionByName(userOptionKeys.PAUSE_MEDIA_WHEN_OFFPAGE_COMMENTS_ARE_ADDED) === 'true') {
                selectedEcourseWorkFiles.forEach((file: eCourseWorkFile) => {
                    if ((file.linkData.mediaType === enums.MediaType.Audio)
                        || (file.linkData.mediaType === enums.MediaType.Video)) {
                         ecourseWorkResponseActionCreator.pauseMediaPlayer();
                    }
                });
            }
        }
        this.isAddButtonClicked = true;
        this.isDetailViewEnabled = true;
        this.commentText = '';
        this.selectedEnhancedOffPageClientToken = '';
        this.selectedCommentMarkSchemeId = markingStore.instance.currentMarkSchemeId ? markingStore.instance.currentMarkSchemeId : 0;
        this.selectedFileId = selectedEcourseWorkFiles ? selectedEcourseWorkFiles.first().docPageID : 0;
        htmlUtilities.setFocusToElement('enhancedOffpageCommentEditor');
        this.updateEnhancedOffPageCommentDetails();
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * Returns whether add comment link is visible or not
     */
    private isAddCommentLinkVisible(): boolean {
        let updatePendingResponsesWhenSuspendedCCOn: boolean = ccHelper.getCharacteristicValue
            (ccNames.UpdatePendingResponsesWhenSuspended,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId).toLowerCase() === 'true';
        let isReadOnlyModeInClassifiedResponse: boolean =
            (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse
                && (!standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives ||
                    qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete));

        if (responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
            !this.isDetailViewEnabled &&
			enhancedOffPageCommentStore.instance.currentEnhancedOffpageCommentIndex === 0 &&
			!standardisationSetupStore.instance.isSelectResponsesWorklist &&
            (markerOperationModeFactory.operationMode.isMarkingMode ||
            ((standardisationSetupStore.instance.isUnClassifiedWorklist ||
              standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse) &&
                markerOperationModeFactory.operationMode.isResponseEditable) ||
                standardisationSetupStore.instance.isProvisionalWorklist) &&
            !worklistStore.instance.isMarkingCheckMode && !isReadOnlyModeInClassifiedResponse) {
            /* when marker is in suspended status, then the marker should not add/Update offpage comment ,
             * if updatePendingResponsesWhenSuspendedCCOn then  marker can add/ update the offpage comment*/
            if (examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended
                && responseStore.instance.selectedResponseMode === enums.ResponseMode.pending) {
                return updatePendingResponsesWhenSuspendedCCOn;
            }
            return true;
        }
    }

    /**
     * Reference call back function to get the element reference from the table header element
     */
    private headerReferenceCallback = (element: HTMLTableHeaderCellElement, headerText: string) => {
        if (element) {
            if (headerText === localeStore.instance.TranslateText
                ('marking.response.enhanced-off-page-comments-panel.item-column-header')) {
                this.itemHeaderElement = element;
            } else if (headerText === localeStore.instance.TranslateText
                ('marking.response.enhanced-off-page-comments-panel.file-column-header')) {
                this.fileHeaderElement = element;
            }
        }
    }

    /**
     * Returns background color for container header.
     */
    private getCommentBackgroundColor = (): string => {
        let backgroundColor: React.CSSProperties = enhancedOffPageCommentStore.instance.enhancedoffpageCommentHeaderColor;
        return backgroundColor ? backgroundColor.color : null;
    }

    /**
     * Render enhanced offpage container only on qig change.
     */
    private renderEnhancedOffPageCommentInQigChanges = (selectedMgid: number, prevMgid: number,
		isResponseViewModeChange: boolean = false) => {
		if (responseStore.instance.isWholeResponse === true && !isResponseViewModeChange) {
			this.closeEnhancedOffPageCommentEditView();
		}
    }
    /**
     * Reset and close enhanced offpage comment edit view.
     */
    private closeEnhancedOffPageCommentEditView = () => {
        this.isAddButtonClicked = false;
        this.isDetailViewEnabled = false;
        this.commentText = '';
        this.selectedCommentMarkSchemeId = 0;
        this.selectedFileId = 0;
        this.selectedEnhancedOffPageClientToken = '';
        this.updateEnhancedOffPageCommentDetails();
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * This button will handle various enhanced offpage comments button actions
     * In normal use we are using an existing callback function.
     * @private
     * @param {enums.EnhancedOffPageCommentButtonAction} enhancedOffPageCommentButtonAction 
     * @memberof EnhancedOffPageCommentsContainer
     */
    private handleEnhancedOffPageCommentButtonAction = (enhancedOffPageCommentButtonAction: enums.EnhancedOffPageCommentAction) => {
        if (enhancedOffPageCommentButtonAction === enums.EnhancedOffPageCommentAction.Close) {
            // This method will be called on leave response click of response discard popup while navigating to Menu.
            // We are displaying menu as an overlay, if we close that then we've to display the enhanced offpage comments table view
            // instead of detail view
            this.closeEnhancedOffPageCommentEditView();
        }
    }

    /**
     * Update detail view new panel height.
     */
    private updateDetailViewPanelNewHeight = (height: string): void => {
        this.resizedPanelHeight = height;
        this.setState({ height: height });
    }
}

export = EnhancedOffPageCommentsContainer;
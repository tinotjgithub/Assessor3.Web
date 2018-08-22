/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
let classNames = require('classnames');
import localeStore = require('../../../stores/locale/localestore');
import enums = require('../../utility/enums');
import pureRenderComponent = require('../../base/purerendercomponent');
import Tag = require('./tag');
import immutable = require('immutable');
import tagActionCreator = require('../../../actions/tag/tagactioncreator');
import responseStore = require('../../../stores/response/responsestore');
import worklistStore = require('../../../stores/worklist/workliststore');
import domManager = require('../../../utility/generic/domhelper');
import loginSession = require('../../../app/loginsession');
const TAG_LIST_WIDTH = 90;
const TAG_LIST_HEIGHT = 216;

/**
 * Properties of Taglist component.
 */
interface Props extends PropsBase, LocaleSelectionBase {
    selectedTagId: number;
    tagList: immutable.List<Tag>;
    renderedOn: number;
    // In order to update worklist data while editing tag data
    // Through Worklist/Within Response.  
    markGroupId?: number;
    tagOrder?: number;
    isESResponse?: boolean;
    markingMode?: enums.MarkingMode;
}

/**
 * State of the component
 */
interface State {
    isExpanded: boolean;
}

/**
 * React component for reports
 */
class TagList extends pureRenderComponent<Props, State> {
    private selectedTag: number;
    private isBottomAlignmentRequired: boolean;
    private isRightAlignmentRequired: boolean;
    private isTopAlignmentRequired: boolean;
    private isLeftAlignmentRequired: boolean;
    private isCenterAlignmentRequired: boolean;
    private xPos: number = 0;
    private yPos: number = 0;

    /**
     * Constructor for TagList class
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Setting the initial state
        this.state = {
            isExpanded: undefined
        };

        this.onTagSelection = this.onTagSelection.bind(this);
        this.onArrowClick = this.onArrowClick.bind(this);
        this.hideTagList = this.hideTagList.bind(this);
        this.selectedTag = this.props.selectedTagId;
        this.onTagUpdated = this.onTagUpdated.bind(this);
    }

    /**
     * Render component.
     */
    public render(): JSX.Element {
        let tagClass: string;
        return (
            <span className={classNames('tag dropdown-wrap',
                { ' center right': this.isCenterAlignmentRequired === true && this.isRightAlignmentRequired === true },
                { ' center left': this.isCenterAlignmentRequired === true && this.isLeftAlignmentRequired === true },
                { ' bottom right': this.isRightAlignmentRequired === true && this.isBottomAlignmentRequired === true },
                {
                    ' bottom left': this.isRightAlignmentRequired === false &&
                        this.isBottomAlignmentRequired === true && this.isLeftAlignmentRequired === true
                },
                {
                    ' top left': this.isRightAlignmentRequired === false
                        && this.isLeftAlignmentRequired === true && this.isTopAlignmentRequired === true
                },
                { ' top right': this.isRightAlignmentRequired === true && this.isTopAlignmentRequired === true },
                { ' close': (this.state.isExpanded === false) },
                { ' open': (this.state.isExpanded === true) })}
                id={'response_tag'} >
                <Tag isSelected={true}
                    tagType={this.selectedTag}
                    onSelection={this.onTagSelection}
                    onArrowClick={this.onArrowClick}
                    isInList={false}
                    isFromWorklist={(this.props.markGroupId ? true : false)}
                    selectedLanguage={this.props.selectedLanguage}
                    id={this.props.id + '_selected'}
                    key={this.props.id + '_selected'} />
                <div className='menu-callout'></div>
                <ul className='menu tag-menu' role='menu' aria-hidden='true' id='tag_list'>
                    {this.renderTagListItems()}
                </ul>
            </span>);
    }

    /**
     * Render the list
     */
    private renderTagListItems = (): any => {
        let that = this;
        let tagList = that.props.tagList;
        let element = tagList && tagList.map(function (tagItem: Tag) {
            return (
                <li className='tag-menu-item'
                    id={that.props.id + '_item_' + tagItem.tagId}
                    key={that.props.id + '_item_' + tagItem.tagId}>
                    <Tag isSelected={(that.selectedTag === tagItem.tagId)}
                        tagType={tagItem.tagId}
                        onSelection={that.onTagSelection}
                        onArrowClick={that.onArrowClick}
                        isInList={true}
                        isFromWorklist={(that.props.markGroupId ? true : false)}
                        selectedLanguage={that.props.selectedLanguage}
                        id={that.props.id + '_' + tagItem.tagId}
                        key={that.props.id + '_' + tagItem.tagId} />
                </li>);
        });
        return element;
    };

    /**
     * triggers when the tag list component mount.
     */
    public componentDidMount() {
        /** Avoid memory leak warning */
        worklistStore.instance.setMaxListeners(0);
        window.addEventListener('touchend', this.hideTagList);
        window.addEventListener('click', this.hideTagList);
        worklistStore.instance.addListener(worklistStore.WorkListStore.TAG_UPDATED_EVENT, this.onTagUpdated);

        // Event to collapse all tag list except the selected one from worklist 
        worklistStore.instance.addListener(worklistStore.WorkListStore.TAG_LIST_CLICKED, this.onTagListClicked);
    }

    /**
     * triggers while the component receives the props.
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.selectedTag !== nextProps.selectedTagId) {
            this.selectedTag = nextProps.selectedTagId;
        }
    }

    /**
     * triggers when the tag list components unmounts
     */
    public componentWillUnmount() {
        window.removeEventListener('touchend', this.hideTagList);
        window.removeEventListener('click', this.hideTagList);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TAG_UPDATED_EVENT, this.onTagUpdated);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.TAG_LIST_CLICKED, this.onTagListClicked);
    }

    /**
     * to hide the tag drop down clicking outside the box.
     */
    private hideTagList = (event: any): void => {
        if (event.target !== undefined &&
            domManager.searchParentNode(event.target, function (el: any) { return el.id === 'response_tag'; }) == null) {
            if (this.state.isExpanded === true) {
                this.setState({
                    isExpanded: false
                });
            }
        }
    };

    /**
     * To change the state of the component on selecting the component.
     */
    private onTagSelection = (selectedTag: number, event: any): void => {
        event.stopPropagation();
        // Case 1: this.props.markGroupId : Tag Updated from worklist.
        // Case 2: responseStore.instance.selectedMarkGroupId : Tag Updated  within response.
        let currentMarkGroupId = this.props.markGroupId ? this.props.markGroupId : responseStore.instance.selectedMarkGroupId;
        let updateResponseTagArguments: UpdateResponseTagArguments = {
            markGroupList: this.populateMarkGroupList(currentMarkGroupId, this.props.isESResponse),
            examinerId: loginSession.EXAMINER_ID,
            isDelete: selectedTag === 0 ? true : false,
            tagId: selectedTag,
            isESResponse: this.props.isESResponse
        };

        // get the updated tag order to update the worklist data with the newly selected tag.
        let tagOrder: number = this.props.tagList.filter(t => t.tagId === selectedTag)[0].tagOrder;
        tagActionCreator.updateTags(updateResponseTagArguments, tagOrder, currentMarkGroupId, this.props.markingMode);
    };

    /**
     * event listener for the tag update event
     */
    private onTagUpdated = (selectedTag: number, markGroupId: number): void => {
        // Case 1: !this.props.markGroupId : Tag Updated within response.
        // Case 2: this.props.markGroupId === markGroupId : Tag Updated from worklist.
        if (!this.props.markGroupId || this.props.markGroupId === markGroupId) {
            this.selectedTag = selectedTag;
            this.setState({
                isExpanded: false
            });
        }
    };

    /**
     * event listener for the tag list click event
     * To hide any open tag list other than selected one.
     */
    private onTagListClicked = (selectedMarkGroupId: number): void => {
        // Hide all tag list other than one selected now.
        if (this.props.markGroupId !== selectedMarkGroupId && this.state.isExpanded === true) {
            this.setState({
                isExpanded: false
            });
        }
    }

    /**
     * On arrow click.
     */
    private onArrowClick(selectedTag: number, event: any) {
        // Tag List Position Logic is applicable only in worklist.
        if (this.props.markGroupId) {
            this.getTaglistPosition(event.clientX, event.clientY);
            tagActionCreator.tagListClickAction(this.props.markGroupId);
        }
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    /**
     * Check if tag list goes offscreen on right hand side of the window.
     * If taglist widhth  is greater than the space available right to tag indicator then
     * it means that when tag list is rendered it will go offscreen.
     */
    private isHorizontalAlignmentRequired(mouseX: number, worklistWidth: number): void {
        // if space available right of tag indicator,
        if (TAG_LIST_WIDTH < (window.innerWidth - mouseX)) {
            this.isRightAlignmentRequired = true;
        } else {
            if (TAG_LIST_WIDTH < (mouseX - (window.innerWidth - worklistWidth))) {
                this.isLeftAlignmentRequired = true;
            }
        }
    }

    /**
     * Check if tag list goes offscreen on bottom side of the window.
     * If mouse Y position + tag list height is greater than
     * space available bottom from tag indicator then
     * it means that when tag list is rendered it will go offscreen.
     */
    private isVerticalAlignmentRequired(mouseY: number, worklistHeight: number): void {
        // If space available in the bottom of tag indicator,
        if ((window.innerHeight - mouseY) > TAG_LIST_HEIGHT) {
            this.isTopAlignmentRequired = true;
        } else {
            if (mouseY - (window.innerHeight - worklistHeight) > TAG_LIST_HEIGHT) {
                this.isBottomAlignmentRequired = true;
            }
        }
    }

    /**
     * Get tag list expanded position based on window space available.
     * @param xPos: Tag Indicator Xcoord
     * @param yPos: Tag Indicator Y coord
     */
    private getTaglistPosition(xPos: number, yPos: number) {
        this.isCenterAlignmentRequired = false;
        this.isLeftAlignmentRequired = false;
        this.isRightAlignmentRequired = false;
        this.isTopAlignmentRequired = false;
        this.isBottomAlignmentRequired = false;

        // Tag indicator Coords.
        this.xPos = xPos;
        this.yPos = yPos;

        // Get the height and width of scroll holder.
        let worklistElement: ClientRect = document.getElementsByClassName('table-scroll-holder')[0].getBoundingClientRect();
        let worklistHeight: number = worklistElement.height;
        let worklistWidth: number = worklistElement.width;

        // Determine whether tag list show in Bottom/Top.
        this.isVerticalAlignmentRequired(this.yPos, worklistHeight);

        // Determine whether tag list show in Right/Left.
        this.isHorizontalAlignmentRequired(this.xPos, worklistWidth);

        // If no space available in bottom or Top portion,
        // we should display it in centre position.
        if (this.isBottomAlignmentRequired === false && this.isTopAlignmentRequired === false) {
            this.isCenterAlignmentRequired = true;
        }
    }

	/**
	 * Get the markGroupIds for tagging the resposnse.
	 * @param currentMarkGroupId
	 * @param isESResponse
	 */
    private populateMarkGroupList(currentMarkGroupId: number, isESResponse: boolean): number[] {
        let markGroupIds: number[] = [];

        // If the response is an es response then whole response tagging is not possible
        // So only pushing the current markGroupID into the collection
        // else we need to add the related markGroupIds for a whole response.
        if (isESResponse) {
            markGroupIds.push(currentMarkGroupId);
        } else {
            markGroupIds = worklistStore.instance.getRelatedMarkGroupIdsForWholeResponse(currentMarkGroupId);
            markGroupIds.unshift(currentMarkGroupId);
        }
        return markGroupIds;
    }
}
export = TagList;

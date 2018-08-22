import React = require('react');
let classNames = require('classnames');
import pureRenderComponent = require('../../../base/purerendercomponent');
import responseStore = require('../../../../stores/response/responsestore');
import pageLinkHelper = require('./pagelinkhelper');
import responseActionCreator = require('../../../../actions/response/responseactioncreator');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import localeStore = require('../../../../stores/locale/localestore');
import stampStore = require('../../../../stores/stamp/stampstore');
import treeViewDataHelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
import markingStore = require('../../../../stores/marking/markingstore');
import markingHelper = require('../../../../utility/markscheme/markinghelper');
import enums = require('../../../utility/enums');

/**
 * Props for view whole page button
 */
interface Props {
    id: string;
    imageZones: any;
    isStitched: boolean;
    isMouseOverEnabled: boolean;
}

/**
 * State of the component
 */
interface State {
    isEnabled: boolean;
}

/**
 * React component for reports
 */
class ViewWholePageButton extends pureRenderComponent<Props, State> {

    private treeViewHelper: treeViewDataHelper;

    /**
     * Constructor for TagList class
     */
    constructor(props: Props, state: State) {
        super(props, state);
        // Setting the initial state
        this.state = {
            isEnabled: false
        };
        this.linkWholePageClickHandler = this.linkWholePageClickHandler.bind(this);
        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
    }

    private _activeImageZone: ImageZone;

    private viewWholePageButtonTransition: any;

    /**
     * Render component.
     */
    public render(): JSX.Element {
        let viewWholeButtonClass: string = 'expand-zone' + (this.state.isEnabled === true ? ' expand-delay' : '');
        return (
            <a className={viewWholeButtonClass}
                onMouseLeave={this.viewWholePageButtonHide}
                onMouseOver={this.onMouseOverHandler}
                id={this.props.id} onClick={this.linkWholePageClickHandler} href='#'>
                {localeStore.instance.TranslateText('marking.response.script-images.view-whole-page') }</a>);
    }

    /**
     * triggers when the tag list component mount.
     */
    public componentDidMount() {
        // Event to collapse all tag list except the selected one from worklist
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS,
            this.updateVisibility);
        if (htmlUtilities.isTabletOrMobileDevice) {
            stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.viewWholePageButtonHide);
        }
    }

    /**
     * triggers when the tag list components unmounts
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS,
            this.updateVisibility);
        if (htmlUtilities.isTabletOrMobileDevice) {
            stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT, this.viewWholePageButtonHide);
        }
    }

    /**
     * updates the visibility of the view whole page link button.
     */
    private updateVisibility = (isVisible: boolean, activeImageZone: ImageZone): void => {
        this._activeImageZone = activeImageZone;
        if (htmlUtilities.isTabletOrMobileDevice) {
            this.viewWholePageButtonHide();
            let that = this;
            setTimeout(() => {
                this.setState({
                    isEnabled: (activeImageZone &&
                        that.props.imageZones &&
                        that.props.imageZones.pageNo === activeImageZone.pageNo &&
                        that.props.imageZones.uniqueId === activeImageZone.uniqueId) ? isVisible : false
                });
            }, 0);
        } else {
            this.setState({
                isEnabled: (activeImageZone &&
                    this.props.imageZones &&
                    this.props.imageZones.pageNo === activeImageZone.pageNo &&
                    this.props.imageZones.uniqueId === activeImageZone.uniqueId) ? isVisible : false
            });
        }
    }

    /**
     * Link whole page button, click handler.
     */
    private linkWholePageClickHandler = (): void => {
        if (this.state.isEnabled) {
            this.setState({
                isEnabled: false
            });
            let currentMarkSchemeId = 0;
            // if a item with multiple children having same image cluster, then we need 
            // to add link annotation against first item in that collection.
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                let tree = null;
                this.treeViewHelper = new treeViewDataHelper();
                let currentQuestionItem = markingStore.instance.currentQuestionItemInfo;
                if (currentQuestionItem && currentQuestionItem.imageClusterId > 0) {
                    tree = this.treeViewHelper.treeViewItem();
                    if (tree !== null) {
                        let multipleMarkSchemes = markingHelper.getMarkschemeParentNodeDetails(
                            tree, markingStore.instance.currentMarkSchemeId, true);
                        if (multipleMarkSchemes) {
                            // if multiple markscheme then return the first child
                            let itemToLink = pageLinkHelper.getItemToLink(markingStore.instance.currentQuestionItemInfo,
                                multipleMarkSchemes.treeViewItemList, multipleMarkSchemes.treeViewItemList.count() > 0);
                            currentMarkSchemeId = itemToLink.uniqueId;
                        }
                    }
                }
            } else {
                currentMarkSchemeId = markingStore.instance.currentMarkSchemeId;
            }
            pageLinkHelper.linkImageZone(this._activeImageZone, this.props.isStitched, currentMarkSchemeId);
        }
    }

    /**
     * updates the visibility of the view whole page button.
     */
    private viewWholePageButtonHide = () => {
        this.setState({
            isEnabled: false
        });
    };

    /**
     * updates the visibility of the view whole page button.
     */
    private onMouseOverHandler = () => {
        if (this.props.isMouseOverEnabled === true && this.props.imageZones.isViewWholePageLinkVisible) {
            this.setState({
                isEnabled: true
            });
        }
    };
}

export = ViewWholePageButton;
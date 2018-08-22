/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import contextMenuHelper = require('./contextmenuhelper');
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import MenuItem = require('./menuitem');
import menuItem = require('./typings/menuitem');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markingStore = require('../../../stores/marking/markingstore');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
let classNames = require('classnames');
import enums = require('../enums');
import annotation = require('../../../stores/response/typings/annotation');
import userOptionActionCreator = require('../../../actions/useroption/useroptionactioncreator');
import userOptionKeys = require('../../../utility/useroption/useroptionkeys');
import userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import annotationHelper = require('../annotation/annotationhelper');
import stampStore = require('../../../stores/stamp/stampstore');
import qigStore = require('../../../stores/qigselector/qigstore');
import markByAnnotationHelper = require('../marking/markbyannotationhelper');
import acetatesActionCreator = require('../../../actions/acetates/acetatesactioncreator');
import overlayHelper = require('../overlay/overlayhelper');
import contextMenuData = require('./contextmenudata');

/**
 * Context menu state
 */
interface State {
    renderedOn?: number;
    isVisible?: boolean;
}

/**
 * Properties of ContextMenu component
 */
interface Props extends LocaleSelectionBase, PropsBase {
}

/**
 * Context menu component
 */
class ContextMenu extends pureRenderComponent<Props, State> {
    private xPos: number;
    private yPos: number;
    private width: number;
    private height: number;
    private isColorPanelVisible: boolean = false;
    private markByAnnotationHelper: markByAnnotationHelper;
    private contextMenuItems: Array<menuItem> = [];
    private _isShared: boolean = false;
    private contextMenuData: any;

    /**
     * Constructor ContextMenu
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.reset();

        this.state = {
            renderedOn: 0,
            isVisible: true
        };

        this.onMouseOverHandler = this.onMouseOverHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onShareToggleButtonClick = this.onShareToggleButtonClick.bind(this);
        this.markByAnnotationHelper = new markByAnnotationHelper();

        // minimum one item should be rendered which is used for contextmenu position calculation
        this.contextMenuData = contextMenuHelper.getContextMenuData();
    }

    /**
     * Render method for Context Menu.
     */
    public render() {
        if (!this.state.isVisible) {
            return (<ul
                id={this.props.id}
                key={'key_' + this.props.id} className={classNames('context-menu annotation-context-menu')}>
            </ul>);
        }

        let contextMenuStyle: React.CSSProperties = { 'top': 0, 'left': 0 };
        let isAlignBottomTransform = false;
        let isAlignRightTransform = false;
        let isAlignBottomRightTransform = false;

            // Get Context Menu Items.
            this.contextMenuItems = contextMenuHelper.getContextMenuItems(this.contextMenuData);

            // Check if align bottom transform is needed
            isAlignBottomTransform = contextMenuHelper.isBottomAlignmentRequired(this.yPos, this.height *
                (this.contextMenuItems.length), window.innerHeight);

            isAlignRightTransform = contextMenuHelper.isRigtAlignmentRequired(this.xPos, this.width,
                this.contextMenuData.annotationOverlayWidth);

        // Check if align bottom right transform is needed
        isAlignBottomRightTransform = (isAlignRightTransform === true && isAlignBottomTransform === true);

        // Apply top and left style for the context menu
        contextMenuStyle = {
            'top': contextMenuHelper.getYcoordinate(this.yPos, isAlignBottomTransform),
            'left': contextMenuHelper.getYcoordinate(this.xPos, isAlignRightTransform)
        };

        // Apply share-on class only if the logged in examiner is a PE and the multi line is shared.
        let isShareOn: boolean = (this._isShared && qigStore.instance.getSelectedQIGForTheLoggedInUser &&
            qigStore.instance.getSelectedQIGForTheLoggedInUser.role === enums.ExaminerRole.principalExaminer);

        // Get the menu items
        let toRender = this.contextMenuItems.map((item: menuItem, index: number) => {
            return (<MenuItem
                id={this.props.id + '-' + item.name}
                key={'key_' + this.props.id + '-' + item.name}
                name={item.name}
                hasSubMenu={item.hasSubMenu}
                subMenuItems={item.subMenu}
                menuAction={item.menuAction}
                menuClick={this.onClickHandler}
                clientXCoordinate={this.xPos}
                clientYCoordinate={
                    isAlignBottomTransform ?
                        (this.yPos - ((this.contextMenuItems.length - index) * this.height)) :
                        (this.yPos + (index * this.height))
                }
                contextMainMenuWidth={this.width}
                contextMainMenuHeight={this.height}
                annotationOverlayWidth={window.innerWidth}
                onShareStateChange={this.onShareToggleButtonClick}
                isShared={this._isShared}
                isShareableItem={item.isSharedItem}
                contextMenuData={item.contextMenuData}
            />);
        });

        // Render the context menu
        return (<ul
            id={this.props.id}
            key={'key_' + this.props.id}
            style={contextMenuStyle} onClick={this.onContextMenuClick}
            className={classNames('context-menu annotation-context-menu',
                { 'show': this.state.isVisible === true },
                { 'align-bottom-right': isAlignBottomRightTransform === true },
                { 'align-right': isAlignBottomRightTransform === false && isAlignRightTransform === true },
                { 'align-bottom': isAlignBottomRightTransform === false && isAlignBottomTransform === true },
                { 'share-on': isShareOn })}
            onMouseMove = { this.onMouseOverHandler }
            onMouseLeave = { this.onMouseLeaveHandler }>
            { toRender }
        </ul>);
    }

    /**
     * Component mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, this.showOrHideContextMenu);
        qigStore.instance.addListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareMultiline);
        if (this.state.renderedOn === 0) {
            this.reset();
            this.initializeContextMenuProperties();
            this.reRender(false);
        }
    }

    /**
     * componentWillUnmount
     * 
     * @memberof ContextMenu
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, this.showOrHideContextMenu);
        qigStore.instance.removeListener(qigStore.QigStore.ACETATES_SHARED_EVENT, this.shareMultiline);
    }

    /**
     * Initialize context menu properties
     */
    private initializeContextMenuProperties() {
        let element = ReactDom.findDOMNode(this);
        this.width = element.getBoundingClientRect().width;
        this.height = element.getBoundingClientRect().height;
    }

    /**
     * Method to trigger on share button toggle.
     */
    private onShareToggleButtonClick(evt: any): void {
        let multilineClientTokenToBeShared: Array<string> = [];
        multilineClientTokenToBeShared.push(this.contextMenuData.clientToken);
        // Show popup only when unsharing the multiline
        if (this._isShared) {
            acetatesActionCreator.shareConfirmationPopup(multilineClientTokenToBeShared[0], this._isShared);
        } else {
            acetatesActionCreator.shareAcetate(multilineClientTokenToBeShared[0]);
        }
    }

    /**
     * On click handler
     * @param event
     * @param contextMenuData
     */
    private onClickHandler = (menuAction?: enums.MenuAction, value?: any, contextMenuData?: any) => {
        this.isColorPanelVisible = false;
        let selectedClientToken: Array<string> = [];
        selectedClientToken.push(this.contextMenuData.clientToken);
        if (contextMenuData) {
            contextMenuData.menuAction = menuAction;
        }
        // Set colour panel visibilty for annotation.
        this.isColorPanelVisible = contextMenuHelper.setColourPanelVisibility(menuAction, value);
         contextMenuHelper.doClickAction(this.xPos, this.yPos,
             selectedClientToken, menuAction, value, contextMenuData);
        this.reRender(false);
    };

   /**
    * trigger's while clicking context menu
    */
    private onContextMenuClick = (event?: any) => {

        // preventing default due to image flickering issues in iPad
        event.preventDefault();
        event.stopPropagation();
    };

    /**
     * On mouse over handler
     * @param event
     */
    private onMouseOverHandler(event: any) {
        event.preventDefault();
        event.stopPropagation();
        responseActionCreator.setMousePosition(-1, -1);
    }

    /**
     * On mouse leave handler
     * @param event
     */
    private onMouseLeaveHandler(event: any) {
        event.preventDefault();
        event.stopPropagation();
        responseActionCreator.setMousePosition(0, 0);
    }

    /**
     * Update context menu position
     * @param isVisible
     * @param xPos
     * @param yPos
     * @param contextMenuData
     */
    private showOrHideContextMenu = (isVisible: boolean,
        xPos: number,
        yPos: number,
        data: contextMenuData): void => {
        this.contextMenuData = data ? contextMenuHelper.getContextMenuData(data) : null;
        this._isShared = false;
        this.isColorPanelVisible = false;
        if (isVisible) {
            this.xPos = xPos;
            this.yPos = yPos;
        } else {
            this.isColorPanelVisible = isVisible;
        }
        // set shared shared overlay panel visibilty.
        this._isShared = contextMenuHelper.setSharedPanelVisibility(this.contextMenuData);
        this.reRender(isVisible);
    };

    /**
     * call when toggle button to share multiline changes
     */
    private shareMultiline = (isShared: boolean): void => {
        this._isShared = isShared;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Hide context menu
     */
    private hideContextMenu = () => {
        if (this.state.isVisible === true) {
            this.reset();
            this.reRender(false);
        }
    };

    /**
     * Reset all property
     */
    private reset = () => {
        this.contextMenuData = undefined;
        this.xPos = 0;
        this.yPos = 0;
    };

    /**
     * Rerender if required
     */
    private reRender = (isVisible: boolean) => {
        // If previous state is invisible and new state is invisible no need to re-render as it's already hidden
        if (!this.state.isVisible && !isVisible) {
            return;
        }

        if (this.isColorPanelVisible) {
          return;
       }

        this.setState({
            renderedOn: Date.now(),
            isVisible: isVisible
        });
    };
}

export = ContextMenu;
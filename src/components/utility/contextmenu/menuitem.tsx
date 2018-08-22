/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import SubMenu = require('./submenuitem');
import subMenuItem = require('./typings/submenuitem');
import enums = require('../enums');
import annotationHelper = require('../annotation/annotationhelper');
import annotation = require('../../../stores/response/typings/annotation');
import stampStore = require('../../../stores/stamp/stampstore');
import qigStore = require('../../../stores/qigselector/qigstore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import acetateContextMenuData = require('../../../stores/markschemestructure/acetatecontextmenudata');
import ToggleButton = require('../togglebutton');
import contextMenuData = require('./contextmenudata');
/**
 * Properties of ContextMenu component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    name: string;
    hasSubMenu: boolean;
    subMenuItems: Array<subMenuItem>;
    menuClick: Function;
    menuAction: enums.MenuAction;
    getAnnotationOverlayElement?: Element;
    clientXCoordinate: number;
    clientYCoordinate: number;
    contextMainMenuWidth: number;
    annotationOverlayWidth: number;
    onShareStateChange: Function;
    isShared: boolean;
    isShareableItem: boolean;
    contextMenuData?: any;
    contextMainMenuHeight: number;
}

interface State {
    renderedOn: number;
    isToggleButtonSelected?: boolean;
}

/**
 * Menu item class
 */
class MenuItem extends pureRenderComponent<Props, State> {
    private contextMenuStyle: React.CSSProperties = { 'top': 0, 'left': 0 };
    private contextMenuWidth: number;
    private isVisible: boolean = false;
    private style?: React.CSSProperties;
    private _isToggleButtonSelected?: boolean = false;

    // set when context menu is rendered.
    private menuRendered: boolean = false;

    /**
     * Constructor Menu Item
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: Date.now()
        };

        this.onSubMenuItemClick = this.onSubMenuItemClick.bind(this);
        this.onToggleButtonClick = this.onToggleButtonClick.bind(this);
        this.onToggleClick = this.onToggleClick.bind(this);
    }

    /**
     * Render method for Context Menu.
     */
    public render() {

        this.menuRendered = false;

         if (this.props.isShareableItem) {
             return (<li id='shared-menu-item' className='context-list shared-menu-item' onClick={this.onToggleClick}>
                 <span className='context-link remove-annotation'>
                     {localeStore.instance.TranslateText('marking.response.annotation-context-menu.share-multiline')}</span>
                 <ToggleButton
                     title={this.props.isShared === true ?
                         localeStore.instance.TranslateText('marking.response.annotation-context-menu.click-multiline-unshare') :
                         localeStore.instance.TranslateText('marking.response.annotation-context-menu.click-multiline-share')}
                     id={'share'}
                     key={'share-key'}
                     selectedLanguage={this.props.selectedLanguage}
                     isChecked={this.props.isShared}
                     index={0}
                     onChange={this.onToggleButtonClick}
                     style={this.style}
                     onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                     offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>
             </li>);
         } else {
            return (<li className={classNames('context-list',
             { 'has-sub': this.props.hasSubMenu === true })}
             onClick={this.props.hasSubMenu === true ? null : this.onMenuItemClick.bind(this) }
             onTouchEnd={() => { this.onTouchEnd(); }}
             onMouseOver={this.onMenuMouseOver.bind(this, this.props.hasSubMenu) }>
                <a className='context-link remove-annotation'
                     id={'Overlay_' + localeStore.instance.TranslateText(this.props.name)}
                     onClick={this.props.hasSubMenu === true ? null : this.onMenuItemClick.bind(this) }>
                     { localeStore.instance.TranslateText(this.props.name) }
                 </a>

                 <SubMenu
                     id={this.props.id}
                     key={'key_' + this.props.id}
                     items={this.props.subMenuItems}
                     menuAction={this.props.menuAction}
                     annotationOverlayWidth={this.props.annotationOverlayWidth}
                     submenuClick={this.onSubMenuItemClick }
                     clientXCoordinate={this.props.clientXCoordinate + this.props.contextMainMenuWidth}
                     clientYCoordinate={this.props.clientYCoordinate}
                     isVisible={this.isVisible}
                     contextMenuWidth={this.props.contextMainMenuWidth}
                     contextMainMenuHeight={this.props.contextMainMenuHeight}
                 />
             </li>);
         }
    }

    /**
     * Method to trigger on share toggle click.
     */
     private onToggleClick = (event: any): void => {
         event.stopPropagation();
     };

    /**
     * Method to trigger on tounchend event in ipad.
     */
    private onTouchEnd() {
        // set true to avoid auto deleting annotaion on touchend in ipad.
        this.menuRendered = true;
    }

    /**
     * Method to trigger on share button toggle.
     */
    private onToggleButtonClick(event: any): void {
        this.props.onShareStateChange();
    }

    /**
     * Method to trigger on menu item event.
     */
    private onMenuItemClick(event: MouseEvent, menuAction: enums.MenuAction, value: string) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isMenuClickable || (this.props.contextMenuData.annotationData &&
            annotationHelper.isDynamicAnnotation(stampStore.instance.getStamp(this.props.contextMenuData.annotationData.stamp)))) {
            if (this.props.subMenuItems) {
                this.props.menuClick(menuAction, value, this.props.contextMenuData);
            } else {
                this.props.menuClick(this.props.menuAction, value, this.props.contextMenuData);
            }
        }
    }

    /**
     * Method to trigger on sub menu item event.
     */
    private onSubMenuItemClick(menuAction: enums.MenuAction, value: string, event: MouseEvent) {
        this.menuRendered = true;
        this.onMenuItemClick(event, menuAction, value);
    }

    private get isMenuClickable(): boolean {
        return this.menuRendered || !htmlUtilities.isTabletOrMobileDevice;
    }

    /**
     * Show or hide the Submenu items while mouse over.
     */
    private onMenuMouseOver(hasSubMenu: boolean, event: MouseEvent) {
        this.isVisible = hasSubMenu;
        if (hasSubMenu) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }
}

export = MenuItem;
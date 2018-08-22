/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import subMenuItem = require('./typings/submenuitem');
import enums = require('../enums');
import contextMenuHelper = require('./contextmenuhelper');
let classNames = require('classnames');
import constants = require('../constants');

/**
 * Properties of ContextMenu component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    items: Array<subMenuItem>;
    submenuClick: Function;
    menuAction: enums.MenuAction;
    clientXCoordinate?: number;
    clientYCoordinate?: number;
    annotationOverlayWidth?: number;
    isVisible?: boolean;
    contextMenuWidth?: number;
    contextMainMenuHeight?: number;
}

interface State {
    renderedOn: number;
}

/**
 * Sub Menu item class
 */
class SubMenu extends pureRenderComponent<Props, State> {

    private contextMenuWidth: number;
    private contextSubMenuHeight: number;
    private initial: boolean = true;

    /**
     * Constructor sub menu
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0
        };
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        let element: Element = ReactDom.findDOMNode(this);
        this.contextSubMenuHeight = element.getBoundingClientRect().height;

    }

    /**
     * render tick 
     */
    private renderTick() {
        return (<span className='svg-icon shift-left tick'> <svg viewBox='0 0 32 32' className='tick-icon'>
            <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='#v-icon-tick'></use>
        </svg>
        </span>);
    }

    /**
     * Render method for Context Menu.
     */
    public render() {

        let isAlignBottomTransform = false;
        let isAlignRightTransform = false;
        let isAlignBottomRightTransform = false;

        let toRender = null;
        if (this.props.items) {
            let _contextSubMenuHeight = 0;
            toRender = this.props.items.map((item: subMenuItem) => {
                let className = item.isSelected ? 'context-list selected' : 'context-list';
                let tickClassName = item.isDark ? 'color-sample lite' : 'color-sample dark';
                let submenuRender: JSX.Element;
                let submenuData = contextMenuHelper.getSubmenuItemData(item);
                _contextSubMenuHeight = _contextSubMenuHeight + this.props.contextMainMenuHeight;
                switch (item.submenuAction) {
                    case enums.MenuAction.RemoveOverlay:
                    case enums.MenuAction.RemoveMultilinePoint:
                    case enums.MenuAction.RemoveMultilineLine:
                    case enums.MenuAction.AddMultilinePoint:
                    case enums.MenuAction.AddMultilineLine:
                        submenuRender = (<a className={submenuData.className}
                            id={submenuData.id}>
                            {localeStore.instance.TranslateText(item.name)}
                        </a>);
                        break;
                    case enums.MenuAction.LineStyleOverlay:
                        className = contextMenuHelper.getAcetateLineTypeClassName
                            (item.value, item.isSelected);
                        submenuRender = this.getAcetateLineTypeElement(item.value, item.name);
                        break;
                    case enums.MenuAction.ChangeColorOverlay:
                    default:
                        submenuRender = (<a className='context-link'
                            id={'SubMenu_Default'}>
                            <span className={tickClassName} style=
                                {{ backgroundColor: submenuData.style}}></span>
                            <span className='color-text'>{localeStore.instance.TranslateText(item.name)}</span>
                        </a>);
                        break;
                }
                return (<li className={className}
                    onClick={this.props.submenuClick.bind(this, item.submenuAction, item.value)}
                    id={this.props.id + '-' + item.name}
                    key={'key_' + this.props.id + '-' + item.name}>
                    {submenuRender}
                </li>);
            });

            isAlignBottomTransform = contextMenuHelper.isBottomAlignmentRequired
                (this.props.clientYCoordinate, _contextSubMenuHeight, window.innerHeight);


            isAlignRightTransform = contextMenuHelper.isRigtAlignmentRequired(this.props.clientXCoordinate,
                this.props.contextMenuWidth, this.props.annotationOverlayWidth);
            // Check if align bottom right transform is needed
            isAlignBottomRightTransform = (isAlignRightTransform === true && isAlignBottomTransform === true);

        }

        return (
            <ul
                className={
                    classNames('context-menu',
                        { 'selectable line-style-menu': this.props.menuAction === enums.MenuAction.LineStyleOverlay },
                        { 'align-bottom-right': isAlignBottomRightTransform === true },
                        { 'align-right': isAlignBottomRightTransform === false && isAlignRightTransform === true },
                        { 'align-bottom': isAlignBottomRightTransform === false && isAlignBottomTransform === true })
                }
                id={this.props.id}
                key={'key_' + this.props.id}>

                {toRender}
            </ul>
        );
    }

    /**
     * get Acetate LineType Element
     * @param value
     * @param name
     */
    private getAcetateLineTypeElement(value: any, name: string) {
        let _value;
        let id;
        switch (value) {
            case enums.MenuAction.StraightLine:
                id = 'SubMenu_StraightLine';
                break;
            case enums.MenuAction.CurvedLine:
                id = 'SubMenu_CurvedLine';
                break;
            case enums.MenuAction.HiddenLine:
                id = 'SubMenu_HiddenLine';
                break;
        }

        _value = (<a className='context-link' id={id}>
            {this.renderTick()}
            <span className='label-text'>{localeStore.instance.TranslateText(name)}</span>
        </a>);
        return _value;
    }
}

export = SubMenu;
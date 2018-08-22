import enums = require('../utility/enums');
import React = require('react');
let classNames = require('classnames');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');

interface Item {
    id: enums.MessagePriority;
    name: string;
}

interface Props {
    id: string;
    dropDownType: enums.DropDownType;
    className: string;
    style: React.CSSProperties;
    isOpen: boolean;
    onClick: Function;
    onSelect: Function;
    selectedItem: string;
    items: Array<Item>;
    title: string;
}

/* tslint:disable:variable-name */

const ListItem = (props: { onSelect: Function, item: Item }) =>
    <li role='menuitem'><a href='javascript:void(0)' onClick={() => { props.onSelect(props.item.id); }}>{props.item.name}</a></li>;
const List = (props: { onSelect: Function, style: React.CSSProperties, items: Array<Item> }) => (
    <ul id='drop-down-items' className='menu' role='menu' title='' aria-hidden='true' style={props.style}>
        {props.items.map((item: Item) => <ListItem key={'key_drop_down_' + item.id} onSelect={props.onSelect} item={item} />)}
    </ul>
);

/* tslint:enable */

class DropDown extends pureRenderComponent<Props, any> {

    private style: React.CSSProperties;

    /** refs */
    public refs: {
        [key: string]: (Element);
        qigDropDown: (HTMLAnchorElement);
    };

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        return (
            <div id={this.props.id + '_dropdown'}
                title={this.props.title}
                className={classNames(this.props.className, { 'open': this.props.isOpen },
                    { 'close': this.props.isOpen === undefined ? false : !this.props.isOpen })} onClick=
                {() => { this.onDropDownClick(this.props.dropDownType); }}>
                <a ref='qigDropDown' href='javascript:void(0)' id={this.props.id + '_component'} className='menu-button'>
                    <span id={this.props.id + '_items'} > {this.props.selectedItem} </span>
                    <span className='sprite-icon menu-arrow-icon'></span>
                </a>
                <List key={'key_drop_down_items'} onSelect={this.props.onSelect} items={this.props.items}
                    style={this.props.style} />
            </div>);
    }

    /**
     * This will find the width of the anchor tag and pass to parent for applying width style of menu ul
     */
    private onDropDownClick = (dropdownType: enums.DropDownType) => {
        let width: number = this.refs.qigDropDown.getBoundingClientRect().width;
        this.props.onClick(dropdownType, width);
    };

}

export = DropDown;
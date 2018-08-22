import enums = require('../utility/enums');
import React = require('react');
let classNames = require('classnames');
let localeStore = require('../../stores/locale/localestore');

interface Item {
    id: enums.MessagePriority;
    name: string;
}

interface DropDownItems {
    id: string;
    dropDownType: enums.DropDownType;
    className: string;
    isOpen: boolean;
    onClick: Function;
    onSelect: Function;
    selectedItem: string;
    items: Array<Item>;
}

/* tslint:disable:variable-name */

const ListItem = (props: { onSelect: Function, item: Item}) =>
    <li role='menuitem'><a href='javascript:void(0)' onClick = {() => { props.onSelect(props.item.id); } }>{ props.item.name }</a></li>;
const List = (props: { onSelect: Function, items: Array<Item>, id: string }) => (
    <ul id={props.id + '_drop-down-items'} className='menu' role='menu'
        title={localeStore.instance.TranslateText('messaging.compose-message.priority.priority-tooltip')} aria-hidden='true' >
        { props.items.map((item: Item) => (item !== null) ?
            (<ListItem key= {'key_drop_down_' + item.id} onSelect= {props.onSelect} item={ item } />) :
            null) }
    </ul>
);

const DropDown = (props: DropDownItems) => {
    return (
        <div id={props.id + '_dropdown'} className={classNames(props.className, { 'open': props.isOpen },
            { 'close': props.isOpen === undefined ? false : !props.isOpen }) } onClick = { () => { props.onClick(props.dropDownType); } }>
            <a href='javascript:void(0)' id={props.id + '_component'} className='menu-button'>
                <span id = {props.id + '_items'} > { props.selectedItem } </span>
                <span className='sprite-icon menu-arrow-icon'></span>
            </a>
            <List id={props.id} key={'key_drop_down_items'}  onSelect= {props.onSelect} items = { props.items }/>
        </div>);
};

export = DropDown;

/* tslint:enable */
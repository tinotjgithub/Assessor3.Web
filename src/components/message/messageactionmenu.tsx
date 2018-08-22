import React = require('react');
import enums = require('../utility/enums');
let classNames = require('classnames');

interface MessageActionMenuItems extends PropsBase {
    onClick: Function;
    items: Array<MenuItem>;
}

interface MenuItem {
    id: enums.MessageAction;
    icon: string;
    name: string;
}

/* tslint:disable:variable-name */

const MenuItem = (props: { onClick: Function, item: MenuItem }) =>
    (<li className = { props.item.name + '-msg' }>
        <a href='javascript:void(0)' onClick = {() => { props.onClick(props.item.id); } }
            id = { enums.getEnumString(enums.MessageAction, props.item.id).toLowerCase() + '-link' }>
            <span className={'sprite-icon ' + props.item.icon }> { props.item.name }
            </span> { props.item.name } </a>
    </li>);

const MenuList = (props: { onClick: Function, items: Array<MenuItem> }) => (
    <ul id='menu-action-items' className='msg-action-menu'>
        { props.items.map((item: MenuItem) => <MenuItem key= { 'key-menu-lits-item-' + item.id }
            onClick={ props.onClick} item= { item } />) }
    </ul>
);

const MessageActionMenu = (props: MessageActionMenuItems) => {
    if (props.items === undefined) {
        return null;
    }

    return (<div className='col-6-of-12 msg-actions text-right'>
        <MenuList key={'key-menu-list'} items = {props.items} onClick = {props.onClick}/>
    </div>);
};

export = MessageActionMenu;

/* tslint:enable */
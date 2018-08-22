/*
  React component for Generic button.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import genericRadioButtonItems = require('../utility/genericradiobuttonitems');


interface Props extends LocaleSelectionBase, PropsBase {
    className?: string;
    onCheckedChange?: Function;
    items?: Array<genericRadioButtonItems>;
    renderedOn?: number;
    liClassName?: string;
}

/**
 * React component class for Generic popup with radio buttons implementation.
 */
const genericPopupWithRadioButtons: React.StatelessComponent<Props> = (props: Props) => {
    let that = this;
    let toRender = (<ul id={props.id} key='key_ul_genericpopup' className={props.className} >
        {
            props.items && props.items.map((item: genericRadioButtonItems) =>
                <li id={'li_genericpopup_' + item.id} className={props.liClassName}
                     key={'key_li_genericpopup_' + item.id}>
                    <input checked={item.isChecked}
                        type='radio' id={item.id.toString()}
                        onClick={() => { props.onCheckedChange(item); }}
                        key={'key_' + item.id}
                        name='genericpopup'
                        value={item.isChecked ? 'true' : 'false'} />
                    <label htmlFor={item.id.toString()}>
                        <span className='radio-ui'></span>
                        <span className='label-text'>{item.name}</span>
                        <span className='label-text error'>{item.errorText}</span>
                    </label>
                </li>
            )
        }
    </ul>);

    return toRender;
};

export = genericPopupWithRadioButtons;

import React = require('react');
import localeStore = require('../../stores/locale/localestore');

interface Props extends LocaleSelectionBase, PropsBase {
    onSelectionChange?: Function;
    isChecked?: boolean;
    labelContent?: string;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
    disabled?: boolean;
}

/**
 * generic check box component.
 * @param props
 */
const genericCheckbox = (props: Props) => {
    return (
        <div className={props.containerClassName}>
            <input type='checkbox'
                id={props.id}
                className={props.className}
                checked={props.isChecked}
                disabled={props.disabled}
                onChange={() => { props.onSelectionChange(); }}/>
            <label htmlFor={props.id}
                className={props.labelClassName}>{props.labelContent}</label>
        </div>
    );
};

export = genericCheckbox;
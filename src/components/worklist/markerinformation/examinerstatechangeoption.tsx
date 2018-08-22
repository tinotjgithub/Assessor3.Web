import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

interface ChangeExaminerStateOptionProps extends LocaleSelectionBase, PropsBase {
    onSelectionChange?: Function;
    isChecked: boolean;
    stateText: string;
}

/**
 * examinerStateChangeOption contains the available state for the examiner.
 * @param props
 */
const examinerStateChangeOption: React.StatelessComponent<ChangeExaminerStateOptionProps> = (props: ChangeExaminerStateOptionProps) => {

    return (
        <div className='approval-options'>
            <input type='radio' value='selected' onChange={() => { props.onSelectionChange(); } } id={props.id} name='changeStatus'
                checked={props.isChecked ? true : false} />
            <label htmlFor={props.id}>
                <span className='radio-ui'></span>
                <span className='label-text'>{props.stateText}</span>
            </label>
        </div>
    );
};

export = examinerStateChangeOption;
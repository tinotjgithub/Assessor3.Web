import React = require('react');
import localeStore = require('../../stores/locale/localestore');

interface ExceptionActionButtonProps extends LocaleSelectionBase, PropsBase {
    content?: string;
    className?: string;
    onActionException?: Function;
}

/**
 * exception action button contain exception action such as Escalate, Resolve, Close.
 * @param props
 */
const exceptionActionButton: React.StatelessComponent<ExceptionActionButtonProps> = (props: ExceptionActionButtonProps) => {

    return (
        <a className='exception-close-link'
            id={props.id}
            onClick={() => { props.onActionException(); }}>
            <span className={props.className}></span>
            <span className='exception-close-text dim-text'>
                {props.content}
            </span>
        </a>
    );
};

export = exceptionActionButton;
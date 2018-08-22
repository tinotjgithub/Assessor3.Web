import React = require('react');
let classNames = require('classnames');
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isVisible: boolean;
    onClick: Function;
    mark: AllocatedMark;
}

/**
 * Stateless MaxButton component
 * @param props
 */
/* tslint:disable:variable-name */
const MaxButton = (props: Props): JSX.Element => {
    return (
        <a onClick={(e) => { props.onClick(e); }} href='#' className={classNames('mark-entry',
            { 'hide': !props.isVisible })}>
            <span className='max-txt'>Max</span>
            <span className='number-of-entry'>{props.mark.displayMark}</span>
        </a>
    );
};
export = MaxButton;
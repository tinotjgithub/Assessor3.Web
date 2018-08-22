import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
let classNames = require('classnames');

interface Props extends PropsBase, LocaleSelectionBase {
    multiQigLockResult: MultiLockResult;
    className: string;
}

/**
 * React wrapper component for multi qig lock result item
 */
const multiQigLockResultItem = (props: Props) => {
    return (
        <div className={props.className + ' padding-left-10'}>
            <span className='text-middle' id={props.id}>{props.multiQigLockResult.qigName}</span>
        </div>
    );
};

export = multiQigLockResultItem;
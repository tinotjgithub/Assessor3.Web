import React = require('react');

/**
 * Props for link icon
 */
interface Props {
    id: string;
    toolTip?: string;
}

/**
 * Stateless link icon component
 */

/* tslint:disable:variable-name */
const LinkIcon = (props: Props): JSX.Element => {
    return (<span className='question-link' id={props.id} title={props.toolTip}>
        <span className='svg-icon'>
            <svg viewBox='0 0 24 10' className='link-icon'>
                <use xlinkHref='#link-icon'></use>
            </svg>
        </span>
    </span>);
};

export = LinkIcon;
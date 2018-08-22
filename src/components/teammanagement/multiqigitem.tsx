import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
let classNames = require('classnames');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');

interface Props extends PropsBase, LocaleSelectionBase {
    multiQigData: qigDetails;
    onQigSelected: Function;
}

/**
 * React wrapper component for multi qig item
 */
const multiQigItem = (props: Props) => {
    return (
        <tr className='row' id={'multiQigItem_' + props.id} onClick={() => { props.onQigSelected(props.multiQigData); }}>
            <td><div className='item'>{props.multiQigData.qigName}</div></td>
            <td><div className='item'>{props.multiQigData.examinerLockCount}</div></td>
            <td><div className='item'>{props.multiQigData.examinerStuckCount}</div></td>
        </tr>
    );
};

export = multiQigItem;
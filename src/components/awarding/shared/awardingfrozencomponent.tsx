import React = require('react');
import enums = require('../../utility/enums');
import examinerStore = require('../../../stores/markerinformation/examinerstore');
import storageAdapterFactory = require('../../../dataservices/storageadapters/storageadapterfactory');
import applicationactioncreator = require('../../../actions/applicationoffline/applicationactioncreator');
import localeStoreData = require('../../../stores/locale/localestore');
import awardingActionCreator = require('../../../actions/awarding/awardingactioncreator');


interface AwardingFrozenComponentProps extends PropsBase {
    viewType: enums.AwardingViewType;
    frozenColumn: string;
    hasSub?: boolean;
    isExpanded?: boolean;
    isParentItem: boolean;
    parentItemName: string;
    index: number;
    callback: Function;
}

interface ExpandableButtonProps extends PropsBase {
    expandableItem: string;
    hasSub: boolean;
    isExpanded: boolean;
    viewType: enums.AwardingViewType;
    isParentItem: boolean;
    parentItemName: string;
    index: number;
    callback: Function;
}

interface GradeNameProps extends PropsBase {
    gradeName: string;
}

interface TotalMarkProps extends PropsBase {
    totalMarkValue: string;
}

/* tslint:disable:variable-name */
const ExpandableButton: React.StatelessComponent<ExpandableButtonProps> = (props: ExpandableButtonProps) => {
    if (props.hasSub) {
        return (
            <a href='javascript:void(0)'
                className='exp-collapse' id={props.id + '_expandableButton'} ></a>
        );
    } else {
        return null;
    }
};

/* tslint:disable:variable-name */
const GradeName: React.StatelessComponent<GradeNameProps> = (props: GradeNameProps) => {
    let gradeName: JSX.Element =
        <a href='javascript:void(0)'
            className='examiner-name' id={props.id + '_examinerName'} >
            {props.gradeName}
        </a>;
    return gradeName;
};

/* tslint:disable:variable-name */
const TotalMark: React.StatelessComponent<TotalMarkProps> = (props: TotalMarkProps) => {
    let totalMark: JSX.Element =
        <a href='javascript:void(0)'
            className='examiner-name' id={props.id + '_examinerName'} >{parseInt(props.totalMarkValue).toFixed(2)}</a>;
    return totalMark;
};

/**
 * Stateless component for awarding candidate grid for frozen
 * @param props
 */
const awardingFrozenComponent: React.StatelessComponent<AwardingFrozenComponentProps> = (props: AwardingFrozenComponentProps) => {

    return (
        <div onClick={() => {
            props.callback(props.frozenColumn,
                !props.isExpanded, props.viewType, props.isParentItem, props.parentItemName);
        }}>
            <ExpandableButton expandableItem={props.frozenColumn}
                id={props.id}
                key={'key_ExpandButton_' + props.id}
                hasSub={props.hasSub}
                isExpanded={props.isExpanded}
                viewType={props.viewType}
                isParentItem={props.isParentItem}
                parentItemName={props.parentItemName}
                index={props.index}
                callback={props.callback} />
            {props.viewType === enums.AwardingViewType.Grade ?
                <GradeName id={props.id}
                    key={'key_Examiner_' + props.id}
                    gradeName={localeStoreData.instance.TranslateText('awarding.right-panel.grade') + ' - ' + props.frozenColumn} /> :
                <TotalMark id={props.id}
                    key={'key_Examiner_' + props.id}
                    totalMarkValue={props.frozenColumn} />
            }
        </div>
    );
};
export = awardingFrozenComponent;
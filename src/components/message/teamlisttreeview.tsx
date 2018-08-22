import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import GenericButton = require('../utility/genericbutton');
import enums = require('../utility/enums');
import toAddressList = require('../../stores/message/typings/teamreturn');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');

interface Props extends PropsBase, LocaleSelectionBase {
    addressList: Array<ExaminerInfo>;
    renderedOn?: number;
}

class TeamListTreeview extends pureRenderComponent<Props, any> {

    private _className: string;
    private isInitialLoad: boolean = true;

    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);

        this._className = this.props.addressList.length > 0 ? 'sub-items has-expandables' : null;
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let that = this;
        let nodes: any;

        let teamListTreeView: any;

        if (that.props.addressList !== undefined) {

            nodes = that.props.addressList.map(function (nodeItem: ExaminerInfo, index: number) {
                return that.getNodeItem(nodeItem, index);
            });
        }

        return (
            <ul role='group' className={this._className} id={this.props.id} key={this.props.id}>
                {nodes}
                </ul>
        );
    }

    /**
     * getting node items
     */
    private getNodeItem(nodeItem: ExaminerInfo, index: number): any {
        let checkBoxId: string = 'cbx_' + nodeItem.examinerRoleId;

        if (nodeItem.subordinates.length > 0) {
            let teamListTreeview = nodeItem.isOpen ? (<TeamListTreeview
                id={'nodeItem_' + nodeItem.examinerRoleId}
                key={'nodeItem_' + index.toString() + '_key_' + nodeItem.examinerRoleId }
                addressList ={nodeItem.subordinates}
                renderedOn = {Date.now()}/>) : null;

            let classNameForExpand = nodeItem.isOpen ? 'node has-sub expanded' : 'node has-sub collapsed';
            return (<li id={'li_' + nodeItem.examinerRoleId} key={'li_' + index.toString() + '_' + nodeItem.examinerRoleId}
                className={classNameForExpand} role='treeitem' aria-expanded='true'>
                <a
                    id={'a_' + nodeItem.examinerRoleId}
                    onClick = {this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, true) }
                    href='javascript:void(0);' className='parent-node'></a>
                <input
                    type='checkbox'
                    className='text-middle checkbox'
                    id={checkBoxId}
                    checked = {nodeItem.isChecked}
                    onChange={this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, false) }
                   />
                <label
                    htmlFor={checkBoxId}>
                    {nodeItem.fullName}
                </label>
               {teamListTreeview}
            </li>);

        } else {
            return (<li id={'li_' + nodeItem.examinerRoleId} key={'li_' + index.toString() + '_' + nodeItem.examinerRoleId}
                className='node' role='treeitem'>
                <input
                    type='checkbox'
                    className='text-middle checkbox'
                    id={checkBoxId}
                    checked = {nodeItem.isChecked}
                    onChange={this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, false) }
                    />
                <label
                    htmlFor={checkBoxId}>
                    {nodeItem.fullName}</label>
            </li>);
        }
    }


    /**
     * Clicking on expand/collapse or check/uncheck
     */
    private updateTeamListStatus = (uniqueId: number, isExpand: boolean) => {
        messagingActionCreator.updateTeamListStatus(uniqueId, isExpand);
    };
}

export = TeamListTreeview;
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
var TeamListTreeview = (function (_super) {
    __extends(TeamListTreeview, _super);
    /**
     * Constructor Messagepopup
     * @param props
     * @param state
     */
    function TeamListTreeview(props, state) {
        _super.call(this, props, state);
        this.isInitialLoad = true;
        /**
         * Clicking on expand/collapse or check/uncheck
         */
        this.updateTeamListStatus = function (uniqueId, isExpand) {
            messagingActionCreator.updateTeamListStatus(uniqueId, isExpand);
        };
        this._className = this.props.addressList.length > 0 ? 'sub-items has-expandables' : null;
    }
    /**
     * Render component
     * @returns
     */
    TeamListTreeview.prototype.render = function () {
        var that = this;
        var nodes;
        var teamListTreeView;
        if (that.props.addressList !== undefined) {
            nodes = that.props.addressList.map(function (nodeItem, index) {
                return that.getNodeItem(nodeItem, index);
            });
        }
        return (React.createElement("ul", {role: 'group', className: this._className, id: this.props.id, key: this.props.id}, nodes));
    };
    /**
     * getting node items
     */
    TeamListTreeview.prototype.getNodeItem = function (nodeItem, index) {
        var checkBoxId = 'cbx_' + nodeItem.examinerRoleId;
        if (nodeItem.subordinates.length > 0) {
            var teamListTreeview = nodeItem.isOpen ? (React.createElement(TeamListTreeview, {id: 'nodeItem_' + nodeItem.examinerRoleId, key: 'nodeItem_' + index.toString() + '_key_' + nodeItem.examinerRoleId, addressList: nodeItem.subordinates, renderedOn: Date.now()})) : null;
            var classNameForExpand = nodeItem.isOpen ? 'node has-sub expanded' : 'node has-sub collapsed';
            return (React.createElement("li", {id: 'li_' + nodeItem.examinerRoleId, key: 'li_' + index.toString() + '_' + nodeItem.examinerRoleId, className: classNameForExpand, role: 'treeitem', "aria-expanded": 'true'}, React.createElement("a", {id: 'a_' + nodeItem.examinerRoleId, onClick: this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, true), href: 'javascript:void(0);', className: 'parent-node'}), React.createElement("input", {type: 'checkbox', className: 'text-middle checkbox', id: checkBoxId, checked: nodeItem.isChecked, onChange: this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, false)}), React.createElement("label", {htmlFor: checkBoxId}, nodeItem.fullName), teamListTreeview));
        }
        else {
            return (React.createElement("li", {id: 'li_' + nodeItem.examinerRoleId, key: 'li_' + index.toString() + '_' + nodeItem.examinerRoleId, className: 'node', role: 'treeitem'}, React.createElement("input", {type: 'checkbox', className: 'text-middle checkbox', id: checkBoxId, checked: nodeItem.isChecked, onChange: this.updateTeamListStatus.bind(this, nodeItem.examinerRoleId, false)}), React.createElement("label", {htmlFor: checkBoxId}, nodeItem.fullName)));
        }
    };
    return TeamListTreeview;
}(pureRenderComponent));
module.exports = TeamListTreeview;
//# sourceMappingURL=teamlisttreeview.js.map
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var GenericCheckbox = require('../utility/genericcheckbox');
/**
 * React wrapper component for multi qig lock item
 */
var MultiQigLockItem = (function (_super) {
    __extends(MultiQigLockItem, _super);
    /**
     * @constructor
     */
    function MultiQigLockItem(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * update multi qig lock selection
         */
        this.updateMultiQigLockSelection = function (markSchemeGroupId, isSelectedAll) {
            teamManagementActionCreator.updateMultiQigLockSelection(markSchemeGroupId, isSelectedAll);
        };
        /**
         * This method will call on multi qig lock selection received
         */
        this.updateMultiLockQigSelectionReceived = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Render method
     */
    MultiQigLockItem.prototype.render = function () {
        var multiQigLockItem = (React.createElement(GenericCheckbox, {id: this.props.id, key: this.props.key, containerClassName: 'padding-top-10', className: 'text-middle checkbox', disabled: false, isChecked: this.props.multiQigLockData.isChecked, labelClassName: 'text-middle', labelContent: this.props.multiQigLockData.qigName, onSelectionChange: this.updateMultiQigLockSelection.
            bind(this, this.props.multiQigLockData.markSchemeGroupId, false)}));
        return multiQigLockItem;
    };
    /**
     * componentDidMount React lifecycle event
     */
    MultiQigLockItem.prototype.componentDidMount = function () {
        teamManagementStore.instance.addListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED, this.updateMultiLockQigSelectionReceived);
    };
    /**
     * componentWillUnmount React lifecycle event
     */
    MultiQigLockItem.prototype.componentWillUnmount = function () {
        teamManagementStore.instance.removeListener(teamManagementStore.TeamManagementStore.UPDATE_MULTI_QIG_LOCK_SELECTION_RECEIVED, this.updateMultiLockQigSelectionReceived);
    };
    return MultiQigLockItem;
}(pureRenderComponent));
module.exports = MultiQigLockItem;
//# sourceMappingURL=multiqiglockitem.js.map
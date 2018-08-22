"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var TableControl = require('../../utility/table/tablewrapper');
var standardisationSetUpStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var DraggingRowHolder = (function (_super) {
    __extends(DraggingRowHolder, _super);
    /**
     * @constructor
     */
    function DraggingRowHolder(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Re-render div on mouse position change.
         */
        this.onMousePositionUpdated = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        this.state = {
            elementStyle: {
                left: 0,
                top: 0,
            }
        };
    }
    /**
     * Component did mount
     */
    DraggingRowHolder.prototype.componentDidMount = function () {
        standardisationSetUpStore.instance.addListener(standardisationSetUpStore.StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID, this.onMousePositionUpdated);
    };
    /**
     * Component will unmount
     */
    DraggingRowHolder.prototype.componentWillUnmount = function () {
        standardisationSetUpStore.instance.removeListener(standardisationSetUpStore.StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID, this.onMousePositionUpdated);
    };
    /**
     * Render method
     */
    DraggingRowHolder.prototype.render = function () {
        return (React.createElement("div", {className: 'dragging-row-holder', style: this.props.selectedRow ? this.getDraggingHolderDivStyle() : undefined}, this.props.selectedRow ?
            React.createElement(TableControl, {tableBodyRows: this.props.selectedRow, gridStyle: '', id: 'draggingRow_' + this.props.rowId.toString(), key: 'key_rowHeader_' + this.props.id, selectedLanguage: this.props.selectedLanguage, renderedOn: this.props.renderedOn, selectedRowIdToDrag: this.props.rowId, isDraggableRow: true}) : null));
    };
    /**
     * Get Dragging Holder Div Style on dragging through grid.
     */
    DraggingRowHolder.prototype.getDraggingHolderDivStyle = function () {
        var mousePosition = standardisationSetUpStore.instance.mousePosition;
        return {
            'transform': 'translate(' + mousePosition.xPosition + 'px ,' +
                (mousePosition.yPosition - htmlUtilities.getOffsetTop('work-list-grid', false)) + 'px)'
        };
    };
    return DraggingRowHolder;
}(pureRenderComponent));
module.exports = DraggingRowHolder;
//# sourceMappingURL=draggingrowholder.js.map
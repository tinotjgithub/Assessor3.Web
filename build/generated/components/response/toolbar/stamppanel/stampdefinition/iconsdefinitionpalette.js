"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../../base/purerendercomponent');
var stampStore = require('../../../../../stores/stamp/stampstore');
var StampIcon = require('./stampicon');
var ToolbarIcon = require('./toolbaricon');
var icondata = require('./icondata.json');
var htmlUtilities = require('../../../../../utility/generic/htmlutilities');
var ToolbarSymbol = require('./toolbarsymbol');
var OVERLAY_MOVER = 'overlay-mover';
var OVERLAY_POINT = 'overlay-point-svg';
/**
 * React component class for Icons Definition.
 */
var IconsDefinitionPalette = (function (_super) {
    __extends(IconsDefinitionPalette, _super);
    /**
     * @constructor
     */
    function IconsDefinitionPalette(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * This function Refreshing component once the stamp data is loaded.
         */
        this.onStampLoaded = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
    }
    /**
     * This function gets called when the component is mounted
     */
    IconsDefinitionPalette.prototype.componentDidMount = function () {
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampLoaded);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    IconsDefinitionPalette.prototype.componentWillUnmount = function () {
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, this.onStampLoaded);
    };
    /**
     * Render method
     */
    IconsDefinitionPalette.prototype.render = function () {
        var style = {
            display: 'none'
        };
        // Retrieving the stamps required to be rendered in the Stamps panel
        var stamps = stampStore.instance.stampsAgainstAllQIGs;
        var isEdge = false;
        if (htmlUtilities.getUserDevice().browser === 'Edge') {
            isEdge = true;
        }
        // Loop through the keys and creating a list of SVG Icons for the stamps.
        var stampsList = stamps.map(function (stampData) {
            if (stampData.svgImage !== '' && stampData.svgImage !== undefined) {
                return (React.createElement(StampIcon, {id: stampData.name + '-icon', key: stampData.name + '-icon', svgImageData: stampData.svgImage, isEdge: isEdge}));
            }
        });
        return (React.createElement("svg", {version: '1.1', style: style}, React.createElement("defs", null, React.createElement(ToolbarIcon, {id: 'plus-icon', key: 'plus-icon', svgImageData: icondata.plus_icon}), React.createElement(ToolbarIcon, {id: 'icon-marking-comment', key: 'icon-marking-comment', svgImageData: icondata.icon_marking_comment}), React.createElement(ToolbarIcon, {id: 'new-message-icon', key: 'new-message-icon', svgImageData: icondata.new_message_icon}), React.createElement(ToolbarIcon, {id: 'icon-mag-glass', key: 'icon-mag-glass', svgImageData: icondata.icon_mag_glass}), React.createElement(ToolbarIcon, {id: 'icon-change-resp-view', key: 'icon-change-resp-view', svgImageData: icondata.icon_change_resp_view}), React.createElement(ToolbarIcon, {id: 'icon-fit-width', key: 'icon-fit-width', svgImageData: icondata.icon_fit_width}), React.createElement(ToolbarIcon, {id: 'icon-fit-height', key: 'icon-fit-height', svgImageData: icondata.icon_fit_height}), React.createElement(ToolbarIcon, {id: 'icon-rotate-left', key: 'icon-rotate-left', svgImageData: icondata.icon_rotate_left}), React.createElement(ToolbarIcon, {id: 'icon-rotate-right', key: 'icon-rotate-right', svgImageData: icondata.icon_rotate_right}), React.createElement(ToolbarIcon, {id: 'icon-bin', key: 'icon-bin', svgImageData: icondata.icon_bin}), React.createElement(ToolbarIcon, {id: 'delete-comment-icon', key: 'delete-comment-icon', svgImageData: icondata.delete_comment_icon}), React.createElement(ToolbarIcon, {id: 'exception-icon', key: 'exception-icon', svgImageData: icondata.exception_icon}), React.createElement(ToolbarIcon, {id: 'new-exception-icon', key: 'new-exception-icon', svgImageData: icondata.new_exception_icon}), React.createElement(ToolbarIcon, {id: 'message-icon', key: 'message-icon', svgImageData: icondata.message_icon}), React.createElement(ToolbarIcon, {id: 'icon-offpage-comment', key: 'icon-offpage-comment', svgImageData: icondata.icon_sideview_comment}), React.createElement(ToolbarIcon, {id: 'supervisor-remark-icon', key: 'icon-supervisor-remark', svgImageData: icondata.supervisor_remark_icon}), React.createElement(ToolbarIcon, {id: 'promote-seed-icon', key: 'icon-promote-seed', svgImageData: icondata.promote_seed_icon}), React.createElement(ToolbarIcon, {id: 'link-icon', key: 'link-icon', svgImageData: icondata.link_icon}), React.createElement(ToolbarIcon, {id: 'reject-rig-icon', key: 'icon-reject-rig', svgImageData: icondata.reject_rig_icon}), React.createElement(ToolbarIcon, {id: 'ruler', key: 'ruler', svgImageData: icondata.overlay_ruler_icon}), React.createElement(ToolbarIcon, {id: 'protractor', key: 'overlay-protractor-icon', svgImageData: icondata.overlay_protractor_icon}), React.createElement(ToolbarIcon, {id: 'add-bm-mark', key: 'add-bm-mark', svgImageData: icondata.bookmark_icon}), React.createElement(ToolbarIcon, {id: 'add-new-book-mark', key: 'add-new-book-mark', svgImageData: icondata.new_bookmark_icon}), React.createElement(ToolbarIcon, {id: 'select-bm-icon', key: 'select-bm-icon', svgImageData: icondata.select_bm_icon}), React.createElement(ToolbarIcon, {id: 'tool-delete', key: 'tool-delete', svgImageData: icondata.tool_delete}), React.createElement(ToolbarIcon, {id: 'icon-left-arrow-a', key: 'icon-left-arrow-a', svgImageData: icondata.go_back_icon}), React.createElement(ToolbarIcon, {id: 'multiline-overlay', key: 'multiline-overlay', svgImageData: icondata.overlay_multiline_icon}), React.createElement(ToolbarIcon, {id: 'unzoned-indicator', key: 'unzoned-indicator', svgImageData: icondata.unzoned_indicator}), React.createElement(ToolbarIcon, {id: 'v-icon-tick', key: 'v-icon-tick', svgImageData: icondata.v_icon_tick}), React.createElement(ToolbarSymbol, {id: 'h-mover-line', className: OVERLAY_MOVER, symbolData: icondata.horizontal_mover_line}), React.createElement(ToolbarSymbol, {id: 'cp-mover-line', className: OVERLAY_MOVER, symbolData: icondata.cp_mover_line}), React.createElement(ToolbarSymbol, {id: 'v-mover-line', className: OVERLAY_MOVER, symbolData: icondata.vertical_mover_line}), React.createElement(ToolbarSymbol, {id: 'overlay-point', className: OVERLAY_POINT, symbolData: icondata.overlay_point}), React.createElement(ToolbarSymbol, {id: 'overlay-point-hover', className: OVERLAY_POINT, symbolData: icondata.overlay_point_hover}), React.createElement(ToolbarIcon, {id: 'add-note', key: 'add-note', svgImageData: icondata.add_note}), React.createElement(ToolbarIcon, {id: 'note-icon', key: 'note-icon', svgImageData: icondata.note_icon}), stampsList)));
    };
    return IconsDefinitionPalette;
}(pureRenderComponent));
module.exports = IconsDefinitionPalette;
//# sourceMappingURL=iconsdefinitionpalette.js.map
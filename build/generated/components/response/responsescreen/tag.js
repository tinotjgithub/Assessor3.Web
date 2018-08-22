"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var classNames = require('classnames');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var tag = function (props) {
    // For light-green tag, in css class they are using a hyphen(-) but the same cannot be applied to an Enum.
    // So for light Green Tag, we are appending the class name through below condition.
    // For other tags, it works.
    var tagClass = props.tagType === enums.TagType.LightGreen ? ' light-green'
        : enums.getEnumString(enums.TagType, props.tagType).toLocaleLowerCase();
    /**
     * This method gets the title for the tag
     */
    var getTitleForTag = function () {
        var title;
        switch (props.tagType) {
            case enums.TagType.Empty:
                title = localeStore.instance.TranslateText('marking.worklist.tag-tooltips.no-tag');
                if (props.isSelected && props.isInList === false) {
                    title = localeStore.instance.TranslateText('marking.worklist.tag-tooltips.add-tag');
                }
                break;
            default:
                title = localeStore.instance.TranslateText('marking.worklist.tag-tooltips.' +
                    enums.getEnumString(enums.TagType, props.tagType).toLocaleLowerCase());
        }
        return title;
    };
    /**
     * handler for selection of tags from list (Callback).
     */
    var onSelection = function (event) {
        props.onSelection(props.tagType, event);
    };
    /**
     * handler for clicking on the tag to expand/collapse the list (Callback).
     */
    var onClickExpandAndCollapse = function (event) {
        props.onArrowClick(props.tagType, event);
    };
    // SVG element for tag icons
    var svgElements = React.createElement("g", {id: 'tag-icon'}, React.createElement("svg", {viewBox: '0 0 20 20', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("path", {d: 'M17.125,2.876l-5.553-0.799l-9.336,9.336l6.35,6.352l9.338-9.337L17.125,2.876z M15.145,7.39c-0.7,0.7-1.835,0.7-2.536,0c-0.7-0.699-0.7-1.833,0-2.532c0.7-0.7,1.836-0.7,2.536,0C15.845,5.557,15.845,6.69,15.145,7.39'}), React.createElement("path", {d: 'M17.59,2.41l-6.203-0.892L1.49,11.413l7.095,7.097l9.896-9.896L17.59,2.41z M8.585,17.02L2.98,11.413l8.779-8.776l4.9,0.705l0.704,4.899L8.585,17.02z', fill: 'currentColor'}), React.createElement("path", {d: 'M12.237,4.483c-0.904,0.905-0.904,2.374,0,3.278c0.453,0.453,1.045,0.679,1.64,0.679s1.188-0.226,1.64-0.679c0.904-0.904,0.904-2.373,0-3.278C14.614,3.581,13.14,3.579,12.237,4.483z M14.772,7.017c-0.494,0.496-1.296,0.493-1.791,0c-0.492-0.492-0.492-1.295,0-1.788c0.247-0.246,0.572-0.369,0.896-0.369s0.648,0.123,0.895,0.369C15.264,5.722,15.264,6.524,14.772,7.017z', fill: 'currentColor'}), React.createElement("path", {d: 'M9.127,8.035c-0.207-0.206-0.54-0.206-0.745,0c-0.207,0.206-0.207,0.539,0,0.745l2.838,2.839c0.103,0.102,0.239,0.153,0.373,0.153c0.136,0,0.27-0.052,0.373-0.153c0.206-0.207,0.206-0.54,0-0.746L9.127,8.035z', fill: 'currentColor'}), React.createElement("path", {d: 'M6.69,10.472c-0.206-0.206-0.539-0.206-0.745,0c-0.206,0.206-0.206,0.539,0,0.745l2.838,2.839c0.103,0.103,0.238,0.153,0.373,0.153s0.27-0.051,0.373-0.153c0.206-0.206,0.206-0.54,0-0.746L6.69,10.472z', fill: 'currentColor'}))));
    // SVG elements for highlighted tags
    var svgElementHighlight = React.createElement("g", {id: 'tag-highlight'}, React.createElement("svg", {viewBox: '0 0 20 20', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("path", {d: 'M13.877,4.859c-0.323,0-0.648,0.123-0.896,0.369c-0.492,0.493-0.492,1.296,0,1.788c0.494,0.493,1.295,0.496,1.791,0c0.492-0.492,0.492-1.295,0-1.788C14.525,4.982,14.2,4.859,13.877,4.859'}), React.createElement("path", {d: 'M19.524,8.464l-0.891-6.203L18.52,1.479l-0.78-0.11l-6.204-0.895L11.014,0.4l-0.373,0.373l-9.896,9.895L0,11.413l0.745,0.745l7.096,7.097L8.586,20l0.745-0.745l9.894-9.896l0.375-0.372L19.524,8.464z M8.586,18.51L1.49,11.413l9.896-9.896l6.203,0.895l0.891,6.201L8.586,18.51z'}))));
    // SVG Elements for no tags
    var svgElementEmpty = React.createElement("g", {id: 'tag-icon-empty'}, React.createElement("svg", {viewBox: '0 0 20 20', preserveAspectRatio: 'xMidYMid meet'}, React.createElement("g", null, React.createElement("path", {d: 'M17.59,2.41l-6.203-0.892L1.49,11.413l7.095,7.097l9.896-9.896L17.59,2.41z M8.585,17.02L2.98,11.413l8.779-8.776l4.9,0.705l0.704,4.899L8.585,17.02z', fill: 'currentColor'}), React.createElement("path", {d: 'M12.237,4.483c-0.904,0.905-0.904,2.374,0,3.278c0.453,0.453,1.045,0.679,1.64,0.679s1.188-0.226,1.64-0.679c0.904-0.904,0.904-2.373,0-3.278C14.614,3.581,13.14,3.579,12.237,4.483z M14.772,7.017c-0.494,0.496-1.296,0.493-1.791,0c-0.492-0.492-0.492-1.295,0-1.788c0.247-0.246,0.572-0.369,0.896-0.369s0.648,0.123,0.895,0.369C15.264,5.722,15.264,6.524,14.772,7.017z', fill: 'currentColor'}))));
    if (props.isInList) {
        return (React.createElement("a", {className: classNames('tag-menu-item-link', { ' current': props.isSelected }), title: getTitleForTag(), id: 'tag_item_' + props.tagType, onClick: onSelection}, React.createElement("span", {className: 'svg-icon tag'}, React.createElement("svg", {viewBox: '0 0 20 20', className: ' tag-icon ' + tagClass, id: 'tag_list_' + tagClass}, React.createElement("use", {xlinkHref: '#tag-icon' + (props.tagType === enums.TagType.Empty ? '-empty' : '')})))));
    }
    else {
        return (React.createElement("a", {className: 'tag-menu-anchor menu-button', id: (props.isFromWorklist ? ('tag_icon_' + props.id) : 'tag_icon'), title: getTitleForTag(), onClick: onClickExpandAndCollapse}, React.createElement("span", {className: 'svg-icon tag'}, React.createElement("svg", {viewBox: '0 0 20 20', className: ' tag-icon ' + tagClass, id: 'tag_color'}, React.createElement("use", {xlinkHref: '#tag-icon', className: 'non-empty-tag'}, svgElements), React.createElement("use", {xlinkHref: '#tag-icon-empty', className: 'empty-tag'}, svgElementEmpty), React.createElement("use", {xlinkHref: '#tag-highlight', className: 'highlight-tag'}, svgElementHighlight))), React.createElement("span", {className: 'sprite-icon toolexpand-icon' + (props.isFromWorklist ? '-grey' : '')})));
    }
};
module.exports = tag;
//# sourceMappingURL=tag.js.map
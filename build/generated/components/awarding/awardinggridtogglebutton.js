"use strict";
var _this = this;
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
/**
 * React component for Awarding Container
 */
var awardingGridToggleButton = function (props) {
    return (React.createElement("div", {className: 'items right', id: 'awardinggridtogglebutton', key: 'toggle-candidate-details-grid'}, React.createElement("ul", {className: 'filter-menu'}, React.createElement("li", {className: 'switch-view-btn', onClick: props.switchGridToggle.bind(_this)}, React.createElement("a", {id: 'toggle-candidate-details-text', href: 'javascript:void(0);', className: 'switch-view', title: !props.groupByGrade ?
        localeStore.instance.TranslateText('awarding.right-panel.order-by-grade') :
        localeStore.instance.TranslateText('awarding.right-panel.order-by-total-mark')}, React.createElement("span", {className: 'sprite-icon grid-view-icon'}), React.createElement("span", {className: 'view-text', id: props.groupByGrade ?
        'toggle-candidate-details-text-orderbygrade' :
        'toggle-candidate-details-text-totalmark'}, !props.groupByGrade ?
        localeStore.instance.TranslateText('awarding.right-panel.order-by-grade') :
        localeStore.instance.TranslateText('awarding.right-panel.order-by-total-mark')))))));
};
module.exports = awardingGridToggleButton;
//# sourceMappingURL=awardinggridtogglebutton.js.map
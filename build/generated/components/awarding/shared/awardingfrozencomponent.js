"use strict";
var React = require('react');
var enums = require('../../utility/enums');
var localeStoreData = require('../../../stores/locale/localestore');
/* tslint:disable:variable-name */
var ExpandableButton = function (props) {
    if (props.hasSub) {
        return (React.createElement("a", {href: 'javascript:void(0)', className: 'exp-collapse', id: props.id + '_expandableButton'}));
    }
    else {
        return null;
    }
};
/* tslint:disable:variable-name */
var GradeName = function (props) {
    var gradeName = React.createElement("a", {href: 'javascript:void(0)', className: 'examiner-name', id: props.id + '_examinerName'}, props.gradeName);
    return gradeName;
};
/* tslint:disable:variable-name */
var TotalMark = function (props) {
    var totalMark = React.createElement("a", {href: 'javascript:void(0)', className: 'examiner-name', id: props.id + '_examinerName'}, parseInt(props.totalMarkValue).toFixed(2));
    return totalMark;
};
/**
 * Stateless component for awarding candidate grid for frozen
 * @param props
 */
var awardingFrozenComponent = function (props) {
    return (React.createElement("div", {onClick: function () {
        props.callback(props.frozenColumn, !props.isExpanded, props.viewType, props.isParentItem, props.parentItemName);
    }}, React.createElement(ExpandableButton, {expandableItem: props.frozenColumn, id: props.id, key: 'key_ExpandButton_' + props.id, hasSub: props.hasSub, isExpanded: props.isExpanded, markGroupId: props.markGroupId, viewType: props.viewType, isParentItem: props.isParentItem, parentItemName: props.parentItemName, index: props.index, callback: props.callback}), props.viewType === enums.AwardingViewType.Grade ?
        React.createElement(GradeName, {id: props.id, key: 'key_Examiner_' + props.id, gradeName: localeStoreData.instance.TranslateText('awarding.right-panel.grade') + ' - ' + props.frozenColumn}) :
        React.createElement(TotalMark, {id: props.id, key: 'key_Examiner_' + props.id, totalMarkValue: props.frozenColumn})));
};
module.exports = awardingFrozenComponent;
//# sourceMappingURL=awardingfrozencomponent.js.map
"use strict";
var React = require('react');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Stateless component for Script ID column in Standardisation Setup Grid
 * @param props
 */
var rigorder = function (props) {
    /**
     * This mehod will return the classification type header
     * @param classificationType
     */
    function getHeaderBody(classificationType) {
        var element;
        if (classificationType) {
            element = (React.createElement("div", {id: props.id, className: props.className}, (localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.'
                + enums.MarkingMode[classificationType]))));
        }
        else {
            element = (React.createElement("span", {id: props.id, className: props.className}, props.rigOrder));
        }
        return element;
    }
    return (React.createElement("div", {className: 'header-data cursor-move'}, props.classificationType === undefined ?
        React.createElement("span", {className: 'sprite-icon drag-icon', title: 'Drag to change the order.'}) : null, getHeaderBody(props.classificationType)));
};
module.exports = rigorder;
//# sourceMappingURL=rigorder.js.map
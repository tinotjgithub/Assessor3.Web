"use strict";
/*
  React component for All pages not viewed indicator
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Stateless All files not viewed indicator component
 * @param props
 */
/* tslint:disable:variable-name */
var AllFilesNotViewedIndicator = function (props) {
    /* tslint:enable:variable-name */
    if (props.isECourseworkComponent && !props.allFilesViewed &&
        props.isMarkingCompleted) {
        return ((!props.isTileView) ?
            (React.createElement("div", {className: 'col-inner'}, React.createElement("span", {title: localeStore.instance.
                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip')}, React.createElement("span", {className: 'sprite-icon un-view-icon', id: 'allFilesNotViewed_' + props.id, key: 'allFilesNotViewed_' + props.id}, localeStore.instance.
                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip'))))) :
            (React.createElement("div", {className: 'icon-holder'}, React.createElement("div", {className: 'col wl-view-indicator', title: localeStore.instance.
                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip')}, React.createElement("div", {className: 'col-inner'}, React.createElement("span", {id: 'allFilesNotViewed_' + props.id, key: 'allFilesNotViewed_' + props.id, className: 'sprite-icon un-view-icon'}, localeStore.instance.
                TranslateText('marking.worklist.response-data.not-all-files-viewed-icon-tooltip')))))));
    }
    else {
        return null;
    }
};
module.exports = AllFilesNotViewedIndicator;
//# sourceMappingURL=allfilesnotviewedindicator.js.map
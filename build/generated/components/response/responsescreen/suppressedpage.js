"use strict";
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
/* tslint:disable:variable-name  */
/** Component for comment line */
var SuppressedPage = function (props) {
    /**
     * gets page number
     */
    function getPageNumber() {
        if (props.isAdditionalObject) {
            var additionalPageText = localeStore.instance.TranslateText('marking.full-response-view.script-page.additional-page-indicator');
            return additionalPageText + ' ' + props.additionalObjectPageOrder;
        }
        else {
            return props.imageOrder.toString();
        }
    }
    /**
     * gets page number
     */
    function getPageId() {
        if (props.isAdditionalObject) {
            return 'AdditionalPage_' + props.additionalObjectPageOrder;
        }
        else {
            return 'img_' + props.imageOrder.toString();
        }
    }
    if (props.isECourseworkComponent) {
        return null;
    }
    else {
        return (React.createElement("div", {className: 'marksheet-holder no-hover suppressed', id: getPageId(), key: 'suppressed_' + props.imageOrder}, React.createElement("div", {className: 'marksheet-holder-inner'}, React.createElement("div", {className: 'suppressed-image-holder', title: localeStore.instance.TranslateText('marking.full-response-view.script-page.suppressed-page-tooltip')}, React.createElement("div", {className: 'suppressed-icon-wrapper'}, React.createElement("div", {className: 'suppressed-icon-holder'}, React.createElement("span", {className: 'eye-icon-large sprite-icon'}), React.createElement("span", {className: 'suppressed-text'}, localeStore.instance.TranslateText('marking.full-response-view.script-page.suppressed-page')))))), props.showPageNumber === true ? React.createElement("div", {className: 'page-number with-icon'}, getPageNumber()) : ''));
    }
};
module.exports = SuppressedPage;
//# sourceMappingURL=suppressedpage.js.map
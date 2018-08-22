"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
/**
 * Message Holder to display that all pages are annotated in Fullresponse view
 * If the Only show unannotated pages option On and all pages annotated
 * @param props
 */
var annotatedMessageHolder = function (props) {
    var allPageAnnotatedText;
    var noUnannotatedPagesToDisplay;
    noUnannotatedPagesToDisplay = localeStore.instance.TranslateText('marking.full-response-view.all-' +
        (props.componentType === 2 ? 'additional-' : '') + 'pages-annotated-text-no-pages-to-display-full-response');
    allPageAnnotatedText = localeStore.instance.TranslateText('marking.full-response-view.all-' +
        (props.componentType === 2 ? 'additional-' : '') + 'pages-annotated-text-full-response');
    return (React.createElement("div", {className: 'annotated-message-holder'}, React.createElement("div", {className: 'message-seen'}, React.createElement("div", {className: 'seen-message-title'}, React.createElement("div", {className: 'seen-title-icon'}, React.createElement("svg", {viewBox: '0 0 40 20', preserveAspectRatio: 'xMinYMid meet', textAnchor: 'middle'}, React.createElement("text", {id: 'all-annotated-seen-stamp-text', className: 'caption bolder', x: '20', y: '10', dy: '5'}, localeStore.instance.TranslateText('marking.response.stamps.stamp_811'))))), React.createElement("div", {className: 'seen-message-content'}, React.createElement("h4", {className: 'bolder', id: 'all-annotated-text'}, allPageAnnotatedText), React.createElement("p", {id: 'all-annotated-no-pages-text'}, noUnannotatedPagesToDisplay)))));
};
module.exports = annotatedMessageHolder;
//# sourceMappingURL=annotatedmessageholder.js.map
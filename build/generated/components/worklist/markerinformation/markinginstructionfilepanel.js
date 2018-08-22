"use strict";
var React = require('react');
/**
 * Marking instruction file name panel for download marking instruction pdf.
 * @param props
 */
var markingInstructionFilePanel = function (props) {
    return (React.createElement("a", {href: 'javascript:void(0)', id: 'markinginstructionlink_' + props.documentId, title: props.documentName, onClick: function (e) {
        e.preventDefault();
        e.stopPropagation();
        props.onMarkInstructionFileClick(props.documentId);
    }}, props.documentName));
};
module.exports = markingInstructionFilePanel;
//# sourceMappingURL=markinginstructionfilepanel.js.map
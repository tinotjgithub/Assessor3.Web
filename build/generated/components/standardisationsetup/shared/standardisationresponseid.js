"use strict";
var React = require('react');
var ResponseIdGridElement = require('../../worklist/shared/responseidgridelement');
/**
 * Stateless component for Note column in Classification Grid
 * @param props
 */
var stdResponseId = function (props) {
    return (React.createElement("div", {className: 'col wl-id'}, React.createElement("div", {className: 'col-inner'}, React.createElement(ResponseIdGridElement, {selectedLanguage: props.selectedLanguage, displayId: props.displayId, isClickable: props.isResponseIdClickable, id: props.id, key: 'key_response_id_grid_element_' + props.id, isTileView: false}))));
};
module.exports = stdResponseId;
//# sourceMappingURL=standardisationresponseid.js.map
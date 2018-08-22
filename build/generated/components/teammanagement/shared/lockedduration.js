"use strict";
var React = require('react');
/**
 * Stateless component for Locked Duration column in MyTeam Grid
 * @param props
 */
var lockedDuration = function (props) {
    return (React.createElement("span", {className: 'small-text dim-text'}, props.lockedDuration));
};
module.exports = lockedDuration;
//# sourceMappingURL=lockedduration.js.map
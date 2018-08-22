"use strict";
var React = require('react');
/**
 * Stateless component for locked By  column in MyTeam Grid
 * @param props
 */
var lockedBy = function (props) {
    return (React.createElement("span", {className: 'small-text dim-text'}, props.lockedByExaminerName));
};
module.exports = lockedBy;
//# sourceMappingURL=lockedby.js.map
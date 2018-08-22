"use strict";
var React = require('react');
/**
 * Stateless component for generic text element column in MyTeam Grid
 * @param props
 */
var teamCellElement = function (props) {
    return (React.createElement("span", {id: 'team_' + props.id, className: props.classValue}, props.textValue));
};
module.exports = teamCellElement;
//# sourceMappingURL=teamcellelement.js.map
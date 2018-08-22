"use strict";
var _this = this;
var React = require('react');
var enums = require('../../utility/enums');
var localeStore = require('../../../stores/locale/localestore');
var stringFormatHelper = require('../../../utility/stringformat/stringformathelper');
var markCheckExaminers = function (props) {
    var that = _this;
    var toRender = props.markCheckExaminers.map(function (examinerData) {
        var examinerIndex = props.markCheckExaminers.indexOf(examinerData) + 1;
        var roleText = 'examiner-roles.' + enums.ExaminerRole[examinerData.roleID];
        var _className = 'profile-info';
        if (examinerData.isSelected) {
            _className = _className + ' active';
        }
        var formattedString = stringFormatHelper.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', examinerData.toExaminer.initials);
        formattedString = formattedString.replace('{surname}', examinerData.toExaminer.surname);
        return (React.createElement("div", {className: _className, id: 'markCheckRequestedExaminerInfo_' + examinerIndex, onClick: function () { props.onExaminerClick(examinerData.fromExaminerID); }}, React.createElement("a", {className: 'examiner-info relative clearfix'}, React.createElement("div", {className: 'user-photo-holder user-medium-icon sprite-icon'}), React.createElement("div", {className: 'user-details-holder'}, React.createElement("div", {className: 'user-name large-text'}, formattedString), React.createElement("div", {className: 'designation small-text'}, localeStore.instance.TranslateText('generic.' + roleText))))));
    });
    return (React.createElement("div", {className: 'column-left-inner'}, toRender));
};
module.exports = markCheckExaminers;
//# sourceMappingURL=markcheckexaminers.js.map
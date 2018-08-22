"use strict";
require('../../content/css/main.less');
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var reactDom = require('react-dom');
/* tslint:disable:variable-name */
var Logging;
var Navigator;
var MessageComposeWrapper;
/* tslint:disable:variable-name */
require.ensure(['../components/logging/logging',
    '../components/navigator',
    '../components/message/messagecomposewrapper'], function () {
    Logging = require('../components/logging/logging');
    Navigator = require('../components/navigator');
    MessageComposeWrapper = require('../components/message/messagecomposewrapper');
    reactDom.render((React.createElement("div", {className: 'page-wrapper'}, React.createElement(MessageComposeWrapper, null), React.createElement(Logging, null), React.createElement(Navigator, null))), document.getElementById('content'));
});
//# sourceMappingURL=app.js.map
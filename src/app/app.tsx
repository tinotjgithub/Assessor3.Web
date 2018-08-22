require('../../content/css/main.less');
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import reactDom = require('react-dom');

/* tslint:disable:variable-name */
let Logging;
let Navigator;
let MessageComposeWrapper;
/* tslint:disable:variable-name */

require.ensure(['../components/logging/logging',
    '../components/navigator',
    '../components/message/messagecomposewrapper'],
    function () {
        Logging = require('../components/logging/logging');
        Navigator = require('../components/navigator');
        MessageComposeWrapper = require('../components/message/messagecomposewrapper');

        reactDom.render((
            <div className='page-wrapper'>
                <MessageComposeWrapper />
                <Logging/>
                <Navigator/>
            </div>

        ), document.getElementById('content'));
    });








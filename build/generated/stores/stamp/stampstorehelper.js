/// <reference path="typings/stamphelper.ts" />
"use strict";
var stampStore = require('./stampstore');
var StampStoreHelper = (function () {
    function StampStoreHelper() {
    }
    /**
     * To check whether the onpagecomment is open or not
     */
    StampStoreHelper.prototype.isOnpageCommentOpen = function () {
        return stampStore.instance.SelectedOnPageCommentClientToken !== undefined ||
            stampStore.instance.SelectedSideViewCommentToken !== undefined;
    };
    return StampStoreHelper;
}());
module.exports = StampStoreHelper;
//# sourceMappingURL=stampstorehelper.js.map
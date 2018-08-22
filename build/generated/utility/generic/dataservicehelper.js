"use strict";
var workListStore = require('../../stores/worklist/workliststore');
var DataServiceHelper = (function () {
    function DataServiceHelper() {
    }
    /**
     * Returns a boolean value indicating whether data can be retrieved from cache.
     */
    DataServiceHelper.canUseCache = function () {
        return workListStore.instance.getIsResponseClose;
    };
    return DataServiceHelper;
}());
module.exports = DataServiceHelper;
//# sourceMappingURL=dataservicehelper.js.map
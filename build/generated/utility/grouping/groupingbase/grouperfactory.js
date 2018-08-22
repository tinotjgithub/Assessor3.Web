"use strict";
var grouperList = require('./grouperlist');
var qigSelectorGrouper = require('../groupers/qigselectorgrouper');
var stampsGrouper = require('../groupers/stampsgrouper');
var messageGrouper = require('../groupers/messagegrouper');
var GrouperFactory = (function () {
    function GrouperFactory() {
    }
    /**
     * returns the grouper object.
     * @param comparerName - Name of the grouper - should be a member of the GrouperList enum.
     */
    GrouperFactory.prototype.getGrouper = function (grouperName) {
        /** instance of groupers to be registered in this factory */
        var _qigSelectorGrouper = new qigSelectorGrouper(); // instance of Qig Selector Grouper.
        var _stampsGrouper = new stampsGrouper(); // instance of Stamps Grouper
        var _messagegrouper = new messageGrouper();
        /**
         * Using object literals to achieve the switch statements.
         * Key is the grouper name which is stored in grouperList (an enum) and value is the grouper object.
         */
        var groupers = (_a = {},
            _a[grouperList.QigSelectorGrouper] = _qigSelectorGrouper,
            _a[grouperList.StampsGrouper] = _stampsGrouper,
            _a[grouperList.MessageQigGrouper] = _messagegrouper,
            _a
        );
        /** returns the grouper object corresponding to the name */
        return groupers[grouperName];
        var _a;
    };
    return GrouperFactory;
}());
var grouperFactory = new GrouperFactory();
module.exports = grouperFactory;
//# sourceMappingURL=grouperfactory.js.map
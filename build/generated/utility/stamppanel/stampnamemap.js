"use strict";
var StampNameMap = (function () {
    function StampNameMap() {
    }
    /**
     * Mapping Current stamp name to compatible with the css if needed.
     * @param {string} currentStampName
     * @returns
     */
    StampNameMap.map = function (currentStampName) {
        var result = '';
        switch (currentStampName) {
            case 'On Page Comment':
                result = 'Comment';
                break;
            default:
                result = currentStampName;
                break;
        }
        return result;
    };
    return StampNameMap;
}());
module.exports = StampNameMap;
//# sourceMappingURL=stampnamemap.js.map
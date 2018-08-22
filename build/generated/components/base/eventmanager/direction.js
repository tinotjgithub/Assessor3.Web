"use strict";
var Direction;
(function (Direction) {
    /**
     * Enum for the Login Form components
     *
     * @export DirectionOptions
     * @enum {number}
     */
    (function (DirectionOptions) {
        DirectionOptions[DirectionOptions["DIRECTION_NONE"] = 1] = "DIRECTION_NONE";
        DirectionOptions[DirectionOptions["DIRECTION_LEFT"] = 2] = "DIRECTION_LEFT";
        DirectionOptions[DirectionOptions["DIRECTION_RIGHT"] = 4] = "DIRECTION_RIGHT";
        DirectionOptions[DirectionOptions["DIRECTION_UP"] = 8] = "DIRECTION_UP";
        DirectionOptions[DirectionOptions["DIRECTION_DOWN"] = 16] = "DIRECTION_DOWN";
        DirectionOptions[DirectionOptions["DIRECTION_HORIZONTAL"] = 6] = "DIRECTION_HORIZONTAL";
        DirectionOptions[DirectionOptions["DIRECTION_VERTICAL"] = 24] = "DIRECTION_VERTICAL";
        DirectionOptions[DirectionOptions["DIRECTION_ALL"] = 30] = "DIRECTION_ALL";
    })(Direction.DirectionOptions || (Direction.DirectionOptions = {}));
    var DirectionOptions = Direction.DirectionOptions;
})(Direction || (Direction = {}));
module.exports = Direction;
//# sourceMappingURL=direction.js.map
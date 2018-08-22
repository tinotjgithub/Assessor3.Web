module Direction {

    /**
     * Enum for the Login Form components
     * 
     * @export DirectionOptions
     * @enum {number}
     */
    export enum DirectionOptions {
        DIRECTION_NONE = 1,
        DIRECTION_LEFT = 2,
        DIRECTION_RIGHT = 4,
        DIRECTION_UP = 8,
        DIRECTION_DOWN = 16,
        DIRECTION_HORIZONTAL = 6,
        DIRECTION_VERTICAL = 24,
        DIRECTION_ALL =  30
    }
}

export = Direction;
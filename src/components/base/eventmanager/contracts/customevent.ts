type Point = { x: number, y: number };

interface EventCustom {

    /** Hammer related fields */
    destroy(): void;
    /** Hammer related fields */
    handler(): void;
    /** Hammer related fields */
    init(): void;

    /** Name of the event. Like panstart. */
    /* tslint:disable:no-reserved-keywords */
    type: string;
    /* tslint:enable:no-reserved-keywords */

    /** Movement of the X axis. */
    deltaX: number;

    /** Movement of the Y axis. */
    deltaY: number;

    /** Total time in ms since the first input. */
    deltaTime: number;

    /** Distance moved. */
    distance: number;

    /** Angle moved. */
    angle: number;

    /** Velocity on the X axis, in px/ms. */
    velocityX: number;

    /** Velocity on the Y axis, in px/ms */
    velocityY: number;

    /** Highest velocityX/Y value. */
    velocity: number;

    /** Direction moved. Matches the DIRECTION constants. */
    direction: number;

    /** Direction moved from it's starting point. Matches the DIRECTION constants. */
    offsetDirection: number;

    /** Scaling that has been done when multi-touch. 1 on a single touch. */
    scale: number;

    /** Rotation that has been done when multi-touch. 0 on a single touch. */
    rotation: number;

    /** Center position for multi-touch, or just the single pointer. */
    center: Point;

    /** Source event object, type TouchEvent, MouseEvent or PointerEvent. */
    srcEvent: TouchEvent | MouseEvent | PointerEvent;

    /** Target that received the event. */
    target: HTMLElement;

    /** Primary pointer type, could be touch, mouse, pen or kinect. */
    pointerType: string;

    /** Event type, matches the INPUT constants. */
    eventType: number;

    /** true when the first input. */
    isFirst: boolean;

    /** true when the final (last) input. */
    isFinal: boolean;

    /** Array with all pointers, including the ended pointers (touchend, mouseup). */
    pointers: any[];

    /** Array with all new/moved/lost pointers. */
    changedPointers: any[];

    /** Reference to the srcEvent.preventDefault() method. Only for experts! */
    preventDefault: Function;

    /** end of hammer related fields */
}
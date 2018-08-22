import Hammer = require('hammerjs');
import eventTypes = require('./eventtypes');
type FunctionType = (event: EventCustom) => void;

class HammerHandler implements EventManager {
    protected hm: HammerManager;

    /**
     * initialise event handlers
     */
    public initEvents = (element: Element, touchAction?: string, domEvents?: boolean) => {
        if (touchAction && domEvents) {
            this.hm = new Hammer(element as HTMLElement, {
                touchAction: touchAction,
                domEvents: domEvents
            });
        } else {
            this.hm = new Hammer(element as HTMLElement);
        }
    };

    /**
     * This method is used to hook various event types
     * eventType: string - using eventTypes string constants
     * handler : callback function for event handler
     */
    public on = (eventType: string, handler: FunctionType) => {
        switch (eventType) {

            case eventTypes.PAN:
            case eventTypes.PAN_START:
            case eventTypes.PAN_END:
            case eventTypes.PAN_MOVE:
            case eventTypes.PAN_CANCEL:
            case eventTypes.PAN_LEFT:
            case eventTypes.PAN_RIGHT:
            case eventTypes.PAN_UP:
            case eventTypes.PAN_DOWN:
            case eventTypes.TAP:
            case eventTypes.PRESS:
            case eventTypes.PRESS_UP:
            case eventTypes.SWIPE_LEFT:
            case eventTypes.SWIPE_RIGHT:
            case eventTypes.SWIPE_UP:
            case eventTypes.SWIPE_DOWN:
            case eventTypes.SWIPE:
            case eventTypes.PINCH:
            case eventTypes.PINCH_START:
            case eventTypes.PINCH_IN:
            case eventTypes.PINCH_OUT:
            case eventTypes.PINCH_END:
            case eventTypes.PINCH_CANCEL:
                this.hm.on(eventType, (evnt: HammerInput) => {
                    handler(evnt);
                });
                break;
            case eventTypes.INPUT:
                this.hm.on('hammer.input', (evnt: HammerInput) => {
                    handler(evnt);
                });
                break;
        }
    };

    /**
     * This method is used to remove letious event types
     * eventType: string - using eventTypes string constants
     * handler : callback function for event handler
     */
    public off = (eventType: string, handler: FunctionType) => {
        switch (eventType) {
            case eventTypes.PAN:
            case eventTypes.PAN_START:
            case eventTypes.PAN_END:
            case eventTypes.PAN_MOVE:
            case eventTypes.PAN_CANCEL:
            case eventTypes.PAN_LEFT:
            case eventTypes.PAN_RIGHT:
            case eventTypes.PAN_UP:
            case eventTypes.PAN_DOWN:
            case eventTypes.TAP:
            case eventTypes.PRESS:
            case eventTypes.PRESS_UP:
            case eventTypes.SWIPE_LEFT:
            case eventTypes.SWIPE_RIGHT:
            case eventTypes.SWIPE_UP:
            case eventTypes.SWIPE_DOWN:
            case eventTypes.SWIPE:
            case eventTypes.PINCH:
            case eventTypes.PINCH_START:
            case eventTypes.PINCH_IN:
            case eventTypes.PINCH_OUT:
            case eventTypes.PINCH_END:
            case eventTypes.PINCH_CANCEL:
                this.hm.off(eventType, (evnt: HammerInput) => {
                    handler(evnt);
                });
                break;
            case eventTypes.INPUT:
                this.hm.off('hammer.input', (evnt: HammerInput) => {
                    handler(evnt);
                });
                break;
        }
    };

    /* tslint:disable:no-reserved-keywords */
    /**
     * Add hammer recognizers with options
     */
    public get = (eventType: string, options: any) => {
        this.hm.get(eventType).set(options);
    };
    /* tslint:disable:no-reserved-keywords */

    /**
     * stops hammer manager
     */
    public stop = (force: boolean) => {
        if (this.hm) {
            this.hm.stop(force);
        }
    };

    /**
     * unsubscribing hammer touch events and handlers
     */
    public destroy = () => {
        if (this.hm) {
            this.hm.stop(true);
            this.hm.destroy();
        }
        this.hm = null;
    };

    /**
     * stop propagation
     */
    public stopPropagation = (event: any) => {
        event.srcEvent.stopPropagation();
    };

    /**
     * check whether the hammer is initialized or not
     */
    public get isInitialized() {
        if (this.hm && this.hm !== null) {
            return true;
        } else {
            return false;
        }
    }
}

export = HammerHandler;
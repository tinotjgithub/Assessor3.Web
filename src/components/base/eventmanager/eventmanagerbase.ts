import hammerHandler = require('./hammerhandler');
import pureRenderComponent = require('../../base/purerendercomponent');

/**
 * Base class for handling letious event types using this class object we can
 * switch between hammer and native events
 */
class EventManagerBase extends pureRenderComponent<any, any> {

    private _hammerHandler: EventManager;

    /**
     * event manager constructor
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

   /**
    * returns the current event handler
    */
   public get eventHandler(): EventManager {
       if (!this._hammerHandler) {
           this._hammerHandler = new hammerHandler();
       }
       return this._hammerHandler;
   }
}

export = EventManagerBase;
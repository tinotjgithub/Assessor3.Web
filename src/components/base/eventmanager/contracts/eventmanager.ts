/* tslint:disable:no-reserved-keywords */
interface EventManager {
    initEvents: (element: Element, touchAction?: string, domEvents?: boolean) => void;
    on: CustomEventType;
    off: CustomEventType;
    get: (eventType: string, options: any) => void;
    destroy: () => void;
    stop?: (force: boolean) => void;
    isInitialized: boolean;
    stopPropagation: (event: EventCustom) => void;
}
/* tslint:enable:no-reserved-keywords */
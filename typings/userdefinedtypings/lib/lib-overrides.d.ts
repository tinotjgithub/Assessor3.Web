interface Element {
    offsetHeight: number;
    offsetLeft: number;
    offsetTop: number;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: any): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: any): void;
}

interface TouchEvent extends UIEvent {
    changedPointers: TouchList;
}

interface Window {
    clipboardData: any
}

interface Navigator {
    browserLanguage: string;
}

interface ClientRectDOM {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
}

interface MediaError {
    readonly message: string;
}
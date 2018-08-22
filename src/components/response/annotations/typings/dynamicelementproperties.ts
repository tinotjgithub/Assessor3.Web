/* properties for dynamic annotation */

interface DynamicElementProperties {
    event: EventCustom;
    innerHTML: string;
    holderElement: Element;
    stamp: number;
    clientRect: ClientRect;
    visible: boolean;
}

export = DynamicElementProperties;
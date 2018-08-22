interface CustomEventType {
    (eventType: string, handler: (event: any) => void): void;
}
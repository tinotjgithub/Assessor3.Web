/**
 * Entity class for busy indicator
 */
class BusyIndicatorParameter {
    private busyIndicatorText: string;
    private style: string;

    /**
     * Initializing new instance of busy indicator entity.
     */
    constructor(busyIndicatorText: string, style: string) {
        this.busyIndicatorText = busyIndicatorText;
        this.style = style;
    }

    /**
     * Returns back the text to be shown in the busy indicator
     */
    public get BusyIndicatorText(): string {
        return this.busyIndicatorText;
    }

    /**
     * Returns busy indicator style
     */
    public get BusyIndicatorStyle(): string {
        return this.style;
    }
}

export = BusyIndicatorParameter;
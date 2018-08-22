/**
 * Class for custom error
 */
class CustomError extends Error {
    /** The component name */
    public moduleName: string;
    /** The error message */
    public message: string;
    /* Header string for the Message*/
    public headerText: string;
    /* boolean value to indicate whether we have to show error icon or not*/
    public showErrorIcon: boolean;

    /**
     * Constructor CustomError
     * @param module
     * @param message
     * @param header
     * @param showErrorIcon
     */
    constructor(moduleName: string, message: string, header: string, showErrorIcon: boolean) {
        super(message);
        this.moduleName = moduleName;
        this.message = message;
        this.headerText = header;
        this.showErrorIcon = showErrorIcon;
    }
}

export = CustomError;
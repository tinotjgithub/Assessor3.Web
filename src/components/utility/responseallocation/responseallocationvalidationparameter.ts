/**
 * Entity class for response allocation validation
 */
class ResponseAllocationValidationParameter {
    private errorDialogHeaderText: string;
    private errorDialogContentText: string;
    private responseAllocateButtonVisibility: boolean;

    /**
     * Initializing new instance of response allocation validation entity.
     */
    constructor(errorDialogHeaderText: string, errorDialogContentText: string, responseAllocateButtonVisibility: boolean) {
        this.errorDialogHeaderText = errorDialogHeaderText;
        this.errorDialogContentText = errorDialogContentText;
        this.responseAllocateButtonVisibility = responseAllocateButtonVisibility;
    }

    /**
     * Returns back the Resource Key for Error Dialog Header Text
     */
    public get ErrorDialogHeaderText(): string {
        return this.errorDialogHeaderText;
    }

    /**
     * Returns back the Resource Key for Error Dialog Content Text
     */
    public get ErrorDialogContentText(): string {
        return this.errorDialogContentText;
    }

    /**
     * Returns back the visibility for the Allocate New Response button
     */
    public get ResponseAllocateButtonVisibility(): boolean {
        return this.responseAllocateButtonVisibility;
    }
}

export = ResponseAllocationValidationParameter;
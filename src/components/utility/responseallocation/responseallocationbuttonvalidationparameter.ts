/**
 * Entity class for response allocation button validation
 */
class ResponseAllocationButtonValidationParameter {
    private responseAllocationButtonMainText: string;
    private responseAllocationButtonSubText: string;
    private isResponseAllocateButtonVisible: boolean;
    private isResponseAllocateButtonEnabled: boolean;
    private isWorklistInformationBannerVisible: boolean;
    private responseAllocationButtonTitle: string;
    private responseAllocationButtonSingleResponseText: string;
    private responseAllocationButtonUpToOpenResponseText: string;
    private isWholeResponseResponseAllocationButtonAvailable: boolean;

    /**
     * Initializing new instance of response allocation button validation entity.
     */
    constructor(responseAllocationButtonMainText: string,
                responseAllocationButtonSubText: string,
                isResponseAllocateButtonVisible: boolean,
                isResponseAllocateButtonEnabled: boolean,
                isWorklistInformationBannerVisible: boolean,
                responseAllocationButtonTitle: string,
                responseAllocationButtonSingleResponseText: string,
                responseAllocationButtonUpToOpenResponseText: string,
                isWholeResponseResponseAllocationButtonAvailable: boolean) {

        this.responseAllocationButtonMainText = responseAllocationButtonMainText;
        this.responseAllocationButtonSubText = responseAllocationButtonSubText;
        this.isResponseAllocateButtonVisible = isResponseAllocateButtonVisible;
        this.isResponseAllocateButtonEnabled = isResponseAllocateButtonEnabled;
        this.isWorklistInformationBannerVisible = isWorklistInformationBannerVisible;
        this.responseAllocationButtonTitle = responseAllocationButtonTitle;
        this.responseAllocationButtonSingleResponseText = responseAllocationButtonSingleResponseText;
        this.responseAllocationButtonUpToOpenResponseText = responseAllocationButtonUpToOpenResponseText;
        this.isWholeResponseResponseAllocationButtonAvailable = isWholeResponseResponseAllocationButtonAvailable;
    }

    /**
     * Returns back the Resource Key for Error Dialog Header Text
     */
    public get ResponseAllocationButtonMainText(): string {
        return this.responseAllocationButtonMainText;
    }

    /**
     * Returns back the Resource Key for Error Dialog Header Text
     */
    public get ResponseAllocationButtonSubText(): string {
        return this.responseAllocationButtonSubText;
    }

    /**
     * Returns back the Resource Key for Error Dialog Header Text
     */
    public get IsResponseAllocateButtonVisible(): boolean {
        return this.isResponseAllocateButtonVisible;
    }

    /**
     * Returns back the Resource Key for Error Dialog Header Text
     */
    public get IsResponseAllocateButtonEnabled(): boolean {
        return this.isResponseAllocateButtonEnabled;
    }

    /**
     * Returns back if the worklist banner should be visible or not
     */
    public get IsWorklistInformationBannerVisible(): boolean {
        return this.isWorklistInformationBannerVisible;
    }

    /**
     * Returns back the Resource Key for Title for response button
     */
    public get ResponseAllocationButtonTitle(): string {
        return this.responseAllocationButtonTitle;
    }

    /**
     * Returns back the Resource Key for Single Response Text
     */
    public get ResponseAllocationButtonSingleResponseText(): string {
        return this.responseAllocationButtonSingleResponseText;
    }

    /**
     * Returns back the Resource Key for Up To Open Response Text
     */
    public get ResponseAllocationButtonUpToOpenResponseText(): string {
        return this.responseAllocationButtonUpToOpenResponseText;
    }

    /**
     * Returns back the Resource Key for Whole Response enbled
     */
    public get IsWholeResponseResponseAllocationButtonAvailable(): boolean {
        return this.isWholeResponseResponseAllocationButtonAvailable;
    }

}

export = ResponseAllocationButtonValidationParameter;
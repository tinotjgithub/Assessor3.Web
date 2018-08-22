class NavigationWarningInfo {
    private _warningMessageHeader: string;
    private _warningMessageContent: string;
    private _warningMessageYesButtonText: string;
    private _warningMessageNoButtonText: string;

    public get warningMessageHeader(): string {
        return this._warningMessageHeader;
    }

    public set warningMessageHeader(_warningMessageHeader: string) {
        this._warningMessageHeader = _warningMessageHeader;
    }

    public get warningMessageContent(): string {
        return this._warningMessageContent;
    }

    public set warningMessageContent(_warningMessageContent: string) {
        this._warningMessageContent = _warningMessageContent;
    }

    public get warningMessageNoButtonText(): string {
        return this._warningMessageNoButtonText;
    }

    public set warningMessageNoButtonText(_warningMessageNoButtonText: string) {
        this._warningMessageNoButtonText = _warningMessageNoButtonText;
    }

    public get warningMessageYesButtonText(): string {
        return this._warningMessageYesButtonText;
    }

    public set warningMessageYesButtonText(_warningMessageYesButtonText: string) {
        this._warningMessageYesButtonText = _warningMessageYesButtonText;
    }
}

export = NavigationWarningInfo;
class UserInfoArgument {
    private initials: string;
    private surname: string;
    private emailAddress: string;
    private username: string;
	private isLogoutConfirmation: boolean;
	private isEligibleForScriptAvailableEmailAlert: boolean;

    /**
     * Initializing new instance of User info argumenet.
     * @param {string} initials
     * @param {string} surname
     * @param {string} emailaddress
     */
	constructor(initials: string, surname: string, emailaddress: string, username: string, isEligibleForScriptAvailableEmailAlert: boolean,
		isLogoutConfirmation?: boolean) {
		this.initials = initials;
		this.surname = surname;
		this.emailAddress = emailaddress;
		this.username = username;
		this.isLogoutConfirmation = isLogoutConfirmation;
		this.isEligibleForScriptAvailableEmailAlert = isEligibleForScriptAvailableEmailAlert;
	}

    /**
     * Get the formated user name
     * @returns username
     */
    public get UserName(): string {
        return this.username;
    }

    /**
     * Gets the email address
     * @returns emailAddress
     */
    public get Email(): string {
        return this.emailAddress;
    }

    /**
     * Get the logged in markers iniatals
     * @returns initials
     */
    public get Initials(): string {
        return this.initials;
    }

    /**
     * Get the logged in markers iniatals
     * @returns surname
     */
    public get Surname(): string {
        return this.surname;
    }
   /**
    * Get the logout confirmation flag
    * @returns logout confirmation
    */
    public get IsLogoutConfirmation(): boolean {
        return (this.isLogoutConfirmation) ? this.isLogoutConfirmation : true;
	}

	/**
	 * Get the script available confirmation for email alert
	 * @returns script available confirmation
	 */
	public get IsEligibleForScriptAvailableEmailAlert(): boolean {
		return this.isEligibleForScriptAvailableEmailAlert;
	}
}
export = UserInfoArgument;
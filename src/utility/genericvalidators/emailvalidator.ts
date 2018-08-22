/**
 * Email validator.
 */
class EmailValidator {
    /**
     * validate the email
     * @param emailAddress
     */
    public ValidateEmail(emailAddress: string): boolean {
        /* tslint:disable max-line-length */
        let EMAIL_REG_EX = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        /* tslint:disable max-line-length */
        if (EMAIL_REG_EX.test(emailAddress)) {
            return (true);
        }
        return (false);
    }
}

export = EmailValidator;
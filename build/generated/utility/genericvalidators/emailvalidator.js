"use strict";
/**
 * Email validator.
 */
var EmailValidator = (function () {
    function EmailValidator() {
    }
    /**
     * validate the email
     * @param emailAddress
     */
    EmailValidator.prototype.ValidateEmail = function (emailAddress) {
        /* tslint:disable max-line-length */
        var EMAIL_REG_EX = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        /* tslint:disable max-line-length */
        if (EMAIL_REG_EX.test(emailAddress)) {
            return (true);
        }
        return (false);
    };
    return EmailValidator;
}());
module.exports = EmailValidator;
//# sourceMappingURL=emailvalidator.js.map
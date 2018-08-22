"use strict";
var UserInfoArgument = (function () {
    /**
     * Initializing new instance of User info argumenet.
     * @param {string} initials
     * @param {string} surname
     * @param {string} emailaddress
     */
    function UserInfoArgument(initials, surname, emailaddress, username, isEligibleForScriptAvailableEmailAlert, isLogoutConfirmation) {
        this.initials = initials;
        this.surname = surname;
        this.emailAddress = emailaddress;
        this.username = username;
        this.isLogoutConfirmation = isLogoutConfirmation;
        this.isEligibleForScriptAvailableEmailAlert = isEligibleForScriptAvailableEmailAlert;
    }
    Object.defineProperty(UserInfoArgument.prototype, "UserName", {
        /**
         * Get the formated user name
         * @returns username
         */
        get: function () {
            return this.username;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoArgument.prototype, "Email", {
        /**
         * Gets the email address
         * @returns emailAddress
         */
        get: function () {
            return this.emailAddress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoArgument.prototype, "Initials", {
        /**
         * Get the logged in markers iniatals
         * @returns initials
         */
        get: function () {
            return this.initials;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoArgument.prototype, "Surname", {
        /**
         * Get the logged in markers iniatals
         * @returns surname
         */
        get: function () {
            return this.surname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoArgument.prototype, "IsLogoutConfirmation", {
        /**
         * Get the logout confirmation flag
         * @returns logout confirmation
         */
        get: function () {
            return (this.isLogoutConfirmation) ? this.isLogoutConfirmation : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserInfoArgument.prototype, "IsEligibleForScriptAvailableEmailAlert", {
        /**
         * Get the script available confirmation for email alert
         * @returns script available confirmation
         */
        get: function () {
            return this.isEligibleForScriptAvailableEmailAlert;
        },
        enumerable: true,
        configurable: true
    });
    return UserInfoArgument;
}());
module.exports = UserInfoArgument;
//# sourceMappingURL=userinfoargument.js.map
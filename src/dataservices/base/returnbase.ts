// interface for all api return objects
interface ReturnBase {
    // Holds error message
    ErrorMessage: string;
    // Holds return status
    Success: boolean;
}
export = ReturnBase;
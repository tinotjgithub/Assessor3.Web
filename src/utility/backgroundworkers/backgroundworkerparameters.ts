/**
 * Class for background worker parameters
 */
class BackgroundWorkerParameters {

    // Holds the base URL
    public baseUrl: string;

    // Holds the current login session's security token
    ////public securityToken: string;

    // Holds the request method (whether POST or GET)
    public requestMethod: string;

    // Holds whether cross domain requests are allowed or not
    public allowCors: boolean;

    // The time interval for firing next background worker request
    public refreshFrequency: number;

    // Holds the background worker request collection
    public requests: string[];

    /////**
    //// * Constructor for the synchroniser parameter class
    //// * @param baseUrl
    //// * @param requestMethod
    //// * @param refreshFrequency
    //// * @param securityToken
    //// * @param requests
    //// */
    ////constructor(baseUrl: string, requestMethod: string, refreshFrequency: number, securityToken: string, requests: string[]) {
    ////    this.baseUrl = baseUrl;
    ////    this.requestMethod = requestMethod;
    ////    this.securityToken = securityToken;
    ////    this.refreshFrequency = refreshFrequency;
    ////    this.requests = requests;
    ////}

    /**
     * Constructor for the synchroniser parameter class
     * @param baseUrl
     * @param requestMethod
     * @param refreshFrequency
     * @param requests
     */
    constructor(baseUrl: string, requestMethod: string, allowCors: boolean, refreshFrequency: number, requests: string[]) {
        this.baseUrl = baseUrl;
        this.requestMethod = requestMethod;
        this.allowCors = allowCors;
        this.refreshFrequency = refreshFrequency;
        this.requests = requests;
    }
}

export = BackgroundWorkerParameters;
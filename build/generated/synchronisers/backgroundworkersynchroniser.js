/* tslint:disable:typedef */
// This holds the base URL for the web APIs
let baseUrl;

// This holds the current login session's security token
////let securityToken;

// This collection holds the requests to be processed
let requests;

// The time interval for firing next background worker request
let refreshFrequency = 3000;

// Holds whether the background worker is currently paused or not
let paused = false;

// Holds the request method (whether POST or GET)
let requestMethod;

// Holds whether cross domain requests are allowed or not
let allowCors;

/**
* Method which is invoked on each message which comes to the background worker
*/
self.onmessage = function (msg) {
    if (msg.data === 'start') {
        paused = false;
    } else if (msg.data === 'pause') {
        paused = true;
    } else {
        baseUrl = msg.data.baseUrl;
        ////securityToken = msg.data.securityToken;
        requestMethod = msg.data.requestMethod;
        allowCors = msg.data.allowCors;
        if (msg.data.refreshFrequency) {
            refreshFrequency = msg.data.refreshFrequency;
        }
        requests = msg.data.requests;
        doWork();
    }
};

/**
* Method which handles what happens when the background request is being invoked
*/
function doWork() {
    processBackgroundWorkerQueue(function () {
        // Repeat again
        setTimeout(doWork, refreshFrequency);
    });
}

/**
* This is called recursively, but waits for each server call to finish before making the next one
* to avoid flooding the connection with concurrent requests. Possibly could change it to make a
* few requests at once
*/
function processBackgroundWorkerQueue(callback) {
    // If the background download is paused or if there are no more pending requests in the background download queue, then return
    if (paused || !requests || requests.length === 0) {
        callback();
        return;
    }

    // Retrieving the current request
    let currentRequest = requests[0];

    // Get it from the server
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // Success or Error - remove the request - try once only
            requests.shift();
            // Recursively invoke the method to continue processing the background worker queue
            processBackgroundWorkerQueue(callback);
        }
    };

    xhr.open(requestMethod, baseUrl + currentRequest, true);
    // This is for supporting CORS requests
    xhr.withCredentials = allowCors;
    ////xhr.setRequestHeader('Authorization', 'Bearer ' + securityToken);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();
}
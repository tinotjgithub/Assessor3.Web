import View = require('./view');
import Classification = require('./classification');

interface ViewByClassification {
    views?: View;
    classifications?: Classification;
}

export = ViewByClassification;
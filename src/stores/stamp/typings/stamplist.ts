import stampData = require('./stampdata');
import stampDataAgainstQig = require('./stampdataagainstqig');
interface StampList {
    success: boolean;
    errorMessage?: string;
    stampDataAgainstQig: Immutable.List<stampDataAgainstQig>;
}

export = StampList;
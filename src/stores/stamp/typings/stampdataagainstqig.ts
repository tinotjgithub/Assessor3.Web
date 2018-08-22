import stampData = require('./stampdata');
interface StampDataAgainstQig {
    success: boolean;
    errorMessage?: string;
    markSchemeGroupId: number;
    stamps: Immutable.List<stampData>;
    markSchemGroupStampIds: Immutable.List<number>;
}

export = StampDataAgainstQig;
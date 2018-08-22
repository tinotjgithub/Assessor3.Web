import courseWorkFile = require('./courseworkfile');

/**
 * Interface definition for candidate e-course work files return.
 */
interface ECourseWorkFilesReturn {
    files: Immutable.List<courseWorkFile>;
    candidateScriptId: number;
    markGroupId: number;
}

export = ECourseWorkFilesReturn;
import eCourseWorkFileReturn = require('../../response/digital/typings/ecourseworkfilesreturn');

/**
 * Interface definition for candidate e-course work metadata.
 */
interface CandidateECourseWorkMetadata {
    fileList: Immutable.List<eCourseWorkFileReturn>;
}

export = CandidateECourseWorkMetadata;
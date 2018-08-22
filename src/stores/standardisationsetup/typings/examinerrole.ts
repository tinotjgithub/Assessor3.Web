import Permission = require('./permissions');
import ViewByClassification = require('./viewbyclassification');

interface ExaminerRole{
   name: string;
   permissions? : Permission;
   viewByClassification?: ViewByClassification;
}

export = ExaminerRole;
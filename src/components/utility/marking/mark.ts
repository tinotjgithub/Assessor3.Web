/* This is comprise dummy collection of marks
belongs to current response */
class Mark {
    public markId: number;
    public markSchemeId: number;
    public mark: AllocatedMark;
    public isDirty: boolean;
    public usedInTotal: boolean;
}

export = Mark;
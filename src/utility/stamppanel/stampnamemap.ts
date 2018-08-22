class StampNameMap {

    /**
     * Mapping Current stamp name to compatible with the css if needed.
     * @param {string} currentStampName
     * @returns
     */
    public static map(currentStampName: string): string {

        let result: string = '';
        switch (currentStampName) {
            case 'On Page Comment':
                result = 'Comment';
                break;
            default:
                result = currentStampName;
                break;
        }
        return result;
    }
}
export = StampNameMap;
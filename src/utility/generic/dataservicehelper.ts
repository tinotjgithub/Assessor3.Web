import workListStore = require('../../stores/worklist/workliststore');

class DataServiceHelper {

    /**
     * Returns a boolean value indicating whether data can be retrieved from cache.
     */
    public static canUseCache(): boolean {
        return workListStore.instance.getIsResponseClose;
    }
}

export = DataServiceHelper;
import action = require('../../actions/base/action');
import enums = require('../../components/utility/enums');

class BreadCrumbItemInfo {
    public container: enums.PageContainers;
    public isLink: boolean;
    public actionName: action;
    public linkName: string;
    public selectedTab: string;
}

export = BreadCrumbItemInfo;
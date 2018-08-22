/// <reference path="typings/stamphelper.ts" />

import stampStore = require('./stampstore');
class StampStoreHelper implements StampHelper {

    /**
     * To check whether the onpagecomment is open or not
     */
    public isOnpageCommentOpen(): boolean {

        return stampStore.instance.SelectedOnPageCommentClientToken !== undefined ||
            stampStore.instance.SelectedSideViewCommentToken !== undefined;
    }
}

export = StampStoreHelper;
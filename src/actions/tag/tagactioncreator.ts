import dispatcher = require('../../app/dispatcher');
import Promise = require('es6-promise');
import tagDataService = require('../../dataservices/tag/tagdataservice');
import base = require('../base/actioncreatorbase');
import tagAction = require('./taggetaction');
import tagUpdateAction = require('./tagupdateaction');
import tagListClickAction = require('./taglistclickaction');
import enums = require('../../components/utility/enums');

class TagActionCreator extends base {

    /**
     * action creator for fetching tags and dispatching the tag get action.
     */
    public getTags() {
        tagDataService.getTags(function (success: boolean, tagData: TagData) {
            dispatcher.dispatch(new tagAction(success, tagData));
        });
    }

    /**
     * action creator function for update/delete the tags
     * @param updateResponseTagArguments
     */
	public updateTags(updateResponseTagArguments: UpdateResponseTagArguments, tagOrder: number,
		markGroupId: number, markingMode: enums.MarkingMode = enums.MarkingMode.None) {
        let that = this;
        tagDataService.updateTags(updateResponseTagArguments, function (success: boolean, tagUpdate: TagUpdateReturn) {
            if (that.validateCall(tagUpdate, false, true)) {
                if (!success) {
                    tagUpdate = undefined;
                }
            }
            dispatcher.dispatch(new tagUpdateAction(success, updateResponseTagArguments.tagId,
				updateResponseTagArguments.markGroupList, tagOrder, markGroupId, markingMode, tagUpdate));
        });
    }

    /**
     * action creator function for notifying tag list clicked.
     * @param mark group id of selected response in worklist.
     */
    public tagListClickAction(markGroupId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new tagListClickAction(markGroupId));
        }).catch();
    }
}

let tagActionCreator = new TagActionCreator();
export = tagActionCreator;
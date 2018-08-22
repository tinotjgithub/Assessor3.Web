import grouperList = require('./grouperlist');
import grouperBase = require('./grouperbase');
import qigSelectorGrouper = require('../groupers/qigselectorgrouper');
import stampsGrouper = require('../groupers/stampsgrouper');
import messageGrouper = require('../groupers/messagegrouper');

class GrouperFactory {
   /**
    * returns the grouper object.
    * @param comparerName - Name of the grouper - should be a member of the GrouperList enum.
    */
    public getGrouper(grouperName: grouperList): grouperBase {

        /** instance of groupers to be registered in this factory */
        let _qigSelectorGrouper = new qigSelectorGrouper(); // instance of Qig Selector Grouper.
        let _stampsGrouper = new stampsGrouper(); // instance of Stamps Grouper
        let _messagegrouper = new messageGrouper();

       /**
        * Using object literals to achieve the switch statements.
        * Key is the grouper name which is stored in grouperList (an enum) and value is the grouper object.
        */
        let groupers = {
            [grouperList.QigSelectorGrouper]: _qigSelectorGrouper,
            [grouperList.StampsGrouper]: _stampsGrouper,
            [grouperList.MessageQigGrouper]: _messagegrouper
        };

        /** returns the grouper object corresponding to the name */
        return groupers[grouperName];
    }
}

let grouperFactory = new GrouperFactory();
export = grouperFactory;
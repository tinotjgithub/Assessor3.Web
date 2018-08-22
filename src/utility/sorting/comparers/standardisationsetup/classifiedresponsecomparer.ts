import comparerInterface = require('../../sortbase/comparerinterface');
import enums = require('../../../../components/utility/enums');

/**
 * This is a classified response comparer class and method
 */
class ClassifiedResponseComparer implements comparerInterface {

    /**
     * Comparer to sort the classified work list in ascending order
     * Classified response are displayed in the following order:
     * 1. Practice responses in ascending order if rig order
     * 2. Standardisation responses in ascending order if rig order
     * 3. STM Standardisation responses in ascending order if rig order
     * 4. Seed responses in ascending order of display id
     * @param a
     * @param b
     */
    public compare(a: StandardisationResponseDetails, b: StandardisationResponseDetails) {
        /**
         * If comaparing responses have same marking mode
         * Sort using display id for seed
         * Sort using rigOrder for Practise, Standardisation and stm standardisation
         * else sort using marking mode 
         */
        if (a.markingModeId === b.markingModeId) {
            if (a.markingModeId !== enums.MarkingMode.Seeding) {
                if (a.rigOrder > b.rigOrder) {
                    return 1;
                }

                if (a.rigOrder < b.rigOrder) {
                    return -1;
                }
            } else {
                if (+a.displayId > +b.displayId) {
                    return 1;
                }

                if (+a.displayId < +b.displayId) {
                    return -1;
                }
            }
        } else {
            if (a.markingModeId > b.markingModeId) {
                return 1;
            }

            if (a.markingModeId < b.markingModeId) {
                return -1;
            }
        }
    }
}

export = ClassifiedResponseComparer;
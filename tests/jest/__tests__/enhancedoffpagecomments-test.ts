jest.dontMock('../../../src/components/response/annotations/enhancedoffpagecomments/enhancedoffpagecomments');

import react = require('react');
import testUtils = require('react-dom/test-utils');
import Immutable = require('immutable');
import EnhancedOffPageComments = require('../../../src/components/response/annotations/enhancedoffpagecomments/enhancedoffpagecomments');
import enhancedOffPageCommentHelper = require('../../../src/components/utility/enhancedoffpagecomment/enhancedoffpagecommenthelper');
import tableHeader = require('../../../src/components/utility/enhancedoffpagecomment/typings/tableheader');

describe("Enhanced off-page comments test", () => {
    let enhancedOffPageCommentComponent;
    let enhancedOffPageCommentComponentDOM;
    let offPageCommentHelper: enhancedOffPageCommentHelper;
    /**Enhanced off-page comments component rendering test **/
    beforeEach(() => {
        let tableHeaderData: Immutable.List<tableHeader> = enhancedOffPageCommentHelper.generateTableHeader();
        let enhancedOffPageComments =
            [{
                "enhancedOffPageCommentId": 15,
                "fileId": 0,
                "examinerRoleId": 119,
                "markSchemeGroupId": 22,
                "markSchemeId": 289,
                "comment": "Viennese Waltz - Original form of waltz, first performed at the Italian courts is today remembered.",
                "markGroupId": 10566,
                "isDefinitive": false,
                "rowVersion": "AAAAAFFJfhY=",
                "clientToken": "af8c893b-44bc-4695-89d2-8323a755805f"
            },
            {
                "enhancedOffPageCommentId": 16,
                "fileId": 0,
                "examinerRoleId": 119,
                "markSchemeGroupId": 22,
                "markSchemeId": 290,
                "comment": "Tango - Originally created in the Argentinean region of Rio de la Plata.",
                "markGroupId": 10566,
                "isDefinitive": false,
                "rowVersion": "AAAAAFFJfhU=",
                "clientToken": "cfec8993-7006-460b-a499-ab431f345e5c"
            },
            {
                "enhancedOffPageCommentId": 17,
                "fileId": 0,
                "examinerRoleId": 119,
                "markSchemeGroupId": 22,
                "markSchemeId": 298,
                "comment": "Cha-Cha-Cha - This incredibly rhythmic dance created in Latin America managed to meld together both.",
                "markGroupId": 10566,
                "isDefinitive": false,
                "rowVersion": "AAAAAFFJfhQ=",
                "clientToken": "acfd00d0-cda4-4d49-b551-b9cc783ae810"
            }];

        let enhancedOffPageCommentsData: Immutable.List<EnhancedOffPageComment>(enhancedOffPageComments);

        var enhancedOffPageCommentProps = {
            id: 'offpage-comments-table',
            key: 'offpage-comments-table-key',
            onSortClick: jest.genMockFn().mockReturnThis(),
            enhancedOffPageComments: enhancedOffPageCommentsData,
            tableHeaders: tableHeaderData,
            headerRefCallBack: jest.genMockFn().mockReturnThis()

        };

        enhancedOffPageCommentComponent = EnhancedOffPageComments(enhancedOffPageCommentProps);
        enhancedOffPageCommentComponentDOM = testUtils.renderIntoDocument(enhancedOffPageCommentComponent);
    });

    /** checks if the enhanced off-page comment grid is rendered or not **/
    it("checks if the enhanced off-page comment grid is rendered or not", () => {
        expect(enhancedOffPageCommentComponentDOM).not.toBeNull();
    });
});
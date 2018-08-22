jest.dontMock('../../../src/components/response/responsescreen/imagecontainer');
jest.dontMock('../../../src/stores/qigselector/qigstore');
import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');
import Immutable = require("immutable");
import ImageZoneContainer = require('../../../src/components/response/responsescreen/imagecontainer');

import dispatcher = require("../../../src/app/dispatcher");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import enums = require("../../../src/components/utility/enums");

describe("Tests for image zone container component", function () {

    let renderedOutput;

    // beforeEach(() => {

    //     var imageZones = [
    //         {
    //             uniqueId: 0,
    //             imageClusterId: 0,
    //             pageNo: 1,
    //             sequence: 1,
    //             outputPageNo: 20,
    //             leftEdge: 0,
    //             topEdge: 0,
    //             width: 0,
    //             height: 0
    //         },
    //         {
    //             uniqueId: 0,
    //             imageClusterId: 0,
    //             pageNo: 1,
    //             sequence: 1,
    //             outputPageNo: 20,
    //             leftEdge: 0,
    //             topEdge: 0,
    //             width: 0,
    //             height: 0
    //         },
    //         {
    //             uniqueId: 0,
    //             imageClusterId: 0,
    //             pageNo: 1,
    //             sequence: 1,
    //             outputPageNo: 30,
    //             leftEdge: 0,
    //             topEdge: 0,
    //             width: 0,
    //             height: 0
    //         }
    //     ];

    //     var filemetadataList: Immutable.List < FileMetadata > = Immutable.List<FileMetadata>(
    //         [{
    //             isSuppressed: true,
    //             linkType: "pdf",
    //             name: "Spanish essay",
    //             pageId: 6142,
    //             pageNumber: 1,
    //             url: ""
    //         },
    //             {
    //                 isSuppressed: true,
    //                 linkType: "pdf",
    //                 name: "Spanish essay2",
    //                 pageId: 6143,
    //                 pageNumber: 2,
    //                 url: ""
    //             },
    //             {
    //                 isSuppressed: true,
    //                 linkType: "pdf",
    //                 name: "Spanish essay3",
    //                 pageId: 6144,
    //                 pageNumber: 3,
    //                 url: ""
    //             },
    //             {
    //                 isSuppressed: true,
    //                 linkType: "pdf",
    //                 name: "Spanish essay4",
    //                 pageId: 6145,
    //                 pageNumber: 4,
    //                 url: ""
    //             },]
    //     );

    //     var imageZoneContainerProps = {
    //         imageZonesCollection: [Immutable.List<ImageZone>(imageZones), Immutable.List<ImageZone>(imageZones)],
    //         responseDetails: {
    //             candidateScriptId: 1
    //         },
    //         imagesToRender: [
    //             [
    //                 "testImage", "testImage1"
    //             ],
    //             [
    //                 "testImage3", "testImage4"
    //             ],
    //         ],            
    //         fileMetadataList: filemetadataList,
    //         onImageLoaded: jest.genMockFn().mockReturnThis(),
    //         switchViewCallback: jest.genMockFn().mockReturnThis(),
    //         setZoomOptions: jest.genMockFn().mockReturnThis(),
    //         refreshImageContainer: Date.now()
    //     };

    //     let qigList = {
    //         qigSummary: [
    //             {
    //                 examinerRoleId: 1219,
    //                 role: 2,
    //                 markSchemeGroupId: 28,
    //                 markSchemeGroupName: "GCE AS D&T: PRODUCT DESIGN UNIT 1",
    //                 questionPaperName: "GCE D&T: PRODUCT DES (TEX) UNIT 1",
    //                 examinerApprovalStatus: 1,
    //                 questionPaperPartId: 15,
    //                 assessmentCode: "146A-TEXT1",
    //                 componentId: "TEXT1     ",
    //                 sessionId: 5,
    //                 sessionName: "JUNE 2014 SERIES 6A",
    //                 isestdEnabled: true,
    //                 standardisationSetupComplete: true,
    //                 isesTeamMember: true,
    //                 hasQualityFeedbackOutstanding: false,
    //                 isOpenForMarking: true,
    //                 hasSimulationMode: true,
    //                 hasSTMSimulationMode: false,
    //                 hasGracePeriod: true,
    //                 isMarkFromPaper: false,
    //                 inSimulationMode: false,
    //                 examinerQigStatus: 0,
    //                 currentMarkingTarget: null,
    //                 markingTargets: null,
    //                 markingMethod: 2,
    //                 standardisationSetupCompletedDate: "2016-03-21T19:12:17.13"
    //             }
    //         ],
    //         success: true,
    //         errorMessage: null
    //     };

    //     let ccData = {
    //         "configurableCharacteristics": [{
    //             "ccName": "HasGracePeriod",
    //             "ccValue": "true",
    //             "valueType": 1,
    //             "markSchemeGroupID": 28,
    //             "questionPaperID": 0,
    //             "examSessionID": 0
    //         },
    //             {
    //                 "ccName": "StringFormat",
    //                 "ccValue": "<StringFormat><OverviewQIGName>{QIGName}-{AssessmentIdentifier}</OverviewQIGName><Username>{Initials} {Surname}</Username></StringFormat>",
    //                 "valueType": 5,
    //                 "markSchemeGroupID": 28,
    //                 "questionPaperID": 0,
    //                 "examSessionID": 0
    //             },
    //             {
    //                 "ccName": "ColouredAnnotations",
    //                 "ccValue": "<ColouredAnnotation Status=\"On\" DefaultColour=\"#FFFF0000\"/>",
    //                 "valueType": 5,
    //                 "markSchemeGroupID": 28,
    //                 "questionPaperID": 0,
    //                 "examSessionID": 0
    //             }
    //         ],
    //         "success": true,
    //         "errorMessage": null
    //     }

    //     dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

    //     let overviewData: overviewData = qigList;
    //     overviewData.qigSummary = Immutable.List(overviewData.qigSummary);

    //     dispatcher.dispatch(new qigSelectorDatafetchAction(true, 28, true, overviewData));

    //     var imageZoneContainerComponent = react.createElement(ImageZoneContainer, imageZoneContainerProps);
    //     renderedOutput = reactTestUtils.renderIntoDocument(imageZoneContainerComponent);
    // });

    it('Test whether the image zone container component renders', function () {

        //expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the no of image container count is as expected', function () {
        // var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-container');
        // expect(imgDOM.length).toBe(1);
    });

    //it('Test whether the no of image holder count in the container is as expected', function () {
    //    var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder');
    //    expect(imgDOM.length).toBe(2);
    //});

    //it('Test whether the no of stitched image holder count in the container is as expected', function () {
    //    var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder stiched');
    //    expect(imgDOM.length).toBe(2);
    //});
});

describe("Tests for image container with unstructured image viewer", function () {


    it('Test whether the image container component renders', function () {

        // var filemetadataList: Immutable.List<FileMetadata> = Immutable.List<FileMetadata>(
        //     [{
        //         isSuppressed: true,
        //         linkType: "pdf",
        //         name: "Spanish essay1",
        //         pageId: 6142,
        //         pageNumber: 1,
        //         url: ""
        //     },
        //         {
        //             isSuppressed: true,
        //             linkType: "pdf",
        //             name: "Spanish essay2",
        //             pageId: 6143,
        //             pageNumber: 2,
        //             url: ""
        //         },
        //         {
        //             isSuppressed: true,
        //             linkType: "pdf",
        //             name: "Spanish essay3",
        //             pageId: 6144,
        //             pageNumber: 3,
        //             url: ""
        //         },
        //         {
        //             isSuppressed: true,
        //             linkType: "pdf",
        //             name: "Spanish essay4",
        //             pageId: 6145,
        //             pageNumber: 4,
        //             url: ""
        //         },]
        // );

        // var imageZoneContainerProps = {
        //     responseDetails: {
        //         candidateScriptId: 1
        //     },
        //     imagesToRender: [
        //         [
        //             "testImage", "testImage1"
        //         ],
        //         [
        //             "testImage3", "testImage4"
        //         ],
        //     ],
        //     fileMetadataList: filemetadataList,
        //     onImageLoaded: jest.genMockFn().mockReturnThis(),
        //     switchViewCallback: jest.genMockFn().mockReturnThis(),
        //     setZoomOptions: jest.genMockFn().mockReturnThis(),
        //     refreshImageContainer: Date.now()
        // };

        // var imageZoneContainerComponent = react.createElement(ImageZoneContainer, imageZoneContainerProps);
        // renderedOutput = reactTestUtils.renderIntoDocument(imageZoneContainerComponent);
        // expect(renderedOutput).not.toBeNull();
    });

    it('Test whether image container with unstructured image viewer exist', function () {
        // var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheets-inner unstructured');
        // expect(imgDOM.length).toBe(1);
    });

    it('Test whether the no of image container count is as expected for unstructured render', function () {
        // var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-container');
        // expect(imgDOM.length).toBe(1);
    });

    //it('Test whether the no of image holder count in the container is as expected for unstructured render', function () {
    //    var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder');
    //    expect(imgDOM.length).toBe(2);
    //});
});
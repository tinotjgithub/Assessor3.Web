jest.dontMock('../../../src/stores/marking/markingstore');
jest.dontMock('../../../src/stores/response/responsestore');
jest.dontMock('../../../src/actions/marking/addannotationaction');

import React = require('react');
import ReactDOM = require('react-dom');
import testUtils = require('react-dom/test-utils');
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
import markingActionCreator = require('../../../src/actions/marking/markingactioncreator');
import addAnnotationAction = require('../../../src/actions/marking/addannotationaction');
import markingStore = require('../../../src/stores/marking/markingstore');

import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import examinerMarkData = require('../../../src/stores/response/typings/examinermarkdata');
import worklistTypeAction = require('../../../src/actions/worklist/worklisttypeaction');
import responseStore = require('../../../src/stores/response/responsestore');
import annotation = require('../../../src/stores/response/typings/annotation');
import updateAnnotationAction = require('../../../src/actions/marking/updateannotationpositionaction');
import updateColorAction = require('../../../src/actions/marking/updateannotationcoloraction');
markingActionCreator.addNewlyAddedAnnotation = jest.genMockFn();

describe('Checking the Stamping functionality', () => {

    /* The new examiner mark and annotations data */
    let examinerMarksAndAnnotations: examinerMarkData;
    /* The available marks for the current response */
    let availableAnnotations: Array<annotation>;

    /* live open response details */
    let responseLiveOpenData: any;

    let newAnnotation: annotation = {
        annotationId: 0,
        examinerRoleId: 909,
        markSchemeGroupId: 100,
        imageClusterId: 261,
        outputPageNo: 1,
        pageNo: 2,
        dataShareLevel: 0,
        leftEdge: 950,
        topEdge: 216,
        zOrder: 0,
        width: 32,
        height: 32,
        red: 255,
        green: 0,
        blue: 0,
        dimension: '',
        transparency: 0,
        stamp: 11,
        freehand: null,
        rowVersion: null,
        clientToken: "0x86AD236E6546DD4DB830674707059ABC",
        markSchemeId: 907,
        markGroupId: 1461,
        candidateScriptId: 609,
        version: 1,
        definitiveMark: false,
        isDirty: true,
        questionTagId: 0,
        markingOperation: 1
    }

    /* The examiner marks collection */
    let examinerMarksAndAnnotationsData =
        {
            "examinerMarkGroupDetails": {
                "1461": {
                    "allMarksAndAnnotations": [{
                        "enhancedOffPageComments": [],
                        "examinerMarksCollection": [],
                        "annotations": [
                        {
                            "annotationId": 12,
                            "examinerRoleId": 909,
                            "markSchemeGroupId": 100,
                            "imageClusterId": 261,
                            "outputPageNo": 1,
                            "pageNo": 2,
                            "dataShareLevel": 0,
                            "leftEdge": 475,
                            "topEdge": 150,
                            "zOrder": 0,
                            "width": 32,
                            "height": 32,
                            "red": 255,
                            "green": 0,
                            "blue": 0,
                            "transparency": 0,
                            "stamp": 11,
                            "freehand": null,
                            "rowVersion": null,
                            "clientToken": "0x86AD236E6546DD4DB830674707059E4C",
                            "markSchemeId": 907,
                            "markGroupId": 1461,
                            "candidateScriptId": 609,
                            "version": 1,
                            "definitiveMark": false,
                            "isDirty": true,
                            "questionTagId": 0,
                            "markingOperation": 1
                        },
                        {
                            "annotationId": 13,
                            "examinerRoleId": 909,
                            "markSchemeGroupId": 100,
                            "imageClusterId": 261,
                            "outputPageNo": 1,
                            "pageNo": 2,
                            "dataShareLevel": 0,
                            "leftEdge": 850,
                            "topEdge": 216,
                            "zOrder": 0,
                            "width": 32,
                            "height": 32,
                            "red": 255,
                            "green": 0,
                            "blue": 0,
                            "transparency": 0,
                            "stamp": 11,
                            "freehand": null,
                            "rowVersion": null,
                            "clientToken": "0x86AD236E6546DD4DB830674707059E4C",
                            "markSchemeId": 907,
                            "markGroupId": 1461,
                            "candidateScriptId": 609,
                            "version": 1,
                            "definitiveMark": false,
                            "isDirty": true,
                            "questionTagId": 0,
                            "markingOperation": 1
                        }],

                        "bookmarks": [],
                        "absoluteMarksDifference": null,
                        "accuracyIndicator": 0,
                        "accuracyTolerance": 0,
                        "examinerMarks": null,
                        "maximumMarks": 0,
                        "totalMarks": 15,
                        "totalMarksDifference": null,
                        "totalTolerance": null,
                        "examinerRoleId": 1773,
                        "markGroupId": 1461,
                        "markingProgress": 100,
                        "hasMarkSchemeLevelTolerance": false,
                        "version": 1,
                        "questionItemGroup": null,
                        "totalLowerTolerance": null,
                        "totalUpperTolerance": null,
                        "seedingAMDTolerance": null,
                        "submittedDate": "0001-01-01T00:00:00",
                        "remarkRequestTypeId": 0
                    }],
                    "examinerDetails": null,
                    "startWithEmptyMarkGroup": false,
                    "showPreviousMarks": false,
                    "markerMessage": null,
                    "showMarkerMessage": false
                }
            },
            "wholeResponseQIGToRIGMapping": undefined,
            "success": true,
            "errorMessage": null,
        };
    var examinerMarksAndAnnotationsString = JSON.stringify(examinerMarksAndAnnotationsData);
    examinerMarksAndAnnotations = JSON.parse(examinerMarksAndAnnotationsString);
    /* dispatching retrieve marks to set the predefines marks and annotations collection to the marking store */
    var getMarksAction: retrieveMarksAction = new retrieveMarksAction(examinerMarksAndAnnotations, true, 1461);
    dispatcher.dispatch(getMarksAction);

    /* dispatching open response action to set the current mark group id */
    var openResponseAction: responseOpenAction = new responseOpenAction(true, 6370108, enums.ResponseNavigation.next, enums.ResponseMode.open, 1461);
    dispatcher.dispatch(openResponseAction);

    /*live open response list object */
    var liveOpenResponses = {
        "responses":
        [
            {
                "displayId": "6370108",
                "markingProgress": 2,
                "allocatedDate": "2016-01-18T11:44:59.61",
                "updatedDate": "2016-01-18T11:44:59.617",
                "hasAllPagesAnnotated": false,
                "totalMarkValue": 2,
                "hasBlockingExceptions": false,
                "exceptionsCount": 0,
                "candidateScriptId": 211
            }

        ],
        "concurrentLimit": 5,
        "maximumMark": 50,
        "unallocatedResponsesCount": 18,
        "hasNumericMark": true,
        "success": true,
        "errorMessage": null
    };

    /* Creating immutable collection for live open */
    var liveOpenResponsesString = JSON.stringify(liveOpenResponses);
    responseLiveOpenData = JSON.parse(liveOpenResponsesString);
    var immutableList = Immutable.List(responseLiveOpenData.responses);
    responseLiveOpenData.responses = immutableList;

    dispatcher.dispatch(new worklistTypeAction(enums.WorklistType.live, enums.ResponseMode.open, enums.RemarkRequestType.Unknown, true, false, responseLiveOpenData));

    availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
        responseStore.instance.selectedMarkGroupId).annotations;

    it('Check stamp is added to the annotation list', function () {

        let addAnnotation: annotation = {
             annotationId: 0,
            examinerRoleId: 909,
            markSchemeGroupId: 100,
            imageClusterId: 261,
            outputPageNo: 1,
            pageNo: 2,
            dataShareLevel: 0,
            leftEdge: 950,
            topEdge: 216,
            zOrder: 0,
            width: 32,
            height: 32,
            red: 255,
            green: 0,
            blue: 0,
            dimension: '',
            transparency: 0,
            stamp: 11,
            freehand: null,
            rowVersion: null,
            clientToken: "0x86AD236E6546DD4DB830674707059ABC",
            markSchemeId: 907,
            markGroupId: 1461,
            candidateScriptId: 609,
            version: 1,
            definitiveMark: false,
            isDirty: true,
            questionTagId: 0,
            markingOperation: 1
        }
        dispatcher.dispatch(new addAnnotationAction(newAnnotation));
        //check annotations count in store variable
        expect(availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations.length).toBe(3);
    });


    it('Check stamp is added to the annotation list', function () {

        let highlighterData: annotation = {
            annotationId: 11402,
            examinerRoleId: 1674,
            markSchemeGroupId: 290,
            imageClusterId: 3297,
            outputPageNo: 1,
            pageNo: 0,
            leftEdge: 1126,
            topEdge: 1155,
            zOrder: 0,
            width: 32,
            height: 32,
            red: 255,
            green: 0,
            blue: 0,
            transparency: 0,
            stamp: 151,
            comment: null,
            freehand: null,
            rowVersion: null,
            clientToken: "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            markSchemeId: 3569,
            markGroupId: 1461,
            candidateScriptId: 6418,
            version: 0,
            definitiveMark: true,
            isDirty: true,
            questionTagId: 0,
            markingOperation: enums.MarkingOperation.added
        }
        dispatcher.dispatch(new addAnnotationAction(highlighterData));
        //check annotations count in store variable
        expect(markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations.length).toBe(4);
    });

    it("checks if highlighter is saved against the response", () => {
        availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations;

        ///* Checking if saved annotation is a highlighter */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].stamp).toBe(151);

        ///* Checking if the annotation is added */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].markingOperation).toBe(enums.MarkingOperation.added);

        ///* Checking if dirty flag is set */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].isDirty).toBe(true);
    });

    it("checks if highlighter is saved after resizing", () => {
        //parameter description
        let updatehighlighterData = {
            leftEdge: 1126,
            topEdge: 1155,
            imageClusterId: 3297,
            outputPageNo: 1,
            pageNo: 0,
            clientToken: "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            width: 100,
            height: 100
        }
        dispatcher.dispatch(new updateAnnotationAction(1126,
            1126,
            3297,
            1,
            0,
            "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            100,
            100,
            '',
            true,
            true,
            false,
            151));
        availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations;

        ///* Checking if the width of annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].width).toBe(100);

        ///* Checking if the annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].markingOperation).toBe(enums.MarkingOperation.updated);

        ///* Checking if dirty flag is set */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].isDirty).toBe(true);
    });

    it("checks if highlighter is saved after Moving", () => {
        let updatehighlighterData = {
            leftEdge: 600,
            topEdge: 900,
            imageClusterId: 3297,
            outputPageNo: 1,
            pageNo: 0,
            clientToken: "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            width: 100,
            height: 100
        }
        dispatcher.dispatch(new updateAnnotationAction(600,
            900,
            1126,
            1,
            0,
            "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            100,
            100,
            '',
            true,
            true,
            151));
        availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations;

        ///* Checking if the leftedge of annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].leftEdge).toBe(600);

        ///* Checking if the topedge of annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].topEdge).toBe(900);

        ///* Checking if the annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].markingOperation).toBe(enums.MarkingOperation.updated);

        ///* Checking if dirty flag is set */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].isDirty).toBe(true);
    });

    it("checks if color of the higlighter is saved", () => {
        let highlighterData: annotation = {
            annotationId: 11402,
            examinerRoleId: 1674,
            markSchemeGroupId: 290,
            imageClusterId: 3297,
            outputPageNo: 1,
            pageNo: 0,
            leftEdge: 600,
            topEdge: 900,
            zOrder: 0,
            width: 100,
            height: 100,
            red: 0,
            green: 255,
            blue: 0,
            transparency: 0,
            stamp: 151,
            comment: null,
            freehand: null,
            rowVersion: null,
            clientToken: "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
            markSchemeId: 3569,
            markGroupId: 1461,
            candidateScriptId: 6418,
            version: 0,
            definitiveMark: true,
            isDirty: true,
            questionTagId: 0,
            markingOperation: enums.MarkingOperation.updated
        }
        dispatcher.dispatch(new updateColorAction(highlighterData));
        availableAnnotations = markingStore.instance.currentExaminerMarksAgainstResponse(responseStore.instance.selectedMarkGroupId,
            responseStore.instance.selectedMarkGroupId).annotations;


        ///* Checking if the topedge of annotation is updated */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].green).toBe(255);

        ///* Checking if dirty flag is set */
        expect(availableAnnotations.filter(x => x.annotationId === 11402)[0].isDirty).toBe(true);
    });
});
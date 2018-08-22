import React = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import AwardingIndicator = require("../../../src/components/awarding/awardingindicator");

/**
 * test method for awarding indicator 
 */
describe("Awarding Indicator Component Test", () => {
    /**Awarding Indicator Component rendering test **/

    let awardingIndicatorComponentPossitiveCase;
    let awardingIndicatorComponentNegativeCase;
    let awardingIndicatorComponentDOMPossitiveCase;
    let awardingIndicatorComponentDOMNegativeCase;

    /** creating component for hasAwardingJudgement has true  */
    awardingIndicatorComponentPossitiveCase = <AwardingIndicator hasAwardingJudgement={ true } />;       

    /** To check if the awarding indicator component has been loaded or not **/
    it("checks if the awarding indicator component has been loaded", () => { 
        awardingIndicatorComponentDOMPossitiveCase = testUtils.renderIntoDocument(awardingIndicatorComponentPossitiveCase);      
        expect(awardingIndicatorComponentDOMPossitiveCase).not.toBeNull();
    });

    /** To check if awarding notification indicator showing correctly  */
    it("checks if awarding notification indicator showing correctly", () => {     
        var awardingNotificationClassName = reactDOM.findDOMNode(awardingIndicatorComponentDOMPossitiveCase).children[0].children[0].children[0].className;
        expect(awardingNotificationClassName).toBe('notification-dot notify');
    });

    /** creating component for hasAwardingJudgement has false */
    awardingIndicatorComponentNegativeCase = <AwardingIndicator hasAwardingJudgement={ false } />;
        
    /** To check if the awarding indicator component has been loaded or not **/
    it("checks if the awarding indicator component has been loaded", () => {   
        awardingIndicatorComponentDOMNegativeCase = testUtils.renderIntoDocument(awardingIndicatorComponentNegativeCase);     
        expect(awardingIndicatorComponentDOMNegativeCase).not.toBeNull();
    });

    /** To check if awarding notification indicator showing correctly  */
    it("checks if awarding notification indicator showing correctly", () => {        
        var awardingNotificationClassName = reactDOM.findDOMNode(awardingIndicatorComponentDOMNegativeCase).children[0].children[0].children[0].className;
        expect(awardingNotificationClassName).toBe('notification-dot');
    });
});
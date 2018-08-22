/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import QigItem = require('./qigitem');
import qiginformation = require('../../stores/qigselector/typings/qigsummary');
import immutable = require('immutable');
import enums = require('../utility/enums');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');
import qigStore = require('../../stores/qigselector/qigstore');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    qigs: Immutable.List<qiginformation>;
    validationResults: qigValidationResult[];
    containerPage?: enums.PageContainers;
}

/**
 * Class for the Qig group.
 */
class QigGroup extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Qig group.
     */
    public render() {

        let qigitems = this.props.qigs.map((qig: qiginformation, index: number) => {

            // Do not render if the markSchemeGroupId contained in the list 'isQIGHidden' list.
            if (!qigStore.instance.isQIGHidden(qig.markSchemeGroupId)) {
                return <QigItem
                    qig={qig}
                    qigValidationResult={this.props.validationResults[index]}
                    selectedLanguage={this.props.selectedLanguage}
                    containerPage={this.props.containerPage}
                    id={this.props.id + '_qig_' + (index + 1).toString()} key={'key_' + (index + 1).toString()} />;
            }
        });

        // Render the QIG Items
        return qigitems;
    }
}

export = QigGroup;

import React = require('react');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import stdSetupPermissionData = require('../../stores/standardisationsetup/typings/standardisationsetupccdata');
import permissions = require('../../stores/standardisationsetup/typings/permissions');
let classNames = require('classnames');

/**
 * Properties of a StandardisationSetupLinkProps
 */
interface StandardisationSetupLinkProps extends PropsBase, LocaleSelectionBase {
    onStandardisationLinkClick: Function;
    stdSetupPermission: permissions;
    hasBrowsePermissionOnly: boolean;
}

/**
 * React stateless component for standardisation Setup Link on qig selector
 */
const standardisationSetupLink: React.StatelessComponent<StandardisationSetupLinkProps> = (props: StandardisationSetupLinkProps) => {
    let linkName;
    let idName;

    if (props.hasBrowsePermissionOnly) {
        linkName = localeStore.instance.TranslateText('home.qig-data.browse-standardisation-scripts');
        idName = 'browse-script-link';
    } else if (props.stdSetupPermission.editDefinitives) {
        linkName = localeStore.instance.TranslateText('home.qig-data.manage-definitive-mark-link');
        idName = 'manage-mark-link';
    } else if (props.stdSetupPermission.viewDefinitives) {
        linkName = localeStore.instance.TranslateText('home.qig-data.view-definitive-mark-link');
        idName = 'view-mark-link';
    }

    return (
        <div>
            <a className='manage-mark-link'
                id={idName}
                title={linkName}
                onClick={() => props.onStandardisationLinkClick()}
                href='javascript:void(0)'>
                {linkName}</a>
        </div>
    );
};

export = standardisationSetupLink;

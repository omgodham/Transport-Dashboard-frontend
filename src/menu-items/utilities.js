// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ContactsIcon from '@material-ui/icons/Contacts';
import BusinessIcon from '@material-ui/icons/Business';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    LocalShippingIcon,
    ContactsIcon,
    BusinessIcon
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const utilities = {
    id: 'utilities',
    title: 'Other',
    type: 'group',
    children: [
        {
            id: 'customers',
            title: 'Customers',
            type: 'item',
            url: '/customers',
            icon: icons['BusinessIcon'],
            breadcrumbs: false
        },
        {
            id: 'vehicles',
            title: 'Vehicles',
            type: 'item',
            url: '/vehicles',
            icon: icons['LocalShippingIcon'],
            breadcrumbs: false
        },
        {
            id: 'drivers',
            title: 'Drivers',
            type: 'item',
            url: '/drivers',
            icon: icons['ContactsIcon'],
            breadcrumbs: false
        },
        {
            id: 'extra-charges',
            title: 'Extra Charges',
            type: 'item',
            url: '/extra-charges',
            icon: icons['ContactsIcon'],
            breadcrumbs: false
        }
    ]
};

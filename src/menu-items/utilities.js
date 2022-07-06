// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import BusinessIcon from '@material-ui/icons/Business';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import StoreIcon from '@material-ui/icons/Store';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd,
    LocalShippingIcon,
    PermContactCalendarIcon,
    AccountBalanceWalletIcon,
    StoreIcon,
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
            icon: icons['PermContactCalendarIcon'],
            breadcrumbs: false
        },
        {
            id: 'extra-charges',
            title: 'Extra Charges',
            type: 'item',
            url: '/extra-charges',
            icon: icons['AccountBalanceWalletIcon'],
            breadcrumbs: false
        },
        {
            id: 'company',
            title: 'Company',
            type: 'item',
            url: '/company',
            icon: icons['StoreIcon'],
            breadcrumbs: false
        },
        {
            id: 'bill',
            title: 'Bill',
            type: 'item',
            url: '/bill',
            icon: icons['StoreIcon'],
            breadcrumbs: false
        }
    ]
};

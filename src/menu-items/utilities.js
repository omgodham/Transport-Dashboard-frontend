// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd
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
            icon: icons['IconTypography'],
            breadcrumbs: false
        },
        {
            id: 'vehicles',
            title: 'Vehicles',
            type: 'item',
            url: '/vehicles',
            icon: icons['IconPalette'],
            breadcrumbs: false
        },
        {
            id: 'drivers',
            title: 'Drivers',
            type: 'item',
            url: '/drivers',
            icon: icons['IconPalette'],
            breadcrumbs: false
        }
    ]
};

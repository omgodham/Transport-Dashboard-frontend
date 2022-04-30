// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons';
import StorageIcon from '@material-ui/icons/Storage';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,
    StorageIcon
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const trip = {
    id: 'trip',
    title: 'trip',
    type: 'group',
    children: [
        // {
        //     id: 'add-trip',
        //     title: 'Add Trip',
        //     type: 'item',
        //     url: '/trip/add-trip',
        //     icon: icons['IconDashboard'],
        //     breadcrumbs: false
        // },
        {
            id: 'all-trips',
            title: 'All Trips',
            type: 'item',
            url: '/trip/all-trips',
            icon: icons['StorageIcon'],
            breadcrumbs: false
        }
    ]
};

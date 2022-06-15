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

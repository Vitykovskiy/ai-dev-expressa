import { createBrowserRouter } from 'react-router';
import { RootLayout } from './RootLayout';
import { OrdersScreen } from './screens/OrdersScreen';
import { AvailabilityScreen } from './screens/AvailabilityScreen';
import { MenuScreen } from './screens/MenuScreen';
import { UsersScreen } from './screens/UsersScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { useAppStore } from './store';

function OrdersRoute() {
  const { orders } = useAppStore();
  return <OrdersScreen orders={orders} />;
}

function AvailabilityRoute() {
  const { menuItems } = useAppStore();
  return <AvailabilityScreen menuItems={menuItems} />;
}

function MenuRoute() {
  const { menuItems } = useAppStore();
  return <MenuScreen menuItems={menuItems} />;
}

function UsersRoute() {
  const { users } = useAppStore();
  return <UsersScreen users={users} />;
}

function SettingsRoute() {
  const { settings } = useAppStore();
  return <SettingsScreen settings={settings} />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: OrdersRoute },
      { path: 'availability', Component: AvailabilityRoute },
      { path: 'menu', Component: MenuRoute },
      { path: 'users', Component: UsersRoute },
      { path: 'settings', Component: SettingsRoute },
    ],
  },
]);

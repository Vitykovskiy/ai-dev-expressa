import { useState } from 'react';
import { UserRole, Order, MenuItem, User, Settings } from './types';

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#1234',
    customerName: 'Анна Смирнова',
    items: 'Капучино M, Круассан',
    total: 380,
    status: 'Created',
    slotTime: '10:00',
    createdAt: new Date(),
  },
  {
    id: '2',
    orderNumber: '#1235',
    customerName: 'Дмитрий Иванов',
    items: 'Латте L, Чизкейк',
    total: 450,
    status: 'Confirmed',
    slotTime: '10:10',
    createdAt: new Date(),
  },
  {
    id: '3',
    orderNumber: '#1236',
    customerName: 'Елена Петрова',
    items: 'Эспрессо, Круассан',
    total: 280,
    status: 'Ready for pickup',
    slotTime: '10:20',
    createdAt: new Date(),
  },
];

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Капучино',
    category: 'Кофе',
    available: true,
    sizes: [
      { size: 'S', price: 180 },
      { size: 'M', price: 220 },
      { size: 'L', price: 260 },
    ],
  },
  {
    id: '2',
    name: 'Латте',
    category: 'Кофе',
    available: true,
    sizes: [
      { size: 'S', price: 200 },
      { size: 'M', price: 240 },
      { size: 'L', price: 280 },
    ],
  },
  {
    id: '3',
    name: 'Эспрессо',
    category: 'Кофе',
    available: true,
    price: 150,
  },
  {
    id: '4',
    name: 'Круассан',
    category: 'Выпечка',
    available: true,
    price: 160,
  },
  {
    id: '5',
    name: 'Чизкейк',
    category: 'Десерты',
    available: false,
    price: 280,
  },
  {
    id: '6',
    name: 'Молоко',
    category: 'Тип молока',
    available: true,
    price: 0,
    isOptionGroup: true,
  },
  {
    id: '7',
    name: 'Соевое молоко',
    category: 'Тип молока',
    available: true,
    price: 30,
    isOptionGroup: true,
  },
  {
    id: '8',
    name: 'Миндальное молоко',
    category: 'Тип молока',
    available: true,
    price: 40,
    isOptionGroup: true,
  },
  {
    id: '9',
    name: 'Сахар',
    category: 'Добавки',
    available: true,
    price: 0,
    isOptionGroup: true,
  },
  {
    id: '10',
    name: 'Сироп ваниль',
    category: 'Добавки',
    available: true,
    price: 50,
    isOptionGroup: true,
  },
  {
    id: '11',
    name: 'Сироп карамель',
    category: 'Добавки',
    available: true,
    price: 50,
    isOptionGroup: true,
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    role: 'administrator',
    status: 'active',
    telegramUsername: '@anna_s',
  },
  {
    id: '2',
    name: 'Дмитрий Иванов',
    role: 'barista',
    status: 'active',
    telegramUsername: '@dmitry_i',
  },
  {
    id: '3',
    name: 'Елена Петрова',
    role: 'barista',
    status: 'active',
    telegramUsername: '@elena_p',
  },
];

export function useAppStore() {
  const [currentRole] = useState<UserRole>('administrator');
  const [orders] = useState<Order[]>(mockOrders);
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);
  const [users] = useState<User[]>(mockUsers);
  const [settings] = useState<Settings>({
    workingHoursOpen: '09:00',
    workingHoursClose: '20:00',
    slotCapacity: 5,
  });

  return {
    currentRole,
    orders,
    menuItems,
    users,
    settings,
  };
}

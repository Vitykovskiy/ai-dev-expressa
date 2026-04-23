export type UserRole = 'barista' | 'administrator';

export type OrderStatus = 'Created' | 'Confirmed' | 'Ready for pickup' | 'Rejected' | 'Closed';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: string;
  total: number;
  status: OrderStatus;
  slotTime: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  available: boolean;
  price?: number;
  sizes?: { size: string; price: number }[];
  options?: MenuOption[];
  isOptionGroup?: boolean;
}

export interface MenuOption {
  id: string;
  name: string;
  available: boolean;
  price: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  status: 'active' | 'blocked';
  telegramUsername?: string;
}

export interface Settings {
  workingHoursOpen: string;
  workingHoursClose: string;
  slotCapacity: number;
}

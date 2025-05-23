
export type UserRole = "customer" | "store" | "driver" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  image: string;
  logoUrl?: string;
  rating: number;
  latitude: number;
  longitude: number;
  categories: string[];
  // New pack system fields
  currentPack?: DeliveryPack;
  remainingDeliveries: number;
  totalDeliveries: number;
};

export type DeliveryPack = {
  id: string;
  name: string;
  deliveriesCount: number;
  price: number;
  driverCommissionRate: number; // Percentage of order total (e.g., 0.15 for 15%)
  validity: number; // Days
  description: string;
};

export type Product = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "ready_for_pickup" 
  | "picked_up" 
  | "in_delivery" 
  | "delivered" 
  | "completed" 
  | "cancelled";

export type PaymentMethod = "online" | "cash" | "airtel";
export type PaymentStatus = "pending" | "paid" | "failed";

export type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success";

export type Order = {
  id: string;
  customerId: string;
  storeId: string;
  driverId?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  pickupPointId?: string;
  isPickup: boolean;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
  // New fee fields
  deliveryFee: number;
  driverCommission: number;
  customerValidated: boolean;
  driverValidated: boolean;
  notes?: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type PickupPoint = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  phone: string;
  email: string;
  isActive: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
};

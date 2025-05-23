
import { Store, Product, Order, User, PickupPoint, DeliveryPack } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: "u1",
    name: "John Doe",
    email: "customer@example.com",
    phone: "+1234567890",
    role: "customer",
    avatar: "/assets/avatars/customer.jpg"
  },
  {
    id: "u2",
    name: "Jane's Bakery",
    email: "store@example.com",
    phone: "+1234567891",
    role: "store",
    avatar: "/assets/avatars/store.jpg"
  },
  {
    id: "u3",
    name: "Mike Rider",
    email: "driver@example.com",
    phone: "+1234567892",
    role: "driver",
    avatar: "/assets/avatars/driver.jpg"
  },
  {
    id: "u4",
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1234567893",
    role: "admin",
    avatar: "/assets/avatars/admin.jpg"
  }
];

// Delivery Packs
export const deliveryPacks: DeliveryPack[] = [
  {
    id: "pack1",
    name: "Pack Starter",
    deliveriesCount: 50,
    price: 25000, // 25,000 CDF
    driverCommissionRate: 0.12, // 12% du total
    validity: 30,
    description: "Idéal pour débuter - 50 livraisons sur 30 jours"
  },
  {
    id: "pack2",
    name: "Pack Business",
    deliveriesCount: 150,
    price: 65000, // 65,000 CDF
    driverCommissionRate: 0.15, // 15% du total
    validity: 60,
    description: "Pour les commerces actifs - 150 livraisons sur 60 jours"
  },
  {
    id: "pack3",
    name: "Pack Premium",
    deliveriesCount: 300,
    price: 120000, // 120,000 CDF
    driverCommissionRate: 0.18, // 18% du total
    validity: 90,
    description: "Pour les gros volumes - 300 livraisons sur 90 jours"
  },
  {
    id: "pack4",
    name: "Pack Enterprise",
    deliveriesCount: 500,
    price: 180000, // 180,000 CDF
    driverCommissionRate: 0.20, // 20% du total
    validity: 120,
    description: "Pour les entreprises - 500 livraisons sur 120 jours"
  }
];

// Function to calculate delivery fee based on order total
export const calculateDeliveryFee = (orderTotal: number): number => {
  // Progressive fee structure:
  // 0-10,000 CDF: 1,500 CDF
  // 10,001-25,000 CDF: 2,000 CDF
  // 25,001-50,000 CDF: 2,500 CDF
  // 50,001+ CDF: 3,000 CDF
  if (orderTotal <= 10000) return 1500;
  if (orderTotal <= 25000) return 2000;
  if (orderTotal <= 50000) return 2500;
  return 3000;
};

// Function to calculate driver commission
export const calculateDriverCommission = (orderTotal: number, commissionRate: number): number => {
  return Math.round(orderTotal * commissionRate);
};

// Mock Stores
export const stores: Store[] = [
  {
    id: "s1",
    name: "Jane's Bakery",
    address: "123 Main St, City",
    phone: "+1234567891",
    email: "janes@example.com",
    description: "Fresh baked goods daily",
    image: "/assets/stores/bakery.jpg",
    logoUrl: "/assets/stores/bakery-logo.jpg",
    rating: 4.8,
    latitude: 40.7128,
    longitude: -74.006,
    categories: ["Bakery", "Dessert"],
    currentPack: deliveryPacks[1], // Pack Business
    remainingDeliveries: 89,
    totalDeliveries: 150
  },
  {
    id: "s2",
    name: "City Grocers",
    address: "456 Elm St, City",
    phone: "+1234567894",
    email: "grocers@example.com",
    description: "Fresh produce and pantry essentials",
    image: "/assets/stores/grocery.jpg",
    logoUrl: "/assets/stores/grocery-logo.jpg",
    rating: 4.5,
    latitude: 40.7138,
    longitude: -74.016,
    categories: ["Grocery", "Organic"],
    remainingDeliveries: 0,
    totalDeliveries: 0
  },
  {
    id: "s3",
    name: "Farm Fresh",
    address: "789 Oak St, City",
    phone: "+1234567895",
    email: "farm@example.com",
    description: "Farm to table produce",
    image: "/assets/stores/farm.jpg",
    logoUrl: "/assets/stores/farm-logo.jpg",
    rating: 4.7,
    latitude: 40.7118,
    longitude: -74.026,
    categories: ["Produce", "Organic"],
    currentPack: deliveryPacks[0], // Pack Starter
    remainingDeliveries: 23,
    totalDeliveries: 50
  },
  {
    id: "s4",
    name: "Artisanal Coffee",
    address: "101 Pine St, City",
    phone: "+1234567896",
    email: "coffee@example.com",
    description: "Specialty coffee and pastries",
    image: "/assets/stores/coffee.jpg",
    logoUrl: "/assets/stores/coffee-logo.jpg",
    rating: 4.9,
    latitude: 40.7148,
    longitude: -74.036,
    categories: ["Coffee", "Bakery"],
    currentPack: deliveryPacks[2], // Pack Premium
    remainingDeliveries: 267,
    totalDeliveries: 300
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: "p1",
    storeId: "s1",
    name: "Sourdough Bread",
    description: "Freshly baked sourdough bread",
    price: 5.99,
    image: "/assets/products/bread.jpg",
    available: true
  },
  {
    id: "p2",
    storeId: "s1",
    name: "Chocolate Croissant",
    description: "Buttery croissant with chocolate filling",
    price: 3.99,
    image: "/assets/products/croissant.jpg",
    available: true
  },
  {
    id: "p3",
    storeId: "s2",
    name: "Organic Apples",
    description: "Locally sourced organic apples",
    price: 4.99,
    image: "/assets/products/apples.jpg",
    available: true
  },
  {
    id: "p4",
    storeId: "s2",
    name: "Whole Milk",
    description: "Farm fresh whole milk",
    price: 3.49,
    image: "/assets/products/milk.jpg",
    available: true
  },
  {
    id: "p5",
    storeId: "s3",
    name: "Fresh Eggs",
    description: "Free-range farm eggs",
    price: 5.49,
    image: "/assets/products/eggs.jpg",
    available: true
  },
  {
    id: "p6",
    storeId: "s4",
    name: "Coffee Beans",
    description: "Freshly roasted coffee beans",
    price: 12.99,
    image: "/assets/products/coffee-beans.jpg",
    available: true
  }
];

// Mock Orders with updated fee structure
export const orders: Order[] = [
  {
    id: "o1",
    customerId: "u1",
    storeId: "s1",
    driverId: "u3",
    items: [
      {
        id: "oi1",
        productId: "p1",
        name: "Sourdough Bread",
        quantity: 2,
        price: 5.99,
        subtotal: 11.98
      },
      {
        id: "oi2",
        productId: "p2",
        name: "Chocolate Croissant",
        quantity: 3,
        price: 3.99,
        subtotal: 11.97
      }
    ],
    status: "in_delivery",
    createdAt: "2025-05-05T10:30:00Z",
    updatedAt: "2025-05-05T11:15:00Z",
    deliveryAddress: "789 Pine St, City",
    deliveryLatitude: 40.7158,
    deliveryLongitude: -74.046,
    isPickup: false,
    paymentMethod: "airtel",
    paymentStatus: "paid",
    total: 23.95,
    deliveryFee: calculateDeliveryFee(23.95),
    driverCommission: calculateDriverCommission(23.95, 0.15),
    customerValidated: false,
    driverValidated: false
  },
  {
    id: "o2",
    customerId: "u1",
    storeId: "s2",
    items: [
      {
        id: "oi3",
        productId: "p3",
        name: "Organic Apples",
        quantity: 1,
        price: 4.99,
        subtotal: 4.99
      },
      {
        id: "oi4",
        productId: "p4",
        name: "Whole Milk",
        quantity: 2,
        price: 3.49,
        subtotal: 6.98
      }
    ],
    status: "confirmed",
    createdAt: "2025-05-05T09:00:00Z",
    updatedAt: "2025-05-05T09:15:00Z",
    deliveryAddress: "789 Pine St, City",
    deliveryLatitude: 40.7158,
    deliveryLongitude: -74.046,
    isPickup: false,
    paymentMethod: "cash",
    paymentStatus: "pending",
    total: 11.97,
    deliveryFee: calculateDeliveryFee(11.97),
    driverCommission: calculateDriverCommission(11.97, 0.12),
    customerValidated: false,
    driverValidated: false
  },
  {
    id: "o3",
    customerId: "u1",
    storeId: "s3",
    pickupPointId: "pp1",
    items: [
      {
        id: "oi5",
        productId: "p5",
        name: "Fresh Eggs",
        quantity: 2,
        price: 5.49,
        subtotal: 10.98
      }
    ],
    status: "ready_for_pickup",
    createdAt: "2025-05-04T15:30:00Z",
    updatedAt: "2025-05-04T16:00:00Z",
    deliveryAddress: "",
    deliveryLatitude: 0,
    deliveryLongitude: 0,
    isPickup: true,
    paymentMethod: "online",
    paymentStatus: "paid",
    total: 10.98,
    deliveryFee: 0, // No delivery fee for pickup
    driverCommission: 0,
    customerValidated: false,
    driverValidated: false
  }
];

// Mock Pickup Points
export const pickupPoints: PickupPoint[] = [
  {
    id: "pp1",
    name: "Central Pickup",
    address: "100 Central Ave, City",
    latitude: 40.7168,
    longitude: -74.056,
    contactPerson: "Sam Handler",
    phone: "+1234567897",
    email: "central@example.com",
    isActive: true
  },
  {
    id: "pp2",
    name: "East Side Pickup",
    address: "200 East Blvd, City",
    latitude: 40.7178,
    longitude: -74.066,
    contactPerson: "Alex Manager",
    phone: "+1234567898",
    email: "east@example.com",
    isActive: true
  }
];


import { Store, Product, Order, User, PickupPoint } from '../types';

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
    rating: 4.8,
    latitude: 40.7128,
    longitude: -74.006,
    categories: ["Bakery", "Dessert"]
  },
  {
    id: "s2",
    name: "City Grocers",
    address: "456 Elm St, City",
    phone: "+1234567894",
    email: "grocers@example.com",
    description: "Fresh produce and pantry essentials",
    image: "/assets/stores/grocery.jpg",
    rating: 4.5,
    latitude: 40.7138,
    longitude: -74.016,
    categories: ["Grocery", "Organic"]
  },
  {
    id: "s3",
    name: "Farm Fresh",
    address: "789 Oak St, City",
    phone: "+1234567895",
    email: "farm@example.com",
    description: "Farm to table produce",
    image: "/assets/stores/farm.jpg",
    rating: 4.7,
    latitude: 40.7118,
    longitude: -74.026,
    categories: ["Produce", "Organic"]
  },
  {
    id: "s4",
    name: "Artisanal Coffee",
    address: "101 Pine St, City",
    phone: "+1234567896",
    email: "coffee@example.com",
    description: "Specialty coffee and pastries",
    image: "/assets/stores/coffee.jpg",
    rating: 4.9,
    latitude: 40.7148,
    longitude: -74.036,
    categories: ["Coffee", "Bakery"]
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

// Mock Orders
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

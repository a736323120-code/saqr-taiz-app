export type UserRole = 'customer' | 'captain' | 'provider' | 'guest' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  district?: string;
}

export type CategoryId = 
  | 'all'
  | 'restaurants'
  | 'cafes'
  | 'supermarket'
  | 'vegetables'
  | 'pharmacies'
  | 'ecommerce'
  | 'engineers'
  | 'realestate'
  | 'services';

export interface DirectoryCategory {
  id: CategoryId;
  nameAr: string;
  icon: string;
  description: string;
}

export interface StoreListing {
  id: string;
  title: string;
  category: CategoryId;
  district: string;
  addressDetails: string;
  image: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  isFeatured?: boolean;
  isOpen: boolean;
  deliveryTimeEstimate?: string;
  customFields?: {
    serviceType?: string;
    priceRange?: string;
    experienceYears?: string;
    availableServices?: string[];
  };
}

export interface ProductItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  category: string;
  price: number; // in YER (Riyals)
  image: string;
  description: string;
  available: boolean;
}

export interface CustomErrandRequest {
  pickupLocation: string;
  pickupDistrict: string;
  dropoffLocation: string;
  dropoffDistrict: string;
  itemDetails: string;
  estimatedCost?: number;
  notes?: string;
  isUrgent: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered';
export type PaymentMethod = 'cod' | 'kuraimi_bank';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  district: string;
  addressDetails: string;
  items: CartItem[];
  customErrand?: CustomErrandRequest;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReceiptRef?: string;
  createdAt: string;
  captainId?: string;
  captainName?: string;
  captainPhone?: string;
  captainCoords?: { lat: number; lng: number };
}

export interface CouponCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder?: number;
  description: string;
}

export interface ServiceSubscriptionRequest {
  id: string;
  providerName: string;
  providerPhone: string;
  providerEmail?: string;
  serviceCategory: CategoryId;
  title: string;
  district: string;
  addressDetails: string;
  description: string;
  priceRange: string;
  whatsapp: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

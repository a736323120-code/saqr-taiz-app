import { supabase } from './supabaseClient';
import { StoreListing, ProductItem, Order, OrderStatus, UserRole } from './types';

// ============================================================================
// SUPABASE DATABASE SERVICE LAYER FOR SAGER PLATFORM (صقر تعز)
// ============================================================================

/**
 * Fetch or sync user profile from public.profiles
 */
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Could not fetch user profile from Supabase:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error in fetchUserProfile:', err);
    return null;
  }
}

/**
 * Update User Profile in public.profiles
 */
export async function updateUserProfile(userId: string, updates: { name?: string; phone?: string; district?: string; role?: UserRole; avatar?: string }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating user profile:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    return null;
  }
}

/**
 * Fetch stores / service providers directory from public.stores (or public.providers)
 */
export async function fetchStoresFromSupabase(): Promise<StoreListing[]> {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback query to 'stores' view if providers table is not populated yet
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!storesData || storesData.length === 0) return [];
      return storesData.map(mapSupabaseStoreToStoreListing);
    }

    return data.map(mapSupabaseStoreToStoreListing);
  } catch (err) {
    console.error('Error fetching stores from Supabase:', err);
    return [];
  }
}

/**
 * Add a new Store / Service Provider listing to public.providers
 */
export async function addProviderListingToSupabase(listing: Partial<StoreListing>, userId?: string) {
  try {
    const payload = {
      user_id: userId || null,
      title: listing.title,
      category: listing.category,
      district: listing.district,
      address_details: listing.addressDetails,
      image: listing.image,
      rating: listing.rating || 5.0,
      review_count: listing.reviewCount || 1,
      phone: listing.phone,
      whatsapp: listing.whatsapp,
      is_featured: listing.isFeatured || true,
      is_open: listing.isOpen ?? true,
      delivery_time_estimate: listing.deliveryTimeEstimate || '20-35 دقيقة',
      service_type: listing.customFields?.serviceType,
      price_range: listing.customFields?.priceRange,
      experience_years: listing.customFields?.experienceYears,
      available_services: listing.customFields?.availableServices || [],
      status: 'approved',
    };

    const { data, error } = await supabase
      .from('providers')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.warn('Fallback inserting store into stores table:', error.message);
      const { data: storeFallback } = await supabase.from('stores').insert(payload).select('*').single();
      return storeFallback;
    }
    return data;
  } catch (err) {
    console.error('Error in addProviderListingToSupabase:', err);
    return null;
  }
}

/**
 * Fetch products from public.products
 */
export async function fetchProductsFromSupabase(): Promise<ProductItem[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((p) => ({
      id: p.id,
      storeId: p.provider_id || p.store_id,
      storeName: p.store_name,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      image: p.image,
      description: p.description,
      available: p.available ?? true,
    }));
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return [];
  }
}

/**
 * Add a Product to public.products
 */
export async function addProductToSupabase(product: Partial<ProductItem>): Promise<ProductItem | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        provider_id: product.storeId || null,
        store_name: product.storeName || 'صقر تعز',
        name: product.name,
        category: product.category || 'عام',
        price: product.price,
        image: product.image,
        description: product.description,
        available: product.available ?? true,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding product to Supabase:', error.message);
      return null;
    }

    return {
      id: data.id,
      storeId: data.provider_id || data.store_id,
      storeName: data.store_name,
      name: data.name,
      category: data.category,
      price: Number(data.price),
      image: data.image,
      description: data.description,
      available: data.available ?? true,
    };
  } catch (err) {
    console.error('Error in addProductToSupabase:', err);
    return null;
  }
}

/**
 * Create a new Order in public.orders (and record Al-Kuraimi payment reference if selected)
 */
export async function createOrderInSupabase(orderData: any, userId?: string): Promise<Order | null> {
  try {
    const orderNumber = `SQR-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: userId || null,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        district: orderData.district,
        address_details: orderData.addressDetails,
        items: orderData.items || [],
        custom_errand: orderData.customErrand || null,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        discount: orderData.discount || 0,
        total: orderData.total,
        payment_method: orderData.paymentMethod || 'cod',
        payment_receipt_ref: orderData.paymentReceiptRef || null,
        status: 'received',
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error.message);
      return null;
    }

    // Record in public.payment_records table if Al-Kuraimi bank transfer was used
    if (orderData.paymentMethod === 'kuraimi_bank' && orderData.paymentReceiptRef) {
      await recordKuraimiPaymentReference(data.id, orderData.total, orderData.paymentReceiptRef, userId);
    }

    return mapSupabaseOrderToOrder(data);
  } catch (err) {
    console.error('Error in createOrderInSupabase:', err);
    return null;
  }
}

/**
 * Record Al-Kuraimi Payment Transfer Reference (#2180919) securely in public.payment_records
 */
export async function recordKuraimiPaymentReference(orderId: string, amount: number, refNumber: string, customerId?: string) {
  try {
    const payload = {
      order_id: orderId,
      customer_id: customerId || null,
      amount: amount,
      kuraimi_account_number: '2180919', // Default Saqr Taiz Kuraimi Account
      kuraimi_ref_number: refNumber,
      status: 'pending',
    };

    const { data, error } = await supabase.from('payment_records').insert(payload).select('*').single();

    if (error) {
      // Fallback to payments view
      await supabase.from('payments').insert(payload);
    }
    return data;
  } catch (err) {
    console.error('Error recording Al-Kuraimi payment reference:', err);
    return null;
  }
}

/**
 * Fetch Orders from public.orders
 */
export async function fetchOrdersFromSupabase(userId?: string, role?: UserRole): Promise<Order[]> {
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (role === 'customer' && userId) {
      query = query.eq('customer_id', userId);
    } else if (role === 'captain' && userId) {
      // Captains see orders assigned to them or unassigned pending orders
      query = query.or(`captain_id.eq.${userId},status.in.(received,preparing)`);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data.map(mapSupabaseOrderToOrder);
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err);
    return [];
  }
}

/**
 * Update Order status in public.orders (e.g. Captain accepting or delivering order)
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus,
  captainInfo?: { id?: string; name?: string; phone?: string; coords?: { lat: number; lng: number } }
): Promise<boolean> {
  try {
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (captainInfo) {
      if (captainInfo.id) updatePayload.captain_id = captainInfo.id;
      if (captainInfo.name) updatePayload.captain_name = captainInfo.name;
      if (captainInfo.phone) updatePayload.captain_phone = captainInfo.phone;
      if (captainInfo.coords) updatePayload.captain_coords = captainInfo.coords;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in updateOrderStatusInSupabase:', err);
    return false;
  }
}

/**
 * Real-time Order Updates Subscription using Supabase WebSockets
 */
export function subscribeToOrdersInSupabase(onOrderUpdated: (updatedOrder: Order) => void) {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      (payload) => {
        if (payload.new) {
          const mapped = mapSupabaseOrderToOrder(payload.new);
          onOrderUpdated(mapped);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Fetch Dashboard statistics personalized by Role (Customer, Captain, Service Provider, Admin)
 */
export async function fetchRoleDashboardData(userId: string, role: UserRole) {
  try {
    if (role === 'captain') {
      const { data: myOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('captain_id', userId);

      const completed = (myOrders || []).filter((o) => o.status === 'delivered');
      const active = (myOrders || []).filter((o) => o.status === 'on_the_way' || o.status === 'preparing');
      const totalEarnings = completed.reduce((sum, o) => sum + Number(o.delivery_fee || 1500), 0);

      return {
        completedDeliveries: completed.length,
        activeDeliveries: active.length,
        totalEarningsYER: totalEarnings,
        orders: (myOrders || []).map(mapSupabaseOrderToOrder),
      };
    }

    if (role === 'provider') {
      const { data: myStores } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', userId);

      return {
        listingsCount: myStores?.length || 0,
        stores: myStores || [],
      };
    }

    if (role === 'admin') {
      const [{ count: totalUsers }, { count: totalOrders }, { count: totalStores }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('providers').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalStores: totalStores || 0,
      };
    }

    // Default Customer Role
    const { data: customerOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    return {
      activeOrdersCount: (customerOrders || []).filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length,
      totalOrdersCount: customerOrders?.length || 0,
      orders: (customerOrders || []).map(mapSupabaseOrderToOrder),
    };
  } catch (err) {
    console.error('Error fetching role dashboard data:', err);
    return null;
  }
}

// Helper mapper functions
function mapSupabaseStoreToStoreListing(item: any): StoreListing {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    district: item.district,
    addressDetails: item.address_details,
    image: item.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: item.rating ? Number(item.rating) : 5.0,
    reviewCount: item.review_count || 1,
    phone: item.phone,
    whatsapp: item.whatsapp || item.phone,
    isFeatured: item.is_featured,
    isOpen: item.is_open,
    deliveryTimeEstimate: item.delivery_time_estimate,
    customFields: {
      serviceType: item.service_type,
      priceRange: item.price_range,
      experienceYears: item.experience_years,
      availableServices: Array.isArray(item.available_services) ? item.available_services : [],
    },
  };
}

function mapSupabaseOrderToOrder(item: any): Order {
  return {
    id: item.id,
    orderNumber: item.order_number,
    customerId: item.customer_id || '',
    customerName: item.customer_name,
    customerPhone: item.customer_phone,
    district: item.district,
    addressDetails: item.address_details,
    items: Array.isArray(item.items) ? item.items : [],
    customErrand: item.custom_errand || undefined,
    subtotal: Number(item.subtotal),
    deliveryFee: Number(item.delivery_fee),
    discount: Number(item.discount || 0),
    total: Number(item.total),
    status: item.status,
    paymentMethod: item.payment_method,
    paymentReceiptRef: item.payment_receipt_ref || undefined,
    createdAt: item.created_at,
    captainId: item.captain_id || undefined,
    captainName: item.captain_name || undefined,
    captainPhone: item.captain_phone || undefined,
    captainCoords: item.captain_coords || undefined,
  };
}


-- ============================================================================
-- SAGER PLATFORM (صقر تعز) - COMPLETE SUPABASE SQL SCHEMA
-- Tables: profiles, providers, products, orders, payment_records
-- Includes: ENUM types, Foreign Keys, Triggers, and Strict RLS Policies
-- ============================================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'captain', 'provider', 'admin');
  END IF;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar TEXT,
  district TEXT DEFAULT 'شارع جمال',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROVIDERS TABLE (Stores, Service Providers, Directories)
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  address_details TEXT NOT NULL,
  image TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 1,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_open BOOLEAN DEFAULT true,
  delivery_time_estimate TEXT DEFAULT '20-35 دقيقة',
  service_type TEXT,
  price_range TEXT,
  experience_years TEXT,
  available_services JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALIAS VIEW FOR BACKWARD COMPATIBILITY WITH STORES
CREATE OR REPLACE VIEW public.stores AS SELECT * FROM public.providers;

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL, -- Price in YER (Yemeni Rial)
  image TEXT,
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  district TEXT NOT NULL,
  address_details TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  custom_errand JSONB,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'kuraimi_bank')),
  payment_receipt_ref TEXT, -- Al-Kuraimi Bank Transfer Ref (#2180919)
  captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  captain_name TEXT,
  captain_phone TEXT,
  captain_coords JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENT RECORDS TABLE (Al-Kuraimi Bank Transfer #2180919)
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  kuraimi_account_number TEXT DEFAULT '2180919',
  kuraimi_ref_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALIAS VIEW FOR BACKWARD COMPATIBILITY WITH PAYMENTS
CREATE OR REPLACE VIEW public.payments AS SELECT * FROM public.payment_records;

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. PROVIDERS POLICIES
CREATE POLICY "Providers readable by everyone"
  ON public.providers FOR SELECT
  USING (true);

CREATE POLICY "Providers insertable by authenticated users"
  ON public.providers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "Providers editable by owner or admin"
  ON public.providers FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. PRODUCTS POLICIES
CREATE POLICY "Products readable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Products editable by providers or admins"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.providers WHERE id = provider_id AND user_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('provider', 'admin')
    )
  );

-- 4. ORDERS POLICIES
CREATE POLICY "Orders read policy (Customers, Captains, Admins)"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = customer_id 
    OR auth.uid() = captain_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('captain', 'admin')
    )
    OR customer_id IS NULL -- Allows guest checkout lookups
  );

CREATE POLICY "Orders insert policy (Anyone authenticated or guest)"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders update policy (Customer cancel, Captain status update, Admin)"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() = customer_id 
    OR auth.uid() = captain_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('captain', 'admin')
    )
  );

-- 5. PAYMENT RECORDS POLICIES
CREATE POLICY "Payment records viewable by customer, captain, or admin"
  ON public.payment_records FOR SELECT
  USING (
    auth.uid() = customer_id
    OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('captain', 'admin')
    )
  );

CREATE POLICY "Payment records insert policy"
  ON public.payment_records FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

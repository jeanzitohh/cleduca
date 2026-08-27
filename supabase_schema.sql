-- ========================================================
-- SCHEMA SQL PARA CLEDUCA EN SUPABASE
-- Ejecutar este archivo completo en el SQL Editor de Supabase
-- ========================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLA: profiles (Padres/Cuentas Principales)
-- ==========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'gratuito', -- 'gratuito', 'basico', 'familiar'
  premium_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Políticas: El usuario solo puede ver y editar su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- TABLA: child_profiles (Perfiles de niños)
-- ==========================================
CREATE TABLE public.child_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL DEFAULT 3,
  theme TEXT DEFAULT 'purple',
  skin TEXT DEFAULT 'verde',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  games_played JSONB DEFAULT '{}'::jsonb,
  subject_xp JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver perfiles de sus hijos" ON public.child_profiles FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Usuarios pueden insertar perfiles de sus hijos" ON public.child_profiles FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Usuarios pueden actualizar perfiles de sus hijos" ON public.child_profiles FOR UPDATE USING (auth.uid() = parent_id);

-- ==========================================
-- TABLA: game_telemetry (Análisis de partidas y tiempos)
-- ==========================================
CREATE TABLE public.game_telemetry (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,       -- ej. 'quiz', 'sopa', 'carrera'
  subject TEXT NOT NULL,         -- ej. 'matematicas', 'logica'
  grade INTEGER,
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.game_telemetry ENABLE ROW LEVEL SECURITY;
-- Política: Solo inserciones. Select reservado para admins y dueños.
CREATE POLICY "Usuarios pueden registrar telemetría de sus hijos" ON public.game_telemetry FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);
CREATE POLICY "Padres pueden ver telemetría de sus hijos" ON public.game_telemetry FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.child_profiles WHERE id = child_id AND parent_id = auth.uid())
);

-- ==========================================
-- TABLA: wompi_payments (Registro de transacciones)
-- ==========================================
CREATE TABLE public.wompi_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,
  transaction_id TEXT,
  amount NUMERIC NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.wompi_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios ven sus propios pagos" ON public.wompi_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden registrar intentos de pago" ON public.wompi_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- TABLA: institutional_leads (Leads para B2B colegios)
-- ==========================================
CREATE TABLE public.institutional_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  student_count TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.institutional_leads ENABLE ROW LEVEL SECURITY;
-- Cualquiera puede insertar un lead, solo admin puede leer
CREATE POLICY "Cualquiera puede enviar leads" ON public.institutional_leads FOR INSERT WITH CHECK (true);


-- ==========================================
-- VISTAS & TRIGGERS (Auto-crear perfil al registrar)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- RLS PARA ADMINISTRADORES (POLÍTICAS GLOBALES)
-- ==========================================
-- Nota: Para este MVP, un administrador es un usuario de Supabase Auth
-- cuyo email pertenece a @cleduca.com
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email' LIKE '%@cleduca.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de SELECT globales a los administradores
CREATE POLICY "Admins pueden ver todo (profiles)" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins pueden ver todo (children)" ON public.child_profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins pueden ver todo (telemetry)" ON public.game_telemetry FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins pueden ver todo (payments)" ON public.wompi_payments FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins pueden ver todo (leads)" ON public.institutional_leads FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins pueden actualizar (leads)" ON public.institutional_leads FOR UPDATE USING (public.is_admin());

-- Fin del archivo SQL


-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  pin TEXT UNIQUE NOT NULL,
  course TEXT NOT NULL,
  branch TEXT NOT NULL,
  mobile TEXT NOT NULL,
  photo_color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Admin',
  mobile TEXT NOT NULL,
  photo_color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fees table
CREATE TABLE public.fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_fees table for tracking individual student fee records
CREATE TABLE public.student_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  fee_name TEXT NOT NULL,
  year TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  due_amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT DEFAULT 'payment',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee_deadlines table
CREATE TABLE public.fee_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES public.admins(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default fees
INSERT INTO public.fees (name, amount) VALUES
('Tuition Fee', 50000),
('Lab Fee', 10000),
('Library Fee', 5000),
('Sports Fee', 3000);

-- Insert default admin
INSERT INTO public.admins (admin_id, password, name, mobile) VALUES
('A1', 'admin1', 'Admin User', '9876543210');

-- Insert sample students
INSERT INTO public.students (student_id, password, name, pin, course, branch, mobile) VALUES
('S123', 'pass123', 'John Doe', '2024001', 'B.Tech', 'Computer Science', '9876543211'),
('S124', 'pass124', 'Jane Smith', '2024002', 'B.Tech', 'Electronics', '9876543212');

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_deadlines ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're handling auth in the app layer)
CREATE POLICY "Allow all access to students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all access to admins" ON public.admins FOR ALL USING (true);
CREATE POLICY "Allow all access to fees" ON public.fees FOR ALL USING (true);
CREATE POLICY "Allow all access to student_fees" ON public.student_fees FOR ALL USING (true);
CREATE POLICY "Allow all access to transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Allow all access to fee_deadlines" ON public.fee_deadlines FOR ALL USING (true);

-- Enable realtime for real-time synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_fees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fee_deadlines;

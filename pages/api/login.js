// pages/api/login.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone, password } = JSON.parse(req.body);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .eq('password', password)
      .single();

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', user: data });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

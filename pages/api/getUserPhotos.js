// pages/api/getUserPhotos.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { phone } = req.query;

    const { data, error } = await supabase
      .from('user-images')
      .select('*')
      .eq('phone', phone);

    if (error) {
      return res.status(500).json({ error: 'Error fetching photos' });
    }

    const photos = data.map((item) => ({
      type: item.type,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.key}`,
    }));

    return res.status(200).json({ photos });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

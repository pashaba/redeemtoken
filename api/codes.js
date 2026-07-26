import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('codes')
    .select('code, is_used, created_at, used_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[api/codes] error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}

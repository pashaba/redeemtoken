import crypto from 'crypto';
import { supabase } from '../lib/supabase.js';

function generateCode(length = 10) {
  return crypto.randomBytes(length).toString('hex').toUpperCase().slice(0, length);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = generateCode(10);

  const { error } = await supabase.from('codes').insert({ code });

  if (error) {
    console.error('[api/generate] error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ code });
}

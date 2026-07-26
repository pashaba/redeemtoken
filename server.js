import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateCode(length = 10) {
  return crypto.randomBytes(length).toString('hex').toUpperCase().slice(0, length);
}

// Generate kode baru & simpan ke Supabase
app.post('/api/generate', async (req, res) => {
  const code = generateCode(10);

  const { error } = await supabase.from('codes').insert({ code });

  if (error) {
    console.error('[web] generate error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ code });
});

// List kode terakhir (opsional, buat pantau)
app.get('/api/codes', async (req, res) => {
  const { data, error } = await supabase
    .from('codes')
    .select('code, is_used, created_at, used_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Web generator jalan di port ${PORT}`));

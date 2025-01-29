// pages/api/uploadImages.js
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Configuración de Multer para el manejo de archivos
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './tmp'); // Carpeta temporal para archivos
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    }
  })
}).single('file'); // Nombre del campo del archivo

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      const { phone, type } = req.body; // 'type' puede ser 'dni_front', 'dni_back', 'face'
      const filePath = path.join(__dirname, 'tmp', req.file.filename);

      const file = fs.createReadStream(filePath);
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(`${phone}/${type}-${req.file.filename}`, file);

      // Eliminar archivo temporal después de cargarlo
      fs.unlinkSync(filePath);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
      return res.status(200).json({ message: 'Image uploaded successfully', url });
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

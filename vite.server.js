import express from 'express';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createViteServer() {
  const app = express();
  
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
  });
  
  app.use(vite.middlewares);
  
  app.use('*', async (req, res) => {
    const url = req.originalUrl;
    
    try {
      // Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'client/index.html'),
        'utf-8'
      );
      
      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });
  
  return { app, vite };
}
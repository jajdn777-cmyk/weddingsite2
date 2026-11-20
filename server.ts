import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { INITIAL_BLESSINGS, validateRsvpInput } from './src/utils/rsvp.ts';
import type { RsvpRecord } from './src/utils/rsvp.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'rsvps.json');

function readStoredRsvps(): RsvpRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [...INITIAL_BLESSINGS];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...INITIAL_BLESSINGS];
  } catch {
    return [...INITIAL_BLESSINGS];
  }
}

function writeStoredRsvps(records: RsvpRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch {
    // Fallback gracefully if filesystem is read-only
  }
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  let rsvps: RsvpRecord[] = readStoredRsvps();

  app.use(express.json({ limit: '64kb' }));

  app.get('/api/rsvps', (_req, res) => {
    res.json({ rsvps });
  });

  app.post('/api/rsvps', (req, res) => {
    const body = req.body ?? {};
    const validation = validateRsvpInput({
      fullName: typeof body.fullName === 'string' ? body.fullName : '',
      contact: typeof body.contact === 'string' ? body.contact : '',
      attendance: body.attendance === 'declining' ? 'declining' : 'attending',
      guests: Number(body.guests ?? 1),
      message: typeof body.message === 'string' ? body.message : '',
    });

    if (!validation.valid) {
      res.status(400).json({ errors: validation.errors });
      return;
    }

    const record: RsvpRecord = {
      ...validation.normalized,
      id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    rsvps = [record, ...rsvps].slice(0, 100);
    writeStoredRsvps(rsvps);

    res.status(201).json({ record, rsvps });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();

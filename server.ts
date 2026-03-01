import express from 'express';
import { createServer as createViteServer } from 'vite';
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

const { Pool } = pg;

// Load .env.example if .env doesn't exist
if (fs.existsSync('.env')) {
  dotenv.config();
} else if (fs.existsSync('.env.example')) {
  dotenv.config({ path: '.env.example' });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        main_address TEXT,
        contact_name VARCHAR(255),
        phone VARCHAR(255),
        email VARCHAR(255),
        comment TEXT,
        created_at BIGINT
      );
      CREATE TABLE IF NOT EXISTS catalog (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        pmax_w NUMERIC,
        hourly_power_kwh NUMERIC,
        usage_duration_h NUMERIC,
        cost_usd NUMERIC,
        is_peak_power BOOLEAN,
        comment TEXT,
        is_active BOOLEAN
      );
      CREATE TABLE IF NOT EXISTS visits (
        id VARCHAR(255) PRIMARY KEY,
        client_id VARCHAR(255),
        agent_id VARCHAR(255),
        visit_address TEXT,
        visit_date BIGINT,
        report TEXT,
        comment TEXT,
        autonomy_days INTEGER,
        is_completed BOOLEAN,
        created_at BIGINT
      );
      CREATE TABLE IF NOT EXISTS visit_needs (
        id VARCHAR(255) PRIMARY KEY,
        visit_id VARCHAR(255),
        catalog_device_id VARCHAR(255),
        name VARCHAR(255),
        pmax_w NUMERIC,
        hourly_power_kwh NUMERIC,
        usage_duration_h NUMERIC,
        quantity INTEGER,
        include_in_peak BOOLEAN
      );
      CREATE TABLE IF NOT EXISTS photos (
        id VARCHAR(255) PRIMARY KEY,
        visit_id VARCHAR(255),
        data_uri TEXT,
        created_at BIGINT
      );
    `);
    console.log('Database initialized');
  } finally {
    client.release();
  }
}

async function startServer() {
  await initDB();

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.post('/api/sync', async (req, res) => {
    const { clients, catalog, visits, visitNeeds, photos } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const c of clients || []) {
        await client.query(`
          INSERT INTO clients (id, name, main_address, contact_name, phone, email, comment, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            main_address = EXCLUDED.main_address,
            contact_name = EXCLUDED.contact_name,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            comment = EXCLUDED.comment
        `, [c.id, c.name, c.main_address, c.contact_name, c.phone, c.email, c.comment, c.created_at]);
      }

      for (const c of catalog || []) {
        await client.query(`
          INSERT INTO catalog (id, name, pmax_w, hourly_power_kwh, usage_duration_h, cost_usd, is_peak_power, comment, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            pmax_w = EXCLUDED.pmax_w,
            hourly_power_kwh = EXCLUDED.hourly_power_kwh,
            usage_duration_h = EXCLUDED.usage_duration_h,
            cost_usd = EXCLUDED.cost_usd,
            is_peak_power = EXCLUDED.is_peak_power,
            comment = EXCLUDED.comment,
            is_active = EXCLUDED.is_active
        `, [c.id, c.name, c.pmax_w, c.hourly_power_kwh, c.usage_duration_h, c.cost_usd, c.is_peak_power, c.comment, c.is_active]);
      }

      for (const v of visits || []) {
        await client.query(`
          INSERT INTO visits (id, client_id, agent_id, visit_address, visit_date, report, comment, autonomy_days, is_completed, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            client_id = EXCLUDED.client_id,
            agent_id = EXCLUDED.agent_id,
            visit_address = EXCLUDED.visit_address,
            visit_date = EXCLUDED.visit_date,
            report = EXCLUDED.report,
            comment = EXCLUDED.comment,
            autonomy_days = EXCLUDED.autonomy_days,
            is_completed = EXCLUDED.is_completed
        `, [v.id, v.client_id, v.agent_id, v.visit_address, v.visit_date, v.report, v.comment, v.autonomy_days, v.is_completed, v.created_at]);
      }

      for (const n of visitNeeds || []) {
        await client.query(`
          INSERT INTO visit_needs (id, visit_id, catalog_device_id, name, pmax_w, hourly_power_kwh, usage_duration_h, quantity, include_in_peak)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            visit_id = EXCLUDED.visit_id,
            catalog_device_id = EXCLUDED.catalog_device_id,
            name = EXCLUDED.name,
            pmax_w = EXCLUDED.pmax_w,
            hourly_power_kwh = EXCLUDED.hourly_power_kwh,
            usage_duration_h = EXCLUDED.usage_duration_h,
            quantity = EXCLUDED.quantity,
            include_in_peak = EXCLUDED.include_in_peak
        `, [n.id, n.visit_id, n.catalog_device_id, n.name, n.pmax_w, n.hourly_power_kwh, n.usage_duration_h, n.quantity, n.include_in_peak]);
      }

      for (const p of photos || []) {
        await client.query(`
          INSERT INTO photos (id, visit_id, data_uri, created_at)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE SET
            data_uri = EXCLUDED.data_uri
        `, [p.id, p.visit_id, p.data_uri, p.created_at]);
      }

      await client.query('COMMIT');
      res.json({ success: true });
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Sync error:', e);
      res.status(500).json({ error: 'Sync failed' });
    } finally {
      client.release();
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

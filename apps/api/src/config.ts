import 'dotenv/config';
import {z} from 'zod';
export const env=z.object({
 DATABASE_URL:z.string().min(1),
 JWT_SECRET:z.string().min(32),
 CLIENT_ORIGIN:z.string().default('http://localhost:5173'),
 PORT:z.coerce.number().default(4000),
 NODE_ENV:z.enum(['development','test','production']).default('development'),
 SEED_ADMIN_EMAIL:z.string().email().default('admin@eduva.id'),
 SEED_ADMIN_PASSWORD:z.string().min(8).default('Admin123!'),
 MIDTRANS_SERVER_KEY:z.string().default(''),
 MIDTRANS_IS_PRODUCTION:z.string().default('false').transform(value=>value==='true')
}).transform(value=>({...value,CLIENT_ORIGINS:value.CLIENT_ORIGIN.split(',').map(origin=>origin.trim()).filter(Boolean)})).parse(process.env);

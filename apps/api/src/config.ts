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
 ,APP_URL:z.string().default('http://localhost:5173')
 ,ACCESS_TOKEN_TTL:z.string().default('15m')
 ,REFRESH_TOKEN_DAYS:z.coerce.number().default(30)
 ,SMTP_HOST:z.string().default('')
 ,SMTP_PORT:z.coerce.number().default(587)
 ,SMTP_USER:z.string().default('')
 ,SMTP_PASSWORD:z.string().default('')
 ,SMTP_FROM:z.string().default('Eduva <no-reply@eduva.id>')
 ,STORAGE_DRIVER:z.enum(['local','s3']).default('local')
 ,S3_REGION:z.string().default('ap-southeast-1')
 ,S3_BUCKET:z.string().default('')
 ,S3_ACCESS_KEY_ID:z.string().default('')
 ,S3_SECRET_ACCESS_KEY:z.string().default('')
 ,S3_ENDPOINT:z.string().default('')
 ,S3_PUBLIC_URL:z.string().default('')
}).transform(value=>({...value,CLIENT_ORIGINS:value.CLIENT_ORIGIN.split(',').map(origin=>origin.trim()).filter(Boolean)})).parse(process.env);

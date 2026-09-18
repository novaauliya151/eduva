import express from 'express';
import cors from 'cors';
import {env} from './config.js';
import {routes} from './routes.js';
import {errors} from './middleware.js';
import './types.js';
const app=express();app.use(cors({origin:(origin,callback)=>!origin||env.CLIENT_ORIGINS.includes(origin)?callback(null,true):callback(new Error('Origin tidak diizinkan'))}));app.use(express.json({limit:'55mb'}));app.use('/certificates',express.static('storage/certificates'));app.use('/uploads',express.static('storage'));app.get('/api/health',(_q,r)=>r.json({status:'ok'}));app.use('/api',routes);app.use(errors);app.listen(env.PORT,()=>console.log(`Eduva API: http://localhost:${env.PORT}`));

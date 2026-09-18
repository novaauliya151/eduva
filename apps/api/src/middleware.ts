import type {NextFunction,Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import type {Role} from '@prisma/client';
import {env} from './config.js';
export function auth(req:Request,res:Response,next:NextFunction){const token=req.headers.authorization?.replace(/^Bearer\s+/i,'');if(!token)return res.status(401).json({message:'Token diperlukan'});try{req.user=jwt.verify(token,env.JWT_SECRET) as {id:string;role:Role};next()}catch{return res.status(401).json({message:'Token tidak valid'})}}
export const allow=(...roles:Role[])=>(req:Request,res:Response,next:NextFunction)=>req.user&&roles.includes(req.user.role)?next():res.status(403).json({message:'Akses ditolak'});
export function errors(error:unknown,_req:Request,res:Response,_next:NextFunction){console.error(error);res.status(500).json({message:'Terjadi kesalahan pada server'})}
